#!/usr/bin/env python3
"""Fit check for gen 2 (cad/gen2_concept.scad): every mesh of the assembled unit against every other.

Renders each VIEW below in its installed position (or reads <dir>/<VIEW>.stl if a directory is given), then
  1. intersects every pair (manifold) and reports the overlapping volume. Pairs that are meant to touch or press
     (a cord in its groove, a board on its pegs) are listed in CONTACT with the most overlap they may have;
  2. measures the gap for the CLEARANCES pairs and compares it with a minimum.
With --ref <dir> (the same STLs from an older version) every overlap is shown next to the old one, so a change
that adds a new collision stands out.

Usage:  python3 hardware/tools/check_fit_gen2.py [stl dir] [--ref old stl dir]
Needs:  openscad (without a dir), trimesh, manifold3d, rtree, scipy
"""
import itertools
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
import trimesh

SCAD = Path(__file__).resolve().parents[1] / "cad" / "gen2_concept.scad"

PRINTED = ["x_front3", "x_ring3", "x_frame3", "x_shell3", "x_cleat", "x_camsleeve"]
BOUGHT = ["x_seal", "x_camglass", "x_dsp_glass", "x_dsp_back", "x_camera", "x_strip_w", "x_strip_rgb", "c_clips",
          "c_pi_board", "c_cooler", "c_psu5", "c_wled", "c_mosfet", "c_jack", "c_4g", "c_mcore", "c_mics",
          "c_speaker", "c_imu", "c_reed", "s_front3", "s_display", "s_lock", "x_logo_w", "x_logo_g"]
THEME = ["x_tema_top", "x_tema_vinge_v", "x_tema_vinge_h"]   # v21: example theme top and wings on the hooks

# pairs that touch by design: (a, b) -> largest overlap in mm3 that is still fine (contact faces render as slivers)
CONTACT = {
    ("x_front3", "x_logo_w"): 1e9, ("x_front3", "x_logo_g"): 1e9, ("x_logo_w", "x_logo_g"): 1e9,
    ("x_front3", "s_front3"): 1e9,          # thread-forming screws cut their thread
    ("x_frame3", "s_display"): 1e9, ("x_dsp_back", "s_display"): 1e9,
    ("x_shell3", "s_lock"): 1e9, ("x_cleat", "s_lock"): 1e9,
    ("x_dsp_glass", "x_dsp_back"): 1e9, ("x_dsp_back", "c_pi_board"): 1e9, ("c_pi_board", "c_cooler"): 1e9,
    ("x_camera", "x_front3"): 1e9,          # the pegs go through the board's holes (the board model has them)
    ("x_strip_w", "c_clips"): 1e9, ("x_strip_rgb", "c_clips"): 1e9,    # the clips sit on the strip ends
    ("x_frame3", "x_dsp_back"): 150, ("x_frame3", "x_dsp_glass"): 20,  # bosses and spring toes press the display 0.2 (PRELOAD, LK_TOE)
    ("x_shell3", "c_speaker"): 100, ("x_shell3", "c_mics"): 50,        # pegs through the ear / board holes (the block models have none)
    ("x_ring3", "x_seal"): 40, ("x_front3", "x_seal"): 1,               # the cords lie on the faces they seal (0.01 mm modelling overlap)
    ("x_frame3", "x_shell3"): 2,            # v21: crush bumps on the shell posts, squeezed 0.2 by the front screws
    ("x_camsleeve", "x_front3"): 0.5,       # v21: the sleeve's 4 press ribs on the shroud's flats
}
# (a, b, minimum gap, why)
CLEARANCES = [
    ("x_ring3", "x_front3", 0.1, "light ring in the slot and its seal pocket"),
    ("x_ring3", "x_frame3", 0.0, "ring flange on the frame"),
    ("x_camsleeve", "x_camera", 0.2, "v21: sleeve 0.3 clear of the lens holder, bore 0.2 round the barrel"),
    ("x_camera", "x_camglass", 0.2, "lens tip behind the glass"),
    ("x_front3", "x_shell3", 0.0, "v21: front face on the shell face (no gap), rib in the groove"),
    ("x_dsp_glass", "x_frame3", 0.0, "display glass: the frame toes press it"),
    ("c_mics", "x_front3", 0.3, "mic board under the channel wall"),
    ("x_strip_w", "x_front3", 0.0, "white strips end at the camera caps"),
    ("x_tema_top", "x_shell3", 0.0, "theme top: base on the top face, tongues rest on the upper slots' floor"),
    ("x_tema_vinge_v", "x_shell3", 0.0, "left wing: rib beside the side wall, tongues rest on both slots' floor"),
    ("x_tema_vinge_h", "x_shell3", 0.0, "right wing"),
    ("x_tema_top", "x_tema_vinge_v", 0.2, "top and left wing share the upper slot"),
    ("x_tema_top", "x_tema_vinge_h", 0.2, "top and right wing"),
    ("x_tema_vinge_v", "x_cleat", 0.5, "left wing strap beside the wall cleat"),
    ("x_tema_top", "x_cleat", 0.5, "top straps beside the wall cleat"),
    ("x_tema_top", "x_front3", 0.15, "top sign over the front"),
    ("x_tema_vinge_v", "x_front3", 0.15, "left wing beside the front"),
]


def render(view, out):
    subprocess.run(["openscad", "-q", "-D", f'VIEW="{view}"', "-o", str(out), str(SCAD)], check=True, capture_output=True)
    return out


def load_dir(d, views):
    return {v: trimesh.load(d / f"{v}.stl") for v in views if (d / f"{v}.stl").exists()}


def overlaps(meshes):
    out = {}
    names = list(meshes)
    for a, b in itertools.combinations(names, 2):
        ma, mb = meshes[a], meshes[b]
        if ma.is_empty or mb.is_empty or not ((ma.bounds[0] <= mb.bounds[1]).all() and (mb.bounds[0] <= ma.bounds[1]).all()):
            continue
        try:
            inter = trimesh.boolean.intersection([ma, mb], engine="manifold")
        except Exception as e:   # noqa: BLE001
            print(f"  ?? {a} x {b}: {e}")
            continue
        if not inter.is_empty and inter.volume > 0.005:
            out[(a, b)] = (inter.volume, np.round(inter.bounds, 1).tolist())
    return out


def min_gap(a, b, n=20000):
    lo, hi = b.bounds[0] - 5, b.bounds[1] + 5
    pts = np.vstack([a.vertices, a.sample(n)])
    pts = pts[np.all((pts >= lo) & (pts <= hi), axis=1)]
    if len(pts) == 0:
        return float("inf"), None
    _, dist, _ = b.nearest.on_surface(pts)
    i = int(np.argmin(dist))
    return float(dist[i]), np.round(pts[i], 1).tolist()


def main():
    args = sys.argv[1:]
    ref = None
    if "--ref" in args:
        i = args.index("--ref"); ref = Path(args[i + 1]); del args[i:i + 2]
    views = PRINTED + BOUGHT + THEME
    if args:
        d = Path(args[0])
    else:
        d = Path(tempfile.mkdtemp())
        with ThreadPoolExecutor(4) as ex:
            list(ex.map(lambda v: render(v, d / f"{v}.stl"), views))
    meshes = load_dir(d, views)
    print(f"{len(meshes)} meshes from {d}")
    new = overlaps(meshes)
    old = overlaps(load_dir(ref, views)) if ref else {}
    ok = True
    print("\nOverlaps (mm3; pairs that touch by design are marked ok):")
    for k in sorted(set(new) | set(old), key=lambda k: -new.get(k, (0,))[0]):
        v, bb = new.get(k, (0.0, None))
        allowed = CONTACT.get(k, CONTACT.get(k[::-1], 0.0))
        flag = "ok  " if v <= allowed else "FAIL"
        if v > allowed:
            ok = False
        was = f"  (ref {old[k][0]:.2f})" if k in old else ("  (ref 0, NEW)" if ref else "")
        print(f"  {flag} {k[0]:12s} x {k[1]:12s} {v:9.2f}{was}  {bb if v > allowed else ''}")
    print("\nClearances:")
    for a, b, need, why in CLEARANCES:
        if a not in meshes or b not in meshes:
            continue
        g, at = min_gap(meshes[a], meshes[b])
        flag = "OK  " if g >= need - 1e-3 else "LOW "
        print(f"  {flag} {a:12s} -> {b:12s} {g:6.2f} mm (min {need}) {why}  at {at}")
    print("\nNO NEW COLLISIONS" if ok else "\nCOLLISIONS FOUND")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
