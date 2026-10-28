"""v27 front screws (Esben 27 Oct: use the 4.0 x 50 T20 screws he has): one of the 4 corner screws before and after, cut
through its axis from the assembled meshes: shell post, frame ear and front boss, and the screw.

Usage:  python3 hardware/render/drawing/draw_v27_frontskrue.py <old dir> <new dir> <out.png>
        (dirs with x_front3, x_frame3, x_shell3, s_front3 in the assembly frame)
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh

OLD, NEW, OUT = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
STYLE = {"x_shell3": ("#3f3f46", "#18181b", "Skal (sort)"), "x_front3": ("#2b2b2f", "#000", "Front (sort)"),
         "x_frame3": ("#f4f0e6", "#8a8578", "Bagramme (hvid)"), "s_front3": ("#c3c7cf", "#52525b", "Skrue")}


def load(d):
    return {n: trimesh.load(d / f"{n}.stl") for n in STYLE if (d / f"{n}.stl").exists()}


old, new = load(OLD), load(NEW)
J = new["s_front3"].split()[0].bounds.mean(axis=0) if len(new["s_front3"].split()) else new["s_front3"].bounds.mean(axis=0)
o = []


def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')


def panel(x0, y0, w, h, meshes, names, origin, normal, to2d, win, title):
    (u0, u1), (v0, v1) = win
    s = min(w / (u1 - u0), h / (v1 - v0))
    pw, ph = (u1 - u0) * s, (v1 - v0) * s
    t(x0, y0 - 10, title, 15, w=700)
    cid = f"c{x0}_{y0}"
    o.append(f'<clipPath id="{cid}"><rect x="{x0}" y="{y0}" width="{pw:.0f}" height="{ph:.0f}"/></clipPath>')
    o.append(f'<rect x="{x0}" y="{y0}" width="{pw:.0f}" height="{ph:.0f}" fill="#fff" stroke="#d6d3cb"/>')
    for n in names:
        if n not in meshes:
            continue
        sec = meshes[n].section(plane_origin=origin, plane_normal=normal)
        if sec is None:
            continue
        d = ""
        for loop in sec.discrete:
            pts = [(x0 + (u - u0) * s, y0 + (v1 - v) * s) for u, v in (to2d(p) for p in loop)]
            d += "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in pts) + "Z"
        fill, st, _ = STYLE[n]
        o.append(f'<path d="{d}" fill="{fill}" fill-rule="evenodd" stroke="{st}" stroke-width="1.2" clip-path="url(#{cid})"/>')
    step = 1 if (u1 - u0) * 1.0 / pw * 40 < 1 else (2 if (u1 - u0) / pw * 40 < 2 else 5)
    for k in range(int(np.ceil(u0 / step)) * step, int(u1) + 1, step):
        X = x0 + (k - u0) * s
        o.append(f'<line x1="{X:.1f}" y1="{y0 + ph:.1f}" x2="{X:.1f}" y2="{y0 + ph + 5:.1f}" stroke="#999"/>')
        t(X, y0 + ph + 18, f"{k}", 10, "#999", anchor="middle")


ROWS = [
    ("Frontskrue i hjørnet (snit gennem skruens akse, bagsiden til højre)", list(STYLE), [J[0], 0, 0], [1, 0, 0],
     lambda p: (p[1], p[2] - J[2]), ((0, 71), (-8, 8)),
     "4,0 × 50 T20: hovedet plant i bagsiden, Ø4,4 gennem stolpe og bagramme, gevindet 7 mm i frontens Ø3,2-hul."),
]
W, RH = 1800, 520
H = 140 + RH * len(ROWS) + 60
t(40, 50, "Selfi Halo gen 2 · v27: frontskruerne er 4,0 × 50 T20 (før til venstre, nu til højre)", 24, w=700)
t(40, 76, "Esben 27. okt. 2026: de skruer, han har, så én T20-bit klarer det hele. Snit direkte fra CAD. Tal: mm fra forsiden.", 14, "#555")
for i, (title, names, org, nrm, f, win, note) in enumerate(ROWS):
    y = 140 + RH * i
    panel(40, y, 800, 220, old, names, org, nrm, f, win, title + " · før (3,0 × 15)")
    panel(900, y, 800, 220, new, names, org, nrm, f, win, "nu (4,0 × 50 T20)")
    t(900, y + 258, note, 14, "#0f766e", w=600)
for i, n in enumerate(STYLE):
    x, y = 40 + 250 * i, 140 + 320
    fill, st, lab = STYLE[n]
    o.append(f'<rect x="{x}" y="{y - 12}" width="20" height="14" fill="{fill}" stroke="{st}"/>')
    t(x + 28, y, lab, 12)
H = 500
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print("wrote", OUT)
