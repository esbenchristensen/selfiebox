import Image from "next/image";
import type { ReactNode } from "react";

type Link = { label: string; href: string };

// Server-rendered, one audience per page, so the H1 search engines see is the H1 visitors see.
// The right column is a photo, a visual such as the 3D box, or something to act on (`aside`, e.g. the booking calendar).
export function Hero({
  label,
  title,
  lede,
  primary,
  secondary,
  image,
  visual,
  aside,
  points,
}: {
  label: string;
  title: string;
  lede: string;
  primary?: Link;
  secondary: Link;
  image?: { src: string; alt: string; pos?: string };
  visual?: ReactNode;
  aside?: ReactNode;
  points?: ReactNode; // short promises under the lede, e.g. what is always included
}) {
  return (
    <section className={`hero${aside ? " hero--aside" : ""}`} aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="label">{label}</span>
          <h1 id="hero-title" className="h-xl">
            {title}
          </h1>
          <p className="lede">{lede}</p>
          {points}
          <div className="btn-row">
            {primary && (
              <a className="btn btn-primary" href={primary.href}>
                {primary.label}
              </a>
            )}
            <a className="btn btn-secondary" href={secondary.href}>
              {secondary.label}
            </a>
          </div>
        </div>
        {aside ? (
          <div className="hero-aside">{aside}</div>
        ) : visual ? (
          <div className="hero-visual">{visual}</div>
        ) : image ? (
          <div className="hero-media">
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={1500}
              priority
              sizes="(max-width: 900px) 90vw, 45vw"
              style={{ aspectRatio: "4 / 5", objectFit: "cover", objectPosition: image.pos ?? "50% 50%" }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
