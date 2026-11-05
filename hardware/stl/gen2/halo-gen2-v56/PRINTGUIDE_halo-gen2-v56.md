# Selfi Halo gen 2, version v56: printguide

**Version:** halo-gen2-v56 (5. nov. 2026). Alle filer i denne mappe starter med `halo-gen2-v56_`. Den erstatter halo-gen2-v55. **v56 er v55 med bagrammens Wago-lommer lavet som Wago-rækken i skallen** (tand i hver indgang, knusribber, kanter over bagenden; håndtagene opad og indgangene bagud). Alt andet er som v55.

Printer: Bambu Lab H2C. **Print fra 3MF-filerne** (se Indstillinger); STL-filerne ligger også i printretning. Én del pr. plade, 1 stk. af hver. Alle dele i PLA, lysringen i klart materiale.

## Hvad er nyt i v56: Wago-lommerne i bagrammen er som Wago-rækken i skallen

Esben 5. nov. om v55: *"Du har ikke brugt korrekt wago klemme system, du skal bruge lignende det eksisterende der er i skallen"*. Lommerne over det øverste tværstykke er tegnet om med skallens system fra v40 (v55's ribber, klikkant og kanter foroven er væk):

- **Samme greb som i skallen:** en skrå tand pr. indgang, der går 2 mm ind i bunden af hullet og holder indgangsenden nede, knusribber i begge sider (0,5) og bagved (0,25) og en lille kant over klemmens bagende i hvert hjørne (0,6 ind over den, 0,2 over toppen).
- **Sådan ligger klemmerne:** fladt på en bund over tværstykket, **håndtagene opad** og **indgangene bagud**. Strippenes egne ledninger kommer ned bag rammen fra slidserne ved kameraet og går lige ind i indgangene, og forlængerne går lige ud bagud. Med boksen åben vender både håndtag og indgange mod dig.
- **Sådan kommer de i (som i skallen):** sæt indgangsenden ind over tænderne (skub klemmen bagud), og tryk så bagenden (ind mod skærmen) ned, til begge hjørner klikker under kanterne. Ud igen: lirk bagenden op forbi kanterne, og træk klemmen frem.
- **Hvor:** venstre 2 lommer til **221-415** (hvid + og hvid −, x −58 til 4), højre 3 til **221-413** (set forfra fra venstre: RGB data, GND, +5 V, x 21 til 83). Den højre række går ud i rammens kant. Klemmernes bagende er 1,35 mm + endevæggen bag skærmen.
- **Print:** bagrammen printes stadig med bagsiden nedad og uden support. Alt er drejet til det: bund, sidevægge og tænder står på pladen (tænderne har en skrå fod på 49° under sig), endevæggen bygger bro mellem sidevæggene, og kanterne sidder på små tapper på sidevæggene, så de fjedrer til siden, ligesom skallens tapper fjedrer bagud.
- **Plads:** lommerne står på ben 4 mm over tværstykket (bunden 2,1 mm over blæserhegnets øverste arm), og benene står uden for blæserhegnet og velcrostropperne ved x −76 og 34.
- Ledningerne: strippenes længste ledning (RGB +5 V) bruger ca. 11,5 cm af sine 14-15 cm, og forlængerne har samme klippelængder (40, 45, 55, 55 og 60 cm).
- Pasformstjek (manifold, alle dele): ingen nye kollisioner.

### Hvad skal printes nyt

Kun `halo-gen2-v56_bagramme.3mf`. Alt andet er som v55. Hurtigsættet `halo-gen2-v56-hurtig` har lommerne med et stykke af tværstykket på plade 1.

## Hvad var nyt i v55: Wago-lommerne til strippene er en del af bagrammen

Esben 5. nov.: *"hvorfor har du sat wagorække som eftermontering i stedet for at lave det som en del af bagramme? Så kan du bruge plads bag skærmen osv"*. Rigtigt: de to løse Wago-holdere fra v53 (`wagoholder-hvid` og `wagoholder-rgb`, der klikkedes på tværstykket) er væk, og lommerne er nu støbt ind i bagrammen. (`wagoraekke-eftermontering` er noget andet: skallens Wago-række til limning i en gammel v24-v28-skal; den er uændret.)

- **Hvor:** i rammens vindue over det øverste tværstykke, lige bag skærmen (1,35 mm luft til skærmens bagside). Samme x som i v53, så ledningsplanen er den samme: til venstre 2 lommer til **221-415** (hvid + og hvid −, x −58 til 3), til højre 3 lommer til **221-413** (set forfra fra venstre: RGB data, GND, +5 V, x 23 til 83). Højre række går helt ud i rammens kant.
- **Sådan sidder klemmerne:** på højkant med **indgangene opad**, så strippenes egne ledninger fra slidserne ved kameraet går lige ned i dem, og **håndtagene bagud**. Med boksen åben ligger fronten med forsiden nedad, og så vender håndtagene op mod dig.
- **Sådan kommer de i:** skub klemmen ind **bagfra** mellem sine to ribber, med bunden mod skærmen, til den ligger på bundpladen og klikker bag de to små kanter. Knusribber på siderne og bagved holder den uden slør, og en lille kant over hvert hjørne af indgangssiden holder den nede, når en ledning trækker (kanterne er uden for hullerne, så en afisoleret ledning går forbi dem). Ud igen: træk den lige bagud.
- **Print:** bagrammen printes stadig med bagsiden nedad og uden support. Ribberne og endevæggen står lige op fra pladen, bundpladen er det øverste lag og bygger bro mellem ribberne (18,6 og 29,6 mm), og kanterne er 0,5 mm udhæng. Bagrammen vejer ca. 18 g mere, de to holdere (ca. 16 g) skal ikke printes.
- **Plads omkring dem:** lommerne står 4 mm over tværstykket på små ben, så blæserhegnets øverste arm (2,1 mm under lommerne) stadig kan fjedre, når det klikkes på, og velcrostropperne ved x −76 og 34 stadig går over tværstykket under dem. Benene står uden for blæserhegnet og stropperne.
- Strippenes egne ledninger går fra slidserne bag toppen frem gennem vinduet og ned i indgangene. Den længste (RGB +5 V) bruger ca. 12 cm, og de er 14-15 cm. Forlængerne E1-E5 går bagud gennem vinduet og samme vej til K1 som i v53; klippelængderne er de samme (40, 45, 55, 55 og 60 cm).
- Pasformstjek (manifold, alle dele): ingen nye kollisioner. Klemmerne står 4,7 mm over blæserhegnet, 2,95 mm bag skærmen og 26 mm fra skallens Wago-række.

Tegninger: `halo-gen2-v56_ledningsplan.png` (de 5 klemmer i bagrammen er orange) og `halo-gen2-v56_ledningsdiagram.png`.

### Hvad skal printes nyt

Kun `halo-gen2-v56_bagramme.3mf`. `wagoholder-hvid` og `wagoholder-rgb` findes ikke længere. Alt andet er som v54. Hurtigsættet `halo-gen2-v55-hurtig` har lommerne med et stykke af tværstykket på plade 1, så du kan prøve klemmerne og klikke blæserhegnet på.

## Hvad var nyt i v54: kabellåsen og styrehullerne er væk

Esben 5. nov.: *"Det må ikke være en ekstra del. Vi tager den senere. Fjern alt du har lavet med låsen"* og *"Fjern desuden også de to styrehuller da de jo ikke bruges af gulvstander beslaget"*.

- **Kabellåsen fra v52 er fjernet helt:** ingen plade under bunden, ingen skrueklods med forhul foran stikkets kanal og ingen 3. sikkerhedsskrue. Strømforsyningens stik går op nedefra og ledningen hænger lige ned, som i v51. En sikring af stikket tager vi senere, og den må ikke være en ekstra del.
- **Stativbeslaget:** slidsen i hylden til stikket er igen 16 mm bred fra y 50 og åben bagud (som v51). Hylden er ellers uændret.
- **De to styrehuller (Ø6,2, 18 mm fra midten) i bunden er lukket.** Ingen del bruger dem: stativbeslaget har ikke haft pinde siden v2, og vægbeslaget har aldrig brugt dem.
- **Købedele:** 2 sikkerhedsskruer (Bolte 88115) igen, kun ved låsene.
- Pasformstjek (manifold, alle dele): ingen nye kollisioner.

Nye filer i forhold til v53: `halo-gen2-v56_skal_support.3mf` (uden skrueklods og styrehuller) og `halo-gen2-v56_stativbeslag_flerfarvet.3mf` (slidsen som v51). `halo-gen2-v56_kabellaas` findes ikke længere. Alt andet er som v53.

## Hvad var nyt i v53: faste Wago-pladser og forlængere til delene med egne ledninger

Esben 4. nov.: *"der skal du altså lige have fundet en løsning, hvor vi kan forlænge dem, og der kan komme holdere på det ... Generelt på, om der er noget, der har ledninger i sig selv, som skal forlænges"* og *"når vi sætter vakuumklemmerne på, så skal de ikke bare hænge løs rundt omkring, de skal også have en fast sædeplads"*. Hans mål 5. nov.: hvid strip 14 cm (sort, rød), RGB 14-15 cm (hvid, rød, gul), sikringens lange ledning 15 cm (den korte ca. 6 cm), Gravity-kablet 30 cm; højttalerens kabel kendes ikke endnu.

Tegninger: `halo-gen2-v56_ledningsplan.png` (de 5 klemmer på bagrammen og de 2 ved sikringen er orange) og `halo-gen2-v56_ledningsdiagram.png`.

### Strippene: to Wago-holdere på bagrammens øverste tværstykke

Strippenes egne ledninger kommer ud af slidserne ved kameraet og kan ikke nå skallens Wago-række (de skulle bruge 40-55 cm). Nu ender de lige under slidserne:

- **`wagoholder-hvid`** (venstre for blæserhegnet, x −60 til 5): 2 lommer til **221-415**, hvid + (venstre) og hvid − (højre). Hver tager de tre hvide strips' ledning og forlængeren; den 5. indgang er fri.
- **`wagoholder-rgb`** (højre for blæserhegnet, x 21 til 84): 3 lommer til **221-413**, set forfra fra venstre: data (gul), GND (hvid), +5 V (rød). Tjek farverne på din strip, før du tænder.
- Mellem holderne er x 5 til 21 fri til kamerakablet. Bagrammen er uændret.
- Holderne **klikkes på tværstykket som blæserhegnet**: en plade på tværstykkets bagside, en arm over det og en fjedrende arm under det, begge med en kant, der griber om tværstykkets forkant. Hægt den øverste arm på først og tryk den nederste på plads.
- Klemmerne står på højkant bag bagrammen, over tværstykket: **indgangene opad**, så strippenes ledninger går lige ned i dem fra slidserne, **håndtagene bagud** (når boksen er åben og fronten ligger med forsiden nedad, vender de opad). Lommerne er de samme som i skallens Wago-række (v40): skrå tænder ind i hvert hul, knusribber og en lille kant over klemmens bagende i hvert hjørne. Sæt indgangsenden ind over tænderne og tryk bagenden ned, til den klikker.
- Holderne **printes på siden** som blæserhegnet (hvid: venstre side på pladen, RGB: højre side), uden support. Derfor er væggen mellem lommerne en trekant med den lige side mod den næste klemme. Ca. 8 g hver.
- Strippenes ledninger skal højst bruge 11 cm (hvid 2 fra højre slids over til hvid + klemmen er den længste), og de er 14 cm.
- **Forlængerne** går fra holderne op og til venstre bag bagrammens top, ned langs venstre kant til K1 og gennem K1 til skallen, som strippenes ledninger gjorde før:

| Id | Fra | Til | Ledning | Klip |
|---|---|---|---|---|
| E1 | hvid + klemmen | W6 | 0,75 mm² rød | 40 cm |
| E2 | hvid − klemmen | W5 | 0,75 mm² sort | 45 cm |
| E3 | RGB +5 V klemmen | W3 | 0,75 mm² rød, orange tape | 55 cm |
| E4 | RGB GND klemmen | W4 | 0,75 mm² sort | 55 cm |
| E5 | RGB data klemmen | Gledopto GPIO16 | 0,5 mm² grøn eller gul | 60 cm |

Skallens Wago-række er uændret og har plads: W6 og W5 får hver kun én forlænger (før 2-3 stripledninger), W3 og W4 får forlængerne i stedet for RGB-strippens egne ledninger.

### Sikringsholderen: to faste Wago-pladser over den (skallen)

Under sikringen er der ikke plads til en klemme (skallens runde hjørne, låseskruen og 5 V-bakkens ribbe), så begge sidder over den, 19 mm over holderens top:

- **FWL** på 5 V-forsyningens bakkevæg og **FWR** på højre væg, begge **221-413** på højkant med **indgangene nedad** og bredden ind fra bagvæggen. Håndtagene vender mod hinanden (16 mm imellem). Samme lommer som i Wago-rækken; de vokser op fra bagvæggen og printes med skallen uden ekstra support.
- Sikringens **korte ledning (6 cm) vender opad** og går i **FWR** sammen med **P1b** (til W1). Den bruger ca. 5 cm.
- Den **lange ledning (15 cm) vender nedad**, går frem og op mellem sikringen og 5 V-bakken og ind i **FWL** sammen med **P1** fra hunstikket. Den bruger ca. 12,5 cm, så der er lidt at give af; den kan også klippes.
- P1 er nu ca. 30 cm (før 40), P1b 25 cm.

### Gravity-kablet og højttaleren

- **Gravity (G1):** ruten fra Pi'ens ben til dæmperen er ca. 37 cm, og kablet er 30 cm. Forlæng med **3 dupont-ledere han-hun, 10 cm**: kablets hunstik på hanstikkene, hunstikkene på Pi'ens ben 1, 12 og 14 som før. Samlingen ligger 2 cm før K2's strop på det nederste tværstykke; sæt krympeflex over den og tag den med i stroppen, så den ikke kan glide fra hinanden.
- **Højttaleren (A1, tilvalg):** ruten til mikrofonkernens SPEAKER-stik er ca. 9 cm, så kablet skal være mindst 10 cm. Er det kortere, når den kommer, så sig til, så får den en forlænger og en fast plads som de andre.

### Indkøb pr. boks (nyt)

- Wago **2 × 221-415 og 5 × 221-413** ekstra (bagrammen: 2 + 3, sikringen: 2).
- Ledning: 0,75 mm² rød ca. 1 m og sort ca. 1 m til E1-E4, 0,5 mm² grøn eller gul 60 cm til E5.
- 3 dupont-ledere han-hun 10 cm og lidt krympeflex til Gravity.

Pasformstjek: ingen nye kollisioner. Holderne går 0,6 mm fri over blæserhegnets arm, klemmernes håndtag står 10,9 mm fra skallens Wago-række, når boksen er lukket, og sikringens klemmer står 4,2 mm under stødsensorens bakke.

### Hvad skal printes nyt

`halo-gen2-v56_wagoholder-hvid.3mf` og `halo-gen2-v56_wagoholder-rgb.3mf` (nye), og `halo-gen2-v56_skal_support.3mf` (Wago-pladserne ved sikringen). Front, lysring, bagramme, blæserhegn, vægbeslag, stativbeslag, kabellås og temadele er de samme som i v52. Hurtigsættet `halo-gen2-v54-hurtig` har begge holdere (hele), et stykke af bagrammens tværstykke at klikke dem på og skallens to nye Wago-pladser på plade 1.

## Hvad var nyt i v52: kabellås, så strømstikket ikke kan trækkes ud (fjernet igen i v54)

Esben 5. nov.: *"Hvordan sikrer vi os at strømstikket ikke bare bliver taget ud ved b2b vægmontering? Kan vi lave en lille form for sikkerhed for det på en måde?"* og *"gælder selvfølgelig også ved gulvstanderen"*.

Strømforsyningens stik sidder 38 mm oppe i bunden og holder kun ved friktion i hunstikket. Ledningen hang lige ned, så et ryk i ledningen trak stikket ud. Nu sidder der en **kabellås** under stikket. Tegning: `halo-gen2-v56_kabellaas.png`.

- **Kabellåsen** er en lille sort plade (19 × 30 × 8,5 mm) under bunden, bagerst på midten, 0,5 mm inden for boksens bagkant. Ledningen ligger i et spor i pladens overside, som lukkes af bunden: ned ud af stikkets kanal, frem i venstre side, i en U rundt om en **sikkerhedsskrue** (den samme Bolte 88115, ST4,2 × 25 Torx med pin, som ved låsene) og tilbage i højre side, hvor den går ned ud af pladen **10 mm fra væggen**, lige der hvor stedets kabelskinne kan tage den.
- Ledningen bøjer ca. 360° på vejen. Et ryk i ledningen ender derfor i skruen og pladen, ikke i stikket. Pladen kan kun tages af med Torx-bit med pin, ligesom låsene.
- Sporet er 5,2 mm bredt og 5,4 mm dybt med 4 par små knusribber (4,4 mm imellem), så en ledning på ca. Ø4,5–5,5 holdes uden at blive klemt flad. Under stikkets kanal er der en lomme på Ø11 × 7 mm, så der er plads, hvis stikkets knækbeskytter stikker lidt ud af bunden.
- **Skallen** har fået en skrueklods (Ø9 med forhul Ø3,4 til z 20) foran stikkets kanal. Den vokser sammen med foden om kanalen. Skruen går 17 mm op i bunden og klodsen. Intet andet i skallen er ændret.
- **Gulvstanderen:** stativbeslagets hylde ligger lige under bunden. Slidsen i hylden til stikket har nu kabellåsens form med 0,5 mm luft rundt om (v51: 16 mm bred fra y 50), så pladen sidder i hylden, og ledningen går ned gennem slidsen som før. Der er stadig 4,1 mm hylde mellem slidsen og gevindindsatsen (CNC Kitchen siger mindst 3,3).
- Pladen printes, som den sidder: oversiden med sporet opad, siden med skruehovedet på pladen. Ingen support. 4 vægge og 60 % gyroid, ca. 3 g.

### Sådan sættes den på

1. Hæng boksen op og skru de 2 låseskruer i, som før.
2. Sæt strømforsyningens stik helt op i hullet i bunden (på gulvstanderen: op gennem slidsen i hylden).
3. Læg ledningen i pladens spor: ned i lommen, frem langs den side, der vender mod boksens venstre side set forfra (se tegningen), rundt om skruehullet, tilbage langs højre side og ned gennem hullet bagerst. Tryk den ned forbi knusribberne.
4. Hold pladen op mod bunden, så lommen står under stikket, og skru sikkerhedsskruen i nedefra. På gulvstanderen skrues den gennem slidsen i hylden, før kuglehovedets lynplade skrues på (lynpladen kan dække skruehovedet, og det gør ikke noget).
5. Hiv i ledningen: stikket må ikke flytte sig.

Pasformstjek: ingen nye kollisioner. Ledningen (tegnet Ø5) ligger i sporet uden at røre andet end knusribberne, og pladen går fri af vægbeslaget og stativbeslaget.

### Hvad skal printes nyt

`halo-gen2-v52_kabellaas.3mf` (ny i v52, ikke med fra v54), `halo-gen2-v56_skal_support.3mf` (skrueklodsen) og `halo-gen2-v56_stativbeslag_flerfarvet.3mf` (slidsen). Front, lysring, bagramme, blæserhegn, vægbeslag og temadele er de samme som i v51. Købedele: **3 sikkerhedsskruer** (Bolte 88115) i stedet for 2. Hurtigsættet `halo-gen2-v52-hurtig` har kabellåsen, strømindgangen og stativets hylde på plade 1.

## Hvad var nyt i v51: kølekanal i bagrammen, som blæseren kan køle

Esben 5. nov.: *"lav noget som blæseren kan rotere luft igennem, den sætter vi jo til at køre altid, så køler de altid lyskanalen"* og *"vi må ikke bruge noget eksternt"*. Han valgte en åben ringkanal, hvor Pi-blæseren rører luften i boksen.

Kun **bagrammen** er ændret. Den var massiv bag lyskanalens bund (hvid 3). Nu er den hul:

- **En kølekanal hele vejen rundt** bag bunden: 12 mm bred og 8,6 mm dyb, 2,4 mm bag bunden (1,4 mm i hjørnerne), med 2,1 mm bagside og mindst 1,5 mm væg ved frontskruerne. Den er lukket ind mod lyskanalen, så **intet lys kan slippe ud** den vej. Den stopper 41 mm fra midten oppe, så klipslommerne og ledningsslidserne ved kameraet ikke ændres.
- **12 spalter i bagsiden** (9 mm brede) ind til boksen. De lave spalter sidder i bunden (3 stk.) og forneden på begge sider. De høje sidder højt på begge sider og i den øverste banes yderste ender. Siderne står lodret, så kanalen virker som en **skorsten**: varm luft stiger op og ud foroven, og køligere luft fra boksen trækkes ind forneden. Pi-blæseren kører nu altid med en stille grundfart (softwaren i selfiebox-platform) og rører luften i boksen. Bag hver spalte er der fri luft, tjekket mod alle dele. Nogle ledninger kan ligge hen over et par af dem; det gør ikke noget.
- Bagrammen bliver ca. **88 cm³ lettere** (ca. 110 g PLA), og den printes stadig med bagsiden ned uden support. Kanalens loft er en 12 mm bro.

Hvad det giver (varmemodellen 5. nov., `/mnt/project-files/lyskanal-varme/`): skorstenen trækker mere, jo varmere kanalen er. Ved en travl fest giver den ca. 1 °C, med striber i kø ca. 3-4 °C, og hvis lyset hænger, ca. 10-13 °C. Den alene holder ikke kanalen under 100 °C, hvis lyset hænger; det skal softwaren sikre.

Pasformstjek: ingen nye kollisioner. Hurtigsættet `halo-gen2-v51-hurtig` havde lysstakken nederst til venstre på plade 1, nu med kølekanalen og 2 spalter. Se efter, om kanalens loft er pænt og lukket, og at der ikke kommer lys ud gennem spalterne, når en strip lyser.

### Hvad skal printes nyt

Kun bagrammen. Alle andre filer var de samme som i v49.

## Hvad var nyt i v49: 1,8 mm under broerne over de hvide strips

Esben 4. nov.: *"1.65mm tykkelse på led 2,2mm på rgb"* og *"1,66 var også under pres, så de er nok 2, men kan nemt presses ned så 1,8 er nok godt"*.

Kun **bagrammen** er ændret, og kun der, hvor de hvide strips ligger:

- Broerne over hvid 1 og hvid 2 og stængerne over hvid 3 giver nu **1,8 mm** under sig (v45 til v48: 2,25 mm, regnet for en 2,0 mm strip plus 0,25 luft). Strippen ligger altså let presset og kan ikke rasle.
- Broerne over RGB er uændrede: 2,2 mm strip plus 0,25 mm luft.
- Slidsen i hjørnerne, hvor hvid 3 står på højkant, er nu 2,2 mm bred (v48: 2,6).
- Broerne er stadig 2,0 × 2,4 mm.

Hurtigsættet `halo-gen2-v49-hurtig` havde hjørnet på plade 1. Prøv om strippene glider ind under broerne med et let tryk, og om hvid 3 sidder fast i slidsen.

## Hvad var nyt i v48: hvid 3 på højkant gennem hjørnerne, stærkere broer og broer over hvid 3

Esben 4. nov.: *"Vi skal have lavet broer på den bagerste også"*, *"Vi klipper ikke i den. Find en anden løsning"* og *"Er de broer du har lavet holdbare nok? De må ikke knække nemt. ingen af dem må knække nemt."*

Kun **bagrammen** er ændret. Lysring, skal, front og alt det andet er de samme som i v46. halo-gen2-v48's snit (`halo-gen2-v48_snit_led.png`) viste broerne, slidsen i hjørnet og hvor hvid 3 vrides.

### Hvid 3 gennem hjørnerne: vrid den op på højkant

Hvid 3 kan ikke bøje rundt om hjørnet i sit eget plan (den er 8 mm bred, hjørnet er en kurve på 26 mm, og yderkanten skulle strækkes over 20 %). Den skal heller ikke klippes. Derfor:

- Den ligger fladt på bunden under læberne, indtil der er 15 mm til hjørnet. Der stopper læberne og skinnerne.
- Derfra vrides den en kvart omgang, så den står på højkant. Midt i hjørnet står den i en slids mellem to finner (2,6 mm bred, 14 mm lang, 6 mm høj). På højkant bøjer den over sin flade side, som hvid 1 og hvid 2 gør på væggene.
- Efter hjørnet vrides den ned igen og ligger fladt under læberne, 15 mm efter hjørnet.
- Vridet fordeles over ca. 30 mm på hver side af slidsen. Det svarer til en kvart omgang på godt 3 cm, og det kan en 8 mm strip godt holde til. Vrid den ikke skarpt på et kort stykke.
- På højkant lyser den ud mod siden i hjørnet i stedet for frem mod lysringen. Lyset kastes rundt af de hvide vægge, så det er kun lidt lys, der går tabt i de fire hjørner.

### Broerne er stærkere

- Alle broer er nu **2,0 × 2,4 mm** (v45 og v46: 1,0 × 1,6). De er vokset ind mod kanalens midte, så der stadig er 0,25 mm luft over strippene.
- Stængerne langs væggene printes stående, så de bøjes på tværs af printlagene. Med 20 MPa mellem lagene og 9 mm mellem fæsterne knækkede de gamle ved ca. 5 N (et fast fingertryk). De nye holder til ca. 28 N (omkring 3 kg).
- Forfra ses enden af en bro som 2,4 × 2,0 mm bag diffuseren.

### Broer over hvid 3

- Ved hver bro, undtagen i hjørnerne, er der nu også en stang over hvid 3 på bunden. Den er 2,0 mm tyk, 0,25 mm over COB'en og går på tværs af banen med et ben ned til hver skinne. Den printes liggende hen over banen, med tråden på langs, så den er stærk.
- I hjørnerne holdes hvid 3 af slidsen i stedet. Finnerne er bundet til bunden og til væggenes stænger.
- Broerne oppe er flyttet til x ±46,5 (v46: ±54), hvor hvid 3 stadig ligger fladt.

### Sådan sættes hvid 3 i nu

1. Klipset på bunden i venstre klipslomme og ledningen i slidsen ved kameraet, som i v46.
2. Læg strippen fladt under læberne og under broerne hen mod hjørnet.
3. 15 mm før hjørnet vrider du den op på højkant og trykker den ned i slidsen forfra. Slidsen er åben fremad mellem broens to stænger.
4. Efter hjørnet vrider du den ned igen og fortsætter under læberne. Gør det samme i alle fire hjørner.
5. Sæt derefter RGB, hvid 1 og hvid 2 i som i v46.

### Hvad skal printes nyt

**Bagrammen**. Hurtigsættet `halo-gen2-v48-hurtig` har på plade 1 `lyskanal` (hjørnet nederst til venstre med slidsen, broen og stykket, hvor hvid 3 vrides) og begge klipslommer. Prøv på hjørnet: kan hvid 3 vrides op i slidsen og ned igen uden at slå bule, og kan du trykke hårdt på broerne med en finger, uden at de knækker?

## Hvad var nyt i v46: ingen skråning, fire strips og broer i hjørnerne og midt på siderne

Esben 4. nov.: *"jeg sagde, at vi bruger alle tre LED-bånd ... og RGB-båndet"*, *"kunne vi eventuelt lave en i midten på hver side også"* og forslaget om at droppe skråningen helt: en hvid strip på hver sidevæg i kanalen, RGB bag den ene, og den tredje hvide på bagvæggen, så den peger lige ud mod lysringen. Han valgte "Ingen skråning, flad bund".

Kun **bagrammen** og **lysringen** er ændret. Skal, front, blæserhegn, vægbeslag, stativbeslag og temadele er de samme som i v45 (samme STL'er og 3MF-indstillinger). halo-gen2-v46's snit (`halo-gen2-v46_snit_led.png`) viste kanalen, broerne og klipslommerne.

### Lyskanalen er nu en kasse (bagramme)

- Den skrå reflektor er væk. Kanalen er 13,8 mm bred hele vejen rundt, og bunden ligger 18,6 mm bag fronten (før 27,4 mm under skråningen). Bag bunden er rammen massiv, som den var under skråningen.
- **Hvid 1** sidder på ydervæggen (4,6 til 12,7 mm bag fronten), **RGB** bag den på samme væg (13,5 til 18,5 mm). **Hvid 2** sidder på indervæggen lige over for hvid 1. **Hvid 3** ligger fladt på bunden og lyser lige ud mod lysringen.
- Hvid 1 og hvid 2 har trin og skillevægge som før, nu spejlet på begge vægge. Hvid 3 ligger mellem to skinner på bunden med en 1,1 mm læbe ind over hver af dens mørke kanter (der er 2,2 mm mørk kant på hver side af den gule stribe, så læben skygger ikke).
- Lys: en 2D-strålesimulering af kanalens snit (hvide vægge 0,88, strips 0,65) gav **153 mod 100** for v45's to hvide på skråningen. Hvid 3 på 90° på skråningen gav 125. RGB bliver ca. 36 % stærkere, fordi den ikke længere sidder bag i en dyb lomme.
- Strøm: tre hvide strips er ca. 31 W af strømforsyningens 90 W. Det giver mere varme i kanalen, så ASA til front og bagramme (som planlagt) betyder mere nu.

### Broer: 9 i alt (bagramme)

- Én i hvert hjørne (ved 45°), én midt på venstre side, én midt på højre side og én midt i bunden. Oppe sidder kameraet i midten, så der er én midt i hver halvdel (x ±54).
- Hver bro er to tynde stænger, 1,0 mm tykke og 1,6 mm brede, 0,25 mm over strippenes forside: én over hvid 1 og RGB på ydervæggen (fra trinnet til hvid 3's skinne) og én over hvid 2 på indervæggen (fra trinnet til skillevæggen). De er bundet til rammen i de mørke mellemrum, så intet krydser en strip.
- Hvid 3 på bunden har ingen bro. Den holdes af læberne hele vejen rundt.

### Klipslommerne ved kameraet (bagramme og lysring)

- I begge ender af den øverste bane, fra kameraet og 21,5 mm ud (|x| 17 til 38,5), er hele kanalens bredde fri: ingen trin, skillevægge, læber eller skinner, og bunden er 1,1 mm dybere. Ledningsslidsen (x 17 til 21) går nu gennem rammen i begge halvdele.
- **Venstre lomme:** klipsene til hvid 1 (på ydervæggen) og hvid 3 (på bunden). **Højre lomme:** klipsene til hvid 2 (på indervæggen) og RGB (på ydervæggen). Hvid 1's og RGB's klips kan ikke ligge i samme side, for de ville ramme hinanden.
- Lysringen har et hak bag på sig, hvor et klips ligger op mod den: ved hvid 1's klips (yderst, venstre) og ved hvid 2's klips (inderst, højre, fra x 21). Lysringen printes stadig uden support.

### Strippenes længder

Målt langs banerne i modellen, inklusive enden i klipset, i forhold til hvid 1 (samme længde som i v45):

| Strip | Føres fra | Fri ende ved | Længde i forhold til hvid 1 |
|---|---|---|---|
| Hvid 1 (ydervæg) | venstre | kameraet, højre | samme |
| Hvid 2 (indervæg) | højre | 4 mm før kameraet, venstre | ca. 78 mm kortere (indervæggen er en kortere vej rundt) |
| Hvid 3 (bunden) | venstre | højre klipslommes yderkant (x 38,5) | ca. 59 mm kortere |
| RGB (bag hvid 1) | højre | venstre klipslommes yderkant (x 38,5) | ca. 21 mm kortere end i v45 |

Læg strippen i sin bane først og klip den frie ende til, så den slutter ved det sted, der står i tabellen.

### Sådan sættes strippene i nu

1. **Hvid 3 først**, fra venstre: læg ledningen i slidsen ved kameraet og klipset på bunden i lommen. Skub strippen ind under læberne med den frie ende først, eller læg den ene kant ind under den ene læbe og tryk den flad. Hjørnerne skal den bøje fladt om (i sit eget plan). Det er det, hurtigsættets hjørneprøve skal vise.
2. **RGB**, fra højre: klipset på ydervæggen i højre lomme, strippen bagerst på ydervæggen, frie ende først ind under hver bro.
3. **Hvid 1**, fra venstre: klipset på ydervæggen i venstre lomme, strippen foran RGB, ind under broerne.
4. **Hvid 2**, fra højre: klipset på indervæggen i højre lomme, strippen på indervæggen, ind under broerne.
5. Ud igen: træk hver strip tilbage fra klipsenden, så glider den ud under broerne og læberne.

Hvis hvid 3 ikke vil bøje fladt om hjørnerne, kan den lægges i stykker: fire lige stykker mellem hjørnerne, forbundet med ledning. RGB-strippens forlængerledning og dens stik bag på rammen kommer i en senere version (stiktypen og længderne venter på Esben).

### Hvad skal printes nyt

**Bagrammen** og **lysringen**. Hurtigsættet `halo-gen2-v46-hurtig` har dem på plade 1: `lyskanal` (et hjørne af front, lysring og bagramme nederst til venstre med alle fire baner, broen i hjørnet og hvid 3's læber, til at prøve bøjningen) og `klipslomme` (venstre klipslomme ved kameraet).

## Hvad var nyt i v45: plads til klipstikkene og broer i hjørnerne af lyskanalen

Esben 4. nov.: *"de her stik og klipstik, som sidder for enden af stripsene, på nogle områder, der er de sidder placeringen på dem sådan, at de presser fronten væk fra LED-kanalen"* og *"vi skal sørge for, at det sidder fast, især rundt i hjørnerne. ... For man kan især se lyset, hvis ikke det sidder helt tæt op mod kanterne."* Han foreslog en tynd bro, som strippene kan køre under, og at starte med én i hvert hjørne.

Kun **bagrammen** og **lysringen** er ændret. Skal, front, blæserhegn, vægbeslag, stativbeslag og temadele er de samme som i v43 (samme STL'er og 3MF-indstillinger). halo-gen2-v45's snit (`halo-gen2-v45_snit_led.png`) viste begge ændringer.

### Lommer til klipstikkene ved kameraet (bagramme og lysring)

v36 regnede med, at strippene blev loddet uden klipstik. Strippene, der bruges, har klipstik på den ende, der føres (hvid: 8 mm COB-startklips ca. 16 × 9,6 × 4,3 mm, RGB: 5 mm MiniClip 3-polet ca. 16,6 × 6,8 × 4,4 mm). Et klips er bredere end sin strip, så det ramte skillevæggene mellem banerne, trinnet foran hvid 1 og lysringens krave (hvid 1's klips nåede 0,3 mm ind over kraven), og så stod fronten ud.

- I begge ender af den øverste bane, fra kameraet og 21,5 mm ud (|x| 17 til 38,5), er trinnet, skillevæggene, læberne og RGB-knasterne skåret væk fra stripvæggen og 4,8 mm ind. Bunden er 1,1 mm dybere der (til RGB-klipsets bredde), og reflektorens fod er skåret lidt ned bagest.
- De første 4 mm ved kameraet er ledningsslidsen som før: ledningen går ud af klipsets ende mod kameraet og bøjer bagud gennem slidsen. Klipset ligger fra x 21 og udad.
- Lysringen har samme hak bag på sin yderste væg og krave i de samme 21,5 mm (0,6 mm dybt), så et klips ikke kan røre ringen. Ringens kant mod rammen, krave og fals er ellers uændret.
- Venstre side: hvid 1 og RGB. Højre side: hvid 2. Lommen er lige stor i begge sider, så alle tre strips kan føres fra begge ender.
- RGB-knasterne på den øverste bane er rykket ud af lommen: fra x ±30 og ±55 til ±46 og ±62.

### Broer i hjørnerne (bagramme)

- Én bro midt i hvert hjørne (ved 45°, 4 i alt): en tynd stang, 1,0 mm tyk og 1,6 mm bred, der står 0,25 mm over strippenes forside (hvid: over COB-buen, RGB: over RGB-strippen), på tværs af alle tre baner fra trinnet foran hvid 1 til bunden.
- Den er bundet til rammen fire steder: trinnet, de to skillevægge (i de mørke mellemrum mellem strippene, så intet krydser en strip) og bunden. Den er altså stiv og kan ikke knække af.
- Forfra ses kun dens ende, 1,6 × 1,0 mm, 3,7 mm bag diffuserens forside. Den er hvid som rammen.
- Den printes med rammen (bagsiden ned): en lodret søjle med 1,1 mm små broer ud til trinnet og skillevæggene, ingen support.

### Sådan sættes strippene i nu

1. Læg ledningen fra klipsets ende ind i slidsen ved kameraet, og læg klipset i lommen.
2. Læg strippen ned i sin bane langs den øverste bane, ned ad siden, og træk den **frie ende ind under broen** i hvert hjørne (frie ende først; klipsenden skal aldrig under en bro). Træk resten igennem, til strippen ligger tæt i hjørnet.
3. Ud igen: træk strippen tilbage fra klipsenden, så glider den ud under broerne uden at blive bøjet.

Hvid 1 og RGB føres fra venstre, hvid 2 fra højre, som før. RGB-strippens forlængerledning og dens stik bag på rammen kommer i en senere version (stiktypen og længderne venter på Esben).

### Hvad skal printes nyt

**Bagrammen** og **lysringen**. Hurtigsættet `halo-gen2-v45-hurtig` har de to ændringer på plade 1: `klipslomme` (front, lysring og bagramme ved kameraet i venstre side) og `lyskanal` (lysstakken nederst til venstre, nu med broen i hjørnet).

Front og bagramme skal senere printes i ASA, fordi PLA blev blødt af varmen (Esben 4. nov.). Indtil spolerne og 3MF-indstillingerne er skiftet, er alle 3MF'er stadig PLA (lysringen klar PETG).

## Hvad var nyt i v43: mikrofontænderne, strømstikkets kanal og sikringsholderen

Kun tre ting i **skallen** er ændret, efter Esbens hurtigprint 4. nov. Alle andre dele er de samme som i v42 (samme STL'er og 3MF-indstillinger).

### Mikrofonkernens tænder (skallen)

*"De tænder, du har lavet for den, de passer egentlig fint nok på den og holder fint på den. De er bare lige en tand for tynde, så de knækker for den, når man sætter dem ned."*

- **Selve tanden er uændret**, så pasformen er den samme: 6 mm bred, går 0,45 mm ind over printets kant, 0,2 mm over printets top, samme skrå top og samme sted midt på hver kort ende.
- **Tungen under tanden er stærkere:** 10 mm bred (v40–v42: 6 mm), 1,2 mm tyk ved roden og tilspidset bagpå op til de 0,8 mm ved tanden (siden ind mod kortet er lige som før), og en 0,5 mm affasning på begge sider af roden, hvor den knækkede (før var der et skarpt hjørne).
- Lommen i bagvæggen er 2,0 mm dyb (v40–v42: 1,5; der er stadig 1,0 mm bagvæg tilbage), så tungen er 8,6 mm lang i stedet for 8,1. Roden er ca. 3,7 gange så stærk, og tøjningen, når tungen bøjer de 0,6 mm ud, er næsten den samme som før (ca. 1,2 % mod 1,1 %), fordi den er længere og tilspidset.
- Tryk kortet lige ned over pindene; vip det ikke ind under den ene tand først.

### Kanalen til strømforsyningens stik (skallen)

*"Kanalen, som strømstikket udefra skal op i, den er måske lige en millimeter i diameter for tynd. Så stikket det har svært ved at komme op."*

- Hullet nedefra er **Ø11,8** (v40–v42: Ø10,8), stadig med den flade top 0,5 mm over cirklen og affasningen i bunden. Der er nu 0,8 mm luft om stikkets greb (Ø10,15) hele vejen rundt.
- Intet andet ved strømindgangen er ændret: bøjlen over hunstikket og foden om hullet er som v40. Foden var tegnet efter det gamle Ø12,5-hul, så der er stadig væg rundt om, og stativbeslagets slids til stikket er 16 mm bred, så det går fri.

### Sikringsholderens åbninger i enderne (skallen)

*"Udgangen i hver ende af sikringsholderen er blevet for smalle og snævre, så sikringsholderen kan ikke komme derned i."* Du målte ledningsstudsene til ca. 8 mm i begge ender, "måske 7,5".

- Slidserne i begge endevægge er **7,5 mm brede** (v40–v42: 5,6; v36–v39: 9), så de klemmer 0,25 mm på hver side af studsen. Affasningen øverst i slidserne følger med.
- Lommen (13,38 mm uden luft) og knusribberne (0,5 i siderne, 0,4 i enderne) er som v40.

### Hvad skal printes nyt

Kun **skallen**. Front, lysring, bagramme, blæserhegn, vægbeslag, stativbeslag og temadele er de samme som i v42. Hurtigsættet `halo-gen2-v43-hurtig` havde kun de tre ændringer på plade 1 (mikrofonkernens holder, strømindgangen og sikringsholderen).

## Hvad var nyt i v42: ingen samling på tværs af lysringen

Esben 3. nov. (foto af den klare lysring): *"Det er den begyndt på ja, det samme den gjorde i bunden af skallen. Den laver samlinger"*, og det var der ikke i de tidlige versioner.

- **Årsagen er indstillingerne i 3MF'en, ikke tegningen.** Lysringens mesh er ét lukket legeme uden samlinger (tjekket), præcis som i v30 og v18. Men siden v26 har lysringens 3MF haft søm *"Back"* med scarf og **koncentriske baner** i alle lag. Hver bane og hver væg starter og slutter så samme sted bagud på pladen, lag efter lag, og i det klare materiale ses det som én streg på tværs af lysfladen og op over kanten. Det er det samme, der gav stregen under skallen og fronten, som v36 fjernede ved at skifte dem til *"Aligned"* (punkt 17 under v36). Lysringen, stativbeslaget og temadelene blev dengang ikke skiftet.
- **v42:** lysringen har nu Bambus egne baner (*Monotonic line* i forsiden, som i v18, som ikke havde stregen) og søm *"Aligned"* uden scarf. Stativbeslaget og temadelene har også *"Aligned"* uden scarf. Ingen del bruger *"Back"* længere. Alt andet (lag 0,16, 3 vægge, 100 % fyld, elefantfod 0,15, tekstureret PEI, ingen support) er som i v41.
- **Hold øje med:** *"Aligned"* lægger stadig sømmen ét sted pr. lag, men i et hjørne eller en kant af ringen i stedet for midt på en lige side. Banerne i forsiden går nu i én retning; se efter, om lyset gennem ringen får svage striber på langs, når den er tændt. Gør den det, så sig til.
- Har du allerede et print fra v41-filen: stregen kan ikke slibes væk i den klare ring uden at gøre den mat. Print lysringen igen fra `halo-gen2-v56_lysring.3mf`.

## Hvad var nyt i v41: klikket og skruehovederne

Esben 2. nov.: (1) klikket mellem front og skal går ikke helt i hak, så fronten kommer ikke langt nok ned i skallen; (2) forsænkningerne til skruehovederne ved låsene og de 4 samleskruer bagpå skal være dybere, så skruen er skjult og ikke bare flugter. v41 retter **kun de to ting**. Ændrede dele: **front** (klikkanten) og **skal** (forsænkningerne). Bagramme, lysring, vægbeslag, stativbeslag, blæserhegn og temadele er de samme som i v40; vægbeslag og stativbeslag er tjekket mod den nye skal.

### Klikket mellem front og skal (fronten)

- **Hvorfor det ikke gik i hak:** klikkantens holdeflade (45°) lå kun 0,05 mm fra rillens 45°-flade, når fronten sad helt inde. Et 45°-udhæng printer aldrig helt så skarpt, så den mindste smule ekstra plast på kanten eller i rillen fik kanten til at stå på rillens forkant, før fronten nåede helt ned mod skallen.
- **Nu:** klikkanten sidder **0,3 mm længere inde på tungen** (fra 7,4 til 7,7 mm bag frontens forkant), alle 8 steder (2 på hver lange side, 2 i top og 2 i bund). Der er nu 0,35 mm luft foran holdefladen, så kanten falder ned i rillen, selv om den er printet lidt fed. Anslaget er stadig fladerne mellem front og skal (ingen fuge).
- **Til gengæld** kan fronten trækkes 0,35 mm ud, før klikket tager fat. De 4 frontskruer trækker den helt ind igen.
- **Rillen i skallen er uændret.** Kantens skrå forside (30°) ender stadig inde i rillen. Tjekket i CAD-snit: kanten går 0,35 mm ind i rillen på siderne og 0,2 mm i top og bund, ingen berøring.

### Dybere forsænkninger til skruehovederne (skallen)

- **De 4 samleskruer bagpå** (4,0 × 50 T20): hovedet ligger nu **2 mm under bagsiden** i et Ø8,2-hul med 90° forsænkning i bunden (v27–v40: plant med bagsiden). Spidsen går 2 mm længere ind i frontens tårn (9 mm gevind i stedet for 7), og frontens forborede hul følger med. Det er stadig de samme skruer.
- **De 2 sikkerhedsskruer ved låsene** (Bolte 88115, ST4,2 × 25): hovedets flade ligger nu **3 mm oppe i bunden** i et Ø8,6-hul (v24–v40: 0,3 mm). Bunden krummer opad ud mod hjørnerne dér, så i v40 stak hovedet op til 2 mm ud på ydersiden. Nu ligger hele hovedet mindst 0,6 mm inde (2,8 mm på indersiden). Forsænkningen er skåret ind i bundknasten, så der stadig er 2,9 mm knast over den. Skruen går 2,7 mm længere op i tungen (til 28,3; hullet i tungen går til 31,6), så vægbeslag og stativbeslag er uændrede.
- Du skal bruge en bit, der kan nå 2–3 mm ned i hullet (en almindelig T20-bit kan).

## Hvad var nyt i v40: holderne efter hurtigprintet af v38

Esben 2. nov. testede hurtigsættet til v38 og målte delene. v40 retter **kun de fire holdere, han nævnte**, plus sikringsholderen. Alt andet er som i v39 (v38's dele). Kun **skallen** og **Wago-rækken til eftermontering** er ændret; front, bagramme, lysring, vægbeslag, stativbeslag, blæserhegn og temadele er de samme som i v39.

### Wago-rækken (skallen)

"Alt for meget slack ... ca. 1 mm bag Wago-klemmen ... tænderne er alt for høje ... de er for svage ... de klemmer heller ikke nok i siderne." Esben målte 221-415 til 29,6 × 18,0 (18,2 med grebet) × 8,0 mm, 221-413 til 18,6 bred, indgangshullet til 4,8 × 3,9 mm med en 0,5 mm kant i bunden.

- **Lommerne efter målene:** 18,6 og 29,6 brede (v29–v39: 18,8 og 30,0). Rækken er derfor 1,8 mm kortere; midterne flytter højst 0,8 mm.
- **Tænderne er 0,8 mm tykkere** og tager millimeteren bag klemmen: klemmen er 18,0 lang mellem tandens forside og endevæggen.
- **Skrå "dragetænder" med bred fod:** hver tand har en 3,4 mm lang fod på bunden, der skråner op til klemmens forside, og er 3,6 mm bred (v36–v39: 1,6 bred, 1,4 tyk). Næsen går **1,2 mm op over hullets 0,5 mm kant og 2 mm ind** i hullet. Toppen står 1,7 mm over bunden, så der er 2,2 mm fri over den til ledningen. Undersiden er 45° den første halve millimeter, så næsen printes uden at hænge.
- **Knusribber, der klemmer:** 2 lodrette ribber på hver side af hver lomme, der står 0,5 mm ind (v36–v39: 0,1). Klemmens sider har en kant hele vejen rundt og er 0,2 mm dybere inden for den, så ribben trykker 0,3 på kanten og 0,5 i fordybningen. Ribberne starter 1 mm over bunden og har en skrå top, så klemmen kan trykkes ned over dem. Endevæggen har 2 ribber pr. lomme, 0,25 mm.
- **En lille kant over bagenden:** i hvert af lommens to bageste hjørner står en 3 mm bred stolpe med en kant, der går 0,6 mm ind over klemmens bagende (0,2 mm over dens top), med skrå top. Den sidder over husets sidevæg, uden for grebene, så grebene kan åbnes.
- **Sådan sættes klemmen i:** ledningsindgangene først ind over tænderne, så læg bagenden ned, til den klikker under de to små kanter.

### Mikrofonkernen (XVF3800)

"Det passer egentlig super fint, men det kan ikke helt holde mikrofonpladen på plads." Siden v36 holdt kun pindene printet.

- Siderne er **1 mm højere** (udskæringerne til USB-C, AUX og fladkablet er som før).
- **En fjedrende tand midt på hver kort ende**, hvor du siger, der ikke er stik: en 6 mm bred, 0,8 mm tyk tunge, skåret fri af endevæggen og bunden med 0,8 mm på hver side. Den står i en 1,5 mm dyb lomme i bagvæggen, så den er 8 mm lang og kan bøje ud uden at knække (ca. 1 % tøjning). Tanden går 0,45 mm ind over printets kant, 0,2 mm over printets top, med skrå top. Tungen bøjer ud, når kortet trykkes ned over pindene, og klikker over kanten.
- Seeeds tegning har stiftlisten i venstre ende og XIAO'ens USB-C i højre ende midt for. Sidder de på dit kort, rammer tanden dem; så sig til, og tanden flyttes til en fri plads på enden.

### Strømindgangen

"Den har dog lidt slack, så den kan godt gå ca. 1 mm op og ned ... Ellers er den nem at få i og passer godt."

- **Bøjlen over hunstikkets skrueklemme sidder 0,9 mm lavere**, så stikket står uden slør mellem bunden og bøjlen. Bøjlens forkant har en 0,6 mm affasning, så stikket stadig glider ind forfra.
- Resten af kanalen er som i v37.

### Den dråbeformede kanal til strømforsyningens stik

"Hvis man kunne gøre dråben lidt mindre, så det ville være nemmere at ramme stikket, når man kører hanstikket op."

- Hullet nedefra er **Ø10,8** (v11–v39: Ø12,5), 0,3 mm luft om stikkets greb (Ø10,15), og dråbens spids er **skåret flad 0,5 mm over cirklen**, så stikket ikke kan glide 3,7 mm ud i spidsen. Den flade top er 3,6 mm bred og bygger bro, når skallen printes på ryggen. Affasningen i bunden er som før (0,8 mm).
- Foden om hullet er som i v37.

### Sikringsholderen

Esben 2. nov.: "Sidder slet ikke fast ... alt for meget slack ... i alle sider ... også i de to åbninger i hver ende ... Den er jo blød plast, så der kan vi godt klemme."

- **Ingen luft** om holderen (v36–v39: 0,15 pr. side), og **2 knusribber på hver af de 4 vægge**: 0,5 mm på de lange vægge, 0,4 på enderne (før kun på de lange, 0,1 ind). Ribberne har skrå top.
- **Slidserne til ledningstylerne er 5,6 mm** (v36–v39: 9), så de klemmer om tylerne (ca. Ø6,5 på billedet), med affasning foroven.

### Tjekket

- Fit-tjek i CAD (`tools/check_fit_gen2.py`): ingen kollisioner ud over de tilsigtede (tænder i Wago-indgangene, ribber mod klemmerne, sikringen og mikrofonkernen).
- Samling: Wago-klemmen sættes ind skråt og lægges ned forfra, hunstikket skubbes ind forfra og PSU-stikket op nedefra som før, mikrofonkernen trykkes lige ned. Ingen af de nye stolper, tunger eller ribber står i vejen for et andet stik eller en ledning.
- Skallen er én krop, og 3MF'en har support kun de samme 2 steder som før.
- **Stativbeslaget** er med i pakken som altid (uændret, v9 med gevindindsats), tjekket mod v40-skallen.
- **Hurtigsæt:** `halo-gen2-v40-hurtig`, plade 1 er kun de 4 ændrede steder (Wago, sikring, mikrofonkerne, strømindgang).

## Hvad var nyt i v39: Pi-benene i tegningerne

Esben 1. nov.: "Hvorfor er pins på pi ikke med i ledningsdiagram så man kan se hvor controller pins skal sidde". Indtil nu stod benumrene kun som tekst i en boks. Nu er Pi 5's stik tegnet **ben for ben, som vi satte det 26.-27. okt.** efter Esbens billede af den samlede boks: Pi'en med USB-portene opad, GPIO-stikket i venstre side, ben 1 og 2 nederst (enden længst væk fra USB), lige ben yderst. Kun de 5 ben, der bruges, er mærket. Tegningen er i `halo-gen2-v56_ledningsdiagram.png` (til højre), i `halo-gen2-v56_ledningsplan.png` (til højre) og alene i `halo-gen2-v56_pi-ben.png`.

| Ben | Pi | Kabel | Til |
|---|---|---|---|
| 1 | 3V3 | G1 | dæmper DFR0457, VCC (rød) |
| 12 | GPIO18 | G1 | dæmper, signal (grøn) |
| 14 | GND | G1 | dæmper, GND (sort) |
| 2 | 5V | G4 | skærm + (rød) |
| 6 | GND | G4 | skærm − (sort) |

- Det er de samme ben som i den midlertidige ledningstegning 26. okt. og i diagrammet siden v27. Boksens software bruger GPIO18 (ben 12) til lyset.
- **RGB-styringen (Gledopto) bruger ingen Pi-ben.** Den får USB-kablet (U1). "GPIO16" på den er dens eget ben, hvor strippens data-ledning (S3) går i.
- Reed (G2) og stødsensor (G3) er tilvalg og er ikke tegnet på stikket; softwaren læser dem ikke endnu.
- Ledningsdiagrammet tegner nu også W3 med 5 klemmer (221-415, v37).

## Hvad var nyt i v38: klik i top og bund

Esben 1. nov.: "Hvorfor har du ikke lavet så kassen klikker sammen med front i top og bund?" I v37 sad klikket kun i de to lange sider (2 pr. side ved 95 og 215 mm). Det var mit valg, fordi siderne er de længste lige vægge og giver mest efter, men der var ikke noget, der forhindrede klik i top og bund. Nu er der **2 i toppen og 2 i bunden** også, 8 i alt.

- De sidder ved **x ±50** (35–65 mm fra midten). Foroven er frontens tunge skåret væk midt for ved kameraet, og skruerne sidder i hjørnerne, så det er de frie stykker.
- Samme form som i siderne: skrå indløbsside på 30°, holdeside på 45°, så fronten stadig kan trækkes af med hånden uden værktøj.
- Kanten er lidt lavere i top og bund (0,45 mm mod 0,6 i siderne), fordi top og bund er ca. 4 gange stivere end siderne (139 mod 221 mm lige væg). Så føles klikket nogenlunde ens hele vejen rundt og bliver ikke for hårdt at åbne.
- Når fronten sidder, rører kanterne ikke rillernes bund, så intet står i spænd.
- Tjekket i CAD mod v37: kanten ligger i rillen uden overlap, ingen nye kollisioner, skal og front er hver én krop. Rillerne og kanterne printes uden support som i v37.

## Hvad var nyt i v37: holdbarhed, gevindindsats, fokus, klik og velcroløkkerne tilbage

### Stativbeslaget har en gevindindsats (stativbeslag v9)

Stål-T-møtrikken er væk. I stedet sidder en **gevindindsats af messing, 1/4"-20 UNC, 12,7 mm lang**, i hylden under boksen, og det er den, kuglehovedets lynplade skrues i.

- **Køb:** CNC Kitchen *Threaded Inserts 1/4"-20 x 12,7 mm (20 stk.)*, hos Lab3D (shop.lab3d.dk, *Threaded inserts 1/4" 20 pcs*, 85 kr.) eller 3DJake. 3D Eksperten fører kun M3–M6, ikke 1/4". Indsatsen er Ø8,7 med riller, hullet i beslaget er Ø8,1 og 13,2 mm dybt. **Tjek ved købet, at det er 12,7 mm-udgaven** (den korte på 6,4 mm er for svag).
- **Sæt den i:** vend beslaget, så hyldens underside (med hullet) vender opad. Sæt indsatsen lige i hullet med den smalle ende nedad, og tryk den ned med loddekolben ved ca. 220 °C (en spids til indsatser er bedst, fx 3DSUPREME Heatset Insert Tips fra 3D Eksperten). Lad kolben gøre arbejdet, og pres ikke. Stop, når indsatsen flugter med hyldens underside, og hold den lige med en kold flad ting, mens plasten størkner (10 s). Den må ikke stikke ud: lynpladen skal ligge på hele hylden.
- **Meget stabilt:** 3MF'en har en modifier, så hele hylden og bunden af ryggen printes **massivt med 6 vægge og 100 % fyld**. Indsatsen sidder i 12,7 mm massiv plast hele vejen rundt (CNC Kitchen kræver mindst 3,3 mm; her er der 6 til forkanten og 16 til siderne). Før sad T-møtrikkens flange under 1 mm plast.
- Hullet ligger på pladen under print, så det er en dråbeform med toppen skåret af 0,4 mm over cirklen. Indsatsen griber hele vejen rundt undtagen i den lille spids.

### Hjørnerne er forstærket (skal og front)

Et fald lander på et hjørne. **Skallens og frontens 3MF har nu en modifier i hvert af de 4 hjørner** (35 × 35 mm, hele højden) med 4 vægge og 40 % fyld, så de 3 mm vægge printes massive dér. Resten er som før (2 vægge, 15 %). Du skal ikke gøre noget: det ligger i 3MF'erne. I Bambu Studio ses de som 4 gennemsigtige kasser under objektet.

### Mere luft om kameraets linse

Fokustesten 31. okt. viste, at autofokus stillede skarpt på et ansigt ved linsestilling ca. 10 (før skallen 1,5–2), og at intet skete fra 0 til 6. Linsen, som fokusmotoren flytter, blev altså stadig holdt lidt tilbage.

- Kun den yderste **1,0 mm** af frontpladen har stadig Ø8,6-hullet (så hullet forfra ser ud som før, og linsens spids står 0,15 mm bag kanten). Bag den er hullet **Ø10**, så der er **1,4 mm luft** rundt om linsen i stedet for 0,65.
- Bagrammens 4 rør spænder ikke længere kameraet hårdt: de slutter 0,3 mm bag kortet, og 3 små knusspidser på hvert rør trykker det let mod tappene. Så kan printets tolerance ikke bøje kortet og fokusmodulet.
- **Tjek bagefter:** kør fokustesten igen. Et ansigt på ca. 1 m skal give en linsestilling omkring 1–2.

### Fronten klikker i skallen

Esben 1. nov.: boksen skal kunne holde sig selv samlet uden skruer under test. **Frontens tunge har en lille kant på hver lang side** (2 pr. side, 30 mm lange, ved 95 og 215 mm oppe; v38: også 2 i top og 2 i bund), og **skallens væg har en rille** til hver.

- **Saml:** tryk fronten lige ind i skallen, til den klikker. Kanten glider ind over en skrå side på 30°.
- **Åbn:** træk fronten lige ud, fx med fingrene i bunden og et jævnt træk. Den side, der holder, er 45°, så den kan trækkes af uden værktøj, og væggene bøjer kun 0,35 mm.
- Når den sidder, rører kanten ikke rillens bund, så intet står i spænd, mens boksen hænger.
- **De 4 frontskruer skal stadig i**, før boksen bruges ude (klikket er kun til test og til at holde fronten på plads, mens du skruer).

### Strømindgangen efter de rigtige mål

Esben målte hunstikket 1. nov. (Delock med 2 skrueklemmer): spids af metal Ø6,97 × 2,3, en rund hals (ca. Ø10,7 × 9,7), riflet overgang (op til 13,8 bred), firkantet hus **14,00 × 11,92**, skrueklemme **10,00 bred × 5,56**, **38 mm** i alt. Strømforsyningens hanstik er Ø10,15 på det tykkeste.

- v36 havde gættet en Ø10,8 × 10 hals og to hylder under huset med 11,7 mm imellem. De rigtige rifler er 13,8 brede, så stikket ville sætte sig på hylderne med riflerne, 3,5 mm lavere end tegnet, halvt under læberne og 3,8 mm fra stopbøjlen.
- Nu **står stikket på halsens flade underside** på en 2 mm bund. Metalspidsen sidder i en slids gennem bunden, der er **åben fremad**, så stikket stadig skubbes ind forfra uden at skulle løftes over noget. Strømforsyningens stik kommer op gennem Ø12,5-hullet nedefra til bunden.
- Læberne holder det firkantede hus (z 60–69), og bøjlen over skrueklemmen stopper stikket, når strømforsyningens stik trykkes ind nedefra.
- En ribbe bag 5 V-bakkens tand stak 1,6 mm ind i kanalen ved z 69–71. Den er skåret væk, så intet rører stikket. Tjekket: stikket kan skubbes ind forfra hele vejen uden at ramme noget.

### Kun 3- og 5-polede Wago

Esben har kun 221-413 (3 polet) og 221-415 (5 polet). **W3 (5 V +) er nu en 221-415** (v29–v36: lomme til en 221-414); den 5. indgang er fri. Rækken er 5,6 mm bredere. Køb: **3 × 221-413 og 3 × 221-415**.

### Kabelløkkerne til velcrobånd er tilbage

v36 lavede alle 15 løkker om til runde, åbne clips (12 mm på hovedbundtet). Det havde ingen bedt om, og de kan ikke bruges. **I v37 er alle løkker igen de flade broer fra v23–v35** med en fri åbning på 10 × 2 mm til en **10 mm velcrostrop** (eller en kabelbinder). De sidder samme steder som før. De to under Wago-rækken bliver i z 232 (v35: 243), så der er ca. 25 mm fri op til rækken til at føre og stramme stroppen med fingrene (samlenote 11). Trækaflastningen lige over strømstikket er den samme lille snapklemme som i v23–v36.

### Det samme som før

Lysring, vægbeslag, blæserhegn, eksempel-tema og Dominance-tema er de samme dele som i v36 (3MF'erne er lavet igen). Ledningsplanen og -diagrammet er lavet igen med W3 som 221-415.

## Hvad var nyt i v36: rettelserne efter første samling

### Skallen (samlenoter 1–7, 11–13, 16, 17)

Den fælles årsag til de fleste problemer: skallen printes med bagsiden ned, så alle tænder (læber) på holderne er vandrette udhæng på 1,6–2 mm, som synker 0,2–0,4 mm i printet. En tand, der var tegnet 0,1 mm over delen, endte i niveau med delens kant og skubbede væggen ud i stedet for at holde. Ny regel i hele skallen: **tanden sidder 0,9 mm over delens top, væggen 0,5–1 mm over tanden, og en ribbe udenpå bag hver tand**, så væggen ikke kan bøje væk.

1. **Wago-rækken:** hver klemme holdes af en lille krog, der går ind i ledningsindgangen nedefra, og klemmens bagende trykker mod endevæggen. Ingen klemribber i siderne mere. Krogen fylder kun den nederste del af indgangen, så den afisolerede ledning stadig går ind over den.
2. **Mikrofonkernen (XVF3800):** udskæringer i begge lange vægge ud for USB-C, AUX og fladkablet, så stikkene kan sættes i, mens kortet ligger i holderen. Ingen tænder; kortet holdes af væggene og pindene. **Stødsensoren (IMU)** er flyttet til højre for 5 V-forsyningen (x 80–98, z 135–160), hvor den før sad 3 mm over mikrofonkernens stik.
3. **Dæmperen (DFR0457):** en ny holder til selve printkortet (44 × 32 × 1,6), ikke til den højeste komponent. Kortet ligger på 4 puder (benene under det går fri), 2 pinde går gennem to af hullerne, og væggene står 0,3 mm + en 1,6 mm rampe over kortet med én kort tand pr. side. Før stod væggene 15 mm over kortet og rørte ingenting.
4. **5 V-forsyningen:** tænderne 0,9 mm over forsyningens top, ribber bag hver tand. Væggene er kun fuld højde ved tænderne og ellers 0,5 mm over forsyningen. Tænderne sidder nu ved z 27–111, så blæserhegnet går 2,2 mm fri af bakkens øverste ende (var 1,4).
5. **Ledninger:** Biltema har ikke 1,0 mm². Brug **RKUB 1,5 mm²** (rød 2000049852, sort 2000049851, 10 m) til hele 24 V- og 5 V-delen (P1–P8). 0,75 mm² som før til dæmper og RGB-styring.
6. **Strømindgangen:** dit hunstik med skrueklemmer (ca. 14,25 × 11,9, 38 mm højt) sidder nu i en **åben U-kanal, der er åben fremad**. Skru ledningerne i stikket først, sæt stikket ind i kanalen forfra med åbningen nedad, til det står på hylderne, og det holdes af læberne i kanalens forkant. Ingen snaplåse ovenfra mere. Trækaflastningen er flyttet op (z 92–98) og er nu Ø6,4 til 2 × 1,5 mm², så den ikke spærrer for stikket.
7. **RGB-styringen (Gledopto):** vægge 2,4 mm tykke, tænderne 0,9 mm over låget, ribbe bag hver tand.
11. **Kabelløkkerne** blev lavet om til **åbne clips** (fjernet igen i v37, se øverst). Løkkerne under Wago-rækken er flyttet ned til z 232, så der er plads til fingrene.
12. **Hakkene i bagsiden** er rillerne til tema-vingernes tap. Nu er der en lomme under rillen, og vingernes tap har en lille tå, der går ned i den, så vingen ikke kan vippe ud forneden. (Eksempel-vingerne i pakken har tåen.)
13. **Sikringsholderen** har fået sin egen holder på højre væg ved bagvæggen (x 92–106, z 52–86) med låget fremad, så sikringen kan skiftes, når fronten er af. Ledningen er delt i **P1** (hunstik + → sikringens nederste ledning) og **P1b** (sikringens øverste ledning → W1). Se ledningsplanen.
16. **Ingen nye skruer** (Esben 31. okt.: dropper de ekstra skruer). Fronten holdes som før af de 4 frontskruer.
17. **Sømmen:** skal og front har nu Bambus standard "aligned" søm i stedet for "back" + scarf, så sømmen ligger samlet på ét sted i stedet for at vandre over siden.

### Lysringen og fronten ved kameraet

- Lysringen har fået **v18-profilen igen med 45° krave** og støttekanter, og den **printes uden support** og med kun én filament (klar), som i v18. 3MF'en har et tjek for flade udhæng.
- Fronten har et 45° sæde til kraven. Den sorte kant ved kameraet er 7,1 mm bredere i hver side (CAM_END 23,85), og **skjulepladerne ved kameraet er væk**.
- Ringens ender går nu ud til x ±17 i begge ender. **Læg ringen lige ned bagfra**; enderne skal ikke lirkes ind.
- Hjørnetårnene i fronten går fri af ringens støttekant.

### Bagrammen og blæserhegnet

- Plads til RGB-strippen, åbne **ledningsslidser i enderne** (i stedet for Ø4-hullerne) og riller til en strop rundt om tværstykkerne.
- **Strippene skal være ca. 17 mm længere** (banen er ca. 892 mm mod 875): **RGB skæres til ca. 887,5 mm** (ved 12,5 mm-mærket). Den hvide 24156 kan kun skæres hver 5. cm, så den forbliver **850 mm**, og der er ca. 40 mm uden lys i den ende, der ikke fødes. Ledningerne loddes på, ingen klikstik.
- Samling af strips: læg ledningen i endeslidsen forfra, tryk enden ned og skub resten på plads. **RGB først** (bunden), så hvid 2, så hvid 1.
- K1, K2 og Pi-strømmen: strips eller 10 mm velcro rundt om tværstykket i rillen, ned foran tværstykket i sprækken mod skærmen.
- Blæserhegnet er ca. 125 mm langt og dækker hele Active Cooleren; risten går ned til 3 mm over USB-stikkene.

### Stativbeslaget er med i pakken

`halo-gen2-v56_stativbeslag.stl` med logo-indlæg og `halo-gen2-v56_stativbeslag_flerfarvet.3mf` (sort, hvid, grøn på AMS-plads 1/2/3, tekstureret plade). Det er selfi-stativbeslag-v7 med to arme, der låser temadelene (se nedenfor; svarer til stativbeslag v8), tjekket mod v36-skallen: tungerne sidder i låselommerne uden overlap, stikkets slids i hylden går fri af stikket, og der er 3,9 mm til tema-toppens stropper. Fra nu af er stativbeslaget med i hver version.

### Airtox Dominance: temaets testkit (fast i pakken)

Esben 31. okt.: Dominance er vores faste test af temaer og ligger i hver printpakke herfra. Det skal holde både på væggen (B2B) og på gulvstativet (B2C).

- **Dele:** en top (289 × 92 mm, halv ottekant med ligaens logo) og to stolper (32 mm brede, orange hætte, AIRTOX DOMINANCE op ad stolpen). De hænger i de samme kroge og den samme rille som eksempel-temaet.
- **Farver:** Selfi sort (samme filament som boksen), logoets orange-røde (#ee3e15) og hvid. Farverne er 0,8 mm indlæg i forsiden, og hver del er én 3MF med tre farver: **AMS 1 sort, 2 hvid, 3 orange**. Glat plade, forsiden ned, tree-support kun under stropperne (som tema-eksemplet).
- **Toppen ligger på tværs** af pladen (de 289 mm langs pladens 320 mm), så den kan printes i ét stykke.
- **Rækkefølge:** sæt top og stolper på, før boksen hænges op (på væg eller stativ): løft 3 mm, skub ind, slip.
- **Logoet** er sporet fra ligaens eget materiale. Få de officielle filer og tilladelse fra ADFC og Airtox, før en boks med logoet bruges ude.

### Temaerne sidder fast på gulvstativet

Uden væg bag boksen kunne et tema før løftes af krogene bagfra. Nu har **stativbeslaget (v8) en arm på hver side** af logopanelet, og alle temadeles stropper er 2 mm tyndere netop dér, så armen ligger 0,4 mm bag dem, ligesom væggen gør. Krogene kan derfor ikke komme fri, mens boksen sidder på stativet. På væggen er der som før 0,4 mm til væggen. Eksempel-temaet har fået de samme tynde stropper.

## Hvad var nyt i v35: lysringens krave printes på support

Kasper 30. okt.: lysringen går fint, indtil den skal lave de sidste kanter. Så rammer den ikke kanten og printer ved siden af, og de sidste ca. 25 minutter går galt hver gang.

**Årsagen:** ringen printes med lysfladen ned. Øverst på de to vægge sidder **kraven**, som ligger på frontpladens bagside, når ringen er samlet. Kraven er de sidste 1 mm af printet (6 lag à 0,16 mm), og den stikker **2,25 mm ud over væggen på begge sider**, helt vandret og uden noget under. De yderste baner i kravens første lag blev derfor lagt i luften: de hang ned, blev slæbt med af dysen og lå ved siden af, og lagene ovenpå havde ikke noget at stå på. Guiden sagde, at kraven kun hang 1,25 mm ud. Det var forkert: i v20 blev lyskanalen 1 mm bredere på hver side, og kraven fulgte med kanalen, uden at nogen opdagede, at den nu hang 2,25 mm ud. Ingen indstilling kan printe en 2,25 mm vandret kant i luften pænt.

**Hvad er ændret** (kun i `halo-gen2-v35_lysring.3mf` og guiden; alle STL'er, mål og samling er som i v31–v34, og alle andre 3MF'er er som i v34):
- **Support under kraven, kun dér.** Filen har en *support enforcer* fra lige under kraven og op, og support er sat til *Normal (manual)* på *build plate only*, så sliceren kun laver support under kraven, ikke under lysfladens kant eller andre steder. Supporten står på pladen inde i ringen og uden om den, 0,35 mm fra væggen.
- **Mellemlaget er hvid PLA (plads 2).** Ringen er klar PETG på plads 1. De 2 øverste lag af supporten, dem kraven ligger på, printes massivt i **hvid PLA** uden mellemrum. PLA hæfter ikke på PETG, så supporten kan trækkes af helt rent, og undersiden af kraven bliver plan. Resten af supporten er PETG, så der kun skiftes materiale i de få lag med mellemlaget. Undersiden af kraven ligger mod frontpladen inde i boksen og ses ikke.
- Filen har nu 2 materialer og et **prime tower** til højre for ringen, ligesom fronten.
- Uændret: lysfladen (1 mm, koncentriske baner), 0,16 mm lag, 3 vægge, 100 % fyld, elefantfod 0,15, tekstureret PEI.

Printtiden bliver lidt længere end før (supporten og nogle få materialeskift). Bambu Studio viser den rigtige tid.

**Det skal gøres (Kasper):**
1. Åbn `halo-gen2-v35_lysring.3mf` med **"Open as project"**. Tjek, at **plads 1 er den klare PETG** og **plads 2 er hvid PLA** (begge kan sidde i AMS'en; H2C'en lægger dem selv på hver sin dyse).
2. Slice, og se i forhåndsvisningen, at der er support under kraven hele vejen rundt på begge sider, og at mellemlaget øverst er hvidt.
3. Når printet er færdigt og pladen er kølet af, **træk supporten af** langs ringen. Den hvide PLA slipper af sig selv; skrab eventuelle rester af med en neglefil eller kniv, så kraven ligger plant på frontpladen.
4. En ring printet efter v34 eller før, hvor kraven er blevet grim, kan stadig bruges, hvis kraven ligger plant og hel hele vejen rundt. Ellers print den om med v35.

## Hvad var nyt i v34: ingen spaghetti og ingen tilstopning til sidst

Esben 28. okt.: skallen gik galt ca. 2 timer inde, bagrammen "choker på det sidste stykke", blæserhegnet og de andre dele fejlede hen mod slutningen, og der var tråde (spaghetti) og klumper på dysen på næsten alle print. **Alt printes i PLA, kun diffuseren (lysringen) i et klart materiale.**

**Årsagen:** 3MF'erne fra v31–v33 valgte filamentprofilen *Bambu ASA @BBL H2C* på hver plads, og guiden sagde 260 °C, 100 °C plade og 60 °C kammer. Den profil er lavet til ASA: **270 °C dyse, 100 °C plade, 10–35 % køling og kammeret varmet op til 65 °C** (H2C'ens start-G-kode varmer kammeret og slukker kammer- og hjælpeblæserne, når profilen beder om det, og den slår tilstopningsvagten fra, som kun kører med PLA- og PETG-profiler). PLA bliver blødt ved ca. 55–60 °C. Når kammeret er varmt, bliver PLA'en blød allerede i ekstruderen, før den når dysen (*heat creep*). Det bliver værre, jo længere printet kører og jo varmere kammeret bliver, og derfor gik det galt **hen mod slutningen**: ekstruderen skubber for lidt plast, lagene bliver tynde og løse, dysen trækker i dem og samler en klump, og printet slipper og bliver til spaghetti. 270 °C i PLA giver samtidig tynd, rindende plast, der trækker tråde over alle huller. Bambus egen wiki om heat creep siger, at kammeret skal være mindst 10 °C under filamentets blødgøringspunkt; her var det 5–10 °C over.

**Hvad er ændret** (kun i 3MF-filerne og guiden; alle STL'er, mål og samling er som v31–v33):
- **Filamentprofilen er det materiale, der faktisk sidder i printeren:** *Bambu PLA Basic @BBL H2C* på alle pladser (220 °C, plade 55 °C, ingen kammervarme, køling 60–80 %, H2C'ens automatiske kammerkøling og tilstopningsvagt), og *Bambu PETG Translucent @BBL H2C 0.4 nozzle* til lysringen (245 °C, plade 70 °C, ingen kammervarme).
- **Avoid crossing walls på alle dele.** v32–v33 slog det fra på bagramme, vægbeslag, blæserhegn og Wago-række for at spare tid, så dysen kørte hen over de store huller og trak tråde på tværs. Nu kører den rundt langs delen.
- **Fyld i hvert lag igen** (*Infill combination* fra). Fyld hvert andet lag lagde 0,4–0,56 mm tykke baner, som dysen slæbte hen over.
- **Crosshatch i stedet for grid.** Grid krydser sine egne baner i hvert lag, og dysen støder ind i krydsene. Crosshatch skifter retning lagvis og krydser aldrig sig selv i samme lag.
- **4 lag og mindst 0,8 mm på flader opad** (v33: 3 lag og *Top shell thickness* 0). 3 tynde lag over 15 % fyld hang ned mellem fyldbanerne og krøllede op, og dysen ramte dem i de sidste lag af hver del.
- Uændret: lagtykkelser, vægge, fyldprocent, frontens forside, lysringens koncentriske baner, skallens support og brim, scarf seam og pladerne.

Printtiden bliver ca. 5–10 % længere end v33 (fyld i hvert lag, et ekstra toplag og omvejene uden om hullerne). Bambu Studio viser den rigtige tid.

**Det skal gøres før næste print (Kasper):**
1. **Rens printeren efter tilstopningen.** Klumperne og den bløde PLA kan sidde tilbage: rens dysen varm med en messingbørste, og lav et *cold pull* eller Bambus "Unclog hotend"-vejledning. Se efter PLA-støv ved ekstruderens tandhjul, og blæs det ud. Klikker ekstruderen stadig, eller kommer der for lidt plast ud, så skift hotend (H2C'en har skiftbare hotends).
2. **Åbn 3MF'en med "Open as project"**, og tjek, at **hver plads står på en PLA-profil** (Bambu PLA Basic, eller jeres eget mærkes PLA-profil til H2C, fx *Generic PLA @BBL H2C*). Brug aldrig en ASA-, ABS- eller PC-profil til PLA. Synkroniserer I med AMS, er det fint, så længe der står PLA.
3. **Lysringen:** er det klare materiale ikke PETG, så vælg jeres materiales H2C-profil på plads 1 (fx *Bambu PLA Translucent @BBL H2C*, hvis det er klar PLA).
4. **Pladen:** filerne er sat til glat PEI (*High Temp Plate*) og tekstureret PEI til front og lysring. PLA og PETG hæfter fint på begge uden lim. Bruger I **Engineering Plate** (som på billedet), skal pladetypen ændres øverst i Prepare, og der skal **lim** (limstift) på, ellers slipper store dele som skallen. H2C'en tjekker pladen og siger til, hvis den ikke passer med filen.
5. **Tørt filament:** PLA 8 timer ved 55 °C, den klare PETG 8 timer ved 65 °C (fugtig PETG trækker mange tråde). Opbevar ruller i AMS'en eller en tørreboks med tørremiddel.
6. **Flow dynamics calibration** til i printvinduet. Lad kammertemperaturen stå på 0 (ingen opvarmning), og hold lågen lukket; H2C'en køler selv kammeret ved PLA. Er rummet over ca. 30 °C, så åbn lågen lidt.

**Styrken i PLA:** guidens styrketal er regnet for ASA. PLA er lidt stivere og stærkere ved stuetemperatur, men den bliver blød over ca. 55 °C og giver efter under konstant last over tid. Lad ikke boksen stå i direkte sol eller i en varm bil, og tjek vægbeslaget og stativbeslaget (de bærer boksen hele tiden), når boksen har været udlejet nogle gange.

## Hvad var nyt i v33: ingen tid på indersider

Esben 27. okt.: *"Fix det hele, så vi får noget mere fart på det hele og ikke bruger tid på at få indvendige ting og indersider flotte."* Han så også, at bagrammen i v18 tog 5,4 t mod 12 t 51 m i v31.

**Hvorfor v18 var hurtigere:** bagrammen har kun 24 % mere plast nu. v18 havde ingen 3MF, så den blev slicet med Bambus standard: 2 vægge og 15 % fyld. Fra v26 fik alle dele 4–6 vægge, 20 % gyroid og *Avoid crossing walls*, også dele, som ingen ser. Det var for meget.

**Hvad er ændret** (kun i 3MF-filerne):
- **Bambus egne 2 vægge og 15 % gitter (grid) på alle dele**, undtagen lysringen (massiv for lysets skyld) og vægbeslaget (bærer boksen: 3 vægge, 40 % gyroid). Ydervæggen, den man ser, printes som før.
- **Fyld kun hvert andet lag** (*Infill combination*). Det kan ikke ses og gør ikke delene svagere.
- **Kun 3 lukkede lag på indersider.** Bambus profil lægger ellers op til 5 lag på hver flade opad (*Top shell thickness* 1,0 mm). Alle flader opad er indersider her, så den står på 0.
- **Langsomt første lag kun der, hvor første lag er forsiden**: front, lysring og tema-dele. Skallen ligger med bagsiden mod pladen, så den bruger Bambus normale første lag.
- **Avoid crossing walls kun på dele, der ses udefra**: front, lysring, skal og tema-dele.
- **Wago-rækken: 0,28 mm** som bagrammen og vægbeslaget.
- Uændret for udseendet: 0,2 mm lag på skal, front og tema, frontens forside (*Monotonic line*, én væg i første lag, elefantfod 0,15), scarf seam bagud, skallens support og brim.

**Tid** (Bambu Studio sagde for v31: skal 26 t og bagramme 12 t 51 m; resten er beregnet ud fra vægbane, flader og øer pr. lag. Beregningen giver præcis de 5,4 t, Bambu viste for v18's bagramme):

| Del | v31 | v33 | Sparet i forhold til v31 |
|---|---|---|---|
| Skal | 26 t (Bambu) | ca. 12–14 t | ca. 47 % |
| Bagramme | 12 t 51 m (Bambu) | ca. 4½–6 t | ca. 52 % |
| Vægbeslag | | | ca. 55 % |
| Blæserhegn | | | ca. 50 % |
| Wago-række | | | ca. 65 % |
| Tema-dele | | | ca. 40 % |
| Front | | | ca. 15 % (den er næsten massiv) |
| Lysring | | | uændret |

Bambu Studio viser den rigtige tid, når pladen er slicet.

Stativbeslaget er nu **selfi-stativbeslag-v6**: 3 vægge og 30 % gyroid i stedet for 5 vægge og 40 % (ca. 25 % hurtigere). Det bærer stadig hele boksen. Printerens kappe og udgang (selfi-printer-v5) er ikke ændret: deres 3,2 mm paneler er massive under alle omstændigheder, så færre vægge sparer højst 2 %.

## Hvad var nyt i v32: hurtigere print, samme udseende udenpå

Esben 27. okt.: *"Skallen tager 26 timer, altså hvad sker der? Gennemgå samtlige filer og forbedre hvad du kan. Udseende er høj prioritet, men ikke inden i kassen."*

**Hvor tiden gik:** næsten kun til **vægge**. Alle dele blev skåret i lag og regnet igennem. Skallen havde 0,16 mm lag (400 lag) med 5 vægge rundt om alt, også de mange ting inde i kassen: bakker, rør, kabelløkker og ribber. Det er op til 24 separate øer pr. lag og ca. 4,2 km vægbane. Bagrammen havde 4 vægge rundt om ca. 24 små øer pr. lag (reflektor, læber, rør, klikarme, knopper), ca. 2,2 km. Fyldet betyder næsten intet, for de fleste vægge er tyndere end 4 baner.

**Hvad er ændret** (kun i 3MF-filerne):
- **3 vægge i stedet for 4–6 på alle dele.** 3 baner er 1,26 mm. Boksens sidevægge er 3 mm, så de er stadig massive, med 3 baner fra hver side. Ydervæggen, den man ser, printes præcis som før.
- **Skallen: 0,2 mm lag i stedet for 0,16**, ligesom fronten og tema-delene, så siderne får samme linjer hele vejen rundt. Kun 3 lukkede lag forneden (bagsiden, der vender mod væggen) og foroven (indersiden).
- **Dele, der ikke ses** (bagramme og vægbeslag): **0,28 mm lag**. Bagrammens reflektor får lidt større trin, men de sidder bag lysringens 1 mm diffuser. Vægbeslaget er stadig massivt (100 %) med 4 vægge om tungerne.
- **Dele, der ikke ses** (bagramme, vægbeslag, blæserhegn og Wago-række): Bambus normale hastighed i første lag og ingen *Avoid crossing walls*. Det langsomme første lag og omvejene uden om væggene gør kun gavn, hvor fladen kan ses.
- Mindre fyld, hvor det ikke bærer noget: 15 % i stedet for 20 % (front, skal og bagramme).
- Uændret: lysringen, frontens forside (*Monotonic line*, én væg i første lag, elefantfod 0,15), scarf seam bagud, skallens support (Tree manuel, kun ved de 2 enforcere) og brim.

**Tid** (Bambu Studio sagde for v31: skal 26 t og bagramme 12 t 51 m; resten er beregnet ud fra vægbane, massive flader og øer pr. lag):

| Del | v31 | v32 | Sparet |
|---|---|---|---|
| Skal | 26 t (Bambu) | ca. 16–17 t | ca. 36 % |
| Bagramme | 12 t 51 m (Bambu) | ca. 7–8 t | ca. 40 % |
| Vægbeslag | | | ca. 35 % |
| Blæserhegn | | | ca. 35 % |
| Tema-dele | | | ca. 20 % |
| Wago-række | | | ca. 20 % |
| Front | | | ca. 7 % (den er næsten massiv) |
| Lysring | | | uændret |

Bambu Studio viser den rigtige tid, når pladen er slicet.

Selfi-stativbeslag-v5 og selfi-printer-v5 er også gennemgået, men ikke ændret. Stativbeslaget bærer hele boksen, så det beholder 5 vægge og 40 %. Printerens kappe og udgang har 3,2 mm paneler, der er massive med både 4 og 8 vægge (højst 2 % hurtigere).

## Hvad var nyt i v31: ledningerne til de rigtige klemmer

Esben 27. okt. 2026 (8 billeder af de samlede dele): mange ledninger i v29's ledningsplan gik til de forkerte steder, fordi tegningen ikke passede til, hvordan delene ser ud. Tegninger: `halo-gen2-v35_ledningsplan.png` (hver rigtig klemme og hvert stik er en gul prik) og `halo-gen2-v35_ledningsdiagram.png`. Se afsnittet "Delenes rigtige klemmer" og kabellisten under v29 herunder.

- **5 V-forsyningen:** DC IN (V+, V−) sidder i den øverste ende og DC OUT (+V, −V) i den nederste. P5 og P6 går fra DC OUT langs forsyningens nederste ende og op i bane RS i højre side (nu 50 og 45 cm).
- **RGB-styringen:** data (S3) i GPIO16 og USB (U1) i USB-C i den øverste ende; strømmen ind (P13, P14) i den nederste.
- **Dæmperen:** VOUT, GND og VIN i hver sin klemme øverst (VOUT forrest); styreledningen G1 i Gravity-stikket nederst.
- **Mikrofon-kernen:** højttaleren (A1) går i SPEAKER-stikket i underkanten, ikke i aux.

## Hvad var nyt i v30: dybere rille til vingerne

Esben 27. okt. 2026 (billede af bagsiden): er det nederste hul til sidetemaerne med, og er de funktionelle? De ser ikke så dybe ud. Rillen var med i v28 og v29, men kun **1,5 mm dyb** med en tap på 4 × 1,3 × 8 mm. Det er for lidt til at holde vingen, hvis nogen trækker i den forneden. Tegning: `halo-gen2-v35_rille.png` (v29 og v30 ved siden af hinanden).

- **Rillen er nu 3,5 mm dyb og 5,5 mm bred** (23,5–38 mm over bunden; før 1,5 × 4,5). Bagvæggen er kun 3 mm, så der er en **printet klods på indersiden** bag hver rille: 1,6 mm væg bag rillens bund og rundt om den. Klodsen går fri af reed-modulet, låselommen og alt andet (fit-check).
- **Tappen på vingens strop er 5 × 3,3 × 10 mm** (før 4 × 1,3 × 8) og går 3,3 mm ind i rillen med 0,25 mm luft i hver side og 0,2 mm til bunden. Dens inderste kant flugter med stroppen.
- Vingen sættes på som før (løft 3 mm, skub ind, slip): rillen er 4 mm længere opad end tappen, så tappen går ind samtidig med krogene og ender 0,5 mm over rillens bund.
- Rillen ligger stadig inden for boksens runde hjørne og kan ikke ses forfra. Printet: skallen ligger med bagsiden ned, så rillen er en lomme i første lag med en 5,5 mm bro over; ingen support.
- **Tjekket i CAD:** alle dele skåret mod hinanden mod v28: ingen nye kollisioner; tappen rører ikke skallen.

## Hvad var nyt i v29: komplet ledningsplan

Esben 27. okt. 2026 (billede af en samlet boks med ledninger på kryds og tværs): komplet ledningstegning med længder og ruter, så ledningerne ligger i baner i stedet for overalt; komponenter må flyttes; kamera, skærm og mikrofon er flade kabler, og der er 3 USB-kabler; alt skal være dimensioneret, så kassen kan åbnes og fronten lægges ved siden af uden problemer.

Tegninger: **`halo-gen2-v35_ledningsplan.png`** (kassen åbnet, hver ledning i sin bane, med id) og **`halo-gen2-v35_ledningsdiagram.png`** (el-diagrammet med de samme id'er). I 3D-modellen i admin ligger alle kabler i deres baner.

- **Kassen åbnes som en bog over venstre side.** Skallen ligger på ryggen, og fronten (med lysring, bagramme, skærm og Pi) lægges med forsiden ned til venstre for den, op til 3 cm fra den. Alt, hvad der går mellem de to halvdele, går i **2 hængselbundter** i venstre side: **K1** foroven (strips, Pi'ens strøm, stødsensor) og **K2** i midten (de 3 USB-kabler, dæmperens styreledning, reed). Hvert bundt er stroppet på begge halvdele, og der er **200 mm** ledning mellem de to stropper. Det er regnet fra den åbne stilling (op ad bagvæggen til kanten, over venstre væg og hullet, ned til bagrammen, plus 15 % til bøjninger). Lukket folder løkken sig ned langs venstre side, mellem fronten og skallens moduler.
- **Wago-rækken.** De 6 Wago-klemmer sidder i en række lommer på forsiden af vægbeslagets klods højt på bagvæggen, fra venstre: **W6** hvid + (dæmpet, 221-413), **W5** hvid − (221-413), **W3** 5 V + (221-414), **W4** 5 V GND (221-415), **W2** GND (221-415), **W1** 24 V + (221-413). Håndtagene vender mod dig, når fronten er af, og ledningerne går ind nedefra. Klemmerne trykkes ind i lommerne og holdes af små knusribber. Lige under rækken går **fordelingsbanen** (T) på tværs.
- **Baner.** I skallen: **T** under Wago-rækken, **L** ned i venstre side forbi 4G og højttaler, **R** op i højre side over 5 V-forsyningen, **RS** fra forsyningens DC OUT i den nederste ende langs bunden og op i højre side, **M** op fra strømstikket, **RH** hen over 5 V-forsyningens klemmer, **H** på tværs i 112 mm til dæmperen og K2, **G** ned langs RGB-styringens venstre side. På fronten: **FT** langs toppen fra strip-hullerne, **FL** ned i venstre side til K1, **UB** langs det øverste tværstykke (over blæserhegnet), **GD** ned ved siden af GPIO-stikket, **LB** under USB-stikkene til K2. Ingen ledning går hen over et modul, over blæserhegnet eller i lyskanalen.
- **Skallen:** 7 nye løkker til 10 mm velcrostrop (nu 15 i alt): 2 i venstre bane (170 og 222 mm), 2 i højre bane (200 og 245 mm), K1's skal-ende (240 mm i venstre side) og 2 under Wago-rækken. Og Wago-rækken selv på klodsen.
- **Bagrammen:** strop-slidserne er flyttet ud til venstre (x −76) i begge tværstykker til K1 og K2, og et tredje par i det øverste tværstykke (x 34) holder Pi'ens strømkabel. **Hak i det nederste tværstykke** under Pi'ens USB-A-stik (8 mm dybt): før stod tværstykket 0,5 mm fra stikkenes åbning, så et lige USB-stik ikke kunne komme i. Brug **90° vinklede USB-A-stik, der vender til venstre**, så kablerne går direkte ud i bane LB.
- **Kontrolleret i CAD:** alle dele skåret mod hinanden mod v28: ingen nye kollisioner (K1's skal-løkke flyttet 2 mm op fri af 4G-modulet). Alle 29 kabler er lagt som rør i 3D og tjekket fri af skal, bagramme, blæserhegn og alle moduler.

### Delenes rigtige klemmer (rettet efter Esbens billeder 27. okt.)

- **5 V-forsyningen (RSD-60G-5)** har DC IN (⏚, V−, V+) i den **øverste** ende og DC OUT (+V, −V) i den **nederste** ende, ikke alle klemmer øverst. P3/P4 går ned i DC IN fra bane RH; P5/P6 går fra DC OUT langs bunden af forsyningen (over bakkens stop) og op i bane RS i højre side.
- **RGB-styringen (Gledopto)** har V+ og V− (ind) i den nederste ende og OUTPUT (V+, GPIO16, GPIO2, GND) og USB-C i den øverste ende. S3 (data) går i GPIO16 lige fra venstre bane; U1 går i USB-C ved siden af.
- **Dæmperen (DFR0457)** har de 3 skrueklemmer øverst (VOUT forrest, GND, VIN bagerst mod bagvæggen) og Gravity-stikket nederst.
- **Mikrofon-kernen (XVF3800)** har USB-C og aux-stikket i overkanten og SPEAKER-stikket og mikrofonkablet i underkanten. Højttaleren (A1) går i **SPEAKER**-stikket, ikke i aux. Den grønne PWR (12 V)-klemme bruges ikke; kernen får strøm over USB-C.

### Kabelliste

Klip-længden er ruten med 15 % til bøjninger, plus 15 mm til hver ende, der skal afisoleres, rundet op til 5 cm. Ledninger gennem et hængselbundt har de 200 mm til bundtet med. Mærk hver ledning med sit id i begge ender (tape eller krympeflex).

| Id | Fra → til | Ledning | Klip (mm) | Bundt |
|---|---|---|---|---|
| P1 | hunstik + → W1 | 1,0 mm² rød + sikringsholder | 350 | – |
| P2 | hunstik − → W2 | 1,0 mm² sort | 400 | – |
| P3 | W1 → RSD-60G-5 +Vin | 1,0 mm² rød | 300 | – |
| P4 | W2 → RSD-60G-5 −Vin | 1,0 mm² sort | 300 | – |
| P5 | RSD-60G-5 +V → W3 | 1,0 mm² rød, orange tape | 500 | – |
| P6 | RSD-60G-5 −V → W4 | 1,0 mm² sort | 450 | – |
| P7 | W4 → W2 | 1,0 mm² sort | 100 | – |
| P8 | W2 → W5 | 1,0 mm² sort | 200 | – |
| P9 | W1 → DFR0457 VIN | 0,75 mm² rød | 450 | – |
| P10 | W2 → DFR0457 GND | 0,75 mm² sort | 400 | – |
| P11 | DFR0457 VOUT → W6 | 0,75 mm² rød, hvid tape | 350 | – |
| P12 | W3 + W4 → Pi 5 USB-C | USB-C-pigtail 2 × 0,75 mm² | 550 | K1 |
| P13 | W3 → Gledopto V+ | 0,75 mm² rød, orange tape | 400 | – |
| P14 | W4 → Gledopto V− | 0,75 mm² sort | 400 | – |
| S1 | RGB-strip → W3 | strippens ledning | 450 | K1 |
| S2 | RGB-strip → W4 | strippens ledning | 500 | K1 |
| S3 | RGB-strip → Gledopto GPIO16 | strippens ledning | 550 | K1 |
| S4 | hvid strip 1 → W6 | strippens ledning | 400 | K1 |
| S5 | hvid strip 1 → W5 | strippens ledning | 450 | K1 |
| S6 | hvid strip 2 → W6 | strippens ledning | 450 | K1 |
| S7 | hvid strip 2 → W5 | strippens ledning | 500 | K1 |
| U1 | Pi 5 USB-A → Gledopto USB-C | USB-A 90° venstre → USB-C | 450 | K2 |
| U2 | Pi 5 USB-A → XVF3800 USB-C | USB-A 90° venstre → USB-C | 550 | K2 |
| U3 | Pi 5 USB-A → 4G-modem | USB-A 90° venstre → modemets stik | 450 | K2 |
| G1 | Pi 5 GPIO → DFR0457 Gravity | 3 ledere: Gravity-kabel + forlænger | 400 | K2 |
| G2 | Pi 5 GPIO → reed-modul | 3 dupont-ledere hun-hun | 400 | K2 |
| G3 | Pi 5 GPIO → LIS3DH | 5 dupont-ledere hun-hun | 450 | K1 |
| G4 | Pi 5 GPIO → Touch Display 2 | skærmens eget kabel | 100 | – |
| A1 | FIT0502 → XVF3800 SPEAKER | højttalerens kabel | 100 | – |

- **Strips:** strippenes egne ledninger skal være mindst **60 cm** (S3 er den længste). Er de kortere, forlænges de med en 221-412 lige under hullet i bagrammen, ikke i bundtet.
- **USB:** U1 og U3: 50 cm, U2: 60 cm, alle med **90° USB-A, vinklet til venstre** (set bagfra med Pi'en som i boksen) og USB-C i den anden ende (4G: modemets stik).
- **Flade kabler** bliver på deres egen halvdel og går ikke gennem et bundt: **F1** kamerakablet (300 mm) og **F2** skærmkablet ligger på fronten, **F3** mikrofonkablet (20 cm) ligger i skallen.
- **G1** (dæmperens styring): 40 cm 3-leder. Dæmperens 3-polede stik passer ikke på 3 ben på række, så hver crimp sættes for sig: grøn på ben 12, rød på ben 1, sort på ben 14.
- **Pi'ens ben** (kun de brugte): 1 (3V3, G1), 2 og 6 (skærmen, G4), 3, 4, 5, 7, 9 (stødsensor, G3, tilvalg), 12 og 14 (G1), 13, 17, 20 (reed, G2, tilvalg).

### En samlet boks fra v24–v28

Print `halo-gen2-v56_wagoraekke-eftermontering.3mf` (PLA sort, med enden ned, uden support) og sæt den på forsiden af vægbeslagets klods med dobbeltklæbende VHB-tape, så fødderne står mod bagvæggen. Bagrammen fra v24–v28 har ikke slidserne ude til venstre: strop K1 og K2 rundt om tværstykkerne i stedet.

## Hvad var nyt i v28: vægbeslaget og rillen til vingerne

Esben 27. okt. 2026, efter at have set 3D-modellen bagfra: bagbeslaget stikker ud i bunden og kan ses lidt forfra; vægbeslaget skal have 1 hul i hver vinge ud mod låsene; og en ekstra rille nede ved bunden af boksen, så tema-vingerne kan blive længere og være stabile i bunden. Tegning: `halo-gen2-v56_vaegbeslag_og_rille.png`. Snit gennem låsene: `halo-gen2-v56_laas.png`.

- **Vægbeslaget stikker ikke længere ud.** Armene ud til de 2 låse endte i en plade, der gik ned til 0,3 mm over bunden og 95 mm ud til siden. Boksens nederste hjørner er runde, så pladens nederste hjørner stod op til **4,9 mm uden for boksen** og kunne ses forfra. Nu er armene skåret **1,5 mm inden for boksens kant** hele vejen rundt, så beslaget er helt skjult bag boksen. Låsetungerne står stadig på pladen i hele deres længde (tjekket: 0 mm² af tungen uden plade under), så printet er det samme: bagsiden ned, ingen support.
- **1 skruehul i hver arm** ud mod låsene (60 mm til højre og venstre for midten, 24 mm over boksens bund), så hjørnerne med låsene også er skruet fast i væggen og ikke kun hænger på armene. Beslaget har nu **6 huller**: 2 i skinnen foroven, 2 i midten og 2 i armene.
- **Rigtige forsænkninger i alle 6 huller.** Indtil v27 begyndte forsænkningen 0,6 mm inde i pladen, så den kun var Ø6,2 i overfladen, og hovedet på en 4,0 × 50 T20 (Ø7,75) stod 0,8 mm ud. Siden v25 er der kun 0,5 mm fra pladen til boksen, så hovedet ville røre boksens bagside. Nu er forsænkningen 90° og Ø8,6 i overfladen, og hovedet ligger 0,4 mm under pladen (0,9 mm fra boksen; tjekket i CAD).
- **Rille til tema-vingerne:** en rille i bagsiden forneden i hver side, lige under vingernes kroge (102,6 mm fra midten, 23,5–36 mm over bunden, 4,5 mm bred og 1,5 mm dyb; v30: 3,5 dyb, se ovenfor). Vingens strop går nu ned bag boksen, og en **tap** på stroppen (4 × 1,3 × 8 mm) sidder i rillen. Krogene bærer stadig vingen; tappen holder den nederste ende, så vingen ikke kan svinge ud eller vride sig. Vingen sættes på som før (løft 3 mm, skub ind, slip): rillen er 3,5 mm længere opad end tappen, så tappen går ind samtidig med krogene og ender 0,5 mm over rillens bund. Rillen er blind (1,5 af bagvæggens 3 mm), så der kommer ikke noget ind i boksen. En tredje slids med lomme som de andre er der ikke plads til forneden (reed-modulet, låselommen og dæmperbakken sidder der). Rillen ligger 5 mm inden for boksens runde hjørne og kan ikke ses.
- **Eksempel-vingerne går nu helt ned:** panelet fra 20 mm over bunden til toppen (270 mm højt, før 170), ribben langs siden og stroppen ned til rillen. Bag boksen er stroppen skåret 1 mm inden for boksens kant, så den ikke kan ses ved det runde hjørne. Styrketesten er regnet igen med den tungere vinge (`halo-gen2-v56_styrketest_kroge.md`, vinge 175 g massiv): alle tilfælde har stadig mindst 2 i sikkerhed (tappen er ikke regnet med).
- **Stativbeslaget** er lavet i en ny version med de samme rettelser: **selfi-stativbeslag-v5** (armene skåret inden for boksens kant; logopanelet 172 mm bredt, så det går 3,9 mm fri af tema-toppens stropper, som v4 rørte). Det passer også på v25–v27-bokse. Stativbeslaget er nu også med i boksens 3D-model i admin (slået fra; sæt flueben ved "Stativbeslag" og fjern det ved vægbeslaget).
- **Tjekket i CAD:** alle dele er skåret mod hinanden igen mod v27 (`hardware/tools/check_fit_gen2.py`), nu også med de 6 vægskruer: **ingen nye kollisioner**. Vægbeslaget og stativbeslaget har 0 mm² uden for boksens kant set forfra (v27: 36,6 mm²), tappen sidder i rillen uden at røre, vingernes stropper er mere end 5 mm fra beslaget og skruerne, og alle andre overlap og afstande er præcis som i v27.
- **Købedele:** 6 vægskruer 4,0 × 50 T20 + dybler i stedet for 4.

## Hvad var nyt i v27: ingen glas og ingen pakninger

Esben 27. okt. 2026: drop alt glas og alle pakninger i hele boksen; vi skal ikke bruge dem, og de gør boksen alt for kompleks at samle. Alt skal passe, når de er væk. Tegning: `halo-gen2-v56_uden_glas_og_pakninger.png` (de 4 steder, v26 ved siden af v27). Snit: `halo-gen2-v56_snit.png`.

Det, der er væk: O-ringsnoren (RS 234-2906) de 4 steder, kameraglasset Ø12 × 1,5, snor-ringen bag glasset og **kamerarøret** (det var der kun for at trykke snor-ringen mod glasset). Rillerne og lommen, som snoren lå i, er også væk, så der ikke står tomme spalter tilbage. Skærmens glas er selve skærmen og sidder, som det plejer.

- **Kameraet: lille, åbent vindue, og linsen er beskyttet.** Hullet i forsiden er kun **Ø8,6**, lige gennem frontpladen, ikke større end linsen kræver (Esben 27. okt.: intet stort hul, når der ikke er glas). **Linsens spids sidder 1,15 mm inde i hullet**, så frontpladens kant skærmer den, og en finger eller en kant rammer pladen, ikke linsen. Kameraet sidder derfor **1,95 mm længere fremme** end i v26 (linsens spids 1,15 mm bag forsiden; v26: 3,1 mm, 1,0 mm bag glasset). Wide-kameraets synsfelt (120° diagonalt) går fri af hullets kant med 0,31 mm. Alt, der holder kameraet, er flyttet med: tappene, kamerakassen og endestykkerne i fronten og bagrammens 4 rør, som trykker kortet mod tappene (de er 1,95 mm længere, så **bagrammen er ny**; ellers er den som v26). **Fokusmotoren kan køre frit som i v24–v26:** linsen rører intet, der er 0,65–0,8 mm luft rundt om den i hullet (Ø6,95–7,25 i et Ø8,6-hul), linseholderen står 2,2 mm bag frontpladen, kamerakassens vægge slutter 1,2 mm før kortet (2,0 ved flexkablet), og kortet ligger kun på de 4 tappe. Intet ligger foran linsen.
- **Lysringen** har ingen skulder og ingen snorlomme mere. Ringens væg går lige gennem slidsen, og kraven ligger direkte på frontpladens bagside; det er ringens faste stop. Frontpladen er hel (3,2 mm) rundt om slidsen (v26: 2,2 mm ved lommen). Lysfladen, skyggefugen (0,15 mm) og kraven er de samme, og bagrammens 54 knusknopper trykker stadig kraven ned mod frontpladen, så lysfladen ikke kan trykkes ind. **Ny lysring og ny front.**
- **Skærmen** ligger direkte på frontens 1,6 mm kant som før; rillen i kanten er væk, så kanten er massiv hele vejen rundt.
- **Højttaleren** ligger med flangen direkte på bagvæggen; rillen rundt om gitteret er væk. Krogene holder flangen inde mod væggen som før. **Ny skal** (kun den rille er ændret).
- **Front mod skal** havde allerede ingen snor (v21): ribbe og rille med drænhak, og fladerne mødes helt.
- **Tætheden:** uden pakninger tætner boksen ved formen alene, som i v19: lukket top, ribbe og rille mellem front og skal, drænhak, lukkede låse- og vingelommer, luftskærme over bundhullerne og mikrofonens små ringe om lydhullerne (de er printet i skallen og bliver). Brug den indendørs eller under tag: den tåler spild og et glas, der vælter ovenpå, men den er ikke tænkt til regn eller sprøjt (som v22-noten sagde om boksen uden pakninger). Kameravinduet er et åbent hul: tør det af med en tør klud, ikke en våd.
- **Frontskruerne er 4,0 × 50 T20** (Esben 27. okt.: de skruer, han har, så én T20-bit klarer det hele; målt: gevind 3,77, hoved Ø7,75, 49,25 lang, delvist gevind, undersænket). Se `halo-gen2-v56_frontskrue.png`. Hovedet ligger **plant i bagsiden** i en 90°-forsænkning (Ø8,2), så der skal ikke længere bruges en lang bit (før sad hovedet 37 mm inde). Skaftet går gennem et Ø4,4-hul i skallens stolpe og bagrammens øre (0,3 mm luft, så delene spændes sammen og ikke skrues fra hinanden), og spidsen ender 20 mm bag forsiden, så gevindet har **7 mm i frontens tårn** (Ø3,2-hul; før Ø2,4 til 3,0-skruen). Tårnet er stadig Ø6, men det sidder tæt inde i skallens væg (0,2 mm), så det ikke kan flække. Ændrede dele: front, bagramme og skal. Tjekket i CAD: skruen rører kun frontens tårn (gevindet), 0,3 mm til stolpen og 0,31 mm til bagrammen, hovedet 0,22 mm fri i forsænkningen. Vægbeslagets huller (Ø5) tager også de samme skruer + dybler (v28: 6 huller med rigtig forsænkning).
- **Samlingen** er kortere: ingen snor ved lysring, skærm og højttaler, intet glas og intet kamerarør. Indkøb: snorrullen og kameraglasset skal ikke købes.
- **Vægbeslag og stativbeslag** passede uændret i v27 (v28: nyt vægbeslag og selfi-stativbeslag-v5).
- **Tjekket i CAD:** alle dele er skåret mod hinanden igen mod v26 (`hardware/tools/check_fit_gen2.py`), nu også med kameraets synsfelt og linsen som egne "må ikke røres"-legemer: **ingen nye kollisioner** mod v26. Synsfeltet rører intet (0 mm³ overlap; 0,31 mm fri på tværs ved hullets kant), linsen har 0,67 mm til fronten hele vejen rundt, og kameraets kort og holder rører kun tappene, lysringens krave ligger på frontpladen (0 mm) og bagrammens knusknopper på kraven som før, og alle andre overlap og afstande er præcis som i v26. Stativbeslag v4 er skåret mod v27's skal og front: intet overlap.

## Hvad var nyt i v26: printgennemgang

Esben 27. okt. 2026: gennemgå hele boksen for alt, der kan gå galt i printet: uønsket support, tråde, ting der hænger i luften. Alle printfiler er gennemgået lag for lag (0,2 mm), som en slicer ser dem: hvor et lag hænger mere end 1,5 mm ud over laget under, om det er en bro med fæste i begge ender, og hvor vægge er under 0,8 mm (2 baner). Tegning: `halo-gen2-v56_printrettelser.png`. Fire ting var forkerte og er rettet:

- **Blæserhegnet lå forkert på pladen.** Guiden sagde "risten ned", men filen i v24 og v25 lå med armenes spidser nedad og risten 13 mm oppe i luften, så hele risten og puden skulle have været printet på support. Og uanset vej op stod de 2 klikarme på højkant, så de bøjede på tværs af lagene, når hegnet klikkes på (ca. 1,1 % tøjning, der hvor ASA knækker på tværs af lag). **Nu printes hegnet på siden** (41 mm højt): hele profilen står på pladen i hvert lag, armene bøjer i lagets plan, og intet hænger ud. Slidserne i risten går nu på tværs (vandret i boksen, lodret på pladen), så de ikke bliver lange broer; de er stadig 2,5 mm brede, og der er lige så mange. Mål og pasform på tværstykket er de samme.
- **Vægbeslagets tunger hang 9 mm ud over pladen.** Pladen bag hver låsetunge stoppede 9 mm før tungens øverste ende. Med bagsiden ned blev det en flad underside på 9 × 18 mm (højre: 9 × 12) 4 mm over pladen, uden support. Det er netop roden af tungen, der bærer boksen. Nu går pladen 2 mm forbi tungen, så hele tungen vokser op af pladen. Pladen ligger i spalten bag boksen, så intet andet ændrer sig. Stativbeslaget havde samme fejl: **selfi-stativbeslag-v4** (samme pasform som v3; T-møtrikkens huller er nu også dråbeformede).
- **Luftskærmene over bundhullerne hang i luften.** Skærmene stopper 1,5 mm før bagvæggen (luften går også ud den vej), så deres første lag blev lagt 1,5 mm over bagvæggen med fæste kun i bunden: to 8,6 mm lange udhæng og en 43 mm lang kant imellem. Nu er der 3 små stolper (1,6 × 1,6 mm) over spalten i hver skærm, ved hjørnerne og midt på, så kanten er korte broer (8,6 og 2 × 16 mm). Luften har stadig næsten hele spalten.
- **Uønsket support i skallen.** Med automatisk support fylder sliceren steder, der kan printes uden: strømrøret (det var der, support fyldte hunstikkets hul i v23), de 2 låselommer (support, der sidder tilbage i en slids med 0,2 mm luft, stopper tungen) og de 4 vingelommer. Og med "kun fra pladen" får det ene sted inde i skallen, der virkelig skal have support, ingen: **dæmperbakkens forreste væg** på venstre side er en 18 mm hylde 35 mm oppe uden noget under (den kan ikke tegnes om, for dæmperen fylder hele bakken). Derfor er der nu **`halo-gen2-v56_skal_support.3mf`**: skallen med 2 support-enforcere (skinnens udsparing øverst bagpå og dæmperbakkens væg) og 7 support-blockere (strømrør, 2 låselommer, 4 vingelommer). Med support-typen **Tree (manuel)** kommer der support præcis de 2 steder og ingen andre. Se "Skal" under Indstillinger.

**Printindstillinger** (Esben 27. okt., anden runde: forsiden på fronten viste banemønster på den glatte plade, og alt skal se støbt ud og holde). Ingen dele er ændret; kun hvordan de printes:
- **En 3MF pr. del** med lag, vægge, fyld, support og brim lagt ind på objektet, så alle bokse bliver printet ens (`_lysring`, `_bagramme`, `_vaegbeslag`, `_smaadele` med kamerarør og blæserhegn (v27: `_blaeserhegn`), `_tema-*`, og front og skal som før).
- **Frontens forside** (første lag) har nu *Monotonic line* og kun én væg i første lag, så banerne ligger ens og ikke laver krydsmønster langs kanterne. Bedst er stadig tekstureret PEI; se "Front: sådan bliver forsiden pæn".
- **Lysringen** printes med koncentriske baner, så lyset bliver jævnt.
- **Scarf seam** på alle dele, og sømmen sidder på boksens underside (skal og bagramme ligger derfor vendt 180° på pladen).
- **Skallen har en 3 mm brim** i stedet for musøre, og det lille blæserhegn også.
- Første lag 30 mm/s og *Avoid crossing walls* (fra v32 kun på dele, der ses) og tørt filament fra samme parti: se "Printer, filament og proces" (27. okt., tredje runde: 3MF'erne er nu Bambu Studio-projekter, så de første to ligger i filerne).

**Tjekket, ikke ændret** (det printer, men hold øje med det): bagrammens 14 klikarme står på højkant og bøjer på tværs af lagene (ca. 1,8 % ved klik; de holdt ved samlingen af v23, men vip dem ikke længere ud end nødvendigt), læberne i strip-banerne er 0,5–0,7 mm og printes som én bane, skallens inderste kant ved rillen mod fronten er 0,6 mm, og bakkernes klikkanter har en flad fangeflade på 1,2–2,0 mm, der kan hænge 0,1–0,2 mm ned (skrab den, hvis en del ikke vil klikke ned). Alt andet er broer på højst 16 mm eller udhæng på højst 1,5 mm.

Alle 35 dele er skåret mod hinanden igen: ingen nye kollisioner mod v25 (`hardware/tools/check_fit_gen2.py`).

## Hvad var nyt i v25: 2 låse og boksen tæt på væggen

Esben 27. okt. 2026: en lås mere i det andet nederste hjørne, og boksen skal sidde tættere på væggen, så man ikke kan få fingrene om bag den og hive i den, og så den ser ud, som om den er klistret til væggen. Tegning: `halo-gen2-v56_laas.png` (snit gennem begge låse og skinnen).

- **2 låse.** Ud over den gamle lås (82 mm til venstre for midten set forfra, til højre set bagfra) er der nu en lås **84 mm til højre for midten** (set forfra; nederst til venstre set bagfra). Den har sin egen slids, lukkede lomme, drænhul, bundknast og sikkerhedsskrue, i samme højde som den gamle. Tungen er **12 mm bred** (den gamle er 18), fordi hjørnet er trangt: 5 V-forsyningens bakke står ved x 74,2, og skallens hjørnerunding (R42,8) begynder ved x 68,5. Lommen går 2 mm fri af bakken, og tungens yderste nederste hjørne er skåret 0,5 mm inden for skallens indvendige runding. Magneten til løftealarmen sidder stadig kun i den gamle tunge.
- **Boksen sidder 4,5 mm fra væggen** (v24: 14 mm). Vægbeslagets plade er stadig 4 mm tyk, og boksens bagside står 0,5 mm fra pladen. Afstandsklodserne bag boksen er væk. Der er ikke plads til fingre bag boksen.
- **Ophængning som i v24:** hæng boksen på skinnen foroven med bunden holdt lidt ud, sving bunden ind, så begge tunger går ind i deres slidser, og skru begge sikkerhedsskruer i nedefra. Tjekket i CAD for både vægbeslag og stativbeslag: bunden kan svinges ind uden at noget tager fat (højst 0,2 mm, hvor tungens skrå næse løfter boksen), og toppen går fri af væggen.
- **Tema-delenes stropper er 3,9 mm tykke** (v24: 9 og 10), så de kan være i den smalle spalte bag boksen. Toppens stropper er gjort 10 mm brede (v24: 5) for at få noget af stivheden tilbage; de er stadig mere bøjelige frem og tilbage end før, men de bærer i træk, ikke i bøjning. Krogene er de samme. Styrketesten er regnet igen (`halo-gen2-v56_styrketest_kroge.md`): alle tilfælde har mindst 2 i sikkerhed, og når boksen hænger, er der kun 0,4 mm bag stropperne, så tema-delene kan ikke tages af.
- **Højttaleren** sidder bag gitteret i bagvæggen. Med 4,5 mm til væggen kommer lyden ud gennem spalten rundt om boksen; den bliver nok lidt dæmpet. Prøv lyden, når den første boks hænger.
- **Stativbeslaget** er lavet i en ny version med 2 tunger og samme afstand: **selfi-stativbeslag-v3**. v1 og v2 passer ikke til en v25-boks. (v26: brug **selfi-stativbeslag-v4**, samme pasform, printes uden support.)
- **Købedele:** 2 sikkerhedsskruer (Bolte 88115, ST4,2 × 25 Torx med pin) i stedet for 1.

## Hvad var nyt i v24: rettelser efter første samling

Esben samlede den første boks 26. okt. 2026 og fandt 9 ting, der skulle rettes. Snit: `halo-gen2-v56_snit.png` (lyskanal, kamera og lås). Kabelføring: `halo-gen2-v56_ledningsplan.png`. Ledningsdiagram: `halo-gen2-v56_ledningsdiagram.png`.

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
  - **Blæserhegnet** (`halo-gen2-v56_blaeserhegn.stl`) er en ny lille del, der **klikkes på bagrammens øverste tværstykke** midt over Pi'en, uden skruer (Esben 26. okt. 2026). En pude ligger på tværstykkets bagside, og 2 arme går over tværstykkets top og bund og klikker med en 0,8 mm krog bag dets forside. Skærmen og dermed Pi'en er skruet på netop det tværstykke, så afstanden til blæseren ikke afhænger af skallen. Risten sidder **3 mm over Active Cooler** med 2,5 mm slidser over blæseren, så luften kommer ind, men ingen ledning kan nå blæseren. Den går kun 20,5 mm ud til hver side, så GPIO-stikket og dets stik er frie. 2 ribber over køleren gør den stiv, og 4 små knopper står 0,8 mm over køleribben uden for blæseren, så risten ikke kan trykkes ned i blæseren. Den tages af ved at vippe en arm op med en lille skruetrækker.
  - **Serviceløkken går nedad:** de 2 slidser til velcrostroppen er flyttet fra bagrammens øverste tværstykke (over Pi'en, så løkken hang hen over blæseren) til det **nederste** (under Pi'en). Løkken går fra hovedbundtets øverste løkke (136 mm) ned til bagrammen, og den løse ledning hænger nedad foran 5 V-forsyningen, væk fra blæseren.
  - **Stødsensorens gren** gik før lige op midt på væggen hen over mikrofon-kernen, lige bag blæseren. Den går nu ud til højre (løkken ved 158 mm) og op uden om mikrofon-kernen, med en ny løkke ved 214 mm. Skallen har nu 8 løkker.
- **Hunstikket kan komme helt ned.** Conrad opgiver kroppen til 14 × 13 mm (v23 regnede med 13 × 13), så den kunne ikke komme ned i rummet på 13,8. Rummet er nu **14,6 × 14,6**, så stikket kan vende begge veje, og hullet til tønden er 0,5 mm større. De 2 fangere går nu 1,6 mm ind over kroppens top (v23: 1,2), så stikket ikke kan skubbes op, når proppen trykkes i nedefra.
- **Mikrofonbakken er lavere og giver plads til aux.** Kortet er kun 1,2 mm tykt; de 12,2 mm, bakken var tegnet til, var med komponenterne og benene under kortet, så kanterne sad oven på komponenterne. Nu står kortet på **4 puder** omkring sine egne M3-huller (benene under kortet går fri), 4 pinde går gennem hullerne, og kanterne klikker over selve printpladen. Væggene er 7 mm høje (v23: 15,4). Aux-stikket og USB-C sidder i overkanten (modsat det flade kabel), og der er væggen skåret ned til printpladen, så de kan stikke ud. Enderne har kun lave stop.
- **Strømrøret kan printes uden support.** Skallen printes med bagsiden ned, så røret ligger ned, og hullerne i det er vandrette. I v23 skulle de derfor have support. Nu er alle runde huller dråbeformede med en 45°-spids, og den firkantede plads til hunstikket har et 45°-tag, så røret printes uden support. Sæt en support-blokker i røret i Bambu Studio, så slicerens automatiske support ikke kommer derind.
- **Blæseren kører altid mindst 6000 rpm** (boksens software, ikke CAD): se nederst.



Alle andre dele er som i v23. Nye i v24: **skal, front, bagramme, lysring, kamerarør, vægbeslag og blæserhegn**. Mål på hunstikket er fra Conrads produktside (bestillingsnr. 1570909); der findes ingen tegning, så tjek det på første print. v23 må ikke printes.

## Hvad var nyt i v23: kabelføring

Esben 24. okt. 2026: ledningerne skal føres fast, så de ikke ligger løst og bliver klemt, når skallen lukkes. Tegning: `halo-gen2-v56_ledningsplan.png`. Løsningen er printede løkker i bagvæggen og en trækaflastning over strømstikket. **Ingen klisterholdere og ingen kabelkanaler** (klister slipper i varmen, og en kanal tvinger ledningen i en bestemt rute, som ikke passer, når noget skiftes).

- **7 printede løkker** i bagvæggen indvendigt. Hver løkke er en lille bro over væggen med en fri åbning på **10 × 2 mm**, så der kan trækkes enten en almindelig kabelbinder (op til 2,5 mm bred) eller en **10 mm velcrostrop** igennem. Velcro er det bedste til samling og service: den kan åbnes igen, strammes igen og klipper ikke i isoleringen. Kabelbindere bruges, hvor noget aldrig skal røres igen; klip enden af, så der ikke står en skarp tap ind i boksen.
- **Ruten:** ét hovedbundt op langs midten af bagvæggen, fra strømstikket i bunden og op mellem 5 V-forsyningen og WLED-styringen. Derfra går der korte grene ud til dæmperen, højttaleren og mikrofon-kernen. 2 løkker sidder på hovedbundtet (112 og 136 mm over bunden), 1 ved dæmperen (72 mm), 1 på tværs i venstre side (112 mm), 1 ved 4G-modulet (205 mm), 1 ved forsyningens øverste ende (100 mm) og 1 ved mikrofon-kernen (158 mm). Fire af dem er de gamle kabelbinderløkker fra v18–v22, nu med den større åbning og samme form som de nye.
- **Trækaflastning over strømstikket:** en printet klemme lige over hunstikket i bunden holder de 2 ledninger fra stikket i en Ø5,4 mm gennemgang med en 3,8 mm åben side, så de klikkes ind fra siden. Et ryk i strømkablet går dermed i skallen og ikke i skrueklemmerne. Klemmen sidder 6 mm over stikkets top.
- **2 slidser i bagrammens øverste tværstykke** (10 × 2,4 mm, 7,6 mm fra hinanden). Her bindes kablerne fra Pi'en og skærmen fast, så der er en **serviceløkke på ca. 10 cm** mellem bagrammen og skallen. Skallen kan derfor lægges ned ved siden af fronten uden at noget trækkes ud, og uden at nogen ledning skal af. Slidserne er huller, ikke løkker, fordi bagrammen printes med bagsiden ned og ikke må have noget, der stikker ud af den flade.
- **Tjekket i CAD:** alle 34 dele er skåret mod hinanden: ingen nye kollisioner. Hver løkke har mindst 10 mm fri til nærmeste modul, så der er plads til bundtet og stroppen, og alle løkker er broer i printretningen (skallen printes med bagsiden ned), så de ikke kræver support.

## Hvad var nyt i v22

Esben 23. okt. 2026: alt skal kunne samles og virke **uden pakninger og uden kameraglas**. Pakningerne og glasset er en ekstra tætning, ikke noget delene skal stå på. Snit: `halo-gen2-v26_snit_taetning.png` i v26-mappen og `halo-gen2-v56_snit.png` (snit A).

- **Lysringen har en skulder, der står på frontpladen.** I v20 og v21 hvilede kraven på snoren, så uden snor kunne ringen rasle og stikke op til 0,4 mm frem. Nu går ringens væg lige ned til lommens bund (2,2 mm), hvor en skulder (0,4 mm bred, fra slidsens kant og ud) står direkte på frontpladen. Bagrammen holder kraven nede. Ringen sidder dermed ens med og uden snor. Snoren ligger i en lukket rille ved siden af skulderen (1,8 × 1,0 mm) og klemmes fra 1,5 til 1,0 mm. Den synlige ring og skyggefugen (0,15 mm) er uændrede.
- **Kamerarøret har sit eget stop.** I v21 stoppede røret på glasset, så uden glas kunne det glide for langt frem. Nu sidder de 4 ribber i hjørnerne af kamerakassen (v21: på siderne), og deres forende stopper på frontpladens bagside. Med et glas på 1,5 mm rører rørets forside glasset samtidig, så snor-ringens rille stadig er lukket og fast. Uden glas står røret samme sted, og kameraet ser ud gennem det åbne vindue. Er glasset tykkere (op til 1,8), stopper røret på glasset; er det tyndere, ligger snor-ringen og holder det.
- **Uden pakninger og glas virker alt:** skærmglasset ligger direkte på frontens kant, front og skal mødes helt (ribbe og rille), højttalerens flange ligger inde mod væggen, lysringen står på sin skulder, og kamerarøret på sit stop. Der er bare ingen ekstra tætning, så brug den kun indendørs.
- **Tjekket i CAD:** alle 34 dele er skåret mod hinanden: ingen nye kollisioner. Lysringens skulder står på lommens bund (0 mm), og rørets ribber stopper på frontpladen (der er massiv front bag alle 4 hjørner).

## Hvad var nyt i v21

Esben 23. okt. 2026: de 4 slidser til temavinger bagpå gik i v20 lige ind i boksen, så vand og støv kunne komme ind ved siden af pakningerne. Og en tema-top skal kunne sidde ovenpå uden huller i taget. Snit: `halo-gen2-v56_snit_kroge.png`. Styrketest: `halo-gen2-v56_styrketest_kroge.md`.

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
- **Styrehullerne (Ø6,2, 18 mm fra midten) blev** (indtil v53), men blev ikke brugt: stativbeslaget v2 har ingen pinde, fordi bunden svinges ind som på væggen. v54 har lukket dem.
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
- **Ledningsdiagram:** `halo-gen2-v56_ledningsdiagram.png` viser alle ledninger, Wago-klemmer, sikring og Pi-ben. RGB-styringen (Gledopto) skal have **5 V**, aldrig 24 V: den sender sin indgangsspænding direkte ud på RGB-strippen, som er 5 V og brænder af på 24 V. I v2's 3D-model var den tegnet på 24 V; det er rettet.
- Bagrammen er ændret. I skallen er det gamle boremærke til en arkadeknap (en ring på indersiden af højre side) fjernet. Front, lysring, vægbeslag og dæksel er de samme som i v2.

## Hvad var nyt i v2

- **Lyset:** To hvide COB-strips (Ra95) og én RGB-strip sidder på en hvid bagramme bag fronten og lyser ind på en skrå hvid reflektor. Lyset kommer ud gennem en lysring i klart materiale (PETG) med en 1 mm tynd lysflade.
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

**v37 og v36:** ændringerne står i afsnittene øverst. Hvor teksten herunder siger noget andet, gælder afsnittene øverst.

| Fil | Del | Mål på pladen (mm) | Materiale | Ca. vægt | Plade | Support |
|---|---|---|---|---|---|---|
| `halo-gen2-v56_skal.stl` (+ `halo-gen2-v56_skal_support.3mf`) | **v41: de 4 samleskruers hoveder 2 mm under bagsiden, sikkerhedsskruernes hoveder 3 mm oppe i bunden.** **v40: Wago-lommer efter målene med skrå tænder, ribber og kant bagved, mikrofonkernen med tænder, bøjlen over hunstikket 0,9 lavere, stikhullet Ø10,8 med flad top, sikringsholderen klemmer.** **v36: holderne efter samlenoterne (se øverst), åben kanal til hunstikket, sikringsholder, lomme til vingernes tå.** Skal med Wago-række på vægbeslagets klods og 15 kabelløkker i baner (v29), rille forneden i bagsiden i hver side til vingernes tap (v28), uden rille om højttalergitteret (v27), stolper under luftskærmene (v26), 2 låseslidser, -lommer og bundknaster (v25), trækaflastning over strømstikket, strømrør uden support med plads til hunstikket på 14 × 13, lav mikrofonbakke med plads til aux, rille til frontens ribbe, knusribber på stolperne og 4 lukkede vingelommer | 224,5 × 307 × 64 | PLA sort | ca. 350 g | Glat PEI | **Kun de 2 steder i 3MF'en** (Tree, manuel); v37: forstærkede hjørner, riller til frontens klik, ny strømkanal og velcroløkkerne tilbage |
| `halo-gen2-v56_front.stl` (+ `halo-gen2-v56_front_flerfarvet.3mf`) | **v41: klikkanterne 0,3 mm længere inde på tungen, så de går helt i hak.** **v38: klikkanter også i top og bund. v37: klikkanter på tungen, Ø10 bag kameravinduets 1 mm kant, forstærkede hjørner.** Front uden glas og pakninger (v27): åbent kameravindue Ø8,6 med linsen 1,15 mm inde i hullet, kamerakassen 1,95 mm længere fremme, hel frontplade om lysringen og massiv skærmkant; ribbe mod skallen | 224,5 × 307 × 27,7 | PLA sort | 110 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v56_logo-hvid.stl` | Logo, hvide dele (farvedel til fronten) | 27,5 × 9,9 × 0,8 | PLA hvid | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v56_logo-groen.stl` | Logo, grønne prikker (farvedel til fronten) | 24,6 × 2,6 × 0,8 | PLA grøn | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v56_lysring.stl` (+ `.3mf`) | Lysring med v18-profil og 45° krave i frontens sæde, støttekanter, enderne ud til x ±17 (v36) | 209,1 × 291,6 × 6,7 | Klar PETG (jeres klare materiale) | ca. 34 g | **Tekstureret PEI** | **Nej** (v36, som v18) |
| `halo-gen2-v56_bagramme.stl` (+ `.3mf`) | Bagramme med strop-slidser til hængselbundterne K1 og K2 ude til venstre og til Pi'ens strøm, hak under USB-A-stikkene (v29); kun 2 hvide baner og glat reflektor, 54 knusknopper mod lysringen, WLED-holder til 108 mm (v24); de 4 rør til kameraet 1,95 mm længere (v27); v37: rørene slutter 0,3 mm bag kameraet med knusspidser | 217,1 × 300 × 29,2 | PLA hvid | 247 g | Glat PEI | Nej |
| `halo-gen2-v56_vaegbeslag.stl` (+ `.3mf`) | Vægbeslag med 2 låsetunger (18 og 12 mm brede, 0,3 mm over bundknasterne), boksen 4,5 mm fra væggen (v25); pladen bærer hele tungerne (v26); armene 1,5 mm inden for boksens kant og 6 forsænkede huller, 2 af dem i armene (v28) | 189 × 284,5 × 19,5 | PLA sort | ca. 133 g | Glat PEI | Nej |
| `halo-gen2-v56_blaeserhegn.stl` (+ `.3mf`) | Blæserhegn, ca. 125 mm langt og over hele Active Cooleren (v36): rist 3 mm over Pi'ens Active Cooler, klikkes på bagrammens øverste tværstykke uden skruer; printes på siden, slidserne på tværs (v26) | 125,5 × 14,6 × 41 | PLA sort | 18 g | Glat PEI, **på siden** | Nej |
| `halo-gen2-v56_tema-top-eksempel.stl` (+ `.3mf`) | Eksempel på en tema-top med 2 kroge og stropper 3,9 × 10 mm (v25; kun til at prøve krogene, et rigtigt tema laves pr. kunde) | 224,5 × 154 × 77,1 | PLA, valgfri farve | ca. 75 g ved 15 % fyld | Glat PEI, forsiden ned | Ja, under stropperne |
| `halo-gen2-v56_tema-vinge-venstre-eksempel.stl` / `..._hoejre-eksempel.stl` (+ `.3mf`) | Eksempel på tema-vinger med 2 kroge hver og en strop 3,9 mm tyk (v25); går ned til bunden med en tap i rillen forneden (v28) | 61,9 × 270 × 77,1 | PLA, valgfri farve | ca. 75 g ved 15 % fyld | Glat PEI, forsiden ned | Ja, under stroppen |
| `halo-gen2-v56_wagoraekke-eftermontering.stl` (+ `.3mf`) | **Kun til en skal fra v24–v28** (v29 har den i skallen): Wago-rækken alene, sættes på vægbeslagets klods med VHB-tape | 162,8 × 19,4 × 23,5 | PLA sort | 18 g | Glat PEI, enden ned | Nej |
| `halo-gen2-v56_tema-dominance-top.stl` + `_hvid` / `_orange` (+ `halo-gen2-v56_tema-dominance-top_flerfarvet.3mf`) | **Airtox Dominance-top** (testkit, v36): halv ottekant med logo, 2 kroge, ligger på tværs af pladen | 166 × 288,9 × 77,1 | PLA sort + hvid + orange | ca. 80 g ved 15 % fyld | Glat PEI, forsiden ned | Ja, under stropperne |
| `halo-gen2-v56_tema-dominance-stolpe-venstre.stl` / `..._hoejre.stl` + `_hvid` / `_orange` (+ `_flerfarvet.3mf`) | **Airtox Dominance-stolper** (testkit, v36): 32 mm brede, orange hætte og navnet, 2 kroge + tap med tå i rillen | 43,8 × 285 × 77,1 | PLA sort + hvid + orange | ca. 60 g ved 15 % fyld | Glat PEI, forsiden ned | Ja, under stroppen |
| `halo-gen2-v56_stativbeslag.stl` + `..._stativbeslag_logo-hvid.stl` / `..._logo-groen.stl` (+ `halo-gen2-v56_stativbeslag_flerfarvet.3mf`) | **Stativbeslag til gulvstativet (v36: fast del af pakken)**, i stedet for vægbeslaget. **v37 (stativbeslag v9): gevindindsats 1/4"-20 × 12,7 i stedet for T-møtrikken, massiv hylde (modifier i 3MF'en).** 2 arme låser temadelene på stativet, tjekket mod v37-skallen. Logo-indlæg bagpå | 222,5 × 304 × 54 | PLA sort + hvid + grøn | se Bambu Studio | Tekstureret PEI | Nej |

Vægtene er skøn ud fra rumfanget. Bambu Studio viser den rigtige vægt og tid, når delene er skåret.

**Pladen:** front og skal er 307 mm lange og ligger med 6,5 mm fri til pladens kant foran og bagved (H2C-pladen er 320 mm). Det er 0,5 mm under vores egen margin på 7 mm, så flyt dem ikke frem eller tilbage, og brug ikke skirt. Skallens brim på 3 mm (v26) er inden for. 3MF'erne lægger delene midt på pladen; fronten (flere farver) ligger til venstre, fra 30 mm, med prime tower til højre for.

Tre farver PLA (fire med Dominance-temaets **orange**): **sort** (skal, front, beslag, blæserhegn), **hvid** (bagrammen og logoet), **grøn** (prikkerne i logoet), og lysringen i klart materiale (PETG; v34). Logoet skal være PLA ligesom fronten, ellers hæfter lagene ikke.

## Indstillinger (Bambu Studio)

**Hver del har sin egen 3MF med indstillingerne lagt ind** (v26; Esben 27. okt.: et pænt resultat uden fejl, der ser støbt ud og holder). Åbn 3MF'en, ikke STL'en, og vælg **"Open as project"** (åbn som projekt), ikke "Import geometry only". Så får hver del de samme lag, vægge, fyld, søm, support og brim hver gang, uanset hvad der sidst stod i Bambu Studio. Indstillingerne ligger på objektet; i objektlisten har det et tandhjul, og der kan du se og rette dem.

**27. okt., tredje runde: filerne er nu rigtige Bambu Studio-projekter.** Indtil nu sagde Bambu Studio 2.8 *"The 3mf file has invalid config, load geometry data only"* og smed objektets indstillinger væk, fordi filerne ikke sagde, hvilken printer, proces og filament de var lavet til. Nu vælger hver fil selv:
- Printer **Bambu Lab H2C 0.4 nozzle**, proces **0.20mm Standard @BBL H2C** og filament **Bambu PLA Basic @BBL H2C** på hver plads med farverne sort, hvid og grøn, og **Bambu PETG Translucent @BBL H2C 0.4 nozzle** til lysringen (v34; v31–v33 sagde Bambu ASA, se "Hvad er nyt i v34").
- **Pladen**: tekstureret PEI til front og lysring, glat PEI (*Smooth PEI Plate / High Temp Plate*) til resten.
- **Første lag 30 mm/s** (væg og fyld) på dele, hvor første lag er forsiden (front, lysring, tema), og **Avoid crossing walls** på alle dele (v34). Processen står derfor som *0.20mm Standard @BBL H2C* med ændringer; resten (temperaturer, køling, hastigheder) er Bambus egne profiler.
- Front, lysring (v35: hvid PLA i supportens mellemlag), stativbeslag og printerens kappe og udgang (flere materialer) ligger til venstre på pladen med **prime tower** til højre for, så det ikke står i vejen.

Filerne er bygget og tjekket mod Bambu Studio 2.8.2's egen indlæsningskode, men ikke åbnet i Bambu Studio her. Får du stadig beskeden, så sig til, og brug tabellen under "Sæt det selv" imens.

| Fil | Plade | Lag | Vægge | Fyld | Andet |
|---|---|---|---|---|---|
| `halo-gen2-v56_front_flerfarvet.3mf` | Tekstureret PEI (glat kan bruges, se herunder) | 0,2 | 2, top 4 / bund 4 | 15 % crosshatch | Forsiden: *Monotonic line* og én væg i første lag; elefantfod 0,15; ingen brim, ingen support |
| `halo-gen2-v56_lysring.3mf` | Tekstureret PEI | 0,16 | 3 | 100 % | Bambus egne baner (v42; v26–v41 koncentrisk, som gav en streg på tværs); elefantfod 0,15; **ingen support og én filament (klar)** (v36: kraven er 45° og printer uden support, som i v18) |
| `halo-gen2-v56_bagramme.3mf` | Glat PEI | **0,28** | 2, top 4 / bund 3 | 15 % crosshatch | Ingen support; ses ikke: normalt første lag |
| `halo-gen2-v56_skal_support.3mf` | Glat PEI | 0,2 | 2, top 4 / bund 3 | 15 % crosshatch | Support: Tree (manuel), kun ved de 2 enforcere, også fra modellen; brim 3 mm; normalt første lag (bagsiden) |
| `halo-gen2-v56_vaegbeslag.3mf` | Glat PEI | **0,28** | 3, top 4 / bund 3 | 40 % gyroid | Ingen support; ses ikke: normalt første lag |
| `halo-gen2-v56_blaeserhegn.3mf` | Glat PEI | 0,2 | 2, top 4 / bund 3 | 15 % crosshatch | På siden; brim 3 mm; ses ikke |
| `halo-gen2-v56_wagoraekke-eftermontering.3mf` | Glat PEI | **0,28** | 2, top 4 / bund 3 | 15 % crosshatch | Enden ned; ingen support; ses ikke |
| `halo-gen2-v56_tema-*.3mf` | Glat PEI | 0,2 | 2, top 4 / bund 4 | 15 % crosshatch | Forsiden som fronten; Tree-support (auto) under stropperne |

**Søm:** alle dele har Bambus standard *"Aligned"* uden scarf (v36 skal og front, v42 lysring, stativbeslag og temadele). *"Back"* lagde hvert lags start på én lige linje bagud på pladen, og den kunne ses som en streg på tværs af delen. Skal og bagramme ligger stadig vendt 180° på pladen; drej ikke delene.

**Sæt det selv** (hvis en fil kun indlæses som geometri, eller du printer fra STL). Vælg printer, proces og filament som ovenfor, slå **Advanced** til øverst i procesfeltet, og find hvert felt med **søgefeltet** (forstørrelsesglasset) under dets engelske navn. Der er én del pr. plade, så du kan sætte det i den globale proces; gem den som en proces pr. del (fx "Selfi front"), så skal det kun gøres én gang.

| Bambu Studio-felt (fane) | Front | Lysring | Bagramme | Skal | Vægbeslag | Blæserhegn | Wago-række | Tema-dele |
|---|---|---|---|---|---|---|---|---|
| Layer height (Quality) | 0.2 | 0.16 | **0.28** | 0.2 | **0.28** | 0.2 | **0.28** | 0.2 |
| Wall loops (Strength) | 2 | 3 | 2 | 2 | 3 | 2 | 2 | 2 |
| Top / Bottom shell layers (Strength) | 4 / 4 | | 4 / 3 | 4 / 3 | 4 / 3 | 4 / 3 | 4 / 3 | 4 / 4 |
| Top shell thickness (Strength) | 0.8 | | 0.8 | 0.8 | 0.8 | 0.8 | 0.8 | 0.8 |
| Sparse infill density (Strength) | 15 % | 100 % | 15 % | 15 % | 40 % | 15 % | 15 % | 15 % |
| Sparse infill pattern (Strength) | Crosshatch | | Crosshatch | Crosshatch | Gyroid | Crosshatch | Crosshatch | Crosshatch |
| Infill combination (Strength) | Fra | | Fra | Fra | Fra | Fra | Fra | Fra |
| Bottom surface pattern (Strength) | Monotonic line | | | | | | | Monotonic line |
| Only one wall on first layer (Quality) | Til | | | | | | | Til |
| Elephant foot compensation (Quality) | 0.15 | 0.15 | | | | | | |
| Seam position / Scarf joint seam (Quality) | Aligned / None | Aligned / None | | Aligned / None | | | | Aligned / None |
| Enable support (Support) | Fra | **Til** | Fra | **Til** | Fra | Fra | Fra | **Til** |
| Type (Support) | | **Normal (manual)** | | **Tree (manual)** | | | | Tree (auto) |
| On build plate only (Support) | | **Til** | | **Fra** | | | | |
| Brim type / Brim width (Others) | No-brim | No-brim | | Outer brim only / 3 | | Outer brim only / 3 | | |
| Initial layer speed og Initial layer infill speed (Speed) | 30 | 30 | Bambus | Bambus | Bambus | Bambus | Bambus | 30 |
| Avoid crossing walls (Quality) | Til | Til | Til | Til | Til | Til | Til | Til |
| Support/raft interface, Top interface layers, Top Z distance, Top interface spacing (Support) | | **Plads 2 (hvid PLA), 2, 0, 0** | | | | | | |
| Plate type (pladen øverst i Prepare) | Textured PEI | Textured PEI | Smooth PEI | Smooth PEI | Smooth PEI | Smooth PEI | Smooth PEI | Smooth PEI |

Tomt felt: lad Bambus værdi stå. Ved front, lysring (v35), stativbeslag og printerens kappe/udgang: **Prime tower** til og **Flush into object's infill** til. Uden 3MF'en til lysringen skal kraven have en support enforcer (højreklik på ringen, *Add support enforcer*, en kasse over hele ringen fra 3,4 til 4,0 mm over pladen).

**Printer, filament og proces** (det, der ikke ligger i 3MF'en; tjek det første gang)
- Printer: Bambu Lab H2C med 0,4-dyse. Proces: Bambus 0,20 mm Standard for H2C. Filament: **Bambu PLA Basic** (eller jeres PLA med dets PLA-profil til H2C); lysringen **Bambu PETG Translucent 0.4 nozzle** (eller jeres klare materiales profil). **Aldrig en ASA-profil til PLA** (v34).
- **Første lag:** højde 0,2 mm (logoet er præcis de 4 første lag; det er Bambus standard), hastighed 30 mm/s for både væg og fyld på front, lysring og tema-dele (ligger i 3MF'en; de andre dele bruger Bambus normale), bredde 0,5 mm. Det første lag er frontens forside, så det skal lægges langsomt og ens.
- **Undgå at krydse vægge** (*Avoid crossing walls*): til på alle dele (ligger i 3MF'en, v34). Dysen kører uden om i stedet for hen over huller og flader, så der kommer færre tråde og mærker.
- Temperaturer og køling fra filamentprofilen: PLA 220 °C, plade 55 °C, **ingen kammervarme** (kammertemperatur 0; H2C'en køler selv kammeret ved PLA), køling 60–80 %. Klar PETG 245 °C, plade 70 °C, ingen kammervarme. (v31–v33 sagde her 260 °C, 100 °C og 60 °C kammer til ASA; det gav heat creep i PLA, se v34.)
- Slå *Flow dynamics calibration* til i print-vinduet, hver gang der er sat en ny rulle i.
- Ingen "hole compensation" eller skalering. Hullerne er tegnet til målet (±0,2 mm).
- Lad ydervæggenes hastighed stå, som Bambu har den. Siderne er pæne, som de er.

**Filamentet**
- **Tør filamentet før hvert stort print**: PLA 8 timer ved 55 °C, den klare PETG 8 timer ved 65 °C. Fugtigt filament giver tråde, små bobler og en ru flade, og fugtig PETG trækker mange tråde.
- Front, skal og beslag i **samme sorte PLA fra samme parti**, så farven og glansen er ens. Logoet skal være PLA ligesom fronten, ellers hæfter lagene ikke.

**Front: sådan bliver forsiden pæn**
Forsiden er det første lag. På en **glat plade** bliver hver bane et lille spejl, og man ser mønsteret, især langs kanterne, hvor de 4 vægge mødes med fyldet. Det retter 3MF'en: alle baner i forsiden ligger samme vej i samme rækkefølge (*Monotonic line*), og der er kun én væg i første lag i stedet for 4. Det, der er tilbage, kommer af pladen og første lag:
- **Tekstureret PEI giver det pæneste, mest "støbte" resultat.** Teksturen skjuler banerne helt og giver den samme matte flade overalt. Brug den, hvis I har den.
- På den **glatte plade**: vask pladen med opvaskemiddel og varmt vand, og rør ikke ved den bagefter (fingeraftryk ses i forsiden). Brug ikke lim under fronten; limen giver en mat, skjoldet forside. Lav en Z-offset-justering på den glatte plade (første lag må hverken have revner mellem banerne eller striber af for meget plast).
- Lad pladen køle under 40 °C, før fronten tages af, og bøj pladen, ikke fronten.
- Logo (AMS: sort, hvid og grøn): `halo-gen2-v56_front_flerfarvet.3mf` har front og logo som ét objekt med tre dele på AMS-plads 1 (sort), 2 (hvid) og 3 (grøn). Tjek, at de tre pladser har de rigtige filamenter. Sæt "Prime tower" til og "Flush into object's infill" til, så spildet bliver mindre (ca. 12 farveskift, 10–15 g spild, 20–30 min ekstra). Mindste detalje i logoet er ca. 0,9–1,1 mm, så brug ikke en 0,6-dyse til fronten.
- Uden 3MF'en: træk `halo-gen2-v56_front.stl`, `_logo-hvid.stl` og `_logo-groen.stl` ind på én gang, svar **Ja** til ét objekt med flere dele, giv delene sort, hvid og grøn, og sæt indstillingerne fra tabellen.
- Elefantfod-kompensation 0,15 mm: lysringens skyggefuge er kun 0,15 mm, og både ringen og fronten printes med forsiden ned, så uden kompensation kan de første lag klemme ringen fast i slidsen.

**Lysring** (forsiden ned på tekstureret PEI)
- Lysfladen er 1 mm tyk og printes massiv med Bambus egne baner (v42). v26–v41 printede den med koncentriske baner, men deres start og slut lå på én linje og gav en synlig streg på tværs af den klare ring.
- Kraven hænger 2,25 mm ud over væggen på begge sider og printes derfor på support med et mellemlag i hvid PLA (v35; v27–v34 printede den uden support, og guiden sagde fejlagtigt 1,25 mm). Træk supporten af, når pladen er kølet af, og skrab rester af, så kraven ligger plant på frontpladen.
- Print lysringen i det klare materiale (PETG Translucent-profilen ligger i 3MF'en; er det ikke PETG, så vælg jeres materiales profil). Lad pladen køle helt af, før ringen tages af, så den ikke bliver skæv.

**Bagramme** (den flade bagside ned på glat PEI)
- Reflektoren er glat (v24), og de 54 knusknopper står 0,25 mm op på de flader, lysringens krave ligger på. Slib dem ikke af; de skal trykkes flade ved samlingen.
- Læberne i strip-banerne (v18) peger fremad og står på laget under. Se efter, at de er hele hele vejen rundt, og fjern trådrester i banerne og lyskanalen med en kniv. Tråde dér kaster skygger i lysringen.

**Skal** (bagsiden ned på glat PEI)
- **Support (v26):** 3MF'en har skallen som ét objekt med 2 grønne support-enforcere og 7 røde support-blockere, og support står allerede på **Tree (manuel)** med **"Kun på byggepladen" fra**. Så kommer der support præcis 2 steder:
  - i **skinnens udsparing** øverst bagpå (taget er 120 × 33 mm, 9 mm oppe; for bredt til en bro), fra pladen, og
  - under **dæmperbakkens forreste væg** inde i venstre side (en 18 mm hylde 35 mm oppe), fra bagvæggen indvendigt. Den tages ud gennem bakkens åbning.
  Alt andet i skallen er tegnet til at printes uden: strømrøret (dråbeformede huller og 45°-tag, v24), låselommerne (broer på 16 og 10 mm), vingelommerne (broer på 7 mm), kabelløkkerne (broer på 8 mm) og luftskærmene (v26: stolper). Blockerne holder dem rene, også hvis typen ved en fejl står på *Tree (auto)*.
- **Brim 3 mm** hele vejen rundt (v26; før musøre), så hjørnerne ikke løfter sig. Den sidder på bagsiden, som vender mod væggen. Skær den af med en afgratningskniv langs kanten.

**Vægbeslag:** 3 vægge og 40 % gyroid (v33); det bærer hele boksen. Ingen support (v26: hele tungen står på pladen).

**Blæserhegn** (`halo-gen2-v56_blaeserhegn.3mf`): i sort, **på siden** (41 mm højt, armene ligger fladt i lagene) med en brim på 3 mm, fordi det er smalt og højt. Fjern trådrester i hegnets slidser med en kniv.

## Efter print

1. Bor de 4 skruehuller i frontens hjørner rene med et 2,5 mm bor i hånden.
2. Prøv lysringen i fronten bagfra. Den skal falde på plads uden at klemme, med en lige, smal skyggefuge (0,15 mm) rundt om lysfladen, og kraven skal ligge plant på frontpladen hele vejen rundt (den hænger 1,25 mm ud i printet).
3. Prøv skærmen i fronten. Den skal falde ned mellem ribberne uden at klemme; klemmer den, skrabes ribberne let med en kniv. Se efter, at kanten foran glasset er plan.
3b. Se gennem kameravinduet: hullet til linsen (Ø8,6 i den yderste mm, Ø10 bagved, v37) skal være rundt og rent, uden trådrester.
3c. **Stativbeslaget (v37):** sæt gevindindsatsen i hylden med loddekolben (se "Hvad er nyt i v37"), før beslaget bruges.
4. Prøv kameraet på frontens 4 tappe. Det skal kunne trykkes på med fingrene uden at skære i tappene.
5. Se efter, at vinduerne i kanalens vægge er åbne, og at overkanten (den sidste bro i printet) er lige. Fjern trådrester med en kniv.

## Samling

Læg fronten med forsiden ned på et blødt underlag.

1. **Lysringen:** læg **lysringen** lige ned i slidsen bagfra, så 45°-kraven ligger i frontens sæde hele vejen rundt. Enderne skal ikke lirkes ind (v36).
2. **Skærmen:** læg skærmen i fronten med glasset ned på kanten (v27: ingen snor). 8 små ribber langs glassets kant styrer den på plads, så billedet sidder lige i vinduet. Den skal falde ned uden at blive trykket.
3. **Strips** (v18: intet klister; v45: klipstik på den førte ende, i lommen ved kameraet; RGB ca. 887,5 mm, hvid 850 mm). Læg bagrammen på bagsiden og sæt strippene i med lyset ind mod reflektoren: **RGB først** (bagerst, i den tætte bane), så **hvid 2** (midterste bane), så **hvid 1** (forreste bane). For hver strip: læg klipsets ledning ind i slidsen ved kameraet og klipset i lommen (hvid 1 og RGB i venstre side, hvid 2 i højre), læg strippen i sin bane (hvid: vip, skub bagkanten ind under læben, tryk forkanten ned), og træk den frie ende ind under broen i hvert hjørne, til strippen ligger tæt ind mod væggen hele vejen rundt. Klipsenden skal aldrig under en bro. Ud igen: træk strippen tilbage fra klipsenden. Ledningerne går ud gennem slidsen ved siden af kameraet;
4. **Kameraet:** Sæt kamerakablet (300 mm) i kameraet først. Kablet går ud til siden, mod slidsen i bagrammen. Tryk kameraet på de 4 printede tappe, til kortet ligger fladt på dem; linsen går ind i hullet bag kameravinduet. **Intet må røre linsen.** Der er 1,4 mm luft rundt om den i Ø10-hullet bag den yderste kant (v37) og intet foran den (v27: intet glas og intet kamerarør); linsens spids skal stå 1,15 mm inde i hullet, ikke ude i forsidens plan. Kan kortet ikke ligge fladt, eller rører noget linsen, så stop og send et billede. Se forfra, at linsen sidder midt i hullet.
5. **Bagrammen** lægges ned i fronten. Før kamerakablet gennem slidsen i bagrammen lige ved kameraet. Kablet laver én blød bue bagud og må ikke knækkes eller foldes skarpt. Tryk bagrammen ned, til alle 14 låse klikker (8 på indervæggen, 6 på ydervæggen). Tryk først midt på hver side, så låsene klikker parvis. Den trykker lysringens krave ned på frontpladen hele vejen rundt (v24: de 54 knusknopper bliver trykket flade, når frontskruerne spændes, så kraven sidder fast og lysfladen ikke kan trykkes ind), trykker kameraet mod forsiden, og de 8 fjedertæer trykker skærmglasset mod kanten. Nu kan front, skærm og bagramme vendes og bruges åben uden skal. Skal bagrammen af igen, stikkes en lille skruetrækker i slidsen ved hver lås bagfra, og armen vippes væk fra væggen.
6. **Skærmen skrues fast** med 4 M2,5 × 3–4 mm skruer (fx fra skærmens egen pose), gennem bagrammen og ind i skærmens fire gevindører. Hovedet sidder ca. 18,6 mm nede i tårnet på en 1,6 mm bund, så brug en PH0/PH1-skruetrækker med et skaft under Ø5 mm og gerne magnetisk bit. Brug ikke 5 mm skruer: de rammer skærmens bagside. Spænd skiftevis over kryds, til glasset ligger helt ind mod frontens kant hele vejen rundt. Bagrammen trykker skærmen 0,2 mm mod kanten, så den sidder uden slør.
7. **Pi'en:** Sæt skærmens korte flade kabel i skærmen og i Pi'ens DISP-stik, før Pi'en skrues på skærmens afstandsstykker med de 4 andre skruer fra posen. Kablet skal ligge i en blød bue rundt om Pi'ens kant. Kamerakablet føres i en løs bue bag bagrammen ned til Pi'ens CAM-stik. **Blæserhegnet (v24):** når Pi'en er skruet fast, klikkes hegnet på bagrammens øverste tværstykke midt over Pi'en: læg puden mod tværstykkets bagside med risten over Active Cooler, og tryk lige ned, til begge arme klikker bag tværstykkets forside. Tjek, at blæseren kan drejes frit med en finger gennem risten. **Fronten (v29):** sæt de 3 vinklede USB-A-stik i Pi'en, før bagrammen skrues fast, og læg kablerne i bane LB mod venstre. Strip-ledningerne går fra hullerne langs toppen (FT) og ned i venstre side (FL) til K1's slidser i det øverste tværstykke; Pi'ens strømkabel (P12) ligger i bane UB og stroppes i slidserne ved x 34. Se `halo-gen2-v56_ledningsplan.png`. Ingen ledning må ligge over hegnet.
8. **Elektronik i skallen:** 5 V-forsyningen og WLED-styringen trykkes ned i deres lodrette bakker på bagvæggen på hver side af røret, forsyningen med **DC IN-klemmerne opad og DC OUT nedad** og WLED-styringen med udgangen (4 klemmer + USB-C) opad, og dæmperen i bakken på venstre væg. Læberne på bakkerne holder dem. Tryk de 6 Wago-klemmer ind i rækken på vægbeslagets klods i rækkefølgen W6, W5, W3, W4, W2, W1 fra venstre (v29), håndtagene mod dig. Forbind alt **præcis som i `halo-gen2-v56_ledningsdiagram.png`** med Wago 221-41x (3 × 221-413 og 3 × 221-415 i rækken, v37, plus 2 × 221-415 og 3 × 221-413 i bagrammens lommer (v56) og 2 × 221-413 ved sikringen, v53; ikke 221-6xx, som ikke tager de tynde ledninger fra strips) og klikstik, og læg hver ledning i sin bane som i `halo-gen2-v56_ledningsplan.png` med længden fra kabellisten. Sæt ledningstyller på alle fintrådede ledninger, der går i en skrueklemme. Vigtigst:
   - RGB-strippen får 5 V direkte fra W3 og GND fra W4, **aldrig 24 V**. RGB-styringen (Gledopto) giver kun data til strippen (v24, efter at dens sikring sprang); den styres fra Pi'en over USB-A til USB-C.
   - 5 V-forsyningens −V bindes til 24 V-GND (broen W4 → W2), ellers virker Pi'ens styresignal til dæmperen ikke.
   - Dæmperen (DFR0457) har kun 3 skrueklemmer: VIN fra W1, GND fra W2 og VOUT, som er det dæmpede **+**. VOUT går til W6, der giver + til de 2 hvide strips. Strips' − går i W5, som får GND fra W2. (Tidligere stod der, at dæmperen skiftede minus; det var forkert.)
   - Dæmperens 3-polede stik passer ikke på 3 ben på række på Pi'en. Sæt hver crimp for sig (G1): grøn til ben 12 (GPIO18), rød til ben 1 (3V3) og sort til ben 14 (GND).
   - Mål med et multimeter, før strips og Pi sættes i: 24 V på W1, 5 V på W3, og 5 V (ikke 24 V) på RGB-strippens +.

   **Kabelføring (v29, se `halo-gen2-v56_ledningsplan.png`):** hver ledning i sin bane (T, L, R, M, RH, H, G i skallen), stroppet med en **10 mm velcrostrop** i løkkerne. Stram, så bundtet ikke kan flytte sig, men ikke så hårdt at isoleringen mærkes. Til sidst **hængselbundterne**: læg K1's og K2's ledninger sammen, strop dem i skallens løkke (K1: 240 mm oppe i venstre side, K2: 72 mm) og i bagrammens slidser, og mål **200 mm mellem de to stropper**. Åbn kassen helt og læg fronten ved siden af: intet må stramme. Luk den igen: løkken folder sig ned langs venstre side. Wago-klemmerne bindes ikke; håndtagene skal kunne nås. **v56:** sæt de 5 klemmer i lommerne i bagrammen over det øverste tværstykke (hvid venstre, RGB højre) som i skallens række: indgangsenden over tænderne, bagenden ned til den klikker, håndtagene opad og indgangene bagud, sæt strippenes egne ledninger og forlængerne E1-E5 i, og før forlængerne til K1 som i ledningsplanen. Sikringens ledninger går i FWL (lang + P1) og FWR (kort + P1b) over sikringen.
9. **Mikrofonkortet** (standard i alle bokse): Sæt det flade kabel (20 cm, følger med) i kortet. Læg kortet i lommen i bunden lige bag forkanten med **Seeed-logoet nedad** (det er den side, lydhullerne er på) og stikket bagud. De 2 printede pinde går gennem kortets huller. Kablet går lige bagud gennem udskæringen i lommen, op bag Pi'en og ind i stikket i underkanten af mikrofon-kernen. Kernen trykkes ned i sin bakke på bagvæggen over WLED-styringen med komponenterne udad og aux-stikket opad, så de 4 pinde går gennem kortets huller og kanterne klikker over printpladen (v24). Kablet må gerne bøjes blødt, men ikke knækkes. Kortet skal ligge fladt; de 4 små ringe i lommen lukker tæt om lydhullerne.
10. **Skallen** sættes ned over fronten (v21: ingen snor her; frontens ribbe går ned i rillen i skallens forkant). Tryk den lige ned, til den klikker på de 4 kanter (v37); så holder den sig selv samlet, mens du skruer. De 4 frontskruer (**4,0 × 50 mm, undersænket, T20**; v27) skrues i bagfra i de 4 forsænkede huller i hjørnerne af bagsiden. Hver skrue går gennem skallens stolpe og bagrammens øre og ind i fronten, så de tre dele holdes sammen af de samme 4 skruer. En almindelig T20-bit er nok: hovedet ender 2 mm under bagsiden (v41; før plant). Spænd med lavt moment (skruemaskinens kobling lavt, eller sidste omgang med hånden), for gevindet skærer i plast. Spænd over kryds, til front og skal ligger helt sammen hele vejen rundt (ingen fuge); de små knusribber på stolperne bliver trykket flade, så bagrammen sidder fast.
10b. **Højttaleren** trykkes ned over pindene og ind under krogene, så flangen ligger på bagvæggen (v27: ingen snor).
11. **Strømindgangen (v36):** skru 24 V-ledningerne (1,5 mm², med ledningstyller) i hunstikkets skrueklemmer, før det sættes i. Sæt stikket ind i den åbne kanal midt i bunden ved bagvæggen **forfra**, med åbningen nedad og metalspidsen i slidsen i bunden (v37), til halsen står på bunden og læberne i kanalens forkant holder huset. Tryk de 2 ledninger ind i trækaflastningen over stikket (Ø6,4). **+** går til sikringsholderens nederste ledning (P1); sikringsholderen trykkes ind i sin holder på højre væg med låget fremad, og dens øverste ledning går op ad højre bane til W1 (P1b).
12. **Ophængning (v25):** skru vægbeslaget på væggen med **6 skruer** 4,0 × 50 T20 + dybler (v28: også de 2 i armene ud mod låsene; hovederne skal ligge under pladens overflade, ellers rører de boksen). Hæng boksen på krogen foroven med bunden holdt lidt ud fra væggen, og sving så bunden ind, så begge låsetunger går vandret ind i slidserne i bunden. Skru begge sikkerhedsskruer i nedefra; de trækker boksen de sidste 0,3 mm op, så den står på tungerne og sidder helt fast mellem krogen og skruerne. Boksen sidder 4,5 mm fra væggen. Boksen må ikke kunne rykkes, når skruen er spændt. Når boksen hænger, sættes strømforsyningens stikprop op i hullet i bunden, til den sidder helt inde. **v52:** læg ledningen i kabellåsens spor (ned i lommen, frem i venstre side, rundt om skruehullet, tilbage i højre side og ned gennem hullet bagerst) og skru kabellåsen op under bunden med den 3. sikkerhedsskrue. Ledningen kommer ned 10 mm fra væggen.

Købedele, der skal skrues: 4 frontskruer, 6 vægskruer med dybler (v28), 8 M2,5-skruer (følger med skærmen) og 2 sikkerhedsskruer ved låsene (v25; v52's 3. skrue i kabellåsen er væk igen i v54). Blæserhegnet klikkes på uden skruer. Til kabelføringen: **18 velcrostropper 10 mm bred** (v29: 15 løkker i skallen og 3 par slidser i bagrammen; rulle med velcrobånd 10 mm, klippet i stykker på ca. 12 cm, fx fra Biltema eller Amazon) eller kabelbindere 2,5 mm, men brug velcro på K1 og K2. Der er ingen fjedre, lim, pakninger eller glas (v27, Esben 27. okt. 2026). Den eneste gevindindsats er stativbeslagets 1/4"-20 × 12,7 (v37).

## Tjek på første print

- Vægbeslag og vinger (v28): kan beslaget ses forfra, når boksen hænger (det må det ikke)? Ligger alle 6 skruehoveder under pladens overflade? Går vingens tap ind i rillen, når vingen sættes på, og sidder den nederste ende fast uden at kunne vrides?
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

