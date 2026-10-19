"""Line drawing v2c: camera hole from the Wide drawing, light ring captured from behind, print without ceilings."""
import math, sys
OUT = sys.argv[1]
W, H = 1800, 1230
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
def dim(p0, p1, f, s, off=(0, 0), col="#2563eb"):
    a, b = f(p0), f(p1)
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="{col}" stroke-width="1.1" marker-start="url(#da)" marker-end="url(#da)"/>')
    t((a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1], s, 13, col, 600, "middle")
PEND = []
def lead(ax, ay, lx, ly, s, col): PEND.append((ax, ay, lx, ly, s, col))
def flush(top, step=28):
    rows = sorted(PEND, key=lambda r: r[1]); PEND.clear()
    for i, (ax, ay, lx, ly, s_, col) in enumerate(rows):
        ly = top + step * i
        o.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="3" fill="{col}"/><path d="M{ax:.1f},{ay:.1f}L{lx - 6:.1f},{ly - 4:.1f}" stroke="{col}" stroke-width="1"/>')
        t(lx, ly, s_, 14, col)
o.append('<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#d97706"/></marker>'
         '<marker id="da" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,1L7,4L0,7Z" fill="#2563eb"/></marker>'
         '<linearGradient id="rgb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#22c55e"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>')
t(60, 56, "Selfi Halo gen 2 · v2: kamera, lysring der ikke kan slippe, og print uden lofter", 26, w=700)
t(60, 84, "Stregtegning til godkendelse, kun hovedenheden. Mål i mm, forstørret. 19. okt. 2026", 14, "#666")
BLK, WHT, WST, NAT, NST = "#2b2b2f", "#f4f0e6", "#8a8578", "#fffdf8", "#a39e90"

# ---------- A: section through the light channel (front to the left, outside up) ----------
s = 12; X0, Y0 = 60 + 4 * s, 150 + 18 * s
F = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)        # p = (y depth, r radial)
t(60, 132, "A  Snit gennem lyskanalen (siden af boksen)", 18, w=600)
rect(0, 3.2, -16, -7, F, BLK, BLK); rect(0, 3.2, 7, 16.8, F, BLK, BLK)              # front face
rect(3.2, 6, 15.3, 16.8, F, BLK, BLK)                                                  # skirt
rect(6, 34, 13.8, 16.8, F, "#3f3f46", "#3f3f46", op=0.8)                               # shell wall
rect(3.2, 27.7, 8.2, 9.8, F, BLK, BLK); rect(3.2, 27.7, -9.8, -8.2, F, BLK, BLK)       # channel walls, black, part of the front
rect(6, 27.7, 9.8, 14.8, F, "none", "#e11d48", 1.4, dash="5 4")                        # corner boss (4 corners only)
line([(6, 11.8), (27.7, 11.8)], F, "#e11d48", 1, "2 3")
rect(3.7, 19.2, -16, -11.5, F, "#253041", "#253041", op=0.35)                          # display
# back frame in white with the reflector ridge and the strip blade
rect(19.7, 27.7, -16, -9.9, F, WHT, WST); rect(27.7, 31.7, -16, 9.8, F, WHT, WST)
rect(25.7, 27.71, -8.1, 8.1, F, WHT, WST)
poly([(4.2, -8.1), (4.2, -6.0), (25.7, 5.0), (25.7, -8.1)], F, WHT, WST)
rect(4.2, 25.71, 6.9, 8.1, F, WHT, WST)
# light ring: face in the slot, walls, flange behind the front plate
ring = [(-0.5, -6.85), (-0.5, 6.85), (3.2, 6.85), (3.2, 8.1), (4.2, 8.1), (4.2, 5.65), (0.5, 5.65), (0.5, -5.65), (4.2, -5.65), (4.2, -8.1), (3.2, -8.1), (3.2, -6.85)]
poly(ring, F, NAT, NST, 1.4)
rect(4.6, 12.6, 5.4, 6.9, F, "#fff3c4", "#b45309", 1.6)                                 # white COB 8 mm
rect(12.7, 20.7, 5.4, 6.9, F, "#fff3c4", "#b45309", 1.6)                                # white COB 8 mm
rect(20.8, 25.6, 5.4, 6.9, F, "url(#rgb)", "#334155", 1.4)                              # RGB strip 5 mm
diag = lambda y: -6.0 + (y - 4.2) * 11.0 / 21.5
for y in (6, 9, 11.5, 14.5, 17.5, 19.5, 23):
    col = "#d97706" if y < 20.7 else "#7c3aed"
    line([(y, 5.3), (y, diag(y) + 0.25)], F, col, 1.3)
    line([(y, diag(y) + 0.25), (0.8, diag(y) + 0.25)], F, col, 1.3, arrow=True)
LX = X0 + 36 * s + 30
lead(*F((0, 2)), LX, 0, "Lysring i naturfarvet ASA: 1 mm lysflade i slidsen, 0,5 mm fremme", NST)
lead(*F((3.7, -7.6)), LX, 0, "Krave bag frontpladen: ringen kan ikke komme ud fremad", NST)
lead(*F((8.6, 6.1)), LX, 0, "2 × hvid COB-strip 8 mm, Ra95, 4000 K, 12 W/m (LEDlife, LEDproff)", "#b45309")
lead(*F((23.2, 6.1)), LX, 0, "RGB-strip 5 mm", "#7c3aed")
lead(*F((14, 7.5)), LX, 0, "Stripvæg på bagrammen trykker kraven ind (yderst)", WST)
lead(*F((15, -4)), LX, 0, "Reflektor på bagrammen trykker kraven ind (inderst)", WST)
lead(*F((29.7, -13)), LX, 0, "Bagramme i hvid ASA med reflektor og stripvæg, flad bagside", WST)
lead(*F((18, 12.8)), LX, 0, "Skruestolpe i ydervæggen, kun i de 4 hjørner", "#e11d48")
lead(*F((11, -14)), LX, 0, "Skærm", "#253041")
lead(*F((1.6, -13)), LX, 0, "Front, kun sort ASA (ingen 2. farve)", "#3f3f46")
lead(*F((30, 15.3)), LX, 0, "Skal, sort ASA", "#3f3f46")
flush(Y0 - 17 * s)
notes = ["Ringen ligger i slidsen med en krave bag frontpladen. Bagrammen klemmer kraven fast fra begge sider hele vejen rundt,",
         "så ringen hverken kan falde ud, løfte sig eller rasle. Ingen snaps, lim eller ekstra dele.",
         "Strips sættes på bagrammen ved bordet (åben adgang). To hvide COB giver ca. 2.000 lm/m, skønnet ca. 400 lux ved 0,8 m (mål 250).",
         "Kanalen bliver 8 mm dybere for at få plads til begge hvide strips. Der er plads: bag kanten sidder intet før y = 42 mm.",
         "Fronten har ingen bund i kanalen mere. Den er åben bagtil, så der er intet loft at printe. Hvid flade sidder kun på bagrammen."]
for i, n in enumerate(notes): t(60, Y0 + 16 * s + 26 + 19 * i, n, 13, "#444")

# ---------- B: camera section ------------------------------------------------------------
s2 = 14; XB, YB = 1100, 150 + 15 * 14
G = lambda p: (XB + p[0] * s2, YB - p[1] * s2)       # (y, z - lens)
t(1080, 132, "B  Kameraet (Wide), snit gennem linsen", 18, w=600)
hr, cr, rr = 3.675, 4.075, 3.9
poly([(0, -14), (0, -cr), (0.4, -hr), (1.3, -hr), (1.3, -rr), (3.2, -rr), (3.2, -14)], G, BLK, BLK)
poly([(0, 14), (0, cr), (0.4, hr), (1.3, hr), (1.3, rr), (3.2, rr), (3.2, 14)], G, BLK, BLK)
for z in (-1, 1):
    rect(3.2, 8.0, z * 5.8, z * 7.0, G, BLK, BLK)                          # light shroud around the holder
    rect(3.2, 8.6, z * 8.2, z * 12.8, G, BLK, BLK)                         # peg boss Ø4.6
    rect(8.6, 11.0, z * 9.5, z * 11.5, G, BLK, BLK)                        # peg Ø2.0 through the board
rect(8.6, 9.72, -12.5, 12.5, G, "#2e7d4f", "#14532d")                       # camera board
rect(4.53, 8.6, -5.4, 5.4, G, "#6b7280", "#374151")                         # lens holder 10.8 x 4.07
poly([(0.3, -3.475), (0.3, 3.475), (4.53, 3.625), (4.53, -3.625)], G, "#9aa3b5", "#4b5563")   # barrel
line([(-0.1, -16), (-0.1, 16)], G, "#999", 1, "4 4")
dim((-3.0, -hr), (-3.0, hr), G, "Ø7,35", off=(-26, 5))
t(*G((-1.2, -5.0)), "0,3", 13, "#2563eb", 600, "middle")
line([(-0.6, -4.6), (0.3, -3.6)], G, "#2563eb", 1)
dim((0.3, -15.5), (8.6, -15.5), G, "8,3", off=(0, 18))
LB = XB + 20 * s2 + 20
lead(*G((0.2, 3.9)), LB, 0, "Hul Ø7,35 (spids Ø6,95 + 0,4), kant 0,4 × 45°", "#3f3f46")
lead(*G((2, 0)), LB, 0, "Linsespids 0,3 mm bag forsiden", "#4b5563")
lead(*G((6.5, -5)), LB, 0, "Linseholder 10,8 × 4,07", "#374151")
lead(*G((9.2, 2)), LB, 0, "Kameraets printkort", "#14532d")
lead(*G((10, -10.5)), LB, 0, "Tap Ø2,0 gennem kortets hul", "#3f3f46")
lead(*G((6, 6.4)), LB, 0, "Sort krave holder lys ude fra linsen", "#3f3f46")
flush(170)
for i, n in enumerate(["Mål fra Raspberry Pis tegning RP-008155 (Wide): spids Ø6,95, 8,3 mm over printet.",
                       "Før: hul Ø8,6 med kegle Ø13,1 i forsiden, og spidsen sad 1,2 mm inde.",
                       "Nu ses kun linsens glas og en 0,2 mm sort spalte. Synsfeltet (120°) skæres ikke."]):
    t(1080, YB + 18 * s2 + 18 * i, n, 13, "#444")

# ---------- C: front view at the camera ------------------------------------------------------
s3 = 8; XC, YC = 1080 + 42 * s3, 780 + 17 * s3
C = lambda p: (XC + p[0] * s3, YC - p[1] * s3)
t(1080, 750, "C  Forfra ved kameraet", 18, w=600)
rect(-42, 42, -16, 16, C, BLK, BLK)
o.append(f'<path d="M{C((-19, 9))[0]:.1f},{C((-19, 9))[1]:.1f}L{C((-42, 9))[0]:.1f},{C((-42, 9))[1]:.1f}M{C((-19, -9))[0]:.1f},{C((-19, -9))[1]:.1f}L{C((-42, -9))[0]:.1f},{C((-42, -9))[1]:.1f}'
         f'M{C((19, 9))[0]:.1f},{C((19, 9))[1]:.1f}L{C((42, 9))[0]:.1f},{C((42, 9))[1]:.1f}M{C((19, -9))[0]:.1f},{C((19, -9))[1]:.1f}L{C((42, -9))[0]:.1f},{C((42, -9))[1]:.1f}'
         f'M{C((-19, 9))[0]:.1f},{C((-19, 9))[1]:.1f}L{C((-19, -9))[0]:.1f},{C((-19, -9))[1]:.1f}M{C((19, 9))[0]:.1f},{C((19, 9))[1]:.1f}L{C((19, -9))[0]:.1f},{C((19, -9))[1]:.1f}" stroke="#f59e0b" stroke-width="1.3" stroke-dasharray="5 4" fill="none"/>')
re_, cx = 6.85, 3.675 + 4 + 6.85
for sx in (-1, 1):
    pts = [(sx * 42, -re_), (sx * 42, re_)] + [(sx * (cx - re_ * math.cos(math.radians(a))), re_ * math.sin(math.radians(a))) for a in range(90, -91, -10)]
    poly(pts, C, NAT, NST, 1.4)
o.append(f'<circle cx="{XC}" cy="{YC}" r="{4.075 * s3:.1f}" fill="#111" stroke="#555"/><circle cx="{XC}" cy="{YC}" r="{3.3 * s3:.1f}" fill="#334155"/><circle cx="{XC}" cy="{YC}" r="{1.6 * s3:.1f}" fill="#64748b"/>')
dim((3.675, 0), (7.675, 0), C, "4", off=(0, -8), col="#93c5fd")
dim((-7.675, -12.5), (7.675, -12.5), C, "15,4", off=(0, 18), col="#93c5fd")
LCX = 1080; LCY = YC + 17 * s3 + 34
for i, (col, s_) in enumerate([("#a39e90", "Ringen ender rundt, 4 mm fra kamerahullet"), ("#f59e0b", "Før: ringen sluttede 19 mm fra linsen (stiplet)"),
                               ("#111", "Ringen er 13,7 mm bred i slidsen (før 18 mm med kanter ud over fronten).")]):
    o.append(f'<rect x="{LCX}" y="{LCY + 24 * i - 11}" width="12" height="12" fill="{col}" stroke="#999"/>'); t(LCX + 20, LCY + 24 * i, s_)
t(1080, LCY + 24 * 3 + 8, "Strippen kan ikke gå helt ind til kameraet, fordi kameraets printkort sidder bag ringen der.", 13, "#444")
t(1080, LCY + 24 * 3 + 26, "De sidste ca. 2 cm af ringen får lys fra siden. Prøvestykket viser, om enderne er lige så lyse.", 13, "#444")

# ---------- D: print errors -------------------------------------------------------------------
t(60, 800, "D  Printfejlene fra gen 1, og hvordan gen 2 undgår dem", 18, w=600)
rows = [("Årsag i gen 1", "Fronten printes med forsiden nedad. Flader på bagsiden, der vender nedad, bygges i luften, og lagene hænger", "og bliver til tråde. I hjørnerne er broen buet, så printeren ikke kan spænde den ud. Det er fejlen på billederne."),
        ("Gen 2 før rettelsen", "Kanalens bund var et ca. 16 mm bredt loft over hulrummet hele vejen rundt, også i hjørnerne. Samme fejl", "ville komme igen (målt på modellen: ca. 13.900 mm² nedadvendt flade)."),
        ("Regel nu", "Ingen del har nedadvendte flader fladere end 45°. Fronten er åben bagtil, bagrammen printes med bagsiden ned,", "og ringen med forsiden ned. Kanter, der vender nedad, får 45° affasning. Alle dele måles igen, før der laves printfiler."),
        ("Bonus", "Fronten bliver ét materiale (sort). Det hvide sidder på bagrammen, så printet bliver enklere og uden", "farveskift og spild.")]
y = 836
for h, a, b in rows:
    t(60, y, h, 14, "#111", 600); t(240, y, a, 13, "#444"); t(240, y + 18, b, 13, "#444"); y += 54

# ---------- E: assembly ------------------------------------------------------------------------
t(60, y + 30, "E  Samling (uden værktøj indtil skruerne)", 18, w=600)
steps = ["1. Fronten lægges med forsiden ned på bordet.", "2. Lysringen lægges i slidsen bagfra, kraven hviler på frontpladen.",
         "3. Strips klikkes i stik og sættes på bagrammens stripvæg ved bordet.", "4. Skærm og kamera på plads, bagrammen lægges i. Den klemmer ringen og skærmen.",
         "5. Skallen over, 4 skruer bagfra i hjørnerne. Samme 4 skruer som før, ingen nye dele."]
for i, s_ in enumerate(steps): t(60, y + 60 + 20 * i, s_, 13, "#444")

svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Inter, Helvetica, Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>' + "".join(o) + "</svg>"
open(OUT, "w").write(svg)
