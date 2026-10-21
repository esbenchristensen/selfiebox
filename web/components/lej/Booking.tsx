"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, formatDay, formatRange, nights, type DayKey, type Range } from "@/lib/dates";
import {
  bookingWindow,
  DELIVERIES,
  fits,
  kr,
  PHOTO_TYPES,
  periodLabel,
  priceForDays,
  priceLines,
  total,
  type Delivery,
  type PhotoType,
  type RentalSettings,
  type Usage,
} from "@/lib/udlejning/core";
import { Calendar } from "./Calendar";

// The booking on selfi.dk/lej: what the customer wants first (theme, printer, photo type, delivery), because
// that decides which days are free, then the dates, then who they are, then Stripe. Prices and free days come
// from /api/udlejning/ledighed, which reads what is set in admin.selfi.dk → Udlejning.

const STEPS = ["Pakke", "Datoer", "Kontakt", "Betal"] as const;
const OCCASIONS = ["Bryllup", "Fødselsdag", "Konfirmation", "Firmafest", "Andet"];
const SAVED = "selfi:lej";

type Data = { settings: RentalSettings; usage: Usage; today: DayKey };
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string };
type State = {
  theme: string | null;
  printer: boolean;
  photoType: PhotoType;
  delivery: Delivery;
  range: Range | null;
  contact: { name: string; email: string; phone: string; occasion: string; message: string };
  address: { street: string; zip: string; city: string };
};

const EMPTY: State = {
  theme: null,
  printer: false,
  photoType: "polaroid",
  delivery: "post",
  range: null,
  contact: { name: "", email: "", phone: "", occasion: "", message: "" },
  address: { street: "", zip: "", city: "" },
};

export function Booking() {
  const [data, setData] = useState<Data | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [s, setS] = useState<State>(EMPTY);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(0);
  const [touched, setTouched] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [notice, setNotice] = useState<string | null>(null);
  const set = (patch: Partial<State>) => setS((x) => ({ ...x, ...patch }));

  const load = useCallback(() => {
    setLoadError(false);
    return fetch("/api/udlejning/ledighed", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Data) => setData(d))
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Back from Stripe without paying: release the dates at once and bring the choices back.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const id = q.get("annulleret");
    const t = q.get("t");
    if (!id || !t) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SAVED) ?? "null") as State | null;
      if (saved) {
        setS(saved);
        setStep(3);
        setDone(3);
      }
    } catch {}
    fetch("/api/udlejning/annuller", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, t }) })
      .finally(() => load());
    setNotice("Betalingen blev afbrudt, så intet er trukket. Jeres valg er gemt herunder, og I kan prøve igen.");
    history.replaceState(null, "", `${location.pathname}#book`);
  }, [load]);

  const settings = data?.settings;
  const win = useMemo(() => (data ? bookingWindow(data.settings, data.today, !!s.theme) : null), [data, s.theme]);
  const canBook = useCallback(
    (r: Range) =>
      !!data && !!win && r.from >= win.minDay && r.to <= win.maxDay && nights(r) <= data.settings.rules.maxDays && fits(data.settings, data.usage, r, s.delivery, s.printer),
    [data, win, s.delivery, s.printer],
  );

  // A change of theme, printer or delivery can make the chosen dates impossible: drop them.
  useEffect(() => {
    if (s.range && data && !canBook(s.range)) set({ range: null });
  }, [canBook, s.range, data]);

  const choice = s.range ? { range: s.range, theme: s.theme, printer: s.printer, photoType: s.photoType, delivery: s.delivery } : null;
  const lines = settings && choice ? priceLines(settings, choice) : [];
  const sum = total(lines);

  const emailOk = /^\S+@\S+\.\S+$/.test(s.contact.email);
  const addressOk = s.delivery !== "post" || (!!s.address.street.trim() && /^\d{4}$/.test(s.address.zip.trim()) && !!s.address.city.trim());
  const contactOk = !!s.contact.name.trim() && emailOk && s.contact.phone.replace(/\D/g, "").length >= 8 && !!s.contact.occasion && addressOk;
  const valid = [!!settings && (!s.theme || settings.themes.includes(s.theme)), !!s.range, contactOk, accepted];

  const go = (to: number) => {
    setStep(to);
    setTouched(false);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = () => {
    if (!valid[step]) return setTouched(true);
    if (step < STEPS.length - 1) {
      setDone((d) => Math.max(d, step + 1));
      go(step + 1);
    } else pay();
  };

  async function pay() {
    setStatus({ kind: "sending" });
    try {
      sessionStorage.setItem(SAVED, JSON.stringify(s));
    } catch {}
    try {
      const res = await fetch("/api/udlejning/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, address: s.delivery === "post" ? s.address : null, accepted }),
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string; taken?: boolean };
      if (!res.ok || !body.url) {
        if (body.taken) {
          await load();
          set({ range: null });
          setStep(1);
        }
        throw new Error(body.error ?? "Betalingen kunne ikke startes. Prøv igen om lidt.");
      }
      location.href = body.url;
    } catch (e) {
      setStatus({ kind: "error", message: (e as Error).message });
    }
  }

  const err = (show: boolean, text: string) => (touched && show ? <p className="err" role="alert">{text}</p> : null);

  if (loadError) {
    return (
      <div className="bk-sum" role="alert">
        <b>Kalenderen kunne ikke hentes.</b>
        <p className="muted">Prøv igen om lidt, eller skriv til os, så finder vi en dato sammen.</p>
        <button type="button" className="btn btn-secondary" onClick={load}>Prøv igen</button>
      </div>
    );
  }
  if (!settings || !data || !win) return <p className="muted" aria-live="polite">Henter ledige datoer …</p>;
  if (!settings.open) {
    return (
      <div className="bk-sum">
        <b>Vi tager ikke imod bookinger lige nu.</b>
        <p className="muted">Skriv til os, så finder vi en løsning.</p>
      </div>
    );
  }

  const presets = [
    { id: "dag", name: "Dag", days: 1 },
    { id: "weekend", name: "Weekend", days: 3 },
    { id: "uge", name: "Uge", days: 7 },
  ];
  // A preset from the chosen first day, or the first date it fits. A weekend runs Friday to Sunday.
  const preset = (days: number, weekend: boolean) => {
    const at = (from: DayKey): Range => {
      if (!weekend) return { from, to: addDays(from, days - 1) };
      const [y, m, d] = from.split("-").map(Number);
      const wd = (new Date(y, m - 1, d).getDay() + 6) % 7;
      const fri = addDays(from, 4 - wd + (wd > 4 ? 7 : 0));
      return { from: fri, to: addDays(fri, 2) };
    };
    for (let k = s.range?.from ?? win.minDay; k <= win.maxDay; k = addDays(k, weekend ? 7 : 1)) {
      const r = at(k);
      if (canBook(r)) return set({ range: r });
    }
  };

  return (
    <div className="bk">
      {notice && (
        <p className="bk-notice" role="status">
          {notice}
        </p>
      )}
      <ol className="bk-steps" aria-label="Booking">
        {STEPS.map((label, i) => (
          <li key={label} data-s={i < step ? "done" : undefined} aria-current={i === step ? "step" : undefined}>
            <button type="button" disabled={i > done} onClick={() => go(i)}>
              <span className="n">{i + 1}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="bk-body">
        <div className="bk-main">
          {step === 0 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Hvad skal I have med?</legend>
              <ul className="bk-incl">
                <li><span>Selfi Boks med studielys og stativ</span><span>Med</span></li>
                <li><span>Ubegrænset antal billeder på skærm og telefon</span><span>Med</span></li>
                <li><span>Jeres egen eventside med alle festens billeder</span><span>Med</span></li>
              </ul>

              <div className="bk-list">
                <div className="bk-row">
                  <div>
                    <b>Tema på boksen</b>
                    <span className="muted">Boksen, skærmen og rammen på hvert billede i festens farver.</span>
                  </div>
                  <span className="bk-price">{kr(settings.prices.theme)}</span>
                  <button type="button" className="switch" role="switch" aria-checked={!!s.theme} aria-label="Tema på boksen"
                    onClick={() => set({ theme: s.theme ? null : settings.themes[0] })} />
                </div>
                {s.theme && (
                  <div className="bk-row bk-row--sub">
                    <div className="chips" role="radiogroup" aria-label="Vælg tema">
                      {settings.themes.map((t) => (
                        <button key={t} type="button" role="radio" aria-checked={s.theme === t} onClick={() => set({ theme: t })}>{t}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bk-row">
                  <div>
                    <b>Printer</b>
                    <span className="muted">Gæsterne får billedet printet med hjem. {settings.printsIncluded} print er med, og printeren kommer i sin egen kasse.</span>
                  </div>
                  <span className="bk-price">{kr(settings.prices.printer)}</span>
                  <button type="button" className="switch" role="switch" aria-checked={s.printer} aria-label="Printer"
                    onClick={() => set({ printer: !s.printer })} />
                </div>
              </div>

              <div className="field">
                <span className="field-label" id="bk-type">Billedtype</span>
                <div className="bk-cards bk-cards--2" role="radiogroup" aria-labelledby="bk-type">
                  {(Object.keys(PHOTO_TYPES) as PhotoType[]).map((p) => (
                    <label className="bk-card" key={p}>
                      <input type="radio" name="photoType" checked={s.photoType === p} onChange={() => set({ photoType: p })} />
                      <span className="bk-card-body">
                        <span className={`bk-pic bk-pic--${p}`} aria-hidden="true"><i /><i /><i /></span>
                        <b>{PHOTO_TYPES[p].name}</b>
                        <span className="muted">{PHOTO_TYPES[p].text}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="fine">Billedtypen gælder billederne på telefonen og eventsiden, og printet, hvis I tager printeren med.</p>
              </div>

              <div className="field">
                <span className="field-label" id="bk-del">Levering</span>
                <div className="bk-options" role="radiogroup" aria-labelledby="bk-del">
                  {(Object.keys(DELIVERIES) as Delivery[]).map((d) => (
                    <label className="bk-option" key={d}>
                      <input type="radio" name="delivery" checked={s.delivery === d} onChange={() => set({ delivery: d })} />
                      <span>
                        <b>{DELIVERIES[d].name}</b>
                        <span className="muted">{d === "afhent" ? settings.pickupText : DELIVERIES[d].text}</span>
                      </span>
                      <span className="bk-price">
                        {d === "post" ? kr(settings.prices.shippingPerParcel * (s.printer ? 2 : 1)) : "Gratis"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Hvornår er festen?</legend>
              <p className="muted">
                Tryk på første dag og derefter på sidste dag. Jo flere dage, jo billigere pr. dag: 1 dag {kr(priceForDays(settings, 1))},
                weekend {kr(priceForDays(settings, 3))} og en uge {kr(priceForDays(settings, 7))}
                {s.printer ? " Kalenderen viser de dage, hvor både boks og printer er ledige." : ""}
              </p>
              <div className="hb-pkgs" aria-label="Genveje">
                {presets.map((p) => (
                  <button key={p.id} type="button" aria-pressed={!!s.range && nights(s.range) === p.days} onClick={() => preset(p.days, p.id === "weekend")}>
                    <b>{p.name}</b>
                    <span>{kr(priceForDays(settings, p.days))}</span>
                  </button>
                ))}
              </div>
              <Calendar selected={s.range} canBook={canBook} minDay={win.minDay} maxDay={win.maxDay} onPick={(r) => set({ range: r })} />
              {s.range && (
                <p className="bk-chosen">
                  <span className="label">Jeres valg · {periodLabel(s.range)}</span>
                  <b>{formatRange(s.range)}</b>
                  <span className="muted">
                    {s.delivery === "post"
                      ? `Boksen ligger klar i pakkeshoppen senest ${formatDay(addDays(s.range.from, -1))}, og I sender den retur ${formatDay(addDays(s.range.to, 1))}.`
                      : "Vi aftaler tidspunkt for afhentning og aflevering på mail."}
                  </span>
                </p>
              )}
              {err(!s.range, "Vælg datoer i kalenderen.")}
              <p className="fine">
                Skal I bruge boksen i mere end {settings.rules.maxDays} dage, eller er jeres dato optaget? <a href="/#kontakt">Skriv til os</a>.
              </p>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Hvem booker?</legend>
              <div className="form">
                <div className="field">
                  <label htmlFor="bk-name">Navn</label>
                  <input className="input" id="bk-name" autoComplete="name" value={s.contact.name} onChange={(e) => set({ contact: { ...s.contact, name: e.target.value } })} />
                </div>
                <div className="field">
                  <label htmlFor="bk-phone">Telefon</label>
                  <input className="input" id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" value={s.contact.phone} onChange={(e) => set({ contact: { ...s.contact, phone: e.target.value } })} />
                </div>
                <div className="field full">
                  <label htmlFor="bk-email">E-mail</label>
                  <input className="input" id="bk-email" type="email" autoComplete="email" value={s.contact.email} onChange={(e) => set({ contact: { ...s.contact, email: e.target.value } })} />
                </div>
                {s.delivery === "post" && (
                  <>
                    <div className="field full">
                      <label htmlFor="bk-street">Adresse <small>(vi sender til den nærmeste dao-pakkeshop)</small></label>
                      <input className="input" id="bk-street" autoComplete="street-address" value={s.address.street} onChange={(e) => set({ address: { ...s.address, street: e.target.value } })} />
                    </div>
                    <div className="field">
                      <label htmlFor="bk-zip">Postnr.</label>
                      <input className="input" id="bk-zip" inputMode="numeric" autoComplete="postal-code" maxLength={4} value={s.address.zip} onChange={(e) => set({ address: { ...s.address, zip: e.target.value } })} />
                    </div>
                    <div className="field">
                      <label htmlFor="bk-city">By</label>
                      <input className="input" id="bk-city" autoComplete="address-level2" value={s.address.city} onChange={(e) => set({ address: { ...s.address, city: e.target.value } })} />
                    </div>
                  </>
                )}
                <div className="field full">
                  <span className="field-label" id="bk-occ">Anledning</span>
                  <div className="chips" role="radiogroup" aria-labelledby="bk-occ">
                    {OCCASIONS.map((o) => (
                      <button type="button" key={o} role="radio" aria-checked={s.contact.occasion === o} onClick={() => set({ contact: { ...s.contact, occasion: o } })}>{o}</button>
                    ))}
                  </div>
                </div>
                <div className="field full">
                  <label htmlFor="bk-msg">Besked til os <small>(valgfri)</small></label>
                  <textarea className="input" id="bk-msg" rows={3} placeholder="Fx navne til rammen på billedet eller andet, vi skal vide" value={s.contact.message} onChange={(e) => set({ contact: { ...s.contact, message: e.target.value } })} />
                </div>
              </div>
              {err(!contactOk, s.delivery === "post" && !addressOk ? "Skriv adresse, et postnummer på fire cifre og by." : "Skriv navn, telefon og en gyldig e-mail, og vælg anledning.")}
            </fieldset>
          )}

          {step === 3 && s.range && (
            <fieldset className="bk-fs">
              <legend className="h-m">Ser det rigtigt ud?</legend>
              <dl className="bk-review">
                <div>
                  <dt>Pakke</dt>
                  <dd>
                    {[s.theme ? `Tema: ${s.theme}` : "Uden tema", s.printer ? "med printer" : "uden printer", PHOTO_TYPES[s.photoType].name.toLowerCase()].join(", ")}
                  </dd>
                  <button type="button" onClick={() => go(0)}>Ret</button>
                </div>
                <div>
                  <dt>Datoer</dt>
                  <dd>{formatRange(s.range)} ({periodLabel(s.range)})</dd>
                  <button type="button" onClick={() => go(1)}>Ret</button>
                </div>
                <div>
                  <dt>Levering</dt>
                  <dd>
                    {DELIVERIES[s.delivery].name}
                    {s.delivery === "post" && `, pakkeshop nær ${s.address.street}, ${s.address.zip} ${s.address.city}`}
                  </dd>
                  <button type="button" onClick={() => go(0)}>Ret</button>
                </div>
                <div>
                  <dt>Kontakt</dt>
                  <dd>{s.contact.name}, {s.contact.email}, {s.contact.phone} · {s.contact.occasion}</dd>
                  <button type="button" onClick={() => go(2)}>Ret</button>
                </div>
              </dl>
              <label className="check">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                <span>
                  Jeg har læst <a href="/vilkaar" target="_blank">lejebetingelserne</a> og passer på boksen, mens den er hos os. Bookingen er bindende, når den er betalt.
                </span>
              </label>
              {err(!accepted, "Sæt flueben for at gå videre til betaling.")}
              {status.kind === "error" && <p className="err" role="alert">{status.message}</p>}
              <p className="fine">I betaler sikkert hos Stripe. Datoerne holdes til jer i 30 minutter, mens I betaler.</p>
            </fieldset>
          )}

          <div className="bk-actions">
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={() => go(step - 1)}>Tilbage</button>
            )}
            <button type="button" className="btn btn-primary" onClick={next} disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Åbner betaling …" : ["Vælg datoer", "Fortsæt til kontakt", "Gennemse booking", `Betal ${s.range ? kr(sum) : ""}`][step]}
            </button>
          </div>
        </div>

        <aside className="bk-aside" aria-label="Jeres booking">
          <div className="bk-sum">
            <span className="label">Jeres booking</span>
            <div className="bk-sum-what">
              <span className="bk-thumb" aria-hidden="true" />
              <div>
                <b>Selfi Boks{s.range ? ` · ${periodLabel(s.range)}` : ""}</b>
                <span className="muted">{s.range ? formatRange(s.range) : "Vælg datoer"}</span>
              </div>
            </div>
            <div className="bk-sum-lines">
              {(lines.length ? lines : preview(settings, s)).map((l) => (
                <div key={l.id}>
                  <span>{l.label}</span>
                  <span>{l.amount === null ? "–" : kr(l.amount)}</span>
                </div>
              ))}
            </div>
            <div className="bk-sum-total">
              <span>I alt inkl. moms</span>
              <b>{s.range ? kr(sum) : "Vælg datoer"}</b>
            </div>
          </div>
        </aside>
      </div>

      <div className="bk-bar">
        <div>
          <b>{s.range ? formatRange(s.range, "short") : "Vælg datoer"}</b>
          <span className="muted">{s.range ? kr(sum) : `Fra ${kr(priceForDays(settings, 1))}`}</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={next} disabled={status.kind === "sending"}>
          {step === STEPS.length - 1 ? "Betal" : "Fortsæt"}
        </button>
      </div>
    </div>
  );
}

/** The summary before dates are picked: the add-ons chosen so far, with the box price still open. */
function preview(settings: RentalSettings, s: State): { id: string; label: string; amount: number | null }[] {
  const out: { id: string; label: string; amount: number | null }[] = [{ id: "box", label: "Selfi Boks", amount: null }];
  if (s.theme) out.push({ id: "theme", label: `Tema: ${s.theme}`, amount: settings.prices.theme });
  if (s.printer) out.push({ id: "printer", label: `Printer med ${settings.printsIncluded} print`, amount: settings.prices.printer });
  if (s.delivery === "post") out.push({ id: "shipping", label: "Fragt tur-retur", amount: settings.prices.shippingPerParcel * (s.printer ? 2 : 1) });
  return out;
}
