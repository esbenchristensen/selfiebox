# Selfi-film

To film med dansk tekst på skærmen og ingen speak, så der kan lægges en speak på bagefter. Begge vises med `components/Explainer.tsx` i sektionen "Se filmen".

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

Længde: 63,5 sekunder, 30 fps, uden lyd.

## Scener og tider (til speaken)

| Tid | Scene | Tekst på skærmen |
|---|---|---|
| 0:00–0:05.5 | Intro | Fotoboks til leje. "Lej en fotoboks, der får alle med på billedet." |
| 0:05.5–0:11.7 | Hvorfor | "Det bedste billede fra festen er det, hvor alle er med." |
| 0:11.7–0:19.3 | 01 Vælg jeres dage | "Vælg dagene i kalenderen." En dag 495 kr., en weekend 750 kr. og en uge 1.250 kr., altid inkl. moms. Vi bekræfter på mail. |
| 0:19.3–0:25.9 | 02 Få boksen ud til festen | "Hent den, eller få den leveret." Stander og en almindelig stikkontakt. Afhent selv, levering, levering og opsætning. |
| 0:25.9–0:35.5 | 03 Tryk og smil | "Et tryk, og ringen tæller ned fra 3." Hvidt studielys, ingen blitz i øjnene. |
| 0:35.5–0:43.7 | 04 Billedet med hjem | "Billedet ligger på telefonen med det samme." QR-kode, SMS, eventside, Instax-print med fotomodulet. |
| 0:43.7–0:50.9 | Temaer | "En boks, der ser ud som jeres fest." Bryllup, fødselsdag, julefrokost. |
| 0:50.9–0:57.1 | Pris | "Fra 495 kr. inkl. moms." Ubegrænsede billeder, studielys, stander, eventside. |
| 0:57.1–1:03.5 | Afslutning | "Se ledige datoer på selfi.dk" |

## Erhverv

Længde: 62 sekunder. Stederne i filmen (Kælderbaren, Hotel Fjord, Skovfest) er opdigtede med vilje. Så viser filmen, hvad et tema kan, uden at det ligner, at et rigtigt sted er kunde.

| Tid | Scene | Tekst på skærmen |
|---|---|---|
| 0:00–0:05.6 | Intro | Til barer, klubber og hoteller. "En fotoboks, der får gæsterne til at komme igen." |
| 0:05.6–0:15.6 | 01 Jeres stil | "Boksen bliver jeres." Boksen skifter til Kælderbarens design: lysring, sider og top, skærm, fotoramme. |
| 0:15.6–0:23.4 | Til ethvert sted | "Fra bodegaen til festivalen." Vi designer temaet med jer og printer delene selv. Tre eksempler. |
| 0:23.4–0:32.0 | 02 Gæsterne | "Hvert billede bærer jeres navn." Nedtælling, studielys, print og deling med navnet i rammen. |
| 0:32.0–0:40.6 | 03 Gæstelisten | "En gæsteliste, I må bruge." Nummer for SMS og et særskilt ja til tilbud. |
| 0:40.6–0:49.2 | 04 Fuld service | "Vi sørger for alt." Det klarer vi: seks ting. Det klarer I: "Holder åbent, som I plejer." |
| 0:49.2–0:55.6 | Pris | "Én fast pris om måneden." 995 kr./md. pr. boks, ekskl. moms. |
| 0:55.6–1:02.0 | Afslutning | "Book en snak på selfi.dk/erhverv" |

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

Speak lægges på bagefter, fx med ffmpeg:

```sh
ffmpeg -i selfi-explainer-wide.mp4 -i speak.m4a -c:v copy -c:a aac -shortest selfi-explainer-wide-speak.mp4
```

Fjern så `muted` i `components/Explainer.tsx` eller lad gæsten selv slå lyden til.
