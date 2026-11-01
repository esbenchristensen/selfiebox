# Selfi Halo gen 2, version v37: hurtigprint

**Version:** halo-gen2-v37-hurtig. Kun til pasformsprøver. Geometrien er den samme som i de normale printfiler for halo-gen2-v37 (`hardware/stl/gen2/halo-gen2-v37/`); kun printindstillingerne er anderledes, og der er små prøvestykker skåret ud af delene. Reglerne står i `hardware/docs/HURTIGPRINT.md`. **Brug aldrig disse filer til en boks, der skal ud til en kunde.**

Lavet med `python3 hardware/tools/make_hurtig.py halo-gen2-v37`. Alle filer er Bambu Studio-projekter (3MF) til H2C med indstillingerne indbygget: åbn, tjek at spolen passer, og tryk Print. STL-filerne ligger ved siden af.

## Sådan bruges sættet

1. **Print plade 1 først** (`plade1-nyt-i-v37`, ca. 5 t 13 min): alt det, v37 har ændret. Plade 2 (ca. 8 t 32 min) er resten af holderne og samlingerne, plade 3 (ca. 3 t 10 min) tilvalg og skærmens kant. Hver plade har stykker i én farve, så det er ét print pr. plade, og de kan køre på flere printere på én gang. Hvert stykke ligger også som sin egen 3MF, hvis I kun vil prøve ét sted.
2. Saml stykkerne med de rigtige købedele, og gå listen "Hvad prøves" igennem.
3. Passer det hele, så print de hele dele med kladdeindstillinger (eller de normale filer), og saml en hel boks.
4. Passer noget ikke, så skriv det i en samlenote. Rettelsen laves i CAD og bliver en ny version; ret aldrig en hurtigfil.

Tiderne er skøn fra PrusaSlicer med H2C-lignende hastigheder og kan afvige 20–40 %; Bambu Studio viser den rigtige tid, når pladen er slicet.

## Prøveplader

| Fil | Hvad | Filament | Stykker | Ca. tid | Ca. filament |
|---|---|---|---|---|---|
| `halo-gen2-v37-hurtig_plade1-nyt-i-v37_sort.3mf` | det, v37 har ændret: print den først | PLA sort | stroemindgang, wago-loekker, laas-reed, stativ-hylde, klik_skal, klik_front, kabelloekker, laasetunge, kamera_front | 4 t 34 min | 165 g |
| `halo-gen2-v37-hurtig_plade1-nyt-i-v37_hvid.3mf` | det, v37 har ændret: print den først | PLA hvid | kamera_bagramme | 39 min | 10 g |
| `halo-gen2-v37-hurtig_plade2-resten_sort.3mf` | de andre holdere og samlinger | PLA sort | stroem, ledstyring, mikrofonkerne, sikring, hjoerne_skal, hjoerne_front, daemper, hoejttaler, laas-hoejre, laas_front, stoedsensor, laasetunge-hoejre, skinne_stativbeslag, vingerille, skinne_vaegbeslag | 6 t 32 min | 256 g |
| `halo-gen2-v37-hurtig_plade2-resten_hvid.3mf` | de andre holdere og samlinger | PLA hvid | lyskanal_bagramme, hjoerne_bagramme, laas_bagramme, skaermhuller | 1 t 49 min | 60 g |
| `halo-gen2-v37-hurtig_plade2-resten_natur.3mf` | de andre holdere og samlinger | klar PETG | lyskanal_lysring, hjoerne_lysring | 11 min | 8 g |
| `halo-gen2-v37-hurtig_plade3-ekstra_sort-1.3mf` | tilvalg og skærmens kant | PLA sort | skaerm-lysring, 4g | 2 t 05 min | 97 g |
| `halo-gen2-v37-hurtig_plade3-ekstra_sort-2.3mf` | tilvalg og skærmens kant | PLA sort | mikrofonstrip | 1 t 05 min | 29 g |

## Prøvestykker

Hvert prøvestykke er en kasse skåret ud af en del, så det passer præcis til denne version. Det står på den samme flade som delen og printes i den samme retning. Stykker med samme navn og flere dele (fx `kamera`, `hjoerne`, `klik`) lægges sammen.

| Fil | Filament | Mål (mm) | Ca. tid | Hvad prøves |
|---|---|---|---|---|
| `halo-gen2-v37-hurtig_proeve-stroemindgang.3mf` | PLA sort | 44 × 104 × 24 | 39 min | v37: kanalen efter dine mål af hunstikket og trækaflastningen over det. Skru ledningerne i stikket, skub det ind forfra med spidsen i slidsen, til det står på halsen på bunden, og læberne holder det firkantede hus. Går det ind uden at ramme noget? Stik strømforsyningens stik op gennem hullet nedefra: stopper bøjlen stikket? Klik 2 ledninger i trækaflastningen. |
| `halo-gen2-v37-hurtig_proeve-sikring.3mf` | PLA sort | 28 × 66 × 33 | 18 min | v36: sikringsholderen på højre væg. Sidder den fast, og kan låget åbnes, så sikringen kan skiftes? |
| `halo-gen2-v37-hurtig_proeve-wago-loekker.3mf` | PLA sort | 180 × 68 × 19 | 1 t 05 min | v37: Wago-rækken med 3 × 221-413 og 3 × 221-415 (W3 er nu 5-polet) og de 2 velcroløkker under rækken (z 232). Tryk klemmerne ind: griber krogen i ledningsindgangen, og går en afisoleret ledning stadig ind over den? Kan en 10 mm velcrostrop trækkes gennem løkkerne og strammes med fingrene under rækken? |
| `halo-gen2-v37-hurtig_proeve-kabelloekker.3mf` | PLA sort | 52 × 42 × 14 | 13 min | v37: de 2 flade velcroløkker midt på bagvæggen (som v23–v35). Går en 10 mm velcrostrop igennem begge? |
| `halo-gen2-v37-hurtig_proeve-stroem.3mf` | PLA sort | 76 × 144 × 35 | 1 t 08 min | v36: 5 V-forsyningen i sin bakke. Tænderne skal holde den, uden at væggene skubbes ud. |
| `halo-gen2-v37-hurtig_proeve-ledstyring.3mf` | PLA sort | 62 × 124 × 27 | 42 min | v36: WLED-styringen (Gledopto) i sin bakke med 2,4 mm vægge. Klikker den på plads og sidder fast? |
| `halo-gen2-v37-hurtig_proeve-daemper.3mf` | PLA sort | 20 × 60 × 42 | 18 min | v36: dæmperens printkort (DFR0457) på de 4 puder, 2 pinde i hullerne, én tand pr. side. Klikker kortet på plads? |
| `halo-gen2-v37-hurtig_proeve-hoejttaler.3mf` | PLA sort | 83 × 47 × 25 | 41 min | Højttaleren (FIT0502) i sin bakke bag gitteret. |
| `halo-gen2-v37-hurtig_proeve-laas-reed.3mf` | PLA sort | 46 × 66 × 22 | 28 min | Venstre låseslids i bunden, låseskruens hul og reed-modulets bakke. Prøves med `proeve-laasetunge` og `proeve-stativ-hylde`: går tungen ind og op, og kan låseskruen skrues i? |
| `halo-gen2-v37-hurtig_proeve-laas-hoejre.3mf` | PLA sort | 28 × 43 × 22 | 14 min | Højre låseslids (12 mm tunge). Prøves med `proeve-laasetunge-hoejre` og `proeve-stativ-hylde`. |
| `halo-gen2-v37-hurtig_proeve-4g.3mf` | PLA sort | 48 × 81 × 18 | 22 min | 4G-modemet i sin bakke (tilvalg). |
| `halo-gen2-v37-hurtig_proeve-mikrofonkerne.3mf` | PLA sort | 86 × 68 × 23 | 28 min | v36: mikrofonkernen (XVF3800) i holderen. Kan USB-C, AUX og fladkablet sættes i, mens kortet ligger i holderen? |
| `halo-gen2-v37-hurtig_proeve-stoedsensor.3mf` | PLA sort | 34 × 41 × 15 | 12 min | v36: stødsensoren (LIS3DH) i sin bakke til højre for 5 V-forsyningen. |
| `halo-gen2-v37-hurtig_proeve-mikrofonstrip.3mf` | PLA sort | 126 × 13 × 64 | 1 t 05 min | Mikrofonkortet i lommen i bunden: pindene gennem hullerne og kortet fladt på de 4 ringe (tilvalg). |
| `halo-gen2-v37-hurtig_proeve-vingerille.3mf` | PLA sort | 22 × 36 × 14 | 8 min | v36: rillen bag på skallen med lommen under. Prøv med den hele `tema-vinge-venstre-eksempel`: går tappen i rillen, og falder tåen ned i lommen, så vingen ikke kan vippe ud forneden? |
| `halo-gen2-v37-hurtig_proeve-klik_skal.3mf` | PLA sort | 20 × 39 × 64 | 23 min | v37: frontens nederste venstre klikkant (95 mm oppe) og skallens rille. Tryk de to stykker sammen, til det klikker, og træk dem fra hinanden igen med hånden. Klikker det tydeligt, og kan det skilles uden værktøj? Stykket er kort, så det er stivere end den hele væg; bedøm kraften på det hele print. |
| `halo-gen2-v37-hurtig_proeve-klik_front.3mf` | PLA sort | 10 × 39 × 28 | 9 min |  |
| `halo-gen2-v37-hurtig_proeve-kamera_front.3mf` | PLA sort | 62 × 37 × 28 | 38 min | v37: kameraet på frontens tappe, linsen midt i hullet (Ø8,6 i den yderste 1 mm, Ø10 bagved), bagrammens 4 rør med knusspidser trykker kortet let ned, kablet gennem slidsen og klikstikkene i deres lommer. Læg front og bagramme sammen med kameraet imellem: rører linsen ingenting, og sidder kortet fast uden at bøje? |
| `halo-gen2-v37-hurtig_proeve-kamera_bagramme.3mf` | PLA hvid | 62 × 27 × 28 | 39 min |  |
| `halo-gen2-v37-hurtig_proeve-laas_front.3mf` | PLA sort | 43 × 42 × 28 | 13 min | En sidelås mellem front og bagramme (venstre side): klikker begge arme, og kan de vippes fri med en lille skruetrækker? |
| `halo-gen2-v37-hurtig_proeve-laas_bagramme.3mf` | PLA hvid | 30 × 42 × 29 | 20 min |  |
| `halo-gen2-v37-hurtig_proeve-skaermhuller.3mf` | PLA hvid | 144 × 16 × 20 | 25 min | Bagrammens nederste tværbjælke med de 2 nederste skruetårne til skærmen. Skru en M2,5 × 3–4 mm i hvert. |
| `halo-gen2-v37-hurtig_proeve-lyskanal_bagramme.3mf` | PLA hvid | 66 × 64 × 29 | 33 min | Lyskanalen nederst til venstre med ca. 10 cm strip-bane: RGB i bunden, så hvid 2, så hvid 1, og lysringens 45° krave. Pres bagrammen på ringen: står ringens skulder fast, og bliver strippene liggende? |
| `halo-gen2-v37-hurtig_proeve-lyskanal_lysring.3mf` | klar PETG | 65 × 62 × 7 | 6 min |  |
| `halo-gen2-v37-hurtig_proeve-hjoerne_skal.3mf` | PLA sort | 66 × 66 × 64 | 1 t 00 min | Ét hjørne af hele stakken med én frontskrue (4,0 × 50 T20) skruet i bagfra: lukker skal og front uden fuge, sidder bagrammen fast (knusribberne trykkes flade), og ligger ringen stille? |
| `halo-gen2-v37-hurtig_proeve-hjoerne_front.3mf` | PLA sort | 66 × 66 × 28 | 19 min |  |
| `halo-gen2-v37-hurtig_proeve-hjoerne_bagramme.3mf` | PLA hvid | 60 × 62 × 29 | 31 min |  |
| `halo-gen2-v37-hurtig_proeve-hjoerne_lysring.3mf` | klar PETG | 59 × 58 × 7 | 5 min |  |
| `halo-gen2-v37-hurtig_proeve-skaerm-lysring.3mf` | PLA sort | 224 × 307 × 7 | 1 t 43 min | De nederste 7 mm af fronten med lysringens sæde og skærmlommen. Læg skærmen og den hele lysring i: ligger glasset ind mod kanten hele vejen rundt, og er skyggefugen ved ringen jævn? Lysringen printes hel. |
| `halo-gen2-v37-hurtig_proeve-laasetunge.3mf` | PLA sort | 35 × 42 × 20 | 10 min | Vægbeslagets venstre låsetunge. Prøves i `proeve-laas-reed`: går den ind i låseslidsen, og kan låseskruen skrues i? |
| `halo-gen2-v37-hurtig_proeve-laasetunge-hoejre.3mf` | PLA sort | 22 × 40 × 20 | 8 min | Vægbeslagets højre låsetunge. Prøves i `proeve-laas-hoejre`. |
| `halo-gen2-v37-hurtig_proeve-skinne_vaegbeslag.3mf` | PLA sort | 124 × 32 × 13 | 19 min | Skinnen øverst på vægbeslaget og stativbeslaget, som boksen hænger på. Prøves i `proeve-wago-loekker` (skallens udsparing til skinnen ligger i det stykke): glider skinnen ind uden at tvinge, og sidder den uden slør? |
| `halo-gen2-v37-hurtig_proeve-skinne_stativbeslag.3mf` | PLA sort | 132 × 36 × 13 | 24 min |  |
| `halo-gen2-v37-hurtig_proeve-stativ-hylde.3mf` | PLA sort | 189 × 60 × 54 | 49 min | v37: stativbeslagets hylde med hullet til gevindindsatsen (massiv som i den rigtige 3MF) og tungerne til skallens låse. Smelt indsatsen (1/4"-20 × 12,7) i med loddekolben: går den lige ned og flugter med hylden? Skru kuglehovedets lynplade i, og prøv tungerne i `proeve-laas-reed` og `proeve-laas-hoejre`. |

## Hele dele (kladde)

De normale dele, 1:1, med kladdeindstillingerne. Til den første hele samling efter prøverne.

| Fil | Filament | Mål på pladen (mm) | Ca. tid | Ca. filament |
|---|---|---|---|---|
| `halo-gen2-v37-hurtig_skal.3mf` | PLA sort | 224.5 × 307.0 × 64.0 | 8 t 58 min | 395 g |
| `halo-gen2-v37-hurtig_front.3mf` | PLA sort | 224.5 × 307.0 × 27.7 | 2 t 45 min | 156 g |
| `halo-gen2-v37-hurtig_bagramme.3mf` | PLA hvid | 217.1 × 300.0 × 29.2 | 5 t 07 min | 188 g |
| `halo-gen2-v37-hurtig_lysring.3mf` | klar PETG | 209.1 × 291.6 × 6.7 | 42 min | 35 g |
| `halo-gen2-v37-hurtig_vaegbeslag.3mf` | PLA sort | 189.0 × 284.5 × 19.5 | 1 t 32 min | 69 g |
| `halo-gen2-v37-hurtig_stativbeslag.3mf` | PLA sort | 222.5 × 304.0 × 54.0 | 2 t 08 min | 97 g |
| `halo-gen2-v37-hurtig_blaeserhegn.3mf` | PLA sort | 125.5 × 14.7 × 41.0 | 39 min | 15 g |
| `halo-gen2-v37-hurtig_tema-vinge-venstre-eksempel.3mf` | PLA sort | 61.9 × 270.0 × 77.1 | 1 t 39 min | 92 g |

Fronten og stativbeslaget er uden logo i hurtigsættet (fordybningen står tom). Skal logoet med, så brug de normale `halo-gen2-v37_front_flerfarvet.3mf` og `halo-gen2-v37_stativbeslag_flerfarvet.3mf`. Dominance-temaet og eksempeltoppen er ikke med her; brug de normale filer.

## Indstillinger (ligger i 3MF'erne)

- **Kladde (alle sorte og hvide dele):** 0,28 mm lag, 2 vægge, 3 top- og bundlag (mindst 0,8 mm), 10 % crosshatch, ingen brim. Bambu PLA Basic, glat PEI. Ingen opvarmning af kammeret.
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
