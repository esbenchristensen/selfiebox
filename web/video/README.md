# Selfi-film

To film med dansk tekst på skærmen og dansk speak (Jonas, Eleven v4) og baggrundsmusik (Eleven Music v2.5) fra ElevenLabs. Begge vises med `components/Explainer.tsx` i sektionen "Se filmen".

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

Længde: 53,6 sekunder, 30 fps, med speak og musik.

## Scener og tider

| Tid | Scene | Tekst på skærmen |
|---|---|---|
| 0:00–0:05.2 | Intro | Fotoboks til leje. "Lej en fotoboks, der får alle med på billedet." |
| 0:05.2–0:10.4 | Hvorfor | "Det bedste billede fra festen er det, hvor alle er med." |
| 0:10.4–0:16.7 | 01 Vælg jeres dage | "Vælg dagene i kalenderen." En dag 495 kr., en weekend 750 kr. og en uge 1.250 kr., altid inkl. moms. Vi bekræfter på mail. |
| 0:16.7–0:22.2 | 02 Få boksen ud til festen | "Hent den, eller få den leveret." Stander og en almindelig stikkontakt. Afhent selv, levering, levering og opsætning. |
| 0:22.2–0:30.2 | 03 Tryk og smil | "Et tryk, og ringen tæller ned fra 3." Hvidt studielys, ingen blitz i øjnene. |
| 0:30.2–0:37.3 | 04 Billedet med hjem | "Billedet ligger på telefonen med det samme." QR-kode, SMS, eventside, Instax-print med fotomodulet. |
| 0:37.3–0:43.3 | Temaer | "En boks, der ser ud som jeres fest." Bryllup, fødselsdag, julefrokost. |
| 0:43.3–0:49.9 | Pris | "Fra 495 kr. inkl. moms." Ubegrænsede billeder, studielys, stander, eventside. |
| 0:49.9–0:55.3 | Afslutning | "Se ledige datoer på selfi.dk" |

## Erhverv

Længde: 51,7 sekunder, med speak og musik. Stederne i filmen (Kælderbaren, Hotel Fjord, Skovfest) er opdigtede med vilje. Så viser filmen, hvad et tema kan, uden at det ligner, at et rigtigt sted er kunde.

| Tid | Scene | Tekst på skærmen |
|---|---|---|
| 0:00–0:04.7 | Intro | Til barer, klubber og hoteller. "En fotoboks, der får gæsterne til at komme igen." |
| 0:04.7–0:13.0 | 01 Jeres stil | "Boksen bliver jeres." Boksen skifter til Kælderbarens design: lysring, sider og top, skærm, fotoramme. |
| 0:13.0–0:19.5 | Til ethvert sted | "Fra bodegaen til festivalen." Vi designer temaet med jer og printer delene selv. Tre eksempler. |
| 0:19.5–0:26.7 | 02 Gæsterne | "Hvert billede bærer jeres navn." Nedtælling, studielys, print og deling med navnet i rammen. |
| 0:26.7–0:33.8 | 03 Gæstelisten | "En gæsteliste, I må bruge." Nummer for SMS og et særskilt ja til tilbud. |
| 0:33.8–0:41.0 | 04 Fuld service | "Vi sørger for alt." Det klarer vi: seks ting. Det klarer I: "Holder åbent, som I plejer." |
| 0:41.0–0:46.6 | Pris | "Én fast pris om måneden." 995 kr./md. pr. boks, ekskl. moms. |
| 0:46.6–0:52.0 | Afslutning | "Book en snak på selfi.dk/erhverv" |

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

Replikkerne står i `voiceover.json`, én pr. scene. Tal og domæner er skrevet, som de skal udtales. `voice.cjs` følger ElevenLabs' egne anbefalinger for bedst mulig kvalitet:

- **Eleven v4** (`eleven_v4`), deres bedste model, med `language_code: "da"`, så den taler og normaliserer dansk.
- **Stemmen Jonas** fra biblioteket. Han er ung og artikuleret og har den reneste optagelse af de unge danske stemmer. v4 kopierer kildeoptagelsen, også støj, så stemmen er valgt ud fra målt støjgulv og båndbredde.
- **Et let lydtag** (`[upbeat, warm and energetic]`) styrer leveringen. Tempo og style findes ikke i v4.
- **Flere optagelser pr. replik.** Hver optagelse bliver skrevet ned med Scribe, og den, der passer bedst med manuskriptet, bliver brugt. Et forkert ord kommer derfor aldrig med i en film.
- **Opus i 48 kHz og 192 kbps.** Stilhed i start og slut skæres væk.

`render.cjs` lægger hver replik ind 0,4 sekund inde i sin scene. En scene forlænges, hvis repliken er længere end scenen. Filmene afspilles 1,2 gange hurtigere, end de er skrevet (`FILM_SPEED` i `shared.js`). Tiderne i tabellerne er de rigtige tider i videoen.

## Musik

`music.cjs` laver et instrumentalt nummer til hver film med **`music_v2_5`**, ElevenLabs' bedste musikmodel, i 48 kHz og 192 kbps. Nummeret bygges ud fra en kompositionsplan og ikke en løs prompt. Hver sektion (intro, groove, build, lift, slutning) starter på et sceneskift i filmen. Musikken bygger derfor op med historien og lander sit slutslag, når slutkortet kommer. Scenetiderne læses fra filmen efter `voice.cjs`, fordi speaken bestemmer, hvor lang hver scene er.

`render.cjs` lægger musikken et godt stykke under stemmen og dykker den yderligere, mens der bliver talt (sidechain). Til sidst normaliseres lyden lineært i to pas til -15 LUFS.

Eleven Music er ifølge ElevenLabs godkendt til næsten al kommerciel brug. Se deres music terms for den plan, kontoen er på.

## Lav lyden igen

```sh
cd web/video
export NODE_USE_ENV_PROXY=1 NODE_PATH=$(npm root -g) ELEVENLABS_API_KEY=...
node voice.cjs     # efter en rettelse i voiceover.json
node music.cjs     # derefter, så musikken passer til de nye scenetider
node render.cjs && node render.cjs erhverv
```

På siden starter filmen uden lyd, fordi browsere kun selv afspiller video uden lyd. Knappen "Slå lyd til" afspiller den forfra med lyd.
