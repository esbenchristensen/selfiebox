import { Icon } from "./Drawings";

// After paying, the host answers four short questions and the box is set up for the party: headline,
// names and date in the frame, a look, and texts that change through the evening. The portal lives on the
// platform (foto.selfi.dk/opsaet) and shows a live preview, so this section only shows what comes out of it.
export function Personal() {
  const points: { icon: Parameters<typeof Icon>[0]["name"]; title: string; text: string }[] = [
    { icon: "frame", title: "Jeres overskrift på skærmen", text: "»Tillykke med brylluppet, Sofie og Mads« eller »Tillykke med de 50, Karsten«. I skriver den selv." },
    { icon: "gallery", title: "Navne og dato på hvert billede", text: "Rammen på billedet bærer jeres navne og festens dato, så alle kan se, hvor det er fra." },
    { icon: "light", title: "En stemning, der passer", text: "Hyggelig, elegant, vild fest, sjov og farverig eller jul. Farver, skrifter og effekter følger med." },
    { icon: "clock", title: "Teksterne skifter med aftenen", text: "Velkomst, middag og fest har hver deres tekster på boksen, så den passer til det, der sker." },
    { icon: "infinity", title: "Digitale rekvisitter", text: "Hatte, briller og kroner, der sætter sig på ansigtet i billedet. Ingen kasse at pakke." },
    { icon: "qr", title: "Prøv det, før boksen kommer", text: "I ser boksen live og tager et testbillede med jeres eget kamera. Alt kan rettes helt frem til festen." },
  ];
  return (
    <section id="jeres" className="section" aria-labelledby="jeres-title">
      <div className="wrap pers">
        <div className="pers-visual" aria-hidden="true">
          <div className="pers-box">
            <div className="pers-screen">
              <span className="pers-date">Lørdag 14. juni 2027</span>
              <b>Tillykke med brylluppet</b>
              <span className="pers-names">Sofie &amp; Mads</span>
              <span className="pers-btn">Tag et billede</span>
            </div>
          </div>
          <div className="pers-print">
            <span className="pers-print-photo" />
            <span className="pers-print-cap">Sofie &amp; Mads · 14. juni 2027</span>
          </div>
        </div>
        <div className="sec-head pers-copy">
          <span className="label">Jeres fest</span>
          <h2 id="jeres-title" className="h-l">Boksen siger tillykke, før gæsterne gør.</h2>
          <p className="lede">
            Når I har booket, svarer I på fire korte spørgsmål, og så er boksen sat op til jer. I ser det hele live, før den bliver sendt.
          </p>
          <ul className="pers-list">
            {points.map((p) => (
              <li key={p.title}>
                <Icon name={p.icon} />
                <span>
                  <b>{p.title}</b>
                  {p.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
