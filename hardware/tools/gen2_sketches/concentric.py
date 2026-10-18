"""Halo 1:1 concentric outline: one master curve (light-ring centre line with
continuous-curvature corners), every other outline is an exact offset of it."""
import math, sys
from PIL import Image, ImageDraw, ImageFont

F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
f, fb, fs, fxs = (ImageFont.truetype(F, 22), ImageFont.truetype(FB, 28), ImageFont.truetype(F, 18), ImageFont.truetype(F, 15))
INK, GREY, LG, DIM, ACC, RING = (20, 20, 22), (150, 150, 155), (200, 200, 205), (90, 90, 95), (200, 60, 120), (232, 233, 238)

# rev G light ring (halo.scad): centre line x = +-94.45, z 16.8 .. 289.2, ring 18 wide
RX, Z0, Z1, HALF = 94.45, 16.8, 289.2, 9.0
GAP = Z0 - HALF                        # 7.8: the existing border at top and bottom
A, N = 26.0, 3.0                       # corner: superellipse quadrant, extent A, exponent N

def corner(cx, cz, sx, sz, steps=60):
    # quadrant of |u/A|^N + |v/A|^N = 1 centred A in from the corner, curvature 0 at both ends
    pts = []
    for i in range(steps + 1):
        t = i / steps * math.pi / 2
        u = A * math.copysign(abs(math.cos(t)) ** (2 / N), math.cos(t))
        v = A * math.copysign(abs(math.sin(t)) ** (2 / N), math.sin(t))
        pts.append((cx + sx * u, cz + sz * v))
    return pts

def master():
    zc = (Z0 + Z1) / 2
    hx, hz = RX - A, (Z1 - Z0) / 2 - A
    p = []
    p += corner(hx, zc + hz, 1, 1)                       # top right, from right side to top
    p += [(x, y) for x, y in reversed(corner(-hx, zc + hz, -1, 1))]
    p += corner(-hx, zc - hz, -1, -1)
    p += [(x, y) for x, y in reversed(corner(hx, zc - hz, 1, -1))]
    return p

def offset(p, d):                       # exact normal offset of a smooth convex curve (CCW)
    n, out = len(p), []
    for i in range(n):
        x0, y0 = p[i - 1]; x1, y1 = p[(i + 1) % n]
        tx, ty = x1 - x0, y1 - y0; L = math.hypot(tx, ty) or 1
        out.append((p[i][0] + d * ty / L, p[i][1] - d * tx / L))
    return out

M = master()
# orientation check: make d > 0 grow the shape
area = sum(M[i - 1][0] * M[i][1] - M[i][0] * M[i - 1][1] for i in range(len(M))) / 2
if area < 0: M = M[::-1]
def grow(d):
    o = offset(M, d)
    return o
BOX = grow(HALF + GAP); R_OUT = grow(HALF); R_IN = grow(-HALF)
W = max(x for x, _ in BOX) * 2
H = max(z for _, z in BOX) - min(z for _, z in BOX)
# minimum radius of curvature of the master (must exceed HALF for a clean inner edge)
def rmin(p):
    r = 1e9
    for i in range(len(p)):
        (x0, y0), (x1, y1), (x2, y2) = p[i - 1], p[i], p[(i + 1) % len(p)]
        a, b, c = math.dist((x0, y0), (x1, y1)), math.dist((x1, y1), (x2, y2)), math.dist((x0, y0), (x2, y2))
        ar = abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) / 2
        if ar > 1e-9: r = min(r, a * b * c / (4 * ar))
    return r
print("W=%.1f H=%.1f rmin_master=%.1f" % (W, H, rmin(M)))


img = Image.new("RGB", (2400, 1400), "white"); d = ImageDraw.Draw(img)
def poly(p, x0, y0, s, **kw): d.polygon([(x0 + x * s, y0 - z * s) for x, z in p], **kw)
def line(p, x0, y0, s, fill, width, closed=True):
    q = [(x0 + x * s, y0 - z * s) for x, z in p]; d.line(q + ([q[0]] if closed else []), fill=fill, width=width, joint="curve")

# --- panel 1: front, new design, with rev G dashed for comparison
x1, y1, s1 = 420, 1150, 3.0
d.text((x1, 30), "Forslag: 1:1 koncentrisk", font=fb, fill=INK, anchor="ma")
d.text((x1, 70), "boks %.1f x 306, ens kant %.1f mm hele vejen rundt" % (W, GAP), font=f, fill=DIM, anchor="ma")
s1 = 2.85
# rev G outline dashed
old = [(-117, 0), (117, 0), (117, 306), (-117, 306)]
for (ax, az), (bx, bz) in zip(old, old[1:] + old[:1]):
    L = math.hypot(bx - ax, bz - az); k = int(L / 6)
    for j in range(0, k, 2):
        d.line([(x1 + (ax + (bx - ax) * j / k) * s1, y1 - (az + (bz - az) * j / k) * s1), (x1 + (ax + (bx - ax) * (j + 1) / k) * s1, y1 - (az + (bz - az) * (j + 1) / k) * s1)], fill=LG, width=2)
poly(BOX, x1, y1, s1, fill="white"); line(BOX, x1, y1, s1, INK, 4)
poly(R_OUT, x1, y1, s1, fill=RING); line(R_OUT, x1, y1, s1, GREY, 2)
poly(R_IN, x1, y1, s1, fill="white"); line(R_IN, x1, y1, s1, GREY, 2)
GC = 151.85
d.rectangle([x1 - 68.2 * s1, y1 - (GC + 108.8) * s1, x1 + 68.2 * s1, y1 - (GC - 108.8) * s1], outline=GREY, width=2)
d.rectangle([x1 - 19 * s1, y1 - (Z1 + 9.5) * s1, x1 + 19 * s1, y1 - (Z1 - 9.5) * s1], fill="white")
d.ellipse([x1 - 6, y1 - Z1 * s1 - 6, x1 + 6, y1 - Z1 * s1 + 6], outline=INK, width=2)
# hidden fixings: 4 screws from the back in the solid ring corners
for sx in (-1, 1):
    for z in (Z0, Z1):
        if z == Z1: continue
    for zc, sz in (((Z0 + Z1) / 2, 1), ((Z0 + Z1) / 2, -1)):
        hx, hz = RX - A, (Z1 - Z0) / 2 - A
        u = A * 0.5 ** (1 / N)
        px, pz = sx * (hx + u), zc + sz * (hz + u)
        d.ellipse([x1 + px * s1 - 9, y1 - pz * s1 - 9, x1 + px * s1 + 9, y1 - pz * s1 + 9], outline=ACC, width=3)
d.text((x1, y1 + 22), "rød ring = skjult skrue bagfra i ringens hjørne (erstatter 4 synlige sideskruer)", font=fxs, fill=ACC, anchor="ma")
d.text((x1, y1 + 44), "stiplet = rev G (234 bred)", font=fxs, fill=GREY, anchor="ma")

# --- panel 2: corner zoom with the gaps
x2, y2, s2 = 1000, 980, 8.0
d.text((x2 + 300, 30), "Hjørnet forstørret", font=fb, fill=INK, anchor="ma")
d.text((x2 + 300, 70), "alle kurver er samme kurve, forskudt", font=f, fill=DIM, anchor="ma")
ox = -(W / 2 - 75)                      # show the bottom-right 75 x 75 mm
clipbox = (x2, y2 - 75 * s2, x2 + 75 * s2, y2)
tmp = Image.new("RGB", (int(75 * s2) + 1, int(75 * s2) + 1), "white"); td = ImageDraw.Draw(tmp)
def tp(p): return [((x + ox) * s2, 75 * s2 - z * s2) for x, z in p]
td.polygon(tp(BOX), fill="white"); td.line(tp(BOX) + tp(BOX)[:1], fill=INK, width=5, joint="curve")
td.polygon(tp(R_OUT), fill=RING); td.line(tp(R_OUT) + tp(R_OUT)[:1], fill=GREY, width=2, joint="curve")
td.polygon(tp(R_IN), fill="white"); td.line(tp(R_IN) + tp(R_IN)[:1], fill=GREY, width=2, joint="curve")
td.line(tp(M) + tp(M)[:1], fill=LG, width=1)
# gap ticks along the corner normals
for k in range(0, len(M), 12):
    i = k
    if not (len(M) * 3 // 4 <= i < len(M)): continue
    a, b = R_OUT[i], BOX[i]
    td.line(tp([a, b]), fill=ACC, width=2)
img.paste(tmp, (int(clipbox[0]), int(clipbox[1])))
d.rectangle(clipbox, outline=GREY, width=1)
d.text((x2 + 300, y2 + 20), "rød streg = %.1f mm overalt, også i hjørnet" % GAP, font=fs, fill=ACC, anchor="ma")
d.text((x2 + 300, y2 + 46), "kontinuerlig krumning: ingen knæk mellem lige side og bue", font=fs, fill=DIM, anchor="ma")

# --- panel 3: rules checklist
x3 = 2080
d.text((x3, 30), "Tjek mod Halo-reglerne", font=fb, fill=INK, anchor="ma")
rows = [("Koncentrisk", "boks og lysring er samme kurve, forskudt"),
        ("Ens kant", "%.1f mm på alle fire sider" % GAP),
        ("Squircle", "ingen knæk i hjørnerne"),
        ("Samme form", "printermodul får samme bredde og hjørne"),
        ("Ingen synlige skruer", "sideskruer flyttes om bagpå"),
        ("Printbar", "%.1f x 306 passer på H2C" % W),
        ("Uændret", "skærm, kamera, LED og dybde 85")]
yy = 120
for t, s in rows:
    d.text((x3 - 300, yy), "✓", font=fb, fill=(40, 140, 80)); d.text((x3 - 260, yy + 2), t, font=f, fill=INK)
    d.text((x3 - 260, yy + 32), s, font=fs, fill=DIM); yy += 80
d.text((x3 - 300, yy + 10), "Hvad det koster:", font=f, fill=INK)
for k, s in enumerate(["boksen bliver %.1f mm smallere (var 234)" % (234 - W),
                        "LED-strækkene bliver ca. 8 mm kortere pr. side",
                        "sideskruerne skal laves om til skruer bagfra"]):
    d.text((x3 - 300, yy + 46 + k * 30), "· " + s, font=fs, fill=DIM)
img.save(sys.argv[1])
