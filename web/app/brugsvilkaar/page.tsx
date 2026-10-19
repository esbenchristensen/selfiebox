import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Vilkår for brug af Selfi Boks | Selfi",
  description: "Vilkårene, gæster accepterer, når de tager et billede eller en video i en Selfi Boks: brugsret, storskærm, sociale medier og ansvar.",
  alternates: { canonical: "/brugsvilkaar" },
};

// The guest terms the box links to under the start button ("Ved at tage et billede accepterer du vilkårene").
// They cover the service and the copyright licence. Use of a guest's picture in marketing still rests on the
// separate yes the guest gives in the box (GDPR art. 7), which these terms describe but do not replace.
// A venue can replace the default texts in the control panel; the venue is then responsible for them.
export default function Brugsvilkaar() {
  return (
    <LegalPage
      label="Til gæster"
      title="Vilkår for brug af Selfi Boks."
      lede="Når du tager et billede eller en video i boksen, accepterer du disse vilkår. Stedet, hvor boksen står, kan have sine egne vilkår, som så står på skærmen."
      updated="19. oktober 2026"
    >
      <h2>1. Hvem du har med at gøre</h2>
      <p>
        Boksen drives af det sted, hvor den står (fx klubben, baren eller festivalen). Stedets navn står på skærmen. Stedet bestemmer, hvad dine
        billeder og videoer bruges til, og har ansvaret for det. Selfi leverer kun boksen og teknikken og opbevarer data for stedet.
      </p>

      <h2>2. Brugen er gratis og frivillig</h2>
      <p>Du betaler ikke for at bruge boksen, og du bestemmer selv, om du vil tage et billede eller optage en video.</p>

      <h2>3. Hvad stedet må bruge dit billede og din video til</h2>
      <p>Når du har sagt ja i boksen, må stedet bruge billedet eller videoen, gratis og uden at nævne dit navn, til:</p>
      <ul>
        <li>storskærme og skærme på stedet, fx hilsner til spillere, kunstnere eller fødselarer,</li>
        <li>sociale medier, hjemmeside, app og nyhedsbreve,</li>
        <li>annoncer og markedsføring, både digitalt og på tryk,</li>
        <li>og i den forbindelse redigere, beskære, tilføje tekst, grafik og musik og klippe det sammen med andre billeder og videoer.</li>
      </ul>
      <p>
        Hvis stedet samarbejder med sponsorer, kan deres logo være med i rammen. Stedet må ikke sælge dit billede til andre, og det må ikke bruges
        på en måde, der stiller dig i et dårligt lys.
      </p>

      <h2>4. Hilsner til storskærmen</h2>
      <p>
        Optager du en hilsen og trykker <em>Send hilsen</em>, giver du stedet lov til at vise den på storskærm og bruge den som beskrevet i punkt 3.
        Det er hele formålet med en hilsen, så du skal ikke svare på noget ekstra.
      </p>

      <h2>5. Rettighederne til billedet</h2>
      <p>
        Du har taget billedet eller videoen selv. Når du har sagt ja til, at stedet må bruge det, giver du stedet en gratis, ikke-eksklusiv brugsret
        til det efter punkt 3, uden tidsbegrænsning, også efter du har forladt stedet. Du kan stadig selv dele dit billede, som du vil.
      </p>

      <h2>6. Hvis du fortryder</h2>
      <p>
        Du kan altid trække dit ja tilbage på <a href="/gaester">selfi.dk/gaester</a> eller ved at skrive til stedet. Så bruger stedet ikke billedet i nyt
        materiale og fjerner det fra sine egne kanaler, hvor det kan lade sig gøre. Trykt materiale og opslag, som andre allerede har delt, kan ikke kaldes tilbage.
      </p>

      <h2>7. Opførsel</h2>
      <p>
        Brug boksen ordentligt. Billeder og videoer med nøgenhed, vold, hadefulde budskaber eller andres personlige oplysninger må stedet slette
        uden varsel. Boksen må ikke bruges til at filme andre, der ikke er med på det.
      </p>

      <h2>8. Børn</h2>
      <p>Er du under 15 år, skal en forælder sige ja for dig, før stedet må bruge billedet efter punkt 3.</p>

      <h2>9. Data</h2>
      <p>
        Hvordan dine billeder, videoer og dit telefonnummer behandles, og hvor længe de gemmes, står på <a href="/gaester">selfi.dk/gaester</a>.
      </p>
    </LegalPage>
  );
}
