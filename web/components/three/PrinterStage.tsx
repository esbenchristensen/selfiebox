"use client";

import { ContactShadows, Environment, Lightformer, PresentationControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";

// Selfi printer v1 as it is printed (hardware/stl/printer/selfi-printer-v1), from the CAD export in
// public/models/selfi-printer-v1.glb. Millimetres with y up and the front at +z, like the box. The wall
// bracket, lock and screws are for venues and are hidden here; the rental printer stands on its base.
// A print slides out of the paper slot as the page scrolls: `progress` (0 to 1) says how far.

const MODEL = "/models/selfi-printer-v1.glb";
const MM = 0.01;
// The tray is left out too: a print leaving the slot shows what the printer does better.
export const HIDDEN = new Set(["konsol", "vaegplade", "skruer_vaeg", "skruer_sokkel", "laas", "pi", "inlet", "printer", "bakke"]);
// Same casing as the rental box (components/three/rental.ts), so the two look like one product.
const CASING = "#1d201d";
const PRINT_PHOTO = "/photos/boks-bryllup.jpg";
// The paper slot in the front: 124 × 8 mm, centred at y = 41 mm (SLOT_Z in cad/selfi_printer_v1.scad is 147 mm over
// the base, which is at y = -110 here), the front face at z = 147 mm. The model sits at z = -0.2.
const SLOT = { y: 41, z: 147 };
const MODEL_Z = -0.2;
// A square print with a white frame and a wider foot, like a polaroid.
const PRINT = { w: 100, border: 5, photo: 90, foot: 23 };
const REACH = 0.8; // how much of the print is out when the page has scrolled all the way
const DROOP = 0.5; // radians the end of the paper tips down as it leaves the slot

useGLTF.preload(MODEL, false, true);

export type PrinterStageProps = { onReady?: () => void; progress: MutableRefObject<number> };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Frame() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const [hgt, wid] = [3.4, 4.6];
    const fov = (cam.fov * Math.PI) / 180;
    const byH = hgt / 2 / Math.tan(fov / 2);
    const byW = wid / 2 / Math.tan(fov / 2) / aspect;
    cam.position.set(0, 1.15, Math.max(byH, byW) * 1.06);
    cam.lookAt(0, -0.1, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// Our own materials, as HaloBox does for the box: graphite casing, warm white and green logo.
export function printerMaterial(name: string) {
  return name === "logo_hvid"
    ? new THREE.MeshStandardMaterial({ color: "#fff3e3", roughness: 0.5, emissive: "#fff3e3", emissiveIntensity: 0.25 })
    : name === "logo_groen"
      ? new THREE.MeshStandardMaterial({ color: "#22d36b", roughness: 0.5, emissive: "#22d36b", emissiveIntensity: 0.4 })
      : new THREE.MeshStandardMaterial({ color: CASING, roughness: 0.82, metalness: 0.02 });
}

function Printer({ motion, progress }: { motion: boolean; progress: MutableRefObject<number> }) {
  const { scene } = useGLTF(MODEL, false, true);
  const group = useRef<THREE.Group>(null);
  const model = useMemo(() => {
    scene.traverse((o) => {
      if (HIDDEN.has(o.name)) o.visible = false;
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      m.material = printerMaterial(o.name);
    });
    return scene;
  }, [scene]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Turned a little to the left so the depth shows, swaying when motion is allowed.
    g.rotation.y = -0.55 + (motion ? Math.sin(t * 0.4) * 0.15 : 0);
    g.position.y = motion ? Math.sin(t * 0.9) * 0.03 : 0;
  });

  return (
    <group ref={group}>
      <primitive object={model} scale={MM} position={[0, 0, MODEL_Z]} />
      <Print progress={progress} />
    </group>
  );
}

/**
 * A print leaving the paper slot. It lies flat and tips a little down at the end that comes out first, the way
 * a print drops from a real printer, and slides further out the more the page has scrolled. The part still
 * inside is hidden by the casing.
 */
function Print({ progress }: { progress: MutableRefObject<number> }) {
  const photo = useTexture(PRINT_PHOTO);
  const { w, border, photo: p, foot } = PRINT;
  const h = border + p + foot;
  const pw = w * MM, ph = h * MM, side = p * MM;
  const out = useRef<THREE.Group>(null);
  const shown = useRef(0);

  useFrame((_, dt) => {
    const g = out.current;
    if (!g) return;
    // Ease towards the scroll position, so a quick scroll never makes the paper jump.
    shown.current += (progress.current - shown.current) * Math.min(1, dt * 7);
    const reach = shown.current * REACH * ph;
    g.visible = reach > 0.004;
    // The leading end is `reach` out from the slot, in the direction of the tip; the centre is half a print behind it.
    const k = reach - ph / 2;
    g.position.set(0, SLOT.y * MM - Math.sin(DROOP) * k, SLOT.z * MM + MODEL_Z + Math.cos(DROOP) * k);
  });

  return (
    <group ref={out} visible={false}>
      {/* Lying face up with its top towards the printer: from the front it reads the right way up. */}
      <group rotation={[-Math.PI / 2 + DROOP, 0, 0]}>
        <mesh castShadow receiveShadow>
          <planeGeometry args={[pw, ph]} />
          <meshStandardMaterial color="#fbfaf6" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, ph / 2 - (border + p / 2) * MM, 0.003]}>
          <planeGeometry args={[side, side]} />
          <meshBasicMaterial map={photo} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Ready({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
}

export default function PrinterStage({ onReady, progress }: PrinterStageProps) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="stage-canvas">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 28, near: 0.1, far: 100, position: [0, 0, 12] }}
        shadows
        style={{ touchAction: "pan-y" }}
      >
        <Frame />
        <ambientLight intensity={0.35} />
        <directionalLight position={[-4, 6, 8]} intensity={1.7} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[5, 2, -4]} intensity={1.2} color="#cfe8ff" />
        <pointLight position={[3, -2, 4]} intensity={4} distance={12} color="#fff3e3" />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} position={[0, 5, 6]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={1.6} position={[-6, 1, 3]} rotation-y={Math.PI / 2.4} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[6, 0, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 4, 1]} color="#dfefff" />
        </Environment>
        <Suspense fallback={null}>
          <PresentationControls global={false} cursor snap speed={1.4} polar={[-0.25, 0.3]} azimuth={[-0.9, 0.9]} damping={0.25}>
            <Printer motion={!reduced} progress={progress} />
          </PresentationControls>
          <ContactShadows position={[0, -1.12, 0]} opacity={0.45} scale={8} blur={2.6} far={3} resolution={512} frames={reduced ? 1 : Infinity} />
          <Ready onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
