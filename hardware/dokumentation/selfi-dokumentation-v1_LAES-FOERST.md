# Selfi Boks: krav til dokumentation og mærkning (version 1)

**Version:** selfi-dokumentation-v1, 19. okt. 2026. Gælder **halo-gen2-v8** (Selfi Boks gen 2, type SB2). Lavet af Claude efter Esbens ønske om at få styr på alle krav og selv erklære det, vi kan.

Kort sagt: **Selfi er fabrikant.** Når I samler boksen af købte dele og stiller den til rådighed under jeres eget navn (salg, leje eller abonnement tæller alle som "gøre tilgængelig på markedet"), har I samme ansvar som enhver producent af elektronik. Det kan næsten alt klares med selverklæring (modul A, intern produktionskontrol). Der er **intet krav om et bemyndiget organ eller et laboratorium**, så længe tjeklisterne i den tekniske fil er gennemført og boksen bygges som tegnet.

## Hvad er lavet nu

| Dokument | Hvor | Status |
|---|---|---|
| EU-overensstemmelseserklæring (fuld) | selfi.dk/dokumentation/overensstemmelseserklaering + `halo-gen2-v8_eu-overensstemmelseserklaering.pdf` | Klar, men adresse/CVR mangler (se "Det skal I gøre") |
| Brugsanvisning og sikkerhedsinformation på dansk | selfi.dk/dokumentation/brugsanvisning + `halo-gen2-v8_brugsanvisning-og-sikkerhed.pdf` (følger med boksen) | Klar |
| Typeskilt (CE, affaldsspand, fabrikant, type, serienr., mærkedata) | `halo-gen2-v8_typeskilt.svg/.pdf` | Klar til tryk, 40 × 70 mm |
| Teknisk fil (RED bilag V) med risikovurdering, EMC-, radio-, cyber- og RoHS-vurdering | `halo-gen2-v8_teknisk-fil.md` | Udkast: tjeklisterne skal krydses af før første levering |
| Produktionslog og sluttest pr. boks | `halo-gen2-v8_produktionslog.xlsx` | Skabelon |
| Skilt ved boksen til gæsterne (GDPR lag 1) + skærmtekster til samtykke | `selfi-gdpr-v1_skilt-ved-boksen.pdf`, `selfi-gdpr-v1_skaermtekster-og-krav-til-platformen.md` | Klar |
| Information til gæster (GDPR lag 2) | selfi.dk/gaester | Klar |
| Databehandleraftale (GDPR art. 28) | selfi.dk/databehandleraftale | Klar |
| Fortegnelse, konsekvensanalyse og procedure for brud og sårbarheder | `selfi-gdpr-v1_fortegnelse-dpia-og-haendelser.md` | Klar |
| Privatlivspolitik, cookies, handelsbetingelser (B2B) | selfi.dk/privatliv, /cookies, /vilkaar | Klar |
| Leverandørerklæringer, der skal hentes | `selfi-dokumentation-v1_leverandoererklaeringer.md` | Liste + mailskabelon |
| Kontakt for sikkerhedshuller | selfi.dk/.well-known/security.txt og /dokumentation#sikkerhedshuller | Klar |

## Det skal I gøre (kan ikke laves for jer)

1. **Firmaoplysninger.** Skriv juridisk navn, CVR, adresse og en kontakt-e-mail i `web/lib/company.ts` (eller send dem i tråden, så retter Claude det). Erklæringen, typeskiltet og hjemmesiden er først fuldstændige med en postadresse (RED art. 10, stk. 6, GPSR art. 9, e-handelsloven § 7). Typeskiltet har et felt til adressen.
2. **Registrér Selfi som producent af elektronik hos Dansk Producentansvar** (producentansvar.dk), senest 14 dage før den første boks leveres. Kategori: *2. Skærme og udstyr med skærme over 100 cm²* (10"-skærmen er ca. 280 cm²), erhverv (B2B). Indberet antal og vægt hvert år senest 31. marts. Registreringen er et gebyr, ikke en godkendelse. Kræver tilslutning til en kollektiv ordning eller en individuel løsning for erhvervsudstyr: da I tager boksene retur selv, er en individuel ordning for B2B oplagt.
3. **Emballage.** Sender I bokse i en transportkasse, der bliver hos kunden, er I emballageproducent og skal registreres hos Dansk Producentansvar (producentansvar for emballage). Bliver kassen hos jer og genbruges, er den genbrugsemballage; tjek med DPA, om I er under bagatelgrænsen.
4. **Produktansvarsforsikring.** Ikke lovkrav, men tegn en erhvervs- og produktansvarsforsikring, der dækker egenproducerede elektriske produkter. Det er den eneste ting her, der beskytter jer, hvis en boks alligevel skader nogen.
5. **Underskriv erklæringen** (print PDF'en og skriv under, eller lad den digitale stå), og gem den i 10 år sammen med den tekniske fil.
6. **Platformen (selfiebox-platform)** skal gøre det, som teksterne lover. Se `selfi-gdpr-v1_skaermtekster-og-krav-til-platformen.md`: slettefrister, aldersspørgsmål, ingen optagelse før start, ingen standardadgangskoder, Bluetooth slået fra, 5 GHz-begrænsning udendørs, blink højst 3 Hz. Det er en opgave til en tråd med adgang til den repo.

## Alle krav: gælder de, og hvordan klares de

Markering: ✅ klaret med selverklæring, 🟡 selverklæring, men kræver jeres egen kontrol/test først, 🔴 kræver noget udefra, ⚪ gælder ikke nu.

| Krav | Gælder? | Hvordan | Status |
|---|---|---|---|
| **CE-mærkning, radioudstyrsdirektivet (RED) 2014/53/EU** | Ja. Boksen har Wi-Fi (Pi 5, Gledopto, XIAO ESP32-S3) og evt. 4G, så hele boksen er radioudstyr. RED dækker også el-sikkerhed og EMC, så LVD- og EMC-direktivet bruges ikke særskilt. | Modul A (selverklæring). Moduler med egen CE bygget ind uændret. | 🟡 |
| RED 3.1(a) el-sikkerhed (EN IEC 62368-1) | Ja, uden nedre spændingsgrænse | Risikovurdering i den tekniske fil. Netdelen er Mean Wells CE-godkendte adapter; inde i boksen kun 24 V/5 V. **Åbent punkt: brand (sikring 3 A + egne fejltest).** Se nedenfor. | 🟡 |
| RED 3.1(a) elektromagnetiske felter (EN 62311) | Ja | Beregning i teknisk fil: langt under grænser, også med 4G | ✅ |
| RED 3.1(a) fotobiologisk sikkerhed (EN 62471) | Ja, LED-lys | Diffust lys bag lysring, 4000 K: fritaget gruppe/RG0 ved skøn. Ingen måling krævet. | ✅ |
| RED 3.1(b) EMC (EN 301 489, EN 55032/55035) | Ja | Teknisk vurdering (lovligt efter RED art. 17, stk. 2: modul A kræver ikke laboratorietest for 3.1(b)). Egen kontrol: radio/DAB/FM i nærheden, Wi-Fi-hastighed, touch med lys tændt. | 🟡 (🔴 valgfrit: en EMC-forscanning hos fx FORCE Technology koster typisk 10–20.000 kr. og fjerner den største restrisiko) |
| RED 3.2 radio | Ja | Kun certificerede moduler med egne antenner, ingen ændringer. Modulernes testrapporter gælder (ETSI EG 203 367). | ✅ når leverandørernes erklæringer er gemt |
| **RED 3.3(d)(e) cybersikkerhed, delegeret forordning (EU) 2022/30** (gælder fra 1. aug. 2025) | Ja: internetforbundet, og behandler personoplysninger (billeder, video, lyd, numre) | EN 18031-1 og -2, anvendt fuldt. Modul A er kun tilladt, hvis standarden anvendes fuldt og ingen "spring adgangskode over"-mulighed findes. Tjekliste i teknisk fil. | 🟡 (skal være sandt i softwaren) |
| RED 3.3(f) betalinger (EN 18031-3) | ⚪ Kun hvis boksen selv håndterer betaling (fotomodul med betaling pr. foto). Vurdér igen, når printermodulet kommer. | | ⚪ |
| RED art. 10: info om frekvenser, sendeeffekt, begrænsninger | Ja | I brugsanvisningen. 5150–5350 MHz kun indendørs: står i brugsanvisningen og på emballagen (indlæg). | ✅ |
| **RoHS 2011/65/EU** (EN IEC 63000) | Ja | Leverandørernes RoHS-erklæringer + filamentets datablad. Ingen lodning, så I tilfører ikke selv bly. | 🟡 hent erklæringerne |
| REACH art. 33 (SVHC over 0,1 %) og SCIP-databasen | Ja, hvis en del indeholder SVHC (typisk kabler, stik) | Bed leverandører om REACH-erklæring. Indeholder noget SVHC, skal kunden informeres og varen anmeldes i ECHA's SCIP-database. | 🟡 |
| **Cyberrobusthedsforordningen (CRA) (EU) 2024/2847** | Indberetningspligten gælder fra 11. sep. 2026 for produkter allerede på markedet: aktivt udnyttede sårbarheder og alvorlige hændelser indberettes inden 24 timer via ENISA's platform. Resten (CE efter CRA) fra 11. dec. 2027. Fotoboks = standardkategori, selverklæring. | Procedure i `selfi-gdpr-v1_fortegnelse-dpia-og-haendelser.md`, kontakt i security.txt | ✅ (procedure) |
| **Produktsikkerhed, GPSR (EU) 2023/988** | Delvis: boksen er erhvervsudstyr, men forbrugere (gæster) betjener den selv, så GPSR gælder for det, RED ikke dækker: sporbarhed, fabrikantens navn og post/e-mail-adresse på produktet, sikkerhedsinfo på dansk, ulykkesregister og indberetning via Safety Business Gateway | Typeskilt, brugsanvisning, produktionslog, procedure | ✅ |
| **Elektronikaffald (WEEE)**, elektronikaffaldsbekendtgørelsen | Ja | Registrering hos DPA (punkt 2 ovenfor), affaldsspand med streg under (sat på efter 13. aug. 2005) på typeskiltet, info i brugsanvisningen, tag boksene retur | 🔴 registrering (gebyr, ikke godkendelse) |
| Batteriforordningen (EU) 2023/1542 | ⚪ Ingen batterier. Sætter I et RTC-batteri på Pi'en, gælder den. | | ⚪ |
| Emballage (PPWR (EU) 2025/40 og dansk producentansvar) | Måske, se punkt 3 | | 🟡 |
| Ecodesign standby (EU) 2023/826 | ⚪ Gælder husholdnings- og kontorudstyr. En vægmonteret erhvervsfotoboks er ikke omfattet. Adapteren skal opfylde (EU) 2019/1782 (Mean Well GST90A er niveau VI). | | ⚪ |
| Tilgængelighed (EAA, direktiv 2019/882, gælder fra 28. jun. 2025) | ⚪ Fotobokse er ikke på listen (betalingsterminaler, billetautomater, check-in, informationsterminaler). Kommer betaling i boksen, så vurdér igen. Hjemmesiden er B2B og ikke omfattet. Anbefaling i brugsanvisningen: skærm 120–140 cm over gulv. | | ⚪ |
| IP-klasse (IPX4) | Kun hvis I skriver det. Skriv **ikke** IPX4 eller "vandtæt" uden en sprøjtetest efter EN 60529. Brugsanvisningen siger "tåler stænk og spild under tag, ikke vandtæt". | | ✅ |
| **GDPR**: billeder, video, lyd, numre | Ja. Stedet er dataansvarligt, Selfi databehandler | Databehandleraftale, gæsteinfo, skilt, skærmtekster, fortegnelse, konsekvensanalyse | ✅ (🟡 platformen skal leve op til teksterne) |
| Markedsføringsloven § 10 (SMS-samtykke) | Ja, for stedet | Samtykketekst med stedets navn, kanal og emne; afmelding i hver SMS | ✅ tekst, 🟡 platform |
| Konkurrencer/lodtrækninger (spilleloven) | Ja, når boksen har konkurrencer | Kun gratis deltagelse; deltagelse må ikke kræve samtykke til markedsføring | ✅ (i vilkår og gæsteinfo) |
| AI-forordningen (EU) 2024/1689 | ⚪ Ingen ansigtsgenkendelse eller følelsesgenkendelse. Laver boksen AI-genererede billeder eller stemmer, skal de mærkes som AI (art. 50, gælder fra 2. aug. 2026). | | ⚪ |
| Tv-overvågningsloven | ⚪ Boksen optager kun, når gæsten selv starter. Den overvåger ikke. Hold det sådan. | | ⚪ |
| E-handelsloven § 7 (navn, adresse, CVR, e-mail på hjemmesiden) | Ja | Footer viser dem fra `web/lib/company.ts` | 🔴 udfyld (punkt 1) |
| Cookiebekendtgørelsen | Ja, men siden har ingen cookies, der kræver samtykke | selfi.dk/cookies. Tilføjes statistik/pixel senere, skal der et samtykkebanner på. | ✅ |
| Bogføringsloven | Ja | Gem bilag 5 år (står i privatlivspolitikken) | ✅ |
| El-installation | ⚪ Boksen sættes i en stikkontakt. Der skal ikke en autoriseret elinstallatør til, så længe I ikke ændrer faste installationer. | | ⚪ |

## Det vigtigste åbne tekniske punkt: brand

EN IEC 62368-1 inddeler strømkredse efter, hvor meget effekt der er til rådighed ved en fejl. 24 V-siden fra en 90 W-adapter, der først slår fra ved 105–150 % last, kan give over 100 W i en fejl og er så **PS3**. PS3-kredse skal sidde i et brandkabinet af mindst **V-1**-materiale (UL 94). Almindelig ASA er normalt kun **HB**, så det kan boksen ikke leve op til, som den er nu.

Løsning uden ekstra dele:

1. **Mindre sikring (ca. 2 kr., skal gøres):** brug en **3 A fladsikring** (ATO, violet, Littelfuse 0287003.PXCN) i den nuværende holder på 24 V-plus i stedet for 5 A. 3,15 A træg findes kun som 5 × 20 mm glassikring og ville kræve en anden holder. Med en sikring på højst 100 W / 24 V = 4,1 A er alt efter sikringen en begrænset strømkilde (62368-1 bilag Q, tabel Q.2) og dermed PS2. Normalforbrug er ca. 14 W. Spids (fotolys + Pi + RGB) er ca. 2,2 A, når RGB-styringens strømbegrænser (WLED "max current") står på 2000 mA. **Sikringen er nødvendig, må ikke undværes og skal være 3 A (ledningsdiagram og indkøbsliste er rettet).**
2. **Egne fejltest (62368-1 afsnit 6.4.3, "ingen antændelse ved enkeltfejl"):** kortslut og overbelast de udgange, der står i den tekniske fil, på én prøveboks og se, at sikringen eller forsyningen slår fra, uden flammer, smeltet plast eller over 300 °C. Det kan I gøre selv med et multimeter og et termometer, og det er jeres bevis. Ingen V-1-krav til kabinettet derefter.
3. Kun hvis testen fejler: flammehæmmende filament (V-0) til bagrammen.

Se den fulde risikovurdering og testlisten i `halo-gen2-v8_teknisk-fil.md`.

## Kilder

- Radioudstyrsdirektivet 2014/53/EU, art. 10, 17 og bilag II, V, VI, VII. EU's Blue Guide 2022 (leje tæller som at gøre tilgængelig).
- Delegeret forordning (EU) 2022/30 og gennemførelsesafgørelse (EU) 2025/138 (EN 18031 med begrænsninger for adgangskoder).
- Raspberry Pi 5 EU-overensstemmelseserklæring, 17. jul. 2025 (RED, RoHS, EN 18031-1).
- Elektronikaffaldsbekendtgørelsen (BEK nr. 942 af 20/06/2025): registrering senest 14 dage før markedsføring, årlig indberetning 31. marts.
- Cyberrobusthedsforordningen (EU) 2024/2847 art. 14 og 69.
- GPSR (EU) 2023/988, art. 2, 9 og 20.
- GDPR art. 13, 28, 30, 32–35, markedsføringslovens § 10, e-handelsloven § 7.

Det her er en grundig gennemgang, ikke juridisk rådgivning. Er I i tvivl om et punkt, så spørg Sikkerhedsstyrelsen (markedsovervågning af elektronik, gratis vejledning) eller Dansk Producentansvar.
