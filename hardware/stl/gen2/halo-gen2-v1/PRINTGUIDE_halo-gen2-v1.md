# Selfi Halo gen 2, version v1: printguide

**Version:** halo-gen2-v1 (19. okt. 2026). Alle filer i denne mappe starter med `halo-gen2-v1_`. Når noget ændres, laves en ny mappe `halo-gen2-v2` osv., så den nyeste altid er den med det højeste nummer. CAD-kilden er `hardware/cad/gen2_concept.scad` i esbenchristensen/selfiebox.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning. Én del pr. plade, 1 stk. af hver. Kun hovedenheden; printermodulet kommer i en senere version.

## Delene

| Fil | Del | Mål på pladen (mm) | Materiale | Ca. vægt | Plade | Support |
|---|---|---|---|---|---|---|
| `halo-gen2-v1_skal.stl` | Skal (bag, sider, top, bund) | 222,5 × 306 × 79 | ASA sort | 500 g | Glat PEI | Kun fra pladen |
| `halo-gen2-v1_front.stl` | Front | 222,5 × 306 × 19,7 | ASA sort | 150 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v1_lysring.stl` | Lysring | 206,9 × 290,4 × 4,8 | ASA hvid | 55 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v1_ledskinne.stl` | LED-skinne med fjedre | 209,3 × 292,8 × 4,6 | ASA sort | 90 g | Glat PEI | Nej |
| `halo-gen2-v1_vaegbeslag.stl` | Vægbeslag med låsetunge | 131 × 276 × 29 | ASA sort | 140 g (100 % fyld i tungen) | Glat PEI | Nej |
| `halo-gen2-v1_printerdaeksel.stl` | Dæksel til printerhullet | 21,6 × 23,4 × 5,2 | ASA sort | 1 g | **Tekstureret PEI** | Nej |

I alt ca. 940 g ASA: ca. 885 g sort (én spole på 1 kg) og 55 g hvid. Regn med ca. 35 timers print i alt; skallen alene tager ca. 18 timer.

Skallen er nu ét print i én farve. Den hvide stribe rundt om boksen er fjernet, så der er intet farveskift og intet prime tower.

## Hvorfor ASA

ASA tåler sol og UV uden at gulne eller blive skør, og det bliver først blødt ved ca. 95 °C. PLA bliver blødt ved ca. 55 °C og PETG ved ca. 70 °C, og en sort boks i solen kan blive over 60 °C. Derfor er alt ASA, også lysringen. Alle dele kan svejses sammen med acetone, fordi de er samme materiale.

Brug samme spole eller batch til alle sorte dele, så farven og glansen er helt ens.

## Indstillinger (Bambu Studio)

Start fra Bambus egen profil **Bambu ASA** og ret dette:

**Fælles for alle dele**
- Dyse 260 °C, plade 100 °C.
- Luk lågen, og lad kammeret varme op til ca. 60 °C, før printet starter. Varmt kammer giver stærkere binding mellem lagene og mindre vridning.
- Køling 10–20 % (5 % de første 3 lag).
- Ingen "hole compensation" eller skalering. Hullerne er tegnet til målet (±0,2 mm).
- Søm (seam): *Aligned*, placeret bagud, så sømmen havner på en side, der vender ind mod væggen.

**Skal**
- 0,16 mm lag på ydersiden giver de fineste flader. Brug *variable layer height* eller 0,16 mm hele vejen.
- 5 vægge, 6 top- og bundlag, 20 % gyroid. De mange vægge gør skruestolper, låseslids og krogslidser stærke.
- Support: *Tree*, kun fra pladen (*on build plate only*). Det er kun til lameller og lommer bagpå.
- Skallen fylder pladen, så brug **musøre** (mouse ears) i de 4 hjørner i stedet for et helt brim. Det stopper vridning i hjørnerne.

**Front og lysring** (printes med forsiden ned på tekstureret PEI)
- Forsiden får pladens fine, matte tekstur, uden laglinjer, og front og lysring matcher hinanden.
- Front: 0,2 mm lag, 4 vægge, 5 top- og bundlag, 20 % gyroid.
- Lysring: 0,16 mm lag, 2 vægge, 100 % fyld i propperne. Tynde vægge lader lyset skinne jævnt igennem.
- Rengør pladen med sæbe og vand før print. Fingeraftryk ses i forsidens tekstur.
- Lad pladen køle helt af, før delen tages af. Så slipper den af sig selv og får ikke mærker.

**LED-skinne**
- 0,2 mm lag, 4 vægge, 25 % gyroid.
- Skinnen printes med bagsiden ned. Fjedrene, der holder skærmen på plads, er 4 broer på 30 mm med en lille knop på toppen. Broerne printes frit over en lomme. Slå *bridge* til (standard) og kør med fuld køling på broerne.

**Vægbeslag**
- 0,2 mm lag, **6 vægge og 100 % fyld**. Det er den del, der bærer boksen og låser den.
- Låsetungen står lodret på pladen. Hold kammeret varmt og kølingen lav, så lagene binder godt.

**Printerdæksel**
- 0,12 mm lag, 100 % fyld. Den flade side ligger på tekstureret PEI og flugter med bunden af boksen.

## Efter print

1. **Tjek de 4 skruehuller i fronten** (Ø2,5) med et 2,5 mm bor i hånden, hvis der er rester i dem.
2. **Svejs lysringen i fronten** med acetone. Pensl lidt acetone i lysslidserne og på ringens propper, tryk ringen i, og lad den hærde i 30 minutter. Ingen lim; ASA mod ASA bliver ét stykke.
3. **Mal kanten af kamerahullet** indvendigt sort med en sprittusch, så lyset fra ringen ikke leder ind i linsen.
4. **Prøv labyrinten:** Ribben bag på fronten skal glide ind i rillen i skallens forkant uden at klemme. Hvis den klemmer, skrabes ribben let med en kniv.

## Samling

1. Skærmen lægges i fronten. Glasset hviler på den printede kant rundt om vinduet.
2. Kameraet skrues på de 4 tapper i fronten (M2 × 6).
3. LED-skinnen lægges ovenpå, og fjedrene trykker skærmen frem.
4. Elektronik klikkes i holderne på bagvæggen (4G, sensor, mikrofon og højttaler). Der er ingen skruer.
5. Fronten sættes på skallen, og de 4 skruer skrues i bagfra: **3,0 × 22 mm gevindskærende plastskruer** (fx WN 1452 / PT, rustfri A2).
6. Vægbeslaget skrues på væggen. Boksen hænges på og sænkes 9 mm. Derefter skrues **sikkerhedsskruen 4 × 25** (Torx med pin, rustfri) i nedefra.

Købedele, der skal skrues eller trykkes i: 4 skruer til fronten, 1 sikkerhedsskrue, 4 M2-skruer til kameraet og 1 magnet 6 × 3 (trykkes i vægbeslagets tunge). Der er ingen gevindindsatser, pakninger, glas eller lim.

## Vejr: sådan er boksen sikret uden ekstra dele

- **Front mod skal:** En ribbe på fronten går ned i en rille i skallen. Vand, der kommer forbi samlingen, løber rundt i rillen og ud gennem 2 små huller i bunden.
- **Skærmglas:** Glasset hviler på en printet kant. Bag kanten er en spalte, hvor vandet ikke kan suges videre ind.
- **Kamera:** Der er ingen rude. En printet kappe rundt om linsen holder stænk væk fra elektronikken, og hullet åbner nedad, så vand løber ud.
- **Mikrofonhuller:** Hullerne er Ø1,0. Under hvert hul trykker en printet ring mod mikrofonen, så vand ikke kan presses ind i den lukkede luftlomme.
- **Ventilation:** Bunden har hætter over slidserne, og lamellerne bagpå hælder udad.
- **Printerhul:** Der er en 4 mm krave rundt om hullet indvendigt.

Det er stænksikkert under overdækning, men ikke testet tæt. Første print skal sprøjtetestes med en blomstersprøjte fra alle sider i 10 minutter, med tændt boks.

## Tjek på første print

- Mål skallens forkant og frontens ribbe. De skal gå sammen uden at klemme.
- Sidder skærmen fast, når fronten er skruet på? Er der slør, kan knopperne på fjedrene gøres 0,2 mm højere i CAD.
- Kan printerdækslet drejes og klikke på plads med nøglen?
- Lyser lysringen jævnt i hvid ASA? Ellers prøves en anden hvid ASA eller 0,12 mm vægge.
