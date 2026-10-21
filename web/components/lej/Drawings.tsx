import { BOX_W, Front, rr, Slab, Sparkle } from "../Outline";

// Line drawings for the rental page, in the same hand as components/Outline.tsx: ink outlines, green details,
// drawn in code so they follow the light and dark theme. We have few photos of private parties, so these carry
// the page where a photo would otherwise go.

const H = 306 / BOX_W;

function Svg({ label, children, vb = "0 0 240 180" }: { label: string; children: React.ReactNode; vb?: string }) {
  return (
    <svg className="outline" viewBox={vb} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

// A guest seen from the chest up, for the photos.
function Guest({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7 * s} />
      <path d={`M${x - 13 * s} ${y + 22 * s} C${x - 13 * s} ${y + 11 * s} ${x - 6 * s} ${y + 9 * s} ${x} ${y + 9 * s} C${x + 6 * s} ${y + 9 * s} ${x + 13 * s} ${y + 11 * s} ${x + 13 * s} ${y + 22 * s}`} />
    </g>
  );
}

/** 1. Book: a phone with the calendar and the chosen weekend. */
export function DrawBook() {
  const days = Array.from({ length: 21 }, (_, i) => i);
  return (
    <Svg label="Tegning af en telefon med kalenderen, hvor en weekend er valgt">
      <path d={rr(78, 14, 84, 152, 14)} fill="var(--surface)" />
      <path d="M108 24 h24" />
      <path className="o-faint" d="M90 44 h40" />
      {days.map((i) => {
        const cx = 92 + (i % 7) * 9.4, cy = 62 + Math.floor(i / 7) * 13;
        const on = i >= 11 && i <= 13;
        return <circle key={i} cx={cx} cy={cy} r={on ? 4.4 : 1.6} className={on ? "o-green-fill" : undefined} />;
      })}
      <path className="o-green" d="M88.2 88 h37.6" strokeWidth={9} opacity={0.25} />
      <path d={rr(90, 116, 60, 18, 9)} className="o-green" />
      <path className="o-green" d="M112 125 l4 4 l9 -9" />
      <Sparkle x={182} y={44} s={9} />
      <Sparkle x={56} y={120} s={6} />
    </Svg>
  );
}

/** 2. Delivered: the box in its carton, on its way to the parcel shop. */
export function DrawParcel() {
  return (
    <Svg label="Tegning af kassen med fotoboksen på vej med posten">
      <path className="o-faint" d="M20 82 h34 M30 98 h30 M14 114 h36" />
      <path d="M72 70 L132 52 L198 70 L138 90 Z" fill="var(--surface)" />
      <path d="M72 70 V138 L138 158 V90 Z" fill="var(--surface)" />
      <path d="M138 90 L198 70 V138 L138 158 Z" fill="var(--surface)" />
      <path className="o-green" d="M102 61 L168 79" strokeWidth={8} opacity={0.3} />
      <path d="M90 112 l30 9 v14 l-30 -9 Z" />
      <path className="o-green" d="M152 104 A16 16 0 0 0 180 96" />
      <circle className="o-green-fill" cx={166} cy={88} r={3.5} />
      <Sparkle x={206} y={34} s={9} />
    </Svg>
  );
}

/** 3. Set up: the box on its floor stand, plugged into the wall. */
export function DrawSetup() {
  const w = 62, x = 92, y = 18, h = w * H;
  const pole = x + w / 2 + 4;
  return (
    <Svg label="Tegning af boksen på gulvstativet med strømkablet i stikkontakten">
      <path d={`M${pole} ${y + h - 4} V152 M${pole} 152 L${pole - 26} 170 M${pole} 152 L${pole + 24} 169 M${pole} 152 L${pole + 2} 164`} />
      <path className="o-green" d={`M${pole} 140 C ${pole + 20} 140 ${pole + 16} 166 ${pole + 44} 166 S 186 150 190 136`} />
      <path d={rr(180, 112, 22, 28, 6)} />
      <path className="o-green" d="M188 122 v7 M194 122 v7" />
      <Slab x={x} y={y} w={w} h={h} r={10} d={[8, -4.5]} />
      <Front x={x} y={y} w={w} />
      <Sparkle x={50} y={46} s={8} />
      <Sparkle x={196} y={36} s={10} />
    </Svg>
  );
}

/** 4. The party: guests on the screen, the photo on the phone through a QR code. */
export function DrawParty() {
  return (
    <Svg label="Tegning af et billede af tre gæster og en telefon, der har hentet billedet via QR-kode">
      <path d={rr(40, 22, 104, 128, 6)} fill="var(--surface)" />
      <path d={rr(48, 30, 88, 92, 3)} />
      <Guest x={70} y={70} />
      <Guest x={92} y={64} s={1.1} />
      <Guest x={114} y={70} />
      <path className="o-faint" d="M62 136 h60" />
      <path d={rr(150, 52, 52, 96, 10)} fill="var(--surface)" />
      <path d={rr(160, 68, 32, 32, 3)} />
      <path className="o-green" d="M164 72 h8 v8 h-8 Z M180 72 h8 v8 h-8 Z M164 88 h8 v8 h-8 Z M182 90 h4 M182 94 h6" />
      <path className="o-green" d="M166 116 h20" />
      <Sparkle x={30} y={30} s={8} />
      <Sparkle x={210} y={40} s={10} />
    </Svg>
  );
}

/** 5. Back: the carton closed with the return label on. */
export function DrawReturn() {
  return (
    <Svg label="Tegning af kassen lukket med returlabelen på, klar til pakkeshoppen">
      <path d="M58 70 L118 52 L184 70 L124 90 Z" fill="var(--surface)" />
      <path d="M58 70 V138 L124 158 V90 Z" fill="var(--surface)" />
      <path d="M124 90 L184 70 V138 L124 158 Z" fill="var(--surface)" />
      <path d="M88 61 L154 79" />
      <path d="M134 104 L170 92 V116 L134 128 Z" />
      <path className="o-green" d="M140 110 l24 -8 M140 118 l16 -5.4" />
      <path className="o-green" d="M200 120 a26 26 0 1 0 -8 -40" />
      <path className="o-green" d="M186 74 l6 6 l-8 3" />
    </Svg>
  );
}

/** A photo strip: three photos under each other, as in a classic photo booth. */
export function DrawStrip() {
  return (
    <Svg label="Tegning af en fotostrimmel med tre billeder" vb="0 0 120 200">
      <path d={rr(34, 8, 52, 184, 4)} fill="var(--surface)" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={rr(40, 14 + i * 52, 40, 46, 2)} />
          <Guest x={53} y={30 + i * 52} s={0.6} />
          <Guest x={67} y={30 + i * 52} s={0.6} />
        </g>
      ))}
      <path className="o-green" d="M46 176 q14 8 28 0" />
      <Sparkle x={100} y={30} s={7} />
    </Svg>
  );
}

/** A polaroid: one photo with a white edge and room for a greeting. */
export function DrawPolaroid() {
  return (
    <Svg label="Tegning af et polaroidbillede med plads til en hilsen" vb="0 0 160 200">
      <g transform="rotate(-4 80 100)">
        <path d={rr(22, 18, 116, 150, 4)} fill="var(--surface)" />
        <path d={rr(32, 28, 96, 96, 2)} />
        <Guest x={62} y={66} s={1.05} />
        <Guest x={84} y={60} s={1.15} />
        <Guest x={106} y={66} s={1.05} />
        <path className="o-green" d="M46 146 c10 -8 18 6 28 -2 s18 -6 26 0 s12 4 16 -2" />
      </g>
      <Sparkle x={140} y={24} s={8} />
    </Svg>
  );
}

// 24 px line icons for the "everything is included" grid and the trust points in the hero.
export const ICONS = {
  infinity: "M7 8c-2.8 0-4.5 1.8-4.5 4s1.7 4 4.5 4c3.5 0 6.5-8 10-8 2.8 0 4.5 1.8 4.5 4s-1.7 4-4.5 4c-3.5 0-6.5-8-10-8Z",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2",
  gallery: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 15l5-5 4 4 3-3 6 6M15.5 9.5h.01",
  truck: "M2 6h11v10H2zM13 9h4l4 4v3h-8M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  shield: "M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4",
  light: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  chat: "M4 5h16v11H9l-5 4zM8 9h8M8 12h5",
  frame: "M4 4h16v16H4zM8 8h8v6H8zM8 17h8",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2",
} as const;

export function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className="lej-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}
