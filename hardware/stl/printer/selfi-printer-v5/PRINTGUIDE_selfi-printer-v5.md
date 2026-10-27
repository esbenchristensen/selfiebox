# Selfi printer v5: printguide

**Version:** selfi-printer-v5 (27. okt. 2026). Alle filer i mappen starter med `selfi-printer-v5_`. CAD-kilden er `hardware/cad/selfi_printer_v5.scad` i esbenchristensen/selfiebox. Filerne laves med `python3 hardware/tools/make_printer.py selfi-printer-v5`. v1–v4 må ikke printes.

**v5 er v4 uden pakninger og uden kroge** (Esben 27. okt. 2026: ingen pakninger nogen steder, de gør det alt for komplekst at samle; samme beslutning som boksen halo-gen2-v27). Se `selfi-printer-v5_snit-fuger.png` (v4 og v5 side om side).

- **Væk:** skumsnoren (RS 234-2906) og silikonefedtet, rillen i soklens overside (2,0 × 1,0) og de korte grene ved studsen, rillen rundt om udgangsmodulets studs (2,0 × 0,7) og kappens indføringsfase ved højre kant.
- **Krogene er også væk.** De 6 kroge på kappen og ramperne og slidserne i soklens læbe var der kun for at trække kappen ned mod snoren, som skubbede den op. Uden snor ligger kappen på soklen ved sin egen vægt, som i v3. Studsen holder højre ende, kamlåsen holder venstre ende nede og fast, og læben indenfor kappens væg (0,3 mm luft) holder den på plads til siderne.
- **Nye dele: kappe, sokkel og udgangsmodul.** Dæmpeplade og L-beslag er som i v4. Ydermålene er de samme, så emballagen passer stadig.
- **Tæt ved formen:** fugerne er lukket af læben indenfor kappens væg og af studsen inde i kappens ende. Spild på toppen løber af. Brug den indendørs som før.
- **Samlingen** er kortere: ingen snor at lægge i og intet fedt. Kappen sænkes stadig ned 10 mm til venstre og skubbes ind over studsen, men nu glider den bare på plads.
- **Soklen kan printes på H2C** (rettet i v5, fejlen var der også i v4): tungen under udgangsmodulet er 17,5 mm (v4: 35), så soklen er 304,7 mm lang og ligger inden for H2C's sikre område (306). v4's sokkel var 322 mm og kunne ikke være på pladen. De 2 skruer gennem tungen sidder 9,5 mm inde (v4: 20).
- **Dæmpepladen ligger fladt på pladen** (rettet i v5, også i v4): i v4 sad de 4 små stop ved printerens ender oven på dæmpepladen, så printfilen stod på stoppene med pladen 3 mm oppe i luften. Nu er stoppene finner på soklens lommevægge, der går op gennem hak i dæmpepladen (0,3 mm luft), og dæmpepladen printes med pladen fladt ned og keglerne op. Pladen kan stadig glide ned forbi finnerne, når keglerne knuses. Printeren har stadig 0,3 mm til stoppene.
- **Tjekket i CAD:** kappe, sokkel, udgangsmodul, dæmpeplade og printeren er skåret mod hinanden i samlet stand: intet overlap (som i v4). Alle printfiler er én lukket krop.

Fra v4 (uændret):

- **Støddæmpning inden for de samme mål.** Printeren står ikke længere direkte på soklen, men på en dæmpeplade (1,6 mm) med 56 hule knusekegler (8,4 mm høje, væg 0,45) ned mod soklens 2 mm-bund. Keglerne står i 2 ringe tæt ved kanten, hvor bunden bæres af soklens vægge. Hvis kassen tabes, knuses keglerne i stedet for printeren. Ved enderne sidder 4 kegler på kappens endevæg og 2 på bøjler i udgangsmodulet, 1 mm fra printeren. Dæmpepladen er en billig sliddel, der skiftes efter et hårdt fald. Se `selfi-printer-v5_snit-daempning.png`.
- **Gribehak i begge ender.** Kabinettet løftes med en hånd i hvert hak (76 × 22 mm, 20 mm dybe). Loftet i hakket vinkler 20° opad indad, så fingerspidserne hager sig op bag kanten. Hakkene er lukket bagtil, så kabinettet stadig er tæt, og gulvet hælder 0,7 mm udad, så vand løber ud. Det venstre sidder midt på kappens ende under nøglelåsen. Det højre sidder i udgangsmodulets ende, 8 mm lavere og 10 mm længere bagud, fordi rutsjebanen er over det. Soklens læbe er skåret væk bag det venstre hak. Se `selfi-printer-v5_skitse_gribehak.png`.
- **Skjult vægbeslag.** I stedet for konsoller med knægte og vægskinner er der 2 ens L-beslag: en hylde på 15 mm under printeren og en bagplade på 15 mm, der står 95 mm op bag printeren og skrues i væggen dér. Forfra ses kun hyldens kant, der flugter med printerens ender (2 × 238 mm, der mødes under midten og samles med 2 dyvelstifter). Printeren sidder 15 mm ud fra væggen. Regnet til 500 N på forkanten (en der læner sig på printeren).

Fra v3:

- **Flad top.** Kabinettet er 217 mm højt, og toppen har ingen åbninger.
- **"Dit print"** står i hvidt med en grøn pil over udtagslommen.
- **Strømkablet kan ikke tages ud.** Der er ingen strømindgang udenpå. Kablet (Schuko → C13 vinklet) trykkes ind i et spor under soklen bagtil, går op i bagrummet og sættes direkte i printeren. En strip om kablet og ankeret holder det, så kablet ikke kan trækkes ud.
- **Vægbeslag (B2B).** 2 ens skjulte L-beslag, hvert skruet i væggen med 4 skruer bag printeren. Soklen skrues ned i det venstre beslag indefra, og det højre beslag skrues op i udgangsmodulet nedefra. Når printeren sidder på, kan ingen komme til vægskruerne, så der skal ikke bruges sikkerhedsskruer. Strømkablet går ned i en rille i bagpladen.

Resten er som v2. Printeren (DNP QW410) står drejet 90°, så papiret kan køre frit i et lukket rum på 190 mm. Printet falder ned på en rutsjebane på 30° og ender i en lomme forneden med stoplæbe og dræn. Skærmen sidder på 54°, kappen låses med nøgle, og RGB-lyset kører på printerens egen 5 V.

Kabinettet er 476 × 222,5 × 217,2 mm og består af 4 printede dele: kappe, sokkel, dæmpeplade og udgangsmodul. På væg bruges desuden 2 skjulte L-beslag.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning, og sokkel, kappe, udgangsmodul, dæmpeplade og L-beslag er tjekket mod H2C's sikre område (285 × 306 × 305 mm, `hardware/tools/check_bed.py`; logo og tekst printes i deres del). Print én del pr. plade.

## Mål printeren før første print

Kabinettet er tegnet efter DNP's datablad og fotos, ikke efter en rigtig QW410. Prøvestykkerne i hurtigsættet (`selfi-printer-v5-hurtig`) er lavet til at måle disse ting:

- **Gribehakkene:** `proeve-greb_kappe` og `proeve-greb_udgang` viser, om fingrene kan komme ind og hage sig fast.
- **Knusekeglerne:** `proeve-knusekegler_daempeplade` er et hjørne af dæmpepladen. Tryk en kegle flad i en skruestik eller med en vægt. Den skal give efter ved ca. 5–10 kg og knuses, mens pladen holder. Er den meget stivere, skal keglevæggen være tyndere.
- **Printerens fødder:** De skal stå ude over keglerne, inden for ca. 35 mm fra pladens kant. Står de længere inde, skal ringene flyttes.
- **Fugerne:** `proeve-fuge_sokkel` er soklens hjørne med læben: kappens kant skal stå fladt på soklen, og læben skal gå fri indenfor. `proeve-fuge_kappe` og `proeve-fuge_udgang` viser, om kappen glider over studsen med 0,3 mm luft.

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
| `selfi-printer-v5_kappe_flerfarvet.3mf` | Kappe + logo | ASA sort, logo i hvid og grøn via AMS · venstre ende ned · 0,2 mm lag · 8 vægge (3,2 mm) · 15 % fyld · ingen støtte · ca. 760 g |
| `selfi-printer-v5_udgang_flerfarvet.3mf` | Udgangsmodul + "Dit print" og pil | ASA sort, tekst i hvid og pil i grøn via AMS · højre ende ned · 0,2 mm lag · 8 vægge · 15 % fyld · ingen støtte · ca. 960 g |
| `selfi-printer-v5_sokkel.stl` | Sokkel under printeren | ASA sort · bunden ned · 6 vægge · 40 % fyld · ingen støtte · ca. 300 g |
| `selfi-printer-v5_daempeplade.stl` | Dæmpeplade med 56 knusekegler | ASA sort · pladen ned, keglerne op · 0,2 mm lag · linjebredde 0,45 (keglerne er én streg) · massiv plade · ingen støtte · ca. 85 g. Print gerne 2, så der er en i reserve |
| `selfi-printer-v5_konsol.stl` | Skjult L-beslag (kun B2B på væg), **print 2** | ASA sort · **på enden** (L-profilen på pladen, 238 høj, som filen ligger), så begge ben bøjer langs lagene · 6 vægge · 25 % gyroid · ingen støtte · brim · ca. 450 g pr. stk. |
| `selfi-printer-v5_kappe.stl`, `_udgang.stl`, `_logo-*.stl`, `_tekst-*.stl` | De samme dele som enkelte filer | Til sliceren, hvis 3MF ikke bruges |

Kappen og udgangsmodulet printes stående på en ende uden støtte. Logo og tekst ligger på den lodrette front, så farveskiftet sker lag for lag. Lad 50 mm stå fri langs én kant af pladen til prime-tårnet.

## Samling

1. Print delene. Der er ingen støtte at fjerne.
2. Sæt 6 gummifødder i fordybningerne: 4 under soklen og 2 under udgangsmodulet. Spring dem over på væg.
3. (v5: ingen snor. Rillerne er væk, så der er intet at lægge i.)
4. Stil udgangsmodulet på soklens tunge og skru de 2 skruer i nedefra gennem tungen (3,5 × 12).
5. **Strømkabel:** Tryk kablet ind i sporet under soklen bagtil, så C13-enden kommer op i bagrummet. Lad kablet ligge løst, så det kan nå printerens C14 bagpå. Spænd en strip om kablet og gennem hullet i ankeret.
6. Klip LED-strippen til 9 LED og skub den ind i skinnen på udgangsrummets bagvæg fra venstre.
7. Sæt Pi Zero i rillerne og forbind alt efter `selfi-printer-v5_ledningsdiagram.png`. Sæt printerens tænd/sluk-kontakt på ON.
8. **B2B på bord eller væg:** Skru soklen fast nu (se Opsætning), før dæmpepladen lægges i. Læg dæmpepladen i lommen i soklen med keglerne nedad. Stil printeren på den med udgangen mod udgangsmodulet, og sæt C13 i den. Læg rulle og farvebånd i, og luk lågen.
9. Skru kamlåsen i kappens venstre ende med kammen pegende nedad (åben).
10. Sæt kappen ned over soklen 10 mm til venstre for sin plads, uden for læben. Skub kappen til højre ind over studsen, til den står mod udgangsmodulet (skyggefugen er 1 mm). Den ligger fladt på soklen af sig selv. Drej så nøglen til låst.

Kappen tages af i omvendt rækkefølge: lås op, skub kappen 10 mm til venstre og løft den af. Der er ingen snor, der skal skiftes.

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
- **Løft:** Løft med en hånd i hvert gribehak, og hold den vandret. Løft aldrig i udtagslommen eller skærmen. Hvert hak tager ca. 40 N. Det venstre hak sidder i kappen, så soklens venstre ende hænger i kamlåsen (kammen under holderens tag, ca. 40 N; v4 fordelte det på 6 kroge), og samlingen mellem sokkel og udgangsmodul (tunge og studs) tog ca. 8 MPa i v4. I v5 er tungen halvt så lang, så skønnet er ca. det dobbelte (ca. 16 MPa), stadig under ASA's ca. 40 MPa; studsen inde i kappen tager en del af det. Prøv et løft på første print. **Kappen skal være låst, når den bæres**, ellers løftes kappen af soklen.
- **Vægbeslag:** Regnet med 500 N på forkanten plus printerens 80 N: ca. 60 Nm pr. beslag og ca. 7 MPa i hjørnet (hylde og bagplade 238 × 15). Printet på enden bøjer begge ben langs lagene (ASA ca. 30 MPa), så der er mindst 3–4 gange sikkerhed, også med kun 6 vægge og 25 % fyld. Bagpladens nederste kant trykker mod væggen, og de øverste skruer (95 mm højere) tager ca. 320 N hver. De 4 skruer pr. beslag skal sidde i dybler, der passer til væggen. I gips skal der bruges gipsdybler i metal eller skrues i en lægte.

- Alle mål på printeren er fra DNP's datablad og skal måles. Det gælder især papirets udkørsel og højden (toppen sidder 4 mm over printeren).
- Med flad top kan en gæst stille en dåse på toppen. Det har Esben valgt. Spild løber af, fordi toppen ingen åbninger har. Fugerne er kun tætte ved formen (læbe og studs), ikke vandtætte.
- Uden kroge kan kappens langvægge midt på løftes en smule med et værktøj, når den er låst (kun enderne er holdt). Læben indenfor gør, at man ikke kan komme ind til printeren den vej. Vil vi have mere, kan krogene komme tilbage uden snor.
- Under printeren er der kun 0,75 mm mellem læben og printeren. Det skal tjekkes, når printeren er målt.
- 4,5×8-print kan ikke komme ud. Lommen passer til 4×6, 2×6-striber og 4×4.
- Hvis vinklen ikke sidder i vater, står printeren skævt. Brug vaterpas, og sæt altid dyvelstifterne i, så de 2 beslag flugter.
- Printes L-beslaget fladt (hylden på pladen), bøjer bagpladen på tværs af lagene og kan flække i hjørnet. Print det på enden.
- Kabinettet er 476 mm langt, så printerkassen fra emballage v2 er for lille. Der skal en ny kasse til.
