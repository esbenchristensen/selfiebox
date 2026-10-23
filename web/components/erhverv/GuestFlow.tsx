// What happens for a guest, in four steps. Static: the scroll animation it replaces cost three screens.

const steps = [
  { title: "Ringen lyser", text: "Når ingen bruger boksen, pulserer lysringen. Den kan ses over hele lokalet." },
  { title: "Et tryk", text: "Gæsten trykker på skærmen og stiller sig op. Ringen tæller ned fra 3. Ingen skal forklare noget." },
  { title: "Studielys og billede", text: "Ringen skifter til hvidt lys, og kameraet tager billedet, så alle står skarpt, også i en mørk bar." },
  { title: "På telefonen, med jeres navn", text: "Gæsten skriver sit nummer og får billedet på SMS med jeres ramme, klar til at dele. Vil gæsten høre fra jer, siger de ja for sig." },
];

export function GuestFlow() {
  return (
    <section id="saadan" className="section flow" aria-labelledby="flow-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Sådan går det for gæsten</span>
          <h2 id="flow-title" className="h-l">
            Fra tryk til billede på under et minut.
          </h2>
        </div>
        <ol className="flow-steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="flow-n">0{i + 1}</span>
              <b>{s.title}</b>
              <span className="muted">{s.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
