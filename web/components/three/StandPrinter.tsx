"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { SHOOT, SHOOT_LOOP } from "./HaloBox";
import { printerMaterial } from "./PrinterStage";
import { PRINT_START, PRINTER_BOTTOM, PRINTER_MODEL, PrintOut } from "./PrintOut";
import { dannebrogTexture, oakTexture } from "./textures";

// The rental printer (selfi-printer-v4, the cabinet from its CAD export) on a round oak side table with a Danish
// table flag, next to the box on its stand, printing the photo the box has just taken: after the flash the print
// slides down the chute into the pickup pocket (PrintOut.tsx), in step with HaloBox's photo loop. Millimetres in the
// stand's unit coordinates (see Tripod.tsx).

const TABLE = { r: 275, top: 28, h: 620 };
const LEGS = { at: 180, splay: 0.14, top: 17, foot: 11 };
// A Danish table flag: a turned oak foot, a thin pole and a 150 mm Dannebrog, at the back of the table on the box's
// side, flying towards the box so it stays in the picture.
const FLAG = { x: -170, z: -190, pole: 380, w: 150, h: 124 };
const OUT = { from: 0.9, to: 2.6 }; // seconds after the flash: dropped onto the chute, then in the pocket

useGLTF.preload(PRINTER_MODEL, false, true);

export function StandPrinter({ photo, motion, position, turn }: { photo: string; motion: boolean; position: [number, number, number]; turn: number }) {
  const { scene } = useGLTF(PRINTER_MODEL, false, true);
  // A copy of its own: the printer section further down the page shows the same model in another canvas.
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((o) => {
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
    const grain = oakTexture();
    const top = new THREE.MeshStandardMaterial({ map: grain, color: "#ffffff", roughness: 0.55 });
    // Along the legs, the grain runs lengthwise.
    const upright = grain.clone();
    upright.center.set(0.5, 0.5);
    upright.rotation = Math.PI / 2;
    const leg = new THREE.MeshStandardMaterial({ map: upright, color: "#e6d2b4", roughness: 0.6 });
    const pole = new THREE.MeshStandardMaterial({ color: "#b8925c", roughness: 0.45, metalness: 0.4 });
    const flag = new THREE.MeshStandardMaterial({ map: dannebrogTexture(), roughness: 0.85, side: THREE.DoubleSide });
    return { top, leg, pole, flag };
  }, []);
  useEffect(
    () => () =>
      Object.values(table).forEach((m) => {
        m.map?.dispose();
        m.dispose();
      }),
    [table],
  );
  // The cloth hangs in a soft, still wave that grows towards the fly end.
  const cloth = useMemo(() => {
    const g = new THREE.PlaneGeometry(FLAG.w, FLAG.h, 24, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = (pos.getX(i) + FLAG.w / 2) / FLAG.w;
      pos.setZ(i, Math.sin(u * 5.2) * 9 * u);
      pos.setY(i, pos.getY(i) - u * u * 6);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => cloth.dispose(), [cloth]);

  // Down the chute with gravity, then still in the pocket until the next photo.
  const lead = (t: number) => {
    const after = motion ? (t % SHOOT_LOOP) - SHOOT.idle - SHOOT.count : OUT.to;
    if (after < OUT.from) return PRINT_START + 1;
    const k = Math.min(1, (after - OUT.from) / (OUT.to - OUT.from));
    return PRINT_START * (1 - k * k);
  };

  return (
    <group position={position}>
      {/* Oak side table: a round top on four splayed, tapered legs */}
      <mesh position={[0, TABLE.h - TABLE.top / 2, 0]} material={table.top} castShadow receiveShadow>
        <cylinderGeometry args={[TABLE.r, TABLE.r, TABLE.top, 64]} />
      </mesh>
      {[0.25, 0.75, 1.25, 1.75].map((a) => {
        const az = a * Math.PI;
        const len = (TABLE.h - TABLE.top) / Math.cos(LEGS.splay);
        return (
          <group
            key={a}
            position={[Math.cos(az) * LEGS.at, TABLE.h - TABLE.top, Math.sin(az) * LEGS.at]}
            rotation={[-Math.sin(az) * LEGS.splay, 0, Math.cos(az) * LEGS.splay]}
          >
            <mesh position={[0, -len / 2, 0]} material={table.leg} castShadow receiveShadow>
              <cylinderGeometry args={[LEGS.top, LEGS.foot, len, 20]} />
            </mesh>
          </group>
        );
      })}
      {/* Danish table flag */}
      <group position={[FLAG.x, TABLE.h, FLAG.z]}>
        <mesh position={[0, 9, 0]} material={table.leg} castShadow>
          <cylinderGeometry args={[22, 28, 18, 32]} />
        </mesh>
        <mesh position={[0, FLAG.pole / 2, 0]} material={table.pole} castShadow>
          <cylinderGeometry args={[2.5, 2.5, FLAG.pole, 12]} />
        </mesh>
        <mesh position={[0, FLAG.pole + 4, 0]} material={table.pole}>
          <sphereGeometry args={[6, 16, 12]} />
        </mesh>
        <mesh geometry={cloth} material={table.flag} position={[-FLAG.w / 2 - 2, FLAG.pole - FLAG.h / 2 - 6, 0]}
          rotation={[0, Math.PI, 0]}
          castShadow
        />
      </group>
      <group position={[0, TABLE.h - PRINTER_BOTTOM, 0]} rotation={[0, turn, 0]}>
        <primitive object={model} />
        <PrintOut photo={`/photos/${photo}.jpg`} lead={lead} />
      </group>
    </group>
  );
}
