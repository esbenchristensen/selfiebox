#!/usr/bin/env python3
"""Check every print-ready STL against the Bambu Lab H2C safe zone.

Rules
- H2C single-nozzle volume 305 x 320 x 325 mm. Footprint must fit inside
  285 x 306 mm (at least 7 mm clear of every bed edge), height at or under 305 mm.
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

BED_X, BED_Y = 305.0, 320.0
SAFE_X, SAFE_Y = 285.0, 306.0
SAFE_Z = 305.0
TOWER_STRIP = 50.0

# bodies that are not printed alone: they are loaded into the same object as
# their bezel and assigned a second filament
CO_PRINTED = {"sign_letters": "sign_front"}

# parts that use AMS swaps (translucent stripe, sign letters)

MULTI_MATERIAL = {"shell", "shell_closed_top", "instax_shell"}

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
    if x > SAFE_X or y > SAFE_Y:
        problems.append(f"footprint {x:.0f}x{y:.0f} exceeds {SAFE_X:.0f}x{SAFE_Y:.0f}")
    if z > SAFE_Z:
        problems.append(f"height {z:.0f} exceeds {SAFE_Z:.0f}")
    if path.stem in MULTI_MATERIAL and BED_X - x < TOWER_STRIP and BED_Y - y < TOWER_STRIP:
        problems.append("no room for the prime tower")
    if not m.is_watertight:
        problems.append("not watertight")
    if bodies != 1 and path.stem not in set(CO_PRINTED) | {"sign_front"}:
        problems.append(f"{bodies} separate bodies")
    if path.stem in CO_PRINTED:
        print(f"--   {path.stem:16s} {x:6.1f} x {y:6.1f} x {z:6.1f} mm  co-printed inside {CO_PRINTED[path.stem]}")
        return True
    if contact < min(1.0, 0.25 * x * y / 100):   # small parts need proportionally less
        problems.append(f"only {contact:.1f} cm2 on the bed")
    status = "OK  " if not problems else "FAIL"
    tag = " (AMS)" if path.stem in MULTI_MATERIAL else ""
    print(f"{status} {path.stem:16s} {x:6.1f} x {y:6.1f} x {z:6.1f} mm  bed {contact:6.1f} cm2{tag}"
          + ("" if not problems else "  <- " + "; ".join(problems)))
    return not problems

def main() -> int:
    stl_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "stl"
    results = [check(p) for p in sorted(stl_dir.glob("*.stl"))]
    print(f"\n{sum(results)}/{len(results)} parts inside the H2C safe zone "
          f"({SAFE_X:.0f} x {SAFE_Y:.0f} x {SAFE_Z:.0f} mm)")
    return 0 if all(results) else 1

if __name__ == "__main__":
    sys.exit(main())
