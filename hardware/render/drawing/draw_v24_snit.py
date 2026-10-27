"""v24 sections from the assembled meshes: the light channel with two white strips and the frame's crush bumps, the camera
(1.0 mm air in front of the lens, sleeve clear of lens and holder), and the wall lock (tongue down on the floor boss).
v27+ (no glass, no sleeve): panel B shows the open window, the lens barrel in its bore and the field of view (x_cam_fov).

Usage:  python3 hardware/render/drawing/draw_v24_snit.py <dir with the assembled views (x_*, c_*, s_*)> <out.png> <version>
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import trimesh

D, OUT, VER = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
STYLE = {"x_frame3": ("#f4f0e6", "#8a8578", "Bagramme (hvid)"), "x_ring3": ("#e0f2fe", "#0284c7", "Lysring (mat translucent)"),
         "x_front3": ("#2b2b2f", "#2b2b2f", "Front (sort)"), "x_strip_w": ("#fff3c4", "#b45309", "Hvide COB-strips"),
         "x_strip_rgb": ("#c4b5fd", "#7c3aed", "RGB-strip"), "x_camera": ("#1f7a4d", "#0b3d26", "Camera Module 3 Wide"),
         "x_camsleeve": ("#52525b", "#18181b", "Kamerarør"), "x_camglass": ("#bae6fd", "#0369a1", "Kameraglas"),
         "x_cam_fov": ("#fef9c3", "#ca8a04", "Kameraets synsfelt (120°)"),
         "x_shell3": ("#3f3f46", "#18181b", "Skal (sort)"), "x_cleat": ("#a8a29e", "#57534e", "Vægbeslag med låsetunge"),
         "s_lock": ("#d4d4d8", "#52525b", "Låseskrue 4 × 25")}
meshes = {n: trimesh.load(D / f"{n}.stl") for n in STYLE if (D / f"{n}.stl").exists()}
(RX0, _, RZ0), (_, _, RZ1) = meshes["x_ring3"].bounds
ZM, XL = 172, -RX0 - 8.1     # a side-run plane through a pair of crush bumps (RB_V), clear of the snap arms
GLASS = "x_camglass" in meshes   # v20-v26
LENS_Z = meshes["x_camsleeve" if GLASS else "x_cam_fov"].bounds.mean(axis=0)[2]

o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')

def panel(x0, y0, w, h, names, origin, normal, to2d, win, title, note):
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
    step = 5 if u1 - u0 > 20 else 1
    for k in range(int(np.ceil(u0 / step)) * step, int(u1) + 1, step):
        X = x0 + (k - u0) * s
        o.append(f'<line x1="{X:.1f}" y1="{y0 + ph:.1f}" x2="{X:.1f}" y2="{y0 + ph + 6:.1f}" stroke="#999"/>')
        t(X, y0 + ph + 20, f"{k}", 11, "#999", anchor="middle")
    return s, pw, ph

W, H = 1800, 1200
t(40, 50, f"Selfi Halo gen 2 · {VER}: snit " + ("efter første samling" if GLASS else "uden glas og pakninger") + " (taget direkte fra CAD)", 24, w=700)
t(40, 76, "Dybde fra forsiden i mm langs den vandrette akse. Alle tre snit er de samlede dele i deres rigtige placering.", 14, "#555")
chan = ["x_frame3", "x_ring3", "x_front3", "x_strip_w", "x_strip_rgb"]
panel(40, 150, 1000, 560, chan, [0, 0, ZM], [0, 0, 1], lambda p: (p[1], -(p[0] + XL)), ((-1, 33), (-11, 13)),
      "A  Lyskanalen, venstre side",
      "Kun hvid 1 og 2; reflektoren er glat og trykker på ringens krave. Bagrammens knusknopper (0,25 mm) presser kraven frem.")
s, pw, ph = panel(1090, 150, 670, 560, ["x_front3", "x_camglass", "x_camsleeve", "x_cam_fov", "x_camera"], [0, 0, LENS_Z], [0, 0, 1],
                  lambda p: (p[1], p[0]), ((-0.5, 16), (-13, 9)), "B  Kameraet, vandret snit gennem linsen",
                  "Linsen: 1,0 mm til glasset, 0,7 rundt om, røret 1,0 før holderen. Kortet rører kun de 4 tappe." if GLASS else
                  "Åbent vindue Ø12,1. Linsen 2,2 mm bag forsiden i et Ø8,6-hul (0,65 rundt om). Synsfeltet går 0,24 fri.")
panel(40, 820, 1000, 330, ["x_shell3", "x_cleat", "s_lock"], [-82, 0, 0], [1, 0, 0], lambda p: (p[1], p[2]), ((40, 86), (-2, 42)),
      "C  Låsen, lodret snit gennem låseskruen (set fra venstre)",
      "Tungen står 0,3 mm over bundknasten: skruen trækker kassen de 0,3 mm op, og så står knasten på tungen.")
for i, n in enumerate([n for n in STYLE if n in meshes]):
    x, y = 1090 + 230 * (i % 3), 860 + 30 * (i // 3)
    fill, st, lab = STYLE[n]
    o.append(f'<rect x="{x}" y="{y - 13}" width="22" height="16" fill="{fill}" stroke="{st}"/>')
    t(x + 30, y, lab, 13)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print("wrote", OUT)
