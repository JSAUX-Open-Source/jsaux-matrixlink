# Decky plugin (opensource tip)

Python backend (`main.py`) + checked-in UI bundle (`dist/index.js`).

- Talks to a **separately installed** closed companion over local HTTP when present.
- Exposes `MatrixDisplayAPI` RPCs for secondary development.
- AI Agent: local Codex session name + running state only (no OAuth / usage APIs).
- The original TSX project is **not** shipped here; do not expect a reproducible UI rebuild from this tip alone.
