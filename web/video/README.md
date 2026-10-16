# Explainerfilm til privat leje

Filmen på forsiden (`components/Explainer.tsx`, sektionen "Se filmen"). Den har dansk tekst på skærmen og ingen speak, så der kan lægges en speak på bagefter.

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

## Ændre filmen

Alt er tegnet i `explainer.html` med sidens farver og fonte. Hver scene har en længde (`dur`) og tider for, hvornår tingene kommer ind (`data-in`). Hvis speaken skal have mere tid et sted, så gør scenens `dur` længere og render igen.

Se den i browseren: åbn `explainer.html?format=wide&play` (eller `format=tall`) fra en lokal server i `web/`, fx `npx http-server web`. Med `&t=30` står den stille på sekund 30.

Render (kræver Playwright med Chromium og ffmpeg):

```sh
cd web/video
NODE_PATH=$(npm root -g) node render.cjs          # begge formater
NODE_PATH=$(npm root -g) node render.cjs tall     # kun ét
```

WebM-reserven laves bagefter fra mp4-filen:

```sh
ffmpeg -i selfi-explainer-wide.mp4 -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an selfi-explainer-wide.webm
```

Speak lægges på bagefter, fx med ffmpeg:

```sh
ffmpeg -i selfi-explainer-wide.mp4 -i speak.m4a -c:v copy -c:a aac -shortest selfi-explainer-wide-speak.mp4
```

Fjern så `muted` i `components/Explainer.tsx` eller lad gæsten selv slå lyden til.
