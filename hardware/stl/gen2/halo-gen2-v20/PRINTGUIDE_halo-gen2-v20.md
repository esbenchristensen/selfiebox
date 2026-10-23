# Selfi Halo gen 2, version v20: printguide

**Version:** halo-gen2-v20 (23. okt. 2026). Alle filer i denne mappe starter med `halo-gen2-v20_`. Den erstatter halo-gen2-v19, som ikke må printes. **Skal, front, lysring og bagramme er nye**, og der er en ny lille del, kamerarøret. Vægbeslaget er præcis det samme som i v10–v19 (samme fil). CAD-kilden er `hardware/cad/gen2_concept.scad` i esbenchristensen/selfiebox.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning. Én del pr. plade, 1 stk. af hver. Kun hovedenheden.

## Hvad er nyt i v20

Esben 23. okt. 2026: boksen skal tætnes mere, med én aftagelig pakning alle steder, et lille glas foran kameraet, og den skal kunne tåle, at nogen sætter eller klistrer noget på den. Skitse (godkendt): `gen2-gennemgang/halo-gen2-v20_skitse_taetning-v2.png`. Snit gennem printfilerne: `halo-gen2-v20_snit_taetning.png`.

- **Én pakning alle steder:** O-ringsnor Ø1,5 mm i silikoneskum (RS 234-2906), skåret af en rulle, enderne stødt sammen i rillen, ingen lim. Den ligger løst i rillerne, holdes af delen ovenpå og kan tages ud og bruges igen. Ca. 3,6 m pr. boks, så én rulle på 5 m pr. boks. Rillerne er 2,0 mm brede, og snoren klemmes til ca. 1,0 mm.
- **Boksen er 2 mm bredere og 1 mm højere: 224,5 × 307 × 70** (v19: 222,5 × 306). Lyskanalen er 1 mm bredere på hver side, så der er plads til snoren ved siden af lysringen. Den synlige lysring er stadig 14 mm, og kanten fra boksens yderkant til ringen er stadig 7,8 mm hele vejen rundt. Skærmen, Pi'en og kameraet sidder 1 mm højere end før.
- **1 Front mod skal:** ribben på fronten og rillen med de 2 drænhak i skallen er væk. I stedet ligger snoren i en rille (2,0 × 0,8) i skallens forkant. Frontens yderkant stopper 0,2 mm før skallen, så der er en fin, jævn fuge på 0,2 mm, og de 4 frontskruer altid klemmer front, bagramme og skal hårdt sammen; snoren tager resten.
- **De 4 frontskruer er rykket 1,2 mm ind** mod midten (diagonalt i hjørnerne). I v19 skar skruetårnene skallens væg op i de 4 hjørner, så der var en vej ind for vand lige der. Nu er væggen hel hele vejen rundt. Tårnene stikker et lille stykke ind i lyskanalens hjørner, bag strippenes ryg (det kan ikke ses, og de skygger ikke), og bagrammens strip-væg har en lille udskæring til dem.
- **2 Skærm:** snoren ligger i rillen rundt om billedet i stedet for skumbåndet. Rillen er 2,0 × 1,0 (før 3,2 × 0,6), med 0,6 mm plast foran.
- **3 Lysring:** stadig en løs del i jeres matte, translucente materiale. Snoren ligger på begge sider af ringen i en lomme bag frontpladen (1 mm dyb, hele kanalens bredde), under ringens krave, og går rundt om enderne ved kameraet i ét stykke (ca. 1,8 m). Bagrammen trykker kraven ned på snoren. Ringens væg går nu lige ned til 2,6 mm og har en kort 45°-skråning før kraven (i v19 var hele vejen ned til kraven skrå).
- **4 Kamera:** et glas Ø12 × 1,5 mm sidder i en lomme bag en 0,6 mm kant i forsiden. Hullet i forsiden er Ø10,9 og skråner 60° ind til Ø8,8 ved glasset, så Wide-kameraets synsfelt (120° diagonalt) går fri. Bag glasset ligger en lille snor-ring (ca. 35 mm snor) i hjørnet mellem glasset og lommens væg, og et **nyt printet kamerarør** (`halo-gen2-v20_kameraroer.stl`) står på linseholderen og trykker ringen ind i hjørnet med en 45°-skråning. Kameraet sidder 2,4 mm længere tilbage, så linsen er 0,6 mm bag glasset. Lysringens ender ved kameraet er rykket 1,5 mm ud, så der stadig er 3,7 mm sort rundt om hullet.
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
- **Styrehullerne (Ø6,2, 18 mm fra midten) bliver**, fordi stativbeslaget (selfi-stativbeslag-v1) har 2 pinde i dem. Stativbeslaget passer stadig: dets hylde, slids til strømstikket, pinde og låsetunge rører ikke noget, der er ændret.
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
- **Ledningsdiagram:** `halo-gen2-v20_ledningsdiagram.png` viser alle ledninger, Wago-klemmer, sikring og Pi-ben. RGB-styringen (Gledopto) skal have **5 V**, aldrig 24 V: den sender sin indgangsspænding direkte ud på RGB-strippen, som er 5 V og brænder af på 24 V. I v2's 3D-model var den tegnet på 24 V; det er rettet.
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
| `halo-gen2-v20_skal.stl` | Skal med snor-rille i forkanten, rille om højttalergitteret og lukket låselomme (ny i v20) | 224,5 × 307 × 64 | ASA sort | 332 g | Glat PEI | Kun fra pladen |
| `halo-gen2-v20_front.stl` | Front med kameravindue, lomme til lysringens snor og ny skærmrille (ny i v20) | 224,5 × 307 × 27,7 | ASA sort | 106 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v20_logo-hvid.stl` | Logo, hvide dele (farvedel til fronten) | 27,5 × 9,9 × 0,8 | ASA hvid | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v20_logo-groen.stl` | Logo, grønne prikker (farvedel til fronten) | 24,6 × 2,6 × 0,8 | ASA grøn | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v20_lysring.stl` | Lysring, 2 mm bredere krave, ret væg ned til snoren (ny i v20) | 209,1 × 291,6 × 8,7 | Jeres matte translucente materiale | 35 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v20_bagramme.stl` | Bagramme, 2 mm bredere (ny i v20) | 217,1 × 300 × 29,2 | ASA hvid | 230 g | Glat PEI | Nej |
| `halo-gen2-v20_kameraroer.stl` | Kamerarør: står på linseholderen og trykker snor-ringen mod glasset (ny del) | Ø11,2 × 4,3 | ASA sort | under 1 g | Glat PEI (sammen med en anden del) | Nej |
| `halo-gen2-v20_vaegbeslag.stl` | Vægbeslag med låsetunge (samme som v10–v19) | 157 × 276 × 29 | ASA sort | 143 g | Glat PEI | Nej |

Vægtene er skøn ud fra rumfanget. Bambu Studio viser den rigtige vægt og tid, når delene er skåret.

**Pladen:** front og skal er 307 mm lange og ligger med 6,5 mm fri til pladens kant foran og bagved (H2C-pladen er 320 mm). Det er 0,5 mm under vores egen margin på 7 mm, så læg dem midt på pladen, og brug ikke brim eller skirt på den lange led; musørerne i skallens hjørner er inden for.

Fire farver ASA: **sort** (skal, front, beslag, kamerarør), **hvid** (bagrammen og logoet), **grøn** (prikkerne i logoet), og lysringen i jeres matte translucente materiale, som I har valgt til den. Logoet skal være ASA ligesom fronten, ellers hæfter lagene ikke.

## Indstillinger (Bambu Studio)

Start fra Bambus egen profil **Bambu ASA** og ret dette:

**Fælles for alle dele**
- Dyse 260 °C, plade 100 °C.
- Luk lågen, og lad kammeret varme op til ca. 60 °C, før printet starter.
- Køling 10–20 % (5 % de første 3 lag).
- Ingen "hole compensation" eller skalering. Hullerne er tegnet til målet (±0,2 mm).
- Søm (seam): *Aligned*, placeret bagud.

**Front** (forsiden ned på tekstureret PEI)
- 0,2 mm lag, 4 vægge, 5 top- og bundlag, 20 % gyroid.
- Der er ingen support. Lyskanalen er åben bagtil, og alle skrå flader er 45° eller stejlere.
- Rengør pladen med sæbe og vand før print. Fingeraftryk ses i forsidens tekstur.

**Front med logo** (AMS: sort, hvid og grøn)
Nemmest: åbn `halo-gen2-v20_front_flerfarvet.3mf`. Den har front og logo som ét objekt med tre dele på AMS-plads 1 (sort), 2 (hvid) og 3 (grøn). Tjek, at de tre pladser i AMS'en har de rigtige filamenter. Ellers:

1. Træk alle tre filer ind i Bambu Studio på én gang: `halo-gen2-v20_front.stl`, `halo-gen2-v20_logo-hvid.stl` og `halo-gen2-v20_logo-groen.stl`.
2. Svar **Ja**, når Bambu Studio spørger, om de skal indlæses som ét objekt med flere dele. Så ligger logoet præcis i sin fordybning i fronten. Flyt ikke delene hver for sig.
3. Giv fronten sort, logo-hvid hvid og logo-grøn grøn i objektlisten.
4. Lag på 0,2 mm, så logoet er præcis de første 4 lag. Farveskiftet sker kun i de 4 lag, derefter printes der kun sort.
5. Sæt "Prime tower" til og "Flush into object's infill" til, så spildet bliver mindre. Skøn: ca. 12 farveskift, 10–15 g spild og 20–30 min ekstra.
6. Mindste detalje i logoet er ca. 0,9–1,1 mm (to dysebaner med 0,4-dysen). Brug ikke en 0,6-dyse til fronten.

**Lysring** (forsiden ned på tekstureret PEI)
- 0,16 mm lag, 3 vægge (væggene er 1,2 mm), 100 % fyld.
- Lysfladen er 1 mm tyk og printes som massive lag. v20: væggen går lige op til 2,6 mm, så 3 korte trin i 45°, og kraven hænger derefter 1,65 mm ud uden support. Det går fint med ASA og PETG; en lille hængning under kraven gør ikke noget, den ligger på skumsnoren.
- Print lysringen i jeres matte translucente materiale med samme indstillinger som før.
- v18: kilen over hvid 3 står øverst på den inderste krave (ca. 4 mm høj). Alle dens flader vender opad eller er stejlere end 45°, så der skal ikke support på.
- Lad pladen køle helt af, før ringen tages af, så den ikke bliver skæv.

**Bagramme** (den flade bagside ned på glat PEI)
- 0,2 mm lag, 4 vægge, 20 % gyroid.
- Reflektoren er en skrå trappe i 0,5 mm trin. Den skal ikke slibes; trinene spreder lyset.
- v18: læberne i strip-banerne og i reflektorlommen peger fremad og står på laget under. Stammerne og trinnet foran hvid 1 er korte, flade hylder på ca. 1,1 mm. Der skal ikke support på; en lille hængning under hylderne gør ikke noget. Se efter, at læberne er hele hele vejen rundt, og fjern trådrester i banerne med en kniv.

**Kamerarør:** læg det på pladen sammen med skallen eller bagrammen (den flade ende ned, skråningen opad). 0,16 mm lag, 100 % fyld.

**Skal** (bagsiden ned på glat PEI)
- 0,16 mm lag på ydersiden giver de fineste flader.
- 5 vægge, 6 top- og bundlag, 20 % gyroid.
- Support: *Tree*, kun fra pladen. Det er kun til lommerne bagpå.
- Brug **musøre** (mouse ears) i de 4 hjørner.

**Vægbeslag:** printes som i v1 (6 vægge og 100 % fyld).

## Efter print

1. Bor de 4 skruehuller i frontens hjørner rene med et 2,5 mm bor i hånden.
2. Prøv lysringen i fronten bagfra (uden snor). Den skal falde på plads uden at klemme, med en lige, smal skyggefuge (0,15 mm) rundt om lysfladen. Se efter, at kravens underside er nogenlunde plan (den hænger 1,65 mm ud i printet).
3. Prøv skærmen i fronten (uden snor). Den skal falde ned mellem ribberne uden at klemme; klemmer den, skrabes ribberne let med en kniv. Se efter, at kanten foran glasset er plan, og at rillen er ren og 1,0 mm dyb hele vejen rundt.
3b. Prøv kameraglasset i lommen bag kameravinduet: det skal falde ned uden at klemme og ligge plant mod kanten.
4. Prøv kameraet på frontens 4 tappe. Det skal kunne trykkes på med fingrene uden at skære i tappene.
5. Se efter, at vinduerne i kanalens vægge er åbne, og at overkanten (den sidste bro i printet) er lige. Fjern trådrester med en kniv.

## Samling

Læg fronten med forsiden ned på et blødt underlag.

1. **Snoren til lysringen** (ca. 1,8 m): læg den i lommen bag frontpladen, på begge sider af slidsen og rundt om begge ender ved kameraet, i ét stykke. Start og slut midt i bunden, skær enderne lige, og stød dem tæt sammen uden overlap og uden at strække snoren. Læg så **lysringen** i slidsen bagfra; kraven ligger oven på snoren på begge sider.
2. **Snor og skærm:** Læg snoren (ca. 0,75 m) i rillen rundt om vinduet i ét stykke, start og slut midt i toppen, så samlingen sidder højt, hvor der ikke står vand. Snoren ligger løst i rillen og stikker ca. 0,5 mm op. Læg derefter skærmen i fronten med glasset ned på kanten. 8 små ribber langs glassets kant styrer den på plads, så billedet sidder lige i vinduet. Den skal falde ned uden at blive trykket; snoren klemmes, når skærmen skrues fast.
2b. **Kameraglasset:** Rens glasset og læg det i lommen bag kameravinduet. Læg en snor-ring (ca. 35 mm snor, enderne stødt sammen) i hjørnet bag glasset, langs lommens væg, og læg **kamerarøret** ovenpå med den skrå ende mod glasset. Røret holdes på plads af kameraet i næste trin.
3. **Strips** (v18: intet klister). Sæt klikstikkene på strippene først. Læg bagrammen på bagsiden og sæt strippene i med lyset ind mod reflektoren: **RGB først** (bagerst, i den tætte bane), så **hvid 2** (midterste bane), så **hvid 1** (forreste bane) og til sidst **hvid 3** i lommen i den skrå reflektor. For hver hvid strip: vip strippen, skub bagkanten ind under læben, og tryk forkanten ned; rul tommelfingeren langs hele strippen. RGB kan også skydes ind i banen fra enden ved kameraet. Hvid 1 og RGB har klikstik i venstre side af kameraet, hvid 2 og hvid 3 i højre side (hvid 3's stik ligger i reflektoren under hvid 2's). Ved et klikstik slutter nabostrippen 17 mm længere ude. Ledningerne går ud gennem hullerne ved siden af kameraet; hvid 3's ledning gennem det nye hul i reflektoren. Forkanten af hvid 3 holdes først fast, når bagrammen trykkes ned i fronten (lysringens kile).
4. **Kameraet:** Sæt kamerakablet (300 mm) i kameraet først. Kablet går ud til siden, mod slidsen i bagrammen. Tryk kameraet på de 4 printede tappe; linsen går ind i kamerarøret, og røret står på linseholderen. Se forfra, at snor-ringen ligger jævnt rundt i hjørnet bag glasset.
5. **Bagrammen** lægges ned i fronten. Før kamerakablet gennem slidsen i bagrammen lige ved kameraet. Kablet laver én blød bue bagud og må ikke knækkes eller foldes skarpt. Tryk bagrammen ned, til alle 14 låse klikker (8 på indervæggen, 6 på ydervæggen). Tryk først midt på hver side, så låsene klikker parvis. Den trykker lysringens krave ned på snoren hele vejen rundt (v18: på den inderste side gennem ringens kile, som samtidig trykker hvid 3 ned i lommen), trykker kameraet mod forsiden, og de 8 fjedertæer trykker skærmglasset mod kanten. Nu kan front, skærm og bagramme vendes og bruges åben uden skal. Skal bagrammen af igen, stikkes en lille skruetrækker i slidsen ved hver lås bagfra, og armen vippes væk fra væggen.
6. **Skærmen skrues fast** med 4 M2,5 × 3–4 mm skruer (fx fra skærmens egen pose), gennem bagrammen og ind i skærmens fire gevindører. Hovedet sidder ca. 18,6 mm nede i tårnet på en 1,6 mm bund, så brug en PH0/PH1-skruetrækker med et skaft under Ø5 mm og gerne magnetisk bit. Brug ikke 5 mm skruer: de rammer skærmens bagside. Spænd skiftevis over kryds, til glasset ligger helt ind mod frontens kant hele vejen rundt; snoren bliver klemt ned i rillen. Bagrammen trykker skærmen 0,2 mm mod kanten, så den sidder uden slør.
7. **Pi'en:** Sæt skærmens korte flade kabel i skærmen og i Pi'ens DISP-stik, før Pi'en skrues på skærmens afstandsstykker med de 4 andre skruer fra posen. Kablet skal ligge i en blød bue rundt om Pi'ens kant. Kamerakablet føres i en løs bue bag bagrammen ned til Pi'ens CAM-stik. Active Cooler sidder på Pi'en og vender bagud; der er ca. 32 mm fri luft bag blæseren.
8. **Elektronik i skallen:** 5 V-forsyningen og WLED-styringen trykkes ned i deres lodrette bakker på bagvæggen på hver side af røret, forsyningen med skrueklemmerne opad og WLED-styringen med udgangen (4 klemmer + USB-C) opad, og dæmperen i bakken på venstre væg. Læberne på bakkerne holder dem. Forbind alt **præcis som i `halo-gen2-v20_ledningsdiagram.png`** med Wago 221-41x (3 × 221-413, 1 × 221-414 og 3 × 221-415; ikke 221-6xx, som ikke tager de tynde ledninger fra strips) og klikstik. Sæt ledningstyller på alle fintrådede ledninger, der går i en skrueklemme. Vigtigst:
   - RGB-styringen får 5 V fra W3/W4, **aldrig 24 V**.
   - 5 V-forsyningens −V bindes til 24 V-GND (broen W4 → W2), ellers virker Pi'ens styresignal til dæmperen ikke.
   - De hvide strips får + fra 24 V (strip 1 direkte fra W1, strip 2 og 3 gennem W6) og − gennem dæmperen (W5).
   - Mål med et multimeter, før strips og Pi sættes i: 24 V på W1, 5 V på W3, og 5 V (ikke 24 V) på RGB-styringens udgang.
9. **Mikrofonkortet (tilvalg):** Sæt det flade kabel (20 cm, følger med) i kortet. Læg kortet i lommen i bunden lige bag forkanten med **Seeed-logoet nedad** (det er den side, lydhullerne er på) og stikket bagud. De 2 printede pinde går gennem kortets huller. Kablet går lige bagud gennem udskæringen i lommen, op bag Pi'en og ind i stikket i underkanten af mikrofon-kernen, som ligger ned i sin bakke på bagvæggen over WLED-styringen. Kablet må gerne bøjes blødt, men ikke knækkes. Kortet skal ligge fladt; de 4 små ringe i lommen lukker tæt om lydhullerne.
10. **Snoren mellem front og skal** (ca. 0,97 m): læg den i rillen i skallens forkant i ét stykke, start og slut midt på toppen. **Skallen** sættes ned over fronten. De 4 frontskruer (**SPUN+ 3,0 × 15 mm, forsænket**; databladet siger TX10, Bauhaus siger TX20, så tjek pakken) skrues i bagfra gennem hullerne i bagvæggen. Hver skrue går gennem skallens stolpe og bagrammens øre og ind i fronten, så de tre dele holdes sammen af de samme 4 skruer. Brug en **lang Torx-bit i den størrelse (mindst 45 mm)**, fordi skruehovedet sidder ca. 37 mm inde. Spænd over kryds, til front, bagramme og skal sidder hårdt sammen; der skal være en jævn fuge på ca. 0,2 mm mellem front og skal hele vejen rundt.
10b. **Højttaleren:** læg snoren (ca. 0,14 m) i rillen rundt om gitteret i bagvæggen, før højttaleren trykkes ned over pindene og ind under krogene.
11. **Strømindgangen:** Skru 24 V-ledningerne i hunstikket (TRU DC-13F, 5,5/2,5) med ledningstyller, før skallen lukkes. Tryk hunstikket ned i røret midt i bunden ved bagvæggen ovenfra, med åbningen nedad, til de 2 snaplåse klikker over toppen af stikket. Ledningerne går lige op over røret og til højre over 5 V-forsyningen til Wago-klemmerne ved forsyningens øverste ende.
12. Vægbeslag og sikkerhedsskrue som i v1. Når boksen hænger, sættes strømforsyningens stikprop op i hullet i bunden, til den sidder helt inde. Kablet hænger lodret ned under boksen.

Købedele, der skal skrues: 4 frontskruer, 8 M2,5-skruer (følger med skærmen) og 1 sikkerhedsskrue. Der er ingen gevindindsatser, fjedre eller lim. Pakninger: kun O-ringsnoren (5 steder), og ét glas foran kameraet (Esben 23. okt. 2026).

## Pakninger og kameraglas (indkøb)

- **O-ringsnor Ø1,5 mm i silikoneskum**, RS Components 234-2906, rulle på 5 m: https://dk.rs-online.com/web/p/o-ring-cord/2342906. Én rulle pr. boks (brug ca. 3,6 m): front/skal 0,97 m, skærm 0,75 m, lysring 1,8 m, højttaler 0,14 m, kamera 0,035 m.
- Skum, ikke massiv silikone og ikke NBR: med 3,6 m snor ville massiv snor presse delene fra hinanden med over 2.000 N, og NBR revner af ozon og sol. Skummet udligner også printets unøjagtighed.
- Skær med en skarp kniv lige på tværs. Enderne stødes tæt sammen i rillen uden lim; snoren må ikke strækkes, når den lægges i (så bliver den tyndere og tætner dårligere).
- **Kameraglas Ø12 × 1,5 mm**, rundt, planparallelt (AliExpress, samme type som Esbens liste med Ø8–42 og 1,2–2 mm). 1,2–1,8 mm tykt går; 1,5 er tegnet. Det må ikke være mindre end Ø12: Wide-kameraets synsfelt kræver ca. Ø8,2 fri ved glassets forside, og kanten bag glasset bærer det på de sidste 1,7 mm.

## Tjek på første print

- Mikrofon: er de 4 huller i bunden åbne hele vejen igennem, og ligger kortet fladt på ringene med logoet nedad? Optag tale på 0,8 og 2 m foran boksen, med boksens egen lyd i højttaleren, og lyt efter ekko og blæserstøj.

- Kameratappe (nyt i v15): går kameraet ned over alle 4 tappe uden kniv, og sidder det uden slør?
- Låse (nyt i v14): klikker alle 14, når bagrammen trykkes ned, og kan de vippes fri med en lille skruetrækker uden at knække? Vakler front, skærm og bagramme, når de løftes og vendes uden skal? Ligger glasset helt ind mod kanten hele vejen rundt bare med fjedertæerne (før skærmskruerne)? Er tæerne for stramme, kan LK_TOE[3] gøres 0,1 mm mindre i CAD.
- Lysringens ender (nyt i v14): kan man stadig se ind til kameraet gennem lysringen? Er enderne ved kameraet meget mørkere end resten af ringen?
- Hjørner (nyt i v14): er inderringen hel i alle 4 hjørner, og går skærmen ned uden at klemme i de nederste hjørner?

- Logo: er kanterne skarpe, og er der ingen sort farve i det hvide? Ligger logoet plant med resten af forsiden?

- Kamera: sidder linsen midt i hullet, og er der ingen sort kant i billedets hjørner? Går kamerakablet gennem slidsen uden skarpe knæk?
- Lysring: er skyggefugen jævn, og rasler ringen ikke, når boksen er samlet?
- Skærmskruer (nyt i v16): står tårnene helt ned på skærmens beslag, og går alle 4 M2,5-skruer i gevindørerne uden at bagrammen skal skubbes eller vrides? Tager skruen fat (2–2,5 mm gevind), uden at skærmen bliver trukket skævt?
- Skærm: sidder den helt fast uden slør? Ellers kan bagrammens knaster gøres 0,2 mm længere i CAD.
- Skærm og kant: ligger glasset helt ind mod frontens kant hele vejen rundt, også i hjørnerne, når snoren er i? Er kanten foran glasset plan, uden at rillen kan ses forfra (v20: 0,6 mm plast foran rillen)?
- Kameraglas (nyt i v20): tag et billede med lys i hele billedet: er der mørke hjørner, eller genskin fra lysringen i glasset? Er der det, sendes billedet til CAD, så vinduet kan gøres større eller skråningen stejlere.
- Pakninger (nyt i v20): er fugen mellem front og skal jævn (ca. 0,2 mm)? Er snoren klemt alle 5 steder (den skal ikke kunne trækkes ud, når boksen er samlet)? Rasler lysringen ikke?
- Låselomme (nyt i v20): går vægbeslagets tunge frit ind og op, og er drænhullet i bunden åbent?
- Spild: hæld en spiseske vand på glasset, på kameravinduet og på toppen, mens boksen hænger, og se efter, om noget kommer ind bag fronten.
- Lys: tænd alle 3 hvide strips på 100 % og mål lux ved 0,8 m (målet er mindst 250 lux). Se efter striber eller pletter i lysringen, især i den inderste kant ud for hvid 3.
- Strip-baner (nyt i v18): bliver alle 4 strips liggende, når man kører fingeren langs, også i hjørnerne? Løfter forkanten af hvid 1 eller 2 sig nogen steder? Rasler RGB i sin bane? Ligger hvid 3 helt nede i lommen, når bagrammen er trykket på?
- Klikstik til hvid 3 (nyt i v18): går det ned i sin lomme i reflektoren uden at ramme stikket til hvid 2 eller kamerakablet?
- Bakker: sidder 5 V-forsyning, WLED-styring, dæmper og kortene fast, også når boksen vendes og rystes? Kan de tages ud igen med en flad skruetrækker uden at kanterne knækker?
- WLED-styringen (nyt i v17): går den ned i holderen, klikker kanterne over låget, og står den fast på langs mellem de to stop? Er der for meget slør på langs, så mål kassens længde uden arme; CAD regner med ca. 87,9 mm.
- Strømindgang: klikker hunstikket fast i røret, og sidder det fast, når stikproppen trækkes ud? Går proppen helt ind? CAD regner med hunstikkets krop ca. 13 × 13 mm (skønnet fra billedet) og proppens greb højst Ø12 og 38 mm (ingen tegning fra Mean Well). Mål begge, før skallen printes, hvis det kan lade sig gøre.
- Mål dæmperens højde og klikstikkene. Der findes ingen officiel tegning af dem, så CAD bruger forhandlerens mål.
- Vejr: sprøjtetest med en blomstersprøjte fra alle sider i 10 minutter med tændt boks, som i v1.
