#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_PARENT_DIR="$ROOT_DIR/skills"
SKILL_NAME="ds-fips"
OUT_DIR="$ROOT_DIR/public/downloads"
OUT_FILE="$OUT_DIR/${SKILL_NAME}-skill.zip"

mkdir -p "$OUT_DIR"
rm -f "$OUT_FILE"

if command -v zip >/dev/null 2>&1; then
  (
    cd "$SKILL_PARENT_DIR"
    zip -rq "$OUT_FILE" "$SKILL_NAME"
  )
else
  python3 - <<PY
import pathlib
import zipfile

root = pathlib.Path(r"$SKILL_PARENT_DIR")
skill_dir = root / "$SKILL_NAME"
out_file = pathlib.Path(r"$OUT_FILE")

with zipfile.ZipFile(out_file, "w", zipfile.ZIP_DEFLATED) as zf:
    for path in skill_dir.rglob("*"):
        if path.is_file():
            zf.write(path, path.relative_to(root))
PY
fi

echo "Created $OUT_FILE"
