"""Ledningsdiagram for Halo gen 2. Usage: python3 hardware/render/ledningsdiagram_gen2.py out.svg [halo-gen2-vN]"""
import sys
VER = sys.argv[2] if len(sys.argv) > 2 else "halo-gen2-v3"
W, H = 1800, 1360
C = dict(v24="#d62828", v5="#e67700", gnd="#222222", sig="#1c7ed6", data="#9c36b5", sw="#868e96")
out = []
def box(x, y, w, h, title, sub="", fill="#f5f5f4"):
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="#555" stroke-width="2"/>')
    out.append(f'<text x="{x+w/2}" y="{y+30}" text-anchor="middle" font-size="21" font-weight="700">{title}</text>')
    for i, line in enumerate(sub.split("|") if sub else []):
        out.append(f'<text x="{x+w/2}" y="{y+55+i*21}" text-anchor="middle" font-size="15" fill="#444">{line}</text>')
def wago(x, y, n, title, col, tpos=None):   # vertical block, returns terminal y's
    h = 34*n + 16
    out.append(f'<rect x="{x}" y="{y}" width="58" height="{h}" rx="8" fill="#fff" stroke="{col}" stroke-width="4"/>')
    for i in range(n):
        out.append(f'<rect x="{x+16}" y="{y+10+34*i}" width="26" height="26" rx="4" fill="#ff922b" stroke="#a65800"/>')
    tx, ty, ta = tpos or (x+29, y-12, "middle")
    out.append(f'<text x="{tx}" y="{ty}" text-anchor="{ta}" font-size="16" font-weight="700" fill="{col}">{title}</text>')
    return [y+23+34*i for i in range(n)]
def wire(pts, col, w=4):
    d = " ".join(("M" if i == 0 else "L") + f"{p[0]},{p[1]}" for i, p in enumerate(pts))
    out.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round"/>')
def lab(x, y, t, col="#333", anchor="start", size=14):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{col}" font-weight="600" text-anchor="{anchor}">{t}</text>')

out.append(f'<rect width="{W}" height="{H}" fill="#fff"/>')
out.append(f'<text x="40" y="54" font-size="32" font-weight="800">Halo gen 2 · {VER} · ledningsdiagram</text>')
out.append('<text x="40" y="84" font-size="17" fill="#444">Kun købedele, ingen lodning: skrueklemmer, Wago 221-41x og klikstik. Ledningstyller på alle fintrådede ledninger, der går i en skrueklemme.</text>')

# 24 V in, left column
box(40, 140, 270, 100, "Strømforsyning", "Mean Well GST90A24|24 V, lige stik nedefra")
box(40, 290, 270, 100, "Hunstik 5,5/2,5", "TRU DC-13F, i røret i bunden|skrueklemmer + og −")
box(40, 450, 270, 80, "Sikring 3 A", "fladsikring ATO (violet), kun på +")
wire([(175, 240), (175, 290)], C["v24"], 6); lab(185, 270, "24 V", C["v24"])
w1 = wago(560, 150, 3, "W1 · 24 V + ", C["v24"])
w2 = wago(560, 430, 5, "W2 · GND ", C["gnd"], (550, 480, "end"))
wire([(120, 390), (120, 450)], C["v24"]); lab(130, 425, "+", C["v24"])
wire([(120, 530), (120, 600), (420, 600), (420, w1[0]), (560, w1[0])], C["v24"]); lab(430, w1[0]-6, "P1 · fra sikring", C["v24"])
wire([(250, 390), (250, 420), (460, 420), (460, w2[0]), (560, w2[0])], C["gnd"]); lab(470, w2[0]-6, "P2 · fra hunstik −")
lab(40, 640, "Strøm: 1,0 mm² silikone", "#444")

# RSD
box(840, 130, 300, 210, "5 V-forsyning", "Mean Well RSD-60G-5|24 V → 5 V, 12 A|ind (venstre) · ud (højre)|isoleret: −V skal bindes|til GND (bro W4 → W2)")
wire([(618, w1[1]), (840, w1[1])], C["v24"]); lab(830, w1[1]-6, "P3 · Vin+", C["v24"], "end")
wire([(618, w2[1]), (800, w2[1]), (800, 310), (840, 310)], C["gnd"]); lab(830, 304, "P4 · Vin−", "#222", "end")
w3 = wago(1230, 150, 4, "W3 · 5 V + ", C["v5"])
w4 = wago(1230, 370, 5, "W4 · 5 V GND ", C["gnd"])
wire([(1140, 180), (1180, 180), (1180, w3[0]), (1230, w3[0])], C["v5"]); lab(1150, 172, "+V · P5", C["v5"])
wire([(1140, 250), (1200, 250), (1200, w4[0]), (1230, w4[0])], C["gnd"]); lab(1150, 242, "−V · P6", "#222")

# Pi
box(1440, 150, 320, 300, "Raspberry Pi 5", "USB-C: Joy-IT K-1474 (5 A),|klippet til ca. 20 cm|config.txt:|usb_max_current_enable=1|PWM: dtoverlay=pwm-2chan|(sættes af box/system)")
wire([(1288, w3[1]), (1440, w3[1])], C["v5"]); lab(1300, w3[1]-6, "P12 · USB-C rød", C["v5"])
wire([(1288, w4[1]), (1440, w4[1])], C["gnd"]); lab(1300, w4[1]-6, "P12 · USB-C sort")

# Gledopto + RGB
box(1440, 560, 320, 150, "RGB-styring", "Gledopto GL-C-016WL-D|forsynes med 5 V, ALDRIG 24 V|giver kun data til strippen:|OUTPUT V+ og GND bruges ikke", fill="#fff4e6")
wire([(1288, w3[2]), (1320, w3[2]), (1320, 600), (1440, 600)], C["v5"]); lab(1430, 594, "P13 · V+", C["v5"], "end")
wire([(1288, w4[2]), (1340, w4[2]), (1340, 650), (1440, 650)], C["gnd"]); lab(1430, 644, "P14 · V−", "#222", "end")
# v24 (26 Oct 2026, first assembly): the strip takes its power straight from W3/W4; the controller only drives DATA (GPIO16)
box(1440, 860, 320, 100, "RGB-strip 5 V", "WS2812b COB 5 mm, MiniClip i IN-enden|strømloft 2 A (2000 mA) i WLED", fill="#f3e8ff")
wire([(1288, w3[3]), (1400, w3[3]), (1400, 790), (1500, 790), (1500, 860)], C["v5"]); lab(1492, 820, "S1 · 5 V fra W3", C["v5"], "end")
wire([(1600, 710), (1600, 860)], C["data"]); lab(1608, 790, "S3 · DATA (GPIO16)", C["data"])
wire([(1288, w4[4]), (1380, w4[4]), (1380, 840), (1700, 840), (1700, 860)], C["gnd"]); lab(1708, 832, "S2 · GND")
lab(1600, 990, "RGB: strippens egne ledninger direkte i W3/W4", "#444", "middle")
# control: a short USB-A to USB-C cable from the Pi (WLED JSON over serial), so it works without wifi at the venue
wire([(1745, 450), (1745, 560)], C["sig"], 3); lab(1735, 520, "U1 · USB-A → USB-C", C["sig"], "end"); lab(1735, 540, "styring (serial)", C["sig"], "end")

# bridge W4 -> W2
wire([(1288, w4[3]), (1300, w4[3]), (1300, 520), (700, 520), (700, w2[3]), (618, w2[3])], C["gnd"]); lab(720, 512, "P7 · bro W4 → W2: fælles GND til dæmperens styresignal")

# dimmer
box(840, 640, 300, 160, "Dæmper hvidt lys", "DFRobot DFR0457|3 skrueklemmer: VIN, GND, VOUT|VOUT = dæmpet + til strips|styring: 3-polet stik (signal, VCC, GND)")
wire([(618, w1[2]), (660, w1[2]), (660, 680), (840, 680)], C["v24"]); lab(830, 674, "P9 · VIN", C["v24"], "end")
wire([(618, w2[2]), (680, w2[2]), (680, 720), (840, 720)], C["gnd"]); lab(830, 714, "P10 · GND", "#222", "end")
wire([(1440, 300), (1170, 300), (1170, 700), (1140, 700)], C["sig"], 3)
wire([(1440, 330), (1185, 330), (1185, 760), (1140, 760)], C["sig"], 3)
lab(1195, 700, "grøn → GPIO18 (ben 12), 20 kHz", C["sig"]); lab(1195, 760, "rød → 3V3 (ben 1) · sort → GND (ben 14)", C["sig"])
lab(1195, 782, "G1: 3 ledere, 40 cm, hver crimp for sig på sit ben", C["sig"])
w6 = wago(960, 880, 3, "W6 · hvid + (dæmpet) ", C["sw"], (1030, 905, "start"))
wire([(990, 800), (990, 860), (940, 860), (940, w6[0]), (960, w6[0])], C["sw"]); lab(1000, 845, "P11 · VOUT", "#555")
w5 = wago(700, 880, 3, "W5 · hvid − ", C["gnd"])
wire([(618, w2[4]), (640, w2[4]), (640, 860), (680, 860), (680, w5[0]), (700, w5[0])], C["gnd"]); lab(650, 850, "P8 · fra W2", "#222")
box(1100, 1040, 300, 190, "Hvid strip 1 og 2", "Ledproff COB Ra95 24 V, 8 mm|klikstik, 0,35 mm²|(v24: kun 2, ingen strip|i reflektoren)", fill="#fffbe6")
wire([(1018, w6[1]), (1180, w6[1]), (1180, 1040)], C["sw"]); lab(1190, w6[1]-6, "S4 · strip 1 +", "#555")
wire([(1018, w6[2]), (1140, w6[2]), (1140, 1040)], C["sw"]); lab(1150, w6[2]+18, "S6 · strip 2 +", "#555")
wire([(758, w5[1]), (800, w5[1]), (800, 1080), (1100, 1080)], C["gnd"]); lab(810, 1074, "S5 · strip 1 −", "#222")
wire([(758, w5[2]), (780, w5[2]), (780, 1180), (1100, 1180)], C["gnd"]); lab(790, 1174, "S7 · strip 2 −", "#222")

# legend + notes
for i, t in enumerate(["W1 24 V +: 221-413", "W2 GND: 221-415", "W3 5 V +: 221-414", "W4 5 V GND: 221-415", "W5 hvid −: 221-413", "W6 hvid + dæmpet: 221-413"]):
    lab(40, 980 + i*22, t, "#333", size=15)
lx, ly = 40, 740
for i, (k, t) in enumerate([("v24", "24 V"), ("v5", "5 V"), ("gnd", "GND (fælles)"), ("sw", "hvid strip +, dæmpet (VOUT)"), ("sig", "styresignal fra Pi"), ("data", "data til RGB")]):
    out.append(f'<line x1="{lx}" y1="{ly+i*32}" x2="{lx+46}" y2="{ly+i*32}" stroke="{C[k]}" stroke-width="6"/><text x="{lx+58}" y="{ly+i*32+5}" font-size="16">{t}</text>')
# v29: every cable has an id (P = power, S = strip, U = USB, G = GPIO, A = audio, F = flat); route and length are in the
# ledningsplan (render/drawing/draw_v29_ledningsplan.py from render/harness_gen2.py)
box(1440, 1030, 330, 250, "Data fra Pi'en", "U1 USB-A → RGB-styring (USB-C)|U2 USB-A → mikrofon-kerne (USB-C)|U3 USB-A → 4G (tilvalg) · alle 90° stik|G2 ben 13 · 17 · 20 → reed (tilvalg)|G3 ben 3 · 4 · 5 · 7 · 9 → stødsensor (tilvalg)|G4 ben 2 · 6 → skærmens strøm|F1 kamera · F2 skærm · F3 mikrofoner: flade|A1 højttaler → mikrofon-kerne", fill="#e7f5ff")
for i, t in enumerate(["Kabel-id'erne (P, S, U, G, A, F) er de samme som i ledningsplanen, hvor rute, bane og længde står.",
                       "Skærmen får strøm fra Pi'ens ben 2 (5 V, yderst i hjørnet) og 6 (GND) med sit eget kabel (G4).",
                       "Mærkningen på dæmperen og styringen gælder: tjek den, før der tændes."]):
    lab(40, 1285 + i*22, t, "#444", size=15)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Inter, Helvetica, Arial, sans-serif">' + "".join(out) + "</svg>"
open(sys.argv[1], "w").write(svg)
