#!/usr/bin/env python3
"""Fit check for the Halo enclosure: every printed part against every bought part.

Exports each part in its installed position from cad/halo.scad, then
  1. reports any interference (overlapping volume) between parts that must not touch,
  2. measures the smallest gap for every critical pair and compares it with a
     required minimum.

Usage: python3 tools/check_fit.py     (needs openscad, trimesh, manifold3d, rtree)
"""
import itertools
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parent.parent
SCAD = ROOT / "cad" / "halo.scad"

UNIT = ["bezel", "led_rail", "shell", "v_display", "v_pi", "v_camera", "v_pads",
        "v_power", "v_leds", "v_diffusers", "wall_cleat"]
PRINTER = ["instax_front", "instax_shell", "v_instax"]

# pairs that are meant to touch or nest (contact, press fit, screwed together)
TOUCHING = {
    frozenset(p) for p in [
        ("bezel", "v_diffusers"),      # diffusers press into the slots
        ("led_rail", "v_leds"),        # strips are stuck on the rail
        ("led_rail", "v_pads"),        # foam pads on the cross bars
        ("v_pads", "v_display"),       # pads press the display back
        ("bezel", "v_camera"),         # camera PCB sits on its bosses
        ("bezel", "led_rail"),         # rail sits on the ribs and blocks
        ("bezel", "shell"),            # tongue slides inside the shell
        ("shell", "v_power"),          # modules sit in cradles / rails
        ("shell", "wall_cleat"),       # cleat engages the groove
        ("instax_shell", "v_instax"),         # printer rests on the ledges
        ("instax_front", "instax_shell"),
    ]
}

# (part A, part B, minimum gap in mm, why)
CLEARANCES = [
    ("v_display", "bezel", 0.4, "glass edge to light-channel ribs and camera bosses"),
    ("v_camera", "v_leds", 1.0, "camera to top light run"),
    ("v_display", "led_rail", 0.4, "display frame / adapter board to rail"),
    ("v_display", "shell", 1.0, "display to shell"),
    ("v_display", "v_camera", 0.5, "camera to glass and display"),
    ("v_pi", "led_rail", 0.3, "Pi underside to rail cross bars"),
    ("v_pi", "shell", 3.0, "Pi and cooler to shell (air + cables)"),
    ("v_pi", "v_power", 3.0, "Pi to power electronics"),
    ("v_camera", "led_rail", 1.0, "camera to rail"),
    ("v_camera", "shell", 1.0, "camera to shell"),
    ("v_leds", "shell", 4.0, "glow strip to translucent stripe (light spread)"),
    ("v_pads", "v_pi", 1.0, "foam pads to Pi"),
    ("v_camera", "bezel", 0.0, "camera seated on its bosses"),
    ("v_power", "led_rail", 3.0, "power electronics to rail"),
    ("v_instax", "instax_shell", 0.0, "printer seated in its bay (ledges)"),
    ("v_instax", "instax_front", 0.5, "printer to the front bumpers"),
]


def export(part, out):
    subprocess.run(["openscad", "-D", f'PART="{part}"', "-o", str(out), str(SCAD)],
                   check=True, capture_output=True)
    return trimesh.load(out)


def min_gap(a, b, n=6000):
    """Smallest surface-to-surface distance (overlaps are caught by the interference step)."""
    # only look at the part of A that is near B
    lo, hi = b.bounds[0] - 10, b.bounds[1] + 10
    pts = np.vstack([a.vertices, a.sample(n)])
    pts = pts[np.all((pts >= lo) & (pts <= hi), axis=1)]
    if len(pts) == 0:
        return float("inf")
    best = np.inf
    for chunk in np.array_split(pts, max(1, len(pts) // 2000)):
        _, dist, _ = b.nearest.on_surface(chunk)
        best = min(best, float(dist.min()))
    return best


def main():
    tmp = Path(tempfile.mkdtemp())
    meshes = {p: export(p, tmp / f"{p}.stl") for p in UNIT + PRINTER}
    ok = True
    print("Interference (parts that must not overlap):")
    for group in (UNIT, PRINTER):
        for a, b in itertools.combinations(group, 2):
            if frozenset((a, b)) in TOUCHING:
                continue
            ma, mb = meshes[a], meshes[b]
            if not ((ma.bounds[0] <= mb.bounds[1]).all() and (mb.bounds[0] <= ma.bounds[1]).all()):
                continue
            inter = trimesh.boolean.intersection([ma, mb], engine="manifold")
            vol = 0.0 if inter.is_empty else inter.volume
            if vol > 0.01:
                ok = False
                print(f"  FAIL {a} x {b}: {vol:.2f} mm3 at {np.round(inter.bounds, 1).tolist()}")
    print("  none" if ok else "")
    print("\nCritical clearances:")
    for a, b, need, why in CLEARANCES:
        gap = min_gap(meshes[a], meshes[b])
        flag = "OK  " if gap >= need else "FAIL"
        ok &= gap >= need
        print(f"  {flag} {a:12s} -> {b:14s} {gap:6.2f} mm (min {need}) {why}")
    print("\nALL FITS OK" if ok else "\nFIT PROBLEMS FOUND")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
