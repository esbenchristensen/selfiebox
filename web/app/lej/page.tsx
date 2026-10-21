import type { Metadata } from "next";
import { connection } from "next/server";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Moments } from "@/components/Moments";
import { Nav } from "@/components/Nav";
import { Faq } from "@/components/Sections";
import { Booking } from "@/components/lej/Booking";
import { DEFAULT_SETTINGS, kr, priceForDays, type RentalSettings } from "@/lib/udlejning/core";
import { db, getSettings } from "@/lib/udlejning/db";
import "./lej.css";

// selfi.dk/lej: renting a box for one party, booked and paid here. The front page and /erhverv stay for
// places; this page is its own landing page for private hosts. Prices come from admin.selfi.dk → Udlejning.

export const metadata: Metadata = {
  title: "Lej en fotoboks til bryllup og fest | Selfi",
  description:
    "Lej Selfi Boks til bryllup, fødselsdag eller firmafest. Vælg datoer, tema og printer, betal online og få boksen med posten. Ubegrænsede billeder og jeres egen eventside.",
  alternates: { canonical: "/lej" },
  openGraph: {
    title: "Lej en fotoboks til festen | Selfi",
    description: "Fotoboksen, der får alle med på billedet. Book og betal online, og få den med posten.",
    url: "/lej",
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

export default async function Lej() {
  const s = await settings();
  const from = priceForDays(s, 1);
  const faq = [
    {
      q: "Hvad koster det at leje en fotoboks?",
      a: `I vælger selv datoerne. En dag koster ${kr(priceForDays(s, 1))}, en weekend ${kr(priceForDays(s, 3))} og en uge ${kr(priceForDays(s, 7))}, inkl. moms. Tema koster ${kr(s.prices.theme)}, printer med ${s.printsIncluded} print ${kr(s.prices.printer)}, og fragt med dao ${kr(s.prices.shippingPerParcel)} pr. kasse tur-retur. I ser den samlede pris, før I betaler.`,
    },
    {
      q: "Hvordan får vi boksen?",
      a: "Vi sender den med dao til jeres nærmeste pakkeshop, så den er der senest dagen før festen. Dagen efter lægger I den i kassen igen, sætter returlabelen på og afleverer den i en pakkeshop. I kan også hente den selv efter aftale.",
    },
    {
      q: "Skal vi selv stille den op?",
      a: "Ja, og det tager et par minutter. Boksen står på et stativ og skal kun bruge en almindelig stikkontakt. Der ligger en kort guide i kassen.",
    },
    {
      q: "Hvad er forskellen på fotostrimmel og polaroid?",
      a: "En fotostrimmel har flere billeder under hinanden, som i en klassisk fotoautomat. Polaroid er ét billede med hvid kant. I vælger, når I booker, og det gælder både billederne på telefonen og printet, hvis I tager printeren med.",
    },
    {
      q: "Hvordan får gæsterne billederne?",
      a: "Efter hvert billede viser skærmen en QR-kode, så gæsten har billedet på telefonen med det samme. Alle billeder fra festen samles på jeres egen eventside. Med printeren får gæsterne også billedet printet med hjem.",
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
      provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
      offers: [1, 3, 7].map((d) => ({ "@type": "Offer", name: d === 1 ? "1 dag" : d === 3 ? "Weekend" : "1 uge", price: priceForDays(s, d), priceCurrency: "DKK" })),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav
        links={[
          { label: "Sådan foregår det", href: "#saadan" },
          { label: "Priser", href: "#priser" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
        cta={{ label: "Se ledige datoer", href: "#book" }}
      />
      <main>
        <Hero
          label="Fotoboks til leje"
          title="Lej en fotoboks, der får alle med på billedet."
          lede={`Til bryllup, fødselsdag og firmafest. Vælg datoer, tema og printer, betal her på siden, og få boksen med posten. En dag koster ${kr(from)}`}
          primary={{ label: "Se ledige datoer", href: "#book" }}
          secondary={{ label: "Sådan foregår det", href: "#saadan" }}
          image={{ src: "/photos/sted-bryllup.jpg", alt: "Brudepar og venner griner foran Selfi Boks til et bryllup i en lade", pos: "50% 50%" }}
        />

        <section id="saadan" className="section" aria-labelledby="saadan-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Sådan foregår det</span>
              <h2 id="saadan-title" className="h-l">Book i dag, og stil den op på festdagen.</h2>
            </div>
            <ol className="lej-steps">
              <li><b>Book og betal</b><span>Vælg tema, printer og billedtype, find en ledig dato og betal online.</span></li>
              <li><b>Den kommer med posten</b><span>Boksen ligger i jeres nærmeste pakkeshop senest dagen før.</span></li>
              <li><b>Stil den op</b><span>Sæt den på stativet og i stikkontakten. Guiden ligger i kassen.</span></li>
              <li><b>Send den retur</b><span>Pak den i kassen dagen efter, og aflever den med returlabelen.</span></li>
            </ol>
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
              <p className="lede">Ubegrænsede billeder, stativ og jeres egen eventside er altid med. Alle priser er inkl. moms.</p>
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
                </div>
              ))}
            </div>
            <ul className="lej-addons">
              <li><b>Tema · {kr(s.prices.theme)}</b><span>{s.themes.join(", ")}: boksen, skærmen og rammen på hvert billede i festens farver.</span></li>
              <li><b>Printer · {kr(s.prices.printer)}</b><span>{s.printsIncluded} print som fotostrimmel eller polaroid, så gæsterne har billedet med hjem.</span></li>
              <li><b>Fragt · {kr(s.prices.shippingPerParcel)} pr. kasse</b><span>Med dao til og fra jeres pakkeshop. Printeren er en kasse for sig. Afhentning er gratis.</span></li>
            </ul>
          </div>
        </section>

        <section className="section" aria-labelledby="book-title">
          <div className="wrap">
            <div className="sec-head">
              <span className="label">Book</span>
              <h2 id="book-title" className="h-l">Find en ledig dato.</h2>
            </div>
            <div id="book">
              <Booking />
            </div>
          </div>
        </section>

        <Faq title="Det spørger andre om." items={faq} />
      </main>
      <Footer />
    </>
  );
}
