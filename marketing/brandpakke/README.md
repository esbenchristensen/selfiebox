# Selfi brandpakke

Logo, SoMe-grafik, tryksager, emballage og mockups i Selfis stil (samme logo, farver og fonte som selfi.dk og SoMe-annoncerne). Start med [Selfi_brandguide.pdf](Selfi_brandguide.pdf) eller [oversigt.jpg](oversigt.jpg).

## Indhold

| Mappe | Indhold |
|---|---|
| `01_logo/svg`, `01_logo/png` | Logo, stablet logo, symbol og ordmærke i seks farver: mørk, lys, grøn, sort, hvid, creme. SVG er rene stier (ingen font nødvendig). PNG er transparente, 2000 px brede |
| `01_logo/ikoner` | App-ikon 1024 px (mørk, grøn, creme) og favicon (SVG, 32, 180, 512 px) |
| `02_some/profilbillede` | 1080 × 1080 til Facebook, Instagram, LinkedIn, TikTok og YouTube. Mørk er hovedversionen |
| `02_some/facebook` | Cover 1640 × 624, mørk og grøn. Alt vigtigt ligger i midten, fordi mobilen skærer siderne fra |
| `02_some/linkedin`, `02_some/youtube` | Banner 1584 × 396 (erhverv) og 2560 × 1440 (sikker zone i midten) |
| `02_some/instagram/highlights` | Seks highlight-covers 1080 × 1920: Sådan, Video, Fester, Priser, Book, Spørgsmål |
| `02_some/skabeloner` | Story "Ledig dato" og feed "Tak for festen" |
| `03_tryksager` | Visitkort 85 × 55, gavekort 85 × 55, velkomstkort A6, klistermærker Ø60. Tryk-PDF med 3 mm beskæring + PNG i 300 dpi. E-mailsignatur (HTML) |
| `04_emballage` | Transportkasse 320 × 400 × 120 mm (front, bag, side, top som PDF i 1:1) og pakketape 50 mm |
| `05_mockups` | Visitkort, Facebook-side, Instagram, emballage og merchandise |

## Farver

| Navn | HEX | CMYK | Pantone (forslag) |
|---|---|---|---|
| Nat | #0E0F0E | C60 M40 Y40 K100 | Black 6 C |
| Halo (creme) | #FFF3E3 | C0 M4 Y11 K0 | Creme papir |
| Selfi-grøn | #22D36B | C70 M0 Y80 K0 | 7479 C |
| Papir | #F3F4F1 | C3 M2 Y4 K0 | Hvidt papir |
| Skov (tekst på grøn) | #0B1A10 | | |
| Grøn tekst på lys | #0F7A3B | | 356 C |

CMYK og Pantone er omregnet, ikke prøvetrykt. Bed trykkeriet om et prøvetryk af grøn, før der trykkes meget.

Fonte: Instrument Sans (overskrifter), Geist (brødtekst), Geist Mono (etiketter). Alle er gratis på Google Fonts.

## Regler

- Kun hovedenheden vises, som flad grafik (ring, kamera, skærm). Aldrig printmodul, standard-renders eller tekniske tegninger i kundevendt materiale.
- Ingen emojis, udråbstegn eller opdigtede anmeldelser. Se `web/TEKSTSTRATEGI.md`.
- Pris i B2C: "Fra 495 kr.". Ingen pris i festival- og eventmateriale.

## Skal rettes før tryk

1. **Kontaktoplysninger** på visitkort og e-mailsignatur er pladsholdere (titel "Stifter", +45 12 34 56 78, esben@selfi.dk). Ret `KONTAKT` i `kilde/build.cjs` og byg igen.
2. **Velkomstkortets trin** ("Boksen starter af sig selv", "Vi henter den dagen efter") skal passe med, hvordan boksen og leveringen faktisk virker.
3. **Fotoene** er de AI-genererede fra hjemmesiden. Skift dem til rigtige festbilleder.
4. **Kassens mål** (320 × 400 × 120 mm) er et forslag ud fra boksens 234 × 306 × 66 mm. Trykkeriet laver stansetegningen; panelerne lægges på den.
5. E-mailsignaturen henter logoet fra `https://selfi.dk/brand/selfi-logo-email.png` (ligger i `web/public/brand/`), så det virker først, når siden er udgivet.

## Byg det om

```
cd kilde
NODE_PATH=$(npm root -g) node build.cjs          # alt
NODE_PATH=$(npm root -g) node build.cjs some     # kun det, hvis id indeholder "some"
python3 oversigt.py                              # oversigt.jpg
```
Logoets stier kommer fra `logo.cjs`, der bruger målingerne fra `measure.cjs` (web-logoet) og glyferne fra `glyphs.py` (Instrument Sans 500). Kør dem kun igen, hvis logoet på hjemmesiden ændres.
