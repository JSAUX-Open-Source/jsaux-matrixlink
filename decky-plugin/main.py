import asyncio
import fcntl
import json
import logging
import os
import random
import re
import shutil
import sys
import threading
import time
import base64
import subprocess
from pathlib import Path
from logging.handlers import RotatingFileHandler

import decky

PLUGIN_ROOT = Path(__file__).resolve().parent
if str(PLUGIN_ROOT) not in sys.path:
    sys.path.insert(0, str(PLUGIN_ROOT))

from backend.client import DaemonHttpClient
from backend.matrix_api import MatrixDisplayAPI, render_countdown_frame  # noqa: F401
from backend import usb_frames


CHRONOGRAPH_MAX_SECONDS = (99 * 3600) + (59 * 60) + 59
PLAYTIME_REFRESH_SECONDS = 2.0

CUSTOM_ASSET_EXTENSIONS = frozenset({".png", ".gif", ".svg", ".jpg", ".jpeg", ".bmp"})
CUSTOM_ASSET_DIRECTORY_LIMIT = 24
CUSTOM_ASSET_PREVIEW_LIMIT_BYTES = 512 * 1024
CUSTOM_ASSET_MAX_SOURCE_BYTES = 100 * 1024 * 1024

# AI Agent: local Codex session name + running state only.
# No OAuth, no auth.json reads, no ChatGPT/OpenAI usage APIs.
AI_AGENT_SESSION_ACTIVE_MINUTES = 5
AI_AGENT_SCREEN_REFRESH_MIN_SECONDS = 300.0
AI_AGENT_SCREEN_REFRESH_MAX_SECONDS = 720.0
AI_AGENT_UUID_RE = re.compile(
    r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
)



def _runtime_log_dir() -> Path:
    """Runtime log folder: JSAUX_LOG_DIR override, else the on-device install layout."""
    override = os.environ.get("JSAUX_LOG_DIR", "").strip()
    if override:
        return Path(override).expanduser()
    home = Path.home()
    # Decky loader runs the plugin as root (HOME=/root); the install folder
    # lives under the deck user's home.
    deck_home = Path("/home/deck")
    if home != deck_home and deck_home.is_dir():
        home = deck_home
    return home / ".local" / "lib" / "jsaux-matrixlink" / "logs"


def setup_plugin_file_logging() -> str | None:
    """Attach a size-capped rotating file handler to decky.logger.

    Returns the log file path, or None when the runtime log folder is not
    writable. Safe to call repeatedly: the handler is attached once.
    """
    try:
        log_path = _runtime_log_dir() / "plugin.log"
        log_path.parent.mkdir(parents=True, exist_ok=True)
        logger = getattr(decky, "logger", None)
        handlers = getattr(logger, "handlers", None)
        if handlers is not None and not any(
            getattr(handler, "_jsaux_runtime_log", False) for handler in handlers
        ):
            file_handler = RotatingFileHandler(
                log_path, maxBytes=2 * 1024 * 1024, backupCount=1, encoding="utf-8"
            )
            file_handler.setFormatter(
                logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")
            )
            file_handler._jsaux_runtime_log = True  # type: ignore[attr-defined]
            logger.addHandler(file_handler)
        return str(log_path)
    except Exception:
        return None



def _ai_agent_codex_home() -> Path:
    override = os.environ.get("JSAUX_AI_AGENT_CODEX_HOME", "").strip()
    if override:
        return Path(override).expanduser()
    home = Path.home() / ".codex"
    # Decky loader runs the plugin as root (HOME=/root); deck user's
    # Codex session files live under /home/deck.
    deck_home = Path("/home/deck/.codex")
    if home != deck_home and deck_home.is_dir():
        return deck_home
    return home









def _ai_agent_lock_held(path: Path) -> bool:
    try:
        fd = os.open(path, os.O_RDWR)
    except Exception:
        return False
    try:
        fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        fcntl.flock(fd, fcntl.LOCK_UN)
        return False
    except BlockingIOError:
        return True
    except Exception:
        return False
    finally:
        os.close(fd)

def _ai_agent_cli_alive() -> bool:
    try:
        out = subprocess.run(
            ["ps", "-axo", "command="], capture_output=True, text=True, timeout=10
        ).stdout
    except Exception:
        return False
    for line in out.splitlines():
        cmd = line.strip()
        if not cmd or "codex" not in cmd.lower():
            continue
        if "/Applications/ChatGPT.app/" in cmd or "com.openai." in cmd:
            continue
        if os.path.basename(cmd.split()[0]) == "codex":
            return True
    return False

def _ai_agent_load_thread_names() -> dict:
    names: dict = {}
    try:
        with (_ai_agent_codex_home() / "session_index.jsonl").open(encoding="utf-8") as f:
            for line in f:
                try:
                    rec = json.loads(line)
                    names[rec.get("id")] = rec.get("thread_name") or ""
                except Exception:
                    continue
    except FileNotFoundError:
        pass
    except Exception as exc:
        decky.logger.info(f"AI Agent session_index read failed: {exc}")
    return names

def _ai_agent_scan_sessions() -> dict:
    now = time.time()
    cutoff = now - AI_AGENT_SESSION_ACTIVE_MINUTES * 60
    names = _ai_agent_load_thread_names()
    cli = _ai_agent_cli_alive()
    items: dict = {}

    def ensure(tid: str) -> dict:
        it = items.get(tid)
        if it is None:
            it = items[tid] = {
                "thread_id": tid, "name": names.get(tid) or "",
                "last_active_ts": 0.0, "sources": [], "live": False,
            }
        return it

    locks_dir = _ai_agent_codex_home() / "thread-writer-locks"
    try:
        for path in locks_dir.iterdir():
            stem = path.name.removesuffix(".lock")
            if not path.name.endswith(".lock") or not AI_AGENT_UUID_RE.fullmatch(stem):
                continue
            try:
                mtime = path.stat().st_mtime
            except OSError:
                continue
            it = ensure(stem)
            it["last_active_ts"] = max(it["last_active_ts"], mtime)
            if "线程锁" not in it["sources"]:
                it["sources"].append("线程锁")
            if _ai_agent_lock_held(path) or cli:
                it["live"] = True
    except FileNotFoundError:
        pass

    sessions_root = _ai_agent_codex_home() / "sessions"
    if sessions_root.exists():
        for path in sessions_root.rglob("*.jsonl"):
            try:
                mtime = path.stat().st_mtime
            except OSError:
                continue
            if mtime < cutoff:
                continue
            uuids = AI_AGENT_UUID_RE.findall(path.name)
            tid = uuids[0] if uuids else path.name
            it = ensure(tid)
            it["last_active_ts"] = max(it["last_active_ts"], mtime)
            if "会话文件" not in it["sources"]:
                it["sources"].append("会话文件")
            if cli and mtime >= now - 120:
                it["live"] = True

    running, recent = [], []
    for it in items.values():
        it["ago_seconds"] = int(now - it["last_active_ts"]) if it["last_active_ts"] else None
        it["name"] = it["name"] or "(未命名会话)"
        it["status"] = "running" if it["live"] else "recent"
        it["sources"] = sorted(it["sources"])
        (running if it["live"] else recent).append(it)
    running.sort(key=lambda x: -(x["last_active_ts"] or 0))
    recent.sort(key=lambda x: -(x["last_active_ts"] or 0))
    return {
        "running": cli or bool(running),
        "running_count": len(running),
        "recent_count": len(recent),
        "items": running + recent,
        "session_name": (
            running[0]["name"] if running else (recent[0]["name"] if recent else "")
        ),
    }




def _ai_agent_screen_payload(force: bool = False) -> dict:
    """Matrix screen: session name + running only (quota/token path removed)."""
    del force
    sessions = _ai_agent_scan_sessions()
    return {
        "sessionName": sessions.get("session_name") or "",
        "running": bool(sessions.get("running")),
        "conversations": min(int(sessions.get("running_count") or 0), 999),
        "primaryPercent": -1,
        "secondaryPercent": -1,
        "tokensPrimary": "--",
        "tokensSecondary": "--",
    }



def _ai_agent_status(force: bool = False) -> dict:
    """Local Codex session name + running state (no OAuth / private APIs)."""
    del force
    sessions = _ai_agent_scan_sessions()
    return {
        "authenticated": False,
        "running": bool(sessions.get("running")),
        "session_name": sessions.get("session_name") or "",
        "sessions": sessions,
        "active_minutes": AI_AGENT_SESSION_ACTIVE_MINUTES,
        "generated_at": int(time.time()),
    }



class Plugin:
    def __init__(self) -> None:
        daemon_url = os.environ.get("JSAUX_DAEMON_URL", "http://127.0.0.1:39052")
        self.client = DaemonHttpClient(daemon_url)
        self.refresh_client = DaemonHttpClient("http://127.0.0.1:39054")
        self.matrix = MatrixDisplayAPI()
        self._serial_lock = threading.Lock()
        self._dashboard_generation = 0
        self._clock_generation = 0
        self._playtime_generation = 0
        self._playtime_current_app_id = ""
        self._playtime_session_started_at = time.time() - (3 * 3600 + 56 * 60)
        self._playtime_context_lock = threading.Lock()
        self._playtime_session_key: tuple[str, int] | None = None
        self._playtime_baseline_minutes = 0
        self._countdown_generation = 0
        self._countdown_total_seconds = 30 * 60
        self._countdown_started_at = time.time() - (10 * 60 + 1)
        self._chronograph_generation = 0
        self._chronograph_total_seconds = CHRONOGRAPH_MAX_SECONDS
        self._chronograph_started_at = time.time()
        self._chronograph_loop_active = False
        self._chronograph_watchdog_generation = 0
        self._ai_agent_generation = 0

    async def get_status(self):
        status = await self.client.aget("/v1/device")
        # Secondary-dev contract: power / brightness / geometry mirror.
        if isinstance(status, dict):
            status["matrix"] = self.matrix.get_state(include_pixels=False)
        return status

    async def matrix_get_state(self, include_pixels: bool = False):
        """Frontend: ask backend how the LED matrix should be shown."""
        return self.matrix.get_state(include_pixels=bool(include_pixels))

    async def matrix_set_power(self, enabled: bool = True):
        """Outermost control: whole panel on/off (in-memory + USB frame builders)."""
        return self.matrix.set_power(bool(enabled))

    async def matrix_set_brightness(self, brightness: int = 80):
        """Global brightness 0–100 (in-memory + USB frame builders)."""
        return self.matrix.set_brightness(int(brightness))

    async def matrix_set_led(
        self, x: int = 0, y: int = 0, r: int = 0, g: int = 0, b: int = 0
    ):
        """Set one LED color (RGB 0–255)."""
        return self.matrix.set_led(int(x), int(y), int(r), int(g), int(b))

    async def matrix_set_leds(self, pixels=None):
        """Set many LEDs from a list of {x,y,r,g,b} (or LedPixel / sequences)."""
        return self.matrix.set_leds(pixels or [])

    async def matrix_fill(self, r: int = 0, g: int = 0, b: int = 0):
        return self.matrix.fill(int(r), int(g), int(b))

    async def matrix_clear(self):
        return self.matrix.clear()

    async def matrix_push(self):
        """Return USB DY frames for power → brightness → GIF payload."""
        return self.matrix.push_payload()

    async def get_profiles(self):
        return await self.client.aget("/v1/profiles")

    async def get_modules(self):
        return await self.client.aget("/v1/modules")

    async def get_display_settings(self):
        result = await self.client.aget("/v1/settings/display")
        try:
            refresh = await self.get_refresh_settings()
            settings = result.get("displaySettings", result)
            settings["doNotDisturb"] = refresh.get("doNotDisturb", False)
        except Exception:
            # A missing extension must not break existing display settings.
            result.get("displaySettings", result)["doNotDisturb"] = False
        return result

    async def get_refresh_settings(self):
        return await self.refresh_client.aget("/v1/settings/refresh")

    async def get_weather_cities(self, q: str = "", lang: str = "en", limit: int = 80):
        from urllib.parse import quote

        query = str(q or "").strip()
        language = str(lang or "en").strip() or "en"
        try:
            capped = max(1, min(int(limit), 512))
        except (TypeError, ValueError):
            capped = 80
        path = (
            f"/v1/weather/cities?q={quote(query)}&lang={quote(language)}&limit={capped}"
        )
        return await self.client.aget(path)

    async def get_custom_assets(self):
        return await self.client.aget("/v1/custom/assets")

    async def get_countdown(self):
        return await self.client.aget("/v1/timer/countdown")

    async def get_chronograph(self):
        return await self.client.aget("/v1/timer/chronograph")

    async def get_ai_agent_status(self, force: bool = False):
        """Local Codex session name + running state (no OAuth / private APIs)."""
        return await asyncio.to_thread(_ai_agent_status, bool(force))

    async def set_brightness(self, brightness: int):
        return await self.client.apost("/v1/device/brightness", {"brightness": brightness})

    async def set_power(self, enabled: bool):
        return await self.client.apost("/v1/device/power", {"enabled": enabled})

    async def send_test_pattern(self, pattern: str):
        return await self.client.apost("/v1/device/test-pattern", {"pattern": pattern})

    async def apply_profile(self, app_id: str):
        return await self.client.apost("/v1/display/profile/apply", {"appId": app_id})

    async def update_display_settings(self, payload: dict):
        refresh_enabled = payload.get("doNotDisturb") if "doNotDisturb" in payload else None
        if "doNotDisturb" in payload and type(refresh_enabled) is not bool:
            return {"ok": False, "error": "invalid_do_not_disturb"}
        payload = {key: value for key, value in payload.items() if key != "doNotDisturb"}
        if not payload and refresh_enabled is not None:
            return await self.refresh_client.apost("/v1/settings/refresh", {"doNotDisturb": refresh_enabled})
        result = await self.client.apost("/v1/settings/display", payload)
        if refresh_enabled is not None and result.get("ok", True):
            refresh = await self.refresh_client.apost("/v1/settings/refresh", {"doNotDisturb": refresh_enabled})
            if not refresh.get("ok", False):
                return refresh
            settings = result.get("displaySettings")
            if isinstance(settings, dict):
                settings["doNotDisturb"] = refresh_enabled
        if self._display_update_requests_custom(payload):
            settings = result.get("displaySettings") if isinstance(result, dict) else None
            if not isinstance(settings, dict):
                try:
                    settings = await self.get_display_settings()
                    if isinstance(settings.get("displaySettings"), dict):
                        settings = settings["displaySettings"]
                except Exception as exc:
                    decky.logger.info(f"Chronograph custom activation check skipped: {exc}")
                    settings = None
            if isinstance(settings, dict) and self._settings_have_active_chronograph(settings):
                decky.logger.info("Chronograph monitor restarted after custom display activation")
                return await self.send_chronograph_monitor(CHRONOGRAPH_MAX_SECONDS)
        return result

    @staticmethod
    def _normalize_display_refresh_rate(refresh_rate: float) -> int:
        try:
            normalized = int(float(refresh_rate) + 0.5)
        except (TypeError, ValueError, OverflowError):
            return 0
        return normalized if 1 <= normalized <= 999 else 0

    async def update_display_refresh_rate(self, refresh_rate: float = 0):
        return await self.client.apost(
            "/v1/runtime/display-refresh-rate",
            {"refreshRate": self._normalize_display_refresh_rate(refresh_rate)},
        )

    async def select_custom_asset(self, asset: str):
        if self._is_chronograph_asset(asset):
            return await self.send_chronograph_monitor(CHRONOGRAPH_MAX_SECONDS)
        return await self.client.apost("/v1/custom/assets/select", {"asset": asset})

    async def upload_custom_asset(self, filename: str, content_base64: str):
        return await self.client.apost(
            "/v1/custom/assets/upload",
            {"filename": filename, "content_base64": content_base64},
        )

    async def upload_custom_asset_from_path(self, source_path: str):
        source = Path(source_path).expanduser()
        try:
            source = source.resolve(strict=True)
        except (OSError, RuntimeError):
            return {"ok": False, "error": "custom_asset_file_not_found"}
        if not source.is_file() or source.suffix.lower() not in CUSTOM_ASSET_EXTENSIONS:
            return {"ok": False, "error": "custom_asset_file_not_found"}
        try:
            if source.stat().st_size > CUSTOM_ASSET_MAX_SOURCE_BYTES:
                return {"ok": False, "error": "custom_asset_too_large"}
        except OSError:
            return {"ok": False, "error": "custom_asset_file_read_failed"}
        # 后台直接读取所选文件并压缩，插件不把原始大文件载入内存或转成 Base64。
        return await self.client.apost(
            "/v1/custom/assets/import", {"source_path": str(source)}
        )

    async def list_custom_asset_files(self, folder_path: str):
        """列出所选文件夹中的受支持图片。"""
        folder = Path(folder_path).expanduser()
        try:
            folder = folder.resolve(strict=True)
        except (OSError, RuntimeError):
            return {"ok": False, "error": "custom_asset_folder_not_found"}
        if not folder.is_dir():
            return {"ok": False, "error": "custom_asset_folder_not_found"}

        try:
            candidates = sorted(
                (
                    item
                    for item in folder.iterdir()
                    if item.is_file() and item.suffix.lower() in CUSTOM_ASSET_EXTENSIONS
                ),
                key=lambda item: item.name.casefold(),
            )
        except OSError:
            return {"ok": False, "error": "custom_asset_folder_read_failed"}

        mime_types = {
            ".png": "image/png",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".bmp": "image/bmp",
        }
        files = []
        for item in candidates[:CUSTOM_ASSET_DIRECTORY_LIMIT]:
            preview = ""
            try:
                if 0 < item.stat().st_size <= CUSTOM_ASSET_PREVIEW_LIMIT_BYTES:
                    with item.open("rb") as stream:
                        data = stream.read(CUSTOM_ASSET_PREVIEW_LIMIT_BYTES + 1)
                    if 0 < len(data) <= CUSTOM_ASSET_PREVIEW_LIMIT_BYTES:
                        preview = (
                            f"data:{mime_types[item.suffix.lower()]};base64,"
                            f"{base64.b64encode(data).decode('ascii')}"
                        )
            except OSError:
                # 保留文件名；上传时再返回准确的读取错误。
                pass
            files.append({"name": item.name, "path": str(item), "preview": preview})

        return {
            "ok": True,
            "folder": str(folder),
            "files": files,
            "truncated": len(candidates) > CUSTOM_ASSET_DIRECTORY_LIMIT,
        }

    async def delete_custom_asset(self, asset: str):
        return await self.client.apost("/v1/custom/assets/delete", {"asset": asset})

    async def sync_display(self, module_id: str = ""):
        normalized_module_id = module_id.lower()
        if normalized_module_id in {"chronograph", "countup"}:
            return await self.send_chronograph_monitor(CHRONOGRAPH_MAX_SECONDS)
        if normalized_module_id == "custom":
            settings = await self.get_display_settings()
            if isinstance(settings.get("displaySettings"), dict):
                settings = settings["displaySettings"]
            custom = settings.get("custom", {})
            if isinstance(custom, dict):
                current_asset = custom.get("current_asset") or custom.get("currentAsset")
                if self._is_chronograph_asset(str(current_asset)):
                    return await self.send_chronograph_monitor(CHRONOGRAPH_MAX_SECONDS)
        if normalized_module_id:
            self._stop_legacy_monitor_loops()
        payload = {"moduleId": module_id} if module_id else {}
        return await self.client.apost("/v1/display/sync", payload)

    async def sync_context_now(self, sync_display: bool = True):
        context = self._daemon_steam_context()
        payload = dict(context)
        if not sync_display:
            payload["syncDisplay"] = False
        await self.client.apost("/v1/runtime/steam-context", payload)
        return context

    def _daemon_steam_context(self):
        context = dict(self._scan_context())
        context["source"] = "decky"
        app_id = str(context.get("appId") or "")
        try:
            session_started_at = max(0, int(round(float(context.get("sessionStartedAt") or 0))))
        except (TypeError, ValueError):
            session_started_at = 0
        context["sessionStartedAt"] = session_started_at

        if not app_id or not bool(context.get("running")):
            return context

        try:
            reported_total = max(0, int(context.get("totalPlaytimeMinutes") or 0))
        except (TypeError, ValueError):
            reported_total = 0
        session_key = (app_id, session_started_at)
        with self._playtime_context_lock:
            same_session = (
                self._playtime_session_key is not None
                and self._playtime_session_key[0] == app_id
                and abs(self._playtime_session_key[1] - session_started_at) <= 2
            )
            if not same_session:
                self._playtime_session_key = session_key
                self._playtime_baseline_minutes = reported_total
            else:
                context["sessionStartedAt"] = self._playtime_session_key[1]
            context["totalPlaytimeMinutes"] = self._playtime_baseline_minutes
        return context

    def _sync_playtime_context_now(self):
        context = self._daemon_steam_context()
        payload = dict(context)
        payload["syncDisplay"] = False
        return self.client.post("/v1/runtime/steam-context", payload)

    async def refresh_and_sync(self):
        context = await self.sync_context_now()
        await self.sync_display()
        return {"ok": True, "context": context}

    async def health(self):
        return {"ok": True}

    async def write_serial_hex(self, hex_string: str, port: str = "", baudrate: int = 1000000):
        """Map known DY host commands onto companion HTTP when available.

        Hex parsing uses the published USB connection codec. When the closed
        companion is running, power/brightness/mode switch go through its HTTP
        API instead of opening the serial port from the plugin process.
        """
        del port, baudrate
        normalized = "".join(hex_string.strip().split()).upper()
        frame = self._parse_matrix_frame(normalized)
        if frame and frame["data_type"] == 0x01:
            command = frame["command"]
            data = frame["data"]
            if command == 0x01 and len(data) >= 1:
                result = await self.set_power(data[0] != 0)
                return self._daemon_serial_result(result, "power", normalized)
            if command == 0x02 and len(data) >= 1:
                brightness = max(0, min(100, int(data[0])))
                result = await self.set_brightness(brightness)
                return self._daemon_serial_result(result, "brightness", normalized)
            if command == 0x21 and len(data) >= 1:
                return await self._activate_mode_hex(data[0])
        return {
            "ok": True,
            "mode": "daemon-ignored",
            "port": "daemon",
            "written": 0,
            "txHex": self._format_hex(normalized),
            "rxHex": "",
            "message": "Raw serial is not implemented in the opensource plugin; companion daemon owns USB.",
        }

    async def send_dashboard_monitor(self, refresh_rate: float = 0, port: str = "", baudrate: int = 1000000):
        del refresh_rate
        return await self._activate_daemon_module(
            "dashboard",
            display_refresh_rate=0,
        )

    async def send_hardware_monitor(self, refresh_rate: float = 0, port: str = "", baudrate: int = 1000000):
        del refresh_rate
        return await self._activate_daemon_module(
            "system_performance",
            display_refresh_rate=0,
        )

    async def send_clock_monitor(self, port: str = "", baudrate: int = 1000000):
        return await self._activate_daemon_module("productivity")

    async def send_weather_forecast(self, port: str = "", baudrate: int = 1000000):
        return await self._activate_daemon_module("weather")

    async def send_playtime_monitor(self, port: str = "", baudrate: int = 1000000):
        result = await self._activate_daemon_module("playtime", sync_context=True)
        if result.get("ok", True):
            self._start_playtime_monitor_loop(port, baudrate)
        return result

    async def send_countdown_monitor(self, minutes: int = 30, seconds: int = 0, port: str = "", baudrate: int = 1000000):
        self._stop_legacy_monitor_loops()
        total_seconds = int(seconds) if int(seconds or 0) > 0 else int(minutes) * 60
        self._countdown_total_seconds = max(1, min((99 * 3600) + (59 * 60) + 59, total_seconds))
        self._countdown_started_at = time.time()
        result = await self.client.apost(
            "/v1/timer/countdown",
            {"totalSeconds": self._countdown_total_seconds},
        )
        return {"mode": "daemon", "moduleId": "countdown", **result}

    async def send_chronograph_monitor(self, seconds: int = CHRONOGRAPH_MAX_SECONDS, port: str = "", baudrate: int = 1000000):
        self._stop_legacy_monitor_loops()
        self._chronograph_total_seconds = max(1, min(CHRONOGRAPH_MAX_SECONDS, int(seconds)))
        self._chronograph_started_at = time.time()
        decky.logger.info("Chronograph monitor start requested")
        result = await self.client.apost(
            "/v1/timer/chronograph",
            {"totalSeconds": self._chronograph_total_seconds},
        )
        return {"mode": "daemon", "moduleId": "chronograph", **result}

    async def send_ai_agent_monitor(self, port: str = "", baudrate: int = 1000000):
        del port, baudrate
        # Activate first so the screen switches instantly; session name/running lands via push.
        activation = await self._activate_daemon_module("ai_agent")
        if not activation.get("ok", True):
            return activation
        try:
            payload = await asyncio.to_thread(_ai_agent_screen_payload, True)
        except Exception as exc:
            decky.logger.info(f"AI Agent payload build failed: {exc}")
            payload = {
                "sessionName": "",
                "running": False,
                "conversations": 0,
                "primaryPercent": -1,
                "secondaryPercent": -1,
                "tokensPrimary": "--",
                "tokensSecondary": "--",
            }
        pushed = await self.client.apost("/v1/aiagent", payload)
        self._start_ai_agent_monitor_loop()
        return {"ok": True, "mode": "daemon", "moduleId": "ai_agent", "screen": payload, **pushed}

    def _stop_legacy_monitor_loops(self):
        self._dashboard_generation += 1
        self._clock_generation += 1
        self._playtime_generation += 1
        self._countdown_generation += 1
        self._chronograph_generation += 1
        self._chronograph_loop_active = False
        self._ai_agent_generation += 1

    async def _activate_daemon_module(
        self,
        module_id: str,
        sync_context: bool = False,
        display_refresh_rate: int | None = None,
    ):
        self._stop_legacy_monitor_loops()
        if module_id == "dashboard" or sync_context:
            await self.sync_context_now(sync_display=False)
        payload = {
            "activeModuleId": module_id,
            "autoSyncEnabled": True,
            "timeline": {"enabled": False},
        }
        if display_refresh_rate is not None:
            payload["displayRefreshRate"] = display_refresh_rate
        settings = await self.client.apost(
            "/v1/settings/display",
            payload,
        )
        return {"ok": settings.get("ok", True), "mode": "daemon", "moduleId": module_id, "settings": settings}

    async def _activate_mode_hex(self, mode_hex: int):
        mode_map = {
            0x01: "dashboard",
            0x02: "system_performance",
            0x03: "weather",
            0x04: "productivity",
        }
        if mode_hex in mode_map:
            return await self._activate_daemon_module(mode_map[mode_hex])
        if mode_hex == 0x05:
            return await self.send_playtime_monitor()
        if mode_hex == 0x06:
            return await self.send_countdown_monitor()
        if mode_hex == 0x07:
            return await self.send_chronograph_monitor(CHRONOGRAPH_MAX_SECONDS)
        if mode_hex == 0x08:
            return await self._activate_builtin_custom_asset("rainbow_scroll")
        if mode_hex == 0x09:
            return await self.send_ai_agent_monitor()
        return {
            "ok": True,
            "mode": "daemon-ignored",
            "port": "daemon",
            "written": 0,
            "message": f"Unsupported display mode 0x{mode_hex:02X}; raw serial is disabled while daemon owns USB.",
        }

    def _parse_matrix_frame(self, hex_string: str):
        """Parse a DY host frame via the published USB codec."""
        try:
            raw = bytes.fromhex("".join(hex_string.strip().split()))
            parsed = usb_frames.parse_frame(raw)
        except Exception:
            return None
        return {
            "data_type": parsed.transport_type,
            "command": parsed.command,
            "data": list(parsed.payload),
            "raw": parsed.raw,
        }

    def _format_hex(self, normalized: str):
        return " ".join(normalized[index:index + 2] for index in range(0, len(normalized), 2))

    def _daemon_serial_result(self, result: dict, action: str, normalized: str):
        return {
            "ok": result.get("ok", True),
            "mode": "daemon",
            "action": action,
            "port": "daemon",
            "written": 0,
            "txHex": self._format_hex(normalized),
            "rxHex": "",
            "daemon": result,
        }

    async def _activate_custom_gif(self, asset_name: str, gif_data: bytes):
        encoded = base64.b64encode(gif_data).decode("ascii")
        upload = await self.client.apost(
            "/v1/custom/assets/upload",
            {"filename": asset_name, "content_base64": encoded},
        )
        settings = await self.client.apost(
            "/v1/settings/display",
            {
                "activeModuleId": "custom",
                "autoSyncEnabled": True,
                "timeline": {"enabled": False},
                "custom": {"active": True, "currentAsset": asset_name},
            },
        )
        select = await self.client.apost("/v1/custom/assets/select", {"asset": asset_name})
        sync = await self.client.apost("/v1/display/sync", {"moduleId": "custom"})
        return {
            "ok": sync.get("ok", True),
            "mode": "daemon-custom",
            "moduleId": "custom",
            "asset": asset_name,
            "upload": upload,
            "settings": settings,
            "select": select,
            "sync": sync,
        }

    async def _activate_builtin_custom_asset(self, asset_name: str):
        self._stop_legacy_monitor_loops()
        select = await self.client.apost("/v1/custom/assets/select", {"asset": asset_name})
        return {
            "ok": select.get("ok", True),
            "mode": "daemon-custom",
            "moduleId": "custom",
            "asset": asset_name,
            "select": select,
        }

    def _activate_custom_gif_sync(self, asset_name: str, gif_data: bytes):
        encoded = base64.b64encode(gif_data).decode("ascii")
        upload = self.client.post(
            "/v1/custom/assets/upload",
            {"filename": asset_name, "content_base64": encoded},
        )
        settings = self.client.post(
            "/v1/settings/display",
            {
                "activeModuleId": "custom",
                "autoSyncEnabled": True,
                "timeline": {"enabled": False},
                "custom": {"active": True, "currentAsset": asset_name},
            },
        )
        select = self.client.post("/v1/custom/assets/select", {"asset": asset_name})
        sync = self.client.post("/v1/display/sync", {"moduleId": "custom"})
        return {
            "ok": sync.get("ok", True),
            "mode": "daemon-custom",
            "moduleId": "custom",
            "asset": asset_name,
            "upload": upload,
            "settings": settings,
            "select": select,
            "sync": sync,
        }

    def _start_playtime_monitor_loop(self, port: str = "", baudrate: int = 1000000):
        del port, baudrate
        self._playtime_generation += 1
        generation = self._playtime_generation

        def run():
            while generation == self._playtime_generation:
                time.sleep(max(1.0, PLAYTIME_REFRESH_SECONDS - (time.time() % PLAYTIME_REFRESH_SECONDS)))
                if generation != self._playtime_generation:
                    return
                try:
                    self._sync_playtime_context_now()
                except Exception as exc:
                    decky.logger.info(f"Playtime context refresh skipped: {exc}")

        thread = threading.Thread(target=run, name="jsaux-playtime-monitor", daemon=True)
        thread.start()

    def _start_ai_agent_monitor_loop(self):
        self._ai_agent_generation += 1
        generation = self._ai_agent_generation

        def run():
            while generation == self._ai_agent_generation:
                time.sleep(random.uniform(AI_AGENT_SCREEN_REFRESH_MIN_SECONDS, AI_AGENT_SCREEN_REFRESH_MAX_SECONDS))
                if generation != self._ai_agent_generation:
                    return
                try:
                    payload = _ai_agent_screen_payload()
                    self.client.post("/v1/aiagent", payload)
                except Exception as exc:
                    decky.logger.info(f"AI Agent screen refresh skipped: {exc}")

        thread = threading.Thread(target=run, name="jsaux-ai-agent-monitor", daemon=True)
        thread.start()

    def _start_countdown_monitor_loop(self, port: str = "", baudrate: int = 1000000):
        self._countdown_generation += 1
        generation = self._countdown_generation

        def run():
            for _ in range(self._countdown_total_seconds + 2):
                time.sleep(max(0.2, 1.02 - (time.time() % 1.0)))
                if generation != self._countdown_generation:
                    return
                if not self._current_custom_asset_is("plugin-countdown.gif"):
                    decky.logger.info("Countdown monitor loop stopped by selected UI change")
                    return
                try:
                    self._activate_custom_gif_sync("plugin-countdown.gif", self._build_countdown_monitor_gif())
                except Exception as exc:
                    decky.logger.info(f"Countdown monitor refresh stopped: {exc}")
                    return

        thread = threading.Thread(target=run, name="jsaux-countdown-monitor", daemon=True)
        thread.start()

    def _start_chronograph_monitor_loop(self, port: str = "", baudrate: int = 1000000):
        self._chronograph_generation += 1
        generation = self._chronograph_generation
        self._chronograph_loop_active = True

        def run():
            try:
                next_refresh = time.time()
                for _ in range(self._chronograph_total_seconds + 2):
                    if generation != self._chronograph_generation:
                        decky.logger.info("Chronograph monitor loop stopped by mode change")
                        return
                    if not self._current_custom_asset_is_chronograph():
                        decky.logger.info("Chronograph monitor loop stopped by selected UI change")
                        return
                    try:
                        elapsed = self._chronograph_elapsed_seconds()
                        asset_name = self._chronograph_asset_name(elapsed)
                        self._activate_custom_gif_sync(asset_name, self._build_chronograph_monitor_asset())
                        if elapsed % 60 in {29, 30, 31, 32, 33}:
                            decky.logger.info(f"Chronograph monitor refreshed elapsed={elapsed} asset={asset_name}")
                    except Exception as exc:
                        decky.logger.info(f"Chronograph monitor refresh skipped: {exc}")
                    next_refresh += 1.0
                    time.sleep(max(0.2, next_refresh - time.time()))
            finally:
                if generation == self._chronograph_generation:
                    self._chronograph_loop_active = False

        thread = threading.Thread(target=run, name="jsaux-chronograph-monitor", daemon=True)
        thread.start()

    def _ensure_chronograph_monitor_running_for_active_display(self, port: str = "", baudrate: int = 1000000) -> bool:
        if self._chronograph_loop_active:
            return False

        settings = self.client.get("/v1/settings/display")
        if isinstance(settings.get("displaySettings"), dict):
            settings = settings["displaySettings"]
        if not self._settings_have_active_chronograph(settings):
            return False

        self._chronograph_total_seconds = CHRONOGRAPH_MAX_SECONDS
        self._chronograph_started_at = time.time()
        asset_name = self._chronograph_asset_name(0)
        result = self._activate_custom_gif_sync(asset_name, self._build_chronograph_monitor_asset())
        if not result.get("ok", True):
            decky.logger.info(f"Chronograph watchdog restart failed: {result}")
            return False

        self._start_chronograph_monitor_loop(port, baudrate)
        decky.logger.info("Chronograph watchdog restarted active custom display")
        return True

    def _start_chronograph_activation_watchdog(self):
        self._chronograph_watchdog_generation += 1
        generation = self._chronograph_watchdog_generation

        def run():
            while generation == self._chronograph_watchdog_generation:
                time.sleep(1.0)
                if generation != self._chronograph_watchdog_generation:
                    return
                try:
                    self._ensure_chronograph_monitor_running_for_active_display()
                except Exception as exc:
                    decky.logger.info(f"Chronograph watchdog skipped: {exc}")

        thread = threading.Thread(target=run, name="jsaux-chronograph-watchdog", daemon=True)
        thread.start()

    def _chronograph_elapsed_seconds(self) -> int:
        total = max(1, int(self._chronograph_total_seconds))
        return max(0, min(total, int(time.time() - self._chronograph_started_at)))

    def _chronograph_asset_name(self, elapsed_seconds: int | None = None) -> str:
        elapsed = self._chronograph_elapsed_seconds() if elapsed_seconds is None else int(elapsed_seconds)
        return f"plugin-chronograph-{elapsed % 60:02d}.bmp"

    def _is_chronograph_asset(self, asset: str) -> bool:
        return asset == "plugin-chronograph.gif" or bool(re.fullmatch(r"plugin-chronograph-\d{2}\.(gif|bmp)", asset))

    def _current_custom_asset(self) -> str:
        try:
            settings = self.client.get("/v1/settings/display")
            if isinstance(settings.get("displaySettings"), dict):
                settings = settings["displaySettings"]
            active_module = str(settings.get("activeModuleId") or settings.get("active_module_id") or "")
            if active_module.lower() not in {"custom", "custom_upload"}:
                return ""
            custom = settings.get("custom", {})
            if isinstance(custom, dict):
                return str(custom.get("current_asset") or custom.get("currentAsset") or "")
        except Exception as exc:
            decky.logger.info(f"Current custom asset check failed: {exc}")
        return ""

    def _current_custom_asset_is(self, asset: str) -> bool:
        return self._current_custom_asset() == asset

    def _current_custom_asset_is_chronograph(self) -> bool:
        return self._is_chronograph_asset(self._current_custom_asset())

    def _display_update_requests_custom(self, payload: dict) -> bool:
        active_module = str(payload.get("activeModuleId") or payload.get("active_module_id") or "")
        if active_module.lower() == "custom":
            return True
        custom = payload.get("custom", {})
        if isinstance(custom, dict):
            current_asset = str(custom.get("current_asset") or custom.get("currentAsset") or "")
            return self._is_chronograph_asset(current_asset)
        return False

    def _settings_have_active_chronograph(self, settings: dict) -> bool:
        active_module = str(settings.get("activeModuleId") or settings.get("active_module_id") or "")
        custom = settings.get("custom", {})
        current_asset = ""
        if isinstance(custom, dict):
            current_asset = str(custom.get("current_asset") or custom.get("currentAsset") or "")
        return active_module.lower() == "custom" and self._is_chronograph_asset(current_asset)

    def _build_countdown_monitor_gif(
        self,
        count_up: bool = False,
        elapsed_override: int | None = None,
        image_format: str = "gif",
    ) -> bytes:
        width, height = 64, 54
        palette = [
            (0, 0, 0),
            (255, 255, 255),
            (102, 102, 102),
            (255, 105, 0),
            (255, 0, 0),
            (160, 255, 0),
            (255, 105, 0),
            (96, 0, 255),
        ]
        bg, white, gray, orange, red, green, sand, purple = range(8)
        pixels = [bg] * (width * height)

        def dot(x: int, y: int, color: int):
            if 0 <= x < width and 0 <= y < height:
                pixels[y * width + x] = color

        def rect(x: int, y: int, w: int, h: int, color: int):
            for yy in range(y, y + h):
                for xx in range(x, x + w):
                    dot(xx, yy, color)

        tiny = {
            "0": [7, 5, 5, 5, 7], "1": [2, 6, 2, 2, 7], "2": [7, 1, 7, 4, 7], "3": [7, 1, 7, 1, 7],
            "4": [5, 5, 7, 1, 1], "5": [7, 4, 7, 1, 7], "6": [7, 4, 7, 5, 7], "7": [7, 1, 2, 2, 2],
            "8": [7, 5, 7, 5, 7], "9": [7, 5, 7, 1, 7], "A": [2, 5, 7, 5, 5], "C": [7, 4, 4, 4, 7],
            "D": [6, 5, 5, 5, 6], "E": [7, 4, 7, 4, 7], "I": [7, 2, 2, 2, 7], "M": [5, 7, 5, 5, 5],
            "N": [5, 7, 7, 7, 5], "O": [7, 5, 5, 5, 7], "R": [7, 5, 6, 5, 5], "S": [3, 4, 2, 1, 6], "T": [7, 2, 2, 2, 2],
            "U": [5, 5, 5, 5, 7], "W": [5, 5, 7, 7, 5],
        }

        def text3(text: str, x: int, y: int, color: int = white):
            cx = x
            for ch in text.upper():
                if ch == " ":
                    cx += 4
                    continue
                rows = tiny.get(ch)
                if rows:
                    for yy, bits in enumerate(rows):
                        for xx in range(3):
                            if bits & (1 << (2 - xx)):
                                dot(cx + xx, y + yy, color)
                cx += 4

        clock_big = {
            "0": (12, [0x7FE0, 0xFFF0, 0xFFF0, 0xFFF0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xFFF0, 0xFFF0, 0xFFF0, 0x7FE0]),
            "1": (12, [0x0F00, 0x0F00, 0x7F00, 0x7F00, 0x7F00, 0x7F00, 0x0F00, 0x0F00, 0x0F00, 0x0F00, 0x0F00, 0x0F00, 0x0F00, 0x0F00, 0x0F00, 0x0F00, 0xFFF0, 0xFFF0, 0xFFF0, 0xFFF0]),
            "2": (12, [0xFFE0, 0xFFF0, 0xFFF0, 0xFFF0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x7FF0, 0xFFF0, 0xFFF0, 0xFFE0, 0xF000, 0xF000, 0xF000, 0xF000, 0xFFF0, 0xFFF0, 0xFFF0, 0x7FF0]),
            "3": (12, [0xFFE0, 0xFFF0, 0xFFF0, 0xFFF0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0xFFF0, 0xFFF0, 0xFFF0, 0xFFF0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0xFFF0, 0xFFF0, 0xFFF0, 0xFFE0]),
            "4": (12, [0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xFFF0, 0xFFF0, 0xFFF0, 0x7FF0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0]),
            "5": (12, [0x7FF0, 0xFFF0, 0xFFF0, 0xFFF0, 0xF000, 0xF000, 0xF000, 0xF000, 0xFFE0, 0xFFF0, 0xFFF0, 0x7FF0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0xFFF0, 0xFFF0, 0xFFF0, 0xFFE0]),
            "6": (12, [0x7FF0, 0xFFF0, 0xFFF0, 0xFFF0, 0xF000, 0xF000, 0xF000, 0xF000, 0xFFE0, 0xFFF0, 0xFFF0, 0xFFF0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xFFF0, 0xFFF0, 0xFFF0, 0x7FE0]),
            "7": (12, [0xFFE0, 0xFFF0, 0xFFF0, 0xFFF0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0x00F0]),
            "8": (12, [0x7FE0, 0xFFF0, 0xFFF0, 0xFFF0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xFFF0, 0xFFF0, 0xFFF0, 0xFFF0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xFFF0, 0xFFF0, 0xFFF0, 0x7FE0]),
            "9": (12, [0x7FE0, 0xFFF0, 0xFFF0, 0xFFF0, 0xF0F0, 0xF0F0, 0xF0F0, 0xF0F0, 0xFFF0, 0xFFF0, 0xFFF0, 0x7FF0, 0x00F0, 0x00F0, 0x00F0, 0x00F0, 0xFFF0, 0xFFF0, 0xFFF0, 0xFFE0]),
            ":": (4, [0x0000, 0x0000, 0x0000, 0x0000, 0xF000, 0xF000, 0xF000, 0xF000, 0x0000, 0x0000, 0x0000, 0x0000, 0xF000, 0xF000, 0xF000, 0xF000, 0x0000, 0x0000, 0x0000, 0x0000]),
        }

        def clock_big_char(ch: str, x: int, y: int):
            glyph = clock_big.get(ch)
            if not glyph:
                return
            glyph_width, rows = glyph
            for yy, bits in enumerate(rows):
                for xx in range(glyph_width):
                    if bits & (1 << (15 - xx)):
                        dot(x + xx, y + yy, white)

        def hourglass(x: int, y: int):
            rows = (
                "GGGGG",
                "GOOOG",
                ".GOG.",
                "..G..",
                ".G.G.",
                "G.O.G",
                "GGGGG",
            )
            for yy, row in enumerate(rows):
                for xx, ch in enumerate(row):
                    if ch == "G":
                        dot(x + xx, y + yy, green)
                    elif ch == "O":
                        dot(x + xx, y + yy, sand)

        def timer_icon(x: int, y: int):
            rows = (
                "..GGG..",
                ".GPPPG.",
                "GPPGPPG",
                "GPPGGPG",
                "GPPPPPG",
                ".GPPPG.",
                "..GGG..",
            )
            for yy, row in enumerate(rows):
                for xx, ch in enumerate(row):
                    if ch == "G":
                        dot(x + xx, y + yy, green)
                    elif ch == "P":
                        dot(x + xx, y + yy, purple)

        if count_up:
            total = max(1, int(self._chronograph_total_seconds))
            elapsed = elapsed_override if elapsed_override is not None else int(time.time() - self._chronograph_started_at)
            elapsed = max(0, min(total, int(elapsed)))
            time_text = f"{(elapsed // 3600) % 100:02d}:{(elapsed // 60) % 60:02d}"
            bar_units = elapsed % 60
            bar_total = 60
        else:
            total = max(1, int(self._countdown_total_seconds))
            elapsed = max(0, min(total, int(time.time() - self._countdown_started_at)))
            remaining = max(0, total - elapsed)
            time_text, bar_units, bar_total = self._countdown_display_state(total, remaining)
            label_text = f"{total}S" if total < 60 else f"{max(1, total // 60):02d}MIN"
        if count_up:
            text3("TIMER", 2, 2)
            timer_icon(55, 2)
        else:
            text3("COUNTDOWN", 2, 2)
            if total < 60:
                text3(f"{total}", 2, 9)
                tiny_s = (3, 4, 2, 1, 6)
                for yy, bits in enumerate(tiny_s):
                    for xx in range(3):
                        if bits & (1 << (2 - xx)):
                            dot(11 + xx, 9 + yy, white)
            else:
                text3(label_text, 2, 9)
            hourglass(57, 2)

        clock_big_char(time_text[0], 2, 18)
        clock_big_char(time_text[1], 16, 18)
        clock_big_char(":", 30, 18)
        clock_big_char(time_text[3], 36, 18)
        clock_big_char(time_text[4], 50, 18)

        bar_x, bar_y, bar_w = 2, 48, 60
        if count_up:
            for tick_x in [bar_x, *range(bar_x + 9, bar_x + bar_w, 10)]:
                dot(tick_x, bar_y - 2, gray)
                dot(tick_x, bar_y + 3, gray)
            for tick_x in [bar_x, *range(bar_x + 4, bar_x + bar_w, 5)]:
                dot(tick_x, bar_y - 1, gray)
                dot(tick_x, bar_y + 2, gray)
        else:
            for tick_x in range(bar_x + 2, bar_x + bar_w, 3):
                dot(tick_x, bar_y - 1, gray)
                dot(tick_x, bar_y + 2, gray)
            for tick_x in range(bar_x + 5, bar_x + bar_w, 6):
                dot(tick_x, bar_y - 2, gray)
                dot(tick_x, bar_y + 3, gray)
        if count_up:
            current_width = max(1, min(bar_w, (bar_units + 1) * bar_w // bar_total))
        else:
            current_width = max(0, min(bar_w, bar_units * bar_w // bar_total))
        if current_width:
            rect(bar_x, bar_y, current_width, 2, orange)
        cursor_x = bar_x if current_width <= 0 else min(bar_x + bar_w - 1, bar_x + current_width - 1)
        rect(cursor_x, bar_y, 1, 2, red)

        if image_format == "bmp":
            return self._bmp_from_indexed(width, height, palette, pixels)
        return self._gif_from_indexed(width, height, palette, pixels)

    def _build_chronograph_monitor_gif(self) -> bytes:
        return self._build_countdown_monitor_gif(count_up=True)

    def _build_chronograph_monitor_asset(self) -> bytes:
        return self._build_countdown_monitor_gif(count_up=True, image_format="bmp")

    def _gif_from_indexed(self, width: int, height: int, palette: list[tuple[int, int, int]], pixels: list[int]) -> bytes:
        min_code_size = max(2, (len(palette) - 1).bit_length())
        table_size = 1 << min_code_size
        palette = palette + [(0, 0, 0)] * (table_size - len(palette))
        color_table = bytearray()
        for red, green, blue in palette:
            color_table.extend([red, green, blue])

        image_data = self._gif_lzw(pixels, min_code_size)
        blocks = bytearray()
        for offset in range(0, len(image_data), 255):
            chunk = image_data[offset : offset + 255]
            blocks.append(len(chunk))
            blocks.extend(chunk)
        blocks.append(0)

        gif = bytearray(b"GIF89a")
        gif.extend(width.to_bytes(2, "little"))
        gif.extend(height.to_bytes(2, "little"))
        gif.extend(bytes([0xA0 | (min_code_size - 1), 0x00, 0x00]))
        gif.extend(color_table)
        gif.extend(b"\x2C\x00\x00\x00\x00")
        gif.extend(width.to_bytes(2, "little"))
        gif.extend(height.to_bytes(2, "little"))
        gif.append(0x00)
        gif.append(min_code_size)
        gif.extend(blocks)
        gif.append(0x3B)
        return bytes(gif)

    def _bmp_from_indexed(self, width: int, height: int, palette: list[tuple[int, int, int]], pixels: list[int]) -> bytes:
        row_stride = ((width * 3 + 3) // 4) * 4
        pixel_bytes = bytearray()
        for y in range(height - 1, -1, -1):
            row = bytearray()
            for x in range(width):
                red, green, blue = palette[pixels[y * width + x]]
                row.extend([blue, green, red])
            row.extend(b"\x00" * (row_stride - len(row)))
            pixel_bytes.extend(row)

        file_header_size = 14
        dib_header_size = 40
        pixel_offset = file_header_size + dib_header_size
        file_size = pixel_offset + len(pixel_bytes)

        bmp = bytearray(b"BM")
        bmp.extend(file_size.to_bytes(4, "little"))
        bmp.extend((0).to_bytes(4, "little"))
        bmp.extend(pixel_offset.to_bytes(4, "little"))
        bmp.extend(dib_header_size.to_bytes(4, "little"))
        bmp.extend(width.to_bytes(4, "little", signed=True))
        bmp.extend(height.to_bytes(4, "little", signed=True))
        bmp.extend((1).to_bytes(2, "little"))
        bmp.extend((24).to_bytes(2, "little"))
        bmp.extend((0).to_bytes(4, "little"))
        bmp.extend(len(pixel_bytes).to_bytes(4, "little"))
        bmp.extend((2835).to_bytes(4, "little", signed=True))
        bmp.extend((2835).to_bytes(4, "little", signed=True))
        bmp.extend((0).to_bytes(4, "little"))
        bmp.extend((0).to_bytes(4, "little"))
        bmp.extend(pixel_bytes)
        return bytes(bmp)

    def _gif_from_indexed_frames(
        self,
        width: int,
        height: int,
        palette: list[tuple[int, int, int]],
        frames: list[list[int]],
        delay_cs: int,
    ) -> bytes:
        color_table = bytearray()
        for red, green, blue in palette:
            color_table.extend([red, green, blue])

        min_code_size = 3
        gif = bytearray(b"GIF89a")
        gif.extend(width.to_bytes(2, "little"))
        gif.extend(height.to_bytes(2, "little"))
        gif.extend(bytes([0xA2, 0x00, 0x00]))
        gif.extend(color_table)
        gif.extend(b"\x21\xFF\x0BNETSCAPE2.0\x03\x01\x00\x00\x00")

        for pixels in frames:
            image_data = self._gif_lzw(pixels, min_code_size)
            blocks = bytearray()
            for offset in range(0, len(image_data), 255):
                chunk = image_data[offset : offset + 255]
                blocks.append(len(chunk))
                blocks.extend(chunk)
            blocks.append(0)

            gif.extend(b"\x21\xF9\x04\x04")
            gif.extend(int(delay_cs).to_bytes(2, "little"))
            gif.extend(b"\x00\x00")
            gif.extend(b"\x2C\x00\x00\x00\x00")
            gif.extend(width.to_bytes(2, "little"))
            gif.extend(height.to_bytes(2, "little"))
            gif.append(0x00)
            gif.append(min_code_size)
            gif.extend(blocks)

        gif.append(0x3B)
        return bytes(gif)

    def _gif_from_rgb222_frames(
        self,
        width: int,
        height: int,
        palette: list[tuple[int, int, int]],
        frames: list[list[int]],
        delay_cs: int,
    ) -> bytes:
        color_table = bytearray()
        for index in range(64):
            color_table.extend([
                ((index >> 4) & 0x03) * 255 // 3,
                ((index >> 2) & 0x03) * 255 // 3,
                (index & 0x03) * 255 // 3,
            ])

        def quantized(frame: list[int]) -> list[int]:
            result: list[int] = []
            for pixel in frame:
                red, green, blue = palette[pixel]
                result.append(((red >> 6) << 4) | ((green >> 6) << 2) | (blue >> 6))
            return result

        min_code_size = 6
        gif = bytearray(b"GIF89a")
        gif.extend(width.to_bytes(2, "little"))
        gif.extend(height.to_bytes(2, "little"))
        gif.extend(bytes([0xF5, 0x00, 0x00]))
        gif.extend(color_table)
        gif.extend(b"\x21\xFF\x0BNETSCAPE2.0\x03\x01\x00\x00\x00")

        for frame in frames:
            image_data = self._gif_lzw(quantized(frame), min_code_size)
            blocks = bytearray()
            for offset in range(0, len(image_data), 255):
                chunk = image_data[offset : offset + 255]
                blocks.append(len(chunk))
                blocks.extend(chunk)
            blocks.append(0)

            gif.extend(b"\x21\xF9\x04\x04")
            gif.extend(int(delay_cs).to_bytes(2, "little"))
            gif.extend(b"\xFF\x00")
            gif.extend(b"\x2C\x00\x00\x00\x00")
            gif.extend(width.to_bytes(2, "little"))
            gif.extend(height.to_bytes(2, "little"))
            gif.append(0x00)
            gif.append(min_code_size)
            gif.extend(blocks)

        gif.append(0x3B)
        return bytes(gif)

    def _gif_lzw(self, indices: list[int], min_code_size: int) -> bytes:
        clear = 1 << min_code_size
        end = clear + 1
        dictionary = {(i,): i for i in range(clear)}
        next_code = end + 1
        code_size = min_code_size + 1
        max_code = 1 << code_size
        bit_buffer = 0
        bit_count = 0
        output = bytearray()

        def write_code(code: int):
            nonlocal bit_buffer, bit_count
            bit_buffer |= code << bit_count
            bit_count += code_size
            while bit_count >= 8:
                output.append(bit_buffer & 0xFF)
                bit_buffer >>= 8
                bit_count -= 8

        def reset_dictionary():
            nonlocal dictionary, next_code, code_size, max_code
            dictionary = {(i,): i for i in range(clear)}
            next_code = end + 1
            code_size = min_code_size + 1
            max_code = 1 << code_size

        reset_dictionary()
        write_code(clear)
        current: tuple[int, ...] = ()
        for index in indices:
            candidate = current + (index,)
            if candidate in dictionary:
                current = candidate
                continue
            write_code(dictionary[current])
            if next_code < 4096:
                dictionary[candidate] = next_code
                next_code += 1
                if next_code > max_code and code_size < 12:
                    code_size += 1
                    max_code = 1 << code_size
            else:
                write_code(clear)
                reset_dictionary()
            current = (index,)
        if current:
            write_code(dictionary[current])
        write_code(end)
        if bit_count:
            output.append(bit_buffer & 0xFF)
        return bytes(output)

    def _scan_context(self):
        proc_root = Path("/proc")
        if not proc_root.exists():
            return self._empty_steam_context()

        launch_context = self._scan_steam_launch_context(proc_root)
        if launch_context.get("appId"):
            return launch_context

        for entry in proc_root.iterdir():
            if not entry.name.isdigit():
                continue
            environ_path = entry / "environ"
            try:
                environ = environ_path.read_bytes().decode("utf-8", errors="ignore")
            except OSError:
                continue

            app_id = ""
            for token in environ.split("\0"):
                if token.startswith("SteamAppId="):
                    app_id = token.split("=", 1)[1]
                    break
                if token.startswith("SteamGameId="):
                    app_id = token.split("=", 1)[1]

            if not app_id or app_id == "0":
                continue

            try:
                title = (entry / "comm").read_text(encoding="utf-8", errors="ignore").strip()
            except OSError:
                title = ""
            title = self._steam_app_name(app_id) or title
            return self._steam_context(app_id, title, self._process_started_at(entry), "decky-env")

        return self._empty_steam_context()

    def _empty_steam_context(self):
        return {
            "appId": "",
            "title": "",
            "source": "decky",
            "sessionStartedAt": 0,
            "totalPlaytimeMinutes": 0,
            "running": False,
        }

    def _scan_recent_steam_context(self):
        newest = None
        userdata = self._steam_root().joinpath("userdata")
        for localconfig in userdata.glob("*/config/localconfig.vdf"):
            try:
                text = localconfig.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for match in re.finditer(r'"(\d+)"\s*\{', text):
                app_id = match.group(1)
                block = text[match.end() : match.end() + 1400]
                last_played = re.search(r'"LastPlayed"\s+"(\d+)"', block)
                playtime = re.search(r'"Playtime"\s+"?(\d+)"?', block)
                if not last_played:
                    continue
                candidate = (int(last_played.group(1)), app_id, int(playtime.group(1)) if playtime else 0)
                if newest is None or candidate[0] > newest[0]:
                    newest = candidate
        if newest is None:
            return self._empty_steam_context()
        _, app_id, playtime = newest
        title = self._steam_app_name(app_id) or f"APP {app_id}"
        return {
            "appId": app_id,
            "title": title,
            "source": "steam-recent",
            "sessionStartedAt": 0,
            "totalPlaytimeMinutes": playtime,
            "running": False,
        }

    def _steam_context(self, app_id: str, title: str, session_started_at: float, source: str):
        return {
            "appId": app_id,
            "title": title,
            "source": source,
            "sessionStartedAt": session_started_at,
            "totalPlaytimeMinutes": self._steam_playtime_minutes(app_id),
            "running": True,
        }

    def _scan_steam_launch_context(self, proc_root: Path):
        for entry in proc_root.iterdir():
            if not entry.name.isdigit():
                continue
            try:
                cmdline = entry.joinpath("cmdline").read_bytes().replace(b"\0", b" ").decode("utf-8", errors="ignore")
            except OSError:
                continue
            match = re.search(r"SteamLaunch\s+AppId=(\d+)", cmdline)
            if not match:
                continue
            app_id = match.group(1)
            if app_id == "0":
                continue
            title = self._steam_app_name(app_id) or self._title_from_steam_cmdline(cmdline) or "GAME"
            return self._steam_context(app_id, title, self._process_started_at(entry), "steam-launch")
        return self._empty_steam_context()

    def _process_started_at(self, proc_entry: Path) -> float:
        try:
            stat = proc_entry.joinpath("stat").read_text(encoding="utf-8", errors="ignore")
            end = stat.rfind(")")
            fields = stat[end + 2 :].split()
            start_ticks = int(fields[19])
            ticks_per_second = os.sysconf(os.sysconf_names.get("SC_CLK_TCK", "SC_CLK_TCK"))
            uptime = float(Path("/proc/uptime").read_text(encoding="utf-8").split()[0])
            return time.time() - uptime + (start_ticks / ticks_per_second)
        except Exception:
            return 0

    def _title_from_steam_cmdline(self, cmdline: str) -> str:
        marker = "/steamapps/common/"
        if marker not in cmdline:
            return ""
        tail = cmdline.split(marker, 1)[1]
        title = tail.split("/", 1)[0].strip()
        return title.replace("_", " ")

    def _steam_root(self) -> Path:
        return Path(os.environ.get("STEAM_COMPAT_CLIENT_INSTALL_PATH", "/home/deck/.local/share/Steam"))

    def _steam_app_name(self, app_id: str) -> str:
        if not app_id:
            return ""
        for manifest in self._steam_root().joinpath("steamapps").glob(f"**/appmanifest_{app_id}.acf"):
            try:
                text = manifest.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            match = re.search(r'"name"\s+"([^"]+)"', text)
            if match:
                return match.group(1)
        appinfo = self._steam_root().joinpath("appcache", "appinfo.vdf")
        try:
            data = appinfo.read_bytes()
            needle = app_id.encode("ascii")
            position = data.find(needle)
            if position >= 0:
                chunk = data[max(0, position - 192) : position]
                candidates = re.findall(rb"[ -~]{2,120}\x00", chunk)
                for value in reversed(candidates):
                    title = value[:-1].decode("utf-8", errors="ignore").strip()
                    if title and not title.isdigit() and title.lower() not in {"name", "type", "game", "windows"}:
                        return title
        except OSError:
            pass
        return ""

    def _steam_playtime_minutes(self, app_id: str) -> int:
        if not app_id:
            return 0
        userdata = self._steam_root().joinpath("userdata")
        best = 0
        for localconfig in userdata.glob("*/config/localconfig.vdf"):
            try:
                text = localconfig.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            match = re.search(rf'"{re.escape(app_id)}"\s*\{{(.*?)\n\s*\}}', text, re.S)
            if not match:
                continue
            playtime = re.search(r'"Playtime"\s+"?(\d+)"?', match.group(1))
            if playtime:
                best = max(best, int(playtime.group(1)))
        return best

    async def _main(self):
        runtime_log = setup_plugin_file_logging()
        decky.logger.info(f"JSAUX PIXEL plugin started (runtime log: {runtime_log})")
        try:
            settings = await self.get_display_settings()
            if isinstance(settings.get("displaySettings"), dict):
                settings = settings["displaySettings"]
            active_module = str(settings.get("activeModuleId") or settings.get("active_module_id") or "")
            custom = settings.get("custom", {})
            current_asset = ""
            if isinstance(custom, dict):
                current_asset = str(custom.get("current_asset") or custom.get("currentAsset") or "")
            if active_module.lower() == "playtime":
                await self.send_playtime_monitor()
                decky.logger.info("Playtime monitor resumed on plugin start")
            elif active_module.lower() == "custom" and self._is_chronograph_asset(current_asset):
                await self.send_chronograph_monitor(CHRONOGRAPH_MAX_SECONDS)
                decky.logger.info("Chronograph monitor resumed on plugin start")
        except Exception as exc:
            decky.logger.info(f"Active monitor resume skipped: {exc}")

    async def _unload(self):
        self._chronograph_watchdog_generation += 1
        self._stop_legacy_monitor_loops()
        decky.logger.info("JSAUX PIXEL plugin stopped")

    async def _uninstall(self):
        self._remove_companion_desktop_install()
        decky.logger.info("JSAUX PIXEL plugin uninstalled")

    def _remove_companion_desktop_install(self):
        home = Path.home()
        service = home / ".config/systemd/user/jsaux-matrix-hub.service"
        support = home / ".local/bin/jsaux-release-support.py"
        if support.is_file():
            subprocess.run([sys.executable, str(support), "stop-desktop", "--home", str(home)], check=True)
        systemctl_env = os.environ.copy()
        systemctl_env.update(
            {
                "HOME": str(home),
                "XDG_RUNTIME_DIR": f"/run/user/{os.getuid()}",
                "DBUS_SESSION_BUS_ADDRESS": f"unix:path=/run/user/{os.getuid()}/bus",
            }
        )
        subprocess.run(
            ["systemctl", "--user", "disable", "--now", "jsaux-matrix-hub.service"],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            env=systemctl_env,
        )
        if support.is_file():
            subprocess.run([sys.executable, str(support), "cleanup", "--home", str(home)], check=True)
        runtime = home / ".local/lib/jsaux-matrixlink"
        if runtime.parent.resolve().is_relative_to(home.resolve()):
            if runtime.is_symlink(): runtime.unlink()
            elif runtime.exists(): shutil.rmtree(runtime)
        for path in (
            home / ".local/bin/jsaux-matrix-studio-v12",
            support,
            home / ".local/bin/jsaux-matrix-studio",
            home / ".local/bin/jsaux-matrix-daemon",
            home / ".local/bin/jsaux-matrixlink-uninstall",
            home / ".local/share/applications/jsaux-matrixlink.desktop",
            home / ".local/share/applications/jsaux-matrixlink-uninstall.desktop",
            home / "Desktop/JSAUX PIXEL.desktop",
            home / "Desktop/JSAUX MatrixLink.desktop",
            home / ".local/share/icons/hicolor/scalable/apps/jsaux-matrixlink.svg",
            service,
        ):
            try:
                path.unlink(missing_ok=True)
            except OSError as exc:
                decky.logger.info(f"Companion desktop cleanup skipped for {path}: {exc}")
        subprocess.run(
            ["systemctl", "--user", "daemon-reload"],
            check=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            env=systemctl_env,
        )

    async def _migration(self):
        decky.logger.info("JSAUX PIXEL plugin migration")
