"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// A print sliding down the chute of selfi-printer-v3 into the pickup pocket at the front of the exit module, in the
// model's own millimetres (public/models/selfi-printer-v3.glb: y up, front at +z, centred; made by
// hardware/tools/printer_web_glb.py). The paper follows the chute and the pocket floor as it goes, bending at the
// kink, and stops against the lip at the front. The figures are hardware/cad/selfi_printer_v3.scad's, moved into
// the glTF frame: x - 238, y = z_scad - 108.6, z = 111.25 - y_scad.

export const PRINTER_MODEL = "/models/selfi-printer-v3.glb";
// Underside of the base in the model
export const PRINTER_BOTTOM = -108.6;
const X = 143.85; // OP_X, the pocket's centre
const STOP = [6.2, 31.4]; // (y, z) in the scad: the back face of the stop lip, on the pocket floor
const KINK = [65, 35]; // RAMP_Y0, RAMP_Z0: the chute's foot
const CHUTE = Math.PI / 6; // ROOF, 30 degrees
const LIFT = 0.5; // paper over the surface
// A 6 × 4 inch print lying across the pocket: the square photo with a white frame, and a caption beside it.
const W = 152;
const H = 102;
// Where the leading edge starts: the whole print on the chute, at its top, just dropped from the printer.
export const PRINT_START = 135;
const NU = 24;

const floorLen = Math.hypot(KINK[0] - STOP[0], KINK[1] - STOP[1]);
const floorDir = [(KINK[0] - STOP[0]) / floorLen, (KINK[1] - STOP[1]) / floorLen];

// A point on the floor and chute, d millimetres back from the stop, in glTF (y, z).
function along(d: number): [number, number] {
  let ys: number, zs: number;
  if (d <= floorLen) {
    ys = STOP[0] + floorDir[0] * d;
    zs = STOP[1] + floorDir[1] * d;
  } else {
    ys = KINK[0] + Math.cos(CHUTE) * (d - floorLen);
    zs = KINK[1] + Math.sin(CHUTE) * (d - floorLen);
  }
  return [zs + LIFT - 108.6, 111.25 - ys];
}

// White paper, the photo cropped square on the left, "selfi" and a line for the date on the right.
function printTexture(img: HTMLImageElement | ImageBitmap) {
  const k = 8; // px per mm
  const c = document.createElement("canvas");
  c.width = W * k;
  c.height = H * k;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f6f4ee";
  g.fillRect(0, 0, c.width, c.height);
  const b = 5 * k;
  const side = c.height - 2 * b;
  const s = Math.min(img.width, img.height);
  g.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, b, b, side, side);
  const cx = b + side + (c.width - b - side) / 2;
  g.fillStyle = "#1d1d20";
  g.textAlign = "center";
  g.font = `600 ${11 * k}px "Instrument Sans", system-ui, sans-serif`;
  g.fillText("selfi", cx, c.height / 2 + 2 * k);
  g.fillStyle = "#22d36b";
  g.beginPath();
  g.arc(cx + 13.5 * k, c.height / 2 - 9.5 * k, 1.6 * k, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#8b8b86";
  g.font = `500 ${4 * k}px "Instrument Sans", system-ui, sans-serif`;
  g.fillText("selfi.dk", cx, c.height / 2 + 10 * k);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/**
 * The print. `lead(t)` gives the leading edge's distance back from the stop, in mm, every frame: PRINT_START when
 * it has just dropped, 0 when it lies in the pocket; anything over PRINT_START hides it.
 */
export function PrintOut({ photo, lead }: { photo: string; lead: (time: number, dt: number) => number }) {
  const map = useTexture(photo) as THREE.Texture;
  const tex = useMemo(() => printTexture(map.image as HTMLImageElement), [map]);
  const geo = useMemo(() => new THREE.PlaneGeometry(W, H, 1, NU), []);
  useEffect(
    () => () => {
      tex.dispose();
      geo.dispose();
    },
    [tex, geo],
  );
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const d0 = lead(state.clock.elapsedTime, dt);
    m.visible = d0 < PRINT_START + 0.5;
    if (!m.visible) return;
    // PlaneGeometry rows run from its top (local y = H/2, the photo's top, which goes to the back) to its bottom
    // (the leading edge, at the front): each row sits `u` back from the leading edge along the surface.
    const pos = geo.attributes.position;
    for (let row = 0; row <= NU; row++) {
      const u = H * (1 - row / NU);
      const [y, z] = along(d0 + u);
      for (let col = 0; col <= 1; col++) {
        const i = row * 2 + col;
        pos.setXYZ(i, X + (col ? W / 2 : -W / 2), y, z);
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  });

  return (
    <mesh ref={mesh} geometry={geo} visible={false} castShadow receiveShadow frustumCulled={false}>
      <meshStandardMaterial map={tex} roughness={0.45} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.28} side={THREE.DoubleSide} />
    </mesh>
  );
}
