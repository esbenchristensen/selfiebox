# Selfi printer v5: hurtigprint (prototype)

**Version:** selfi-printer-v5-hurtig (27. okt. 2026), lavet af `selfi-printer-v5` med `python3 hardware/tools/make_printer.py selfi-printer-v5 --hurtig`. Reglerne står i `hardware/docs/HURTIGPRINT.md`: geometrien er den samme som i de normale printfiler (1:1), og tiden spares med prøvestykker og en kladdeprofil.

## Kladdeprofil

PLA · 0,28 mm lag · 2 vægge · 3 top- og bundlag · 10 % fyld · ingen støtte. Hele dele printes i samme retning som de normale. Stram pasform (låsen, studsen, L-beslagets hjørne og knusekeglerne) skal til sidst prøves i ASA, fordi PLA krymper mindre. Bland ikke PLA og ASA i én samling.

## Prøvestykker (print dem først, og mål printeren samtidig)

| Fil | Mål (mm) | Hvad prøves |
|---|---|---|
| `_proeve-laas_kappe.stl` | 60 × 65 × 13 | Kamlåsen (Euro-Locks Ø19, 32 mm) i bossen i venstre ende. Den skal kunne skrues fast og dreje. |
| `_proeve-laas_sokkel.stl` | 30 × 28 × 80 | Låseholderen. Kammen skal gå op under taget i slidsen med lidt luft, når låsen drejes til låst. |
| `_proeve-kabel_sokkel.stl` | 56 × 32 × 32 | Kabelsporet bagtil og ankeret. Strømkablet trykkes ind nedefra, og en strip om kablet og ankeret holder det, når du trækker i kablet. |
| `_proeve-fuge_sokkel.stl` | 45 × 45 × 24 | Soklens hjørne med læben (v5: ingen rille). Kappens kant skal stå fladt på soklen, og læben skal gå fri indenfor kappens væg. |
| `_proeve-pi_sokkel.stl` | 92 × 20 × 36 | Pi Zero 2 WH skubbes ned i de 2 riller på højkant og står fast. |
| `_proeve-fuge_kappe.stl` + `_proeve-fuge_udgang.stl` | 205 × 222 × 25 og 206 × 222 × 26 | Kappens højre kant og udgangsmodulets studs (v5: ingen snor, ingen rille, ingen fase). De skal kunne skubbes sammen med hånden, og skyggefugen skal være lige. |
| `_proeve-lomme_udgang.stl` | 165 × 125 × 104 | Højre del af udtagslommen med endevæggen: åbning, stoplæbe med dræn, skærm og rutsjebanens fod. Et 4×6-print skal glide ned og blive liggende i lommen. |
| `_proeve-led_udgang.stl` | 42 × 32 × 40 | LED-skinnen. Stripen (10 mm) skubbes ind og sidder fast uden klister. |
| `_proeve-hjoerne_konsol.stl` | ca. 60 × 55 × 50 | L-beslagets hjørne med hulkehlen og en vægskrue, printet på enden som det hele beslag. Printerens bagkant skal gå helt ind til bagpladen, og skruehovedet skal ligge plant. |
| `_proeve-greb_kappe.stl` + `_proeve-greb_udgang.stl` | 40 × 90 × 22 og 46 × 90 × 30 | Gribehakkene i enderne (76 × 22, loftet 20° op indad). Fingrene skal kunne komme ind og hage sig op bag kanten. |
| `_proeve-knusekegler_daempeplade.stl` | 68 × 59 × 11 | Et hjørne af dæmpepladen. Tryk en kegle flad: den skal give efter ved ca. 5–10 kg og knuses, mens pladen holder. Print den i ASA, ikke PLA, før den bedømmes. |

## Hele dele

`selfi-printer-v5-hurtig_kappe.stl`, `_sokkel.stl`, `_daempeplade.stl`, `_udgang.stl`, `_konsol.stl` og de to `_flerfarvet.3mf` (logo og "Dit print") er de normale printfiler. Med kladdeprofilen tager de ca. halvdelen af tiden.

## Mål samtidig på printeren

Se listen øverst i `PRINTGUIDE_selfi-printer-v5.md`. Det vigtigste er, hvor langt papiret kører ud under print, udgangens højde og printerens højde. Toppen sidder kun 4 mm over printeren.
