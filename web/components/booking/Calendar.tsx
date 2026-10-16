"use client";

import { useMemo, useState } from "react";
import { addDays, fromKey, monthGrid, MONTHS, type DayKey, type Range, WEEKDAYS_SHORT } from "@/lib/dates";

type Props = {
  selected: Range | null;
  rangeFor: (day: DayKey) => Range; // the period a click on this day would book
  isBlocked: (day: DayKey) => boolean; // booked by someone else
  minDay: DayKey;
  maxDay: DayKey;
  onPick: (range: Range) => void;
  single?: boolean; // one month at a time, for narrow places like the hero
};

export function Calendar({ selected, rangeFor, isBlocked, minDay, maxDay, onPick, single }: Props) {
  const start = fromKey(selected?.from ?? minDay);
  const [cursor, setCursor] = useState({ y: start.getFullYear(), m: start.getMonth() });
  const [hover, setHover] = useState<Range | null>(null);

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

  const rangeOk = (r: Range) => {
    if (r.from < minDay || r.to > maxDay) return false;
    for (let k = r.from; k <= r.to; k = addDays(k, 1)) if (isBlocked(k)) return false;
    return true;
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
                  const booked = !past && isBlocked(k);
                  const r = rangeFor(k);
                  const ok = !past && !booked && rangeOk(r);
                  const on = inShown(k);
                  const cls = [
                    "cal-day",
                    past && "is-past",
                    booked && "is-booked",
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
                      aria-label={`${fromKey(k).getDate()}. ${MONTHS[m]}${booked ? ", optaget" : ""}`}
                      onPointerEnter={(e) => ok && e.pointerType === "mouse" && setHover(r)}
                      onClick={() => {
                        setHover(null);
                        onPick(r);
                      }}
                    >
                      <span>{fromKey(k).getDate()}</span>
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
