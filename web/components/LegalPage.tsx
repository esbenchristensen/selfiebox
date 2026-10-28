import { Footer } from "./Footer";
import { Nav } from "./Nav";

// The shared frame for documentation, privacy and terms: a plain reading page, so the text can also be
// printed to PDF straight from the browser (the nav and footer are hidden in print).
export function LegalPage({
  label,
  title,
  lede,
  updated,
  children,
}: {
  label: string;
  title: string;
  lede?: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav
        links={[
          { label: "Forside", href: "/" },
          { label: "Dokumentation", href: "/dokumentation" },
        ]}
        cta={{ label: "Book en snak", href: "/erhverv#kontakt" }}
      />
      <main className="legal-main">
        <article className="wrap legal">
          <span className="label">{label}</span>
          <h1 className="h-l">{title}</h1>
          {lede && <p className="lede">{lede}</p>}
          <p className="legal-updated">Senest opdateret {updated}</p>
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
