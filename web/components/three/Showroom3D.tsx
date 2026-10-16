"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HaloBox, VENUES } from "./HaloBox";
import { radialTexture } from "./textures";

// All venue designs side by side on one wall. The camera glides to the chosen one,
// and its printed parts are bolted on again as it arrives.

const GAP = 5.2;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
  }, []);
  return reduced;
}

function Rig({ focus, motion }: { focus: number; motion: boolean }) {
  const { camera, size } = useThree();
  const x = useRef(focus * GAP);
  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const fov = (cam.fov * Math.PI) / 180;
    // Frame the chosen box with room for its neighbours on wide screens.
    const dist = Math.max(6.2 / 2 / Math.tan(fov / 2), 4.7 / 2 / Math.tan(fov / 2) / aspect);
    const target = focus * GAP;
    x.current = motion ? THREE.MathUtils.damp(x.current, target, 3.2, dt) : target;
    cam.position.set(x.current, 0.9, dist * 1.02);
    cam.lookAt(x.current, 0.72, 0);
  });
  return null;
}

function Wall({ colors }: { colors: string[] }) {
  const tex = useMemo(() => radialTexture(), []);
  return (
    <group>
      <mesh position={[(VENUES.length - 1) * GAP * 0.5, 0, -1.2]} receiveShadow>
        <planeGeometry args={[VENUES.length * GAP + 40, 30]} />
        <meshStandardMaterial color="#141516" roughness={0.95} />
      </mesh>
      {colors.map((c, i) => (
        <mesh key={i} position={[i * GAP, 0, -1.18]}>
          <planeGeometry args={[8, 9]} />
          <meshBasicMaterial map={tex} color={c} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Slot({ i, focus, motion, onPick }: { i: number; focus: number; motion: boolean; onPick: (i: number) => void }) {
  const g = useRef<THREE.Group>(null);
  const [bornAt, setBornAt] = useState(-10);
  const clock = useThree((s) => s.clock);
  useEffect(() => {
    if (i === focus) setBornAt(clock.elapsedTime);
  }, [focus, i, clock]);
  useFrame((state, dt) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    const off = i - focus;
    // Neighbours turn a little towards the middle; the chosen one sways.
    const turn = THREE.MathUtils.clamp(-off * 0.35, -0.6, 0.6);
    const sway = i === focus && motion ? Math.sin(t * 0.5) * 0.18 : 0;
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, turn + sway, 4, dt);
    g.current.scale.setScalar(THREE.MathUtils.damp(g.current.scale.x, i === focus ? 1 : 0.9, 4, dt));
  });
  return (
    <group
      ref={g}
      position={[i * GAP, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onPick(i);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <Suspense fallback={null}>
        <HaloBox venue={VENUES[i]} module={false} motion={motion} bornAt={bornAt} />
      </Suspense>
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

export default function Showroom3D({ focus, onPick, onReady }: { focus: number; onPick: (i: number) => void; onReady?: () => void }) {
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
        camera={{ fov: 30, near: 0.1, far: 200, position: [0, 0, 14] }}
        shadows
        style={{ touchAction: "pan-y" }}
      >
        <Rig focus={focus} motion={!reduced} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[-4, 7, 9]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-20} shadow-camera-right={40} shadow-camera-top={8} shadow-camera-bottom={-8} />
        <directionalLight position={[6, 2, -3]} intensity={0.9} color="#dfefff" />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, 6]} scale={[14, 2, 1]} />
          <Lightformer form="rect" intensity={1.4} position={[-7, 1, 3]} rotation-y={Math.PI / 2.4} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1.1} position={[7, 0, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 4, 1]} color="#dfefff" />
        </Environment>
        <Wall colors={VENUES.map((v) => v.ring.glow)} />
        {VENUES.map((_, i) => (
          <Slot key={i} i={i} focus={focus} motion={!reduced} onPick={onPick} />
        ))}
        <Suspense fallback={null}>
          <ContactShadows position={[(VENUES.length - 1) * GAP * 0.5, -1.8, 0]} opacity={0.35} scale={[VENUES.length * GAP + 6, 6]} blur={2.4} far={4} resolution={1024} frames={1} />
          <Ready onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
