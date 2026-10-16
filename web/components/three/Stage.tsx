"use client";

import { ContactShadows, Environment, Lightformer, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SelfiBox } from "./SelfiBox";
import { radialTexture } from "./textures";
import type { BoxTheme } from "./themes";

export type StageProps = {
  theme: BoxTheme;
  // "venue": topper, photo module and the print sliding out underneath.
  // "private": the plain box with the print floating beside it.
  variant: "venue" | "private";
  onReady?: () => void;
};

const SPIN = 1.1; // seconds for a full turn when the design changes

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

function Frame({ variant }: { variant: StageProps["variant"] }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    // Fit the whole design: height for tall frames, width for wide ones.
    const [hgt, wid, cx, cy] = variant === "venue" ? [6.5, 3.4, 0, -0.05] : [3.9, 4.4, 0.35, 0];
    const fov = (cam.fov * Math.PI) / 180;
    const byH = hgt / 2 / Math.tan(fov / 2);
    const byW = wid / 2 / Math.tan(fov / 2) / aspect;
    cam.position.set(cx, cy + 0.15, Math.max(byH, byW) * 1.06);
    cam.lookAt(cx, cy, 0);
    cam.updateProjectionMatrix();
  }, [camera, size, variant]);
  return null;
}

function Spinner({ theme, variant, motion, onSwap }: { theme: BoxTheme; variant: StageProps["variant"]; motion: boolean; onSwap?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const [shown, setShown] = useState(theme);
  const spin = useRef<{ start: number; swapped: boolean } | null>(null);
  const clock = useThree((s) => s.clock);

  useEffect(() => {
    if (theme.id === shown.id) return;
    if (!motion) {
      setShown(theme);
      return;
    }
    spin.current = { start: clock.elapsedTime, swapped: false };
  }, [theme, shown.id, motion, clock]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const idle = motion ? Math.sin(t * 0.45) * 0.22 : -0.18;
    let turn = 0;
    const s = spin.current;
    if (s) {
      const p = Math.min(1, (t - s.start) / SPIN);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      turn = e * Math.PI * 2;
      // Swap while the back of the box faces the camera, so the change is never seen.
      if (p > 0.5 && !s.swapped) {
        s.swapped = true;
        setShown(theme);
        onSwap?.();
      }
      if (p >= 1) spin.current = null;
    }
    g.rotation.y = idle + turn;
    g.position.y = motion ? Math.sin(t * 0.9) * 0.05 : 0;
  });

  return (
    <group ref={group}>
      <SelfiBox theme={shown} showModule={variant === "venue" && !!shown.module} floatPrint={variant === "private"} motion={motion} />
    </group>
  );
}

function WallGlow({ color }: { color: string }) {
  const tex = useMemo(() => radialTexture(), []);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    mat.current?.color.lerp(new THREE.Color(color), 0.06);
  });
  return (
    <mesh position={[0, 0.1, -1.1]}>
      <planeGeometry args={[9, 10]} />
      <meshBasicMaterial ref={mat} map={tex} color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
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

export default function Stage({ theme, variant, onReady }: StageProps) {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering when the canvas is off screen, so the page stays light to scroll.
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
        <Frame variant={variant} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[-4, 6, 8]} intensity={1.7} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[5, 2, -4]} intensity={1.2} color="#cfe8ff" />
        <pointLight position={[3, -2, 4]} intensity={8} distance={12} color={theme.colors.ring} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} position={[0, 5, 6]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={1.6} position={[-6, 1, 3]} rotation-y={Math.PI / 2.4} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[6, 0, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 4, 1]} color="#dfefff" />
          <Lightformer form="ring" intensity={1.5} position={[0, 0, -6]} scale={6} color={theme.colors.ring} />
        </Environment>
        <WallGlow color={theme.colors.ring} />
        <PresentationControls global={false} cursor snap speed={1.4} polar={[-0.25, 0.3]} azimuth={[-0.9, 0.9]} damping={0.25}>
          <Spinner theme={theme} variant={variant} motion={!reduced} />
        </PresentationControls>
        <ContactShadows position={[0, variant === "venue" ? -3.05 : -1.9, 0]} opacity={0.45} scale={8} blur={2.8} far={4} resolution={512} frames={reduced ? 1 : Infinity} />
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
