"use client";

import { useEffect, useState } from "react";
import { contact } from "@/lib/erhverv/placeholder";

// On phones: a bar at the bottom with the phone number and one button to the contact form. It appears once
// the hero has scrolled away and hides while the form is on screen.
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("kontakt");
    if (!target) return;
    let formVisible = false;
    const update = () => setShow(!formVisible && window.scrollY > 600);
    const io = new IntersectionObserver(
      ([e]) => {
        formVisible = e.isIntersecting;
        update();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(target);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className={`sticky-cta${show ? " is-on" : ""}`} aria-hidden={!show}>
      <a href={contact.phoneHref} tabIndex={show ? 0 : -1}>
        <b>{contact.phone}</b>
        <span className="muted">Ring, eller book en snak</span>
      </a>
      <a className="btn btn-primary" href="#kontakt" tabIndex={show ? 0 : -1}>
        Book en snak
      </a>
    </div>
  );
}
