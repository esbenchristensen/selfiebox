"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <Logo />
        <nav className="nav-links" aria-label="Sektioner">
          <a href="#saadan">Sådan virker den</a>
          <a href="#temaer">Temaer</a>
          <a href="#aktiviteter">Aktiviteter</a>
          <a href="#erhverv">Erhverv</a>
          <a href="#privat">Privat</a>
        </nav>
        <a className="btn btn-primary" href="#kontakt">
          Kontakt os
        </a>
      </div>
    </header>
  );
}
