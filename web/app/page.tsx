import { Business } from "@/components/Business";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Logo } from "@/components/Logo";
import { Nav } from "@/components/Nav";
import { Private } from "@/components/Private";
import { Activities, Faq, Inside, Instax, PhotoStrip } from "@/components/Sections";
import { Story } from "@/components/Story";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Themes } from "@/components/Themes";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Story />
        <Private />
        <Inside />
        <Instax />
        <Themes />
        <Activities />
        <PhotoStrip />
        <Business />
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
