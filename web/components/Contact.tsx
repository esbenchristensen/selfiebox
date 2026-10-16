"use client";

import { useState } from "react";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function Contact() {
  const [type, setType] = useState<"erhverv" | "privat">("erhverv");
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
          <h2 id="contact-title" className="h-l">
            Lad os tale om jeres aften.
          </h2>
          <p className="lede">Skriv lidt om stedet eller festen, så vender vi tilbage med en pris og en plan.</p>
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
            <div className="full">
              <div className="seg" role="group" aria-label="Hvem er I">
                <button type="button" aria-pressed={type === "erhverv"} onClick={() => setType("erhverv")}>
                  Et sted eller firma
                </button>
                <button type="button" aria-pressed={type === "privat"} onClick={() => setType("privat")}>
                  En privat fest
                </button>
              </div>
            </div>
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
            {type === "erhverv" ? (
              <div className="field full">
                <label htmlFor="f-place">Sted eller firma</label>
                <input className="input" id="f-place" name="place" autoComplete="organization" required />
              </div>
            ) : (
              <div className="field full">
                <label htmlFor="f-date">Dato for festen</label>
                <input className="input" id="f-date" name="date" type="date" required />
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
