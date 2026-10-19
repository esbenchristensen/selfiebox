# Selfi Halo gen 2, version v2: printguide

**Version:** halo-gen2-v2 (19. okt. 2026). Alle filer i denne mappe starter med `halo-gen2-v2_`. Den erstatter halo-gen2-v1. CAD-kilden er `hardware/cad/gen2_concept.scad` i esbenchristensen/selfiebox.

Printer: Bambu Lab H2C. Alle STL-filer ligger allerede i printretning. Én del pr. plade, 1 stk. af hver. Kun hovedenheden; printermodulet kommer i en senere version.

## Hvad er nyt i v2

- **Lyset:** To hvide COB-strips (Ra95) og én RGB-strip sidder på en hvid bagramme bag fronten og lyser ind på en skrå hvid reflektor. Lyset kommer ud gennem en lysring i natur-ASA med en 1 mm tynd lysflade.
- **Fronten** er kun sort og åben bagtil. Den har ingen lofter, der hænger ud i luften, når den printes med forsiden ned. Det var dem, der gav de grimme kanter og hjørner i gen 1.
- **Lysringen** sættes i bagfra og holdes af sin krave. Bagrammen klemmer den fast hele vejen rundt, så den ikke kan løsne sig.
- **Skærmen** skrues i sine egne fire M2,5-ører gennem bagrammen, og 8 ribber i fronten holder glasset centreret i vinduet (±0,2 mm). Kameraet trykkes på printede tappe af bagrammen.
- **Kamerahullet** passer nu til Camera Module 3 Wide (Ø7,35), og linsen sidder 0,3 mm bag forsiden.
- **Strøm:** Mean Well RSD-60G-5, WLED-styringen og dæmperen klikkes i printede bakker i skallen. Der er ingen hulprint og ingen lodning.
- LED-skinnen fra v1 udgår. Bagrammen overtager dens job.

## Delene

| Fil | Del | Mål på pladen (mm) | Materiale | Ca. vægt | Plade | Support |
|---|---|---|---|---|---|---|
| `halo-gen2-v2_skal.stl` | Skal (bag, sider, top, bund) | 222,5 × 306 × 79 | ASA sort | 350 g | Glat PEI | Kun fra pladen |
| `halo-gen2-v2_front.stl` | Front | 222,5 × 306 × 27,7 | ASA sort | 120 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v2_lysring.stl` | Lysring | 205,1 × 288,6 × 4,7 | ASA natur (ufarvet) | 25 g | **Tekstureret PEI** | Nej |
| `halo-gen2-v2_bagramme.stl` | Bagramme med reflektor | 208,5 × 295,7 × 27,5 | ASA hvid | 200 g | Glat PEI | Nej |
| `halo-gen2-v2_vaegbeslag.stl` | Vægbeslag med låsetunge (uændret fra v1) | 131 × 276 × 29 | ASA sort | 140 g | Glat PEI | Nej |
| `halo-gen2-v2_printerdaeksel.stl` | Dæksel til printerhullet (uændret fra v1) | 21,6 × 23,4 × 5,2 | ASA sort | 1 g | **Tekstureret PEI** | Nej |

Vægtene er skøn ud fra rumfanget, i alt ca. 840 g ASA: ca. 610 g sort, 200 g hvid og 25 g natur. Bambu Studio viser den rigtige vægt og tid, når delene er skåret.

Tre farver ASA: **sort** (skal, front, beslag, dæksel), **hvid** (bagrammen; hvid giver mest lys tilbage fra reflektoren) og **natur/ufarvet** (lysringen; den lader mest lys igennem og giver et blødt, jævnt lys).

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
3. **Strips** klæbes på den lodrette væg i bagrammens lyskanal, med lyset ind mod den skrå reflektor: hvid strip 1 nærmest forsiden, hvid strip 2 i midten og RGB-strippen bagerst. Strippene starter og slutter ved kameraet, og ledningerne går ud gennem de to huller over kameraet. Klikstikkene sættes på før montering.
4. **Kameraet:** Sæt kamerakablet (300 mm) i kameraet først. Kablet går ud til siden, mod slidsen i bagrammen. Tryk kameraet på de fire printede tappe.
5. **Bagrammen** lægges ned i fronten. Før kamerakablet gennem slidsen i bagrammen lige ved kameraet. Kablet laver én blød bue bagud og må ikke knækkes eller foldes skarpt. Den klemmer lysringens krave fast hele vejen rundt og trykker kameraet mod forsiden.
6. **Skærmen skrues fast** med 4 M2,5-skruer fra skærmens egen pose, gennem bagrammen og ind i skærmens fire gevindører. Spænd let; bagrammen trykker skærmen 0,2 mm mod glaskanten, så den sidder uden slør.
7. **Pi'en:** Sæt skærmens korte flade kabel i skærmen og i Pi'ens DISP-stik, før Pi'en skrues på skærmens afstandsstykker med de 4 andre skruer fra posen. Kablet skal ligge i en blød bue rundt om Pi'ens kant. Kamerakablet føres i en løs bue bag bagrammen ned til Pi'ens CAM-stik. Active Cooler sidder på Pi'en og vender bagud; der er ca. 45 mm fri luft bag blæseren.
8. **Elektronik i skallen:** 5 V-forsyningen og WLED-styringen trykkes ned i deres bakker på bagvæggen, og dæmperen i bakken på venstre væg. Læberne på bakkerne holder dem. Forbind med Wago-klemmer og klikstik; kablerne er vist i 3D-visningen på admin.selfi.dk/admin/hardware.
9. **Skallen** sættes ned over fronten. De 4 frontskruer (**spunskrue 3,0 × 15 mm, TX20**) skrues i bagfra gennem hullerne i bagvæggen. Hver skrue går gennem skallens stolpe og bagrammens øre og ind i fronten, så de tre dele holdes sammen af de samme 4 skruer. Brug en **lang TX20-bit (mindst 60 mm)**, fordi skruehovedet sidder ca. 52 mm inde.
10. Vægbeslag og sikkerhedsskrue som i v1.

Købedele, der skal skrues: 4 frontskruer, 8 M2,5-skruer (følger med skærmen) og 1 sikkerhedsskrue. Der er ingen gevindindsatser, fjedre, pakninger, glas eller lim.

## Tjek på første print

- Kamera: sidder linsen midt i hullet, og er der ingen sort kant i billedets hjørner? Går kamerakablet gennem slidsen uden skarpe knæk?
- Lysring: er skyggefugen jævn, og rasler ringen ikke, når boksen er samlet?
- Skærm: sidder den helt fast uden slør? Ellers kan bagrammens knaster gøres 0,2 mm længere i CAD.
- Lys: tænd begge hvide strips på 100 % og mål lux ved 0,8 m (målet er mindst 250 lux).
- Bakker: sidder 5 V-forsyning, WLED-styring og dæmper fast, også når boksen vendes?
- Mål WLED-styringen. Målene i CAD (108 × 45 × 18 mm) er fra én forhandler og er ikke bekræftet.
- Vejr: sprøjtetest med en blomstersprøjte fra alle sider i 10 minutter med tændt boks, som i v1.
