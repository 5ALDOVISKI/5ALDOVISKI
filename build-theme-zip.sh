#!/usr/bin/env bash
#
# Builds an upload-ready Shopify theme ZIP for MAYDAN Fightwear.
# The archive contains the theme directories at its ROOT (assets/, config/, …),
# which is what "Online Store → Themes → Upload zip file" expects.
#
# Usage:  ./build-theme-zip.sh
# Output: maydan-fightwear.zip   (in the repo root)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
THEME_DIR="$ROOT_DIR/maydan-fightwear"
OUT="$ROOT_DIR/maydan-fightwear.zip"

if [ ! -d "$THEME_DIR" ]; then
  echo "Theme directory not found: $THEME_DIR" >&2
  exit 1
fi

rm -f "$OUT"
cd "$THEME_DIR"

zip -r -X "$OUT" \
  assets config layout locales sections snippets templates \
  README.md .theme-check.yml \
  -x "*.DS_Store" -x "__MACOSX*" >/dev/null

echo "Built: $OUT"
unzip -l "$OUT" | tail -n 1
echo "Top-level entries:"
unzip -Z1 "$OUT" | awk -F/ '{print $1}' | sort -u
