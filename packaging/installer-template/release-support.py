#!/usr/bin/env python3
"""Opensource cleanup helper.

Removes Decky plugin install crumbs and, if present, leftover closed-companion
paths from a previous official installer. This tip does not ship or verify
closed ELFs / Qt / Codex bundles.
"""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

PLUGIN_PATHS = [
    "homebrew/plugins/Jsaux-Matrix-Display",
    "homebrew/plugins/JSAUX-Matrix-Hub",
]

# Best-effort cleanup of closed-companion leftovers (only if already installed).
CLOSED_LEFTOVER_PATHS = [
    ".local/bin/jsaux-matrix-daemon",
    ".local/bin/jsaux-matrix-studio",
    ".local/bin/jsaux-matrix-studio-v12",
    ".local/bin/jsaux-matrixlink-uninstall",
    ".local/bin/jsaux-ui-language.sh",
    ".local/bin/jsaux-release-support.py",
    ".local/lib/jsaux-matrixlink",
    ".local/share/applications/jsaux-matrixlink.desktop",
    ".local/share/applications/jsaux-matrixlink-uninstall.desktop",
    ".local/share/icons/hicolor/scalable/apps/jsaux-matrixlink.svg",
    ".config/systemd/user/jsaux-matrix-hub.service",
    ".config/systemd/user/jsaux-matrix-hub.service.d",
    ".config/systemd/user/default.target.wants/jsaux-matrix-hub.service",
    "Desktop/JSAUX PIXEL.desktop",
    "Desktop/JSAUX MatrixLink.desktop",
]


def home_path(value: str) -> Path:
    path = Path(value).expanduser().resolve()
    if not path.is_absolute() or path == Path("/") or not path.is_dir():
        raise ValueError("Unsafe target home")
    return path


def safe_target(home: Path, relative: str) -> Path:
    rel = Path(relative)
    if rel.is_absolute() or ".." in rel.parts:
        raise ValueError("Unsafe relative path")
    dest = (home / rel).resolve()
    if not dest.is_relative_to(home):
        raise ValueError("Target escapes home")
    return dest


def remove_path(path: Path) -> None:
    if path.is_symlink() or path.is_file():
        path.unlink(missing_ok=True)
    elif path.is_dir():
        shutil.rmtree(path, ignore_errors=True)


def cmd_cleanup(home: Path) -> int:
    for relative in PLUGIN_PATHS + CLOSED_LEFTOVER_PATHS:
        remove_path(safe_target(home, relative))
    print("opensource cleanup complete")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["cleanup"])
    parser.add_argument("--home", required=True)
    args = parser.parse_args()
    home = home_path(args.home)
    if args.command == "cleanup":
        return cmd_cleanup(home)
    raise SystemExit(2)


if __name__ == "__main__":
    raise SystemExit(main())
