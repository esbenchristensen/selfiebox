"use client";

import { ContactShadows, Environment, Lightformer, PresentationControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Selfi printer v1 as it is printed (hardware/stl/printer/selfi-printer-v1), from the CAD export in
// public/models/selfi-printer-v1.glb. Millimetres with y up and the front at +z, like the box. The wall
// bracket, lock and screws are for venues and are hidden here; the rental printer stands on its base.

const MODEL = "/models/selfi-printer-v1.glb";
const MM = 0.01;
// The tray is left out too: a print on its way out of the slot shows what the printer does better.
const HIDDEN = new Set(["konsol", "vaegplade", "skruer_vaeg", "skruer_sokkel", "laas", "pi", "inlet", "printer", "bakke"]);
// Same casing as the rental box (components/three/rental.ts), so the two look like one product.
const CASING = "#1d201d";
const PRINT_PHOTO = "/photos/boks-bryllup.jpg";
// The paper slot in the front: 124 × 8 mm, just above where the tray sat (y ≈ 33 mm, front at z = 147 mm).
const SLOT = { y: 34, z: 147 };
const PRINT = { w: 102, h: 152, border: 5, foot: 18 }; // a 10 × 15 print with a white frame and room for a line at the bottom

useGLTF.preload(MODEL, false, true);

export type PrinterStageProps = { onReady?: () => void };

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
    const [hgt, wid] = [3.4, 4.2];
    const fov = (cam.fov * Math.PI) / 180;
    const byH = hgt / 2 / Math.tan(fov / 2);
    const byW = wid / 2 / Math.tan(fov / 2) / aspect;
    cam.position.set(0, 0.55, Math.max(byH, byW) * 1.06);
    cam.lookAt(0, -0.1, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Printer({ motion }: { motion: boolean }) {
  const { scene } = useGLTF(MODEL, false, true);
  const group = useRef<THREE.Group>(null);
  const model = useMemo(() => {
    scene.traverse((o) => {
      if (HIDDEN.has(o.name)) o.visible = false;
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      // Our own materials, as HaloBox does for the box: graphite casing, warm white and green logo.
      m.material =
        o.name === "logo_hvid"
          ? new THREE.MeshStandardMaterial({ color: "#fff3e3", roughness: 0.5, emissive: "#fff3e3", emissiveIntensity: 0.25 })
          : o.name === "logo_groen"
            ? new THREE.MeshStandardMaterial({ color: "#22d36b", roughness: 0.5, emissive: "#22d36b", emissiveIntensity: 0.4 })
            : new THREE.MeshStandardMaterial({ color: CASING, roughness: 0.82, metalness: 0.02 });
    });
    return scene;
  }, [scene]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Turned a little to the left so the depth shows, swaying when motion is allowed.
    g.rotation.y = -0.55 + (motion ? Math.sin(t * 0.4) * 0.2 : 0);
    g.position.y = motion ? Math.sin(t * 0.9) * 0.04 : 0;
  });

  return (
    <group ref={group}>
      <primitive object={model} scale={MM} position={[0, 0, -0.2]} />
      <Print />
    </group>
  );
}

/** A print on its way out of the slot: white paper with the photo, leaning a little out from the front. */
function Print() {
  const photo = useTexture(PRINT_PHOTO);
  const { w, h, border, foot } = PRINT;
  const pw = w * MM, ph = h * MM;
  const iw = (w - border * 2) * MM, ih = (h - border - foot) * MM;
  // Pivot at the slot: the paper's lower end is still inside the printer, the rest leans out.
  return (
    <group position={[0, SLOT.y * MM, (SLOT.z + 1) * MM - 0.2]} rotation={[-0.42, 0, 0]}>
      <mesh position={[0, ph * 0.5 - 0.32, 0]} castShadow>
        <planeGeometry args={[pw, ph]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, ph * 0.5 - 0.32 + (foot - border) * MM * 0.5, 0.002]}>
        <planeGeometry args={[iw, ih]} />
        <meshBasicMaterial map={photo} toneMapped={false} />
      </mesh>
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

export default function PrinterStage({ onReady }: PrinterStageProps) {
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
            <Printer motion={!reduced} />
          </PresentationControls>
          <ContactShadows position={[0, -1.12, 0]} opacity={0.45} scale={8} blur={2.6} far={3} resolution={512} frames={reduced ? 1 : Infinity} />
          <Ready onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
