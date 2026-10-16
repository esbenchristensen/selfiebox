"use client";

import { useState } from "react";
import { presets } from "@/content";
import { kr, periodLabel, presetRange, quote, startBooking, useBookedDays, useBookingWindow } from "@/lib/booking";
import { formatRange, nights, type Range } from "@/lib/dates";
import { Calendar } from "./Calendar";

// The date step above the fold. Any run of days can be picked and the price follows the length;
// the presets are shortcuts. "Fortsæt" hands the choice to the full booking flow under #book,
// which opens at the add-ons.
export function HeroBooking() {
  const [range, setRange] = useState<Range | null>(null);
  const booked = useBookedDays();
  const { minDay, maxDay } = useBookingWindow();
  const isBlocked = (k: string) => booked.has(k);
  const q = range ? quote(range) : null;

  const hint = !range
    ? "Tryk på første dag og derefter på sidste dag. Prisen følger antal dage."
    : range.from === range.to
      ? "Tryk på en senere dag for at tage flere dage med, eller fortsæt med én dag."
      : "Tryk på en ny dag for at starte forfra.";

  return (
    <div className="hb" id="datoer">
      <div className="hb-head">
        <span className="label">Se ledige datoer</span>
        <div className="hb-pkgs" aria-label="Genveje">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={!!range && nights(range) === p.days}
              onClick={() => {
                const r = presetRange(p.days, p.id === "weekend", range?.from ?? null, isBlocked, minDay, maxDay);
                if (r) setRange(r);
              }}
            >
              <b>{p.name}</b>
              <span>{kr(p.price)}</span>
            </button>
          ))}
        </div>
        <p className="muted hb-hint">{hint}</p>
      </div>
      <Calendar single selected={range} isBlocked={isBlocked} minDay={minDay} maxDay={maxDay} onPick={setRange} />
      <div className="hb-foot">
        <div aria-live="polite">
          {range && q ? (
            <>
              <b>
                {periodLabel(range)} · {kr(q.price)}
              </b>
              <span className="muted">{formatRange(range, "short")}</span>
              <span className="muted">
                {q.days > 1 ? `${kr(q.perDay)} pr. dag · spar ${kr(q.saved)}` : q.nextDay ? `En dag mere koster kun ${kr(q.nextDay)}` : ""}
              </span>
            </>
          ) : (
            <span className="muted">Boks, stander, ubegrænsede billeder og eventside er med.</span>
          )}
        </div>
        <button type="button" className="btn btn-primary" disabled={!range} onClick={() => range && startBooking({ range })}>
          Fortsæt
        </button>
      </div>
    </div>
  );
}
