# Selfi Halo gen 2, version v5: printguide

**Version:** halo-gen2-v5 (19. okt. 2026). Alle filer i denne mappe starter med `halo-gen2-v5_`. Den erstatter halo-gen2-v4; kun skallen er ny (70 mm dyb i stedet for 85). CAD-kilden er `hardware/cad/gen2_concept.scad` i esbenchristensen/selfiebox.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning. Én del pr. plade, 1 stk. af hver. Kun hovedenheden; printermodulet kommer i en senere version.

## Hvad er nyt i v5

- **Boksen er 70 mm dyb i stedet for 85 mm.** Den stikker 15 mm mindre ud fra væggen. Kun skallen er ændret; front, lysring, bagramme, logo, vægbeslag og dæksel er de samme som i v4.
- Alt på bagvæggen (5 V-forsyning, WLED-styring, højttaler, strømindgang, 4G, mikrofon-kerne, sensorer) sidder samme sted som før, bare 15 mm længere fremme sammen med bagvæggen. Mellem dem og Pi'en/bagrammen er der mindst 9 mm luft.
- Låsetungen går stadig 12 mm ind i boksen, og låseskruen sidder 15 mm længere fremme (vægbeslaget er uændret). Mikrofonstrippen under toppen er rykket 15 mm frem.
- Dæmperen på venstre væg er rykket 5,5 mm frem, så den ikke rammer bagvæggen.
- **4 huller lukket i bagvæggen.** Under hver frontskrue sad et ekstra hul (Ø6,4) fra v1, hvor frontskruerne sad tættere på midten. Siden v2 har der ikke siddet en skrue i dem, så de var bare åbne huller ind i boksen. De er nu lukket.
- **Bundventilation:** hætterne over bundhullerne ligger nu mellem bagrammen og bagvæggen. I venstre side er hullerne kortere, så hætten går fri af låseskruen. Indsugningen er 7,5 cm² mod 9,8 cm² før.
- Printerhullet og skruerne til printermodulet er rykket 7,5 mm frem, så de stadig sidder midt i bunden.
- Der er ca. 30 mm fri luft bag Pi'ens blæser (før 45 mm).
- Snittegning: `halo-gen2-v5_snit_v4-mod-v5.png` viser v4 og v5 side om side.
- Printermodulet med to Instax Wide bag hinanden kan ikke være i 70 mm. Det skal tegnes om, før det laves.

## Hvad var nyt i v4

- **Logo i fronten.** Selfi-logoet sidder midt i det sorte felt mellem lysringen og skærmen, som på den godkendte skitse (logo-paa-boksen). Det er hvidt med grønne prikker (prikken i ikonet og prikken over i), 27,5 × 10 mm, og ligger helt plant i fronten: det er printet ind i de første 4 lag (0,8 mm), ikke klistret på. Logoet er lavet direkte fra brandpakkens logofil.
- Fronten printes stadig i ét stykke med forsiden nedad. Der er to ekstra filer, `halo-gen2-v5_logo-hvid.stl` og `halo-gen2-v5_logo-groen.stl`, som er farvedele til fronten. Se "Front med logo" herunder.
- Skal, lysring, bagramme, vægbeslag og dæksel er de samme som i v3.

## Hvad var nyt i v3

- **Bagrammen er ét stykke.** I v2 var printfilen fire løse dele: de to tværbjælker, som skærmen skrues i, sluttede 0,4 mm før rammen, og reflektoren startede 0,24 mm over bunden, så den blev printet i luften. Nu går bjælkerne 1 mm ind i rammen bag lyskanalen, og reflektorens sidste trin går helt ned i bunden. `hardware/tools/check_bodies.py` tjekker nu, at hver printdel er én krop.
- **Ledningsdiagram:** `halo-gen2-v5_ledningsdiagram.png` viser alle ledninger, Wago-klemmer, sikring og Pi-ben. RGB-styringen (Gledopto) skal have **5 V**, aldrig 24 V: den sender sin indgangsspænding direkte ud på RGB-strippen, som er 5 V og brænder af på 24 V. I v2's 3D-model var den tegnet på 24 V; det er rettet.
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
| `halo-gen2-v5_skal.stl` | Skal (bag, sider, top, bund) | 222,5 × 306 × 64 | ASA sort | 315 g | Glat PEI | Kun fra pladen |
| `halo-gen2-v5_front.stl` | Front | 222,5 × 306 × 27,7 | ASA sort | 120 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v5_logo-hvid.stl` | Logo, hvide dele (farvedel til fronten) | 27,5 × 9,9 × 0,8 | ASA hvid | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v5_logo-groen.stl` | Logo, grønne prikker (farvedel til fronten) | 24,6 × 2,6 × 0,8 | ASA grøn | under 1 g | Sammen med fronten | Nej |
| `halo-gen2-v5_lysring.stl` | Lysring | 205,1 × 288,6 × 4,7 | ASA natur (ufarvet) | 25 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v5_bagramme.stl` | Bagramme med reflektor | 208,5 × 295,7 × 27,5 | ASA hvid | 200 g | Glat PEI | Nej |
| `halo-gen2-v5_vaegbeslag.stl` | Vægbeslag med låsetunge (uændret fra v4) | 131 × 276 × 29 | ASA sort | 140 g | Glat PEI | Nej |
| `halo-gen2-v5_printerdaeksel.stl` | Dæksel til printerhullet (uændret fra v1) | 21,6 × 23,4 × 5,2 | ASA sort | 1 g | **Tekstureret PEI** | Nej |

Vægtene er skøn ud fra rumfanget, i alt ca. 805 g ASA: ca. 575 g sort, 200 g hvid og 25 g natur. Bambu Studio viser den rigtige vægt og tid, når delene er skåret.

Fire farver ASA: **sort** (skal, front, beslag, dæksel), **hvid** (bagrammen og logoet; hvid giver mest lys tilbage fra reflektoren), **natur/ufarvet** (lysringen; den lader mest lys igennem og giver et blødt, jævnt lys) og **grøn** (kun de to prikker i logoet, så tæt på Selfi-grøn #22D36B som muligt). Logoet skal være ASA ligesom fronten, ellers hæfter lagene ikke.

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
1. Træk alle tre filer ind i Bambu Studio på én gang: `halo-gen2-v5_front.stl`, `halo-gen2-v5_logo-hvid.stl` og `halo-gen2-v5_logo-groen.stl`.
2. Svar **Ja**, når Bambu Studio spørger, om de skal indlæses som ét objekt med flere dele. Så ligger logoet præcis i sin fordybning i fronten. Flyt ikke delene hver for sig.
3. Giv fronten sort, logo-hvid hvid og logo-grøn grøn i objektlisten.
4. Lag på 0,2 mm, så logoet er præcis de første 4 lag. Farveskiftet sker kun i de 4 lag, derefter printes der kun sort.
5. Sæt "Prime tower" til og "Flush into object's infill" til, så spildet bliver mindre. Skøn: ca. 12 farveskift, 10–15 g spild og 20–30 min ekstra.
6. Mindste detalje i logoet er ca. 0,9–1,1 mm (to dysebaner med 0,4-dysen). Brug ikke en 0,6-dyse til fronten.

**Lysring** (forsiden ned på tekstureret PEI)
- 0,16 mm lag, 3 vægge (væggene er 1,2 mm), 100 % fyld.
- Lysfladen er 1 mm tyk og printes som massive lag. Kraven sidder øverst på trapper i 45°.
- Lad pladen køle helt af, før ringen tages af, så den ikke bliver skæv.

**Bagramme** (den flade bagside ned på glat PEI)
- 0,2 mm lag, 4 vægge, 20 % gyroid.
- Reflektoren er en skrå trappe i 0,5 mm trin. Den skal ikke slibes; trinene spreder lyset.

**Skal** (bagsiden ned på glat PEI)
- 0,16 mm lag på ydersiden giver de fineste flader.
- 5 vægge, 6 top- og bundlag, 20 % gyroid.
- Support: *Tree*, kun fra pladen. Det er kun til lameller og lommer bagpå.
- Brug **musøre** (mouse ears) i de 4 hjørner.

**Vægbeslag og printerdæksel:** som i v1 (beslag 6 vægge og 100 % fyld; dæksel 0,12 mm lag og 100 % fyld).

## Efter print

1. Bor de 4 skruehuller i frontens hjørner rene med et 2,5 mm bor i hånden.
2. Prøv lysringen i fronten bagfra. Den skal falde på plads uden at klemme, med en lige, smal skyggefuge (0,15 mm) rundt om lysfladen.
3. Prøv skærmen i fronten. Den skal falde ned mellem ribberne uden at klemme; klemmer den, skrabes ribberne let med en kniv.
4. Prøv kameraet på bagrammens tappe. Det skal kunne trykkes på med fingrene.

## Samling

Læg fronten med forsiden ned på et blødt underlag.

1. **Lysringen** lægges i slidsen bagfra. Kraven hviler på bagsiden af fronten.
2. **Skærmen** lægges i fronten med glasset ned på den printede kant rundt om vinduet. 8 små ribber langs glassets kant styrer den på plads, så billedet sidder lige i vinduet. Den skal falde ned uden at blive trykket.
3. **Strips** klæbes på den lodrette væg i bagrammens lyskanal, med lyset ind mod den skrå reflektor: hvid strip 1 nærmest forsiden, hvid strip 2 i midten og RGB-strippen bagerst. Hver strip har ét klikstik: hvid 1 og RGB i venstre side af kameraet, hvid 2 i højre side. Ved et klikstik slutter nabostrippen 17 mm længere ude, så stikket har plads i sin lomme. Ledningerne går ud gennem hullerne ved siden af kameraet. Klikstikkene sættes på før montering.
4. **Kameraet:** Sæt kamerakablet (300 mm) i kameraet først. Kablet går ud til siden, mod slidsen i bagrammen. Tryk kameraet på de fire printede tappe.
5. **Bagrammen** lægges ned i fronten. Før kamerakablet gennem slidsen i bagrammen lige ved kameraet. Kablet laver én blød bue bagud og må ikke knækkes eller foldes skarpt. Den klemmer lysringens krave fast hele vejen rundt og trykker kameraet mod forsiden.
6. **Skærmen skrues fast** med 4 M2,5-skruer fra skærmens egen pose, gennem bagrammen og ind i skærmens fire gevindører. Spænd let; bagrammen trykker skærmen 0,2 mm mod glaskanten, så den sidder uden slør.
7. **Pi'en:** Sæt skærmens korte flade kabel i skærmen og i Pi'ens DISP-stik, før Pi'en skrues på skærmens afstandsstykker med de 4 andre skruer fra posen. Kablet skal ligge i en blød bue rundt om Pi'ens kant. Kamerakablet føres i en løs bue bag bagrammen ned til Pi'ens CAM-stik. Active Cooler sidder på Pi'en og vender bagud; der er ca. 30 mm fri luft bag blæseren.
8. **Elektronik i skallen:** 5 V-forsyningen og WLED-styringen trykkes ned i deres bakker på bagvæggen, og dæmperen i bakken på venstre væg. Læberne på bakkerne holder dem. Forbind alt **præcis som i `halo-gen2-v5_ledningsdiagram.png`** med Wago 221-41x (2 × 221-413 og 3 × 221-415; ikke 221-6xx, som ikke tager de tynde ledninger fra strips) og klikstik. Sæt ledningstyller på alle fintrådede ledninger, der går i en skrueklemme. Vigtigst:
   - RGB-styringen får 5 V fra W3/W4, **aldrig 24 V**.
   - 5 V-forsyningens −V bindes til 24 V-GND (broen W4 → W2), ellers virker Pi'ens styresignal til dæmperen ikke.
   - De hvide strips får + direkte fra 24 V (W1) og − gennem dæmperen (W5).
   - Mål med et multimeter, før strips og Pi sættes i: 24 V på W1, 5 V på W3, og 5 V (ikke 24 V) på RGB-styringens udgang.
9. **Skallen** sættes ned over fronten. De 4 frontskruer (**SPUN+ 3,0 × 15 mm, forsænket**; databladet siger TX10, Bauhaus siger TX20, så tjek pakken) skrues i bagfra gennem hullerne i bagvæggen. Hver skrue går gennem skallens stolpe og bagrammens øre og ind i fronten, så de tre dele holdes sammen af de samme 4 skruer. Brug en **lang Torx-bit i den størrelse (mindst 45 mm)**, fordi skruehovedet sidder ca. 37 mm inde.
10. **Strømindgangen:** Skru 24 V-ledningerne i hunstikket (124-538), før skallen lukkes, og før dem gennem Ø5-hullet øverst i kanalen. Tryk hunstikket ind i kanalen bagfra med åbningen nedad, til det klikker forbi de to læber. Sæt strømforsyningens stik i nedefra, og tryk kablet ind mellem de to ribber nederst i kanalen, så stikket ikke kan falde ud.
11. Vægbeslag og sikkerhedsskrue som i v1. Kablet hænger lodret ned i vægspalten og ud under boksen.

Købedele, der skal skrues: 4 frontskruer, 8 M2,5-skruer (følger med skærmen) og 1 sikkerhedsskrue. Der er ingen gevindindsatser, fjedre, pakninger, glas eller lim.

## Tjek på første print

- Logo: er kanterne skarpe, og er der ingen sort farve i det hvide? Ligger logoet plant med resten af forsiden?

- Kamera: sidder linsen midt i hullet, og er der ingen sort kant i billedets hjørner? Går kamerakablet gennem slidsen uden skarpe knæk?
- Lysring: er skyggefugen jævn, og rasler ringen ikke, når boksen er samlet?
- Skærm: sidder den helt fast uden slør? Ellers kan bagrammens knaster gøres 0,2 mm længere i CAD.
- Lys: tænd begge hvide strips på 100 % og mål lux ved 0,8 m (målet er mindst 250 lux).
- Bakker: sidder 5 V-forsyning, WLED-styring og dæmper fast, også når boksen vendes?
- Mål WLED-styringen. Målene i CAD (108 × 45 × 18 mm) er fra én forhandler og er ikke bekræftet.
- Mål hunstikket (124-538) og GST-stikket. CAD regner med 14 × 14 × 33 mm og Ø11 × 35 mm; klikker hunstikket ikke fast, eller kan stikket glide ud, rettes læberne og ribberne.
- Mål dæmperens højde og klikstikkene. Der findes ingen officiel tegning af dem, så CAD bruger forhandlerens mål.
- Vejr: sprøjtetest med en blomstersprøjte fra alle sider i 10 minutter med tændt boks, som i v1.
