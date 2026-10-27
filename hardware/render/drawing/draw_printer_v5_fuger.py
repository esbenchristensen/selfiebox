"""selfi-printer-v5 (Esben 27 Oct 2026: no seals, as halo-gen2-v27): the joints of v4 next to v5, cut from the assembled
meshes of both versions: the foam cord's grooves, the hood's hooks with the ramps in the base's lip, and the spigot.

Usage:  python3 hardware/render/drawing/draw_printer_v5_fuger.py <v4 dir> <v5 dir> <out.png>
        (dirs with kappe.stl, sokkel.stl, udgang.stl rendered without PRINT, i.e. in the assembly frame)
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh

OLD, NEW, OUT = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
STYLE = {"kappe": ("#2b2b2f", "#111", "Kappe"), "sokkel": ("#71717a", "#27272a", "Sokkel"),
         "udgang": ("#a8a29e", "#44403c", "Udgangsmodul")}


def load(d):
    return {n: trimesh.load(d / f"{n}.stl") for n in STYLE if (d / f"{n}.stl").exists()}


old, new = load(OLD), load(NEW)
BASE, PM, TOP = 12.0, 287.2, 217.2
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


# rows: title, names, plane origin, normal, to2d, window, note for v5
ROWS = [
    ("1  Forvæggen ved en krog (lodret snit x = 145)", ["kappe", "sokkel"], [145, 0, 0], [1, 0, 0],
     lambda p: (p[1], p[2] - BASE), ((-1, 9), (-4, 8)),
     "Krogen, rampen og rillen er væk: kappens væg står fladt på soklen, læben 0,3 mm indenfor."),
    ("2  Venstre ende (lodret snit midt i dybden)", ["kappe", "sokkel"], [0, 111.25, 0], [0, 1, 0],
     lambda p: (p[0], p[2] - BASE), ((-1, 9), (-4, 8)),
     "Rillen er væk: kappens væg står på soklens flade overside."),
    ("3  Studsen ved fugen (vandret snit z = 100)", ["kappe", "udgang"], [0, 0, 100], [0, 0, 1],
     lambda p: (p[0] - PM, p[1]), ((-12, 4), (-1, 7)),
     "Rillen i studsen og kappens indføringsfase er væk; kappen glider over studsen med 0,3 mm luft."),
]
W, RH = 1800, 520
H = 140 + RH * len(ROWS) + 60
t(40, 50, "Selfi printer v5: ingen pakninger og ingen kroge (v4 til venstre, v5 til højre)", 24, w=700)
t(40, 76, "Esben 27. okt. 2026. Snit direkte fra CAD, de samlede dele i deres rigtige placering. Tal under hvert snit: mm.", 14, "#555")
for i, (title, names, org, nrm, f, win, note) in enumerate(ROWS):
    y = 140 + RH * i
    panel(40, y, 800, 420, old, names, org, nrm, f, win, title + " · v4")
    panel(900, y, 800, 420, new, names, org, nrm, f, win, "v5")
    t(900, y + 458, note, 14, "#0f766e", w=600)
for i, n in enumerate(STYLE):
    x, y = 40 + 250 * i, H - 50
    fill, st, lab = STYLE[n]
    o.append(f'<rect x="{x}" y="{y - 12}" width="20" height="14" fill="{fill}" stroke="{st}"/>')
    t(x + 28, y, lab, 12)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print("wrote", OUT)
