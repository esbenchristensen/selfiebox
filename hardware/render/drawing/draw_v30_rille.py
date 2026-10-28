"""v30 drawing: the theme wings' groove low in the back, v29 (1.5 deep) next to v30 (3.5 deep with a boss inside), cut through
the groove and the wing's tab, plus the back corner seen from behind.

Usage:  python3 hardware/render/drawing/draw_v30_rille.py <v30 dir> <v29 dir> <out.png> <version>
        (dirs with the assembled views x_shell3 and x_tema_vinge_v)
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh

NEW, OLD, OUT, VER = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], sys.argv[4]
WALL_Y = 74.5   # D + GAP_WALL
CUT = {"v29": -(224.5 / 2 - 12 + 9 / 4 + 0.1), "v30": -(224.5 / 2 - 12 + 9 / 4 + 0.1 - 2 + 2.5)}   # the groove's centre, left side
STYLE = {"x_shell3": ("#3f3f46", "#18181b", "Skal (sort)"), "x_tema_vinge_v": ("#86efac", "#15803d", "Tema-vinge (eksempel)")}

o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')


def panel(x0, y0, w, h, d, origin, normal, to2d, win, title, note, wall=False, ticks=5):
    (u0, u1), (v0, v1) = win
    s = min(w / (u1 - u0), h / (v1 - v0))
    pw, ph = (u1 - u0) * s, (v1 - v0) * s
    t(x0, y0 - 34, title, 18, w=700)
    t(x0, y0 - 12, note, 13, "#555")
    cid = f"c{x0}_{y0}"
    o.append(f'<clipPath id="{cid}"><rect x="{x0}" y="{y0}" width="{pw:.0f}" height="{ph:.0f}"/></clipPath>')
    o.append(f'<rect x="{x0}" y="{y0}" width="{pw:.0f}" height="{ph:.0f}" fill="#fff" stroke="#d6d3cb"/>')
    for n in STYLE:
        m = trimesh.load(d / f"{n}.stl")
        sec = m.section(plane_origin=origin, plane_normal=normal)
        if sec is None:
            continue
        p = ""
        for loop in sec.discrete:
            pts = [(x0 + (u - u0) * s, y0 + (v1 - v) * s) for u, v in (to2d(q) for q in loop)]
            p += "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in pts) + "Z"
        fill, st, _ = STYLE[n]
        o.append(f'<path d="{p}" fill="{fill}" fill-rule="evenodd" stroke="{st}" stroke-width="1.2" clip-path="url(#{cid})"/>')
    if wall:
        X = x0 + (WALL_Y - u0) * s
        o.append(f'<rect x="{X:.1f}" y="{y0}" width="{min(14, x0 + pw - X):.1f}" height="{ph:.0f}" fill="#d6d3cb" opacity="0.7"/>')
        t(X + 4, y0 + 18, "væg", 12, "#57534e")
    for k in range(int(np.ceil(u0 / ticks)) * ticks, int(u1) + 1, ticks):
        X = x0 + (k - u0) * s
        o.append(f'<line x1="{X:.1f}" y1="{y0 + ph:.1f}" x2="{X:.1f}" y2="{y0 + ph + 6:.1f}" stroke="#999"/>')
        t(X, y0 + ph + 20, f"{k}", 11, "#999", anchor="middle")


W, H = 1800, 1180
t(40, 50, f"Selfi Halo gen 2 · {VER}: dybere rille til tema-vingerne (Esben 27. okt.: de ser ikke så dybe ud)", 24, w=700)
t(40, 76, "Mål i mm, taget direkte fra CAD. Snit gennem venstre rille set fra venstre (bagsiden til højre) og vandret snit gennem tappen.", 14, "#555")
for i, (ver, d, note) in enumerate((("v29", OLD, "Rille 4,5 × 1,5 i den 3 mm bagvæg, tap 4 × 1,3 × 8: for lidt til at holde, hvis nogen trækker i vingen forneden."),
                                     ("v30", NEW, "Rille 5,5 × 3,5, tap 5 × 3,3 × 10. Indvendig klods: 1,6 mm væg bag og rundt om rillen."))):
    x0 = 40 + i * 880
    panel(x0, 160, 820, 520, d, [CUT[ver], 0, 0], [1, 0, 0], lambda p: (p[1], p[2]), ((50, 80), (12, 48)),
          f"{'AB'[i]}  {ver}: lodret snit gennem rillen (x {CUT[ver]:.1f})", note, wall=True)
    panel(x0, 800, 820, 300, d, [0, 0, 29], [0, 0, 1], lambda p: (p[0], p[1]), ((-118, -88), (55, 78)),
          f"{'CD'[i]}  {ver}: vandret snit 29 mm over bunden, set oppefra", "Bagsiden opad; vingens strop bag boksen og tappen i rillen.")
for i, n in enumerate(STYLE):
    fill, st, lab = STYLE[n]
    o.append(f'<rect x="{1290 + 260 * i}" y="{1150 - 13}" width="22" height="16" fill="{fill}" stroke="{st}"/>')
    t(1320 + 260 * i, 1150, lab, 13)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print("wrote", OUT)
