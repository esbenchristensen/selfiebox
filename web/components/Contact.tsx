"use client";

import { useState } from "react";
import { OutlineStand, OutlineWall } from "./Outline";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

// Places buy through a conversation, so this form is how they get in touch. `topic` tells us which page they wrote from.
// `privat` is the short version for people renting a box for a party, who book themselves and only write with questions.
export function Contact({ topic, kind = "erhverv" }: { topic?: string; kind?: "erhverv" | "privat" }) {
  const privat = kind === "privat";
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: kind, topic }),
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
          <h2 id="contact-title" className="h-l">
            {privat ? "Spørgsmål til jeres fest?" : "Fortæl os om jeres sted."}
          </h2>
          <p className="lede">
            {privat
              ? "Er jeres dato optaget, skal I bruge boksen i mere end to uger, eller vil I bare høre om noget? Skriv, så vender vi tilbage."
              : "Skriv et par linjer om stedet, så vender vi tilbage og aftaler en snak om design, antal bokse og aktiviteter."}
          </p>
          <div className="contact-art">{privat ? <OutlineStand /> : <OutlineWall />}</div>
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
            <div className="field full">
              {privat ? (
                <>
                  <label htmlFor="f-place">
                    Hvornår og hvad fejrer I? <small>(valgfri)</small>
                  </label>
                  <input className="input" id="f-place" name="place" placeholder="Fx bryllup 14. juni" />
                </>
              ) : (
                <>
                  <label htmlFor="f-place">Sted eller firma</label>
                  <input className="input" id="f-place" name="place" autoComplete="organization" required />
                </>
              )}
            </div>
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
