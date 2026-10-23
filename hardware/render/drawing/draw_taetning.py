"""Line drawing halo-gen2 sealing proposal (after v19): one universal Ø1.5 O-ring cord, a camera window, the ring printed into the front."""
import sys, math
import cairosvg
OUT = sys.argv[1]
W, H = 1800, 2060
o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')
def poly(pts, f, fill, stroke, sw=1.2, op=1, dash=None):
    o.append('<path d="M' + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts)) + f'Z" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"'
             + (f' stroke-dasharray="{dash}"' if dash else "") + "/>")
def rect(y0, y1, r0, r1, f, fill, stroke, sw=1.2, op=1, dash=None): poly([(y0, r0), (y1, r0), (y1, r1), (y0, r1)], f, fill, stroke, sw, op, dash)
def line(pts, f, col, sw=1.4, dash=None, arrow=None):
    d = "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts))
    o.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw}"' + (f' stroke-dasharray="{dash}"' if dash else "") + (f' marker-end="url(#{arrow})"' if arrow else "") + "/>")
def dim(p0, p1, f, s, off=(0, 0), col="#2563eb", size=13):
    a, b = f(p0), f(p1)
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="{col}" stroke-width="1.1" marker-start="url(#da)" marker-end="url(#da)"/>')
    t((a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1], s, size, col, 600, "middle")
def lead(f, p, lx, ly, s, col, size=14):
    ax, ay = f(p)
    o.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="3" fill="{col}"/><path d="M{ax:.1f},{ay:.1f}L{lx - 6:.1f},{ly - 4:.1f}" stroke="{col}" stroke-width="1"/>')
    t(lx, ly, s, size, col)
def box(x, y, w, h): o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="none" stroke="#d6d3cb" stroke-width="1.2"/>')
def cord(f, y, r, wy, wr):            # squeezed cord: ellipse wy (along y) x wr (along r), in mm
    cx, cy = f((y, r)); ex, ey = f((y + wy / 2, r + wr / 2))
    o.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{abs(ex - cx):.1f}" ry="{abs(ey - cy):.1f}" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/>')
def num(x, y, n, col="#16a34a"):
    o.append(f'<circle cx="{x}" cy="{y}" r="13" fill="{col}"/>'); t(x, y + 5, str(n), 15, "#fff", 700, "middle")
def water(f, pts): line(pts, f, "#0284c7", 2.2, "5,3", "aw")

o.append('<defs><marker id="aw" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0L6,3L0,6Z" fill="#0284c7"/></marker>'
         '<marker id="ag" markerWidth="10" markerHeight="10" refX="7" refY="4" orient="auto"><path d="M0,0L8,4L0,8Z" fill="#16a34a"/></marker>'
         '<marker id="da" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,1L7,4L0,7Z" fill="#2563eb"/></marker></defs>')

BLK, WHT, WST, NAT, NST, GLS, GST = "#2b2b2f", "#f4f0e6", "#8a8578", "#fffdf8", "#a39e90", "#cfe9f1", "#5b8fa3"
NEW, RED = "#16a34a", "#dc2626"
t(60, 56, "Selfi Halo gen 2 · tætning efter v19: én universel O-ringsnor Ø1,5 overalt", 26, w=700)
t(60, 84, "Outline-skitse til godkendelse, kun hovedenheden. Bygger på halo-gen2-v19 (gen2_concept.scad). Mål i mm. Rød = O-ringsnor Ø1,5 (silikone), blå = vandvej. 23. okt. 2026", 14, "#666")

# ---------------------------------------------------------------- front view
box(40, 110, 470, 640)
t(60, 140, "Forfra: hvor der tætnes", 18, w=700)
S, X0, Y0 = 1.45, 275, 700          # px per mm, centre x, bottom of the box
fv = lambda p: (X0 + p[0] * S, Y0 - p[1] * S)
def rrect(cx, cz, w, h, r):
    x, y = fv((cx - w / 2, cz + h / 2)); return x, y, w * S, h * S, r * S
x, y, w_, h_, r_ = rrect(0, 153, 222.5, 306, 42.8)
o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w_:.1f}" height="{h_:.1f}" rx="{r_:.1f}" fill="{BLK}" stroke="#000"/>')
x, y, w_, h_, r_ = rrect(0, 153, 222.5 - 3, 306 - 3, 41.3)
o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w_:.1f}" height="{h_:.1f}" rx="{r_:.1f}" fill="none" stroke="{RED}" stroke-width="2.4" stroke-dasharray="7,4"/>')
# light ring (centre line 188.9 x 272.4, 14 wide), gap at the camera
for d, col in [(7, NAT), (-7, BLK)]:
    x, y, w_, h_, r_ = rrect(0, 153, 188.9 + 2 * d, 272.4 + 2 * d, 26 + d)
    o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w_:.1f}" height="{h_:.1f}" rx="{r_:.1f}" fill="{col}"/>')
gx = 14.7 + 4.5
x0_, y0_ = fv((-gx, 289.2 + 9)); x1_, _ = fv((gx, 0))
o.append(f'<rect x="{x0_:.1f}" y="{y0_:.1f}" width="{x1_ - x0_:.1f}" height="{18 * S:.1f}" fill="{BLK}"/>')
for sx in [-1, 1]:
    cx, cy = fv((sx * gx, 289.2)); o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{7 * S:.1f}" fill="{NAT}"/>')
x0_, y0_ = fv((-gx, 289.2 + 7)); o.append(f'<rect x="{x0_:.1f}" y="{y0_:.1f}" width="{2 * gx * S:.1f}" height="{14 * S:.1f}" fill="{BLK}"/>')
x, y, w_, h_, r_ = rrect(0, 151.85, 136.4, 217.6, 1)
o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w_:.1f}" height="{h_:.1f}" fill="#1f3b4d"/>')
x, y, w_, h_, r_ = rrect(0, 151.85, 136.4 + 2 * 3.2, 217.6 + 2 * 3.2, 3)
o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w_:.1f}" height="{h_:.1f}" rx="{r_:.1f}" fill="none" stroke="{RED}" stroke-width="2.2" stroke-dasharray="6,3"/>')
cx, cy = fv((0, 289.2))
o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{10 * S:.1f}" fill="{GLS}" fill-opacity=".35" stroke="{RED}" stroke-width="1.8" stroke-dasharray="4,2"/>')
o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{6.8 * S:.1f}" fill="#0b0b0d"/>')
for n, p, d in [(1, (-111, 120), (-16, 0)), (2, (-71, 230), (16, 0)), (3, (94.5, 120), (16, 0)), (4, (0, 300), (0, -20))]:
    a = fv(p); num(a[0] + d[0], a[1] + d[1], n)
t(60, 735, "5 højttaler og 6 låselomme sitter på bagsiden (se nederst).", 13, "#666")

# ---------------------------------------------------------------- list
box(530, 110, 1230, 640)
t(550, 140, "Alle steder, hvor vand kan komme ind (v19), og forslaget", 18, w=700)
rows = [
    ("1", "Front mod skal", "I dag: printet ribbe i rille + 2 drænhak. Lækker i de 4 hjørner, hvor frontskruernes tårne skærer skallens væg.",
     "Snor i rille i skallens forkant, 0,96 m. De 4 frontskruer klemmer. Skruerne 2 mm ind, så væggen er hel hele vejen rundt."),
    ("2", "Skærmglas", "I dag: skumbånd 3 × 1 i rille 3,2 × 0,6 (tesa, klæber).",
     "Samme snor i rillen i stedet, 0,73 m. Rillen bliver 2,0 × 1,2. Intet klister, kan tages ud og genbruges."),
    ("3", "Lysring (diffuser)", "I dag: løs ring med 0,15 mm skyggefuge på begge sider, 2 × 0,9 m fuge direkte ned til LED-stripsene.",
     "Ingen pakning: ringen printes sammen med fronten i natur-ASA (to farver, som logoet). Ingen fuge, én del mindre."),
    ("4", "Kamera", "I dag: åbent hul, linsen 0,3 mm bag forsiden, 0,2 mm luft rundt om linsen.",
     "Glas Ø20 × 1,5 bag en 1,6 mm kant, snor-ring Ø15 foran glasset, lille printet låsering bag. Kameraet 2,9 mm tilbage."),
    ("5", "Højttaler (bag)", "I dag: Ø2-huller i bagvæggen, højttaleren sidder løst bag dem.",
     "Snor rundt om hulfeltet under højttalerens flange, 0,19 m. Vand i gitteret når kun højttalerens forside."),
    ("6", "Låselomme (bag)", "I dag: slids i bagvæggen til låsetungen, åben ind til elektronikken.",
     "Ingen pakning: en lukket printet lomme indvendig om tungen og låseskruen."),
]
yy = 178
t(550, yy, "Sted", 13, "#666", 700); t(720, yy, "Nu", 13, "#666", 700); t(1210, yy, "Forslag", 13, "#666", 700)
def wrap(s, n):
    out, cur = [], ""
    for w in s.split():
        if len(cur) + len(w) + 1 > n: out.append(cur); cur = w
        else: cur = (cur + " " + w).strip()
    return out + [cur]
yy += 26
for n, name, now, new in rows:
    num(562, yy - 5, n); t(584, yy, name, 14, w=700)
    a, b = wrap(now, 58), wrap(new, 62)
    for i, s in enumerate(a): t(720, yy + i * 18, s, 13, "#444")
    for i, s in enumerate(b): t(1210, yy + i * 18, s, 13, NEW if i == 0 else "#14532d")
    yy += max(len(a), len(b)) * 18 + 22
t(550, yy + 6, "Ikke ændret: bundens luftslidser (skal ånde, har stænkhætter), mikrofonhuller (lukket lomme), strømhullet (proppen fylder det, vender nedad),", 13, "#666")
t(550, yy + 24, "styrehullerne (blinde). Toppen er helt lukket, så et glas eller en dekoration ovenpå kan ikke give vand ind; alle pakninger sidder bag flader, så", 13, "#666")
t(550, yy + 42, "tape, klistermærker eller temadele uden på boksen hverken rører eller trækker i dem.", 13, "#666")

# ---------------------------------------------------------------- section 1: front to shell
def panel(x, y, w, h, title, sub):
    box(x, y, w, h); t(x + 20, y + 30, title, 17, w=700); t(x + 20, y + 52, sub, 13, "#666")
panel(40, 770, 850, 400, "1  Front mod skal (snit gennem væggen)", "Venstre: i dag. Højre: forslag. Forsiden til venstre, ydersiden op.")
def sec1(ox, new):
    k = 22
    F = lambda p: (ox + p[0] * k, 880 + p[1] * k)
    rect(0, 3.2, 0, 11, F, BLK, "#000"); rect(3.2, 6, 0, 3, F, BLK, "#000")
    rect(6, 11, 3.25, 4.65, F, BLK, "#000")
    rect(6, 15, 0, 3, F, "#3a3a40", "#000")
    if not new:
        rect(6, 7.4, 1.0, 2.4, F, "#fff", "#000", 1)
        rect(5.99, 7.0, 1.4, 2.0, F, BLK, "#000", 1)
        water(F, [(5.8, -1.2), (6.0, 0.6), (6.6, 0.95), (7.2, 1.2), (7.2, 2.5), (6.3, 2.8), (6.3, 3.4), (8.5, 3.25), (12, 4.0)])
        t(ox, 1145, "Ribbe og rille er en labyrint, ikke en tætning.", 13, "#444")
        t(ox, 1163, "I hjørnerne skærer skruetårnene (Ø7) væggen op.", 13, "#444")
    else:
        rect(6, 7.2, 0.5, 2.5, F, "#fff", "#000", 1)
        cord(F, 6.6, 1.5, 1.2, 1.8)
        dim((6, -0.6), (7.2, -0.6), F, "1,2", (0, -6))
        dim((15.4, 0.5), (15.4, 2.5), F, "2,0", (22, 4))
        lead(F, (6.6, 1.5), ox + 250, 1100, "Snor Ø1,5 klemt til 1,2 (20 %)", RED)
        t(ox, 1145, "Ribbe og drænhak væk. Fronten trykker på snoren,", 13, NEW)
        t(ox, 1163, "skruerne holder den. Tungen bliver (styring).", 13, NEW)
    sec1(80, False); sec1(480, True)
t(110, 1125, "front", 12, "#888"); t(330, 1125, "skal", 12, "#888")

# ---------------------------------------------------------------- section 2: display
panel(910, 770, 850, 400, "2  Skærmglas mod frontens kant", "Venstre: i dag (skumbånd). Højre: forslag (samme snor). Snit ud fra billedkanten.")
def sec2(ox, new):
    k = 34
    F = lambda p: (ox + p[1] * k, 870 + p[0] * k)      # here y (depth) runs down, r to the right
    poly([(0, 1.6), (1.6, 0.6), (1.6, 11), (0, 11)], F, BLK, "#000")
    rect(1.6, 2.7, 0.0, 10.5, F, GLS, GST)
    rect(1.6, 2.7, -1.5, 0.0, F, "#1f3b4d", GST)
    if not new:
        rect(1.0, 1.6, 1.6, 4.8, F, "#fff", "#000", 1)
        rect(1.0, 1.6, 1.7, 4.7, F, "#fde68a", "#b45309", 1)
        lead(F, (1.3, 3.2), ox + 200, 1040, "Skumbånd 3 × 1, klemt til 0,6 (klæber)", "#b45309")
    else:
        rect(0.4, 1.6, 1.6, 3.6, F, "#fff", "#000", 1)
        cord(F, 1.0, 2.6, 1.2, 1.8)
        dim((0.4, 4.2), (1.6, 4.2), F, "1,2", (16, 4))
        dim((-0.5, 1.6), (-0.5, 3.6), F, "2,0", (0, -6))
        dim((0, 6.5), (0.4, 6.5), F, "0,4", (20, 4))
        lead(F, (1.0, 2.6), ox + 200, 1040, "Snor Ø1,5 klemt til 1,2", RED)
    t(ox + 5, 1125, "front 1,6", 12, "#888"); t(ox + 5, 1143, "glas (skærm)", 12, GST)
    if new:
        t(ox, 1163, "Ca. 0,4 mm plast foran rillen (2 lag, printes med forsiden ned).", 13, NEW)
sec2(960, False); sec2(1370, True)

# ---------------------------------------------------------------- section 3: camera
panel(40, 1190, 1060, 520, "4  Kamera med glas (snit gennem linsen)", "Venstre: i dag. Højre: forslag med glas Ø20 × 1,5. Forsiden til venstre, kameraets akse vandret, lysringen op.")
def sec3(ox, new):
    k = 12
    F = lambda p: (ox + 40 + p[0] * k, 1445 - p[1] * k)
    if not new:
        rect(0, 3.2, 3.675, 7.675, F, BLK, "#000"); rect(0, 3.2, -14, -3.675, F, BLK, "#000")
        rect(0, 3.2, 7.675, 14, F, NAT, NST)
        rect(3.2, 8.0, 5.8, 7.0, F, BLK, "#000"); rect(3.2, 8.0, -7.0, -5.8, F, BLK, "#000")
        rect(0.3, 8.6, -3.475, 3.475, F, "#555", "#222"); rect(8.6, 9.72, -12.5, 12.5, F, "#166534", "#052e16")
        water(F, [(-1.5, 3.6), (0.5, 3.55), (3.0, 3.55), (5.5, 4.2), (7.8, 5.2)])
        t(ox, 1665, "Åbent hul Ø7,35, 0,2 mm luft rundt om linsen.", 13, "#444")
        t(ox, 1683, "Spild når linsen og kan løbe ind langs den.", 13, "#444")
    else:
        lip, gt, gap, tip_r = 1.6, 1.5, 0.4, 2.0
        y_tip = lip + gt + gap
        r_gb = tip_r + gap * math.tan(math.radians(60))
        r_gf = r_gb + gt * math.tan(math.asin(math.sin(math.radians(60)) / 1.52))
        r_face = r_gf + 0.3 + lip * math.tan(math.radians(60))
        for s in [1, -1]:
            poly([(0, s * r_face), (lip, s * (r_gf + 0.3)), (lip, s * 6.6), (lip - 1.2, s * 6.6), (lip - 1.2, s * 8.6), (lip, s * 8.6), (lip, s * 10.2),
                  (lip + gt + 0.2, s * 10.2), (lip + gt + 0.2, s * 11.0), (3.2, s * 11.0), (3.2, s * 14), (0, s * 14)], F, BLK, "#000")
            rect(lip - 1.2, lip, s * 6.6, s * 8.6, F, "#fff", "#000", 1)
            cord(F, lip - 0.6, s * 7.6, 1.2, 1.8)
            rect(lip + gt, lip + gt + 3.2, s * 7.0, s * 10.0, F, "#4b5563", "#000")
        rect(0, 3.2, 12.2, 14, F, NAT, NST)
        rect(lip, lip + gt, -10, 10, F, GLS, GST)
        rect(y_tip, y_tip + 8.3, -3.475, 3.475, F, "#555", "#222")
        rect(y_tip + 8.3, y_tip + 9.42, -12.5, 12.5, F, "#166534", "#052e16")
        for s in [1, -1]:
            line([(y_tip, s * tip_r), (lip + gt, s * r_gb), (lip, s * r_gf), (0, s * (r_face - 0.3)), (-1.2, s * (r_face - 0.3 + 1.2 * 1.732))], F, "#d97706", 1.4, "4,3")
        dim((-0.8, -r_face), (-0.8, r_face), F, f"Ø{2 * r_face:.1f}", (-34, 4))
        dim((lip, -11.6), (lip + gt, -11.6), F, "1,5", (0, 18))
        dim((0, -12.6), (lip, -12.6), F, "1,6", (0, 18))
        dim((lip + gt + 3.4, -10), (lip + gt + 3.4, 10), F, "Ø20 glas", (40, 4))
        lead(F, (lip - 0.6, 7.6), ox + 300, 1260, "Snor-ring Ø1,5 (ca. 48 mm snor eller O-ring 13 × 1,5)", RED)
        lead(F, (lip + gt + 1.5, -8.5), ox + 300, 1600, "Printet låsering, klikker i bag glasset", "#4b5563")
        lead(F, (y_tip + 3, 2.0), ox + 300, 1440, "Linsen 0,4 mm bag glasset (autofokus bevæger den)", "#555")
        lead(F, (-0.6, -r_face + 0.5), ox + 300, 1530, "Synsfelt 120° diagonalt (Wide), 60° til siden", "#d97706")
        lead(F, (1.5, 13), ox + 300, 1300, "Lysringens ender ca. 4,5 mm længere ud", "#a39e90")
        t(ox, 1665, f"Hullet i forsiden bliver ca. Ø{2 * r_face:.0f} (i dag ca. Ø8), sort kegle.", 13, NEW)
        t(ox, 1683, "Glas Ø14 er for lille, når snoren skal ligge uden for synsfeltet.", 13, NEW)
sec3(80, False); sec3(420, True)

# ---------------------------------------------------------------- section 4: ring + back
panel(1120, 1190, 640, 520, "3  Lysring printet sammen med fronten", "Venstre: i dag (løs ring). Højre: forslag (ét print, to farver).")
ring = [(-0.5, -6.85), (-0.5, 6.85), (3.2, 6.85), (3.2, 8.1), (4.2, 8.1), (4.2, 5.65), (0.5, 5.65), (0.5, -5.65), (4.2, -5.65), (4.2, -8.1), (3.2, -8.1), (3.2, -6.85)]
def sec4(ox, new):
    k = 13
    F = lambda p: (ox + p[1] * k, 1300 + p[0] * k)
    rect(0, 3.2, -12, -7.0, F, BLK, "#000"); rect(0, 3.2, 7.0, 12, F, BLK, "#000")
    rect(3.2, 20, 8.2, 9.8, F, BLK, "#000"); rect(3.2, 20, -9.8, -8.2, F, BLK, "#000")
    rect(9, 20, -8.1, 8.1, F, WHT, WST, 1, .5)
    if not new:
        poly([(y, r * 0.98) for y, r in ring], F, NAT, NST, 1.3)
        water(F, [(-2.5, 7.0), (0.2, 6.95), (3.0, 6.95), (4.6, 7.4), (8, 7.4)])
        t(ox - 150, 1600, "0,15 mm fuge på begge sider", 13, "#444")
        t(ox - 150, 1618, "går direkte ned til stripsene.", 13, "#444")
    else:
        poly(ring, F, NAT, NST, 1.3)
        poly([(0, 7.0), (3.2, 7.0), (3.2, 8.2), (0, 8.2)], F, BLK, "none")
        poly([(0, -7.0), (3.2, -7.0), (3.2, -8.2), (0, -8.2)], F, BLK, "none")
        line([(-0.5, 6.85), (3.2, 6.85), (3.2, 8.1)], F, "#16a34a", 2.4)
        line([(-0.5, -6.85), (3.2, -6.85), (3.2, -8.1)], F, "#16a34a", 2.4)
        t(ox - 120, 1600, "Ingen fuge: natur-ASA og sort ASA", 13, NEW)
        t(ox - 120, 1618, "smelter sammen i printet.", 13, NEW)
    t(ox - 20, 1545, "LED-kanal", 12, "#888")
sec4(1280, False); sec4(1590, True)
t(1140, 1648, "Fronten printes allerede med forsiden ned og 2 farver (logoet),", 13, "#666")
t(1140, 1666, "og ringen printes også med forsiden ned. Ringen kan ikke skiftes", 13, "#666")
t(1140, 1684, "alene, men strips og bagramme tages ud bagfra som i dag.", 13, "#666")

# ---------------------------------------------------------------- bottom: part and back
box(40, 1730, 1720, 300)
t(60, 1762, "Den universelle del: O-ringsnor Ø1,5 mm, silikone 60 Shore (købes i meter, skæres til, enderne stødes sammen i rillen; ingen lim)", 17, w=700)
info = [
    "Pr. boks: front/skal 0,96 m + skærm 0,73 m + højttaler 0,19 m + kamera 0,05 m = ca. 1,95 m. Ingen snor i lysringen.",
    "Samme rille alle steder: 2,0 bred × 1,2 dyb (20 % klem). Snoren ligger løst i rillen, holdes af delen ovenpå, og kan tages ud og genbruges.",
    "Silikone frem for NBR (Esbens RS-link 234-1990 er NBR 70): NBR revner af ozon og sol og er stivere, så den trykker hårdere på skærm og snaplåse.",
    "Kraft: ca. 0,6 N pr. mm snor ved 20 %. Skærmen ca. 450 N (som skumbåndet i dag, holdes af skærmskruerne og bagrammens låse); fronten ca. 600 N (150 N pr. frontskrue).",
    "Hvis skærmen eller fronten bliver for stram ved prøven: samme Ø1,5 i silikoneskum (RS 234-2906) i de samme riller, ca. 5 gange blødere.",
    "5 Højttaler: rille i bagvæggens ramme om hulfeltet, flangen trykker på snoren (krogene holder). 6 Låselomme: lukkede vægge inde om tungen, kun print.",
    "Kun skitse: intet i CAD er ændret endnu. Linsens forkant (Ø4 lysåbning) og pupil er skønnet; tjekkes på det rigtige Wide-kamera med en prøve først.",
]
for i, s in enumerate(info): t(60, 1795 + i * 30, "· " + s, 14, "#333")

svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fbfaf7"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
