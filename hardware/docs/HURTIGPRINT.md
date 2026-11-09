# Hurtigprint: regler for prototype- og pasformsprint

Til prototype/MVP, når en ændring skal prøves hurtigst muligt: passer delene i deres pladser, kan boksen samles, går skruerne i. Holdbarhed, vejrsikring og pæne flader er ligegyldige her. Gælder alle gen 2-versioner (halo-gen2-v5 og frem).

## 1. Tegningerne laves aldrig om

Hurtigsættet er de normale printfiler 1:1. Al pasform bevares: huller, skruestolper, bakker, læber, ribber, slidser, lommer, tappe og luft (fx 0,15 mm skyggefuge, 0,2 mm ved skærmglasset). Der findes ingen separat hurtig-CAD.

**Hvorfor:** en særskilt hurtigmodel ville glide væk fra den rigtige, og så tester man noget andet end det, der skal leveres.

Tiden spares to steder, i denne rækkefølge:

1. **Print kun det, der skal prøves (prøvestykker).** Et prøvestykke er en kasse skåret ud af den rigtige del rundt om det sted, hvor noget skal passe. Det tager typisk 10–45 minutter, hvor hele delen tager 3–16 timer.
2. **Kladdeprofil.** 0,28 mm lag, 2 vægge, 3 top- og bundlag og 10 % fyld. Det giver ca. halv tid på hele dele.

Fra v34 til v58 blev alle dele printet i PLA; fra v59 (slim18) printes alle dele i ASA (lysringen i klar PETG), også de normale, så hurtigprint og normalt print er samme materiale. ASA-pladserne har krympekompensation 99,6 % (make_3mf.ASA_SHRINK), så ASA-delene får samme mål som PLA-delene, pasformene blev prøvet på.

## 2. Prøvestykker

- De laves af værktøjet `hardware/tools/make_hurtig.py` ud fra versionens printfiler og 3D-model (`<version>_3d.glb`). Listen over prøvestykker står øverst i værktøjet (`COUPONS`).
- Kassen går mindst 8 mm uden om købedelen. Den går altid helt ned til den flade, delen står på i sin printretning. Stykket printes derfor fladt, uden support og i den samme retning som den rigtige del.
- Dele, der hænger i luften efter snittet, fjernes automatisk. Værktøjet skriver, hvor meget der blev fjernet.
- Skal noget prøves mod en anden printet del (fx kamera mod bagramme, eller hjørnet med frontskruen), skæres samme kasse ud af begge dele, så stykkerne kan lægges sammen.
- Når en ny bakke eller lomme kommer til, tilføjes en linje i `COUPONS` med navn, del, købedelens node i 3D-modellen og hvad der prøves. Er stedet ændret i den nye version, kommer det også i `GROUP` (plade 1).
- Hvert prøvestykke og hver hel del er et Bambu Studio-projekt (3MF) med kladdeindstillingerne indbygget, som de normale 3MF'er fra `make_3mf.py`. Skallens support-enforcere og -blockere og stativbeslagets massive hylde følger med ind i de stykker, de rører; de forstærkede hjørner (v37) gør ikke, for de ændrer ikke pasformen.
- **Prøveplader** (fra v37): alle stykker af samme farve og gruppe ligger på én plade (`<version>-hurtig_plade<N>-<gruppe>_<farve>.3mf`), så en plade er ét print. Plade 1 er det, versionen har ændret, plade 2 resten, plade 3 tilvalg og skærmens kant.

## 3. Navne og mapper

- Mappe: `hardware/stl/gen2-hurtig/<version>-hurtig/` i repoet og `/mnt/project-files/gen2-hurtigprint/<version>-hurtig/` i projektmappen. Aldrig i `hardware/stl/gen2/` eller `gen2-printfiler/`, så de normale printfiler ikke bliver blandet sammen med dem.
- Filnavne: `<version>-hurtig_<del>.stl/.3mf` for hele dele og `<version>-hurtig_proeve-<navn>[_<del>].stl/.3mf` for prøvestykker. Printguide: `PRINTGUIDE_<version>-hurtig.md`, alt samlet i `<version>-hurtig.zip`.
- Fronten og stativbeslaget er uden logo i hurtigsættet (fordybningen står tom). Skal logoet med, bruges versionens normale `_flerfarvet.3mf`.
- De normale printfiler ændres aldrig af hurtigsættet.

## 4. Ny version

1. Ret CAD (`hardware/cad/gen2_concept.scad`) og udgiv den normale version som altid (`hardware/stl/gen2/halo-gen2-vN/`).
2. Ret `COUPONS` og `GROUP` i `make_hurtig.py` til det, versionen har ændret, og kør `python3 hardware/tools/make_hurtig.py halo-gen2-vN`. Med `prusa-slicer` installeret skriver værktøjet også skønnede printtider i printguiden.
3. Tjek 3MF'erne med `hardware/tools/check_3mf.py` og se prøvestykkerne igennem (fx i Bambu Studio). Kopier mappen til projektmappen.

Find en fejl på et hurtigprint, så ret den i CAD og lav en ny version. Ret aldrig en hurtigfil.

## 5. Printindstillinger (Bambu Studio, H2C, 0,4-dyse)

| | Hurtig | Normal (til sammenligning) |
|---|---|---|
| Lag | 0,28 mm (lysringen 0,2) | 0,2 mm (bagramme og vægbeslag 0,28, lysring 0,16) |
| Vægge | 2 | 2–3 (hjørner 4, stativbeslagets hylde 6) |
| Top/bund | 3/3 (mindst 0,8 mm) | 4/3–4 |
| Fyld | 10 % crosshatch | 15 % crosshatch, beslag 30–40 % gyroid |
| Filament | ASA fra v59, krympning 99,6 % (lysringen klar PETG) | Samme |
| Logo | Ingen (brug den normale `_flerfarvet.3mf`) | AMS, 3 farver |
| Support | Kun skallen, ved de samme enforcere | Samme |

- Brug 0,2 mm lag til front, lysring og `proeve-skaerm-lysring`, når lysringens skyggefuge eller kravens trin skal vurderes. Ved 0,28 mm kan højder i Z flytte sig op til et halvt lag.
- En 0,6-dyse giver kun lidt (skallen ca. 7–8 t mod 8,5 t) og er ikke besværet med at skifte dyse værd.
- 1 væg sparer mere tid, men bakkernes læber og skruestolperne knækker. Brug den ikke.

## 6. Hvad hurtigprint ikke kan vise

- 0,28 mm lag kan flytte en højde op til et halvt lag (0,14 mm). En pasform på 0,2 mm eller mindre i højden (klik, skyggefuge) bedømmes til sidst på et normalt print.
- Et prøvestykke er stivere end den hele del, så klikkraft og hvor meget en væg giver efter bedømmes på det hele print.
- Styrke, fald (de forstærkede hjørner), lys gennem lysringen og reflektorens hvidhed testes kun på normale print.
- Skruer kan skrues i til prøve, men ikke ind og ud mange gange.
