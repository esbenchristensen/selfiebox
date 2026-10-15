#!/usr/bin/env python3
"""Indkøbsliste (BOM) for Halo selfieboksen -> hardware/bom/indkobsliste.csv

Filamentforbrug regnes ud fra STL-filerne (vægge 1,6 mm + 15 % infill, +10 % spild).
Priserne er i DKK inkl. moms. "Status" siger om prisen er fundet hos en forhandler
eller er et estimat. Alle priser skal tjekkes ved bestilling.

Kun sektionen "Hovedenhed" indgår i hovedprisen. Tilbehør, temadele og værktøj står
med egne summer.

Kør:  python3 hardware/tools/make_bom.py
"""
import csv
from pathlib import Path

import trimesh

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT.parent
OUT = ROOT / "bom" / "indkobsliste.csv"

EUR, GBP = 7.46, 8.6          # kurs brugt til omregning af udenlandske priser
WALL_MM, INFILL, WASTE = 1.6, 0.15, 1.10
DENS = {"ASA": 1.07, "PETG": 1.27}

# filament: navn -> (materiale, pris pr. 1 kg spole, leverandør, status, kilde)
FIL = {
    "ASA sort":              ("ASA", 300, "Bambu Lab EU-shop / prisjagt.dk", "Fundet", "prisjagt.dk: Bambu ASA fra 295-305 kr"),
    "PETG HF sort":          ("PETG", 199, "Bambu Lab EU-shop", "Estimat", "makerpoint.nl: PETG HF 23,38 EUR = 174 kr + fragt"),
    "PETG translucent":      ("PETG", 199, "Bambu Lab EU-shop", "Estimat", "Bambu PETG Translucent"),
    "PETG HF farve":         ("PETG", 199, "Bambu Lab EU-shop", "Estimat", "makerpoint.nl: PETG HF 23,38 EUR = 174 kr + fragt"),
    "PETG fluorescerende":   ("PETG", 229, "3DJake.dk", "Estimat", "UV-reaktiv PETG (fx Extrudr/Geeetech)"),
}


def grams(stl, material):
    m = trimesh.load(stl)
    v, a = m.volume / 1000, m.area / 100                    # cm3, cm2
    shell = min(v, a * WALL_MM / 10)
    return (shell + (v - shell) * INFILL) * DENS[material] * WASTE


def g(name, material="ASA"):
    return grams(ROOT / "stl" / f"{name}.stl", material)


def theme_g(theme, part, colour):
    p = REPO / "themes" / theme / "build" / f"{part}__{colour}.stl"
    return grams(p, "PETG") if p.exists() else 0.0


rows = []


def add(section, item, spec, qty, unit, unit_price, buy_qty, supplier, status, source, in_main):
    """qty = forbrug pr. boks (i 'unit'); buy_qty = antal købsenheder ved første indkøb."""
    rows.append(dict(section=section, item=item, spec=spec, qty=qty, unit=unit, unit_price=unit_price,
                     per_box=unit_price * qty, buy_qty=buy_qty, buy_total=unit_price * buy_qty if buy_qty else 0,
                     supplier=supplier, status=status, source=source, in_main=in_main))


def add_fil(section, item, fil, grams_used, note, in_main):
    mat, price, sup, st, src = FIL[fil]
    kg = grams_used / 1000
    rows.append(dict(section=section, item=f"Filament: {fil}", spec=f"{item} - ca. {grams_used:.0f} g. {note}",
                     qty=round(kg, 3), unit="kg", unit_price=price, per_box=price * kg, buy_qty=0, buy_total=0,
                     supplier=sup, status=st, source=src, in_main=in_main))


def spool(section, fil, n, in_main):
    mat, price, sup, st, src = FIL[fil]
    rows.append(dict(section=section, item=f"Spole: {fil} 1 kg", spec="Indkøb af hele spoler (forbrug står ovenfor)",
                     qty=0, unit="spole", unit_price=price, per_box=0, buy_qty=n, buy_total=price * n,
                     supplier=sup, status=st, source=src, in_main=in_main))


# ============================================================ HOVEDENHED ===
S = "Hovedenhed"
add(S, "Raspberry Pi 5 4 GB", "SC1111", 1, "stk", 859, 1, "Dustin.dk", "Fundet", "dustin.dk 859 kr (pricerunner viser 529-1299 kr)", True)
add(S, "Raspberry Pi Active Cooler", "Officiel køler til Pi 5", 1, "stk", round(7.89 * EUR), 1, "RaspberryPi.dk", "Fundet", "raspberrypi.dk 7,89 EUR", True)
add(S, "Raspberry Pi Touch Display 2 - 10\"", "1200x1920, kapacitiv touch, inkl. kabel og M2.5 stand-offs", 1, "stk", round(93.50 * EUR), 1, "RaspberryPi.dk", "Fundet", "raspberrypi.dk 93,50 EUR", True)
add(S, "Raspberry Pi Camera Module 3 Wide", "12 MP, 120 grader, SKU 9869", 1, "stk", 349, 1, "RaspberryPi.dk", "Fundet", "raspberrypi.dk 349 kr", True)
add(S, "Kamerakabel til Pi 5, 300 mm", "22-pin mini til 15-pin standard (kræves til Pi 5)", 1, "stk", 39, 1, "RaspberryPi.dk", "Estimat", "", True)
add(S, "microSD 64 GB A2", "Raspberry Pi SD-kort eller SanDisk Extreme", 1, "stk", 99, 1, "RaspberryPi.dk / Proshop", "Estimat", "", True)
add(S, "Strømforsyning Mean Well GST90A12-P1M", "12 V 6,67 A 80 W bordmodel, 5,5/2,5 mm stik", 1, "stk", round(35.81 * 1.25 * EUR), 1, "Bürklin / Elfa Distrelec", "Fundet", "buerklin.com 35,81 EUR ekskl. moms", True)
add(S, "EU-netkabel C14 (IEC C13)", "1,8 m til GST90A", 1, "stk", 39, 1, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "DC-panelbøsning 5,5 x 2,5 mm", "Til panelmontering, 8 mm hul", 1, "stk", 19, 1, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "Pololu D36V50F5", "5 V 5,5 A step-down (1 til Pi + skærm, 1 til LED)", 2, "stk", round(26.88 * GBP), 2, "Pololu-forhandler (Botland/Elecena)", "Fundet", "elecena.pl 26,88 GBP (nov. 2025)", True)
add(S, "Logic level MOSFET-modul", "IRLZ44N/AOD4184 til dæmpning af COB 12 V", 1, "stk", 25, 1, "Let Elektronik / AliExpress", "Estimat", "", True)
add(S, "74AHCT125 niveauskifter", "3,3 V -> 5 V data til SK6812", 1, "stk", 15, 1, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "Perfboard 70 x 50 mm", "Hulprint til fordelingskort", 1, "stk", 12, 1, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "Sikringsholder + 5 A flad-sikring", "Mini-blade inline", 1, "sæt", 25, 1, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "Skrueterminaler 5 mm", "2-polet, 6 stk", 6, "stk", 3, 6, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "Elektrolytkondensator 1000 uF 16 V + modstand 330 ohm", "Til LED-strømmen og datalinjen", 1, "sæt", 8, 1, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "USB-C pigtail 5 V til Pi 5", "USB-C hanstik med løse ledninger, 20 cm", 1, "stk", 39, 1, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "SK6812 RGBW LED-strip 5 V, 60 LED/m, 10 mm, IP30", "Ring 35 LED + glødestriber 26 LED = 61 LED (ca. 1,05 m)", 1.05, "m", round(14.40 * GBP), 2, "The Pi Hut / AliExpress", "Fundet", "thepihut.com 14,40 GBP pr. m", True)
add(S, "COB LED-strip 12 V, 4000 K, CRI 90+, 8 mm", "Fotolys i ringen, ca. 0,71 m pr. boks", 0.71, "m", 50, 5, "LED-butik / Amazon.de (5 m rulle ca. 250 kr)", "Estimat", "", True)
add(S, "Silikoneledning 18 AWG rød/sort", "12 V og 5 V forsyning, ca. 2 m", 2, "m", 10, 10, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "Silikoneledning 22 AWG 3 farver", "LED-data og -strøm, ca. 3 m", 3, "m", 6, 10, "Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "JST-SM 3-pin stik (han/hun)", "Udskiftelige LED-forbindelser", 6, "par", 5, 10, "AliExpress / Elektronik-lavpris.dk", "Estimat", "", True)
add(S, "Krympeflex-sortiment", "", 0.1, "sæt", 69, 1, "Biltema / Jem & Fix", "Estimat", "", True)
add(S, "Strips (kabelbindere) 100 mm", "", 10, "stk", 0.3, 100, "Biltema", "Estimat", "", True)
add(S, "EVA-skum 1 mm selvklæbende, A4", "Pads på tværbjælker og ring om glasset", 0.25, "ark", 39, 2, "Panduro / Amazon.de", "Estimat", "", True)
add(S, "Messing-gevindindsats M3 (Elextra H44350 / ruthex)", "Ø4,5 x 5,9 i hul Ø4,0 x 6,4. 4 i front-blokke + 2 i kabinettets bundsamling", 6, "stk", 0.75, 100, "Elextra.dk / 3DJake.dk", "Fundet", "3djake: ruthex 8,70 CHF / 100 stk", True)
add(S, "Messing-gevindindsats M4", "Hul Ø5,6 x 8,2. 4 VESA i kabinet + 1 lås i vægbeslag", 5, "stk", 1.5, 50, "Elextra.dk / 3DJake.dk", "Estimat", "", True)
add(S, "Gevindindsats 1/4\"-20", "Stativgevind i bunden", 1, "stk", 6, 10, "3DJake.dk / Amazon.de", "Estimat", "", True)
add(S, "Skrue M3 x 8 Torx linsehoved (ISO 7380), sort", "Kabinet til front, 2 pr. side", 4, "stk", 1, 100, "Skruer.dk / Jem & Fix", "Estimat", "", True)
add(S, "Skrue M2 x 6 gevinddannende (plast)", "Kamera", 4, "stk", 0.8, 100, "Skruer.dk / AliExpress", "Estimat", "", True)
add(S, "Skrue M2,5 x 6 gevinddannende (plast)", "LED-skinne", 4, "stk", 0.8, 100, "Skruer.dk / AliExpress", "Estimat", "", True)
add(S, "Skrue M4 x 10 Torx", "Låseskrue vægbeslag", 1, "stk", 1, 50, "Skruer.dk", "Estimat", "", True)
add(S, "Vægskrue 4,5 x 50 undersænket + dybel", "Vægbeslag til væg (4 huller Ø5, undersænket)", 4, "stk", 1.5, 50, "Jem & Fix / Bauhaus", "Estimat", "", True)
add(S, "Styrestift Ø6 x 20 stål", "Til samlinger mellem moduler (2 pr. samling)", 0, "stk", 1.5, 20, "Skruer.dk / AliExpress", "Estimat", "Købes med det samme, så de er klar til tilbehør", True)
add(S, "Skrue M3 x 16 Torx linsehoved", "Til samlinger mellem moduler (2 pr. samling)", 0, "stk", 1, 100, "Skruer.dk", "Estimat", "", True)
add(S, "Sekundlim (CA) gel", "Sikrer diffuserringen i slidserne", 0.05, "tube", 39, 1, "Jem & Fix", "Estimat", "", True)
add(S, "Varmeledende/isolerende kapton-tape", "Isolering under perfboard og ved lodninger", 0.05, "rulle", 59, 1, "Let Elektronik", "Estimat", "", True)
add_fil(S, "Bezel + LED-skinne + kabinet + vægbeslag", "ASA sort",
        g("bezel") + g("led_rail") + g("shell_closed_top") * 0.86 + g("wall_cleat"), "Kabinet med lukket top.", True)
add_fil(S, "Diffuserring + glødestribe i kabinet", "PETG translucent",
        g("diffuser_ring", "PETG") + g("shell_closed_top", "PETG") * 0.14, "Stribe = lag 34-44 mm i kabinettet.", True)
spool(S, "ASA sort", 1, True)
spool(S, "PETG translucent", 1, True)

# ============================================================ TILBEHØR ===
A = "Tilbehør: Fotomodul (Instax Square Link)"
add(A, "Fujifilm Instax Square Link", "Farvefotos på instax SQUARE-film 62 x 62 mm, Bluetooth, 105 x 37,5 x 127,5 mm", 1, "stk", 897, 1, "Proshop.dk / Elgiganten.dk", "Fundet", "PriceRunner DK 897 kr (Ash White)", False)
add(A, "Instax SQUARE film, 20 billeder", "Forbrug: ca. 7,40 kr pr. foto", 1, "pakke", 148, 1, "Proshop.dk / Fotoudstyr.dk", "Fundet", "PriceRunner DK 148 kr / 20 stk", False)
add(A, "USB-A til USB-C kabel 0,3 m", "Pi'en holder printeren opladet", 1, "stk", 39, 1, "Proshop.dk", "Estimat", "", False)
add(A, "EVA 1 mm til printerbåsen", "Strimmel på bagvæggen", 0.05, "ark", 39, 0, "(fra hovedenhedens ark)", "Estimat", "", False)
add(A, "Samlesæt: 2 x M3 x 16 + 2 styrestifter Ø6 x 20", "Samlestykke til boksen", 1, "sæt", 6, 0, "(fra pakker)", "Estimat", "", False)
add(A, "Skrue M3 x 8 Torx + M3-indsatser", "Fotomodul-front: 4 skruer, 4 indsatser", 4, "stk", 1.75, 0, "(fra hovedenhedens pakker)", "Estimat", "", False)
add_fil(A, "Fotomodul-front + fotomodul-kabinet + samlestykke", "ASA sort",
        g("instax_front") + g("instax_shell") + g("joint_spacer"), "Kabinettet har translucent stribe som boksen.", False)

T = "Tilbehør: Tag (festival)"
add(T, "Samlesæt: 2 x M3 x 16 + 2 styrestifter + 2 M3-indsatser", "Samlestykke til boksen", 1, "sæt", 7.5, 0, "(fra pakker)", "Estimat", "", False)
add_fil(T, "Tag + samlestykke", "ASA sort", g("roof") + g("joint_spacer"), "ASA tåler sol og regn.", False)

X = "Tilbehør: Ekstra filament"
spool(X, "ASA sort", 1, False)
rows[-1]["spec"] = "Fotomodul og tag bruger ca. 0,9 kg ASA ud over hovedenhedens spole"

# ============================================================ TEMADELE ===
for theme, title, fil_col, colours in [("sommernat", "Sommernat", "PETG HF farve", ["forest", "leaf", "lilac", "coral", "cream"]),
                                        ("neon", "Neon Club", "PETG fluorescerende", ["magenta", "cyan", "lime"])]:
    S2 = f"Tema: {title}"
    parts = [p for p in ["wing_left", "wing_right", "topper", "printer_front"]
             if (REPO / "themes" / theme / "build" / f"{p}__base.stl").exists()]
    base = sum(theme_g(theme, p, "base") for p in parts)
    inlay = sum(theme_g(theme, p, c) for p in parts for c in colours)
    purge = 25 * len(parts)                                   # skylning ved farveskift (H2C), estimat
    add_fil(S2, "Vinger, topper og fronter, sort del", "PETG HF sort", base, f"Dele: {', '.join(parts)}.", False)
    add_fil(S2, f"Farve-inlays ({', '.join(colours)})", fil_col, inlay + purge, f"Inkl. ca. {purge} g skylning ved farveskift.", False)
    spool(S2, "PETG HF sort", 1, False)
    rows[-1]["spec"] = "Temadele printes helt i PETG (ASA og PETG binder dårligt sammen)"
    for c in colours:
        spool(S2, fil_col, 1, False)
        rows[-1]["item"] = f"Spole: {fil_col} - {c}"
    add(S2, "Skrue M3 x 12 Torx", "Vinger: erstatter de 4 M3 x 8 i siderne (vingens ribbe er 4 mm)", 4, "stk", 1, 0, "(fra pakke)", "Estimat", "", False)
    add(S2, "Samlesæt topper: 2 x M3 x 16 + 2 styrestifter + 2 M3-indsatser + samlestykke", "Topper på øverste samling", 1, "sæt", 7.5, 0, "(fra pakker)", "Estimat", "", False)

# ============================================================ VÆRKTØJ ===
V = "Værktøj (engangskøb, hvis I ikke har det)"
add(V, "Loddekolbe med indsats-spids til gevindindsatser", "Fx Pinecil + ruthex spids", 0, "stk", 449, 1, "3DJake.dk / Let Elektronik", "Estimat", "", False)
add(V, "Loddetin + flux", "", 0, "sæt", 99, 1, "Let Elektronik", "Estimat", "", False)
add(V, "Crimptang til JST", "", 0, "stk", 199, 1, "Amazon.de", "Estimat", "", False)
add(V, "Multimeter (enkelt)", "Kontrol af 5 V/12 V før Pi tilsluttes", 0, "stk", 149, 1, "Biltema / Jem & Fix", "Estimat", "", False)
add(V, "Torx T10/T20 + M2/M2.5 bits", "", 0, "sæt", 129, 1, "Jem & Fix", "Estimat", "", False)
add(V, "Bambu Textured PEI-plade (ekstra)", "Glat matteret front", 0, "stk", 299, 1, "Bambu Lab EU-shop", "Estimat", "", False)


def kr(x):
    return f"{x:.2f}".replace(".", ",")


def write():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    head = ["Sektion", "Vare", "Specifikation / brug", "Forbrug pr. boks", "Enhed", "Pris pr. enhed (kr)",
            "Pris pr. boks (kr)", "Antal at købe (første boks)", "Indkøb i alt (kr)", "I hovedpris",
            "Leverandør (DK hvor muligt)", "Pris-status", "Kilde / note"]
    sums = {}
    with OUT.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(head)
        last = None
        for r in rows:
            if last and r["section"] != last:
                w.writerow([last, "SUM " + last, "", "", "", "", kr(sums[last][0]), "", kr(sums[last][1]), "", "", "", ""])
                w.writerow([])
            last = r["section"]
            s = sums.setdefault(last, [0.0, 0.0])
            s[0] += r["per_box"]; s[1] += r["buy_total"]
            w.writerow([r["section"], r["item"], r["spec"], str(r["qty"]).replace(".", ","), r["unit"], kr(r["unit_price"]),
                        kr(r["per_box"]), r["buy_qty"] or "", kr(r["buy_total"]) if r["buy_total"] else "",
                        "Ja" if r["in_main"] else "Nej", r["supplier"], r["status"], r["source"]])
        w.writerow([last, "SUM " + last, "", "", "", "", kr(sums[last][0]), "", kr(sums[last][1]), "", "", "", ""])
        w.writerow([])
        main = sums["Hovedenhed"]
        acc = [k for k in sums if k.startswith("Tilbehør")]
        w.writerow(["TOTAL", "HOVEDPRIS: hovedenhed pr. boks (forbrug)", "", "", "", "", kr(main[0]), "", "", "Ja", "", "", ""])
        w.writerow(["TOTAL", "HOVEDPRIS: første indkøb (hele pakker og spoler)", "", "", "", "", "", "", kr(main[1]), "Ja", "", "", ""])
        w.writerow(["TOTAL", "Alt tilbehør pr. boks (ikke i hovedpris)", "", "", "", "", kr(sum(sums[k][0] for k in acc)), "",
                    kr(sum(sums[k][1] for k in acc)), "Nej", "", "", ""])
        for k in sums:
            if k.startswith("Tema") or k.startswith("Værktøj"):
                w.writerow(["TOTAL", f"{k} (ikke i hovedpris)", "", "", "", "", kr(sums[k][0]), "", kr(sums[k][1]), "Nej", "", "", ""])
    return sums


if __name__ == "__main__":
    sums = write()
    import json
    with OUT.open(encoding="utf-8-sig") as f:
        (ROOT / "docs" / "pack" / "bom.json").write_text(json.dumps(list(csv.reader(f, delimiter=";")), ensure_ascii=False))
    for k, (a, b) in sums.items():
        print(f"{k:45s} pr. boks {a:8.0f} kr   første indkøb {b:8.0f} kr")
    print("->", OUT.relative_to(REPO))
