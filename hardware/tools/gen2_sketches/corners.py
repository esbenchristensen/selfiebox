"""Outline: box corner vs light-ring corner, now and two concentric proposals."""
import sys
from PIL import Image, ImageDraw, ImageFont
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
f, fb, fs = ImageFont.truetype(F, 22), ImageFont.truetype(FB, 28), ImageFont.truetype(F, 18)
INK, GREY, DIM, ACC, RING = (20, 20, 22), (150, 150, 155), (90, 90, 95), (200, 60, 120), (235, 236, 240)
img = Image.new("RGB", (1700, 1450), "white"); d = ImageDraw.Draw(img)
H = 306; RZ0, RZ1, RX, RR, RF = 16.8, 289.2, 94.45, 22, 18   # light ring centre line (halo.scad)

def rr(x0, y0, s, cx, z0, w, h, r, **kw):
    d.rounded_rectangle([x0 + (cx - w/2)*s, y0 - (z0 + h)*s, x0 + (cx + w/2)*s, y0 - z0*s], radius=r*s, **kw)

def unit(x0, y0, s, W, R, ring_x=RX, ring_r=RR, lw=3):
    rr(x0, y0, s, 0, 0, W, H, R, fill="white", outline=INK, width=lw)
    hc = RZ1 - RZ0
    rr(x0, y0, s, 0, RZ0 - RF/2, 2*ring_x + RF, hc + RF, ring_r + RF/2, fill=RING, outline=GREY, width=2)
    rr(x0, y0, s, 0, RZ0 + RF/2, 2*ring_x - RF, hc - RF, max(ring_r - RF/2, 1), fill="white", outline=GREY, width=2)
    rr(x0, y0, s, 0, 151.85 - 108.8, 136.4, 217.6, 2, outline=GREY, width=2)
    d.rectangle([x0 - 19*s, y0 - (RZ1 + 9)*s, x0 + 19*s, y0 - (RZ1 - 9)*s], fill="white")
    d.ellipse([x0 - 5, y0 - RZ1*s - 5, x0 + 5, y0 - RZ1*s + 5], outline=INK, width=2)

def panel(x0, W, R, t, sub, note, ring_x=RX):
    global d
    d.text((x0, 30), t, font=fb, fill=INK, anchor="ma"); d.text((x0, 70), sub, font=f, fill=DIM, anchor="ma")
    unit(x0, 640, 1.65, W, R, ring_x)
    # corner zoom (bottom-right), 5x
    s, cx0, cy0 = 5.0, x0, 1330
    zx, zz = W/2 - 70, 0                       # zoom window: 70 x 70 mm at the corner
    zw, zh = 70*s, 70*s
    left, top = cx0 - zw/2, cy0 - zh
    tmp = Image.new("RGB", (int(W*s) + 40, int(H*s) + 40), "white"); td = ImageDraw.Draw(tmp)
    keep = d; d = td
    unit(tmp.width/2, tmp.height - 20, s, W, R, ring_x, lw=4)
    d = keep
    crop = tmp.crop((int(tmp.width/2 + zx*s), int(tmp.height - 20 - 70*s), int(tmp.width/2 + zx*s + zw), int(tmp.height - 20 + 2)))
    img.paste(crop, (int(left), int(top)))
    d.rectangle([left, top, left + zw, top + crop.height], outline=GREY, width=1)
    d.text((x0, top - 30), "hjørnet forstørret", font=fs, fill=DIM, anchor="ma")
    d.text((x0, 1365), note, font=fs, fill=ACC, anchor="ma", align="center")

panel(450, 234, 24, "Nu (rev G)", "boks R24, lysring yderst R31", "lysringen er rundere end boksen\nafstand 13,5 mm på siden, 7,8 mm i bund/top")
panel(1250, 234, 44.5, "Forslag", "boks R44,5, lysring uændret", "boksen er nu rundere end lysringen, og hjørnerne\ndeler centrum vandret. Samme mål 234 x 306.")
img.save(sys.argv[1])
