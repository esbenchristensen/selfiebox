import type { Metadata } from "next";
import { Care } from "@/components/Care";
import { Contact } from "@/components/Contact";
import { Explainer } from "@/components/Explainer";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Ph } from "@/components/Placeholder";
import { Activities, Faq } from "@/components/Sections";
import { HeroBox, Showroom } from "@/components/ThemeStudio";
import { Cases } from "@/components/erhverv/Cases";
import { GuestFlow } from "@/components/erhverv/GuestFlow";
import { GuestList } from "@/components/erhverv/GuestList";
import { Outcomes } from "@/components/erhverv/Outcomes";
import { Pricing } from "@/components/erhverv/Pricing";
import { PrinterOffer } from "@/components/erhverv/PrinterOffer";
import { Proof } from "@/components/erhverv/Proof";
import { Quotes } from "@/components/erhverv/Quotes";
import { Start } from "@/components/erhverv/Start";
import { StickyCta } from "@/components/erhverv/StickyCta";
import { Team } from "@/components/erhverv/Team";
import { faq } from "@/content";
import { company } from "@/lib/company";
import { contact, pricing } from "@/lib/erhverv/placeholder";

// selfi.dk/erhverv: the box for places with guests, sold through a conversation. The page follows the
// questions an owner asks, in the order they ask them: what is it and what do we get (hero, proof,
// outcomes), how does it work for a guest, what does it look like for us (design, cases), what does it
// cost, can a printer pay for it, what if it breaks (service), may we use the guest list, how do we start, what keeps guests busy,
// the film, what other places say, who we are, questions, and then the one action: book a call.
// Facts that are not decided or not true yet come from lib/erhverv/placeholder.ts and are marked.
// The front page is the rental for private parties; the customer catalogues live under /erhverv/<sted>.

const TITLE = "Fotoboks til bar, klub og hotel i jeres eget design | Selfi";
const DESCRIPTION = `Selfi hænger på væggen i jeres design, sender billedet på SMS med jeres navn på og samler en gæsteliste, I må bruge. Fra ${pricing.fromPerMonth} kr./md. med fuld service.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/erhverv" },
  openGraph: {
    title: "Fotoboks i jeres eget design til barer, klubber og hoteller | Selfi",
    description: DESCRIPTION,
    url: "/erhverv",
    images: [{ url: "/photos/klub.jpg", width: 1600, height: 1195, alt: "Selfi på en betonsøjle i en natklub" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName || company.name,
    url: "https://www.selfi.dk",
    email: company.email || contact.email,
    telephone: company.phone || contact.phone,
    address: { "@type": "PostalAddress", addressLocality: company.postcode || contact.city, addressCountry: "DK" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Fotoboks i eget design til barer, klubber, hoteller og festivaler",
    serviceType: "Fotoboks på abonnement med eget design, gæsteliste og fuld service",
    areaServed: "DK",
    provider: { "@type": "Organization", name: "Selfi", url: "https://www.selfi.dk" },
    offers: { "@type": "Offer", price: pricing.fromPerMonth, priceCurrency: "DKK", priceSpecification: { "@type": "UnitPriceSpecification", price: pricing.fromPerMonth, priceCurrency: "DKK", unitText: "måned pr. boks, ekskl. moms" } },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function Erhverv() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav
        links={[
          { label: "Det får I", href: "#faar" },
          { label: "Design", href: "#design" },
          { label: "Pris", href: "#pris" },
          { label: "Printer", href: "#printer" },
          { label: "Service", href: "#service" },
          { label: "Eksempler", href: "#cases" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
        extra={[{ label: "Lej til en privat fest", href: "/" }]}
      />
      <main>
        <Hero
          label="Til barer, klubber, hoteller og festivaler"
          title="En fotoboks i jeres design, der får gæsterne til at komme igen."
          lede="Selfi hænger på væggen i jeres form og farver, tager billeder og video af gæsterne og sender dem på SMS med jeres navn på. Siger gæsten ja, har I et nummer, I må sende tilbud til."
          points={
            <>
              <ul className="hero-points">
                <li>Top, sider og kabinet printet til jeres sted</li>
                <li>En gæsteliste med samtykke, I må sende til</li>
                <li>Vi overvåger, opdaterer og bytter boksen. I holder åbent</li>
              </ul>
              <p className="hero-contact muted">
                Ring på{" "}
                <Ph note="telefonnummer mangler">
                  <a href={contact.phoneHref}>{contact.phone}</a>
                </Ph>
                , eller book en snak på 20 minutter.
              </p>
            </>
          }
          primary={{ label: "Book en snak", href: "#kontakt" }}
          secondary={{ label: "Se prisen", href: "#pris" }}
          visual={<HeroBox />}
        />
        <Proof />
        <Outcomes />
        <GuestFlow />
        <Showroom
          title="Boksen i jeres form og farver."
          lede="Top, sider og kabinet printes i den form, stedet kalder på: et halstørklæde, en lysmast, en figur. Skærmen og rammen på hvert foto får jeres farver og logo. Vi printer delene selv."
        />
        <Cases />
        <Pricing />
        <PrinterOffer />
        <Care />
        <GuestList />
        <Start />
        <Activities
          title="Giv gæsterne en grund til at tage ét billede til."
          lede="Titler, missioner og guldtid holder gang i hver boks. Med flere bokse kan I lave skattejagt og rundture forbi de steder, I gerne vil vise frem. Alt styres fra kontrolpanelet."
        />
        <Explainer
          film="erhverv"
          label="Se filmen"
          title="Se boksen på to minutter."
          lede="Design, billeder, video, aktiviteter, gæsteliste og service, fortalt på to minutter."
          alt="Film: Selfi i jeres eget design med billeder, videoer og videohilsner, missioner, titler, konkurrence, deling, gæsteliste og fuld service"
        />
        <Quotes />
        <Team />
        <Faq title="Det, ejere spørger om, før de siger ja." items={faq} />
        <Contact topic="erhverv" />
        <p className="wrap fine b2c-link">
          Holder I en enkelt fest og vil leje en boks til en dag? <a href="/">Se Selfi til private fester</a>.
        </p>
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
