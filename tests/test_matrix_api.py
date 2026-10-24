#!/usr/bin/env python3
from __future__ import annotations

import base64
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "decky-plugin"))

from backend.matrix_api import (  # noqa: E402
    MATRIX_HEIGHT,
    MATRIX_LED_COUNT,
    MATRIX_WIDTH,
    MatrixDisplayAPI,
    render_countdown_frame,
)


class MatrixApiTests(unittest.TestCase):
    def test_geometry(self) -> None:
        self.assertEqual(MATRIX_WIDTH, 64)
        self.assertEqual(MATRIX_HEIGHT, 54)
        self.assertEqual(MATRIX_LED_COUNT, 64 * 54)

    def test_power_brightness_led_layers(self) -> None:
        api = MatrixDisplayAPI()
        api.set_power(False)
        api.set_brightness(50)
        api.set_led(1, 2, 255, 0, 0)
        state = api.get_state(include_pixels=True)
        self.assertFalse(state["power"])
        self.assertEqual(state["brightness"], 50)
        self.assertEqual(state["display"]["layout"], "64x54")
        pixel = next(p for p in state["pixels"] if p["x"] == 1 and p["y"] == 2)
        self.assertEqual((pixel["r"], pixel["g"], pixel["b"]), (255, 0, 0))

    def test_push_payload_includes_gif_and_usb_frames(self) -> None:
        api = MatrixDisplayAPI()
        api.fill(0, 0, 32)
        gif = api.to_gif_bytes()
        self.assertTrue(gif.startswith(b"GIF89a"))
        payload = api.push_payload()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["transport"], "usb-dy")
        usb = payload["usb"]
        self.assertIsInstance(usb, dict)
        self.assertGreaterEqual(usb["frameCount"], 3)
        self.assertTrue(all(isinstance(h, str) and h.startswith("4459") for h in usb["framesHex"]))
        decoded = base64.b64decode(payload["gifBase64"])
        self.assertEqual(decoded, gif)

    def test_countdown_renderer(self) -> None:
        api = MatrixDisplayAPI()
        gif = render_countdown_frame(api, remaining_seconds=125, total_seconds=300)
        self.assertTrue(gif.startswith(b"GIF89a"))


if __name__ == "__main__":
    unittest.main()
