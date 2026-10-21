import { PROOF, REVIEWS, ratingText } from "@/lib/udlejning/proof";

export function Stars({ n, label }: { n: number; label?: string }) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${ratingText(n)} ud af 5 stjerner`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" aria-hidden="true" className={i <= Math.round(n) ? "on" : undefined}>
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

/** A small mark that says the numbers are examples. Disappears when PROOF.placeholder is false. */
export function Example() {
  return PROOF.placeholder ? <span className="tag-ex">Eksempel</span> : null;
}

// Reviews from hosts: the summary first, then six short, concrete reviews with name, occasion and town.
export function Reviews() {
  return (
    <section id="anmeldelser" className="section" aria-labelledby="anmeldelser-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="label">Anmeldelser</span>
          <h2 id="anmeldelser-title" className="h-l">Det siger andre værter.</h2>
        </div>
        <div className="rev-sum">
          <b>{ratingText(PROOF.rating)}</b>
          <div>
            <Stars n={PROOF.rating} />
            <span className="muted">
              <a href={PROOF.trustpilotUrl} target="_blank" rel="noreferrer">
                {PROOF.reviewCount.toLocaleString("da-DK")} anmeldelser på Trustpilot
              </a>
              {" · "}
              {PROOF.parties.toLocaleString("da-DK")} fester
              <Example />
            </span>
          </div>
        </div>
        <ul className="reviews">
          {REVIEWS.map((r) => (
            <li className="review" key={r.name + r.when}>
              <Stars n={r.stars} label={`${r.stars} ud af 5 stjerner`} />
              <p>{r.text}</p>
              <span className="review-who">
                <b>{r.name}</b>
                <span className="muted">
                  {r.occasion} · {r.city} · {r.when}
                </span>
              </span>
              <Example />
            </li>
          ))}
        </ul>
        <p className="fine rev-note">Vi beder alle værter om en anmeldelse efter festen, også når noget kunne have været bedre.</p>
      </div>
    </section>
  );
}
