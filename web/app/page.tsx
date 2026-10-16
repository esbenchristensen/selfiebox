import { Business } from "@/components/Business";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Logo } from "@/components/Logo";
import { Moments } from "@/components/Moments";
import { Venues } from "@/components/Venues";
import { Nav } from "@/components/Nav";
import { Private } from "@/components/Private";
import { Activities, Faq, Inside, PhotoStrip } from "@/components/Sections";
import { Story } from "@/components/Story";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Themes } from "@/components/Themes";
import { faq } from "@/content";

// FAQ as structured data, so search engines can show the answers in results.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Nav />
      <main>
        <Hero />
        <Moments />
        <Venues />
        <Story />
        <Private />
        <Themes />
        <Activities />
        <PhotoStrip />
        <Business />
        <Inside />
        <Faq />
        <Contact />
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <Logo size={22} />
          <ThemeSwitch />
          <span>Selfi · selfi.dk</span>
        </div>
      </footer>
    </>
  );
}
