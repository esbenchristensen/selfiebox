import { Logo } from "./Logo";
import { ThemeSwitch } from "./ThemeSwitch";
import { company, companyAddress } from "@/lib/company";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Logo size={22} />
        <nav className="footer-links" aria-label="Sider">
          <a href="/">Fotobokse i jeres eget design</a>
          <a href="/funktioner">Funktioner</a>
          <a href="/#kontakt">Book en snak</a>
          <a href="/dokumentation">Dokumentation</a>
          <a href="/vilkaar">Handelsbetingelser</a>
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
