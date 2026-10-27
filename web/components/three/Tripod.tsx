"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// The floor stand the rental box goes out with (B2C, emballage v2): a Sirui Traveler 5AX tripod with its ball head,
// and the printed stand bracket on top (selfi-stativbeslag-v2, public/models/stand_gen2.glb, made from the CAD by
// hardware/tools/make_stativbeslag.py): the box's own wall cleat with the Selfi logo on the back and a shelf under the
// box with a 1/4"-20 T-nut right under its centre of gravity. The tripod is bought, so it is drawn from its catalogue sizes.
// Millimetres in unit coordinates: x across, y up from the bottom of the box, z out of the front (front at 0).

useGLTF.preload("/models/stand_gen2.glb", false, true);

// Underside of the bracket's shelf at the T-nut, where the quick-release plate screws in (ST_NUT in gen2_concept.scad).
export const SOCKET = new THREE.Vector3(0, -14, -31);
// The plate at 128 cm puts the screen's centre at about 144 cm, eye height for most guests.
export const PLATE_HEIGHT = 1280;
export const FLOOR_Y = SOCKET.y - PLATE_HEIGHT;

const HEAD = 95; // plate, clamp, ball and base of the ball head
const COLUMN = 200; // centre column out of the spider
const SPIDER = 45;
const SPLAY = (24 * Math.PI) / 180; // legs from vertical
const TUBES = [25, 22, 19, 16, 13]; // five leg sections, top to bottom

function cylinder(r: number, h: number, mat: THREE.Material, sides = 24) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, sides), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function buildTripod(metal: THREE.Material, rubber: THREE.Material, head: THREE.Material) {
  const g = new THREE.Group();
  const top = SOCKET.y;
  const at = (m: THREE.Object3D, y: number) => {
    m.position.set(0, y, 0);
    g.add(m);
    return m;
  };

  // Ball head: quick-release plate (across the box, clear of the power plug behind it), clamp, ball, base
  const plate = new THREE.Mesh(new THREE.BoxGeometry(52, 10, 40), head);
  plate.castShadow = true;
  at(plate, top - 5);
  at(cylinder(24, 18, head), top - 19);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(19, 32, 20), metal);
  ball.castShadow = true;
  at(ball, top - 46);
  at(cylinder(9, 18, metal), top - 30);
  at(cylinder(24, 30, head), top - HEAD + 15);

  // Centre column and spider
  const spiderTop = top - HEAD - COLUMN;
  at(cylinder(11, COLUMN + 40, metal), top - HEAD - (COLUMN + 40) / 2);
  at(cylinder(16, 26, rubber), spiderTop + 13); // column lock
  at(cylinder(34, SPIDER, head, 3), spiderTop - SPIDER / 2).rotation.y = Math.PI / 6;
  const hook = new THREE.Mesh(new THREE.TorusGeometry(9, 2.2, 10, 24), metal);
  at(hook, spiderTop - SPIDER - 70).rotation.y = Math.PI / 2;
  at(cylinder(4, 40, metal), spiderTop - SPIDER - 42);

  // Legs: one back, two forward and out, so the feet are in front of the box as well as behind it. Turned a little,
  // so the back leg does not hide behind the column when the stand is seen from the front.
  const hinge = spiderTop - SPIDER + 6;
  const length = (hinge - FLOOR_Y) / Math.cos(SPLAY);
  const section = length / TUBES.length;
  for (const az of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6].map((a) => a + 0.38)) {
    const leg = new THREE.Group();
    leg.position.set(Math.cos(az) * 30, hinge, Math.sin(az) * 30);
    const out = new THREE.Vector3(Math.cos(az), 0, Math.sin(az));
    leg.quaternion.setFromAxisAngle(new THREE.Vector3(-out.z, 0, out.x), SPLAY);
    TUBES.forEach((d, i) => {
      const tube = cylinder(d / 2, section + 6, metal);
      tube.position.y = -section * (i + 0.5);
      leg.add(tube);
      if (i < TUBES.length - 1) {
        const lock = cylinder(d / 2 + 2.5, 30, rubber);
        lock.position.y = -section * (i + 1) + 12;
        leg.add(lock);
      }
    });
    const foot = cylinder(9, 26, rubber);
    foot.position.y = -length + 8;
    leg.add(foot);
    const cap = cylinder(30, 34, head, 3); // leg hinge on the spider
    cap.scale.set(0.5, 1, 0.5);
    cap.position.y = 6;
    leg.add(cap);
    g.add(leg);
  }
  g.position.set(SOCKET.x, 0, SOCKET.z);
  return g;
}

export function Tripod({ casing }: { casing: string }) {
  const { scene } = useGLTF("/models/stand_gen2.glb", false, true);
  const mats = useMemo(
    () => ({
      // The bracket is printed in the casing colour; the tripod is Sirui's dark titanium aluminium.
      bracket: new THREE.MeshStandardMaterial({ color: casing, roughness: 0.78, side: THREE.DoubleSide }),
      nut: new THREE.MeshStandardMaterial({ color: "#9a9ea2", roughness: 0.35, metalness: 0.9 }),
      logo_white: new THREE.MeshStandardMaterial({ color: "#f5f5f4", roughness: 0.6 }),
      logo_green: new THREE.MeshStandardMaterial({ color: "#22d36b", roughness: 0.6 }),
      metal: new THREE.MeshStandardMaterial({ color: "#3a3d40", roughness: 0.38, metalness: 0.65 }),
      head: new THREE.MeshStandardMaterial({ color: "#26282a", roughness: 0.45, metalness: 0.5 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#121313", roughness: 0.92 }),
    }),
    [casing],
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const bracket = useMemo(() => {
    const g = new THREE.Group();
    scene.updateMatrixWorld(true);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.name === "nut" ? mats.nut : m.name === "logo_white" ? mats.logo_white : m.name === "logo_green" ? mats.logo_green : mats.bracket;
      const copy = new THREE.Mesh(m.geometry, mat);
      copy.applyMatrix4(m.matrixWorld);
      copy.castShadow = true;
      g.add(copy);
    });
    return g;
  }, [scene, mats]);
  const tripod = useMemo(() => buildTripod(mats.metal, mats.rubber, mats.head), [mats]);
  useEffect(
    () => () =>
      tripod.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      }),
    [tripod],
  );

  return (
    <>
      <primitive object={bracket} />
      <primitive object={tripod} />
    </>
  );
}
