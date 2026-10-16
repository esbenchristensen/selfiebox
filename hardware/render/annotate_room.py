#!/usr/bin/env python3
"""Draw scale dimensions on the room renders (docs/pack/renders/room*.jpg -> room*_maal.jpg).

Pixel positions come from the <shot>.json files render.py writes next to each room render.
Usage: python3 hardware/render/annotate_room.py
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "docs" / "pack" / "renders"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
INK, BG = (255, 255, 255), (20, 20, 24, 200)


def label(d, xy, text, f, anchor="lm"):
    box = d.textbbox(xy, text, font=f, anchor=anchor)
    d.rounded_rectangle([box[0] - 10, box[1] - 7, box[2] + 10, box[3] + 7], radius=8, fill=BG)
    d.text(xy, text, font=f, fill=INK, anchor=anchor)


def vdim(d, x, y0, y1, text, f, side=1):
    """vertical dimension line with end ticks and a label beside it"""
    d.line([(x, y0), (x, y1)], fill=INK, width=3)
    for y in (y0, y1):
        d.line([(x - 14, y), (x + 14, y)], fill=INK, width=3)
    label(d, (x + side * 22, (y0 + y1) / 2), text, f, anchor="lm" if side > 0 else "rm")


def annotate(name, notes):
    src = OUT / f"{name}.jpg"
    meta = json.loads((OUT / f"{name}.json").read_text())
    im = Image.open(src).convert("RGBA")
    sx = im.width / meta["size"][0]
    P = {k: (v[0] * sx, v[1] * sx) for k, v in meta["px"].items()}
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    f = ImageFont.truetype(FONT, max(18, int(im.width / 70)))
    k = im.width / 2200                                   # offsets are designed for a 2200 px wide image
    bx = P["box_right"][0] + 45 * k
    vdim(d, bx, P["box_top"][1], P["box_bottom"][1], "50 cm", f)
    lens = P["lens"]
    d.line([(lens[0], lens[1] - 12 * k), (lens[0], lens[1] - 160 * k)], fill=INK, width=2)
    label(d, (lens[0], lens[1] - 190 * k), "Kamera 160 cm over gulv · boks 23,4 cm bred", f, anchor="mm")
    hx = P["head"][0] - 150 * k
    vdim(d, hx, P["head"][1], P["feet"][1], "175 cm", f, side=-1)
    for xy, t in notes:
        label(d, (xy[0] * im.width, xy[1] * im.height), t, f)
    Image.alpha_composite(im, layer).convert("RGB").save(OUT / f"{name}_maal.jpg", quality=90)
    print("annotated", name)


if __name__ == "__main__":
    annotate("room", [((0.66, 0.86), "Barbord 110 cm · plakater 50 × 70 cm"), ((0.06, 0.16), "Dør 210 cm")])
    annotate("room_close", [])
