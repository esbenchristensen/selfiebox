import { Ph } from "@/components/Placeholder";
import { timeline } from "@/lib/erhverv/placeholder";

// What happens after "book en snak": five steps from the first call to the box hanging on the wall,
// and the three things the place must have ready. Times are placeholders until the first deliveries.

export function Start() {
  const steps = [
    { title: "En snak på 20 minutter", text: "I fortæller om stedet, gæsterne og væggen. Vi viser boksen og de aktiviteter, der passer til jer.", when: "Dag 1" },
    { title: "Tilbud og design", text: "I får en pris på antal bokse og et forslag til designet. I godkender, før vi printer.", when: timeline.design, ph: "tid til design er ikke besluttet" },
    { title: "Vi printer og tester", text: "Top, sider og kabinet printes i jeres form. Skærm, ramme og aktiviteter sættes op, og boksen testes, før den sendes.", when: timeline.print, ph: "tid til print og test er ikke besluttet" },
    { title: "Boksen kommer med posten", text: "I hænger den op med vægbeslaget og guiden på ca. 20 minutter og sætter den på wifi. Vi tjekker på afstand, at den virker.", when: "1 dag" },
    { title: "Vi passer den", text: "Overvågning, opdateringer og support døgnet rundt. Går den i stykker, sender vi en ny.", when: "Derefter" },
  ];
  const ready = [
    ["En væg eller en søjle", "Boksen er 22,5 × 30,6 cm og hænger i øjenhøjde, hvor folk venter og har hænderne fri."],
    ["En stikkontakt", "Inden for kablets rækkevidde, med HFI-relæ som i enhver bar."],
    ["Wifi", "Boksen skal på nettet for at sende billeder på SMS. Har I ikke wifi dér, kan den få 4G."],
  ] as const;
  return (
    <section id="start" className="section" aria-labelledby="start-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Sådan kommer vi i gang</span>
          <h2 id="start-title" className="h-l">
            Fra en snak til en boks på væggen på{" "}
            <Ph note="samlet tid er ikke besluttet">{timeline.total}</Ph>.
          </h2>
        </div>
        <ol className="start-steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="start-n">0{i + 1}</span>
              <span className="start-when">{s.ph ? <Ph note={s.ph}>{s.when}</Ph> : s.when}</span>
              <b>{s.title}</b>
              <span className="muted">{s.text}</span>
            </li>
          ))}
        </ol>
        <div className="start-ready">
          <h3 className="h-m">Det skal I have klar.</h3>
          <ul>
            {ready.map(([title, text]) => (
              <li key={title}>
                <b>{title}</b>
                <span className="muted">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
