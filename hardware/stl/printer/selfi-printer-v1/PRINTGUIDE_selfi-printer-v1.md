# Selfi printer v1: printguide

**Version:** selfi-printer-v1 (21. okt. 2026). Alle filer i mappen starter med `selfi-printer-v1_`. CAD-kilden er `hardware/cad/selfi_printer_v1.scad` i esbenchristensen/selfiebox. Filerne laves med `python3 hardware/tools/make_printer.py`.

Printeren er en **DNP QW410** (dye-sub, 300 dpi) i et printet kabinet, der står ved siden af boksen. Den laver fotostriber 2×6 på en perforeret 4×6-rulle og polaroid-look i 4×6 eller 4×4 på en almindelig rulle. Kabinettet er 222,5 × 220 × 294,4 mm, altså samme bredde og samme hjørne som gen 2-boksen. Det er det samme kabinet til B2C og B2B. Kun låsen og monteringen er forskellige.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning. Én del pr. plade.

## Mål printeren før første print

Kabinettet er tegnet efter DNP's brochure, brugervejledning og fotos (208 × 198 × 240 mm), ikke efter en rigtig printer. Fra vejledningen ved vi: lågen til rulle og farvebånd sidder foroven og åbner opad (håndtag foran), papirudgangen sidder højt på fronten med affaldsbakken under, og bagpå sidder C14-stik og tænd/sluk-kontakt nederst, USB-B og en 5 V 2 A USB-udgang midt på, en blæser foroven og udluftning i siden. Mål disse ting på den første QW410, før kappen printes:

- **Papirudgangens højde** over bordet. Den er sat til 147 mm (`SLOT_Z`, ca. 135 mm over printerens bund, aflæst på DNP's foto), og slidsen i kappen er 124 × 8 mm. Logoet sidder under bakken (`LOGO_Z` 72).
- Hvor **fødderne** sitter, og om printeren står fast i rammen på soklen (rammen har 1 mm luft hele vejen rundt).
- At **5 V-udgangen** bagpå giver strøm, også når printeren står i standby, så Pi'en kan køre på den. Ellers skal der en 5 V-forsyning ind i bagrummet igen.
- At de **vinklede stik** (C13 og USB-B) kan være i det 40 mm dybe bagrum.
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
| Pi Zero 2 W | Står på højkant i 2 riller bag i bagrummet. Får strøm fra printerens 5 V 2 A USB-udgang. |
| Strømindgang | C14-panelkablet klikkes i soklens bagplade. Kappen har et hak over den, så den løftes fri. |
| Skabslås (B2B) | Sidder i en 10 mm tyk boss i kappens højre side, bag i bagrummet. Kammen drejer ned bag en tand på soklen. |
| Sokkel på hylde/konsol (B2B) | 2 undersænkede skruer (SPUN+ 4,0 × 30) under printeren. De kan kun nås, når kappen er af. |
| Konsol på væg (B2B) | Vægpladen skrues på væggen med 4 skruer og dybler. Konsollen hægtes på den 45° skinne og låses med en pin-Torx-skrue gennem konsollens bagplade under hylden. |

## Samling

1. Print delene og fjern støtten i papirslidsen.
2. Sæt 4 gummifødder i fordybningerne under soklen (kun ved bord).
3. Klik C14-panelkablet i soklens bagplade.
4. Sæt Pi Zero i rillerne. Panelkablets vinklede C13-ende går i printerens C14-stik. Kablet USB-A → micro-USB går fra printerens 5 V-udgang til Pi'ens PWR-stik, og USB-kablet går fra Pi'ens USB-stik (OTG) til printerens USB-B. Sæt printerens tænd/sluk-kontakt bagpå på ON; den bliver stående, så printeren tænder, når strømmen sættes til.
5. Stil printeren i rammen, åbn lågen foroven, læg rulle og farvebånd i og luk lågen.
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
- Dye-sub-printeren bliver varm ved mange print i træk og køler selv (5-35 °C). Luften går ind i bunden og ud foroven bagpå og i siderne ud for printerens egen blæser og udluftning, så hold 5 cm fri bag og ved siden af den.
- Affaldsbakken (klip fra 2"-snit) sidder under papirudgangen og tømmes med kappen af. DNP's egen gennemsigtige papirbakke bruges ikke; den printede bakke erstatter den.
- Striber 2×6 kræver DNP's 4×6-rulle med perforering i midten og firmware v1.10 med ny driver (DNP's brochure fra 2020 nævner kun 2×4 og 2×4,5).
