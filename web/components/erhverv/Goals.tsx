import { functionMap, goals } from "@/lib/erhverv/value";

const soon = new Set(functionMap.filter((f) => f.soon).map((f) => f.slug));

// Why places buy the box, right after the hero. Six goals, each in the buyer's own words, with the functions
// that serve it and what it gives. All six are visible at once: the page's job is the broad picture, and a
// reader finds their own reason before they read about any one function.
export function Goals() {
  return (
    <section id="maal" className="section" aria-labelledby="goals-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Hvad skal boksen gøre for jer?</span>
          <h2 id="goals-title" className="h-l">
            Én boks. Seks grunde til at hænge den op.
          </h2>
          <p className="lede">Nogle vil give gæsterne en sjov aften, andre vil have deres navn ud eller en liste at sende til. De fleste vil have flere ting. Funktionerne er de samme, I vælger, hvad der er tændt.</p>
        </div>
        <div className="goals">
          {goals.map((g, i) => (
            <article className="goal" key={g.id} aria-labelledby={`goal-${g.id}`}>
              <span className="goal-n">0{i + 1}</span>
              <h3 id={`goal-${g.id}`}>{g.title}</h3>
              <blockquote className="goal-story">{g.story}</blockquote>
              <ul className="goal-how" aria-label="Sådan gør boksen det">
                {g.how.map(([slug, text]) => (
                  <li key={text}>
                    <a href={slug.startsWith("#") ? slug : `/funktioner/${slug}`}>{text}</a>
                    {soon.has(slug) && <span className="soon">Kommer snart</span>}
                  </li>
                ))}
              </ul>
              <p className="goal-gain">{g.gain}</p>
              <p className="goal-who">
                <span className="label">Typisk</span> {g.who}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
