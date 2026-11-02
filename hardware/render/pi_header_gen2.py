"""Raspberry Pi 5's 40-polede GPIO-stik for Halo gen 2: hvilket ben hver ledning skal på.

v39 (Esben 1. nov.: "Hvorfor er pins på pi ikke med i ledningsdiagram så man kan se hvor controller pins skal sidde"):
v29-v38 skrev kun benumrene i en tekstboks. Her tegnes stikket ben for ben, som Esben og Claude satte det 26.-27. okt.
(tråden "Midlertidigt ledningsdiagram til samling", efter Esbens billede af den samlede boks): Pi'en med USB-portene opad,
GPIO-stikket i venstre side, ben 1 og 2 nederst (enden længst væk fra USB), lige ben yderst. Kun de 5 ben, der bruges, er
mærket: dæmperen på 1, 12, 14 og skærmen på 2, 6. Bruges af ledningsdiagram_gen2.py og draw_v29_ledningsplan.py.

Kontrolleret mod boksens software (esbenchristensen/selfiebox-platform, box/):
- lys: config.py light_pin = 18 (GPIO18 = ben 12), hardware.py PWM på GPIO18; install.sh sætter
  dtoverlay=pwm-2chan,pin=18,func=2,pin2=19,func2=2, så GPIO19 (ben 35) er også taget af overlayet og må ikke bruges.
- udløserknap: config.py button_pin = 17 (GPIO17 = ben 11). Gen 2 har ingen knap, men lad benet være frit.
- reed (G2) og stødsensor (G3) er tilvalg: softwaren læser dem ikke endnu, og install.sh slår ikke I2C til.
- RGB-styringen (Gledopto) styres over USB (U1). "GPIO16" på den er Gledopto'ens eget ben til strip-data, ikke Pi'ens.

Usage:  python3 hardware/render/pi_header_gen2.py out.svg [halo-gen2-vN]   (standalone tegning)
"""
import sys

NAMES = {1: "3V3", 2: "5V", 3: "GPIO2 SDA", 4: "5V", 5: "GPIO3 SCL", 6: "GND", 7: "GPIO4", 8: "GPIO14 TXD", 9: "GND",
         10: "GPIO15 RXD", 11: "GPIO17", 12: "GPIO18 PWM", 13: "GPIO27", 14: "GND", 15: "GPIO22", 16: "GPIO23", 17: "3V3",
         18: "GPIO24", 19: "GPIO10", 20: "GND", 21: "GPIO9", 22: "GPIO25", 23: "GPIO11", 24: "GPIO8", 25: "GND", 26: "GPIO7",
         27: "ID_SD", 28: "ID_SC", 29: "GPIO5", 30: "GND", 31: "GPIO6", 32: "GPIO12", 33: "GPIO13", 34: "GND", 35: "GPIO19",
         36: "GPIO16", 37: "GPIO26", 38: "GPIO20", 39: "GND", 40: "GPIO21"}
COL = dict(v5="#e67700", v3="#d6336c", gnd="#222222", sig="#1c7ed6", opt="#74c0fc", res="#adb5bd")
# ben: (kabel, hvad, farve). Kablerne er de samme som i harness_gen2.CABLES (G1-G4).
USE = {
    1: ("G1", "dæmper: VCC (rød)", "v3"),
    12: ("G1", "dæmper: signal (grøn)", "sig"),
    14: ("G1", "dæmper: GND (sort)", "gnd"),
    2: ("G4", "skærm + (rød)", "v5"),
    6: ("G4", "skærm − (sort)", "gnd"),
}


def svg(x0, y0, title=True):
    """the header as SVG elements; returns (elements, width, height). Even pins (board edge) left, odd right, pin 1 at the bottom."""
    o, rh, cx = [], 30, x0 + 450
    if title:
        o.append(f'<text x="{x0}" y="{y0+24}" font-size="21" font-weight="700">Raspberry Pi 5: GPIO-stikket, ben for ben</text>')
        o.append(f'<text x="{x0}" y="{y0+48}" font-size="14" fill="#444">Som på dit billede: Pi\'en med USB-portene opad og GPIO-stikket i venstre side.</text>')
        o.append(f'<text x="{x0}" y="{y0+67}" font-size="14" fill="#444">Kun 5 ben bruges. Ben 1 og 2 er nederst, i enden længst væk fra USB. Lige ben yderst mod kanten.</text>')
        y0 += 88
    o.append(f'<text x="{cx+32}" y="{y0+6}" font-size="14" text-anchor="middle" fill="#444">↑ USB-portene</text>')
    y0 += 22
    o.append(f'<rect x="{cx-6}" y="{y0-4}" width="64" height="{20*rh+8}" rx="6" fill="#222"/>')
    for n in range(1, 41):
        r = 19 - (n - 1) // 2
        even = n % 2 == 0
        px, py = cx + (13 if even else 39), y0 + r*rh + rh/2
        u = USE.get(n)
        fill = COL[u[2]] if u else "#e9ecef"
        shape = (f'<rect x="{px-9}" y="{py-9}" width="18" height="18" fill="{fill}" stroke="#fff" stroke-width="1.5"/>' if n == 1
                 else f'<circle cx="{px}" cy="{py}" r="9" fill="{fill}" stroke="#fff" stroke-width="1.5"/>')
        o.append(shape)
        weight = "700" if u else "400"
        ink = "#111" if u else "#999"
        if even:   # number and labels to the left
            o.append(f'<text x="{cx-12}" y="{py+5}" font-size="{15 if u else 13}" text-anchor="end" font-weight="{800 if u else 400}" fill="{"#111" if u else "#999"}">{n}</text>')
            o.append(f'<text x="{cx-42}" y="{py+5}" font-size="14" text-anchor="end" fill="{ink}" font-weight="{weight}">'
                     + (f'{u[1]} · ben {n} · {NAMES[n]}' if u else "") + '</text>')
        else:
            o.append(f'<text x="{cx+64}" y="{py+5}" font-size="{15 if u else 13}" font-weight="{800 if u else 400}" fill="{"#111" if u else "#999"}">{n}</text>')
            o.append(f'<text x="{cx+94}" y="{py+5}" font-size="14" fill="{ink}" font-weight="{weight}">'
                     + (f'{u[1]} · ben {n} · {NAMES[n]}' if u else "") + '</text>')
    y = y0 + 20*rh + 26
    o.append(f'<text x="{cx+32}" y="{y}" font-size="14" text-anchor="middle" fill="#444">ben 1 og 2: enden længst væk fra USB</text>')
    notes = ["G1 dæmperen: hver crimp for sig, grøn på ben 12, rød på ben 1, sort på ben 14. G4 skærmen: ben 2 og 6.",
             "RGB-styringen (Gledopto) bruger ingen Pi-ben; den får USB-kablet (U1). Dens GPIO16 er dens eget ben til stripen.",
             "Tilvalg, ikke tegnet her: reed (G2) og stødsensor (G3). Softwaren læser dem ikke endnu."]
    for i, t in enumerate(notes):
        o.append(f'<text x="{x0}" y="{y+28+i*21}" font-size="14" fill="#333">{t}</text>')
    return o, 990, (y + 28 + len(notes)*21) - (y0 - 22 - (88 if title else 0))


if __name__ == "__main__":
    ver = sys.argv[2] if len(sys.argv) > 2 else ""
    els, w, h = svg(30, 50)
    head = f'<text x="30" y="34" font-size="26" font-weight="800">{ver} · Pi-ben</text>'
    W, H = 1030, h + 80
    open(sys.argv[1], "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" '
                                 f'font-family="Inter, Helvetica, Arial, sans-serif"><rect width="{W}" height="{H}" fill="#fff"/>{head}'
                                 + "".join(els) + "</svg>")
