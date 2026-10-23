"use client";

import { useEffect, useState } from "react";
import { addDays, formatDay, formatRange, nights, weekday, type DayKey, type Range } from "@/lib/dates";
import {
  ADDONS,
  DELIVERIES,
  kr,
  PHOTO_TYPES,
  boxPrice,
  boxQuote,
  fromPrice,
  priceLines,
  total,
  type Period,
  type PhotoType,
  type RentalSettings,
} from "@/lib/udlejning/core";
import { Calendar } from "./Calendar";
import { OutlinePrinter, OutlineStand } from "../Outline";
import { DrawPolaroid, DrawStrip, Icon } from "./Drawings";
import { SAVED, STEPS, useRental, type State, type Status } from "./RentalContext";

// The booking on selfi.dk: the dates first, because "is our day free?" is the first question everyone has
// (the calendar in the hero is the same step), then the printer and how the print looks, who they are, and Stripe.

const OCCASIONS = ["Bryllup", "Fødselsdag", "Konfirmation", "Firmafest", "Andet"];
export const PRESETS: { period: Period; name: string }[] = [
  { period: "day", name: "1 hverdag" },
  { period: "weekend", name: "Weekend" },
  { period: "twoDays", name: "2 hverdage" },
  { period: "week", name: "1 uge" },
];

/** Is the range exactly one of the periods, with no extra days? Lights up its shortcut. */
export function isPeriod(s: RentalSettings, r: Range | null, period: Period): boolean {
  if (!r) return false;
  const q = boxQuote(s, r);
  return q.period === period && !q.extraDays && (period !== "week" || nights(r) === 7);
}

/** The period a tap on this day picks once a shortcut is chosen: a weekday or two from Monday to Thursday, the
 * weekend the day falls in (or the coming one from a weekday), a week from the day. Null where it can't be had. */
export function periodAt(period: Period, k: DayKey): Range | null {
  const wd = weekday(k);
  if (period === "week") return { from: k, to: addDays(k, 6) };
  if (period === "weekend") {
    const fri = addDays(k, 4 - wd);
    return { from: fri, to: addDays(fri, 2) };
  }
  const len = period === "day" ? 1 : 2;
  return wd + len - 1 <= 3 ? { from: k, to: addDays(k, len - 1) } : null;
}

export function Booking() {
  const { data, loadError, load, s, set, setAll, step, done, go, reach, win, canBook, canBookWith, preset, priceFor, loading } = useRental();
  const [touched, setTouched] = useState(false);
  // The shortcut chosen, if any: the calendar then picks that period at the tapped day. Tapping it again frees the calendar.
  const [mode, setMode] = useState<Period | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [notice, setNotice] = useState<string | null>(null);

  // Back from Stripe without paying: release the dates at once and bring the choices back.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const id = q.get("annulleret");
    const t = q.get("t");
    if (!id || !t) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(SAVED) ?? "null") as State | null;
      if (saved) {
        setAll(saved);
        reach(3);
        go(3, false);
      }
    } catch {}
    fetch("/api/udlejning/annuller", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, t }) })
      .finally(() => load());
    setNotice("Betalingen blev afbrudt, så intet er trukket. Jeres valg er gemt herunder, og I kan prøve igen.");
    history.replaceState(null, "", `${location.pathname}#book`);
    document.getElementById("book")?.scrollIntoView({ block: "start" });
  }, [load, setAll, reach, go]);

  const settings = data?.settings;
  const choice = s.range ? { range: s.range, theme: s.theme, printer: s.printer, photoType: s.photoType, delivery: s.delivery, keep: s.keep } : null;
  const lines = settings && choice ? priceLines(settings, choice) : [];
  const sum = total(lines);

  const emailOk = /^\S+@\S+\.\S+$/.test(s.contact.email);
  const addressOk = (!!s.address.street.trim() && /^\d{4}$/.test(s.address.zip.trim()) && !!s.address.city.trim());
  const contactOk = !!s.contact.name.trim() && emailOk && s.contact.phone.replace(/\D/g, "").length >= 8 && !!s.contact.occasion && addressOk;
  const valid = [!!s.range, !!settings, contactOk, accepted];

  const move = (to: number) => {
    setTouched(false);
    go(to);
  };
  const next = () => {
    if (!valid[step]) return setTouched(true);
    if (step < STEPS.length - 1) {
      reach(step + 1);
      move(step + 1);
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
        body: JSON.stringify({ ...s, accepted }),
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string; taken?: boolean };
      if (!res.ok || !body.url) {
        if (body.taken) {
          await load();
          set({ range: null });
          move(0);
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

  // Add-ons that do not fit the chosen days are shown, but cannot be switched on.
  const printerBlocked = !!s.range && !s.printer && !canBookWith(s.range, !!s.theme, true);

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
            <button type="button" disabled={i > done} onClick={() => move(i)}>
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
              <legend className="h-m">Hvornår er festen?</legend>
              <p className="muted">
                {mode
                  ? `Tryk på en dag, så vælger vi ${{ day: "den hverdag", twoDays: "to hverdage fra den dag", weekend: "weekenden fra fredag til søndag", week: "en uge fra den dag" }[mode]}. Tryk på ${PRESETS.find((p) => p.period === mode)!.name.toLowerCase()} igen for at vælge frit.`
                  : "Vælg en periode, eller tryk på første dag og derefter på sidste dag."}{" "}
                Prisen under hver dag er den samlede pris{s.printer ? " med printer" : ""}.
                {s.printer ? " Kalenderen viser kun de dage, hvor både boks og printer er ledige." : ""}
              </p>
              <div className="hb-pkgs" aria-label="Genveje">
                {PRESETS.map((p) => (
                  <button
                    key={p.period}
                    type="button"
                    aria-pressed={mode ? mode === p.period : isPeriod(settings, s.range, p.period)}
                    onClick={() => {
                      if (mode === p.period) return setMode(null);
                      setMode(p.period);
                      preset(p.period);
                    }}
                  >
                    <b>{p.name}</b>
                    <span>{kr(settings.prices.periods[p.period])}</span>
                  </button>
                ))}
              </div>
              <Calendar
                selected={s.range}
                canBook={canBook}
                minDay={win.minDay}
                maxDay={win.maxDay}
                onPick={(r) => set({ range: r })}
                priceFor={priceFor}
                loading={loading}
                snap={mode ? (k: DayKey) => periodAt(mode, k) : null}
              />
              {s.range && (
                <p className="bk-chosen">
                  <span className="label">Jeres valg · {boxQuote(settings, s.range).label}</span>
                  <b>{formatRange(s.range)}</b>
                  <span className="muted">
                    {`Boksen ligger klar i pakkeshoppen senest ${formatDay(addDays(s.range.from, -1))}, og I sender den retur ${formatDay(addDays(s.range.to, 1))}.`}
                  </span>
                </p>
              )}
              {err(!s.range, "Vælg datoer i kalenderen.")}
              <p className="fine">
                Skal I bruge boksen i mere end {settings.rules.maxDays} dage, eller er jeres dato optaget? <a href="#kontakt">Skriv til os</a>.
              </p>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Med eller uden printer?</legend>
              <p className="muted">Alt andet er med i prisen. Printeren og tilvalget kan I ændre helt frem til betalingen.</p>
              <div className="bk-pick" role="radiogroup" aria-label="Pakke">
                <label className="bk-pick-card">
                  <input type="radio" name="pakke" checked={!s.printer} onChange={() => set({ printer: false })} />
                  <span className="bk-pick-body">
                    <span className="bk-pick-art" aria-hidden="true"><OutlineStand /></span>
                    <span className="bk-pick-text">
                      <b>Boksen</b>
                      <span className="muted">Ubegrænsede billeder på telefonen og jeres eventside.</span>
                    </span>
                    <strong>{s.range ? kr(boxPrice(settings, s.range)) : ""}</strong>
                  </span>
                </label>
                <label className={`bk-pick-card${printerBlocked ? " is-off" : ""}`}>
                  <input type="radio" name="pakke" checked={s.printer} disabled={printerBlocked} onChange={() => set({ printer: true })} />
                  <span className="bk-pick-body">
                    <span className="bk-pick-art" aria-hidden="true"><OutlinePrinter poster /></span>
                    <span className="bk-pick-text">
                      <b>Boksen og printer</b>
                      <span className="muted">
                        {printerBlocked
                          ? "Printeren er udlejet de dage. Vælg andre datoer, hvis I vil have den med."
                          : `Som boksen, og ${settings.printsIncluded} print, så gæsterne har billedet med hjem.`}
                      </span>
                    </span>
                    <strong>+ {kr(settings.prices.printer)}</strong>
                  </span>
                </label>
              </div>
              {s.printer && (
                <div className="field">
                  <span className="field-label" id="bk-type">Hvordan skal printet se ud?</span>
                  <div className="bk-pick bk-pick--small" role="radiogroup" aria-labelledby="bk-type">
                    {(Object.keys(PHOTO_TYPES) as PhotoType[]).map((p) => (
                      <label className="bk-pick-card" key={p}>
                        <input type="radio" name="photoType" checked={s.photoType === p} onChange={() => set({ photoType: p })} />
                        <span className="bk-pick-body">
                          <span className="bk-pick-art" aria-hidden="true">{p === "strip" ? <DrawStrip /> : <DrawPolaroid />}</span>
                          <span className="bk-pick-text">
                            <b>{PHOTO_TYPES[p].name}</b>
                            <span className="muted">{PHOTO_TYPES[p].text}</span>
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="field">
                <span className="field-label">Tilvalg</span>
                <label className="check">
                  <input type="checkbox" checked={s.keep} onChange={(e) => set({ keep: e.target.checked })} />
                  <span>
                    <b>{ADDONS.keep().name}</b> + {kr(settings.prices.keep)}
                    <br />
                    <span className="muted">{ADDONS.keep().text}</span>
                  </span>
                </label>
              </div>
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
              {err(!contactOk, !addressOk ? "Skriv adresse, et postnummer på fire cifre og by." : "Skriv navn, telefon og en gyldig e-mail, og vælg anledning.")}
            </fieldset>
          )}

          {step === 3 && s.range && (
            <fieldset className="bk-fs">
              <legend className="h-m">Ser det rigtigt ud?</legend>
              <dl className="bk-review">
                <div>
                  <dt>Pakke</dt>
                  <dd>
                    {s.printer ? `Selfi Boks med printer, print som ${PHOTO_TYPES[s.photoType].name.toLowerCase()}` : "Selfi Boks uden printer"}
                  </dd>
                  <button type="button" onClick={() => move(1)}>Ret</button>
                </div>
                <div>
                  <dt>Datoer</dt>
                  <dd>{formatRange(s.range)} ({boxQuote(settings, s.range).label})</dd>
                  <button type="button" onClick={() => move(0)}>Ret</button>
                </div>
                <div>
                  <dt>Levering</dt>
                  <dd>
                    {DELIVERIES[s.delivery].name}
                    {`, pakkeshop nær ${s.address.street}, ${s.address.zip} ${s.address.city}`}
                  </dd>
                  <button type="button" onClick={() => move(1)}>Ret</button>
                </div>
                <div>
                  <dt>Kontakt</dt>
                  <dd>{s.contact.name}, {s.contact.email}, {s.contact.phone} · {s.contact.occasion}</dd>
                  <button type="button" onClick={() => move(2)}>Ret</button>
                </div>
              </dl>
              <label className="check">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                <span>
                  Jeg har læst <a href="/lejebetingelser" target="_blank">lejebetingelserne</a> og passer på boksen, mens den er hos os. Jeg ved, at bookingen er bindende, når den er betalt: der er ingen fortrydelsesret, og den kan ikke afbestilles.
                </span>
              </label>
              {err(!accepted, "Sæt flueben for at gå videre til betaling.")}
              {status.kind === "error" && <p className="err" role="alert">{status.message}</p>}
              <p className="fine">I betaler sikkert hos Stripe med kort, MobilePay eller Apple Pay. Datoerne holdes til jer i 30 minutter, mens I betaler.</p>
            </fieldset>
          )}

          <div className="bk-actions">
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={() => move(step - 1)}>Tilbage</button>
            )}
            <button type="button" className="btn btn-primary" onClick={next} disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Åbner betaling …" : ["Fortsæt", "Fortsæt til kontakt", "Gennemse booking", `Betal ${s.range ? kr(sum) : ""}`][step]}
            </button>
          </div>
        </div>

        <aside className="bk-aside" aria-label="Jeres booking">
          <div className="bk-sum">
            <span className="label">Jeres booking</span>
            <div className="bk-sum-what">
              <span className="bk-thumb" aria-hidden="true" />
              <div>
                <b>Selfi Boks{s.range ? ` · ${boxQuote(settings, s.range).label}` : ""}</b>
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
            <ul className="bk-sum-incl" aria-label="Med i prisen">
              <li><Icon name="check" />Ubegrænsede billeder</li>
              <li><Icon name="check" />Jeres egen eventside</li>
              <li><Icon name="check" />Jeres navne og datoen på billedet</li>
              <li><Icon name="check" />Fragt begge veje til pakkeshop</li>
              <li><Icon name="check" />Forsikring, uden depositum</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="bk-bar">
        <div>
          <b>{s.range ? formatRange(s.range, "short") : "Vælg datoer"}</b>
          <span className="muted">{s.range ? kr(sum) : `Fra ${kr(fromPrice(settings))}`}</span>
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
  if (s.printer) out.push({ id: "printer", label: `Printer med ${settings.printsIncluded} print`, amount: settings.prices.printer });
  if (s.keep) out.push({ id: "keep", label: ADDONS.keep().name, amount: settings.prices.keep });
  return out;
}
