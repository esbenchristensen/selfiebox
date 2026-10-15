#!/usr/bin/env python3
"""Check every print-ready STL against the Bambu Lab P2S safe zone.

Rules
- Footprint must fit inside 236 x 236 mm (10 mm clear of every bed edge).
- Height must stay at or under 240 mm.
- Parts printed with AMS filament swaps must leave a strip of at least 50 mm
  free along one side of the plate, so the prime tower fits.
- The part must be one watertight body, and it must sit flat on the bed
  (minimum contact area).

Usage: python3 tools/check_bed.py [stl_dir]
Needs: pip install trimesh numpy networkx
"""
import sys
from pathlib import Path

import numpy as np
import trimesh

BED = 256.0
SAFE_XY = 236.0
SAFE_Z = 240.0
TOWER_STRIP = 50.0

# bodies that are not printed alone: they are loaded into the same object as
# their bezel and assigned a second filament
CO_PRINTED = {"camera_ring": "bezel", "printer_label": "printer_front", "sign_letters": "sign_front"}

# parts that use AMS swaps (camera ring / label / sign letters, translucent band)

MULTI_MATERIAL = {"bezel", "shell", "shell_closed_top", "printer_front", "printer_shell",
                  "sign_front", "sign_shell"}

def check(path: Path) -> bool:
    m = trimesh.load(path)
    ext = m.bounds[1] - m.bounds[0]
    x, y, z = ext
    z0 = m.bounds[0][2]
    top_z = m.triangles[:, :, 2].max(axis=1)
    down = (np.abs(top_z - z0) < 0.01) & (m.face_normals[:, 2] < -0.99)
    contact = m.area_faces[down].sum() / 100.0
    bodies = len(m.split(only_watertight=False))
    problems = []
    if max(x, y) > SAFE_XY:
        problems.append(f"footprint {x:.0f}x{y:.0f} exceeds {SAFE_XY:.0f}")
    if z > SAFE_Z:
        problems.append(f"height {z:.0f} exceeds {SAFE_Z:.0f}")
    if path.stem in MULTI_MATERIAL and BED - min(x, y) < TOWER_STRIP:
        problems.append("no room for the prime tower")
    if not m.is_watertight:
        problems.append("not watertight")
    if bodies != 1 and path.stem not in set(CO_PRINTED) | {"sign_front"}:
        problems.append(f"{bodies} separate bodies")
    if path.stem in CO_PRINTED:
        print(f"--   {path.stem:16s} {x:6.1f} x {y:6.1f} x {z:6.1f} mm  co-printed inside {CO_PRINTED[path.stem]}")
        return True
    if contact < 1.0:
        problems.append(f"only {contact:.1f} cm2 on the bed")
    status = "OK  " if not problems else "FAIL"
    tag = " (AMS)" if path.stem in MULTI_MATERIAL else ""
    print(f"{status} {path.stem:16s} {x:6.1f} x {y:6.1f} x {z:6.1f} mm  bed {contact:6.1f} cm2{tag}"
          + ("" if not problems else "  <- " + "; ".join(problems)))
    return not problems

def main() -> int:
    stl_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "stl"
    results = [check(p) for p in sorted(stl_dir.glob("*.stl"))]
    print(f"\n{sum(results)}/{len(results)} parts inside the P2S safe zone "
          f"({SAFE_XY:.0f} x {SAFE_XY:.0f} x {SAFE_Z:.0f} mm)")
    return 0 if all(results) else 1

if __name__ == "__main__":
    sys.exit(main())
