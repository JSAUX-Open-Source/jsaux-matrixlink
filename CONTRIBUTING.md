# Contributing

Thanks for interest in the JSAUX PIXEL opensource tip.

## Before you start

- Everyday product use needs the **official JSAUX PIXEL release** (closed companion).
  See the [installation guide](https://jsaux.com/pages/steam-machine-faceplate-app-installation-guide).
- Replacing the official Decky plugin with this tip is documented in
  [`docs/replace-official-plugin.md`](docs/replace-official-plugin.md).

## What we accept here

| Accept | Do not file here |
|--------|------------------|
| Fixes to protocol docs / `protocols/usb` | Firmware / PCBA / LED-driver silicon issues |
| LED API / codec / unit tests | Closed companion (`daemon` / Studio) bugs |
| Plugin Python orchestration (`main.py`, `backend/`) | Requests to open closed binaries |
| Docs / packaging helpers for this tip | Hardware RMA / warranty claims |

## Frontend UI (`dist/index.js`)

Matching TSX sources are **not** in this tip. Please **do not** open PRs that
only rewrite `decky-plugin/dist/index.js` by hand. UI rebuild work needs the
source project to be restored first.

## Development checks

```bash
python3 tools/run_device_tests.py
# same as:
python3 tests/test_usb_dy_frame.py
python3 tests/test_matrix_api.py
node tests/plugin_ui_test.js
```

Optional CMake policy tests (Linux + Qt6 headers):

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j2
ctest --test-dir build --output-on-failure
```

## Pull requests

1. Keep changes focused and documented.
2. Run `python3 tools/run_device_tests.py` before opening a PR.
3. Do not commit secrets, `auth.json`, closed ELFs, or personal paths.

## Code of conduct

See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).
