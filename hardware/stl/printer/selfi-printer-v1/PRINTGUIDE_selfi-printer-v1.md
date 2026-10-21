# Selfi printer v1: printguide

**Version:** selfi-printer-v1 (21. okt. 2026). Alle filer i mappen starter med `selfi-printer-v1_`. CAD-kilden er `hardware/cad/selfi_printer_v1.scad` i esbenchristensen/selfiebox. Filerne laves med `python3 hardware/tools/make_printer.py`.

Printeren er en **DNP QW410** (dye-sub, 300 dpi) i et printet kabinet, der står ved siden af boksen. Den laver fotostriber 2×6 på en perforeret 4×6-rulle og polaroid-look i 4×6 eller 4×4 på en almindelig rulle. Kabinettet er 222,5 × 220 × 294,4 mm, altså samme bredde og samme hjørne som gen 2-boksen. Det er det samme kabinet til B2C og B2B. Kun låsen og monteringen er forskellige.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning. Én del pr. plade.

## Mål printeren før første print

Kabinettet er tegnet efter DNP's mål (208 × 198 × 240 mm), ikke efter en rigtig printer. Mål disse ting på den første QW410, før kappen printes:

- **Papirudgangens højde** over bordet. Den er sat til 58 mm (`SLOT_Z`), og slidsen i kappen er 124 × 8 mm.
- Hvor **fødderne** sitter, og om printeren står fast i rammen på soklen (rammen har 1 mm luft hele vejen rundt).
- Hvordan **lågen** åbner, og hvor rullen og farvebåndet skiftes. Kappen løftes helt af, så alt er frit, men der skal være plads over printeren, hvis den åbner opad.
- Hvilket **strømstik** printeren har (C13 er antaget) og hvor USB-stikket sitter.
- Om **affaldsbakken** til 2"-klip kan tømmes, når printeren står på soklen.

## Printfiler

| Fil | Del | Print |
|---|---|---|
| `selfi-printer-v1_kappe_flerfarvet.3mf` | Kappe + logo, B2C (uden lås) | ASA sort, logo i hvid og grøn via AMS · toppen ned · 0,2 mm lag · 8 vægge (3,2 mm) · 15 % fyld · støtte kun under papirslidsen · ca. 900 g |
| `selfi-printer-v1_kappe-laas_flerfarvet.3mf` | Kappe + logo, B2B (hul til skabslås i højre side) | som ovenfor · ca. 905 g |
| `selfi-printer-v1_kappe.stl` / `_kappe-laas.stl` | Kappen alene (hvis logoet skal sættes på i sliceren) | indlæses sammen med de to logofiler som ét objekt |
| `selfi-printer-v1_logo-hvid.stl` | Logo, hvide dele | ASA hvid · 0,8 mm indlagt i fronten |
| `selfi-printer-v1_logo-groen.stl` | Logo, grønne prikker | ASA grøn |
| `selfi-printer-v1_sokkel.stl` | Sokkel (samme til bord, hylde og væg) | ASA sort · bunden ned · 6 vægge · 40 % fyld · ca. 420 g |
| `selfi-printer-v1_bakke.stl` | Opsamlingsbakke | ASA sort · bunden ned · 100 % fyld · ca. 60 g |
| `selfi-printer-v1_konsol.stl` | Vægkonsol (kun B2B væg) | ASA sort · hyldens top ned · 6 vægge · 30 % fyld · ca. 700 g |
| `selfi-printer-v1_vaegplade.stl` | Vægplade (kun B2B væg) | ASA sort · væg-siden ned · 100 % fyld · ca. 220 g |

Logoet ligger på kappens lodrette front, så farveskiftet sker lag for lag op ad fronten. Lad 50 mm stå fri langs én kant af pladen til prime-tårnet.

## Sådan sidder delene

| Del | Holdes af |
|---|---|
| Kappe på sokkel | Soklens kant (9 mm høj, 2,4 mm tyk) går op i kappen med 0,3 mm luft. 4 klikkanter (to foran, to bagpå) klikker i riller inde i kappens væg, så der ikke kan ses noget udefra. Kappen løftes af med et fast træk. |
| Printer | Står i en 3 mm høj ramme på soklen med 1 mm luft. Rammen er åben foran, så papir og klip kan komme ud. |
| Opsamlingsbakke | To kroge går gennem 2 slidser under papirudgangen og hager sig fast bag kappens væg. |
| Pi Zero 2 W | Står på højkant i 2 riller bag i bagrummet. |
| 5 V-forsyning | Står på siden i en vugge i bagrummet. |
| Strømindgang | C14-panelkablet klikkes i soklens bagplade. Kappen har et hak over den, så den løftes fri. |
| Skabslås (B2B) | Sidder i en 10 mm tyk boss i kappens højre side, bag i bagrummet. Kammen drejer ned bag en tand på soklen. |
| Sokkel på hylde/konsol (B2B) | 2 undersænkede skruer (SPUN+ 4,0 × 30) under printeren. De kan kun nås, når kappen er af. |
| Konsol på væg (B2B) | Vægpladen skrues på væggen med 4 skruer og dybler. Konsollen hægtes på den 45° skinne og låses med en pin-Torx-skrue gennem konsollens bagplade under hylden. |

## Samling

1. Print delene og fjern støtten i papirslidsen.
2. Sæt 4 gummifødder i fordybningerne under soklen (kun ved bord).
3. Klik C14-panelkablet i soklens bagplade.
4. Sæt forsyningen i vuggen og Pi Zero i rillerne. Sæt Y-kablet i panelkablets C13-ende: den ene ende til printeren, den anden (C7) til forsyningen. Forsyningen går til Pi'ens PWR-stik via adapterkablet. USB-kablet går fra Pi'ens USB-stik (OTG) til printeren.
5. Stil printeren i rammen, læg rulle og farvebånd i og luk printeren.
6. Sæt kappen ned over soklen, så den klikker. Klik bakken på.
7. B2B: Skru skabslåsen i kappe-udgaven med hul, før kappen sættes på. Skru soklen fast i hylden eller konsollen, før printeren stilles i.

Der skal ikke loddes. Den eneste 230 V-ledning er færdige kabler med stik.

## Software

- Pi Zero 2 W kører Raspberry Pi OS Lite med CUPS og Gutenprint (`selphy_print`-backend, som understøtter QW410).
- Den melder sig på boksens wifi eller stedets net, og boksen printer til den via IPP. Koden kommer i esbenchristensen/selfiebox-platform (box/agent).
- Backenden læser, hvor meget papir der er tilbage, så boksen kan vise det og give besked, før rullen slipper op.
- Format pr. udlejning: perforeret rulle til striber, almindelig rulle til polaroid-look. Rullen lægges i hos os.

## Kendte risici

- Alle mål på printeren er fra DNP's datablad og skal måles (se øverst).
- Printer og kabinet vejer ca. 7 kg, så printeren skal sendes i sin egen kasse.
- Kabinettet er ikke hærværkssikret. Det holder til steder med personale, når det er skruet fast og låst.
- Konsollens bæreevne skal testes med 7 kg plus et skub, før den sendes ud.
- Dye-sub-printeren bliver varm ved mange print i træk. Luften går ind i bunden og ud foroven bagpå, så hold 5 cm fri bag den.
