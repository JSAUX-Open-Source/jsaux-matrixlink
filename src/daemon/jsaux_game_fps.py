#!/usr/bin/env python3
"""Gaming Mode uses the existing desktop MangoHud CSV sampler.

Per-game CSV is selected by the active app ID and process name.
No game, Steam, HUD appearance, serial panel, or system files are controlled.
"""

from __future__ import annotations

import argparse
import json
import os
import signal
import time
import urllib.request
from pathlib import Path

BEGIN = b"\n# JSAUX PIXEL game FPS logging BEGIN\n"
END = b"# JSAUX PIXEL game FPS logging END\n"


def strip_block(data: bytes) -> bytes:
    while BEGIN in data:
        start = data.index(BEGIN)
        end = data.find(END, start)
        if end < 0:
            break
        data = data[:start] + data[end + len(END) :]
    return data


def update_config(path: Path, append: bytes) -> bool:
    try:
        # Keep the inode: pressure-vessel can bind this file into a game.
        with path.open("r+b") as stream:
            data = stream.read()
            base = strip_block(data)
            wanted = base + append
            if data != wanted:
                stream.seek(0)
                stream.write(wanted)
                stream.truncate()
        return True
    except OSError:
        return False


def processes(appid: str, proc: Path = Path("/proc")) -> list:
    found = []
    for item in proc.iterdir():
        if not item.name.isdigit():
            continue
        try:
            env = dict(
                v.split(b"=", 1) for v in (item / "environ").read_bytes().split(b"\0") if b"=" in v
            )
            if not any(env.get(k) == appid.encode() for k in [b"SteamAppId", b"SteamGameId"]):
                continue
            if not env.get(b"GAMESCOPE_WAYLAND_DISPLAY"):
                continue
            comm = (item / "comm").read_text().strip()
            if comm in [
                "steam",
                "mangoapp",
                "pressure-vessel",
                "pv-bwrap",
                "reaper",
                "steam-launch-wrapper",
            ]:
                continue
            config = Path(os.fsdecode(env.get(b"MANGOHUD_CONFIGFILE", b"")))
            if config.name != "mangohud.config":
                continue
            if not str(config).startswith(
                str(Path("/run/user") / str(os.getuid())) + "/gamescope."
            ):
                continue
            if not config.is_file():
                continue
            found.append(
                (
                    int(item.name),
                    comm,
                    config,
                    b"autostart_log=1" in env.get(b"MANGOHUD_CONFIG", b""),
                )
            )
        except (OSError, ValueError):
            pass
    return found


def choose_log(folder: Path, names: set[str], now: float | None = None):
    now = time.time() if now is None else now
    candidates = []
    try:
        for path in folder.glob("*.csv"):
            stat = path.stat()
            if now - stat.st_mtime > 2 or stat.st_size < 30:
                continue
            stem = path.name.rsplit("_", 2)[0].lower()
            # Never accept the compositor/mangoapp log as application FPS.
            if not any(
                stem == name or (len(name) == 15 and stem.startswith(name)) for name in names
            ) or stem in {"mangoapp", "gamescope", "steam"}:
                continue
            candidates.append((stat.st_mtime, path))
    except OSError:
        return None
    return max(candidates, default=(0, None))[1]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--parent", type=int)
    parser.add_argument("--cleanup", action="store_true")
    parser.add_argument("--state")
    parser.add_argument("--log-dir")
    args = parser.parse_args()
    if args.cleanup:
        runtime = Path("/run/user") / str(os.getuid())
        for config in runtime.glob("gamescope.*/mangohud.config"):
            update_config(config, b"")
        return
    if not args.parent or not args.state or not args.log_dir:
        parser.error("parent, state and log-dir are required")
    state = Path(args.state)
    logs = Path(args.log_dir)
    state.parent.mkdir(parents=True, exist_ok=True)
    logs.mkdir(parents=True, exist_ok=True)
    # Remove an obsolete managed block from an earlier diagnostic build.
    runtime = Path("/run/user") / str(os.getuid())
    for config in runtime.glob("gamescope.*/mangohud.config"):
        update_config(config, b"")
    running = True
    managed: set = set()
    cached_app = None
    cached_found: list = []
    next_scan = 0.0

    def stop(*_args) -> None:
        nonlocal running
        running = False

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    try:
        while running and Path("/proc", str(args.parent)).exists():
            result = {"gaming": False, "state": "idle", "csvPath": "", "appId": "", "pids": []}
            try:
                base = os.environ.get("JSAUX_DAEMON_URL", "").strip() or "http://127.0.0.1"
                with urllib.request.urlopen(base.rstrip("/") + "/v1/device", timeout=1) as response:
                    device = json.load(response)
                context = device.get("steamContext", {})
                app = str(context.get("appId", ""))
                if app != cached_app or time.monotonic() >= next_scan:
                    cached_found = (
                        processes(app)
                        if context.get("running") and app.isdigit() and app != "769"
                        else []
                    )
                    cached_app = app
                    next_scan = time.monotonic() + 2
                found = cached_found if context.get("running") else []
                if found:
                    names = {name.lower() for _, name, _, _ in found}
                    chosen = choose_log(logs, names)
                    configured = any(configured for _, _, _, configured in found)
                    result.update(
                        gaming=True,
                        state=(
                            "sampling"
                            if chosen
                            else (
                                "waiting-for-game-samples"
                                if configured
                                else "restart-session-required"
                            )
                        ),
                        csvPath=str(chosen) if chosen else "",
                        appId=app,
                        pids=[pid for pid, _, _, _ in found],
                        source="mangohud-application-csv",
                        configured=configured,
                    )
            except (OSError, ValueError, KeyError):
                result["state"] = "waiting-for-game"
            temp = state.with_suffix(".tmp")
            temp.write_text(json.dumps(result))
            temp.chmod(0o600)
            os.replace(temp, state)
            time.sleep(0.4)
    finally:
        for config in managed:
            update_config(config, b"")
        try:
            state.unlink()
        except FileNotFoundError:
            pass


if __name__ == "__main__":
    main()
