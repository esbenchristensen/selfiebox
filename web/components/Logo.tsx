const RING =
  "M58 12 H60 A20 20 0 0 1 80 32 V88 A20 20 0 0 1 60 108 H32 A20 20 0 0 1 12 88 V32 A20 20 0 0 1 32 12 H34";

export function Mark() {
  return (
    <svg viewBox="0 0 92 120" aria-hidden="true">
      <path className="ring" d={RING} />
      <circle className="lens" cx="46" cy="12" r="7" />
      <path className="smile" d="M31 66 A17 17 0 0 0 61 66" />
    </svg>
  );
}

export function Logo({ size, href = "/" }: { size?: number; href?: string }) {
  return (
    <a
      className="logo"
      href={href}
      aria-label="Selfi, til forsiden"
      style={size ? ({ "--logo-size": `${size}px` } as React.CSSProperties) : undefined}
    >
      <Mark />
      <span className="word">
        self<span className="i">ı</span>
      </span>
    </a>
  );
}
