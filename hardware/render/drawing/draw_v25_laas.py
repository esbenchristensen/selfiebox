"""v25 sections from the assembled meshes: two wall locks (left x -82, tongue 18; right x +84, tongue 12) and the box 4.5 off
the wall (cleat plate 4 + 0.5 air).

Usage:  python3 hardware/render/drawing/draw_v25_laas.py <dir with the assembled views (x_*, c_*, s_*)> <out.png> <version>
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh

D, OUT, VER = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
WALL_Y = 74.5   # D + GAP_WALL
STYLE = {"x_shell3": ("#3f3f46", "#18181b", "Skal (sort)"), "x_cleat": ("#a8a29e", "#57534e", "Vægbeslag med 2 låsetunger"),
         "s_lock": ("#d4d4d8", "#52525b", "Låseskruer 4 × 25"), "c_psu5": ("#e5e7eb", "#6b7280", "5 V-forsyning"),
         "x_tema_top": ("#fde68a", "#b45309", "Tema-top (eksempel)")}
meshes = {n: trimesh.load(D / f"{n}.stl") for n in STYLE if (D / f"{n}.stl").exists()}

o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')

def panel(x0, y0, w, h, names, origin, normal, to2d, win, title, note, wall=None):
    (u0, u1), (v0, v1) = win
    s = min(w / (u1 - u0), h / (v1 - v0))
    pw, ph = (u1 - u0) * s, (v1 - v0) * s
    t(x0, y0 - 34, title, 18, w=700)
    t(x0, y0 - 12, note, 13, "#555")
    o.append(f'<clipPath id="c{x0}{y0}"><rect x="{x0}" y="{y0}" width="{pw:.0f}" height="{ph:.0f}"/></clipPath>')
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
        o.append(f'<path d="{d}" fill="{fill}" fill-rule="evenodd" stroke="{st}" stroke-width="1.2" clip-path="url(#c{x0}{y0})"/>')
    if wall is not None:   # the wall: a vertical line at u = wall
        X = x0 + (wall - u0) * s
        o.append(f'<rect x="{X:.1f}" y="{y0}" width="{min(14, x0 + pw - X):.1f}" height="{ph:.0f}" fill="#d6d3cb" opacity="0.7"/>')
        t(X + 4, y0 + 18, "væg", 12, "#57534e")
    step = 5 if u1 - u0 > 20 else 1
    step = 20 if u1 - u0 > 120 else step
    for k in range(int(np.ceil(u0 / step)) * step, int(u1) + 1, step):
        X = x0 + (k - u0) * s
        o.append(f'<line x1="{X:.1f}" y1="{y0 + ph:.1f}" x2="{X:.1f}" y2="{y0 + ph + 6:.1f}" stroke="#999"/>')
        t(X, y0 + ph + 20, f"{k}", 11, "#999", anchor="middle")
    return s, pw, ph

W, H = 1800, 1250
t(40, 50, f"Selfi Halo gen 2 · {VER}: 2 låse og boksen tæt på væggen (taget direkte fra CAD)", 24, w=700)
t(40, 76, "Mål i mm. Alle snit er de samlede dele i deres rigtige placering; den grå flade er væggen.", 14, "#555")
# A: horizontal section through both tongues, seen from above (front down)
panel(40, 150, 1720, 330, ["x_shell3", "x_cleat", "s_lock", "c_psu5"], [0, 0, 20], [0, 0, 1], lambda p: (p[0], -p[1]),
      ((-115, 115), (-80, -40)), "A  Vandret snit 20 mm over bunden, set oppefra (bagsiden opad)",
      "Venstre lås (set forfra) x −82, tunge 18 bred; højre lås x +84, tunge 12 bred, så lommen går fri af 5 V-bakken og hjørnerundingen. Boksen står 0,5 mm fra beslagets plade.")
o.append(f'<rect x="40" y="{150 + (WALL_Y - 74.5) * 0:.0f}" width="0" height="0"/>')
# B, C: vertical sections through each screw, seen from the left
panel(40, 600, 820, 330, ["x_shell3", "x_cleat", "s_lock"], [-82, 0, 0], [1, 0, 0], lambda p: (p[1], p[2]), ((40, 80), (-2, 42)),
      "B  Venstre lås (x −82), set fra venstre", "Tunge 0,3 over bundknasten (som v24). Magneten til løftealarmen sidder i denne tunge.", wall=WALL_Y)
panel(940, 600, 820, 330, ["x_shell3", "x_cleat", "s_lock"], [84, 0, 0], [1, 0, 0], lambda p: (p[1], p[2]), ((40, 80), (-2, 42)),
      "C  Højre lås (x +84), set fra venstre", "Samme højde og skrue. Tungens yderste hjørne er skåret 0,5 inden for skallens indvendige runding.", wall=WALL_Y)
# D: vertical section through the bar at the top
panel(40, 1030, 820, 180, ["x_shell3", "x_cleat", "x_tema_top"], [0, 0, 0], [1, 0, 0], lambda p: (p[1], p[2]), ((45, 80), (250, 290)),
      "D  Skinnen øverst (x 0), set fra venstre", "Bagsiden 0,5 mm fra pladen, 4,5 mm fra væggen (v24: 14). Der er ikke plads til fingre bag boksen.", wall=WALL_Y)
for i, n in enumerate(STYLE):
    x, y = 960 + 260 * (i % 3), 1070 + 30 * (i // 3)
    fill, st, lab = STYLE[n]
    o.append(f'<rect x="{x}" y="{y - 13}" width="22" height="16" fill="{fill}" stroke="{st}"/>')
    t(x + 30, y, lab, 13)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print("wrote", OUT)
