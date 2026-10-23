# Selfi printer v4: hurtigprint (prototype)

**Version:** selfi-printer-v4-hurtig (23. okt. 2026), lavet af `selfi-printer-v4` med `python3 hardware/tools/make_printer.py selfi-printer-v4 --hurtig`. Reglerne står i `hardware/docs/HURTIGPRINT.md`: geometrien er den samme som i de normale printfiler (1:1), og tiden spares med prøvestykker og en kladdeprofil.

## Kladdeprofil

PLA · 0,28 mm lag · 2 vægge · 3 top- og bundlag · 10 % fyld · ingen støtte. Hele dele printes i samme retning som de normale. Stram pasform (låsen, kappens kroge, studsen med snor, konsolkrogen og knusekeglerne) skal til sidst prøves i ASA, fordi PLA krymper mindre. Bland ikke PLA og ASA i én samling.

## Prøvestykker (print dem først, og mål printeren samtidig)

| Fil | Mål (mm) | Hvad prøves |
|---|---|---|
| `_proeve-laas_kappe.stl` | 60 × 65 × 13 | Kamlåsen (Euro-Locks Ø19, 32 mm) i bossen i venstre ende. Den skal kunne skrues fast og dreje. |
| `_proeve-laas_sokkel.stl` | 30 × 28 × 80 | Låseholderen. Kammen skal gå op under taget i slidsen med lidt luft, når låsen drejes til låst. |
| `_proeve-kabel_sokkel.stl` | 56 × 32 × 32 | Kabelsporet bagtil og ankeret. Strømkablet trykkes ind nedefra, og en strip om kablet og ankeret holder det, når du trækker i kablet. |
| `_proeve-taetning_sokkel.stl` | 45 × 45 × 24 | Hjørnet med rillen (2,0 × 1,0) til skumsnoren Ø1,5 under kappens væg. Snoren skal ligge i rillen, også i hjørnet, og stikke ca. 0,5 mm op. |
| `_proeve-kappekrog_kappe.stl` + `_proeve-kappekrog_sokkel.stl` | 12 × 5 × 56 og ca. 56 × 24 × 24 | En af kappens 6 kroge og rampen i soklens læbe. Sænk krogen ned i den åbne slids og skub den 10 mm til højre: den skal glide ind under rampen med hånden og trække fladerne sammen. |
| `_proeve-studs_udgang.stl` | 60 × 60 × 24 | Hjørnet af studsens rille (2,0 × 0,7) til snoren. Snoren skal blive siddende i rillen, også i hjørnet. |
| `_proeve-pi_sokkel.stl` | 92 × 20 × 36 | Pi Zero 2 WH skubbes ned i de 2 riller på højkant og står fast. |
| `_proeve-fuge_kappe.stl` + `_proeve-fuge_udgang.stl` | 205 × 222 × 25 og 206 × 222 × 26 | Kappens højre kant med indføringsfasen og udgangsmodulets studs med snor i rillen (lidt silikonefedt). De skal kunne skubbes sammen, snoren skal blive siddende, og skyggefugen skal være lige. |
| `_proeve-lomme_udgang.stl` | 165 × 125 × 104 | Højre del af udtagslommen med endevæggen: åbning, stoplæbe med dræn, skærm og rutsjebanens fod. Et 4×6-print skal glide ned og blive liggende i lommen. |
| `_proeve-led_udgang.stl` | 42 × 32 × 40 | LED-skinnen. Stripen (10 mm) skubbes ind og sidder fast uden klister. |
| `_proeve-krog_konsol.stl` + `_proeve-krog_vaegplade.stl` | 60 × 62 × 80 og 60 × 30 × 12 | Den slanke konsols 45°-krog på vægskinnen. Den skal hægte sig fast og ligge tæt mod væggen. |
| `_proeve-greb_kappe.stl` + `_proeve-greb_udgang.stl` | 40 × 90 × 22 og 46 × 90 × 30 | Gribehakkene i enderne (76 × 22, loftet 20° op indad). Fingrene skal kunne komme ind og hage sig op bag kanten. |
| `_proeve-knusekegler_daempeplade.stl` | 68 × 59 × 11 | Et hjørne af dæmpepladen. Tryk en kegle flad: den skal give efter ved ca. 5–10 kg og knuses, mens pladen holder. Print den i ASA, ikke PLA, før den bedømmes. |

## Hele dele

`selfi-printer-v4-hurtig_kappe.stl`, `_sokkel.stl`, `_daempeplade.stl`, `_udgang.stl`, `_konsol.stl`, `_vaegplade.stl` og de to `_flerfarvet.3mf` (logo og "Dit print") er de normale printfiler. Med kladdeprofilen tager de ca. halvdelen af tiden.

## Mål samtidig på printeren

Se listen øverst i `PRINTGUIDE_selfi-printer-v4.md`. Det vigtigste er, hvor langt papiret kører ud under print, udgangens højde og printerens højde. Toppen sidder kun 4 mm over printeren.
