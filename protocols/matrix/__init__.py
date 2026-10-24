"""Standalone re-export of the LED matrix host API.

Prefer importing from the Decky plugin package when running inside Decky::

    from backend.matrix_api import MatrixDisplayAPI

This module mirrors the same API for secondary development outside Decky by
loading the plugin backend implementation.
"""

from __future__ import annotations

import sys
from pathlib import Path

_PLUGIN_BACKEND = Path(__file__).resolve().parents[2] / "decky-plugin"
if str(_PLUGIN_BACKEND) not in sys.path:
    sys.path.insert(0, str(_PLUGIN_BACKEND))

from backend.matrix_api import (  # noqa: E402
    MATRIX_HEIGHT,
    MATRIX_LED_COUNT,
    MATRIX_WIDTH,
    LedPixel,
    MatrixDisplayAPI,
    render_countdown_frame,
)

__all__ = [
    "MATRIX_HEIGHT",
    "MATRIX_LED_COUNT",
    "MATRIX_WIDTH",
    "LedPixel",
    "MatrixDisplayAPI",
    "render_countdown_frame",
]
