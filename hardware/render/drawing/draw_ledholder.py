"""Line drawing halo-gen2-v18: holding the LED strips in the light channel without adhesive (proposal + alternatives)."""
import sys
import cairosvg
OUT = sys.argv[1]
W, H = 1800, 1910
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

t(60, 56, "Selfi Halo gen 2 · v18-forslag: LED-strips holdes uden klister", 26, w=700)
t(60, 84, "Outline-skitse til godkendelse, kun hovedenheden. Bygger på v17 (gen2_concept.scad). Snit gennem lyskanalen, front til venstre, ydersiden op. Mål i mm. 22. okt. 2026", 14, "#666")
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
box(40, 110, 620, 520)
t(60, 140, "1  I dag (v16): strips på stripvæggen med klister", 18, w=600)
s = 13; X0, Y0 = 90, 360
F1 = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)
channel(F1, 26.45, [(4.2, -8.1), (4.2, -6.0), (26.45, 4.4), (26.45, -8.1)])
for y0, y1, th, fill, st in ((5.1, 13.1, 2.0, WCOB, WCS), (13.15, 21.15, 2.0, WCOB, WCS), (21.2, 26.2, 2.2, "url(#rgb)", "#334155")):
    rect(y0, y1, 6.9 - th, 6.75, F1, fill, st, 1.3); rect(y0, y1, 6.75, 6.9, F1, "#f59e0b", "#f59e0b", 0.5)
rays(F1, (7, 11, 15, 19, 24), 4.8)
t(60, 530, "Strips ligger kant i kant (0,05 mm luft) på stripvæggen, holdt af tape.", 13, "#444")
t(60, 550, "Den inderste (RGB) sidder i en kile kun 0,3 til 2,4 mm under reflektoren,", 13, "#444")
t(60, 570, "så den er svær at få på uden at den klistrer forkert, og ingen kan rykkes bagefter.", 13, "#444")
t(60, 596, "Bagrammen printes med bagsiden ned. Derfor kan en kant der skal holde", 13, "#b91c1c", 600)
t(60, 616, "en strip kun pege fremad (mod lysringen). En kant der peger bagud vil hænge i luften.", 13, "#b91c1c", 600)

# ---------- 2: proposal A ----------
box(680, 110, 1080, 690)
t(700, 140, "2  Forslag A (anbefalet): kantspor i stripvæggen, ingen ekstra dele", 18, NEW, 600)
s = 18; X0, Y0 = 740, 390
F2 = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)
FL = 27.4
refl2 = [(4.2, -8.1), (4.2, -6.0), (26.45, 4.4), (FL, 4.4), (FL, -8.1)]
channel(F2, FL, refl2)
def stem(y0, col_fill=WHT):   # stem 0.6 wide, lip forward over the strip in front of it
    pts = [(y0, 6.9), (y0 + 0.6, 6.9), (y0 + 0.6, 4.35), (y0 - 1.1, 4.35), (y0 - 1.25, 4.55), (y0 - 1.1, 4.8), (y0, 4.8)]
    poly(pts, F2, col_fill, NEW, 1.6)
rect(4.2, 4.6, 4.5, 6.9, F2, WHT, NEW, 1.6)                                    # front step
stem(12.8); stem(21.6)
rect(4.7, 12.7, 4.9, 6.9, F2, WCOB, WCS, 1.5); rect(13.5, 21.5, 4.9, 6.9, F2, WCOB, WCS, 1.5)
rect(22.3, 27.3, 4.7, 6.9, F2, "url(#rgb)", "#334155", 1.4)
rays(F2, (6.5, 10.5, 15, 19, 24), 4.8)
dim((26.45, -9.2), (27.4, -9.2), F2, "+0,95", (0, 18))
# print direction
a, b = F2((31.2, -10.4)), F2((22.5, -10.4))
o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="#64748b" stroke-width="2" marker-end="url(#ar)"/>')
t(b[0] - 8, b[1] + 5, "printretning (bagside på pladen, lag bygges mod venstre)", 13, "#64748b", 600, "end")
LX, LY = X0 + 32 * s + 20, 190
rows = [((4.4, 5.6), "Forkant: lille trin", NEW),
        ((12.45, 4.5), "Kantspor 1: læbe over bagkant på hvid 1", NEW),
        ((21.25, 4.5), "Kantspor 2: læbe over bagkant på hvid 2", NEW),
        ((25.0, 4.3), "RGB: tæt bane 5,0 under reflektoren, intet over lyset", NEW),
        ((8.7, 5.9), "Hvid COB 8 mm (1)", WCS), ((17.5, 5.9), "Hvid COB 8 mm (2)", WCS), ((24.8, 5.8), "RGB 5 mm", "#7c3aed"),
        ((27.55, 0), "Kanalbund 0,95 mm dybere", "#2563eb"),
        ((14, -2.0), "Reflektor uændret", WST)]
for i, (p, s_, c) in enumerate(rows): lead(F2, p, LX, LY + 30 * i, s_, c)
notes = ["Hver strip får sin egen bane. Bagkanten skubbes ind under en læbe, forkanten trykkes ned mod stripvæggen.",
         "Læberne peger alle fremad, så de står på laget under når bagrammen printes med bagsiden ned (ingen support).",
         "Hvid: læben griber 1,0 mm ind over kanten, lyset starter først 2,2 mm inde (målt), så den skygger ikke.",
         "Strippen kan altid skubbes frem og tilbage i sin bane og tages ud igen. Intet klister, intet ekstra at købe.",
         "RGB lyser i hele bredden, så den får ingen læbe: den sidder tæt mellem trin og bund, med reflektoren 0,3 mm over.",
         "Plads: banerne + 2 trin kræver 0,95 mm mere dybde. Bunden flyttes bagud; fronten, skallen og reflektorvinklen er uændrede."]
for i, n in enumerate(notes): t(700, 660 + 22 * i, n, 13, "#444")

# ---------- 3: detail ----------
box(40, 650, 620, 400)
t(60, 680, "3  Detalje: kantspor mellem hvid 1 og hvid 2 (ca. 6:1)", 18, w=600)
s = 52; X0, Y0 = 120 - 9.6 * 52, 712 + 8.3 * 52
F3 = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)
o.append('<clipPath id="c3"><rect x="60" y="695" width="580" height="340"/></clipPath><g clip-path="url(#c3)">')
rect(9.6, 16.4, 6.9, 8.1, F3, WHT, WST)
rect(9.6, 12.7, 4.9, 6.9, F3, WCOB, WCS, 2); rect(13.5, 16.4, 4.9, 6.9, F3, WCOB, WCS, 2)
rect(9.6, 10.55, 4.9, 5.2, F3, "#f59e0b", "none", 0, 0.9); rect(15.65, 16.4, 4.9, 5.2, F3, "#f59e0b", "none", 0, 0.9)
poly([(12.8, 6.9), (13.4, 6.9), (13.4, 4.35), (11.7, 4.35), (11.55, 4.55), (11.7, 4.8), (12.8, 4.8)], F3, WHT, NEW, 2.2)
o.append('</g>')
dim((11.7, 4.0), (12.7, 4.0), F3, "1,0", (0, 18))
dim((12.8, 4.0), (13.4, 4.0), F3, "0,6", (6, 18))
dim((10.55, 3.6), (12.7, 3.6), F3, "2,2 uden lys", (0, -6), "#b45309")
dim((13.4, 8.25), (13.5, 8.25), F3, "0,1", (22, 5))
dim((14.6, 4.35), (14.6, 4.9), F3, "", (0, 0))
t(F3((14.6, 4.6))[0] + 10, F3((14.6, 4.6))[1] + 5, "0,1 luft over strippen", 13, "#2563eb", 600)
t(70, 1000, "Spor: bagkant ind under læben (1,0 mm). Den gule stribe (lysfladen, 3,7 af 8,1) er fri.", 13, "#444")
t(70, 1024, "Målt af Esben 22. okt.: hvid 8,1 bred, gul stribe 3,7 i midten. RGB lyser i hele bredden.", 13, "#b45309", 600)

# ---------- 4: assembly ----------
box(680, 820, 1080, 230)
t(700, 850, "4  Montering (ved bordet, bagrammen ligger på bagsiden)", 18, w=600)
def mini(x0, y0, step):
    s = 11; F = lambda p: (x0 + (p[0] - 11) * s, y0 - (p[1] - 2) * s)
    rect(11.5, 24, 6.9, 8.1, F, WHT, WST)
    poly([(21.6, 6.9), (22.2, 6.9), (22.2, 4.35), (21.2, 4.35), (21.05, 4.55), (21.2, 4.8), (21.6, 4.8)], F, WHT, NEW, 1.4)
    poly([(12.2, 6.9), (12.8, 6.9), (12.8, 4.35), (12.2, 4.35)], F, WHT, NEW, 1.4)
    if step == 1:
        poly([(13.9, 3.0), (21.3, 4.8), (20.9, 6.75), (13.5, 4.95)], F, WCOB, WCS, 1.4)
        garrow((15, 2.3), (18.5, 3.1), F)
    else:
        rect(13.5, 21.5, 4.9, 6.9, F, WCOB, WCS, 1.4)
        if step == 2: garrow((14.3, 1.6), (14.3, 4.5), F)
        else: t(F((17.5, 2.5))[0], F((17.5, 2.5))[1], "↔ langs banen", 14, NEW, 700, "middle")
for i, (tx, sub) in enumerate((("1. Vip strippen, skub bagkanten ind under læben", "(en printet spatel hjælper ved RGB-banen)"),
                               ("2. Tryk forkanten ned mod stripvæggen", "(rulles på med tommelfinger eller spatel)"),
                               ("3. Ret til: strippen kan skubbes i banen", "og tages ud igen uden at blive ødelagt"))):
    x = 720 + 350 * i
    mini(x + 40, 960, i + 1)
    t(x, 1005, tx, 13, "#111", 600); t(x, 1023, sub, 12, "#666")
t(700, 1042, "Rækkefølge: RGB først (inderst), så hvid 2, så hvid 1. RGB kan også skydes ind i banen fra enden ved kameraet.", 12, "#444")

# ---------- 5: alternatives ----------
t(60, 1100, "5  Alternativer (også gennemtænkt)", 18, w=600)
def alt(x0, title, sub, good, bad, draw):
    box(x0 - 20, 1115, 560, 640)
    t(x0, 1145, title, 16, "#111", 700); t(x0, 1166, sub, 13, "#666")
    s = 13; F = lambda p: (x0 + 10 + p[0] * s, 1390 - p[1] * s)
    channel(F, 26.45, [(4.2, -8.1), (4.2, -6.0), (26.45, 4.4), (26.45, -8.1)])
    for y0, y1, th, fill, st in ((5.1, 13.1, 2.0, WCOB, WCS), (13.15, 21.15, 2.0, WCOB, WCS), (21.2, 26.2, 2.2, "url(#rgb)", "#334155")):
        rect(y0, y1, 6.9 - th, 6.9, F, fill, st, 1.2)
    draw(F)
    for i, g in enumerate(good): t(x0, 1590 + 20 * i, "✓ " + g, 13, NEW)
    for i, b in enumerate(bad): t(x0, 1590 + 20 * (len(good) + i), "✗ " + b, 13, "#b91c1c")
def comb(F):   # Esben's overlay: separate comb ring with bars across the strips every ~40 mm
    poly([(4.6, 4.2), (25.9, 4.2), (25.9, 3.6), (4.6, 3.6)], F, "#dbeafe", "#2563eb", 1.6)
    for y in (4.6, 13.1, 21.2, 25.9): rect(y - 0.3, y + 0.3, 3.6, 4.9, F, "#dbeafe", "#2563eb", 1.2)
    lead(F, (15, 3.9), F((0, 0))[0], 1556, "Separat klemkam i hvid ASA, tværbjælke for hver ca. 40 mm", "#2563eb", 12)
    rect(23.5, 26.4, 3.0, 4.6, F, "none", "#b91c1c", 1.5, dash="4 3")
alt(80, "B  Din idé: overlægger / klemkam", "Separat ring (eller 4 stykker) der klemmer alle strips",
    ["Strips lægges bare løst på, kammen trykkes i", "Ingen ændring af kanalens dybde"],
    ["1 til 4 ekstra dele, stor ring at printe", "Tværbjælkerne ligger over lysfladen: ca. 2-3 % skygge,", "  kan ses som svage pletter i lysringen", "Kan ikke nå ind over RGB: reflektoren er kun 0,3-2,4 mm", "  fra den (rød stiplet). Reflektoren skal flyttes = mindre lys"], comb)
def riders(F):
    for y in (4.6, 13.1, 21.2):
        poly([(y - 0.9, 4.4), (y + 0.9, 4.4), (y + 0.9, 4.9), (y + 0.3, 4.9), (y + 0.3, 7.2), (y - 0.3, 7.2), (y - 0.3, 4.9), (y - 0.9, 4.9)], F, "#dbeafe", "#2563eb", 1.4)
    lead(F, (13.1, 4.5), F((0, 0))[0], 1556, "Små klik-ryttere i huller i stripvæggen, ca. hver 80 mm", "#2563eb", 12)
alt(660, "C  Løse klik-ryttere", "Små T-clips der klikkes ind mellem to strips",
    ["Holder begge kanter, ingen skygge", "Kan printes liggende med kroge begge veje"],
    ["Ca. 30 små løse dele pr. boks (3 rækker × 10)", "30 huller gennem stripvæggen, skal flugte med fronten", "Svære at sætte i ved RGB under reflektoren", "Kræver også lidt mere dybde (mellemrum til stammen)"], riders)
def fins(F):
    for y in (13.1, 21.2):
        r0 = refl_r(y + 3.0)
        poly([(y - 0.3, 4.95), (y + 0.3, 4.95), (y + 3.0, r0 + 0.2), (y + 3.0, r0), (y - 0.3, refl_r(y - 0.3))], F, "#dbeafe", "#2563eb", 1.4)
    lead(F, (14.5, 2.5), F((0, 0))[0], 1556, "Fjedertunger fra reflektoren ned på kanterne", "#2563eb", 12)
alt(1240, "D  Fjedertunger fra reflektoren", "Del af bagrammen, trykker strips ud mod væggen",
    ["Ingen ekstra dele"],
    ["Tungerne sidder midt i lyset: skygge", "Står i vejen når strips skal på (som i dag)", "Tynde tunger i ASA knækker let", "Kan ikke printes uden support (peger bagud)"], fins)

t(60, 1800, "Anbefaling: A. Ingen ekstra dele, intet klister, ingen skygge, strips kan rettes til og udskiftes. Kun bagrammen ændres (v18).", 16, NEW, 700)
t(60, 1828, "Før helprint: et kort prøvestykke af stripvæggen (ca. 60 mm, med et hjørne) i hurtigsættet, så vi kan prøve en rigtig strip i banen.", 14, "#444")
t(60, 1852, "Varme: banen og læberne er hvid ASA som i dag (tåler ca. 95 °C). Strippen ligger direkte på væggen i stedet for på tape, så varmen går lige så godt væk.", 14, "#444")
t(60, 1876, "Hvis RGB alligevel rasler i prøvestykket: en 0,3 mm læbe på RGB tager ca. 6 % af dens bredde (effektlys, ikke fotolys).", 14, "#b45309", 600)

svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" font-family="Inter, DejaVu Sans, sans-serif"><rect width="{W}" height="{H}" fill="#fffdf8"/>' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
