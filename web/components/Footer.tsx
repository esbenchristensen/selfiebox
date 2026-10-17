import { Logo } from "./Logo";
import { ThemeSwitch } from "./ThemeSwitch";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Logo size={22} />
        <nav className="footer-links" aria-label="Sider">
          <a href="/">Lej en fotoboks til festen</a>
          <a href="/erhverv">Fotoboks til bar, klub og hotel</a>
          <a href="/events">Fotoboks til festival, forlystelsespark og zoo</a>
        </nav>
        <ThemeSwitch />
        <span>Selfi · selfi.dk</span>
      </div>
    </footer>
  );
}
