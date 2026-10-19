"""Line drawing of the LED ring, components, cables and screws.  Usage: python3 draw.py geo.json out.svg"""
import json, sys
import numpy as np
D = json.load(open(sys.argv[1])); P = D["parts"]; OUT = sys.argv[2]
JOINTS = [(-89.0862, 22.1638), (-89.0862, 283.836), (89.0862, 22.1638), (89.0862, 283.836)]
W, H = 1800, 1330
o = []
def t(x, y, s, size=14, col="#111", w=400, anchor="start"):
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{col}" font-weight="{w}" text-anchor="{anchor}">{s}</text>')
def path(polys, f, stroke, sw=1.2, fill="none", op=1, dash=None, clip=None):
    d = "".join("M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in map(f, p)) + "Z" for p in polys if len(p) > 2)
    if not d: return
    extra = (f' stroke-dasharray="{dash}"' if dash else "") + (f' clip-path="url(#{clip})"' if clip else "")
    o.append(f'<path d="{d}" fill="{fill}" fill-opacity="{op}" stroke="{stroke}" stroke-width="{sw}" fill-rule="evenodd" stroke-linejoin="round"{extra}/>')
def lead(ax, ay, lx, ly, s, col):
    o.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="3" fill="{col}"/><path d="M{ax:.1f},{ay:.1f}L{lx - 6:.1f},{ly - 4:.1f}" stroke="{col}" stroke-width="1"/>')
    t(lx, ly, s, 14, col)
def area(p):
    q = np.array(p); return abs(np.dot(q[:, 0], np.roll(q[:, 1], 1)) - np.dot(q[:, 1], np.roll(q[:, 0], 1))) / 2
def biggest(polys): return [max(polys, key=area)]
def inside(polys, x, y):
    c = False
    for p in polys:
        q = np.array(p); xi, yi = q[:, 0], q[:, 1]; xj, yj = np.roll(xi, 1), np.roll(yi, 1)
        hit = ((yi > y) != (yj > y)) & (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi)
        c ^= bool(hit.sum() % 2)
    return c
def centroid(polys, f, box):
    # a point inside the part's fill, close to the middle of what is visible in the box
    pts = [(x, y) for x in np.linspace(box[0], box[2], 60) for y in np.linspace(box[1], box[3], 60) if inside(polys, x, y)]
    if not pts: return None
    a = np.array(pts); m = a.mean(0); return a[np.argmin(((a - m) ** 2).sum(1))]
def _old_centroid(polys, f, box):
    best = None
    for p in polys:
        q = np.array([f(v) for v in p])
        inb = q[(q[:, 0] > box[0]) & (q[:, 0] < box[2]) & (q[:, 1] > box[1]) & (q[:, 1] < box[3])]
        if len(inb) and (best is None or len(inb) > len(best)): best = inb
    return best.mean(0) if best is not None else None

t(60, 56, "Selfi Halo gen 2 · v2: LED-ring, komponenter, kabler og skruer", 26, w=700)
t(60, 84, "Stregtegning til godkendelse, kun hovedenheden. Mål i mm. 19. okt. 2026", 14, "#666")

# ---------- A: front view -------------------------------------------------------
s = 1.55; X0, Y0 = 60 + 111.25 * s, 140 + 306 * s
FA = lambda v: (X0 + v[0] * s, Y0 - v[1] * s)
t(60, 128, "A  Forfra: LED-strip i ét stykke rundt", 18, w=600)
path(biggest(P["skal"]["front"]), FA, "#222", 1.3)
path(P["front"]["front"], FA, "#222", 0.8)
path(biggest(P["skaerm"]["front"]), FA, "#253041", 1, "#253041", 0.10)
path(P["lysring"]["front"], FA, "#999", 0.8, "#fbf8f1", 0.6)
path(P["ledstrip"]["front"], FA, "#ffb000", 3.2, "none")
path(P["kamera"]["front"], FA, "#6b7280", 1, "#9aa3b5", 0.5)
for x, z in JOINTS:
    cx, cy = FA((x, z)); o.append(f'<circle cx="{cx}" cy="{cy}" r="{3*s}" fill="none" stroke="#2563eb" stroke-width="1.3" stroke-dasharray="3 2"/><path d="M{cx-6},{cy}h12M{cx},{cy-6}v12" stroke="#2563eb" stroke-width="1"/>')
for x in (-25, 25):
    cx, cy = FA((x, 289.2)); o.append(f'<circle cx="{cx}" cy="{cy}" r="{2.5*s}" fill="#fff" stroke="#c2410c" stroke-width="1.3"/>')
for x, lab in ((-19, "start"), (19, "slut")):
    cx, cy = FA((x, 289.2)); o.append(f'<path d="M{cx},{cy-8}v16" stroke="#c2410c" stroke-width="2"/>')
# direction arrows along the left side
for z in (200, 100):
    cx, cy = FA((-94.45, z)); o.append(f'<path d="M{cx-5},{cy-6}L{cx},{cy+4}L{cx+5},{cy-6}" fill="none" stroke="#c2410c" stroke-width="1.6"/>')
LX = 60 + 222.5 * s + 40
lead(*FA((94.45, 150)), LX, FA((0, 240))[1], "LED-strip 24 V RGBW, ét stykke ca. 0,84 m", "#b45309")
lead(*FA((-19, 289.2)), LX, FA((0, 300))[1], "Start og slut ved kameraet", "#c2410c")
lead(*FA((25, 289.2)), LX, FA((0, 278))[1], "Kabel-huller ±25 mm bag kanalbunden", "#c2410c")
lead(*FA((89.09, 283.84)), LX, FA((0, 260))[1], "4 skruer i hjørnerne, bag kanalbunden", "#2563eb")
lead(*FA((0, 289)), LX, FA((0, 320))[1], "Kamera", "#4b5563")
lead(*FA((-94.45, 60)), LX, FA((0, 60))[1], "Lysring (hvid ASA) dækker strip og kanal", "#777")
lead(*FA((30, 150)), LX, FA((0, 150))[1], "Skærm 10\"", "#253041")
t(60, Y0 + 34, "Strippen står på kant i kanalen og lyser ind mod lysringen. Ingen samlinger i hjørnerne.", 13, "#444")
t(60, Y0 + 52, "Den skæres kun i enderne ved kameraet, så længden skal passe med strippens skæremærker.", 13, "#444")

# ---------- B: back view, components and cables --------------------------------
X1 = 820; s2 = 1.55; XB0, YB0 = X1 + 111.25 * s2, Y0
FB = lambda v: (XB0 - v[0] * s2, YB0 - v[1] * s2)          # seen from behind: x mirrored
t(X1, 128, "B  Bagfra uden skal: komponenter og kabler", 18, w=600)
path(P["skal"]["front"][:1], FB, "#bbb", 1, dash="4 3")
order = ["skaerm", "ledskinne", "ledstrip", "kamera", "pi", "stik", "printkort", "hoejttaler", "mikrofoner", "lydkerne",
         "modem4g", "sensor", "stroem", "reed", "skruer_front", "skrue_laas"]
for n in order:
    p = P[n]; light = n in ("skaerm", "ledskinne")
    path(p["front"], FB, p["color"], 1.1, p["color"], 0.12 if light else 0.55)
for owner, label, dia, pts in D["cables"]:
    q = [FB((x, z)) for x, y, z in pts]
    o.append(f'<path d="M' + "L".join(f"{a:.1f},{b:.1f}" for a, b in q) + f'" fill="none" stroke="{P[owner]["color"]}" stroke-width="{max(2, dia*s2):.1f}" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>')
t(X1, YB0 + 34, "Hver komponent har sin farve, og dens kabler har samme farve.", 13, "#444")
t(X1, YB0 + 52, "Kablerne løber langs bagvæggen og skærmens bagside, fri af printene.", 13, "#444")

# legend
LX2 = X1 + 222.5 * s2 + 40; ly = 150
groups = {}
for n, p in P.items(): groups.setdefault(p["group"], []).append(p)
for g in ("Elektronik", "Tilvalg", "Skruer"):
    t(LX2, ly, g.upper() + (" (kan udelades i de første bokse)" if g == "Tilvalg" else ""), 12, "#666", 600); ly += 20
    for p in groups[g]:
        o.append(f'<rect x="{LX2}" y="{ly-11}" width="13" height="13" rx="3" fill="{p["color"]}" stroke="#0003"/>'); t(LX2 + 22, ly, p["label"], 14); ly += 21
    ly += 10

# ---------- C / D: sections -----------------------------------------------------
def section(key, title, note, x0, y0, s3, f, box, labels, extra=None):
    t(x0, y0 - 14, title, 18, w=600)
    bx0, by0 = f((box[0], box[1])); bx1, by1 = f((box[2], box[3]))
    cid = "c" + key
    o.append(f'<clipPath id="{cid}"><rect x="{min(bx0,bx1)}" y="{min(by0,by1)}" width="{abs(bx1-bx0)}" height="{abs(by1-by0)}"/></clipPath>')
    fills = {"front": ("#1d1d20", "#3f3f46", 0.85), "skal": ("#2a2a2e", "#3f3f46", 0.6), "lyskanal": ("#efeadf", "#8a8578", 1),
             "lysring": ("#fbf8f1", "#8a8578", 1), "ledstrip": ("#ffb000", "#b45309", 1), "ledskinne": ("#77777d", "#52525b", 0.7),
             "skaerm": ("#253041", "#253041", 0.5), "skruer_front": ("#c3c7cf", "#2563eb", 1), "hoejttaler": ("#f97316", "#c2410c", 0.4), "pi": ("#2e9e5b", "#166534", 0.5), "stik": ("#e11d48", "#9f1239", 0.4)}
    for n, (fc, sc, op) in fills.items():
        path(P[n][key], lambda v: f(v), sc, 1.1, fc, op, clip=cid)
    if extra: extra()
    lx = max(bx0, bx1) + 30; ys = sorted(((f2, s_, c) for f2, s_, c in labels), key=lambda r: r[0][1])
    ly = min(by0, by1) + 14
    for (ax, ay), s_, c in ys:
        lead(ax, ay, lx, max(ly, ay), s_, c); ly = max(ly, ay) + 24
    for i, line in enumerate(note): t(x0, max(by0, by1) + 26 + 18 * i, line, 13, "#444")

s3 = 8.5
# C: horizontal cut at z = 150, left side. Front to the left: svg_x = y, svg_y = x
xc, yc = 60, 790
FC = lambda v: (xc + (v[1] + 3) * s3, yc + (v[0] + 113) * s3)
def lab(n, key, f, box, s_, c):
    a = centroid(P[n][key], lambda v: v, box)
    return (f(a), s_, c) if a is not None else None
boxC = (-113, -3, -76, 33)       # (x0, y0, x1, y1) in part coords (x, y)
FCb = lambda v: FC((v[0], v[1]))
labelsC = [l for l in [
    lab("lysring", "secA", FC, (-113, -3, -76, 33), "Lysring, hvid ASA (diffuser)", "#8a8578"),
    lab("lyskanal", "secA", FC, (-113, -3, -76, 33), "Lyskanal, hvid ASA, printet i fronten", "#8a8578"),
    lab("ledstrip", "secA", FC, (-113, -3, -76, 33), "LED-strip på kant, lyser indad", "#b45309"),
    lab("front", "secA", FC, (-113, -3, -76, 33), "Front, sort ASA", "#3f3f46"),
    lab("ledskinne", "secA", FC, (-113, -3, -76, 33), "Bagramme med fjedre", "#52525b"),
    lab("skal", "secA", FC, (-113, -3, -76, 33), "Skal, sort ASA", "#3f3f46"),
    lab("skaerm", "secA", FC, (-113, -3, -76, 33), "Skærm", "#253041"),
] if l]
# section(...) wants box in drawing-function input space
def secC():
    pass
section("secA", "C  Snit gennem siden (højde 150 mm)", ["Kanalen er en U-profil: den hvide bund binder skærmrammen og yderrammen sammen,", "så der ikke er nogen stolper i lyset."],
        xc, yc, s3, lambda v: FC((v[0], v[1])), (-113, -3, -76, 33), labelsC)

# D: vertical cut through the left screws (x = -89.09), bottom corner. Front to the left: svg_x = y, svg_y = -z
xd, yd = 920, 790
FD = lambda v: (xd + (v[0] + 3) * s3, yd + (40 - v[1]) * s3)
boxD = (-3, -1, 33, 40)
labelsD = [l for l in [
    lab("skruer_front", "secB", FD, boxD, "Skrue 3,0 × 14 ind bagfra, i bøsning bag kanalbunden", "#2563eb"),
    lab("ledstrip", "secB", FD, boxD, "LED-strip", "#b45309"),
    lab("lysring", "secB", FD, boxD, "Lysring", "#8a8578"),
    lab("lyskanal", "secB", FD, boxD, "Hvid kanalbund", "#8a8578"),
    lab("ledskinne", "secB", FD, boxD, "Bagramme (klemmes af skruen)", "#52525b"),
    lab("front", "secB", FD, boxD, "Front", "#3f3f46"),
    lab("skal", "secB", FD, boxD, "Skal", "#3f3f46"),
] if l]
section("secB", "D  Snit gennem en hjørneskrue (bund til venstre)", ["Skruen sidder bag kanalen og kan ikke ses forfra. Den skygger ikke for lyset,", "fordi bøsningen sidder bag kanalens hvide bund."],
        xd, yd, s3, lambda v: FD((v[0], v[1])), boxD, labelsD)

svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Inter, Helvetica, Arial, sans-serif"><rect width="100%" height="100%" fill="#fff"/>' + "".join(o) + "</svg>"
open(OUT, "w").write(svg)
