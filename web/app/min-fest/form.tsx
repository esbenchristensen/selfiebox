"use client";

import { useState } from "react";

export function MinFestForm() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/min-fest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking: f.get("booking"), email: f.get("email") }),
      });
      const out = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      setMsg(res.ok ? { ok: true, text: out.message ?? "Tjek jeres mail." } : { ok: false, text: out.error ?? "Noget gik galt. Prøv igen." });
    } catch {
      setMsg({ ok: false, text: "Ingen forbindelse. Prøv igen." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="mf-form" onSubmit={submit}>
      <label>
        <span>Bookingnummer</span>
        <input name="booking" required autoComplete="off" placeholder="SB-271021-K4QX" spellCheck={false} />
      </label>
      <label>
        <span>E-mail, I bookede med</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <button className="btn btn-primary" disabled={busy}>{busy ? "Sender …" : "Send mig linket"}</button>
      {msg && <p className={msg.ok ? "mf-ok" : "mf-err"} role="status">{msg.text}</p>}
    </form>
  );
}
