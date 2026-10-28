import { functionMap, goals } from "@/lib/erhverv/value";

const facts = ["12 MP-kamera med autofokus og studielys fra ringen", "Video i HD, stående til stories", "Mikrofonmodul til videohilsner i alle bokse"];

// Every function and the goals it serves, as one map. It replaces the old activities grid: activities are
// rows here next to design, sharing and the guest list, so a reader sees that one function often serves
// several goals, and which ones serve theirs. On phones each row lists its goals as words instead of dots.
export function FunctionMap() {
  return (
    <section id="funktioner" className="section" aria-labelledby="fmap-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Funktioner</span>
          <h2 id="fmap-title" className="h-l">
            Alt er med. Her er, hvad hver funktion gør for hvem.
          </h2>
          <p className="lede">Alle funktioner er med i prisen og slås til og fra i kontrolpanelet. Det samme sted kan bruge guldtid en tirsdag og en konkurrence om lørdagen.</p>
        </div>
        <div className="fmap" role="table" aria-label="Funktioner og hvad de giver">
          <div className="fmap-row fmap-head" role="row">
            <span role="columnheader">Funktion</span>
            {goals.map((g) => (
              <span role="columnheader" key={g.id}>
                {g.short}
              </span>
            ))}
          </div>
          {functionMap.map((f) => (
            <div className="fmap-row" role="row" key={f.slug}>
              <span role="rowheader" className="fmap-fn">
                <a href={f.href ?? `/funktioner/${f.slug}`}>{f.name}</a>
                {f.soon && <span className="soon">Kommer snart</span>}
                <span className="muted">{f.text}</span>
              </span>
              {goals.map((g) => {
                const on = f.goals.includes(g.id);
                return (
                  <span role="cell" key={g.id} className={on ? "fmap-cell on" : "fmap-cell"}>
                    {on ? <span className="fmap-dot" aria-hidden="true" /> : null}
                    <span className={on ? "fmap-word" : "sr-only"}>{on ? g.short : `Ikke ${g.short.toLowerCase()}`}</span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        <ul className="facts" aria-label="Kamera, video og lyd">
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
