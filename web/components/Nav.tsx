"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

type Link = { label: string; href: string };
type Other = Link & { short: string };

// `other` is the door to the other audience's page: always visible, never in the way.
export function Nav({ links, cta, other }: { links: Link[]; cta: Link; other: Other }) {
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
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-end">
          <a className="nav-other" href={other.href} aria-label={other.label}>
            <span className="long">{other.label}</span>
            <span className="short">{other.short}</span>
          </a>
          <a className="btn btn-primary" href={cta.href}>
            {cta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
