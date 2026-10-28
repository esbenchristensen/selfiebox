# Tekststrategi for selfi.dk

Ligger her, så nye tekster kan skrives efter de samme regler. Alle tekster på siden er skrevet efter dette dokument (oktober 2026).

## 1. Problemet med de gamle tekster

Teksterne var skrevet som slogans, der kun giver mening, når man allerede kender produktet. "Lyset klarer resten" siger ikke, at vi er en fotoboks, hvad den koster, eller hvem den er til. Det samme gjaldt "Lysringen kalder", "Det, gæsterne husker" og "Grin i køen. Fotoet i hånden. Opslaget næste morgen.". En besøgende har ca. 5 sekunder til at forstå tre ting: **hvad er det, hvad får jeg ud af det, og hvad skal jeg gøre nu.** Den gamle hero svarede ikke på nogen af dem.

## 2. Positionering

**For** værter, der vil have folk til at mødes, fra brudeparret til bodegaejeren,
**er Selfi Boks** fotoboksen, der får alle med på billedet, giver dem billedet med hjem og bringer gæsterne tilbage.
**I modsætning til** store fotobokse på stativ er den lille nok til at hænge på væggen, har studielys indbygget og kan bygge en gæsteliste, stedet må bruge.

### Det, vi kan bevise (brug det, skriv ikke andet)

| Påstand | Bevis |
|---|---|
| Godt lys, også i en mørk bar | Lysring, CRI 90+, 4000 K. Ingen blitz. |
| Lille og fast på væggen | 234 × 306 × 66 mm, tyverilås eller stander |
| Billedet med hjem | Instax Square-print (fotomodul), QR-kode, SMS-link, eventside |
| Får folk til at blive | Titler, missioner, skattejagt, rundtur, konkurrence, guldtid |
| Kører uden personale | Kontrolpanel på nettet: tema, tekster, priser, aktiviteter |
| Billig | Privat 895 kr. for en dag eller en weekend. Erhverv 995 kr./md. ekskl. moms |
| Gæsteliste | Gæsten skriver nummer for at få billedet på SMS og kan sige ja til tilbud |
| Fuld service (erhverv) | Stedet hænger selv boksen op efter monteringsguiden (Selfi monterer ikke, besluttet 19. okt. 2026). Vi overvåger (boksen melder sig til fleet, alarmer i admin), opdaterer (signerede releases, trinvis udrulning), døgnsupport, ny boks ved fejl uden regning. Besluttet oktober 2026 |

### Ét budskab pr. målgruppe

- **Privat:** "Lej en fotoboks, der får alle med på billedet." Det handler om festen og minderne. Pris er det stærkeste argument.
- **Erhverv:** "Fotoboksen, der får gæsterne til at komme igen." Det handler om omsætning: omtale, længere ophold og genbesøg via gæstelisten.

## 3. Konkurrenterne

| | Myselfie | Lightbooth | Selfi |
|---|---|---|---|
| Målgruppe | Privatfester | Natklubber, barer, hoteller, centre | Begge |
| Hovedbudskab | "Verdensklasse underholdning til din fest", alt inkluderet | En fotoboks, der bygger en database af gæster | Alle med på billedet, og gæsterne kommer igen |
| Pris | ca. 1.200–1.500 kr. | Abonnement | 895 kr./dag eller weekend, 995 kr./md. |
| Styrker | 4,9 på Trustpilot med tusindvis af anmeldelser, rekvisitter og aktivitetskort, gratis datoflyt, GLS-levering | Lightbooth Manager med automatiske SMS'er (fødselsdag, opfølgning efter weekenden), statistik | Lysring, vægmontering, Instax-print, spil, temaer, pris |
| Svagheder | Legende tone med mange emojis. Ikke til faste steder | Gæstedata bruges til markedsføring via vilkårene. Det er en juridisk risiko for stederne | Ingen anmeldelser endnu |

**Det tager vi med (uden at kopiere):**
- Fra Myselfie: Sig præcist, hvad der er med i prisen. Fjern risikoen (datoflyt, levering). Social proof, så snart vi har det.
- Fra Lightbooth: Sælg boksen til steder som en **markedsføringskanal med målbart afkast**, ikke som underholdning. Gæstelisten og SMS'en til fredagens gæster er det stærkeste salgsargument over for en bar.

**Vores kant over for Lightbooth: en gæsteliste, I må bruge.** En natklub har fået bøde for SMS'er til gæster, der kun havde skrevet sig på en gæsteliste ([Forbrugerombudsmanden](https://forbrugerombudsmanden.dk/find-sager/sager/markedsfoeringsloven/sager-efter-markedsfoeringsloven/spam/natklub-idoemt-en-boede-paa-25000-kr)). Vi beder om et særskilt ja til tilbud. Det er både lovligt og et salgsargument.

## 4. Stemme og tone

- **Konkret før kreativt.** Skriv hvad, ikke hvordan det føles. "Ringen skifter til hvidt studielys" i stedet for "Lyset klarer resten".
- **Overskrifter skal kunne stå alene.** Mange læser kun overskrifterne. Hver overskrift skal sige noget sandt om produktet.
- **Tal og fakta.** 895 kr., 6,6 cm, under et minut. Tal skaber tillid.
- **"I" og "jeres".** Vi taler til værten, ikke til gæsten.
- **Varm og tør, ikke fjollet.** Ingen emojis, ingen udråbstegn, ingen "verdensklasse". Humor må gerne komme fra situationerne ("Kollegerne viser en side, man ikke ser til morgenmødet").
- **Lov aldrig mere, end boksen kan.** Se tabellen over beviser.
- **Undgå:** "skaber stemning", "uforglemmelig", "oplevelse", "løsning", ordspil, der skal forklares.

## 5. Tryghed: hvorfor erhverv sælges som fuld service

En barejer køber ikke en fotoboks. De køber, at den ikke bliver et problem. Sektionen "I betaler én fast pris. Vi tager os af resten." (`components/Care.tsx`) står lige efter prisen på `/erhverv` og er skrevet efter disse regler:

- **Byrden er den egentlige pris.** Ud over de 995 kr. regner ejeren med tid, besvær og risiko: Hvem monterer? Hvem ringer jeg til? Hvad hvis den går ned fredag kl. 23? Hvis siden ikke svarer, gætter ejeren selv, og gættet er altid værre end virkeligheden (tabsaversion). Derfor står svarene lige efter prisen.
- **Vis det, påstå det ikke.** To kort: "Det klarer vi" er en lang liste, og "Det klarer I" har én linje: "Holder åbent, som I plejer." Den tomme plads er budskabet.
- **Navngiv frygten, og svar på den.** "Det, I måske tænker på" stiller de spørgsmål, ejeren ikke vil stille i en salgssamtale, og svarer konkret. En frygt, der er sagt højt og besvaret, fylder mindre end én, der ikke er nævnt.
- **Konkrete løfter frem for store ord.** Forskning i servicegarantier (Hart 1988; McDougall m.fl. 1998) viser, at specifikke løfter om hvad der sker, og hvordan, mindsker oplevet risiko mere end vage. Skriv "Går en boks i stykker, sender vi en ny", ikke "100 % sikkerhed" eller "fuld tryghed". Absolutte løfter vækker mistillid hos en erfaren ejer.
- **Beslutningssikkerhed.** Gartner finder, at købere med høj tillid til egen beslutning oftere køber og sjældnere fortryder. Hjælp ejeren med at kunne forklare valget: "fast pris, intet at passe, og hvis noget går galt, er det leverandørens problem".
- **Ét fast tal, ingen bagdøre.** "Kommer der regninger ud over den faste pris?" besvares direkte med nej. Forudsigelighed er tryghed.
- **Lov kun det, vi kan holde.** Sæt ikke svartider, timer for ombytning eller oppetid på siden, før driften kan levere dem hver gang.

## 6. SEO

**Søgeord** (de ord, kunderne selv bruger):

| Side/sektion | Primært | Sekundært |
|---|---|---|
| `/` title + H1 | lej fotoboks | fotoboks til bryllup, fødselsdag, firmafest, photo booth leje |
| `/` H2 og FAQ | fotoboks til bryllup / fødselsdag / firmafest, "hvad koster det at leje en fotoboks" | pris |
| `/erhverv` title + H1 | fotoboks til bar | photo booth til natklub, hotel, festival |
| `/erhverv` FAQ | "hvad koster en fotoboks til en bar" | gæsteliste, SMS, betaling pr. foto |

**Gjort i koden:**
- `<title>` med søgeord og pris (under 60 tegn), meta description under 155 tegn.
- H1 indeholder "fotoboks". H2'erne bruger søgeordene naturligt.
- `FAQPage`- og `Service`-strukturdata pr. side med sidens egne spørgsmål og priser. (Google viser i dag kun FAQ-udvidelser for få sider, men dataene hjælper stadig med at forstå siden.)
- Canonical URL og alt-tekster, der beskriver billedet og nævner "fotoboks".

**Næste skridt (største SEO-gevinst):**
1. ~~**Del siden op.**~~ Gjort: `/` er privat leje, `/erhverv` er barer, klubber og hoteller. Se `SIDESTRUKTUR.md` for begrundelsen og de næste sider.
2. **Anmeldelser.** Bed hver lejer om en anmeldelse på Trustpilot eller Google. Myselfies stærkeste våben er 4,9 med tusindvis af anmeldelser.
3. **Google Business Profile** med fotos og anmeldelser.
4. **Guides,** der svarer på det, folk søger efter: "Hvad koster en fotoboks?", "Fotoboks eller fotograf til brylluppet?", "10 ideer til billeder i fotoboksen".

## 7. Skal afklares før lancering

- **Samtykke til SMS-markedsføring.** Kiosken gemmer i dag nummeret for at sende billedet. Teksterne lover, at gæsten "kan sige ja til at høre fra jer". Det kræver et særskilt, aktivt ja på SMS-skærmen (ikke forhåndsafkrydset), og at kun de numre kan bruges til udsendelser fra kontrolpanelet. Ellers skal teksten om gæstelisten fjernes.
- **Instax til private.** Er der film med i privatpakkerne, eller kun som tilvalg? Teksterne siger nu "ubegrænsede billeder" (digitalt) og nævner Instax under fotomodulet. Skriv det præcist, når det er besluttet.
- **Renderingen i hero.** Skærmen i renderingen viser stadig "Smil – lyset klarer resten" og "SELFIEBOX". Den skal gen-renderes.
- **"Anbefalet" på weekendpakken** erstatter "Mest valgt", som vi ikke har tal for. Skift tilbage, når vi har det.
