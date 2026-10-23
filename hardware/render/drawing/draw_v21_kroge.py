"""Sections through the v21 theme hooks and wing pockets, straight from the assembled STLs.

Usage:  python3 hardware/render/drawing/draw_v21_kroge.py <dir with x_shell3/x_tema_top/x_tema_vinge_v/x_cleat.stl> <out.png> <version>
A: the left wing's hooks (outer half of both left slots), B: the top's left hook (inner half of the upper slot).
"""
import sys
from pathlib import Path

import cairosvg
import trimesh

D, OUT, VER = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
parts = [("x_shell3", "#2b2b2f", "#2b2b2f", "Skal (sort ASA)"), ("x_tema_vinge_v", "#bbf7d0", "#15803d", "Tema-vinge (eksempel)"),
         ("x_tema_top", "#d9f99d", "#4d7c0f", "Tema-top (eksempel)"), ("x_cleat", "#d4d4d8", "#52525b", "Vægbeslag")]
meshes = {n: trimesh.load(D / f"{n}.stl") for n, *_ in parts}
o = []


def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')


def panel(x0, y0, w, h, xcut, win, title):
    (u0, u1), (v0, v1) = win
    s = min(w / (u1 - u0), h / (v1 - v0))
    W, H = (u1 - u0) * s, (v1 - v0) * s
    t(x0, y0 - 14, title, 18, w=700)
    o.append(f'<rect x="{x0}" y="{y0}" width="{W:.0f}" height="{H:.0f}" fill="#fff" stroke="#d6d3cb"/>')
    o.append(f'<clipPath id="c{x0}"><rect x="{x0}" y="{y0}" width="{W:.0f}" height="{H:.0f}"/></clipPath>')
    # the wall behind the box (cleat face, y 84)
    X = x0 + (84 - u0) * s
    o.append(f'<rect x="{X:.1f}" y="{y0}" width="{x0 + W - X:.1f}" height="{H:.0f}" fill="#e7e5e4" clip-path="url(#c{x0})"/>')
    t(X + 6, y0 + 20, "væg", 12, "#78716c")
    for n, fill, st, _ in parts:
        sec = meshes[n].section(plane_origin=[xcut, 0, 0], plane_normal=[1, 0, 0])
        if sec is None:
            continue
        d = ""
        for loop in sec.discrete:
            d += "M" + "L".join(f"{x0 + (p[1] - u0) * s:.1f},{y0 + (v1 - p[2]) * s:.1f}" for p in loop) + "Z"
        o.append(f'<path d="{d}" fill="{fill}" fill-rule="evenodd" stroke="{st}" stroke-width="1.2" clip-path="url(#c{x0})"/>')
    for k in range(int(u0) + 5 - int(u0) % 5, int(u1) + 1, 5):
        Xk = x0 + (k - u0) * s
        o.append(f'<line x1="{Xk:.1f}" y1="{y0 + H:.1f}" x2="{Xk:.1f}" y2="{y0 + H + 6:.1f}" stroke="#999"/>')
        t(Xk, y0 + H + 20, f"{k}", 11, "#999", anchor="middle")
    t(x0 + W, y0 + H + 38, "dybde fra forsiden, mm (bagsiden og væggen til højre)", 12, "#777", anchor="end")


W, H = 1800, 1120
t(40, 50, f"Selfi Halo gen 2 · {VER}: temakroge i de lukkede vingelommer (snit fra 3D-filerne)", 24, w=700)
t(40, 76, "Slids 9 × 14 i bagvæggen, lukket lomme bag (væg 1,6, 6,5 dyb, Ø2 dræn i bunden). Tunge 4 × 6 hviler på slidsens bund, "
          "læbe 5 tyk og 3 ned bag væggen, 1 mm afrunding i hjørnerne.", 14, "#555")
t(40, 96, "Påsætning: løft 3, skub ind, lad den falde. Af: 3 op og 8,25 bagud. Med boksen på væggen er der kun 3,8 / 4,8 mm bag "
          "stropperne, så delene kan ikke tages af, mens boksen hænger.", 14, "#555")
panel(40, 150, 820, 900, -102.6, ((54, 88), (160, 262)), "A  Vingens 2 kroge (venstre side, yderste halvdel af slidserne)")
panel(940, 150, 820, 700, -97.9, ((54, 88), (226, 316)), "B  Toppens krog (inderste halvdel af den øverste slids)")
for i, (_, fill, st, lab) in enumerate(parts):
    x, y = 940 + 210 * (i % 4), 960 + 30 * (i // 4)
    o.append(f'<rect x="{x}" y="{y - 13}" width="22" height="16" fill="{fill}" stroke="{st}"/>')
    t(x + 32, y, lab, 14)
t(940, 1010, "Slidser: x ±100,25, midt i 175 og 240,2 mm over bunden (v20: 57,7 og 240,2; det nederste par er flyttet op,", 13, "#555")
t(940, 1030, "fordi lommen ellers ramte dæmperen, reed-kontakten og højttaleren).", 13, "#555")
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
