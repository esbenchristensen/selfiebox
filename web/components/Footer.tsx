import { Logo } from "./Logo";
import { ThemeSwitch } from "./ThemeSwitch";
import { company, companyAddress } from "@/lib/company";
import { contact } from "@/lib/erhverv/placeholder";

// The company line must carry name, address, CVR and e-mail (e-handelsloven § 7). The real fields live in
// lib/company.ts; while they are empty, the footer shows only the name, the e-mail and the web address.
export function Footer() {
  const real = [company.legalName || company.name, companyAddress, company.cvr && `CVR ${company.cvr}`, company.email, company.web].filter(Boolean).join(" · ");
  const complete = !!(company.legalName && company.cvr && companyAddress && company.email);
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Logo size={22} />
        <nav className="footer-links" aria-label="Sider">
          <a href="/erhverv">Fotobokse til barer, klubber og hoteller</a>
          <a href="/funktioner">Funktioner</a>
          <a href="/erhverv#kontakt">Book en snak</a>
          <a href="/dokumentation">Dokumentation</a>
          <a href="/vilkaar">Handelsbetingelser for erhverv</a>
          <a href="/databehandleraftale">Databehandleraftale</a>
          <a href="/privatliv">Privatliv</a>
          <a href="/cookies">Cookies</a>
          <a href="/">Lej en fotoboks til en privat fest</a>
          <a href="/lejebetingelser">Lejebetingelser</a>
        </nav>
        <ThemeSwitch />
        <span className="footer-company">
          {complete ? (
            real
          ) : (
            // Navn, adresse og CVR kommer på, når de findes (lib/company.ts). Indtil da kun det, der er rigtigt.
            [company.name, company.email || contact.email, company.web].join(" · ")
          )}
        </span>
      </div>
    </footer>
  );
}
