import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { MinFestForm } from "./form";
import "../lej/lej.css";
import "./min-fest.css";

export const metadata: Metadata = {
  title: "Min fest | Selfi",
  description: "Find jeres booking: status, sporing, opsætning af boksen, fotoportal og returdato samlet ét sted.",
  alternates: { canonical: "/min-fest" },
};

export default function MinFest() {
  return (
    <>
      <Nav links={[]} cta={{ label: "Lej en fotoboks", href: "/" }} mega={false} />
      <main>
        <section className="section">
          <div className="wrap mf">
            <span className="label">Min fest</span>
            <h1 className="h-l">Find jeres booking.</h1>
            <p className="lede">
              Skriv bookingnummeret og den e-mail, I bookede med, så sender vi et link til jeres side. Der står status og sporing, opsætningen af
              boksen, fotoportalen og hvornår boksen skal retur. Bookingnummeret står i bekræftelsen og i alle vores mails.
            </p>
            <MinFestForm />
            <div className="mf-help">
              <p>
                <b>Var du gæst til en fest?</b> Scan QR-koden på boksen, eller spørg værten om linket til festens fotoportal. Billeder fra et sted (bar,
                klub, festival) finder du på <a href="https://foto.selfi.dk">foto.selfi.dk</a>.
              </p>
              <p>
                Kan I ikke finde bookingnummeret? <a href="#chat">Skriv til os i chatten</a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
