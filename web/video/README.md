# Selfi-film

To reklamefilm med dansk tekst på skærmen, dansk speak (Jonas, Eleven v4), musik (Eleven Music v2.5) og lydeffekter fra ElevenLabs. Begge vises med `components/Explainer.tsx` i sektionen "Se filmen".

| Film | Side | Kilde | Filer i `public/video/` |
|---|---|---|---|
| Privat leje | `/` | `explainer.html` | `selfi-explainer-*` |
| Erhverv | `/erhverv` | `erhverv.html` | `selfi-erhverv-*` |
| Store events | (ikke på siden endnu) | `events.html` | `selfi-events-*` |

Alle bruger `shared.css` og `shared.js` (farver, fonte, boksen, tidslinjen). Erhverv og events bruger desuden `venue.css` og `venue.js` (bokse i stedets eget design).

## Hvordan filmene er skrevet

Begge film er skrevet som reklamefilm, ikke som en gennemgang af funktioner:

- **Et problem i de første sekunder**, som seeren kender, og brandet lige efter. Logo og lysring vises inden for 2–5 sekunder. Det giver markant bedre genkendelse.
- **Ét følelsesmæssigt højdepunkt med brandet i** (peak-end): nedtællingen, blitzen og grinende gæster i privatfilmen.
- **Mennesker i stedet for kun grafik:** rigtige billeder fra fester og barer.
- **En fast lyd for Selfi:** et lukkerklik med en lys tone, når brandet vises første gang og på slutkortet. Desuden bip, klik, latter og pop på de vigtige øjeblikke.
- **Speaken styrer tempoet:** hver scene varer lige så længe som sin replik plus 0,3 sekund før og efter, og animationen strækkes eller trykkes til at passe (`warp` i `shared.js`). Der er derfor ingen døde huller, kun bevidste pauser efter "Klik" og på slutkortet.
- **Teksten på skærmen** følger speaken, så filmen kan forstås uden lyd.
- **Prisen gøres lille med et regnestykke** (10 kr. pr. gæst og 15 kr. pr. print), og der er én klar handling til sidst.

## Privat leje (36 sekunder)

| Scene | Speak | Billede |
|---|---|---|
| Hook | "Hundrede billeder fra festen. Og ikke ét, hvor alle er med." | Mobilgalleri med halve ansigter, der scroller forbi og stopper på "Ingen med alle" |
| Løsning | "Selfi Boks samler gæsterne foran kameraet." | Rigtigt festfoto med boksen, logo og Selfi-lyden |
| Højdepunkt | "Tre... to... én." | Nedtælling med bip på hvert ord, blitz, klik, latter og fuldskærmsfoto med "Klik." |
| Med hjem | "Billedet ligger på telefonen med det samme. Og dagen efter har I dem alle." | Eventsiden fyldes |
| Indvending | "Den står på en stander og passer sig selv." | Boksen i en lade til et bryllup |
| Tema | "Vælg tema til bryllup, fødselsdag eller julefrokost." | De tre temaer |
| Pris | "En hel weekend koster syv hundrede og halvtreds kroner. Med femoghalvfjerds gæster er det ti kroner per gæst." | 750 kr. og regnestykket |
| Handling | "Tjek, om jeres dato er ledig, på selfi punktum d k." | Logo, knap og Selfi-lyden |

## Erhverv: barer og natklubber (60 sekunder)

Filmen er kun til barer, værtshuse og natklubber. Store steder som forlystelsesparker og festivaler får deres egen film med en anden vinkel. Stederne i filmen (Kælderbaren, Bar Nord og Klub Neon) er opdigtede med vilje.

| Scene | Speak | Billede |
|---|---|---|
| Hook (tab) | "Fredag er baren fuld. Men på mandag ved I ikke, hvem der var der." | Fuldt værtshus, der bliver gråt: "Fredag" bliver til "Mandag – Hvem var her?" |
| Kø | "Selfi Boks hænger på væggen, og lysringen kan ses over hele dansegulvet. Folk stiller sig i kø af sig selv." | Rigtigt klubfoto, logo og Selfi-lyden |
| Mission | "Skærmen giver dem en mission: Tag et billede med en, du ikke kender." | Klub Neon-boksen med missionen og stemplet "Klaret" |
| Titel | "Boksen kårer aftenens største smil. Det billede vil man have med hjem." | Print med stemplet "Aftenens største smil" |
| Nummer | "For at få billedet skriver gæsten sit nummer og kan sige ja til tilbud fra jer." | Telefonen med nummer og samtykke, gæstelisten tæller op |
| Konkurrence | "Gæsterne stemmer på aftenens bedste billede, og vinderen henter præmien i baren." | Afstemning, vinder og "Præmien venter i baren" |
| Print | "I sætter selv prisen på printet. Alt over femogtyve kroner er jeres." | Eksempel: 40 − 25 = 15 kr. til jer, og 67 prints om måneden betaler boksen |
| Gæsteliste | "Så på mandag ved I, hvem der var her, og kan invitere dem til næste fest." | 1.284 på listen og en SMS til fredag |
| Design | "Boksen får jeres farver og jeres logo." | Værtshus, cocktailbar og natklub |
| Service | "Vi monterer den, holder øje med den og bytter den, hvis noget går galt. I holder bare åbent." | Det klarer vi over for Det klarer I |
| Pris | "Ni hundrede og femoghalvfems kroner om måneden." | 995 kr./md. ekskl. moms |
| Handling | "Book en uforpligtende snak på selfi punktum d k skråstreg erhverv." | Logo, knap og Selfi-lyden |

## Store events: festivaler, forlystelsesparker og zoo (71 sekunder)

Til store steder, hvor værdien er branding, omtale og aktiviteter på tværs af området. Stederne (Eventyrparken, Skovfest og Zoo Nord) er opdigtede med vilje.

| Scene | Speak | Billede |
|---|---|---|
| Hook (tab) | "Hver dag tager jeres gæster tusindvis af billeder. Og de fleste viser kun et ansigt, ikke hvor de var." | Rigtigt festivalfoto |
| Tema | "Selfi Boks bliver en del af jeres univers. Jeres figurer og farver på boksen, en velkomst på skærmen og jeres navn på hvert eneste foto." | Boksen skifter til Eventyrparkens design, og printet kommer ud |
| Design | "Forlystelsespark, festival eller zoo. Vi designer temaet sammen med jer og printer delene selv." | Tre designs |
| Omtale | "Når gæsterne deler billedet, ser alle deres venner, hvor de var. Hver deling viser jer frem." | Opslag med rammen, likes og delinger |
| Skattejagt | "Med flere bokse bliver området til en skattejagt. Gæsterne følger spor fra boks til boks, forbi de steder, I gerne vil vise frem." | Kort med ruten, der tegnes boks for boks, og "Skatten fundet" |
| Rundtur | "Eller en rundtur: et stempel ved hver boks, og en præmie til dem, der når hele vejen rundt." | Stempelkort, der fyldes, og præmien i butikken |
| Sponsor | "Titler og konkurrencer holder gang i dagen, og rammen har plads til en sponsor." | Print med "Dagens bedste billede" og sponsoren i rammen |
| Gæsteliste | "Gæsterne kan sige ja til nyheder fra jer, så I kan invitere dem igen næste sæson." | Liste og nyhedsbrev |
| Sæsoner | "Til Halloween og jul skifter I skærm og ramme i kontrolpanelet." | Sommer, Halloween og jul på samme boks |
| Service | "Vi designer, monterer og overvåger boksene og bytter dem, hvis noget går galt." | Det klarer vi over for "Tager imod gæsterne" |
| Handling | "Book en snak på selfi punktum d k, så viser vi boksen i jeres tema." | Logo, knap og Selfi-lyden |

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

`render.cjs` lægger hver replik ind 0,3 sekund inde i sin scene, og scenen varer lige så længe som repliken.

## Musik

`music.cjs` laver et instrumentalt nummer til hver film med **`music_v2_5`**, ElevenLabs' bedste musikmodel, i 48 kHz og 192 kbps. Nummeret bygges ud fra en kompositionsplan og ikke en løs prompt. Hver sektion starter på et sceneskift i filmen. I privatfilmen forsvinder trommerne under nedtællingen, og musikken kommer tilbage på "Klik". Musikken bygger derfor op med historien og lander sit slutslag, når slutkortet kommer. Scenetiderne læses fra filmen efter `voice.cjs`, fordi speaken bestemmer, hvor lang hver scene er.

`render.cjs` lægger musikken et godt stykke under stemmen og dykker den yderligere, mens der bliver talt (sidechain). Til sidst normaliseres lyden lineært i to pas til -15 LUFS.

Eleven Music er ifølge ElevenLabs godkendt til næsten al kommerciel brug. Se deres music terms for den plan, kontoen er på.

## Lav lyden igen

```sh
cd web/video
export NODE_USE_ENV_PROXY=1 NODE_PATH=$(npm root -g) ELEVENLABS_API_KEY=...
node voice.cjs     # efter en rettelse i voiceover.json
node music.cjs     # derefter, så musikken passer til de nye scenetider
node sfx.cjs       # kun hvis en lydeffekt ændres
node render.cjs && node render.cjs erhverv && node render.cjs events
```

På siden starter filmen uden lyd, fordi browsere kun selv afspiller video uden lyd. Knappen "Slå lyd til" afspiller den forfra med lyd.
