import type { Metadata } from "next";
import { Care } from "@/components/Care";
import { Contact } from "@/components/Contact";
import { ContentMachine } from "@/components/ContentMachine";
import { Explainer } from "@/components/Explainer";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { Moments } from "@/components/Moments";
import { Nav } from "@/components/Nav";
import { Quality } from "@/components/Quality";
import { Activities, Faq, PhotoStrip } from "@/components/Sections";
import { Story } from "@/components/Story";
import { HeroBox, Showroom } from "@/components/ThemeStudio";
import { Venues } from "@/components/Venues";
import { faq } from "@/content";

// selfi.dk: fotobokse designed for each place. Venues, clubs, bars, hotels, festivals, parks and
// anywhere else guests gather. Sold through a conversation, so the one action is "Book en snak".

export const metadata: Metadata = {
  title: "Fotobokse i jeres eget design til venues, klubber og festivaler | Selfi",
  description:
    "Selfi Boks designet til jeres sted og en contentmaskine, der laver autentiske billeder og videoer af jeres gæster hver aften. Aktiviteter, gæsteliste og fuld service.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fotobokse i jeres eget design | Selfi",
    description: "En fotoboks bygget til jeres sted, der giver omtale hver dag og får gæsterne til at komme igen.",
    url: "/",
    images: [{ url: "/photos/sted-festival.jpg", width: 1600, height: 1195, alt: "Gæster ved Selfi Boks på en festival i skoven" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Fotobokse i eget design til venues, klubber og festivaler",
    serviceType: "Fotobokse i stedets eget design med aktiviteter og fuld service",
    provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav
        links={[
          { label: "Design", href: "#temaer" },
          { label: "Content", href: "#content" },
          { label: "Se filmen", href: "#film" },
          { label: "Aktiviteter", href: "#aktiviteter" },
          { label: "Service", href: "#service" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
      />
      <main>
        <Hero
          label="Til venues, klubber og festivaler"
          title="En fotoboks bygget til jeres sted."
          lede="Selfi Boks får jeres form, farver og logo og laver autentiske billeder og videoer af jeres gæster hver aften, klar til jeres egne kanaler. Til barer, natklubber, sportsklubber, hoteller, festivaler, parker og alle andre steder, hvor gæster samles. Vi monterer, passer og bytter boksene."
          primary={{ label: "Book en uforpligtende snak", href: "#kontakt" }}
          secondary={{ label: "Se designene", href: "#temaer" }}
          visual={<HeroBox />}
        />
        <Showroom
          title="Bygget til jeres univers."
          lede="Top, sider, kabinet, lys og skærm i jeres farver og med jeres figurer og logo. Vi printer delene selv, så formen kan være lige det, stedet er."
        />
        <ContentMachine />
        <Quality />
        <Explainer
          film="events"
          label="Se filmen"
          title="Omtale, aktiviteter og jeres univers på hvert foto."
          lede="Se, hvordan boksen bliver en del af stedet, sender gæsterne rundt på skattejagt og giver jer og jeres sponsorer plads på hvert billede."
          alt="Film: Selfi Boks i en forlystelsespark, på en festival og i en zoo, med tema, skattejagt, rundtur, sponsorer, sæsoner og fuld service"
        />
        <Features
          title="Alt, boksen kan for jer."
          lede="Fra designet af boksen til gæstelisten bagefter. Vælg en funktion og se, hvordan andre steder bruger den."
        />
        <Venues
          label="Hvor den passer"
          title="Fra natklubben til festivalpladsen."
          lede="Boksen er lidt større end et A4-ark. Den hænger på væggen med tyverilås eller står på en stander, så den passer ind i et værtshus fra 1950, på en søjle i en natklub og i et telt på en festival."
          items={[
            { src: "sted-festival", name: "Festivalen", text: "Flere bokse i festivalens univers sender publikum rundt på pladsen.", alt: "Gæster ved Selfi Boks på en festival i skoven", pos: "50% 50%" },
            { src: "klub", name: "Natklubben", text: "Lysringen kan ses over dansegulvet og skaber kø af sig selv.", alt: "Selfi Boks fotoboks på en betonsøjle i en natklub", pos: "50% 40%" },
            { src: "sted-vaertshus", name: "Baren", text: "Fredagens gæster på billede, med jeres navn i rammen.", alt: "Selfi Boks fotoboks på murstensvæggen i et værtshus", pos: "60% 45%" },
            { src: "sted-hotel", name: "Hotellet", text: "Et minde fra opholdet med hotellets navn i rammen.", alt: "Selfi Boks fotoboks på væggen i en hotelbar", pos: "30% 50%" },
            { src: "reception", name: "Messer og konferencer", text: "Deltagerne på billede med jeres navn og jeres sponsorer.", alt: "Gæster til en reception bruger Selfi Boks fotoboks", pos: "75% 50%" },
          ]}
        />
        <Moments
          label="Det, gæsterne får"
          title="Et billede, de tager med hjem, med jeres navn på."
          lede="Mobilerne tager hundrede billeder i løbet af en aften. Selfi Boks tager dem, folk faktisk gemmer og deler, og hvert eneste bærer jeres navn."
          items={[
            {
              kind: "photo",
              src: "/photos/sted-vaertshus.jpg",
              alt: "Venner på et værtshus griner foran Selfi Boks på murstensvæggen",
              pos: "60% 45%",
              title: "Den samler folk",
              text: "Lysringen kan ses fra den anden ende af lokalet. Folk stiller sig i kø, griner af hinanden og bliver lidt længere.",
            },
            {
              kind: "photo",
              src: "/photos/sted-festival.jpg",
              alt: "Gæster foran Selfi Boks på en festival",
              title: "Jeres univers på billedet",
              text: "Boksen, skærmen og rammen er i jeres design, så alle kan se, hvor billedet er taget.",
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
            { n: "01", title: "Lysringen trækker folk til", text: "Når ingen bruger boksen, pulserer ringen langsomt i jeres farver. Den kan ses fra den anden ende af lokalet." },
            { n: "02", title: "Tryk og stil jer op", text: "Et tryk på skærmen, og ringen tæller ned fra 3. Intet personale skal forklare noget." },
            { n: "03", title: "Godt lys på alle", text: "Ringen skifter til hvidt studielys, og 12 MP-kameraet med autofokus tager billedet, så alle ansigter står skarpt, også i en mørk bar eller et telt om aftenen." },
            { n: "04", title: "Billedet med hjem, og nummeret til jer", text: "Billedet kommer via QR-kode eller SMS med jeres ramme. Siger gæsten ja, lander nummeret på jeres gæsteliste." },
          ]}
        />
        <Activities
          title="Giv gæsterne en grund til at blive."
          lede="Konkurrencer, titler og missioner holder gang i hver boks. Med flere bokse kan I lave skattejagt og rundture forbi de steder, I gerne vil vise frem."
        />
        <Care />
        <PhotoStrip
          prints={[
            ["print-bar", "Fredag · Bodegaen"],
            ["print-club", "Lørdag · Klubben"],
            ["print-office", "Firmafesten"],
          ]}
        />
        <Faq title="Spørgsmål fra venues, klubber og festivaler." items={faq} />
        <Contact topic="forside" />
      </main>
      <Footer />
    </>
  );
}
