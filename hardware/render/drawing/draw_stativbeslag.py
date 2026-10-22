"""Outline sketch selfi-stativbeslag-v1: how the gen 2 unit sits safely on the B2C floor tripod, and where the Selfi
logo goes on the back. A (proposal): printed stand bracket on the wall cleat with a logo panel; B (for comparison):
a 1/4"-20 socket straight in the back wall. The unit is taken from the newest gen 2 assembly (gen2_unit), the
wall cleat too; only the bracket's new parts (logo panel, foot, ribs) are drawn here.

Usage: python3 hardware/render/drawing/draw_stativbeslag.py <out.png>
"""
import sys
from pathlib import Path

import cairosvg
import numpy as np
import shapely
from shapely import affinity
from shapely.geometry import box as sbox
from shapely.ops import unary_union

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "tools"))
import gen2_unit  # noqa: E402

OUT = sys.argv[1]
W, H = 1900, 1720
o = []
BLK, BST, NEW, NST, LOGO_W, LOGO_G = "#2b2b2f", "#111", "#3f6d55", "#16a34a", "#f5f5f4", "#22d36b"
GHOST, GST = "#ecebe6", "#9a968c"


def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')


def lines(x, y, rows, size=14, col="#222", gap=21):
    for i, r in enumerate(rows):
        t(x, y + i*gap, r, size, col, 700 if r.startswith("•") is False and r.endswith(":") else 400)


def path(g, f, fill, stroke, sw=1.3, op=1.0, dash=None):
    gs = getattr(g, "geoms", [g])
    d = ""
    for p in gs:
        if p.is_empty:
            continue
        for ring in [p.exterior, *p.interiors]:
            d += "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, ring.coords)) + "Z"
    o.append(f'<path d="{d}" fill="{fill}" fill-opacity="{op}" fill-rule="evenodd" stroke="{stroke}" stroke-width="{sw}" '
             f'stroke-linejoin="round"' + (f' stroke-dasharray="{dash}"' if dash else "") + "/>")


def line(pts, f, col, sw=1.3, dash=None):
    o.append('<path d="M' + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts)) + f'" fill="none" stroke="{col}" stroke-width="{sw}"'
             + (f' stroke-dasharray="{dash}"' if dash else "") + "/>")


def dim(p0, p1, f, s, off=(0, 0), col="#2563eb", size=13):
    a, b = f(p0), f(p1)
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="{col}" stroke-width="1.1" marker-start="url(#da)" marker-end="url(#da)"/>')
    t((a[0] + b[0])/2 + off[0], (a[1] + b[1])/2 + off[1], s, size, col, 600, "middle")


def lead(f, p, lx, ly, s, col="#b45309", size=14):
    ax, ay = f(p)
    o.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="3" fill="{col}"/><path d="M{ax:.1f},{ay:.1f}L{lx:.1f},{ly - 5:.1f}" stroke="{col}" stroke-width="1"/>')
    t(lx + (4 if lx >= ax else -4), ly, s, size, col, 600, "start" if lx >= ax else "end")


def frame(x, y, w, h, col="#d6d3cb"):
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="none" stroke="{col}" stroke-width="1.4"/>')


def silhouette(m, ax):
    tri = m.vertices[m.faces][:, :, ax]
    polys = shapely.polygons(tri)
    return unary_union(polys[shapely.area(polys) > 1e-6]).buffer(0.05).buffer(-0.05)


def rr(x0, y0, x1, y1, r):
    return sbox(x0 + r, y0 + r, x1 - r, y1 - r).buffer(r, quad_segs=8)


# ---------------------------------------------------------------- geometry from the CAD (assembly coordinates) ----
# x right (seen from the front), y up and centred (unit 306 high: -153..153), z = 0 at the front face, back at -70.
asm = gen2_unit.latest_assembly()
VER = asm.name.split("_")[0]
parts, _, _ = gen2_unit._parts(["skal", "vaegbeslag", "stik", "printerdaeksel"])
lift = 153.0
for m in parts.values():
    m.apply_translation([0, -lift, 0])
shell_back = silhouette(parts["skal"], [0, 1])
shell_side = silhouette(parts["skal"], [2, 1])
cleat_back = silhouette(parts["vaegbeslag"], [0, 1])
cleat_side = silhouette(parts["vaegbeslag"], [2, 1])
plug_side = silhouette(parts["stik"], [2, 1])
logo = gen2_unit._parts(["logo_hvid", "logo_groen"])[0]
logo_w, logo_g = (silhouette(logo[k].apply_translation([0, -lift, 0]), [0, 1]) for k in ("logo_hvid", "logo_groen"))
lb = unary_union([logo_w, logo_g]).bounds

GROOVE = sbox(-60, 97, 60, 130)                 # cleat groove in the back wall (halo.scad: CLEAT_ZC 274, -27..+12)
LOCK = sbox(-82 - 9.6, -144.6, -82 + 9.6, -116.4)  # lock slot low in the back wall (LOCK_X -82, LOCK_TZ 18..36, DROP 9)
PLATE_Z = (-80.0, -84.0)                        # cleat plate: 10..14 behind the back wall (GAP_WALL 14, PLATE_T 4)

# A: the stand bracket = the wall cleat (same bar, same lock tongue) without wall-screw holes, plus
PANEL = rr(-95, 88, 95, 146, 8)                 # logo panel, 190 x 58, top 7 under the unit's top: hidden from the front
SPINE = rr(-30, -153, 30, 100, 6)               # spine down to the foot
FOOT_X, FOOT_Z, FOOT_T = (-35, 35), (-80, -132), 14   # foot behind the unit, flush with its underside
NUT_Z = -108.0
FOOT_BACK = sbox(FOOT_X[0], -153, FOOT_X[1], -139)
bracket_back = unary_union([cleat_back.buffer(2.5).buffer(-2.5), PANEL, SPINE, FOOT_BACK])
bracket_back = shapely.Polygon(bracket_back.exterior)   # the wall cleat's screw holes are not on the stand bracket
# logo, scaled to 130 wide, centred on the panel
sc = 130.0 / (lb[2] - lb[0])
def place_logo(g, cx, cy):
    g = affinity.translate(g, -(lb[0] + lb[2])/2, -(lb[1] + lb[3])/2)
    return affinity.translate(affinity.scale(g, -sc, sc, origin=(0, 0)), cx, cy)   # -sc: the back views flip x

# --------------------------------------------------------------------------------------------- page ----
o.append('<defs><marker id="da" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,1L7,4L0,7Z" fill="#2563eb"/></marker></defs>')
o.append(f'<rect width="{W}" height="{H}" fill="#fbfaf7"/>')
t(60, 56, "Selfi stativbeslag v1 · boksen sikkert på B2C-gulvstativet, logo bagpå", 26, w=700)
t(60, 84, f"Outline-skitse til godkendelse, kun hovedenheden + beslag. Boks og vægbeslag taget fra CAD ({VER}). Mål i mm. 22. okt. 2026", 14, "#666")

# ============ A ============
frame(40, 110, 1820, 900, "#16a34a")
t(60, 142, "A  Anbefalet: stativbeslag på vægbeslagets skinne, med logopanel bagpå", 19, "#166534", 700)
t(60, 166, "Boksen ændres ikke (B2B hænger stadig på væggen som i dag). Beslaget er ét printet emne i sort ASA, logoet indlagt i hvid + grøn som på fronten.", 14, "#444")

# A1: back view (seen from behind: the unit's left/right swap)
s = 1.55;  cx, cy = 330, 560
fA = lambda p: (cx - p[0]*s, cy - p[1]*s)
t(cx, 205, "Set bagfra (som gæsterne bag boksen ser den)", 15, w=600, anchor="middle")
path(shell_back, fA, BLK, BST, 1.4)
path(GROOVE, fA, "none", "#777", 1, dash="4 3")
path(bracket_back, fA, "#232326", NST, 2.2)
path(PANEL, fA, "#1d1d20", NST, 1.6)
path(place_logo(logo_w, 0, 117), fA, LOGO_W, "none")
path(place_logo(logo_g, 0, 117), fA, LOGO_G, "none")
path(FOOT_BACK, fA, "#2f2f33", NST, 1.6)
o.append(f'<circle cx="{fA((0, -146))[0]:.1f}" cy="{fA((0, -146))[1]:.1f}" r="5" fill="#bbb" stroke="#555"/>')
dim((95, 160), (-95, 160), fA, "logopanel 190", (0, -6))
dim((111.2, -168), (-111.2, -168), fA, "boks 222,5", (0, 18))
dim((-120, 88), (-120, 146), fA, "58", (16, 4))
lead(fA, (-75, 100), 560, 300, "logo indlagt 0,8 mm, hvid + grønne prikker")
lead(fA, (-25, 20), 560, 470, "ryg 60 bred ned til foden")
lead(fA, (82, -130), 560, 880, "låsetunge + låseskrue som vægbeslaget (uændret)")
lead(fA, (0, -146), 560, 840, "fod 70 × 52 med 1/4\"-20 stålmøtrik")

# A2: side view
s2 = 1.55;  sx0, sy0 = 960, 560
fS = lambda p: (sx0 - p[0]*s2, sy0 - p[1]*s2)
t(sx0 + 120, 205, "Set fra siden (front til venstre)", 15, w=600, anchor="middle")
path(shell_side, fS, BLK, BST, 1.4)
path(plug_side.intersection(sbox(-80, -200, 0, -150)), fS, "#555", "#333", 1)
path(cleat_side, fS, "#232326", NST, 1.8)
# panel/spine are the plate itself in profile (z -80..-84); foot + two ribs
path(sbox(PLATE_Z[1], -153, PLATE_Z[0], 146), fS, "#232326", NST, 1.8)
foot = sbox(FOOT_Z[1], -153, FOOT_Z[0], -153 + FOOT_T)
rib = shapely.Polygon([(FOOT_Z[0], -139), (FOOT_Z[1] + 6, -139), (FOOT_Z[0], -70)])
path(unary_union([foot, rib]), fS, "#2f2f33", NST, 1.8)
path(sbox(NUT_Z - 6.4, -153, NUT_Z + 6.4, -147.5), fS, "#bbb", "#555", 1)
# tripod head (Sirui Traveler 5AX, schematic): quick-release plate, clamp, ball, column
qr = sbox(NUT_Z - 26, -163, NUT_Z + 26, -153);  clamp = sbox(NUT_Z - 22, -178, NUT_Z + 22, -163)
path(qr, fS, "#9ca3af", "#4b5563", 1.2); path(clamp, fS, "#6b7280", "#374151", 1.2)
o.append(f'<circle cx="{fS((NUT_Z, -196))[0]:.1f}" cy="{fS((NUT_Z, -196))[1]:.1f}" r="{15*s2:.1f}" fill="#4b5563" stroke="#1f2937"/>')
path(sbox(NUT_Z - 12, -248, NUT_Z + 12, -208), fS, "#374151", "#1f2937", 1.2)
line([(NUT_Z, -147), (NUT_Z, -168)], fS, "#b45309", 1.6, dash="3 2")
# centre of gravity (estimate) and lever
cg = (-30, -5)
o.append(f'<circle cx="{fS(cg)[0]:.1f}" cy="{fS(cg)[1]:.1f}" r="7" fill="none" stroke="#dc2626" stroke-width="2"/>'
         f'<path d="M{fS(cg)[0]-7:.1f},{fS(cg)[1]:.1f}h14M{fS(cg)[0]:.1f},{fS(cg)[1]-7:.1f}v14" stroke="#dc2626" stroke-width="2"/>')
line([cg, (cg[0], -228)], fS, "#dc2626", 1, dash="5 4")
dim((cg[0], -228), (NUT_Z, -228), fS, "ca. 78", (-20, -6), "#dc2626")
dim((0, 165), (-70, 165), fS, "70", (0, -6))
dim((-70, 165), (-84, 165), fS, "14", (0, -6))
dim((FOOT_Z[0], -262), (FOOT_Z[1], -262), fS, "fod 52", (0, 18))
lead(fS, (-72, 113), sx0 + 250, 250, "skinnen i boksens rille")
lead(fS, (-82, 30), sx0 + 250, 380, "plade 4 mm, 10 bag boksen")
lead(fS, (-100, -110), sx0 + 250, 500, "2 ribber, alt i ét print")
lead(fS, (NUT_Z, -150), sx0 + 250, 620, "møtrik ind oppefra")
lead(fS, (NUT_Z + 20, -170), sx0 + 250, 700, "lynplade + stativhoved")
lead(fS, (-3, -175), sx0 - 30, 790, "strømstik ud i bunden (uændret)", "#555")
lead(fS, cg, sx0 - 60, 660, "tyngdepunkt (skøn)", "#dc2626")

# A3: how it is used + why
lines(1500, 230, [
    "Sådan bruges det (B2C):",
    "• Beslaget sidder låst på boksen fra os, med",
    "  låseskruen, og lynpladen er skruet i foden.",
    "• Kunden stiller stativet op, klikker boksen i",
    "  stativhovedet og spænder knappen. Intet værktøj.",
    "• Boksen kan ikke løftes af beslaget uden vores",
    "  bit, og reed-alarmen virker som på væggen.",
    "",
    "Hvorfor sikkert:",
    "• Boksen hænger i den samme skinne og lås, som",
    "  er lavet til at hænge på en væg i årevis.",
    "• Vægten går ned i foden og stålmøtrikken, ikke",
    "  i et gevind i plastik.",
    "• Foden printes liggende på siden, så lagene",
    "  går gennem hjørnet mellem plade og fod.",
    "• Sandsæk på stativkrogen (som planlagt).",
    "",
    "Hvorfor logoet på beslaget:",
    "• Bagsiden bag boksen er beslaget, ikke skallen,",
    "  så et logo på skallen ville være skjult.",
    "• Kun B2C-bokse får logo bagpå; B2B-skallen og",
    "  dens print er som i dag.",
    "• Logoet sidder øverst, som hos Myselfie.",
], 14)

# ============ B ============
frame(40, 1030, 1820, 650)
t(60, 1062, "B  Til sammenligning: 1/4\"-20 direkte i bagpladen (ikke anbefalet)", 19, "#7f1d1d", 700)
t(60, 1086, "Stativhovedet skrues direkte i boksens bagvæg; logoet indlægges i skallen. Boksen hænger på kuglehovedet tippet 90°.", 14, "#444")
s3 = 1.2;  bx, by = 280, 1370
fB = lambda p: (bx - p[0]*s3, by - p[1]*s3)
t(bx, 1120, "Set bagfra", 15, w=600, anchor="middle")
path(shell_back, fB, BLK, BST, 1.4)
path(GROOVE, fB, "none", "#777", 1, dash="4 3")
path(LOCK, fB, "none", "#777", 1, dash="4 3")
path(place_logo(logo_w, 0, 55), fB, LOGO_W, "none")
path(place_logo(logo_g, 0, 55), fB, LOGO_G, "none")
o.append(f'<circle cx="{fB((0, 0))[0]:.1f}" cy="{fB((0, 0))[1]:.1f}" r="{20*s3:.1f}" fill="#4b5563" stroke="#1f2937"/>'
         f'<circle cx="{fB((0, 0))[0]:.1f}" cy="{fB((0, 0))[1]:.1f}" r="5" fill="#bbb" stroke="#555"/>')
lead(fB, (0, 0), 470, 1370, "1/4\"-20 + boss i bagvæggen")
lead(fB, (40, 55), 470, 1260, "logo indlagt i skallen (under rillen)")
lead(fB, (40, 113), 470, 1180, "rillen til vægbeslaget er stadig synlig", "#555")
# side view B
s4 = 1.2;  qx, qy = 820, 1370
fQ = lambda p: (qx - p[0]*s4, qy - p[1]*s4)
t(qx + 60, 1120, "Set fra siden", 15, w=600, anchor="middle")
path(shell_side, fQ, BLK, BST, 1.4)
path(sbox(-80, -26, -70, 26), fQ, "#9ca3af", "#4b5563", 1.2)
path(sbox(-95, -22, -80, 22), fQ, "#6b7280", "#374151", 1.2)
o.append(f'<circle cx="{fQ((-110, 0))[0]:.1f}" cy="{fQ((-110, 0))[1]:.1f}" r="{15*s4:.1f}" fill="#4b5563" stroke="#1f2937"/>')
path(shapely.Polygon([(-122, -8), (-140, -8), (-140, -220), (-122, -220)]), fQ, "#374151", "#1f2937", 1.2)
lead(fQ, (-110, 0), qx + 170, 1560, "kuglehoved i 90°-hakket")
lines(1080, 1160, [
    "Ulemper:",
    "• Ny boss + møtrik i bagvæggen på ALLE bokse, også B2B;",
    "  bagvæggen er 3 mm og fyldt indvendigt (strøm, WLED, 4G, sensor).",
    "• Hele vægten i ét gevind i midten af en plastikvæg,",
    "  med vægtstang ud til kuglehovedet. Revner over tid.",
    "• Kuglehovedet i 90°-hakket er den svageste stilling på",
    "  et rejsestativ, og boksen kan dreje om skruen.",
    "• Et hul i bagvæggen er en ny vej for vand (vejrsikring).",
    "• Logoet skal printes ind i den store skal: AMS-skift",
    "  på hver skal, også dem der hænger på en væg.",
    "",
    "Fordel: ingen ekstra del. Men A er kun én printet del,",
    "der kan genbruges på alle udlejningsbokse.",
], 14)

t(60, H - 18, f"Kilde: hardware/render/drawing/draw_stativbeslag.py · boks + vægbeslag fra {asm.name}", 12, "#888")
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Helvetica, Arial, sans-serif">' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT, output_width=W)
print(OUT)
