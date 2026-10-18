#!/usr/bin/env python3
"""The gen 2 main unit as a simple mesh for the website's 3D viewer: web/public/models/unit_gen2.glb.

Not a print file. The outlines follow gen2_concept.scad: every outline of the face is an offset of the light
ring's squircle centre line (188.9 x 272.4, corner extent 26, exponent 3), the box edge is 7.8 mm outside the
ring, and the unit is 222.5 x 306 x 85 mm. Node names match unit.glb, so HaloBox can use either.

Usage: python3 hardware/tools/gen2_unit.py
"""
import math
from pathlib import Path

import numpy as np
import trimesh
from shapely.geometry import Point, Polygon, box

import theme_builder as tb

ROOT = Path(__file__).resolve().parents[2]
TO_VIEW = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)   # (x, depth, up) -> three.js

D, PT = 85.0, 3.2
RING_Z0, RING_Z1, RING_FACE, BORDER = 16.8, 289.2, 18.0, 7.8
GLASS = box(-83.45, 27.8, 83.45, 275.9)
CAM_GAP = 38.0


def master(a=26.0, w=188.9, h=272.4, n=3, steps=48):
    zc = (RING_Z0 + RING_Z1) / 2
    hx, hz, pts = w / 2 - a, h / 2 - a, []
    for sx, sz, rev in ((1, 1, False), (-1, 1, True), (-1, -1, False), (1, -1, True)):
        ts = [i * math.pi / 2 / steps for i in range(steps + 1)]
        for t in (reversed(ts) if rev else ts):
            px, pz = max(math.cos(t), 0) ** (2 / n), max(math.sin(t), 0) ** (2 / n)
            pts.append((sx * (hx + a * px), zc + sz * (hz + a * pz)))
    return Polygon(pts).buffer(0)


def main():
    M = master()
    outer = M.buffer(RING_FACE / 2 + BORDER, 64)
    channel = M.buffer(RING_FACE / 2, 64).difference(M.buffer(-RING_FACE / 2, 64))
    gap = box(-CAM_GAP / 2, RING_Z1 - 20, CAM_GAP / 2, RING_Z1 + 20)
    face = outer.difference(channel).difference(GLASS.buffer(1.2, join_style="mitre"))
    parts = {
        # Front with a 1 mm edge break, then the shell with the side light band set into it.
        "bezel": [tb.extrude_xz(face.intersection(outer.buffer(-1.0, 64)), 0, 1.0), tb.extrude_xz(face, 1.0, PT)],
        # The shell's front stays open behind the glass and the ring, so the display shows through.
        "shell_closed": [tb.extrude_xz(outer.difference(GLASS).difference(channel), PT, 6.5), tb.extrude_xz(outer, 6.5, 22), tb.extrude_xz(outer.buffer(-0.4, 64), 22, 32), tb.extrude_xz(outer, 32, D - 1),
                         tb.extrude_xz(outer.buffer(-1.0, 64), D - 1, D)],
        "shell_closed_band": [tb.extrude_xz(outer.difference(outer.buffer(-3, 64)), 22.2, 31.8)],
        "diffuser_ring": [tb.extrude_xz(channel.difference(gap), -1.6, 2.0)],
        "v_display": [tb.extrude_xz(GLASS, 3.7, 6.0)],
        "v_camera": [tb.extrude_xz(Point(0, RING_Z1).buffer(12, 64).difference(Point(0, RING_Z1).buffer(5, 48)), -0.6, 2.5),
                     tb.extrude_xz(Point(0, RING_Z1).buffer(5, 48), 0.6, 2.5)],
        # Sits on the unit's top face (z = 0 here); HaloBox lifts it to the top of the unit.
        "joint_spacer": [tb.cube(-80, 80, 3, 62, 0, 6)],
    }
    scene = trimesh.Scene()
    for name, ms in parts.items():
        m = trimesh.util.concatenate([x for x in ms if x is not None])
        m.apply_transform(TO_VIEW)
        scene.add_geometry(m, node_name=name, geom_name=name)
    out = ROOT / "web/public/models/unit_gen2.glb"
    scene.export(out)
    print(out, f"{out.stat().st_size // 1024} kB")


if __name__ == "__main__":
    main()
