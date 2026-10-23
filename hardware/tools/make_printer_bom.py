#!/usr/bin/env python3
"""Shopping list for the Selfi printer as an xlsx: bought parts with prices, what each is for and whether it can be left
out, and the printed parts with their ASA weight (the printing partner buys the filament himself).

Usage: python3 hardware/tools/make_printer_bom.py <out.xlsx> [version]     (version: selfi-printer-v1, -v2 or -v3, default v3)
Prices are DKK incl. VAT and estimates ("skøn") until a Danish or EU dealer has quoted them.
"""
import sys

from openpyxl import Workbook
from openpyxl.styles import Font

OUT = sys.argv[1]
VER = sys.argv[2] if len(sys.argv) > 2 else "selfi-printer-v3"
ASA_KR_G = 0.25   # kr per gram ASA (1 kg spool ca. 250 kr)

# part, use, grams ASA (as sliced: walls 3.2 solid, infill as in the guide), colour
PRINTED = [
    ("Kappe (B2C) eller kappe med låsehul (B2B)", "Alle", 900, "sort ASA"),
    ("Logo, hvide dele + grønne prikker (indlagt i kappen)", "Alle", 3, "hvid + grøn ASA"),
    ("Sokkel", "Alle", 420, "sort ASA"),
    ("Opsamlingsbakke", "Alle", 60, "sort ASA"),
    ("Vægkonsol", "B2B væg", 700, "sort ASA"),
    ("Vægplade", "B2B væg", 220, "sort ASA"),
]

# part, use, qty, price each (kr), shop / note
BOUGHT = [
    ("DNP DP-QW410 fotoprinter (dye-sub, 300 dpi)", "Alle", 1, 7000, "Skøn; DNP-forhandler i EU (fx Foto-forhandler / Westfoto). Mål printeren før kabinettet printes"),
    ("DNP QW410 medie 4×6, 2 ruller (300 print)", "Alle", 1, 650, "Skøn; til polaroid-look 4×6 og 4×4"),
    ("DNP QW410 medie 4×6 med perforering i midten (300 print = 600 striber)", "Alle", 1, 900, "Skøn; til fotostriber 2×6, kræver firmware v1.10 + ny driver. Bekræft at den sælges i EU"),
    ("Raspberry Pi Zero 2 W", "Alle", 1, 140, "raspberrypi.dk / Pimoroni"),
    ("microSD 32 GB (A1)", "Alle", 1, 60, ""),
    ("USB-kabel micro-USB (OTG) → USB-B vinklet, 30 cm", "Alle", 1, 50, "Pi Zero (USB) → printerens USB-B; vinklet stik, bagrummet er 40 mm"),
    ("USB-kabel USB-A → micro-USB, 20 cm", "Alle", 1, 30, "Printerens 5 V 2 A-udgang → Pi Zero (PWR-stik); ingen ekstra forsyning"),
    ("Panelkabel C14 snap-in → C13 vinklet, 30 cm", "Alle", 1, 60, "Strømindgang i soklen → printerens C14-stik bagpå"),
    ("Strømkabel Schuko → C13, 2 m", "Alle", 1, 40, "Det eneste kabel kunden sætter i"),
    ("Gummifødder Ø12 × 1 mm, selvklæbende", "Alle", 4, 5, "I fordybningerne under soklen"),
    ("Skabslås / kamlås Ø19, cylinder til plade op til 12 mm, med kam", "B2B", 1, 60, "Samme nøgle til alle steder"),
    ("SPUN+ Climate 4,0 × 30, undersænket", "B2B", 2, 2, "Sokkel → hylde eller konsol"),
    ("Skrue 5 × 50 + Fischer DuoPower 8 × 40", "B2B væg", 4, 4, "Vægplade → væg (stedet monterer selv)"),
    ("Låseskrue DIN 7982 pin-Torx 4,2 × 25", "B2B væg", 1, 3, "Konsol → vægplade (som gen 2)"),
]


# v2 (vandal-proof, one hood for B2C and B2B): part, use, grams ASA (as sliced: 3.2 walls, 15-40 % infill), colour
PRINTED_V2 = [
    ("Kappe med låsehul (sadeltag, lameller)", "Alle", 810, "sort ASA"),
    ("Logo, hvide dele + grønne prikker (indlagt i kappen)", "Alle", 3, "hvid + grøn ASA"),
    ("Sokkel under printeren", "Alle", 480, "sort ASA"),
    ("Udgangsmodul (papirrum, rutsjebane, lomme, skærm, LED-skinne)", "Alle", 950, "sort ASA"),
]
# part, use, qty, price each (kr), shop / note, can it be left out?
BOUGHT_V2 = [
    ("DNP DP-QW410 fotoprinter (dye-sub, 300 dpi)", "Alle", 1, 7000, "Skøn; DNP-forhandler i EU. Mål printeren før kabinettet printes", "Nej"),
    ("DNP QW410 medie 4×6, 2 ruller (300 print)", "Alle", 1, 650, "Skøn; polaroid-look 4×6 og 4×4", "Nej (eller den perforerede)"),
    ("DNP QW410 medie 4×6 med perforering i midten (600 striber)", "Alle", 1, 900, "Skøn; fotostriber 2×6, firmware v1.10. Bekræft at den sælges i EU", "Ja, hvis der kun printes 4×6/4×4"),
    ("Raspberry Pi Zero 2 W", "Alle", 1, 140, "raspberrypi.dk", "Nej: gør printeren trådløs og styrer LED'en"),
    ("microSD 32 GB (A1)", "Alle", 1, 60, "raspberrypi.dk", "Nej"),
    ("USB-kabel micro-USB (OTG) → USB-B vinklet, 30 cm", "Alle", 1, 50, "Pi Zero (USB) → printerens USB-B; vinklet stik, bagrummet er 40 mm", "Nej"),
    ("USB-kabel USB-A → micro-USB, 20 cm", "Alle", 1, 30, "Printerens 5 V 2 A-udgang → Pi Zero (PWR); ingen ekstra forsyning", "Nej"),
    ("Panelkabel C14 snap-in → C13 vinklet, 30 cm", "Alle", 1, 60, "Strømindgang i soklen → printerens C14 bagpå", "Nej"),
    ("Strømkabel Schuko → C13, 2 m", "Alle", 1, 40, "Det eneste kabel kunden sætter i", "Nej"),
    ("WS2812B RGB-LED-strip 5 V, 60 LED/m, 10 mm, 1 m, JST-SM-stik", "Alle", 1, 90, "tinytronics.nl (11,50 €, på lager, med JST-SM-kabel). Klippes til 9 LED (15 cm) i den frie ende: intet loddes", "Ja: så lyser lommen ikke"),
    ("JST-SM 3-pin hun → 3 × Dupont hun, 20 cm", "Alle", 1, 15, "tinytronics.nl; strip → Pi'ens stiftliste (5 V, GND, GPIO18)", "Ja, med LED'en"),
    ("Pi Zero 2 W med stiftliste (WH) i stedet for uden", "Alle", 1, 30, "Merpris for loddet header, så Dupont-stikkene kan sættes på", "Ja, med LED'en"),
    ("Kamlås Euro-Locks Ø19, 32 mm, med 2 nøgler (RS 195-9616)", "Alle", 1, 90, "dk.rs-online.com; samme nøgle til alle printere ved bestilling i sæt", "Nej: holder kappen låst"),
    ("Gummifødder Ø12 × 1 mm, selvklæbende", "Alle", 6, 5, "4 under soklen, 2 under udgangsmodulet", "Nej (bord)"),
    ("Skrue til plast 3,5 × 10, undersænket (fx Spax)", "Alle", 2, 2, "Sokkel → udgangsmodulets tunge", "Nej"),
    ("SPUN+ Climate 4,0 × 30, undersænket", "B2B", 2, 2, "Sokkel → bord eller hylde (under printeren)", "Ja i B2C"),
]

# v3: flat top, "Dit print", foam tape in grooves, mains cable in through the base (no inlet), B2B wall consoles
PRINTED_V3 = [
    ("Kappe med låsehul (flad top, lameller)", "Alle", 750, "sort ASA"),
    ("Logo, hvide dele + grønne prikker (indlagt i kappen)", "Alle", 3, "hvid + grøn ASA"),
    ("\"Dit print\" + pil (indlagt i udgangsmodulet)", "Alle", 2, "hvid + grøn ASA"),
    ("Sokkel under printeren (kabelspor, rille til tætningsbånd)", "Alle", 475, "sort ASA"),
    ("Udgangsmodul (papirrum, rutsjebane, lomme, skærm, LED-skinne)", "Alle", 905, "sort ASA"),
    ("2 vægkonsoller", "B2B væg", 1300, "sort ASA"),
    ("2 vægskinner", "B2B væg", 300, "sort ASA"),
]
BOUGHT_V3 = [b for b in BOUGHT_V2 if not b[0].startswith(("Panelkabel C14", "Strømkabel Schuko"))] + [
    ("Strømkabel Schuko → C13 vinklet, 3 m, sort", "Alle", 1, 60, "Går ind bagfra under soklen og sættes direkte i printeren: intet stik udenpå. Maks. Ø7,5", "Nej"),
    ("Kabelbinder 3,6 × 150, sort", "Alle", 2, 1, "Trækaflastning: om strømkablet og ankeret i bagrummet", "Nej: ellers kan kablet trækkes ud"),
    ("Skumtætningsbånd 3 × 1 mm, selvklæbende (EPDM/PE), 2 m", "Alle", 1, 40, "I rillerne: soklen under kappens væg og rundt om udgangsmodulets studs (ca. 1,5 m)", "Ja, men så er fugerne ikke tætte"),
    ("SPUN+ Climate 4,0 × 20, undersænket", "B2B væg", 2, 2, "Højre konsol → udgangsmodulet (nedefra)", "Ja, hvis den ikke hænger på væg"),
    ("Skrue 5 × 50 + dybel (til væggens materiale)", "B2B væg", 8, 3, "2 vægskinner, 4 hver", "Ja, hvis den ikke hænger på væg"),
    ("Sikkerhedsskrue Torx med pind 4,0 × 25 + bit", "B2B væg", 2, 8, "Konsol → vægskinne, så konsollen ikke kan løftes af", "Ja, hvis den ikke hænger på væg"),
]


def main():
    wb = Workbook()
    ws = wb.active
    ws.title = "Indkøb"
    bold = Font(bold=True)
    ws.append([f"{VER} · indkøbsliste (kr inkl. moms, skøn)"]); ws["A1"].font = Font(bold=True, size=14)
    ws.append([])
    v2 = VER != "selfi-printer-v1"
    v3 = VER == "selfi-printer-v3"
    bought = BOUGHT_V3 if v3 else BOUGHT_V2 if v2 else [b + ("",) for b in BOUGHT]
    printed = PRINTED_V3 if v3 else PRINTED_V2 if v2 else PRINTED
    ws.append(["Købedele", "Bruges til", "Antal", "Pris pr. stk.", "I alt", "Note"] + (["Kan den undværes?"] if v2 else []))
    for c in ws[3]: c.font = bold
    sums = {}
    for name, use, n, kr, note, skip in bought:
        ws.append([name, use, n, kr, n * kr, note] + ([skip] if v2 else []))
        sums[use] = sums.get(use, 0) + n * kr
    ws.append([])
    ws.append(["Printede dele (ASA)", "Bruges til", "Gram", "Kr pr. g", "I alt", "Farve"])
    for c in ws[ws.max_row]: c.font = bold
    for name, use, g, col in printed:
        ws.append([name, use, g, ASA_KR_G, round(g * ASA_KR_G), col])
        sums[use] = sums.get(use, 0) + g * ASA_KR_G
    ws.append([])
    ws.append(["Sum", "", "", "", "", ""]); ws.cell(ws.max_row, 1).font = bold
    base = sums.get("Alle", 0)
    ws.append(["Printer-pakke B2C (bord)", "", "", "", round(base), "inkl. begge ruller"])
    if v2:
        ws.append(["B2B (bord/disk, skruet fast)", "", "", "", round(base + sums.get("B2B", 0)), "+ 2 skruer"])
        if v3:
            ws.append(["B2B væg", "", "", "", round(base + sums.get("B2B", 0) + sums.get("B2B væg", 0)), "+ 2 konsoller, 2 vægskinner og skruer"])
    else:
        ws.append(["B2B hylde/disk", "", "", "", round(base + sums.get("B2B", 0)), "+ lås og 2 skruer"])
        ws.append(["B2B væg", "", "", "", round(base + sums.get("B2B", 0) + sums.get("B2B væg", 0)), "+ konsol, vægplade og skruer"])
    for col, w in zip("ABCDEFG", (62, 12, 8, 12, 10, 70, 34)):
        ws.column_dimensions[col].width = w
    wb.save(OUT)
    print(f"B2C {base:.0f} kr, B2B {base + sums.get('B2B', 0) + sums.get('B2B væg', 0):.0f} kr")


if __name__ == "__main__":
    main()
