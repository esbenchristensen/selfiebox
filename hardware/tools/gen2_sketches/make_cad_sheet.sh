#!/bin/sh
# Line sheet of the gen 2 concept straight from the CAD: OpenSCAD projections/sections -> SVG -> PNG.
# usage: hardware/tools/gen2_sketches/make_cad_sheet.sh <out.png>
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
for f in views/*.scad; do openscad -o "$OUT/$(basename "${f%.scad}").svg" "$f" >/dev/null 2>&1 || true; done
python3 cad_sheet.py "$OUT" "${1:-cad_sheet.png}"
