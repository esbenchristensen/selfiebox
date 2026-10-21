"use client";

import { useEffect, useState } from "react";

// On phones: a bar at the bottom with the price and one button to the calendar. It appears once the hero
// (with the calendar) has scrolled out of view and hides again while the calendar or the booking is on screen.
export function StickyCta({ from }: { from: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = ["datoer", "book"].map((id) => document.getElementById(id)).filter((x): x is HTMLElement => !!x);
    if (!targets.length) return;
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting);
        const anyVisible = [...seen.values()].some(Boolean);
        setShow(!anyVisible && window.scrollY > 400);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    const onScroll = () => {
      const anyVisible = [...seen.values()].some(Boolean);
      setShow(!anyVisible && window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={`sticky-cta${show ? " is-on" : ""}`} aria-hidden={!show}>
      <div>
        <b>Fra {from}</b>
        <span className="muted">Alt er med i prisen</span>
      </div>
      <a className="btn btn-primary" href="#datoer" tabIndex={show ? 0 : -1}>
        Se ledige datoer
      </a>
    </div>
  );
}
