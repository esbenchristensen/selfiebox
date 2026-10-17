import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Explainer } from "@/components/Explainer";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HeroBooking } from "@/components/booking/HeroBooking";
import { JsonLd } from "@/components/JsonLd";
import { Moments } from "@/components/Moments";
import { Nav } from "@/components/Nav";
import { Private } from "@/components/Private";
import { Activities, Faq, PhotoStrip } from "@/components/Sections";
import { Story } from "@/components/Story";
import { Themes } from "@/components/Themes";
import { Venues } from "@/components/Venues";
import { faqPrivate, presets, privateActivities } from "@/content";

// selfi.dk: renting a box for one party. Venues have their own page at /erhverv.

export const metadata: Metadata = {
  title: "Lej fotoboks fra 495 kr. til bryllup og fest | Selfi",
  description:
    "Lej en fotoboks til bryllup, fødselsdag eller firmafest fra 495 kr. inkl. moms. Ubegrænsede billeder, studielys og jeres egen eventside med alle fotos.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Lej en fotoboks fra 495 kr. | Selfi",
    description: "Fotoboksen, der får alle med på billedet. Til bryllup, fødselsdag og firmafest.",
    url: "/",
    images: [{ url: "/photos/sted-bryllup.jpg", width: 1600, height: 1195, alt: "Brudepar og venner foran Selfi Boks til et bryllup i en lade" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Leje af fotoboks",
    serviceType: "Udlejning af fotoboks til fester",
    provider: { "@type": "Organization", name: "Selfi", url: "https://selfi.dk" },
    offers: presets.map((p) => ({ "@type": "Offer", name: `${p.name}: ${p.period}`, price: p.price, priceCurrency: "DKK" })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPrivate.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <Nav
        links={[
          { label: "Sådan virker den", href: "#saadan" },
          { label: "Priser", href: "#privat" },
          { label: "Temaer", href: "#temaer" },
          { label: "Spørgsmål", href: "#faq" },
        ]}
        other={{ label: "Til barer og hoteller", short: "Erhverv", href: "/erhverv" }}
        cta={{ label: "Se ledige datoer", href: "#datoer" }}
      />
      <main>
        <Hero
          label="Fotoboks til leje"
          title="Lej en fotoboks, der får alle med på billedet."
          lede="Til bryllup, fødselsdag og firmafest fra 495 kr. Gæsterne tager så mange billeder, de vil, i ægte studielys, og alle fotos samles på jeres egen eventside bagefter."
          secondary={{ label: "Sådan virker den", href: "#saadan" }}
          aside={<HeroBooking />}
        />
        <Explainer
          label="Se filmen"
          title="Alle med på billedet."
          lede="Nedtællingen, billedet på telefonen, eventsiden dagen efter og hvad en hel weekend koster."
          alt="Film: Selfi Boks til festen, fra nedtællingen til billedet på telefonen, og prisen for en weekend"
        />
        <Moments
          label="Hvorfor en fotoboks"
          title="Det bedste billede fra festen er det, hvor alle er med."
          lede="Mobilerne tager hundrede billeder i løbet af aftenen. Selfi Boks tager dem, gæsterne faktisk gemmer: alle samlet foran kameraet, i godt lys og på telefonen med det samme."
          items={[
            {
              kind: "photo",
              src: "/photos/sted-gymnasie.jpg",
              alt: "Unge til en fest griner foran Selfi Boks på en søjle",
              pos: "40% 50%",
              title: "Den samler gæsterne",
              text: "Lysringen kan ses fra den anden ende af salen. Folk stiller sig i kø, griner af hinanden og ender på billede med en, de ikke kendte før festen.",
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
              text: "Gæsterne får billedet via QR-kode eller SMS, og alle festens fotos samles på jeres eventside. Dagen efter har I dem alle.",
            },
          ]}
        />
        <Venues
          label="Til hvilke fester"
          title="Til bryllup, fødselsdag og firmafest."
          lede="Boksen står på en stander og skal kun bruge en stikkontakt. Den er lidt større end et A4-ark, så den passer ind i en lade, en stue og en kantine."
          items={[
            { src: "sted-bryllup", name: "Brylluppet", text: "Gæsterne på billede med brudeparret, også dem, fotografen ikke nåede.", alt: "Selfi Boks fotoboks på stander til et bryllup i en lade", pos: "50% 50%" },
            { src: "print-birthday", name: "Den runde fødselsdag", text: "Hele familien på ét billede, før nogen går hjem.", alt: "Gæster til en 60-års fødselsdag på et foto fra fotoboksen", pos: "50% 40%" },
            { src: "sted-gymnasie", name: "Gymnasiefesten", text: "Hele klassen på ét billede, før natten er slut.", alt: "Selfi Boks fotoboks til en gymnasiefest", pos: "35% 50%" },
            { src: "sted-julefrokost", name: "Julefrokosten", text: "Kollegerne viser en side, man ikke ser til morgenmødet.", alt: "Kolleger til julefrokost foran Selfi Boks fotoboks", pos: "55% 40%" },
            { src: "reception", name: "Receptionen", text: "Et billede med jubilaren til alle, der kom forbi.", alt: "Kolleger til en reception bruger Selfi Boks fotoboks", pos: "75% 50%" },
          ]}
        />
        <Story
          steps={[
            { n: "01", title: "Lysringen viser vej", text: "Når ingen bruger boksen, pulserer ringen langsomt, så gæsterne finder den hele aftenen." },
            { n: "02", title: "Tryk og stil jer op", text: "Et tryk på skærmen, og ringen tæller ned fra 3. Der er tid til at få alle med på billedet." },
            { n: "03", title: "Godt lys på alle", text: "Ringen skifter til hvidt studielys, så alle ansigter står skarpt, også når lyset er dæmpet til festen. Ingen blitz i øjnene." },
            { n: "04", title: "Billedet med hjem", text: "Billedet ligger klar på telefonen via QR-kode eller SMS og på jeres eventside. Med fotomodulet printer boksen også et Instax-foto." },
          ]}
        />
        <Private />
        <Themes
          title="En boks, der ser ud som jeres fest."
          lede="Vælg et tema til bryllup, fødselsdag eller julefrokost. Boksen får vinger og topper i festens farver, og skærmen og rammen på hvert foto følger med. Så ved alle, hvilken fest billedet er fra, også om ti år."
          layers={[
            ["Boksen", "Vinger og topper i festens farver."],
            ["Skærmen", "En velkomst i samme stil, når gæsterne kommer hen til boksen."],
            ["Fotoet", "En ramme med temaets farver og hilsen på hvert billede."],
          ]}
        />
        <Activities
          only={privateActivities}
          title="Gør festen til et spil."
          lede="Boksen kan mere end at tage billeder. Slå små konkurrencer og opgaver til, når I vil have gang i festen, og fra igen, når den kører af sig selv."
        />
        <PhotoStrip
          prints={[
            ["print-wedding", "Bryllup"],
            ["print-birthday", "Fødselsdag"],
            ["print-office", "Julefrokost"],
          ]}
        />
        <Faq title="Spørgsmål om at leje en fotoboks." items={faqPrivate} />
        <Contact type="privat" />
      </main>
      <Footer />
    </>
  );
}
