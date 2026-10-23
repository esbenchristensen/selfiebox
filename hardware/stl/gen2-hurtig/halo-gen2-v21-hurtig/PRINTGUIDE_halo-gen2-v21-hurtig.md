# Selfi Halo halo-gen2-v21, hurtigprint: printguide

**Version:** halo-gen2-v21-hurtig. Kun til prototype- og pasformsprøver. Geometrien er den samme som i de normale printfiler for halo-gen2-v21 (`hardware/stl/gen2/halo-gen2-v21/`); kun printindstillingerne er anderledes, og der er små prøvestykker skåret ud af delene. Reglerne står i `hardware/docs/HURTIGPRINT.md`. **Brug aldrig disse filer til en boks, der skal ud til en kunde.**

Lavet med `python3 hardware/tools/make_hurtig.py halo-gen2-v21`. Tiderne er skøn fra PrusaSlicer med H2C-lignende hastigheder; Bambu Studio viser de rigtige tider.

## Hele dele

| Fil | Mål på pladen (mm) | Ca. tid | Ca. PLA |
|---|---|---|---|
| `halo-gen2-v21-hurtig_skal.stl` | 224.5 × 307.0 × 64.0 | – | – |
| `halo-gen2-v21-hurtig_front.stl` | 224.5 × 307.0 × 27.7 | – | – |
| `halo-gen2-v21-hurtig_bagramme.stl` | 217.1 × 300.0 × 29.2 | – | – |
| `halo-gen2-v21-hurtig_lysring.stl` | 209.1 × 291.6 × 8.7 | – | – |
| `halo-gen2-v21-hurtig_vaegbeslag.stl` | 157.0 × 276.0 × 29.0 | – | – |
| `halo-gen2-v21-hurtig_kameraroer.stl` | 11.6 × 11.6 × 4.5 | – | – |
| `halo-gen2-v21-hurtig_tema-vinge-venstre-eksempel.stl` | 61.9 × 170.0 × 82.2 | – | – |

## Front med logo

Logoet er ikke en del af `_front.stl`. Fronten har en 0,8 mm fordybning, og logoet ligger i to separate filer, én pr. farve, fordi en slicer skal have én krop for hver farve. Printes `_front.stl` alene, kommer fronten ud uden logo.

**Nemmest: åbn `halo-gen2-v21-hurtig_front_flerfarvet.3mf`** i Bambu Studio (File > Open Project, eller træk den ind). Den indeholder fronten og logoet som ét objekt med tre dele, der allerede ligger på plads, og farverne er sat til AMS-plads 1 = sort (front), 2 = hvid (logo) og 3 = grøn (prikkerne). Læg filamentet i de pladser og tryk på synk-knappen ved "Filament" (Sync AMS), så alle tre pladser får de rigtige spoler. Filen har ingen materialer, så uden synk bruger Bambu de filamenter, der tilfældigvis står på plads 1–3, og de kan være forskellige. Vælg printer og profil som normalt, og slice. Der er ingen printer- eller profilindstillinger i filen.

**Alternativt med STL:** træk `halo-gen2-v21-hurtig_front.stl`, `halo-gen2-v21-hurtig_logo-hvid.stl` og `halo-gen2-v21-hurtig_logo-groen.stl` ind på én gang og svar **Ja**, når Bambu Studio spørger, om de skal indlæses som ét objekt med flere dele. De har samme nulpunkt, så logoet lander præcis i fordybningen. Flyt ikke delene hver for sig. Giv derefter hver del sin farve i objektlisten.

- Lag på 0,2 mm (ikke 0,28), så logoet er præcis de første 4 lag. Brug 0,4-dysen; logoets mindste detalje er ca. 1 mm.
- Prime tower til og "Flush into object's infill" til. Ca. 12 farveskift og 10–15 g spild.
- Alle tre dele skal være samme materiale (PLA), ellers hæfter logoet ikke i fronten.
- Hvis I ikke har brug for logoet på prøven, kan `_front.stl` printes alene i én farve uden AMS.

## Prøvestykker

Hvert prøvestykke er en kasse skåret ud af en del, så det passer præcis til denne version. Det står på den samme flade som delen, så det printes uden support. Prøvestykker med samme navn og flere dele (fx `kamera`, `hjoerne`) lægges sammen.

| Fil | Mål (mm) | Ca. tid | Hvad prøves |
|---|---|---|---|
| `halo-gen2-v21-hurtig_proeve-stroem-ledstyring.stl` | 145 × 144 × 32 | – | 5 V-forsyningen og WLED-styringen klikkes i deres bakker. v17: WLED-styringen med udgangen opad; går den ned, klikker kanterne over låget, og står den fast på langs mellem de 2 stop ved armspidserne? Sidder begge fast, også når stykket vendes? |
| `halo-gen2-v21-hurtig_proeve-daemper.stl` | 28 × 60 × 42 | – | Dæmperen (DFR0457) i bakken på venstre væg. Er der plads til skrueklemmen? |
| `halo-gen2-v21-hurtig_proeve-stroemindgang.stl` | 29 × 86 × 22 | – | Røret i bunden: hunstikket (TRU DC-13F) trykkes ned ovenfra og klikker under de 2 snaplåse, og GST-proppen går helt op i røret nedefra. |
| `halo-gen2-v21-hurtig_proeve-hoejttaler.stl` | 83 × 47 × 25 | – | Højttaleren (FIT0502) i sin bakke bag gitteret. v20: læg snoren i rillen rundt om gitteret først. Klikker krogene stadig over flangen, og ligger flangen helt inde mod væggen (v21: intet slør)? |
| `halo-gen2-v21-hurtig_proeve-laas-reed.stl` | 52 × 69 × 19 | – | Låseslidsen, låseskruens hul i bunden og reed-modulets bakke. Prøves med vægbeslagets låsetunge. v20: lommen inde om tungen er lukket; går tungen frit ind og op, og er drænhullet i bunden åbent? |
| `halo-gen2-v21-hurtig_proeve-laasetunge.stl` | 31 × 29 × 29 | – | Låsetungen på vægbeslaget. Den skal gå ind i skallens låseslids, og låseskruen skal kunne skrues i. |
| `halo-gen2-v21-hurtig_proeve-4g.stl` | 48 × 81 × 18 | – | 4G-modemet i sin bakke (tilvalg). |
| `halo-gen2-v21-hurtig_proeve-mikrofonkerne.stl` | 86 × 68 × 22 | – | Mikrofon-kernen (XVF3800) ligger ned i sin bakke, og stikket i underkanten går fri gennem åbningen (tilvalg). |
| `halo-gen2-v21-hurtig_proeve-stoedsensor.stl` | 34 × 41 × 15 | – | Stødsensoren (LIS3DH) i sin bakke (tilvalg). |
| `halo-gen2-v21-hurtig_proeve-mikrofonstrip.stl` | 126 × 13 × 64 | – | Mikrofonkortet i lommen i bunden med Seeed-logoet nedad: pindene gennem hullerne, kortet fladt på de 4 ringe, kablet fladt ud bagtil (tilvalg). |
| `halo-gen2-v21-hurtig_proeve-vingelomme.stl` | 28 × 34 × 14 | – | v21: den øverste venstre vingeslids (9 × 14) med den lukkede lomme bagved og drænhullet i bunden. Prøv eksempelvingens øverste krog: løft 3 mm, skub ind og lad den falde ned på slidsens bund. Går krogen ind uden at tvinge, står tungen på bunden, og sidder læben bag væggen, så den ikke kan trækkes lige ud? Hæld lidt vand i slidsen: løber det ud af drænet? |
| `halo-gen2-v21-hurtig_proeve-kameravindue_front.stl` | 24 × 24 × 14 | – | v20: kameravinduet. Glasset Ø12 × 1,5 lægges i lommen bag den 0,6 mm kant, snor-ringen (ca. 35 mm snor, enderne stødt sammen) i hjørnet bag glasset. v21: tryk røret ind på sine 4 ribber, til det stopper på glasset. Sidder røret fast, og ligger glasset uden slør? Ses snoren ikke forfra? Mål glassets tykkelse: 1,2–1,8 mm går. |
| `halo-gen2-v21-hurtig_proeve-kameravindue_kameraroer.stl` | 12 × 12 × 5 | – |  |
| `halo-gen2-v21-hurtig_proeve-kamera_front.stl` | 83 × 37 × 28 | – | Kameraet på frontens tappe med glas, snor og rør foran linsen, linsen midt i hullet, bagrammens rør trykker printet ned, kamerakablet gennem slidsen og de fire klikstik i deres lommer (v18: hvid 3's stik i reflektoren til højre). Front og bagramme lægges sammen. |
| `halo-gen2-v21-hurtig_proeve-kamera_bagramme.stl` | 83 × 27 × 28 | – |  |
| `halo-gen2-v21-hurtig_proeve-lyskanal_bagramme.stl` | 66 × 64 × 29 | – | v18: lyskanalen uden klister, nederste venstre hjørne med ca. 10 cm strip-bane. Hvid 1 og 2: bagkanten ind under læben, forkanten trykkes ned mod væggen. RGB i den tætte bane bagerst. Hvid 3 i lommen i den skrå reflektor, bagkanten ind under læben. Læg lysringens stykke i, og pres bagrammen på: trykker ringens kile forkanten af hvid 3 ned? Kør en finger langs alle strips, også i hjørnet: bliver de liggende? Tænd strips og se efter skygger eller striber i lysringen. |
| `halo-gen2-v21-hurtig_proeve-lyskanal_lysring.stl` | 65 × 62 × 9 | – |  |
| `halo-gen2-v21-hurtig_proeve-hjoerne_skal.stl` | 66 × 66 × 64 | – | Ét hjørne af hele stakken: skal over front, lysringens hjørne i slidsen, bagrammens øre og én frontskrue (3,0 × 15) skruet i bagfra. Læg snoren i lommen ved lysringen (v21: ingen snor mellem skal og front, frontens ribbe går i skallens rille). Lukker skal og front helt (ingen fuge), sidder bagrammen fast (knusribberne på stolpen trykkes flade), og er snoren ved lysringen klemt? |
| `halo-gen2-v21-hurtig_proeve-hjoerne_front.stl` | 66 × 66 × 28 | – |  |
| `halo-gen2-v21-hurtig_proeve-hjoerne_bagramme.stl` | 60 × 62 × 29 | – |  |
| `halo-gen2-v21-hurtig_proeve-hjoerne_lysring.stl` | 59 × 58 × 9 | – |  |
| `halo-gen2-v21-hurtig_proeve-laas_front.stl` | 43 × 42 × 28 | – | v14: en sidelås (venstre side, nederste par): vinduet i indervæggen og i ydervæggen og bagrammens 2 arme. Klikker begge arme, kan de vippes fri med en lille skruetrækker, og ligger fjedertåen ned på et stykke glas eller plastik (1,1 mm) i frontens skærmlomme? |
| `halo-gen2-v21-hurtig_proeve-laas_bagramme.stl` | 30 × 42 × 29 | – |  |
| `halo-gen2-v21-hurtig_proeve-skaermhuller.stl` | 144 × 16 × 20 | – | v16: bagrammens nederste tværbjælke med de 2 nederste skruetårne (hele tårne, 1,6 mm bund, hul 3,5 mm på tværs). Læg den på skærmens bagside: står begge tårne ned på beslagene? Skru en M2,5 × 3-4 mm i hvert med en PH0/PH1. Går begge i uden at skulle tvinges, og tager de fat? |
| `halo-gen2-v21-hurtig_proeve-skaerm-lysring.stl` | 224 × 307 × 7 | – | De nederste 7 mm af fronten: den 1,6 mm tynde kant foran skærmen, rillen med snoren (v20: 2,0 × 1,0), skærmglasset mellem de 8 ribber, lysringen i slidsen (skyggefuge 0,15 mm) med snoren i lommen ved siden af, og kameravinduet. Læg snoren i rillen, læg skærmen i og tryk den ned: ligger glasset helt ind mod kanten hele vejen rundt? Lysringen printes hel. |

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
