"""Line sheet of the gen 2 concept straight from the CAD (OpenSCAD projections/sections as SVG)."""
import re, sys, os
from PIL import Image, ImageDraw, ImageFont
V = sys.argv[1]; OUT = sys.argv[2]
F = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
f, fb, fs = ImageFont.truetype(F, 22), ImageFont.truetype(FB, 28), ImageFont.truetype(F, 18)
INK, GREY, DIM, ACC, BODY, RING, MOD, PH, RAIL = (20,20,22), (150,150,155), (90,90,95), (200,60,120), (236,237,240), (214,222,236), (226,227,231), (245,240,225), (205,205,210)
W, H, D, HP = 222.5, 306, 85, 147
JOINT = (89.0862, 22.1638); JZ = (22.1638, 283.836)

def load(name):
    t = open(os.path.join(V, name + ".svg")).read()
    polys = []
    for d in re.findall(r'd="([^"]+)"', t):
        for sub in re.split(r'[Mm]', d):
            pts = [tuple(map(float, p.split(','))) for p in re.findall(r'(-?[\d.e+-]+,-?[\d.e+-]+)', sub)]
            if len(pts) > 2: polys.append([(x, -y) for x, y in pts])
    return polys

img = Image.new("RGB", (2400, 1500), "white"); d = ImageDraw.Draw(img)
def draw(polys, x0, y0, s, fill=None, outline=INK, width=2, mirror=False, dx=0, dz=0):
    # even-odd fill on a mask, then outlines
    if fill:
        m = Image.new("L", img.size, 0); md = ImageDraw.Draw(m)
        for p in polys:
            q = [(x0 + ((-x if mirror else x) + dx) * s, y0 - (z + dz) * s) for x, z in p]
            tmp = Image.new("L", img.size, 0); ImageDraw.Draw(tmp).polygon(q, fill=255)
            m = Image.fromarray(__import__("numpy").bitwise_xor(__import__("numpy").array(m), __import__("numpy").array(tmp)))
        img.paste(Image.new("RGB", img.size, fill), (0, 0), m)
    for p in polys:
        q = [(x0 + ((-x if mirror else x) + dx) * s, y0 - (z + dz) * s) for x, z in p]
        ImageDraw.Draw(img).line(q + q[:1], fill=outline, width=width)
def title(x, t, sub):
    d.text((x, 28), t, font=fb, fill=INK, anchor="ma"); d.text((x, 66), sub, font=f, fill=DIM, anchor="ma")

# 1 front: main + module + photo
x1, y1, s1 = 330, 1240, 2.35
title(x1, "Forfra", "hovedenhed 222,5 x 306 + printermodul")
draw(load("f_photo"), x1, y1, s1, fill=PH, width=1)
draw(load("f_module"), x1, y1, s1, fill=MOD)
draw(load("f_bezel"), x1, y1, s1, fill=BODY, dz=HP)
draw(load("f_ring"), x1, y1, s1, fill=RING, outline=GREY, dz=HP)
for jx in (-JOINT[0], JOINT[0]):
    for jz in JZ:
        cx, cy = x1 + jx * s1, y1 - (jz + HP) * s1
        d.ellipse([cx - 9, cy - 9, cx + 9, cy + 9], outline=ACC, width=2)
d.text((x1, y1 + 14), "rød = skjult skrue bagfra (ses ikke forfra)", font=fs, fill=ACC, anchor="ma")

# 2 side silhouette
x2, s2 = 760, 2.35
title(x2 + 40, "Fra siden", "85 mm dyb, glat side uden skruer")
draw(load("p_mod"), x2, y1, s2, fill=MOD)
draw(load("p_main"), x2, y1, s2, fill=BODY)
d.text((x2 + 100, y1 + 14), "front til venstre", font=fs, fill=DIM, anchor="ma")

# 3 back view (seen from behind: mirror x), slice just inside the back face
x3, y3, s3 = 1330, 1000, 2.35
title(x3, "Bagfra", "skruer i ringens hjørner + vingehuller")
draw(load("b_shell"), x3, y3, s3, fill=BODY, mirror=True)
for (wx, wz) in [(-99.25, 66.8), (-99.25, 239.2), (99.25, 66.8), (99.25, 239.2)]:
    cx, cy = x3 - wx * s3, y3 - wz * s3
    d.ellipse([cx - 13, cy - 13, cx + 13, cy + 13], outline=(40, 120, 200), width=3)
for jx in (-JOINT[0], JOINT[0]):
    for jz in JZ:
        cx, cy = x3 - jx * s3, y3 - jz * s3
        d.ellipse([cx - 13, cy - 13, cx + 13, cy + 13], outline=ACC, width=3)
d.text((x3, y3 + 16), "rød = 4 x M3 til fronten   blå = 4 x M3 til temavinger", font=fs, fill=DIM, anchor="ma")
d.text((x3, y3 + 42), "vender mod væggen, når boksen hænger", font=fs, fill=DIM, anchor="ma")

# 4 section through a joint (x = 89.1): y to the right, z up, window y -3..88, z 0..48
x4, y4, s4 = 1700, 820, 7.6
title(x4 + 330, "Snit gennem en skrue", "LED-rammen klemmes mellem front og kabinet")
Z0, Z1, Y0, Y1 = 0, 48, -3, 88
cw, ch = int((Y1 - Y0) * s4), int((Z1 - Z0) * s4)
canvas = Image.new("RGB", (cw + 1, ch + 1), "white")
global_img = img
img = canvas
for name, fill in (("s_shell2", BODY), ("s_bezel2", BODY), ("s_led_rail2", RAIL), ("s_diffuser_ring", RING)):
    draw(load(name), -Y0 * s4, ch, s4, fill=fill, width=2)
cd = ImageDraw.Draw(canvas)
RIB_TOP = 3.2 + 0.5 + 15.5 + 0.5; RAIL_T = 2.5; ya = RIB_TOP + RAIL_T
zc = JOINT[1]
P = lambda y, z: ((y - Y0) * s4, ch - (z - Z0) * s4)
cd.rectangle([*P(RIB_TOP - 5.7, zc + 1.5), *P(ya + 8, zc - 1.5)], fill=(60, 60, 64))
cd.rectangle([*P(ya + 8, zc + 2.7), *P(ya + 10.5, zc - 2.7)], fill=(60, 60, 64))
img = global_img; d = ImageDraw.Draw(img)
img.paste(canvas, (x4, y4 - ch))
d.rectangle([x4, y4 - ch, x4 + cw, y4], outline=GREY, width=1)
X = lambda y: x4 + (y - Y0) * s4; Zp = lambda z: y4 - (z - Z0) * s4
d.text((X(0), y4 + 10), "front", font=fs, fill=DIM)
d.text((X(85), y4 + 10), "bag", font=fs, fill=DIM, anchor="ra")
for lbl, yy, zz, a in (("front", 1, 40, "lm"), ("LED-ramme", RIB_TOP + 3.5, 40, "lm"), ("kabinettets stolpe", 50, 31, "lm"), ("M3 x 16 bagfra", 34, 15, "lm")):
    d.text((X(yy), Zp(zz)), lbl, font=fs, fill=INK, anchor=a)
d.text((x4 + cw/2, y4 + 40), "skruen går fra bagsiden gennem stolpen og LED-rammen", font=fs, fill=DIM, anchor="ma")
d.text((x4 + cw/2, y4 + 64), "og ind i en gevindbøsning i frontens hjørne", font=fs, fill=DIM, anchor="ma")

d.text((1200, 1460), "Tegnet direkte fra CAD-modellen (gen2_concept.scad). Ingen udsnit i hovedenheden; modulet skrues i den eksisterende bundsamling.", font=fs, fill=DIM, anchor="ma")
img.save(OUT)
