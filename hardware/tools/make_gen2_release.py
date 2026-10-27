#!/usr/bin/env python3
"""Print files for a gen 2 version from cad/gen2_concept.scad: hardware/stl/gen2/<version>/.

Takes each printed part in its assembled position (VIEW="x_*"), turns it into its print orientation (the same turn as
its p_* view), centres it on the bed (x/y round 0, z from 0) and writes <version>_<name>.stl. The logo inlays get the front's print orientation and offset, so they keep their place
in the front (make_3mf.py puts the three into <version>_front_flerfarvet.3mf). Then the 3D model for the admin
viewer (render/gen2_viewer.py, from the x_/c_/s_ views in assembled position) and a check that every part is one
closed body (check_bodies.py). The PRINTGUIDE, wiring diagram and zip are made afterwards.

Usage:  python3 hardware/tools/make_gen2_release.py <version> [stl dir with the assembled views; rendered if left out,
        and then there is no 3D model]
Needs:  openscad, trimesh, manifold3d, numpy, networkx
"""
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import trimesh

HW = Path(__file__).resolve().parents[1]
SCAD = HW / "cad" / "gen2_concept.scad"
D = 70

# file suffix -> (assembled view, print orientation as in the p_* views: rotate([+-90, 0, 0]))
UP, DOWN = np.array([[1, 0, 0, 0], [0, 0, -1, 0], [0, 1, 0, 0], [0, 0, 0, 1]], float), np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)
SIDE = np.array([[0, 0, -1, 0], [0, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1]], float)   # v26: on its side, the -x face on the bed
PRINT = {"skal": ("x_shell3", DOWN), "front": ("x_front3", UP), "lysring": ("x_ring3", UP), "bagramme": ("x_frame3", DOWN),
         "vaegbeslag": ("x_cleat", DOWN), "kameraroer": ("x_camsleeve", DOWN),
         "blaeserhegn": ("x_fanguard", SIDE),   # v26: on its side (v24/v25: UP, which put the arm tips on the bed and the grille on top)
         # v21: example theme parts to test the hooks, face down like every theme part
         "tema-top-eksempel": ("x_tema_top", UP), "tema-vinge-venstre-eksempel": ("x_tema_vinge_v", UP),
         "tema-vinge-hoejre-eksempel": ("x_tema_vinge_h", UP)}
LOGOS = {"logo-hvid": "x_logo_w", "logo-groen": "x_logo_g"}   # with the front's orientation and offset


def render(view, out):
    subprocess.run(["openscad", "-q", "-D", f'VIEW="{view}"', "-o", str(out), str(SCAD)], check=True, capture_output=True)
    return out


def main():
    # the parts are turned in Python from the assembled views (an exact 90 deg turn): openscad's own p_frame3 export
    # left zero-area face pairs at the snap slots that made the slicer see an open mesh
    ver = sys.argv[1]
    out = HW / "stl" / "gen2" / ver
    out.mkdir(parents=True, exist_ok=True)
    src = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(tempfile.mkdtemp())
    views = [v for v, _ in PRINT.values()] + list(LOGOS.values())
    if len(sys.argv) <= 2:
        with ThreadPoolExecutor(4) as ex:
            list(ex.map(lambda v: render(v, src / f"{v}.stl"), views))
    front = None
    for name, (view, rot) in PRINT.items():
        m = trimesh.load(src / f"{view}.stl")
        m.apply_transform(rot)
        lo, hi = m.bounds
        # whole 0.01 mm: an odd offset (153.700005) rounds near-coincident vertices together in the float32 STL
        off = np.round([-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]], 2)
        if name == "front":
            front = (rot, off)
        m.apply_translation(off)
        m.export(out / f"{ver}_{name}.stl")
        print(f"{ver}_{name}.stl  {np.round(m.extents, 1).tolist()}  {m.volume / 1000:.1f} cm3")
    for name, view in LOGOS.items():
        m = trimesh.load(src / f"{view}.stl")
        m.apply_transform(front[0])
        m.apply_translation(front[1])
        m.export(out / f"{ver}_{name}.stl")
    subprocess.run([sys.executable, str(HW / "tools" / "make_3mf.py"), str(out)], check=True)
    if len(sys.argv) > 2:
        subprocess.run([sys.executable, str(HW / "render" / "gen2_viewer.py"), str(src), str(out), ver, str(D)], check=True)
    subprocess.run([sys.executable, str(HW / "tools" / "check_bodies.py"), str(out)], check=True)


if __name__ == "__main__":
    main()
