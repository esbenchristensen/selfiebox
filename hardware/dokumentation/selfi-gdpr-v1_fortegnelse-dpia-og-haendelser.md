# GDPR-fortegnelse, konsekvensanalyse og hændelsesprocedure (selfi-gdpr-v1)

**Version:** selfi-gdpr-v1, 19. okt. 2026. Internt dokument. Gennemgås mindst én gang om året og ved nye funktioner.

## 1. Fortegnelse som dataansvarlig (GDPR art. 30, stk. 1)

| Behandling | Registrerede | Oplysninger | Grundlag | Modtagere | Slettes |
|---|---|---|---|---|---|
| Henvendelser via selfi.dk | Kontaktpersoner | Navn, e-mail, telefon, sted, besked | Art. 6(1)(b)/(f) | Webhook-værktøj (CONTACT_WEBHOOK_URL), e-mail | 12 mdr. efter sidste kontakt |
| Kunder, aftaler, fakturering | Kontaktpersoner hos kunder | Navn, firma, kontaktoplysninger, aftaler | Art. 6(1)(b)/(c) | Regnskabsprogram, revisor | Aftalens ophør; bilag 5 år |
| Kontrolpanel-brugere | Kunders medarbejdere | Navn, e-mail, login, ændringslog | Art. 6(1)(b)/(f) | Vercel, MongoDB | Ved lukning; log 12 mdr. |
| Hjemmeside-logs | Besøgende | IP, browser, tid | Art. 6(1)(f) | Vercel | Vercels frister |

Overførsel til tredjeland: Vercel Inc. (USA, EU-USA-dataprivatlivsrammen + SCC). Sikkerhed: se databehandleraftalen punkt 7.

## 2. Fortegnelse som databehandler (art. 30, stk. 2)

| Dataansvarlig | Kategorier | Underdatabehandlere | Tredjeland | Sikkerhed |
|---|---|---|---|---|
| Hvert sted med en Selfi Boks (liste i fleet/kontrolpanel) | Gæsters billeder, video med lyd, telefonnumre, samtykker, alder over/under 15, logs | Vercel, MongoDB Atlas (Stockholm), SMS-udbyder (**bekræft navn**) | USA via Vercel | Databehandleraftalen punkt 7 |

**Tjek og ret:** listen over underdatabehandlere på selfi.dk/databehandleraftale skal passe med det, selfiebox-platform faktisk bruger (lagring af billeder/video, SMS, e-mail, fejllogning). Mangler der én, så tilføj den og varsl kunderne 30 dage før.

## 3. Konsekvensanalyse (DPIA, art. 35): screening

Datatilsynets liste og EDPB's 9 kriterier. To eller flere kriterier → DPIA bør laves.

| Kriterium | Selfi Boks | |
|---|---|---|
| Systematisk overvågning af offentligt tilgængeligt område | Nej: boksen optager kun, når gæsten selv starter | ✗ |
| Følsomme/biometriske data | Nej: ingen ansigtsgenkendelse. Billeder er ikke biometriske data, når de ikke behandles med teknik til entydig identifikation | ✗ |
| Data i stor skala | Kan blive det (mange steder, mange gæster) | ✓ |
| Sårbare registrerede | Børn kan bruge boksen | ✓ |
| Ny teknologi | Delvis (video-samtykker, gæsteliste) | (✓) |
| Samkøring af datasæt | Nej | ✗ |
| Profilering/scoring | Nej | ✗ |

**Konklusion:** grænsetilfælde. Selfi laver derfor en kort DPIA (her) og stiller den til rådighed for stederne (de er dataansvarlige og skal selv vurdere).

### Risici og tiltag
| Risiko for gæsten | Sandsynlighed | Konsekvens | Tiltag | Rest |
|---|---|---|---|---|
| Billede/video offentliggøres uden samtykke | Lav | Middel | Separat ja/nej pr. billede; kun "ja" kan hentes som content; samtykke med tid og tekst | Lav |
| Børns billeder bruges | Middel | Høj | Aldersspørgsmål før samtykke; under 15 → kun forælder kan sige ja; ellers ingen brug | Lav |
| Uvedkommende ser andres billeder via galleri-link | Lav | Middel | Lange tilfældige links, sletning efter 30 dage, ingen offentlig liste | Lav |
| Lækage af telefonnumre | Lav | Middel | Kryptering, personligt login, stedet ser kun egne data, sletning | Lav |
| Optagelse uden at gæsten ved det (lyd) | Lav | Middel | Mikrofonen optager kun under en video, som gæsten starter; skilt + skærmtekst | Lav |
| Stjålet boks med billeder | Lav | Middel | Billeder slettes lokalt efter upload; sikkerhedsskrue; fjernspærring | Lav |
| Markedsføring uden gyldigt samtykke | Middel | Middel | Samtykketekst med stedets navn, kanal, emne; afmelding i hver SMS; ikke krav for konkurrence | Lav |

## 4. Brud på persondatasikkerheden (art. 33–34)

1. Opdaget → noter tid, hvad der er sket, hvilke steder/gæster.
2. Stop bruddet (spær boks/nøgler, luk link, skift adgang).
3. **Inden 48 timer:** giv de berørte steder besked (databehandleraftalen punkt 3.8) med: hvad, hvornår, hvilke data, hvor mange, hvad vi har gjort.
4. Er Selfi selv dataansvarlig (kunder, kontaktpersoner): anmeld til Datatilsynet inden 72 timer via virk.dk, hvis det ikke er usandsynligt, at det giver risiko. Høj risiko → giv også de registrerede besked.
5. Registrér alle brud i en log (også dem, der ikke anmeldes).

## 5. Sårbarheder og alvorlige hændelser (cyberrobusthedsforordningen art. 14, gælder fra 11. sep. 2026)

Gælder **aktivt udnyttede sårbarheder** i boksen eller dens software og **alvorlige hændelser**, der påvirker boksens sikkerhed.

| Frist | Hvad | Hvortil |
|---|---|---|
| 24 timer | Tidlig varsling | ENISA's fælles indberetningsplatform (single reporting platform); den danske CSIRT er CFCS/SAMSIK |
| 72 timer | Indberetning med detaljer og afhjælpning | Samme |
| 14 dage efter rettelse (sårbarhed) / 1 måned (hændelse) | Endelig rapport | Samme |

Desuden: informér de berørte steder og, hvis nødvendigt, gæsterne om risikoen og hvad de skal gøre. Rettelsen rulles ud til alle bokse via signeret opdatering.

Sårbarheder modtages via selfi.dk/.well-known/security.txt og selfi.dk/dokumentation#sikkerhedshuller. Svar inden 2 hverdage.

## 6. Produktsikkerhed (GPSR art. 20)

Ulykker (skade på personer) med en Selfi Boks indberettes **uden unødig forsinkelse** via EU's Safety Business Gateway, og produktet vurderes (tilbagetrækning, rettelse). Alle klager og nærved-hændelser noteres i produktionsloggen, fanen "Hændelser".
