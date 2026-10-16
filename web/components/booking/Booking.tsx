"use client";

import { useEffect, useState } from "react";
import { addons, deliveries, occasions, packages, partyThemes, type DeliveryId, type PackageId } from "@/content";
import { rangeForPackage, START_BOOKING, useBookedDays, useBookingWindow, type StartBooking } from "@/lib/booking";
import { formatRange, type DayKey, type Range } from "@/lib/dates";
import { Calendar } from "./Calendar";

const STEPS = ["Pakke", "Datoer", "Tilvalg", "Levering", "Kontakt", "Bekræft"] as const;
const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;
const price = (n: number | null) => (n === null ? "Pris bekræftes" : n === 0 ? "Gratis" : kr(n));

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; ref: string } | { kind: "error"; message: string };

export function Booking() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(0); // highest step reached
  const [pkg, setPkg] = useState<PackageId>("weekend");
  const [range, setRange] = useState<Range | null>(null);
  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [themeText, setThemeText] = useState("");
  const [delivery, setDelivery] = useState<DeliveryId>("afhent");
  const [address, setAddress] = useState({ street: "", zip: "", city: "" });
  const [contact, setContact] = useState({ name: "", email: "", phone: "", occasion: "", message: "" });
  const [accepted, setAccepted] = useState(false);
  const booked = useBookedDays();
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Package and dates picked in the hero calendar: skip straight to the add-ons.
  useEffect(() => {
    const onStart = (e: Event) => {
      const { pkg, range } = (e as CustomEvent<StartBooking>).detail;
      setPkg(pkg);
      setRange(range);
      setStep(2);
      setDone((d) => Math.max(d, 2));
      setTouched(false);
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener(START_BOOKING, onStart);
    return () => window.removeEventListener(START_BOOKING, onStart);
  }, []);

  // Let the package cards elsewhere on the page preselect a package via #book-weekend etc.
  useEffect(() => {
    const pick = () => {
      const m = location.hash.match(/^#book-(dag|weekend|uge)$/);
      if (m) {
        setPkg(m[1] as PackageId);
        setRange(null);
        setStep(1);
        setDone((d) => Math.max(d, 1));
        document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, []);

  const P = packages.find((p) => p.id === pkg)!;
  const D = deliveries.find((d) => d.id === delivery)!;
  const { minDay, maxDay } = useBookingWindow();
  const rangeFor = (day: DayKey): Range => rangeForPackage(pkg, day);

  const lines = [
    { label: `${P.name}`, value: P.price },
    ...addons.filter((a) => extras[a.id]).map((a) => ({ label: a.name, value: a.price })),
    { label: D.name, value: D.price },
  ];
  const total = lines.every((l) => l.value !== null) ? lines.reduce((s, l) => s + (l.value ?? 0), 0) : null;

  const emailOk = /^\S+@\S+\.\S+$/.test(contact.email);
  const addressOk = !D.needsAddress || (address.street.trim() && /^\d{4}$/.test(address.zip.trim()) && address.city.trim());
  const valid = [
    true,
    !!range,
    true,
    !!addressOk,
    !!contact.name.trim() && emailOk && contact.phone.trim().length >= 8 && !!contact.occasion,
    accepted,
  ];

  const go = (to: number) => {
    setStep(to);
    setTouched(false);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = () => {
    if (!valid[step]) {
      setTouched(true);
      return;
    }
    if (step < STEPS.length - 1) {
      setDone((d) => Math.max(d, step + 1));
      go(step + 1);
    } else submit();
  };

  async function submit() {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: pkg,
          range,
          addons: addons.filter((a) => extras[a.id]).map((a) => a.id),
          themeText: extras.tema ? themeText : "",
          delivery,
          address: D.needsAddress ? address : null,
          contact,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { ref?: string; error?: string };
      if (!res.ok || !body.ref) throw new Error(body.error ?? "Bookingen blev ikke sendt. Prøv igen om lidt.");
      setStatus({ kind: "sent", ref: body.ref });
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      setStatus({ kind: "error", message: (e as Error).message });
    }
  }

  const nextLabel = ["Vælg datoer", "Fortsæt til tilvalg", "Fortsæt til levering", "Fortsæt til kontakt", "Gennemse booking", "Send booking"][step];
  const err = (show: boolean, text: string) => touched && show ? <p className="err" role="alert">{text}</p> : null;

  if (status.kind === "sent") {
    return (
      <div className="bk-done" role="status">
        <span className="label">Booking {status.ref}</span>
        <h3 className="h-l">Tak, {contact.name.split(" ")[0]}. Vi har fået jeres booking.</h3>
        <p className="lede">
          Vi holder {formatRange(range!)} til jer og bekræfter datoer og pris på {contact.email}.
        </p>
        <Summary lines={lines} total={total} range={range} pkgName={P.name} deliveryName={D.name} />
      </div>
    );
  }

  return (
    <div className="bk">
      <ol className="bk-steps" aria-label="Booking">
        {STEPS.map((s, i) => (
          <li key={s} data-s={i < step ? "done" : undefined} aria-current={i === step ? "step" : undefined}>
            <button type="button" disabled={i > done} onClick={() => go(i)}>
              <span className="n">{i + 1}</span>
              {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="bk-body">
        <div className="bk-main">
          {step === 0 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Hvor længe skal boksen være hos jer?</legend>
              <div className="bk-cards">
                {packages.map((p) => (
                  <label key={p.id} className="bk-card">
                    <input
                      type="radio"
                      name="pkg"
                      checked={pkg === p.id}
                      onChange={() => {
                        setPkg(p.id);
                        setRange(null);
                      }}
                    />
                    <span className="bk-card-body">
                      <span className="bk-card-top">
                        <b>{p.name}</b>
                        {p.popular && <span className="tag">Anbefalet</span>}
                      </span>
                      <span className="muted">{p.period}</span>
                      <span className="bk-card-price">{price(p.price)}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="fine">
                Alle pakker har boks, stander, ubegrænsede billeder og jeres egen eventside med. Skal I bruge flere bokse eller andre datoer? <a href="#kontakt">Skriv til os</a>.
              </p>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Vælg {pkg === "weekend" ? "weekend" : pkg === "uge" ? "første dag" : "dag"}</legend>
              <p className="muted">
                {pkg === "weekend"
                  ? "Tryk på en dag, så vælger vi hele weekenden fra fredag til søndag."
                  : pkg === "uge"
                    ? "Tryk på den første dag. Ugen løber syv dage frem."
                    : "Tryk på dagen for festen."}
              </p>
              <Calendar selected={range} rangeFor={rangeFor} isBlocked={(k) => booked.has(k)} minDay={minDay} maxDay={maxDay} onPick={setRange} />
              {range && (
                <p className="bk-chosen">
                  <span className="label">Jeres valg</span>
                  <b>{formatRange(range)}</b>
                </p>
              )}
              {err(!range, "Vælg datoer i kalenderen.")}
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Tilvalg</legend>
              <ul className="bk-incl">
                <li>
                  <span>Boks med lysring</span>
                  <span>Med</span>
                </li>
                <li>
                  <span>Gulvstander, så den kan stå hvor som helst</span>
                  <span>Med</span>
                </li>
                <li>
                  <span>Jeres egen eventside med alle aftenens fotos</span>
                  <span>Med</span>
                </li>
                <li>
                  <span>Ubegrænset antal billeder</span>
                  <span>Med</span>
                </li>
              </ul>
              <div className="bk-list">
                {addons.map((a) => (
                  <div className="bk-row" key={a.id}>
                    <div>
                      <b>{a.name}</b>
                      <span className="muted">{a.text}</span>
                    </div>
                    <span className="bk-price">{price(a.price)}</span>
                    <button
                      type="button"
                      className="switch"
                      role="switch"
                      aria-checked={!!extras[a.id]}
                      aria-label={a.name}
                      onClick={() => setExtras((x) => ({ ...x, [a.id]: !x[a.id] }))}
                    />
                  </div>
                ))}
              </div>
              {extras.tema && (
                <div className="field">
                  <span className="field-label">Vælg tema</span>
                  <div className="seg" role="group" aria-label="Vælg tema">
                    {partyThemes.map((t) => (
                      <button key={t} type="button" aria-pressed={themeText === t} onClick={() => setThemeText(t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Hvordan får I boksen?</legend>
              <div className="bk-options">
                {deliveries.map((d) => (
                  <label className="bk-option" key={d.id}>
                    <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                    <span>
                      <b>{d.name}</b>
                      <span className="muted">{d.text}</span>
                    </span>
                    <span className="bk-price">{price(d.price)}</span>
                  </label>
                ))}
              </div>
              {D.needsAddress && (
                <div className="form" style={{ marginTop: 8 }}>
                  <div className="field full">
                    <label htmlFor="bk-street">Adresse for festen</label>
                    <input className="input" id="bk-street" autoComplete="street-address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-zip">Postnr.</label>
                    <input className="input" id="bk-zip" inputMode="numeric" autoComplete="postal-code" maxLength={4} value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                  </div>
                  <div className="field">
                    <label htmlFor="bk-city">By</label>
                    <input className="input" id="bk-city" autoComplete="address-level2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </div>
                </div>
              )}
              {err(!addressOk, "Skriv adresse, et postnummer på fire cifre og by.")}
            </fieldset>
          )}

          {step === 4 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Hvem booker?</legend>
              <div className="form">
                <div className="field">
                  <label htmlFor="bk-name">Navn</label>
                  <input className="input" id="bk-name" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                </div>
                <div className="field">
                  <label htmlFor="bk-phone">Telefon</label>
                  <input className="input" id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                </div>
                <div className="field full">
                  <label htmlFor="bk-email">E-mail</label>
                  <input className="input" id="bk-email" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                </div>
                <div className="field full">
                  <span className="field-label" id="bk-occ">Anledning</span>
                  <div className="chips" role="radiogroup" aria-labelledby="bk-occ">
                    {occasions.map((o) => (
                      <button type="button" key={o} role="radio" aria-checked={contact.occasion === o} onClick={() => setContact({ ...contact, occasion: o })}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field full">
                  <label htmlFor="bk-msg">
                    Besked til os <small>(valgfri)</small>
                  </label>
                  <textarea className="input" id="bk-msg" rows={3} placeholder="Fx antal gæster, adgangsforhold, tidspunkt" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />
                </div>
              </div>
              {err(!valid[4], "Skriv navn, telefon og en gyldig e-mail, og vælg anledning.")}
            </fieldset>
          )}

          {step === 5 && (
            <fieldset className="bk-fs">
              <legend className="h-m">Ser det rigtigt ud?</legend>
              <dl className="bk-review">
                <div>
                  <dt>Pakke</dt>
                  <dd>{P.name}</dd>
                  <button type="button" onClick={() => go(0)}>Ret</button>
                </div>
                <div>
                  <dt>Datoer</dt>
                  <dd>{range && formatRange(range)}</dd>
                  <button type="button" onClick={() => go(1)}>Ret</button>
                </div>
                <div>
                  <dt>Tilvalg</dt>
                  <dd>{addons.filter((a) => extras[a.id]).map((a) => a.name).join(", ") || "Ingen"}{extras.tema && themeText ? ` (${themeText})` : ""}</dd>
                  <button type="button" onClick={() => go(2)}>Ret</button>
                </div>
                <div>
                  <dt>Levering</dt>
                  <dd>
                    {D.name}
                    {D.needsAddress && `, ${address.street}, ${address.zip} ${address.city}`}
                  </dd>
                  <button type="button" onClick={() => go(3)}>Ret</button>
                </div>
                <div>
                  <dt>Kontakt</dt>
                  <dd>
                    {contact.name}, {contact.email}, {contact.phone} · {contact.occasion}
                  </dd>
                  <button type="button" onClick={() => go(4)}>Ret</button>
                </div>
              </dl>
              <label className="check">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                <span>Jeg har læst lejebetingelserne og ved, at bookingen først er endelig, når Selfi har bekræftet den.</span>
              </label>
              {err(!accepted, "Sæt flueben for at sende bookingen.")}
              {status.kind === "error" && (
                <p className="err" role="alert">
                  {status.message}
                </p>
              )}
            </fieldset>
          )}

          <div className="bk-actions">
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={() => go(step - 1)}>
                Tilbage
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={next} disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Sender …" : nextLabel}
            </button>
          </div>
        </div>

        <aside className="bk-aside" aria-label="Jeres booking">
          <Summary lines={lines} total={total} range={range} pkgName={P.name} deliveryName={D.name} />
        </aside>
      </div>

      <div className="bk-bar">
        <div>
          <b>{range ? formatRange(range, "short") : P.name}</b>
          <span className="muted">{total === null ? "Pris bekræftes" : kr(total)}</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={next} disabled={status.kind === "sending"}>
          {step === STEPS.length - 1 ? "Send" : "Fortsæt"}
        </button>
      </div>
    </div>
  );
}

function Summary({
  lines,
  total,
  range,
  pkgName,
  deliveryName,
}: {
  lines: { label: string; value: number | null }[];
  total: number | null;
  range: Range | null;
  pkgName: string;
  deliveryName: string;
}) {
  return (
    <div className="bk-sum">
      <span className="label">Jeres booking</span>
      <div className="bk-sum-what">
        <span className="bk-thumb" aria-hidden="true" />
        <div>
          <b>Selfi Boks · {pkgName}</b>
          <span className="muted">{range ? formatRange(range) : "Vælg datoer"}</span>
        </div>
      </div>
      <div className="bk-sum-lines">
        {lines.map((l) => (
          <div key={l.label}>
            <span>{l.label}</span>
            <span>{price(l.value)}</span>
          </div>
        ))}
      </div>
      <div className="bk-sum-total">
        <span>I alt inkl. moms</span>
        <b>{total === null ? "Bekræftes" : kr(total)}</b>
      </div>
      <p className="fine">
        {total === null ? "Vi bekræfter den endelige pris på mail, før noget er bindende." : "Prisen er inkl. moms."} {deliveryName === "Afhent selv" ? "I henter boksen hos os." : ""}
      </p>
    </div>
  );
}
