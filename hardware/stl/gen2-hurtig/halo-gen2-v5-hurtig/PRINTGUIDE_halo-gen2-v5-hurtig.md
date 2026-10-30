# Selfi Halo halo-gen2-v5, hurtigprint: printguide

**Version:** halo-gen2-v5-hurtig. Kun til prototype- og pasformsprøver. Geometrien er den samme som i de normale printfiler for halo-gen2-v5 (`hardware/stl/gen2/halo-gen2-v5/`); kun printindstillingerne er anderledes, og der er små prøvestykker skåret ud af delene. Reglerne står i `hardware/docs/HURTIGPRINT.md`. **Brug aldrig disse filer til en boks, der skal ud til en kunde.**

Lavet med `python3 hardware/tools/make_hurtig.py halo-gen2-v5`. Tiderne er skøn fra PrusaSlicer med H2C-lignende hastigheder; Bambu Studio viser de rigtige tider.

## Hele dele

| Fil | Mål på pladen (mm) | Ca. tid | Ca. PLA |
|---|---|---|---|
| `halo-gen2-v5-hurtig_skal.stl` | 222.5 × 306.0 × 64.0 | 8 t 24 min | 369 g |
| `halo-gen2-v5-hurtig_front.stl` | 222.5 × 306.0 × 27.7 | 2 t 59 min | 156 g |
| `halo-gen2-v5-hurtig_bagramme.stl` | 208.5 × 295.7 × 27.5 | 2 t 49 min | 147 g |
| `halo-gen2-v5-hurtig_lysring.stl` | 205.1 × 288.6 × 4.7 | 34 min | 30 g |
| `halo-gen2-v5-hurtig_vaegbeslag.stl` | 131.0 × 276.0 × 29.0 | 1 t 23 min | 66 g |
| `halo-gen2-v5-hurtig_printerdaeksel.stl` | 21.6 × 23.4 × 5.2 | 2 min | 1 g |

Fronten har en 0,8 mm tom fordybning, hvor logoet sidder i den normale version. Den printes i én farve uden AMS.

## Prøvestykker

Hvert prøvestykke er en kasse skåret ud af en del, så det passer præcis til denne version. Det står på den samme flade som delen, så det printes uden support. Prøvestykker med samme navn og flere dele (fx `kamera`, `hjoerne`) lægges sammen.

| Fil | Mål (mm) | Ca. tid | Hvad prøves |
|---|---|---|---|
| `halo-gen2-v5-hurtig_proeve-stroem-ledstyring.stl` | 144 × 125 × 35 | 1 t 30 min | 5 V-forsyningen og WLED-styringen klikkes i deres bakker. Sidder de fast, også når stykket vendes? |
| `halo-gen2-v5-hurtig_proeve-daemper.stl` | 28 × 60 × 42 | 20 min | Dæmperen (DFR0457) i bakken på venstre væg. Er der plads til skrueklemmen? |
| `halo-gen2-v5-hurtig_proeve-stroemindgang.stl` | 30 × 84 × 22 | 19 min | Hunstikket (124-538) klikker forbi læberne, og GST-stikket sidder fast mellem ribberne. |
| `halo-gen2-v5-hurtig_proeve-hoejttaler.stl` | 82 × 47 × 25 | 39 min | Højttaleren (FIT0502) i sin bakke bag gitteret. |
| `halo-gen2-v5-hurtig_proeve-laas-reed.stl` | 52 × 69 × 19 | 19 min | Låseslidsen, låseskruens hul i bunden og reed-modulets bakke. Prøves med vægbeslagets låsetunge. |
| `halo-gen2-v5-hurtig_proeve-laasetunge.stl` | 31 × 29 × 29 | 11 min | Låsetungen på vægbeslaget. Den skal gå ind i skallens låseslids, og låseskruen skal kunne skrues i. |
| `halo-gen2-v5-hurtig_proeve-4g.stl` | 48 × 81 × 21 | 21 min | 4G-modemet i sin bakke (tilvalg). |
| `halo-gen2-v5-hurtig_proeve-mikrofonkerne.stl` | 68 × 86 × 18 | 25 min | Mikrofon-kernen (XVF3800) i sin bakke (tilvalg). |
| `halo-gen2-v5-hurtig_proeve-stoedsensor.stl` | 34 × 41 × 10 | 7 min | Stødsensoren (LIS3DH) i sin bakke (tilvalg). |
| `halo-gen2-v5-hurtig_proeve-mikrofonstrip.stl` | 126 × 16 × 28 | 18 min | Mikrofonstrippen i de to kroge under toppen, ud for hullerne (tilvalg). |
| `halo-gen2-v5-hurtig_proeve-kamera_front.stl` | 83 × 37 × 28 | 22 min | Kameraet på frontens tappe, linsen midt i hullet, bagrammens rør trykker printet ned, kamerakablet gennem slidsen og de tre klikstik i deres lommer. Front og bagramme lægges sammen. |
| `halo-gen2-v5-hurtig_proeve-kamera_bagramme.stl` | 83 × 27 × 28 | 25 min |  |
| `halo-gen2-v5-hurtig_proeve-hjoerne_skal.stl` | 65 × 65 × 64 | 46 min | Ét hjørne af hele stakken: skal over front, lysringens hjørne i slidsen, bagrammens øre og én frontskrue (3,0 × 15) skruet i bagfra. Er skyggefugen mellem skal og front jævn? |
| `halo-gen2-v5-hurtig_proeve-hjoerne_front.stl` | 65 × 65 × 28 | 20 min |  |
| `halo-gen2-v5-hurtig_proeve-hjoerne_bagramme.stl` | 58 × 58 × 28 | 16 min |  |
| `halo-gen2-v5-hurtig_proeve-hjoerne_lysring.stl` | 57 × 56 × 5 | 4 min |  |
| `halo-gen2-v5-hurtig_proeve-skaerm-lysring.stl` | 222 × 306 × 7 | 1 t 46 min | De nederste 7 mm af fronten: skærmglasset mellem de 8 ribber, lysringen i slidsen (skyggefuge 0,15 mm) og kamerahullet. Lysringen printes hel. |

## Indstillinger (Bambu Studio)

Start fra **0.28mm Extra Draft** til H2C og **Bambu PLA Basic** (eller anden PLA). Ret dette:

- Vægge (wall loops): **2**. Top- og bundlag: **3**.
- Fyld (sparse infill): **10 %, Grid**.
- Første lag 0,2 mm. Ingen ironing, ingen musøre, ingen brim.
- Support kun til skallen: *Tree*, kun fra pladen (som den normale skal).
- Ingen "hole compensation" eller skalering.
- PLA: lågen eller toppen må gerne stå åben. Ingen opvarmning af kammeret.
- Front, lysring og `skaerm-lysring`: print med **0,2 mm** lag, når lysringens skyggefuge eller kravens trin skal vurderes.
- Printretning som filerne ligger. Flyt eller vend dem ikke.

## Husk

- PLA krymper mindre end ASA. En lomme, der lige netop passer i PLA, kan blive for stram i ASA. Er en pasform stram (0,3 mm luft eller mindre), så tjek den til sidst i ASA med den normale printfil.
- Bland ikke PLA- og ASA-dele i samme samling. Over 300 mm kan forskellen i krympning blive op til ca. 1 mm.
- Skruer: frontskruer og låseskrue kan skrues i PLA til prøve, men skru dem ikke i og ud mange gange.
- Ret aldrig en fejl i en hurtigfil. Ret CAD (`hardware/cad/gen2_concept.scad`), lav en ny version og kør værktøjet igen.
