# JSAUX PIXEL / MatrixLink (opensource)

This repository contains the open-source parts of the JSAUX PIXEL software for the
**Pixel Matrix Faceplate for Steam Machine**: the USB connection protocol docs, a
reference codec, the LED matrix API, and the Decky plugin sources.

For everyday use, install the official JSAUX PIXEL release from
[the Steam Machine faceplate app installation guide](https://jsaux.com/pages/steam-machine-faceplate-app-installation-guide).

[简体中文](./README-zh.md)

## About this repository

| | |
|--|--|
| **Product** | Pixel Matrix Faceplate for Steam Machine |
| **Corresponds to** | Official JSAUX PIXEL **V1.2** software line |
| **Official download / install** | [jsaux.com installation guide](https://jsaux.com/pages/steam-machine-faceplate-app-installation-guide) |
| **Changelog** | [`CHANGELOG.md`](./CHANGELOG.md) |
| **Feedback** | [GitHub Issues](https://github.com/JSAUX-Open-Source/jsaux-matrixlink/issues) |
| **Security** | [`SECURITY.md`](./SECURITY.md) (`security@jsaux.com`) |
| **Contributing** | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |

## What is open here

This tip **opens the host-side connection protocol and plugin sources**. The official
companion application (`jsaux-matrix-daemon`, Studio) remains closed and is
distributed only with the official JSAUX PIXEL release.

| Open in this repository | Not part of this release |
|-------------------------|--------------------------|
| [USB host↔device connection protocol](docs/protocols/usb-serial-connection.md) | Firmware, manufacturing tools, and the official companion app |
| Reference codec [`protocols/usb/`](protocols/usb/) | Chip / PCBA / LED-driver silicon details |
| [LED matrix host API](docs/protocols/matrix-led-api.md) | Qt runtime redistributables for the closed installer |
| Decky plugin orchestration + checked-in UI bundle | Bundled Codex CLI / login UI |

Without the official companion, most Decky product UX (live device status, display
modes, custom assets, timers, panel sync) will not talk to hardware. From this tip
alone you can still study the protocol docs, run the LED API / codec unit tests, and
inspect the plugin sources.

## Storage writes

On faceplates shipped before November 2026, every frame you upload is saved to the
faceplate's storage. Displaying an uploaded image or GIF does not wear the storage,
but uploading new frames over and over does. If you build on the LED API or frame
export, upload only when the content changes, and avoid redrawing every second.

## AI Agent (optional)

Shows a local Codex **session name** and whether Codex appears **running**, using
only on-device session files under `~/.codex/` (no network, no OAuth, no usage APIs).
This tip does not ship a Codex binary or any login UI.

## Frontend note

`decky-plugin/dist/index.js` is the checked-in Decky UI bundle. Matching TSX sources
are not in this tip, so the UI cannot be fully rebuilt from this repository alone.
Framing helpers in the bundle match `protocols/usb` (CRC-16/KERMIT).

## Replace the official Decky plugin

If the official closed companion is already installed, you can overlay this tip’s
plugin sources on top of it. See [`docs/replace-official-plugin.md`](docs/replace-official-plugin.md).

## Packaging helpers (plugin sources only)

- `Install Decky Plugin (opensource).desktop`
- `Remove Decky Plugin (opensource).desktop`

## Build / test

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j2
ctest --test-dir build --output-on-failure

python3 tests/test_usb_dy_frame.py
python3 tests/test_matrix_api.py
node tests/plugin_ui_test.js
# or: python3 tools/run_device_tests.py
```

## Companion HTTP API

Set `JSAUX_DAEMON_URL` / `JSAUX_REFRESH_URL` only when a separately installed
official closed companion is already running.

## License

See root [`LICENSE`](./LICENSE) (MIT) for this repository’s open sources.
Third-party components remain under their own terms — see [`NOTICE`](./NOTICE).
Closed companion binaries obtained separately are **not** MIT-licensed by this tip.
