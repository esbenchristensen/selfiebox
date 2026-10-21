import { Logo } from "./Logo";
import { Ph } from "./Placeholder";
import { ThemeSwitch } from "./ThemeSwitch";
import { company, companyAddress } from "@/lib/company";
import { contact } from "@/lib/erhverv/placeholder";

// The company line must carry name, address, CVR and e-mail (e-handelsloven § 7). The real fields live in
// lib/company.ts; while they are empty, the footer shows the placeholders from lib/erhverv/placeholder.ts.
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
            <Ph note="firmanavn, adresse, CVR og e-mail mangler i lib/company.ts">
              Selfi [firmanavn] · [adresse], {contact.city} · CVR [12345678] · {contact.email} · {contact.phone} · selfi.dk
            </Ph>
          )}
        </span>
      </div>
    </footer>
  );
}
