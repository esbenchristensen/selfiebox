import { Icon } from "./Drawings";

// What the box can do at the party, in three groups: the photos, the fun in front of it, and what the hosts
// set up. Only what every rental box has; the microphone for video greetings is in every box, never an add-on.
type Fn = { icon: Parameters<typeof Icon>[0]["name"]; title: string; text: string };

const GROUPS: { title: string; items: Fn[] }[] = [
  {
    title: "Billederne",
    items: [
      { icon: "infinity", title: "Ubegrænsede billeder", text: "Ingen tæller og ingen grænse. Gæsterne tager lige så mange, de vil." },
      { icon: "qr", title: "Billedet på telefonen", text: "En QR-kode efter hvert billede. Uden app og uden at oprette noget." },
      { icon: "gallery", title: "Jeres egen eventside", text: "Alle festens billeder og videoer samlet ét sted, kun for dem med linket." },
      { icon: "light", title: "Studielys i ringen", text: "Lyset sidder hele vejen rundt om skærmen, så ansigterne står skarpt, også i en mørk sal." },
    ],
  },
  {
    title: "Ved boksen",
    items: [
      { icon: "mic", title: "Videohilsner", text: "Gæsterne indtaler en kort hilsen til jer på video. Mikrofonen sidder i boksen." },
      { icon: "sparkle", title: "Digitale rekvisitter", text: "Hatte, briller og kroner, der følger ansigtet. Ingen kasse at pakke." },
      { icon: "target", title: "Små opgaver i nedtællingen", text: "»Alle laver deres bedste dansemove« eller »Find en, du ikke kender«. Det får folk til at grine." },
      { icon: "print", title: "Print på stedet", text: "Tag printeren med, så får gæsterne billedet med hjem som fotostrimmel eller polaroid." },
    ],
  },
  {
    title: "Til jer, der holder festen",
    items: [
      { icon: "frame", title: "Jeres navne og dato", text: "Jeres overskrift på skærmen og jeres navne og festens dato på hvert billede." },
      { icon: "palette", title: "En stemning, der passer", text: "Hyggelig, elegant, vild fest, sjov og farverig eller jul. Farver, skrifter og effekter følger med." },
      { icon: "clock", title: "Tidsplan for aftenen", text: "Velkomst, middag og fest har hver deres tekster, og boksen skifter selv." },
      { icon: "eye", title: "Se det, før boksen kommer", text: "I sætter boksen op i browseren og tager et testbillede med jeres eget kamera." },
      { icon: "wifi", title: "Virker uden internet", text: "Boksen tager billeder uden wifi og lægger dem på eventsiden, så snart den er på nettet." },
    ],
  },
];

export function Functions() {
  return (
    <section id="funktioner" className="section" aria-labelledby="funktioner-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Funktioner</span>
          <h2 id="funktioner-title" className="h-l">Alt det, boksen kan til jeres fest.</h2>
          <p className="lede">Det hele er med i prisen og slået til fra starten. I vælger selv, hvad I vil bruge, når I sætter boksen op.</p>
        </div>
        <div className="fn">
          {GROUPS.map((g) => (
            <div className="fn-group" key={g.title}>
              <h3 className="fn-title">{g.title}</h3>
              <ul className="fn-list">
                {g.items.map((f) => (
                  <li key={f.title}>
                    <Icon name={f.icon} />
                    <span>
                      <b>{f.title}</b>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
