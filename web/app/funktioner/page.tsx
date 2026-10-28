import type { Metadata } from "next";
import { Contact } from "@/components/Contact";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Funktioner i Selfi: design, aktiviteter, gæsteliste og service | Selfi",
  description:
    "Alt, Selfi kan for jeres sted: eget design, logo og sponsorer, deling, videohilsner, fotovæg, gæsteliste, aktiviteter, kontrolpanel og fuld service.",
  alternates: { canonical: "/funktioner" },
};

export default function Funktioner() {
  return (
    <>
      <Nav
        links={[
          { label: "Forside", href: "/" },
          { label: "Funktioner", href: "#funktioner" },
        ]}
      />
      <main>
        <Hero
          label="Funktioner"
          title="Alt, boksen kan for jeres sted."
          lede="Selfi er bygget til jeres sted, giver jer omtale og content og holder gæsterne i gang. Vi tager os af resten."
          primary={{ label: "Book en uforpligtende snak", href: "#kontakt" }}
          secondary={{ label: "Se funktionerne", href: "#funktioner" }}
          image={{ src: "/photos/klub.jpg", alt: "Selfi på en betonsøjle i en natklub med venner på skærmen", pos: "50% 40%" }}
        />
        <Features title="Vælg en funktion." />
        <Contact topic="funktioner" />
      </main>
      <Footer />
    </>
  );
}
