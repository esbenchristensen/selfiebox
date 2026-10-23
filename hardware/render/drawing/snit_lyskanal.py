"""Section through the light channel, straight from the released STLs (from v18: strip lanes, strip 3 in the reflector, ring wedge).

Usage:  python3 hardware/render/drawing/snit_lyskanal.py <dir with x_frame3/x_ring3/x_strip_w/x_strip_rgb/c_clips.stl> <front.stl (print orientation)> <out.png> <version> [subtitle]
A: the left side at mid height, B: the top run at x = +25 (the clip on the right of the camera). The planes follow the light ring's
bounds, so the same windows fit when the box grows (v20: 2 mm wider and higher).
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh

D, FRONT, OUT, VER = Path(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4]
SUB = sys.argv[5] if len(sys.argv) > 5 else "Hvid 1 og 2 i kantspor med læbe over bagkanten, RGB i tæt bane, hvid 3 nedsænket i reflektoren under lysringens kile. Kanalbunden 0,95 mm dybere end i v17."
(RX0, _, RZ0), (_, _, RZ1) = trimesh.load(D / "x_ring3.stl").bounds
ZM, XL, ZT = (RZ0 + RZ1) / 2, -RX0 - 8.1, RZ1 - 8.1      # v18: 153, 94.45, 289.2
parts = [("x_frame3", "#f4f0e6", "#8a8578", "Bagramme (hvid ASA)"), ("x_ring3", "#e0f2fe", "#0284c7", "Lysring med kile (mat translucent)"),
         ("front", "#2b2b2f", "#2b2b2f", "Front (sort ASA)"), ("x_strip_w", "#fff3c4", "#b45309", "Hvide COB-strips"),
         ("x_strip_rgb", "#c4b5fd", "#7c3aed", "RGB-strip"), ("c_clips", "#e5e7eb", "#475569", "Klikstik")]
meshes = {}
for n, *_ in parts:
    if n == "front":
        m = trimesh.load(FRONT)
        m.apply_transform(trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0]))
        m.apply_translation([0, 0, ZM])
    else:
        m = trimesh.load(D / f"{n}.stl")
    meshes[n] = m

o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')

def panel(x0, y0, w, h, origin, normal, to2d, win, title):
    (u0, u1), (v0, v1) = win
    s = min(w / (u1 - u0), h / (v1 - v0))
    t(x0, y0 - 14, title, 18, w=700)
    o.append(f'<rect x="{x0}" y="{y0}" width="{(u1 - u0) * s:.0f}" height="{(v1 - v0) * s:.0f}" fill="#fff" stroke="#d6d3cb"/>')
    for n, fill, st, _ in parts:
        sec = meshes[n].section(plane_origin=origin, plane_normal=normal)
        if sec is None:
            continue
        d = ""
        for loop in sec.discrete:
            pts = [to2d(p) for p in loop]
            pts = [(x0 + (u - u0) * s, y0 + (v1 - v) * s) for u, v in pts]
            d += "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in pts) + "Z"
        o.append(f'<clipPath id="c{x0}"><rect x="{x0}" y="{y0}" width="{(u1 - u0) * s:.0f}" height="{(v1 - v0) * s:.0f}"/></clipPath>')
        o.append(f'<path d="{d}" fill="{fill}" fill-rule="evenodd" stroke="{st}" stroke-width="1.2" clip-path="url(#c{x0})"/>')
    # mm grid ticks along the depth
    for k in range(int(np.ceil(u0)), int(u1) + 1, 5):
        X = x0 + (k - u0) * s
        o.append(f'<line x1="{X:.1f}" y1="{y0 + (v1 - v0) * s:.1f}" x2="{X:.1f}" y2="{y0 + (v1 - v0) * s + 6:.1f}" stroke="#999"/>')
        t(X, y0 + (v1 - v0) * s + 20, f"{k}", 11, "#999", anchor="middle")
    t(x0 + (u1 - u0) * s, y0 + (v1 - v0) * s + 38, "dybde fra forsiden, mm (front til venstre, ydersiden op)", 12, "#777", anchor="end")

W, H = 1800, 1080
t(40, 50, f"Selfi Halo gen 2 · {VER}: snit gennem lyskanalen (taget direkte fra printfilerne)", 24, w=700)
t(40, 76, SUB, 14, "#555")
# A: left side, z = ZM: depth y to the right, r = -(x + XL) up (outer side up)
panel(40, 120, 1000, 720, [0, 0, ZM], [0, 0, 1], lambda p: (p[1], -(p[0] + XL)), ((-1, 33), (-11, 13)), "A  Venstre side, midt på")
# B: top run at x = +25 (strip 3's clip, 1.6 mm proud of the reflector)
panel(1090, 120, 670, 480, [25, 0, 0], [1, 0, 0], lambda p: (p[1], p[2] - ZT), ((-1, 33), (-11, 13)), "B  Toppen ved x = +25: klikstikket til hvid 3")
# C: zoom on strip 3, the reflector pocket and the ring wedge (left side)
panel(1090, 680, 670, 330, [0, 0, ZM], [0, 0, 1], lambda p: (p[1], -(p[0] + XL)), ((3, 17), (-9, -2)), "C  Forstørret: hvid 3 i lommen, læbe bagtil og ringens kile fortil")
for i, (_, fill, st, lab) in enumerate(parts):
    x, y = 40 + 330 * (i % 3), 920 + 30 * (i // 3)
    o.append(f'<rect x="{x}" y="{y - 13}" width="22" height="16" fill="{fill}" stroke="{st}"/>')
    t(x + 32, y, lab, 14)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
