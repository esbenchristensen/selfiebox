"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SHOOT, SHOOT_LOOP } from "./HaloBox";
import { HIDDEN, printerMaterial } from "./PrinterStage";

// The rental printer (selfi-printer-v1, from its CAD export) on a small side table next to the box on its stand,
// printing the photo the box has just taken: the print slides out of the paper slot after the flash, in step with
// HaloBox's photo loop. Millimetres in the stand's unit coordinates (see Tripod.tsx).

const MODEL = "/models/selfi-printer-v1.glb";
const BOTTOM = -110; // underside of the base in the model
const SLOT = { y: 34, z: 147 }; // the paper slot in the front, as in PrinterStage
const TABLE = { r: 230, top: 18, h: 620 };
// A polaroid-style print with a white frame and a wider foot, as in PrinterStage
const PRINT = { w: 100, border: 5, photo: 90, foot: 23 };
const DROOP = 0.5;
const REACH = 0.8;
const OUT = { from: 1.0, to: 3.4 }; // seconds after the flash
const PAPER = "#f4f2ec";

useGLTF.preload(MODEL, false, true);

function ease(t: number) {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
}

export function StandPrinter({ photo, motion, position, turn }: { photo: string; motion: boolean; position: [number, number, number]; turn: number }) {
  const { scene } = useGLTF(MODEL, false, true);
  // A copy of its own: the printer section further down the page shows the same model in another canvas.
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((o) => {
      if (HIDDEN.has(o.name)) o.visible = false;
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      m.material = printerMaterial(o.name);
    });
    return copy;
  }, [scene]);
  useEffect(
    () => () =>
      model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) (m.material as THREE.Material).dispose();
      }),
    [model],
  );

  const table = useMemo(() => {
    const top = new THREE.MeshStandardMaterial({ color: "#d8d4cc", roughness: 0.6 });
    const metal = new THREE.MeshStandardMaterial({ color: "#2a2c2e", roughness: 0.4, metalness: 0.6 });
    return { top, metal };
  }, []);
  useEffect(() => () => Object.values(table).forEach((m) => m.dispose()), [table]);

  const photoMap = useTexture(`/photos/${photo}.jpg`);
  photoMap.colorSpace = THREE.SRGBColorSpace;
  const { w, border, photo: p, foot } = PRINT;
  const h = border + p + foot;
  const out = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = out.current;
    if (!g) return;
    const after = motion ? (state.clock.elapsedTime % SHOOT_LOOP) - SHOOT.idle - SHOOT.count : OUT.to;
    const k = after < 0 ? 0 : ease((after - OUT.from) / (OUT.to - OUT.from));
    const reach = k * REACH * h;
    g.visible = reach > 0.5;
    // The leading end is `reach` out of the slot, tipping down; the centre is half a print behind it.
    const c = reach - h / 2;
    g.position.set(0, SLOT.y - Math.sin(DROOP) * c, SLOT.z + Math.cos(DROOP) * c);
  });

  return (
    <group position={position}>
      {/* Side table: round top on a single column and a foot */}
      <mesh position={[0, TABLE.h - TABLE.top / 2, 0]} material={table.top} castShadow receiveShadow>
        <cylinderGeometry args={[TABLE.r, TABLE.r, TABLE.top, 48]} />
      </mesh>
      <mesh position={[0, (TABLE.h - TABLE.top) / 2, 0]} material={table.metal} castShadow>
        <cylinderGeometry args={[18, 18, TABLE.h - TABLE.top, 20]} />
      </mesh>
      <mesh position={[0, 6, 0]} material={table.metal} castShadow receiveShadow>
        <cylinderGeometry args={[160, 170, 12, 40]} />
      </mesh>
      <group position={[0, TABLE.h - BOTTOM, 0]} rotation={[0, turn, 0]}>
        <primitive object={model} />
        <group ref={out} visible={false}>
          {/* Face up with its top towards the printer, so it reads the right way up from the front */}
          <group rotation={[-Math.PI / 2 + DROOP, 0, 0]}>
            <mesh castShadow receiveShadow>
              <planeGeometry args={[w, h]} />
              <meshStandardMaterial color={PAPER} roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, h / 2 - (border + p / 2), 0.3]}>
              <planeGeometry args={[p, p]} />
              <meshBasicMaterial map={photoMap} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
