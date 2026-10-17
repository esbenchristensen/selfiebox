"use client";

import { useState } from "react";
import { OutlineStand, OutlineWall } from "./Outline";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

// The page decides the audience. Private hosts mostly book in the calendar, so their
// form is for questions; venues have no calendar, so this form is how they buy.
export function Contact({ type }: { type: "erhverv" | "events" | "privat" }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Beskeden blev ikke sendt. Prøv igen om lidt.");
      setState({ kind: "sent" });
    } catch (err) {
      setState({ kind: "error", message: (err as Error).message });
    }
  }

  return (
    <section id="kontakt" className="section" aria-labelledby="contact-title">
      <div className="wrap contact">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <span className="label">Kontakt</span>
          {type === "events" ? (
            <>
              <h2 id="contact-title" className="h-l">
                Fortæl os om jeres park, festival eller zoo.
              </h2>
              <p className="lede">
                Skriv et par linjer om stedet, så vender vi tilbage og aftaler en snak om tema, antal bokse og aktiviteter. Er I en bar eller et værtshus, kan I <a href="/erhverv">se vores løsning til barer her</a>.
              </p>
            </>
          ) : type === "erhverv" ? (
            <>
              <h2 id="contact-title" className="h-l">
                Fortæl os om jeres sted.
              </h2>
              <p className="lede">
                Skriv et par linjer om stedet, så vender vi tilbage og aftaler en snak om, hvor boksen skal hænge, og hvad den skal gøre for jer. Skal I kun bruge en boks til én fest, kan I <a href="/#book">leje den her</a>.
              </p>
            </>
          ) : (
            <>
              <h2 id="contact-title" className="h-l">
                Spørgsmål før I booker?
              </h2>
              <p className="lede">
                Skriv et par linjer, så svarer vi på mail. Ledige datoer og priser kan I se direkte i <a href="#book">bookingkalenderen</a>.
              </p>
            </>
          )}
          <div className="contact-art">{type === "privat" ? <OutlineStand /> : <OutlineWall />}</div>
        </div>

        {state.kind === "sent" ? (
          <div className="ok" role="status">
            <h3 className="h-m">Tak. Vi har fået jeres besked.</h3>
            <p className="muted" style={{ marginTop: 8 }}>
              Vi svarer på den e-mail, I har skrevet.
            </p>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit} noValidate={false}>
            <div className="field">
              <label htmlFor="f-name">Navn</label>
              <input className="input" id="f-name" name="name" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="f-phone">
                Telefon <small>(valgfri)</small>
              </label>
              <input className="input" id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" />
            </div>
            <div className="field full">
              <label htmlFor="f-email">E-mail</label>
              <input className="input" id="f-email" name="email" type="email" autoComplete="email" required />
            </div>
            {type !== "privat" ? (
              <div className="field full">
                <label htmlFor="f-place">{type === "events" ? "Park, festival eller sted" : "Sted eller firma"}</label>
                <input className="input" id="f-place" name="place" autoComplete="organization" required />
              </div>
            ) : (
              <div className="field full">
                <label htmlFor="f-date">
                  Dato for festen <small>(valgfri)</small>
                </label>
                <input className="input" id="f-date" name="date" type="date" />
              </div>
            )}
            <div className="field full">
              <label htmlFor="f-msg">
                Besked <small>(valgfri)</small>
              </label>
              <textarea className="input" id="f-msg" name="message" rows={4} />
            </div>
            {state.kind === "error" && (
              <p className="err full" role="alert">
                {state.message}
              </p>
            )}
            <div className="full">
              <button className="btn btn-primary" type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending" ? "Sender …" : "Send besked"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
