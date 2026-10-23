# Selfi printer v2: printguide

**Må ikke printes: brug selfi-printer-v3.** **Version:** selfi-printer-v2 (22. okt. 2026). Alle filer i mappen starter med `selfi-printer-v2_`. CAD-kilden er `hardware/cad/selfi_printer_v2.scad` i esbenchristensen/selfiebox. Filerne laves med `python3 hardware/tools/make_printer.py selfi-printer-v2`. v1 må ikke printes.

v2 erstatter v1. Grunden er, at en dye-sub-printer fører papiret ud og ind 4 gange under hvert print (gul, magenta, cyan og lak). I v1 stod slidsen og bakken i vejen for papiret, og gæsterne kunne komme til printeren. v2 er hærværkssikret og bruges både til B2C på et bord og til B2B:

- **Lang side mod gæsten.** Printeren (DNP QW410) står drejet 90°, så papirudgangen peger mod højre ende. Den peger ind i et lukket rum med 190 mm fri plads, så papiret kan køre frit.
- **Printet rutsjer ud.** Det klippede print falder ned på en glat rutsjebane med 30° hældning og glider frem i en udtagslomme forneden (åbning 170 × 54 mm). En stoplæbe med 3 dræn holder printet i lommen, og lommebunden falder udad, så spild løber ud.
- **Skærm over lommen.** En skærm på 54° slutter foran det sted, hvor printet falder, så intet bliver liggende på den. En hånd skal rundt om et hjørne og godt 10 cm op for at nå udgangen. Printer, papir og låge kan ikke nås.
- **Sadeltag.** Taget hælder 30° og har en rund ryg (R25), så en dåse eller et glas glider eller vælter af. Der er ingen åbninger i toppen.
- **Nøglelås.** Kamlåsen i venstre ende låser kappen til soklen. Kappen kan kun tages af med nøglen.
- **RGB-lys.** En kort LED-strip lyser ned ad rutsjebanen, så lommen gløder. Den kører på Pi'en og printerens egen 5 V. Der er ingen knapper og ingen ekstra styring.

Kabinettet er 476 × 222,5 × 277,6 mm og består af 3 printede dele, fordi 476 mm ikke kan være på pladen.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning, og alle 3 dele er tjekket mod H2C's sikre område (285 × 306 × 305 mm, `hardware/tools/check_bed.py`). Print én del pr. plade.

## Mål printeren før første print

Kabinettet er tegnet efter DNP's datablad og fotos, ikke efter en rigtig QW410. Mål disse ting på den første printer, før delene printes. Prøvestykkerne i hurtigsættet (`selfi-printer-v2-hurtig`) er lavet til det.

- **Hvor langt papiret kører ud** af udgangen under print (alle 4 omgange, 4×6). Papirrummet er 190 mm (`CHB`). Er der under 20 mm luft til endevæggen, skal rummet være længere.
- **Udgangens højde og bredde.** Den er sat til 135 mm over printerens bund (`SLOT_Z` = 147 over bordet) og 124 mm bred. Skærmen slutter 48 mm fra fronten, så udgangen skal sidde mindst 55 mm inde fra printerens side.
- **At printet falder frit**, når det er klippet. Falder det skævt eller bliver hængende, kan rutsjebanen flyttes tættere på udgangen.
- Printerens **fødder** og at den står fast i rammen på soklen (1 mm luft hele vejen rundt), og at lågen foroven kan åbnes, når kappen er af.
- At **5 V-udgangen** bagpå giver strøm, også i standby, så Pi'en og LED'en kører.
- At de **vinklede stik** (C13 og USB-B) kan være i bagrummet (40 mm).
- **Kamlåsen**: kammen skal sidde 33 mm inde fra kappens yderside (`CAM_X`). Det passer til Euro-Locks 32 mm (RS 195-9616). Med en anden lås flyttes låseholderen.

## Printfiler

| Fil | Del | Print |
|---|---|---|
| `selfi-printer-v2_kappe_flerfarvet.3mf` | Kappe + logo (samme til B2C og B2B) | ASA sort, logo i hvid og grøn via AMS · venstre ende ned · 0,2 mm lag · 8 vægge (3,2 mm) · 15 % fyld · ingen støtte · ca. 810 g · ca. 18 t (skøn) |
| `selfi-printer-v2_kappe.stl` | Kappen alene (hvis logoet sættes på i sliceren) | indlæses sammen med de to logofiler som ét objekt |
| `selfi-printer-v2_logo-hvid.stl` | Logo, hvide dele | ASA hvid · 0,8 mm indlagt i fronten |
| `selfi-printer-v2_logo-groen.stl` | Logo, grønne prikker | ASA grøn |
| `selfi-printer-v2_sokkel.stl` | Sokkel under printeren | ASA sort · bunden ned · 6 vægge · 40 % fyld · ingen støtte · ca. 480 g · ca. 9 t (skøn) |
| `selfi-printer-v2_udgang.stl` | Udgangsmodul: papirrum, rutsjebane, lomme, skærm, LED-skinne | ASA sort · højre ende ned · 0,2 mm lag · 8 vægge · 15 % fyld · ingen støtte · ca. 950 g · ca. 20 t (skøn) |

Kappen og udgangsmodulet printes stående på en ende. Så er tag, rutsjebane, skærm og LED-skinne lodrette vægge, og der skal ikke bruges støtte. Det eneste, der bygger bro, er toppen af udtagslommen (54 mm). Logoet ligger på kappens lodrette front, så farveskiftet sker lag for lag. Lad 50 mm stå fri langs én kant af pladen til prime-tårnet.

## Sådan sidder delene

| Del | Holdes af |
|---|---|
| Udgangsmodul på sokkel | En tunge under udgangsmodulet går ind under soklens højre ende og holdes af 2 undersænkede skruer (3,5 × 10 til plast) ned gennem soklen. Skruerne sidder under printeren og kan kun nås, når kappen og printeren er af. |
| Kappe | Kappen står på soklen med en kant (9 × 2,4 mm) indvendig. Højre kant går 8 mm ind over en studs på udgangsmodulet, så den kan ikke løftes i den ende. I venstre ende drejer kamlåsens kam op under taget på låseholderen i soklen, så kappen hverken kan løftes eller skubbes. |
| Printer | Står i en 3 mm høj ramme på soklen med 1 mm luft. Rammen er åben ved udgangen. |
| Pi Zero 2 WH | Står på højkant i 2 riller i bagrummet (venstre ende). |
| Strømindgang | C14-panelkablet klikkes i soklens plade i venstre ende. Kappen har et hak over den. |
| LED-strip | Skubbes ind i skinnen på udgangsrummets bagvæg fra venstre. Den holdes af skinnen, og klisteret kan blive på. |

## Samling

1. Print delene. Der er ingen støtte at fjerne.
2. Sæt 6 gummifødder i fordybningerne: 4 under soklen og 2 under udgangsmodulet.
3. Skub udgangsmodulets tunge ind under soklen og skru de 2 skruer i fra oven (3,5 × 10).
4. Klik C14-panelkablet i soklens plade i venstre ende.
5. Klip LED-strippen til 9 LED i den frie ende, og skub den ind i skinnen fra venstre. Træk kablet langs bagvæggen ind i bagrummet.
6. Sæt Pi Zero i rillerne og forbind alt efter `selfi-printer-v2_ledningsdiagram.png`. Sæt printerens tænd/sluk-kontakt bagpå på ON. Den bliver stående, så printeren tænder, når strømmen sættes til.
7. Stil printeren i rammen med udgangen mod udgangsmodulet. Læg rulle og farvebånd i og luk lågen.
8. Skru kamlåsen i kappens venstre ende med kammen pegende nedad (åben).
9. Sæt kappen ned over soklen 10 mm til venstre for sin plads, skub den til højre ind over studsen, og drej nøglen til låst.

Kappen tages af i omvendt rækkefølge: lås op, skub kappen 10 mm til venstre og løft den af.

B2B: soklen kan skrues fast i bordet eller disken med 2 SPUN+ 4,0 × 30 under printeren (sæt dem før printeren stilles i).

Der skal ikke loddes. Den eneste 230 V-ledning er færdige kabler med stik.

## Software

- Pi Zero 2 WH kører Raspberry Pi OS Lite med CUPS og Gutenprint (`selphy_print`-backend, som understøtter QW410). Boksen printer til den via IPP på wifi.
- LED'en styres fra Pi'en på GPIO18 (fx `rpi_ws281x`). Som udgangspunkt lyser den svagt i Selfi-grøn, og den pulserer, mens et print er på vej. Lysstyrken er højst 30 %, og farverne kan sættes pr. udlejning.

## Kendte risici

- Alle mål på printeren er fra DNP's datablad og skal måles (se øverst). Det vigtigste er, hvor langt papiret kører ud under print.
- 4,5×8-print kan ikke komme ud. Papirrummet og lommen passer til 4×6, 2×6-striber og 4×4.
- En voksen hånd kan nå lidt ind under skærmen, men ikke op til udgangen uden at gå rundt om et hjørne. Prøv det på prototypen.
- LED-data er 3,3 V fra Pi'en til en 5 V-strip. Det virker normalt på en kort strip, men skal prøves. Ellers skal der en niveauskifter med stik ind.
- Dye-sub-printeren bliver varm ved mange print i træk og køler selv (5-35 °C). Luften går ind i bunden under printeren og ud gennem lamellerne i venstre ende ud for printerens blæser. Hold 5 cm fri ved venstre ende.
- Printer og kabinet vejer ca. 8 kg, og kabinettet er 476 mm langt, så printerkassen fra emballage v2 (380 × 285 × 380) er for lille. Der skal en ny kasse til.
- Affaldsbakken i printeren (klip fra 2"-snit) tømmes med kappen af.
