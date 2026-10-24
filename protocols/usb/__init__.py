"""USB serial DY framing helpers for JSAUX PIXEL (host connection protocol)."""

from .dy_frame import (
    DEFAULT_BAUDRATE,
    GIF_CHUNK_DATA_SIZE,
    KNOWN_PIDS,
    KNOWN_VIDS,
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
    "DEFAULT_BAUDRATE",
    "GIF_CHUNK_DATA_SIZE",
    "KNOWN_PIDS",
    "KNOWN_VIDS",
    "build_brightness",
    "build_builtin_animation",
    "build_gif_begin",
    "build_gif_chunk",
    "build_gif_end",
    "build_screen_power",
    "build_standard_frame",
    "crc16_kermit",
    "crc32_ieee",
    "encode_gif_upload",
    "is_known_usb_ids",
    "parse_frame",
]
