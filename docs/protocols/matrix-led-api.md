# Matrix LED host API

Runnable host API for the RGB LED matrix (backend → frontend contract).
This is the **supported secondary-development surface** in the opensource tip.

## Geometry

| Constant | Value |
|----------|-------|
| Width | **64** |
| Height | **54** |
| LED count | 3456 |

## Control layers (outer → inner)

1. **`set_power(enabled)`** — whole panel on/off  
2. **`set_brightness(0–100)`** — global brightness  
3. **`set_led` / `set_leds` / `fill` / `clear`** — each LED RGB (0–255)

## Frontend view

`get_state(include_pixels=False|True)` returns:

```json
{
  "ok": true,
  "width": 64,
  "height": 54,
  "power": true,
  "brightness": 80,
  "display": { "power": true, "brightness": 80, "layout": "64x54" },
  "pixels": [ { "x": 0, "y": 0, "r": 0, "g": 0, "b": 0 }, "...optional" ]
}
```

## Push / apply to hardware

`push_payload()` returns in-memory `state` + `gifBase64` + DY USB frames:

- `transport`: `"usb-dy"`
- `usb.framesHex`: power → brightness → GIF begin/chunks/end (connection protocol)
- `usb.baudrate`: default host baud rate

Apply via USB serial using those frames, or upload `gifBase64` through the official
closed companion HTTP API when that companion is installed separately.

## Decky RPC

| Method | Purpose |
|--------|---------|
| `matrix_get_state` | Backend tells frontend how to show the panel |
| `matrix_set_power` | Whole-panel switch |
| `matrix_set_brightness` | Global brightness |
| `matrix_set_led` / `matrix_set_leds` | Per-LED colors |
| `matrix_fill` / `matrix_clear` | Bulk color |
| `matrix_push` | State + GIF + DY USB frames |

## Code

- Plugin: `decky-plugin/backend/matrix_api.py`
- Codec: `protocols/usb/dy_frame.py`
