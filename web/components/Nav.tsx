"use client";

import { useEffect, useRef, useState } from "react";
import { FeatureIcon } from "./FeatureIcon";
import { Logo } from "./Logo";
import { featureGroups, features } from "@/content";
import { Soon } from "./Soon";

type Link = { label: string; href: string };

const HOVER_CLOSE_MS = 180;

// The same header on every page: section links, the "Funktioner" mega menu and one call to action.
// The menu opens on hover with a mouse and on tap or click everywhere else; Escape and a click outside close it.
export function Nav({ links, cta = { label: "Book en snak", href: "#kontakt" } }: { links: Link[]; cta?: Link }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // A mouse opens the menu on hover, so the click that follows must not close it again.
  const byHover = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const hoverOpen = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    if (!open) byHover.current = true;
    setOpen(true);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => {
      byHover.current = false;
      setOpen(false);
    }, HOVER_CLOSE_MS);
  };

  return (
    <header ref={ref} className={`nav${scrolled || open ? " scrolled" : ""}`}>
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
          <div className="mega-wrap" onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
            <button type="button" className="nav-mega" aria-expanded={open} aria-controls="mega" onClick={() => {
                if (byHover.current) byHover.current = false;
                else setOpen((o) => !o);
              }}>
              Funktioner
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2.5 4.5 6 8l3.5-3.5" />
              </svg>
            </button>
          </div>
          <a className="btn btn-primary" href={cta.href}>
            {cta.label}
          </a>
        </div>
      </div>
      <div id="mega" className="mega" hidden={!open} onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
        <div className="wrap mega-inner">
          {featureGroups.map((g) => (
            <div key={g.id} className="mega-group">
              <span className="label">{g.name}</span>
              <ul>
                {features
                  .filter((f) => f.group === g.id)
                  .map((f) => (
                    <li key={f.slug}>
                      <a href={`/funktioner/${f.slug}`} onClick={() => setOpen(false)}>
                        <FeatureIcon d={f.icon} />
                        <span>
                          <b>{f.name}{f.soon && <Soon />}</b>
                          <span className="muted">{f.short}</span>
                        </span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
          <a className="mega-all" href="/funktioner" onClick={() => setOpen(false)}>
            Se alle funktioner →
          </a>
        </div>
      </div>
    </header>
  );
}
