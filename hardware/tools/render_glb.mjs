// Renders of a hardware GLB with three.js in headless Chromium, so the pictures match the admin 3D viewer
// (real part colours: the white and green logo shows, which OpenSCAD's own renderer turns almost black).
//
// Usage: node hardware/tools/render_glb.mjs <model.glb> <parts.json> <views.json>
// views.json: [{ "out": "x.png", "az": -30, "el": 14, "explode": 0, "hide": ["konsol"], "dist": 1.0 }]
//   az/el in degrees (az 0 = straight from the front), explode multiplies the parts.json offsets,
//   hide lists nodes or groups that are left out, dist scales the camera distance.
// Needs Playwright (Chromium) and three from web/node_modules (npm install in web/).
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(join(ROOT, "web/package.json"));
const THREE_DIR = dirname(dirname(require.resolve("three")));
const { chromium } = await import(process.env.PLAYWRIGHT_MJS ?? "playwright");

const [glb, partsFile, viewsFile] = process.argv.slice(2);
const parts = JSON.parse(readFileSync(partsFile, "utf8"));
const views = JSON.parse(readFileSync(viewsFile, "utf8"));

const PAGE = `<html><body style="margin:0;background:#f3f4f1">
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
const W = 1600, H = 1200;
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
r.setSize(W, H); r.setClearColor("#f3f4f1"); r.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(r.domElement);
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.35;
const key = new THREE.DirectionalLight("#ffffff", 1.8); key.position.set(-300, 500, 700); scene.add(key);
scene.add(new THREE.HemisphereLight("#ffffff", "#c9c5bd", 0.5));
const gltf = await new GLTFLoader().loadAsync("/model.glb");
scene.add(gltf.scene);
gltf.scene.traverse((o) => { if (o.isMesh) { o.geometry.computeVertexNormals(); o.material.side = THREE.DoubleSide; } });
const parts = await (await fetch("/parts.json")).json();
const nodes = parts.map((p) => { const obj = gltf.scene.getObjectByName(p.node); return obj && { p, obj, p0: obj.position.clone() }; }).filter(Boolean);
const cam = new THREE.PerspectiveCamera(26, W / H, 1, 20000);
window.shot = (v) => {
  const hide = v.hide ?? [];
  for (const n of nodes) {
    n.obj.visible = !hide.includes(n.p.node) && !hide.includes(n.p.group);
    const e = n.p.explode; n.obj.position.copy(n.p0).add(new THREE.Vector3(e[0], e[1], e[2]).multiplyScalar(v.explode ?? 0));
  }
  gltf.scene.updateMatrixWorld(true);
  const box = new THREE.Box3();
  for (const n of nodes) if (n.obj.visible) box.expandByObject(n.obj);
  const c = box.getCenter(new THREE.Vector3()), rad = box.getBoundingSphere(new THREE.Sphere()).radius;
  const az = (v.az ?? -30) * Math.PI / 180, el = (v.el ?? 14) * Math.PI / 180;
  const d = rad / Math.sin(cam.fov * Math.PI / 360) * 1.05 * (v.dist ?? 1);
  cam.position.set(c.x + Math.sin(az) * Math.cos(el) * d, c.y + Math.sin(el) * d, c.z + Math.cos(az) * Math.cos(el) * d);
  cam.lookAt(c); cam.updateProjectionMatrix();
  r.render(scene, cam);
  return r.domElement.toDataURL("image/png");
};
window.ready = true;
</script></body></html>`;

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
await page.route("http://render.local/**", (route) => {
  const p = new URL(route.request().url()).pathname;
  if (p === "/") return route.fulfill({ contentType: "text/html", body: PAGE });
  if (p === "/model.glb") return route.fulfill({ contentType: "model/gltf-binary", body: readFileSync(glb) });
  if (p === "/parts.json") return route.fulfill({ contentType: "application/json", body: JSON.stringify(parts) });
  if (p.startsWith("/three/")) return route.fulfill({ contentType: "text/javascript", body: readFileSync(join(THREE_DIR, p.slice(7))) });
  return route.fulfill({ status: 404, body: "" });
});
await page.goto("http://render.local/");
await page.waitForFunction("window.ready", null, { timeout: 60000 });
for (const v of views) {
  const url = await page.evaluate((v) => window.shot(v), v);
  writeFileSync(v.out, Buffer.from(url.split(",")[1], "base64"));
  console.log(v.out);
}
await browser.close();
