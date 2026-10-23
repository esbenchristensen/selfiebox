"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mark } from "../Logo";
import "./support.css";

// The support chat on every page of selfi.dk: a button bottom right, a panel with the conversation.
// Sif (the AI) answers at once and streams the reply; when a colleague takes over in admin, their messages arrive
// through polling and the assistant stays quiet. The chat is tied to an httpOnly cookie set by the API.

type Role = "customer" | "assistant" | "human" | "system";
type Msg = { seq: number; role: Role; text: string; at: string; name: string | null; sources: { url: string; title: string }[] | null; pending?: boolean };
type Chat = {
  id: string;
  status: "open" | "waiting_human" | "human" | "closed";
  takenBy: string | null;
  escalation: { at: string; urgent: boolean; replyBy: string } | null;
  customer: { name: string; bookings: string[] } | null;
  contact: { name: string } | null;
  open: boolean;
  hours: string;
};

const NAME = "Sif";
const COLLEAGUE = "Kollega fra Selfi";
const INTRO = "Hej, jeg er Sif, Selfis AI-assistent. Jeg hjælper med leje til fester og med bokse i eget design til barer, klubber, hoteller og andre steder.";
const INTRO_CONTACT = "Skriv dit navn, din e-mail og dit telefonnummer, så går vi i gang. Vi bruger dem kun til at svare dig, og vi slår ikke noget op, før du selv spørger til en ordre.";
const CHIPS = ["Hvor er vores boks?", "Vi vil flytte datoen", "Hvad koster det?", "Hvordan sender vi den retur?"];
const CHIPS_ERHVERV = ["Hvad kan boksen gøre for os?", "Vi vil gerne have et designudkast", "Hvad koster det for et sted?", "Hvordan hænger vi den op?"];

type Contact = { name: string; email: string; phone: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unseen, setUnseen] = useState(0);
  const [menu, setMenu] = useState(false);
  // What the customer typed on the first screen. Kept in memory only and sent with the first message.
  const [contact, setContact] = useState<Contact | null>(null);
  const [askContact, setAskContact] = useState(false);
  const [erhverv, setErhverv] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastSeq = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;

  const scroll = useCallback(() => {
    const el = listRef.current;
    if (el) requestAnimationFrame(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }));
  }, []);

  const merge = useCallback((incoming: Msg[]) => {
    if (!incoming.length) return;
    setMsgs((cur) => {
      const have = new Set(cur.filter((m) => !m.pending).map((m) => m.seq));
      const fresh = incoming.filter((m) => !have.has(m.seq));
      if (!fresh.length) return cur;
      lastSeq.current = Math.max(lastSeq.current, ...fresh.map((m) => m.seq));
      if (!openRef.current) setUnseen((n) => n + fresh.filter((m) => m.role === "human" || m.role === "assistant").length);
      // A message sent from here is shown at once (pending); the saved copy replaces it when it comes back.
      let rest = cur;
      for (const f of fresh) {
        const i = rest.findIndex((m) => m.pending && m.role === f.role && m.text === f.text);
        if (i >= 0) rest = [...rest.slice(0, i), ...rest.slice(i + 1)];
      }
      return [...rest, ...fresh].sort((a, b) => a.seq - b.seq);
    });
    scroll();
  }, [scroll]);

  const poll = useCallback(async () => {
    try {
      const r = await fetch(`/api/support/chat?after=${lastSeq.current}`, { cache: "no-store" });
      if (!r.ok) return;
      const data = (await r.json()) as { chat: Chat | null; messages: Msg[] };
      setChat(data.chat);
      merge(data.messages);
    } catch {
      // Offline for a moment: the next poll catches up.
    } finally {
      setLoaded(true);
    }
  }, [merge]);

  // Load the conversation when the panel opens; poll while it is open, faster while a human is on it.
  useEffect(() => {
    if (!open) return;
    void poll();
    const ms = chat?.status === "human" || chat?.status === "waiting_human" ? 2500 : 5000;
    const t = setInterval(() => document.visibilityState === "visible" && !busy && void poll(), ms);
    return () => clearInterval(t);
  }, [open, chat?.status, busy, poll]);

  // Closed panel: keep an eye out for a colleague's replies, so the button can show them.
  useEffect(() => {
    if (open || !chat || (chat.status !== "human" && chat.status !== "waiting_human")) return;
    const t = setInterval(() => document.visibilityState === "visible" && void poll(), 8000);
    return () => clearInterval(t);
  }, [open, chat, poll]);

  useEffect(() => setErhverv(location.pathname.startsWith("/erhverv")), [open]);

  useEffect(() => {
    if (!open) return;
    setUnseen(0);
    inputRef.current?.focus();
    scroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, scroll]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setDraft("");
    setError(null);
    setBusy(true);
    const now = new Date().toISOString();
    const tmp = 1e9 + Date.now();
    const reply = tmp + 1;
    // Both bubbles at once: the customer's text and "Skriver…", so nothing feels dead while the server works.
    setMsgs((cur) => [
      ...cur,
      { seq: tmp, role: "customer", text: t, at: now, name: null, sources: null, pending: true },
      { seq: reply, role: "assistant", text: "", at: now, name: NAME, sources: null, pending: true },
    ]);
    scroll();
    try {
      const needs = !chat || chat.status === "closed" || !chat.contact;
      const r = await fetch("/api/support/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: t, page: location.pathname, ...(needs && contact ? { contact } : {}) }) });
      if (!r.ok) {
        const b = (await r.json().catch(() => ({}))) as { error?: string; needContact?: boolean };
        if (b.needContact) {
          setContact(null);
          setAskContact(true);
          setDraft(t);
          setMsgs((cur) => cur.filter((m) => !m.pending));
        }
        throw new Error(b.error ?? "Beskeden blev ikke sendt. Prøv igen.");
      }
      if (r.headers.get("content-type")?.includes("application/json")) {
        // A human has the chat: no reply from Sif, so the "Skriver…" bubble goes away again.
        const b = (await r.json()) as { chat: Chat };
        setMsgs((cur) => cur.filter((m) => m.seq !== reply));
        setChat(b.chat);
        await poll();
        return;
      }
      await readStream(r, {
        // The customer's message gets its saved number at once, so it keeps its place above the reply.
        accepted: (d) => {
          lastSeq.current = Math.max(lastSeq.current, d.seq);
          setMsgs((cur) => cur.map((m) => (m.seq === tmp ? { ...m, seq: d.seq, pending: false } : m)));
        },
        // The reply is shown when it is complete; until then the bubble says "Skriver…".
        delta: () => undefined,
        status: (d) => setStatus(d.text),
        sources: (d) => setMsgs((cur) => cur.map((m) => (m.seq === reply ? { ...m, sources: d.sources } : m))),
        done: (d) => {
          lastSeq.current = Math.max(lastSeq.current, d.seq);
          setMsgs((cur) => cur.map((m) => (m.seq === reply ? { ...m, text: d.text, seq: d.seq, pending: false } : m)));
        },
        error: (d) => setError(d.text),
        state: (d) => setChat(d.chat),
      });
      setStatus(null);
      await poll();
    } catch (e) {
      setError((e as Error).message);
      setMsgs((cur) => cur.filter((m) => !(m.pending && m.role === "assistant" && !m.text)));
    } finally {
      setBusy(false);
      setStatus(null);
      inputRef.current?.focus();
    }
  }

  async function askHuman() {
    setMenu(false);
    setBusy(true);
    try {
      const r = await fetch("/api/support/human", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contact ? { contact } : {}) });
      if (r.ok) {
        const b = (await r.json()) as { chat: Chat };
        setChat(b.chat);
        await poll();
      }
    } finally {
      setBusy(false);
    }
  }

  async function restart() {
    setMenu(false);
    await fetch("/api/support/chat", { method: "DELETE" });
    setChat(null);
    setMsgs([]);
    lastSeq.current = 0;
    setContact(null);
    setError(null);
    inputRef.current?.focus();
  }

  const human = chat?.status === "human";
  const waiting = chat?.status === "waiting_human";
  const closed = chat?.status === "closed";
  // Name, e-mail and phone come before the first message (and again when a closed chat starts over).
  const needContact = loaded && !contact && (askContact || !chat || closed || !chat.contact);
  const chips = erhverv ? CHIPS_ERHVERV : CHIPS;
  // Never the name of the person at Selfi: the customer sees "en kollega" (Esben, 22. okt. 2026).
  const sub = human ? "En kollega fra Selfi skriver med dig" : waiting ? `En kollega svarer ${chat?.escalation?.replyBy ?? "snart"}` : "Selfis AI-assistent";

  return (
    <>
      <button type="button" className={`sc-fab${open ? " is-open" : ""}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="selfi-chat" aria-label={open ? "Luk chatten" : "Åbn chatten"}>
        <span className="sc-fab-icon" aria-hidden="true">
          {open ? (
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 3.5V6zM8 9.5h8M8 12.5h5" /></svg>
          )}
        </span>
        <span className="sc-fab-label">Spørg os</span>
        {unseen > 0 && !open && <span className="sc-badge" aria-label={`${unseen} nye svar`}>{unseen}</span>}
      </button>

      <section id="selfi-chat" className={`sc-panel${open ? " is-open" : ""}`} role="dialog" aria-label={`Chat med ${NAME}`} aria-hidden={!open}>
        <header className="sc-head">
          <span className="sc-avatar" aria-hidden="true"><Mark /></span>
          <div className="sc-title">
            <b>{human ? COLLEAGUE : NAME}</b>
            <span className={`sc-sub${human ? " is-human" : ""}`}>{sub}</span>
          </div>
          <div className="sc-menu">
            <button type="button" className="sc-icon" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Flere valg">
              <svg viewBox="0 0 24 24"><path d="M12 6h.01M12 12h.01M12 18h.01" /></svg>
            </button>
            {menu && (
              <div className="sc-menu-list" role="menu">
                {!human && !waiting && <button type="button" role="menuitem" onClick={askHuman}>Tal med et menneske</button>}
                <button type="button" role="menuitem" onClick={restart}>Ny samtale</button>
                <a role="menuitem" href="/privatliv">Sådan behandler vi chatten</a>
              </div>
            )}
          </div>
          <button type="button" className="sc-icon" onClick={() => setOpen(false)} aria-label="Luk">
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <div className="sc-list" ref={listRef}>
          <Bubble m={{ seq: 0, role: "assistant", text: needContact ? `${INTRO}\n\n${INTRO_CONTACT}` : INTRO, at: "", name: NAME, sources: null }} />
          {loaded && !needContact && msgs.length === 0 && !closed && (
            <div className="sc-chips">
              {chips.map((c) => (
                <button key={c} type="button" onClick={() => void send(c)}>{c}</button>
              ))}
            </div>
          )}
          {msgs.map((m) => <Bubble key={m.seq} m={m} />)}
          {status && (
            <div className="sc-status" role="status"><i /> {status}</div>
          )}
          {error && <p className="sc-error" role="alert">{error}</p>}
          {closed && <p className="sc-note">Samtalen er afsluttet. Skriv igen, så starter en ny.</p>}
        </div>

        {needContact ? (
          <ContactForm
            onDone={(c) => {
              setContact(c);
              setAskContact(false);
              setError(null);
              requestAnimationFrame(() => inputRef.current?.focus());
            }}
          />
        ) : (
        <form
          className="sc-compose"
          onSubmit={(e) => {
            e.preventDefault();
            void send(draft);
          }}
        >
          <textarea
            ref={inputRef}
            value={draft}
            rows={1}
            maxLength={1500}
            placeholder={human ? "Skriv til Selfi" : `Skriv til ${NAME}`}
            aria-label="Din besked"
            onChange={(e) => {
              setDraft(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft);
              }
            }}
          />
          <button type="submit" className="sc-send" disabled={busy || !draft.trim()} aria-label="Send">
            <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        </form>
        )}
        <p className="sc-fine">{human ? "Du skriver med et menneske." : "Sif er en AI og kan tage fejl. Bed om et menneske, når du vil."}</p>
      </section>
    </>
  );
}

/** The first screen: name, e-mail and phone, checked lightly here and properly on the server. */
function ContactForm({ onDone }: { onDone: (c: Contact) => void }) {
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      className="sc-contact"
      onSubmit={(e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        const c = { name: (f.name ?? "").trim(), email: (f.email ?? "").trim(), phone: (f.phone ?? "").trim() };
        if (!c.name) return setErr("Skriv dit navn.");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return setErr("Skriv en gyldig e-mail.");
        if (c.phone.replace(/\D/g, "").length < 8) return setErr("Skriv dit telefonnummer.");
        onDone(c);
      }}
    >
      <input name="name" autoComplete="name" placeholder="Navn" aria-label="Navn" required />
      <input name="email" type="email" autoComplete="email" placeholder="E-mail" aria-label="E-mail" required />
      <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Telefon" aria-label="Telefon" required />
      {err && <p className="sc-error" role="alert">{err}</p>}
      <button type="submit" className="sc-start">Start chatten</button>
    </form>
  );
}

function Bubble({ m }: { m: Msg }) {
  if (m.role === "system") return <p className="sc-note">{m.text}</p>;
  const mine = m.role === "customer";
  return (
    <div className={`sc-msg ${mine ? "is-me" : m.role === "human" ? "is-human" : "is-ai"}`}>
      {!mine && <span className="sc-who">{m.role === "human" ? COLLEAGUE : NAME}</span>}
      <div className="sc-bubble">
        {m.text ? <Rich text={m.text} /> : <span className="sc-typing" role="status">Skriver<span className="sc-dots" aria-hidden="true"><i /><i /><i /></span></span>}
      </div>
      {m.sources && m.sources.length > 0 && (
        <ul className="sc-sources">
          {m.sources.map((s) => (
            <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title || new URL(s.url).hostname}</a></li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Paragraphs, simple lists, **bold** and links. Nothing else: the assistant is told to write plain text. */
function Rich({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, "").split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.length > 1 && lines.every((l) => /^\s*([-•*]|\d+[.)])\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}><Inline text={l.replace(/^\s*([-•*]|\d+[.)])\s+/, "")} /></li>)}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>{j > 0 && <br />}<Inline text={l} /></span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^\*\*[^*]+\*\*$/.test(p)) return <b key={i}>{p.slice(2, -2)}</b>;
        if (/^https?:\/\//.test(p)) return <a key={i} href={p} target="_blank" rel="noreferrer">{p.replace(/^https?:\/\/(www\.)?/, "")}</a>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

type Handlers = {
  accepted: (d: { seq: number }) => void;
  delta: (d: { text: string }) => void;
  status: (d: { text: string }) => void;
  sources: (d: { sources: { url: string; title: string }[] }) => void;
  done: (d: { text: string; seq: number }) => void;
  error: (d: { text: string }) => void;
  state: (d: { chat: Chat }) => void;
};

/** Reads the server-sent events from the reply and calls the handler for each. */
async function readStream(r: Response, h: Handlers): Promise<void> {
  const reader = r.body?.getReader();
  if (!reader) return;
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const line = chunk.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      try {
        const ev = JSON.parse(line.slice(6)) as { type: keyof Handlers } & Record<string, unknown>;
        (h[ev.type] as ((d: unknown) => void) | undefined)?.(ev);
      } catch {
        // A malformed event is skipped; the final poll shows the saved reply anyway.
      }
    }
  }
}
