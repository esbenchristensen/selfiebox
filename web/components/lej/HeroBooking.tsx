"use client";

import { addDays, formatRange, nights, weekday, type DayKey, type Range } from "@/lib/dates";
import { boxPrice, boxQuote, fromPrice, kr } from "@/lib/udlejning/core";
import { isPeriod, PRESETS } from "./Booking";
import { Icon } from "./Drawings";
import { Calendar } from "./Calendar";
import { useRental } from "./RentalContext";

// The first step of the booking, right under the hero: is our day free, and what does it cost? "Vælg tilvalg"
// hands the dates to the booking flow under #book, which opens at the add-ons.
export function HeroBooking() {
  const { data, loadError, load, s, set, win, canBook, preset, go, reach, priceFor, loading } = useRental();
  const settings = data?.settings;

  if (loadError) {
    return (
      <div className="hb">
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
      <div className="hb hb--loading" aria-busy="true">
        <b>Hvornår er festen?</b>
        <p className="muted">Henter kalenderen …</p>
      </div>
    );
  }

  const r = s.range;
  const days = r ? nights(r) : 0;
  const quote = r ? boxQuote(settings, r) : null;
  const price = quote?.amount ?? 0;
  const perDay = r ? Math.round(price / days) : 0;
  const nextDay = r && days < settings.rules.maxDays ? boxPrice(settings, { from: r.from, to: addDays(r.to, 1) }) - price : 0;
  const hint = loading
    ? "Henter ledige datoer …"
    : !r
    ? "Tryk på første dag og derefter på sidste dag."
    : r.from === r.to
      ? "Tryk på en senere dag for at tage flere dage med."
      : "Tryk på en ny dag for at starte forfra.";
  const nextWeekend = firstFreeWeekend(win.minDay, win.maxDay, canBook);

  return (
    <div className="hb" aria-busy={loading}>
      <div className="hb-head">
        <div className="hb-title">
          <b>Hvornår er festen?</b>
        </div>
        <div className="hb-pkgs" aria-label="Genveje">
          {PRESETS.map((p) => (
            <button key={p.period} type="button" aria-pressed={isPeriod(settings, r, p.period)} onClick={() => preset(p.period)}>
              <b>{p.name}</b>
              <span>{kr(settings.prices.periods[p.period])}</span>
            </button>
          ))}
        </div>
        <p className="muted hb-hint" aria-live="polite">{hint}</p>
        {nextWeekend && !r && (
          <button type="button" className="hb-next" onClick={() => set({ range: nextWeekend })}>
            <i aria-hidden="true" />
            Næste ledige weekend: {formatRange(nextWeekend, "short")}
          </button>
        )}
      </div>
      <Calendar single selected={r} canBook={canBook} minDay={win.minDay} maxDay={win.maxDay} onPick={(x) => set({ range: x })} priceFor={priceFor} loading={loading} />
      <div className="hb-foot">
        <div aria-live="polite">
          {r ? (
            <>
              <b>
                {quote?.label} · {kr(price)}
              </b>
              <span className="muted">{formatRange(r, "short")}</span>
              <span className="muted">{days > 1 ? `${kr(perDay)} pr. dag` : nextDay ? `En dag mere koster ${kr(nextDay)}` : ""}</span>
            </>
          ) : (
            <>
              <b>Fra {kr(fromPrice(settings))}</b>
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
          {r ? "Fortsæt til booking" : "Vælg datoer først"}
        </button>
      </div>
      <p className="hb-pay">
        <Icon name="lock" />
        <span>Betal med kort, MobilePay eller Apple Pay, først i kassen. Flyt datoen gratis, indtil boksen er sendt.</span>
      </p>
    </div>
  );
}

/** The first Friday-to-Sunday run from `minDay` that the calendar can book, or null within the window. */
function firstFreeWeekend(minDay: DayKey, maxDay: DayKey, canBook: (r: Range) => boolean): Range | null {
  const wd = weekday(minDay);
  let fri = addDays(minDay, (4 - wd + 7) % 7);
  for (; fri <= maxDay; fri = addDays(fri, 7)) {
    const r = { from: fri, to: addDays(fri, 2) };
    if (r.to <= maxDay && canBook(r)) return r;
  }
  return null;
}
