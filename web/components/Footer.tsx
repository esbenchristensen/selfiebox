import { Logo } from "./Logo";
import { ThemeSwitch } from "./ThemeSwitch";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Logo size={22} />
        <nav className="footer-links" aria-label="Sider">
          <a href="/">Fotobokse i jeres eget design</a>
          <a href="/funktioner">Funktioner</a>
          <a href="/#kontakt">Book en snak</a>
        </nav>
        <ThemeSwitch />
        <span>Selfi · selfi.dk</span>
      </div>
    </footer>
  );
}
