"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HaloBox } from "./HaloBox";
import { SHOWROOM as VENUES } from "./showroom";

// All venue designs side by side, standing on the page itself. The row has no ends: each box takes the
// place nearest the camera, so going past the last design comes round to the first again. The boxes hold
// still at one angle; only the camera glides from one to the next.

const GAP = 5.2;
const N = VENUES.length;
// A little from the left, so the side wings and the depth show.
const TURN = -0.2;

const mod = (n: number) => ((n % N) + N) % N;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
  }, []);
  return reduced;
}

function Rig({ focus, motion, light, back }: { focus: number; motion: boolean; light: React.RefObject<THREE.DirectionalLight | null>; back: React.RefObject<THREE.Mesh | null> }) {
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
    // The light and the wall that catches the shadows go along with the camera.
    if (light.current) {
      light.current.position.set(x.current - 4, 7, 9);
      light.current.target.position.set(x.current, 0, 0);
      light.current.target.updateMatrixWorld();
    }
    back.current?.position.setX(x.current);
  });
  return null;
}

function Slot({ i, onPick }: { i: number; onPick: (k: number) => void }) {
  const g = useRef<THREE.Group>(null);
  const k = useRef(i);
  useFrame((state) => {
    if (!g.current) return;
    // The copy of this design nearest the camera
    const c = state.camera.position.x / GAP;
    k.current = i + N * Math.round((c - i) / N);
    g.current.position.x = k.current * GAP;
  });
  return (
    <group
      ref={g}
      position={[i * GAP, 0, 0]}
      rotation={[0, TURN, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onPick(k.current);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <Suspense fallback={null}>
        <HaloBox venue={VENUES[i]} module={false} motion={false} />
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

// focus counts on past the last design (and below the first): design focus mod N, at x = focus * GAP.
export default function Showroom3D({ focus, onPick, onReady }: { focus: number; onPick: (k: number) => void; onReady?: () => void }) {
  const reduced = useReducedMotion();
  const light = useRef<THREE.DirectionalLight>(null);
  const back = useRef<THREE.Mesh>(null);
  // Models are fetched for the chosen design and its two neighbours, and kept once fetched. The whole
  // wall is 5 MB of parts, screens and prints; a visitor who never clicks past the first design gets 1.5 MB.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([mod(focus)]));
  useEffect(() => {
    setLoaded((prev) => {
      const next = new Set(prev);
      for (const k of [focus - 1, focus, focus + 1]) next.add(mod(k));
      return next.size === prev.size ? prev : next;
    });
  }, [focus]);
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
        <Rig focus={focus} motion={!reduced} light={light} back={back} />
        <ambientLight intensity={0.4} />
        <directionalLight ref={light} position={[-4, 7, 9]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={8} shadow-camera-bottom={-8} />
        <directionalLight position={[6, 2, -3]} intensity={0.9} color="#dfefff" />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, 6]} scale={[14, 2, 1]} />
          <Lightformer form="rect" intensity={1.4} position={[-7, 1, 3]} rotation-y={Math.PI / 2.4} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1.1} position={[7, 0, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 4, 1]} color="#dfefff" />
        </Environment>
        {/* No wall of its own: the page shows through, and only the boxes' shadows land on it. */}
        <mesh ref={back} position={[0, 0, -1.2]} receiveShadow>
          <planeGeometry args={[60, 30]} />
          <shadowMaterial transparent opacity={0.1} />
        </mesh>
        {VENUES.map((_, i) => loaded.has(i) && <Slot key={i} i={i} onPick={onPick} />)}
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
