import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { contactHref, contactText } from "@/lib/company";

export const metadata: Metadata = {
  title: "Dine billeder og data i Selfi Boks | Selfi",
  description: "Til gæster: hvad Selfi Boks gemmer, hvem der bruger dine billeder, videoer og dit nummer, og hvordan du får dem slettet.",
  alternates: { canonical: "/gaester" },
};

// The second layer of the privacy information for guests (GDPR art. 13). The first layer is the sign next to the
// box and the consent screens; both link here (QR code to selfi.dk/gaester).
export default function Gaester() {
  return (
    <LegalPage
      label="Til gæster"
      title="Dine billeder og data i Selfi Boks."
      lede="Her kan du læse, hvad der sker med dine billeder, videoer og dit telefonnummer, når du bruger en Selfi Boks, og hvordan du får dem slettet."
      updated="19. oktober 2026"
    >
      <h2>Hvem er ansvarlig?</h2>
      <p>
        Det sted, hvor boksen står (fx baren, klubben eller festivalen), er dataansvarlig for dine billeder og oplysninger og har ansvaret for, hvordan de bruges. Stedets navn står på
        boksens skærm og på skiltet ved boksen. Selfi leverer boksen og opbevarer data for stedet som databehandler, efter en databehandleraftale.
      </p>

      <h2>Hvad gemmer boksen?</h2>
      <ul>
        <li><strong>Intet, før du trykker start.</strong> Kameraet viser et livebillede på skærmen, men gemmer ingenting, og mikrofonen optager ikke, før du selv starter et billede eller en video.</li>
        <li><strong>Dine billeder og videoer</strong> med lyd, når du tager dem.</li>
        <li><strong>Dit telefonnummer</strong>, hvis du vælger at få billedet på SMS.</li>
        <li><strong>Dine svar</strong>: om stedet må bruge billedet eller videoen, og om du vil høre fra stedet. Vi gemmer tidspunktet og den tekst, du sagde ja til, så det kan dokumenteres.</li>
      </ul>
      <p>Boksen genkender ikke ansigter og bruger ikke dit ansigt til at finde ud af, hvem du er.</p>

      <h2>Hvad bruges det til, og med hvilken ret?</h2>
      <table>
        <thead><tr><th>Formål</th><th>Grundlag</th><th>Slettes</th></tr></thead>
        <tbody>
          <tr>
            <td>At give dig dit billede via QR-kode eller SMS</td>
            <td>Du har bedt om det (GDPR art. 6, stk. 1, litra b)</td>
            <td>Billedet slettes senest 30 dage efter, det er taget. Et nummer, der kun er brugt til at sende billedet, slettes samtidig.</td>
          </tr>
          <tr>
            <td>At stedet bruger billedet eller videoen på storskærme, sociale medier, hjemmeside, i nyhedsbreve og i annoncer, også redigeret og klippet sammen med andet (se <a href="/brugsvilkaar">vilkårene</a>)</td>
            <td>Kun hvis du har sagt ja i boksen (samtykke, art. 6, stk. 1, litra a)</td>
            <td>Når du trækker dit ja tilbage. Bruges det ikke i 5 år, slettes det</td>
          </tr>
          <tr>
            <td>At vise din hilsen på storskærmen og bruge den som ovenfor</td>
            <td>Du har selv optaget hilsenen og trykket Send hilsen (samtykke, art. 6, stk. 1, litra a)</td>
            <td>Som ovenfor</td>
          </tr>
          <tr>
            <td>At stedet sender dig tilbud og nyheder på SMS eller e-mail</td>
            <td>Kun hvis du har sagt ja (samtykke, art. 6, stk. 1, litra a, og markedsføringslovens § 10)</td>
            <td>Når du afmelder dig. Bruges nummeret ikke i 2 år, slettes det.</td>
          </tr>
          <tr>
            <td>At holde boksen kørende og sikker (fejllog, misbrug)</td>
            <td>Legitim interesse (art. 6, stk. 1, litra f)</td>
            <td>Senest efter 90 dage</td>
          </tr>
        </tbody>
      </table>
      <p>
        Når du tager et billede, accepterer du <a href="/brugsvilkaar">vilkårene for brug af boksen</a>. Siger du nej til, at stedet må bruge billedet, får du det stadig selv. Du behøver ikke sige ja til markedsføring for at være med i en konkurrence i boksen.
      </p>

      <h2>Børn</h2>
      <p>
        Er du under 15 år, skal en forælder sige ja for dig, før stedet må bruge dit billede eller sende dig tilbud. Boksen spørger om din alder,
        før du kan sige ja.
      </p>

      <h2>Hvem får dine data?</h2>
      <p>
        Det sted, hvor boksen står. Selfi opbevarer data for stedet hos underdatabehandlere i EU og USA (se{" "}
        <a href="/databehandleraftale#underdatabehandlere">listen</a>). Overførsler til USA sker efter EU-USA-dataprivatlivsrammen og
        EU-Kommissionens standardkontraktbestemmelser. Data bliver aldrig solgt.
      </p>

      <h2>Dine rettigheder</h2>
      <p>
        Du har ret til at få indsigt i, rettet og slettet dine data, til at trække et samtykke tilbage, til at gøre indsigelse og til at få dine data
        udleveret. Afmeld SMS direkte fra beskeden, eller skriv til stedet. Du kan også skrive til Selfi på{" "}
        <a href={contactHref}>{contactText}</a>, så sørger vi for, at stedet får besked, og hjælper med at slette. Skriv hvilket sted, hvilken dag og
        gerne dit nummer, så vi kan finde billedet.
      </p>
      <p>
        Du kan klage til Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, <a href="https://www.datatilsynet.dk">datatilsynet.dk</a>.
      </p>
    </LegalPage>
  );
}
