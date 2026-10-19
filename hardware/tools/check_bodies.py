#!/usr/bin/env python3
"""Every print file must be one solid body: a part that falls apart into loose pieces in the slicer
(halo-gen2-v2's frame: cross bars 0.4 mm from the ring, reflector 0.24 mm above the floor) prints badly or not at all.

Usage: python3 hardware/tools/check_bodies.py [stl dir ...]   (default: the newest hardware/stl/gen2/halo-gen2-v*)
Needs trimesh and networkx.
"""
import sys
from pathlib import Path

import trimesh

GEN2 = Path(__file__).resolve().parents[1] / "stl" / "gen2"


def newest():
    return [max(GEN2.glob("halo-gen2-v*"), key=lambda p: int(p.name.rsplit("v", 1)[1]))]


def main():
    dirs = [Path(a) for a in sys.argv[1:]] or newest()
    bad = 0
    for d in dirs:
        for f in sorted(d.glob("*.stl")):
            m = trimesh.load(f)
            n = len(m.split(only_watertight=False))
            ok = n == 1 and m.is_watertight
            bad += not ok
            print(f"{'OK  ' if ok else 'FEJL'} {f.name}: {n} krop(pe){'' if m.is_watertight else ', ikke lukket'}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
