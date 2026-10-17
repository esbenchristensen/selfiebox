# Selfi-film

To film med dansk tekst på skærmen og dansk speak (stemmen Mathias fra ElevenLabs). Begge vises med `components/Explainer.tsx` i sektionen "Se filmen".

| Film | Side | Kilde | Filer i `public/video/` |
|---|---|---|---|
| Privat leje | `/` | `explainer.html` | `selfi-explainer-*` |
| Erhverv | `/erhverv` | `erhverv.html` | `selfi-erhverv-*` |

Begge bruger `shared.css` og `shared.js` (farver, fonte, boksen, tidslinjen).

## Privat leje

- `public/video/selfi-explainer-wide.mp4` er 16:9, 1920 × 1080, til desktop
- `public/video/selfi-explainer-tall.mp4` er 4:5, 1080 × 1350, til mobil (og fint til Instagram og Facebook)
- `.webm` med samme navn er en reserve til browsere uden H.264
- `.jpg` med samme navn er plakatbilledet, før filmen starter

Længde: 78,4 sekunder, 30 fps, med speak.

## Scener og tider

| Tid | Scene | Tekst på skærmen |
|---|---|---|
| 0:00–0:06.2 | Intro | Fotoboks til leje. "Lej en fotoboks, der får alle med på billedet." |
| 0:06.2–0:13.8 | Hvorfor | "Det bedste billede fra festen er det, hvor alle er med." |
| 0:13.8–0:25.1 | 01 Vælg jeres dage | "Vælg dagene i kalenderen." En dag 495 kr., en weekend 750 kr. og en uge 1.250 kr., altid inkl. moms. Vi bekræfter på mail. |
| 0:25.1–0:32.7 | 02 Få boksen ud til festen | "Hent den, eller få den leveret." Stander og en almindelig stikkontakt. Afhent selv, levering, levering og opsætning. |
| 0:32.7–0:44.5 | 03 Tryk og smil | "Et tryk, og ringen tæller ned fra 3." Hvidt studielys, ingen blitz i øjnene. |
| 0:44.5–0:54.7 | 04 Billedet med hjem | "Billedet ligger på telefonen med det samme." QR-kode, SMS, eventside, Instax-print med fotomodulet. |
| 0:54.7–1:01.9 | Temaer | "En boks, der ser ud som jeres fest." Bryllup, fødselsdag, julefrokost. |
| 1:01.9–1:12.0 | Pris | "Fra 495 kr. inkl. moms." Ubegrænsede billeder, studielys, stander, eventside. |
| 1:12.0–1:18.4 | Afslutning | "Se ledige datoer på selfi.dk" |

## Erhverv

Længde: 72,7 sekunder, med speak. Stederne i filmen (Kælderbaren, Hotel Fjord, Skovfest) er opdigtede med vilje. Så viser filmen, hvad et tema kan, uden at det ligner, at et rigtigt sted er kunde.

| Tid | Scene | Tekst på skærmen |
|---|---|---|
| 0:00–0:06.4 | Intro | Til barer, klubber og hoteller. "En fotoboks, der får gæsterne til at komme igen." |
| 0:06.4–0:17.1 | 01 Jeres stil | "Boksen bliver jeres." Boksen skifter til Kælderbarens design: lysring, sider og top, skærm, fotoramme. |
| 0:17.1–0:25.6 | Til ethvert sted | "Fra bodegaen til festivalen." Vi designer temaet med jer og printer delene selv. Tre eksempler. |
| 0:25.6–0:34.2 | 02 Gæsterne | "Hvert billede bærer jeres navn." Nedtælling, studielys, print og deling med navnet i rammen. |
| 0:34.2–0:44.0 | 03 Gæstelisten | "En gæsteliste, I må bruge." Nummer for SMS og et særskilt ja til tilbud. |
| 0:44.0–0:54.5 | 04 Fuld service | "Vi sørger for alt." Det klarer vi: seks ting. Det klarer I: "Holder åbent, som I plejer." |
| 0:54.5–1:04.9 | Pris | "Én fast pris om måneden." 995 kr./md. pr. boks, ekskl. moms. |
| 1:04.9–1:12.7 | Afslutning | "Book en snak på selfi.dk/erhverv" |

## Ændre filmen

Alt er tegnet i `explainer.html` og `erhverv.html` med sidens farver og fonte. Hver scene har en længde (`dur`) og tider for, hvornår tingene kommer ind (`data-in`). Hvis speaken skal have mere tid et sted, så gør scenens `dur` længere og render igen.

Se den i browseren: åbn `explainer.html?format=wide&play` (eller `format=tall`) fra en lokal server i `web/`, fx `npx http-server web`. Med `&t=30` står den stille på sekund 30.

Render (kræver Playwright med Chromium og ffmpeg):

```sh
cd web/video
NODE_PATH=$(npm root -g) node render.cjs                 # privatfilmen, begge formater
NODE_PATH=$(npm root -g) node render.cjs erhverv         # erhvervsfilmen
NODE_PATH=$(npm root -g) node render.cjs erhverv tall    # kun ét format
```

Scriptet laver også WebM-reserven og plakatbilledet.

## Speak

Replikkerne står i `voiceover.json`, én pr. scene. Tal og domæner er skrevet, som de skal udtales. `voice.cjs` laver lyden med ElevenLabs (`eleven_multilingual_v2`, stemmen Mathias, tempo 1,1) og lægger klippene i `voice/<film>/`. Et klip laves kun igen, når teksten, stemmen eller indstillingerne ændres. Bagefter lægger `render.cjs` hver replik ind 0,5 sekund inde i sin scene og normaliserer lyden. En scene forlænges, hvis repliken er længere end scenen.

```sh
cd web/video
NODE_USE_ENV_PROXY=1 ELEVENLABS_API_KEY=... node voice.cjs   # efter en rettelse i voiceover.json
NODE_PATH=$(npm root -g) node render.cjs                      # og render filmene igen
```

128 kbps er det bedste format uden abonnement. Med Creator kan du sætte `FORMAT=mp3_44100_192`.

På siden starter filmen uden lyd, fordi browsere kun selv afspiller video uden lyd. Knappen "Slå lyd til" afspiller den forfra med speak.
