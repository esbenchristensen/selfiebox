# Hurtigprint: regler for prototype- og pasformsprint

Til prototype/MVP, når en ændring skal prøves hurtigst muligt: passer delene i deres pladser, kan boksen samles, går skruerne i. Holdbarhed, vejrsikring og pæne flader er ligegyldige her. Gælder alle gen 2-versioner (halo-gen2-v5 og frem).

## 1. Tegningerne laves aldrig om

Hurtigsættet er de normale printfiler 1:1. Al pasform bevares: huller, skruestolper, bakker, læber, ribber, slidser, lommer, tappe og luft (fx 0,15 mm skyggefuge, 0,2 mm ved skærmglasset). Der findes ingen separat hurtig-CAD.

**Hvorfor:** en særskilt hurtigmodel ville glide væk fra den rigtige, og så tester man noget andet end det, der skal leveres.

Tiden spares tre steder, i denne rækkefølge:

1. **Print kun det, der skal prøves (prøvestykker).** Et prøvestykke er en kasse skåret ud af den rigtige del rundt om det sted, hvor noget skal passe. Det tager typisk 10–45 minutter, hvor hele delen tager 3–16 timer.
2. **Kladdeprofil.** 0,28 mm lag, 2 vægge, 3 top- og bundlag og 10 % fyld. Det giver ca. halv tid på hele dele.
3. **PLA i stedet for ASA.** Der er ingen opvarmning af kammeret, ingen afkøling og intet AMS-logo.

## 2. Prøvestykker

- De laves af værktøjet `hardware/tools/make_hurtig.py` ud fra versionens printfiler og 3D-model (`<version>_3d.glb`). Listen over prøvestykker står øverst i værktøjet (`COUPONS`).
- Kassen går mindst 8 mm uden om købedelen. Den går altid helt ned til den flade, delen står på i sin printretning. Stykket printes derfor fladt, uden support og i den samme retning som den rigtige del.
- Dele, der hænger i luften efter snittet, fjernes automatisk. Værktøjet skriver, hvor meget der blev fjernet.
- Skal noget prøves mod en anden printet del (fx kamera mod bagramme, eller hjørnet med frontskruen), skæres samme kasse ud af begge dele, så stykkerne kan lægges sammen.
- Når en ny bakke eller lomme kommer til, tilføjes en linje i `COUPONS` med navn, del, købedelens node i 3D-modellen og hvad der prøves.

## 3. Navne og mapper

- Mappe: `hardware/stl/gen2-hurtig/<version>-hurtig/` i repoet og `/mnt/project-files/gen2-hurtigprint/<version>-hurtig/` i projektmappen. Aldrig i `hardware/stl/gen2/` eller `gen2-printfiler/`, så de normale printfiler ikke bliver blandet sammen med dem.
- Filnavne: `<version>-hurtig_<del>.stl` for hele dele og `<version>-hurtig_proeve-<navn>[_<del>].stl` for prøvestykker. Printguide: `PRINTGUIDE_<version>-hurtig.md`.
- De normale printfiler ændres aldrig af hurtigsættet.

## 4. Ny version

1. Ret CAD (`hardware/cad/gen2_concept.scad`) og udgiv den normale version som altid (`hardware/stl/gen2/halo-gen2-vN/`).
2. Kør `python3 hardware/tools/make_hurtig.py halo-gen2-vN`. Med `prusa-slicer` installeret skriver værktøjet også skønnede printtider i printguiden.
3. Se prøvestykkerne igennem (fx i Bambu Studio). Kopier mappen til projektmappen.

Find en fejl på et hurtigprint, så ret den i CAD og lav en ny version. Ret aldrig en hurtigfil.

## 5. Printindstillinger (Bambu Studio, H2C, 0,4-dyse)

| | Hurtig | Normal (til sammenligning) |
|---|---|---|
| Profil | 0.28mm Extra Draft | 0,16–0,2 mm |
| Vægge | 2 | 4–6 |
| Top/bund | 3/3 | 5–6 |
| Fyld | 10 % Grid | 20 % gyroid, beslag 100 % |
| Filament | PLA, låge/top åben | ASA, kammer 60 °C |
| Logo | Intet (én farve) | AMS, 3 farver |
| Support | Kun skallen, tree fra pladen | Samme |

- Brug 0,2 mm lag til front, lysring og `proeve-skaerm-lysring`, når lysringens skyggefuge eller kravens trin skal vurderes. Ved 0,28 mm kan højder i Z flytte sig op til et halvt lag.
- En 0,6-dyse giver kun lidt (skallen ca. 7–8 t mod 8,5 t) og er ikke besværet med at skifte dyse værd.
- 1 væg sparer mere tid, men bakkernes læber og skruestolperne knækker. Brug den ikke.

## 6. Hvad hurtigprint ikke kan vise

- **PLA krymper mindre end ASA.** En PLA-lomme bliver ca. 0,2–0,3 % større end den samme lomme i ASA, hvilket er ca. 0,3 mm på en 108 mm bakke. Stram pasform (0,3 mm luft eller mindre) tjekkes til sidst i ASA med den normale fil.
- Bland ikke PLA- og ASA-dele i samme samling. Over 300 mm kan forskellen blive op til ca. 1 mm.
- Styrke, vejr/sprøjtetest, lys gennem lysringen (natur-ASA) og reflektorens hvidhed testes kun på normale print.
- Skruer kan skrues i PLA til prøve, men ikke ind og ud mange gange.
