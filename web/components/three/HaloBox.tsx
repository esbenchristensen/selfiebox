"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { countdownTexture, printTexture, ringGlowTexture, screenTexture, shotTexture } from "./textures";
import type { BoxTheme } from "./themes";
import occasions from "./occasions.json";
import venues from "./venues.json";

// Selfi Boks as it is printed: the Halo enclosure from the CAD export, and for venues the wings and
// topper built by hardware/tools/venue_themes.py. Millimetres, scaled so 100 mm = 1 unit.
// Unit coordinates: x across, y up from the bottom of the unit, z out of the front (front at 0).

// A venue (business) or an occasion (private party): same parts, same file layout under /models/<id>/.
export type Venue = {
  id: string;
  name: string;
  place: string;
  palette: Record<string, string | undefined>;
  casing: string;
  ring: { idle: string[]; glow: string };
  frame: { bg: string; ink: string; caption: string };
  photo: string;
  parts: string[];
  unit?: "gen2"; // drawn for the gen 2 unit (222.5 wide, 85 deep) instead of rev G
  // The box taking a photo, over and over: a party theme on the screen (an OCCASIONS id), a countdown with a green
  // ring filling up round the edge, a flash, and then the photo (/photos/<photo>.jpg) on the screen.
  shoot?: { screen: string; photo: string };
};
export const VENUES = venues as Venue[];
export const OCCASIONS = occasions as Venue[];

const MM = 0.01;
const UNIT_H = 306;
const SPACER = 6;
const MODULE_H = 189;
const SCREEN = { y: 151.85, z: -3.55, w: 136.4, h: 217.6 };
// Gen 2 since v12: the glass sits 1.6 mm behind the front, so the picture goes just in front of the glass mesh.
const SCREEN_Z_GEN2 = -1.5;
const WINDOW = { y: 26, w: 84 };
const PRINT = { w: 72, h: 86 };
const PRIVATE_CASING = "#0b0b0d";
// A photo, in seconds: waiting, the countdown (one second a number), then the photo on the screen after the flash.
export const SHOOT = { idle: 1.2, count: 3, photo: 4.4 };
export const SHOOT_LOOP = SHOOT.idle + SHOOT.count + SHOOT.photo;
const WARM = new THREE.Color("#fff3e3");
const WHITE = new THREE.Color("#ffffff");
const GREEN = new THREE.Color("#22d36b"); // a touch warm, so the burst shows on the light page

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

function useUnit(unit?: "gen2") {
  const { scene } = useGLTF(unit === "gen2" ? "/models/unit_gen2.glb" : "/models/unit.glb", false, true);
  return useMemo(() => baked(scene), [scene]);
}

// Rev G has a joint spacer between the unit and the topper; gen 2 has none, the topper sits on the unit.
const topAt = (venue: Venue) => UNIT_H + (venue.unit === "gen2" ? 0 : SPACER);

function Parts({ venue, attach }: { venue: Venue; attach: React.MutableRefObject<number> }) {
  const { scene } = useGLTF(`/models/${venue.id}/parts.glb`, false, true);
  const groups = useMemo(() => {
    const byPart: Record<string, THREE.Mesh[]> = { wing_left: [], wing_right: [], topper: [] };
    for (const [name, geometry] of Object.entries(baked(scene))) {
      const [part, key] = name.split("__");
      const hex = venue.palette[key] ?? venue.palette.base ?? "#000000";
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
    if (top.current) top.current.position.y = topAt(venue) + 80 * k;
  });

  return (
    <>
      <group ref={left}>{groups.wing_left.map((m, i) => <primitive key={i} object={m} />)}</group>
      <group ref={right}>{groups.wing_right.map((m, i) => <primitive key={i} object={m} />)}</group>
      <group ref={top} position={[0, topAt(venue), 0]}>
        {groups.topper.map((m, i) => <primitive key={i} object={m} />)}
      </group>
    </>
  );
}

export function HaloBox({ venue, theme, module = true, motion = true, bornAt = 0 }: Props) {
  const nodes = useUnit(venue?.unit);
  const shoot = venue?.shoot;
  const countOn = useMemo(() => ({ value: 0 }), []);
  const fill = useMemo(() => ({ value: 0 }), []);
  const casing = venue?.casing ?? PRIVATE_CASING;
  const ring = venue?.ring.idle ?? ["#fff3e3"];

  const mats = useMemo(() => {
    const body = new THREE.MeshStandardMaterial({ color: casing, roughness: 0.78, metalness: 0 });
    const light = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: ring[0], emissiveIntensity: 1.6, roughness: 0.4, toneMapped: false });
    if (shoot) {
      // The countdown on the RGB strip: green fills the ring clockwise from the camera at the top (where the strip
      // starts), uFill of the way round, with a soft head; the rest of the strip is off. The real strip is
      // WS2812B COB at 160 LED/m, about 134 LEDs one by one through WLED, so the box can do the same.
      // The green is Selfi green #22d36b in linear light, as the shader works in.
      light.customProgramCacheKey = () => "ring-fill";
      light.onBeforeCompile = (sh) => {
        sh.uniforms.uCount = countOn;
        sh.uniforms.uFill = fill;
        sh.vertexShader = sh.vertexShader
          .replace("#include <common>", "#include <common>\nvarying vec3 vRing;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRing = position;");
        sh.fragmentShader = sh.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying vec3 vRing;\nuniform float uCount;\nuniform float uFill;")
          .replace(
            "#include <emissivemap_fragment>",
            `#include <emissivemap_fragment>\nfloat round_ = fract(atan(vRing.x, vRing.y - ${(UNIT_H / 2).toFixed(1)}) / 6.2831853);\nfloat lit = 1.0 - smoothstep(uFill - 0.012, uFill + 0.012, round_);\ntotalEmissiveRadiance = mix(totalEmissiveRadiance, vec3(0.0116, 0.659, 0.148) * 1.5 * lit, uCount);`,
          );
      };
    }
    const glass = new THREE.MeshPhysicalMaterial({ color: "#050507", roughness: 0.1, clearcoat: 1 });
    const lens = new THREE.MeshStandardMaterial({ color: "#0a0a0c", roughness: 0.2, metalness: 0.4 });
    // Gen 2: the Selfi logo set into the front under the screen, white with green dots
    const logoWhite = new THREE.MeshStandardMaterial({ color: "#f5f5f4", roughness: 0.6 });
    const logoGreen = new THREE.MeshStandardMaterial({ color: "#22d36b", roughness: 0.6 });
    return { body, light, glass, lens, logoWhite, logoGreen };
  }, [casing, ring, shoot, countOn, fill]);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const screenMap = useTexture(venue ? `/models/${shoot?.screen ?? venue.id}/screen.png` : "/models/smukfest/screen.png");
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
  const shootTex = useMemo(
    () => (shoot ? { count: [3, 2, 1].map(countdownTexture), shot: shotTexture(`/photos/${shoot.photo}.jpg`) } : null),
    [shoot],
  );
  useEffect(
    () => () => {
      if (shootTex) [...shootTex.count, shootTex.shot].forEach((x) => x.dispose());
    },
    [shootTex],
  );

  const attach = useRef(1);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const glowMesh = useRef<THREE.Mesh>(null);
  const overlay = useRef<THREE.MeshBasicMaterial>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
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
    if (shoot && shootTex) {
      // Waiting: warm white. Countdown: 3-2-1 on the screen while the green fills the ring, in step with the numbers.
      // The flash: the RGB goes out (never colour in the photo light), the ring and the screen burn white and the
      // light falls forward on whatever is in front of the box (Stage's flash light), then the photo comes up.
      const s = motion ? (t - bornAt) % SHOOT_LOOP : 0;
      const c = s - SHOOT.idle;
      const after = c - SHOOT.count;
      let on = 0, flash = 0, show = 0;
      let map: THREE.Texture | null = null;
      if (c >= 0 && after < 0) {
        const k = Math.floor(c);
        on = Math.min(1, c * 6);
        map = shootTex.count[k];
        show = Math.min(1, (c - k) * 8);
      } else if (after >= 0) {
        flash = Math.exp(-after * 4.5);
        map = shootTex.shot;
        show = Math.min(1, after * 6) * Math.min(1, (SHOOT.photo - after) * 3);
      }
      countOn.value = on;
      fill.value = Math.max(0, Math.min(1, c / SHOOT.count));
      tmp.copy(WARM).lerp(WHITE, flash);
      mats.light.emissive.copy(tmp);
      mats.light.emissiveIntensity = 1.6 + flash * 9;
      // The diffuser's own white (lit by the room) would wash out the green and the dark part, so it dims meanwhile
      mats.light.color.setScalar(1 - on * 0.96);
      if (overlay.current) {
        if (map && overlay.current.map !== map) overlay.current.map = map;
        overlay.current.opacity = show;
      }
      if (flashMat.current) flashMat.current.opacity = flash * 0.95;
      if (glow.current) {
        glow.current.color.copy(on > 0 ? GREEN : tmp);
        glow.current.opacity = on > 0 ? 0.05 + fill.value * 0.2 : 0.5 + flash;
      }
      glowMesh.current?.scale.setScalar((1 + flash * 0.5) / MM);
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
      {part("logo_white", mats.logoWhite)}
      {part("logo_green", mats.logoGreen)}
      <mesh position={[0, SCREEN.y, venue?.unit === "gen2" ? SCREEN_Z_GEN2 : SCREEN.z]}>
        <planeGeometry args={[SCREEN.w, SCREEN.h]} />
        {/* Pulled towards the camera in the depth buffer: the glass is a fraction of a millimetre behind the picture,
            and seen from a distance (the box on its stand) the two would fight and flicker. */}
        <meshBasicMaterial map={privateScreen ?? screenMap} toneMapped={false} polygonOffset polygonOffsetFactor={-4} polygonOffsetUnits={-4} />
      </mesh>
      {shootTex && (
        <>
          {/* Countdown and photo over the theme, then the flash over everything on the screen */}
          <mesh position={[0, SCREEN.y, SCREEN_Z_GEN2]} renderOrder={1}>
            <planeGeometry args={[SCREEN.w, SCREEN.h]} />
            <meshBasicMaterial ref={overlay} map={shootTex.count[0]} transparent opacity={0} depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-8} polygonOffsetUnits={-8} />
          </mesh>
          <mesh position={[0, SCREEN.y, SCREEN_Z_GEN2]} renderOrder={1}>
            <planeGeometry args={[SCREEN.w, SCREEN.h]} />
            <meshBasicMaterial ref={flashMat} color="#ffffff" transparent opacity={0} depthWrite={false} toneMapped={false} polygonOffset polygonOffsetFactor={-12} polygonOffsetUnits={-12} />
          </mesh>
        </>
      )}
      <mesh ref={glowMesh} position={[0, UNIT_H / 2, 2]} scale={1 / MM} renderOrder={2}>
        <planeGeometry args={[2.0 + 0.8, 2.86 + 0.8]} />
        {/* Added light is lost on a light page, so the shooting box (on the light front page) paints its glow instead */}
        <meshBasicMaterial ref={glow} map={glowTex} transparent blending={shoot ? THREE.NormalBlending : THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
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
          {venue.unit !== "gen2" && <group position={[0, UNIT_H, 0]}>{part("joint_spacer", mats.body)}</group>}
          {venue.parts.length > 0 && (
            <Suspense fallback={null}>
              <Parts venue={venue} attach={attach} />
            </Suspense>
          )}
        </>
      )}

      <group ref={print} visible={module || !venue}>
        <mesh>
          <planeGeometry args={[PRINT.w, PRINT.h]} />
          <meshStandardMaterial map={printMap} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

export function preloadVenue(v: Venue) {
  if (v.parts.length) useGLTF.preload(`/models/${v.id}/parts.glb`, false, true);
  useTexture.preload(`/models/${v.shoot?.screen ?? v.id}/screen.png`);
  useTexture.preload(`/models/${v.id}/print.png`);
  useTexture.preload(`/photos/${v.photo}.jpg`);
}
