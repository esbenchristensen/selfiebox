"use client";

import { useEffect, useRef, useState } from "react";
import { FeatureIcon } from "./FeatureIcon";
import { Logo } from "./Logo";
import { featureGroups, features } from "@/content";
import { Soon } from "./Soon";

type Link = { label: string; href: string };

const HOVER_CLOSE_MS = 180;

// The same header on every page: section links, the "Funktioner" mega menu (business pages) and one call to action.
// The menu opens on hover with a mouse and on tap or click everywhere else; Escape and a click outside close it.
// On narrow screens the section links move into a small menu behind a "Menu" button, with `extra` links
// (other pages) under them, so a phone can jump to price, service and questions too.
export function Nav({ links, extra = [], cta = { label: "Book en snak", href: "#kontakt" }, mega = true }: { links: Link[]; extra?: Link[]; cta?: Link; mega?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
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
    if (!open && !menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setMenu(false);
    };
    const onDown = (e: PointerEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
      setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open, menu]);

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
    <header ref={ref} className={`nav${scrolled || open || menu ? " scrolled" : ""}`}>
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
          {mega && (
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
          )}
          <a className="btn btn-primary" href={cta.href}>
            {cta.label}
          </a>
          {links.length > 0 && (
            <button type="button" className="nav-menu-btn" aria-expanded={menu} aria-controls="nav-menu" onClick={() => {
                setMenu((m) => !m);
                setOpen(false);
              }}>
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          )}
        </div>
      </div>
      {links.length > 0 && (
        <div id="nav-menu" className="nav-menu" hidden={!menu}>
          <nav className="wrap nav-menu-inner" aria-label="Sidens afsnit">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenu(false)}>
                {l.label}
              </a>
            ))}
            {(extra.length > 0 || mega) && <span className="nav-menu-sep" />}
            {mega && (
              <a href="/funktioner" onClick={() => setMenu(false)}>
                Funktioner
              </a>
            )}
            {extra.map((l) => (
              <a key={l.href} href={l.href} className="muted" onClick={() => setMenu(false)}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
      {mega && (
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
      )}
    </header>
  );
}
