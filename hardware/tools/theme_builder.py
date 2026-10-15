#!/usr/bin/env python3
"""Build a Selfiebox event theme: printable casing parts + the matching screen theme.

One theme file (themes/<id>/theme.json) drives everything:
  casing   wings (left/right), topper, sign front, printer front, each with
           multi-colour artwork inlaid in the first layers of the face
  light    ring-light palette and animation (for the LED driver)
  screen   CSS variables, wave bands and ticker for the app, plus a photo
           overlay so the printed photo carries the same artwork

Artwork comes from a procedural style ("waves", "neon", "confetti") or from your
own SVGs: put one SVG per colour in themes/<id>/art/<part>/<colour>.svg (filled
shapes, mm units, origin bottom-left of the part face) and they replace the style.

Output (themes/<id>/build/):
  <part>__<colour>.stl     print-oriented, one file per filament
  <part>.3mf               all colours of a part as one multi-part object
  preview/<part>.svg/.png  flat previews
  ui/theme.css, ui/bands.svg, ui/overlay.png, ui/theme.json   -> copied to static/themes/<id>/

Usage: python3 hardware/tools/theme_builder.py themes/sommernat
Needs: openscad, trimesh, manifold3d, shapely, mapbox_earcut, cairosvg, svgelements
"""
import json
import math
import random
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import shapely
import trimesh
from shapely import affinity
from shapely.geometry import Point, Polygon, box
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[2]
SCAD = ROOT / "hardware" / "cad" / "halo.scad"

INLAY_D = 0.8          # inlay depth: 4 layers at 0.2 mm
FACE_T = 3.0           # wing / topper face thickness
EDGE_KEEP = 1.6        # keep artwork off the chamfered edge
MIN_FEATURE = 1.2      # smallest printable art feature (3 nozzle widths)


# ----------------------------------------------------------------- geometry --
def scad_geom():
    out = subprocess.run(["openscad", "-D", 'PART="geom"', "-o", "/tmp/selfiebox_geom.csg", str(SCAD)],
                         capture_output=True, text=True).stderr
    vals = json.loads(re.search(r"GEOM = (\[.*?\])", out).group(1))
    keys = ["W", "H", "D", "R", "SIDE_Y", "BZ0", "BZ1", "H_SIGN", "H_PRN", "PRN_Z", "SPACER_T",
            "EDGE_CH", "M3_CLR", "INS_M3_D", "INS_M3_L", "PRN_FRONT_W", "PRN_FRONT_H"]
    return dict(zip(keys, vals))


def scad_part(part, **defs):
    tmp = Path(tempfile.mkdtemp()) / f"{part}.stl"
    cmd = ["openscad", "-D", f'PART="{part}"']
    for k, v in defs.items():
        cmd += ["-D", f'{k}={json.dumps(v)}']
    subprocess.run(cmd + ["-o", str(tmp), str(SCAD)], check=True, capture_output=True)
    return trimesh.load(tmp)


def extrude_xz(geom, y0, y1):
    """Extrude a shapely (x, z) polygon along +y from y0 to y1."""
    polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    meshes = []
    for p in polys:
        if p.is_empty or p.area < 0.05:
            continue
        m = trimesh.creation.extrude_polygon(p, y1 - y0)
        m.apply_transform(np.array([[1, 0, 0, 0], [0, 0, 1, y0], [0, 1, 0, 0], [0, 0, 0, 1]], float))
        if m.volume < 0:
            m.invert()
        meshes.append(m)
    return trimesh.util.concatenate(meshes) if meshes else None


def boolean(kind, meshes):
    meshes = [m for m in meshes if m is not None and len(m.faces)]
    fn = {"union": trimesh.boolean.union, "diff": trimesh.boolean.difference, "inter": trimesh.boolean.intersection}[kind]
    return fn(meshes, engine="manifold")


def cyl_x(d, x0, x1, y, z):
    c = trimesh.creation.cylinder(radius=d / 2, height=x1 - x0, sections=32)
    c.apply_transform(trimesh.transformations.rotation_matrix(math.pi / 2, [0, 1, 0]))
    c.apply_translation([(x0 + x1) / 2, y, z])
    return c


def cyl_z(d, z0, z1, x, y):
    c = trimesh.creation.cylinder(radius=d / 2, height=z1 - z0, sections=32)
    c.apply_translation([x, y, (z0 + z1) / 2])
    return c


def cube(x0, x1, y0, y1, z0, z1):
    b = trimesh.creation.box(extents=[x1 - x0, y1 - y0, z1 - z0])
    b.apply_translation([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2])
    return b


# ------------------------------------------------------------- silhouettes --
def smooth_curve(n, length, amp, waves, rng):
    """Sum of three sines: a soft, hand-drawn looking edge."""
    phases = [rng.uniform(0, 2 * math.pi) for _ in range(3)]
    t = np.linspace(0, 1, n)
    return amp * (np.sin(2 * math.pi * waves * t + phases[0]) * 0.6
                  + np.sin(2 * math.pi * waves * 1.7 * t + phases[1]) * 0.3
                  + np.sin(2 * math.pi * waves * 3.1 * t + phases[2]) * 0.1)


def edge_profile(style, length, depth, rng):
    """Outward edge offsets (0..depth) along a run of `length` mm."""
    n = max(60, int(length))
    t = np.linspace(0, length, n)
    if style == "hills":
        off = depth * 0.62 + smooth_curve(n, length, depth * 0.38, length / 90, rng)
    elif style == "clouds":
        off = np.full(n, depth * 0.5)
        x = 0.0
        while x < length:
            r = rng.uniform(0.28, 0.5) * depth
            off = np.maximum(off, depth * 0.45 + np.sqrt(np.clip(r ** 2 - (t - x) ** 2, 0, None)))
            x += r * rng.uniform(1.0, 1.5)
        off = np.minimum(off, depth)
    elif style == "spikes":
        period = depth * 0.9
        off = depth * 0.45 + depth * 0.55 * (1 - np.abs(((t / period) % 1.0) * 2 - 1))
    else:                                             # straight
        off = np.full(n, depth * 0.8)
    return t, np.clip(off, depth * 0.3, depth)


# ------------------------------------------------------------------ artwork --
def star4(cx, cy, r):
    pts = []
    for i in range(8):
        a = i * math.pi / 4 + math.pi / 2
        rr = r if i % 2 == 0 else r * 0.28
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return Polygon(pts)


def art_waves(bounds, keys, rng, bands=4, cover=0.45, top=True):
    """Layered organic hills from the bottom, starry sky above, a soft band at the top."""
    x0, z0, x1, z1 = bounds
    w, h = x1 - x0, z1 - z0
    layers = [(keys["sky"], box(x0, z0, x1, z1))]
    xs = np.linspace(x0 - 2, x1 + 2, 200)
    hill_keys = keys["hills"]
    hill_top = z0 + h * cover
    for i in range(bands):
        frac = 1 - i / bands
        base = z0 + (hill_top - z0) * frac
        amp = max(3.0, min(14.0, w * 0.06 + 3))
        ys = base + smooth_curve(len(xs), w, amp, w / 70 + 0.6, rng)
        pts = [(xs[0], z0 - 2)] + list(zip(xs, ys)) + [(xs[-1], z0 - 2)]
        layers.append((hill_keys[i % len(hill_keys)], Polygon(pts)))
    if top and h > 60:
        ys = z1 - h * 0.07 + smooth_curve(len(xs), w, min(6, h * 0.03), w / 80 + 0.5, rng)
        layers.append((keys["top"], Polygon([(xs[0], z1 + 2)] + list(zip(xs, ys)) + [(xs[-1], z1 + 2)])))
    sky_lo, sky_hi = hill_top + 8, z1 - h * 0.1
    n_stars = int(w * max(0.0, sky_hi - sky_lo) / 450)
    stars = []
    for _ in range(n_stars):
        cx, cz = rng.uniform(x0 + 3, x1 - 3), rng.uniform(sky_lo, sky_hi)
        stars.append(Point(cx, cz).buffer(rng.uniform(0.8, 1.3), 12) if rng.random() < 0.8 else star4(cx, cz, rng.uniform(3, 5)))
    if stars:
        layers.append((keys["stars"], unary_union(stars)))
    return layers


def art_neon(bounds, keys, rng, lines=5, **_):
    """Black ground with fluorescent zig-zag and arc strokes (glows under club UV)."""
    x0, z0, x1, z1 = bounds
    w, h = x1 - x0, z1 - z0
    layers = [(keys["sky"], box(x0, z0, x1, z1))]
    strokes = {k: [] for k in keys["hills"]}
    for i in range(lines):
        k = keys["hills"][i % len(keys["hills"])]
        if i % 2 == 0:
            zc = z0 + h * rng.uniform(0.15, 0.85)
            amp, period = rng.uniform(3, 8), rng.uniform(10, 18)
            xs = np.arange(x0 - 5, x1 + 5, period / 2)
            pts = [(x, zc + (amp if j % 2 else -amp)) for j, x in enumerate(xs)]
            strokes[k].append(shapely.LineString(pts).buffer(0.9, cap_style="round", join_style="mitre"))
        else:
            cx, cz = rng.uniform(x0, x1), rng.uniform(z0, z1)
            r = rng.uniform(min(w, h) * 0.3, min(w, h) * 0.7)
            strokes[k].append(Point(cx, cz).buffer(r + 0.9, 64).difference(Point(cx, cz).buffer(r - 0.9, 64)))
    for k, s in strokes.items():
        if s:
            layers.append((k, unary_union(s)))
    return layers


def art_confetti(bounds, keys, rng, density=1.0, **_):
    x0, z0, x1, z1 = bounds
    layers = [(keys["sky"], box(x0, z0, x1, z1))]
    by_key = {k: [] for k in keys["hills"]}
    n = int((x1 - x0) * (z1 - z0) / 140 * density)
    for _ in range(n):
        k = rng.choice(keys["hills"])
        cx, cz = rng.uniform(x0, x1), rng.uniform(z0, z1)
        if rng.random() < 0.5:
            by_key[k].append(Point(cx, cz).buffer(rng.uniform(1.0, 2.2), 16))
        else:
            r = affinity.rotate(box(cx - 3, cz - 0.8, cx + 3, cz + 0.8), rng.uniform(0, 180))
            by_key[k].append(r)
    for k, s in by_key.items():
        if s:
            layers.append((k, unary_union(s)))
    return layers


def text_shape(text, centre, height, max_width, font="Liberation Sans:style=Bold"):
    """Text as shapely polygons (mm), centred, scaled to fit height and width."""
    from matplotlib.font_manager import FontProperties, findfont
    from matplotlib.textpath import TextPath
    fp = FontProperties(family="Liberation Sans", weight="bold")
    tp = TextPath((0, 0), text, size=10, prop=fp)
    polys = []
    for poly in tp.to_polygons():
        if len(poly) > 2:
            polys.append(Polygon(poly).buffer(0))
    # even-odd: letters with counters (O, A, R) come back as outer + inner rings
    shape = Polygon()
    for p in sorted(polys, key=lambda q: -q.area):
        shape = shape.symmetric_difference(p)
    minx, miny, maxx, maxy = shape.bounds
    k = min(height / (maxy - miny), max_width / (maxx - minx))
    shape = affinity.scale(shape, k, k, origin=(0, 0))
    minx, miny, maxx, maxy = shape.bounds
    return affinity.translate(shape, centre[0] - (minx + maxx) / 2, centre[1] - (miny + maxy) / 2)


STYLES = {"waves": art_waves, "neon": art_neon, "confetti": art_confetti}


def svg_layers(folder, bounds):
    """Custom art: one SVG per colour, mm units, origin bottom-left of the face."""
    from svgelements import SVG, Path as SPath, Shape
    x0, z0, _, z1 = bounds
    layers = []
    for f in sorted(folder.glob("*.svg")):
        svg = SVG.parse(str(f))
        polys = []
        for el in svg.elements():
            if isinstance(el, Shape):
                for sub in SPath(el).as_subpaths():
                    pts = [(p.x, p.y) for p in SPath(sub).npoint(np.linspace(0, 1, 120))]
                    if len(pts) > 3:
                        polys.append(Polygon([(x0 + x, z0 + (svg.height - y)) for x, y in pts]).buffer(0))
        if polys:
            layers.append((f.stem, unary_union(polys)))
    return layers


def resolve(layers, region):
    """Back-to-front layers -> visible, non-overlapping region per colour."""
    visible = {}
    covered = Polygon()
    for key, geom in reversed(layers):
        g = geom.intersection(region).difference(covered)
        g = g.buffer(-MIN_FEATURE / 2).buffer(MIN_FEATURE / 2)      # drop unprintable slivers
        if not g.is_empty:
            visible[key] = visible.get(key, Polygon()).union(g)
        covered = covered.union(geom.intersection(region))
    return visible


# ------------------------------------------------------------------- parts --
def wing_part(G, spec, side, rng):
    hw = G["W"] / 2
    x0 = hw + 0.2
    z0, z1 = G["R"], G["H"] - G["R"]
    depth = spec.get("width", 45)
    t, off = edge_profile(spec.get("edge", "hills"), z1 - z0, depth, rng)
    pts = [(x0, z0)] + [(x0 + o, z0 + tt) for tt, o in zip(t, off)] + [(x0, z1)]
    outline = Polygon(pts).buffer(-3).buffer(3)
    face = extrude_xz(outline, 0, FACE_T)
    rib = cube(x0, x0 + 4, 0, 20, z0 + 4, z1 - 4)
    stiff = []
    for zr in np.linspace(z0 + 25, z1 - 25, 5):
        if min(abs(zr - G["BZ0"]), abs(zr - G["BZ1"])) > 10:
            stiff.append(extrude_xz(box(x0, zr - 1, x0 + depth * 0.25, zr + 1).intersection(outline), FACE_T - 0.01, FACE_T + 5))
    body = boolean("union", [face, rib] + stiff)
    holes = [cyl_x(G["M3_CLR"], x0 - 1, x0 + 5, G["SIDE_Y"], z) for z in (G["BZ0"], G["BZ1"])]
    body = boolean("diff", [body] + holes)
    region = outline.buffer(-EDGE_KEEP)
    if side < 0:
        m = np.diag([-1.0, 1, 1, 1])
        body.apply_transform(m)
        if body.volume < 0:
            body.invert()
        region = affinity.scale(region, -1, 1, origin=(0, 0))
    return body, region


def topper_part(G, spec, rng):
    hw = G["W"] / 2
    th = spec.get("height", 110)
    t, off = edge_profile(spec.get("edge", "clouds"), G["W"], th * 0.55, rng)
    top = [(-hw + tt, th * 0.45 + o) for tt, o in zip(t, off)]
    outline = Polygon([(-hw, 0)] + top + [(hw, 0)]).buffer(-4).buffer(4)
    outline = outline.intersection(box(-hw, 0, hw, th + 1))
    outline = outline.difference(box(-hw - 1, -1, -hw + G["R"], G["R"]).difference(Point(-hw + G["R"], G["R"]).buffer(G["R"], 48)))
    outline = outline.difference(box(hw - G["R"], -1, hw + 1, G["R"]).difference(Point(hw - G["R"], G["R"]).buffer(G["R"], 48)))
    face = extrude_xz(outline, 0, FACE_T)
    base = cube(-(hw - G["R"] - 2), hw - G["R"] - 2, 3, 62, 0, 12)
    ribs = [cube(x - 1, x + 1, FACE_T - 0.01, 10, 12, th * 0.6) for x in (-60, 0, 60)]
    body = boolean("union", [face, base] + ribs)
    holes = [cyl_z(G["INS_M3_D"], -1, G["INS_M3_L"], x, 44) for x in (-55, 55)]
    holes += [cyl_z(6.2, -1, 8, x, 50) for x in (-30, 30)]
    body = boolean("diff", [body] + holes)
    region = outline.buffer(-EDGE_KEEP)
    keep_out, text = Polygon(), Polygon()
    if spec.get("text"):
        text = text_shape(CURRENT["sign_text"], (0, th * 0.47), th * 0.2, hw * 1.3)
        keep_out = text.buffer(3)
    return body, region, keep_out, text


def themed_front(G, part, defs, keep_out_fn):
    mesh = scad_part(part, **defs)
    h = G["H_SIGN"] if part == "sign_front" else G["H_PRN"]
    hw = G["W"] / 2
    outline = box(-hw, 0, hw, h).buffer(-G["R"]).buffer(G["R"])
    region = outline.buffer(-EDGE_KEEP).difference(keep_out_fn(G, mesh))
    return mesh, region


def sign_keep_out(G, mesh):
    # the backlit letters cut through the face: keep 3 mm of plain colour around them
    letters = scad_part("sign_letters", SIGN_TEXT=CURRENT["sign_text"])
    b = letters.bounds
    return box(b[0][0] - 3, b[0][2] - 3, b[1][0] + 3, b[1][2] + 3)


def printer_keep_out(G, mesh):
    w, h = G["PRN_FRONT_W"] + 6, G["PRN_FRONT_H"] + 6
    return box(-w / 2, G["PRN_Z"] - h / 2, w / 2, G["PRN_Z"] + h / 2)


def inlay(body, colours):
    """Split a part into its base body and one inlay body per colour."""
    parts = {}
    cutters = []
    for key, geom in colours.items():
        slab = extrude_xz(geom, -0.01, INLAY_D)
        if slab is None:
            continue
        piece = boolean("inter", [slab, body])
        if piece is not None and len(piece.faces):
            parts[key] = piece
            cutters.append(slab)
    base = boolean("diff", [body] + cutters) if cutters else body
    return base, parts


# ------------------------------------------------------------------ export --
FACE_DOWN = np.array([[1, 0, 0, 0], [0, 0, -1, 0], [0, 1, 0, 0], [0, 0, 0, 1]], float)


ASSEMBLED = trimesh.Scene()


def export_part(name, base, inlays, palette, out):
    meshes = {"base": base, **inlays}
    for key, m in meshes.items():          # installed position, for viewers and renders
        a = m.copy(); a.visual.face_colors = trimesh.visual.color.hex_to_rgba(palette[key]["hex"])
        ASSEMBLED.add_geometry(a, node_name=f"{name}__{key}", geom_name=f"{name}__{key}")
    centre = None
    scene = trimesh.Scene()
    for key, m in meshes.items():
        m = m.copy()
        m.apply_transform(FACE_DOWN)
        if centre is None:
            lo = base.copy(); lo.apply_transform(FACE_DOWN)
            centre = -np.array([(lo.bounds[0][0] + lo.bounds[1][0]) / 2, (lo.bounds[0][1] + lo.bounds[1][1]) / 2, lo.bounds[0][2]])
        m.apply_translation(centre)
        colour = palette[key]["hex"]
        m.visual.face_colors = trimesh.visual.color.hex_to_rgba(colour)
        m.export(out / f"{name}__{key}.stl")
        scene.add_geometry(m, node_name=f"{name}__{key}", geom_name=f"{name}__{key}")
    scene.export(out / f"{name}.3mf")


def preview_svg(name, region, colours, palette, out, show=()):
    minx, minz, maxx, maxz = region.buffer(EDGE_KEEP + 2).bounds
    w, h = maxx - minx, maxz - minz
    def path(g):
        polys = [g] if g.geom_type == "Polygon" else [p for p in getattr(g, "geoms", []) if p.geom_type == "Polygon"]
        d = ""
        for p in polys:
            for ring in [p.exterior] + list(p.interiors):
                pts = [(x - minx, maxz - z) for x, z in ring.coords]
                d += "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z "
        return d
    body = [f'<path d="{path(Polygon(region.buffer(EDGE_KEEP).exterior) if region.geom_type == "Polygon" else region.buffer(EDGE_KEEP))}" fill="{palette["base"]["hex"]}"/>']
    for key, g in colours.items():
        body.append(f'<path d="{path(g)}" fill="{palette[key]["hex"]}" fill-rule="evenodd"/>')
    for g, colour in show:
        body.append(f'<path d="{path(g)}" fill="{colour}" fill-rule="evenodd"/>')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" width="{w*4:.0f}" height="{h*4:.0f}">{"".join(body)}</svg>'
    (out / f"{name}.svg").write_text(svg)
    import cairosvg
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(out / f"{name}.png"))


# -------------------------------------------------------------- screen UI --
def ui_assets(theme, palette, keys, rng, out):
    out.mkdir(parents=True, exist_ok=True)
    style = STYLES[theme["casing"].get("style", "waves")]
    p = {k: v["hex"] for k, v in palette.items()}
    # wave bands for the top and bottom of the screen and of the printed photo (1200 x 1920 px).
    # The art is drawn in "mm" like the casing (1 mm = 4 px), so strokes and waves keep the same look.
    w, h, px = 1200.0, 1920.0, 4.0
    seed = theme.get("seed", 1)
    bottom = [l for l in style((0, 0, w / px, 95), keys, random.Random(seed), top=False) if l[0] != keys["sky"]]
    top = [l for l in style((0, 0, w / px, 55), keys, random.Random(seed + 7), top=False) if l[0] != keys["sky"]]

    def ring(coords, flip):
        return "M" + " L".join(f"{x * px:.1f},{(y * px if flip else h - y * px):.1f}" for x, y in coords) + " Z "

    def paths(layers, flip):
        s = ""
        for key, g in layers:
            polys = [g] if g.geom_type == "Polygon" else [q for q in getattr(g, "geoms", []) if q.geom_type == "Polygon"]
            d = "".join(ring(q.exterior.coords, flip) + "".join(ring(i.coords, flip) for i in q.interiors) for q in polys)
            s += f'<path d="{d}" fill="{p[key]}" fill-rule="evenodd"/>'
        return s
    bands = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" preserveAspectRatio="none">'
             f'{paths(bottom, False)}{paths(top, True)}</svg>')
    (out / "bands.svg").write_text(bands)
    import cairosvg
    cairosvg.svg2png(bytestring=bands.encode(), write_to=str(out / "overlay.png"), output_width=1200, output_height=1920)
    s = theme["screen"]
    css = (":root {\n"
           f"  --theme-bg: {p[s.get('background', keys['sky'])]};\n"
           f"  --theme-fg: {s.get('text', '#ffffff')};\n"
           f"  --theme-accent: {p[s.get('accent', keys['hills'][0])]};\n"
           f"  --theme-ticker-bg: {p[s.get('ticker_bg', keys['hills'][0])]};\n"
           f"  --theme-ticker-fg: {s.get('ticker_fg', '#ffffff')};\n"
           f"  --theme-font: {s.get('font', 'system-ui, sans-serif')};\n"
           "}\n")
    (out / "theme.css").write_text(css)
    (out / "theme.json").write_text(json.dumps({
        "name": theme["name"], "ticker": s.get("ticker", ""), "cta": s.get("cta", "Tap to take a photo"),
        "countdown": s.get("countdown", [3, 2, 1]), "light": theme["light"]}, indent=2, ensure_ascii=False))


# -------------------------------------------------------------------- main --
CURRENT = {}


def main(theme_dir):
    theme_dir = Path(theme_dir).resolve()
    theme = json.loads((theme_dir / "theme.json").read_text())
    palette = theme["palette"]
    keys = theme["casing"]["roles"]
    style = STYLES[theme["casing"].get("style", "waves")]
    G = scad_geom()
    out = theme_dir / "build"
    if out.exists():
        shutil.rmtree(out)
    (out / "preview").mkdir(parents=True)
    CURRENT["sign_text"] = theme["casing"].get("sign_text", "CLUB NAME")
    parts = theme["casing"]["parts"]
    report = []

    def make(name, body, region, keep_out=Polygon(), seed_off=0, extra=None, show=None):
        rng = random.Random(theme.get("seed", 1) + seed_off)
        custom = theme_dir / "art" / name
        if custom.is_dir() and any(custom.glob("*.svg")):
            layers = svg_layers(custom, region.bounds)
        else:
            layers = style(region.bounds, keys, rng, **theme["casing"].get("style_options", {}).get(name, {}))
        colours = resolve(layers, region.difference(keep_out))
        for k, g in (extra or {}).items():
            colours[k] = colours.get(k, Polygon()).union(g)
        colours.pop("base", None)
        for k in [k for k in colours if palette[k]["hex"].lower() == palette["base"]["hex"].lower()]:
            colours.pop(k)      # same filament as the body: no inlay needed
        base, inlays = inlay(body, colours)
        export_part(name, base, inlays, palette, out)
        preview_svg(name, region, colours, palette, out / "preview", show or [])
        report.append((name, sorted(inlays)))

    if "wings" in parts:
        for side, nm in ((1, "wing_right"), (-1, "wing_left")):
            body, region = wing_part(G, parts["wings"], side, random.Random(theme.get("seed", 1) + 3))
            make(nm, body, region, seed_off=11 if side > 0 else 12)
    if "topper" in parts:
        body, region, keep_out, text = topper_part(G, parts["topper"], random.Random(theme.get("seed", 1) + 5))
        make("topper", body, region, keep_out, seed_off=21, extra={keys["stars"]: text})
    if "sign" in parts:
        body, region = themed_front(G, "sign_front", {"SIGN_TEXT": CURRENT["sign_text"]}, sign_keep_out)
        letters = scad_part("sign_letters", SIGN_TEXT=CURRENT["sign_text"])
        sec = letters.section(plane_origin=[0, 1.0, 0], plane_normal=[0, 1, 0])
        glyphs = Polygon()
        if sec:
            for ring in sorted((Polygon([(v[0], v[2]) for v in d]).buffer(0) for d in sec.discrete), key=lambda q: -q.area):
                glyphs = glyphs.symmetric_difference(ring)      # even-odd keeps the counters open
        make("sign_front", body, region, seed_off=31, show=[(glyphs, "#fff4dc")])
    if "printer" in parts:
        body, region = themed_front(G, "printer_front", {}, printer_keep_out)
        pw, ph = G["PRN_FRONT_W"], G["PRN_FRONT_H"]
        make("printer_front", body, region, seed_off=41, show=[(box(-pw/2, G["PRN_Z"] - ph/2, pw/2, G["PRN_Z"] + ph/2), "#2a2a2e")])

    ASSEMBLED.export(out / "theme_parts.glb")
    ui = out / "ui"
    ui_assets(theme, palette, keys, random.Random(theme.get("seed", 1)), ui)
    static = ROOT / "static" / "themes" / theme_dir.name
    if static.exists():
        shutil.rmtree(static)
    shutil.copytree(ui, static)

    print(f"Theme '{theme['name']}' built in {out}")
    for name, cols in report:
        print(f"  {name:14s} base + {', '.join(cols)}")
    used = sorted({c for _, cols in report for c in cols} | {"base"})
    print(f"  filaments used: {len(used)} -> " + ", ".join(f"{k} {palette[k]['hex']} ({palette[k]['filament']})" for k in used))
    print(f"  screen theme -> static/themes/{theme_dir.name}/")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ROOT / "themes" / "sommernat")
