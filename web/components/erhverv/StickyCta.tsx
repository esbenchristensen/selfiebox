"use client";

import { useEffect, useState } from "react";
import { contact } from "@/lib/erhverv/placeholder";

// On phones: a bar at the bottom with the phone number and one button to the free design proposal. It appears
// once the hero has scrolled away and hides while one of the forms is on screen.
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const targets = ["udkast", "kontakt"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const visible = new Set<Element>();
    const update = () => setShow(visible.size === 0 && window.scrollY > 600);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        update();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className={`sticky-cta${show ? " is-on" : ""}`} aria-hidden={!show}>
      <a href={`mailto:${contact.email}`} tabIndex={show ? 0 : -1}>
        <b>{contact.email}</b>
        <span className="muted">Skriv, eller book en snak</span>
      </a>
      <a className="btn btn-primary" href="#udkast" tabIndex={show ? 0 : -1}>
        Gratis udkast
      </a>
    </div>
  );
}
