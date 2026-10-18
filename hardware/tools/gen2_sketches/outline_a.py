"""Outline sketch of option A: flush cradle module, photo held in the bottom slot by soft lips."""
import sys
from PIL import Image, ImageDraw, ImageFont

S = 1.6
W, H, D, R = 234, 306, 85, 24
HP = 147
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
f, fb, fs = ImageFont.truetype(F, 22), ImageFont.truetype(FB, 28), ImageFont.truetype(F, 18)
INK, GREY, FILL, DIM, ACC, PH = (20, 20, 22), (150, 150, 155), (225, 226, 230), (90, 90, 95), (200, 60, 120), (245, 240, 225)
img = Image.new("RGB", (2400, 1300), "white")
d = ImageDraw.Draw(img)
BASE = 1000
INW = (139.9, 36.0, 128.3)            # Instax Link WIDE w, d, h
FILM = (86, 108)
PRN_Y = (5, 45)                       # printer front faces from the module front
PRN_Z = 13                            # exit edge above the module floor
HANG = 95                             # how far the held photo hangs below the floor


def X(x0, x): return x0 + x * S
def Z(z): return BASE - z * S


def rrect(x0, cx, z0, w, h, r, fill=None, outline=INK, width=3, corners=(True, True, True, True)):
    d.rounded_rectangle([X(x0, cx - w / 2), Z(z0 + h), X(x0, cx + w / 2), Z(z0)], radius=r * S, fill=fill, outline=outline, width=width, corners=corners)


def vdim(x0, x, za, zb, text, left=True):
    d.line([X(x0, x), Z(za), X(x0, x), Z(zb)], fill=DIM, width=2)
    for z in (za, zb): d.line([X(x0, x) - 8, Z(z), X(x0, x) + 8, Z(z)], fill=DIM, width=2)
    d.text((X(x0, x) + (-10 if left else 10), Z((za + zb) / 2)), text, font=fs, fill=DIM, anchor="rm" if left else "lm")


def hdim(x0, xa, xb, z, text):
    d.line([X(x0, xa), Z(z), X(x0, xb), Z(z)], fill=DIM, width=2)
    for x in (xa, xb): d.line([X(x0, x), Z(z) - 8, X(x0, x), Z(z) + 8], fill=DIM, width=2)
    d.text((X(x0, (xa + xb) / 2), Z(z) + 6), text, font=fs, fill=DIM, anchor="ma")


def title(x, t, sub):
    d.text((x, 30), t, font=fb, fill=INK, anchor="ma"); d.text((x, 70), sub, font=f, fill=DIM, anchor="ma")


# ---------------- front view
x1 = 420
title(x1, "Forfra", "hovedenhed uændret + modul A")
rrect(x1, 0, 0, W, HP + R, R, fill=FILL, corners=(False, False, True, True))
rrect(x1, 0, HP - 1, W + 2, H + 2, R + 1, fill="white", outline="white")
rrect(x1, 0, HP, W, H, R, fill="white")
rrect(x1, 0, HP + 16.8 - 9, 2 * 94.45 + 18, 289.2 - 16.8 + 18, 31, outline=GREY, width=2)
rrect(x1, 0, HP + 16.8 + 9, 2 * 94.45 - 18, 289.2 - 16.8 - 18, 13, outline=GREY, width=2)
rrect(x1, 0, HP + 151.85 - 108.8, 136.4, 217.6, 2, outline=GREY, width=2)
d.ellipse([X(x1, 0) - 6, Z(HP + 289.2) - 6, X(x1, 0) + 6, Z(HP + 289.2) + 6], outline=INK, width=2)
d.rectangle([X(x1, -FILM[0] / 2), Z(0), X(x1, FILM[0] / 2), Z(-HANG)], fill=PH, outline=INK, width=2)
d.rectangle([X(x1, -31), Z(-12), X(x1, 31), Z(-HANG + 7)], outline=GREY, width=1)
d.text((X(x1, 0), Z(-HANG) + 10), "billedet hænger, til gæsten tager det", font=fs, fill=ACC, anchor="ma")
vdim(x1, -W / 2 - 18, 0, HP, "147")
vdim(x1, -W / 2 - 18, HP, HP + H, "306")
vdim(x1, W / 2 + 18, 0, HP + R, "171", left=False)

# ---------------- side section
x2 = 1150
title(x2, "Snit fra siden", "to Instax Link Wide på hovedet, bag hinanden")
y0 = -D / 2                            # front at left
d.rounded_rectangle([X(x2, y0), Z(HP + H), X(x2, y0 + D), Z(HP)], radius=6, outline=INK, width=3)
d.text((X(x2, 0), Z(HP + H / 2)), "hoved-\nenhed\n85 mm", font=fs, fill=DIM, anchor="mm", align="center")
d.rounded_rectangle([X(x2, y0), Z(HP), X(x2, y0 + D), Z(0)], radius=6, fill=FILL, outline=INK, width=3)
for i, py in enumerate(PRN_Y):
    d.rounded_rectangle([X(x2, y0 + py), Z(PRN_Z + INW[2]), X(x2, y0 + py + INW[1]), Z(PRN_Z)], radius=6, fill="white", outline=INK, width=2)
    d.text((X(x2, y0 + py + INW[1] / 2), Z(PRN_Z + INW[2] / 2)), "Wide\n" + str(i + 1), font=fs, fill=DIM, anchor="mm", align="center")
    sy = y0 + py + INW[1] / 2
    # lips in the floor slot
    d.polygon([(X(x2, sy - 9), Z(6)), (X(x2, sy - 0.6), Z(0)), (X(x2, sy - 9), Z(0))], fill=ACC)
    d.polygon([(X(x2, sy + 9), Z(6)), (X(x2, sy + 0.6), Z(0)), (X(x2, sy + 9), Z(0))], fill=ACC)
d.line([X(x2, y0 + PRN_Y[0] + INW[1] / 2), Z(12), X(x2, y0 + PRN_Y[0] + INW[1] / 2), Z(-HANG)], fill=INK, width=4)
d.text((X(x2, y0 + PRN_Y[0] + INW[1] / 2) - 12, Z(-HANG / 2)), "billede", font=fs, fill=DIM, anchor="rm")
d.text((X(x2, y0 + D) + 16, Z(2)), "silikonelæber holder\nbilledets sidste 10-15 mm", font=fs, fill=ACC, anchor="lm")
d.text((X(x2, y0 + D) + 16, Z(HP / 2)), "låst servicelem = bunden\n(printernes filmlåger\nvender mod lemmen)", font=fs, fill=DIM, anchor="lm")
hdim(x2, y0, y0 + D, HP + H + 18, "85")
d.text((X(x2, y0), Z(HP + H + 40)), "front", font=fs, fill=DIM, anchor="lm")

# ---------------- slot detail
x3 = 2000
title(x3, "Detalje: sprækken", "set nedefra og i snit")
cx, cy, k = x3, 420, 7.0                # 7 px per mm
d.rectangle([cx - 60 * k / 2, cy - 12 * k, cx + 60 * k / 2, cy], fill=FILL, outline=INK, width=2)
d.rectangle([cx - 60 * k / 2, cy, cx - 4 * k, cy + 3 * k], fill=(200, 200, 205), outline=INK, width=2)
d.rectangle([cx + 4 * k, cy, cx + 60 * k / 2, cy + 3 * k], fill=(200, 200, 205), outline=INK, width=2)
d.polygon([(cx - 4 * k, cy), (cx - 0.5 * k, cy + 3 * k), (cx - 4 * k, cy + 3 * k)], fill=ACC)
d.polygon([(cx + 4 * k, cy), (cx + 0.5 * k, cy + 3 * k), (cx + 4 * k, cy + 3 * k)], fill=ACC)
d.rectangle([cx - 0.6 * k, cy - 10 * k, cx + 0.6 * k, cy + 30 * k], fill=PH, outline=INK, width=1)
d.text((cx, cy + 33 * k), "film 1,2 mm\nlæber lukker sprækken,\nnår der ikke er et billede", font=fs, fill=DIM, anchor="ma", align="center")
d.text((cx - 32 * k, cy + 1.5 * k), "bund 3 mm", font=fs, fill=DIM, anchor="rm")

d.text((1200, 1250), "Modulet skrues i hovedenhedens eksisterende bundsamling. Samlet højde 453 mm, dybde 85 mm.", font=fs, fill=DIM, anchor="ma")
img.save(sys.argv[1])
