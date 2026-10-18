# Selfi SoMe-annoncer (B2C), runde 1

Statiske annoncer til private fester: konfirmation, bryllup, fødselsdag, firmafest og barnedåb. Se [oversigt.jpg](oversigt.jpg) for det hele på én side.

## Formater

| Mappe | Størrelse | Brug |
|---|---|---|
| `feed_1080x1350/` | 4:5 | Instagram- og Facebook-feed |
| `stories_1080x1920/` | 9:16 | Stories og Reels. Tekst holdes ude af de øverste 250 px og nederste 340 px, hvor Meta lægger profil og knap |
| `karrusel_1080x1080/` | 1:1, 7 kort | Karrusel. Kortene er skåret af én lang stribe, så boksen og linjen fortsætter over kanten og inviterer til at swipe |

## De otte annoncer

| # | Vinkel | Overskrift |
|---|---|---|
| 01 | Hovedbudskab | Fotoboksen, der får alle med på billedet. |
| 02 | Videohilsner | Gæsterne kan også sige det på video. |
| 03 | Spørgsmål | Stil gæsterne et spørgsmål. Få svarene på video. ("Hvad er jeres bedste minde sammen?") |
| 04 | Titler | Boksen kårer aftenens største smil. |
| 05 | Missioner | Små missioner, der får gæsterne til at mingle. |
| 06 | Webportal | Alle billeder og videoer samlet ét sted. (eventside og kontrolpanel) |
| 07 | Anledninger | Konfirmation, bryllup, fødselsdag, firmafest og barnedåb. |
| 08 | Pris og service | Markedets laveste pris. Og en service, I kan regne med. |

Karrusellen: 1 "Det kan jeres gæster i en Selfi", 2 videohilsner, 3 spørgsmål, 4 titler, 5 missioner, 6 jeres side, 7 pris, service og knap.

"Markedets laveste pris · selfi.dk" står i bunden af alle annoncer. Prisen "Fra 499 kr." står på karrusellens første kort og på annonce 01 (Esben, 18. okt. 2026). Hjemmesiden siger 495 kr. for én dag, så de to skal bringes til at passe.

## Det har jeg undgået (AI-slop i annoncer)

Forbrugerne er blevet hurtige til at spotte AI-annoncer, og 73 % siger, at de stoler mindre på en annonce, de tror er lavet med AI ([Harris/4As](https://martech.org/consumers-want-ai-ads-with-a-human-touch/), [Canva 2026](https://thenextweb.com/news/canva-ai-marketing-consumer-trust-gap-report), [DoubleVerify](https://www.advanced-television.com/2026/08/06/study-ai-slop-poses-growing-risk-to-brand-trust/)). Derfor:

- Ingen lilla gradienter, glitter, neon-blobs, 3D-ikoner eller emojis. Kun Selfis egne farver (sort, creme, grøn) og fonte (Instrument Sans, Geist, Geist Mono).
- Ingen tomme superlativer ("uforglemmelig", "oplevelse", "magisk"), ingen udråbstegn og ingen opdigtede anmeldelser, stjerner eller tal. Hver overskrift siger én konkret ting, boksen kan.
- Produktet vises som det rigtige brugerflade-indhold på skærmen (nedtælling, optagelse, spørgsmål, mission), ikke som pynt.
- En fast skabelon på alle annoncer (kicker, overskrift, visual, bundlinje), så serien ligner ét brand.
- Visualen fylder fladen og går helt ud til kanten, så der er så lidt dødt rum som muligt.

## Regler fra projektet

- Kun hovedenheden vises, som den flade grafik fra filmene (ring, kamera og skærm, koncentriske hjørner). Ingen printmodul, ingen standard-renders og ingen tegninger.
- Videohilsner og mikrofon er med, som besluttet for næste generation.

## Skal tjekkes før de går ud

1. **Fotoene er AI-genererede** (de samme som på selfi.dk). Skift dem til rigtige billeder fra fester, så snart vi har dem. Det er det største tilbageværende slop-signal.
2. **Servicelinjerne** ("Levering og opsætning", "Klar på fem minutter", "Ubegrænsede billeder") er taget fra hjemmesiden. Skriv, hvis der skal stå noget andet.
3. **"Markedets laveste pris"** er en sammenlignende påstand. Den skal kunne dokumenteres (fx prisen mod Myselfie), hvis nogen klager.

## Lav dem om

```
cd kilde && NODE_PATH=$(npm root -g) node build.cjs          # alle
NODE_PATH=$(npm root -g) node build.cjs 04_titler           # én
```
Teksterne ligger i `ads`-listen i `build.cjs`, og layoutet ligger i `ads.css`. PNG'erne lander i `kilde/out/`.
