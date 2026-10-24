"""Matrix LED display API for secondary development (host side).

Physical panel geometry for the host USB stack is 64×54 RGB LEDs.
(User-facing “how many lights” = width × height; each LED has on/off via
color, plus a global brightness and a whole-panel power switch.)

Layering
--------
1. ``set_power`` — outermost: entire panel on/off
2. ``set_brightness`` — global PWM-style brightness 0–100
3. ``set_led`` / ``set_leds`` / ``fill`` — per-LED RGB color (0–255)

``get_state`` is what the backend returns to a frontend so the UI can mirror
power, brightness, and (optionally) the full pixel buffer.
"""

from __future__ import annotations

import base64

from dataclasses import dataclass

from . import usb_frames
from typing import Any, Sequence

# Actual host-side panel size from the product USB stack (not 64×56).
MATRIX_WIDTH = 64
MATRIX_HEIGHT = 54
MATRIX_LED_COUNT = MATRIX_WIDTH * MATRIX_HEIGHT

RGB_TUPLE = tuple[int, int, int]


def _clamp_byte(value: int) -> int:
    return max(0, min(255, int(value)))


def _clamp_percent(value: int) -> int:
    return max(0, min(100, int(value)))


def _index(x: int, y: int) -> int:
    if not (0 <= x < MATRIX_WIDTH and 0 <= y < MATRIX_HEIGHT):
        raise ValueError(f"LED out of range: ({x}, {y})")
    return y * MATRIX_WIDTH + x


# Minimal 3×5 digits for runnable demo layouts (countdown / clock).
_DIGIT_GLYPHS: dict[str, tuple[str, ...]] = {
    "0": ("111", "101", "101", "101", "111"),
    "1": ("010", "110", "010", "010", "111"),
    "2": ("111", "001", "111", "100", "111"),
    "3": ("111", "001", "111", "001", "111"),
    "4": ("101", "101", "111", "001", "001"),
    "5": ("111", "100", "111", "001", "111"),
    "6": ("111", "100", "111", "101", "111"),
    "7": ("111", "001", "001", "001", "001"),
    "8": ("111", "101", "111", "101", "111"),
    "9": ("111", "101", "111", "001", "111"),
    ":": ("000", "010", "000", "010", "000"),
    " ": ("000", "000", "000", "000", "000"),
}


@dataclass(frozen=True)
class LedPixel:
    x: int
    y: int
    r: int
    g: int
    b: int

    def as_rgb(self) -> RGB_TUPLE:
        return (_clamp_byte(self.r), _clamp_byte(self.g), _clamp_byte(self.b))


class MatrixDisplayAPI:
    """In-memory panel model + USB DY frame builders."""

    width: int = MATRIX_WIDTH
    height: int = MATRIX_HEIGHT

    def __init__(self) -> None:
        self._power = True
        self._brightness = 80
        self._pixels: list[RGB_TUPLE] = [(0, 0, 0)] * MATRIX_LED_COUNT

    # --- outermost controls -------------------------------------------------
    def set_power(self, enabled: bool) -> dict[str, Any]:
        self._power = bool(enabled)
        return self.get_state(include_pixels=False)

    def set_brightness(self, brightness: int) -> dict[str, Any]:
        self._brightness = _clamp_percent(brightness)
        return self.get_state(include_pixels=False)

    # --- per-LED color ------------------------------------------------------
    def clear(self) -> dict[str, Any]:
        return self.fill(0, 0, 0)

    def fill(self, r: int = 0, g: int = 0, b: int = 0) -> dict[str, Any]:
        color = (_clamp_byte(r), _clamp_byte(g), _clamp_byte(b))
        self._pixels = [color] * MATRIX_LED_COUNT
        return self.get_state(include_pixels=False)

    def set_led(self, x: int, y: int, r: int, g: int, b: int) -> dict[str, Any]:
        self._pixels[_index(x, y)] = (_clamp_byte(r), _clamp_byte(g), _clamp_byte(b))
        return {"ok": True, "x": x, "y": y, "rgb": self._pixels[_index(x, y)]}

    def set_leds(self, leds: Sequence[dict[str, Any] | LedPixel | Sequence[int]]) -> dict[str, Any]:
        """Set many LEDs.

        Accepts:
        - list of ``{x,y,r,g,b}``
        - list of ``LedPixel``
        - flat length ``width*height`` list of ``[r,g,b]`` / ``(r,g,b)``
        """
        if len(leds) == MATRIX_LED_COUNT and not isinstance(leds[0], (dict, LedPixel)):
            pixels: list[RGB_TUPLE] = []
            for item in leds:
                if not isinstance(item, Sequence) or len(item) < 3:
                    raise ValueError("flat LED list entries must be [r,g,b]")
                pixels.append((_clamp_byte(item[0]), _clamp_byte(item[1]), _clamp_byte(item[2])))
            self._pixels = pixels
            return self.get_state(include_pixels=False)

        for item in leds:
            if isinstance(item, LedPixel):
                self.set_led(item.x, item.y, item.r, item.g, item.b)
            elif isinstance(item, dict):
                self.set_led(
                    int(item["x"]),
                    int(item["y"]),
                    int(item.get("r", 0)),
                    int(item.get("g", 0)),
                    int(item.get("b", 0)),
                )
            else:
                raise ValueError("unsupported LED entry")
        return self.get_state(include_pixels=False)

    def draw_text(
        self,
        text: str,
        x: int,
        y: int,
        color: RGB_TUPLE = (255, 255, 255),
        *,
        scale: int = 1,
    ) -> None:
        cursor = x
        for ch in text:
            glyph = _DIGIT_GLYPHS.get(ch, _DIGIT_GLYPHS[" "])
            for row, pattern in enumerate(glyph):
                for col, bit in enumerate(pattern):
                    if bit != "1":
                        continue
                    for dy in range(scale):
                        for dx in range(scale):
                            px = cursor + col * scale + dx
                            py = y + row * scale + dy
                            if 0 <= px < MATRIX_WIDTH and 0 <= py < MATRIX_HEIGHT:
                                self._pixels[_index(px, py)] = (
                                    _clamp_byte(color[0]),
                                    _clamp_byte(color[1]),
                                    _clamp_byte(color[2]),
                                )
            cursor += (3 * scale) + scale

    def draw_rect(
        self, x: int, y: int, w: int, h: int, color: RGB_TUPLE, *, filled: bool = True
    ) -> None:
        for yy in range(y, y + h):
            for xx in range(x, x + w):
                if not filled and not (xx in (x, x + w - 1) or yy in (y, y + h - 1)):
                    continue
                if 0 <= xx < MATRIX_WIDTH and 0 <= yy < MATRIX_HEIGHT:
                    self._pixels[_index(xx, yy)] = (
                        _clamp_byte(color[0]),
                        _clamp_byte(color[1]),
                        _clamp_byte(color[2]),
                    )

    # --- backend → frontend view --------------------------------------------
    def get_state(self, *, include_pixels: bool = True) -> dict[str, Any]:
        state: dict[str, Any] = {
            "ok": True,
            "width": MATRIX_WIDTH,
            "height": MATRIX_HEIGHT,
            "ledCount": MATRIX_LED_COUNT,
            "power": self._power,
            "brightness": self._brightness,
            # Frontend hint: how to present the panel.
            "display": {
                "power": self._power,
                "brightness": self._brightness,
                "layout": f"{MATRIX_WIDTH}x{MATRIX_HEIGHT}",
            },
        }
        if include_pixels:
            state["pixels"] = [
                {
                    "x": idx % MATRIX_WIDTH,
                    "y": idx // MATRIX_WIDTH,
                    "r": rgb[0],
                    "g": rgb[1],
                    "b": rgb[2],
                }
                for idx, rgb in enumerate(self._pixels)
            ]
            state["pixelsRgb"] = [c for rgb in self._pixels for c in rgb]
        return state

    # --- content + USB connection-layer frames ------------------------------
    def to_gif_bytes(self, *, delay_cs: int = 10) -> bytes:
        """Encode current framebuffer as a single-frame GIF."""
        palette, indices = _quantize_frame(self._pixels)
        return _gif_from_indexed(MATRIX_WIDTH, MATRIX_HEIGHT, palette, [indices], delay_cs)

    def push_payload(self) -> dict[str, Any]:
        """Panel state + GIF + DY USB frames (power → brightness → GIF upload).

        Secondary developers can write ``usb.framesHex`` to a matching serial
        port, or upload ``gifBase64`` through the official closed companion HTTP
        API when that companion is installed separately.
        """
        gif = self.to_gif_bytes()
        # Brightness API is 0–100; on-wire command uses 0–255.
        wire_brightness = max(0, min(255, int(round(self._brightness * 255 / 100))))
        transfer = usb_frames.encode_gif_upload(gif)
        frames = [
            usb_frames.build_screen_power(self._power),
            usb_frames.build_brightness(wire_brightness),
            transfer.preamble,
            *transfer.chunks,
            transfer.finish,
        ]
        return {
            "ok": True,
            "state": self.get_state(include_pixels=False),
            "gifBase64": base64.b64encode(gif).decode("ascii"),
            "transport": "usb-dy",
            "usb": {
                "baudrate": usb_frames.DEFAULT_BAUDRATE,
                "framesHex": [frame.hex().upper() for frame in frames],
                "frameCount": len(frames),
            },
        }


def _quantize_frame(pixels: Sequence[RGB_TUPLE]) -> tuple[list[RGB_TUPLE], list[int]]:
    """Build a ≤128-color palette (good enough for panel previews / GIF push)."""
    palette: list[RGB_TUPLE] = []
    index_by_color: dict[RGB_TUPLE, int] = {}
    indices: list[int] = []
    for rgb in pixels:
        # Mild channel quantize to keep palette small.
        key = (rgb[0] & 0xF0, rgb[1] & 0xF0, rgb[2] & 0xF0)
        idx = index_by_color.get(key)
        if idx is None:
            if len(palette) >= 128:
                # Nearest existing
                idx = min(
                    range(len(palette)),
                    key=lambda i: abs(palette[i][0] - key[0])
                    + abs(palette[i][1] - key[1])
                    + abs(palette[i][2] - key[2]),
                )
            else:
                idx = len(palette)
                palette.append(key)
                index_by_color[key] = idx
        indices.append(idx)
    if not palette:
        palette = [(0, 0, 0)]
    return palette, indices


def _gif_from_indexed(
    width: int,
    height: int,
    palette: Sequence[RGB_TUPLE],
    frames: Sequence[Sequence[int]],
    delay_cs: int,
) -> bytes:
    size = 1
    while (1 << size) < max(2, len(palette)):
        size += 1
    table_size = 1 << size
    color_table = bytearray()
    for i in range(table_size):
        if i < len(palette):
            color_table.extend(palette[i])
        else:
            color_table.extend((0, 0, 0))

    gif = bytearray(b"GIF89a")
    gif.extend(width.to_bytes(2, "little"))
    gif.extend(height.to_bytes(2, "little"))
    gif.append(0x80 | ((size - 1) & 0x07))
    gif.append(0x00)
    gif.append(0x00)
    gif.extend(color_table)
    gif.extend(b"\x21\xff\x0bNETSCAPE2.0\x03\x01\x00\x00\x00")

    min_code_size = max(2, size)
    for pixels in frames:
        image_data = _gif_lzw(list(pixels), min_code_size)
        blocks = bytearray()
        for offset in range(0, len(image_data), 255):
            chunk = image_data[offset : offset + 255]
            blocks.append(len(chunk))
            blocks.extend(chunk)
        blocks.append(0)
        gif.extend(b"\x21\xf9\x04\x04")
        gif.extend(int(delay_cs).to_bytes(2, "little"))
        gif.extend(b"\x00\x00")
        gif.extend(b"\x2c\x00\x00\x00\x00")
        gif.extend(width.to_bytes(2, "little"))
        gif.extend(height.to_bytes(2, "little"))
        gif.append(0x00)
        gif.append(min_code_size)
        gif.extend(blocks)
    gif.append(0x3B)
    return bytes(gif)


def _gif_lzw(indices: list[int], min_code_size: int) -> bytes:
    clear = 1 << min_code_size
    end = clear + 1
    code_size = min_code_size + 1
    next_code = end + 1
    dictionary: dict[tuple[int, ...], int] = {(i,): i for i in range(clear)}

    out = bytearray()
    buf = 0
    buf_bits = 0

    def write_code(code: int) -> None:
        nonlocal buf, buf_bits, code_size
        buf |= code << buf_bits
        buf_bits += code_size
        while buf_bits >= 8:
            out.append(buf & 0xFF)
            buf >>= 8
            buf_bits -= 8

    write_code(clear)
    w: tuple[int, ...] = ()
    for index in indices:
        wk = w + (index,)
        if wk in dictionary:
            w = wk
            continue
        write_code(dictionary[w])
        if next_code < 4096:
            dictionary[wk] = next_code
            next_code += 1
            if next_code == (1 << code_size) and code_size < 12:
                code_size += 1
        else:
            write_code(clear)
            dictionary = {(i,): i for i in range(clear)}
            code_size = min_code_size + 1
            next_code = end + 1
        w = (index,)
    if w:
        write_code(dictionary[w])
    write_code(end)
    if buf_bits:
        out.append(buf & 0xFF)
    return bytes(out)


def render_countdown_frame(
    api: MatrixDisplayAPI,
    *,
    remaining_seconds: int,
    total_seconds: int,
) -> bytes:
    """Example runnable layout used by the plugin countdown path."""
    api.clear()
    api.draw_rect(0, 0, MATRIX_WIDTH, MATRIX_HEIGHT, (8, 8, 12), filled=True)
    remaining = max(0, int(remaining_seconds))
    total = max(1, int(total_seconds))
    minutes, seconds = divmod(remaining, 60)
    hours, minutes = divmod(minutes, 60)
    if total >= 3600:
        label = f"{min(99, hours):02d}:{minutes:02d}"
    else:
        label = f"{min(99, minutes):02d}:{seconds:02d}"
    api.draw_text(label, 8, 16, (255, 220, 80), scale=2)
    bar_w = max(1, int(MATRIX_WIDTH * (remaining / total)))
    api.draw_rect(2, 44, MATRIX_WIDTH - 4, 6, (40, 40, 40), filled=True)
    api.draw_rect(2, 44, max(0, bar_w - 4), 6, (80, 200, 120), filled=True)
    return api.to_gif_bytes()
