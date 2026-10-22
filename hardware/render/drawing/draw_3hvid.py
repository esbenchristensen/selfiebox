"""Line drawing halo-gen2-v18: a third white COB strip recessed in the reflector (light sim variant C), held by a lip and the light ring."""
import sys
import cairosvg
OUT = sys.argv[1]
W, H = 1800, 1180
o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')
def poly(pts, f, fill, stroke, sw=1.2, op=1, dash=None):
    o.append('<path d="M' + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts)) + f'Z" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"'
             + (f' stroke-dasharray="{dash}"' if dash else "") + "/>")
def rect(y0, y1, r0, r1, f, fill, stroke, sw=1.2, op=1, dash=None): poly([(y0, r0), (y1, r0), (y1, r1), (y0, r1)], f, fill, stroke, sw, op, dash)
def line(pts, f, col, sw=1.4, dash=None, arrow=False):
    d = "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts))
    o.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw}"' + (f' stroke-dasharray="{dash}"' if dash else "") + (' marker-end="url(#ar)"' if arrow else "") + "/>")
def dim(p0, p1, f, s, off=(0, 0), col="#2563eb", size=13):
    a, b = f(p0), f(p1)
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="{col}" stroke-width="1.1" marker-start="url(#da)" marker-end="url(#da)"/>')
    t((a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1], s, size, col, 600, "middle")
def lead(f, p, lx, ly, s, col, size=14):
    ax, ay = f(p)
    o.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="3" fill="{col}"/><path d="M{ax:.1f},{ay:.1f}L{lx - 6:.1f},{ly - 4:.1f}" stroke="{col}" stroke-width="1"/>')
    t(lx, ly, s, size, col)
def box(x, y, w, h): o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="none" stroke="#d6d3cb" stroke-width="1.2"/>')

o.append('<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#d97706"/></marker>'
         '<marker id="ag" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0,0L8,4L0,8Z" fill="#16a34a"/></marker>'
         '<marker id="da" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,1L7,4L0,7Z" fill="#2563eb"/></marker>'
         '<linearGradient id="rgb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#22c55e"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>')
def garrow(p0, p1, f, sw=2.4):
    a, b = f(p0), f(p1)
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="#16a34a" stroke-width="{sw}" marker-end="url(#ag)"/>')

BLK, WHT, WST, NAT, NST, NEW = "#2b2b2f", "#f4f0e6", "#8a8578", "#fffdf8", "#a39e90", "#16a34a"
WCOB, WCS = "#fff3c4", "#b45309"
ring = [(-0.5, -6.85), (-0.5, 6.85), (3.2, 6.85), (3.2, 8.1), (4.2, 8.1), (4.2, 5.65), (0.5, 5.65), (0.5, -5.65), (4.2, -5.65), (4.2, -8.1), (3.2, -8.1), (3.2, -6.85)]
refl_r = lambda y: -6.0 + (y - 4.2) * 10.4 / 22.25

def channel(F, floor, refl):
    rect(0, 3.2, -11, -7.0, F, BLK, BLK); rect(0, 3.2, 7.0, 11, F, BLK, BLK)
    rect(3.2, 27.7, 8.2, 9.8, F, BLK, BLK); rect(3.2, 27.7, -9.8, -8.2, F, BLK, BLK)
    rect(27.7, 31.7, -11, 11, F, WHT, WST)
    rect(floor, 27.71, -8.1, 8.1, F, WHT, WST)
    poly(refl, F, WHT, WST)
    rect(4.2, floor + 0.01, 6.9, 8.1, F, WHT, WST)
    poly(ring, F, NAT, NST, 1.3)

def rays(F, ys, top):
    for y in ys:
        col = "#7c3aed" if y > 22 else "#d97706"
        r1 = refl_r(y) + 0.25
        line([(y, top), (y, r1)], F, col, 1.2)
        line([(y, r1), (1.0, r1)], F, col, 1.2, arrow=True)

# ---------- 1: today ----------
import math
U, N = (0.906, 0.4234), (0.4234, -0.906)          # along the reflector (front -> back), into its material
def P(s, d): return (4.2 + U[0] * s + N[0] * d, -6.0 + U[1] * s + N[1] * d)
FL = 27.4
def stem(F, y0):
    poly([(y0, 6.9), (y0 + 0.6, 6.9), (y0 + 0.6, 4.35), (y0 - 1.1, 4.35), (y0 - 1.25, 4.55), (y0 - 1.1, 4.8), (y0, 4.8)], F, WHT, NEW, 1.4)
def v18(F, pocket):
    refl = [(4.2, -8.1), (4.2, -6.0)] + pocket + [(26.45, 4.4), (FL, 4.4), (FL, -8.1)]
    channel(F, FL, refl)
    rect(4.2, 4.6, 4.5, 6.9, F, WHT, NEW, 1.4); stem(F, 12.8); stem(F, 21.6)
    rect(4.7, 12.7, 4.9, 6.9, F, WCOB, WCS, 1.4); rect(13.5, 21.5, 4.9, 6.9, F, WCOB, WCS, 1.4)
    rect(22.3, 27.3, 4.7, 6.9, F, "url(#rgb)", "#334155", 1.3)
S0, S1 = 2.5, 10.6                                  # strip 3 along the slope
t(60, 56, "Selfi Halo gen 2 · v18-forslag: 3. hvid strip nedsænket i reflektoren", 26, w=700)
t(60, 84, "Outline-skitse til godkendelse. Bygger på lys-simuleringens variant C (ca. 148 % lys mod i dag) og v18-kantsporene. Snit, front til venstre, ydersiden op. Mål i mm. 22. okt. 2026", 14, "#666")

# ---------- A: normal section ----------
box(40, 110, 1000, 640)
t(60, 140, "A  Snit hele vejen rundt (undtagen ved klikstikket)", 18, w=600)
s = 20; X0, Y0 = 110, 410
FA = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)
pocket = [P(S0 - 0.1, 0), P(S0 - 0.1, 2.7), P(S1 + 0.1, 2.7), P(S1 + 0.1, 0.5), P(S1 - 1.0, 0.5), P(S1 - 1.2, 0.25), P(S1 - 1.0, 0)]
v18(FA, pocket)
poly([P(S0, 0.6), P(S1, 0.6), P(S1, 2.6), P(S0, 2.6)], FA, WCOB, WCS, 1.6)
poly([P(S0 + 2.2, 0.6), P(S1 - 2.2, 0.6), P(S1 - 2.2, 0.85), P(S0 + 2.2, 0.85)], FA, "#f59e0b", "none", 0)
poly([P(S1 + 0.1, 0.5), P(S1 - 1.0, 0.5), P(S1 - 1.2, 0.25), P(S1 - 1.0, 0), P(S1 + 0.1, 0)], FA, WHT, NEW, 1.8)          # back lip
nose = [(4.2, -5.65), P(0, 0), P(S0 - 0.1, 0), P(S0 + 0.05, 0.55), P(S0 + 1.0, 0.55), P(S0 + 1.3, 0.0), P(S0 + 1.0, -0.6), P(0.6, -0.6)]
poly(nose, FA, NAT, NEW, 1.8)                                                                                          # light-ring nose
c = P((S0 + S1) / 2, 0.3); n = (-N[0], -N[1])
for k in (-2.5, 0, 2.5):
    a = P((S0 + S1) / 2 + k, 0.5)
    line([a, (a[0] + n[0] * 9 - U[0] * 3.5, a[1] + n[1] * 9 - U[1] * 3.5)], FA, "#d97706", 1.2, arrow=True)
LX = X0 + 33 * s
rows = [(P(S1 - 0.5, 0.2), "Læbe over bagkanten (peger fremad: kan printes)", NEW),
        (P(S0 + 0.6, -0.3), "Næse på lysringen holder forkanten", NEW),
        (P(5.0, 1.6), "Hvid COB 8 mm (3), 0,6 under fladen", WCS),
        (P(S0 + 0.5, 2.6), "Lomme 2,7 dyb, 0,7 mm tilbage mod indervæggen", "#2563eb"),
        ((14.5, -2.5), "Reflektoren bag lommen uændret", WST),
        ((8.7, 5.9), "Hvid 1 og 2 i kantspor (v18)", WCS), ((24.8, 5.8), "RGB i tæt bane (v18)", "#7c3aed")]
for i, (p, s_, col) in enumerate(sorted(rows, key=lambda r: FA(r[0])[1])): lead(FA, p, LX, 175 + 30 * i, s_, col, 13)
notes = ["Lommen ligger forrest på den skrå flade (5,5 til 13 mm inde), hvor reflektoren er tykkest i forhold til strippen.",
         "Forkanten kan ikke få en læbe i bagrammen (den ville hænge i luften i printet). I stedet får lysringen en lille næse",
         "bagud. Ringen printes med fronten ned, så næsen kan printes. Når bagrammen sættes på, glider næsen ned over",
         "forkanten og trykker strippen ned i lommen. Næsen rører kun den kant, der ikke lyser (2,2 mm).",
         "Strip 3 lyser mest ud mod stripvæggen og ca. 25° frem. Lyset rammer de hvide strips og væggen og kommer frem gennem ringen."]
for i, line_ in enumerate(notes): t(60, 652 + 20 * i, line_, 13, "#444")

# ---------- B: clip section ----------
box(1060, 110, 700, 640)
t(1080, 140, "B  Snit ved klikstikket (16 mm ved kameraet)", 18, w=600)
s = 14; X0, Y0 = 1110, 400
FB = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)
CS0, CS1, CD = 1.75, 11.35, 2.72                    # clip along the slope, bottom depth limited by the inner wall
cp = [P(CS0 - 0.2, 0), P(CS0 - 0.2, CD + 0.2), P(CS1 + 0.2, CD + 0.2), P(CS1 + 0.2, 0)]
v18(FB, cp)
poly([P(CS0, CD - 4.3), P(CS1, CD - 4.3), P(CS1, CD), P(CS0, CD)], FB, "#e5e7eb", "#475569", 1.8)
lead(FB, P(6.5, CD - 3.5), 1580, 300, "Klikstik 9,6 × 4,3", "#475569", 13)
dim(P(CS1 + 1.2, 0), P(CS1 + 1.2, CD - 4.3), FB, "1,6", (18, 4))
lead(FB, P(CS0 + 0.3, CD + 0.1), 1580, 470, "0,5 mm til indervæggen", "#2563eb", 13)
for i, line_ in enumerate(["Stikket kan ikke synke helt ned: det stikker ca. 1,6 mm op over den skrå flade.",
                           "Det er kun de 16 mm ved kameraet, hvor lysringen alligevel slutter.",
                           "Ingen kollision: hvid 2's stik sidder i samme side, men ude ved stripvæggen,",
                           "og hvid 1 + RGB har stik i den anden side.",
                           "Ledningen går bagud gennem reflektoren ved x = 19,5 som de andre."]):
    t(1080, 640 + 21 * i, line_, 13, "#444")

# ---------- C: front view of the strip ends ----------
box(40, 770, 1720, 290)
t(60, 800, "C  Forfra ved kameraet: hvor de fire stik sidder (ét stik pr. strip, fødes fra én ende)", 18, w=600)
sx, cx, ty = 12, 900, 840
def fr(x, z): return (cx + x * sx, ty + z * sx)
o.append(f'<rect x="{fr(-17, 0)[0]}" y="{ty - 6}" width="{34 * sx}" height="{12.5 * sx}" fill="#e5e7eb" stroke="#94a3b8" stroke-dasharray="5 4"/>')
t(cx, ty + 72, "kamera (ingen kanal her)", 13, "#64748b", 600, "middle")
lanes = [(0, "Hvid 1", WCOB, WCS, -1), (3, "Hvid 2", WCOB, WCS, 1), (6, "RGB", "#c4b5fd", "#7c3aed", -1), (9.5, "Hvid 3 (reflektor)", WCOB, NEW, 1)]
for z, name, fill, st, side in lanes:
    y = ty + z * sx
    for sd in (-1, 1):
        x0 = cx + sd * 17 * sx; x1 = cx + sd * 58 * sx
        stop = cx + sd * (17 + (16 if sd == side else 34)) * sx
        o.append(f'<rect x="{min(stop, x1)}" y="{y}" width="{abs(x1 - stop)}" height="{2.2 * sx}" fill="{fill}" stroke="{st}"/>')
        if sd == side:
            o.append(f'<rect x="{min(x0, stop)}" y="{y - 3}" width="{16 * sx}" height="{2.2 * sx + 6}" fill="#e5e7eb" stroke="#475569" stroke-width="1.6"/>')
    t(cx + 67 * sx if False else 70, y + 20, name, 13, st, 600)
t(70, ty + 175, "Hvid 3 får stik i højre side ved siden af hvid 2 (to stik over hinanden: hvid 2 ved væggen, hvid 3 i reflektoren). Strippen i den anden side stopper 34 mm fra kameraet ligesom de andre.", 13, "#444")
t(70, ty + 197, "Til prøvestykket: et 60 mm stykke af bagrammen med kantspor, reflektorlomme og et stykke lysring med næse, så du kan prøve at sætte alle 4 strips i og køre fingeren langs.", 13, NEW, 600)

svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
