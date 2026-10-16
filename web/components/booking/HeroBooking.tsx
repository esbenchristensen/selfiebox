"use client";

import { useState } from "react";
import { packages, type PackageId } from "@/content";
import { rangeForPackage, startBooking, useBookedDays, useBookingWindow } from "@/lib/booking";
import { formatRange, type Range } from "@/lib/dates";
import { Calendar } from "./Calendar";

const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;

// The first two booking steps (package and dates) above the fold. "Fortsæt" hands the
// choice to the full booking flow under #book, which opens at the add-ons.
export function HeroBooking() {
  const [pkg, setPkg] = useState<PackageId>("weekend");
  const [range, setRange] = useState<Range | null>(null);
  const booked = useBookedDays();
  const { minDay, maxDay } = useBookingWindow();
  const P = packages.find((p) => p.id === pkg)!;

  const hint =
    pkg === "weekend" ? "Tryk på en dag, så får I hele weekenden fra fredag til søndag." : pkg === "uge" ? "Tryk på den første dag. Ugen løber syv dage frem." : "Tryk på dagen for festen.";

  return (
    <div className="hb" id="datoer">
      <div className="hb-head">
        <span className="label">Se ledige datoer</span>
        <div className="hb-pkgs" role="radiogroup" aria-label="Pakke">
          {packages.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={pkg === p.id}
              onClick={() => {
                setPkg(p.id);
                setRange(null);
              }}
            >
              <b>{p.name}</b>
              <span>{p.price ? kr(p.price) : "Pris bekræftes"}</span>
            </button>
          ))}
        </div>
        <p className="muted hb-hint">{hint}</p>
      </div>
      <Calendar
        single
        selected={range}
        rangeFor={(day) => rangeForPackage(pkg, day)}
        isBlocked={(k) => booked.has(k)}
        minDay={minDay}
        maxDay={maxDay}
        onPick={setRange}
      />
      <div className="hb-foot">
        <div aria-live="polite">
          {range ? (
            <>
              <b>{formatRange(range, "short")}</b>
              <span className="muted">
                {P.name} · {P.price ? kr(P.price) : "Pris bekræftes"} inkl. moms
              </span>
            </>
          ) : (
            <span className="muted">Boks, stander, ubegrænsede billeder og eventside er med.</span>
          )}
        </div>
        <button type="button" className="btn btn-primary" disabled={!range} onClick={() => range && startBooking({ pkg, range })}>
          Fortsæt
        </button>
      </div>
    </div>
  );
}
