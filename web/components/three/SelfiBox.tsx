"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { BoxTheme, Topper } from "./themes";
import { PRINT, printTexture, ringGlowTexture, screenTexture, sideTexture, tickerTexture, topperTexture } from "./textures";

// Selfi Boks at its real size, 234 × 306 × 66 mm. One unit is 100 mm.
export const BOX = { w: 2.34, h: 3.06, d: 0.66, r: 0.3 };
const FRONT = BOX.d / 2;
const RING = { w: BOX.w - 0.22, h: BOX.h - 0.22, r: 0.2, band: 0.07 };
const SCREEN = { w: 1.62, h: 2.29, y: -0.03 };
const MODULE = { w: 1.7, h: 0.5, d: 0.5, r: 0.12 };
const MODULE_Y = -BOX.h / 2 - 0.03 - MODULE.h / 2;

function rounded<T extends THREE.Path = THREE.Shape>(w: number, h: number, r: number, path: T = new THREE.Shape() as unknown as T): T {
  const x = -w / 2, y = -h / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r);
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

// A rounded block with its front face at z = 0 and the back at z = -depth.
function block(w: number, h: number, r: number, depth: number, bevel = 0.03) {
  const g = new THREE.ExtrudeGeometry(rounded(w - bevel * 2, h - bevel * 2, Math.max(0.01, r - bevel), new THREE.Shape()), {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 28,
  });
  g.translate(0, 0, -depth + bevel);
  return g;
}

// The printed top piece. Each outline sits on y = 0 and is about as wide as the box.
const TW = 2.5;
function topperShape(type: Topper): THREE.Shape {
  const s = new THREE.Shape();
  const L = -TW / 2, R = TW / 2;
  switch (type) {
    case "hills": {
      s.moveTo(L, 0);
      s.lineTo(R, 0);
      s.lineTo(R, 0.5);
      const bumps = [0.82, 1.0, 0.86, 0.96, 0.8];
      const step = TW / bumps.length;
      bumps.forEach((top, i) => {
        const x1 = R - step * i;
        s.quadraticCurveTo(x1 - step * 0.05, top + 0.12, x1 - step / 2, top);
        s.quadraticCurveTo(x1 - step * 0.95, top + 0.12, x1 - step, i === bumps.length - 1 ? 0.5 : 0.62);
      });
      s.lineTo(L, 0);
      break;
    }
    case "arch":
      s.moveTo(L, 0);
      s.lineTo(R, 0);
      s.lineTo(R, 0.22);
      s.absellipse(0, 0.22, TW / 2, 0.86, 0, Math.PI, false, 0);
      s.lineTo(L, 0);
      break;
    case "ticket": {
      const h = 0.78, n = 0.12;
      s.moveTo(L, 0);
      s.lineTo(R, 0);
      s.lineTo(R, h / 2 - n);
      s.absarc(R, h / 2, n, -Math.PI / 2, Math.PI / 2, true);
      s.lineTo(R, h);
      s.lineTo(L, h);
      s.lineTo(L, h / 2 + n);
      s.absarc(L, h / 2, n, Math.PI / 2, -Math.PI / 2, true);
      s.lineTo(L, 0);
      break;
    }
    case "sun": {
      s.moveTo(L + 0.05, 0);
      s.lineTo(R - 0.05, 0);
      const rays = 16;
      for (let i = 0; i <= rays * 2; i++) {
        const a = (i / (rays * 2)) * Math.PI;
        const rr = i % 2 ? 1.02 : 0.84;
        s.lineTo(Math.cos(a) * rr * (TW / 2 / 1.02), Math.sin(a) * rr);
      }
      s.lineTo(L + 0.05, 0);
      break;
    }
    case "brick":
      rounded(TW, 0.75, 0.04, s);
      break;
    case "leaves": {
      s.moveTo(L, 0);
      s.lineTo(R, 0);
      s.lineTo(R, 0.42);
      const lobes = 7;
      for (let i = 0; i < lobes; i++) {
        const x0 = R - (TW / lobes) * i;
        const x1 = x0 - TW / lobes;
        const top = 0.72 + ((i * 37) % 5) * 0.06;
        s.bezierCurveTo(x0, top + 0.1, x1, top + 0.1, x1, 0.46 + (i % 2) * 0.08);
      }
      s.lineTo(L, 0);
      break;
    }
  }
  return s;
}

function makeTopper(t: BoxTheme) {
  const type = t.topper!;
  const shape = topperShape(type);
  const depth = type === "brick" ? 0.62 : 0.1;
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 32 });
  // UVs are fixed at creation in shape units, so measure before moving anything.
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const bw = bb.max.x - bb.min.x, bh = bb.max.y - bb.min.y;
  const tex = topperTexture(t, type, bw, bh);
  // The extruder gives the front face UVs in shape units; scale them so the canvas covers the outline.
  tex.repeat.set(1 / bw, 1 / bh);
  tex.offset.set(-bb.min.x / bw, -bb.min.y / bh);
  geo.translate(0, type === "brick" ? 0.375 : 0, -depth);
  // A plain back, so the print is not seen mirrored when the box turns round.
  const back = new THREE.ShapeGeometry(shape, 32);
  back.translate(0, type === "brick" ? 0.375 : 0, -depth - 0.016);
  const front = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 });
  const edge = new THREE.MeshStandardMaterial({ color: new THREE.Color(t.colors.topper).multiplyScalar(0.7), roughness: 0.6 });
  const backMat = new THREE.MeshStandardMaterial({ color: edge.color, roughness: 0.6, side: THREE.BackSide });
  return { geo, back, backMat, mats: [front, edge], depth, type, tex };
}

export type BoxProps = { theme: BoxTheme; showModule?: boolean; floatPrint?: boolean; motion?: boolean };

export function SelfiBox({ theme, showModule = true, floatPrint = false, motion = true }: BoxProps) {
  const bodyGeo = useMemo(() => block(BOX.w, BOX.h, BOX.r, BOX.d), []);
  const ringGeo = useMemo(() => {
    const s = rounded(RING.w, RING.h, RING.r, new THREE.Shape());
    s.holes.push(rounded(RING.w - RING.band * 2, RING.h - RING.band * 2, RING.r - RING.band, new THREE.Path()));
    return new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: false, curveSegments: 28 });
  }, []);
  const notchGeo = useMemo(() => block(0.44, 0.24, 0.1, 0.03, 0.01), []);
  const moduleGeo = useMemo(() => block(MODULE.w, MODULE.h, MODULE.r, MODULE.d), []);
  const glowTex = useMemo(() => ringGlowTexture(RING.w - RING.band, RING.h - RING.band, RING.r, 0.35), []);

  const front = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#060706", roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06 }),
    [],
  );

  const t = theme;
  const mats = useMemo(() => {
    const plain = t.pattern === "none";
    const side = new THREE.MeshStandardMaterial({ color: plain ? t.colors.side : "#ffffff", roughness: 0.5, metalness: 0 });
    if (!plain) {
      const tex = sideTexture(t);
      tex.repeat.set(1 / 0.62, 1 / 0.62);
      side.map = tex;
    }
    const screen = screenTexture(t);
    const ticker = t.ticker ? tickerTexture(t) : null;
    if (ticker) ticker.tex.repeat.set((SCREEN.w / 0.12) / ticker.aspect, 1);
    const topper = t.topper ? makeTopper(t) : null;
    return { side, screen, ticker, topper };
  }, [t]);

  useEffect(
    () => () => {
      mats.side.map?.dispose();
      mats.side.dispose();
      mats.screen.dispose();
      mats.ticker?.tex.dispose();
      mats.topper?.geo.dispose();
      mats.topper?.back.dispose();
      mats.topper?.tex.dispose();
    },
    [mats],
  );

  const ringRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  const printRef = useRef<THREE.Group>(null);
  const born = useRef(0);
  useEffect(() => {
    born.current = performance.now();
  }, [t]);

  useFrame((state, dt) => {
    const time = state.clock.elapsedTime;
    if (mats.ticker && motion) mats.ticker.tex.offset.x = (mats.ticker.tex.offset.x + dt * 0.06) % 1;
    // The ring breathes slowly, like the real box when nobody is using it.
    const breathe = motion ? 0.82 + Math.sin(time * 1.9) * 0.18 : 1;
    if (glowRef.current) glowRef.current.opacity = 0.55 * breathe;
    if (ringRef.current) ringRef.current.color.set(t.colors.ring).multiplyScalar(0.72 + breathe * 0.2);
    const p = printRef.current;
    if (p) {
      const k = Math.min(1, (performance.now() - born.current) / 1400);
      const e = 1 - Math.pow(1 - k, 3);
      if (floatPrint) {
        p.position.set(1.62, -0.95 + e * 0.1 + (motion ? Math.sin(time * 1.1) * 0.04 : 0), 0.55);
        p.rotation.set(0, -0.32, -0.12 + (motion ? Math.sin(time * 0.8) * 0.02 : 0));
        p.scale.setScalar(0.6 + e * 0.4);
      } else {
        // Slides out of the photo module from inside the box, then sways a little.
        p.position.set(0, MODULE_Y - MODULE.h / 2 - PRINT.h / 2 + 0.12 + (1 - e) * 0.95, 0.02);
        p.rotation.set(motion ? 0.06 + Math.sin(time * 1.3) * 0.03 : 0.06, 0, motion ? Math.sin(time * 0.9) * 0.02 : 0);
      }
    }
  });

  const printMat = useMemo(() => new THREE.MeshStandardMaterial({ map: printTexture(t), roughness: 0.6 }), [t]);
  useEffect(() => () => {
    printMat.map?.dispose();
    printMat.dispose();
  }, [printMat]);

  return (
    <group>
      {/* Cabinet: black acrylic front, printed wrap round the sides */}
      <mesh geometry={bodyGeo} material={[front, mats.side]} position={[0, 0, FRONT]} castShadow />

      {/* Light ring and its glow */}
      <mesh geometry={ringGeo} position={[0, 0, FRONT + 0.001]}>
        <meshBasicMaterial ref={ringRef} color={t.colors.ring} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, FRONT + 0.03]} renderOrder={2}>
        <planeGeometry args={[RING.w - RING.band + 0.7, RING.h - RING.band + 0.7]} />
        <meshBasicMaterial ref={glowRef} map={glowTex} color={t.colors.ring} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Camera notch over the top of the ring */}
      <mesh geometry={notchGeo} position={[0, RING.h / 2 - 0.05, FRONT + 0.03]} material={front} />
      <mesh position={[0, RING.h / 2 - 0.05, FRONT + 0.031]}>
        <circleGeometry args={[0.05, 32]} />
        <meshPhysicalMaterial color="#020203" roughness={0.05} clearcoat={1} />
      </mesh>
      <mesh position={[0, RING.h / 2 - 0.05, FRONT + 0.031]}>
        <ringGeometry args={[0.05, 0.065, 32]} />
        <meshStandardMaterial color="#5a5f63" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, SCREEN.y, FRONT + 0.004]}>
        <planeGeometry args={[SCREEN.w, SCREEN.h]} />
        <meshBasicMaterial map={mats.screen} toneMapped={false} />
      </mesh>
      {mats.ticker && (
        <mesh position={[0, SCREEN.y - SCREEN.h / 2 + 0.06, FRONT + 0.005]}>
          <planeGeometry args={[SCREEN.w, 0.12]} />
          <meshBasicMaterial map={mats.ticker.tex} toneMapped={false} />
        </mesh>
      )}
      <mesh position={[0, SCREEN.y, FRONT + 0.008]}>
        <planeGeometry args={[SCREEN.w + 0.06, SCREEN.h + 0.06]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.06} roughness={0.04} metalness={0} depthWrite={false} />
      </mesh>

      {/* Printed top piece */}
      {mats.topper && (
        <group position={[0, BOX.h / 2 + 0.04, mats.topper.type === "brick" ? FRONT - 0.02 : FRONT - 0.08]}>
          <mesh geometry={mats.topper.geo} material={mats.topper.mats} castShadow />
          <mesh geometry={mats.topper.back} material={mats.topper.backMat} />
          {mats.topper.type === "brick" &&
            [-0.9375, -0.3125, 0.3125, 0.9375].map((x) => (
              <mesh key={x} position={[x, 0.75 + 0.06, -0.31]}>
                <cylinderGeometry args={[0.19, 0.19, 0.12, 40]} />
                <meshStandardMaterial color={t.colors.topper} roughness={0.35} />
              </mesh>
            ))}
        </group>
      )}

      {/* Instax photo module under the box */}
      {showModule && (
        <group position={[0, MODULE_Y, FRONT - 0.04]}>
          <mesh geometry={moduleGeo} material={[front, mats.side]} />
          <mesh position={[0, -MODULE.h / 2 + 0.1, 0.002]}>
            <planeGeometry args={[0.9, 0.035]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[MODULE.w / 2 - 0.22, 0.08, 0.002]}>
            <circleGeometry args={[0.035, 24]} />
            <meshBasicMaterial color={t.colors.accent} toneMapped={false} />
          </mesh>
        </group>
      )}

      {/* The photo */}
      <group ref={printRef}>
        <mesh material={printMat} castShadow>
          <planeGeometry args={[PRINT.w, PRINT.h]} />
        </mesh>
        <mesh position={[0, 0, -0.002]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[PRINT.w, PRINT.h]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

    </group>
  );
}
