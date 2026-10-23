"use client";

import { useState } from "react";
import { goals } from "@/lib/erhverv/value";

// The lead machine: "Få jeres designudkast på 24 timer". A place writes who they are and where they live on
// the web; we send a design proposal for the box and a proposal for what it should do at their place.
// The request is saved in admin (Leads) and an internal draft is written from their website, which Esben
// checks before anything is sent. Kept to the fields we need to do the work, nothing more.

const INDUSTRIES = [
  "Bar eller bodega",
  "Natklub",
  "Restaurant eller café",
  "Hotel",
  "Sportsklub",
  "Festival eller event",
  "Biograf eller teater",
  "Forlystelsespark eller zoo",
  "Butik eller center",
  "Brand eller sponsor",
  "Andet",
];
const LOCATIONS = ["1 sted", "2–3 steder", "4–10 steder", "Mere end 10"];

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; dueAt: string; company: string; email: string } | { kind: "error"; message: string };

const due = (iso: string) =>
  new Intl.DateTimeFormat("da-DK", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Copenhagen" }).format(new Date(iso));

export function DesignLead() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // The goals they tick go to us as the first line of the message, so the draft starts from what they want.
    const picked = form.getAll("goal").map(String);
    form.delete("goal");
    const data = Object.fromEntries(form) as Record<string, string>;
    if (picked.length) data.message = [`Vigtigst for os: ${picked.join(", ")}`, data.message].filter(Boolean).join("\n\n");
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/erhverv/udkast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, page: location.pathname }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; dueAt?: string };
      if (!res.ok) throw new Error(body.error ?? "Forespørgslen blev ikke sendt. Prøv igen om lidt.");
      setState({ kind: "sent", dueAt: body.dueAt ?? new Date(Date.now() + 864e5).toISOString(), company: data.company, email: data.email });
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <section id="udkast" className="section lead-sec" aria-labelledby="lead-title">
      <div className="wrap lead">
        <div className="lead-pitch">
          <span className="label">Gratis designudkast</span>
          <h2 id="lead-title" className="h-l">
            Se jeres egen Selfi inden for 24 timer.
          </h2>
          <p className="lede">Skriv, hvem I er, hvor vi finder jer på nettet, og hvad boksen skal gøre for jer. Så tegner vi boksen i jeres farver og form og foreslår, hvad den skal kunne hos jer.</p>
          <ol className="lead-gets">
            <li>
              <b>Et designforslag til boksen</b>
              <span>Kabinet, top og sider i jeres farver, med jeres navn på toppen og rammen på billederne.</span>
            </li>
            <li>
              <b>Et forslag til, hvad boksen skal kunne</b>
              <span>De funktioner, der passer til jeres gæster og forretning: gæsteliste, titler, konkurrencer, videohilsner eller noget, vi bygger til jer.</span>
            </li>
          </ol>
          <p className="lead-fine muted">Gratis og uden forpligtelser. I får udkastet på mail, og vi ringer kun, hvis I vil.</p>
        </div>

        {state.kind === "sent" ? (
          <div className="ok lead-ok" role="status">
            <span className="label">Modtaget</span>
            <h3 className="h-m">Vi går i gang med {state.company}.</h3>
            <p className="muted">
              I får designudkastet på <b>{state.email}</b> senest {due(state.dueAt)}. Vi har lige sendt en bekræftelse. Har I et logo eller en designmanual, så svar på den mail med det.
            </p>
          </div>
        ) : (
          <form className="form lead-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="l-company">Virksomhed</label>
              <input className="input" id="l-company" name="company" autoComplete="organization" placeholder="Fx Bodega Hjørnet" required />
            </div>
            <div className="field">
              <label htmlFor="l-web">Hjemmeside</label>
              <input className="input" id="l-web" name="website" inputMode="url" autoComplete="url" placeholder="bodegahjoernet.dk" required />
            </div>
            <div className="field full">
              <label htmlFor="l-name">Kontaktperson</label>
              <input className="input" id="l-name" name="name" autoComplete="name" placeholder="Fornavn og efternavn" required />
            </div>
            <div className="field">
              <label htmlFor="l-email">E-mail</label>
              <input className="input" id="l-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="l-phone">Telefon</label>
              <input className="input" id="l-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required />
            </div>
            <div className="field">
              <label htmlFor="l-industry">Hvad slags sted</label>
              <select className="input" id="l-industry" name="industry" defaultValue="">
                <option value="" disabled>
                  Vælg
                </option>
                {INDUSTRIES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="l-loc">Antal steder</label>
              <select className="input" id="l-loc" name="locations" defaultValue="1 sted">
                {LOCATIONS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </div>
            <fieldset className="field full lead-goals">
              <legend>
                Hvad skal boksen gøre for jer? <small>(valgfri)</small>
              </legend>
              <div className="lead-goal-list">
                {goals.map((g) => (
                  <label key={g.id} className="lead-goal">
                    <input type="checkbox" name="goal" value={g.title} />
                    <span>{g.title}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field full">
              <label htmlFor="l-msg">
                Noget, vi skal vide? <small>(valgfri)</small>
              </label>
              <textarea className="input" id="l-msg" name="message" rows={3} placeholder="Fx at boksen skal hænge i loungen, eller at I har en maskot" />
            </div>
            <input className="lead-hp" type="text" name="fax" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            {state.kind === "error" && (
              <p className="err full" role="alert">
                {state.message}
              </p>
            )}
            <div className="full lead-submit">
              <button className="btn btn-primary" type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending" ? "Sender …" : "Få jeres designudkast"}
              </button>
              <span className="fine muted">
                Vi bruger oplysningerne til at lave udkastet og kontakte jer om det. <a href="/privatliv">Privatliv</a>
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
