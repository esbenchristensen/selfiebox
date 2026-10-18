import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import HALO_GLB from "./halo-model.js";

// All measures in mm. Y is up. The box interior runs x -170..170, z -120..120, y 0..200.
const L = 340, W = 240, H = 200, WALL = 4;

const canvas = document.getElementById("v3d");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 5, 6000);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 100, 0);
controls.minDistance = 300;
controls.maxDistance = 2200;
controls.maxPolarAngle = Math.PI * 0.49;

scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8478, 1.25));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(380, 900, 520);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -700, right: 700, top: 700, bottom: -700, near: 100, far: 2500 });
sun.shadow.bias = -0.0004;
scene.add(sun);
const fill = new THREE.DirectionalLight(0xfff3e3, 0.6);
fill.position.set(-600, 300, -300);
scene.add(fill);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), new THREE.ShadowMaterial({ opacity: 0.16 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -WALL - 0.5;
ground.receiveShadow = true;
scene.add(ground);

// ---------- materials ----------
const tex = (url, rep) => {
  const t = new THREE.TextureLoader().load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};
const canvasTex = (w, h, draw) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};
const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o });

const M = {
  kraft: std(0xc4955c, { roughness: 0.95 }),
  kraftIn: std(0xd8b585, { roughness: 0.95 }),
  foamBase: std(0x4b504b, { roughness: 1 }),
  foamTray: std(0x3a3e3a, { roughness: 1 }),
  strap: std(0x22d36b, { roughness: 0.7 }),
  tripod: std(0x1d1f22, { roughness: 0.45, metalness: 0.35 }),
  tripodRing: std(0x5b6066, { roughness: 0.35, metalness: 0.7 }),
  rubber: std(0x111111, { roughness: 0.9 }),
  psu: std(0x2a2c2e, { roughness: 0.55 }),
  cable: std(0x111214, { roughness: 0.6 }),
  white: std(0xeeeeea, { roughness: 0.6 }),
  velcro: std(0x0e0f0e, { roughness: 1 }),
  tape: std(0x0e0f0e, { roughness: 0.5 }),
  pocket: new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, transmission: 0, transparent: true, opacity: 0.35 }),
};

// ---------- helpers ----------
function box(w, h, d, mat, x, y, z, label) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  if (label) m.userData.label = label;
  return m;
}
function paper(w, d, map, x, y, z, label, rot = 0) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ map, roughness: 0.8 });
  const sheet = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, d), [M.white, M.white, mat, M.white, M.white, M.white]);
  sheet.castShadow = sheet.receiveShadow = true;
  sheet.userData.label = label;
  g.add(sheet);
  g.position.set(x, y, z);
  g.rotation.y = rot;
  return g;
}

// Every movable part registers here. order = pack step it appears in, layer = height in the exploded view.
const parts = [];
function part(name, obj, order, layer) {
  obj.traverse((o) => {
    if (o.isMesh) {
      o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone();
      if (!o.userData.label) o.userData.label = name;
    }
  });
  const holder = new THREE.Group();
  holder.add(obj);
  scene.add(holder);
  const p = { name, holder, order, layer, y: 0, op: 1 };
  parts.push(p);
  return p;
}
const lab = (t, d) => ({ t, d });

// ---------- 0: cardboard box with four flaps ----------
const carton = new THREE.Group();
const kraftLabel = lab("Papkasse Husted 790163", "340 × 240 × 200 mm indvendigt, standardkasse med 4 flapper");
carton.add(box(L + 2 * WALL, WALL, W + 2 * WALL, M.kraft, 0, -WALL / 2, 0, kraftLabel));
for (const s of [-1, 1]) {
  carton.add(box(L + 2 * WALL, H, WALL, [M.kraft, M.kraft, M.kraft, M.kraft, s > 0 ? M.kraft : M.kraftIn, s > 0 ? M.kraftIn : M.kraft].map((m) => m), 0, H / 2, s * (W / 2 + WALL / 2), kraftLabel));
  carton.add(box(WALL, H, W, M.kraft, s * (L / 2 + WALL / 2), H / 2, 0, kraftLabel));
}
carton.traverse((o) => { if (o.isMesh && Array.isArray(o.material)) o.material = M.kraft; });
// Flaps: short (inner) flaps on the end walls, long (outer) flaps on the side walls that meet in the middle.
const flaps = [];
function flap(axis, sign, len, span, lift, label) {
  const pivot = new THREE.Group();
  const isLong = axis === "x";
  pivot.position.set(isLong ? 0 : sign * (L / 2 + WALL), H, isLong ? sign * (W / 2 + WALL) : 0);
  const m = isLong
    ? box(span, 3, len, M.kraft, 0, lift, -sign * len / 2, label)
    : box(len, 3, span, M.kraft, -sign * len / 2, lift, 0, label);
  pivot.add(m);
  carton.add(pivot);
  flaps.push({ pivot, axis, sign, mesh: m });
  return m;
}
const flapLabel = lab("Flap", "Kassens egne flapper er låget");
for (const s of [-1, 1]) flap("z", s, 118, W + 2 * WALL, 1.5, flapLabel);
const longFlaps = [-1, 1].map((s) => flap("x", s, 124, L + 2 * WALL, 4.6, flapLabel));
// Lid sticker on the back flap, label pocket on the front flap, both on the outside.
const sticker = new THREE.Mesh(new THREE.PlaneGeometry(150, 100), new THREE.MeshStandardMaterial({ map: tex("img/maerkat.png"), roughness: 0.6 }));
sticker.rotation.x = -Math.PI / 2;
sticker.position.set(-70, 1.6, 0);
sticker.userData.label = lab("Lågmærkat 150 × 100", "Fortæller at kassen skal retur, og hvor returlabelen ligger");
longFlaps[0].add(sticker);
const labelTex = canvasTex(600, 900, (g, w, h) => {
  g.fillStyle = "#fff"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#111"; g.font = "bold 96px Geist, sans-serif"; g.fillText("dao", 40, 120);
  g.font = "34px Geist, sans-serif"; g.fillText("Pakkeshop · retur", 40, 175);
  g.fillRect(40, 205, w - 80, 4);
  g.font = "30px Geist, sans-serif";
  ["Til: Selfi", "Eksempel på label", "Byttes ind i lommen", "af kunden"].forEach((t, i) => g.fillText(t, 40, 270 + i * 44));
  for (let x = 40, i = 0; x < w - 40; i++) { const bw = 3 + ((i * 7) % 5) * 2; g.fillRect(x, 470, bw, 220); x += bw + 4 + (i % 3) * 3; }
  g.font = "bold 64px Geist Mono, monospace"; g.fillText("123 456 789", 70, 790);
});
const pocket = new THREE.Group();
const lbl = new THREE.Mesh(new THREE.PlaneGeometry(100, 150), new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.7 }));
lbl.rotation.x = -Math.PI / 2;
lbl.rotation.z = Math.PI / 2;
lbl.userData.label = lab("Label i plastlomme", "Udlabel fra os. Kunden lægger returlabelen ovenpå i samme lomme");
pocket.add(lbl);
const sleeve = new THREE.Mesh(new THREE.BoxGeometry(160, 0.8, 112), M.pocket);
sleeve.position.y = 0.6;
sleeve.userData.label = lbl.userData.label;
pocket.add(sleeve);
pocket.position.set(80, 1.7, 0);
longFlaps[1].add(pocket);
const cartonPart = part("Papkasse", carton, 0, 0);
cartonPart.fixed = true;

// Tape across the closed lid, only in the last step.
const tape = new THREE.Group();
tape.add(box(L + 2 * WALL + 1, 0.6, 48, M.tape, 0, H + 7.8, 0, lab("Pakketape", "Lukker låget langs samlingen")));
for (const s of [-1, 1]) tape.add(box(0.6, 60, 48, M.tape, s * (L / 2 + WALL + 0.4), H - 22, 0, lab("Pakketape", "Lukker låget langs samlingen")));
const tapePart = part("Pakketape", tape, 7, 0);
tapePart.fixed = true;

// ---------- 1: base frame, glued into the box ----------
const base = new THREE.Group();
const baseLabel = lab("Del 1 · Bundramme", "Limet fast i kassen. Bundplade 5 mm og to endeklodser 17 × 92 mm");
base.add(box(L, 5, W, M.foamBase, 0, 2.5, 0, baseLabel));
for (const s of [-1, 1]) base.add(box(17, 87, W, M.foamBase, s * (L / 2 - 8.5), 5 + 43.5, 0, baseLabel));
part("Bundramme", base, 1, 0.55);

// ---------- 2: Halo, screen up ----------
const halo = new THREE.Group();
const haloPart = part("Halo", halo, 2, 1.3);
function haloFallback() {
  const g = new THREE.Mesh(new THREE.BoxGeometry(306, 85, 222.5), std(0x0b0b0d, { roughness: 0.7 }));
  g.position.y = 5 + 42.5;
  g.castShadow = true;
  g.userData.label = lab("Halo", "306 × 222,5 × 85 mm");
  halo.add(g);
}
const screenTex = canvasTex(440, 700, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, "#151715"); gr.addColorStop(1, "#0b0c0b");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "#22D36B"; g.beginPath(); g.arc(w / 2, h * 0.42, 16, 0, 7); g.fill();
  g.fillStyle = "#FFF3E3"; g.textAlign = "center";
  g.font = "600 74px 'Instrument Sans', sans-serif"; g.fillText("selfi", w / 2, h * 0.53);
  g.font = "26px Geist, sans-serif"; g.fillStyle = "#a3a8a3"; g.fillText("Tryk for at tage et billede", w / 2, h * 0.6);
});
function bake(m) {
  const g = new THREE.BufferGeometry();
  for (const [k, a] of Object.entries(m.geometry.attributes)) {
    const f = new Float32Array(a.count * a.itemSize);
    const get = ["getX", "getY", "getZ", "getW"];
    for (let i = 0; i < a.count; i++) for (let c = 0; c < a.itemSize; c++) f[i * a.itemSize + c] = a[get[c]](i);
    g.setAttribute(k, new THREE.BufferAttribute(f, a.itemSize));
  }
  if (m.geometry.index) g.setIndex(m.geometry.index);
  g.applyMatrix4(m.matrixWorld);
  g.computeVertexNormals();
  return g;
}
const loadHalo = new Promise((done) => {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const bin = Uint8Array.from(atob(HALO_GLB), (c) => c.charCodeAt(0)).buffer;
  loader.parse(bin, "", (gltf) => {
    const body = std(0x0b0b0d, { roughness: 0.78 });
    const light = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3e3, emissiveIntensity: 0.45, roughness: 0.4 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x050507, roughness: 0.1, clearcoat: 1 });
    const lens = std(0x0a0a0c, { roughness: 0.2, metalness: 0.4 });
    const use = { bezel: body, shell_closed: body, diffuser_ring: light, shell_closed_band: light, v_display: glass, v_camera: lens };
    gltf.scene.updateMatrixWorld(true);
    const unit = new THREE.Group();
    gltf.scene.traverse((o) => {
      if (!o.isMesh || !use[o.name]) return; // only the main unit, never the photo module
      const m = new THREE.Mesh(bake(o), use[o.name]);
      m.castShadow = m.receiveShadow = true;
      unit.add(m);
    });
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(136.4, 217.6), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
    scr.position.set(0, 151.85, -3.4);
    unit.add(scr);
    // Model: y = height, +z = front. In the box: height along x, screen facing up.
    unit.applyMatrix4(new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)));
    const bb = new THREE.Box3().setFromObject(unit);
    const c = bb.getCenter(new THREE.Vector3());
    unit.position.set(-c.x, 5 - bb.min.y, -c.z);
    unit.traverse((o) => { if (o.isMesh) o.userData.label = lab("Halo fotoboks", "306 × 222,5 × 85 mm. Ligger med skærmen op, uden egen kasse"); });
    halo.add(unit);
    haloPart.holder.traverse((o) => { if (o.isMesh) o.material = o.material.clone(); });
    done();
  }, (err) => { console.error("halo", err && err.message); haloFallback(); done(); });
});

// ---------- 3: top tray, one glued part ----------
const tray = new THREE.Group();
const trayLabel = lab("Del 2 · Topbakke", "Én limet del med fire rum. Bund 5 mm, ramme 10 mm, løftes i to stropper");
const T0 = 92, FLOOR = 5, TOP = 192, RH = TOP - T0 - FLOOR, RY = T0 + FLOOR + RH / 2;
tray.add(box(L, FLOOR, W, M.foamTray, 0, T0 + FLOOR / 2, 0, trayLabel));
for (const s of [-1, 1]) {
  tray.add(box(L, RH, 10, M.foamTray, 0, RY, s * (W / 2 - 5), trayLabel));
  tray.add(box(5, RH, 96, M.foamTray, s * (L / 2 - 2.5), RY, -62, trayLabel)); // 5 mm at the tripod, which is 330 long
  tray.add(box(10, RH, 124, M.foamTray, s * (L / 2 - 5), RY, 48, trayLabel));
}
tray.add(box(L - 20, RH, 10, M.foamTray, 0, RY, -9, trayLabel)); // divider between the tripod and the accessory lane
for (const x of [-10, 80]) tray.add(box(10, RH, 114, M.foamTray, x + 5, RY, 53, trayLabel));
// Saddles with a round cut-out for the tripod (lane z -110..-14, tripod axis at y 144).
const TZ = -62, TY = 136, TR = 38;
for (const x0 of [-110, 80]) {
  const s = new THREE.Shape();
  const top = T0 + FLOOR + 50, dy = top - TY, dx = Math.sqrt(TR * TR - dy * dy), a = Math.atan2(dy, dx);
  s.moveTo(-110, T0 + FLOOR); s.lineTo(-14, T0 + FLOOR); s.lineTo(-14, top); s.lineTo(TZ + dx, top);
  s.absarc(TZ, TY, TR, a, Math.PI - a, true);
  s.lineTo(-110, top); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 30, bevelEnabled: false, curveSegments: 32 });
  const m = new THREE.Mesh(g, M.foamTray);
  m.rotation.y = -Math.PI / 2;
  m.position.x = x0 + 30;
  m.castShadow = m.receiveShadow = true;
  m.userData.label = lab("Sadel til stativet", "30 mm skum med rund udskæring, limet i bakken");
  tray.add(m);
}
for (const x of [-70, 60]) {
  const st = new THREE.Group();
  const sl = lab("Løftestrop", "Stofbånd 25 mm. Kunden løfter bakken op i de to stropper");
  st.add(box(25, 1.5, 14, M.strap, x + 12.5, TOP + 0.8, -W / 2 + 9, sl));
  st.add(box(25, 40, 1.5, M.strap, x + 12.5, TOP - 19, -W / 2 + 10.8, sl));
  tray.add(st);
}
part("Topbakke", tray, 3, 2.15);

// ---------- 4: tripod, folded ----------
const tri = new THREE.Group();
const triLabel = lab("Stativ Sirui Traveler 5AX", "Sammenklappet 330 mm, maks. 138 cm, ca. 1 kg");
const cyl = (r, len, mat, x, y, z) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 28), mat);
  m.rotation.z = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  m.userData.label = triLabel;
  return m;
};
for (let i = 0; i < 3; i++) {
  const a = (i / 3) * Math.PI * 2 + 0.5, oy = Math.sin(a) * 22, oz = Math.cos(a) * 22;
  tri.add(cyl(12.5, 215, M.tripod, -45, oy, oz));
  tri.add(cyl(10.5, 50, M.tripod, -175 + 25 + 10, oy, oz));
  for (const x of [-120, -55, 10]) tri.add(cyl(14, 9, M.tripodRing, x, oy, oz));
  tri.add(cyl(11, 10, M.rubber, -158, oy, oz));
}
tri.add(cyl(36, 26, M.tripod, 78, 0, 0));
tri.add(cyl(30, 12, M.tripodRing, 98, 0, 0));
const ball = new THREE.Mesh(new THREE.SphereGeometry(25, 32, 20), M.tripodRing);
ball.position.set(128, 0, 0);
ball.castShadow = true;
ball.userData.label = triLabel;
tri.add(ball);
tri.add(cyl(26, 14, M.tripod, 156, 0, 0));
tri.position.set(0, TY, TZ);
part("Stativ", tri, 4, 3.1);

// ---------- 5: accessories ----------
const acc = new THREE.Group();
const psuL = lab("Strømforsyning GST90A12", "145 × 60 × 32 mm, 450 g, 1 m DC-kabel");
acc.add(box(145, 32, 60, M.psu, -85, T0 + FLOOR + 16, 53, psuL));
const plate = new THREE.Mesh(new THREE.PlaneGeometry(70, 34), new THREE.MeshStandardMaterial({ map: canvasTex(280, 136, (g, w, h) => { g.fillStyle = "#cfd2cf"; g.fillRect(0, 0, w, h); g.fillStyle = "#222"; g.font = "bold 30px Geist"; g.fillText("MEAN WELL", 16, 48); g.font = "22px Geist Mono"; g.fillText("GST90A12  12V 6A", 16, 90); }) }));
plate.rotation.x = -Math.PI / 2;
plate.position.set(-95, T0 + FLOOR + 32.2, 53);
plate.userData.label = psuL;
acc.add(plate);
function coil(r, tube, mat, x, y, z, n, label) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(r - i * 1.2, tube, 12, 48), mat);
    t.rotation.x = Math.PI / 2;
    t.position.set(x + (i % 2) * 2, y + tube + i * tube * 1.7, z + (i % 3) - 1);
    t.castShadow = t.receiveShadow = true;
    t.userData.label = label;
    g.add(t);
  }
  return g;
}
const cabL = lab("Kabler og velcro", "Strømkabel til væggen og to velcrobånd");
acc.add(coil(30, 3.4, M.cable, 45, T0 + FLOOR, 30, 5, cabL));
acc.add(box(20, 14, 12, M.cable, 45, T0 + FLOOR + 7, 90, cabL));
for (const dz of [0, 8]) acc.add(box(60, 3, 20, M.velcro, 45, T0 + FLOOR + 22 + dz / 4, 80 - dz, cabL));
const extL = lab("Forlængerledning 3 m", "Til fester hvor stikkontakten sidder langt væk");
acc.add(coil(28, 3.8, M.white, 125, T0 + FLOOR, 30, 6, extL));
acc.add(box(26, 30, 38, M.white, 125, T0 + FLOOR + 15, 88, extL));
part("Tilbehør", acc, 5, 3.1);

// ---------- 6: print on top ----------
const papers = new THREE.Group();
const Y0 = TOP + 2;
const rl = paper(150, 100, labelTex, 95, Y0, 40, lab("Returlabel", "Ligger klar. Kunden lægger den i lommen på låget"), Math.PI / 2);
const tapeRoll = new THREE.Mesh(new THREE.BoxGeometry(48, 1, 120), M.tape);
tapeRoll.position.set(128, Y0, -60);
tapeRoll.castShadow = tapeRoll.receiveShadow = true;
tapeRoll.userData.label = lab("Tape til returen", "Ca. 1 m pakketape");
const guide = paper(148, 210, tex("img/guide-for.png"), -40, Y0 + 1.2, 6, lab("Startguide A5", "Opsætning på forsiden, nedpakning og retur på bagsiden"));
const card = paper(297, 210, tex("img/laagkort.png"), -10, Y0 + 2.4, 0, lab("Lågkort A4", "Det første kunden ser: Hej. Start med guiden."));
papers.add(rl, tapeRoll, guide, card);
const papersPart = part("Tryksager", papers, 6, 3.9);
papersPart.sub = [rl, tapeRoll, guide, card];

// ---------- steps ----------
const STEPS = [
  ["Tom kasse", "Husted 790163, 340 × 240 × 200 mm indvendigt. Almindelig standardkasse med fire flapper."],
  ["Bundramme", "Del 1 limes fast i kassen: bundplade 5 mm og to endeklodser. Den bliver altid i kassen."],
  ["Halo", "Halo lægges med skærmen op mellem endeklodserne. 17 mm skum i hver ende, ingen ekstra kasse."],
  ["Topbakke", "Del 2 hviler på endeklodserne med 2 mm luft over skærmen. Løftes i de to grønne stropper."],
  ["Stativ", "Stativet ligger i to sadler med runde udskæringer langs den ene side."],
  ["Tilbehør", "Strømforsyning, kabler med velcro og forlængerledning har hvert sit rum."],
  ["Tryksager", "Returlabel og tape nederst, så startguiden og lågkortet øverst."],
  ["Lukket", "Flapperne lukkes og tapes. Label i plastlommen og mærkat på låget. Ca. 4,2 kg."],
];
let step = STEPS.length - 1, explode = 0, xray = false;
const stepsEl = document.getElementById("steps");
STEPS.forEach(([t], i) => {
  const b = document.createElement("button");
  b.innerHTML = `<i>${i + 1}</i>${t}`;
  b.onclick = () => { stopPlay(); setStep(i); };
  stepsEl.append(b);
});
function setStep(i) {
  step = i;
  [...stepsEl.children].forEach((b, j) => b.classList.toggle("on", j === i));
  document.getElementById("stepTitle").textContent = `${i + 1}. ${STEPS[i][0]}`;
  document.getElementById("stepText").textContent = STEPS[i][1];
  stepsEl.children[i].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
}
let timer = null;
const playBtn = document.getElementById("play");
function stopPlay() { clearInterval(timer); timer = null; playBtn.textContent = "▶ Afspil nedpakning"; }
playBtn.onclick = () => {
  if (timer) return stopPlay();
  explode = 0; document.getElementById("explode").value = 0;
  setStep(0);
  playBtn.textContent = "■ Stop";
  timer = setInterval(() => { if (step >= STEPS.length - 1) return stopPlay(); setStep(step + 1); }, 1500);
};
document.getElementById("explode").oninput = (e) => {
  explode = +e.target.value;
};
document.getElementById("xray").onchange = (e) => (xray = e.target.checked);

// ---------- views ----------
const VIEWS = { iso: [520, 700, 680], top: [0, 1150, 40], side: [0, 170, 1150] };
let fly = null;
document.querySelectorAll(".views button").forEach((b) => (b.onclick = () => {
  document.querySelectorAll(".views button").forEach((x) => x.classList.toggle("on", x === b));
  fly = { from: camera.position.clone(), to: new THREE.Vector3(...VIEWS[b.dataset.view]), t: 0 };
}));
camera.position.set(...VIEWS.iso);

// ---------- hover labels ----------
const tip = document.getElementById("tip");
const ray = new THREE.Raycaster();
const ptr = new THREE.Vector2();
canvas.addEventListener("pointermove", (e) => {
  const r = canvas.getBoundingClientRect();
  ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(scene.children, true).filter((h) => h.object.visible && h.object.userData.label && visibleChain(h.object) && !(xray && h.object.userData.label === kraftLabel));
  const hit = hits[0];
  if (!hit) { tip.hidden = true; return; }
  const { t, d } = hit.object.userData.label;
  tip.innerHTML = `<b>${t}</b>${d}`;
  tip.style.left = e.clientX - r.left + "px";
  tip.style.top = e.clientY - r.top + "px";
  tip.hidden = false;
});
canvas.addEventListener("pointerleave", () => (tip.hidden = true));
function visibleChain(o) { for (; o; o = o.parent) if (!o.visible) return false; return true; }

// ---------- animation ----------
function setOpacity(p, op, extra) {
  p.holder.visible = op > 0.01;
  p.holder.traverse((o) => {
    if (!o.isMesh) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      const base = m.userData.base ?? (m.userData.base = m.opacity);
      const want = base * op * (extra ?? 1);
      m.opacity = want;
      const tr = want < 0.999 || base < 0.999;
      if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
      m.depthWrite = want > 0.5;
    }
  });
}
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
}
const ease = (k) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);
let flapA = 0, camZoom = 0, last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  resize();
  const k = window.__snap ? 1 : 1 - Math.pow(0.0015, dt);
  const closed = step === STEPS.length - 1 && explode < 0.02;
  for (const p of parts) {
    if (p.fixed) continue;
    const shown = p.order <= step || (p === tapePart ? false : explode > 0.02 && p.order <= 6);
    const ty = shown ? p.layer * explode * 110 : 260;
    p.y += (ty - p.y) * k;
    p.op += ((shown ? 1 : 0) - p.op) * k;
    p.holder.position.y = p.y;
    setOpacity(p, p.op);
  }
  // Papers fan out a little on their own when exploded.
  papersPart.sub.forEach((o, i) => (o.position.y = Y0 + i * 1.2 + i * explode * 16));
  tapePart.holder.position.y = 0;
  setOpacity(tapePart, tapePart.op = tapePart.op + ((closed ? 1 : 0) - tapePart.op) * k);
  // Flaps open unless the box is closed.
  flapA += ((closed ? 0 : 1) - flapA) * k;
  for (const f of flaps) {
    const long = f.axis === "x";
    const open = long ? Math.PI / 2 + 1.05 : Math.PI / 2 + 0.75;
    // Closing order: short flaps first, then the long ones on top.
    const a = long ? ease(Math.min(1, flapA * 1.6)) : ease(Math.max(0, flapA * 1.6 - 0.6));
    const ang = open * Math.max(a, long ? 0 : a);
    if (long) f.pivot.rotation.x = f.sign * ang;
    else f.pivot.rotation.z = -f.sign * ang;
  }
  setOpacity(cartonPart, 1, xray ? 0.16 : 1);
  if (fly) {
    fly.t = Math.min(1, fly.t + dt * 1.6);
    camera.position.lerpVectors(fly.from, fly.to, ease(fly.t));
    if (fly.t >= 1) fly = null;
  }
  // Follow the exploded stack: lift the target and pull back a little.
  const ty = 100 + explode * 190;
  const dyT = (ty - controls.target.y) * k;
  controls.target.y += dyT;
  camera.position.y += dyT;
  if (Math.abs(explode - camZoom) > 1e-4) {
    const next = camZoom + (explode - camZoom) * k;
    const off = camera.position.clone().sub(controls.target).multiplyScalar((1 + 0.55 * next) / (1 + 0.55 * camZoom));
    camera.position.copy(controls.target).add(off);
    camZoom = next;
  }
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
loadHalo.then(() => {
  document.getElementById("loading").remove();
  for (const p of parts) setOpacity(p, 1);
  setStep(STEPS.length - 1);
  requestAnimationFrame(frame);
  window.__ready = true;
});

window.__set = (o) => { if (o.step != null) setStep(o.step); if (o.explode != null) explode = o.explode; if (o.xray != null) xray = o.xray; if (o.cam) camera.position.set(...o.cam); };
