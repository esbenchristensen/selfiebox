#!/usr/bin/env python3
"""Drawing sheets of the Selfi printer straight from the CAD: OpenSCAD projections and sections -> one PNG per sheet.

Usage: python3 hardware/tools/printer_sheet.py <svg dir> <out dir> <version>
The svg dir holds the views from the version's CAD (selfi_printer_v<N>.scad) as make_printer.py exports them:
v1 d_front, d_side, d_top, d_cut, d_cut_lock, d_side_vaeg, d_cut_vaeg; v2 d_front, d_end, d_top, d_cut_end, d_cut_long,
d_cut_lock. Measures in mm.
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
           + text(w - 50, h - 30, f"{VER} · mål i mm · CAD: hardware/cad/{VER.replace('-', '_')}.scad", 13, fill=GREY, text_anchor="end")
           + "".join(body) + "</svg>")
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / f"{VER}_{name}.png"))


def sheets_v1():
    W, H, D = 222.5, 220.0, 294.4
    SLOT_Z, LOGO_Z = 147, 72                          # as in the CAD

    # sheet 1: the unit on a table (B2C) and its section
    b = []
    fx, fy = 120 + W / 2 * S, 170 + H * S              # front view: origin = centre bottom
    g, _ = place("d_front", fx, fy); b += [text(120, 150, "Forfra", 18, font_weight="bold"), g]
    # details the silhouette does not show: exit slot, tray slots and the logo inlay
    b += [f'<rect x="{fx - 62 * S}" y="{fy - (SLOT_Z + 8) * S}" width="{124 * S}" height="{8 * S}" rx="3" fill="{INK}"/>']
    b += [f'<rect x="{fx + (x - 8) * S}" y="{fy - (SLOT_Z - 12) * S}" width="{16 * S}" height="{4 * S}" fill="none" stroke="{INK}" stroke-width="1.2"/>' for x in (-50, 50)]
    b += [f'<image href="data:image/png;base64,{LOGO}" x="{fx - 45.4 * S}" y="{fy - (LOGO_Z + 16.5) * S}" width="{90.8 * S}" height="{33 * S}"/>']
    b += [dim_h(fx - W / 2 * S, fx + W / 2 * S, fy + 30, f"{W:g}"), dim_v(fx - W / 2 * S - 22, fy - H * S, fy, f"{H:g}")]
    b += [note(fx + W / 2 * S + 14, fy - LOGO_Z * S, "logo indlagt 0,8"), note(fx + W / 2 * S + 14, fy - (SLOT_Z + 4) * S, "papirudgang 124 × 8"),
          note(fx + W / 2 * S + 14, fy - (SLOT_Z - 12) * S, "2 slidser til bakken"), note(fx + W / 2 * S + 14, fy - 12 * S, "fuge kappe / sokkel"),
          note(fx + W / 2 * S + 14, fy - (SLOT_Z + 22) * S, f"højde {SLOT_Z:g}: måles på printeren")]
    sx, sy = 880 + 72 * S, 170 + H * S                 # side view: origin = front bottom
    g, _ = place("d_side", sx, sy); b += [text(880, 150, "Fra højre", 18, font_weight="bold"), g]
    b += [dim_h(sx, sx + D * S, sy + 30, f"{D:g}"), dim_h(sx - 72 * S, sx, sy + 30, "bakke 72")]
    tx, ty = 120 + W / 2 * S, 720 + D * S              # top view: origin = centre front
    g, _ = place("d_top", tx, ty); b += [text(120, 700, "Oppefra", 18, font_weight="bold"), g]
    b += [note(tx + W / 2 * S + 14, ty - (D - 40) * S, "udluftning bagpå og i siderne")]
    cx, cy = 880 + 72 * S, 720 + H * S                 # section at x = 0
    g, _ = place("d_cut", cx, cy, fill="#e9eae6"); b += [text(880, 700, "Snit midt (x = 0)", 18, font_weight="bold"), g]
    for s_, y_ in (("kappe 3,2 ASA, top ned på pladen", 210), ("DNP QW410 · 208 × 198 × 240", 120), ("sokkel 12 + kant 9 med klik", 14),
                   ("bagrum 40: Pi Zero 2 W (5 V fra printeren) + C14-indgang", 60)):
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
    v4 = VER == "selfi-printer-v4"
    for s_, y_ in (("sokkel i konsollen: 2 × SPUN+ 4,0 × " + ("16" if v4 else "30"), -6),
                   ("konsol: hylde 200 bred, 6 tyk + 2 knægte 6" if v4 else "konsol: hylde 12 + 2 massive knægte 14", -60), ("vægplade, 45° skinne, 4 skruer + dybler", -110),
                   ("pin-Torx-skrue låser konsollen", -150)):
        b.append(note(cx + (D + 42) * S, cy - y_ * S, s_))
    sheet("tegning_vaeg", "Selfi printer v1 · vægmontering (B2B)", "Samme kappe og sokkel; konsollen hægtes på vægpladen og låses. Stedet monterer selv efter guiden.", b, h=1400)


def sheets_v2(v3=False):
    """v2, and v3 (the same unit with a flat top and "Dit print" over the pocket)"""
    L, D, PM = 476.0, 222.5, 287.2
    TOP, HE = (217.2, 217.2) if v3 else (277.6, 217.2)
    OP_X, OP_W, OP_Z0, OP_Z1, LOGO_Z, SLOT_Z = (287.7 + 476) / 2, 170, 31, 85, 120, 147
    b = []
    # row 1: front, right end, section through the exit chamber
    fx, fy = 120, 190 + TOP * S
    g, _ = place("d_front", fx, fy); b += [text(120, 150, "Forfra (gæstens side)", 18, font_weight="bold"), g]
    b += [f'<rect x="{fx + (OP_X - OP_W / 2) * S}" y="{fy - OP_Z1 * S}" width="{OP_W * S}" height="{(OP_Z1 - OP_Z0) * S}" rx="{8 * S}" fill="{INK}"/>']
    b += [f'<image href="data:image/png;base64,{LOGO}" x="{fx + (PM / 2 - 49.5) * S}" y="{fy - (LOGO_Z + 18) * S}" width="{99 * S}" height="{36 * S}"/>']
    b += [dim_h(fx, fx + L * S, fy + 30, f"{L:g}"), dim_h(fx, fx + PM * S, fy + 62, "kappe + sokkel 287"),
          dim_h(fx + PM * S, fx + L * S, fy + 62, "udgangsmodul 189"),
          dim_v(fx - 52, fy - TOP * S, fy, f"{TOP:g}")] + ([] if v3 else [dim_v(fx - 22, fy - HE * S, fy, f"{HE:g}")])
    b += [note(fx + (OP_X - OP_W / 2) * S, fy - OP_Z1 * S - 10, f"udtagslomme {OP_W} × {OP_Z1 - OP_Z0}, stoplæbe med 3 dræn")]
    ex, ey = 1150, 190 + TOP * S
    g, _ = place("d_end", ex, ey); b += [text(1150, 150, "Fra højre ende", 18, font_weight="bold"), g]
    b += [dim_h(ex, ex + D * S, ey + 30, f"{D:g}"), note(ex + D * S + 14, ey - (TOP - 6) * S, "flad top, kanter R10" if v3 else "rund ryg R25"),
          note(ex + D * S + 14, ey - ((HE - 40) if v3 else (HE + 30)) * S, "ingen åbninger i toppen" if v3 else "sadeltag 30°")]
    if v3:
        b += [text(fx + OP_X * S, fy - (LOGO_Z - 6) * S, "Dit print", 17 * S, fill=INK, text_anchor="middle", font_weight="bold"),
              note(fx + (OP_X + 48) * S, fy - (LOGO_Z + 6) * S, "\"Dit print\" + pil indlagt (hvid + grøn)")]
    cx, cy = 1700, 190 + TOP * S
    g, _ = place("d_cut_end", cx, cy, fill="#e9eae6"); b += [text(1700, 150, "Snit gennem udgangsrummet", 18, font_weight="bold"), g]
    b += [f'<rect x="{cx + (D / 2 - 62) * S}" y="{cy - (SLOT_Z + 6) * S}" width="{124 * S}" height="{6 * S}" fill="none" stroke="{GREEN}" stroke-width="1.4" stroke-dasharray="5 4"/>']
    for s_, z_ in (("printerens papirudgang (bag snittet), 135 over printerens bund: mål", SLOT_Z + 8),
                   ("RGB-LED i skinne på bagvæggen", 128), ("rutsjebane 30°", 86), ("skærm 54°, 48 mm spalte", 106),
                   ("lommebund falder 4 mm udad + stoplæbe", 34)):
        b.append(note(cx + D * S + 16, cy - z_ * S, s_))
    # row 2: top, long section, section through the lock
    tx, ty = 120, 880 + D * S
    g, _ = place("d_top", tx, ty); b += [text(120, 860, "Oppefra", 18, font_weight="bold"), g]
    b += [note(tx, ty + 28, "ingen åbninger i toppen · skyggefugen ved 287 har en 8 mm studs bagved")]
    lx, ly = 1130, 880 + TOP * S
    g, _ = place("d_cut_long", lx, ly, fill="#e9eae6"); b += [text(1130, 860, "Snit langs midten", 18, font_weight="bold"), g]
    for s_, x_, z_ in (("DNP QW410 drejet 90°, 208 × 198 × 240", 60, 240), ("Pi Zero 2 W", 20, 210), ("frit papirrum 190", 300, 240)):
        b.append(note(lx + x_ * S, ly - z_ * S, s_))
    if v3:
        b.append(note(lx + 12 * S, ly + 26, "strømkabel ind bagfra gennem soklen, stikket kun indeni · " + ("skumsnor Ø1,5 i riller ved fugerne, 6 kroge trækker kappen ned" if VER == "selfi-printer-v4" else "tætningsbånd 3 × 1 i riller ved fugerne")))
    kx, ky = 2160, 880 + TOP * S
    g, _ = place("d_cut_lock", kx, ky, fill="#e9eae6"); b += [text(2160, 860, "Snit gennem låsen", 18, font_weight="bold"), g]
    for i, s_ in enumerate(("Kamlåsen i venstre ende låser kappen:", "kammen drejer op under taget på", "låseholderen i soklen, så kappen hverken",
                            "kan løftes eller skubbes. Låst op: skub", "kappen 10 mm til venstre og løft den af.")):
        b.append(text(2160, ky + 40 + i * 20, s_, 13, fill=GREEN))
    sheet("tegning", f"Selfi printer {VER.rsplit('-', 1)[1]} · tegning", "Hærværkssikret: DNP QW410 drejet 90°, papiret kører frit i et lukket rum, printet rutsjer ned i en lomme foran · "
          + ("flad top · nøglelås" if v3 else "sadeltag · nøglelås"),
          b, w=2700, h=1680)


LOGO = base64.b64encode(cairosvg.svg2png(url=str(Path(__file__).resolve().parents[2] / "marketing/brandpakke/01_logo/svg/selfi-logo-groen.svg"), output_width=700)).decode()
{"selfi-printer-v1": sheets_v1, "selfi-printer-v2": sheets_v2, "selfi-printer-v3": lambda: sheets_v2(v3=True), "selfi-printer-v4": lambda: sheets_v2(v3=True)}[VER]()
