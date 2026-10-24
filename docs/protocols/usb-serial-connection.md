# USB serial connection protocol (host)

Host-side USB-CDC/serial framing used by JSAUX PIXEL matrix products.
This document does **not** describe on-chip firmware, flash maps, or manufacturing / ISP tooling.

## Physical / serial link

| Item | Value |
|------|-------|
| Link | USB ↔ UART bridge (CDC / serial-class adapters) |
| VID allowlist | `0x1A86`, `0x4348` |
| PID allowlist | `0x7523`, `0x5523` |
| Baud | `1_000_000` |
| Data | 8N1, no flow control |
| Host scan | Poll available TTYs; accept only VID/PID whitelist matches |

A device must match **one allowlisted VID and one allowlisted PID**.

## Standard frame (host ↔ device)

All multi-byte integers below are **big-endian** unless noted.

| Field | Size | Value / notes |
|-------|------|----------------|
| Header | 2 | `0x44 0x59` (`DY`) |
| TransportType | 1 | `0x01` control / session; `0x02` GIF data chunk |
| Command | 1 | See command table |
| PayloadLength | 2 | Byte length of payload |
| Payload | N | Command-specific |
| CRC16 | 2 | CRC-16/KERMIT over all preceding bytes |

### CRC-16/KERMIT

- Init: `0x0000`
- Reflect poly constant: `0x8408`
- Process each byte LSB-first (standard Kermit/CCITT-reflected shift)
- Append CRC as big-endian `uint16`

Reply frames use the **same** layout. Hosts must recompute CRC over `frame[:-2]` and compare to the trailing two bytes.

## Host commands

| API name | Transport | Command | Payload | Purpose |
|----------|-----------|---------|---------|---------|
| Screen power | `0x01` | `0x01` | `0x01` on / `0x00` off | Power panel output |
| Brightness | `0x01` | `0x02` | 1 byte level | Set brightness |
| Built-in animation | `0x01` | `0x21` | 1 byte animation id | Play device animation |
| GIF begin | `0x01` | `0x04` | `dataSize` BE u32 + `crc32` BE u32 | Start GIF upload |
| GIF chunk | `0x02` | `0x02` | `sequence` BE u16 + raw bytes | GIF fragment |
| GIF end | `0x01` | `0x0B` | `0x01` | Finalize / display |

### GIF payload CRC-32

Whole GIF blob checksum carried in **GIF begin**:

- Init `0xFFFFFFFF`, poly `0xEDB88320`, LSB-first, final bitwise NOT

Default host chunk size in reference code: **498** payload data bytes per chunk (plus 2-byte sequence inside the DY payload).

## Timing / retry (host policy)

| Parameter | Typical value |
|-----------|----------------|
| Write timeout | 1000 ms |
| Reply timeout | 1000 ms (finalize may scale with size, capped) |
| Inter-packet delay | 12 ms |
| Per-packet retries | 3 |
| Full transfer session retries | 2 |

## Reply status conventions (GIF session)

Status is the first payload byte of a matching reply (`Transport`/`Command` echo expected values):

| Phase | Status | Meaning |
|-------|--------|---------|
| GIF begin | `0x00` | Rejected |
| GIF begin | `0x02` | Same content / skip remaining chunks |
| GIF begin | other | Continue uploading chunks |
| GIF chunk | `0x00` | Chunk rejected |
| GIF end | `0x00` | Finalize rejected |

No reply, truncated frame, CRC mismatch, or unexpected transport/command → treat as retryable link error.

## Out of scope

- Chip firmware binaries, bootloader protocols, flash part programming
- Panel electrical supply-port heuristics unrelated to DY framing
- Closed companion daemon / desktop binaries

## Reference implementation

See `protocols/usb/` (Python) for CRC helpers and frame builders usable for secondary development.
