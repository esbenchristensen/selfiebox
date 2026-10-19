// All copy and business rules for the site live here. Selfi only sells to places now: venues, clubs,
// bars, hotels, festivals, parks and anywhere else guests gather. The box is designed for each place,
// so there is no fixed box price on the site; it is agreed per customer.

export const business = {
  minPhotoPrice: 25, // laveste pris gæsten kan betale pr. foto
  costPerPhoto: 25, // papir og film 15 kr. + Selfi 10 kr.
};

// The content-machine comparison: what a staff member would spend to make the same photos and clips.
// Stated on the page as assumptions, so visitors can see what the number rests on.
export const contentCalc = {
  minutesPerPhoto: 3, // find guests, ask, take, pick and save
  minutesPerVideo: 10, // find a guest, ask for consent, record a short answer, save
  hourlyWage: 250, // kr. pr. time inkl. omkostninger, default on the slider
};

// Picture, video and sound quality, shown on the front page. Camera: Raspberry Pi Camera Module 3 Wide
// (12 MP, autofocus, HDR, 120°). Microphone: ReSpeaker XMOS XVF3800 array (4 mics, echo cancellation,
// noise suppression, beamforming, speech up to about 5 m), chosen for gen 2 by Esben 18 Oct 2026.
export const quality: { title: string; icon: string; text: string; facts: string[] }[] = [
  {
    title: "Billeder i høj opløsning",
    icon: "M8 15 H16 L19 10 H29 L32 15 H40 V38 H8 Z M17 26 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0",
    text: "Et 12 MP-kamera med autofokus og HDR tager skarpe billeder af alle i gruppen, også dem bagerst.",
    facts: ["12 MP med autofokus", "HDR til lyse og mørke rum", "120° vidvinkel, så hele gruppen kommer med"],
  },
  {
    title: "Video i Full HD",
    icon: "M7 14 H31 V34 H7 Z M31 21 L41 15 V33 L31 27",
    text: "Videohilsner og udtalelser optages i Full HD i stående format, klar til stories, reels og skærme.",
    facts: ["Full HD-video", "Stående 9:16 til sociale medier", "Studielys på ansigterne, også i mørke lokaler"],
  },
  {
    title: "Tydelig lyd",
    icon: "M19 8 a5 5 0 0 1 10 0 V24 a5 5 0 0 1 -10 0 Z M12 22 a12 12 0 0 0 24 0 M24 34 V41 M17 41 H31",
    text: "Fire mikrofoner retter sig mod den, der taler, og fjerner støjen fra lokalet, så hilsner og udtalelser kan bruges uden efterarbejde.",
    facts: ["Fire mikrofoner, der finder den, der taler", "Støjfjernelse og ekkodæmpning", "Opfanger tale op til ca. 5 meter væk"],
  },
];

export type Faq = { q: string; a: string };

// ---------- Functions ----------
// Each function has its own page at /funktioner/<slug> and a line in the "Funktioner" mega menu.
// `icon` is a path in a 48 × 48 box, drawn as a 2 px line like the activity icons.

export type FeatureGroup = "univers" | "content" | "aktiviteter" | "drift";

export const featureGroups: { id: FeatureGroup; name: string }[] = [
  { id: "univers", name: "Jeres univers" },
  { id: "content", name: "Content og gæster" },
  { id: "aktiviteter", name: "Aktiviteter" },
  { id: "drift", name: "Drift" },
];

export type Feature = {
  slug: string;
  group: FeatureGroup;
  name: string;
  short: string; // one line in the menu and on cards
  icon: string;
  title: string; // H1 on the function page
  lede: string;
  seo: { title: string; description: string };
  photo: { src: string; alt: string; pos?: string };
  points: [string, string][]; // what it does, three or four
  uses: [string, string][]; // how different places use it
  faq: Faq[];
};

export const features: Feature[] = [
  {
    slug: "contentmaskine",
    group: "content",
    name: "Contentmaskinen",
    short: "Autentiske billeder og videoer hver aften.",
    icon: "M8 12 H40 V38 H8 Z M8 19 H40 M15 12 L19 19 M25 12 L29 19 M35 12 L39 19 M21 24 V33 L29 28.5 Z",
    title: "Ikke bare en fotoboks. En contentmaskine.",
    lede: "Selfi Boks laver autentiske billeder og videoer af jeres gæster hver eneste aften, uden at nogen skal stå med kameraet. Med samtykke kan I bruge dem på sociale medier, i nyhedsbreve, på hjemmesiden, på skærme og i annoncer.",
    seo: {
      title: "Fotoboksen som contentmaskine: autentiske billeder og videoer | Selfi",
      description: "Selfi Boks laver hundredvis af autentiske billeder og videoklip af jeres gæster hver måned, klar til jeres kanaler. Se, hvad det svarer til i medarbejdertimer.",
    },
    photo: { src: "/photos/sted-festival.jpg", alt: "Gæster ved Selfi Boks på en festival i skoven", pos: "50% 50%" },
    points: [
      ["Autentisk, ikke iscenesat", "Gæsterne tager billederne selv, midt i stemningen. Det er ægte mennesker, der har det sjovt hos jer, og det kan mærkes."],
      ["Billeder og video i høj kvalitet", "12 MP-billeder, Full HD-video og tydelig lyd fra fire mikrofoner med støjfjernelse. Stående til stories og klar til feeds."],
      ["Samlet og med samtykke", "Alt ligger samlet i kontrolpanelet, og kun det, gæsten har sagt ja til, må bruges."],
      ["Hver aften, hele aftenen", "Boksen holder ikke fri, bliver ikke træt og skal ikke have løn. Den laver content, hver gang I har åbent."],
    ],
    uses: [
      ["Baren", "Fredagens bedste billeder bliver lørdagens opslag, og ugens video bliver næste uges annonce."],
      ["Festivalen", "Publikums egne ord om festivalen bliver næste års markedsføring og materiale til sponsorerne."],
      ["Klubben", "Fansenes billeder og hilsner til holdet fylder kanalerne mellem kampene."],
    ],
    faq: [
      { q: "Må vi bruge billederne og videoerne?", a: "Ja, dem hvor gæsten har sagt ja til det. Boksen spørger gæsten, og kun det, gæsten har sagt ja til, må bruges." },
      { q: "Hvor meget content laver boksen?", a: "Det afhænger af stedet og hvor mange aftener, I har åbent. Brug regneeksemplet ovenfor med jeres egne tal." },
      { q: "Hvordan får vi fat i materialet?", a: "I henter billeder og klip i kontrolpanelet, når I skal bruge dem. Hver aften får også sin egen side med alle fotos." },
    ],
  },
  {
    slug: "eget-design",
    group: "univers",
    name: "Eget design",
    short: "Boksen formet og farvet efter jeres sted.",
    icon: "M24 7 C14 7 7 14 7 23 C7 32 14 41 22 41 C25 41 25 38 23 36 C21 34 22 31 25 31 H31 C37 31 41 27 41 21 C41 13 33 7 24 7 Z M16 22 a2 2 0 1 0 0.1 0 M22 15 a2 2 0 1 0 0.1 0 M31 16 a2 2 0 1 0 0.1 0",
    title: "En fotoboks, der ligner jeres sted.",
    lede: "Vi designer top, sider og kabinet sammen med jer og printer delene selv. Lysringen, skærmen og rammen på hvert foto får jeres farver, figurer og logo. Så ser boksen ud, som om den altid har hørt til hos jer.",
    seo: {
      title: "Fotoboks i jeres eget design til venue, klub og festival | Selfi",
      description: "Selfi Boks designet til jeres sted: top, sider, lysring, skærm og fotoramme i jeres farver og med jeres logo. Vi printer delene selv.",
    },
    photo: { src: "/photos/sted-festival.jpg", alt: "Gæster ved Selfi Boks på en festival i skoven", pos: "50% 50%" },
    points: [
      ["Formen", "Top og sider printes i præcis den form, stedet kalder på: et halstørklæde, en lysmast, et gevir eller en hel figur."],
      ["Farverne", "Kabinettet og lysringen i jeres farver, så boksen kan ses og genkendes fra den anden ende af lokalet."],
      ["Skærmen", "En velkomst i jeres stil, når gæsterne kommer hen til boksen, og tekster i jeres tone."],
      ["Fotoet", "En ramme med jeres navn og logo på hvert eneste billede, der bliver taget og delt."],
    ],
    uses: [
      ["Festivalen", "Boksen i festivalens farver og med årets tema, så den bliver en del af pladsen og ikke bare en ting, der står der."],
      ["Klubben", "Klubbens farver, logo og et halstørklæde over toppen. Fansene tager billede før kampen og deler det med det samme."],
      ["Baren", "En boks, der passer til indretningen, fra bodegaen med træpanel til cocktailbaren med messing."],
    ],
    faq: [
      { q: "Hvem laver designet?", a: "Det gør vi sammen med jer. I sender logo, farver og gerne billeder af stedet, så kommer vi med et forslag, som I godkender, før vi printer." },
      { q: "Kan designet skifte i løbet af året?", a: "Ja. Skærmen og rammen skifter I selv i kontrolpanelet, fx til jul eller en særlig aften. Skal boksens sider også skifte, printer vi nye dele." },
      { q: "Hvad koster et eget design?", a: "Prisen afhænger af designet, antal bokse og perioden. Book en snak, så laver vi et tilbud til jer." },
    ],
  },
  {
    slug: "logo-og-sponsorer",
    group: "univers",
    name: "Logo og sponsorer",
    short: "Jeres navn og jeres sponsorer på hvert foto.",
    icon: "M10 8 H38 V40 H10 Z M15 13 H33 V30 H15 Z M17 35 H25",
    title: "Jeres navn på hvert billede, der bliver delt.",
    lede: "Hvert foto fra boksen får en ramme med jeres navn og logo. Når gæsterne deler billedet, ser deres venner, hvor de var. Der er også plads til en sponsor ved siden af jeres eget navn.",
    seo: {
      title: "Logo og sponsorer på hvert foto fra fotoboksen | Selfi",
      description: "Jeres logo og jeres sponsorer i rammen på hvert foto fra Selfi Boks. Hver deling på de sociale medier viser jeres sted frem.",
    },
    photo: { src: "/photos/print-club.jpg", alt: "Foto fra Selfi Boks med stedets navn i rammen", pos: "50% 50%" },
    points: [
      ["Omtale, I ikke betaler for", "Gæsterne deler billederne samme aften, og hvert billede bærer jeres navn."],
      ["Plads til sponsorer", "Rammen designes frit, så en sponsor kan komme med på hvert billede, fx ved en scene eller en kamp."],
      ["Skift når I vil", "Ramme og tekst skifter I i kontrolpanelet, fx til en bestemt aften eller en kampagne."],
    ],
    uses: [
      ["Festivalen", "Festivalens navn og hovedsponsoren i rammen. Sponsoren får synlighed på tusindvis af delte billeder."],
      ["Klubben", "Klubbens logo og kampens dato på hvert billede, så fotoet bliver et minde fra netop den kamp."],
      ["Hotellet", "Hotellets navn i rammen, så minderne fra opholdet viser vej tilbage."],
    ],
    faq: [
      { q: "Kan vi have flere sponsorer?", a: "Ja. Rammen kan skifte mellem sponsorer, fx én pr. dag, pr. område eller pr. boks." },
      { q: "Hvem laver rammen?", a: "Vi laver den sammen med jer ud fra jeres logo og farver, og I kan selv rette tekster i kontrolpanelet bagefter." },
    ],
  },
  {
    slug: "deling",
    group: "content",
    name: "Deling via QR og SMS",
    short: "Billedet på telefonen med det samme.",
    icon: "M17 24 L31 15 M17 24 L31 33 M11 24 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M29 13 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M29 35 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
    title: "Billedet på telefonen, før gæsterne går videre.",
    lede: "Efter hvert billede viser skærmen en QR-kode, og gæsten kan også få billedet på SMS. Så ligger det klar til at blive delt, mens stemningen stadig er der.",
    seo: {
      title: "Fotoboks med deling via QR-kode og SMS | Selfi",
      description: "Gæsterne får billedet fra Selfi Boks på telefonen via QR-kode eller SMS og deler det samme aften, med jeres navn i rammen.",
    },
    photo: { src: "/photos/klub.jpg", alt: "Selfi Boks på en betonsøjle i en natklub med venner på skærmen", pos: "50% 40%" },
    points: [
      ["QR-kode", "Gæsten scanner koden på skærmen og har billedet på få sekunder. Ingen app."],
      ["SMS", "Vil gæsten hellere have et link på SMS, skriver de deres nummer. Siger de ja, lander nummeret på jeres gæsteliste."],
      ["Klar til deling", "Billedet er i et format, der passer til stories og feeds, med jeres ramme på."],
    ],
    uses: [
      ["Natklubben", "Billedet er på Instagram, før gæsterne er tilbage på dansegulvet."],
      ["Festivalen", "Gæsterne deler fra pladsen, og deres venner ser festivalens navn i rammen."],
      ["Firmaeventet", "Deltagerne får billedet med det samme og deler det på LinkedIn med firmaets navn på."],
    ],
    faq: [
      { q: "Skal gæsterne hente en app?", a: "Nej. QR-koden åbner billedet direkte i browseren på telefonen." },
    ],
  },
  {
    slug: "videohilsner",
    group: "content",
    name: "Videohilsner",
    short: "Korte videoer og udtalelser fra gæsterne.",
    icon: "M7 14 H31 V34 H7 Z M31 21 L41 15 V33 L31 27",
    title: "Gæsternes egne ord, klar til jeres kanaler.",
    lede: "Boksen kan optage korte videoer. Gæsterne siger hej, sender en hilsen eller svarer på et spørgsmål, I har valgt, fx “Hvad er det sjoveste ved i aften?”. Det giver jer ægte udtalelser, der er klar til de sociale medier.",
    seo: {
      title: "Fotoboks med videohilsner og video-udtalelser fra gæster | Selfi",
      description: "Selfi Boks optager korte videohilsner og svar på jeres spørgsmål. Ægte udtalelser fra gæsterne, klar til jeres sociale medier.",
    },
    photo: { src: "/photos/sted-festival.jpg", alt: "Gæster foran Selfi Boks på en festival", pos: "50% 50%" },
    points: [
      ["Jeres spørgsmål", "I vælger spørgsmålene på skærmen, og I kan skifte dem fra dag til dag."],
      ["Færdigt content", "Korte, stående klip i Full HD med jeres ramme, som I kan bruge på de sociale medier, når gæsten har sagt ja."],
      ["Klar lyd", "Fire mikrofoner med støjfjernelse fanger stemmen tydeligt, også i et larmende lokale, så klippene kan bruges uden efterarbejde."],
      ["Hilsner", "Gæsterne kan sende en hilsen til en ven, et band eller et hold, som I kan vise frem."],
    ],
    uses: [
      ["Festivalen", "Publikum fortæller, hvad de bedst kan lide ved festivalen. Det er næste års markedsføring."],
      ["Klubben", "Fansene sender en hilsen til holdet før kampen."],
      ["Lanceringen", "Gæsterne siger, hvad de synes om det nye produkt, mens de står med det i hånden."],
    ],
    faq: [
      { q: "Må vi bruge videoerne?", a: "Kun dem, hvor gæsten har sagt ja til det." },
      { q: "Hvor lange er videoerne?", a: "Korte. I bestemmer længden i kontrolpanelet, så klippene er lette at bruge." },
    ],
  },
  {
    slug: "galleri-og-fotovaeg",
    group: "content",
    name: "Galleri og fotovæg",
    short: "Alle fotos samlet, også på en skærm i lokalet.",
    icon: "M8 8 H22 V22 H8 Z M26 8 H40 V22 H26 Z M8 26 H22 V40 H8 Z M26 26 H40 V40 H26 Z",
    title: "Alle aftenens billeder ét sted.",
    lede: "Hver aften eller hvert event får sin egen side med alle fotos. Billederne kan også køre på en fotovæg, en skærm i lokalet, så gæsterne ser sig selv og hinanden, mens festen er i gang.",
    seo: {
      title: "Fotogalleri og fotovæg til jeres sted | Selfi",
      description: "Alle fotos fra Selfi Boks samles på en side for hver aften og kan vises på en fotovæg i lokalet.",
    },
    photo: { src: "/photos/sted-vaertshus.jpg", alt: "Venner på et værtshus foran Selfi Boks på murstensvæggen", pos: "60% 45%" },
    points: [
      ["En side pr. aften", "Gæsterne finder deres billeder bagefter og deler dem igen."],
      ["Fotovæg", "Nye billeder vises på en skærm i lokalet med det samme. Det skaber kø ved boksen."],
      ["Til jeres egne kanaler", "Siger gæsten ja, kan I bruge billedet på jeres sociale medier og hjemmeside."],
    ],
    uses: [
      ["Baren", "Fotovæggen bag baren viser fredagens billeder, mens aftenen er i gang."],
      ["Konferencen", "En skærm ved udgangen viser dagens billeder, og deltagerne finder dem på siden bagefter."],
      ["Festivalen", "En side pr. festivaldag, som I kan dele i nyhedsbrevet og på de sociale medier."],
    ],
    faq: [
      { q: "Hvor længe ligger billederne på siden?", a: "Det aftaler vi med jer, så det passer til jeres sted og til reglerne for gæsternes data." },
    ],
  },
  {
    slug: "gaesteliste",
    group: "content",
    name: "Gæsteliste",
    short: "Telefonnumre med samtykke, som I må bruge.",
    icon: "M17 17 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M9 40 C9 31 15 27 23 27 C31 27 37 31 37 40 M34 12 H42 M34 18 H42",
    title: "En gæsteliste, I må invitere tilbage.",
    lede: "Gæsten skriver sit nummer for at få billedet på SMS og kan samtidig sige ja til at høre fra jer. Kun dem, der har sagt ja, kommer på listen, så I kan sende et tilbud til næste weekend og holde jer inden for reglerne.",
    seo: {
      title: "Fotoboks, der samler en gæsteliste med samtykke | Selfi",
      description: "Selfi Boks samler telefonnumre med samtykke, så I kan invitere gæsterne tilbage med SMS og nyhedsbrev og holde jer inden for reglerne.",
    },
    photo: { src: "/photos/sted-bodega.jpg", alt: "Selfi Boks fotoboks på væggen i en bodega", pos: "50% 45%" },
    points: [
      ["Samtykke fra start", "Gæsten siger selv ja til at høre fra jer. Nej betyder bare billedet og intet andet."],
      ["Klar til brug", "Listen ligger i kontrolpanelet og kan hentes ud til jeres SMS- eller nyhedsbrevsværktøj."],
      ["Sikker opbevaring", "Numre og billeder opbevares sikkert og bruges kun til det, gæsten har sagt ja til."],
    ],
    uses: [
      ["Baren", "Fredagens gæster får et tilbud til næste fredag."],
      ["Festivalen", "Publikum kommer på listen til næste års billetsalg."],
      ["Forlystelsesparken", "Gæsterne får besked om nye forlystelser og sæsonstart."],
    ],
    faq: [
      { q: "Er det lovligt at sende SMS til gæsterne?", a: "Ja, når gæsten selv har sagt ja til at modtage markedsføring fra jer. Boksen spørger om det, og kun dem, der har sagt ja, kommer på listen." },
      { q: "Ejer vi listen?", a: "Ja. Det er jeres gæster og jeres liste, og I kan hente den ud, når I vil." },
    ],
  },
  {
    slug: "titler",
    group: "aktiviteter",
    name: "Titler",
    short: "Aftenens største smil får sin titel.",
    icon: "M10 33 V17 L18 24 L24 13 L30 24 L38 17 V33 Z M10 38 H38",
    title: "Aftenens største smil får sin titel.",
    lede: "Boksen kårer aftenens største smil, største gruppe og andre titler, I vælger, og stempler titlen på billedet. Det giver gæsterne en grund til at prøve igen.",
    seo: {
      title: "Titler i fotoboksen: aftenens største smil og gruppe | Selfi",
      description: "Selfi Boks kårer aftenens største smil og største gruppe og stempler titlen på billedet. En aktivitet, der får gæsterne til at prøve igen.",
    },
    photo: { src: "/photos/klub.jpg", alt: "Selfi Boks i en natklub med venner på skærmen", pos: "50% 40%" },
    points: [
      ["Titler, I vælger", "Største smil, største gruppe eller en titel, der passer til jeres sted og jeres aften."],
      ["Stemplet på billedet", "Titlen står på fotoet, så den bliver delt sammen med jeres navn."],
      ["Slå til og fra", "I bestemmer i kontrolpanelet, hvilke aftener titlerne kører."],
    ],
    uses: [
      ["Natklubben", "Aftenens største gruppe vinder en flaske og får titlen på billedet."],
      ["Klubben", "Dagens største fan kåres i pausen."],
      ["Firmafesten", "Kollegerne kæmper om at blive aftenens største smil."],
    ],
    faq: [{ q: "Hvordan vælger boksen vinderen?", a: "Kameraet måler smil og tæller ansigter, så titlerne afgøres af billederne selv." }],
  },
  {
    slug: "missioner",
    group: "aktiviteter",
    name: "Missioner",
    short: "Små opgaver, som kameraet tjekker.",
    icon: "M19 7 H29 A9 9 0 0 1 38 16 V32 A9 9 0 0 1 29 41 H19 A9 9 0 0 1 10 32 V16 A9 9 0 0 1 19 7 Z M18 24 l4 4 8-9",
    title: "Små missioner, der får gæsterne til at mødes.",
    lede: "Skærmen giver gæsterne små opgaver, fx at tage et billede med en, de ikke kender, eller at få fem personer med på billedet. Kameraet tjekker, om de klarede den.",
    seo: {
      title: "Missioner i fotoboksen, der får gæsterne til at mødes | Selfi",
      description: "Selfi Boks giver gæsterne små missioner, som kameraet tjekker. En nem måde at få liv i lokalet og gæsterne til at blive.",
    },
    photo: { src: "/photos/sted-vaertshus.jpg", alt: "Venner på et værtshus griner foran Selfi Boks", pos: "60% 45%" },
    points: [
      ["Jeres missioner", "Vælg fra vores liste eller skriv jeres egne, der passer til stedet."],
      ["Kameraet tjekker", "Boksen ser, om missionen er klaret, og viser det på billedet."],
      ["En grund til at blive", "Der er altid en mission mere at klare."],
    ],
    uses: [
      ["Baren", "“Tag et billede med en fra et andet bord” gør fremmede til selskab."],
      ["Konferencen", "Deltagerne skal finde en fra en anden afdeling. Netværk uden navneskilte."],
      ["Festivalen", "Missioner, der passer til dagens program og kunstnere."],
    ],
    faq: [{ q: "Kan vi skrive vores egne missioner?", a: "Ja. I skriver dem i kontrolpanelet og vælger, hvornår de skal køre." }],
  },
  {
    slug: "konkurrence",
    group: "aktiviteter",
    name: "Konkurrence",
    short: "Gæsterne stemmer på aftenens bedste billede.",
    icon: "M16 9 H32 V18 A8 8 0 0 1 16 18 Z M16 12 H11 A5 5 0 0 0 16 20 M32 12 H37 A5 5 0 0 1 32 20 M24 26 V33 M17 39 H31",
    title: "Aftenens bedste billede vinder.",
    lede: "Gæsterne stemmer på aftenens bedste billede, og vinderen får en præmie, I vælger. Det får folk til at tage et billede mere og dele det for at få stemmer.",
    seo: {
      title: "Fotokonkurrence i fotoboksen med præmie | Selfi",
      description: "Lad gæsterne stemme på aftenens bedste billede fra Selfi Boks. Vinderen får en præmie, og alle deler for at få stemmer.",
    },
    photo: { src: "/photos/sted-julefrokost.jpg", alt: "Gæster til et selskab foran Selfi Boks", pos: "55% 40%" },
    points: [
      ["Alle kan stemme", "Gæsterne stemmer på de billeder, de bedst kan lide."],
      ["Jeres præmie", "En drink, en billet, en trøje. I vælger præmien og hvornår vinderen kåres."],
      ["Flere delinger", "Gæsterne deler deres billede for at få stemmer, og jeres navn følger med."],
    ],
    uses: [
      ["Baren", "Månedens bedste billede vinder en bordreservation med en flaske."],
      ["Klubben", "Sæsonens bedste fanbillede vinder en signeret trøje."],
      ["Festivalen", "Dagens bedste billede vinder billetter til næste år."],
    ],
    faq: [{ q: "Hvor længe kører en konkurrence?", a: "Så længe I vil, en aften, en weekend eller en hel sæson." }],
  },
  {
    slug: "guldtid",
    group: "aktiviteter",
    name: "Guldtid",
    short: "Korte vinduer, hvor næste billede vinder.",
    icon: "M10 26 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M24 18 V26 L29 29 M20 7 H28",
    title: "Guldtid: næste billede vinder en præmie.",
    lede: "I korte, synlige vinduer vinder næste billede en præmie, fx en gratis øl. Alle i lokalet kan se, når det er guldtid, og det skaber kø på få sekunder.",
    seo: {
      title: "Guldtid i fotoboksen: skab kø på få sekunder | Selfi",
      description: "Med Guldtid vinder næste billede fra Selfi Boks en præmie. Lysringen viser det, og der er kø på få sekunder.",
    },
    photo: { src: "/photos/sted-bodega.jpg", alt: "Selfi Boks på væggen i en bodega", pos: "50% 45%" },
    points: [
      ["Kø på sekunder", "Guldtiden er synlig for hele lokalet, så alle ved, at nu gælder det."],
      ["En præmie, I alligevel sælger", "En øl eller en shot, der koster jer lidt og giver meget liv."],
      ["I bestemmer tempoet", "Hvor ofte og hvornår guldtiden kommer, styres fra kontrolpanelet."],
    ],
    uses: [
      ["Baren", "Guldtid hver halve time på en stille tirsdag giver gang i lokalet."],
      ["Natklubben", "Guldtid lige før midnat holder folk på stedet."],
      ["Festivalen", "Guldtid ved boksen, når I vil flytte folk hen til et nyt område."],
    ],
    faq: [{ q: "Hvad kan præmien være?", a: "Det bestemmer I. En øl, en shot eller en billet. Det vigtigste er, at den er let at udlevere." }],
  },
  {
    slug: "skattejagt",
    group: "aktiviteter",
    name: "Skattejagt",
    short: "Spor fra boks til boks gennem en historie.",
    icon: "M9 39 C15 33 13 25 21 24 S31 19 32 13 M34 7 l7 7 M41 7 l-7 7",
    title: "En skattejagt fra boks til boks.",
    lede: "Med flere bokse på området følger gæsterne spor fra boks til boks gennem en lille historie. I bestemmer ruten, fx forbi en scene, et dyreanlæg eller en butik, og hvilken præmie der venter til sidst.",
    seo: {
      title: "Skattejagt med fotobokse til festival, park og zoo | Selfi",
      description: "Med flere Selfi Bokse bliver området en skattejagt. Gæsterne følger spor fra boks til boks, og I bestemmer ruten og præmien.",
    },
    photo: { src: "/photos/sted-festival.jpg", alt: "Gæster ved Selfi Boks på en festival i skoven", pos: "50% 50%" },
    points: [
      ["Jeres historie", "Sporene bygger på jeres univers, jeres figurer og jeres sted."],
      ["Jeres rute", "Send gæsterne forbi de steder, I gerne vil vise frem."],
      ["En præmie til sidst", "Den, der finder alle spor, får præmien, I har valgt."],
    ],
    uses: [
      ["Forlystelsesparken", "Børnene følger parkens figur fra forlystelse til forlystelse."],
      ["Zoo", "Sporene går forbi de dyr, I vil have flere til at se."],
      ["Festivalen", "Skattejagten leder publikum forbi sponsorernes stande."],
    ],
    faq: [{ q: "Hvor mange bokse skal der til?", a: "En skattejagt kræver flere bokse. Hvor mange afhænger af området og ruten, og det finder vi ud af sammen med jer." }],
  },
  {
    slug: "rundtur",
    group: "aktiviteter",
    name: "Rundtur",
    short: "Et stempel ved hver boks på ruten.",
    icon: "M15 11 H33 A8 8 0 0 1 41 19 V29 A8 8 0 0 1 33 37 H15 A8 8 0 0 1 7 29 V19 A8 8 0 0 1 15 11 Z M12.5 24 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M20.5 24 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0 M28.5 24 a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0",
    title: "En rundtur med et stempel ved hver boks.",
    lede: "Gæsterne samler et stempel ved hver boks på ruten. Fuldt kort giver en præmie. Det virker på en barrunde i byen, på en festival og på tværs af flere steder i samme kæde.",
    seo: {
      title: "Rundtur med fotobokse: barrunde, festival og kæder | Selfi",
      description: "Gæsterne samler et stempel ved hver Selfi Boks på ruten og vinder en præmie. Til barrunder, festivaler og kæder med flere steder.",
    },
    photo: { src: "/photos/sted-hotel.jpg", alt: "Selfi Boks på væggen i en hotelbar", pos: "30% 50%" },
    points: [
      ["Et stempel pr. boks", "Hvert billede ved en boks på ruten giver et stempel."],
      ["Flere steder sammen", "Barer i samme gade eller en kæde kan dele ruten og sende gæsterne videre til hinanden."],
      ["Præmie ved fuldt kort", "I bestemmer præmien og hvor den hentes."],
    ],
    uses: [
      ["Barrunden", "Fem barer i samme gade deler en rute, og fuldt kort giver en drink på den sidste."],
      ["Festivalen", "Et stempel ved hver scene sender publikum rundt på hele pladsen."],
      ["Hotelkæden", "Et stempel på hvert hotel i kæden giver en overnatning."],
    ],
    faq: [{ q: "Skal alle bokse på ruten være ens?", a: "Nej. Hver boks kan have sit eget design, så længe de er på samme rute." }],
  },
  {
    slug: "printede-fotos",
    group: "drift",
    name: "Printede fotos",
    short: "Et ægte foto i hånden, også mod betaling.",
    icon: "M11 7 H37 V41 H11 Z M15 11 H33 V30 H15 Z",
    title: "Et ægte foto i hånden.",
    lede: "Med fotomodulet printer boksen et Instax-foto, der fremkalder, mens gæsten står og venter. Rammen bærer jeres navn. Vil I, kan gæsterne betale for de printede fotos, så boksen tjener penge.",
    seo: {
      title: "Fotoboks med printede Instax-fotos og betaling pr. foto | Selfi",
      description: "Selfi Boks kan printe Instax-fotos med jeres navn i rammen. Gæsterne kan betale pr. foto, og I sætter selv prisen.",
    },
    photo: { src: "/photos/instax-haand.jpg", alt: "Hænder holder et frisk Instax-foto af tre venner på en bar", pos: "50% 50%" },
    points: [
      ["Et minde med hjem", "Fotoet hænger på køleskabet en måned senere, med jeres navn i rammen."],
      ["Betaling pr. foto", `I sætter prisen pr. foto. Alt over ${business.costPerPhoto} kr. pr. foto går til jer.`],
      ["Kun når I vil", "Printet er et tilvalg. Den digitale udgave kommer altid via QR-kode eller SMS."],
    ],
    uses: [
      ["Baren", "Gæsterne betaler for et print, og baren tjener på hvert foto."],
      ["Hotellet", "Et printet foto som minde fra opholdet eller brylluppet i festsalen."],
      ["Lanceringen", "Hver gæst går hjem med et foto med produktet og jeres navn."],
    ],
    faq: [{ q: "Hvad koster et print for os?", a: `Papir og drift koster ${business.costPerPhoto} kr. pr. foto. Tager I mere for det, går forskellen til jer.` }],
  },
  {
    slug: "kontrolpanel",
    group: "drift",
    name: "Kontrolpanel",
    short: "Tema, tekster og aktiviteter fra nettet.",
    icon: "M10 14 H38 M10 24 H38 M10 34 H38 M28 11 V17 M17 21 V27 M32 31 V37",
    title: "Styr boksen fra et kontrolpanel på nettet.",
    lede: "Tema, tekster, priser og aktiviteter styrer I fra et kontrolpanel på nettet. Her finder I også gæstelisten, billederne og videoerne. Vil I ikke selv, gør vi det for jer.",
    seo: {
      title: "Kontrolpanel til jeres fotobokse | Selfi",
      description: "Styr tema, tekster, priser og aktiviteter i jeres Selfi Bokse fra et kontrolpanel på nettet, og find gæsteliste, billeder og videoer.",
    },
    photo: { src: "/photos/sted-hotel.jpg", alt: "Selfi Boks på væggen i en hotelbar", pos: "30% 50%" },
    points: [
      ["Alle bokse ét sted", "Har I flere bokse, styrer I dem samlet eller hver for sig."],
      ["Skift på sekunder", "Ny ramme, nyt spørgsmål eller guldtid i aften. Det slår igennem med det samme."],
      ["Gæsteliste og billeder", "Hent gæstelisten, billederne og videoerne ud, når I skal bruge dem."],
    ],
    uses: [
      ["Kæden", "Hovedkontoret sætter kampagnen i alle bokse, og hvert sted retter sine egne tekster."],
      ["Festivalen", "Dagens program og sponsor skifter i rammen hver morgen."],
      ["Baren", "Guldtid slås til en stille tirsdag med et par tryk på telefonen."],
    ],
    faq: [{ q: "Skal vi bruge kontrolpanelet?", a: "Nej. Boksen kører af sig selv, og vi hjælper gerne med ændringer. Kontrolpanelet er der, når I vil gøre det selv." }],
  },
  {
    slug: "fuld-service",
    group: "drift",
    name: "Fuld service",
    short: "Vi overvåger, opdaterer og bytter boksen.",
    icon: "M24 6 L39 12 V23 C39 32 32 39 24 42 C16 39 9 32 9 23 V12 Z M17 24 l5 5 9-10",
    title: "I holder åbent. Vi tager os af boksen.",
    lede: "I hænger boksen op med vægbeslaget og vores korte guide. Vi holder øje med den, opdaterer den og sender en ny, hvis noget går galt. I kan ringe til os døgnet rundt.",
    seo: {
      title: "Fotoboks med fuld service, overvågning og døgnsupport | Selfi",
      description: "Selfi overvåger og opdaterer jeres fotobokse og sender en ny, hvis noget går galt. Support døgnet rundt.",
    },
    photo: { src: "/photos/klub.jpg", alt: "Selfi Boks på en betonsøjle i en natklub", pos: "50% 40%" },
    points: [
      ["Nem opsætning", "Boksen kommer med vægbeslag, tyverilås og en kort guide. I hænger den selv op på ca. 20 minutter."],
      ["Overvågning", "Boksen melder sig til os hele tiden. Driller den, får vi en alarm, ofte før I opdager det."],
      ["Ny boks", "Går en boks i stykker, sender vi en ny med det samme. I betaler ikke for reparation."],
      ["Support døgnet rundt", "Ring eller skriv, også lørdag kl. 01."],
    ],
    uses: [
      ["Natklubben", "Ingen personale ved boksen. Den kører hele natten, og vi har øje på den."],
      ["Festivalen", "Boksene hænges op på få minutter før åbning, og vi har øje på dem hele festivalen."],
      ["Hotellet", "Boksen hænger fast i lobbyen eller baren, og opdateringer kommer af sig selv."],
    ],
    faq: [{ q: "Kommer der regninger ud over den aftalte pris?", a: "Nej. Service, opdateringer, support og en ny boks, hvis noget går galt, er med i den pris, vi aftaler." }],
  },
];

export const featureBySlug = (slug: string) => features.find((f) => f.slug === slug);

// ---------- Activities ----------
// The six games, shown as a block on the front page. Each has its own function page.
export type ActivityId = "titler" | "missioner" | "skattejagt" | "rundtur" | "konkurrence" | "guldtid";

export const activities: { id: ActivityId; name: string; text: string }[] = [
  { id: "titler", name: "Titler", text: "Boksen kårer aftenens største smil og største gruppe og stempler titlen på billedet." },
  { id: "missioner", name: "Missioner", text: "Små opgaver på skærmen, fx at tage et billede med en, man ikke kender. Kameraet tjekker, om I klarede den." },
  { id: "skattejagt", name: "Skattejagt", text: "Gæsterne følger spor fra boks til boks gennem en lille historie. Kræver flere bokse." },
  { id: "rundtur", name: "Rundtur", text: "Gæsterne samler et stempel ved hver boks på ruten, fx på en barrunde eller en festival." },
  { id: "konkurrence", name: "Konkurrence", text: "Gæsterne stemmer på aftenens bedste billede, og vinderen får en præmie." },
  { id: "guldtid", name: "Guldtid", text: "I korte, synlige vinduer vinder næste billede en præmie, fx en gratis øl. Det skaber kø på få sekunder." },
];

// ---------- Front page FAQ ----------
// Every kind of place: design, reach, games, data, service. The price is agreed per place.
export const faq: Faq[] = [
  {
    q: "Kan boksen laves i vores design?",
    a: "Ja, det er det, vi gør. Vi designer top, sider og kabinet sammen med jer og printer delene selv. Lysringen, skærmen og rammen på hvert foto får jeres farver, figurer og logo.",
  },
  {
    q: "Hvilke steder passer Selfi Boks til?",
    a: "Til alle steder, hvor gæster samles: barer, natklubber, sportsklubber, hoteller, restauranter, festivaler, forlystelsesparker, zoo, biografer, messer og konferencer.",
  },
  {
    q: "Hvad gør boksen for os?",
    a: "Den giver gæsterne noget at samles om og en grund til at blive. Jeres navn står i rammen på hvert foto, så hver deling er omtale, og gæstelisten giver jer en direkte vej til at invitere dem igen.",
  },
  {
    q: "Kan vi bruge billederne og videoerne i vores egen markedsføring?",
    a: "Ja, når gæsten har sagt ja til det. Boksen laver autentiske billeder og videoklip hver aften, som I kan bruge på sociale medier, i nyhedsbreve, på hjemmesiden og i annoncer.",
  },
  {
    q: "Hvor god er kvaliteten af billeder, video og lyd?",
    a: "Høj nok til at bruge i jeres egen markedsføring. Boksen tager billeder med et 12 MP-kamera med autofokus og HDR, optager video i Full HD og har fire mikrofoner med støjfjernelse, der fanger stemmerne tydeligt, også når der er larm i lokalet. Lysringen bliver til studielys, så ansigterne står skarpt, også i et mørkt lokale.",
  },
  {
    q: "Kan en sponsor komme med på billederne?",
    a: "Ja. Rammen på hvert foto designes frit, så der er plads til en sponsor ved siden af jeres eget navn.",
  },
  {
    q: "Kan vi samle kontakter til SMS og nyhedsbrev?",
    a: "Ja. Gæsten skriver sit nummer for at få billedet og kan samtidig sige ja til at høre fra jer. Kun dem, der har sagt ja, kan bruges til markedsføring, så I holder jer inden for reglerne.",
  },
  {
    q: "Skal personalet passe boksen?",
    a: "Nej. Gæsterne trykker, tager billedet og får det selv. I styrer tema, tekster og aktiviteter fra et kontrolpanel på nettet, eller vi gør det for jer.",
  },
  {
    q: "Hvem sætter boksene op og passer dem?",
    a: "I hænger dem selv op med vægbeslaget og en kort guide. Det tager ca. 20 minutter. Vi holder øje med dem hele tiden og sender en ny, hvis en går i stykker.",
  },
  {
    q: "Kan boksen stå udendørs?",
    a: "Den skal stå under tag, fx i et telt, ved en indgang eller under et halvtag. Så stopper regnen den ikke. Strømforsyningen skal ligge tørt, og boksen må ikke stå i direkte sol.",
  },
  {
    q: "Hvad koster det?",
    a: "Prisen afhænger af designet, antal bokse og perioden. Book en snak, så laver vi et tilbud til jer.",
  },
];
