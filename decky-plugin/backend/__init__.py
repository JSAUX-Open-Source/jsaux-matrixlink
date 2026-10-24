"""Decky plugin backend package."""

from .matrix_api import (
    MATRIX_HEIGHT,
    MATRIX_LED_COUNT,
    MATRIX_WIDTH,
    MatrixDisplayAPI,
    render_countdown_frame,
)

__all__ = [
    "MATRIX_HEIGHT",
    "MATRIX_LED_COUNT",
    "MATRIX_WIDTH",
    "MatrixDisplayAPI",
    "render_countdown_frame",
]
