import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Moments } from "@/components/Moments";
import { Nav } from "@/components/Nav";
import { Faq, PhotoStrip } from "@/components/Sections";
import { Booking } from "@/components/lej/Booking";
import { Box3D } from "@/components/lej/Box3D";
import { BoxStand } from "@/components/lej/BoxStand";
import { Compare } from "@/components/lej/Compare";
import { DrawBook, DrawParcel, DrawParty, DrawPolaroid, DrawReturn, DrawSetup, DrawStrip, Icon } from "@/components/lej/Drawings";
import { Occasions } from "@/components/lej/Occasions";
import { Personal } from "@/components/lej/Personal";
import { PrinterViewer } from "@/components/lej/PrinterViewer";
import { RentalProvider } from "@/components/lej/RentalContext";
import { Functions } from "@/components/lej/Functions";
import { Trust } from "@/components/lej/Trust";
import { StickyCta } from "@/components/lej/StickyCta";
import { campaignWhen, DEFAULT_SETTINGS, discounted, fromPrice, kr, PERIODS, type Period, type RentalSettings } from "@/lib/udlejning/core";
import { db, getSettings, todayDK } from "@/lib/udlejning/db";
import "./lej/lej.css";

// selfi.dk: rent a box for one party, booked and paid here. The page follows the questions a host has, in the
// order they ask them: what is it (the box on its floor stand in the hero), is our day free and what does it
// cost (the price in the hero, the live calendar in the booking near the bottom), why this one and not the others (one price, everything in it), how does it work, what does it look like for our party,
// what do the guests get, the box itself and what it can do, the printer, prices, why it is safe to book with us
// (the promises from the rental terms: Selfi is new and shows no reviews until it has real ones), our kind of
// party, then the booking, questions and contact. Places and businesses have /erhverv.
// Prices, the launch campaign and free days come from admin.selfi.dk → Udlejning (lib/udlejning/core.ts).

// The title and description carry the day price, so they follow the price set in admin.
export async function generateMetadata(): Promise<Metadata> {
  const s = await settings();
  const from = kr(fromPrice(s));
  return {
    title: `Lej en fotoboks fra ${from} Alt er med i prisen | Selfi`,
    description: `Fotoboks til bryllup, konfirmation, fødselsdag og firmafest fra ${from} Ubegrænsede billeder, fragt begge veje og forsikring er med. Se ledige datoer og book online.`,
    alternates: { canonical: "/" },
    openGraph: {
      title: "Lej en fotoboks til festen. Alt er med i prisen | Selfi",
      description: `Fotoboksen, der får alle med på billedet. Fra ${from} med ubegrænsede billeder, fragt og forsikring. Se ledige datoer og book online.`,
      url: "/",
      images: [{ url: "/photos/fest-bryllup-3.jpg", width: 1200, height: 896, alt: "Brudeparret og to gæster griner foran Selfi Boks i en gammel sal" }],
    },
  };
}

async function settings(): Promise<RentalSettings> {
  await connection();
  try {
    return await getSettings(await db());
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default async function Home() {
  const s = await settings();
  const from = fromPrice(s);
  const P = s.prices.periods;
  const R = s.rules;
  const camp = s.campaign ?? null;

  const faq = [
    ...(camp
      ? [
          {
            q: "Hvad er lanceringstilbuddet?",
            a: `Selfi er nyt, og som tak til dem, der booker os først, giver vi ${camp.percent} % rabat på hele bestillingen, også printeren, til alle fester ${campaignWhen(camp)}. Rabatten gælder datoer ${campaignWhen(camp)}, uanset hvornår I booker, og den er allerede trukket fra, når I vælger datoer i kalenderen. En weekend koster ${kr(discounted(P.weekend, camp))} i stedet for ${kr(P.weekend)}`,
          },
        ]
      : []),
    {
      q: "Hvad koster det at leje en fotoboks?",
      a: `I vælger selv datoerne. En hverdag koster ${kr(P.day)}, en hel weekend fra fredag til søndag ${kr(P.weekend)}, to hverdage ${kr(P.twoDays)} og en uge ${kr(P.week)}, alt inkl. moms. Har I brug for en dag mere end perioden, koster hver ekstra dag ${kr(s.prices.perExtraDay)} Printeren med ${s.printsIncluded} print koster ${kr(s.prices.printer)} Vil I gemme billederne længere, kan eventsiden holdes åben i 12 måneder i stedet for 3 for ${kr(s.prices.keep)}. Fragt begge veje, forsikring, ubegrænsede billeder og jeres egen eventside er altid med, og I ser den samlede pris, før I betaler. Der er ikke noget depositum.`,
    },
    {
      q: "Hvor sent kan vi booke?",
      a: `Første lejedag skal ligge mindst ${R.leadDays} dage frem, så boksen kan nå frem med posten. I kan booke op til ${R.monthsAhead} måneder frem. Kalenderen viser kun de dage, der er ledige.`,
    },
    {
      q: "Hvordan får vi boksen?",
      a: "Vi sender den med posten til jeres nærmeste pakkeshop, så den ligger klar senest dagen før festen. Dagen efter sidste lejedag lægger I den i kassen igen, sætter returlabelen på og afleverer den i en pakkeshop. Begge veje er betalt.",
    },
    {
      q: "Skal vi selv stille den op?",
      a: "Ja, og det tager fem minutter. Boksen sættes på gulvstativet og i en almindelig stikkontakt, og så er den klar. Der ligger en kort guide i kassen, og boksen er sat op til jeres fest, inden den bliver sendt.",
    },
    {
      q: "Skal boksen bruge internet?",
      a: "Boksen tager billeder uden internet. For at gæsterne kan hente billederne på telefonen med det samme, skal boksen på jeres wifi. I skriver koden ind, når I sætter den op. Uden wifi gemmer boksen billederne, og de kommer på jeres eventside, så snart den er på nettet igen.",
    },
    {
      q: "Hvordan får gæsterne billederne?",
      a: "Efter hvert billede viser skærmen en QR-kode. Gæsten scanner den og har billedet på telefonen, uden app og uden at oprette noget. Alle billeder samles på jeres egen eventside, så I har dem alle samlet dagen efter. Med printeren får gæsterne også billedet med hjem på papir.",
    },
    {
      q: "Hvor mange gæster passer boksen til?",
      a: "Én boks passer til de fleste fester, fra 20 til omkring 150 gæster. Der er ingen grænse på antallet af billeder. Er I flere, eller holder I fest i flere lokaler, så skriv til os.",
    },
    {
      q: "Kan boksen stå udenfor?",
      a: "Under tag og i tørvejr, fx i et telt eller en lade. Den skal bruge en stikkontakt og tåler 0 til 30 grader. Regn og fugt tåler den ikke.",
    },
    {
      q: "Hvad er forskellen på fotostrimmel og polaroid?",
      a: "Det er to måder at printe på, så I vælger kun, hvis I tager printeren med. En fotostrimmel har tre billeder under hinanden, som i en klassisk fotoautomat. Polaroid er ét billede med hvid kant og plads til en hilsen.",
    },
    {
      q: "Kan vi flytte datoen eller afbestille?",
      a: "Ja, senest 30 dage før første lejedag. Indtil da kan I flytte bookingen gratis til andre ledige datoer, eller afbestille den og få 50 % tilbage. Senere kan den hverken flyttes eller afbestilles, fordi vi holder boksen til jer og har sagt nej til andre. Der er ingen fortrydelsesret. Kommer boksen ikke frem, eller virker den ikke, og skyldes det ikke jer, får I hele lejen tilbage. Det hele står i lejebetingelserne.",
    },
    {
      q: "Hvad hvis noget går i stykker?",
      a: "Boksen er forsikret, mens den er hos jer, og forsikringen er med i prisen. Går den i stykker ved et uheld, betaler I højst selvrisikoen, som står i lejebetingelserne. Sker der noget med vilje, eller bliver boksen væk, gælder forsikringen ikke.",
    },
    {
      q: "Hvad hvis boksen ikke virker på dagen?",
      a: "Boksen er testet, før den bliver sendt, og vi kan se på afstand, om den har det godt. Driller den alligevel, så skriv til os i chatten eller på kontakt@selfi.dk på selve dagen, så hjælper vi med det samme. Kan vi ikke få den til at virke, får I hele lejen tilbage.",
    },
    {
      q: "Må vi bruge billederne, som vi vil?",
      a: "Ja. Billederne er jeres og jeres gæsters. Vi bruger dem ikke til noget, og eventsiden er kun for dem, der har linket.",
    },
    {
      q: "Vi er en virksomhed. Kan vi få faktura?",
      a: "I betaler online som alle andre og får en kvittering med moms specificeret, som kan bruges som bilag. Har I en bar, en klub eller et sted, hvor boksen skal blive hængende, så se Selfi til erhverv.",
    },
  ];

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Leje af fotoboks",
      serviceType: "Udlejning af fotoboks til fester",
      areaServed: "DK",
      provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
      offers: (Object.keys(PERIODS) as Period[]).map((k) => ({ "@type": "Offer", name: PERIODS[k].name, price: P[k], priceCurrency: "DKK" })),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  const steps = [
    { art: <DrawBook />, title: "Vælg datoer og betal", text: "Se de ledige dage i kalenderen, vælg om printeren skal med, og betal online. Så er datoen jeres." },
    { art: <DrawParcel />, title: "Boksen kommer med posten", text: "Den ligger i jeres nærmeste pakkeshop senest dagen før festen, sat op til jer og testet." },
    { art: <DrawSetup />, title: "Stil den op på fem minutter", text: "Sæt boksen på gulvstativet og i stikkontakten. Guiden ligger i kassen." },
    { art: <DrawParty />, title: "Gæsterne tager billederne", text: "Et tryk og en nedtælling. Billedet kommer på telefonen med det samme og samles på jeres eventside." },
    { art: <DrawReturn />, title: "Send den retur", text: "Pak den i kassen dagen efter, sæt returlabelen på, og aflever den i en pakkeshop. Returen er betalt." },
  ];

  const included: { icon: Parameters<typeof Icon>[0]["name"]; title: string }[] = [
    { icon: "infinity", title: "Ubegrænsede billeder" },
    { icon: "qr", title: "Billedet på telefonen med det samme" },
    { icon: "gallery", title: "Jeres egen eventside" },
    { icon: "frame", title: "Jeres navne og datoen på billedet" },
    { icon: "light", title: "Studielys, også i en mørk sal" },
    { icon: "plug", title: "Gulvstativ og kabel" },
    { icon: "truck", title: "Fragt begge veje" },
    { icon: "shield", title: "Forsikring, uden depositum" },
  ];

  return (
    <RentalProvider initial={{ settings: s, today: todayDK() }}>
      <JsonLd data={jsonLd} />
      <Nav
        mega={false}
        links={[
          { label: "Sådan foregår det", href: "#saadan" },
          { label: "Priser", href: "#priser" },
          { label: "Funktioner", href: "#funktioner" },
          { label: "Spørgsmål", href: "#faq" },
          { label: "Erhverv", href: "/erhverv" },
        ]}
        cta={{ label: "Se ledige datoer", href: "#book" }}
      />
      <main className="lej">
        <Hero
          label="Fotoboks til leje · Sendes i hele Danmark"
          title="Lej en fotoboks, der får alle med på billedet."
          lede={`Til bryllup, konfirmation, fødselsdag og firmafest. Ubegrænsede billeder, jeres navne på hvert billede, fragt begge veje og forsikring. Fra ${kr(from)} for en hel dag, og ikke en krone mere.`}
          points={
            <>
              <ul className="lej-points">
                <li>
                  <Icon name="tag" />
                  Alt er med i prisen. Intet depositum.
                </li>
                <li>
                  <Icon name="clock" />
                  Klar på fem minutter. Den skal kun i en stikkontakt.
                </li>
                <li>
                  <Icon name="undo" />
                  Hele lejen tilbage, hvis boksen ikke kommer frem eller ikke virker.
                </li>
              </ul>
              {camp && (
                <a className="lej-camp" href="#priser">
                  <Icon name="tag" />
                  <span>
                    <b>Lanceringstilbud:</b> {camp.percent} % rabat på alle fester {campaignWhen(camp)}
                  </span>
                </a>
              )}
            </>
          }
          primary={{ label: "Se ledige datoer", href: "#book" }}
          secondary={{ label: "Se priser", href: "#priser" }}
          price={
            <>
              <b>Fra {kr(from)}</b> · alt er med i prisen
              {camp && <span className="lej-price-camp">{` · ${camp.percent} % rabat ${campaignWhen(camp)}`}</span>}
            </>
          }
          visual={<BoxStand />}
        />

        <PhotoStrip
          prints={[
            ["boks-bryllup", "Sofie & Mads · 14.6.2026"],
            ["boks-fodselsdag", "Karsten 60 · 9.5.2026"],
            ["boks-julefrokost", "Julefrokost · 12.12.2025"],
            ["boks-studenter", "Studenterfest · 26.6.2026"],
          ]}
        />

        <Compare s={s} />

        <section id="saadan" className="section" aria-labelledby="saadan-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Sådan foregår det</span>
              <h2 id="saadan-title" className="h-l">Fra booking til fest uden besvær.</h2>
              <p className="lede">I står for festen. Vi sender en boks, der er sat op til jer, og henter den igen med posten.</p>
            </div>
            <ol className="lej-journey">
              {steps.map((st, i) => (
                <li key={st.title}>
                  <div className="lej-journey-art">{st.art}</div>
                  <span className="lej-journey-n">0{i + 1}</span>
                  <b>{st.title}</b>
                  <span className="muted">{st.text}</span>
                </li>
              ))}
            </ol>
            <figure className="lej-wide">
              <Image src="/photos/fest-opsaetning-3.jpg" alt="En kvinde sætter Selfi Boks på gulvstativet i en stue, med kassen åben på gulvet" width={1200} height={896} sizes="(max-width: 900px) 90vw, 1160px" />
              <figcaption className="muted">Ud af kassen, på stativet og i stikkontakten. Fem minutter, så står den.</figcaption>
            </figure>
          </div>
        </section>

        <Personal />

        <Moments
          label="Hvorfor en fotoboks"
          title="Det bedste billede fra festen er det, hvor alle er med."
          lede="Mobilerne tager hundrede billeder i løbet af aftenen. Selfi Boks tager dem, gæsterne faktisk gemmer: alle samlet foran kameraet, i godt lys og på telefonen med det samme."
          items={[
            {
              kind: "photo",
              src: "/photos/fest-samler-3.jpg",
              alt: "Brudeparret og to gæster griner foran Selfi Boks i en gammel sal",
              title: "Den samler gæsterne",
              text: "Lyset kan ses fra den anden ende af salen. Folk stiller sig i kø, griner af hinanden og ender på billede med en, de ikke kendte før festen.",
            },
            {
              kind: "photo",
              src: "/photos/fest-fodselsdag-3.jpg",
              alt: "En fødselar på 60 med datter og børnebørn foran Selfi Boks i et forsamlingshus",
              title: "Alle generationer er med",
              text: "Et tryk på skærmen og en nedtælling fra 3. Det kan alle finde ud af, fra børnebørnene til fødselaren.",
            },
            {
              kind: "phone",
              src: "/photos/boks-bryllup.jpg",
              caption: "Sofie & Mads · 14.6.2026",
              user: "sofie.l",
              post: "Sikke en dag",
              title: "Alle billeder samlet ét sted",
              text: "Gæsterne får billedet via QR-kode, og alle festens fotos samles på jeres eventside. Dagen efter har I dem alle.",
            },
          ]}
        />

        <section id="boksen" className="section lej-band" aria-labelledby="boksen-title">
          <div className="wrap lej-box">
            <Box3D />
            <div className="sec-head lej-box-copy">
              <span className="label">Boksen</span>
              <h2 id="boksen-title" className="h-l">Lille boks, stort lys.</h2>
              <p className="lede">Selfi Boks er lidt større end et A4-ark og står på sit eget gulvstativ. Drej den og se den fra alle sider.</p>
              <ul className="lej-specs">
                <li>
                  <Icon name="light" />
                  <span><b>Studielys hele vejen rundt</b>Alle ansigter står skarpt, også i en mørk festsal.</span>
                </li>
                <li>
                  <Icon name="frame" />
                  <span><b>Stor touchskærm</b>Et tryk og en nedtælling fra 3. Det kan alle finde ud af.</span>
                </li>
                <li>
                  <Icon name="qr" />
                  <span><b>Billedet på telefonen</b>En QR-kode efter hvert billede, uden app og uden login.</span>
                </li>
                <li>
                  <Icon name="plug" />
                  <span><b>Klar på fem minutter</b>Sæt den på stativet og i stikkontakten.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <Functions />

        <section id="billeder" className="section" aria-labelledby="billeder-title">
          <div className="wrap lej-printer">
            <div className="sec-head lej-printer-copy">
              <span className="label">Tilvalg · printer</span>
              <h2 id="billeder-title" className="h-l">Billedet med hjem på papir.</h2>
              <p className="lede">
                Billederne kommer altid på telefonen og jeres eventside. Tager I printeren med, får gæsterne dem også printet på få sekunder, og I vælger,
                hvordan printet skal se ud.
              </p>
              <ul className="lej-prints">
                <li>
                  <span className="lej-prints-art" aria-hidden="true">
                    <DrawStrip />
                  </span>
                  <span>
                    <b>Fotostrimmel</b>
                    <span className="muted">Tre billeder under hinanden, som i en klassisk fotoautomat. Til fjollede serier.</span>
                  </span>
                </li>
                <li>
                  <span className="lej-prints-art" aria-hidden="true">
                    <DrawPolaroid />
                  </span>
                  <span>
                    <b>Polaroid</b>
                    <span className="muted">Ét billede med hvid kant og plads til en hilsen. Til gæstebogen eller køleskabet.</span>
                  </span>
                </li>
              </ul>
              <div className="lej-printer-price">
                <div>
                  <b>{kr(s.prices.printer)} med {s.printsIncluded} print</b>
                  <span className="muted">Printeren står ved siden af boksen og kommer i sin egen kasse sammen med den. Papir til {s.printsIncluded} print er med.</span>
                </div>
                <a className="btn btn-secondary" href="#book">
                  Se om printeren er ledig
                </a>
              </div>
            </div>
            <PrinterViewer />
          </div>
        </section>

        <section id="priser" className="section lej-band" aria-labelledby="priser-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Priser</span>
              <h2 id="priser-title" className="h-l">Faste perioder. Alt er med.</h2>
              <p className="lede">
                Alle priser er inkl. moms, og der kommer ikke noget oveni. Intet depositum og ingen gebyrer.
                {camp ? ` Holder I fest ${campaignWhen(camp)}, får I ${camp.percent} % ${camp.name.toLowerCase()} på hele bestillingen, også printeren. Rabatten trækkes fra i kalenderen, når I vælger datoer.` : ""}
              </p>
            </div>
            <div className="lej-prices">
              {([
                ["day", "Hent dagen før, aflever dagen efter"],
                ["weekend", `${kr(Math.round(P.weekend / 3))} pr. dag`],
                ["twoDays", `${kr(Math.round(P.twoDays / 2))} pr. dag`],
                ["week", `${kr(Math.round(P.week / 7))} pr. dag`],
              ] as [Period, string][]).map(([k, note]) => (
                <div className={`lej-price${k === "weekend" ? " lej-price--best" : ""}`} key={k}>
                  {camp && <span className="tag lej-price-tag">{camp.percent} % rabat {campaignWhen(camp)}</span>}
                  <b>{PERIODS[k].name}</b>
                  <span className="muted">{PERIODS[k].text}</span>
                  <strong>{kr(P[k])}</strong>
                  <span className="muted">{note}</span>
                  {camp && <span className="lej-price-camp">{kr(discounted(P[k], camp))} {campaignWhen(camp)}</span>}
                  <a className="btn btn-secondary" href="#book">Se ledige datoer</a>
                </div>
              ))}
            </div>
            <p className="lej-extra muted">Skal I bruge boksen en dag mere end perioden, koster hver ekstra dag {kr(s.prices.perExtraDay)} Kalenderen regner altid den billigste pris ud, og fem til syv dage koster aldrig mere end en uge.</p>
            <ul className="lej-incl">
              {included.map((x) => (
                <li key={x.title}>
                  <Icon name={x.icon} />
                  <b>{x.title}</b>
                </li>
              ))}
            </ul>
            <ul className="lej-addons">
              <li>
                <b>Printer · {kr(s.prices.printer)}</b>
                <span>{s.printsIncluded} print som fotostrimmel eller polaroid, så gæsterne har billedet med hjem.</span>
              </li>
              <li>
                <b>Flere end {R.maxDays} dage</b>
                <span>Skal boksen stå i længere tid, fx til en sommerfest over flere uger, så skriv til os, og vi finder en pris.</span>
              </li>
            </ul>
          </div>
        </section>

        <Trust s={s} />

        <Occasions from={from} />

        <section className="section lej-band" aria-labelledby="book-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Book</span>
              <h2 id="book-title" className="h-l">Book jeres fotoboks.</h2>
              <p className="lede">Fire korte trin, og I betaler først til sidst. Datoerne holdes til jer, mens I betaler.</p>
            </div>
            <div id="book">
              <Booking />
            </div>
          </div>
        </section>

        <Faq title="Det spørger andre om." items={faq} />
        <Contact topic="privat" kind="privat" />

        <section className="section" aria-labelledby="erhverv-title">
          <div className="wrap">
            <a className="lej-b2b" href="/erhverv">
              <span>
                <span className="label">Til steder og virksomheder</span>
                <b id="erhverv-title">Har I en bar, en klub eller en festival?</b>
                <span className="muted">Vi laver bokse i jeres eget design, der bliver hængende og laver content hver aften.</span>
              </span>
              <span className="btn btn-secondary">Se Selfi til erhverv →</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta from={kr(from)} />
    </RentalProvider>
  );
}
