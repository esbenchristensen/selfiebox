"""Outline sketch: rev G main unit at 85 mm (unchanged shape) + two printer module options."""
import sys
from PIL import Image, ImageDraw, ImageFont

S = 1.6                       # px per mm
W, H, D, R = 234, 306, 85, 24
HP = 147                      # module body height below the main unit
GAP = 1                       # shadow gap
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
f, fb, fs = ImageFont.truetype(F, 22), ImageFont.truetype(FB, 28), ImageFont.truetype(F, 18)
INK, GREY, FILL, DIM, ACC = (20, 20, 22), (150, 150, 155), (225, 226, 230), (90, 90, 95), (200, 60, 120)

img = Image.new("RGB", (2400, 1250), "white")
d = ImageDraw.Draw(img)
BASE = 1080                   # y px of z = 0


def P(x0, z):                 # mm -> px (x0 = panel centre in px)
    return x0 + 0, BASE - z * S


def rrect(x0, cx, z0, w, h, r, fill=None, outline=INK, width=3, corners=(True, True, True, True)):
    x, y1 = x0 + (cx - w / 2) * S, BASE - z0 * S
    d.rounded_rectangle([x, y1 - h * S, x + w * S, y1], radius=r * S, fill=fill, outline=outline, width=width, corners=corners)


def hdim(x0, xa, xb, z, text):
    y = BASE - z * S
    d.line([x0 + xa * S, y, x0 + xb * S, y], fill=DIM, width=2)
    for xx in (xa, xb): d.line([x0 + xx * S, y - 8, x0 + xx * S, y + 8], fill=DIM, width=2)
    d.text((x0 + (xa + xb) / 2 * S, y + 6), text, font=fs, fill=DIM, anchor="ma")


def vdim(x0, x, za, zb, text, left=True):
    xx = x0 + x * S
    d.line([xx, BASE - za * S, xx, BASE - zb * S], fill=DIM, width=2)
    for z in (za, zb): d.line([xx - 8, BASE - z * S, xx + 8, BASE - z * S], fill=DIM, width=2)
    d.text((xx + (-10 if left else 10), BASE - (za + zb) / 2 * S), text, font=fs, fill=DIM, anchor="rm" if left else "lm")


def main_front(x0, z0):
    rrect(x0, 0, z0 - GAP, W + 2 * GAP, H + 2 * GAP, R + GAP, fill="white", outline="white")
    rrect(x0, 0, z0, W, H, R, fill="white")
    # light ring + screen + camera (from halo.scad: ring centre line 94.45 x 16.8..289.2, R22)
    ring_w, ring_z0, ring_z1 = 2 * 94.45, 16.8, 289.2
    rrect(x0, 0, z0 + ring_z0 - 9, ring_w + 18, ring_z1 - ring_z0 + 18, 22 + 9, outline=GREY, width=2)
    rrect(x0, 0, z0 + ring_z0 + 9, ring_w - 18, ring_z1 - ring_z0 - 18, 22 - 9, outline=GREY, width=2)
    rrect(x0, 0, z0 + 151.85 - 108.8, 136.4, 217.6, 2, outline=GREY, width=2)
    cx, cy = x0, BASE - (z0 + 289.2) * S
    d.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], outline=INK, width=2)


def panel(x0, title, sub):
    d.text((x0, 40), title, font=fb, fill=INK, anchor="ma")
    d.text((x0, 80), sub, font=f, fill=DIM, anchor="ma")


# ---------- 1: main unit alone, front + side
x1 = 300
panel(x1 + 60, "Hovedenhed (uændret form)", "234 x 306 x 85 mm")
main_front(x1, HP)
hdim(x1, -W / 2, W / 2, HP - 22, "234")
vdim(x1, -W / 2 - 18, HP, HP + H, "306")
xs = x1 + 230                 # side view right of the front
d.rounded_rectangle([xs, BASE - (HP + H) * S, xs + D * S, BASE - HP * S], radius=6, outline=INK, width=3)
d.line([xs + 22 * S, BASE - (HP + H) * S, xs + 22 * S, BASE - HP * S], fill=GREY, width=1)
d.line([xs + 32 * S, BASE - (HP + H) * S, xs + 32 * S, BASE - HP * S], fill=GREY, width=1)
d.text((xs + D * S / 2, BASE - (HP + H) * S - 12), "side", font=fs, fill=DIM, anchor="md")
d.line([xs, BASE - (HP - 22) * S, xs + D * S, BASE - (HP - 22) * S], fill=DIM, width=2)
d.text((xs + D * S / 2, BASE - (HP - 22) * S + 6), "85", font=fs, fill=DIM, anchor="ma")

# ---------- 2: option A, flush cradle
x2 = 1100
panel(x2, "A: Vugge i samme bredde", "Modul 234 x 171 x 85 mm, følger hjørnerne (R24)")
rrect(x2, 0, 0, W, HP + R, R, fill=FILL, corners=(False, False, True, True))
main_front(x2, HP)
for xx in (-46.5, 46.5):      # photo slots in the bottom
    pass
d.line([x2 - 46 * S, BASE - 2, x2 + 46 * S, BASE - 2], fill=ACC, width=5)
d.text((x2, BASE + 30), "sprække til billedet i bunden", font=fs, fill=ACC, anchor="ma")
vdim(x2, -W / 2 - 18, 0, HP, "147")
vdim(x2, W / 2 + 18, 0, HP + R, "171", left=False)
d.text((x2, BASE - HP / 2 * S), "2 x Instax Link Wide\nbag hinanden", font=f, fill=DIM, anchor="mm", align="center")

# ---------- 3: option B, outside cheeks
x3 = 1900
CT, CH = 3, 60
panel(x3, "B: Kinder udenpå", "Modul 240 x 207 x 85 mm, kinder 3 mm op ad siderne")
rrect(x3, 0, 0, W + 2 * CT, HP + CH, R + CT, fill=FILL, corners=(False, False, True, True))
main_front(x3, HP)
d.line([x3 - 46 * S, BASE - 2, x3 + 46 * S, BASE - 2], fill=ACC, width=5)
d.text((x3, BASE + 30), "sprække til billedet i bunden", font=fs, fill=ACC, anchor="ma")
vdim(x3, -W / 2 - CT - 18, 0, HP + CH, "207")
hdim(x3, -W / 2 - CT, W / 2 + CT, -40, "240")
d.text((x3, BASE - HP / 2 * S), "2 x Instax Link Wide\nbag hinanden", font=f, fill=DIM, anchor="mm", align="center")

d.text((1200, 1215), "Samlet højde 453 mm i begge. Hovedenheden bruges som den er; modulet skrues i dens eksisterende bundsamling.",
       font=fs, fill=DIM, anchor="ma")
img.save(sys.argv[1])
