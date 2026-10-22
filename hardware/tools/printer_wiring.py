#!/usr/bin/env python3
"""Wiring diagram of the Selfi printer v2 (DNP QW410 + Pi Zero 2 W + WS2812B strip) as a PNG.

Usage: python3 hardware/tools/printer_wiring.py <out.png> [version]
Only finished cables with plugs: nothing is soldered, and the only 230 V wiring is moulded mains cables.
"""
import sys

import cairosvg

OUT = sys.argv[1]
VER = sys.argv[2] if len(sys.argv) > 2 else "selfi-printer-v2"
INK, GREY, GREEN, PAPER, DASH = "#15171a", "#8a8f8a", "#0f7a3b", "#f3f4f1", "#5c615b"
MAINS, USB, V5, GND, DATA = "#b3261e", "#2a5bd7", "#d4380d", "#15171a", "#0f7a3b"
FONT = "DejaVu Sans"


def text(x, y, s, size=16, **kw):
    kw.setdefault("fill", INK)
    a = " ".join(f'{k.replace("_", "-")}="{v}"' for k, v in kw.items())
    return f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" {a}>{s}</text>'


def box(x, y, w, h, title, lines=(), fill="#ffffff", stroke=INK):
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="2.2"/>',
           text(x + 18, y + 32, title, 19, font_weight="bold")]
    out += [text(x + 18, y + 60 + i * 22, s, 14, fill=DASH) for i, s in enumerate(lines)]
    return "".join(out)


def wire(pts, colour, label="", lx=None, ly=None, w=5):
    d = "M" + " L".join(f"{x},{y}" for x, y in pts)
    out = f'<path d="{d}" fill="none" stroke="{colour}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round"/>'
    if label:
        out += text(lx, ly, label, 14, fill=colour, font_weight="bold")
    return out


def port(x, y, s, anchor="start"):
    return f'<circle cx="{x}" cy="{y}" r="6" fill="#ffffff" stroke="{INK}" stroke-width="2"/>' + text(x + (12 if anchor == "start" else -12), y + 5, s, 13, text_anchor=anchor)


W, H = 2400, 1400
o = [f'<rect width="{W}" height="{H}" fill="{PAPER}"/>',
     text(60, 70, "Selfi printer v2 · ledningsdiagram", 34, font_weight="bold"),
     text(60, 104, "Kun færdige kabler med stik · intet loddes · én 230 V-ledning ind · Pi'en og LED'en får strøm fra printerens egen 5 V-udgang", 18, fill=DASH)]

# blocks
o.append(box(60, 200, 300, 150, "Stikkontakt 230 V", ["Schuko → C13, 2 m", "(det eneste kabel kunden sætter i)"]))
o.append(box(470, 200, 330, 150, "Strømindgang C14", ["snap-in panelkabel i soklens", "plade i venstre ende,", "→ C13 vinklet, 30 cm"]))
o.append(box(960, 160, 520, 560, "DNP QW410", ["drejet 90°: papirudgangen mod højre ende", "tænd/sluk bagpå står fast på ON", "", "bagpå (venstre ende af kabinettet):"], fill="#f7f7f5"))
o.append(box(960, 840, 520, 330, "Raspberry Pi Zero 2 WH", ["printserver: CUPS + Gutenprint (selphy_print)", "på boksens wifi; styrer LED'en", "står på højkant i soklens riller"], fill="#eef6f0", stroke=GREEN))
o.append(box(1720, 840, 600, 300, "WS2812B RGB-strip, 9 LED (15 cm)", ["i skinnen på udgangsrummets bagvæg,", "lyser ned ad rutsjebanen", "JST-SM 3-pin · maks. 30 % lysstyrke ≈ 0,1 A"], fill="#eef6f0", stroke=GREEN))
o.append(box(1720, 200, 600, 200, "Boksen (gen 2)", ["sender print til printerens Pi via IPP", "over wifi · ingen kabler mellem", "boks og printer"], fill="#ffffff", stroke=GREY))

# printer ports (left side of the printer box)
o += [port(960, 370, "C14 230 V ind"), port(960, 440, "USB-A 5 V 2 A ud"), port(960, 510, "USB-B (print)")]
# Pi ports
o += [port(960, 1000, "PWR micro-USB"), port(960, 1070, "USB micro-USB (OTG)"), port(1480, 960, "pin 2  5 V", "end"),
      port(1480, 1030, "pin 6  GND", "end"), port(1480, 1100, "pin 12  GPIO18", "end")]
# strip ports
o += [port(1720, 960, "5 V (rød)"), port(1720, 1030, "GND (hvid)"), port(1720, 1100, "DIN (grøn)")]

# mains
o.append(wire([(360, 275), (470, 275)], MAINS, "230 V", 380, 262))
o.append(wire([(800, 275), (880, 275), (880, 370), (954, 370)], MAINS, "C13 vinklet", 810, 262))
# 5 V from the printer to the Pi
o.append(wire([(954, 440), (860, 440), (860, 1000), (954, 1000)], V5, "USB-A → micro-USB 20 cm (5 V)", 560, 720))
# print data Pi -> printer
o.append(wire([(954, 1070), (820, 1070), (820, 510), (954, 510)], USB, "micro-USB OTG → USB-B vinklet 30 cm", 470, 800))
# Pi header -> strip
o.append(wire([(1486, 960), (1714, 960)], V5, "", w=4))
o.append(wire([(1486, 1030), (1714, 1030)], GND, "", w=4))
o.append(wire([(1486, 1100), (1714, 1100)], DATA, "", w=4))
o.append(text(1500, 1160, "JST-SM 3-pin hun → 3 × Dupont hun, 20 cm", 14, fill=GREEN, font_weight="bold"))
o.append(text(1500, 1182, "kablet går langs bagvæggen ind i bagrummet til Pi'en", 13, fill=DASH))
# wifi
o.append(f'<path d="M1480,880 C1600,880 1640,420 1720,330" fill="none" stroke="{GREY}" stroke-width="2.4" stroke-dasharray="8 6"/>')
o.append(text(1560, 640, "wifi (IPP)", 15, fill=GREY))

# notes
notes = ["Rækkefølge ved samling: C14 i soklen → C13 i printeren → USB-kablerne → Pi i rillerne → LED-strip i skinnen → Dupont-stik på Pi'en.",
         "LED'en: brug Pi Zero 2 WH (med stiftliste). Data er 3,3 V fra GPIO18; det virker normalt på en kort strip. Flimrer den, sættes en 3,3→5 V-niveauskifter med stik ind (afprøves på prototypen).",
         "Tjek at printerens 5 V-udgang også giver strøm i standby, så Pi'en kører hele tiden. Pi + LED bruger under 0,7 A af de 2 A.",
         "Strippen klippes til 9 LED i den frie ende (efter LED 9, på klippemærket). Enden med JST-stikket bevares."]
for i, n in enumerate(notes):
    o.append(text(60, 1300 + i * 24 - 30, "· " + n, 15, fill=DASH))

svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">' + "".join(o) + "</svg>"
cairosvg.svg2png(bytestring=svg.encode(), write_to=OUT)
print(OUT)
