"use client";

import { ContactShadows, Environment, Lightformer, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Selfi printer v1 as it is printed (hardware/stl/printer/selfi-printer-v1), from the CAD export in
// public/models/selfi-printer-v1.glb. Millimetres with y up and the front at +z, like the box. The wall
// bracket, lock and screws are for venues and are hidden here; the rental printer stands on its base.

const MODEL = "/models/selfi-printer-v1.glb";
const MM = 0.01;
const HIDDEN = new Set(["konsol", "vaegplade", "skruer_vaeg", "skruer_sokkel", "laas", "pi", "inlet", "printer"]);

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
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat?.isMeshStandardMaterial) {
          mat.roughness = o.name.startsWith("logo") ? 0.5 : 0.78;
          mat.metalness = 0.05;
        }
      }
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
        <pointLight position={[3, -2, 4]} intensity={4} distance={12} color="#22d36b" />
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
