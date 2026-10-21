// The guest list the place may actually use: what the law requires, what the box does about it.
// Our sharpest edge against Lightbooth, so it gets its own short section instead of a line in the FAQ.

const does = [
  ["Et særskilt ja", "Gæsten siger selv ja til tilbud, efter nummeret er skrevet. Det er ikke sat på forhånd, og det er ikke et krav for at få billedet."],
  ["Hvert ja gemmes", "Med tidspunkt, boks og den tekst, gæsten så. Så kan I vise det, hvis nogen spørger."],
  ["Afmelding i hver SMS", "Gæsten kan melde sig fra med ét svar, og nummeret ryger af listen med det samme."],
  ["Slettes af sig selv", "Numre, der kun er brugt til at sende billedet, slettes efter 30 dage. Numre uden brug i to år slettes."],
] as const;

export function GuestList() {
  return (
    <section id="gaesteliste" className="section guestlist" aria-labelledby="guestlist-title">
      <div className="wrap guestlist-grid">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <span className="label">Gæsteliste</span>
          <h2 id="guestlist-title" className="h-l">
            En gæsteliste, I må sende til.
          </h2>
          <p className="lede">
            En natklub i København fik en bøde på 25.000 kr. for at sende SMS'er til gæster, der kun havde skrevet sig på gæstelisten. Reglen er den samme i dag: I må kun sende tilbud til dem, der har sagt ja til det. Derfor beder boksen om det ja, hver gang.
          </p>
          <a
            className="fine"
            href="https://forbrugerombudsmanden.dk/find-sager/sager/markedsfoeringsloven/sager-efter-markedsfoeringsloven/spam/natklub-idoemt-en-boede-paa-25000-kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sagen hos Forbrugerombudsmanden →
          </a>
        </div>
        <ul className="guestlist-does">
          {does.map(([title, text]) => (
            <li key={title}>
              <b>{title}</b>
              <span className="muted">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
