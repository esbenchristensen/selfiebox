"use client";

import { useState } from "react";
import { PLACE_TYPES } from "@/lib/erhverv/places";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; company: string } | { kind: "error"; message: string };

// The lead machine on /erhverv: a place writes its name, website and a contact person, and gets two things
// within 24 hours: a design proposal for their box, built on the look of their website, and a proposal for
// the software (activities, guest list, sharing) that fits their kind of place. Saved and sent to Esben on SMS
// by /api/kontakt (type "design"). The same request can be made in the chat.
export function DesignOffer() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "design", page: location.pathname }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Det gik ikke igennem. Prøv igen om lidt.");
      setState({ kind: "sent", company: String(data.company ?? "") });
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <section id="udkast" className="section offer" aria-labelledby="offer-title">
      <div className="wrap offer-inner">
        <div className="offer-copy">
          <span className="label">Gratis designudkast</span>
          <h2 id="offer-title" className="h-l">
            Se jeres egen boks inden for 24 timer.
          </h2>
          <p className="lede">Skriv, hvem I er, og hvor vi finder jer på nettet. Så tegner vi boksen i jeres farver og form og sender den sammen med et forslag til, hvad den skal kunne hos jer.</p>
          <ol className="offer-steps">
            <li>
              <b>Et designudkast</b>
              <span className="muted">Top, sider og skærm i jeres udtryk, bygget på jeres hjemmeside og logo.</span>
            </li>
            <li>
              <b>Et forslag til softwaren</b>
              <span className="muted">De aktiviteter, den deling og den gæsteliste, der passer til jeres slags sted og gæster.</span>
            </li>
            <li>
              <b>Ingen binding</b>
              <span className="muted">Kan I lide det, tager vi en snak om pris og opsætning. Ellers er det bare jeres.</span>
            </li>
          </ol>
        </div>

        {state.kind === "sent" ? (
          <div className="ok offer-ok" role="status">
            <h3 className="h-m">Tak. Vi går i gang med {state.company ? `${state.company}${/[sxz]$/i.test(state.company) ? "'" : "s"}` : "jeres"} design.</h3>
            <p className="muted" style={{ marginTop: 8 }}>
              I får udkastet og forslaget på e-mail inden for 24 timer. Har vi spørgsmål undervejs, ringer vi på det nummer, I har skrevet.
            </p>
          </div>
        ) : (
          <form className="form offer-form" onSubmit={onSubmit}>
            <div className="field full">
              <label htmlFor="o-company">Virksomhed eller sted</label>
              <input className="input" id="o-company" name="company" autoComplete="organization" placeholder="Fx Bodega Hjørnet" required />
            </div>
            <div className="field">
              <label htmlFor="o-website">Hjemmeside</label>
              <input className="input" id="o-website" name="website" inputMode="url" autoComplete="url" placeholder="bodegahjoernet.dk" required />
            </div>
            <div className="field">
              <label htmlFor="o-type">Slags sted</label>
              <select className="input" id="o-type" name="placeType" defaultValue="">
                <option value="" disabled>
                  Vælg
                </option>
                {PLACE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="o-name">Kontaktperson</label>
              <input className="input" id="o-name" name="name" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="o-city">
                By <small>(valgfri)</small>
              </label>
              <input className="input" id="o-city" name="city" autoComplete="address-level2" />
            </div>
            <div className="field">
              <label htmlFor="o-email">E-mail</label>
              <input className="input" id="o-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="o-phone">Telefon</label>
              <input className="input" id="o-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
            </div>
            <div className="field full">
              <label htmlFor="o-msg">
                Noget, vi skal vide? <small>(valgfri)</small>
              </label>
              <textarea className="input" id="o-msg" name="message" rows={3} placeholder="Fx hvor boksen skal hænge, en maskot eller farver I bruger" />
            </div>
            <input type="text" name="company_url" tabIndex={-1} autoComplete="off" aria-hidden="true" className="offer-hp" />
            {state.kind === "error" && (
              <p className="err full" role="alert">
                {state.message}
              </p>
            )}
            <div className="full offer-send">
              <button className="btn btn-primary" type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending" ? "Sender …" : "Få jeres designudkast"}
              </button>
              <p className="fine muted">
                Vi bruger kun oplysningerne til at lave udkastet og kontakte jer om det. <a href="/privatliv">Sådan behandler vi data</a>.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
