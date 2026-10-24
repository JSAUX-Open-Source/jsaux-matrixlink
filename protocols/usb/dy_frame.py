"""Host-side DY USB-serial frame codec (connection protocol only)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

KNOWN_VIDS = (0x1A86, 0x4348)
KNOWN_PIDS = (0x7523, 0x5523)
DEFAULT_BAUDRATE = 1_000_000
GIF_CHUNK_DATA_SIZE = 498
HEADER = b"\x44\x59"


def crc16_kermit(data: bytes | bytearray | memoryview) -> int:
    crc = 0x0000
    for byte in data:
        crc ^= byte
        for _ in range(8):
            lsb = crc & 0x0001
            crc >>= 1
            if lsb:
                crc ^= 0x8408
    return crc & 0xFFFF


def crc32_ieee(data: bytes | bytearray | memoryview) -> int:
    crc = 0xFFFFFFFF
    for byte in data:
        crc ^= byte
        for _ in range(8):
            lsb = crc & 0x1
            crc >>= 1
            if lsb:
                crc ^= 0xEDB88320
    return (~crc) & 0xFFFFFFFF


def _be16(value: int) -> bytes:
    return int(value).to_bytes(2, "big", signed=False)


def _be32(value: int) -> bytes:
    return int(value).to_bytes(4, "big", signed=False)


def build_standard_frame(transport_type: int, command: int, payload: bytes = b"") -> bytes:
    body = bytearray()
    body.extend(HEADER)
    body.append(transport_type & 0xFF)
    body.append(command & 0xFF)
    body.extend(_be16(len(payload)))
    body.extend(payload)
    body.extend(_be16(crc16_kermit(body)))
    return bytes(body)


def build_screen_power(enabled: bool) -> bytes:
    return build_standard_frame(0x01, 0x01, bytes([0x01 if enabled else 0x00]))


def build_brightness(brightness: int) -> bytes:
    return build_standard_frame(0x01, 0x02, bytes([max(0, min(255, int(brightness)))]))


def build_builtin_animation(animation_id: int) -> bytes:
    return build_standard_frame(0x01, 0x21, bytes([animation_id & 0xFF]))


def build_gif_begin(data_size: int, data_crc32: int) -> bytes:
    payload = _be32(data_size) + _be32(data_crc32)
    return build_standard_frame(0x01, 0x04, payload)


def build_gif_chunk(sequence: int, data: bytes) -> bytes:
    payload = _be16(sequence) + data
    body = bytearray()
    body.extend(HEADER)
    body.append(0x02)
    body.append(0x02)
    body.extend(_be16(len(payload)))
    body.extend(payload)
    body.extend(_be16(crc16_kermit(body)))
    return bytes(body)


def build_gif_end() -> bytes:
    return build_standard_frame(0x01, 0x0B, b"\x01")


@dataclass(frozen=True)
class EncodedTransfer:
    preamble: bytes
    chunks: tuple[bytes, ...]
    finish: bytes


def encode_gif_upload(gif_data: bytes, chunk_size: int = GIF_CHUNK_DATA_SIZE) -> EncodedTransfer:
    size = max(1, int(chunk_size))
    chunks: list[bytes] = []
    sequence = 0
    for offset in range(0, len(gif_data), size):
        chunks.append(build_gif_chunk(sequence, gif_data[offset : offset + size]))
        sequence += 1
    return EncodedTransfer(
        preamble=build_gif_begin(len(gif_data), crc32_ieee(gif_data)),
        chunks=tuple(chunks),
        finish=build_gif_end(),
    )


@dataclass(frozen=True)
class ParsedFrame:
    transport_type: int
    command: int
    payload: bytes
    raw: bytes


def parse_frame(raw: bytes) -> ParsedFrame:
    if len(raw) < 8:
        raise ValueError("frame too short")
    if raw[0:2] != HEADER:
        raise ValueError("bad header")
    payload_length = int.from_bytes(raw[4:6], "big")
    total = 2 + 1 + 1 + 2 + payload_length + 2
    if len(raw) < total:
        raise ValueError("truncated frame")
    frame = raw[:total]
    expected = crc16_kermit(frame[:-2])
    actual = int.from_bytes(frame[-2:], "big")
    if expected != actual:
        raise ValueError(f"crc mismatch: expected=0x{expected:04X} actual=0x{actual:04X}")
    return ParsedFrame(
        transport_type=frame[2],
        command=frame[3],
        payload=frame[6 : 6 + payload_length],
        raw=frame,
    )


def is_known_usb_ids(vid: int, pid: int) -> bool:
    return vid in KNOWN_VIDS and pid in KNOWN_PIDS


def iter_chunk_payloads(transfer: EncodedTransfer) -> Iterable[bytes]:
    for chunk in transfer.chunks:
        parsed = parse_frame(chunk)
        yield parsed.payload[2:]
