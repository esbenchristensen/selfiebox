"""Line drawing: the display behind the front window (what the front covers) and locating ribs."""
import sys
OUT = sys.argv[1]
W, H = 1700, 1000
o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')
def rr(f, cx, cz, w, h, r, fill, stroke, sw=1.2, dash=None, op=1, s=1):
    x0, y0 = f((cx - w / 2, cz + h / 2))
    o.append(f'<rect x="{x0:.1f}" y="{y0:.1f}" width="{w*s:.1f}" height="{h*s:.1f}" rx="{r*s:.1f}" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}"'
             + (f' stroke-dasharray="{dash}"' if dash else "") + "/>")
def poly(pts, f, fill, stroke, sw=1.2, op=1):
    o.append('<path d="M' + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, pts)) + f'Z" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>')
def rect(x0, x1, y0, y1, f, fill, stroke, sw=1, op=1): poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], f, fill, stroke, sw, op)
def dim(p0, p1, f, s, off=(0, 0), col="#2563eb", size=13):
    a, b = f(p0), f(p1)
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="{col}" stroke-width="1.1" marker-start="url(#da)" marker-end="url(#da)"/>')
    t((a[0] + b[0]) / 2 + off[0], (a[1] + b[1]) / 2 + off[1], s, size, col, 600, "middle")
def lab(p, f, lx, ly, s, col="#111"):
    a = f(p)
    o.append(f'<circle cx="{a[0]:.1f}" cy="{a[1]:.1f}" r="3" fill="{col}"/><path d="M{a[0]:.1f},{a[1]:.1f}L{lx - 6:.1f},{ly - 4:.1f}" stroke="{col}" stroke-width="1"/>')
    t(lx, ly, s, 14, col)
o.append('<defs><marker id="da" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,1L7,4L0,7Z" fill="#2563eb"/></marker></defs>')
t(60, 56, "Selfi Halo gen 2 · v2: skærmen bag fronten", 26, w=700)
t(60, 84, "Stregtegning til godkendelse. Raspberry Pi Touch Display 2, 10\". Mål i mm. 19. okt. 2026", 14, "#666")
BLK, NAT, ACT, VIEWC, ORG = "#2b2b2f", "#f4f0e6", "#5b8def", "#1e3a8a", "#ea580c"
BW, BH, BR = 222.5, 306, 42.8
GC, GW, GH, GR = 151.85, 166.9, 248.1, 3
VW, VH = 136.4, 217.6          # viewing area (inside the glass' black border)
AW, AH = 135.4, 216.6          # active pixels
WIN = (138.6, 219.8)           # front window where it meets the glass
WINF = (140.6, 221.8)          # front window at the face (1.6 mm bevel)
RX, RZ0, RZ1, RH = 94.45, 16.8, 289.2, 6.85

# ---------- A: front view ----------
s = 2.3; X0, Y0 = 60 + BW / 2 * s, 130 + BH * s
F = lambda p: (X0 + p[0] * s, Y0 - p[1] * s)
t(60, 118, "A  Forfra (fronten er tegnet gennemsigtig over skærmen)", 18, w=600)
rr(F, 0, BH / 2, BW, BH, BR, BLK, BLK, s=s)
# ring band
o.append(f'<rect x="{F((-RX, RZ1))[0]:.1f}" y="{F((-RX, RZ1))[1]:.1f}" width="{2*RX*s:.1f}" height="{(RZ1-RZ0)*s:.1f}" rx="{26*s:.1f}" fill="none" stroke="{NAT}" stroke-width="{2*RH*s:.1f}"/>')
rect(-14.7, 14.7, RZ1 - 9, RZ1 + 9, F, BLK, BLK, 0)
cx, cy = F((0, RZ1)); o.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{3.7*s:.1f}" fill="#111" stroke="#888"/>')
# glass (hidden behind the front), viewing area, window, active
rr(F, 0, GC, GW, GH, GR, "none", "#bbb", 1.2, "6 4", s=s)
rr(F, 0, GC, WINF[0], WINF[1], 1, "#151517", "#888", 1, s=s)
rr(F, 0, GC, AW, AH, 0, ACT, ACT, 1, op=0.85, s=s)
rr(F, 0, GC, VW, VH, 0, "none", "#fff", 1, "3 3", s=s)
# locating ribs (proposed)
ribs = [(-84.15, GC + 70), (-84.15, GC - 70), (84.15, GC + 70), (84.15, GC - 70), (-45, GC + 124.55), (45, GC + 124.55), (-45, GC - 124.55), (45, GC - 124.55)]
for x, z in ribs:
    if abs(x) > 80: rect(x - 0.5, x + 0.5, z - 6, z + 6, F, ORG, ORG, 1)
    else: rect(x - 6, x + 6, z - 0.5, z + 0.5, F, ORG, ORG, 1)
t(F((0, GC))[0], F((0, GC))[1] - 8, "1200 × 1920", 15, "#fff", 600, "middle")
t(F((0, GC))[0], F((0, GC))[1] + 14, "aktivt billede 135,4 × 216,6", 13, "#fff", 400, "middle")
dim((-GW / 2, GC - GH / 2 - 8), (GW / 2, GC - GH / 2 - 8), F, "glas 166,9", (0, 16), "#ddd")
dim((-WINF[0] / 2, 60), (WINF[0] / 2, 60), F, "vindue 140,6 (138,6 ved glasset)", (0, -6), "#fff", 12)
LX = 60 + BW * s + 30
lab((-RX, GC + 40), F, LX, 160, "Lysring (natur-ASA)")
lab((-WINF[0] / 2 - 6, GC + 95), F, LX, 188, "Glassets sorte kant: skjult bag fronten (15,25 mm hele vejen rundt)")
lab((-WINF[0] / 2, GC - 30), F, LX, 216, "Frontens vindue med 1,6 mm skrå kant")
lab((-AW / 2 + 5, GC - 60), F, LX, 244, "Aktivt billede: intet dækkes")
lab((-84.15, GC + 70), F, LX, 272, "NY: 8 styreribber, glasset sidder ±0,2 mm", ORG)

# ---------- B: section through the left edge ----------
s2 = 15; BX0, BY0 = LX + 10, 420
G = lambda p: (BX0 + (p[0] + 101.5) * s2, BY0 + p[1] * s2)     # p = (x, depth y): front at the top, inside down
t(LX, 370, "B  Snit gennem venstre kant (forsiden opad)", 18, w=600)
x0 = -101.5
# ring
rect(-101.45 + 0.15, -87.45 - 0.15, -0.5, 1.0, G, NAT, "#a39e90")
rect(-101.45 + 0.15, -100.1, 1.0, 4.2, G, NAT, "#a39e90"); rect(-88.8, -87.45 - 0.15, 1.0, 4.2, G, NAT, "#a39e90")
# front plate with window bevel
poly([(-87.45, 0), (-WINF[0] / 2, 0), (-WINF[0] / 2, 1.6), (-WIN[0] / 2, 3.2), (-87.45, 3.2)], G, BLK, BLK)
poly([(-86.25, 3.2), (-84.65, 3.2), (-84.65, 14), (-86.25, 14)], G, BLK, BLK)        # channel inner wall
rect(-71.3, -69.3, 3.2, 3.7, G, BLK, BLK)                                                 # glass land
rect(-84.65, -83.65, 3.2, 6.0, G, ORG, ORG)                                               # rib (new)
# display
rect(-83.45, -60, 3.7, 4.8, G, "#cfd8e3", "#64748b")                                      # cover lens
rect(-83.45, -VW / 2, 4.7, 4.8, G, "#111", "#111")                                        # black print
rect(-81.0, -60, 4.8, 10.75, G, "#9ca3af", "#6b7280")                                      # panel
rect(-AW / 2, -60, 4.8, 5.2, G, ACT, ACT)
for (x, lbl, yy) in [(-VW / 2, "billedfeltets kant", 11.9), (-AW / 2, "første pixel", 12.9)]:
    a, b = G((x, -1.5)), G((x, yy - 0.4))
    o.append(f'<path d="M{a[0]:.1f},{a[1]:.1f}L{b[0]:.1f},{b[1]:.1f}" stroke="#2563eb" stroke-width="0.8" stroke-dasharray="3 3"/>')
dim((-WIN[0] / 2, -1.2), (-VW / 2, -1.2), G, "1,1", (0, -6))
dim((-WIN[0] / 2, -2.6), (-AW / 2, -2.6), G, "1,6", (0, -6))
dim((-84.65, 7.2), (-83.45, 7.2), G, "1,2 → 0,2", (0, 22), "#2563eb", 12)
LB = BX0 + 43 * s2
lab((-93, 0.3), G, LB, 440, "Lysring")
lab((-78, 1.6), G, LB, 468, "Front 3,2 mm, sort")
lab((-70.3, 3.45), G, LB, 496, "Glasset hviler på en 2 mm printet kant (bag vinduet)")
lab((-82, 4.75), G, LB, 524, "Glassets sorte tryk (skjult)")
lab((-84.15, 5.5), G, LB, 552, "NY: styreribbe 1,0 mm (0,2 mm luft til glasset)", ORG)
lab((-63, 8), G, LB, 580, "Skærmmodul 7,05 mm inkl. 1,1 mm glas")

fn = ["Vinduet er 1,1 mm større end billedfeltet og 1,6 mm større end det aktive billede hele vejen rundt. Fronten dækker kun glassets sorte kant.",
      "I dag holdes glasset kun på plads af skruerne i bagrammen, så det kan flytte op til 1,2 mm til siden. Selv da dækkes ingen pixels (1,6 > 1,2),",
      "men den sorte kant i vinduet kan blive skæv (0–2,3 mm). De 8 nye ribber i fronten holder glasset inden for ±0,2 mm, så kanten er ens hele vejen rundt.",
      "Antagelse: billedet sidder midt på glasset (Raspberry Pi oplyser ikke andet). Mål den første skærm; CAD har et tal (VIEW_X), der kan flytte vinduet."]
for i, n in enumerate(fn): t(LX, 800 + 22 * i, n, 13, "#444")
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Inter, Helvetica, Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>' + "".join(o) + "</svg>"
open(OUT, "w").write(svg)
