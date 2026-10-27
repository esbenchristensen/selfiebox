"""v27 (Esben 27 Oct: no glass and no seals in the box): the four places that had a seal or the camera glass, v26 next to
v27, cut from the assembled meshes of both versions.

Usage:  python3 hardware/render/drawing/draw_v27_uden_pakninger.py <v26 dir> <v27 dir> <out.png>
        (dirs with the assembled views x_*, c_*; v26's need x_seal, x_camglass, x_camsleeve; v27's x_cam_fov)
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh

OLD, NEW, OUT = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
STYLE = {"x_front3": ("#2b2b2f", "#2b2b2f", "Front (sort)"), "x_ring3": ("#e0f2fe", "#0284c7", "Lysring"),
         "x_frame3": ("#f4f0e6", "#8a8578", "Bagramme (hvid)"), "x_shell3": ("#3f3f46", "#18181b", "Skal (sort)"),
         "x_dsp_glass": ("#94a3b8", "#334155", "Skærmglas"), "x_camera": ("#1f7a4d", "#0b3d26", "Kamera"),
         "c_speaker": ("#fdba74", "#c2410c", "Højttaler"), "x_cam_fov": ("#fef9c3", "#ca8a04", "Kameraets synsfelt"),
         "x_camsleeve": ("#71717a", "#18181b", "Kamerarør (væk)"), "x_camglass": ("#bae6fd", "#0369a1", "Kameraglas (væk)"),
         "x_seal": ("#dc2626", "#7f1d1d", "Pakning/snor (væk)")}


def load(d):
    return {n: trimesh.load(d / f"{n}.stl") for n in STYLE if (d / f"{n}.stl").exists()}


old, new = load(OLD), load(NEW)
LENS_Z = new["x_cam_fov"].bounds.mean(axis=0)[2]
GT = new["x_dsp_glass"].bounds[1][2]          # top edge of the display glass
RX0 = new["x_ring3"].bounds[0][0]
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


# rows: title, names, plane origin, normal, to2d, window (u = depth from the front face in mm), note for v27
ROWS = [
    ("1  Lysringen ved frontpladen (vandret snit, venstre side)", ["x_front3", "x_ring3", "x_frame3", "x_seal"],
     [0, 0, 172], [0, 0, 1], lambda p: (p[1], p[0] - RX0 - 8.1), ((-1, 9), (2, 13)),
     "Lommen og snoren er væk; frontpladen er hel (3,2 mm), og kraven ligger direkte på den."),
    ("2  Kameraet (vandret snit gennem linsen)", ["x_front3", "x_camglass", "x_camsleeve", "x_cam_fov", "x_camera"],
     [0, 0, LENS_Z], [0, 0, 1], lambda p: (p[1], p[0]), ((-0.5, 14), (-10, 10)),
     "Ingen glas, snor-ring eller kamerarør. Kameraet 1,95 mm frem; åbent vindue Ø8,6, linsen 1,15 mm inde i hullet."),
    ("3  Skærmens kant (lodret snit midt over vinduets overkant)", ["x_front3", "x_dsp_glass", "x_seal"],
     [0, 0, 0], [1, 0, 0], lambda p: (p[1], p[2] - GT), ((-0.5, 6), (-22, 3)),
     "Rillen i kanten er væk; kanten er massiv 1,6 mm, og glasset ligger direkte på den."),
    ("4  Højttaleren (lodret snit gennem gitteret)", ["x_shell3", "c_speaker", "x_seal"],
     [-72.5 + 3.5, 0, 0], [1, 0, 0], lambda p: (p[1], p[2] - 143.5), ((52, 71), (-22, 22)),
     "Rillen om gitteret er væk; flangen ligger direkte på bagvæggen."),
]
W, RH = 1800, 520
H = 140 + RH * len(ROWS) + 60
t(40, 50, "Selfi Halo gen 2 · v27: ingen glas og ingen pakninger (v26 til venstre, v27 til højre)", 24, w=700)
t(40, 76, "Esben 27. okt. 2026. Snit direkte fra CAD, de samlede dele i deres rigtige placering. Tal under hvert snit: mm fra forsiden.", 14, "#555")
for i, (title, names, org, nrm, f, win, note) in enumerate(ROWS):
    y = 140 + RH * i
    panel(40, y, 800, 420, old, names, org, nrm, f, win, title + " · v26")
    panel(900, y, 800, 420, new, names, org, nrm, f, win, "v27")
    t(900, y + 458, note, 14, "#0f766e", w=600)
for i, n in enumerate(STYLE):
    x, y = 40 + 250 * (i % 7), H - 66 + 26 * (i // 7)
    fill, st, lab = STYLE[n]
    o.append(f'<rect x="{x}" y="{y - 12}" width="20" height="14" fill="{fill}" stroke="{st}"/>')
    t(x + 28, y, lab, 12)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print("wrote", OUT)
