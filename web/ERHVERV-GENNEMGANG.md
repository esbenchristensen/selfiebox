# Gennemgang af selfi.dk/erhverv

> **Status 21. oktober 2026, aften:** A-listen er bygget på `/erhverv` (afsnit 7 nederst siger, hvad der er gjort ved hvert punkt). Alt, vi ikke har, er opdigtet eller sat som pladsholder i `lib/erhverv/placeholder.ts` og markeret gult på siden, fordi siden endnu kun er til os selv. `/events` er fjernet, og Smukfest-kataloget ligger på `/erhverv/smukfest`.

*21. oktober 2026. Grundlag: koden i `web/`, `TEKSTSTRATEGI.md`, `SIDESTRUKTUR.md`, `KONKURRENTER.md`, handelsbetingelser og databehandleraftale, GDPR-kravene (`hardware/dokumentation/selfi-gdpr-v1_*`), `docs/funktioner.md` i platform-repoet (hvad der er bygget), kundekatalogerne, markedslisten, brandpakken, siden set på mobil (375 px) og computer (1440 px), og den udgivne side på www.selfi.dk/erhverv.*

Konkurrenterne står i `KONKURRENTER-ERHVERV.md`.

## 1. Det, jeg ved om produktet og kunden, før jeg skriver

**Boksen.** Selfi gen 2: 222,5 × 306 × 70 mm, ca. 1,6 kg, 10" touchskærm, 12 MP-kamera med autofokus (Wide, 120°), lysring (COB-lys til foto, RGBW til farver), Raspberry Pi 5, 90 W strømforsyning. Hænger på vægbeslag med sikkerhedsskrue. Top, sider og kabinet printes i stedets form og farver. Mikrofonkort og 4G er tilvalg og sidder ikke i alle bokse. Video er 900 × 1600, ikke Full HD. Lysringens farve følger endnu ikke temaet (kun styrke). Printeren findes kun som prototype. Navnet er **Selfi**, ikke Selfi Boks (besluttet 21. okt. i platform-repoet; siden bruger stadig "Selfi Boks" 159 steder).

**Det, der er med.** Design, software, kontrolpanel, vægbeslag, monteringsguide, overvågning, opdateringer, support og ny boks ved fejl (vilkår § 2 og § 6). Tilvalg kun når de står i tilbuddet: 4G, printer, ekstra designs.

**Det, stedet skal.** Hænge boksen op efter guiden (ca. 20 minutter), stikkontakt med HFI-relæ inden for kablet, wifi (hvis aftalt), sætte skiltet til gæsterne op, være dataansvarlig for gæsternes data.

**Det, vi lover af service.** Overvågning (boksen melder sig, alarm ved fejl), signerede opdateringer, døgnsupport, ny boks ved fejl og almindelig slitage uden regning. Ingen lovet oppetid. Tyveri og hærværk: "står i tilbuddet; står der intet, betaler kunden kostpris" (vilkår § 6).

**Det, der ikke er besluttet** (`SIDESTRUKTUR.md`): binding og opsigelse, internet (wifi eller 4G), prøveperiode, om en ny boks også gælder ved tyveri og skader fra gæster, prisen (tekststrategien siger 995 kr./md. ekskl. moms, `content.ts` siger "aftales pr. kunde", vilkårene siger "abonnement faktureres forud"), svartid på henvendelser, leveringstid fra ja til boksen hænger.

**Kunden.** Ejer eller manager af et sted med gæster: bar, bodega, natklub, sportsklub, hotel, biograf, festival, park, zoo. Køber for at få flere gæster, længere ophold, genbesøg, omtale og billeder til egne kanaler. Beslutter over uger, efter en snak eller en demo, ofte med en partner eller en bestyrelse. Frygter binding, tyveri, personaletid, teknik der driller fredag kl. 23, og bøder for SMS. Søger sjældent på det; kommer mest via opsøgende salg og et link fra os. Siden skal derfor først og fremmest **holde til at blive sendt videre** til den, der skal sige ja med.

## 2. Fejlliste: det, der er galt, og hvad jeg gør ved hver

Vurderet som en barejer og en marketingchef, der ikke kender os. "Gør" er planen, ikke noget der er bygget endnu.

### Struktur og rækkefølge

| # | Fejl | Hvorfor det koster et ja | Gør |
|---|---|---|---|
| S1 | Siden er 18.400 px på computer og 24.600 px på mobil (20 og 30 skærmhøjder) med 14 sektioner | Ingen ejer læser 30 skærme. Kontaktformularen ligger sidst | Skær til 11 sektioner og ca. 10/16 skærmhøjder. Fjern det dobbelte (S2–S4) |
| S2 | Funktioner-gitteret (16 kort) og Aktiviteter (6 kort) viser det samme to gange. "Kvalitet" gentager Contentmaskinens punkt "Høj kvalitet". "Lysringen kan ses fra den anden ende af lokalet" står tre gange | Dobbelt indhold læses som fyld | Funktioner-gitteret ud (megamenuen og /funktioner bliver). Kvalitet bliver tre linjer under content-afsnittet. Lysring-sætningen står én gang |
| S3 | "Det, gæsterne får" (tre kort, et opdigtet Instagram-opslag fra "maja.k") og "Sådan virker den" (2.571 px med sticky animation) fortæller det samme forløb | Opslaget er opdigtet og ligner bevis. Animationen koster 3 skærmhøjder | Ét afsnit: "Sådan går det for gæsten" i fire korte trin. Det opdigtede opslag fjernes |
| S4 | Fotostriben (12 roterede AI-fotos med "Fredag · Bodegaen") er pynt mellem Service og FAQ | Siger intet, koster en skærmhøjde på mobil, og fotoene er AI | Ud |
| S5 | Rækkefølgen svarer ikke på ejerens spørgsmål i den orden, de kommer: hvad er det → hvad får jeg → hvad koster det → hvad skal jeg → hvad hvis det driller → hvad siger andre → hvordan kommer vi i gang. I dag kommer Service som nr. 11 og prisen slet ikke | Ejeren mister lysten, før spørgsmålene bliver besvaret | Ny rækkefølge (afsnit 5) |
| S6 | Ingen "Sådan kommer vi i gang"-afsnit (snak → design → vi printer → boksen kommer → I hænger den op → vi passer den) | B2B med møde som konvertering skal vise, hvad der sker efter "book en snak" (NN/g, Flatpay) | Nyt afsnit med fem trin. Tider som pladsholdere, til de er besluttet |
| S7 | Hero-visualen (3D-boks) og Showroom (3D-væg) er to 3D-visninger af det samme lige efter hinanden, 2.600 px tilsammen på mobil | Mobilbrugeren ser boksen to gange, før der står et argument | Hero beholder 3D-boksen. Showroomet flyttes ned under "Hvad får I" og gøres kortere |

### Det, man ikke forstår på fem sekunder

| # | Fejl | Gør |
|---|---|---|
| F1 | H1 "En fotoboks bygget til jeres sted." siger hvad, ikke hvad stedet får ud af det. Lede på 61 ord med syv stedstyper og "alle andre steder, hvor gæster samles" plus en servicedetalje ("I hænger dem selv op") | Ny H1 med resultatet og produktet: "En fotoboks i jeres design, der får gæsterne til at komme igen." Lede på to sætninger. Tre korte punkter med det, der altid er med |
| F2 | Hero-label "Til venues, klubber og festivaler". "Venues" er engelsk, og titlen i Google bruger det også | "Til barer, klubber, hoteller og festivaler" |
| F3 | Nav-link "Content" og sektionslabel "Content is king" | "Billeder og video" og en dansk label |
| F4 | Mobil: sektionslinks findes ikke (kun "Funktioner" og knappen). Man kan ikke springe til pris, service eller spørgsmål | Lille menu på mobil med sidens afsnit, eller en sticky bund-knap "Book en snak" (som /lej har) |
| F5 | Ingen telefon og ingen e-mail nogen steder (`company.email` er tom). Care-afsnittet siger "Ring eller skriv, også lørdag kl. 01", men der er intet nummer | NN/g: et skjult nummer læses som "vi vil ikke forstyrres". Telefon og e-mail i hero, kontakt og footer. Pladsholder til begge, indtil de er besluttet |

### Det, der mangler

| # | Fejl | Gør |
|---|---|---|
| M1 | **Ingen pris.** FAQ'en svarer "Book en snak". Alle danske konkurrenter med fast installation viser månedspris (Lightbooth 2.499 kr., Nordic Activation 3.920 kr.). NN/g: når prisen er skjult, går brugerne til konkurrenten; vis i det mindste eksempler | Prisafsnit med "fra X kr./md. ekskl. moms" som tydelig pladsholder, hvad der er med, hvad der er tilvalg, og binding/opsigelse som pladsholdere. FAQ-svaret skrives om, så det siger, hvad prisen afhænger af, og hvad der aldrig koster ekstra |
| M2 | **Intet bevis.** Ingen kunder, citater, tal eller cases. Showroomet viser Carlsberg, Tuborg, Red Bull, LEGOLAND, Smukfest, Roskilde, Nibe, Fårup, Zoo og Airtox med teksten "Konceptdesigns til intern brug. Stederne og mærkerne er ikke kunder" på en offentlig side | En ejer, der ser kendte logoer og en ansvarsfraskrivelse, tænker "de har ingen kunder og bruger andres logoer". Hero og showroom viser i stedet to neutrale designs og "jeres logo her". Bevisafsnit med tydelige pladsholdere: logoer, tre citater med navn, titel og sted, tal fra et rigtigt sted. Se også beslutning B3 |
| M3 | Ingen "hvem står bag". NN/g: mennesker og en adresse bygger tillid, især når der ingen kunder er | Kort afsnit "Hvem I taler med": stifter med foto (pladsholder), by, og at boksen er udviklet og printet i Danmark |
| M4 | FAQ mangler det, ejeren faktisk spørger om: binding, opsigelse, internet, strøm, tyveri, hvem ejer billederne, GDPR-ansvar, flere bokse og kæder, print, hvor lang tid fra ja til boksen hænger, hvad der sker, hvis vi lukker boksen ned igen | Ny FAQ på 14 spørgsmål. Svar, der ikke er besluttet, står som pladsholder |
| M5 | Gæstelisten er vores stærkeste juridiske kant (særskilt ja, Forbrugerombudsmandens natklubsag), men står kun som et punkt i Care-FAQ'en | Eget kort afsnit: "En gæsteliste, I må bruge" med sagen som kilde, og hvad boksen gør anderledes |
| M6 | Intet om, hvad stedet skal have klar (en væg, en stikkontakt, wifi). Movebooth og Lightbooth siger det | Tre linjer i "Sådan kommer vi i gang" |
| M7 | Sponsorindtægt er et stærkt argument i katalogerne (Palads: filmudlejeren betaler rammen) men står på siden kun som "plads til en sponsor" | Én sætning i "Hvad får I": rammen kan sælges til et bryggeri eller en sponsor |

### Det, der lover for meget eller ikke er sandt

| # | Fejl | Kilde | Gør |
|---|---|---|---|
| L1 | "Video i Full HD" og "Full HD-video" (Kvalitet, Contentmaskine, funktionssider) | `docs/funktioner.md`: 900 × 1600, "Delvist" | "Video i HD i stående format" |
| L2 | "Fire mikrofoner med støjfjernelse" som standard fem steder | Mikrofonkortet er tilvalg og sidder ikke i alle bokse | "Med mikrofonmodul (tilvalg)" |
| L3 | "Boksen kårer aftenens største smil og største gruppe" | Titlen gælder det enkelte billede, ingen kåring på tværs af aftenen | "Boksen giver billedet en titel, fx største smil eller største gruppe" |
| L4 | "Lysringen i jeres farver" (hero-lede, showroom, FAQ) | Lyset styres kun i styrke; farven følger ikke temaet | Lysringen nævnes som lys, ikke som farve, til det er bygget. Står i "Kommer snart"-listen |
| L5 | "Går en boks i stykker, sender vi en ny med det samme" og "I betaler ikke for reparation eller ny boks" | Tekststrategi: sæt ikke tider, før driften kan holde dem. Vilkår § 6: tyveri og hærværk aftales i tilbuddet, ellers betaler kunden kostpris | "Går en boks i stykker, sender vi en ny. Fejl og slitage koster jer ikke noget. Tyveri og hærværk aftaler vi i tilbuddet" |
| L6 | "Support døgnet rundt" uden nummer | Besluttet, men ikke muligt at bruge uden et nummer | Nummer som pladsholder |
| L7 | "Selfi Boks" 159 steder | Navnet er Selfi (21. okt.) | "Selfi" og "boksen" |
| L8 | "Billeder og numre opbevares sikkert og bruges kun med samtykke" og "så I holder jer inden for reglerne" | Vilkår § 7 og DPA § 4: stedet er dataansvarlig og har ansvaret | Skriv, hvad boksen gør (særskilt ja, afmelding i hver SMS, slettefrister), ikke at stedet "holder sig inden for reglerne" |
| L9 | "Printede fotos: Kommer snart" i et gitter midt på salgssiden | Kommer snart læses som ufærdigt produkt | Ud af siden (bliver i menuen, hvor det er ærligt) |

### Det, der lyder som reklame eller ikke er dansk

| # | Tekst | Gør |
|---|---|---|
| T1 | "Content is king", "Ikke bare en fotoboks. En contentmaskine.", "Bygget til jeres univers.", "Det kan ingen kampagne iscenesætte", "Klar til alle jeres kanaler" | Overskrifter, der siger noget, kun vi kan sige: "Billeder og video af jeres gæster, hver aften I har åbent." |
| T2 | "autentiske" (4 gange), "univers" (3), "content" (15), "venues" (4) | "Ægte" eller ingenting; "jeres sted"; "billeder og video"; "steder" |
| T3 | Lede-sætninger, der kunne stå på enhver side: "Det er materiale, I kan bruge langt ud over aftenen selv" | Erstattes med konkrete: "Fredagens billeder er lørdagens opslag" |
| T4 | Alle AI-fotos (brandpakkens README: "Fotoene er AI-genererede") vises som fotos fra rigtige steder: "Festivalen", "Natklubben", "Baren", "Hotellet" | Behold højst to, mærket som illustrationer, og pladsholder til rigtige fotos. Undersøgelser fra Harris/4As og Canva (2026): 73 % stoler mindre på en annonce, de tror er lavet med AI |
| T5 | Kontaktoverskrift "Fortæl os om jeres sted." er god. Men intet om, hvad der sker bagefter, og hvor hurtigt | "Vi svarer inden [pladsholder: én arbejdsdag] og aftaler en snak på 20 minutter" |

### SEO og teknik

| # | Fejl | Gør |
|---|---|---|
| K1 | `metadataBase` og sitemap bruger `https://selfi.dk`, men domænet sender alt til `https://www.selfi.dk` (308). Canonical og sitemap peger på adresser, der omdirigerer | `metadataBase`, sitemap og robots til `https://www.selfi.dk` |
| K2 | Title på 70 tegn med "venues"; beskrivelse på 165 tegn. Søgeordene fra tekststrategien ("fotoboks til bar", "photo booth natklub") er ikke med | "Fotoboks til bar, klub og hotel i jeres design \| Selfi" (54 tegn) og en beskrivelse under 155 tegn med pris, når den findes |
| K3 | Ingen `Organization`-data (navn, adresse, CVR, telefon er tomme felter i `lib/company.ts`). Footeren viser kun "Selfi · selfi.dk". E-handelsloven § 7 kræver navn, adresse, CVR og e-mail | `Organization` i JSON-LD, footer med alle felter. Data mangler fra os (afsnit 6) |
| K4 | Showroomet henter 10 designs (4,9 MB glb/png) plus three.js, så snart det er 700 px fra skærmen. Hero-3D henter three.js med det samme, også på mobil | Hero: stregtegning på mobil, 3D først ved tryk. Showroom: kun det valgte design hentes, de andre ved klik |
| K5 | OG-billede er et AI-foto fra en festival | Et foto af boksen i et design (pladsholder til et rigtigt foto) |
| K6 | Kontaktformularen svarer "Formularen er ikke sat op endnu", hvis `CONTACT_WEBHOOK_URL` ikke er sat i Vercel. Kan ikke testes uden at sende en rigtig besked | Tjek i Vercel (afsnit 6). Formularen får en mailto-reserve, når e-mailen er besluttet |
| K7 | Nav og footer sætter "Lej til en fest" / "Lej en fotoboks til festen" først på erhvervssiden | Linket til privat flyttes sidst og gøres lille |
| K8 | Typecheck og konsol er rene. Ingen hydreringsfejl. Fonte (5 woff2) og billeder (next/image, avif/webp) er i orden | Ingenting |

## 3. Ekspertviden med kilder

Principper, der er brugt i planen. Ikke generelle råd.

1. **Det meste af købet sker, før de taler med os.** Gartner (2025, 2026): 61 %, nu 67 %, af B2B-købere foretrækker at købe uden en sælger; købergrupper på 5–16 personer; købere med høj beslutningssikkerhed er dobbelt så tilbøjelige til at melde om en god handel, og "buyer enablement" (information, der hjælper dem med at beslutte) mindsker fortrydelse (Gartner 2019). Siden skal derfor svare på pris, vilkår og forløb, så den kan sendes videre til medejeren, uden at vi er med. Kilder: gartner.com/en/newsroom (2019-09-17, 2025-06-25, 2026-03-09).
2. **Vis prisen, eller vis eksempler.** Jakob Nielsen (NN/g, 2006): manglende priser var "#1 Web design mistake"; vis "sample prices for a set of typical orders", for at komme på shortlisten. Therese Fessenden (NN/g, 2019): skjulte priser "kan få organisationen til at virke tvivlsom"; vis en fra-pris eller et interval, forklar modellen, og nævn skiftomkostninger (binding, opsigelse) på pris- eller FAQ-siden. Kilder: nngroup.com/articles/show-prices-for-common-scenarios/, nngroup.com/articles/b2b-trust-from-b2c/.
3. **Tillid kommer fra mennesker, sted og navngivne citater.** Fessenden (NN/g, 2019): besøgende stoler mere på en virksomhed, når de kan se, hvem der står bag, og hvor den ligger; citater skal have "job title and affiliation" (eyetracking viser, at folk kigger efter afsenderen); citater, der starter med en forbeholdenhed og ender i tillid, virker bedst; varierede cases dækker flere bekymringer; klart sprog læses som ærligt, snørklet sprog vækker mistanke.
4. **Anmeldelser.** Spiegel Research Center, Northwestern (2017, genudgivet 2025): fem anmeldelser giver 270 % højere købssandsynlighed end ingen; effekten topper ved 4,0–4,7 stjerner og falder mod 5,0; effekten er størst for dyre produkter (+380 %). Det gælder også B2B-citater: få, konkrete og ikke kun ros. Kilde: spiegel.medill.northwestern.edu/how-online-reviews-influence-sales/.
5. **Kontakt.** Anna Kaley (NN/g, 2019, 20 erhvervsbrugere, 40 sider): et skjult telefonnummer "implies that the organization doesn't want to be bothered"; en formular må aldrig være eneste vej; 3–5 felter; brugerne forventer svar inden 24 timer; skriv åbningstider ved nummeret. Kilde: nngroup.com/articles/contact-us-pages/.
6. **Sprog og længde.** Unbounce Conversion Benchmark Report (2024): tekst på 5.–7. klasses niveau konverterer 11,1 % mod 5,3 % for "professionelt" sprog; svære ord (tre stavelser og derover) korrelerer −24 % med konvertering, læsetid −19 %, ordmængde −19 %. Kilde: unbounce.com/conversion-benchmark-report/.
7. **Konkrete serviceløfter slår store ord.** Hart (1988) og McDougall m.fl. (1998) om servicegarantier; Gartner om beslutningssikkerhed. Allerede i `TEKSTSTRATEGI.md`, og det holder: "sender vi en ny" slår "100 % tryghed".
8. **Regnestykket skal vise sine antagelser.** The Haylo og Movebooth viser antagelserne ved siden af resultatet (30 % skriver nummer, 20 % kommer igen). Vores contentberegner gør det allerede; den beholdes og får prisen ved siden af, når den findes.
9. **AI-billeder koster tillid.** Harris/4As og Canva (2026): 73 % stoler mindre på en annonce, de tror er lavet med AI. Allerede noteret i `marketing/some-annoncer/README.md`.
10. **Dansk klarsprog.** Folketingets Ombudsmands "Håndbog i klarsprog" (2008) og Nordeas og B&O's klarsprogsregler (VID, 2004): korte sætninger, aktiv form, "I" og "vi", ingen verbalsubstantiver, ord læseren bruger. LIX (sætnings- og ordlængde) er det bedst underbyggede mål for sværhed (Sprognævnet). Danske B2B-sider, der gør det godt over for små forretninger: **Flatpay** ("Penge ind, stress ud", "Det er ikke altid nemt at drive en forretning. Men med Flatpay er det i det mindste nemt at blive betalt", en navngiven case med "mere end 15.000 kr. sparet det første år", tre trin til opstart, Google 4,7). Sider, der lyder oversat, og som vi ikke skal ligne: Planday ("Det stærkeste opgradering", "Æder admin-opgaver din dag?", "Vi er i clouden") og Pleo ("Styret af dig", "Få kontrol over forbruget i dag").

## 4. Brainstorm: alt, der kunne gøre siden bedre

Bredt, før jeg vælger. Mærket A (gør nu), B (gør, når vi har data eller en beslutning), C (lader ligge).

**Struktur og rækkefølge**
- A: Ny rækkefølge efter ejerens spørgsmål. Færre sektioner.
- A: "Sådan kommer vi i gang" i fem trin.
- A: Sticky "Book en snak" på mobil (findes som `StickyCta` på /lej).
- B: Egne undersider pr. stedstype (/erhverv/bar, /erhverv/hotel, /erhverv/festival) med egne søgeord. Først når der er bevis at sætte ind.
- C: Lad siden starte med en spørgeramme ("Hvad har I?") og vis kun det relevante. For meget maskineri for få besøg.

**Hero**
- A: H1 med resultat, lede på to sætninger, tre punkter med det, der altid er med, telefon og e-mail under knappen.
- A: 3D-boksen bliver, men i neutralt design med "jeres logo her". På mobil en stregtegning, 3D ved tryk.
- B: Boksen i kundens design live: skriv stedets navn, og se det på skærmen i 3D. Flot, og det sælger "eget design" bedre end noget andet. Kræver en dag.
- C: Video i hero. Filmen findes, men autoplay i hero koster hastighed og siger "reklame".

**Bevis**
- A: Bevisstribe med pladsholdere: "[Logo] [Logo] [Logo]", "[X] steder", "[X] billeder i [måned]".
- A: Tre citater som pladsholdere med navn, titel, sted, og ét med et forbehold.
- A: "Hvem står bag" med stifter, by og "udviklet og printet i Danmark".
- B: Én rigtig case på en underside (sted, antal bokse, tal for billeder, SMS'er, genbesøg) med foto.
- B: Trustpilot eller Google-anmeldelser fra steder, når de findes.
- C: "Som set i"-presse. Findes ikke.

**Regnestykke**
- A: Behold contentberegneren (medarbejdertimer), flyt den under "Hvad får I", og sæt prisen ved siden af, når den findes.
- B: Beregner for genbesøg (gæster pr. aften × andel, der skriver nummer × andel, der kommer igen × forbrug). Haylo gør det. Vi har ingen tal, og uden tal er det gætteri, der kan slå tilbage. Byg den, når det første sted har kørt tre måneder.
- C: "Betaler sig selv på X uger". Kan ikke bevises.

**Pris**
- A: Prisafsnit med pladsholder for fra-pris, hvad der er med, tilvalg, binding og opsigelse. FAQ-svaret skrives om.
- B: Prisen som tal, når den er besluttet (995 kr./md. står i tekststrategien).
- C: Prisberegner med antal bokse og måneder. Først når prisen er fast.

**Indvendinger og FAQ**
- A: FAQ på 14 spørgsmål med pladsholdere på det, der ikke er besluttet.
- A: "Det, I måske tænker på" bliver, men skrives om, så det holder mod vilkårene (tyveri, tid).
- A: Gæstelisten får sit eget afsnit med Forbrugerombudsmandens sag.
- A: "Passer boksen til jer?" med tre krav (en væg, en stikkontakt, wifi) og hvem den ikke passer til. Sparer os for møder, der ikke fører til noget.

**Design og showroom**
- A: Neutrale designs i showroomet. Andres logoer ud af den offentlige side (beslutning B3 nedenfor).
- A: Showroomet henter kun det viste design.
- B: Et rigtigt kundedesign i showroomet, når den første kunde har sagt ja til at blive vist (vilkår § 11 giver os lov, medmindre de siger nej).

**Film**
- A: Filmen bliver, men længere nede, med et nyt afsnit over sig ("Se boksen på to minutter").
- B: Speaken siger "Selfi Boks" og lover "fire mikrofoner" og "kårer aftenens største smil". Skal rettes i `video/voiceover.json` og genrenderes, når teksterne er godkendt.
- C: Ny film. Ikke nu.

**Sprog**
- A: Alle tekster på siden skrives om efter reglerne i afsnit 7 i opgaven: ingen floskler, ingen udråbstegn, ingen "løsning", "oplevelse", "univers", "content is king", ingen "venues". "Selfi" i stedet for "Selfi Boks".
- A: `content.ts` rettes de steder, siden deler tekst med funktionssiderne (Full HD, mikrofoner, kåring).
- B: Funktionssiderne gennemskrives efter samme regler. Ikke en del af denne opgave, men de deler data, så de får rettelserne i L1–L3 med.

**Kontakt**
- A: Fire felter (navn, sted, e-mail, telefon valgfri) plus besked. Telefon og e-mail ved siden af. Svartid som pladsholder.
- B: Direkte kalenderbooking (fx en Google-kalenderside) i stedet for formular. Gartner: købere vil selv styre tempoet. Kræver en kalender, vi passer.
- C: Chat. Kan ikke bemandes.

**Teknik og SEO**
- A: www som base, nye title/description, Organization-data, OG-billede, lettere 3D, mobilmenu.
- B: Analyse (fx Vercel Analytics uden cookies) for at måle, hvor folk falder fra. Kræver en beslutning om cookies/privatliv.
- C: Flersproget side. Ingen efterspørgsel endnu.

## 5. Det, jeg vælger at bygge (A-listen), og den nye rækkefølge

1. **Hero.** Label "Til barer, klubber, hoteller og festivaler". H1: "En fotoboks i jeres design, der får gæsterne til at komme igen." Lede: "Selfi hænger på væggen i jeres form og farver, tager billeder og video af gæsterne, og sender dem på SMS med jeres navn på. Siger gæsten ja, har I et nummer, I må sende tilbud til." Tre punkter: eget design, gæsteliste med samtykke, fuld service. Knap "Book en snak på 20 minutter", sekundær "Se prisen". Telefon og e-mail som pladsholder. 3D-boks i neutralt design (stregtegning på mobil).
2. **Bevisstribe** (pladsholder): logoer, antal steder, antal billeder.
3. **Hvad får I.** Tre resultater med én konkret sætning hver: omtale (jeres navn på hvert delt billede, plads til en sponsor, der betaler for rammen), gæster der bliver og kommer igen (aktiviteter, gæsteliste), billeder og video til jeres kanaler (hver aften I har åbent, med samtykke). Her står også de tre tekniske linjer (12 MP, HD-video stående, mikrofonmodul som tilvalg).
4. **Sådan går det for gæsten.** Fire trin i ét kort afsnit uden sticky animation.
5. **Jeres design.** Showroom, kortere, neutrale designs, "vi printer delene selv".
6. **Pris.** "Fra [X] kr./md. ekskl. moms" (pladsholder). Med i prisen: design, boksen, vægbeslag og lås, kontrolpanel, overvågning, opdateringer, support, ny boks ved fejl. Tilvalg: 4G, print, flere designs. Binding og opsigelse: pladsholder. Contentberegneren står ved siden af som "Det samme lavet af en medarbejder".
7. **Fuld service.** Care-afsnittet, flyttet herop og rettet (tid, tyveri, nummer).
8. **En gæsteliste, I må bruge.** Kort afsnit med Forbrugerombudsmandens sag, og hvad boksen gør: særskilt ja, afmelding i hver SMS, slettes efter to år uden brug.
9. **Sådan kommer vi i gang.** Fem trin, tider som pladsholdere. Plus "Det skal I have klar": en væg, en stikkontakt, wifi.
10. **Aktiviteter.** Seks kort (uændret indhold, kortere tekst), link til /funktioner.
11. **Se filmen.** Som i dag, længere nede.
12. **Det siger stederne** (pladsholder): tre citater og én case.
13. **Hvem står bag.** Stifter, by, udviklet og printet i Danmark (foto som pladsholder).
14. **Spørgsmål og svar.** 14 spørgsmål.
15. **Book en snak.** Formular med fire felter, telefon, e-mail, svartid (pladsholder). Lille link til privat leje nederst.

Det er 15 blokke, men 2, 8, 12 og 13 er korte (en halv skærm). Mål: under 11 skærmhøjder på computer og under 17 på mobil, mod 20 og 30 i dag.

**Det, jeg lader ligge, og hvorfor:** genbesøgsberegneren (ingen tal, ville være gætteri), undersider pr. stedstype (først med bevis), kalenderbooking (kræver en kalender, vi passer), ny film (den nuværende kan bruges), funktionssiderne (uden for opgaven, men de får de delte rettelser med), analyse (kræver en cookiebeslutning).

## 6. Det, der mangler fra os, i prioriteret rækkefølge

Pladsholderne på siden er mærket `[PLADSHOLDER: …]` i teksten og med en gul kant i udviklingstilstand, så de ikke kan overses.

1. **Prisen pr. måned** og om der er en opstartspris. Tekststrategien siger 995 kr./md. ekskl. moms. Uden pris er vi den eneste på markedet uden.
2. **Binding og opsigelse.** Lightbooth: 3 måneder. Vilkår § 10 siger 1 måneds varsel, hvis intet er aftalt. Skal det stå på siden?
3. **Telefonnummer og e-mail** (`lib/company.ts`). Også CVR, firmanavn og adresse til footer, Organization-data og e-handelsloven.
4. **Svartid på henvendelser** (fx "inden én arbejdsdag") og **tid fra ja til boksen hænger** (design, print, forsendelse).
5. **Tyveri og hærværk**: dækker "ny boks" også det, eller aftales det pr. sted? Siden siger i dag "I betaler ikke", vilkårene siger det modsatte.
6. **Internet**: wifi hos stedet, eller 4G som tilvalg til en pris?
7. **Andres logoer på siden** (beslutning B3): fjern Carlsberg, Tuborg, Red Bull, LEGOLAND, Smukfest, Roskilde, Nibe, Fårup, Zoo og Airtox fra den offentlige side, eller få lov. Jeg fjerner dem i udkastet og beholder filerne, så de kan slås til igen.
8. **Tre citater** med navn, titel og sted, og gerne ét med et forbehold. Og **tal fra ét rigtigt sted** (billeder pr. aften, andel der skriver nummer, andel der siger ja til tilbud).
9. **Kundelogoer** (med tilladelse, vilkår § 11).
10. **Rigtige fotos**: boksen på en væg hos et sted, en gæst foran den, et print i hånden. OG-billede. Foto af stifteren.
11. **`CONTACT_WEBHOOK_URL`** sat i Vercel, ellers virker formularen ikke.
12. **Filmens speak** rettes ("Selfi Boks", "fire mikrofoner", "kårer aftenens største smil") og genrenderes.
13. **Lysringens farve, kåring på tværs af aftenen, eksport af gæstelisten**: når de er bygget, kan teksterne skærpes igen.

## 7. Det, der er gjort (21. oktober 2026, aften)

Siden ligger i `app/erhverv/page.tsx`, de nye afsnit i `components/erhverv/`, pladsholderne i `lib/erhverv/placeholder.ts` (gul kant og ordet "pladsholder" på siden, slås fra med `PLACEHOLDERS_VISIBLE = false`).

| Punkt | Gjort |
|---|---|
| S1–S7 | Ny rækkefølge: hero → bevisstribe → det får I → sådan går det for gæsten → design → eksempler pr. slags sted → pris → service → gæsteliste → sådan kommer vi i gang → aktiviteter → film → det siger stederne → hvem I taler med → spørgsmål → book en snak. Funktioner-gitteret, Kvalitet, "Det gæsterne får", scroll-animationen og fotostriben er ude. Beregneren og "Det, I måske tænker på" folder sammen. Computer: 17.400 → ca. 15.500 px. Mobil: 24.600 → ca. 21.000 px (afsnittene er flere, men hvert har et formål) |
| F1–F3 | Ny H1 og lede, tre punkter og telefon i heroen. "Venues", "Content is king" og "Content" i menuen er væk |
| F4 | Menu-knap på mobil med sidens afsnit, Funktioner og linket til privat. Fast "Book en snak"-bjælke i bunden på mobil med telefonnummer |
| F5 | Telefon og e-mail i hero, service, "hvem I taler med", kontakt og footer (pladsholdere) |
| M1 | Prisafsnit: "fra 995 kr./md." (pladsholder), hvad der er med, tilvalg, opstartspris og binding (pladsholdere). FAQ-svaret skrevet om. Pris i title, beskrivelse og strukturerede data |
| M2 | Bevisstribe med seks opdigtede steder og tre tal, tre opdigtede citater (ét med forbehold) og én opdigtet case med tal. Alt markeret. Showroomets konceptdesigns bliver, markeret som pladsholder |
| M3 | "Hvem I taler med": stifter, by (pladsholder), printet i Danmark, telefon og e-mail |
| M4 | 14 spørgsmål i FAQ'en, de ubesluttede svar hentes fra pladsholderfilen |
| M5 | Afsnittet "En gæsteliste, I må sende til" med Forbrugerombudsmandens sag og fire ting, boksen gør |
| M6 | "Det skal I have klar": væg, stikkontakt, wifi, i "Sådan kommer vi i gang" |
| M7 | "Pladsen i rammen kan I også sælge til et bryggeri eller en sponsor" i "Det får I" |
| Cases | Nyt afsnit "Sådan kan det sættes op" med en fane pr. slags sted: bar/bodega, natklub, sportsklub, hotel, biograf, festival, forlystelsespark/zoo. Hver med bokse, placering, design, aktiviteter, gæsteliste og "det får de". Eksempler, ikke kunder, markeret |
| L1–L3 | "Video i HD, stående" (900 × 1600), mikrofonmodul som tilvalg, "største smil" som titel på billedet, kåring på tværs af aftenen mærket "kommer snart". Rettet i `content.ts`, så funktionssiderne følger med |
| L4 | Lysringens farve er ude af teksterne og står som "kommer snart" på eget design |
| L5 | "Går en boks i stykker, sender vi en ny. Fejl og slitage koster jer ikke noget. Tyveri og hærværk aftaler vi i tilbuddet" |
| L6 | Nummer ved "ring", som pladsholder |
| L7 | "Selfi" i stedet for "Selfi Boks" på erhvervssiden, funktionssiderne og de delte komponenter. Juridiske sider, CE-dokumentation og B2C-forsiden er ikke rørt |
| L8 | Teksten siger, hvad boksen gør (særskilt ja, afmelding, sletning), ikke at stedet "holder sig inden for reglerne" |
| L9 | "Printede fotos" er ude af siden; står i FAQ som "kommer snart" og i menuen |
| T1–T3 | Alle overskrifter og ledes skrevet om. Ingen "univers", "autentisk", "content is king", "venues", "løsning", "oplevelse" på siden |
| T4 | De fem AI-fotos fra "Hvor den passer" er ude. Stregtegninger og 3D bruges i stedet. OG-billedet er klub.jpg (AI) som pladsholder |
| T5 | "Vi svarer inden én arbejdsdag" (pladsholder) ved formular og efter afsendelse |
| K1 | `metadataBase`, sitemap og robots peger på www.selfi.dk |
| K2 | Title "Fotoboks til bar, klub og hotel i jeres eget design \| Selfi" (54 tegn), beskrivelse med pris under 155 tegn |
| K3 | `Organization`- og `Service`-data med pris. Footer viser pladsholder, til felterne i `lib/company.ts` er udfyldt |
| K4 | Hero på mobil viser stregtegningen og henter 3D først ved tryk. Hero-3D forudindlæser kun næste design. Showroomet henter kun det valgte design og dets to naboer (1,5 MB i stedet for 5 MB) |
| K6 | Ikke tjekket: `CONTACT_WEBHOOK_URL` i Vercel |
| K7 | Privat leje er sidste link i menu og footer og en linje nederst på siden |
| Events | `/events` og `/events/<slug>` sender til `/erhverv`. Smukfest-kataloget flyttet til `/erhverv/smukfest`. Eventfilmen er fjernet fra `public/video` (kilden i `video/events.html` bliver) |

**Ikke gjort, med vilje:** genbesøgsberegner, undersider pr. slags sted, kalenderbooking, ny film, gennemskrivning af funktionssiderne ud over de delte rettelser, analyse.
