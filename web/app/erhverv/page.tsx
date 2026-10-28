import type { Metadata } from "next";
import { Care } from "@/components/Care";
import { Contact } from "@/components/Contact";
import { Explainer } from "@/components/Explainer";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Faq } from "@/components/Sections";
import { Showroom } from "@/components/ThemeStudio";
import { Cases } from "@/components/erhverv/Cases";
import { DesignLead } from "@/components/erhverv/DesignLead";
import { GuestFlow } from "@/components/erhverv/GuestFlow";
import { HeroPlainBox } from "@/components/erhverv/HeroPlainBox";
import { GuestList } from "@/components/erhverv/GuestList";
import { Goals } from "@/components/erhverv/Goals";
import { FunctionMap } from "@/components/erhverv/FunctionMap";
import { Models } from "@/components/erhverv/Models";
import { Pricing } from "@/components/erhverv/Pricing";
import { PrinterOffer } from "@/components/erhverv/PrinterOffer";
import { Start } from "@/components/erhverv/Start";
import { StickyCta } from "@/components/erhverv/StickyCta";
import { Team } from "@/components/erhverv/Team";
import { faq } from "@/content";
import { company } from "@/lib/company";
import { contact, pricing } from "@/lib/erhverv/placeholder";

// selfi.dk/erhverv: the box for places with guests, sold through a conversation. The page gives the broad
// picture first, because places buy it for different reasons: fun for the guests, branding, content and
// feedback, a guest list, more sold on the night, something to sell to sponsors. Order: what is it (hero,
// proof), why would we want it (six goals in the buyer's words), how it works for a guest, the two ways to
// get it (standard box with their theme, or custom design) and the designs, how it looks for a place like
// ours (industries with buyer, story and setup), every function and who it serves, the free design draft,
// price, the printer that can pay for the box, service, the guest list rules, how we start, the film, what others say, who we are, questions,
// and then the one action: book a call. The goals and the function map live in lib/erhverv/value.ts.
// Facts that are not decided or not true yet come from lib/erhverv/placeholder.ts and are marked.
// The front page is the rental for private parties; the customer catalogues live under /erhverv/<sted>.

const TITLE = "Fotoboks til bar, natklub, festival og event i jeres design | Selfi";
const DESCRIPTION = `Selfi er fotoboksen på væggen, der giver gæsterne en sjov aften og jer omtale, billeder og video, en gæsteliste, mere solgt og plads at sælge til sponsorer. Standardboks i jeres farver eller eget design. Fra ${pricing.fromPerMonth} kr./md. med fuld service.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/erhverv" },
  openGraph: {
    title: "Fotoboks i jeres design til barer, klubber, festivaler og brands | Selfi",
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
    ...(company.phone ? { telephone: company.phone } : {}),
    address: { "@type": "PostalAddress", ...(company.postcode ? { addressLocality: company.postcode } : {}), addressCountry: "DK" },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Fotoboks i eget design til barer, natklubber, festivaler, parker, biografer, klubber og brands",
    serviceType: "Fotoboks på abonnement med eget tema eller design, aktiviteter, indhold, gæsteliste, sponsorplads og fuld service",
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
          { label: "Det får I", href: "#maal" },
          { label: "Boksen", href: "#modeller" },
          { label: "Brancher", href: "#cases" },
          { label: "Funktioner", href: "#funktioner" },
          { label: "Pris", href: "#pris" },
          { label: "Printer", href: "#printer" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
        extra={[{ label: "Lej til en privat fest", href: "/" }]}
        cta={{ label: "Gratis designudkast", href: "#udkast" }}
      />
      <main>
        <Hero
          label="Til barer, natklubber, festivaler, parker, biografer, klubber og brands"
          title="Gæsterne får et billede. I får det, I har brug for."
          lede="Selfi hænger på væggen i jeres farver eller i jeres helt egen form. For gæsterne er den sjov. For jer kan den give omtale, billeder og video, en gæsteliste, mere solgt på aftenen eller noget nyt at sælge til sponsorerne. I vælger, hvad den skal gøre."
          points={
            <>
              <ul className="hero-points">
                <li>Standardboksen med jeres tema og logo, eller et kabinet printet i jeres form</li>
                <li>Alle funktioner er med, og I slår dem til og fra i kontrolpanelet</li>
                <li>Vi overvåger, opdaterer og bytter boksen. I holder åbent</li>
              </ul>
              <p className="hero-contact muted">
                Skriv til <a href={`mailto:${contact.email}`}>{contact.email}</a>, eller book en snak på 20 minutter.
              </p>
            </>
          }
          primary={{ label: "Få designudkast på 24 timer", href: "#udkast" }}
          secondary={{ label: "Book en snak", href: "#kontakt" }}
          visual={<HeroPlainBox />}
        />
        <Goals />
        <GuestFlow />
        <Models />
        <Showroom
          title="Sådan kan specialdesignet se ud."
          lede="Top, sider og kabinet printes i den form, stedet kalder på: et halstørklæde, en lysmast, en figur. Skærmen og rammen på hvert foto får jeres farver og logo. Vi printer delene selv."
        />
        <Cases />
        <FunctionMap />
        <DesignLead />
        <Pricing />
        <PrinterOffer />
        <Care />
        <GuestList />
        <Start />
        <Explainer
          film="erhverv"
          label="Se filmen"
          title="Se boksen på to minutter."
          lede="Design, billeder, video, aktiviteter, gæsteliste og service, fortalt på to minutter."
          alt="Film: Selfi i jeres eget design med billeder, videoer og videohilsner, missioner, titler, konkurrence, deling, gæsteliste og fuld service"
        />
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
