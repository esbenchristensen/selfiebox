// The guest list the place may actually use. The box asks the guest for a yes, so the list is the place's
// own to send to. Short and positive; the rules are handled, not lectured.

const does = [
  ["Et ja fra gæsten", "Gæsten skriver sit nummer for at få billedet og kan samtidig sige ja til at høre fra jer. Dem, der siger ja, kommer på listen."],
  ["Klar i kontrolpanelet", "Listen vokser af sig selv, hver aften I har åbent. I sender et tilbud eller en invitation derfra, når I vil."],
  ["Holder sig selv ren", "Hver SMS har en afmelding, og numre uden brug i to år slettes. Listen er altid jeres egne, aktive gæster."],
  ["Dokumenteret", "Hvert ja gemmes med tidspunkt og tekst. Hvis nogen spørger, kan I vise det."],
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
            Fredagens gæster er de nemmeste at få tilbage næste fredag. Boksen spørger gæsten, om I må skrive, og dem, der siger ja, lander på en liste, I kan sende til med det samme: et tilbud, en invitation til en fest, nyt på kortet.
          </p>
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
