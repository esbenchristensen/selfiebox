import { Logo } from "./Logo";
import { ThemeSwitch } from "./ThemeSwitch";
import { company, companyAddress } from "@/lib/company";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Logo size={22} />
        <nav className="footer-links" aria-label="Sider">
          <a href="/">Lej en fotoboks til festen</a>
          <a href="/erhverv">Fotobokse til steder og virksomheder</a>
          <a href="/funktioner">Funktioner</a>
          <a href="/erhverv#kontakt">Book en snak</a>
          <a href="/dokumentation">Dokumentation</a>
          <a href="/lejebetingelser">Lejebetingelser</a>
          <a href="/vilkaar">Handelsbetingelser for erhverv</a>
          <a href="/privatliv">Privatliv</a>
          <a href="/cookies">Cookies</a>
        </nav>
        <ThemeSwitch />
        <span className="footer-company">
          {[company.legalName || company.name, companyAddress, company.cvr && `CVR ${company.cvr}`, company.email, company.web]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
    </footer>
  );
}
