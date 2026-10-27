"""Drawing of the stand bracket (selfi-stativbeslag-v<N>) on the gen 2 unit, straight from its release assembly
(hardware/tools/make_stativbeslag.py): from behind, from the side with the ball head and the centre of gravity, from
below (the shelf against the unit's underside: mic ports, vents, plug, dowel holes) and as printed. Dimensions in mm.

Usage: python3 hardware/render/drawing/draw_stativbeslag.py <version> <out.png>
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import shapely
import trimesh
from shapely.geometry import box as sbox
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[3]
VER, OUT = sys.argv[1], sys.argv[2]
REL = ROOT / "hardware/stl/stativbeslag" / VER
W, H = 1900, 1390
o = []
BOX, BOXS, BR, BRS, NUT = "#3a3a3f", "#111", "#1d1d20", "#16a34a", "#b8bcc0"
TRI, TRIS = "#9ca3af", "#4b5563"
CG = (0.9, -31.2, -18.0)   # x, z (glTF: front 0, back -70), y centred: estimated from the CAD (parts + catalogue masses), ~1.9 kg


def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')


def lines(x, y, rows, size=14, gap=21):
    for i, r in enumerate(rows):
        t(x, y + i*gap, r, size, "#222", 700 if r.endswith(":") else 400)


def path(g, f, fill, stroke, sw=1.3, op=1.0, dash=None):
    d = ""
    for p in getattr(g, "geoms", [g]):
        if p.is_empty or p.geom_type != "Polygon":
            continue
        for ring in [p.exterior, *p.interiors]:
            d += "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, ring.coords)) + "Z"
    o.append(f'<path d="{d}" fill="{fill}" fill-opacity="{op}" fill-rule="evenodd" stroke="{stroke}" stroke-width="{sw}" '
             f'stroke-linejoin="round"' + (f' stroke-dasharray="{dash}"' if dash else "") + "/>")


def line(pts, f, col, sw=1.3, dash=None):
    o.append('<path d="M' + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts)) + f'" fill="none" stroke="{col}" stroke-width="{sw}"'
             + (f' stroke-dasharray="{dash}"' if dash else "") + "/>")


def circ(f, p, r_px, fill, stroke, sw=1.2):
    x, y = f(p)
    o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r_px:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')


def dim(p0, p1, f, s, off=(0, 0), col="#2563eb", size=13):
    a, b = f(p0), f(p1)
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="{col}" stroke-width="1.1" marker-start="url(#da)" marker-end="url(#da)"/>')
    t((a[0] + b[0])/2 + off[0], (a[1] + b[1])/2 + off[1], s, size, col, 600, "middle")


def lead(f, p, lx, ly, s, col="#b45309", size=13):
    ax, ay = f(p)
    o.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="2.6" fill="{col}"/><path d="M{ax:.1f},{ay:.1f}L{lx:.1f},{ly - 5:.1f}" stroke="{col}" stroke-width="1"/>')
    t(lx + (4 if lx >= ax else -4), ly, s, size, col, 600, "start" if lx >= ax else "end")


def frame(x, y, w, h, title):
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="none" stroke="#d6d3cb" stroke-width="1.4"/>')
    t(x + 18, y + 28, title, 16, w=700)


def silhouette(m, ax):
    tri = m.vertices[m.faces][:, :, ax]
    polys = shapely.polygons(tri)
    return unary_union(polys[shapely.area(polys) > 1e-6]).buffer(0.05).buffer(-0.05)


def section_y(m, y):
    s = m.section(plane_origin=[0, y, 0], plane_normal=[0, 1, 0])
    p2, T = s.to_2D(to_2D=np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]], float))
    return unary_union([shapely.Polygon(pl.exterior.coords, [i.coords for i in pl.interiors]) for pl in p2.polygons_full])


sc = trimesh.load(REL / f"{VER}_3d.glb")
def node(n):
    T, g = sc.graph[n]
    m = sc.geometry[g].copy()
    m.apply_transform(T)
    return m

skal, front, stik = node("skal"), node("front"), node("stik")
br, logo_w, logo_g, tnut = node("stativbeslag"), node("stativlogo_hvid"), node("stativlogo_groen"), node("t_moetrik")
unit_b = unary_union([silhouette(skal, [0, 1]), silhouette(front, [0, 1])])
unit_s = unary_union([silhouette(skal, [2, 1]), silhouette(front, [2, 1])])
YB = skal.bounds[0][1]                     # underside of the box (v20+: 307 high, -153.5)
NUT_Z = -31.0
# glTF coordinates: x right seen from the front, y up (box centred on 0), z out of the front (0) to the back (-70).

o.append('<defs><marker id="da" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,1L7,4L0,7Z" fill="#2563eb"/></marker></defs>')
o.append(f'<rect width="{W}" height="{H}" fill="#fbfaf7"/>')
t(50, 50, f"{VER} · stativbeslag til B2C-gulvstativet (Sirui Traveler 5AX), logo bagpå", 25, w=700)
t(50, 76, f"Fra CAD (gen2_concept.scad, stand_bracket) på boksen fra {sorted((ROOT / 'hardware/stl/gen2').glob('halo-gen2-v*'), key=lambda p: int(p.name.split('-v')[1]))[-1].name}. "
  "Mål i mm. v2: 27. okt. 2026 (låsetunge som v24, ingen styrepinde)", 14, "#666")

# ---------------- 1: from behind ----------------
frame(30, 100, 560, 820, "1  Set bagfra")
s1 = 1.55;  c1 = (310, 520)
f1 = lambda p: (c1[0] - p[0]*s1, c1[1] - p[1]*s1)   # from behind: x flips
path(unit_b, f1, BOX, BOXS, 1.2)
path(silhouette(br, [0, 1]), f1, BR, BRS, 2.0)
path(silhouette(logo_w, [0, 1]), f1, "#f5f5f4", "none")
path(silhouette(logo_g, [0, 1]), f1, "#22d36b", "none")
dim((90, 170), (-90, 170), f1, "180", (0, -6))
dim((111.25, -182), (-111.25, -182), f1, "222,5 (boks)", (0, 18))
dim((-122, 79), (-122, 137), f1, "58", (16, 4))
dim((-130, YB - 14), (-130, 137), f1, "304", (22, 4))
dim((30, -100), (-30, -100), f1, "60", (0, -6))
lead(f1, (-60, 115), 440, 185, "logo 130 bredt, indlagt 0,8")
lead(f1, (-82, -125), 470, 860, "låsetunge + låseskrue")
lead(f1, (0, YB - 7), 420, 895, "hylde under boksen")

# ---------------- 2: from the side ----------------
frame(610, 100, 620, 820, "2  Set fra siden, med kuglehoved (front til venstre)")
s2 = 1.55;  c2 = (760, 470)
f2 = lambda p: (c2[0] - p[0]*s2, c2[1] - p[1]*s2)    # p = (z, y)
path(unit_s, f2, BOX, BOXS, 1.2)
path(silhouette(stik, [2, 1]).intersection(sbox(-80, -220, 0, YB)), f2, "#e11d48", "#7f1d1d", 1)
path(silhouette(br, [2, 1]), f2, BR, BRS, 2.0)
path(silhouette(tnut, [2, 1]), f2, NUT, "#555", 1)
# ball head, quick-release plate long side across (x), so it is 40 deep here
qy = YB - 14
path(sbox(NUT_Z - 20, qy - 10, NUT_Z + 20, qy), f2, TRI, TRIS, 1.2)
path(sbox(NUT_Z - 22, qy - 26, NUT_Z + 22, qy - 10), f2, "#6b7280", TRIS, 1.2)
circ(f2, (NUT_Z, qy - 44), 17*s2, "#4b5563", "#1f2937")
path(sbox(NUT_Z - 11, qy - 95, NUT_Z + 11, qy - 60), f2, "#374151", "#1f2937", 1.2)
line([(NUT_Z, qy + 1), (NUT_Z, qy - 105)], f2, "#2563eb", 1, "6 4")
cg = (CG[1], CG[2])
circ(f2, cg, 7, "none", "#dc2626", 2)
line([(cg[0] - 4.5, cg[1]), (cg[0] + 4.5, cg[1])], f2, "#dc2626", 2); line([(cg[0], cg[1] - 4.5), (cg[0], cg[1] + 4.5)], f2, "#dc2626", 2)
line([cg, (cg[0], qy - 2)], f2, "#dc2626", 1.2, "3 3")
dim((0, 170), (-70, 170), f2, "70", (0, -6))
dim((-70, 170), (-84, 170), f2, "14", (0, -6))
dim((0, qy - 100), (NUT_Z, qy - 100), f2, "31", (-24, 5))
dim((-20.5, YB + 26), (-84, YB + 26), f2, "63,5", (0, -6))
dim((-95, YB), (-95, qy), f2, "14", (16, 5))
lead(f2, (-78, 112), 1000, 170, "skinnen i boksens rille")
lead(f2, (-80, 100), 1000, 230, "logopanel")
lead(f2, cg, 1000, 330, "tyngdepunkt (skøn, ca. 1,9 kg)", "#dc2626")
lead(f2, (-75, -135), 1000, 420, "ribber i mellemrummet")
lead(f2, (NUT_Z, YB - 6), 1000, 560, "T-møtrik 1/4\"-20, flugter i bunden")
lead(f2, (-60, YB - 30), 1000, 640, "strømstik ned gennem slids", "#be123c")
lead(f2, (NUT_Z + 20, qy - 5), 1000, 720, "lynplade på tværs")
lead(f2, (NUT_Z, qy - 44), 1000, 790, "kuglehoved (Sirui B-00K)", "#374151")
t(1220, 900, "Skruen sidder 0–1 mm fra tyngdepunktet: kuglehovedet bærer ingen vippekraft.", 13, "#166534", 600, "end")

# ---------------- 3: from below ----------------
frame(1250, 100, 620, 500, "3  Set nedefra (front opad)")
s3 = 1.55;  c3 = (1560, 190)
f3 = lambda p: (c3[0] + p[0]*s3, c3[1] - p[1]*s3)    # p = (x, z)
bottom = section_y(skal, YB + 1.5)
path(bottom, f3, BOX, BOXS, 1.0)
shelf = section_y(br, YB - 7)
path(shelf, f3, BR, BRS, 2.0, op=0.85)
circ(f3, (0, NUT_Z), 4.2*s3, NUT, "#555")
for x, z, s in [(16.5, -18, "mikrofonhul"), ]:
    lead(f3, (x, z), 1700, 170, "mikrofonhuller fri (1,5 mm)")
lead(f3, (45, -48), 1700, 250, "luftslidser fri")
lead(f3, (0, -58), 1700, 330, "strømstik i slids", "#be123c")
lead(f3, (18, -60), 1700, 400, "styrehullerne bruges ikke (v2)")
lead(f3, (0, NUT_Z), 1700, 470, "T-møtrik under tyngdepunktet")
lead(f3, (-82, -61), 1300, 520, "låseskrue fri", "#555")
dim((-24, -94), (24, -94), f3, "48", (0, 18))

# ---------------- 4: as printed + parts ----------------
frame(1250, 620, 620, 300, "4  Print og dele")
lines(1270, 680, [
    "Print (Bambu H2C, sort ASA + hvid/grøn via AMS):",
    "• Bagsiden ned, logoet i de første lag. 185 × 304 × 63,5.",
    "• Hylden står lodret; ingen support. Ca. 200 cm³.",
    "Købedele:",
    "• T-møtrik 1/4\"-20 (Einschlagmutter), Ø8 × 8, flange Ø19.",
    "  Mål den købte, før print (TNUT i gen2_concept.scad).",
    "• Låseskruen og magneten er de samme som på væggen.",
    "• 5 kg sandsæk på stativkrogen.",
], 13, 20)

# ---------------- stability ----------------
frame(30, 940, 1840, 420, "Stabilitet")
lines(50, 1000, [
    "Boksen på beslaget:",
    "• Boksen står på hylden, og hylden står direkte på kuglehovedet. Vægten går lige ned gennem T-møtrikken; der er ingen arm, der kan bøje.",
    "• Skinnen og låsetungen holder toppen, som på væggen. Boksen kan ikke løftes af uden vores bit, og løftealarmen (reed) virker.",
    "• Låsetungen sidder i bundslidsen med 0,2 mm luft i hver side, og skinnen holder toppen, så boksen kan ikke dreje eller glide på hylden. Låseskruen spænder bundknasten",
    "  op mod tungen (0,1 mm luft), så boksen sidder fast mellem hylden og tungen. v1 havde 2 styrepinde; de spærrede for at svinge bunden ind og er fjernet.",
    "• T-møtrikkens flange sidder oppe i hylden: lynpladen spænder hele hylden (8 mm ASA) fast, og boksens bund lukker over flangen.",
    "",
    "Stativet:",
    "• Tyngdepunktet ligger lige over midtersøjlen, så stativet står lige så stabilt som med et kamera. Før stod skruen 78 mm bag tyngdepunktet.",
    "• Det, der vælter et stativ, er et skub i toppen mod to ben: med lynpladen i 128 cm vipper boks + stativ (3,3 kg) ved ca. 5 N (et halvt kilo), med 5 kg sandsæk",
    "  ved ca. 11 N (skøn: ben spredt 24°, ca. 45 cm radius). Beslaget kan ikke gøre stativet bredere, så: altid sandsæk, benene helt ud, midtersøjlen nede,",
    "  og stativet op ad en væg eller i et hjørne, ikke midt på dansegulvet. Det skal stå i guiden i kassen.",
    "",
    "Tjek på første print:",
    "• At Sirui-klemmen ikke rammer strømstikket (lynpladen på tværs: ca. 2 mm luft, hvis klemmen er 44 mm dyb).  • Bunden svinger ind over tungen, og boksen rokker ikke, når skruen er i.",
    "• T-møtrikken: hullerne passer til den købte møtrik.  • Træk-test: boksen på stativet, løft i hjørnerne og skub fra siden.",
], 14, 23)

t(50, H - 14, f"Kilde: hardware/render/drawing/draw_stativbeslag.py · {VER}_3d.glb (hardware/tools/make_stativbeslag.py)", 12, "#888")
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Helvetica, Arial, sans-serif">' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT, output_width=W)
print(OUT)
