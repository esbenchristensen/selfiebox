# Selfi printer v2: hurtigprint (prototype)

**Version:** selfi-printer-v2-hurtig (22. okt. 2026), lavet af `selfi-printer-v2` med `python3 hardware/tools/make_printer.py selfi-printer-v2 --hurtig`. Reglerne står i `hardware/docs/HURTIGPRINT.md`: geometrien er den samme som i de normale printfiler (1:1), og tiden spares med prøvestykker og en kladdeprofil.

## Kladdeprofil

PLA · 0,28 mm lag · 2 vægge · 3 top- og bundlag · 10 % fyld · ingen støtte. Hele dele printes i samme retning som de normale. Stram pasform (låsen og studsen) skal til sidst prøves i ASA, fordi PLA krymper mindre. Bland ikke PLA og ASA i én samling.

## Prøvestykker (print dem først, og mål printeren samtidig)

| Fil | Mål (mm) | Hvad prøves |
|---|---|---|
| `_proeve-laas_kappe.stl` | 60 × 65 × 13 | Kamlåsen (Euro-Locks Ø19, 32 mm) i bossen i venstre ende. Den skal kunne skrues fast og dreje. |
| `_proeve-laas_sokkel.stl` | 30 × 28 × 80 | Låseholderen. Kammen skal gå op under taget i slidsen med lidt luft, når låsen drejes til låst. Læg den mod låseprøven: kammen sidder 33 mm inde fra ydersiden. |
| `_proeve-stroemindgang_sokkel.stl` | 55 × 18 × 46 | C14-panelkablet klikkes i pladen og sidder fast. |
| `_proeve-pi_sokkel.stl` | 92 × 20 × 36 | Pi Zero 2 WH skubbes ned i de 2 riller på højkant og står fast. |
| `_proeve-fuge_kappe.stl` + `_proeve-fuge_udgang.stl` | 266 × 222 × 25 og 267 × 222 × 26 | Kappens højre kant og udgangsmodulets studs. De skal glide sammen med 0,3 mm luft hele vejen rundt, og skyggefugen skal være lige. |
| `_proeve-lomme_udgang.stl` | 165 × 125 × 104 | Højre del af udtagslommen med endevæggen: åbning, stoplæbe med dræn, skærmen og rutsjebanens fod. Lad et 4×6-print glide ned ad banen. Det skal blive liggende i lommen og være let at tage. Prøv også, hvor langt en hånd kan komme ind. |
| `_proeve-led_udgang.stl` | 42 × 32 × 40 | LED-skinnen. Stripen (10 mm) skubbes ind og sidder fast uden klister. |

## Hele dele

`selfi-printer-v2-hurtig_kappe.stl`, `_sokkel.stl`, `_udgang.stl` og `_kappe_flerfarvet.3mf` (med logo) er de normale printfiler. Med kladdeprofilen tager de ca. halvdelen af tiden.

## Mål samtidig på printeren

Se listen øverst i `PRINTGUIDE_selfi-printer-v2.md`. Det vigtigste er, hvor langt papiret kører ud under print (rummet er 190 mm), og at udgangen sidder 135 mm over printerens bund.
