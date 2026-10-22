# Selfi stativbeslag v1: printguide

**Version:** selfi-stativbeslag-v1 (22. okt. 2026). Alle filer i mappen starter med `selfi-stativbeslag-v1`. CAD-kilden er modulet `stand_bracket` i `hardware/cad/gen2_concept.scad`; sættet bygges med `python3 hardware/tools/make_stativbeslag.py selfi-stativbeslag-v1` og tegningen med `hardware/render/drawing/draw_stativbeslag.py`.

Beslaget bruges kun til B2C-udlejning: gen 2-boksen på gulvstativet Sirui Traveler 5AX (kuglehoved B-00K). **Boksen ændres ikke.** Beslaget passer til alle gen 2-bokse fra v11 og frem (samme skinne, låsetunge ved x -82 og dowel-huller 18 mm fra midten i bunden), også v16 og v17. B2B-bokse hænger stadig på væggen med vægbeslaget.

Tegning: `selfi-stativbeslag-v1_tegning.png`. 3D af boksen på beslaget: `selfi-stativbeslag-v1_3d.glb` (+ `_parts.json`, samme format som boksens egen 3D).

## Sådan virker det

- **Skinne og lås som på væggen:** beslaget har vægbeslagets skinne, som griber i boksens rille øverst, og den samme låsetunge nederst med låseskrue (Torx med pin) og reed-magnet. Boksen kan ikke løftes af uden vores bit, og løftealarmen virker.
- **Hylde under boksen:** boksen står på en 14 mm hylde (48 mm bred, 63,5 mm dyb). Stativskruen sidder i hylden **31 mm bag forsiden, i midten**, lige under boksens tyngdepunkt (skøn fra CAD: ca. 31 mm bag forsiden, ca. 1,9 kg). Kuglehovedet bærer derfor ingen vippekraft. (Skitsen havde en fod bag boksen med skruen 78 mm bag tyngdepunktet; den er droppet, fordi kuglehovedet så skulle holde boksen fra at nikke forover.)
- **T-møtrik:** en 1/4"-20 T-møtrik (Einschlagmutter, stål) sættes ned i hylden ovenfra med flangen opad, og røret flugter med hyldens underside. Lynpladen spænder hele hylden fast mod flangen, og boksens bund lukker over flangen, så møtrikken kan ikke falde ud.
- **2 styrepinde** (Ø5,8 × 5) går op i printermodulets dowel-huller (Ø6,2) i bunden af boksen, så boksen ikke kan dreje eller glide på hylden.
- **Strømstikket** går ned gennem en slids bagerst i hylden. Mikrofonhullerne (1,5 mm foran hylden), luftslidserne og låseskruen er fri.
- **Logo bagpå:** Selfi-logoet (hvidt med grønne prikker, 130 mm bredt) er indlagt 0,8 mm i et panel på 190 × 58 mm øverst bagpå, som hos Myselfie. Det sidder 16 mm under boksens top og kan ikke ses forfra.

## Print

Printer: Bambu Lab H2C. STL-filerne ligger i printretning: **bagsiden ned** (logoet i de første lag), hylden står lodret op. Ingen support. 190 × 304 × 63,5 mm (H2C-zonen er 285 × 306), ca. 200 cm³.

- Sort ASA, som vægbeslaget. Logo i hvid og grøn ASA via AMS.
- Brug `selfi-stativbeslag-v1_flerfarvet.3mf`: ét objekt med tre dele på slot 1 (sort), 2 (hvid) og 3 (grøn). Eller indlæs `selfi-stativbeslag-v1.stl`, `_logo-hvid.stl` og `_logo-groen.stl` samlet (samme nulpunkt) og giv logodelene filament 2 og 3. Der er plads til prime tower (115 mm fri på tværs).
- Textured PEI, som fronten, så logoet bliver pænt.
- 5 vægge og mindst 40 % gyroid i hylden og omkring låsetungen; de bærer hele boksen.

## Købedele

| Del | Antal | Note |
|---|---|---|
| T-møtrik 1/4"-20 UNC (Einschlagmutter), stål | 1 | CAD regner med rør Ø8 × 8 mm og flange op til Ø19,5. **Mål den købte, før print**, og ret `TNUT` i gen2_concept.scad, hvis den er anderledes. |
| Låseskrue Bolte 88115 (DIN 7982 ST4,2 × 25, Torx med pin) | 1 | Den samme som på vægbeslaget |
| Magnet Ø8 × 3 | 1 | Den samme som på vægbeslaget (til reed-alarmen) |
| Sandsæk 5 kg til stativkrogen | 1 | Se Stabilitet |

## Samling (hos os, før udlejning)

1. Bank T-møtrikken ned i hullet ovenfra med flangen opad, til flangen ligger i bund.
2. Pres magneten i lommen i låsetungen (som på vægbeslaget).
3. Skru stativets lynplade i T-møtrikken nedefra, **på tværs af boksen** (lang side fra side til side), så klemmen går fri af strømstikket bag den.
4. Hold boksen 9 mm over beslaget, skub den ind mod beslaget, og sænk den, så rillen går ned over skinnen og pindene i dowel-hullerne. Skru låseskruen op gennem bunden i låsetungen.
5. Boks + beslag + lynplade sendes samlet. Kunden stiller stativet op, klikker lynpladen i kuglehovedet og spænder knappen. Strømstikket sættes i nedefra gennem slidsen.

## Stabilitet

- Boksen på beslaget: vægten går lige ned gennem hylden og T-møtrikken; skinne og låsetunge holder toppen som på væggen.
- Stativet: med lynpladen i 128 cm skal der ca. 5 N (et halvt kilo) til at vippe boks + stativ i toppen mod to ben, og ca. 11 N med 5 kg sandsæk på krogen (skøn: ben spredt 24°, ca. 45 cm radius). Beslaget kan ikke gøre stativet bredere, så guiden i kassen skal sige: **sandsæk på, benene helt ud, midtersøjlen nede, stativet op ad en væg eller i et hjørne.**

## Tjek på første print

- At Sirui-klemmen går fri af strømstikket med lynpladen på tværs (ca. 2 mm luft, hvis klemmen er 44 mm dyb; ikke målt).
- At pindene går i dowel-hullerne, og at boksen sidder i skinnen uden slør.
- At T-møtrikken passer i hullerne.
- At boks + beslag passer i boks-kasse v2: med beslaget er boksen 84 mm dyb og 320 mm høj, plus lynpladen under.
- Træk-test: boksen på stativet, løft i hjørnerne og skub fra siden.
