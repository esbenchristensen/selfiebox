import type { Metadata } from "next";
import { Business } from "@/components/Business";
import { Care } from "@/components/Care";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Moments } from "@/components/Moments";
import { Nav } from "@/components/Nav";
import { Activities, Faq, Inside, PhotoStrip } from "@/components/Sections";
import { Story } from "@/components/Story";
import { HeroBox, Showroom } from "@/components/ThemeStudio";
import { Venues } from "@/components/Venues";
import { business, faqBusiness } from "@/content";

// selfi.dk/erhverv: a box that stays on the wall of a bar, club, hotel or festival.
// Sold as a monthly subscription through a conversation, so there is no booking calendar here.

export const metadata: Metadata = {
  title: "Fotoboks til bar, natklub og hotel fra 995 kr./md. | Selfi",
  description:
    "Selfi Boks hænger på væggen og kører uden personale. Gæsterne deler billeder med jeres navn i rammen, og I får en gæsteliste, I må bruge. 995 kr./md. ekskl. moms.",
  alternates: { canonical: "/erhverv" },
  openGraph: {
    title: "Fotoboks til bar, klub og hotel | Selfi",
    description: "Fotoboksen, der får gæsterne til at komme igen. 995 kr. om måneden, ekskl. moms.",
    url: "/erhverv",
    images: [{ url: "/photos/sted-vaertshus.jpg", width: 1600, height: 1195, alt: "Venner på et værtshus foran Selfi Boks på murstensvæggen" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Fotoboks til barer, klubber og hoteller",
    serviceType: "Leje af fotoboks på abonnement",
    provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
    offers: {
      "@type": "Offer",
      priceCurrency: "DKK",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: business.monthlyPricePerBox,
        priceCurrency: "DKK",
        unitCode: "MON",
        valueAddedTaxIncluded: false,
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqBusiness.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function Erhverv() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav
        links={[
          { label: "Hvad I får", href: "#gevinst" },
          { label: "Sådan virker den", href: "#saadan" },
          { label: "Aktiviteter", href: "#aktiviteter" },
          { label: "Pris", href: "#pris" },
          { label: "Service", href: "#service" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
        other={{ label: "Privat fest", short: "Privat", href: "/" }}
        cta={{ label: "Book en snak", href: "#kontakt" }}
      />
      <main>
        <Hero
          label="Til barer, klubber og hoteller"
          title="En fotoboks til jeres bar, der får gæsterne til at komme igen."
          lede="Selfi Boks hænger på væggen og kører uden personale. Gæsterne deler billederne med jeres navn i rammen, og I får en gæsteliste, I må invitere tilbage. 995 kr. om måneden, ekskl. moms. Vi monterer den, passer den og bytter den, hvis noget går galt."
          primary={{ label: "Book en uforpligtende snak", href: "#kontakt" }}
          secondary={{ label: "Se, hvad den gør for jer", href: "#gevinst" }}
          visual={<HeroBox />}
        />
        <Business />
        <Care />
        <Venues
          label="Hvor den hænger"
          title="Fra bodegaen til hotelbaren."
          lede="Boksen er lidt større end et A4-ark og kun 6,6 cm dyb. Den hænger på væggen med tyverilås, så den passer ind i et værtshus fra 1950 og i et festivaltelt i skoven."
          items={[
            { src: "sted-bodega", name: "Bodegaen", text: "Et nyt samtaleemne mellem dartskiven og baren.", alt: "Selfi Boks fotoboks på væggen i en bodega", pos: "50% 45%" },
            { src: "sted-vaertshus", name: "Værtshuset", text: "Fredagens gæster på billede, med jeres navn i rammen.", alt: "Selfi Boks fotoboks på murstensvæggen i et værtshus", pos: "60% 45%" },
            { src: "klub", name: "Natklubben", text: "Lysringen kan ses over dansegulvet og skaber kø af sig selv.", alt: "Selfi Boks fotoboks på en betonsøjle i en natklub", pos: "50% 40%" },
            { src: "sted-festival", name: "Festivalen", text: "I festivalens farver og under tag, så regnen ikke stopper den.", alt: "Selfi Boks fotoboks på en festival i skoven", pos: "60% 50%" },
            { src: "sted-hotel", name: "Hotelbaren", text: "Et minde fra opholdet med hotellets navn i rammen.", alt: "Selfi Boks fotoboks på væggen i en hotelbar", pos: "30% 50%" },
          ]}
        />
        <Moments
          label="Det, gæsterne får"
          title="Et billede, de tager med hjem, med jeres navn på."
          lede="Mobilerne tager hundrede billeder af aftenen. Selfi Boks tager dem, folk faktisk gemmer og deler, og hvert eneste bærer jeres navn."
          items={[
            {
              kind: "photo",
              src: "/photos/klub.jpg",
              alt: "Selfi Boks på en betonsøjle i en natklub, venner på skærmen og dansegulvet bagved",
              pos: "45% 45%",
              title: "Den samler folk",
              text: "Lysringen kan ses fra den anden ende af lokalet. Folk stiller sig i kø, griner af hinanden og bliver en omgang mere.",
            },
            {
              kind: "photo",
              src: "/photos/instax-haand.jpg",
              alt: "Hænder holder et frisk Instax-foto af tre venner på en bar",
              title: "Et foto i hånden",
              text: "Fotomodulet printer et Instax-foto, der fremkalder, mens man står og venter. Det hænger på køleskabet en måned senere, med jeres navn i rammen.",
            },
            {
              kind: "phone",
              src: "/photos/print-club.jpg",
              caption: "Fredag · Kælderbaren",
              user: "maja.k",
              post: "Bedste fredag i lang tid",
              title: "Delt samme aften",
              text: "Gæsterne scanner en QR-kode eller får billedet på SMS. Når de deler, ser deres venner, hvor de var.",
            },
          ]}
        />
        <Story
          steps={[
            { n: "01", title: "Lysringen trækker folk til", text: "Når ingen bruger boksen, pulserer ringen langsomt. Den kan ses fra den anden ende af lokalet." },
            { n: "02", title: "Tryk og stil jer op", text: "Et tryk på skærmen, og ringen tæller ned fra 3. Ingen personale skal forklare noget." },
            { n: "03", title: "Godt lys på alle", text: "Ringen skifter til hvidt studielys, så alle ansigter står skarpt, også i en mørk bar. Ingen blitz i øjnene og ingen grønne skygger fra diskolyset." },
            { n: "04", title: "Billedet med hjem, og nummeret til jer", text: "Instax-fotoet glider ud. Den digitale udgave kommer via QR-kode eller SMS, og siger gæsten ja, lander nummeret på jeres gæsteliste." },
          ]}
        />
        <Activities
          title="Giv gæsterne en grund til at blive."
          lede="Slå konkurrencer og små opgaver til på de aftener, hvor I vil have liv i lokalet, og fra igen, når stedet kører af sig selv. Alt styres fra kontrolpanelet."
        />
        <Showroom
          title="Bygget til jeres sted."
          lede="Top, sider, kabinet, lys og skærm i jeres farver og med jeres logo. Vi printer delene selv, så formen kan være lige det, stedet er."
        />
        <PhotoStrip
          prints={[
            ["print-bar", "Fredag · Bodegaen"],
            ["print-club", "Lørdag · Klubben"],
            ["print-office", "Julefrokost"],
          ]}
        />
        <Inside />
        <Faq title="Spørgsmål om en fotoboks til jeres sted." items={faqBusiness} />
        <Contact type="erhverv" />
      </main>
      <Footer />
    </>
  );
}
