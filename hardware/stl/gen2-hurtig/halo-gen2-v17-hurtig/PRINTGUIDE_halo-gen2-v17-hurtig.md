# Selfi Halo halo-gen2-v17, hurtigprint: printguide

**Version:** halo-gen2-v17-hurtig. Kun til prototype- og pasformsprøver. Geometrien er den samme som i de normale printfiler for halo-gen2-v17 (`hardware/stl/gen2/halo-gen2-v17/`); kun printindstillingerne er anderledes, og der er små prøvestykker skåret ud af delene. Reglerne står i `hardware/docs/HURTIGPRINT.md`. **Brug aldrig disse filer til en boks, der skal ud til en kunde.**

Lavet med `python3 hardware/tools/make_hurtig.py halo-gen2-v17`. Tiderne er skøn fra PrusaSlicer med H2C-lignende hastigheder; Bambu Studio viser de rigtige tider.

## Hele dele

| Fil | Mål på pladen (mm) | Ca. tid | Ca. PLA |
|---|---|---|---|
| `halo-gen2-v17-hurtig_skal.stl` | 222.5 × 306.0 × 64.0 | – | – |
| `halo-gen2-v17-hurtig_front.stl` | 222.5 × 306.0 × 27.7 | – | – |
| `halo-gen2-v17-hurtig_bagramme.stl` | 214.1 × 298.5 × 29.2 | – | – |
| `halo-gen2-v17-hurtig_lysring.stl` | 205.1 × 288.6 × 4.7 | – | – |
| `halo-gen2-v17-hurtig_vaegbeslag.stl` | 157.0 × 276.0 × 29.0 | – | – |
| `halo-gen2-v17-hurtig_printerdaeksel.stl` | 28.4 × 28.4 × 6.7 | – | – |

## Front med logo

Logoet er ikke en del af `_front.stl`. Fronten har en 0,8 mm fordybning, og logoet ligger i to separate filer, én pr. farve, fordi en slicer skal have én krop for hver farve. Printes `_front.stl` alene, kommer fronten ud uden logo.

**Nemmest: åbn `halo-gen2-v17-hurtig_front_flerfarvet.3mf`** i Bambu Studio (File > Open Project, eller træk den ind). Den indeholder fronten og logoet som ét objekt med tre dele, der allerede ligger på plads, og farverne er sat til AMS-plads 1 = sort (front), 2 = hvid (logo) og 3 = grøn (prikkerne). Læg filamentet i de pladser og tryk på synk-knappen ved "Filament" (Sync AMS), så alle tre pladser får de rigtige spoler. Filen har ingen materialer, så uden synk bruger Bambu de filamenter, der tilfældigvis står på plads 1–3, og de kan være forskellige. Vælg printer og profil som normalt, og slice. Der er ingen printer- eller profilindstillinger i filen.

**Alternativt med STL:** træk `halo-gen2-v17-hurtig_front.stl`, `halo-gen2-v17-hurtig_logo-hvid.stl` og `halo-gen2-v17-hurtig_logo-groen.stl` ind på én gang og svar **Ja**, når Bambu Studio spørger, om de skal indlæses som ét objekt med flere dele. De har samme nulpunkt, så logoet lander præcis i fordybningen. Flyt ikke delene hver for sig. Giv derefter hver del sin farve i objektlisten.

- Lag på 0,2 mm (ikke 0,28), så logoet er præcis de første 4 lag. Brug 0,4-dysen; logoets mindste detalje er ca. 1 mm.
- Prime tower til og "Flush into object's infill" til. Ca. 12 farveskift og 10–15 g spild.
- Alle tre dele skal være samme materiale (PLA), ellers hæfter logoet ikke i fronten.
- Hvis I ikke har brug for logoet på prøven, kan `_front.stl` printes alene i én farve uden AMS.

## Prøvestykker

Hvert prøvestykke er en kasse skåret ud af en del, så det passer præcis til denne version. Det står på den samme flade som delen, så det printes uden support. Prøvestykker med samme navn og flere dele (fx `kamera`, `hjoerne`) lægges sammen.

| Fil | Mål (mm) | Ca. tid | Hvad prøves |
|---|---|---|---|
| `halo-gen2-v17-hurtig_proeve-stroem-ledstyring.stl` | 145 × 144 × 31 | – | 5 V-forsyningen og WLED-styringen klikkes i deres bakker. v17: WLED-styringen med udgangen opad; går den ned, klikker kanterne over låget, og står den fast på langs mellem de 2 stop ved armspidserne? Sidder begge fast, også når stykket vendes? |
| `halo-gen2-v17-hurtig_proeve-daemper.stl` | 28 × 60 × 42 | – | Dæmperen (DFR0457) i bakken på venstre væg. Er der plads til skrueklemmen? |
| `halo-gen2-v17-hurtig_proeve-stroemindgang.stl` | 29 × 86 × 22 | – | Røret i bunden: hunstikket (TRU DC-13F) trykkes ned ovenfra og klikker under de 2 snaplåse, og GST-proppen går helt op i røret nedefra. |
| `halo-gen2-v17-hurtig_proeve-hoejttaler.stl` | 82 × 47 × 25 | – | Højttaleren (FIT0502) i sin bakke bag gitteret. |
| `halo-gen2-v17-hurtig_proeve-laas-reed.stl` | 52 × 69 × 19 | – | Låseslidsen, låseskruens hul i bunden og reed-modulets bakke. Prøves med vægbeslagets låsetunge. |
| `halo-gen2-v17-hurtig_proeve-laasetunge.stl` | 31 × 29 × 29 | – | Låsetungen på vægbeslaget. Den skal gå ind i skallens låseslids, og låseskruen skal kunne skrues i. |
| `halo-gen2-v17-hurtig_proeve-4g.stl` | 48 × 81 × 18 | – | 4G-modemet i sin bakke (tilvalg). |
| `halo-gen2-v17-hurtig_proeve-mikrofonkerne.stl` | 86 × 68 × 22 | – | Mikrofon-kernen (XVF3800) ligger ned i sin bakke, og stikket i underkanten går fri gennem åbningen (tilvalg). |
| `halo-gen2-v17-hurtig_proeve-stoedsensor.stl` | 34 × 41 × 15 | – | Stødsensoren (LIS3DH) i sin bakke (tilvalg). |
| `halo-gen2-v17-hurtig_proeve-mikrofonstrip.stl` | 126 × 13 × 64 | – | Mikrofonkortet i lommen i bunden med Seeed-logoet nedad: pindene gennem hullerne, kortet fladt på de 4 ringe, kablet fladt ud bagtil (tilvalg). |
| `halo-gen2-v17-hurtig_proeve-kamera_front.stl` | 83 × 37 × 28 | – | Kameraet på frontens tappe, linsen midt i hullet, bagrammens rør trykker printet ned, kamerakablet gennem slidsen og de tre klikstik i deres lommer. Front og bagramme lægges sammen. |
| `halo-gen2-v17-hurtig_proeve-kamera_bagramme.stl` | 83 × 27 × 27 | – |  |
| `halo-gen2-v17-hurtig_proeve-hjoerne_skal.stl` | 65 × 65 × 64 | – | Ét hjørne af hele stakken: skal over front, lysringens hjørne i slidsen, bagrammens øre og én frontskrue (3,0 × 15) skruet i bagfra. Er skyggefugen mellem skal og front jævn? |
| `halo-gen2-v17-hurtig_proeve-hjoerne_front.stl` | 65 × 65 × 28 | – |  |
| `halo-gen2-v17-hurtig_proeve-hjoerne_bagramme.stl` | 58 × 61 × 29 | – |  |
| `halo-gen2-v17-hurtig_proeve-hjoerne_lysring.stl` | 57 × 56 × 5 | – |  |
| `halo-gen2-v17-hurtig_proeve-laas_front.stl` | 42 × 42 × 28 | – | v14: en sidelås (venstre side, nederste par): vinduet i indervæggen og i ydervæggen og bagrammens 2 arme. Klikker begge arme, kan de vippes fri med en lille skruetrækker, og ligger fjedertåen ned på et stykke glas eller plastik (1,1 mm) i frontens skærmlomme? |
| `halo-gen2-v17-hurtig_proeve-laas_bagramme.stl` | 29 × 42 × 29 | – |  |
| `halo-gen2-v17-hurtig_proeve-skaermhuller.stl` | 144 × 16 × 20 | – | v16: bagrammens nederste tværbjælke med de 2 nederste skruetårne (hele tårne, 1,6 mm bund, hul 3,5 mm på tværs). Læg den på skærmens bagside: står begge tårne ned på beslagene? Skru en M2,5 × 3-4 mm i hvert med en PH0/PH1. Går begge i uden at skulle tvinges, og tager de fat? |
| `halo-gen2-v17-hurtig_proeve-skaerm-lysring.stl` | 222 × 306 × 7 | – | De nederste 7 mm af fronten: den 1,6 mm tynde kant foran skærmen, rillen med skumbåndet, skærmglasset mellem de 8 ribber, lysringen i slidsen (skyggefuge 0,15 mm) og kamerahullet. Klæb båndet i rillen, læg skærmen i og tryk den ned: ligger glasset helt ind mod kanten hele vejen rundt? Lysringen printes hel. |

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
