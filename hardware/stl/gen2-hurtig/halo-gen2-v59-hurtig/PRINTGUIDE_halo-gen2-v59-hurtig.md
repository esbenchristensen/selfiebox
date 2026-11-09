# Selfi Halo gen 2, version v59: hurtigprint

**Version:** halo-gen2-v59-hurtig. Kun til pasformsprøver. Geometrien er den samme som i de normale printfiler for halo-gen2-v59 (`hardware/stl/gen2/halo-gen2-v59/`); kun printindstillingerne er anderledes, og der er små prøvestykker skåret ud af delene. Reglerne står i `hardware/docs/HURTIGPRINT.md`. **Brug aldrig disse filer til en boks, der skal ud til en kunde.**

Lavet med `python3 hardware/tools/make_hurtig.py halo-gen2-v59`. Alle filer er Bambu Studio-projekter (3MF) til H2C med indstillingerne indbygget: åbn, tjek at spolen passer, og tryk Print. STL-filerne ligger ved siden af.

## Sådan bruges sættet

1. **Print plade 1 først** (`plade1-nyt`, ca. 2 t 14 min): v59: ingen dele er ændret, kun materialet: alt er nu ASA, lysringen stadig klar PETG. ASA krymper mere end PLA, og 3MF'erne retter for det (krympning 99,6 %), så målene skal blive som i PLA-prøverne. Derfor skal alle pasformer prøves igen i ASA: print plade 1 først og så plade 2, og prøv især lysringen i fronten (PETG i ASA), klikket mellem front og skal og Wago-lommerne. v58: kamerastykket (front og bagramme): linsen centreres nu af 4 ribber om linseholderen og sidder 0,55 mm længere fremme bag en tyndere kant. Se, at den sorte ring om linsen er lige bred hele vejen rundt. v57: lysstakken nederst til venstre (front, bagramme og lysring) fra hjørnet ind til broen midt på bunden: ingen spor længere, broerne 1 mm højere (3,2 mm fra væggene, 2,8 fra bunden) og 1,2-1,9 mm bredere åbninger, slidsen i hjørnet 3,4 mm. Skub alle fire strips igennem med fingrene. Plade 2 har resten, også v56's Wago-lommer i bagrammen. Plade 2 (ca. 14 t 37 min) er resten af holderne og samlingerne, plade 3 (ca. 3 t 09 min) tilvalg og skærmens kant. Hver plade har stykker i én farve, så det er ét print pr. plade, og de kan køre på flere printere på én gang. Hvert stykke ligger også som sin egen 3MF, hvis I kun vil prøve ét sted.
2. Saml stykkerne med de rigtige købedele, og gå listen "Hvad prøves" igennem.
3. Passer det hele, så print de hele dele med kladdeindstillinger (eller de normale filer), og saml en hel boks.
4. Passer noget ikke, så skriv det i en samlenote. Rettelsen laves i CAD og bliver en ny version; ret aldrig en hurtigfil.

Tiderne er skøn fra PrusaSlicer med H2C-lignende hastigheder og kan afvige 20–40 %; Bambu Studio viser den rigtige tid, når pladen er slicet.

## Prøveplader

| Fil | Hvad | Filament | Stykker | Ca. tid | Ca. filament |
|---|---|---|---|---|---|
| `halo-gen2-v59-hurtig_plade1-nyt_sort.3mf` | v59: alt i ASA (lysringen klar PETG), prøv alt igen; v58: kameraet centreret og længere frem; v57: lysstakken med et hjørne og broen midt på bunden, mere plads under broerne og ingen spor; print den først | ASA sort | lyskanal_front, kamera_front | 48 min | 29 g |
| `halo-gen2-v59-hurtig_plade1-nyt_hvid.3mf` | v59: alt i ASA (lysringen klar PETG), prøv alt igen; v58: kameraet centreret og længere frem; v57: lysstakken med et hjørne og broen midt på bunden, mere plads under broerne og ingen spor; print den først | ASA hvid | lyskanal_bagramme, kamera_bagramme | 1 t 19 min | 39 g |
| `halo-gen2-v59-hurtig_plade1-nyt_natur.3mf` | v59: alt i ASA (lysringen klar PETG), prøv alt igen; v58: kameraet centreret og længere frem; v57: lysstakken med et hjørne og broen midt på bunden, mere plads under broerne og ingen spor; print den først | klar PETG | lyskanal_lysring | 7 min | 6 g |
| `halo-gen2-v59-hurtig_plade2-resten_sort-1.3mf` | de andre holdere og samlinger (også v56's Wago-lommer, v54's strømindgang, v53's sikringsklemmer og klipslommerne) | ASA sort | stroem, ledstyring, stroemindgang, mikrofonkerne, wago-loekker, sikring, hjoerne_skal, hjoerne_front, laas-reed, daemper | 6 t 35 min | 227 g |
| `halo-gen2-v59-hurtig_plade2-resten_sort-2.3mf` | de andre holdere og samlinger (også v56's Wago-lommer, v54's strømindgang, v53's sikringsklemmer og klipslommerne) | ASA sort | stativ-hylde, hoejttaler, klik_skal, klik_front, laas-hoejre, kabelloekker, laas_front, laasetunge, stoedsensor, laasetunge-hoejre, klipslomme_front, klipslomme-hoejre_front, skinne_stativbeslag, vingerille, skinne_vaegbeslag, klik-bund_skal, sikringsklemmer, klik-bund_front | 5 t 26 min | 156 g |
| `halo-gen2-v59-hurtig_plade2-resten_hvid.3mf` | de andre holdere og samlinger (også v56's Wago-lommer, v54's strømindgang, v53's sikringsklemmer og klipslommerne) | ASA hvid | hjoerne_bagramme, laas_bagramme, klipslomme_bagramme, klipslomme-hoejre_bagramme, wagolommer, skaermhuller | 2 t 25 min | 61 g |
| `halo-gen2-v59-hurtig_plade2-resten_natur.3mf` | de andre holdere og samlinger (også v56's Wago-lommer, v54's strømindgang, v53's sikringsklemmer og klipslommerne) | klar PETG | hjoerne_lysring, klipslomme_lysring, klipslomme-hoejre_lysring | 11 min | 6 g |
| `halo-gen2-v59-hurtig_plade3-ekstra_sort-1.3mf` | tilvalg og skærmens kant | ASA sort | skaerm-lysring, 4g | 2 t 06 min | 82 g |
| `halo-gen2-v59-hurtig_plade3-ekstra_sort-2.3mf` | tilvalg og skærmens kant | ASA sort | mikrofonstrip | 1 t 03 min | 24 g |

## Prøvestykker

Hvert prøvestykke er en kasse skåret ud af en del, så det passer præcis til denne version. Det står på den samme flade som delen og printes i den samme retning. Stykker med samme navn og flere dele (fx `kamera`, `hjoerne`, `klik`) lægges sammen.

| Fil | Filament | Mål (mm) | Ca. tid | Hvad prøves |
|---|---|---|---|---|
| `halo-gen2-v59-hurtig_proeve-wagolommer.3mf` | ASA hvid | 148 × 25 × 22 | 33 min | v56: Wago-lommerne i bagrammen er nu som Wago-rækken i skallen (v55 havde sit eget system): en skrå tand ind i bunden af hver indgang, knusribber i siderne og bagved og en lille kant over klemmens bagende i hvert hjørne. Over det øverste tværstykke, bag skærmen: 2 lommer til 221-415 (hvid + og −) og 3 til 221-413 (RGB data, GND, +5 V). Klemmerne ligger med håndtagene opad og indgangene bagud. Sæt indgangsenden ind over tænderne (skub den bagud) og tryk bagenden (mod skærmen) ned, til den klikker under kanterne: sidder den uden slør i alle retninger, går en afisoleret ledning ind over tanden, og kan håndtagene åbnes helt? Klik også blæserhegnet på tværstykket: går dets øverste arm fri under lommerne? |
| `halo-gen2-v59-hurtig_proeve-sikringsklemmer.3mf` | ASA sort | 41 × 28 × 26 | 13 min | v53: de to faste Wago-pladser (221-413) over sikringsholderen: én på 5 V-forsyningens væg og én på højre væg, indgangene nedad mod sikringen. Klik en klemme i hver: sidder de fast, kan håndtagene åbnes helt, og kan sikringens korte ledning (6 cm) nå op i den højre? |
| `halo-gen2-v59-hurtig_proeve-stroemindgang.3mf` | ASA sort | 44 × 104 × 24 | 37 min | v54: kabellåsens skrueklods fra v52 er væk igen, så strømindgangen er som i v51. v43: kanalen til strømforsyningens stik nedefra er 1 mm større, Ø11,8 (v40-v42: Ø10,8), stadig med flad top. Bøjlen over hunstikket er som v40. Kør strømforsyningens stik op nedefra: glider det op uden at tage fat, og rammer det stadig hunstikket uden at lede efter det? Skub hunstikket ind forfra: sidder det stadig uden slør? |
| `halo-gen2-v59-hurtig_proeve-sikring.3mf` | ASA sort | 28 × 66 × 33 | 19 min | v43: åbningerne i hver ende til sikringsholderens ledningsstudse er 7,5 mm brede (v40-v42: 5,6, så holderen ikke kunne komme ned; du målte studsene til ca. 8 mm). Lommen og knusribberne er som v40. Trykkes den ned og sidder fast? Kan låget stadig åbnes? |
| `halo-gen2-v59-hurtig_proeve-wago-loekker.3mf` | ASA sort | 180 × 68 × 22 | 1 t 10 min | v40: Wago-lommerne efter dine mål (18,6 / 29,6 brede, 18,0 lange): skrå tænder med bred fod, der går 1,2 mm op over hullets 0,5 mm kant og 2 mm ind, knusribber i siderne (0,5) og bagved, og en lille kant over klemmens bagende i hvert hjørne. Sæt indgangsenden ind over tænderne og læg klemmen ned, til den klikker under kanterne bagved: sidder den uden slør i alle retninger, og går en afisoleret ledning stadig ind over tanden? Velcroløkkerne under rækken er som v37. |
| `halo-gen2-v59-hurtig_proeve-kabelloekker.3mf` | ASA sort | 52 × 42 × 14 | 13 min | v37: de 2 flade velcroløkker midt på bagvæggen (som v23–v35). Går en 10 mm velcrostrop igennem begge? |
| `halo-gen2-v59-hurtig_proeve-stroem.3mf` | ASA sort | 76 × 144 × 35 | 1 t 10 min | v36: 5 V-forsyningen i sin bakke. Tænderne skal holde den, uden at væggene skubbes ud. |
| `halo-gen2-v59-hurtig_proeve-ledstyring.3mf` | ASA sort | 62 × 124 × 27 | 42 min | v36: WLED-styringen (Gledopto) i sin bakke med 2,4 mm vægge. Klikker den på plads og sidder fast? |
| `halo-gen2-v59-hurtig_proeve-daemper.3mf` | ASA sort | 20 × 60 × 42 | 18 min | v36: dæmperens printkort (DFR0457) på de 4 puder, 2 pinde i hullerne, én tand pr. side. Klikker kortet på plads? |
| `halo-gen2-v59-hurtig_proeve-hoejttaler.3mf` | ASA sort | 83 × 47 × 25 | 42 min | Højttaleren (FIT0502) i sin bakke bag gitteret. |
| `halo-gen2-v59-hurtig_proeve-laas-reed.3mf` | ASA sort | 46 × 66 × 22 | 28 min | v41: venstre låseslids i bunden, låseskruens hul og reed-modulets bakke. Skruehovedet sidder nu 3 mm oppe i bunden (v40: 0,3). Prøves med `proeve-laasetunge` og `proeve-stativ-hylde`: går tungen ind og op, kan låseskruen skrues i, og ligger hovedet helt skjult inde i hullet? |
| `halo-gen2-v59-hurtig_proeve-laas-hoejre.3mf` | ASA sort | 28 × 43 × 22 | 14 min | Højre låseslids (12 mm tunge). Prøves med `proeve-laasetunge-hoejre` og `proeve-stativ-hylde`. |
| `halo-gen2-v59-hurtig_proeve-4g.3mf` | ASA sort | 48 × 81 × 18 | 22 min | 4G-modemet i sin bakke (tilvalg). |
| `halo-gen2-v59-hurtig_proeve-mikrofonkerne.3mf` | ASA sort | 86 × 68 × 23 | 32 min | v43: mikrofonkernens (XVF3800) tænder er de samme som v40 (samme pasform), men tappen under hver tand er stærkere: 10 mm bred (v40: 6), 1,2 mm tyk ved roden og 0,8 ved tanden, med afskåret fod og 0,5 mm længere. Tryk kortet ned over pindene, til begge tænder klikker over printet: holder tapperne, uden at knække? Sidder kortet fast, når du vender stykket og banker det? Kan USB-C, AUX og fladkablet stadig sættes i? |
| `halo-gen2-v59-hurtig_proeve-stoedsensor.3mf` | ASA sort | 34 × 41 × 15 | 11 min | v36: stødsensoren (LIS3DH) i sin bakke til højre for 5 V-forsyningen. |
| `halo-gen2-v59-hurtig_proeve-mikrofonstrip.3mf` | ASA sort | 126 × 13 × 64 | 1 t 03 min | Mikrofonkortet i lommen i bunden: pindene gennem hullerne og kortet fladt på de 4 ringe (tilvalg). |
| `halo-gen2-v59-hurtig_proeve-vingerille.3mf` | ASA sort | 22 × 36 × 14 | 8 min | v36: rillen bag på skallen med lommen under. Prøv med den hele `tema-vinge-venstre-eksempel`: går tappen i rillen, og falder tåen ned i lommen, så vingen ikke kan vippe ud forneden? |
| `halo-gen2-v59-hurtig_proeve-klik_skal.3mf` | ASA sort | 20 × 39 × 64 | 23 min | v41: frontens nederste venstre klikkant (95 mm oppe) og skallens rille. Kanten sidder 0,3 mm længere inde på tungen end i v40, så den kan nå ned i rillen. Tryk de to stykker sammen: ligger front og skal helt sammen uden fuge, når det klikker? Træk dem fra hinanden igen med hånden. Stykket er kort, så det er stivere end den hele væg; bedøm kraften på det hele print. |
| `halo-gen2-v59-hurtig_proeve-klik_front.3mf` | ASA sort | 10 × 39 × 28 | 9 min |  |
| `halo-gen2-v59-hurtig_proeve-klik-bund_skal.3mf` | ASA sort | 44 × 26 × 64 | 34 min | v41: frontens klikkant i bunden (x −50, 0,3 mm længere inde end i v40) og rillen i skallens bundvæg. Tryk sammen: ligger front og skal helt sammen, når det klikker? Kanten er 0,45 mm her (0,6 i siderne), så klikket skal være lettere end i `klik`. |
| `halo-gen2-v59-hurtig_proeve-klik-bund_front.3mf` | ASA sort | 44 × 26 × 28 | 9 min |  |
| `halo-gen2-v59-hurtig_proeve-kamera_front.3mf` | ASA sort | 91 × 37 × 28 | 25 min | v58: kameraet sidder 0,55 mm længere fremme (linsens spids 0,6 mm inde, før 1,15) bag en 0,45 mm kant på Ø8,6 (før 1,0), og 4 ribber midt på hver væg om den sorte linseholder centrerer linsen (0,1 mm luft pr. side). Tappene er Ø1,6 (før 1,9), så de ikke trækker imod. Skub kameraet ind mellem ribberne og ned på tappene, og læg bagrammen på: sidder linsen midt i hullet med lige stor sort ring hele vejen rundt, går linseholderen ind uden at skulle trykkes, og rører linsen ingenting? |
| `halo-gen2-v59-hurtig_proeve-kamera_bagramme.3mf` | ASA hvid | 91 × 27 × 28 | 29 min |  |
| `halo-gen2-v59-hurtig_proeve-laas_front.3mf` | ASA sort | 43 × 42 × 28 | 13 min | En sidelås mellem front og bagramme (venstre side): klikker begge arme, og kan de vippes fri med en lille skruetrækker? |
| `halo-gen2-v59-hurtig_proeve-laas_bagramme.3mf` | ASA hvid | 30 × 42 × 29 | 21 min |  |
| `halo-gen2-v59-hurtig_proeve-skaermhuller.3mf` | ASA hvid | 144 × 16 × 20 | 25 min | Bagrammens nederste tværbjælke med de 2 nederste skruetårne til skærmen. Skru en M2,5 × 3–4 mm i hvert. |
| `halo-gen2-v59-hurtig_proeve-lyskanal_front.3mf` | ASA sort | 110 × 64 × 28 | 23 min | v57: mere plads under broerne og ingen spor. Stykket er lysstakken nederst til venstre fra hjørnet ind til broen midt på bunden. Sporene er væk (ingen trin, stammer, læber eller skinner), og broerne står 1 mm længere fra strippene: 3,2 mm fra begge vægge og 2,8 mm fra bunden (hvid er 2,0, RGB 2,2). Åbningerne er 1,2-1,9 mm bredere end strippene, og slidsen i hjørnet er 3,4 mm (hvid 3 på højkant er 2,0). Bunden er 1 mm dybere (19,6), så hvid 1 og RGB ligger side om side under den ydre bro. Skub hver strip igennem under broerne med fingrene, uden værktøj og uden at presse den ned: glider de let igennem, også hvid 3 op på højkant i hjørnets slids? Ligger de stadig ind mod væggene og i deres baner? Broerne er 2,0 × 3,0 mm: tryk hårdt på dem, de må ikke knække. Pres bagrammen ned på fronten med ringen i sædet: ligger ringen fast? v51's kølekanal bag bunden er der stadig (1 mm lavere): kommer der intet lys ud gennem spalterne? |
| `halo-gen2-v59-hurtig_proeve-lyskanal_bagramme.3mf` | ASA hvid | 110 × 64 × 29 | 50 min |  |
| `halo-gen2-v59-hurtig_proeve-lyskanal_lysring.3mf` | klar PETG | 109 × 62 × 7 | 7 min |  |
| `halo-gen2-v59-hurtig_proeve-klipslomme_front.3mf` | ASA sort | 42 × 38 × 28 | 14 min | v46: venstre klipslomme ved kameraet, hvor hvid 1 (ydervæggen) og hvid 3 (bunden) føres ind. Fra kameraet og 21,5 mm ud er hele kanalens bredde fri og bunden 1,1 mm dybere, og lysringen har et hak bag på ydersiden. Sæt klipsene på, læg dem i lommen med ledningerne bøjet ind i slidsen ved kameraet, og læg front og ring på: ligger front, ring og bagramme helt sammen, uden at klipsene trykker dem fra hinanden? |
| `halo-gen2-v59-hurtig_proeve-klipslomme_bagramme.3mf` | ASA hvid | 42 × 27 × 28 | 17 min |  |
| `halo-gen2-v59-hurtig_proeve-klipslomme_lysring.3mf` | klar PETG | 35 × 18 × 7 | 3 min |  |
| `halo-gen2-v59-hurtig_proeve-klipslomme-hoejre_front.3mf` | ASA sort | 42 × 38 × 28 | 13 min | v46: højre klipslomme, hvor hvid 2 (indervæggen) og RGB (ydervæggen, bagerst) føres ind. Lysringen har hakket på indersiden fra x 21. Samme prøve: ligger klipsene i lommen og ledningerne i slidsen, og lukker front, ring og bagramme helt? |
| `halo-gen2-v59-hurtig_proeve-klipslomme-hoejre_bagramme.3mf` | ASA hvid | 42 × 27 × 28 | 13 min |  |
| `halo-gen2-v59-hurtig_proeve-klipslomme-hoejre_lysring.3mf` | klar PETG | 35 × 18 × 7 | 3 min |  |
| `halo-gen2-v59-hurtig_proeve-hjoerne_skal.3mf` | ASA sort | 66 × 66 × 64 | 1 t 00 min | v41: ét hjørne af hele stakken med én frontskrue (4,0 × 50 T20) skruet i bagfra. Hovedet skal nu ligge 2 mm under bagsiden (v40: plant). Lukker skal og front uden fuge, sidder bagrammen fast (knusribberne trykkes flade), og ligger ringen stille? |
| `halo-gen2-v59-hurtig_proeve-hjoerne_front.3mf` | ASA sort | 66 × 66 × 28 | 19 min |  |
| `halo-gen2-v59-hurtig_proeve-hjoerne_bagramme.3mf` | ASA hvid | 60 × 62 × 29 | 36 min |  |
| `halo-gen2-v59-hurtig_proeve-hjoerne_lysring.3mf` | klar PETG | 59 × 58 × 7 | 5 min |  |
| `halo-gen2-v59-hurtig_proeve-skaerm-lysring.3mf` | ASA sort | 224 × 307 × 7 | 1 t 44 min | De nederste 7 mm af fronten med lysringens sæde og skærmlommen. Læg skærmen og den hele lysring i: ligger glasset ind mod kanten hele vejen rundt, og er skyggefugen ved ringen jævn? Lysringen printes hel. |
| `halo-gen2-v59-hurtig_proeve-laasetunge.3mf` | ASA sort | 35 × 42 × 20 | 10 min | Vægbeslagets venstre låsetunge. Prøves i `proeve-laas-reed`: går den ind i låseslidsen, og kan låseskruen skrues i? |
| `halo-gen2-v59-hurtig_proeve-laasetunge-hoejre.3mf` | ASA sort | 22 × 40 × 20 | 8 min | Vægbeslagets højre låsetunge. Prøves i `proeve-laas-hoejre`. |
| `halo-gen2-v59-hurtig_proeve-skinne_vaegbeslag.3mf` | ASA sort | 124 × 32 × 13 | 19 min | Skinnen øverst på vægbeslaget og stativbeslaget, som boksen hænger på. Prøves i `proeve-wago-loekker` (skallens udsparing til skinnen ligger i det stykke): glider skinnen ind uden at tvinge, og sidder den uden slør? |
| `halo-gen2-v59-hurtig_proeve-skinne_stativbeslag.3mf` | ASA sort | 132 × 36 × 13 | 24 min |  |
| `halo-gen2-v59-hurtig_proeve-stativ-hylde.3mf` | ASA sort | 189 × 60 × 54 | 49 min | v54: slidsen til strømstikket er som i v51 igen (16 mm bred), kabellåsens form fra v52 er væk. v37: stativbeslagets hylde med hullet til gevindindsatsen (massiv som i den rigtige 3MF) og tungerne til skallens låse. Smelt indsatsen (1/4"-20 × 12,7) i med loddekolben: går den lige ned og flugter med hylden? Skru kuglehovedets lynplade i, og prøv tungerne i `proeve-laas-reed` og `proeve-laas-hoejre`. |

## Hele dele (kladde)

De normale dele, 1:1, med kladdeindstillingerne. Til den første hele samling efter prøverne.

| Fil | Filament | Mål på pladen (mm) | Ca. tid | Ca. filament |
|---|---|---|---|---|
| `halo-gen2-v59-hurtig_skal.3mf` | ASA sort | 224.5 × 307.0 × 64.0 | 9 t 10 min | 335 g |
| `halo-gen2-v59-hurtig_front.3mf` | ASA sort | 224.5 × 307.0 × 27.7 | 2 t 46 min | 132 g |
| `halo-gen2-v59-hurtig_bagramme.3mf` | ASA hvid | 217.1 × 300.0 × 29.2 | 6 t 10 min | 177 g |
| `halo-gen2-v59-hurtig_lysring.3mf` | klar PETG | 209.1 × 291.6 × 6.7 | 42 min | 35 g |
| `halo-gen2-v59-hurtig_vaegbeslag.3mf` | ASA sort | 189.0 × 284.5 × 19.5 | 1 t 32 min | 59 g |
| `halo-gen2-v59-hurtig_stativbeslag.3mf` | ASA sort | 222.5 × 304.0 × 54.0 | 2 t 08 min | 82 g |
| `halo-gen2-v59-hurtig_blaeserhegn.3mf` | ASA sort | 125.5 × 14.7 × 41.0 | 39 min | 13 g |
| `halo-gen2-v59-hurtig_tema-vinge-venstre-eksempel.3mf` | ASA sort | 61.9 × 270.0 × 77.1 | 1 t 39 min | 78 g |

Fronten og stativbeslaget er uden logo i hurtigsættet (fordybningen står tom). Skal logoet med, så brug de normale `halo-gen2-v59_front_flerfarvet.3mf` og `halo-gen2-v59_stativbeslag_flerfarvet.3mf`. Dominance-temaet og eksempeltoppen er ikke med her; brug de normale filer.

## Indstillinger (ligger i 3MF'erne)

- **Kladde (alle sorte og hvide dele):** 0,28 mm lag, 2 vægge, 3 top- og bundlag (mindst 0,8 mm), 10 % crosshatch, ingen brim. Bambu ASA (v59; 260 °C, første lag 270 °C, plade 100 °C, kammeret varmes op til 55 °C, højst 16 mm³/s) med krympekompensation 99,6 %, glat PEI med et tyndt lag limstift. Lysringens stykker er klar PETG uden kammervarme og må aldrig ligge på en plade med ASA.
- **Små lag i ASA** (9. nov.): korte lag får op til 80 % køling og mindst 15 s pr. lag; store lag beholder ASA-profilens 10 %. Blæserhegnet og mikrofonstrippen (tynde stænger) printes ved 255 °C med 60–90 % køling og kammeret på 45 °C.
- **Skallen** har support kun ved de samme enforcere som den normale skal (tree, manuel); prøvestykker uden et af de steder har ingen support. Den hele skal har 3 mm brim.
- **Fronten** har elefantfodskompensation 0,15 som den normale, så skyggefugen ved lysringen bliver åben.
- **Lysringen** printes som den normale (klar PETG, massiv, koncentriske baner, tekstureret PEI), men med 0,2 mm lag i stedet for 0,16.
- **Stativbeslagets hylde** er massiv (6 vægge, 100 %) som i den normale 3MF, så gevindindsatsen prøves i den rigtige plast.
- Høje, smalle prøvestykker har 3 mm brim.
- De forstærkede hjørner fra v37 er ikke med: de ændrer ikke pasformen, kun styrken ved et fald.
- Printretning som filerne ligger. Flyt eller vend dem ikke.

## Husk

- Kladdeindstillingerne ændrer ikke målene, men 0,28 mm lag kan flytte en højde op til et halvt lag (0,14 mm). En pasform på 0,2 mm eller mindre i højden (fx klikket og skyggefugen) bedømmes til sidst på et normalt print.
- Et prøvestykke er stivere end den hele del. Bedøm klikkraft og hvor meget en væg giver efter på det hele print.
- Skruer kan skrues i til prøve, men ikke ind og ud mange gange.
- Ret aldrig en fejl i en hurtigfil. Ret CAD (`hardware/cad/gen2_concept.scad`), lav en ny version og kør værktøjet igen.
