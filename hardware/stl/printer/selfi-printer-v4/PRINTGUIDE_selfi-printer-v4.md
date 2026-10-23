# Selfi printer v4: printguide

**Version:** selfi-printer-v4 (23. okt. 2026). Alle filer i mappen starter med `selfi-printer-v4_`. CAD-kilden er `hardware/cad/selfi_printer_v4.scad` i esbenchristensen/selfiebox. Filerne laves med `python3 hardware/tools/make_printer.py selfi-printer-v4`. v1, v2 og v3 må ikke printes.

v4 er v3 med samme tætning som boksen (halo-gen2-v20), støddæmpning om printeren, gribehak og skjult vægbeslag:

- **Skumsnor i stedet for bånd.** Begge fuger tætnes med silikoneskum-snor Ø1,5 mm (RS 234-2906), som klemmes 33 % mod et hårdt anslag. Rillen i soklens overside er 2,0 × 1,0 mm og ligger midt under kappens væg. Rillen rundt om udgangsmodulets studs er 2,0 × 0,7 mm. Kappens højre kant har en indføringsfase på 30° × 1 mm, så snoren ikke ruller ud.
- **6 kroge trækker kappen ned.** Snoren skubber kappen op, så kappen har 3 kroge på hver langvæg. Når kappen skubbes de sidste 10 mm på plads, glider krogene ind under ramper i soklens læbe og trækker den sidste millimeter ned. Kamlåsen holder kappen, så den ikke kan skubbes tilbage.
- **Støddæmpning inden for de samme mål.** Printeren står ikke længere direkte på soklen, men på en dæmpeplade (1,6 mm) med 56 hule knusekegler (8,4 mm høje, væg 0,45) ned mod soklens 2 mm-bund. Keglerne står i 2 ringe tæt ved kanten, hvor bunden bæres af soklens vægge. Hvis kassen tabes, knuses keglerne i stedet for printeren. Ved enderne sidder 4 kegler på kappens endevæg og 2 på bøjler i udgangsmodulet, 1 mm fra printeren. Dæmpepladen er en billig sliddel, der skiftes efter et hårdt fald. Se `selfi-printer-v4_snit-daempning.png`.
- **Gribehak i begge ender.** Kabinettet løftes med en hånd i hvert hak (76 × 22 mm, 20 mm dybe). Loftet i hakket vinkler 20° opad indad, så fingerspidserne hager sig op bag kanten. Hakkene er lukket bagtil, så kabinettet stadig er tæt, og gulvet hælder 0,7 mm udad, så vand løber ud. Det venstre sidder midt på kappens ende under nøglelåsen. Det højre sidder i udgangsmodulets ende, 8 mm lavere og 10 mm længere bagud, fordi rutsjebanen er over det. Soklens læbe er skåret væk bag det venstre hak. Se `selfi-printer-v4_skitse_gribehak.png`.
- **Skjult vægbeslag.** I stedet for konsoller med knægte og vægskinner er der 2 ens L-beslag: en hylde på 15 mm under printeren og en bagplade på 15 mm, der står 95 mm op bag printeren og skrues i væggen dér. Forfra ses kun hyldens kant, der flugter med printerens ender (2 × 238 mm, der mødes under midten og samles med 2 dyvelstifter). Printeren sidder 15 mm ud fra væggen. Regnet til 500 N på forkanten (en der læner sig på printeren).

Fra v3:

- **Flad top.** Kabinettet er 217 mm højt, og toppen har ingen åbninger.
- **"Dit print"** står i hvidt med en grøn pil over udtagslommen.
- **Strømkablet kan ikke tages ud.** Der er ingen strømindgang udenpå. Kablet (Schuko → C13 vinklet) trykkes ind i et spor under soklen bagtil, går op i bagrummet og sættes direkte i printeren. En strip om kablet og ankeret holder det, så kablet ikke kan trækkes ud.
- **Vægbeslag (B2B).** 2 ens skjulte L-beslag, hvert skruet i væggen med 4 skruer bag printeren. Soklen skrues ned i det venstre beslag indefra, og det højre beslag skrues op i udgangsmodulet nedefra. Når printeren sidder på, kan ingen komme til vægskruerne, så der skal ikke bruges sikkerhedsskruer. Strømkablet går ned i en rille i bagpladen.

Resten er som v2. Printeren (DNP QW410) står drejet 90°, så papiret kan køre frit i et lukket rum på 190 mm. Printet falder ned på en rutsjebane på 30° og ender i en lomme forneden med stoplæbe og dræn. Skærmen sidder på 54°, kappen låses med nøgle, og RGB-lyset kører på printerens egen 5 V.

Kabinettet er 476 × 222,5 × 217,2 mm og består af 4 printede dele: kappe, sokkel, dæmpeplade og udgangsmodul. På væg bruges desuden 2 skjulte L-beslag.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning, og alle dele er tjekket mod H2C's sikre område (285 × 306 × 305 mm, `hardware/tools/check_bed.py`). Print én del pr. plade.

## Mål printeren før første print

Kabinettet er tegnet efter DNP's datablad og fotos, ikke efter en rigtig QW410. Prøvestykkerne i hurtigsættet (`selfi-printer-v4-hurtig`) er lavet til at måle disse ting:

- **Gribehakkene:** `proeve-greb_kappe` og `proeve-greb_udgang` viser, om fingrene kan komme ind og hage sig fast.
- **Knusekeglerne:** `proeve-knusekegler_daempeplade` er et hjørne af dæmpepladen. Tryk en kegle flad i en skruestik eller med en vægt. Den skal give efter ved ca. 5–10 kg og knuses, mens pladen holder. Er den meget stivere, skal keglevæggen være tyndere.
- **Printerens fødder:** De skal stå ude over keglerne, inden for ca. 35 mm fra pladens kant. Står de længere inde, skal ringene flyttes.
- **Krogene og tætningen:** `proeve-kappekrog_kappe` og `proeve-kappekrog_sokkel` sættes sammen med snor i rillen. Krogen skal kunne skubbes ind under rampen med hånden, og fladerne skal mødes. `proeve-studs_udgang` viser, om snoren bliver i rillen, når kappen skubbes over.

- **Hvor langt papiret kører ud** af udgangen under print (alle 4 omgange, 4×6). Papirrummet er 190 mm. Er der under 20 mm luft til endevæggen, skal rummet være længere.
- **Udgangens højde og bredde.** Den er sat til 135 mm over printerens bund og 124 mm bred.
- **Printerens højde (198 mm).** Toppen ligger kun 4 mm over printeren, så den skal passe.
- **At printet falder frit**, når det er klippet, og glider ned i lommen.
- At **5 V-udgangen** bagpå giver strøm, også i standby.
- At **C13-stikket (vinklet)** og USB-B kan være i bagrummet (40 mm), og at strømkablet er højst 7,5 mm tykt.
- **Kamlåsen**: kammen sidder 33 mm inde fra kappens yderside (Euro-Locks 32 mm, RS 195-9616).

## Printfiler

| Fil | Del | Print |
|---|---|---|
| `selfi-printer-v4_kappe_flerfarvet.3mf` | Kappe + logo | ASA sort, logo i hvid og grøn via AMS · venstre ende ned · 0,2 mm lag · 8 vægge (3,2 mm) · 15 % fyld · ingen støtte · ca. 760 g |
| `selfi-printer-v4_udgang_flerfarvet.3mf` | Udgangsmodul + "Dit print" og pil | ASA sort, tekst i hvid og pil i grøn via AMS · højre ende ned · 0,2 mm lag · 8 vægge · 15 % fyld · ingen støtte · ca. 960 g |
| `selfi-printer-v4_sokkel.stl` | Sokkel under printeren | ASA sort · bunden ned · 6 vægge · 40 % fyld · ingen støtte · ca. 300 g |
| `selfi-printer-v4_daempeplade.stl` | Dæmpeplade med 56 knusekegler | ASA sort · pladen ned, keglerne op · 0,2 mm lag · linjebredde 0,45 (keglerne er én streg) · massiv plade · ingen støtte · ca. 85 g. Print gerne 2, så der er en i reserve |
| `selfi-printer-v4_konsol.stl` | Skjult L-beslag (kun B2B på væg), **print 2** | ASA sort · **på enden** (L-profilen på pladen, 238 høj, som filen ligger), så begge ben bøjer langs lagene · 6 vægge · 25 % gyroid · ingen støtte · brim · ca. 450 g pr. stk. |
| `selfi-printer-v4_kappe.stl`, `_udgang.stl`, `_logo-*.stl`, `_tekst-*.stl` | De samme dele som enkelte filer | Til sliceren, hvis 3MF ikke bruges |

Kappen og udgangsmodulet printes stående på en ende uden støtte. Logo og tekst ligger på den lodrette front, så farveskiftet sker lag for lag. Lad 50 mm stå fri langs én kant af pladen til prime-tårnet.

## Samling

1. Print delene. Der er ingen støtte at fjerne.
2. Sæt 6 gummifødder i fordybningerne: 4 under soklen og 2 under udgangsmodulet. Spring dem over på væg.
3. **Skumsnor:** Tryk snoren ned i rillen i soklens overside, langs forkanten, venstre ende og bagkanten (ca. 0,8 m). Den skal stikke 0,5 mm op. Skær den over ved kabelsporet, og lad enderne være 1 mm for lange, så de presser mod kablet. Læg også snor i rillen rundt om udgangsmodulets studs (ca. 0,7 m). Skær den 1–2 mm for lang, og lad enderne gå ned i de korte grene i soklen, så de støder mod soklens snor. Smør en tynd smule silikonefedt på snoren om studsen. Snoren skal ikke limes. Den må ikke samles i bunden af en rille, der vender opad.
4. Stil udgangsmodulet på soklens tunge og skru de 2 skruer i nedefra gennem tungen (3,5 × 12).
5. **Strømkabel:** Tryk kablet ind i sporet under soklen bagtil, så C13-enden kommer op i bagrummet. Lad kablet ligge løst, så det kan nå printerens C14 bagpå. Spænd en strip om kablet og gennem hullet i ankeret.
6. Klip LED-strippen til 9 LED og skub den ind i skinnen på udgangsrummets bagvæg fra venstre.
7. Sæt Pi Zero i rillerne og forbind alt efter `selfi-printer-v4_ledningsdiagram.png`. Sæt printerens tænd/sluk-kontakt på ON.
8. **B2B på bord eller væg:** Skru soklen fast nu (se Opsætning), før dæmpepladen lægges i. Læg dæmpepladen i lommen i soklen med keglerne nedad. Stil printeren på den med udgangen mod udgangsmodulet, og sæt C13 i den. Læg rulle og farvebånd i, og luk lågen.
9. Skru kamlåsen i kappens venstre ende med kammen pegende nedad (åben).
10. Sæt kappen ned over soklen 10 mm til venstre for sin plads, så krogene går ned gennem de åbne slidser i læben. Skub kappen til højre ind over studsen. De sidste 7 mm trækker krogene den ned, så den ligger fladt på soklen. Drej så nøglen til låst.

Kappen tages af i omvendt rækkefølge: lås op, skub kappen 10 mm til venstre (krogene slipper) og løft den af. Skift snoren, når den er blevet flad, fx ved service en gang om året.

Der skal ikke loddes. Den eneste 230 V-ledning er et færdigt kabel med støbte stik.

## Opsætning

- **B2C (bord):** Stil den på bordet med gummifødderne. Kablet kommer ud bagtil ved bordet.
- **B2B (bord eller disk):** Skru soklen fast med 2 SPUN+ 4,0 × 16 gennem de 2 tårne i lommen, før dæmpepladen og printeren sættes i.
- **B2B (væg):**
  1. Sæt de 2 dyvelstifter (Ø6 × 16) i det ene L-beslags ende og skub det andet på, så de 2 beslag bliver til én lige vinkel på 476 mm.
  2. Hold vinklen i vater mod væggen, mærk de 8 huller, bor og skru den fast med 8 skruer og dybler (5 × 50, til væggens materiale). Skruehovederne skal ligge plant i bagpladen.
  3. Stil soklen og udgangsmodulet (skruet sammen) på hylden, skubbet helt ind til bagpladen og flugtende med hyldens ender. Skru soklen ned i det venstre beslag med 2 SPUN+ 4,0 × 16 indefra, før dæmpepladen lægges i. Skru det højre beslag op i udgangsmodulet med 2 SPUN+ 4,0 × 25 nedefra.
  4. Strømkablet går fra soklen ned i rillen i bagpladen yderst til venstre og videre ned ad væggen (i en kabelskinne).

  Når printeren sidder på, er vægskruerne skjult bag den, og når kappen er låst, er skruerne i soklen også skjult. Så kan beslaget ikke skrues af uden nøglen. Stedet monterer selv efter denne guide.

## Software

Som v2: Pi Zero 2 WH med CUPS og Gutenprint (`selphy_print`), print via IPP på wifi og LED på GPIO18 (svag Selfi-grøn, pulserer mens et print er på vej, højst 30 % lysstyrke).

## Kendte risici

- **Fald (B2C):** Keglerne giver 6–7 mm knusevej. Det svarer til ca. 50–60 g på printeren ved fald fra 0,3 m (fra et bord eller ud af hænderne) og ca. 130–180 g fra 0,75 m. Uden dæmpepladen er det flere hundrede g. Et fald fra 0,75 m flat på bunden kan stadig skade printeren. Det er et skøn, ikke målt: test med prøvestykket og et fald af hele kassen med en dummy-vægt på 5,8 kg. Under forsendelse er skummet i transportkassen stadig den vigtigste beskyttelse.
- **Løft:** Løft med en hånd i hvert gribehak, og hold den vandret. Løft aldrig i udtagslommen eller skærmen. Hvert hak tager ca. 40 N. Det venstre hak sidder i kappen, så soklen hænger i de 6 kroge (ca. 27 N hver), og samlingen mellem sokkel og udgangsmodul (tunge og studs) tager ca. 8 MPa. Det er godt inden for ASA. Kappen skal være låst, når den bæres.
- **Vægbeslag:** Regnet med 500 N på forkanten plus printerens 80 N: ca. 60 Nm pr. beslag og ca. 7 MPa i hjørnet (hylde og bagplade 238 × 15). Printet på enden bøjer begge ben langs lagene (ASA ca. 30 MPa), så der er mindst 3–4 gange sikkerhed, også med kun 6 vægge og 25 % fyld. Bagpladens nederste kant trykker mod væggen, og de øverste skruer (95 mm højere) tager ca. 320 N hver. De 4 skruer pr. beslag skal sidde i dybler, der passer til væggen. I gips skal der bruges gipsdybler i metal eller skrues i en lægte.

- Alle mål på printeren er fra DNP's datablad og skal måles. Det gælder især papirets udkørsel og højden (toppen sidder 4 mm over printeren).
- Med flad top kan en gæst stille en dåse på toppen. Det har Esben valgt. Spild løber af, fordi toppen ingen åbninger har, og fugerne er tætnet med skumsnor.
- Snoren trykker kappen op med et skøn på 0,1–0,2 N pr. mm, i alt ca. 80–160 N for soklens 0,8 m (snoren om studsen trykker til siden og løfter ikke). Det er krogene, der holder den nede, og ikke kappens vægt. Hvis kappen er svær at skubbe på, så smør snoren og prøv igen. Hjælper det ikke, kan rillerne gøres 0,1 mm dybere.
- Snoren glider langs rillen de sidste 7 mm, mens den klemmes. Uden fedt kan den trække sig skæv, så tjek den, når kappen har været af.
- Under printeren er der kun 0,75 mm mellem læben og printeren. Det skal tjekkes, når printeren er målt.
- 4,5×8-print kan ikke komme ud. Lommen passer til 4×6, 2×6-striber og 4×4.
- Hvis vinklen ikke sidder i vater, står printeren skævt. Brug vaterpas, og sæt altid dyvelstifterne i, så de 2 beslag flugter.
- Printes L-beslaget fladt (hylden på pladen), bøjer bagpladen på tværs af lagene og kan flække i hjørnet. Print det på enden.
- Kabinettet er 476 mm langt, så printerkassen fra emballage v2 er for lille. Der skal en ny kasse til.
