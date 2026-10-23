"use client";

import { ContactShadows, Environment, Lightformer, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { startTransition, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HaloBox, preloadVenue, SHOOT, SHOOT_LOOP, VENUES, type Venue } from "./HaloBox";
import { radialTexture } from "./textures";
import { StandPrinter } from "./StandPrinter";
import { FLOOR_Y, SOCKET, Tripod } from "./Tripod";
import type { BoxTheme } from "./themes";

export type StageProps = {
  // A venue design (topper, wings, casing) or a private party theme (plain box, print beside it).
  design: { venue: Venue } | { theme: BoxTheme };
  // "box": a venue design with no topper or wings (the rental box), framed tight so the box is shown large.
  // "stand": the rental box on the floor tripod it goes out with, standing on the floor.
  // "plain": the box as it is, standing still at one angle with only a shadow under it (the /erhverv hero).
  variant: "venue" | "private" | "box" | "stand" | "plain";
  // Designs to fetch ahead of time so a switch does not wait for the network. Defaults to the venues.
  preload?: Venue[];
  onReady?: () => void;
};

type Design = StageProps["design"];
const idOf = (d: Design) => ("venue" in d ? d.venue.id : d.theme.id);

const SPIN = 1.1; // seconds for a full turn when the design changes
const MM = 0.01;
// The stand turns about the tripod's column. Scene units: floor at STAND_FLOOR, box centred a little above the middle.
const STAND_TOP = 306;
const STAND_FLOOR = -((STAND_TOP - FLOOR_Y) / 2) * MM;
const STAND_TURN = -0.22;

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
    const [hgt, wid, cx, cy] =
      variant === "venue" ? [6.3, 4.5, 0, 0.42] : variant === "box" || variant === "plain" ? [3.7, 3, 0, 0] : variant === "stand" ? [17.4, 12.4, 1.5, -0.35] : [3.6, 4.4, 0.35, 0];
    const fov = (cam.fov * Math.PI) / 180;
    const byH = hgt / 2 / Math.tan(fov / 2);
    const byW = wid / 2 / Math.tan(fov / 2) / aspect;
    // The stand is seen from about eye height, a little above its middle, like a guest walking up to it.
    cam.position.set(cx, cy + (variant === "stand" ? 3.2 : 0.15), Math.max(byH, byW) * 1.06);
    cam.lookAt(cx, cy, 0);
    cam.updateProjectionMatrix();
  }, [camera, size, variant]);
  return null;
}

function Spinner({ design, variant, motion }: { design: Design; variant: StageProps["variant"]; motion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [shown, setShown] = useState(design);
  const [bornAt, setBornAt] = useState(0);
  const spin = useRef<{ start: number; swapped: boolean } | null>(null);
  const clock = useThree((s) => s.clock);

  useEffect(() => {
    if (idOf(design) === idOf(shown)) return;
    if (!motion) {
      setShown(design);
      return;
    }
    spin.current = { start: clock.elapsedTime, swapped: false };
  }, [design, shown, motion, clock]);

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
        // A transition keeps the current box on screen while the next design's files load.
        startTransition(() => {
          setShown(design);
          setBornAt(t);
        });
      }
      if (p >= 1) spin.current = null;
    }
    // The stand holds still at one chosen angle: a little from the left, so the printer and the depth show.
    g.rotation.y = variant === "stand" ? STAND_TURN : variant === "plain" ? -0.18 : idle + turn;
    g.position.y = motion && variant !== "stand" ? Math.sin(t * 0.9) * 0.05 : 0;
  });

  if (variant === "stand" && "venue" in shown)
    return (
      <group ref={group}>
        {/* Unit coordinates, floor at STAND_FLOOR, the tripod's column on the turning axis */}
        <group scale={MM} position={[-SOCKET.x * MM, STAND_FLOOR - FLOOR_Y * MM, -SOCKET.z * MM]}>
          <group scale={1 / MM} position={[0, 153, 0]}>
            <HaloBox venue={shown.venue} module={false} motion={motion} bornAt={bornAt} />
          </group>
          <Tripod casing={shown.venue.casing} />
          <FrontLight motion={motion} />
          {shown.venue.shoot && (
            <StandPrinter photo={shown.venue.shoot.photo} motion={motion} position={[SOCKET.x + 500, FLOOR_Y, SOCKET.z - 120]} turn={-0.12} />
          )}
        </group>
      </group>
    );

  return (
    <group ref={group}>
      {"venue" in shown ? (
        <HaloBox venue={shown.venue} module={false} motion={motion} bornAt={bornAt} />
      ) : (
        <HaloBox theme={shown.theme} module={false} motion={motion} bornAt={bornAt} />
      )}
    </group>
  );
}

// The light from the box's ring falls forward, onto the tripod, the printer and the floor in front: soft while it
// waits, a burst at the flash (HaloBox's photo loop), never a glow on the wall behind.
function FrontLight({ motion }: { motion: boolean }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    const l = light.current;
    if (!l) return;
    const after = motion ? (state.clock.elapsedTime % SHOOT_LOOP) - SHOOT.idle - SHOOT.count : -1;
    const flash = after >= 0 ? Math.exp(-after * 4.5) : 0;
    l.intensity = 6 + flash * 90;
  });
  return (
    <>
      <primitive object={target} position={[0, FLOOR_Y, 1400]} />
      <spotLight ref={light} position={[0, 153, 30]} target={target} angle={0.75} penumbra={0.9} decay={0} distance={0} color="#fff3e3" />
    </>
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

export default function Stage({ design, variant, onReady, preload = VENUES }: StageProps) {
  useEffect(() => {
    if (variant !== "private") preload.forEach((v) => preloadVenue(v));
  }, [variant, preload]);
  const glowColor = "venue" in design ? design.venue.ring.glow : "#fff3e3";
  const still = useReducedMotion() || variant === "plain";
  const fixed = variant === "stand" || variant === "plain";
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
        <pointLight position={[3, -2, 4]} intensity={6} distance={12} color={glowColor} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={2.4} position={[0, 5, 6]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={1.6} position={[-6, 1, 3]} rotation-y={Math.PI / 2.4} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[6, 0, 2]} rotation-y={-Math.PI / 2.4} scale={[6, 4, 1]} color="#dfefff" />
          <Lightformer form="ring" intensity={1.5} position={[0, 0, -6]} scale={6} color={glowColor} />
        </Environment>
        {!fixed && <WallGlow color={glowColor} />}
        <Suspense fallback={null}>
          <PresentationControls enabled={!fixed} global={false} cursor={!fixed} snap speed={1.4} polar={[-0.25, 0.3]} azimuth={[-0.9, 0.9]} damping={0.25}>
            <Spinner design={design} variant={variant} motion={!still} />
          </PresentationControls>
          {variant === "stand" ? (
            <ContactShadows position={[0, STAND_FLOOR + 0.01, 0]} opacity={0.75} scale={12} blur={1.6} far={3} resolution={512} frames={still ? 1 : Infinity} />
          ) : (
            <ContactShadows position={[0, -1.75, 0]} opacity={0.4} scale={8} blur={2.8} far={4} resolution={512} frames={still ? 1 : Infinity} />
          )}
          <Ready onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
