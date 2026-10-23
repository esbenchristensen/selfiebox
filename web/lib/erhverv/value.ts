// What the box does for a business, seen from the buyer's side. Places buy it for different reasons: some want
// fun for the guests, some want their name on every shared photo, some want a list to send to, some want more
// sold at the bar, some want something new to sell to sponsors. The same functions serve several of them.
// Goals, the function map and the industry tabs on /erhverv all read from here, so they use the same words.
// Only promise what is built: anything marked `soon` is shown as "Kommer snart" (see docs/funktioner.md in
// the platform repo).

export type GoalId = "sjov" | "branding" | "indhold" | "gaester" | "omsaetning" | "sponsor";

export type Goal = {
  id: GoalId;
  short: string; // column head in the function map and chip on the industry tabs
  title: string;
  who: string; // the places that usually buy for this reason
  story: string; // the buyer's own words: "Som ... vil jeg ..., så ..."
  how: [string, string][]; // [function page slug, what it does for this goal]
  gain: string;
};

export const goals: Goal[] = [
  {
    id: "sjov",
    short: "Sjov",
    title: "Sjov for gæsterne",
    who: "Bodegaen, hotellet, firmafesten, parken",
    story: "Som bestyrer vil jeg give gæsterne noget at grine af og samles om, uden at personalet skal styre det.",
    how: [
      ["titler", "Titler og missioner på skærmen"],
      ["guldtid", "Guldtid, hvor næste billede vinder"],
      ["konkurrence", "Konkurrence om aftenens bedste billede"],
      ["videohilsner", "Videohilsner til en ven eller et hold"],
    ],
    gain: "Gæsterne har noget at lave mellem omgangene, og ingen fra personalet skal stå ved boksen.",
  },
  {
    id: "branding",
    short: "Branding",
    title: "Jeres navn, der hvor gæsterne deler",
    who: "Natklubben, biografen, kæden, brandet",
    story: "Som marketingansvarlig vil jeg have vores navn på alt, gæsterne deler, så deres venner kan se, hvor det skete.",
    how: [
      ["eget-design", "En boks, der ligner jeres sted"],
      ["logo-og-sponsorer", "Logo og ramme på hvert billede"],
      ["deling", "Billedet på gæstens telefon med det samme"],
    ],
    gain: "Hvert delt billede er en lille annonce for jer, som gæsten selv har valgt at sende videre.",
  },
  {
    id: "indhold",
    short: "Indhold",
    title: "Billeder, video og feedback til jeres kanaler",
    who: "Festivalen, sportsklubben, hotellet med festsal",
    story: "Som SoMe-ansvarlig vil jeg have ægte billeder og video af glade gæster hver uge, uden at gå rundt med et kamera og spørge om lov.",
    how: [
      ["contentmaskine", "Billeder og video med samtykke pr. billede"],
      ["videohilsner", "Spørgsmål på video: hvad syntes I om aftenen?"],
      ["galleri-og-fotovaeg", "Galleri pr. aften og fotovæg i lokalet"],
    ],
    gain: "Materiale til opslag, nyhedsbrev og aftermovie, og gæsternes egne ord om jer.",
  },
  {
    id: "gaester",
    short: "Gæsteliste",
    title: "Gæster, der kommer igen",
    who: "Baren, natklubben, sportsklubben",
    story: "Som ejer vil jeg kunne skrive til fredagens gæster, så de kommer igen næste fredag, og vide, at jeg må.",
    how: [
      ["deling", "Gæsten skriver sit nummer for at få billedet"],
      ["gaesteliste", "Et særskilt ja til at høre fra jer"],
      ["kontrolpanel", "SMS til listen fra kontrolpanelet"],
    ],
    gain: "En liste over jeres egne gæster, der vokser hver aften, I har åbent, og som I må sende til.",
  },
  {
    id: "omsaetning",
    short: "Omsætning",
    title: "Mere solgt på aftenen",
    who: "Baren, natklubben, parken",
    story: "Som driftschef vil jeg have, at gæsterne bliver til en omgang mere og kommer forbi baren én gang til.",
    how: [
      ["guldtid", "Guldtid med præmien i baren"],
      ["rundtur", "Rundtur og skattejagt forbi baren og boderne"],
      ["konkurrence", "Præmie til aftenens bedste billede"],
      ["printede-fotos", "Printede fotos, som gæsterne betaler for"],
    ],
    gain: "Præmien hentes i baren, hvor resten af kortet står. Og gæster, der har det sjovt, går senere hjem.",
  },
  {
    id: "sponsor",
    short: "Sponsorer",
    title: "Noget nyt at sælge til sponsorerne",
    who: "Sportsklubben, festivalen, biografen, eventet",
    story: "Som sponsoransvarlig vil jeg tilbyde vores partnere noget, der bliver set og delt, ikke bare et banner mere.",
    how: [
      ["logo-og-sponsorer", "Sponsorens logo i rammen på hvert billede"],
      ["eget-design", "En boks i sponsorens design ved deres område"],
      ["skattejagt", "Skattejagt og rundtur forbi sponsorernes stande"],
    ],
    gain: "En sponsorplads, der følger med hjem på gæsternes telefoner, og som I kan sætte en pris på pr. sæson.",
  },
];

export const goalById = (id: GoalId) => goals.find((g) => g.id === id)!;

// The function map: every function a business can use, and the goals it serves. Rows link to /funktioner/<slug>.
export const functionMap: { slug: string; name: string; text: string; goals: GoalId[]; soon?: true }[] = [
  { slug: "eget-design", name: "Eget design", text: "Top, sider og kabinet printet i jeres form.", goals: ["branding", "sjov", "sponsor"] },
  { slug: "logo-og-sponsorer", name: "Logo og sponsor i rammen", text: "Jeres navn, og en partners, på hvert billede.", goals: ["branding", "sponsor"] },
  { slug: "deling", name: "Billedet på SMS", text: "Gæsten har billedet, før de går videre.", goals: ["branding", "gaester", "sjov"] },
  { slug: "contentmaskine", name: "Billeder og video", text: "Med samtykke, klar til at hente ud.", goals: ["indhold", "branding"] },
  { slug: "videohilsner", name: "Videohilsner og spørgsmål", text: "Hilsner, anmeldelser og feedback på video.", goals: ["indhold", "sjov", "sponsor"] },
  { slug: "galleri-og-fotovaeg", name: "Galleri og fotovæg", text: "Aftenens billeder på en side og en skærm.", goals: ["indhold", "sjov"] },
  { slug: "gaesteliste", name: "Gæsteliste med samtykke", text: "Kun dem, der har sagt ja. SMS fra kontrolpanelet.", goals: ["gaester", "omsaetning"] },
  { slug: "titler", name: "Titler og missioner", text: "Største smil, største gruppe, små opgaver.", goals: ["sjov"] },
  { slug: "konkurrence", name: "Konkurrence", text: "Gæsterne stemmer, vinderen får en præmie.", goals: ["sjov", "omsaetning", "indhold"] },
  { slug: "guldtid", name: "Guldtid", text: "Korte vinduer, hvor næste billede vinder.", goals: ["sjov", "omsaetning"] },
  { slug: "skattejagt", name: "Skattejagt og rundtur", text: "Fra boks til boks. Kræver mindst to bokse.", goals: ["sjov", "omsaetning", "sponsor"] },
  { slug: "printede-fotos", name: "Printede fotos", text: "Et Instax-foto i hånden, også mod betaling.", goals: ["sjov", "omsaetning", "branding"], soon: true },
];
