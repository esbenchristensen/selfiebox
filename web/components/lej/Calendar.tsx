"use client";

import { useEffect, useMemo, useState } from "react";
import { fromKey, monthGrid, MONTHS, type DayKey, type Range, WEEKDAYS_SHORT } from "@/lib/dates";
import { seasonOf, seasonsIn } from "@/lib/udlejning/seasons";

type Props = {
  selected: Range | null;
  canBook: (range: Range) => boolean; // inside the window and a box (and printer) free for every day
  minDay: DayKey;
  maxDay: DayKey;
  onPick: (range: Range) => void;
  single?: boolean; // one month at a time, for narrow places like the hero
  /** The total for a range with the add-ons chosen so far, shown in every cell: for one day, or from the picked first day to this one. */
  priceFor?: (range: Range) => number | null;
  /** The free days are still being fetched: the dates show, every day waits with a bar where its price will be. */
  loading?: boolean;
  /** A chosen period: a tap picks the whole period at that day instead of a free range; null where it can't start. */
  snap?: ((day: DayKey) => Range | null) | null;
};

// Free date picking: the first tap picks a day, a tap on a later day stretches it into a range.
// Any tap after a finished range starts over.
// With `snap`, every tap picks the chosen period at that day instead.
export function Calendar({ selected, canBook, minDay, maxDay, onPick, single, priceFor, loading, snap }: Props) {
  const start = fromKey(selected?.from ?? minDay);
  const [cursor, setCursor] = useState({ y: start.getFullYear(), m: start.getMonth() });
  const [hover, setHover] = useState<Range | null>(null);

  // Follow a selection made outside the calendar (a preset) to its month.
  useEffect(() => {
    if (!selected) return;
    const d = fromKey(selected.from);
    setCursor((c) => {
      const diff = (d.getFullYear() - c.y) * 12 + d.getMonth() - c.m;
      return diff < 0 || diff > (single ? 0 : 1) ? { y: d.getFullYear(), m: d.getMonth() } : c;
    });
  }, [selected, single]);

  const months = useMemo(() => {
    const next = cursor.m === 11 ? { y: cursor.y + 1, m: 0 } : { y: cursor.y, m: cursor.m + 1 };
    return single ? [cursor] : [cursor, next];
  }, [cursor, single]);

  const minDate = fromKey(minDay);
  const maxDate = fromKey(maxDay);
  const canPrev = cursor.y > minDate.getFullYear() || (cursor.y === minDate.getFullYear() && cursor.m > minDate.getMonth());
  const canNext = cursor.y < maxDate.getFullYear() || (cursor.y === maxDate.getFullYear() && cursor.m < maxDate.getMonth() - (single ? 0 : 1));

  const step = (d: number) =>
    setCursor((c) => {
      const m = c.m + d;
      return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });

  // The range a tap on this day gives: the chosen period, or stretch a single picked day forward, otherwise start over.
  const rangeFor = (k: DayKey): Range | null => {
    if (snap) return snap(k);
    if (selected && selected.from === selected.to && k > selected.from) {
      const r = { from: selected.from, to: k };
      if (canBook(r)) return r;
    }
    return { from: k, to: k };
  };

  const shown = hover ?? selected;
  const inShown = (k: DayKey) => !!shown && k >= shown.from && k <= shown.to;

  return (
    <div className={`cal${single ? " cal--single" : ""}`} onMouseLeave={() => setHover(null)}>
      <div className="cal-nav">
        <button type="button" className="cal-arrow" onClick={() => step(-1)} disabled={!canPrev} aria-label="Forrige måned">
          ‹
        </button>
        <button type="button" className="cal-arrow" onClick={() => step(1)} disabled={!canNext} aria-label="Næste måned">
          ›
        </button>
      </div>
      <div className="cal-months">
        {months.map(({ y, m }, mi) => (
          <div className={`cal-month${mi === 1 ? " cal-month--second" : ""}`} key={`${y}-${m}`}>
            <h4 className="cal-title">
              {MONTHS[m]} {y}
            </h4>
            {seasonsIn(y, m).length > 0 && (
              <p className="cal-season">
                <i aria-hidden="true" />
                {seasonsIn(y, m).map((x, i) => (i ? x.name.toLowerCase() : x.name)).join(" og ")}: {seasonsIn(y, m)[0].hint}
              </p>
            )}
            <div className="cal-grid" role="grid" aria-label={`${MONTHS[m]} ${y}`}>
              {WEEKDAYS_SHORT.map((w) => (
                <span className="cal-dow" key={w} role="columnheader">
                  {w}
                </span>
              ))}
              {monthGrid(y, m)
                .flat()
                .map((k, i) => {
                  if (!k) return <span key={`e${i}`} />;
                  const past = k < minDay || k > maxDay;
                  const pending = !!loading && !past;
                  const booked = !past && !pending && !canBook({ from: k, to: k });
                  const r = rangeFor(k);
                  // Free, but the chosen period can't be had from this day (a weekend tapped on a Tuesday is fine, a
                  // weekday on a Saturday is not, nor a period that runs into a booked day).
                  const off = !past && !booked && !pending && (!r || !canBook(r));
                  const ok = !past && !booked && !pending && !off;
                  const busy = ok && seasonOf(k);
                  const price = ok && r && priceFor ? priceFor(r) : null;
                  const on = inShown(k);
                  const cls = [
                    "cal-day",
                    past && "is-past",
                    booked && "is-booked",
                    off && "is-off",
                    pending && "is-loading",
                    busy && "is-busy",
                    on && "is-in",
                    on && k === shown!.from && "is-start",
                    on && k === shown!.to && "is-end",
                    hover && on && "is-preview",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <button
                      type="button"
                      key={k}
                      className={cls}
                      disabled={!ok}
                      aria-pressed={!!selected && k >= selected.from && k <= selected.to}
                      aria-label={`${fromKey(k).getDate()}. ${MONTHS[m]}${booked ? ", optaget" : busy ? `, travl periode: ${busy.name.toLowerCase()}` : ""}${price != null ? `, ${price.toLocaleString("da-DK")} kr.` : ""}${pending ? ", henter ledighed" : ""}`}
                      onPointerEnter={(e) => ok && r && e.pointerType === "mouse" && setHover(r)}
                      onClick={() => {
                        setHover(null);
                        if (r) onPick(r);
                      }}
                    >
                      <span>
                        {fromKey(k).getDate()}
                        {price != null && <small>{price.toLocaleString("da-DK")}</small>}
                        {pending && <small className="sk" aria-hidden="true" />}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <div className="cal-legend" aria-hidden="true">
        <span>
          <i className="lg-free" />
          Ledig
        </span>
        <span>
          <i className="lg-busy" />
          Travl periode
        </span>
        <span>
          <i className="lg-booked" />
          Optaget
        </span>
        <span>
          <i className="lg-sel" />
          Jeres valg
        </span>
      </div>
    </div>
  );
}
