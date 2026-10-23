"use client";

import { useState } from "react";
import { pricing, printer } from "@/lib/erhverv/placeholder";

const n = (v: number) => Math.round(v).toLocaleString("da-DK");

// What the printer earns in a month from the owner's own numbers: sales less the printer, the paper and the box.
// All in kr. ekskl. moms, like the subscriptions, so the guest's 50 kr. counts as 40.
export function PrinterCalc() {
  const [nights, setNights] = useState(8);
  const [perNight, setPerNight] = useState(20);
  const [price, setPrice] = useState(printer.pricePerPrint);

  const prints = nights * perNight;
  const net = price / (1 + printer.vat);
  const sales = prints * net;
  const paper = prints * printer.paperPerPrint;
  const left = sales - printer.fromPerMonth - paper - pricing.fromPerMonth;
  const margin = net - printer.paperPerPrint;
  const evenPrinter = Math.ceil(printer.fromPerMonth / margin);
  const evenBoth = Math.ceil((printer.fromPerMonth + pricing.fromPerMonth) / margin);

  return (
    <div className="calc pr-calc">
      <div className="ctl">
        <div className="ctl-row">
          <label htmlFor="pr-nights">Åbne aftener eller dage pr. måned</label>
          <output htmlFor="pr-nights">{nights}</output>
        </div>
        <input id="pr-nights" type="range" min={1} max={30} step={1} value={nights} onChange={(e) => setNights(+e.target.value)} />
      </div>
      <div className="ctl">
        <div className="ctl-row">
          <label htmlFor="pr-per">Solgte print pr. aften</label>
          <output htmlFor="pr-per">{perNight}</output>
        </div>
        <input id="pr-per" type="range" min={0} max={150} step={1} value={perNight} onChange={(e) => setPerNight(+e.target.value)} />
      </div>
      <div className="ctl">
        <div className="ctl-row">
          <label htmlFor="pr-price">Pris pr. print for gæsten</label>
          <output htmlFor="pr-price">{n(price)} kr.</output>
        </div>
        <input id="pr-price" type="range" min={20} max={100} step={5} value={price} onChange={(e) => setPrice(+e.target.value)} />
      </div>
      <div className="calc-lines" aria-live="polite">
        <div>
          <span>
            {n(prints)} print × {n(net)} kr. ekskl. moms
          </span>
          <span>{n(sales)} kr.</span>
        </div>
        <div>
          <span>Printer</span>
          <span>−{n(printer.fromPerMonth)} kr.</span>
        </div>
        <div>
          <span>Papir, ca. {n(printer.paperPerPrint)} kr. pr. print</span>
          <span>−{n(paper)} kr.</span>
        </div>
        <div>
          <span>Boksen</span>
          <span>−{n(pricing.fromPerMonth)} kr.</span>
        </div>
      </div>
      <div className="calc-total">
        <span className="label">{left >= 0 ? "Boks og printer er tjent hjem, og der er til overs" : "Mangler for at tjene boks og printer hjem"}</span>
        <b className={left < 0 ? "pr-short" : undefined}>
          {n(Math.abs(left))}
          <sup>kr./md.</sup>
        </b>
        <span className="fine">
          Printeren er tjent hjem ved {n(evenPrinter)} print om måneden. Boks og printer tilsammen ved {n(evenBoth)} print, ca. {n(Math.ceil(evenBoth / nights))} pr. aften. Et regneeksempel ud fra jeres tal, ikke en garanti. Alle beløb er ekskl. moms.
        </span>
      </div>
    </div>
  );
}
