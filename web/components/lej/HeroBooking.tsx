"use client";

import { formatRange, nights } from "@/lib/dates";
import { kr, periodLabel, priceForDays } from "@/lib/udlejning/core";
import { PRESETS } from "./Booking";
import { Calendar } from "./Calendar";
import { useRental } from "./RentalContext";

// The first step of the booking, above the fold: is our day free, and what does it cost? "Vælg tilvalg"
// hands the dates to the booking flow under #book, which opens at the add-ons.
export function HeroBooking() {
  const { data, loadError, load, s, set, win, canBook, preset, go, reach } = useRental();
  const settings = data?.settings;

  if (loadError) {
    return (
      <div className="hb" id="datoer">
        <b>Kalenderen kunne ikke hentes.</b>
        <p className="muted">Prøv igen om lidt, eller skriv til os, så finder vi en dato sammen.</p>
        <button type="button" className="btn btn-secondary" onClick={load}>
          Prøv igen
        </button>
      </div>
    );
  }

  if (!settings || !win) {
    return (
      <div className="hb hb--loading" id="datoer" aria-busy="true">
        <span className="label">Ledige datoer</span>
        <p className="muted">Henter kalenderen …</p>
      </div>
    );
  }

  const r = s.range;
  const days = r ? nights(r) : 0;
  const price = r ? priceForDays(settings, days) : 0;
  const perDay = r ? Math.round(price / days) : 0;
  const nextDay = r && days < settings.rules.maxDays ? priceForDays(settings, days + 1) - price : 0;
  const hint = !r
    ? "Tryk på første dag og derefter på sidste dag."
    : r.from === r.to
      ? "Tryk på en senere dag for at tage flere dage med."
      : "Tryk på en ny dag for at starte forfra.";

  return (
    <div className="hb" id="datoer">
      <div className="hb-head">
        <div className="hb-title">
          <b>Hvornår er festen?</b>
          <span className="hb-live">
            <i aria-hidden="true" />
            Live ledighed
          </span>
        </div>
        <div className="hb-pkgs" aria-label="Genveje">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" aria-pressed={!!r && days === p.days} onClick={() => preset(p.days, p.id === "weekend")}>
              <b>{p.name}</b>
              <span>{kr(priceForDays(settings, p.days))}</span>
            </button>
          ))}
        </div>
        <p className="muted hb-hint">{hint}</p>
      </div>
      <Calendar single selected={r} canBook={canBook} minDay={win.minDay} maxDay={win.maxDay} onPick={(x) => set({ range: x })} />
      <div className="hb-foot">
        <div aria-live="polite">
          {r ? (
            <>
              <b>
                {periodLabel(r)} · {kr(price)}
              </b>
              <span className="muted">{formatRange(r, "short")}</span>
              <span className="muted">{days > 1 ? `${kr(perDay)} pr. dag` : nextDay ? `En dag mere koster ${kr(nextDay)}` : ""}</span>
            </>
          ) : (
            <>
              <b>Fra {kr(priceForDays(settings, 1))}</b>
              <span className="muted">Fragt begge veje og forsikring er med.</span>
            </>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!r}
          onClick={() => {
            reach(1);
            go(1);
          }}
        >
          Vælg tilvalg
        </button>
      </div>
    </div>
  );
}
