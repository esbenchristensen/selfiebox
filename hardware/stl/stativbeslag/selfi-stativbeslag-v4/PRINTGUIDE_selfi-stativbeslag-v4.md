# Selfi stativbeslag v4: printguide

**Version:** selfi-stativbeslag-v4 (27. okt. 2026, til halo-gen2-v25 og v26; v1 og v2 passer ikke til en v25-boks). Alle filer i mappen starter med `selfi-stativbeslag-v4`. CAD-kilden er modulet `stand_bracket` i `hardware/cad/gen2_concept.scad`; sættet bygges med `python3 hardware/tools/make_stativbeslag.py selfi-stativbeslag-v4` og tegningen med `hardware/render/drawing/draw_stativbeslag.py`. v3 må ikke printes (samme pasform, men se herunder).

Beslaget bruges kun til B2C-udlejning: gen 2-boksen på gulvstativet Sirui Traveler 5AX (kuglehoved B-00K). Beslaget er tegnet og tjekket mod **halo-gen2-v26** (boksens ydre er det samme som v25): ingen overlap med skal eller front, og bunden kan svinges ind over begge låsetunger. B2B-bokse hænger stadig på væggen med vægbeslaget.

## Nyt i v4 (printgennemgang 27. okt.)

Pasformen er præcis som v3. Kun to ting er ændret, så beslaget kan printes helt uden support:

- **Pladen bærer hele låsetungerne.** I v3 stoppede pladen bag hver tunge 9 mm før tungens øverste ende. Når beslaget ligger med bagsiden ned, hang de 9 mm af tungen derfor som en flad underside 4 mm over pladen (9 × 18 og 9 × 12 mm), og den hænger ned uden support. Nu går pladen 2 mm forbi tungen, så hele tungen vokser op af pladen. Pladen ligger i spalten bag boksen, så intet andet ændrer sig.
- **T-møtrikkens to huller er dråbeformede** med en 45°-spids mod forsiden (opad på pladen). Hullerne ligger ned i printet; i v3 var de runde, og taget i flangesædet (Ø20) sank lidt, så flangen kunne have svært ved at komme helt i bund.

Tegning over printrettelserne (samme fejl som vægbeslaget): `halo-gen2-v26_printrettelser.png` i halo-gen2-v26-mappen.

## Nyt i v3 (Esben 27. okt.)

- **2 låsetunger** som på v25's vægbeslag: den gamle (x −82, 18 mm bred, med magneten) og en ny i det andet hjørne (x +84, 12 mm bred). Begge går ned til 0,1 mm over bundknasten, og der skrues en låseskrue i hver.
- **Boksen sidder 0,5 mm fra beslagets bagplade** (v2: 10 mm), som på væggen i v25. Ribberne og afstandsklodserne i det gamle mellemrum er væk. Beslaget er 54 mm dybt (v2: 63,5).
- Alt andet som v2: hylde, T-møtrik, slids til strømstikket og logo.

## Nyt i v2 (Esben 27. okt.)

- **Låsetungen som v24:** tungen går ned til 0,1 mm over bundknasten (v1: 10 mm, vægbeslaget v24: 0,3). Låseskruen spænder knasten op mod tungen, så boksen sidder fast mellem hylden og tungen og ikke kan rokke. Tungen har den samme skrå næse som vægbeslaget.
- **Styrepindene er fjernet:** en v24-boks hænges på som på væggen (toppen på skinnen, bunden svinges ind), og pindene ville spærre for det. Tungen i slidsen (0,2 mm luft i hver side) og skinnen holder boksen mod at dreje og glide.
- Alt andet er som v1: hylde, T-møtrik, slids til strømstikket, logopanel og ribber.

Tegning: `selfi-stativbeslag-v4_tegning.png`. 3D af boksen på beslaget: `selfi-stativbeslag-v4_3d.glb` (+ `_parts.json`, samme format som boksens egen 3D).

## Sådan virker det

- **Skinne og låse som på væggen:** beslaget har vægbeslagets skinne, som griber i boksens rille øverst, og de samme 2 låsetunger nederst med hver sin låseskrue (Torx med pin). Reed-magneten sidder i den venstre tunge (set forfra). Boksen kan ikke løftes af uden vores bit, og løftealarmen virker.
- **Hylde under boksen:** boksen står på en 14 mm hylde (48 mm bred, 54 mm dyb). Stativskruen sidder i hylden **31 mm bag forsiden, i midten**, lige under boksens tyngdepunkt (skøn fra CAD: ca. 31 mm bag forsiden, ca. 1,9 kg, regnet igen på v22). Kuglehovedet bærer derfor ingen vippekraft. (Skitsen havde en fod bag boksen med skruen 78 mm bag tyngdepunktet; den er droppet, fordi kuglehovedet så skulle holde boksen fra at nikke forover.)
- **T-møtrik:** en 1/4"-20 T-møtrik (Einschlagmutter, stål) sættes ned i hylden ovenfra med flangen opad, og røret flugter med hyldens underside. Lynpladen spænder hele hylden fast mod flangen, og boksens bund lukker over flangen, så møtrikken kan ikke falde ud.
- **Ingen styrepinde** (v2): låsetungen i bundslidsen og skinnen holder boksen på plads. Styrehullerne i bunden bruges ikke længere.
- **Strømstikket** går ned gennem en slids bagerst i hylden. Mikrofonhullerne (1,5 mm foran hylden), luftslidserne og låseskruen er fri.
- **Logo bagpå:** Selfi-logoet (hvidt med grønne prikker, 130 mm bredt) er indlagt 0,8 mm i et panel på 180 × 58 mm øverst bagpå, som hos Myselfie. Det sidder 17 mm under boksens top og kan ikke ses forfra.

## Print

Printer: Bambu Lab H2C. STL-filerne ligger i printretning: **bagsiden ned** (logoet i de første lag), hylden står lodret op. Ingen support. 189 × 304 × 54 mm (H2C-zonen er 285 × 306), ca. 176 cm³.

- Sort ASA, som vægbeslaget. Logo i hvid og grøn ASA via AMS.
- Brug `selfi-stativbeslag-v4_flerfarvet.3mf`: ét objekt med tre dele på slot 1 (sort), 2 (hvid) og 3 (grøn), og med printindstillingerne lagt ind på objektet (27. okt.): 0,2 mm lag, 5 vægge, top og bund 5, 40 % gyroid, ingen support, scarf seam bagud, og bagsiden med logoet som *Monotonic line* med kun én væg i første lag, så logopanelet bliver ensartet uden krydsmønster. Printer, filament og første lag (0,2 mm, 30 mm/s) sættes som til boksen; se Indstillinger i halo-gen2-v26's printguide. Eller indlæs `selfi-stativbeslag-v4.stl`, `_logo-hvid.stl` og `_logo-groen.stl` samlet (samme nulpunkt) og giv logodelene filament 2 og 3. Der er plads til prime tower (115 mm fri på tværs).
- Textured PEI, som fronten, så logoet bliver pænt.
- 5 vægge og 40 % gyroid (ligger i 3MF'en); hylden og låsetungerne bærer hele boksen. Tør ASA'en (4–8 timer ved 80 °C) før print.
- **Support: fra.** v4 har ingen flader, der skal have support. Hylden er en lodret væg, hullerne er dråber, og slidsen til strømstikket ender i en lav bue.

## Købedele

| Del | Antal | Note |
|---|---|---|
| T-møtrik 1/4"-20 UNC (Einschlagmutter), stål | 1 | CAD regner med rør Ø8 × 8 mm og flange op til Ø19,5. **Mål den købte, før print**, og ret `TNUT` i gen2_concept.scad, hvis den er anderledes. |
| Låseskrue Bolte 88115 (DIN 7982 ST4,2 × 25, Torx med pin) | 2 | De samme som på vægbeslaget |
| Magnet Ø8 × 3 | 1 | Den samme som på vægbeslaget (til reed-alarmen) |
| Sandsæk 5 kg til stativkrogen | 1 | Se Stabilitet |

## Samling (hos os, før udlejning)

1. Bank T-møtrikken ned i hullet ovenfra med flangen opad, til flangen ligger i bund.
2. Pres magneten i lommen i låsetungen (som på vægbeslaget).
3. Skru stativets lynplade i T-møtrikken nedefra, **på tværs af boksen** (lang side fra side til side), så klemmen går fri af strømstikket bag den.
4. Sæt boksen på som på væggen: hold bunden ca. 2 cm ud fra beslaget, sænk toppen, så rillen går ned over skinnen, og sving bunden ind, så begge låsetunger går ind i slidserne og boksen står på hylden. Skru begge låseskruer op gennem bunden i tungerne, til boksen sidder helt fast.
5. Boks + beslag + lynplade sendes samlet. Kunden stiller stativet op, klikker lynpladen i kuglehovedet og spænder knappen. Strømstikket sættes i nedefra gennem slidsen.

## Stabilitet

- Boksen på beslaget: vægten går lige ned gennem hylden og T-møtrikken; skinne og låsetunge holder toppen som på væggen.
- Stativet: med lynpladen i 128 cm skal der ca. 5 N (et halvt kilo) til at vippe boks + stativ i toppen mod to ben, og ca. 11 N med 5 kg sandsæk på krogen (skøn: ben spredt 24°, ca. 45 cm radius). Beslaget kan ikke gøre stativet bredere, så guiden i kassen skal sige: **sandsæk på, benene helt ud, midtersøjlen nede, stativet op ad en væg eller i et hjørne.**

## Tjek på første print

- At Sirui-klemmen går fri af strømstikket med lynpladen på tværs (ca. 2 mm luft, hvis klemmen er 44 mm dyb; ikke målt).
- At bunden kan svinges ind over tungen uden at tage fat, og at boksen ikke kan rokke, når låseskruen er spændt.
- At T-møtrikken passer i hullerne, og at flangen kommer helt i bund (v4: dråbeformet sæde).
- At boks + beslag passer i boks-kasse v2: med beslaget er boksen 74,5 mm dyb og 320 mm høj, plus lynpladen under.
- Træk-test: boksen på stativet, løft i hjørnerne og skub fra siden.
