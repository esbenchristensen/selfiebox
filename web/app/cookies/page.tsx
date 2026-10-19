import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { THEME_KEY } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Cookies på selfi.dk | Selfi",
  description: "selfi.dk bruger ingen cookies til statistik eller markedsføring.",
  alternates: { canonical: "/cookies" },
};

// Cookiebekendtgørelsen: nothing is stored that needs consent today. Add a consent banner before adding
// any analytics, pixels, embedded video or other third-party scripts.
export default function Cookies() {
  return (
    <LegalPage
      label="Cookies"
      title="Ingen cookies til statistik eller reklamer."
      lede="selfi.dk sætter ingen cookies, der følger dig, og bruger ingen statistik-, annonce- eller sporingsværktøjer. Derfor spørger vi ikke om samtykke."
      updated="19. oktober 2026"
    >
      <h2>Det eneste, siden gemmer</h2>
      <table>
        <thead><tr><th>Navn</th><th>Type</th><th>Formål</th><th>Varighed</th></tr></thead>
        <tbody>
          <tr>
            <td>{THEME_KEY}</td>
            <td>Lokal lagring i din browser</td>
            <td>Husker, om du har valgt lyst eller mørkt tema i bunden af siden. Gemmes kun, hvis du selv vælger, og sendes ikke til os.</td>
            <td>Til du sletter den i browseren</td>
          </tr>
        </tbody>
      </table>
      <p>Den er nødvendig for den funktion, du selv har bedt om, og kræver derfor ikke samtykke.</p>

      <h2>Skrifttyper, video og 3D</h2>
      <p>Skrifttyper, billeder, videoer og 3D-modeller hentes fra selfi.dk selv, ikke fra Google eller andre.</p>

      <h2>Serverlogs</h2>
      <p>
        Siden drives af Vercel, som laver tekniske logs med bl.a. IP-adresse for at levere siden og stoppe angreb. Læs mere i{" "}
        <a href="/privatliv">privatlivspolitikken</a>.
      </p>
    </LegalPage>
  );
}
