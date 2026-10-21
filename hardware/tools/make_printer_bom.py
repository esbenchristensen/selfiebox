#!/usr/bin/env python3
"""Shopping list for the Selfi printer (selfi-printer-v1) as an xlsx: printed parts with filament, bought parts with prices.

Usage: python3 hardware/tools/make_printer_bom.py <out.xlsx>
Prices are DKK incl. VAT and estimates ("skøn") until a Danish or EU dealer has quoted them.
"""
import sys

from openpyxl import Workbook
from openpyxl.styles import Font

OUT = sys.argv[1]
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
    ("DNP QW410 medie 4×6 med perforering i midten (300 print = 600 striber)", "Alle", 1, 900, "Skøn; til fotostriber 2×6. Bekræft at den sælges i EU"),
    ("Raspberry Pi Zero 2 W", "Alle", 1, 140, "raspberrypi.dk / Pimoroni"),
    ("microSD 32 GB (A1)", "Alle", 1, 60, ""),
    ("USB-kabel micro-USB (OTG) → USB-B, 30 cm", "Alle", 1, 50, "Pi Zero → printer"),
    ("Mean Well GST25E05-P1J, 5 V 4 A (C8-indgang)", "Alle", 1, 160, "Strøm til Pi'en"),
    ("Adapterkabel DC 5,5/2,1 hun → micro-USB, 15 cm", "Alle", 1, 30, "Forsyning → Pi Zero (PWR-stik)"),
    ("Panelkabel C14 snap-in → C13, 30 cm", "Alle", 1, 60, "Strømindgang i soklen bagpå"),
    ("Y-kabel C14 → C13 + C7, 30 cm", "Alle", 1, 60, "Printer (C13, tjekkes) + forsyning (C8)"),
    ("Strømkabel Schuko → C13, 2 m", "Alle", 1, 40, "Det eneste kabel kunden sætter i"),
    ("Gummifødder Ø12 × 1 mm, selvklæbende", "Alle", 4, 5, "I fordybningerne under soklen"),
    ("Skabslås / kamlås Ø19, cylinder til plade op til 12 mm, med kam", "B2B", 1, 60, "Samme nøgle til alle steder"),
    ("SPUN+ Climate 4,0 × 30, undersænket", "B2B", 2, 2, "Sokkel → hylde eller konsol"),
    ("Skrue 5 × 50 + Fischer DuoPower 8 × 40", "B2B væg", 4, 4, "Vægplade → væg (stedet monterer selv)"),
    ("Låseskrue DIN 7982 pin-Torx 4,2 × 25", "B2B væg", 1, 3, "Konsol → vægplade (som gen 2)"),
]


def main():
    wb = Workbook()
    ws = wb.active
    ws.title = "Indkøb"
    bold = Font(bold=True)
    ws.append(["selfi-printer-v1 · indkøbsliste (kr inkl. moms, skøn)"]); ws["A1"].font = Font(bold=True, size=14)
    ws.append([])
    ws.append(["Købedele", "Bruges til", "Antal", "Pris pr. stk.", "I alt", "Note"])
    for c in ws[3]: c.font = bold
    sums = {}
    for name, use, n, kr, note in BOUGHT:
        ws.append([name, use, n, kr, n * kr, note])
        sums[use] = sums.get(use, 0) + n * kr
    ws.append([])
    ws.append(["Printede dele (ASA)", "Bruges til", "Gram", "Kr pr. g", "I alt", "Farve"])
    for c in ws[ws.max_row]: c.font = bold
    for name, use, g, col in PRINTED:
        ws.append([name, use, g, ASA_KR_G, round(g * ASA_KR_G), col])
        sums[use] = sums.get(use, 0) + g * ASA_KR_G
    ws.append([])
    ws.append(["Sum", "", "", "", "", ""]); ws.cell(ws.max_row, 1).font = bold
    base = sums.get("Alle", 0)
    ws.append(["Printer-pakke B2C (bord)", "", "", "", round(base), "inkl. begge ruller"])
    ws.append(["B2B hylde/disk", "", "", "", round(base + sums.get("B2B", 0)), "+ lås og 2 skruer"])
    ws.append(["B2B væg", "", "", "", round(base + sums.get("B2B", 0) + sums.get("B2B væg", 0)), "+ konsol, vægplade og skruer"])
    for col, w in zip("ABCDEF", (62, 12, 8, 12, 10, 70)):
        ws.column_dimensions[col].width = w
    wb.save(OUT)
    print(f"B2C {base:.0f} kr, B2B væg {base + sums.get('B2B', 0) + sums.get('B2B væg', 0):.0f} kr")


if __name__ == "__main__":
    main()
