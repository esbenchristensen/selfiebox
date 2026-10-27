# Selfi Halo gen 2, version v27: printguide

**Version:** halo-gen2-v27 (27. okt. 2026). Alle filer i denne mappe starter med `halo-gen2-v27_`. Den erstatter halo-gen2-v26, som ikke må printes. **Ingen glas og ingen pakninger i boksen.** Nye dele: **front, lysring, bagramme og skal**. Vægbeslag, blæserhegn, logo og tema-eksemplerne er præcis som i v26 (filerne er kopieret med nyt navn). Kamerarøret er væk. CAD-kilden er `hardware/cad/gen2_concept.scad` i esbenchristensen/selfiebox.

Printer: Bambu Lab H2C. **Print fra 3MF-filerne** (se Indstillinger); STL-filerne ligger også i printretning. Én del pr. plade, 1 stk. af hver. Kun hovedenheden; tema-delene er tilbehør.

## Hvad er nyt i v27: ingen glas og ingen pakninger

Esben 27. okt. 2026: drop alt glas og alle pakninger i hele boksen; vi skal ikke bruge dem, og de gør boksen alt for kompleks at samle. Alt skal passe, når de er væk. Tegning: `halo-gen2-v27_uden_glas_og_pakninger.png` (de 4 steder, v26 ved siden af v27). Snit: `halo-gen2-v27_snit.png`.

Det, der er væk: O-ringsnoren (RS 234-2906) de 4 steder, kameraglasset Ø12 × 1,5, snor-ringen bag glasset og **kamerarøret** (det var der kun for at trykke snor-ringen mod glasset). Rillerne og lommen, som snoren lå i, er også væk, så der ikke står tomme spalter tilbage. Skærmens glas er selve skærmen og sidder, som det plejer.

- **Kameraet: åbent vindue.** Vinduet i forsiden er stadig Ø12,1, så forsiden ser ud som før. Bag det skråner hullet 60° ind til et Ø8,6-hul gennem frontpladen, og linsen sidder i det hul. **Kameraet sidder 0,9 mm længere fremme** (linsens spids 2,2 mm bag forsiden; v26: 3,1 mm, 1,0 mm bag glasset), så Wide-kameraets synsfelt (120° diagonalt) stadig går fri af vinduets kant med 0,24 mm hele vejen. Uden glas brydes lyset ikke længere, så med kameraet det gamle sted skulle vinduet have været ca. Ø15. Alt, der holder kameraet, er flyttet med: tappene, kamerakassen og endestykkerne i fronten og bagrammens 4 rør, som trykker kortet mod tappene (de er 0,9 mm længere, så **bagrammen er ny**; ellers er den som v26). **Linsen rører stadig intet:** 0,65 mm luft rundt om, og intet foran den, så fokusmotoren kan køre frit.
- **Lysringen** har ingen skulder og ingen snorlomme mere. Ringens væg går lige gennem slidsen, og kraven ligger direkte på frontpladens bagside; det er ringens faste stop. Frontpladen er hel (3,2 mm) rundt om slidsen (v26: 2,2 mm ved lommen). Lysfladen, skyggefugen (0,15 mm) og kraven er de samme, og bagrammens 54 knusknopper trykker stadig kraven ned mod frontpladen, så lysfladen ikke kan trykkes ind. **Ny lysring og ny front.**
- **Skærmen** ligger direkte på frontens 1,6 mm kant som før; rillen i kanten er væk, så kanten er massiv hele vejen rundt.
- **Højttaleren** ligger med flangen direkte på bagvæggen; rillen rundt om gitteret er væk. Krogene holder flangen inde mod væggen som før. **Ny skal** (kun den rille er ændret).
- **Front mod skal** havde allerede ingen snor (v21): ribbe og rille med drænhak, og fladerne mødes helt.
- **Tætheden:** uden pakninger tætner boksen ved formen alene, som i v19: lukket top, ribbe og rille mellem front og skal, drænhak, lukkede låse- og vingelommer, luftskærme over bundhullerne og mikrofonens små ringe om lydhullerne (de er printet i skallen og bliver). Brug den indendørs eller under tag: den tåler spild og et glas, der vælter ovenpå, men den er ikke tænkt til regn eller sprøjt (som v22-noten sagde om boksen uden pakninger). Kameravinduet er et åbent hul: tør det af med en tør klud, ikke en våd.
- **Samlingen** er kortere: ingen snor ved lysring, skærm og højttaler, intet glas og intet kamerarør. Indkøb: snorrullen og kameraglasset skal ikke købes.
- **Vægbeslag og stativbeslag** passer uændret: bagsiden, låsene og bunden er de samme. **selfi-stativbeslag-v4** bruges stadig (dens 3D-model viser nu en v27-boks).
- **Tjekket i CAD:** alle dele er skåret mod hinanden igen mod v26 (`hardware/tools/check_fit_gen2.py`), nu også med kameraets synsfelt og linsen som egne "må ikke røres"-legemer: **ingen nye kollisioner** mod v26. Synsfeltet rører intet (0 mm³ overlap; 0,24 mm fri på tværs ved vinduets kant, som i v24–v26), linsen har 0,67 mm til fronten hele vejen rundt, lysringens krave ligger på frontpladen (0 mm) og bagrammens knusknopper på kraven som før, og alle andre overlap og afstande er præcis som i v26. Stativbeslag v4 er skåret mod v27's skal og front: intet overlap.

## Hvad var nyt i v26: printgennemgang

Esben 27. okt. 2026: gennemgå hele boksen for alt, der kan gå galt i printet: uønsket support, tråde, ting der hænger i luften. Alle printfiler er gennemgået lag for lag (0,2 mm), som en slicer ser dem: hvor et lag hænger mere end 1,5 mm ud over laget under, om det er en bro med fæste i begge ender, og hvor vægge er under 0,8 mm (2 baner). Tegning: `halo-gen2-v27_printrettelser.png`. Fire ting var forkerte og er rettet:

- **Blæserhegnet lå forkert på pladen.** Guiden sagde "risten ned", men filen i v24 og v25 lå med armenes spidser nedad og risten 13 mm oppe i luften, så hele risten og puden skulle have været printet på support. Og uanset vej op stod de 2 klikarme på højkant, så de bøjede på tværs af lagene, når hegnet klikkes på (ca. 1,1 % tøjning, der hvor ASA knækker på tværs af lag). **Nu printes hegnet på siden** (41 mm højt): hele profilen står på pladen i hvert lag, armene bøjer i lagets plan, og intet hænger ud. Slidserne i risten går nu på tværs (vandret i boksen, lodret på pladen), så de ikke bliver lange broer; de er stadig 2,5 mm brede, og der er lige så mange. Mål og pasform på tværstykket er de samme.
- **Vægbeslagets tunger hang 9 mm ud over pladen.** Pladen bag hver låsetunge stoppede 9 mm før tungens øverste ende. Med bagsiden ned blev det en flad underside på 9 × 18 mm (højre: 9 × 12) 4 mm over pladen, uden support. Det er netop roden af tungen, der bærer boksen. Nu går pladen 2 mm forbi tungen, så hele tungen vokser op af pladen. Pladen ligger i spalten bag boksen, så intet andet ændrer sig. Stativbeslaget havde samme fejl: **selfi-stativbeslag-v4** (samme pasform som v3; T-møtrikkens huller er nu også dråbeformede).
- **Luftskærmene over bundhullerne hang i luften.** Skærmene stopper 1,5 mm før bagvæggen (luften går også ud den vej), så deres første lag blev lagt 1,5 mm over bagvæggen med fæste kun i bunden: to 8,6 mm lange udhæng og en 43 mm lang kant imellem. Nu er der 3 små stolper (1,6 × 1,6 mm) over spalten i hver skærm, ved hjørnerne og midt på, så kanten er korte broer (8,6 og 2 × 16 mm). Luften har stadig næsten hele spalten.
- **Uønsket support i skallen.** Med automatisk support fylder sliceren steder, der kan printes uden: strømrøret (det var der, support fyldte hunstikkets hul i v23), de 2 låselommer (support, der sidder tilbage i en slids med 0,2 mm luft, stopper tungen) og de 4 vingelommer. Og med "kun fra pladen" får det ene sted inde i skallen, der virkelig skal have support, ingen: **dæmperbakkens forreste væg** på venstre side er en 18 mm hylde 35 mm oppe uden noget under (den kan ikke tegnes om, for dæmperen fylder hele bakken). Derfor er der nu **`halo-gen2-v27_skal_support.3mf`**: skallen med 2 support-enforcere (skinnens udsparing øverst bagpå og dæmperbakkens væg) og 7 support-blockere (strømrør, 2 låselommer, 4 vingelommer). Med support-typen **Tree (manuel)** kommer der support præcis de 2 steder og ingen andre. Se "Skal" under Indstillinger.

**Printindstillinger** (Esben 27. okt., anden runde: forsiden på fronten viste banemønster på den glatte plade, og alt skal se støbt ud og holde). Ingen dele er ændret; kun hvordan de printes:
- **En 3MF pr. del** med lag, vægge, fyld, support og brim lagt ind på objektet, så alle bokse bliver printet ens (`_lysring`, `_bagramme`, `_vaegbeslag`, `_smaadele` med kamerarør og blæserhegn (v27: `_blaeserhegn`), `_tema-*`, og front og skal som før).
- **Frontens forside** (første lag) har nu *Monotonic line* og kun én væg i første lag, så banerne ligger ens og ikke laver krydsmønster langs kanterne. Bedst er stadig tekstureret PEI; se "Front: sådan bliver forsiden pæn".
- **Lysringen** printes med koncentriske baner, så lyset bliver jævnt.
- **Scarf seam** på alle dele, og sømmen sidder på boksens underside (skal og bagramme ligger derfor vendt 180° på pladen).
- **Skallen har en 3 mm brim** i stedet for musøre, og det lille blæserhegn også.
- Første lag 30 mm/s, *Avoid crossing walls* og tørt filament fra samme parti: se "Én gang: printer, filament og proces".

**Tjekket, ikke ændret** (det printer, men hold øje med det): bagrammens 14 klikarme står på højkant og bøjer på tværs af lagene (ca. 1,8 % ved klik; de holdt ved samlingen af v23, men vip dem ikke længere ud end nødvendigt), læberne i strip-banerne er 0,5–0,7 mm og printes som én bane, skallens inderste kant ved rillen mod fronten er 0,6 mm, og bakkernes klikkanter har en flad fangeflade på 1,2–2,0 mm, der kan hænge 0,1–0,2 mm ned (skrab den, hvis en del ikke vil klikke ned). Alt andet er broer på højst 16 mm eller udhæng på højst 1,5 mm.

Alle 35 dele er skåret mod hinanden igen: ingen nye kollisioner mod v25 (`hardware/tools/check_fit_gen2.py`).

## Hvad var nyt i v25: 2 låse og boksen tæt på væggen

Esben 27. okt. 2026: en lås mere i det andet nederste hjørne, og boksen skal sidde tættere på væggen, så man ikke kan få fingrene om bag den og hive i den, og så den ser ud, som om den er klistret til væggen. Tegning: `halo-gen2-v27_laas.png` (snit gennem begge låse og skinnen).

- **2 låse.** Ud over den gamle lås (82 mm til venstre for midten set forfra, til højre set bagfra) er der nu en lås **84 mm til højre for midten** (set forfra; nederst til venstre set bagfra). Den har sin egen slids, lukkede lomme, drænhul, bundknast og sikkerhedsskrue, i samme højde som den gamle. Tungen er **12 mm bred** (den gamle er 18), fordi hjørnet er trangt: 5 V-forsyningens bakke står ved x 74,2, og skallens hjørnerunding (R42,8) begynder ved x 68,5. Lommen går 2 mm fri af bakken, og tungens yderste nederste hjørne er skåret 0,5 mm inden for skallens indvendige runding. Magneten til løftealarmen sidder stadig kun i den gamle tunge.
- **Boksen sidder 4,5 mm fra væggen** (v24: 14 mm). Vægbeslagets plade er stadig 4 mm tyk, og boksens bagside står 0,5 mm fra pladen. Afstandsklodserne bag boksen er væk. Der er ikke plads til fingre bag boksen.
- **Ophængning som i v24:** hæng boksen på skinnen foroven med bunden holdt lidt ud, sving bunden ind, så begge tunger går ind i deres slidser, og skru begge sikkerhedsskruer i nedefra. Tjekket i CAD for både vægbeslag og stativbeslag: bunden kan svinges ind uden at noget tager fat (højst 0,2 mm, hvor tungens skrå næse løfter boksen), og toppen går fri af væggen.
- **Tema-delenes stropper er 3,9 mm tykke** (v24: 9 og 10), så de kan være i den smalle spalte bag boksen. Toppens stropper er gjort 10 mm brede (v24: 5) for at få noget af stivheden tilbage; de er stadig mere bøjelige frem og tilbage end før, men de bærer i træk, ikke i bøjning. Krogene er de samme. Styrketesten er regnet igen (`halo-gen2-v27_styrketest_kroge.md`): alle tilfælde har mindst 2 i sikkerhed, og når boksen hænger, er der kun 0,4 mm bag stropperne, så tema-delene kan ikke tages af.
- **Højttaleren** sidder bag gitteret i bagvæggen. Med 4,5 mm til væggen kommer lyden ud gennem spalten rundt om boksen; den bliver nok lidt dæmpet. Prøv lyden, når den første boks hænger.
- **Stativbeslaget** er lavet i en ny version med 2 tunger og samme afstand: **selfi-stativbeslag-v3**. v1 og v2 passer ikke til en v25-boks. (v26: brug **selfi-stativbeslag-v4**, samme pasform, printes uden support.)
- **Købedele:** 2 sikkerhedsskruer (Bolte 88115, ST4,2 × 25 Torx med pin) i stedet for 1.

## Hvad var nyt i v24: rettelser efter første samling

Esben samlede den første boks 26. okt. 2026 og fandt 9 ting, der skulle rettes. Snit: `halo-gen2-v27_snit.png` (lyskanal, kamera og lås). Kabelføring: `halo-gen2-v27_kabelfoering.png`. Ledningsdiagram: `halo-gen2-v27_ledningsdiagram.png`.

- **Kameraet rører ikke linsen.** Linsen på Camera Module 3 glider frem og tilbage, når den fokuserer, og må ikke røres. I v23 var der kun 0,2 mm rundt om linsen i kamerarøret, 0,3 mm til linseholderen og 0,4 mm fra holderen til kamerakassens væg, så med printets unøjagtighed kunne kortet ikke ligge fladt, og røret trykkede på linsen.
  - Kameraet sidder 0,4 mm længere tilbage, så der er **1,0 mm luft foran linsen** til glasset (v23: 0,6).
  - Kamerarøret har et hul på Ø8,6 (v23: Ø7,7), så der er **0,65 mm luft rundt om linsen**, og røret slutter **1,0 mm før linseholderen** (v23: 0,3).
  - Kamerakassen i fronten er 0,8 mm bredere end linseholderen i hver side (v23: 0,4), og endestykkerne ved lysringens ender står 2,0 mm foran kortet (v23: 0,8). Kortet ligger nu kun på de 4 tappe.
  - Vinduet foran er Ø12,1 (v23: Ø10,9), så synsfeltet stadig går fri, når linsen sidder længere tilbage. Glasset ligger på en 1,0 mm kant. Lysringens ender ved kameraet er rykket 0,6 mm ud, så der stadig er sort rundt om vinduet.
  - Bagrammens 4 rør trykker kortet mod tappene i fronten, som er det faste stop. Intet trykker kortet frem mod kamerarøret.
  - Væggene rundt om kamerakassen slutter **1,2 mm før kortet** (v23: 0,6), og **2,0 mm** hvor de krydser sensorens flade flexkabel under linseholderen (Raspberry Pis tegning: 8,9 mm bred, 7,3 mm ud fra holderen). Kortet rører derfor kun de 4 tappe og kan ikke komme til at ligge skævt på noget.
  - **Fokusmotoren:** linsen kører en brøkdel af en millimeter frem, når den fokuserer tæt på. Den har 1,0 mm fri foran sig og 0,7 mm rundt om, og røret rører ikke holderen, så intet kan stoppe den. Tjekket i CAD mod Raspberry Pis målskitse af Camera Module 3 Wide.
- **Låsen holder boksen helt fast.** I v23 stod låsetungen 10 mm over bundknasten (det var pladsen til at sænke boksen lige ned på beslaget). Når låseskruen blev spændt, trak den derfor boksen op mod tungen og af beslaget. Nu går tungen ned til **0,3 mm over knasten**. Skruen trækker boksen de 0,3 mm op, så står knasten på tungen, og boksen er spændt fast mellem beslagets krog foroven og skruen forneden. Slidsen er kun 0,2 mm bredere end tungen i hver side (v23: 0,6) og har en 1 mm indføring; tungens nederste forkant har en 2 mm affasning.
  - **Ophængning:** hæng boksen på krogen foroven med bunden holdt lidt ud fra væggen, og sving så bunden ind, så tungen går vandret ind i slidsen. Tjekket i CAD: boksen kan svinges ca. 3° om krogen uden at noget rammer, og tungen er fri af bagvæggen ved ca. 3,5°.
  - **Vægbeslaget er nyt** (længere tunge). Til stativet bruges **selfi-stativbeslag-v2** (samme tunge, uden styrepinde); v1 passer ikke til en v24-boks. (v25 har 2 låse; se ovenfor.)
- **Diffuseren kan ikke trykkes ind.** Bagrammen har **54 små knusknopper** (Ø1,4 til Ø0,5, 0,25 mm høje) på de to flader, der trykker på lysringens krave: reflektorens forkant inderst og stripvæggen yderst. De sidder på alle 4 lige stykker. Når frontskruerne spændes, trykkes de flade, og kraven presses frem, så ringens skulder står fast på frontpladen hele vejen rundt, uanset printets unøjagtighed. Ved kameraet (de sidste ca. 9 mm af ringens ender) er der ingen bagramme; der holder kamerakassens endestykker.
- **Kun 2 hvide strips.** Den 3. hvide strip i lommen i den skrå reflektor er væk, med lommen, læben, klikstikkets lomme og hullet til ledningen. Reflektoren er glat igen hele vejen og trykker selv på lysringens inderste krave, og lysringens kile er væk. Ledningsdiagrammet har kun strip 1 og 2, begge med + direkte fra W1 (W6 er væk), og W5 er en 221-413.
- **RGB-styringen passer.** Holderen var for kort. De 99,74 mm, der blev målt over armene, går til bunden af de åbne slidser, ikke til spidserne. Spids til spids er 99,74 + 2 × 4,5 = 108,7 mm, og manualen siger 108 mm. Holderen er nu tegnet til **108 mm** over begge arme (v23: 99,74), så de to stop sidder 4,1 mm længere ude i hver ende. Kassen og dens klikkanter er uændrede.
- **Blæserhegn og ledningsføring.** Pi'ens blæser stoppede, fordi der lå ledninger i den.
  - **Blæserhegnet** (`halo-gen2-v27_blaeserhegn.stl`) er en ny lille del, der **klikkes på bagrammens øverste tværstykke** midt over Pi'en, uden skruer (Esben 26. okt. 2026). En pude ligger på tværstykkets bagside, og 2 arme går over tværstykkets top og bund og klikker med en 0,8 mm krog bag dets forside. Skærmen og dermed Pi'en er skruet på netop det tværstykke, så afstanden til blæseren ikke afhænger af skallen. Risten sidder **3 mm over Active Cooler** med 2,5 mm slidser over blæseren, så luften kommer ind, men ingen ledning kan nå blæseren. Den går kun 20,5 mm ud til hver side, så GPIO-stikket og dets stik er frie. 2 ribber over køleren gør den stiv, og 4 små knopper står 0,8 mm over køleribben uden for blæseren, så risten ikke kan trykkes ned i blæseren. Den tages af ved at vippe en arm op med en lille skruetrækker.
  - **Serviceløkken går nedad:** de 2 slidser til velcrostroppen er flyttet fra bagrammens øverste tværstykke (over Pi'en, så løkken hang hen over blæseren) til det **nederste** (under Pi'en). Løkken går fra hovedbundtets øverste løkke (136 mm) ned til bagrammen, og den løse ledning hænger nedad foran 5 V-forsyningen, væk fra blæseren.
  - **Stødsensorens gren** gik før lige op midt på væggen hen over mikrofon-kernen, lige bag blæseren. Den går nu ud til højre (løkken ved 158 mm) og op uden om mikrofon-kernen, med en ny løkke ved 214 mm. Skallen har nu 8 løkker.
- **Hunstikket kan komme helt ned.** Conrad opgiver kroppen til 14 × 13 mm (v23 regnede med 13 × 13), så den kunne ikke komme ned i rummet på 13,8. Rummet er nu **14,6 × 14,6**, så stikket kan vende begge veje, og hullet til tønden er 0,5 mm større. De 2 fangere går nu 1,6 mm ind over kroppens top (v23: 1,2), så stikket ikke kan skubbes op, når proppen trykkes i nedefra.
- **Mikrofonbakken er lavere og giver plads til aux.** Kortet er kun 1,2 mm tykt; de 12,2 mm, bakken var tegnet til, var med komponenterne og benene under kortet, så kanterne sad oven på komponenterne. Nu står kortet på **4 puder** omkring sine egne M3-huller (benene under kortet går fri), 4 pinde går gennem hullerne, og kanterne klikker over selve printpladen. Væggene er 7 mm høje (v23: 15,4). Aux-stikket og USB-C sidder i overkanten (modsat det flade kabel), og der er væggen skåret ned til printpladen, så de kan stikke ud. Enderne har kun lave stop.
- **Strømrøret kan printes uden support.** Skallen printes med bagsiden ned, så røret ligger ned, og hullerne i det er vandrette. I v23 skulle de derfor have support. Nu er alle runde huller dråbeformede med en 45°-spids, og den firkantede plads til hunstikket har et 45°-tag, så røret printes uden support. Sæt en support-blokker i røret i Bambu Studio, så slicerens automatiske support ikke kommer derind.
- **Blæseren kører altid mindst 6000 rpm** (boksens software, ikke CAD): se nederst.



Alle andre dele er som i v23. Nye i v24: **skal, front, bagramme, lysring, kamerarør, vægbeslag og blæserhegn**. Mål på hunstikket er fra Conrads produktside (bestillingsnr. 1570909); der findes ingen tegning, så tjek det på første print. v23 må ikke printes.

## Hvad var nyt i v23: kabelføring

Esben 24. okt. 2026: ledningerne skal føres fast, så de ikke ligger løst og bliver klemt, når skallen lukkes. Tegning: `halo-gen2-v27_kabelfoering.png`. Løsningen er printede løkker i bagvæggen og en trækaflastning over strømstikket. **Ingen klisterholdere og ingen kabelkanaler** (klister slipper i varmen, og en kanal tvinger ledningen i en bestemt rute, som ikke passer, når noget skiftes).

- **7 printede løkker** i bagvæggen indvendigt. Hver løkke er en lille bro over væggen med en fri åbning på **10 × 2 mm**, så der kan trækkes enten en almindelig kabelbinder (op til 2,5 mm bred) eller en **10 mm velcrostrop** igennem. Velcro er det bedste til samling og service: den kan åbnes igen, strammes igen og klipper ikke i isoleringen. Kabelbindere bruges, hvor noget aldrig skal røres igen; klip enden af, så der ikke står en skarp tap ind i boksen.
- **Ruten:** ét hovedbundt op langs midten af bagvæggen, fra strømstikket i bunden og op mellem 5 V-forsyningen og WLED-styringen. Derfra går der korte grene ud til dæmperen, højttaleren og mikrofon-kernen. 2 løkker sidder på hovedbundtet (112 og 136 mm over bunden), 1 ved dæmperen (72 mm), 1 på tværs i venstre side (112 mm), 1 ved 4G-modulet (205 mm), 1 ved forsyningens øverste ende (100 mm) og 1 ved mikrofon-kernen (158 mm). Fire af dem er de gamle kabelbinderløkker fra v18–v22, nu med den større åbning og samme form som de nye.
- **Trækaflastning over strømstikket:** en printet klemme lige over hunstikket i bunden holder de 2 ledninger fra stikket i en Ø5,4 mm gennemgang med en 3,8 mm åben side, så de klikkes ind fra siden. Et ryk i strømkablet går dermed i skallen og ikke i skrueklemmerne. Klemmen sidder 6 mm over stikkets top.
- **2 slidser i bagrammens øverste tværstykke** (10 × 2,4 mm, 7,6 mm fra hinanden). Her bindes kablerne fra Pi'en og skærmen fast, så der er en **serviceløkke på ca. 10 cm** mellem bagrammen og skallen. Skallen kan derfor lægges ned ved siden af fronten uden at noget trækkes ud, og uden at nogen ledning skal af. Slidserne er huller, ikke løkker, fordi bagrammen printes med bagsiden ned og ikke må have noget, der stikker ud af den flade.
- **Tjekket i CAD:** alle 34 dele er skåret mod hinanden: ingen nye kollisioner. Hver løkke har mindst 10 mm fri til nærmeste modul, så der er plads til bundtet og stroppen, og alle løkker er broer i printretningen (skallen printes med bagsiden ned), så de ikke kræver support.

## Hvad var nyt i v22

Esben 23. okt. 2026: alt skal kunne samles og virke **uden pakninger og uden kameraglas**. Pakningerne og glasset er en ekstra tætning, ikke noget delene skal stå på. Snit: `halo-gen2-v26_snit_taetning.png` i v26-mappen og `halo-gen2-v27_snit.png` (snit A).

- **Lysringen har en skulder, der står på frontpladen.** I v20 og v21 hvilede kraven på snoren, så uden snor kunne ringen rasle og stikke op til 0,4 mm frem. Nu går ringens væg lige ned til lommens bund (2,2 mm), hvor en skulder (0,4 mm bred, fra slidsens kant og ud) står direkte på frontpladen. Bagrammen holder kraven nede. Ringen sidder dermed ens med og uden snor. Snoren ligger i en lukket rille ved siden af skulderen (1,8 × 1,0 mm) og klemmes fra 1,5 til 1,0 mm. Den synlige ring og skyggefugen (0,15 mm) er uændrede.
- **Kamerarøret har sit eget stop.** I v21 stoppede røret på glasset, så uden glas kunne det glide for langt frem. Nu sidder de 4 ribber i hjørnerne af kamerakassen (v21: på siderne), og deres forende stopper på frontpladens bagside. Med et glas på 1,5 mm rører rørets forside glasset samtidig, så snor-ringens rille stadig er lukket og fast. Uden glas står røret samme sted, og kameraet ser ud gennem det åbne vindue. Er glasset tykkere (op til 1,8), stopper røret på glasset; er det tyndere, ligger snor-ringen og holder det.
- **Uden pakninger og glas virker alt:** skærmglasset ligger direkte på frontens kant, front og skal mødes helt (ribbe og rille), højttalerens flange ligger inde mod væggen, lysringen står på sin skulder, og kamerarøret på sit stop. Der er bare ingen ekstra tætning, så brug den kun indendørs.
- **Tjekket i CAD:** alle 34 dele er skåret mod hinanden: ingen nye kollisioner. Lysringens skulder står på lommens bund (0 mm), og rørets ribber stopper på frontpladen (der er massiv front bag alle 4 hjørner).

## Hvad var nyt i v21

Esben 23. okt. 2026: de 4 slidser til temavinger bagpå gik i v20 lige ind i boksen, så vand og støv kunne komme ind ved siden af pakningerne. Og en tema-top skal kunne sidde ovenpå uden huller i taget. Snit: `halo-gen2-v27_snit_kroge.png`. Styrketest: `halo-gen2-v27_styrketest_kroge.md`.

- **Lukkede vingelommer:** hver slids går nu ind i en lukket, printet lomme (1,6 mm vægge, 6,5 mm dyb bag væggen, 4 mm plads under slidsen og 1 mm over). Et Ø2-drænhul i lommens bund fører vand ud bagud. Lommen er lukket ind mod boksen, så der ikke kommer noget ind.
- **Slidserne er 9 × 14 mm** (v20: 4 × 14), så en top og en vinge kan dele den øverste slids: toppen bruger den inderste halvdel, vingen den yderste.
- **Det nederste par er flyttet op til 175 mm** over bunden (v20: 57,7). Ved 57,7 ramte lommen dæmperen og reed-kontakten, og ved 121 højttaleren. Det øverste par sidder stadig i 240,2. Begge par sidder 100,25 mm fra midten.
- **En kabelbinderløkke** inde i venstre side er flyttet fra 175 til 205 mm, fri af lommen.
- Slidsens bund har en 1,3 mm skrå kant indvendig, så krogens afrunding går fri.
- **Temakroge:** tungen er 4 × 6 mm og hviler på slidsens bund. Bag væggen går en læbe 5 mm tyk og 3 mm ned. Påsætning: løft 3 mm, skub ind, lad den falde. For at komme af skal en krog 3 mm op og 8,25 mm bagud. Når boksen hænger på vægbeslaget, var der i v21–v24 kun 3,8 mm (top) og 4,8 mm (vinge) mellem stropperne og væggen (v25: 0,4 mm), **så tema-delene kan ikke tages af, mens boksen hænger.** Sæt dem på, før boksen hænges op.
- **Styrke:** beregnet med ASA i værste retning og 1,2 i kærvfaktor. Sikkerhed 4,4 for 50 N træk fremad i toppens skilt, 4,5 for 50 N ned på vingens forreste hjørne og 2,2 for et barn på 10 kg, der hænger i en vinge. Krav: mindst 2. Tema-dele **skal** printes med forsiden ned, så læben bøjes i lagets plan.
- **Tjekket i CAD:** alle 34 dele (boksens 31 + top og 2 vinger) er skåret mod hinanden: ingen kollisioner. Tungerne står på slidsens bund (0 mm, som de skal), toppen og vingen har 0,7 mm imellem sig i den fælles slids, og alt går fri af vægbeslaget. Script: `hardware/tools/check_fit_gen2.py` og `hardware/tools/strength_hooks_gen2.py`.
- **Låselommen er lukket igen i venstre side** (Esben 23. okt. 2026). I v20 skar frigangen om den gamle v1-skruestolpe (Ø9,5, fra bagrammen helt ind til bagvæggen) et rundt hul i lommens venstre væg, ca. 18–27 mm over bunden, så lommen stod åben ind mod boksen. Nu er væggen hel. Kun slidsen bagfra, skruehullet i bunden og drænhullet er åbne.
- **Låselommens drænhul går nu igennem.** I v20 stoppede det Ø2-hul 4 mm oppe, men bunden er ca. 6 mm tyk der, hvor den runder, så hullet var blindt. Nu går det helt op i lommen.
- **Oprydning efter gennemgangen** (Esben 23. okt. 2026, alle fund i dokumentet "Gen 2 gennemgang"):
  - Låselommens nederste venstre hjørne stak op til 1 mm ud gennem skallens runde underkant (siden v20). Lommen er nu skåret af 1 mm inde i skallen, så underkanten er glat.
  - De 2 nederste ydre snaplåse mellem front og bagramme er flyttet fra 75 til 62 mm fra midten, ind på lyskanalens lige stykke. Ved 75 mm ramte vinduet hjørnets bue og efterlod to tynde flager (0,1–0,3 mm) i fronten, som kunne knække af og ligge i lyskanalen. Derfor er **front og bagramme nye** i v21.
  - De 4 gamle v1-skruestolper, der blev tegnet ind og fjernet igen, og propperne over deres huller er væk. Det samme gælder rev G's kabelhul nederst til venstre og proppen over det. Den færdige skal er den samme, bortset fra låselommen.
  - Al kode til printermodulet, kabelproppen, den første gen 2-front, lamellerne bagpå og mikrofonen under taget er slettet. Kollisionstjekket viser, at alle andre 33 dele er præcis som før.
- **Alle pakninger lukker helt** (Esben 23. okt. 2026: der må ingen steder være mellemrum, hvor en pakning sidder; delene skal altid kunne lukkes helt sammen). Snit: `halo-gen2-v26_snit_taetning.png` (i v26-mappen).
  - **Front mod skal: ingen snor og ingen fuge.** I v20 stoppede fronten 0,2 mm før skallen, og snoren kunne ses i fugen. Nu mødes de to dele helt. Fronten har en ribbe (0,8 × 1,0 mm) hele vejen rundt, som går ind i en rille (1,4 × 1,4 mm) i skallens forkant, 1,0 mm fra yderkanten, ligesom i v19. Vand, der kommer forbi samlingen, løber rundt i rillen og ud gennem 2 små drænhak i bunden (60 mm fra midten). Bag den overlapper frontens tunge stadig skallens væg.
  - **Knusribber på skruetårnene:** når front og skal er det faste stop, skal bagrammen stadig spændes fast. Hver af de 4 stolper i skallen har 3 små kegler (Ø1,6 til Ø0,6), der stikker 0,2 mm forbi bagrammens bagside og bliver trykket flade, når frontskruerne spændes. Stolpens flade går 0,1 mm fri af bagrammen. Det tager printets unøjagtighed, så bagrammen og lysringen altid sidder fast.
  - **Kamera: røret stopper på glasset.** I v20 stod kamerarøret på linseholderen, 0,5 mm bag glasset, så snor-ringens klemning afhang af kameraets mål. Nu trykkes røret ind i frontens kamerakasse på 4 små ribber, til den flade forside stopper på glasset. Glasset ligger på kanten foran, og røret på glasset, så hjørnet med snor-ringen har et fast mål (snoren klemmes fra 1,5 til ca. 1,05 mm). Røret går 0,3 mm fri af linseholderen. **Kamerarøret er nyt.**
  - **Højttaler: intet slør.** Krogene holdt flangen med 0,1 mm slør, så snoren kunne skubbe flangen lidt fra væggen. Nu holder krogene flangen helt inde mod væggen.
  - Skærm og lysring lukker allerede helt: skærmglasset ligger direkte på frontens kant med snoren i rillen, og lysringens krave holdes af bagrammen, der står fast på frontens skruetårne.
  - Snor pr. boks er nu ca. 2,7 m (v20: 3,6 m), så én rulle på 5 m rækker stadig.
- Hurtigsættet har en ny prøve, `proeve-vingelomme` (den øverste venstre slids med lommen), og eksempelvingen.

## Hvad var nyt i v20

Esben 23. okt. 2026: boksen skal tætnes mere, med én aftagelig pakning alle steder, et lille glas foran kameraet, og den skal kunne tåle, at nogen sætter eller klistrer noget på den. Skitse (godkendt): `gen2-gennemgang/halo-gen2-v20_skitse_taetning-v2.png`. Snit gennem printfilerne: `halo-gen2-v26_snit_taetning.png` (i v26-mappen).

- **Én pakning alle steder:** O-ringsnor Ø1,5 mm i silikoneskum (RS 234-2906), skåret af en rulle, enderne stødt sammen i rillen, ingen lim. Den ligger løst i rillerne, holdes af delen ovenpå og kan tages ud og bruges igen. Ca. 3,6 m pr. boks, så én rulle på 5 m pr. boks. Rillerne er 2,0 mm brede, og snoren klemmes til ca. 1,0 mm.
- **Boksen er 2 mm bredere og 1 mm højere: 224,5 × 307 × 70** (v19: 222,5 × 306). Lyskanalen er 1 mm bredere på hver side, så der er plads til snoren ved siden af lysringen. Den synlige lysring er stadig 14 mm, og kanten fra boksens yderkant til ringen er stadig 7,8 mm hele vejen rundt. Skærmen, Pi'en og kameraet sidder 1 mm højere end før.
- **1 Front mod skal:** ribben på fronten og rillen med de 2 drænhak i skallen er væk. I stedet ligger snoren i en rille (2,0 × 0,8) i skallens forkant. Frontens yderkant stopper 0,2 mm før skallen, så der er en fin, jævn fuge på 0,2 mm, og de 4 frontskruer altid klemmer front, bagramme og skal hårdt sammen; snoren tager resten.
- **De 4 frontskruer er rykket 1,2 mm ind** mod midten (diagonalt i hjørnerne). I v19 skar skruetårnene skallens væg op i de 4 hjørner, så der var en vej ind for vand lige der. Nu er væggen hel hele vejen rundt. Tårnene stikker et lille stykke ind i lyskanalens hjørner, bag strippenes ryg (det kan ikke ses, og de skygger ikke), og bagrammens strip-væg har en lille udskæring til dem.
- **2 Skærm:** snoren ligger i rillen rundt om billedet i stedet for skumbåndet. Rillen er 2,0 × 1,0 (før 3,2 × 0,6), med 0,6 mm plast foran.
- **3 Lysring:** stadig en løs del i jeres matte, translucente materiale. Snoren ligger på begge sider af ringen i en lomme bag frontpladen (1 mm dyb, hele kanalens bredde), under ringens krave, og går rundt om enderne ved kameraet i ét stykke (ca. 1,8 m). Bagrammen trykker kraven ned på snoren. Ringens væg går nu lige ned til 2,6 mm og har en kort 45°-skråning før kraven (i v19 var hele vejen ned til kraven skrå).
- **4 Kamera:** et glas Ø12 × 1,5 mm sidder i en lomme bag en 0,6 mm kant i forsiden. Hullet i forsiden er Ø10,9 og skråner 60° ind til Ø8,8 ved glasset, så Wide-kameraets synsfelt (120° diagonalt) går fri. Bag glasset ligger en lille snor-ring (ca. 35 mm snor) i hjørnet mellem glasset og lommens væg, og et **nyt printet kamerarør** (v20–v26; væk i v27) står på linseholderen og trykker ringen ind i hjørnet med en 45°-skråning. Kameraet sidder 2,4 mm længere tilbage, så linsen er 0,6 mm bag glasset. Lysringens ender ved kameraet er rykket 1,5 mm ud, så der stadig er 3,7 mm sort rundt om hullet.
- **5 Højttaler:** en rille (2,0 × 1,0) i bagvæggen rundt om gitteret, inden for højttalerens flange og uden for dens åbning. Flangen trykker på snoren; krogene holder som før.
- **6 Låselomme:** slidsen til vægbeslagets låsetunge går nu ind i en lukket, printet lomme (1,6 mm vægge) inde om tungen og låseskruen. Det, der kommer ind bagfra, bliver i lommen og løber ud gennem et Ø2-drænhul i bunden. Tungen har 1 mm luft foran og 0,8 mm over sig.
- **Andre små rettelser, fordi kanalen er bredere:** mikrofonkortets 2 pinde er 1 mm lavere (kanalens væg er 1 mm lavere), bagrammens puder under de yderste låsearme er 1 mm kortere, og bagrammens ører om frontskruerne er Ø6,0 (før Ø6,4), så de går fri af skallens væg.
- **Tjekket i CAD:** alle 31 dele (print, købedele, skruer, pakninger) er lagt sammen og skåret mod hinanden. Der er ingen nye kollisioner; de eneste berøringer er dem, der skal være der (skruer i deres huller, klikstik på strips, bagrammens knaster og fjedertæer mod skærmen, pinde i hullerne på højttaler og mikrofonkort, og snorene mod det, de tætner). Front mod skal og bagramme mod skal rørte hinanden i v19 i hjørnerne (15 mm³); det er væk. Script: `hardware/tools/check_fit_gen2.py`.

## Hvad var nyt i v19

Esben 22. okt. 2026: der kommer ikke printer i bunden af boksen, så hullet skal lukkes, og delene til det skal væk. Tegning: `halo-gen2-v19_bund.png` (bunden i v18 og v19).

- **Printerhullet er lukket.** Hullet (Ø20 med forsænkning Ø29) 20 mm til venstre for midten og 38 mm bag forsiden er nu en hel bund.
- **Proppen og alt omkring den er væk:** printerproppen (`printerdaeksel`), kraven, de 3 fjedertunger med pukler, de 3 hårde stop og de 3 indgangshak i bunden. Der er én del mindre at printe og ingen 2-pin nøgle.
- **De 2 skruehuller til printermodulet** (70 mm til hver side af midten) og deres stolper indvendig er også væk.
- **Venstre luftfelt har 7 hele slidser igen**, ligesom højre. De 2 inderste blev givet til printerhullet i v11. Stænkskærmen over feltet er gjort tilsvarende længere.
- **Styrehullerne (Ø6,2, 18 mm fra midten) bliver**, men bruges ikke længere: stativbeslaget v2 har ingen pinde, fordi bunden svinges ind som på væggen.
- Alt andet i skallen er som i v18.

## Hvad var nyt i v18

Esben 22. okt. 2026: LED-strips uden klister, og en 3. hvid strip. Skitser: `gen2-gennemgang/halo-gen2-v18_skitse_led-fastholdelse.png` og `gen2-gennemgang/halo-gen2-v18_skitse_3-hvid-i-reflektor.png`. Snit fra printfilerne: `halo-gen2-v18_snit_lyskanal.png` (i v18-mappen).

- **Ingen klister på strips.** Hver strip har sin egen bane på bagrammens stripvæg. Bagkanten skubbes ind under en læbe, og forkanten trykkes ned mod væggen. Strippen kan skubbes frem og tilbage i banen og tages ud igen.
  - Hvid 1 og 2: læben er 0,5 mm tyk og griber **1,0 mm** ind over bagkanten. Den ligger 0,1 mm over strippens tynde kant (printpladen uden for den gule stribe), som er sat til **0,5 mm, indtil Esben har målt den** (`T_EDGE` i CAD). Stammen under læben står derfor kun ca. 1,1 mm ud fra væggen, og det samme gør trinnet foran hvid 1, så de kan printes som korte hylder uden support. Esben målte stripperne: 8,1 mm brede med en gul (lysende) stribe på 3,7 mm i midten, altså 2,2 mm uden lys i hver side. Læben skygger derfor ikke.
  - RGB lyser i hele bredden og får ingen læbe. Den sidder i en tæt bane på 5,0 mm bagerst med reflektoren 0,3 mm over sig.
  - Bagrammen printes med bagsiden ned. Derfor peger alle læberne fremad (mod lysringen), så de står på laget under og kan printes uden support. En kant over forkanten kan ikke printes i bagrammen.
  - Kanalbunden er **0,95 mm dybere** (27,4 mm fra forsiden; før 26,45), så banerne og de 2 trin kan være der. Reflektorens vinkel er uændret.
- **3. hvid strip i reflektoren** (lys-simuleringens variant C, ca. 148 % lys mod v17). Strippen ligger i en 2,7 mm dyb lomme forrest på den skrå reflektor med lyset ud mod stripvæggen og frem mod ringen.
  - Bagkanten går ind under en læbe i bagrammen (1,0 mm over kanten).
  - Forkanten holdes af **lysringen**. Ringen har fået en kile bag sin inderste krave, som sidder på lommens bund og har en læbe over strippens forkant. Ringen printes med forsiden ned, så kilen kan printes uden support. Når bagrammen trykkes på, presser kilen strippen ned i lommen. Kilen klemmer også ringens krave, som reflektorens forkant gjorde før.
  - **Klikstikket til hvid 3** sidder i højre side ved kameraet, i reflektoren under stikket til hvid 2. Det kan ikke synke helt ned og stikker ca. 1,6 mm op over den skrå flade de sidste 16 mm. Ledningen går bagud gennem et nyt hul i reflektoren (x = 21, 4,5 mm inden for ringens midterlinje). Hvid 3 stopper 34 mm fra kameraet i venstre side.
- **Klikstikkene** sidder nu ud for de nye baner. RGB-stikket går 0,5 mm ind i bagrammens bagplade, så der er en lomme til det.
- **Ledningsdiagram:** 3 hvide strips. Strip 2 og 3 får + gennem en ny Wago (W6, 221-413) fra W1, og W5 (hvid −) bliver en 221-414. Under billedet bruger de 3 hvide strips ca. 30 W (1,3 A ved 24 V).
- **Glatte skrå flader** (Esben 22. okt. 2026). Den skrå reflektor var tegnet i trin på 0,5 mm fra v2 til v17, og printeren kopierede trinnene. Nu er reflektoren, lommen til hvid 3, læben og lysringens kile helt glatte.
- Hurtigsættet har en ny prøve, `proeve-lyskanal`: nederste venstre hjørne af bagramme og lysring med ca. 10 cm strip-bane, så banerne, lommen og kilen kan prøves med rigtige strips.

## Hvad var nyt i v17

- **WLED-styringens holder har de rigtige mål** (Esben målte Gledopto GL-C-016WL-D med skydelære 22. okt. 2026; skitse `halo-gen2-v17_wled_maal-skitse.png`, snit `halo-gen2-v17_snit_wled.png` i v17-mappen). CAD havde 108 × 45 × 18 mm fra en forhandler, og bakken var kun 45,3 mm indvendig, så styringen kunne ikke komme ned i den.
- Målt: **99,74 mm** over begge arme, **45,7 mm** på det bredeste (45,48 over bundpladen), toppen **44,7 mm** (kassen er konisk) og **17,26 mm** højt. Armene starter **24,12 mm** (indgangen) og **20,43 mm** (udgangen) fra den modsatte kant, og slidsernes midte er **11,2 mm** fra den nærmeste kant. Kassens længde uden arme (ca. 87,9) og armenes længde (ca. 5,9) er aflæst af fotoene.
- **Styringen står med udgangen (4 klemmer + USB-C) opad** og indgangen (V+ V−) nedad, bundpladen mod bagvæggen. Holderen sidder samme sted som før, til venstre for strømrøret.
- **Ny holder:** 46,2 mm indvendig (0,25 mm luft pr. side). Klikkanterne går 2,0 mm ind fra væggen. Toppens kant sidder 0,75 mm inde fra væggen, fordi kassen er konisk, så kanterne griber 1,25 mm ind over den. Gulvet (1,2 mm) går ud under begge arme, og et lavt stop ud for hver armspids holder styringen på langs. Stoppet er kun 0,8 mm højere end armen, så ledningerne kan gå ind over det til klemmerne.
- **Ingen skruer i armene** (Esben 22. okt. 2026). Klikkanterne og de to stop holder styringen.
- **Kraftigere klikkanter på alle holdere** (Esben 22. okt. 2026: kanterne var for små, især på den tunge 5 V-forsyning). Før startede kanterne 0,3 mm over delen og var kun en skrå kile ud til 0,6 mm. Nu har hver kant en flad fangeflade 0,1 mm over delen med en rampe ovenpå, så delen klikker ned og ikke kan glide op igen (snit `halo-gen2-v17_snit_klikkanter.png` i v17-mappen).
  - 5 V-forsyningen: 3 kanter pr. side, 20 mm lange og 1,6 mm ind, væggene 2,2 mm tykke.
  - 4G, mikrofon-kerne, IMU og reed-kort: kanter hele vejen langs begge sider (2 pr. side, hvis der er fingergreb), 1,2 mm ind.
  - Dæmperen: 2 kanter pr. side, 10 mm lange og 1,2 mm ind. Højttalerens kroge: 12 mm lange og 1,2 mm ind.
  - WLED-styringen: 2,0 mm ind, som beskrevet ovenfor.
- Hullet midt i gulvet sparer plast og giver luft bag styringen. Styringen bliver ikke varm af betydning, så det er ikke et krav for varmen.
- Hurtigsættets prøve `proeve-stroem-ledstyring` har den nye holder.

## Hvad var nyt i v16

- **Skærmskruerne kan nå skærmen** (Esben 21. okt. 2026, snit: `halo-gen2-v16_snit_skaermskruer.png` (i v16-mappen)). Fra v2 til v15 var der en fejl i bagrammen ved skærmens 4 beslag: hullet til skruehovedet var lige så bredt som tårnet og desuden aflangt (±2,4 mm), så det skar tårnet væk. Der var kun tynde flager tilbage, og tværbjælken hang ca. 12 mm over skærmens beslag. Skærmens små skruer kunne derfor aldrig nå ned.
- Nu er **tårnet helt** (Ø9,2 med 1,8 mm væg rundt om hullet) og går hele vejen ned til skærmens beslag, hvor det trykker 0,2 mm, så skærmen sidder uden slør.
- **Bunden under skruehovedet er 1,6 mm.** Skruen går gennem den og 2–2,5 mm ind i skærmens gevindøre.
- **Skrue: M2,5 × 3 eller 4 mm** med lavt hoved (Ø4–5 mm), fx de små skruer i skærmens pose. En 5 mm skrue er for lang og rammer skærmens bagside.
- Hullet til hovedet er Ø5,6 og ca. 18,6 mm dybt. **Brug en PH0- eller PH1-skruetrækker** med et skaft under Ø5 mm; en magnetisk bit holder den lille skrue, mens den føres ned.
- Hullet er kun aflangt ±0,8 mm på langs (før ±2,4). Placeringen er tjekket mod Raspberry Pis tegning, så ±0,8 er nok til, at printet krymper over 160 mm. På tværs er hullet stadig 3,5 mm.
- Hurtigsættets prøve `proeve-skaermhuller` har de nye tårne, så de kan prøves med skærmen, før hele bagrammen printes.

## Hvad var nyt i v15

- **Alle 4 kameratappe er tilbage** (Esben 21. okt. 2026). v14 havde kun 2 diagonale tappe, men alle 4 skal være der. Problemet i v13 var, at nogle af tappene printede lidt for tykke, så nu er alle 4 Ø1,9 med en spids (v13 havde Ø2,0 uden spids). Kameraprintets huller er Ø2,2.
- Kun fronten er ændret. Alt andet er som i v14.

## Hvad var nyt i v14

Rettelser efter Esbens hurtigprint af v13 (21. okt. 2026). Skitse: `gen2-gennemgang/halo-gen2-v14_skitse_rettelser.png`.

- **Låse i stedet for små knopper.** v13 havde 6 knopper på 0,9 mm på indervæggen, som bagrammens arme klikkede bag. De holdt for lidt og ville miste mere ved acetone-glatning og slid. Nu er der **vinduer gennem kanalens vægge**, og armens barb griber 1,2 mm ind i selve vægkanten. Vinduerne ligger bag den hvide reflektor og den hvide båndvæg, så der slipper intet lys ud, og de kan ikke ses forfra.
- **8 låse på indervæggen** (2 i hver side, 2 i bunden, 2 i toppen) og **6 nye på ydervæggen** (2 i hver side, 2 i bunden). I v13 var den ydre ramme kun holdt af de 4 frontskruer gennem skallen.
- **Armene trykker på skærmen.** Hver indre arm fortsætter forbi vinduet og ender i en 45° fjedertå, der trykker 0,2 mm på skærmglassets sorte kant (uden for skærmens metalbagside), ca. 6–7 N pr. tå. Front, skærm og bagramme bliver dermed én stiv enhed, som kan vendes og bruges åben på bordet under udvikling uden skal og uden skruer.
- Armene er 2,0 mm tykke og ca. 14 mm lange (ca. 1,3 % bøjning, når de klikker). Ved hver lås er der en udløserslids bagfra.
- **Hele inderring i hjørnerne.** CAD regnede med skærmglas med R3-hjørner og 1,2 mm luft og skar derfor indervæggen væk i de to nederste hjørner, hvor glasset kun har 1,2 mm til væggen. Det var tegnet sådan, ikke en printfejl. Glasset har R5-hjørner (Raspberry Pis tegning), så væggen kan være hel; den er kun skrabet højst 0,26 mm tyndere lige ved hjørnet.
- **Lysringens ender ved kameraet er lukket.** Kanalens vægge stoppede 17 mm fra linsen, så man kunne se ind i det mørke kamerarum gennem lysringen. Væggene følger nu ringens runde ender, og en 1,2 mm bund lukker dem 1 mm foran kameraprintet.
- **Kameratappe:** 2 diagonale tappe Ø1,9 med spids (v13 havde 4 tappe Ø2,0, som skulle skæres til). I v15 er alle 4 tilbage.
- **LED-ledningernes huller** i bagrammen er flyttet fra 15,5 til 19,5 mm fra midten. I v13 løb det højre hul sammen med kamerakablets slids.
- LED-båndene går ikke bag kameraet: hvert bånd er ét stykke rundt om alle 4 hjørner, men starter og slutter ved klikstikkene 17 mm fra linsen. Kamerakablet går ud til højre og bagud gennem sin egen slids imellem.
- Snittegning: `halo-gen2-v15_snit_rettelser.png` i v15-mappen (samme som skitsen, taget direkte fra CAD).
- **Skærmens 4 skruehuller i bagrammen er bredere på tværs:** 3,5 mm i stedet for 2,9 (og hullet til skruehovedet 6,2 i stedet for 5,6). Placeringen er tjekket mod Raspberry Pi-tegningen og Esbens foto og er rigtig (121,8 mm mellem hullerne på tværs, 160 mm på langs, skærmpladens 2 små hak nedad, væk fra kameraet). I v13 var der kun 0,2 mm luft pr. side på tværs, mindre end printet krymper over 12 cm, så skruerne ramte ved siden af. Hullerne var stadig aflange på langs (±2,4 mm; ±0,8 fra v16). Hurtigsættet har en prøve, `proeve-skaermhuller`, med begge nederste huller.

## Hvad var nyt i v13

- **Printerproppen i bunden holder nu** (Esben 20. okt. 2026, skitse `gen2-gennemgang/halo-gen2-v13_skitse_printerprop.png`). I v12 var proppen en skive på Ø19,6 i et hul på Ø20. Knasterne holdt den fra at falde ud, men intet holdt igen indefra: den kunne skubbes ca. 4 mm op i boksen, lå løst og skulle holdes i flugt, mens den blev drejet. Klik-puklerne virkede heller ikke, fordi proppen bare veg opad.
- **Anslag:** Proppen har fået en krave (Ø28,4 × 1,8 mm), som stopper mod en skulder i bunden (forsænkning Ø29 × 1,8 mm). Proppen står derfor præcis i flugt med bunden. Kabelhullet til printeren er stadig Ø20.
- **Strammer til:** Proppen drejes 60° **med uret set nedefra** med den samme 2-pin nøgle (2 stifter Ø2, 10 mm imellem). Hver af de 3 knaster glider ind over en fjedertunge, der er printet i skallen inde i kraven (1,4 mm tyk, 0,7 mm luft under). En pukkel på tungen trykker den ca. 0,45 mm ned undervejs, så man mærker, at den strammer.
- **Klik:** Ved 60° falder puklen i en rille under knasten. Tungerne trykker stadig 0,25 mm (ca. 2,6 N hver, ca. 8 N i alt) og trækker kraven fast mod skulderen, så proppen ikke rasler og ikke kan ryste sig løs.
- **Stop:** Et hårdt stop ved hver knast gør, at proppen ikke kan drejes for langt. Den åbnes ved at dreje tilbage over klikket.
- **Vejr:** Kraven dækker nu de 3 indgangshak, som i v12 stod åbne ved siden af proppen. Vand skal op ad samlingen, ind over skulderen og op over den 3,8 mm høje krave indvendig.
- Hullet er flyttet 2 mm mod midten (centrum 20 mm til venstre for midten og 38 mm bag forsiden, set forfra), så den bredere krave går fri af ventilationsskærmen. Det kommende printermodul følger med.
- Alt omkring proppen indvendig er under 6,8 mm, så det går fri af bagrammen, som begynder 7 mm over bunden.
- Snittegning: `halo-gen2-v13_snit_printerprop.png` (i v13-mappen).

## Hvad var nyt i v12

- **Skærmen sidder længere fremme** (Esben 20. okt. 2026, skitse `gen2-gennemgang/halo-gen2-v11_skitse_tyndere-front-og-rille.png`). Skærmen er stadig bag fronten, men fronten er kun **1,6 mm tyk foran glasset** (8 lag). Før var den 3,2 mm, og glasset lå på en printet kant på 0,5 mm, så det sad 3,7 mm inde. Nu sidder det 1,6 mm inde, altså 2,1 mm længere fremme. Uden for glasset er fronten 3,2 mm som før.
- **Glasset ligger direkte på bagsiden af frontens kant.** Der er ikke længere et glasland, så der er intet mellemrum mellem glasset og vindueskanten.
- **Rille til tætningsbånd:** En rille på 3,2 × 0,6 mm går hele vejen rundt om vinduet, 1 mm ude fra fasen. I rillen klæbes et blødt, selvklæbende skumbånd på 1 mm × 3 mm, som klemmes sammen til 0,6 mm (40 %), når skærmen skrues fast. Det lukker tæt rundt om billedet, så spild ikke løber ind bag fronten. Inden for rillen ligger glasset på en flad kant på 1 mm, og uden for den på resten af kanten (ca. 10 mm). Rillen har runde hjørner, så båndet kan følge dem i ét stykke.
- **Vindueskanten** er faset fra 1,6 mm ved forsiden til 0,6 mm ved glasset, som før, bare på den tyndere kant.
- **Skærmens 4 skruetårne** på bagrammen er 2,1 mm længere, så de stadig trykker skærmen 0,2 mm mod fronten. Tværbjælkerne sidder samme sted. Skruehullet i tårnet er 2,1 mm dybere (ca. 18 mm fra bagrammens bagside ned til skruehovedet), så brug en skruetrækker med et skaft under Ø5,5.
- **Pi'en sidder 2,1 mm længere fremme** sammen med skærmen. Der er derfor ca. 32 mm fri luft bag blæseren (før ca. 30 mm).
- De 8 ribber, der centrerer glasset (0,2 mm luft), står nu på den tynde kant. Lommen omkring glasset har 0,4 mm luft, så glasset kun styres af ribberne.
- Logoet sidder samme sted som før. Rillen går fri af det (0,35 mm), og der er 0,8 mm plast bag logoet.
- Lyskanalen, reflektoren, lysringen, snaplåsene og frontskruerne er uændrede. Kanalens dybde er nu et fast mål i CAD og hænger ikke længere sammen med skærmens placering, så en 3. lysrække kan tegnes uden at flytte skærmen.
- Snittegning: `halo-gen2-v12_snit_skaerm-rille.png` (i v12-mappen).
- Indkøb: ét nyt køb, skumbåndet (se "Tætningsbånd" under Samling).

## Hvad var nyt i v11

- **Strømindgangen sidder præcis i midten** (Esben 20. okt. 2026, skitse `gen2-elektronik/halo-gen2-v11_skitse_stroem-midt.png`). Røret står stadig helt bagved ved bagvæggen (aksen 10 mm foran bagsiden), så ledningen går lige ned langs væggen og nemt kan skjules i en kabelkanal. Hullet i bunden er det samme Ø12,5, og hunstik og snaplåse er som i v10.
- **5 V-forsyningen og WLED-styringen står nu lodret** på bagvæggen, på hver sin side af røret (forsyningen til højre, WLED-styringen til venstre, set forfra), med skrueklemmerne opad. Der er 1,5 mm luft mellem røret og hver bakke.
- For at gøre plads er **højttaleren rykket 39,5 mm op**, **dæmperen** på venstre væg sidder lavere, og **mikrofon-kernen** og **sensoren (IMU)** er rykket op på bagvæggen. Mikrofonkablet når stadig med luft til overs.
- **Printerhullet med dækslet** er flyttet til 22 mm til venstre for midten og 38 mm bag forsiden, og de 2 styretappe til et kommende printermodul sidder nu 18 mm fra midten. Dækslet er det samme som før.
- Bundhullerne i venstre side har 5 hele slidser (de 2 inderste er givet til printerhullet).
- Øjerne til kabelbindere på bagvæggen er flyttet, så de går fri af de nye placeringer.
- Ledningsdiagrammet er det samme; ledningerne fra hunstikket går nu lige op mellem bakkerne og hen over forsyningen til Wago-klemmerne. Se samlingstrin 11.
- Snittegning: `halo-gen2-v11_snit_stroemindgang.png` (i v11-mappen).
- Et kommende printermodul under boksen skal have plads til ledningen midt ved bagkanten.

## Hvad var nyt i v10

- **Bagsiden er helt lukket** (Esben 20. okt. 2026). Den åbne kanal på 18 × 84 mm midt på bagsiden, hvor hunstik og stikprop sad synligt, er væk. Bagsiden har nu kun højttalergitteret og de skjulte slidser til vægbeslaget og temavingerne.
- **Strømmen kommer ind i bunden.** Et printet rør står på bunden ved bagvæggen, 49 mm til venstre for midten (set forfra), lige ved siden af 5 V-forsyningen. Strømforsyningens stikprop sættes op i et Ø12,5-hul i bunden og forsvinder helt i røret; kun ledningen kommer ud og hænger lige ned under boksen. Et hul, der vender nedad, kan ikke fyldes af regn.
- **Hunstikket er 5,5/2,5 mm med skrueklemmer, TRU Components DC-13F** (Conrad 1570909), tegnet efter databladet: 39,8 mm langt, tønde Ø10 × 12, klemmeblok 10 mm bred. Det sidder med åbningen nedad. Det hviler på en kant over tønden, når stikproppen trækkes ud, og 2 printede snaplåse fanger toppen af stikket, når proppen trykkes i. **Brug ikke et 5,5 × 2,1-stik** (fx Goobay 14946): GST90A24-P1M har en 5,5 × 2,5-prop, som sidder løst på en 2,1-pind.
- **Låsen er rykket 26 mm ud** (fra 56 til 82 mm til venstre for midten), så røret kan stå tættere på midten. Låsetungen på vægbeslaget, låseskruen, magneten og reed-modulet er flyttet med. Derfor er **vægbeslaget nyt** i v10.
- **Højttaleren er rykket 10 mm op** og **dæmperen på venstre væg 12 mm op**, så ledningerne fra hunstikket har plads over røret.
- Bundhullerne i venstre side er 3 mm kortere (13 mm), så hætten over dem går fri af røret.
- Ledningsdiagrammet er opdateret (hunstikket sidder i røret i bunden).
- Snittegning: `halo-gen2-v10_snit_stroemindgang.png` (i v10-mappen).

## Hvad var nyt i v9

v8 er tjekket mod Seeeds egne filer for reSpeaker Flex XVF3800 Linear-4 (DXF og STEP fra Seeeds wiki). DXF'en i repoet er den samme fil som Seeeds. Mål, mikrofonafstand (33 mm) og de 2 M3-huller passede, men to ting var forkerte:

- **Kortet lå forkert i lommen.** Lydhullerne sidder 0,68 mm fra kortets midte, og skruehullerne sidder på midten. v8 havde lagt lommen midt over lydhullerne, så kortet ville have ramt lommens forkant, når pindene sad i hullerne. Nu ligger lommen midt om pindene, og hele mikrofonlinjen er rykket 0,7 mm bagud, så der er 0,8 mm luft til fronten. Lydhullerne i bunden sidder nu 18 mm bag forsiden.
- **Kablet var for kort.** Stikket til det flade kabel sidder midt på mikrofonkortet, ikke i enden. Fra den gamle plads på bagvæggen skulle kablet bruge ca. 29 cm, og der følger kun 20 cm med. **Mikrofon-kernen ligger nu ned (70,5 × 52,2 mm) på bagvæggen lige bag Pi'en, over WLED-styringen**, med stikket nedad. Kablet går lige bagud fra kortet, op bag Pi'en og ind i kernen: ca. 15 cm, så der er 5 cm til overs. Bakken har en åbning på 20 mm i underkanten til stikket.
- Kortet er kun 3 mm højt med dele (v8 regnede med 4,8). Pindene går nu op til 0,6 mm under fronten, så kortet ikke kan løfte sig af dem.
- Lommen har en 15 mm bred udskæring bagtil, så kablet ligger fladt ud af stikket.
- Seeed skriver, at lydhullerne (siden med Seeed-logoet) skal vende mod lyden. Her vender de nedad, 18 mm bag forsiden. Den, der taler, står foran boksen, på tværs af mikrofonlinjen, og det er den retning, en lineær mikrofonrække hører bedst i. Mod bagsiden af kortet (ind i boksen) dæmper den mest, og det tager blæserens og højttalerens lyd. Det er skønnet ud fra geometrien, ikke målt. Se "Tjek på første print".
- Snittegning: `halo-gen2-v9_snit_mikrofon.png` (i v9-mappen).

## Hvad var nyt i v8

- **Mikrofonerne er flyttet fra toppen til undersiden** (Esben 19. okt. 2026, skitse `gen2-gennemgang/halo-gen2-v8_skitse_mikrofon-underside.png`). Toppen er nu helt lukket, uden huller.
- Mikrofonkortet (reSpeaker Flex XVF3800, 110 × 11 mm) ligger i en 1,8 mm lomme i bunden lige bag fronten, under lyskanalen. De 4 huller (Ø1 mm, 33 mm imellem) vender nedad, 17 mm bag forsiden.
- Væske kan ikke løbe ned i hullerne, et glas på toppen giver ikke klonk i mikrofonen, og en top eller vinger dækker dem ikke. Et tema under boksen skal holde mindst 10 mm luft ved forkanten.
- En printet drypkant (rille 2 × 1 mm) på tværs af undersiden, 8 mm bag forsiden, får vand fra forsiden til at dryppe af, før det når hullerne.
- Kortet sættes på 2 printede pinde gennem sine egne Ø3,3-huller. Når fronten er på, ligger lyskanalens væg 0,5 mm over kortet, så det ikke kan falde af. Der er ingen klips, skruer eller lim.
- Mikrofon-kernen på bagvæggen var rykket 16 mm ned. Det var ikke nok (se v9).

## Hvad var nyt i v7

- **Ventilationen bagpå er lukket** (Esben 19. okt. 2026). De 37 lameller højt på bagvæggen og de 8 i de øverste hjørner er væk (13,3 cm²). Kun de to slidsfelter i bunden er tilbage, med hætterne over. Højttalerens gitter og kanalen til strømstikket bagpå er der stadig; de er ikke ventilation.
- Uden huller højt oppe kan den varme luft ikke stige ud, så boksen køler næsten kun gennem væggene. Skøn: luften inde i boksen bliver ca. 6–8 °C varmere end i v6, ca. 22–25 °C over rummets temperatur ved almindelig brug (ca. 14 W: Pi, skærm, strømforsyning og RGB-lys).
- Det holder indendørs: ved 22 °C i rummet er luften inde ca. 45 °C. Pi, skærm (begge til 70 °C) og 5 V-forsyningen (55 °C uden nedsat ydelse, 70 °C ved 60 % last; den kører ved ca. 25 %) er inden for databladene.
- Under et festivaltelt ved 30 °C bliver luften inde ca. 53–55 °C, og Pi'ens chip nærmer sig 80 °C, hvor den sætter farten ned. I direkte sol bliver den for varm. Tjek de første gange den står varmt med `vcgencmd get_throttled` og `vcgencmd measure_temp` på Pi'en.
- Skallen printes som før, men behøver nu kun support til lommerne bagpå.

## Hvad var nyt i v6

- **6 snaplåse holder frontens indre plade.** Slidsen til lysringen deler fronten i en ydre ramme og en indre plade (skærmvindue og logo). Indtil nu hang pladen kun fast i den smalle bro ved kameraet, så et træk i bunden af vinduet kunne revne broen. Nu har bagrammen 6 printede låsearme, 2 i hver side og 2 i bunden. Hver arm fanger en 0,9 mm kant på frontens inderste væg, bag skærmglasset.
- Der er ingen nye skruer eller dele, og lyskanalen er urørt: låsene sidder uden for kanalen, bag den sorte plade.
- Låsen har 0,1 mm luft, så den ikke trækker konstant mod skærmens forspænding (ASA kan give sig over tid i en varm boks).
- Ved hver arm er der en lille slids (1,2 × 8 mm) i bagrammen. Ved skærmskift stikkes en lille skruetrækker i slidsen, og armen vrides fri.
- Begge dele printes stadig uden support. Kanten på fronten og weerhagen på armen har hver et lille vandret overhæng på ca. 1 mm, som printer fint uden support.
- Snittegning: `halo-gen2-v6_snaplaase_snit.png` (i v6-mappen).

## Hvad var nyt i v5

- **Boksen er 70 mm dyb i stedet for 85 mm.** Den stikker 15 mm mindre ud fra væggen. Kun skallen blev ændret; front, lysring, bagramme, logo, vægbeslag og dæksel var de samme som i v4.
- Alt på bagvæggen (5 V-forsyning, WLED-styring, højttaler, strømindgang, 4G, mikrofon-kerne, sensorer) sidder samme sted som før, bare 15 mm længere fremme sammen med bagvæggen. Mellem dem og Pi'en/bagrammen er der mindst 9 mm luft.
- Låsetungen går stadig 12 mm ind i boksen, og låseskruen sidder 15 mm længere fremme (vægbeslaget er uændret). Mikrofonstrippen under toppen er rykket 15 mm frem.
- Dæmperen på venstre væg er rykket 5,5 mm frem, så den ikke rammer bagvæggen.
- **4 huller lukket i bagvæggen.** Under hver frontskrue sad et ekstra hul (Ø6,4) fra v1, hvor frontskruerne sad tættere på midten. Siden v2 har der ikke siddet en skrue i dem, så de var bare åbne huller ind i boksen. De er nu lukket.
- **Rester fra rev G fjernet bagpå:** 4 lodrette slidser (3 mm brede, bag mikrofon-kernen), en 1,2 mm fordybet ramme rundt om bagsiden og en lille fordybning til et mærkat. De havde ingen funktion i gen 2, som har sine egne lameller. Bagvæggen er nu helt plan og fuld tykkelse, så skallen ligger bedre på pladen.
- **Bundventilation:** hætterne over bundhullerne ligger nu mellem bagrammen og bagvæggen. I venstre side er hullerne kortere, så hætten går fri af låseskruen. Indsugningen er 7,5 cm² mod 9,8 cm² før.
- Printerhullet og skruerne til printermodulet er rykket 7,5 mm frem, så de stadig sidder midt i bunden.
- Der er ca. 30 mm fri luft bag Pi'ens blæser (før 45 mm).
- Snittegning: `halo-gen2-v5_snit_v4-mod-v5.png` (i v5-mappen) viser v4 og v5 side om side.
- Printermodulet med to Instax Wide bag hinanden kan ikke være i 70 mm. Det skal tegnes om, før det laves.

## Hvad var nyt i v4

- **Logo i fronten.** Selfi-logoet sidder midt i det sorte felt mellem lysringen og skærmen, som på den godkendte skitse (logo-paa-boksen). Det er hvidt med grønne prikker (prikken i ikonet og prikken over i), 27,5 × 10 mm, og ligger helt plant i fronten: det er printet ind i de første 4 lag (0,8 mm), ikke klistret på. Logoet er lavet direkte fra brandpakkens logofil.
- Fronten printes stadig i ét stykke med forsiden nedad. Der er to ekstra filer, `halo-gen2-v12_logo-hvid.stl` og `halo-gen2-v12_logo-groen.stl`, som er farvedele til fronten. Se "Front med logo" herunder.
- Skal, lysring, bagramme, vægbeslag og dæksel er de samme som i v3.

## Hvad var nyt i v3

- **Bagrammen er ét stykke.** I v2 var printfilen fire løse dele: de to tværbjælker, som skærmen skrues i, sluttede 0,4 mm før rammen, og reflektoren startede 0,24 mm over bunden, så den blev printet i luften. Nu går bjælkerne 1 mm ind i rammen bag lyskanalen, og reflektorens sidste trin går helt ned i bunden. `hardware/tools/check_bodies.py` tjekker nu, at hver printdel er én krop.
- **Ledningsdiagram:** `halo-gen2-v27_ledningsdiagram.png` viser alle ledninger, Wago-klemmer, sikring og Pi-ben. RGB-styringen (Gledopto) skal have **5 V**, aldrig 24 V: den sender sin indgangsspænding direkte ud på RGB-strippen, som er 5 V og brænder af på 24 V. I v2's 3D-model var den tegnet på 24 V; det er rettet.
- Bagrammen er ændret. I skallen er det gamle boremærke til en arkadeknap (en ring på indersiden af højre side) fjernet. Front, lysring, vægbeslag og dæksel er de samme som i v2.

## Hvad var nyt i v2

- **Lyset:** To hvide COB-strips (Ra95) og én RGB-strip sidder på en hvid bagramme bag fronten og lyser ind på en skrå hvid reflektor. Lyset kommer ud gennem en lysring i natur-ASA med en 1 mm tynd lysflade.
- **Fronten** er kun sort og åben bagtil. Den har ingen lofter, der hænger ud i luften, når den printes med forsiden ned. Det var dem, der gav de grimme kanter og hjørner i gen 1.
- **Lysringen** sættes i bagfra og holdes af sin krave. Bagrammen klemmer den fast hele vejen rundt, så den ikke kan løsne sig.
- **Skærmen** skrues i sine egne fire M2,5-ører gennem bagrammen, og 8 ribber i fronten holder glasset centreret i vinduet (±0,2 mm). Kameraet trykkes på printede tappe af bagrammen.
- **Kamerahullet** passer nu til Camera Module 3 Wide (Ø7,35), og linsen sidder 0,3 mm bag forsiden.
- **Strøm:** Mean Well RSD-60G-5, WLED-styringen og dæmperen klikkes i printede bakker i skallen. Der er ingen hulprint og ingen lodning.
- LED-skinnen fra v1 udgår. Bagrammen overtager dens job.

## Rettet efter gennemgang af datablade (19. okt. 2026)

Alle købedele er tjekket mod producentens tegninger (ligger under "Datablade og tegninger" på admin.selfi.dk/admin/hardware). Printfilerne her er rettet til:

- **Kamera:** linsens placering og de 4 tappe følger Raspberry Pis tegning (linse 9,46 mm fra kanten, tappe 21 × 12,5 mm).
- **Skærm:** dybde 15,55 mm og glas 1,1 mm efter den officielle tegning.
- **Strips:** de tre strips er forskudt, så hver strip har sit eget klikstik i den ene ende (hvid 1 og RGB føres fra venstre, hvid 2 fra højre). Der er lommer til klikstikkene i bagrammen.
- **Frontskruer:** skruen er forsænket (hoved Ø6), så stolperne har nu en 90° forsænkning.
- **Låseskrue:** forsænket hoved Ø8,6, med 90° forsænkning i tungen.
- **Magnet:** lomme Ø8,2 til en Ø8 × 3 mm magnet.
- **Bakker:** dæmperen (DFRobot DFR0457, 44 × 32 mm), reed-modulet (32 × 19 mm) og højttaleren (DFRobot FIT0502) har fået bakker i de rigtige mål.
- **Strømindgang:** den gamle lomme midt bagpå er erstattet af en lodret kanal 44 mm til venstre for midten (set forfra). Et 2,5-hunstik med skrueklemmer klikkes i med åbningen nedad, og strømforsyningens lige stik sættes i nedefra. Vægbeslagets udsparing til kablet er flyttet med.

## Delene

| Fil | Del | Mål på pladen (mm) | Materiale | Ca. vægt | Plade | Support |
|---|---|---|---|---|---|---|
| `halo-gen2-v27_skal.stl` (+ `halo-gen2-v27_skal_support.3mf`) | Skal uden rille om højttalergitteret (v27), stolper under luftskærmene (v26), 2 låseslidser, -lommer og bundknaster (v25), 8 kabelløkker, trækaflastning over strømstikket, strømrør uden support med plads til hunstikket på 14 × 13, lav mikrofonbakke med plads til aux, rille til frontens ribbe, knusribber på stolperne og 4 lukkede vingelommer | 224,5 × 307 × 64 | ASA sort | ca. 340 g | Glat PEI | **Kun de 2 steder i 3MF'en** (Tree, manuel) |
| `halo-gen2-v27_front.stl` (+ `halo-gen2-v27_front_flerfarvet.3mf`) | Front uden glas og pakninger (v27): åbent kameravindue Ø12,1 med Ø8,6-hul til linsen, kamerakassen 0,9 mm længere fremme, hel frontplade om lysringen og massiv skærmkant; ribbe mod skallen | 224,5 × 307 × 27,7 | ASA sort | 110 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v27_logo-hvid.stl` | Logo, hvide dele (farvedel til fronten) | 27,5 × 9,9 × 0,8 | ASA hvid | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v27_logo-groen.stl` | Logo, grønne prikker (farvedel til fronten) | 24,6 × 2,6 × 0,8 | ASA grøn | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v27_lysring.stl` (+ `.3mf`) | Lysring uden skulder (v27): væggen går lige gennem slidsen, og kraven ligger på frontpladen | 209,1 × 291,6 × 4,7 | Jeres matte translucente materiale | 24 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v27_bagramme.stl` (+ `.3mf`) | Bagramme med kun 2 hvide baner og glat reflektor, 54 knusknopper mod lysringen, slidser til serviceløkken og WLED-holder til 108 mm (v24); de 4 rør til kameraet 0,9 mm længere (v27) | 217,1 × 300 × 29,2 | ASA hvid | 247 g | Glat PEI | Nej |
| `halo-gen2-v27_vaegbeslag.stl` (+ `.3mf`) | Vægbeslag med 2 låsetunger (18 og 12 mm brede, 0,3 mm over bundknasterne), boksen 4,5 mm fra væggen (v25); pladen bærer nu hele tungerne (v26) | 189 × 285,7 × 19,5 | ASA sort | ca. 135 g | Glat PEI | Nej |
| `halo-gen2-v27_blaeserhegn.stl` (+ `.3mf`) | Blæserhegn: rist 3 mm over Pi'ens Active Cooler, klikkes på bagrammens øverste tværstykke uden skruer; printes på siden, slidserne på tværs (v26) | 120,5 × 14,6 × 41 | ASA sort | 18 g | Glat PEI, **på siden** | Nej |
| `halo-gen2-v27_tema-top-eksempel.stl` (+ `.3mf`) | Eksempel på en tema-top med 2 kroge og stropper 3,9 × 10 mm (v25; kun til at prøve krogene, et rigtigt tema laves pr. kunde) | 224,5 × 154 × 77,1 | ASA, valgfri farve | ca. 75 g ved 15 % fyld | Glat PEI, forsiden ned | Ja, under stropperne |
| `halo-gen2-v27_tema-vinge-venstre-eksempel.stl` / `..._hoejre-eksempel.stl` (+ `.3mf`) | Eksempel på tema-vinger med 2 kroge hver og en strop 3,9 mm tyk (v25) | 61,9 × 170 × 77,1 | ASA, valgfri farve | ca. 45 g ved 15 % fyld | Glat PEI, forsiden ned | Ja, under stroppen |

Vægtene er skøn ud fra rumfanget. Bambu Studio viser den rigtige vægt og tid, når delene er skåret.

**Pladen:** front og skal er 307 mm lange og ligger med 6,5 mm fri til pladens kant foran og bagved (H2C-pladen er 320 mm). Det er 0,5 mm under vores egen margin på 7 mm, så læg dem midt på pladen, og brug ikke skirt. Skallens brim på 3 mm (v26) er inden for; 3MF'erne lægger delene midt på pladen.

Fire farver ASA: **sort** (skal, front, beslag, blæserhegn), **hvid** (bagrammen og logoet), **grøn** (prikkerne i logoet), og lysringen i jeres matte translucente materiale, som I har valgt til den. Logoet skal være ASA ligesom fronten, ellers hæfter lagene ikke.

## Indstillinger (Bambu Studio)

**v26: hver del har sin egen 3MF med indstillingerne lagt ind** (Esben 27. okt.: et pænt resultat uden fejl, der ser støbt ud og holder). Åbn 3MF'en, ikke STL'en. Så får hver del de samme lag, vægge, fyld, søm, support og brim hver gang, uanset hvad der sidst stod i Bambu Studio. Indstillingerne ligger på objektet; i objektlisten har det et tandhjul, og der kan du se og rette dem.

| Fil | Plade | Lag | Vægge | Fyld | Andet |
|---|---|---|---|---|---|
| `halo-gen2-v27_front_flerfarvet.3mf` | Tekstureret PEI (glat kan bruges, se herunder) | 0,2 | 4, top/bund 5 | 20 % gyroid | Forsiden: *Monotonic line* og én væg i første lag; elefantfod 0,15; ingen brim, ingen support |
| `halo-gen2-v27_lysring.3mf` | Tekstureret PEI | 0,16 | 3 | 100 % | Alle baner *koncentrisk* (rundt langs ringen), så lyset bliver jævnt uden striber; elefantfod 0,15 |
| `halo-gen2-v27_bagramme.3mf` | Glat PEI | 0,2 | 4 | 20 % gyroid | Ingen support |
| `halo-gen2-v27_skal_support.3mf` | Glat PEI | 0,16 | 5, top/bund 6 | 20 % gyroid | Support: Tree (manuel), kun ved de 2 enforcere, også fra modellen; brim 3 mm |
| `halo-gen2-v27_vaegbeslag.3mf` | Glat PEI | 0,2 | 6 | 100 % | Ingen support |
| `halo-gen2-v27_blaeserhegn.3mf` | Glat PEI | 0,16 | 4 | 100 % | På siden; brim 3 mm (v27: alene på pladen, kamerarøret er væk) |
| `halo-gen2-v27_tema-*.3mf` | Glat PEI | 0,2 | 4, top/bund 5 | 15 % gyroid | Forsiden som fronten; Tree-support (auto) under stropperne |

Alle dele har **scarf seam** (sømmen glider ind over et stykke i stedet for at starte og stoppe ét sted) med sømmen placeret **bagud på pladen**, og alle filer ligger, så bagud på pladen er boksens **underside** (skal og bagramme er vendt 180° i forhold til STL'en). Det, der er tilbage af sømmen, sidder derfor under boksen, hvor ingen ser den. Drej ikke delene på pladen.

**Én gang: printer, filament og proces** (det kan ikke ligge i en 3MF; gem det som egne profiler, fx "Selfi ASA")
- Printer: Bambu Lab H2C med 0,4-dyse. Proces: Bambus 0,20 mm Standard for H2C. Filament: Bambu ASA (eller jeres ASA med Bambus ASA-profil).
- **Første lag:** højde 0,2 mm (logoet er præcis de 4 første lag), hastighed 30 mm/s for både væg og fyld, bredde 0,5 mm. Det første lag er frontens forside, så det skal lægges langsomt og ens.
- **Undgå at krydse vægge** (*Avoid crossing walls*): til. Dysen kører uden om i stedet for hen over flader, der kan ses, så der kommer færre tråde og mærker.
- Dyse 260 °C, plade 100 °C, kammer 60 °C (luk lågen, og lad kammeret varme op, før printet starter). Køling 10–20 % (5 % de første 3 lag).
- Slå *Flow dynamics calibration* til i print-vinduet, hver gang der er sat en ny rulle i.
- Ingen "hole compensation" eller skalering. Hullerne er tegnet til målet (±0,2 mm).
- Lad ydervæggenes hastighed stå, som Bambu har den. Siderne er pæne, som de er.

**Filamentet**
- **Tør ASA før hvert stort print**: 4–8 timer ved 80 °C. Fugtigt ASA giver tråde, små bobler og en grå, ru flade. Det er den største enkelte årsag til et grimt print.
- Front, skal og beslag i **samme sorte ASA fra samme parti**, så farven og glansen er ens. Logoet skal være ASA ligesom fronten, ellers hæfter lagene ikke.

**Front: sådan bliver forsiden pæn**
Forsiden er det første lag. På en **glat plade** bliver hver bane et lille spejl, og man ser mønsteret, især langs kanterne, hvor de 4 vægge mødes med fyldet. Det retter 3MF'en: alle baner i forsiden ligger samme vej i samme rækkefølge (*Monotonic line*), og der er kun én væg i første lag i stedet for 4. Det, der er tilbage, kommer af pladen og første lag:
- **Tekstureret PEI giver det pæneste, mest "støbte" resultat.** Teksturen skjuler banerne helt og giver den samme matte flade overalt. Brug den, hvis I har den.
- På den **glatte plade**: vask pladen med opvaskemiddel og varmt vand, og rør ikke ved den bagefter (fingeraftryk ses i forsiden). Brug ikke lim under fronten; limen giver en mat, skjoldet forside. Lav en Z-offset-justering på den glatte plade (første lag må hverken have revner mellem banerne eller striber af for meget plast).
- Lad pladen køle under 40 °C, før fronten tages af, og bøj pladen, ikke fronten.
- Logo (AMS: sort, hvid og grøn): `halo-gen2-v27_front_flerfarvet.3mf` har front og logo som ét objekt med tre dele på AMS-plads 1 (sort), 2 (hvid) og 3 (grøn). Tjek, at de tre pladser har de rigtige filamenter. Sæt "Prime tower" til og "Flush into object's infill" til, så spildet bliver mindre (ca. 12 farveskift, 10–15 g spild, 20–30 min ekstra). Mindste detalje i logoet er ca. 0,9–1,1 mm, så brug ikke en 0,6-dyse til fronten.
- Uden 3MF'en: træk `halo-gen2-v27_front.stl`, `_logo-hvid.stl` og `_logo-groen.stl` ind på én gang, svar **Ja** til ét objekt med flere dele, giv delene sort, hvid og grøn, og sæt indstillingerne fra tabellen.
- Elefantfod-kompensation 0,15 mm: lysringens skyggefuge er kun 0,15 mm, og både ringen og fronten printes med forsiden ned, så uden kompensation kan de første lag klemme ringen fast i slidsen.

**Lysring** (forsiden ned på tekstureret PEI)
- Lysfladen er 1 mm tyk og printes massiv. Med koncentriske baner går hver bane rundt langs ringen, så lyset gennem den bliver jævnt; på tværs ville banerne give striber i lyset.
- Kraven hænger 1,25 mm ud uden support (v27; v20–v26: 1,65 med skulderen). En lille hængning under kraven gør ikke noget; skrab den let, hvis kraven ikke ligger plant på frontpladen.
- Print lysringen i jeres matte translucente materiale. Lad pladen køle helt af, før ringen tages af, så den ikke bliver skæv.

**Bagramme** (den flade bagside ned på glat PEI)
- Reflektoren er glat (v24), og de 54 knusknopper står 0,25 mm op på de flader, lysringens krave ligger på. Slib dem ikke af; de skal trykkes flade ved samlingen.
- Læberne i strip-banerne (v18) peger fremad og står på laget under. Se efter, at de er hele hele vejen rundt, og fjern trådrester i banerne og lyskanalen med en kniv. Tråde dér kaster skygger i lysringen.

**Skal** (bagsiden ned på glat PEI)
- **Support (v26):** 3MF'en har skallen som ét objekt med 2 grønne support-enforcere og 7 røde support-blockere, og support står allerede på **Tree (manuel)** med **"Kun på byggepladen" fra**. Så kommer der support præcis 2 steder:
  - i **skinnens udsparing** øverst bagpå (taget er 120 × 33 mm, 9 mm oppe; for bredt til en bro), fra pladen, og
  - under **dæmperbakkens forreste væg** inde i venstre side (en 18 mm hylde 35 mm oppe), fra bagvæggen indvendigt. Den tages ud gennem bakkens åbning.
  Alt andet i skallen er tegnet til at printes uden: strømrøret (dråbeformede huller og 45°-tag, v24), låselommerne (broer på 16 og 10 mm), vingelommerne (broer på 7 mm), kabelløkkerne (broer på 8 mm) og luftskærmene (v26: stolper). Blockerne holder dem rene, også hvis typen ved en fejl står på *Tree (auto)*.
- **Brim 3 mm** hele vejen rundt (v26; før musøre), så hjørnerne ikke løfter sig. Den sidder på bagsiden, som vender mod væggen. Skær den af med en afgratningskniv langs kanten.

**Vægbeslag:** 6 vægge og 100 % fyld; det bærer hele boksen. Ingen support (v26: hele tungen står på pladen).

**Blæserhegn** (`halo-gen2-v27_blaeserhegn.3mf`): i sort, **på siden** (41 mm højt, armene ligger fladt i lagene) med en brim på 3 mm, fordi det er smalt og højt. Fjern trådrester i hegnets slidser med en kniv.

## Efter print

1. Bor de 4 skruehuller i frontens hjørner rene med et 2,5 mm bor i hånden.
2. Prøv lysringen i fronten bagfra. Den skal falde på plads uden at klemme, med en lige, smal skyggefuge (0,15 mm) rundt om lysfladen, og kraven skal ligge plant på frontpladen hele vejen rundt (den hænger 1,25 mm ud i printet).
3. Prøv skærmen i fronten. Den skal falde ned mellem ribberne uden at klemme; klemmer den, skrabes ribberne let med en kniv. Se efter, at kanten foran glasset er plan.
3b. Se gennem kameravinduet: hullet til linsen (Ø8,6) skal være rundt og rent, uden trådrester.
4. Prøv kameraet på frontens 4 tappe. Det skal kunne trykkes på med fingrene uden at skære i tappene.
5. Se efter, at vinduerne i kanalens vægge er åbne, og at overkanten (den sidste bro i printet) er lige. Fjern trådrester med en kniv.

## Samling

Læg fronten med forsiden ned på et blødt underlag.

1. **Lysringen:** læg **lysringen** i slidsen bagfra, så kraven ligger på frontpladen hele vejen rundt (v27: ingen snor).
2. **Skærmen:** læg skærmen i fronten med glasset ned på kanten (v27: ingen snor). 8 små ribber langs glassets kant styrer den på plads, så billedet sidder lige i vinduet. Den skal falde ned uden at blive trykket.
3. **Strips** (v18: intet klister). Sæt klikstikkene på strippene først. Læg bagrammen på bagsiden og sæt strippene i med lyset ind mod reflektoren: **RGB først** (bagerst, i den tætte bane), så **hvid 2** (midterste bane), så **hvid 1** (forreste bane) (v24: der er kun 2 hvide strips). For hver hvid strip: vip strippen, skub bagkanten ind under læben, og tryk forkanten ned; rul tommelfingeren langs hele strippen. RGB kan også skydes ind i banen fra enden ved kameraet. Hvid 1 og RGB har klikstik i venstre side af kameraet, hvid 2 i højre side. Ved et klikstik slutter nabostrippen 17 mm længere ude. Ledningerne går ud gennem hullerne ved siden af kameraet;
4. **Kameraet:** Sæt kamerakablet (300 mm) i kameraet først. Kablet går ud til siden, mod slidsen i bagrammen. Tryk kameraet på de 4 printede tappe, til kortet ligger fladt på dem; linsen går ind i hullet bag kameravinduet. **Intet må røre linsen.** Der er 0,65 mm luft rundt om den og intet foran den (v27: intet glas og intet kamerarør). Kan kortet ikke ligge fladt, eller rører noget linsen, så stop og send et billede. Se forfra, at linsen sidder midt i hullet.
5. **Bagrammen** lægges ned i fronten. Før kamerakablet gennem slidsen i bagrammen lige ved kameraet. Kablet laver én blød bue bagud og må ikke knækkes eller foldes skarpt. Tryk bagrammen ned, til alle 14 låse klikker (8 på indervæggen, 6 på ydervæggen). Tryk først midt på hver side, så låsene klikker parvis. Den trykker lysringens krave ned på frontpladen hele vejen rundt (v24: de 54 knusknopper bliver trykket flade, når frontskruerne spændes, så kraven sidder fast og lysfladen ikke kan trykkes ind), trykker kameraet mod forsiden, og de 8 fjedertæer trykker skærmglasset mod kanten. Nu kan front, skærm og bagramme vendes og bruges åben uden skal. Skal bagrammen af igen, stikkes en lille skruetrækker i slidsen ved hver lås bagfra, og armen vippes væk fra væggen.
6. **Skærmen skrues fast** med 4 M2,5 × 3–4 mm skruer (fx fra skærmens egen pose), gennem bagrammen og ind i skærmens fire gevindører. Hovedet sidder ca. 18,6 mm nede i tårnet på en 1,6 mm bund, så brug en PH0/PH1-skruetrækker med et skaft under Ø5 mm og gerne magnetisk bit. Brug ikke 5 mm skruer: de rammer skærmens bagside. Spænd skiftevis over kryds, til glasset ligger helt ind mod frontens kant hele vejen rundt. Bagrammen trykker skærmen 0,2 mm mod kanten, så den sidder uden slør.
7. **Pi'en:** Sæt skærmens korte flade kabel i skærmen og i Pi'ens DISP-stik, før Pi'en skrues på skærmens afstandsstykker med de 4 andre skruer fra posen. Kablet skal ligge i en blød bue rundt om Pi'ens kant. Kamerakablet føres i en løs bue bag bagrammen ned til Pi'ens CAM-stik. **Blæserhegnet (v24):** når Pi'en er skruet fast, klikkes hegnet på bagrammens øverste tværstykke midt over Pi'en: læg puden mod tværstykkets bagside med risten over Active Cooler, og tryk lige ned, til begge arme klikker bag tværstykkets forside. Tjek, at blæseren kan drejes frit med en finger gennem risten. **Serviceløkken (v24):** bind skærmens og kameraets kabler sammen med en 10 mm velcrostrop gennem de 2 slidser i bagrammens **nederste** tværstykke (under Pi'en), og lad der være ca. 10 cm løs ledning, som hænger nedad foran 5 V-forsyningen. Ingen ledning må ligge over hegnet.
8. **Elektronik i skallen:** 5 V-forsyningen og WLED-styringen trykkes ned i deres lodrette bakker på bagvæggen på hver side af røret, forsyningen med skrueklemmerne opad og WLED-styringen med udgangen (4 klemmer + USB-C) opad, og dæmperen i bakken på venstre væg. Læberne på bakkerne holder dem. Forbind alt **præcis som i `halo-gen2-v27_ledningsdiagram.png`** med Wago 221-41x (1 × 221-413, 1 × 221-414 og 3 × 221-415; ikke 221-6xx, som ikke tager de tynde ledninger fra strips) og klikstik. Sæt ledningstyller på alle fintrådede ledninger, der går i en skrueklemme. Vigtigst:
   - RGB-strippen får 5 V direkte fra W3 og GND fra W4, **aldrig 24 V**. RGB-styringen (Gledopto) giver kun data til strippen (v24, efter at dens sikring sprang); den styres fra Pi'en over USB-A til USB-C.
   - 5 V-forsyningens −V bindes til 24 V-GND (broen W4 → W2), ellers virker Pi'ens styresignal til dæmperen ikke.
   - De hvide strips får + fra 24 V (begge direkte fra W1; v24: W6 er væk) og − gennem dæmperen (W5).
   - Mål med et multimeter, før strips og Pi sættes i: 24 V på W1, 5 V på W3, og 5 V (ikke 24 V) på RGB-strippens +.

   **Kabelføring (v24, se `halo-gen2-v27_kabelfoering.png`):** samle ledningerne i ét hovedbundt op langs midten af bagvæggen mellem forsyningen og WLED-styringen, og lad korte grene gå ud til dæmperen, højttaleren og mikrofon-kernen. Bind bundtet i løkkerne i 112 og 136 mm, grenene i løkkerne ved dæmperen (72), i venstre side (112), ved 4G (205), ved forsyningens top (100) ved mikrofon-kernen (158) og den nye løkke til stødsensorens gren til højre for mikrofon-kernen (214). Stødsensorens gren går ud til højre og op uden om mikrofon-kernen, ikke hen over midten. Træk en **10 mm velcrostrop** gennem løkken, læg ledningerne i og stram, så bundtet ikke kan flytte sig, men ikke så hårdt at isoleringen mærkes. Kabelbinder kan bruges i stedet; klip enden af helt inde ved låsen. Wago-klemmerne bindes ikke fast; de skal kunne nås. Ingen ledning må ligge hen over et køleribbe-areal, over blæserhegnet eller i lyskanalen.
9. **Mikrofonkortet** (standard i alle bokse): Sæt det flade kabel (20 cm, følger med) i kortet. Læg kortet i lommen i bunden lige bag forkanten med **Seeed-logoet nedad** (det er den side, lydhullerne er på) og stikket bagud. De 2 printede pinde går gennem kortets huller. Kablet går lige bagud gennem udskæringen i lommen, op bag Pi'en og ind i stikket i underkanten af mikrofon-kernen. Kernen trykkes ned i sin bakke på bagvæggen over WLED-styringen med komponenterne udad og aux-stikket opad, så de 4 pinde går gennem kortets huller og kanterne klikker over printpladen (v24). Kablet må gerne bøjes blødt, men ikke knækkes. Kortet skal ligge fladt; de 4 små ringe i lommen lukker tæt om lydhullerne.
10. **Skallen** sættes ned over fronten (v21: ingen snor her; frontens ribbe går ned i rillen i skallens forkant). De 4 frontskruer (**SPUN+ 3,0 × 15 mm, forsænket**; databladet siger TX10, Bauhaus siger TX20, så tjek pakken) skrues i bagfra gennem hullerne i bagvæggen. Hver skrue går gennem skallens stolpe og bagrammens øre og ind i fronten, så de tre dele holdes sammen af de samme 4 skruer. Brug en **lang Torx-bit i den størrelse (mindst 45 mm)**, fordi skruehovedet sidder ca. 37 mm inde. Spænd over kryds, til front og skal ligger helt sammen hele vejen rundt (ingen fuge); de små knusribber på stolperne bliver trykket flade, så bagrammen sidder fast.
10b. **Højttaleren** trykkes ned over pindene og ind under krogene, så flangen ligger på bagvæggen (v27: ingen snor).
11. **Strømindgangen:** Skru 24 V-ledningerne i hunstikket (TRU DC-13F, 5,5/2,5) med ledningstyller, før skallen lukkes. Tryk hunstikket ned i røret midt i bunden ved bagvæggen ovenfra, med åbningen nedad, til de 2 snaplåse klikker over toppen af stikket. (v24: rummet er 14,6 × 14,6, så stikket kan vende begge veje.) Klik derefter de 2 ledninger ind i **trækaflastningen** lige over røret (v23): tryk dem ind gennem den åbne side, så de ligger i gennemgangen. Så går et ryk i kablet i skallen og ikke i skrueklemmerne. Derfra går de op i hovedbundtet midt på væggen og videre til Wago-klemmerne ved 5 V-forsyningens øverste ende.
12. **Ophængning (v25):** skru vægbeslaget på væggen. Hæng boksen på krogen foroven med bunden holdt lidt ud fra væggen, og sving så bunden ind, så begge låsetunger går vandret ind i slidserne i bunden. Skru begge sikkerhedsskruer i nedefra; de trækker boksen de sidste 0,3 mm op, så den står på tungerne og sidder helt fast mellem krogen og skruerne. Boksen sidder 4,5 mm fra væggen. Boksen må ikke kunne rykkes, når skruen er spændt. Når boksen hænger, sættes strømforsyningens stikprop op i hullet i bunden, til den sidder helt inde. Kablet hænger lodret ned under boksen.

Købedele, der skal skrues: 4 frontskruer, 8 M2,5-skruer (følger med skærmen) og 2 sikkerhedsskruer (v25). Blæserhegnet klikkes på uden skruer. Til kabelføringen: **8 velcrostropper 10 mm bred** (rulle med velcrobånd 10 mm, klippet i stykker på ca. 12 cm, fx fra Biltema eller Amazon) eller 8 kabelbindere 2,5 mm. Der er ingen gevindindsatser, fjedre, lim, pakninger eller glas (v27, Esben 27. okt. 2026).

## Tjek på første print

- Mikrofon: er de 4 huller i bunden åbne hele vejen igennem, og ligger kortet fladt på ringene med logoet nedad? Optag tale på 0,8 og 2 m foran boksen, med boksens egen lyd i højttaleren, og lyt efter ekko og blæserstøj.

- Kameratappe (nyt i v15): går kameraet ned over alle 4 tappe uden kniv, og sidder det uden slør?
- Låse (nyt i v14): klikker alle 14, når bagrammen trykkes ned, og kan de vippes fri med en lille skruetrækker uden at knække? Vakler front, skærm og bagramme, når de løftes og vendes uden skal? Ligger glasset helt ind mod kanten hele vejen rundt bare med fjedertæerne (før skærmskruerne)? Er tæerne for stramme, kan LK_TOE[3] gøres 0,1 mm mindre i CAD.
- Lysringens ender (nyt i v14): kan man stadig se ind til kameraet gennem lysringen? Er enderne ved kameraet meget mørkere end resten af ringen?
- Hjørner (nyt i v14): er inderringen hel i alle 4 hjørner, og går skærmen ned uden at klemme i de nederste hjørner?

- Logo: er kanterne skarpe, og er der ingen sort farve i det hvide? Ligger logoet plant med resten af forsiden?

- Kamera: sidder linsen midt i hullet, og er der ingen sort kant i billedets hjørner? Går kamerakablet gennem slidsen uden skarpe knæk?
- Lysring (v27): er skyggefugen jævn, ligger kraven på frontpladen hele vejen rundt, og rasler ringen ikke, når boksen er samlet?
- Printet (v26): er der support andre steder i skallen end i skinnens udsparing og under dæmperbakkens væg? Er låseslidserne, vingelommerne og strømrøret rene? Står luftskærmenes kant lige uden at hænge ned mod bagvæggen? Er vægbeslagets tunger glatte på undersiden?
- Forside (v26-indstillinger): ligger banerne i forsiden alle samme vej, uden krydsmønster langs kanterne og rundt om vinduet? Er der ingen revner mellem banerne og ingen striber af for meget plast? Er der fingeraftryk eller limpletter, så vask pladen før næste print.
- Søm (v26): kan sømmen ses nogen steder på siderne eller forsiden, når boksen hænger? Den skal sidde på undersiden.
- Lysring (v26): er lyset jævnt hele vejen rundt, uden striber på tværs?
- Brim (v26): slipper skallens brim rent, og løftede ingen hjørner?
- Blæserhegn (v26): står det lige op på pladen uden at slidserne er lukket af tråde? Klikker det fast og af igen uden at armene revner?
- Blæser (v24): klikker hegnet fast på tværstykket uden slør, og kan det tages af igen uden at armene knækker? Kører blæseren frit, når skallen er lukket, og viser admin mindst 6000 rpm? Rører nogen ledning hegnet?
- Kamera (v24): ligger kortet fladt på tappene, og fokuserer kameraet hele vejen (tag billeder tæt på og langt væk)?
- Hunstik (v24): kommer det helt ned i røret og klikker fast, og bliver det siddende, når proppen trykkes i nedefra?
- Mikrofonbakke (v24): står kortet på de 4 puder, klikker kanterne over printpladen, og er der fri plads til aux-stikket og USB-C i overkanten?
- Lås (v24): sidder boksen helt fast på vægbeslaget, når sikkerhedsskruen er spændt, uden at kunne rykkes 1 mm? Kan den hænges på ved at svinge bunden ind?
- Diffuser (v24): kan lysfladen trykkes ind nogen steder, når boksen er samlet?
- WLED-styringen (v24): går den ned i holderen med 108 mm mellem stoppene?
- Kabelføring (v23/v24): kan en 10 mm velcrostrop trækkes gennem alle 8 løkker, klikker de 2 strømledninger fast i trækaflastningen, og kan skallen lægges ned ved siden af fronten uden at trække i noget?
- Skærmskruer (nyt i v16): står tårnene helt ned på skærmens beslag, og går alle 4 M2,5-skruer i gevindørerne uden at bagrammen skal skubbes eller vrides? Tager skruen fat (2–2,5 mm gevind), uden at skærmen bliver trukket skævt?
- Skærm: sidder den helt fast uden slør? Ellers kan bagrammens knaster gøres 0,2 mm længere i CAD.
- Skærm og kant: ligger glasset helt ind mod frontens kant hele vejen rundt, også i hjørnerne? Er kanten foran glasset plan?
- Kamera (v27, åbent vindue): tag et billede med lys i hele billedet: er der mørke hjørner (så rammer synsfeltet vinduets kant), eller lys fra lysringen i billedet? Er der det, sendes billedet til CAD.
- Front mod skal: mødes de helt hele vejen rundt (ingen fuge)?
- Låselomme (nyt i v20): går vægbeslagets tunge frit ind og op, og er drænhullet i bunden åbent?
- Spild (v27, uden pakninger): hæld en spiseske vand på skærmen og på toppen, mens boksen hænger, og se efter, om noget kommer ind bag fronten. Ikke på kameravinduet: det er et åbent hul.
- Lys: tænd begge hvide strips på 100 % og mål lux ved 0,8 m (målet er mindst 250 lux). Se efter striber eller pletter i lysringen.
- Strip-baner (nyt i v18): bliver alle 3 strips liggende, når man kører fingeren langs, også i hjørnerne? Løfter forkanten af hvid 1 eller 2 sig nogen steder? Rasler RGB i sin bane?
- Bakker: sidder 5 V-forsyning, WLED-styring, dæmper og kortene fast, også når boksen vendes og rystes? Kan de tages ud igen med en flad skruetrækker uden at kanterne knækker?
- Strømindgang: klikker hunstikket fast i røret, og sidder det fast, når stikproppen trækkes ud? Går proppen helt ind? CAD regner med hunstikkets krop 14 × 13 mm (Conrad, v24) og proppens greb højst Ø12 og 38 mm (ingen tegning fra Mean Well). Mål begge, før skallen printes, hvis det kan lade sig gøre.
- Mål dæmperens højde og klikstikkene. Der findes ingen officiel tegning af dem, så CAD bruger forhandlerens mål.
- Vejr: v27 har ingen pakninger, så ingen sprøjtetest; boksen er til indendørs brug og under tag.

## Blæseren i software (v24)

Blæseren kører altid **mindst 6000 rpm**, så den også køler resten af boksen. To dele i selfiebox-platform:

- `box/system/install.sh` sætter Pi'ens blæserkurve, så laveste trin er PWM 200 fra 10 °C (altså altid tændt), og laver en udev-regel, så agenten må skrive blæserens PWM. Kræver `deploy-box.sh --install` og en genstart af boksen.
- Agenten (`box/agent/selfiebox_agent/fan.py`) læser omdrejningerne hvert 5. sekund og hæver PWM, til de er over 6000. Admin viser en advarsel, hvis en boks melder under 6000 rpm.
