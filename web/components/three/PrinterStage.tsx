"use client";

import { ContactShadows, Environment, Lightformer, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { PRINT_START, PRINTER_BOTTOM, PRINTER_MODEL, PrintOut } from "./PrintOut";

// Selfi printer v4 as it is printed (hardware/stl/printer/selfi-printer-v4): the cabinet only, from
// public/models/selfi-printer-v4.glb (see PrintOut.tsx). Millimetres with y up and the front at +z, like the box.
// A print slides down the chute into the pickup pocket as the page scrolls: `progress` (0 to 1) says how far.

const MM = 0.01;
// Same casing as the rental box (components/three/rental.ts), so the two look like one product.
const CASING = "#1d201d";
const PRINT_PHOTO = "/photos/boks-bryllup.jpg";

useGLTF.preload(PRINTER_MODEL, false, true);

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
    const [hgt, wid] = [3.2, 6.0];
    const fov = (cam.fov * Math.PI) / 180;
    const byH = hgt / 2 / Math.tan(fov / 2);
    const byW = wid / 2 / Math.tan(fov / 2) / aspect;
    cam.position.set(0, 1.15, Math.max(byH, byW) * 1.06);
    cam.lookAt(0, -0.1, 0);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// Our own materials, as HaloBox does for the box: graphite casing, warm white and green logo and sign, a steel lock.
export function printerMaterial(name: string) {
  return name === "logo_hvid" || name === "tekst_hvid"
    ? new THREE.MeshStandardMaterial({ color: "#fff3e3", roughness: 0.5, emissive: "#fff3e3", emissiveIntensity: 0.25 })
    : name === "logo_groen" || name === "tekst_groen"
      ? new THREE.MeshStandardMaterial({ color: "#22d36b", roughness: 0.5, emissive: "#22d36b", emissiveIntensity: 0.4 })
      : name === "laas"
        ? new THREE.MeshStandardMaterial({ color: "#c3c7cf", roughness: 0.35, metalness: 0.8 })
        : new THREE.MeshStandardMaterial({ color: CASING, roughness: 0.82, metalness: 0.02 });
}

function Printer({ motion, progress }: { motion: boolean; progress: MutableRefObject<number> }) {
  const { scene } = useGLTF(PRINTER_MODEL, false, true);
  const group = useRef<THREE.Group>(null);
  const model = useMemo(() => {
    scene.traverse((o) => {
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
      <group scale={MM}>
        <primitive object={model} />
        <Print progress={progress} />
      </group>
    </group>
  );
}

// The print slides further down into the pocket the more the page has scrolled, easing towards the scroll
// position so a quick scroll never makes the paper jump.
function Print({ progress }: { progress: MutableRefObject<number> }) {
  const shown = useRef(0);
  return (
    <PrintOut
      photo={PRINT_PHOTO}
      lead={(_, dt) => {
        shown.current += (progress.current - shown.current) * Math.min(1, dt * 7);
        const k = Math.min(1, Math.max(0, shown.current));
        return shown.current < 0.02 ? PRINT_START + 1 : PRINT_START * (1 - k * k * (3 - 2 * k));
      }}
    />
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
          <ContactShadows position={[0, PRINTER_BOTTOM * MM - 0.01, 0]} opacity={0.45} scale={8} blur={2.6} far={3} resolution={512} frames={reduced ? 1 : Infinity} />
          <Ready onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
