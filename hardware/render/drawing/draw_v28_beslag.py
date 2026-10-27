"""v28 drawing from the assembled meshes: the wall cleat's arms inside the box's outline, one wall screw in each arm, and the
groove low in the back that the theme wings' tabs sit in.

Usage:  python3 hardware/render/drawing/draw_v28_beslag.py <v28 dir> <v27 dir> <out.png> <version>
        (dirs with the assembled views: x_shell3, x_cleat, s_wall, x_tema_vinge_v, x_tema_vinge_h)
"""
import sys
from pathlib import Path

import cairosvg
import manifold3d as mf
import numpy as np
import trimesh

NEW, OLD, OUT, VER = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], sys.argv[4]
WALL_Y = 74.5   # D + GAP_WALL
HOOK_X = 224.5 / 2 - 12 + 9 / 4 + 0.1   # hook_x(sx, false): the outer hook's and the groove's centre
STYLE = {"x_shell3": ("#3f3f46", "#18181b", "Skal (sort)"), "x_cleat": ("#a8a29e", "#57534e", "Vægbeslag"),
         "s_wall": ("#d4d4d8", "#52525b", "Vægskruer 4,0 × 50 T20"),
         "x_tema_vinge_v": ("#86efac", "#15803d", "Tema-vinge (eksempel)"), "x_tema_vinge_h": ("#86efac", "#15803d", ""),
         "out": ("#ef4444", "#b91c1c", "Stak ud under boksen (v27)")}


def load(d, v):
    p = d / f"{v}.stl"
    if not p.exists():
        return None
    m = trimesh.load(p)
    m.merge_vertices()
    return m


def manifold(m):
    return mf.Manifold(mf.Mesh(vert_properties=np.asarray(m.vertices, np.float32), tri_verts=np.asarray(m.faces, np.uint32)))


def front(m):   # outline seen from the front: (x, z)
    return manifold(m).transform([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0]]).project()


o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')


def frame(x0, y0, w, h, win, title, note, ticks=20):
    (u0, u1), (v0, v1) = win
    s = min(w / (u1 - u0), h / (v1 - v0))
    pw, ph = (u1 - u0) * s, (v1 - v0) * s
    t(x0, y0 - 34, title, 18, w=700)
    t(x0, y0 - 12, note, 13, "#555")
    cid = f"c{x0}_{y0}"
    o.append(f'<clipPath id="{cid}"><rect x="{x0}" y="{y0}" width="{pw:.0f}" height="{ph:.0f}"/></clipPath>')
    o.append(f'<rect x="{x0}" y="{y0}" width="{pw:.0f}" height="{ph:.0f}" fill="#fff" stroke="#d6d3cb"/>')
    for k in range(int(np.ceil(u0 / ticks)) * ticks, int(u1) + 1, ticks):
        X = x0 + (k - u0) * s
        o.append(f'<line x1="{X:.1f}" y1="{y0 + ph:.1f}" x2="{X:.1f}" y2="{y0 + ph + 6:.1f}" stroke="#999"/>')
        t(X, y0 + ph + 20, f"{k}", 11, "#999", anchor="middle")
    to_px = lambda u, v: (x0 + (u - u0) * s, y0 + (v1 - v) * s)
    return to_px, cid, s


def path(loops, to_px, cid, name, mirror=False, opacity=1.0):
    d = ""
    for loop in loops:
        pts = [to_px(-u if mirror else u, v) for u, v in loop]
        d += "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in pts) + "Z"
    fill, st, _ = STYLE[name]
    o.append(f'<path d="{d}" fill="{fill}" fill-opacity="{opacity}" fill-rule="evenodd" stroke="{st}" stroke-width="1.2" clip-path="url(#{cid})"/>')


def polys(cs):
    return [np.asarray(p) for p in cs.to_polygons()]


new = {v: load(NEW, v) for v in STYLE if v != "out"}
old = {v: load(OLD, v) for v in ("x_shell3", "x_cleat")}

W, H = 1800, 1500
t(40, 50, f"Selfi Halo gen 2 · {VER}: vægbeslaget inden for boksens kant, skruehul i armene og rille til tema-vingerne", 24, w=700)
t(40, 76, "Mål i mm, taget direkte fra CAD. Esben 27. okt.: beslaget kunne ses forneden forfra, armene ud til låsene skal skrues i væggen, og vingerne skal kunne gå helt ned.", 14, "#555")

# A, B: the bottom of the box seen from the front, the cleat behind it; v27's arms stood out of the round corners
for i, (ver, ms, note) in enumerate((("v27", old, "Armenes nederste hjørner stod op til 4,9 mm ud af boksens runde hjørner (rødt) og kunne ses forfra."),
                                     (VER.replace("halo-gen2-", ""), new, "Armene er skåret 1,5 mm inden for boksens kant hele vejen rundt; tungerne står stadig på pladen i hele deres længde."))):
    to_px, cid, s = frame(40 + i * 880, 160, 820, 260, ((-115, 115), (-5, 60)), f"{'AB'[i]}  Bunden set forfra, {ver}", note)
    box, cleat = front(ms["x_shell3"]), front(ms["x_cleat"])
    path(polys(cleat), to_px, cid, "x_cleat")
    path(polys(box), to_px, cid, "x_shell3", opacity=0.92)
    out = cleat - box
    if out.area() > 1:
        path(polys(out), to_px, cid, "out")

# C: the whole back, seen from behind (x mirrored): the 6 wall screws and the wings' straps and tabs
to_px, cid, s = frame(40, 540, 620, 880, ((-125, 125), (-5, 315)), "C  Bagfra (hængt op, væggen fjernet)",
                      "6 huller: 4 som før + 1 i hver arm ud mod låsene (x ±60, 24 over bunden).", ticks=50)
for v in ("x_shell3", "x_tema_vinge_v", "x_tema_vinge_h", "x_cleat", "s_wall"):
    if new.get(v) is not None:
        path(polys(front(new[v])), to_px, cid, v, mirror=True)
for sx in (-1, 1):   # the grooves, on the shell's back face (dashed where the wing's strap covers them)
    a, b = to_px(-(sx * HOOK_X) - 2.25, 36), to_px(-(sx * HOOK_X) + 2.25, 23.5)
    o.append(f'<rect x="{a[0]:.1f}" y="{a[1]:.1f}" width="{b[0] - a[0]:.1f}" height="{b[1] - a[1]:.1f}" fill="none" stroke="#b91c1c" stroke-width="1.6" stroke-dasharray="4 3"/>')
X, Y = to_px(-HOOK_X - 5, 30)
t(X - 6, Y, "rille + tap", 12, "#b91c1c", 700, "end")
for x in (-60, 60):
    X, Y = to_px(-x, 24)
    o.append(f'<circle cx="{X:.1f}" cy="{Y:.1f}" r="9" fill="none" stroke="#b91c1c" stroke-width="1.6"/>')
    t(X, Y + 26, "ny skrue", 12, "#b91c1c", 700, "middle")

# D: section through the left groove, seen from the left: the wing's strap behind the box and its tab in the groove
to_px, cid, s = frame(740, 540, 500, 520, ((50, 80), (12, 48)), f"D  Snit gennem rillen (x {-HOOK_X:.1f}), set fra venstre",
                      "Rillen 4,5 bred, 1,5 dyb, z 23,5–36; tappen 4 × 1,3, z 24–32.", ticks=5)
for v in ("x_shell3", "x_tema_vinge_v"):
    sec = new[v].section(plane_origin=[-HOOK_X, 0, 0], plane_normal=[1, 0, 0])
    if sec is not None:
        path([[(p[1], p[2]) for p in loop] for loop in sec.discrete], to_px, cid, v)
X = to_px(WALL_Y, 0)[0]
o.append(f'<rect x="{X:.1f}" y="540" width="{min(14, 740 + 30 * s - X):.1f}" height="{36 * s:.0f}" fill="#d6d3cb" opacity="0.7"/>')
t(X + 4, 558, "væg", 12, "#57534e")
t(740, 1110, "Vingen sættes på som før: løft 3 mm, skub ind, slip. Tappen går ind i rillen", 13, "#333")
t(740, 1130, "samtidig med krogene og ender 0,5 over rillens bund. Krogene bærer; tappen", 13, "#333")
t(740, 1150, "holder den nederste ende, så vingen ikke kan svinge ud eller vride sig.", 13, "#333")
t(740, 1180, "Rillen er blind (1,5 af bagvæggens 3 mm): en tredje slids med lomme", 13, "#333")
t(740, 1200, "er der ikke plads til forneden (reed-modulet, låselommen og dæmperen).", 13, "#333")

for i, n in enumerate(k for k in STYLE if STYLE[k][2]):
    x, y = 1290 + 0 * i, 580 + 34 * i
    fill, st, lab = STYLE[n]
    o.append(f'<rect x="{x}" y="{y - 13}" width="22" height="16" fill="{fill}" stroke="{st}"/>')
    t(x + 30, y, lab, 13)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print("wrote", OUT)
