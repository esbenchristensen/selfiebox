"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { printTexture, ringGlowTexture, screenTexture } from "./textures";
import type { BoxTheme } from "./themes";
import venues from "./venues.json";

// Selfi Boks as it is printed: the Halo enclosure from the CAD export, and for venues the wings and
// topper built by hardware/tools/venue_themes.py. Millimetres, scaled so 100 mm = 1 unit.
// Unit coordinates: x across, y up from the bottom of the unit, z out of the front (front at 0).

export type Venue = (typeof venues)[number];
export const VENUES = venues as Venue[];

const MM = 0.01;
const UNIT_H = 306;
const SPACER = 6;
const MODULE_H = 189;
const SCREEN = { y: 151.85, z: -3.55, w: 136.4, h: 217.6 };
const WINDOW = { y: 26, w: 84 };
const PRINT = { w: 72, h: 86 };
const PRIVATE_CASING = "#0b0b0d";

const CASING = ["bezel", "shell_closed", "instax_front", "instax_shell", "joint_spacer"];
const LIGHT = ["diffuser_ring", "shell_closed_band", "instax_shell_band"];

useGLTF.preload("/models/unit.glb", false, true);

function ease(t: number) {
  const k = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - k, 3);
}

type Props = {
  venue?: Venue;
  theme?: BoxTheme; // private party: plain black box, the screen and print change
  module?: boolean;
  motion?: boolean;
  // Seconds since the design was put on. The parts slide on over the first second.
  bornAt?: number;
};

// Meshopt quantization stores each mesh's scale and offset on its node, so bake the node
// transform into a copy of the geometry before using it on its own.
function baked(scene: THREE.Object3D) {
  scene.updateMatrixWorld(true);
  const out: Record<string, THREE.BufferGeometry> = {};
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    // Quantized attributes are normalized integers: copy them to floats first, or the transform clamps them.
    const g = new THREE.BufferGeometry();
    for (const [key, attr] of Object.entries(m.geometry.attributes)) {
      const a = attr as THREE.BufferAttribute;
      const f = new Float32Array(a.count * a.itemSize);
      for (let i = 0; i < a.count; i++) for (let c = 0; c < a.itemSize; c++) f[i * a.itemSize + c] = a.getComponent(i, c);
      g.setAttribute(key, new THREE.BufferAttribute(f, a.itemSize));
    }
    if (m.geometry.index) g.setIndex(m.geometry.index);
    g.applyMatrix4(m.matrixWorld);
    out[m.name] = g;
  });
  return out;
}

function useUnit() {
  const { scene } = useGLTF("/models/unit.glb", false, true);
  return useMemo(() => baked(scene), [scene]);
}

function Parts({ venue, attach }: { venue: Venue; attach: React.MutableRefObject<number> }) {
  const { scene } = useGLTF(`/models/${venue.id}/parts.glb`, false, true);
  const groups = useMemo(() => {
    const byPart: Record<string, THREE.Mesh[]> = { wing_left: [], wing_right: [], topper: [] };
    for (const [name, geometry] of Object.entries(baked(scene))) {
      const [part, key] = name.split("__");
      const hex = (venue.palette as Record<string, string | undefined>)[key] ?? venue.palette.base;
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: hex,
          roughness: key === "base" ? 0.82 : 0.62,
          emissive: venue.id === "nibe" && key === "neon" ? hex : "#000000",
          emissiveIntensity: 0.35,
        }),
      );
      mesh.castShadow = true;
      (byPart[part] ??= []).push(mesh);
    }
    return byPart;
  }, [scene, venue]);

  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const top = useRef<THREE.Group>(null);
  useFrame(() => {
    const k = 1 - attach.current; // 1 = pulled off, 0 = mounted
    if (left.current) left.current.position.x = -70 * k;
    if (right.current) right.current.position.x = 70 * k;
    if (top.current) top.current.position.y = UNIT_H + SPACER + 80 * k;
  });

  return (
    <>
      <group ref={left}>{groups.wing_left.map((m, i) => <primitive key={i} object={m} />)}</group>
      <group ref={right}>{groups.wing_right.map((m, i) => <primitive key={i} object={m} />)}</group>
      <group ref={top} position={[0, UNIT_H + SPACER, 0]}>
        {groups.topper.map((m, i) => <primitive key={i} object={m} />)}
      </group>
    </>
  );
}

export function HaloBox({ venue, theme, module = true, motion = true, bornAt = 0 }: Props) {
  const nodes = useUnit();
  const casing = venue?.casing ?? PRIVATE_CASING;
  const ring = venue?.ring.idle ?? ["#fff3e3"];

  const mats = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({ color: casing, roughness: 0.78, metalness: 0 });
    const light = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: ring[0], emissiveIntensity: 1.6, roughness: 0.4, toneMapped: false });
    const glass = new THREE.MeshPhysicalMaterial({ color: "#050507", roughness: 0.1, clearcoat: 1 });
    const lens = new THREE.MeshStandardMaterial({ color: "#0a0a0c", roughness: 0.2, metalness: 0.4 });
    return { body, light, glass, lens };
  }, [casing, ring]);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const screenMap = useTexture(venue ? `/models/${venue.id}/screen.png` : "/models/smukfest/screen.png");
  screenMap.colorSpace = THREE.SRGBColorSpace;
  const privateScreen = useMemo(() => (theme ? screenTexture(theme) : null), [theme]);
  useEffect(() => () => privateScreen?.dispose(), [privateScreen]);

  // The print: the venue's frame over the photo, or the private theme's own frame.
  const frame = useTexture(venue ? `/models/${venue.id}/print.png` : "/models/smukfest/print.png");
  const photo = useTexture(venue ? `/photos/${venue.photo}.jpg` : "/photos/print-wedding.jpg");
  const printMap = useMemo(() => {
    if (theme) return printTexture(theme);
    const c = document.createElement("canvas");
    c.width = 720;
    c.height = 860;
    const ctx = c.getContext("2d")!;
    const img = photo.image as HTMLImageElement;
    const s = Math.max(620 / img.width, 620 / img.height);
    ctx.drawImage(img, 50 + (620 - img.width * s) / 2, 50 + (620 - img.height * s) / 2, img.width * s, img.height * s);
    ctx.drawImage(frame.image as HTMLImageElement, 0, 0, 720, 860);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [theme, frame, photo]);
  useEffect(() => () => printMap.dispose(), [printMap]);

  const glowTex = useMemo(() => ringGlowTexture(2.0, 2.86, 0.22, 0.4), []);

  const attach = useRef(1);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const print = useRef<THREE.Group>(null);
  const tmp = useMemo(() => new THREE.Color(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    attach.current = motion ? ease((t - bornAt - 0.15) / 0.9) : 1;
    // Slow wave through the theme's idle colours, like the ring does when nobody is using it.
    const n = ring.length;
    const phase = motion ? (t / 2.6) % n : 0;
    const a = Math.floor(phase), f = phase - a;
    tmp.set(ring[a % n]).lerp(new THREE.Color(ring[(a + 1) % n]), f * f * (3 - 2 * f));
    mats.light.emissive.copy(tmp);
    if (glow.current) {
      glow.current.color.copy(tmp);
      glow.current.opacity = 0.45 + (motion ? Math.sin(t * 1.7) * 0.12 : 0);
    }
    const p = print.current;
    if (p) {
      const k = motion ? ease((t - bornAt - 0.6) / 1.2) : 1;
      if (module) {
        // Pulled halfway out of the pocket behind the photo window
        p.position.set(0, -SPACER - MODULE_H + WINDOW.y + 6 + k * 40, 4 + k * 10);
        p.rotation.set(-0.18 * k, 0, motion ? Math.sin(t * 0.9) * 0.02 : 0);
      } else {
        p.position.set(172, 90 + k * 12 + (motion ? Math.sin(t * 1.1) * 4 : 0), 60);
        p.rotation.set(0, -0.35, -0.12);
        p.scale.setScalar(0.7 + k * 0.3);
      }
    }
  });

  const part = (name: string, mat: THREE.Material) =>
    nodes[name] ? <mesh key={name} geometry={nodes[name]} material={mat} castShadow receiveShadow /> : null;

  return (
    <group scale={MM} position={[0, -UNIT_H / 2 * MM, 0]}>
      {/* The unit */}
      {CASING.slice(0, 2).map((n) => part(n, mats.body))}
      {part("diffuser_ring", mats.light)}
      {part("shell_closed_band", mats.light)}
      {part("v_display", mats.glass)}
      {part("v_camera", mats.lens)}
      <mesh position={[0, SCREEN.y, SCREEN.z]}>
        <planeGeometry args={[SCREEN.w, SCREEN.h]} />
        <meshBasicMaterial map={privateScreen ?? screenMap} toneMapped={false} />
      </mesh>
      <mesh position={[0, UNIT_H / 2, 2]} scale={1 / MM} renderOrder={2}>
        <planeGeometry args={[2.0 + 0.8, 2.86 + 0.8]} />
        <meshBasicMaterial ref={glow} map={glowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Photo module under the unit, on a joint spacer */}
      {module && (
        <group position={[0, -SPACER - MODULE_H, 0]}>
          {part("instax_front", mats.body)}
          {part("instax_shell", mats.body)}
          {part("instax_shell_band", mats.light)}
          <group position={[0, MODULE_H, 0]}>{part("joint_spacer", mats.body)}</group>
        </group>
      )}

      {/* Venue parts: wings on the side screws, topper on the top joint */}
      {venue && (
        <>
          <group position={[0, UNIT_H, 0]}>{part("joint_spacer", mats.body)}</group>
          <Suspense fallback={null}>
            <Parts venue={venue} attach={attach} />
          </Suspense>
        </>
      )}

      <group ref={print}>
        <mesh>
          <planeGeometry args={[PRINT.w, PRINT.h]} />
          <meshStandardMaterial map={printMap} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

export function preloadVenue(id: string) {
  useGLTF.preload(`/models/${id}/parts.glb`, false, true);
  useTexture.preload(`/models/${id}/screen.png`);
}
