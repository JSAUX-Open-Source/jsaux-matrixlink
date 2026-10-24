#!/usr/bin/env python3
"""Run opensource tip checks that do not need closed companion binaries."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    checks = [
        [sys.executable, str(ROOT / "tests" / "test_usb_dy_frame.py")],
        [sys.executable, str(ROOT / "tests" / "test_matrix_api.py")],
        ["node", str(ROOT / "tests" / "plugin_ui_test.js")],
    ]
    for cmd in checks:
        print("+", " ".join(cmd))
        subprocess.run(cmd, check=True, cwd=ROOT)
    print("PASS opensource tip unit checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
