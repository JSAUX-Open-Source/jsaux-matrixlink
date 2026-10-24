#!/usr/bin/env python3
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from protocols.usb.dy_frame import (  # noqa: E402
    build_brightness,
    build_gif_begin,
    build_screen_power,
    crc16_kermit,
    crc32_ieee,
    encode_gif_upload,
    is_known_usb_ids,
    parse_frame,
)


class DyFrameTests(unittest.TestCase):
    def test_crc16_reference_sample(self) -> None:
        # From historical host codec comments (reference appendix sample).
        body = bytes.fromhex("445901040008000004A46CEAA064")
        self.assertEqual(crc16_kermit(body), 0x2CF6)

    def test_screen_power_roundtrip(self) -> None:
        frame = build_screen_power(True)
        parsed = parse_frame(frame)
        self.assertEqual(parsed.transport_type, 0x01)
        self.assertEqual(parsed.command, 0x01)
        self.assertEqual(parsed.payload, b"\x01")

    def test_brightness_and_gif_session(self) -> None:
        bright = parse_frame(build_brightness(80))
        self.assertEqual(bright.payload, bytes([80]))
        gif = b"GIF89a" + b"\x00" * 20
        transfer = encode_gif_upload(gif, chunk_size=8)
        begin = parse_frame(transfer.preamble)
        self.assertEqual(begin.command, 0x04)
        size = int.from_bytes(begin.payload[0:4], "big")
        digest = int.from_bytes(begin.payload[4:8], "big")
        self.assertEqual(size, len(gif))
        self.assertEqual(digest, crc32_ieee(gif))
        self.assertGreaterEqual(len(transfer.chunks), 1)
        self.assertEqual(parse_frame(transfer.finish).command, 0x0B)

    def test_gif_begin_builder_matches_crc_layout(self) -> None:
        frame = build_gif_begin(0x04A4, 0x6CEAA064)
        self.assertTrue(frame.endswith(bytes.fromhex("2CF6")))

    def test_vid_pid_whitelist(self) -> None:
        self.assertTrue(is_known_usb_ids(0x1A86, 0x7523))
        self.assertFalse(is_known_usb_ids(0x1234, 0x7523))


if __name__ == "__main__":
    unittest.main()
