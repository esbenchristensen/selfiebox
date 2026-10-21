#!/usr/bin/env python3
"""Drawing sheets of the Selfi printer straight from the CAD: OpenSCAD projections and sections -> one PNG per sheet.

Usage: python3 hardware/tools/printer_sheet.py <svg dir> <out dir> <version>
The svg dir holds the views from selfi_printer_v1.scad (d_front, d_side, d_top, d_cut, d_cut_lock, d_side_vaeg, d_cut_vaeg),
as make_printer.py exports them. Measures in mm.
"""
import base64
import re
import sys
from pathlib import Path

import cairosvg

SVG, OUT, VER = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
INK, GREY, GREEN, PAPER = "#15171a", "#8a8f8a", "#0f7a3b", "#f3f4f1"
FONT = "DejaVu Sans"
S = 2.0   # px per mm


def view(name):
    """paths and viewBox (x0, y0, w, h) of an OpenSCAD 2D export (y already flipped)"""
    t = (SVG / f"{name}.svg").read_text()
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', t).group(1).split()]
    return re.findall(r'<path d="([^"]+)"', t, re.S), vb


def place(name, x, y, fill="#ffffff", stroke=INK):
    """draw a view with its model origin at page (x, y); returns svg"""
    paths, vb = view(name)
    d = " ".join(paths)
    return (f'<g transform="translate({x},{y}) scale({S})"><path d="{d}" fill="{fill}" fill-rule="evenodd" '
            f'stroke="{stroke}" stroke-width="{1.4 / S}" stroke-linejoin="round"/></g>'), vb


def text(x, y, s, size=15, **kw):
    kw.setdefault("fill", INK)
    a = " ".join(f'{k.replace("_", "-")}="{v}"' for k, v in kw.items())
    return f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" {a}>{s}</text>'


def dim_h(x0, x1, y, label):
    return (f'<path d="M{x0},{y} H{x1} M{x0},{y - 6} V{y + 6} M{x1},{y - 6} V{y + 6}" stroke="{GREY}" stroke-width="1.1"/>'
            + text((x0 + x1) / 2, y - 6, label, 13, fill=GREY, text_anchor="middle"))


def dim_v(x, y0, y1, label):
    return (f'<path d="M{x},{y0} V{y1} M{x - 6},{y0} H{x + 6} M{x - 6},{y1} H{x + 6}" stroke="{GREY}" stroke-width="1.1"/>'
            f'<text x="{x - 8}" y="{(y0 + y1) / 2}" font-family="{FONT}" font-size="13" fill="{GREY}" text-anchor="middle" '
            f'transform="rotate(-90 {x - 8} {(y0 + y1) / 2})">{label}</text>')


def note(x, y, s):
    return text(x, y, s, 13, fill=GREEN)


def sheet(name, title, sub, body, w=2400, h=1500):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
           f'<rect width="{w}" height="{h}" fill="{PAPER}"/>'
           + text(50, 60, title, 30, font_weight="bold") + text(50, 92, sub, 16, fill="#5c615b")
           + text(w - 50, h - 30, f"{VER} · mål i mm · CAD: hardware/cad/selfi_printer_v1.scad", 13, fill=GREY, text_anchor="end")
           + "".join(body) + "</svg>")
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / f"{VER}_{name}.png"))


W, H, D = 222.5, 220.0, 294.4
LOGO = base64.b64encode(cairosvg.svg2png(url=str(Path(__file__).resolve().parents[2] / "marketing/brandpakke/01_logo/svg/selfi-logo-groen.svg"), output_width=700)).decode()

# sheet 1: the unit on a table (B2C) and its section
b = []
fx, fy = 120 + W / 2 * S, 170 + H * S              # front view: origin = centre bottom
g, _ = place("d_front", fx, fy); b += [text(120, 150, "Forfra", 18, font_weight="bold"), g]
# details the silhouette does not show: exit slot, tray slots and the logo inlay
b += [f'<rect x="{fx - 62 * S}" y="{fy - 66 * S}" width="{124 * S}" height="{8 * S}" rx="3" fill="{INK}"/>']
b += [f'<rect x="{fx + (x - 8) * S}" y="{fy - 46 * S}" width="{16 * S}" height="{4 * S}" fill="none" stroke="{INK}" stroke-width="1.2"/>' for x in (-50, 50)]
b += [f'<image href="data:image/png;base64,{LOGO}" x="{fx - 45.4 * S}" y="{fy - 166.5 * S}" width="{90.8 * S}" height="{33 * S}"/>']
b += [dim_h(fx - W / 2 * S, fx + W / 2 * S, fy + 30, f"{W:g}"), dim_v(fx - W / 2 * S - 22, fy - H * S, fy, f"{H:g}")]
b += [note(fx + W / 2 * S + 14, fy - 150 * S, "logo indlagt 0,8"), note(fx + W / 2 * S + 14, fy - 62 * S, "papirudgang 124 × 8"),
      note(fx + W / 2 * S + 14, fy - 40 * S, "2 slidser til bakken"), note(fx + W / 2 * S + 14, fy - 12 * S, "fuge kappe / sokkel")]
sx, sy = 880 + 72 * S, 170 + H * S                 # side view: origin = front bottom
g, _ = place("d_side", sx, sy); b += [text(880, 150, "Fra højre", 18, font_weight="bold"), g]
b += [dim_h(sx, sx + D * S, sy + 30, f"{D:g}"), dim_h(sx - 72 * S, sx, sy + 30, "bakke 72")]
tx, ty = 120 + W / 2 * S, 720 + D * S              # top view: origin = centre front
g, _ = place("d_top", tx, ty); b += [text(120, 700, "Oppefra", 18, font_weight="bold"), g]
b += [note(tx + W / 2 * S + 14, ty - (D - 40) * S, "udluftning bagpå")]
cx, cy = 880 + 72 * S, 720 + H * S                 # section at x = 0
g, _ = place("d_cut", cx, cy, fill="#e9eae6"); b += [text(880, 700, "Snit midt (x = 0)", 18, font_weight="bold"), g]
for s_, y_ in (("kappe 3,2 ASA, top ned på pladen", 210), ("DNP QW410 · 208 × 198 × 240", 120), ("sokkel 12 + kant 9 med klik", 14),
               ("bagrum 40: Pi Zero 2 W + 5 V + C14-indgang", 60)):
    b.append(note(cx + D * S + 20, cy - y_ * S, s_))
lx, ly = 1960, 170 + H * S                         # section through the cam lock (B2B)
g, _ = place("d_cut_lock", lx, ly, fill="#e9eae6"); b += [text(1720, 150, "Snit gennem låsen (B2B)", 18, font_weight="bold"), g]
b += [note(1720, ly + 40, "Ø19-skabslås i 10 mm boss, kammen"), note(1720, ly + 60, "drejer ned bag tanden på soklen")]
sheet("tegning", "Selfi printer v1 · tegning", "DNP QW410 i printet ASA-kabinet · samme bredde og hjørne som gen 2 · kappen løftes af for papirskift", b, h=1560)

# sheet 2: on the wall (B2B)
b = []
sx, sy = 160 + 72 * S, 230 + (H + 10) * S
g, vb = place("d_side_vaeg", sx, sy); b += [text(120, 150, "Væg, fra højre", 18, font_weight="bold"), g]
b += [dim_v(sx + (D + 22) * S + 40, sy - H * S, sy + 170 * S, "390"), note(sx - 60 * S, sy + 200 * S, "kabel ned ad væggen i skinne · min. 120 fri over kappen")]
cx, cy = 1120 + 72 * S, 230 + (H + 10) * S
g, _ = place("d_cut_vaeg", cx, cy, fill="#e9eae6"); b += [text(1080, 150, "Snit midt, væg", 18, font_weight="bold"), g]
for s_, y_ in (("sokkel i konsollen: 2 × SPUN+ 4,0 × 30", -6),
               ("konsol: hylde 12 + 2 massive knægte 14", -60), ("vægplade, 45° skinne, 4 skruer + dybler", -110),
               ("pin-Torx-skrue låser konsollen", -150)):
    b.append(note(cx + (D + 42) * S, cy - y_ * S, s_))
sheet("tegning_vaeg", "Selfi printer v1 · vægmontering (B2B)", "Samme kappe og sokkel; konsollen hægtes på vægpladen og låses. Stedet monterer selv efter guiden.", b, h=1400)
