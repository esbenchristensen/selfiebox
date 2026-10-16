// Line drawings of the box: an ink outline with green details. Drawn in code from the real
// proportions (234 × 306 × 66 mm), so they stay sharp at any size and follow the light/dark theme.

type P = [number, number];

function rr(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}

// A rounded slab seen at an angle: the back face shifted by `d`, joined to the front at the two corners
// where the outline turns, and the front face filled so it hides the lines behind it.
function Slab({ x, y, w, h, r, d, fill = "var(--surface)" }: { x: number; y: number; w: number; h: number; r: number; d: P; fill?: string }) {
  const len = Math.hypot(d[0], d[1]);
  const n: P = [-d[1] / len, d[0] / len]; // perpendicular to the depth direction
  const a: P = [x + r - Math.abs(n[0]) * r, y + r - Math.abs(n[1]) * r];
  const b: P = [x + w - r + Math.abs(n[0]) * r, y + h - r + Math.abs(n[1]) * r];
  return (
    <g>
      <path d={rr(x + d[0], y + d[1], w, h, r)} fill={fill} />
      <path d={`M${a[0]} ${a[1]} l${d[0]} ${d[1]} M${b[0]} ${b[1]} l${d[0]} ${d[1]}`} />
      <path d={rr(x, y, w, h, r)} fill={fill} />
    </g>
  );
}

function Sparkle({ x, y, s = 10 }: { x: number; y: number; s?: number }) {
  const k = s * 0.22;
  return (
    <path
      className="o-green-fill"
      d={`M${x} ${y - s} Q${x + k} ${y - k} ${x + s} ${y} Q${x + k} ${y + k} ${x} ${y + s} Q${x - k} ${y + k} ${x - s} ${y} Q${x - k} ${y - k} ${x} ${y - s} Z`}
    />
  );
}

// The front of the box: ring, camera notch with a green lens, and a screen with the Selfi smile.
function Front({ x, y, w, screen = "smile" }: { x: number; y: number; w: number; screen?: "smile" | "count" }) {
  const h = w * (306 / 234);
  const s = w / 234;
  const ri = 11 * s, rb = 7 * s;
  const sx = x + 37 * s, sy = y + 40 * s, sw = w - 74 * s, sh = h - 80 * s;
  const cx = x + w / 2;
  return (
    <g>
      <path d={rr(x + ri, y + ri, w - ri * 2, h - ri * 2, 20 * s)} />
      <path d={rr(x + ri + rb, y + ri + rb, w - (ri + rb) * 2, h - (ri + rb) * 2, 13 * s)} />
      <path className="o-glow" d={rr(x + ri + rb / 2, y + ri + rb / 2, w - (ri + rb) * 2 + rb, h - (ri + rb) * 2 + rb, 16 * s)} />
      <path d={rr(cx - 22 * s, y + 4 * s, 44 * s, 24 * s, 9 * s)} fill="var(--surface)" />
      <circle className="o-green-fill" cx={cx} cy={y + 16 * s} r={5.5 * s} />
      <path d={rr(sx, sy, sw, sh, 8 * s)} />
      {screen === "smile" ? (
        <>
          <path className="o-green" d={`M${cx - 30 * s} ${sy + sh * 0.44} A${34 * s} ${34 * s} 0 0 0 ${cx + 30 * s} ${sy + sh * 0.44}`} />
          <circle cx={cx} cy={sy + sh * 0.8} r={14 * s} />
          <circle className="o-green-fill" cx={cx} cy={sy + sh * 0.8} r={8 * s} />
        </>
      ) : (
        <text x={cx} y={sy + sh * 0.6} textAnchor="middle" className="o-count" style={{ fontSize: 96 * s }}>
          3
        </text>
      )}
    </g>
  );
}

// Short dashes of light around the ring.
function Rays({ x, y, w, n = 10, len = 16, gap = 14 }: { x: number; y: number; w: number; n?: number; len?: number; gap?: number }) {
  const h = w * (306 / 234);
  const cx = x + w / 2, cy = y + h / 2;
  const rays = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + 0.3;
    const ex = Math.cos(a), ey = Math.sin(a);
    // Point on the outline in this direction, roughly: scale to the box edge.
    const k = Math.min((w / 2 + gap) / Math.abs(ex || 1e-6), (h / 2 + gap) / Math.abs(ey || 1e-6));
    const px = cx + ex * k, py = cy + ey * k;
    return `M${px} ${py} l${ex * len} ${ey * len}`;
  });
  return <path className="o-green" d={rays.join(" ")} />;
}

export function OutlineStand({ className }: { className?: string }) {
  const x = 120, y = 54, w = 180;
  const h = w * (306 / 234);
  const d: P = [24, -13];
  const pole = x + w / 2 + d[0] / 2;
  return (
    <svg className={`outline ${className ?? ""}`} viewBox="0 0 440 540" role="img" aria-label="Tegning af Selfi Boks på en stander med strømkabel til stikkontakten">
      {/* Stand and cable, behind the box */}
      <path d={`M${pole} ${y + h - 10} V472 M${pole} 472 L${pole - 70} 520 M${pole} 472 L${pole + 64} 518 M${pole} 472 L${pole + 6} 508`} />
      <path d={`M${pole - 6} 300 h12 M${pole - 6} 410 h12`} />
      <path className="o-green" d={`M${pole} 452 C ${pole + 40} 452 ${pole + 30} 510 ${pole + 90} 510 S 360 470 372 440`} />
      <path d={rr(354, 382, 44, 58, 10)} />
      <circle cx="376" cy="411" r="13" />
      <path className="o-green" d="M371 405 v12 M381 405 v12" />
      <Slab x={x} y={y} w={w} h={h} r={28} d={d} />
      <Front x={x} y={y} w={w} />
      <Rays x={x} y={y} w={w} n={12} len={14} gap={22} />
      <Sparkle x={70} y={110} s={11} />
      <Sparkle x={356} y={120} s={14} />
      <Sparkle x={92} y={290} s={7} />
      <Sparkle x={344} y={270} s={8} />
    </svg>
  );
}

export function OutlineWall({ className }: { className?: string }) {
  const x = 140, y = 50, w = 168;
  const h = w * (306 / 234);
  const d: P = [22, -12];
  const my = y + h + 6;
  return (
    <svg className={`outline ${className ?? ""}`} viewBox="0 0 460 560" role="img" aria-label="Tegning af Selfi Boks på væggen med fotomodul, der printer et billede">
      {/* Wall and floor */}
      <path className="o-faint" d="M24 30 V490 L436 520 M24 490 L-10 540" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} className="o-faint" d={`M40 ${70 + i * 70} h26 M80 ${105 + i * 70} h26`} />
      ))}
      <Slab x={x} y={y} w={w} h={h} r={26} d={d} />
      <Front x={x} y={y} w={w} screen="count" />
      {/* Photo module and the print coming out of it */}
      <path d={`M${x + 50} ${my + 52} v118 h80 v-118`} fill="var(--surface)" />
      <path d={rr(x + 60, my + 62, 60, 60, 2)} />
      <path className="o-green" d={`M${x + 76} ${my + 96} A16 16 0 0 0 ${x + 104} ${my + 96}`} />
      <Slab x={x + 18} y={my} w={w - 36} h={46} r={10} d={d} />
      <path d={`M${x + 40} ${my + 34} h${w - 80}`} />
      <circle className="o-green-fill" cx={x + w - 36} cy={my + 14} r={4} />
      {/* Theft lock on the side */}
      <path d={rr(x + w + 30, y + 120, 26, 22, 4)} />
      <path d={`M${x + w + 35} ${y + 120} v-7 a8 8 0 0 1 16 0 v7`} />
      <circle className="o-green-fill" cx={x + w + 43} cy={y + 131} r={3} />
      <Rays x={x} y={y} w={w} n={10} len={14} gap={22} />
      <Sparkle x={392} y={92} s={13} />
      <Sparkle x={96} y={250} s={9} />
      <Sparkle x={380} y={330} s={7} />
    </svg>
  );
}

// The box pulled apart into its layers, from the back cover to the front.
export function OutlineExploded({ className }: { className?: string }) {
  const w = 170, h = w * (306 / 234);
  const step: P = [66, -34];
  const t: P = [9, -5];
  const base: P = [40, 230];
  const at = (i: number): P => [base[0] + step[0] * (4 - i), base[1] + step[1] * (4 - i)];
  const s = w / 234;
  const labels: [number, string][] = [
    [0, "Bagkappe"],
    [1, "Raspberry Pi 5"],
    [2, "10\" touchskærm"],
    [3, "Lysring"],
    [4, "Front og kamera"],
  ];
  const [x0, y0] = at(0), [x1, y1] = at(1), [x2, y2] = at(2), [x3, y3] = at(3), [x4, y4] = at(4);
  return (
    <svg className={`outline ${className ?? ""}`} viewBox="0 0 560 520" role="img" aria-label="Selfi Boks skilt ad i fem lag: bagkappe, Raspberry Pi, skærm, lysring og front med kamera">
      {/* Back cover with keyholes and the power socket */}
      <Slab x={x0} y={y0} w={w} h={h} r={28} d={t} />
      <path d={`M${x0 + w / 2 - 40} ${y0 + 40} v14 M${x0 + w / 2 + 40} ${y0 + 40} v14`} />
      <circle className="o-green" cx={x0 + w / 2} cy={y0 + h - 40} r={7} />
      {/* Carrier plate with the Pi */}
      <Slab x={x1} y={y1} w={w} h={h} r={28} d={t} />
      <path className="o-green" d={rr(x1 + 40, y1 + 60, 90, 62, 5)} />
      <path d={`${rr(x1 + 52, y1 + 72, 22, 22, 3)} ${rr(x1 + 84, y1 + 72, 34, 16, 3)}`} />
      <circle cx={x1 + 98} cy={y1 + 106} r={9} />
      <path d={`M${x1 + 85} ${y1 + 150} h44 M${x1 + 85} ${y1 + 162} h30`} />
      {/* Screen */}
      <Slab x={x2 + 22 * s} y={y2 + 26 * s} w={w - 44 * s} h={h - 52 * s} r={10} d={t} />
      <path className="o-faint" d={`M${x2 + 40 * s} ${y2 + 60 * s} l40 -24 M${x2 + 40 * s} ${y2 + 100 * s} l70 -42`} />
      {/* Light ring, glowing */}
      <path className="o-glow" d={rr(x3 + 14 * s, y3 + 14 * s, w - 28 * s, h - 28 * s, 18 * s)} />
      <path d={rr(x3 + 11 * s, y3 + 11 * s, w - 22 * s, h - 22 * s, 20 * s)} />
      <path d={rr(x3 + 18 * s, y3 + 18 * s, w - 36 * s, h - 36 * s, 13 * s)} />
      {/* Front */}
      <Slab x={x4} y={y4} w={w} h={h} r={28} d={t} />
      <Front x={x4} y={y4} w={w} />
      {labels.map(([i]) => {
        const [lx, ly] = at(i);
        return (
          <g key={i}>
            <circle className="o-green-fill" cx={lx + 30} cy={ly + 16} r={9} />
            <text x={lx + 30} y={ly + 20} textAnchor="middle" className="o-num">
              {i + 1}
            </text>
          </g>
        );
      })}
      {labels.map(([i, text]) => (
        <g key={text}>
          <text x={392} y={404 + i * 22} className="o-label">
            <tspan className="o-label-n">{i + 1}</tspan> {text}
          </text>
        </g>
      ))}
      <Sparkle x={x4 - 16} y={y4 + 30} s={10} />
      <Sparkle x={x4 + w + 40} y={y4 + h - 10} s={8} />
    </svg>
  );
}

// Shown in place of the 3D viewer while it loads, or if the browser has no WebGL.
export function OutlinePoster() {
  const x = 110, y = 70, w = 200;
  return (
    <svg className="outline" viewBox="0 0 420 480" aria-hidden="true">
      <Slab x={x} y={y} w={w} h={w * (306 / 234)} r={30} d={[24, -13]} />
      <Front x={x} y={y} w={w} />
      <Rays x={x} y={y} w={w} n={12} len={14} gap={22} />
    </svg>
  );
}
