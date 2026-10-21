# Sidestruktur: hvorfor privat og erhverv har hver sin side

> **Historik.** Den 18. oktober 2026 droppede Selfi privatudlejningen og satser kun på erhverv. Forsiden `/` er nu fotobokse i eget design til alle slags steder, `/erhverv` og `/events` sender videre til `/`, og hver funktion har sin egen side under `/funktioner`. Kundesiderne `/erhverv/<sted>` og `/events/smukfest` er uændrede og er også katalogerne; `/kataloger/<slug>` sender videre til `/erhverv/<slug>` (20. okt. 2026). Resten af dokumentet beskriver den gamle opdeling.

Oktober 2026. Erstatter den gamle forside, hvor privat og erhverv delte én side med en Privat/Erhverv-knap i toppen.

## Kort fortalt

Selfi sælger ét produkt, men to forretninger: **en leje til én fest** og **et fast abonnement til et sted**. Køberen, grunden til at købe, prisen, momsen, beslutningen og salgsvejen er forskellige. Derfor har de hver sin side:

| | `/` Lej en fotoboks | `/erhverv` Fotoboks til bar, klub og hotel |
|---|---|---|
| Køber | Brudepar, forældre, festudvalg, HR til julefrokosten | Ejer eller manager af bar, bodega, klub, hotel, festival |
| Udløser | En fest med en dato | Et ønske om flere gæster, mere omsætning, noget at tale om |
| Det vil de have | Minder, alle med på billedet, nemt og billigt | Omtale, gæster der bliver og kommer igen, en gæsteliste |
| Det frygter de | At den ikke virker på dagen, levering, skjulte priser | Binding, personaletid, tyveri, bøder for SMS-markedsføring |
| Pris | 895 / 895 / 1.395 kr. **inkl. moms** pr. leje | 995 kr./md. **ekskl. moms** pr. boks |
| Beslutning | Én person, få dage, ofte på mobilen om aftenen | Ejer, ofte efter en snak eller demo, uger |
| Konvertering | Selvbetjening: kalender og booking | Samtale: "Book en snak" |
| Søger på | "lej fotoboks", "fotoboks til bryllup", "photo booth leje" | "fotoboks til bar", "photo booth natklub", sjældent; mest via opsøgende salg |
| Tillid kommer fra | Anmeldelser, billeder fra rigtige fester, klar pris | Regnestykket, referencer fra andre steder, lovlig gæsteliste |

## Hvorfor én side ikke kan virke

**1. SEO: én URL kan kun vinde én søgehensigt.**
Google rangerer en side efter, hvad den svarer på. En side, der både vil være "lej fotoboks til brylluppet" og "fotoboks til jeres bar", er et halvt svar på begge og taber til konkurrenter med én klar hensigt (Myselfie på privat, Lightbooth på erhverv). Title, H1, meta description, delingsbillede og FAQ kan kun pege ét sted hen.

**2. Teknisk SEO: erhvervsteksten fandtes ikke for Google.**
Privat/Erhverv-knappen skiftede H1 og hero-tekst i browseren (`useState`). Serveren sendte kun privatudgaven, så den eneste H1 Google så, var privat. Erhvervsbudskabet stod aldrig i HTML'en. Nu er begge sider statisk renderet med egen H1, title, canonical, OG-billede, `Service`- og `FAQPage`-strukturdata og står i `sitemap.xml`.

**3. Prisen ødelagde sig selv.**
895 kr. for en weekend og 995 kr. om måneden på samme side. Barejeren tænker "hvorfor ikke bare leje den tre fredage for 895?". Den private gæst ser "995 kr./md. ekskl. moms" og bliver i tvivl om, hvad festen koster. Inkl. og ekskl. moms på samme side er forvirrende og et forbrugerretligt minefelt: over for forbrugere skal prisen være den samlede pris inkl. moms.

**4. Budskaberne skader hinanden.**
"Saml gæsternes telefonnumre og send dem tilbud" er det stærkeste argument over for en bar, men det får et brudepar til at tænke "skal mine gæster spammes?". Omvendt får bryllupsbilleder og en bookingkalender boksen til at ligne festudlejning over for en barejer, der skal købe et fast stykke inventar med afkast.

**5. Det er reelt to produkter.**
Privat: stander, én boks, én aften, levering, eget tema med navne og dato. Erhverv: vægmontering med tyverilås, fotomodul med betaling pr. foto, kontrolpanel, gæsteliste, flere bokse (skattejagt, rundtur), guldtid med en øl som præmie, boksens sider og lysring i stedets farver. Den gamle side lovede alle alting. Temasektionen lovede fx printede sider og lysring i egne farver til private, hvilket kun er til faste steder.

**6. To mål giver ingen konvertering.**
Hver side skal have én primær handling. Før var knappen i menuen "Book en boks" (privat), mens kontaktformularen startede på "Et sted eller firma" (erhverv). Nu er det "Se ledige datoer" på `/` og "Book en snak" på `/erhverv`.

**7. Annoncer, måling og salg.**
Google Ads giver bedre kvalitetsresultat og lavere klikpris, når landingssiden matcher søgningen. Analyse kan nu skelne de to tragte. Sælgeren kan sende `selfi.dk/erhverv` til en bodega uden at ejeren lander på en bryllupskalender.

## Hvad der deles

Produktet, brandet, "Sådan virker den", designsystemet og komponenterne. Hver sektion tager sin tekst og sine billeder fra siden, så de to sider ser ens ud og taler hver sit sprog.

## Grænsetilfælde

- **Firmafest og julefrokost** hører under `/`, selv om køberen er en virksomhed. Opgaven er "en fest med en dato", ikke "et sted". Vi deler efter opgaven, ikke efter CVR-nummer. FAQ'en på `/` forklarer, at et fast sted skal se `/erhverv`.
- **Festivaler, forlystelsesparker og zoo** har deres egen side, `/events` (oktober 2026). De køber noget andet end en bar: omtale og branding i deres eget univers, flere bokse med skattejagt og rundtur, sponsorer og sæsoner. De har deres egen film og deres egne spørgsmål og svar, og 3D-showroomet med temaerne ligger her. `/erhverv` handler kun om barer, værtshuse og natklubber.
- **Krydslinks** er altid synlige, men aldrig i vejen: "Til barer og hoteller" / "Privat fest" / "Til barer og klubber" i menuen ("Erhverv" / "Privat" / "Barer" på mobil) og alle tre sider i footeren.

## Hvorfor privat er forsiden

Langt de fleste søgninger er private ("lej fotoboks", "fotoboks til bryllup"), og forsiden er sidens stærkeste URL. En tynd vejviser-forside ville koste den søgetrafik et ekstra klik og ikke ranke på noget. Erhverv kommer mest via opsøgende salg og direkte links, så de klarer sig fint med `/erhverv` og et tydeligt link i menuen. Det er samme mønster, som danske kunder kender fra banker og teleselskaber.

## Næste sider (i prioriteret rækkefølge)

1. `/fotoboks-til-bryllup`: den største enkeltsøgning med egen hensigt. Egne billeder, tema med navne og dato, FAQ om bryllupper.
2. `/fotoboks-til-firmafest`: julefrokost, reception, sommerfest. Faktura og pris ekskl. moms til firmaer, når det er besluttet.
3. ~~`/erhverv/festival`~~: lavet som `/events`.
4. Bysider ("lej fotoboks Aarhus" osv.), først når leveringsområdet er besluttet. Ellers lover vi noget, vi ikke kan holde.
5. Guides, der svarer på søgninger: "Hvad koster en fotoboks?", "Fotoboks eller fotograf til brylluppet?".

## Skal afklares (står ikke på siderne, før det er besluttet)

- **Erhverv:** binding og opsigelse, internet (wifi eller 4G), prøveperiode, og om en ny boks også gælder ved tyveri og skader fra gæster. Installation og service er besluttet: Stedet hænger selv boksen op efter monteringsguiden (19. okt. 2026), og vi overvåger, opdaterer, har døgnsupport og sender en ny boks ved fejl (se sektionen Fuld service).
- **Privat:** hvad ombooking og afbestilling koster, leveringsområde og -pris, om Instax-film er med eller tilvalg, depositum.
- **Anmeldelser:** begge sider mangler social proof. Saml anmeldelser fra de første private lejere og citater fra de første steder.
