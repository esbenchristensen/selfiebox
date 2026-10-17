import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Explainer } from "@/components/Explainer";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { Activities, Faq } from "@/components/Sections";
import { HeroBox, Showroom } from "@/components/ThemeStudio";
import { eventActivities, faqEvents } from "@/content";

// selfi.dk/events: festivals, theme parks, zoos and arenas. Several boxes across a site, in the venue's
// own universe, sold on reach, branding and games that move guests around. Bars have /erhverv.

export const metadata: Metadata = {
  title: "Fotoboks til festival, forlystelsespark og zoo i jeres tema | Selfi",
  description:
    "Selfi Boks i jeres eget univers. Jeres navn på hvert foto, skattejagt og rundtur mellem flere bokse, konkurrencer, plads til sponsorer og fuld service.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Fotoboks til festival, forlystelsespark og zoo | Selfi",
    description: "En fotoboks i jeres univers, der giver omtale hver dag og sender gæsterne rundt på skattejagt.",
    url: "/events",
    images: [{ url: "/photos/sted-festival.jpg", width: 1600, height: 1195, alt: "Gæster ved Selfi Boks på en festival i skoven" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Fotobokse til festivaler, forlystelsesparker og zoo",
    serviceType: "Fotobokse i eget tema med aktiviteter og fuld service",
    provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEvents.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function Events() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav
        links={[
          { label: "Se filmen", href: "#film" },
          { label: "Aktiviteter", href: "#aktiviteter" },
          { label: "Temaer", href: "#temaer" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
        other={{ label: "Til barer og klubber", short: "Barer", href: "/erhverv" }}
        cta={{ label: "Book en snak", href: "#kontakt" }}
      />
      <main>
        <Hero
          label="Til festivaler, forlystelsesparker og zoo"
          title="En fotoboks i jeres univers, der giver omtale hver dag."
          lede="Selfi Boks får jeres figurer, farver og navn på boksen, skærmen og hvert foto. Når gæsterne deler, viser de jer frem. Med flere bokse bliver området til en skattejagt, og vi monterer, passer og bytter boksene."
          primary={{ label: "Book en uforpligtende snak", href: "#kontakt" }}
          secondary={{ label: "Se filmen", href: "#film" }}
          visual={<HeroBox />}
        />
        <Explainer
          film="events"
          label="Se filmen"
          title="Omtale, aktiviteter og jeres univers på hvert foto."
          lede="Se, hvordan boksen bliver en del af stedet, sender gæsterne rundt på skattejagt og giver jer og jeres sponsorer plads på hvert billede."
          alt="Film: Selfi Boks i en forlystelsespark, på en festival og i en zoo, med tema, skattejagt, rundtur, sponsorer, sæsoner og fuld service"
        />
        <Activities
          only={eventActivities}
          title="Send gæsterne rundt på området."
          lede="Med flere bokse kan I lave skattejagt og rundture forbi de steder, I gerne vil vise frem. Konkurrencer, titler og missioner holder gang i dagen ved hver enkelt boks."
        />
        <Showroom
          title="Bygget til jeres univers."
          lede="Top, sider, kabinet, lys og skærm i jeres farver og med jeres figurer og logo. Vi printer delene selv, så formen kan være lige det, stedet er."
        />
        <Faq title="Spørgsmål fra festivaler, parker og zoo." items={faqEvents} />
        <Contact type="events" />
      </main>
      <Footer />
    </>
  );
}
