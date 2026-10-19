"""Line drawing v2b: light channel with two strips and a 45 degree reflector, camera on printed pegs, fasteners."""
import json, sys
D = json.load(open(sys.argv[1])); P = D["parts"]; OUT = sys.argv[2]
W, H = 1800, 1420
o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')
def poly(pts, f, fill, stroke, sw=1.2, op=1):
    o.append('<path d="M' + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts)) + f'Z" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>')
def rect(y0, y1, r0, r1, f, fill, stroke, sw=1.2, op=1): poly([(y0, r0), (y1, r0), (y1, r1), (y0, r1)], f, fill, stroke, sw, op)
def line(pts, f, col, sw=1.4, dash=None, arrow=False):
    d = "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts))
    o.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw}"' + (f' stroke-dasharray="{dash}"' if dash else "") + (' marker-end="url(#ar)"' if arrow else "") + "/>")
PEND = []
def lead(ax, ay, lx, ly, s, col): PEND.append((ax, ay, lx, ly, s, col))
def flush(top, step=28):
    rows = sorted(PEND, key=lambda r: r[1]); PEND.clear()
    for i, (ax, ay, lx, ly, s_, col) in enumerate(rows): _lead(ax, ay, lx, top + step * i, s_, col)
def _lead(ax, ay, lx, ly, s, col):
    o.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="3" fill="{col}"/><path d="M{ax:.1f},{ay:.1f}L{lx - 6:.1f},{ly - 4:.1f}" stroke="{col}" stroke-width="1"/>')
    t(lx, ly, s, 14, col)
o.append('<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#d97706"/></marker>'
         '<linearGradient id="rgb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ef4444"/><stop offset=".5" stop-color="#22c55e"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>')
t(60, 56, "Selfi Halo gen 2 · v2: lyskanal med to strips og fastgørelse", 26, w=700)
t(60, 84, "Stregtegning til godkendelse, kun hovedenheden. Mål i mm, forstørret. 19. okt. 2026", 14, "#666")

# ---------- A: section through the light channel (front to the left, outside up) ----------
s = 13; X0, Y0 = 60 + 4 * s, 150 + 18 * s
F = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)        # p = (y depth, r radial)
t(60, 132, "A  Snit gennem lyskanalen (siden af boksen)", 18, w=600)
BLK, WHT, WST = "#2b2b2f", "#f4f0e6", "#8a8578"
rect(0, 3.2, -16, -7, F, BLK, BLK); rect(0, 3.2, 7, 16.8, F, BLK, BLK)            # front face
rect(3.2, 6, 15.3, 16.8, F, BLK, BLK)                                                # skirt
rect(6, 30, 13.8, 16.8, F, "#3f3f46", "#3f3f46", op=0.8)                             # shell wall
rect(3.2, 19.7, 8.2, 9.8, F, WHT, WST); rect(3.2, 19.7, -9.8, -8.2, F, WHT, WST)     # white channel walls
rect(17.7, 19.7, -9.8, 9.8, F, WHT, WST)                                             # floor (2 mm)
poly([(3.5, -8.2), (3.5, -7.0), (17.7, 5.5), (17.7, -8.2)], F, WHT, WST)            # 45 degree reflector
rect(19.7, 23.7, -16, 9.8, F, "#77777d", "#52525b", op=0.75)                         # back frame
rect(3.7, 19.2, -16, -11.5, F, "#253041", "#253041", op=0.35)                        # display
# light ring: 1 mm face + two locating walls
rect(-1.6, -0.6, -9, 9, F, "#fffdf8", "#8a8578")
rect(-0.6, 3.0, 5.65, 6.85, F, "#fffdf8", "#8a8578"); rect(-0.6, 3.0, -6.85, -5.65, F, "#fffdf8", "#8a8578")
rect(3.6, 11.6, 6.0, 8.2, F, "#fff3c4", "#b45309", 1.6)                              # white strip, 8 mm
o.append('<g>'); rect(12.1, 17.1, 6.0, 8.2, F, "url(#rgb)", "#334155", 1.4); o.append('</g>')   # RGB strip, 5 mm
k = 12.5 / 14.2
for y in (5, 7.5, 10, 13.5, 16):
    r = -7.0 + (y - 3.5) * k
    col = "#d97706" if y < 12 else "#7c3aed"
    line([(y, 6.0), (y, r + 0.2)], F, col, 1.3)
    line([(y, r + 0.2), (-0.4, r + 0.2)], F, col, 1.3, arrow=True)
LX = X0 + 26 * s + 40
lead(*F((-1.1, 3)), LX, 162, "Lysring: kun 1 mm lysflade i naturfarvet ASA (var 4,8 mm hvid)", "#8a8578")
lead(*F((7.6, 7.1)), LX, 190, "Hvid foto-strip 8 mm, 24 V, CRI 90+, 4000 K", "#b45309")
lead(*F((14.6, 7.1)), LX, 218, "RGB-strip 5 mm til effekter (adresserbar)", "#7c3aed")
lead(*F((12, -3)), LX, 268, "45° hvid reflektor kaster lyset ud gennem ringen", "#8a8578")
lead(*F((18.7, 0)), LX, 296, "Hvid bund og vægge, printet i fronten (2. materiale)", "#8a8578")
lead(*F((21.7, -13)), LX, 340, "Bagramme", "#52525b")
lead(*F((11, -14)), LX, 368, "Skærm", "#253041")
lead(*F((1.6, -13)), LX, 396, "Front, sort ASA", "#3f3f46")
lead(*F((20, 15.3)), LX, 424, "Skal, sort ASA", "#3f3f46")
flush(Y0 - 17 * s)
notes = ["Begge strips står på kant mod ydervæggen, så de bøjer pænt rundt i hjørnerne og går rundt i ét stykke.",
         "Reflektoren vender lyset 90° frem mod ringen. Hvid lyser den inderste halvdel af ringen, RGB den yderste.",
         "Skøn: ca. 500 lm ud af ringen, ca. 260–300 lux på ansigtet ved 0,8 m (mål: 250). Testes på et 20 cm prøvestykke."]
for i, n in enumerate(notes): t(60, Y0 + 16 * s + 26 + 19 * i, n, 13, "#444")

# ---------- B: camera on printed pegs ---------------------------------------------------
s2 = 12; XB, YB = 1180, 150 + 14 * 12
G = lambda p: (XB + p[0] * s2, YB - p[1] * s2)       # (y, z - lens)
t(1180 - 0, 132, "B  Kameraet på printede tappe (ingen skruer)", 18, w=600)
rect(0, 3.2, -14, -6, G, BLK, BLK); rect(0, 3.2, 6, 14, G, BLK, BLK)
for z in (-10.5, 10.5):
    rect(3.2, 9.5, z - 2.3, z + 2.3, G, BLK, BLK)                       # boss Ø4.6 (as today)
    rect(9.5, 12.0, z - 1.0, z + 1.0, G, BLK, BLK)                      # peg Ø2.0 through the board hole
    rect(10.8, 19.7, z - 2.5, z - 1.2, G, "#77777d", "#52525b"); rect(10.8, 19.7, z + 1.2, z + 2.5, G, "#77777d", "#52525b")   # tube finger
rect(9.5, 10.62, -12.5, 12.5, G, "#2e7d4f", "#14532d")                  # camera board
rect(3.6, 9.5, -4.25, 4.25, G, "#9aa3b5", "#4b5563")                     # lens
rect(19.7, 23.7, -14, 14, G, "#77777d", "#52525b", op=0.75)              # back frame
LB = XB + 24 * s2 + 30
lead(*G((10.9, -10.5)), LB, 200, "Tap Ø2,0 printet i fronten, gennem kortets hul", "#3f3f46")
lead(*G((15, 12)), LB, 228, "Rør på bagrammen trykker kortet fast", "#52525b")
lead(*G((10, 0)), LB, 256, "Kameraets printkort", "#14532d")
lead(*G((6.5, -2)), LB, 284, "Linse", "#4b5563")
flush(180)
for i, n in enumerate(["Kameraet vejer 4 g. Tappen tåler ca. 45 N på tværs, mere end 100 gange,", "hvad et stød på 10 g giver. 4 skruer M2 × 6 sparet."]):
    t(1180, YB + 15 * s2 + 18 * i, n, 13, "#444")

# ---------- C: where the screws are -----------------------------------------------------
sc = 1.05; XC, YC = 1180 + 111.25 * sc, 820 + 306 * sc
C = lambda v: (XC + v[0] * sc, YC - v[1] * sc)
t(1180, 800, "C  Skruer bagfra (boksen set fra væggen)", 18, w=600)
def ppath(polys, f, stroke, sw, fill="none", op=1):
    d = "".join("M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, p)) + "Z" for p in polys)
    o.append(f'<path d="{d}" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}" fill-rule="evenodd"/>')
big = max(P["skal"]["front"], key=len)
ppath([big], lambda v: C((-v[0], v[1])), "#222", 1.3)
for x, z in [(-89.09, 22.16), (-89.09, 283.84), (89.09, 22.16), (89.09, 283.84)]:
    cx, cy = C((-x, z)); o.append(f'<circle cx="{cx}" cy="{cy}" r="5" fill="#2563eb"/>')
cx, cy = C((56, 18)); o.append(f'<circle cx="{cx}" cy="{cy}" r="6" fill="#e11d48"/>')
cx, cy = C((0, 289.2)); o.append(f'<circle cx="{cx}" cy="{cy}" r="5" fill="#16a34a"/>')
LC = 1180 + 222.5 * sc + 30
for i, (col, s_) in enumerate([("#2563eb", "4 frontskruer 3,0 × 14, inde i stolper i bagvæggen"),
                               ("#e11d48", "1 låseskrue 4 × 25 Torx med pin, nedefra"),
                               ("#16a34a", "Kamera: printede tappe, ingen skruer")]):
    o.append(f'<circle cx="{LC + 6}" cy="{860 + 26 * i - 5}" r="6" fill="{col}"/>'); t(LC + 20, 860 + 26 * i, s_)
t(LC, 960, "Fra 9 til 5 købte skruer, 2 slags.", 14, "#111", 600)
t(LC, 984, "Skruerne sidder mod væggen og kan ikke", 13, "#444")
t(LC, 1002, "ses, når boksen hænger.", 13, "#444")

# ---------- D: why the front stays screwed -----------------------------------------------
t(60, 800, "D  Hvorfor fronten stadig skrues", 18, w=600)
rows = [("Printede kroge", "Fronten skal skubbes lige ind i vejrfugen hele vejen rundt. En stiv krog kan ikke gå i hak", "uden at fronten flytter sig til siden, og det forhindrer fugen. Derfor dur stive kroge ikke."),
        ("Printede snaplåse", "En snaplås skal bøje, og i fronten ville den bøje hen over printlagene, hvor ASA er svagest", "(ca. 15 MPa mod 40 MPa langs lagene). Den kan knække ved service eller hvis nogen hiver."),
        ("4 skruer (valgt)", "Hver skrue holder ca. 700 N i ASA (5,9 mm gevind). Samlet ca. 2.800 N, ca. 9 gange et hårdt", "ryk på 300 N. Skruerne klemmer også bagrammen fast, så den behøver ingen dele.")]
y = 836
for h, a, b in rows:
    t(60, y, h, 14, "#111", 600); t(240, y, a, 13, "#444"); t(240, y + 18, b, 13, "#444"); y += 54
t(60, y + 6, "Trykbuerne på bagrammen er printede buer på 1,2 mm, ikke købte fjedre. De trykker skærmen ind mod glasset.", 13, "#444")
t(60, y + 24, "Elektronikken sidder i printede holdere. Det eneste købte ud over skruerne er strips, elektronik og magnet.", 13, "#444")

svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Inter, Helvetica, Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>' + "".join(o) + "</svg>"
open(OUT, "w").write(svg)
