import type { Metadata } from "next";
import { connection } from "next/server";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Moments } from "@/components/Moments";
import { Nav } from "@/components/Nav";
import { Faq } from "@/components/Sections";
import { Booking } from "@/components/lej/Booking";
import { Box3D } from "@/components/lej/Box3D";
import { DrawBook, DrawParcel, DrawParty, DrawPolaroid, DrawReturn, DrawSetup, DrawStrip, Icon } from "@/components/lej/Drawings";
import { HeroBooking } from "@/components/lej/HeroBooking";
import { RentalProvider } from "@/components/lej/RentalContext";
import { DEFAULT_SETTINGS, kr, priceForDays, type RentalSettings } from "@/lib/udlejning/core";
import { db, getSettings } from "@/lib/udlejning/db";
import "./lej/lej.css";

// selfi.dk: rent a box for one party, booked and paid here. The journey follows the questions people have, in
// order: is our day free and what does it cost (the calendar in the hero), how does it work, what does it look
// like, what do the guests get, what is included, then the booking. Places and businesses have /erhverv.
// Prices and free days come from admin.selfi.dk → Udlejning.

export const metadata: Metadata = {
  title: "Lej en fotoboks til bryllup, fødselsdag og fest | Selfi",
  description:
    "Lej Selfi Boks til bryllup, fødselsdag, konfirmation eller firmafest. Se ledige datoer, tag printer med, betal online og få boksen med posten. Fragt begge veje og forsikring er med.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Lej en fotoboks til festen | Selfi",
    description: "Fotoboksen, der får alle med på billedet. Se ledige datoer, book og betal online, og få den med posten.",
    url: "/",
    images: [{ url: "/photos/sted-bryllup.jpg", width: 1600, height: 1195, alt: "Brudepar og venner foran Selfi Boks til et bryllup i en lade" }],
  },
};

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
  const from = priceForDays(s, 1);
  const faq = [
    {
      q: "Hvad koster det at leje en fotoboks?",
      a: `I vælger selv datoerne. En dag koster ${kr(priceForDays(s, 1))}, en weekend ${kr(priceForDays(s, 3))} og en uge ${kr(priceForDays(s, 7))}, inkl. moms. Printer med ${s.printsIncluded} print koster ${kr(s.prices.printer)} Fragt begge veje og forsikring er altid med, og I ser den samlede pris, før I betaler.`,
    },
    {
      q: "Hvordan får vi boksen?",
      a: "Vi sender den med posten til jeres nærmeste pakkeshop, så den er der senest dagen før festen. Dagen efter lægger I den i kassen igen, sætter returlabelen på og afleverer den i en pakkeshop.",
    },
    {
      q: "Skal vi selv stille den op?",
      a: "Ja, og det tager fem minutter. Boksen sidder på et gulvstativ og skal kun bruge en almindelig stikkontakt. Der ligger en kort guide i kassen.",
    },
    {
      q: "Hvad er forskellen på fotostrimmel og polaroid?",
      a: "Det er to måder at printe på, så I vælger kun, hvis I tager printeren med. En fotostrimmel har tre billeder under hinanden, som i en klassisk fotoautomat. Polaroid er ét billede med hvid kant og plads til en hilsen.",
    },
    {
      q: "Hvordan får gæsterne billederne?",
      a: "Efter hvert billede viser skærmen en QR-kode, så gæsten har billedet på telefonen med det samme. Alle billeder fra festen samles på jeres egen eventside. Med printeren får gæsterne også billedet printet med hjem.",
    },
    {
      q: "Hvad hvis noget går i stykker?",
      a: "Boksen er forsikret, og forsikringen er altid med i prisen. Hvad den dækker, står i lejebetingelserne.",
    },
    {
      q: "Hvad hvis vi skal aflyse?",
      a: "Skriv til os hurtigst muligt. Hvad I får retur, står i lejebetingelserne.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Leje af fotoboks",
      serviceType: "Udlejning af fotoboks til fester",
      areaServed: "DK",
      provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
      offers: [1, 3, 7].map((d) => ({ "@type": "Offer", name: d === 1 ? "1 dag" : d === 3 ? "Weekend" : "1 uge", price: priceForDays(s, d), priceCurrency: "DKK" })),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  const steps = [
    { art: <DrawBook />, title: "Find en dato", text: "Se ledige dage i kalenderen, vælg om printeren skal med, og betal online. Så er datoen jeres." },
    { art: <DrawParcel />, title: "Den kommer med posten", text: "Boksen ligger i jeres nærmeste pakkeshop senest dagen før festen." },
    { art: <DrawSetup />, title: "Stil den op på fem minutter", text: "Sæt boksen på gulvstativet og i stikkontakten. Guiden ligger i kassen." },
    { art: <DrawParty />, title: "Gæsterne tager billederne", text: "Et tryk og en nedtælling. Billedet kommer på telefonen via QR-kode og på jeres eventside." },
    { art: <DrawReturn />, title: "Send den retur", text: "Pak den i kassen dagen efter, sæt returlabelen på, og aflever den i en pakkeshop." },
  ];

  const included: { icon: Parameters<typeof Icon>[0]["name"]; title: string; text: string }[] = [
    { icon: "infinity", title: "Ubegrænsede billeder", text: "Så mange billeder, I vil, hele lejeperioden." },
    { icon: "qr", title: "Billedet på telefonen", text: "Gæsterne scanner en QR-kode og har billedet med det samme." },
    { icon: "gallery", title: "Jeres egen eventside", text: "Alle festens billeder samlet ét sted, klar til at dele." },
    { icon: "light", title: "Studielys", text: "Hvidt lys, der gør alle pæne, også i en mørk festsal." },
    { icon: "frame", title: "Navne på billedet", text: "Jeres navne og datoen i rammen på hvert billede." },
    { icon: "plug", title: "Gulvstativ og kabel", text: "Alt, der skal til. I skal kun finde en stikkontakt." },
    { icon: "truck", title: "Fragt begge veje", text: "Til og fra jeres pakkeshop. Returlabelen ligger i kassen." },
    { icon: "shield", title: "Forsikring", text: "Boksen er forsikret, mens den er hos jer." },
  ];

  return (
    <RentalProvider>
      <JsonLd data={jsonLd} />
      <Nav
        mega={false}
        links={[
          { label: "Sådan foregår det", href: "#saadan" },
          { label: "Boksen", href: "#boksen" },
          { label: "Priser", href: "#priser" },
          { label: "Spørgsmål", href: "#faq" },
          { label: "Erhverv", href: "/erhverv" },
        ]}
        cta={{ label: "Se ledige datoer", href: "#datoer" }}
      />
      <main>
        <Hero
          label="Fotoboks til leje i hele Danmark"
          title="Lej en fotoboks, der får alle med på billedet."
          lede={`Til bryllup, fødselsdag, konfirmation og firmafest. Find en ledig dato, tag printeren med, hvis gæsterne skal have billederne på papir, og få det hele med posten. Fra ${kr(from)} for en hel dag.`}
          points={
            <ul className="lej-points">
              <li>
                <Icon name="truck" />
                Fragt begge veje og forsikring er med
              </li>
              <li>
                <Icon name="clock" />
                Klar på fem minutter, kun en stikkontakt
              </li>
              <li>
                <Icon name="infinity" />
                Ubegrænsede billeder på telefonen
              </li>
            </ul>
          }
          primary={{ label: "Se boksen i 3D", href: "#boksen" }}
          secondary={{ label: "Sådan foregår det", href: "#saadan" }}
          aside={<HeroBooking />}
        />

        <section id="saadan" className="section" aria-labelledby="saadan-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Sådan foregår det</span>
              <h2 id="saadan-title" className="h-l">Fra booking til fest uden besvær.</h2>
              <p className="lede">I står for festen. Vi sender en boks, der er klar til brug, og henter den igen med posten.</p>
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
          </div>
        </section>

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

        <section id="billeder" className="section" aria-labelledby="billeder-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Tilvalg · printer</span>
              <h2 id="billeder-title" className="h-l">Billedet med hjem på papir.</h2>
              <p className="lede">Billederne kommer altid på telefonen og jeres eventside. Tager I printeren med, får gæsterne dem også printet, og I vælger, hvordan printet skal se ud.</p>
            </div>
            <div className="lej-photos">
              <div className="lej-photo">
                <div className="lej-photo-art">
                  <DrawStrip />
                </div>
                <b>Fotostrimmel</b>
                <span className="muted">Tre billeder under hinanden, som i en klassisk fotoautomat. Perfekt til fjollede serier.</span>
              </div>
              <div className="lej-photo">
                <div className="lej-photo-art">
                  <DrawPolaroid />
                </div>
                <b>Polaroid</b>
                <span className="muted">Ét billede med hvid kant og plads til en hilsen. Til gæstebogen eller køleskabet.</span>
              </div>
              <div className="lej-photo lej-photo--print">
                <span className="label">Printer</span>
                <b>{kr(s.prices.printer)} med {s.printsIncluded} print</b>
                <span className="muted">Printeren står ved siden af boksen og printer på få sekunder. Den kommer i sin egen kasse sammen med boksen.</span>
                <a className="btn btn-secondary" href="#datoer">
                  Se om printeren er ledig
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="med" className="section" aria-labelledby="med-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Altid med i prisen</span>
              <h2 id="med-title" className="h-l">I skal bare holde fest.</h2>
            </div>
            <ul className="lej-incl">
              {included.map((x) => (
                <li key={x.title}>
                  <Icon name={x.icon} />
                  <b>{x.title}</b>
                  <span className="muted">{x.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Moments
          label="Hvorfor en fotoboks"
          title="Det bedste billede fra festen er det, hvor alle er med."
          lede="Mobilerne tager hundrede billeder i løbet af aftenen. Selfi Boks tager dem, gæsterne faktisk gemmer: alle samlet foran kameraet, i godt lys og på telefonen med det samme."
          items={[
            {
              kind: "photo",
              src: "/photos/sted-gymnasie.jpg",
              alt: "Unge til en fest griner foran Selfi Boks",
              pos: "40% 50%",
              title: "Den samler gæsterne",
              text: "Lyset kan ses fra den anden ende af salen. Folk stiller sig i kø, griner af hinanden og ender på billede med en, de ikke kendte før festen.",
            },
            {
              kind: "photo",
              src: "/photos/print-birthday.jpg",
              alt: "Tre gæster til en 60-års fødselsdag smiler på et foto fra Selfi Boks",
              title: "Alle generationer med",
              text: "Et tryk på skærmen og en nedtælling fra 3. Det kan alle finde ud af, fra børnebørnene til fødselaren.",
            },
            {
              kind: "phone",
              src: "/photos/print-wedding.jpg",
              caption: "Skål for brudeparret",
              user: "sofie.l",
              post: "Sikke en dag",
              title: "Alle billeder samlet ét sted",
              text: "Gæsterne får billedet via QR-kode, og alle festens fotos samles på jeres eventside. Dagen efter har I dem alle.",
            },
          ]}
        />

        <section id="priser" className="section" aria-labelledby="priser-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Priser</span>
              <h2 id="priser-title" className="h-l">Jo flere dage, jo billigere pr. dag.</h2>
              <p className="lede">Alle priser er inkl. moms. Ubegrænsede billeder, eventside, fragt begge veje og forsikring er altid med.</p>
            </div>
            <div className="lej-prices">
              {[
                { name: "Dag", days: 1, text: "Én dag og aften" },
                { name: "Weekend", days: 3, text: "Fredag til søndag" },
                { name: "Uge", days: 7, text: "Syv dage i træk" },
              ].map((p) => (
                <div className="lej-price" key={p.name}>
                  <b>{p.name}</b>
                  <span className="muted">{p.text}</span>
                  <strong>{kr(priceForDays(s, p.days))}</strong>
                  <span className="muted">{p.days > 1 ? `${kr(Math.round(priceForDays(s, p.days) / p.days))} pr. dag` : "Til én fest"}</span>
                </div>
              ))}
            </div>
            <ul className="lej-addons">
              <li>
                <b>Printer · {kr(s.prices.printer)}</b>
                <span>{s.printsIncluded} print som fotostrimmel eller polaroid, så gæsterne har billedet med hjem.</span>
              </li>
              <li>
                <b>Fragt og forsikring · Med i prisen</b>
                <span>Med posten til og fra jeres pakkeshop. Returfragten er betalt, og labelen ligger i kassen.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="section lej-band" aria-labelledby="book-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Book</span>
              <h2 id="book-title" className="h-l">Book jeres fotoboks.</h2>
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
    </RentalProvider>
  );
}
