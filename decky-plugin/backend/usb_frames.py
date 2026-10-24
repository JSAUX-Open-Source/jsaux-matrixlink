"""USB DY frame helpers for the Decky plugin backend.

Re-exports the opensource reference codec in ``protocols.usb``.
Firmware and manufacturing tooling are not part of this release.
"""

from __future__ import annotations

import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[2]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from protocols.usb.dy_frame import (  # noqa: E402
    KNOWN_PIDS,
    KNOWN_VIDS,
    DEFAULT_BAUDRATE,
    build_brightness,
    build_builtin_animation,
    build_gif_begin,
    build_gif_chunk,
    build_gif_end,
    build_screen_power,
    build_standard_frame,
    crc16_kermit,
    crc32_ieee,
    encode_gif_upload,
    is_known_usb_ids,
    parse_frame,
)

__all__ = [
    "KNOWN_VIDS",
    "KNOWN_PIDS",
    "DEFAULT_BAUDRATE",
    "build_standard_frame",
    "build_screen_power",
    "build_brightness",
    "build_builtin_animation",
    "build_gif_begin",
    "build_gif_chunk",
    "build_gif_end",
    "encode_gif_upload",
    "parse_frame",
    "crc16_kermit",
    "crc32_ieee",
    "is_known_usb_ids",
]
