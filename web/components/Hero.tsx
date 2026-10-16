import Image from "next/image";

type Link = { label: string; href: string };

// Server-rendered, one audience per page, so the H1 search engines see is the H1 visitors see.
export function Hero({ label, title, lede, primary, secondary, image }: { label: string; title: string; lede: string; primary: Link; secondary: Link; image: { src: string; alt: string; pos?: string } }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="label">{label}</span>
          <h1 id="hero-title" className="h-xl">
            {title}
          </h1>
          <p className="lede">{lede}</p>
          <div className="btn-row">
            <a className="btn btn-primary" href={primary.href}>
              {primary.label}
            </a>
            <a className="btn btn-secondary" href={secondary.href}>
              {secondary.label}
            </a>
          </div>
        </div>
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
      </div>
    </section>
  );
}
