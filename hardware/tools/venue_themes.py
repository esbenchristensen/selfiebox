#!/usr/bin/env python3
"""Venue themes for Selfiebox Halo: wings and a topper drawn for one venue, with its logo inlaid.

theme_builder.py makes themes from procedural styles. This builds hand-designed ones: every part has
its own silhouette (a beech canopy, the Orange Scene, a stack of bricks, a giraffe) and the venue's
logo, and the casing, the ring light, the screen and the photo frame follow the same palette.

The printed parts reuse theme_builder's mounting geometry unchanged: wings hang on a 4 mm rib through
the two side screws (M3 x 12), the topper sits on the top joint spacer with 2 x M3 x 16 and two dowels.
Colours are 0.8 mm inlays in the face, printed face down on the H2C.

Output per theme, in themes/<id>/build/:
  <part>__<colour>.stl, <part>.3mf, preview/<part>.svg/.png     printable parts (as theme_builder)
  web/parts.glb      the parts in installed position, for the website's 3D viewer
  web/screen.png     the idle screen
  web/print.png      the Instax frame (photo window left transparent)
  web/logo.svg       the logo in colour
  web/theme.json     palette, casing colour and ring light for the viewer

Usage: python3 hardware/tools/venue_themes.py [theme-id ...]       (all themes when none given)
Needs: trimesh, manifold3d, shapely, mapbox_earcut, cairosvg, matplotlib, opencv-python-headless
Logos: logos/<id>.geo.json (traced, one geometry per colour) is used when present, otherwise the
logo is drawn here. Replace it with the venue's official artwork before anything leaves the house.
"""
import base64
import io
import json
import math
import random
import sys
from pathlib import Path

import numpy as np
import shapely
import trimesh
from matplotlib.font_manager import FontProperties
from matplotlib.textpath import TextPath
from shapely import affinity
from shapely.geometry import LineString, Point, Polygon, box
from shapely.ops import unary_union

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
import theme_builder as tb  # noqa: E402

ROOT = TOOLS.parents[1]

# Unit geometry, as halo.scad reports it with PART="geom" (rev G). Hard-coded so the
# themes build without OpenSCAD; check them against `openscad -D 'PART="geom"'` after a revision.
G = dict(W=234.0, H=306.0, D=66.0, R=24.0, SIDE_Y=10.0, BZ0=66.8, BZ1=239.2, H_SIGN=72.0, H_PRN=84.0,
         PRN_Z=38.0, SPACER_T=6.0, EDGE_CH=1.2, M3_CLR=3.4, INS_M3_D=4.0, INS_M3_L=6.4,
         PRN_FRONT_W=82.0, PRN_FRONT_H=58.0)
HW = G["W"] / 2
X0 = HW + 0.2                      # inner edge of a wing
# Gen 2 (gen2_concept.scad): one concentric squircle outline, 222.5 wide with a 7.8 mm border to the light ring,
# 70 mm deep since v5 (85 mm before), and no side screws: wings hang on two M3 inserts per side in the back wall at x = ±(W/2 - 12).
G2 = dict(G, W=222.5, D=70.0, R=42.8, WING_X=222.5 / 2 - 12)


def use_unit(unit):
    """Point the shared geometry at rev G or gen 2 before a theme's parts are drawn."""
    global G, HW, X0
    G = G2 if unit == "gen2" else G_REVG
    HW = G["W"] / 2
    X0 = HW + 0.2


G_REVG = G
BED = (271.0, 292.0)               # H2C plate minus 7 mm each side


# ------------------------------------------------------------------ shapes --
def U(*gs):
    return unary_union([g for g in gs if g is not None and not g.is_empty])


def ell(cx, cz, rx, rz, rot=0):
    e = affinity.scale(Point(0, 0).buffer(1, 48), rx, rz)
    return affinity.translate(affinity.rotate(e, rot, origin=(0, 0)), cx, cz)


def line(pts, w):
    return LineString(pts).buffer(w / 2, cap_style="round", join_style="round")


def heart(cx, cz, s, rot=0):
    """Heart, `s` mm wide, point down."""
    r = s * 0.28
    g = U(Point(cx - r * 0.95, cz + r * 0.35).buffer(r, 32), Point(cx + r * 0.95, cz + r * 0.35).buffer(r, 32),
          Polygon([(cx - s * 0.49, cz + r * 0.1), (cx + s * 0.49, cz + r * 0.1), (cx, cz - s * 0.52)]))
    return affinity.rotate(g, rot, origin=(cx, cz))


def star4(cx, cz, r):
    return tb.star4(cx, cz, r)


def pine(cx, z0, w, h, tiers=3):
    parts = [box(cx - w * 0.07, z0, cx + w * 0.07, z0 + h * 0.18)]
    for i in range(tiers):
        b = z0 + h * (0.12 + i * 0.26)
        ww = w * (1 - i * 0.22) / 2
        parts.append(Polygon([(cx - ww, b), (cx + ww, b), (cx, b + h * (0.5 - i * 0.04))]))
    return U(*parts)


def hills_poly(x0, x1, base, amp, waves, rng, z_floor=-50):
    xs = np.linspace(x0 - 2, x1 + 2, 160)
    ys = base + tb.smooth_curve(len(xs), x1 - x0, amp, waves, rng)
    return Polygon([(xs[0], z_floor)] + list(zip(xs, ys)) + [(xs[-1], z_floor)])


def scatter(rng, n, bounds, f):
    x0, z0, x1, z1 = bounds
    return U(*[f(rng.uniform(x0, x1), rng.uniform(z0, z1), rng) for _ in range(n)])


_fonts = {}


def text(s, font, cx, cz, height, width=None, anchor="middle"):
    """Text as polygons in mm: cap height about `height`, at most `width` wide, centred on (cx, cz)."""
    fp = _fonts.setdefault(font, FontProperties(fname=str(TOOLS / "fonts" / f"{font}.ttf")))
    tp = TextPath((0, 0), s, size=10, prop=fp)
    shape = Polygon()
    for poly in sorted((Polygon(p).buffer(0) for p in tp.to_polygons() if len(p) > 2), key=lambda q: -q.area):
        shape = shape.symmetric_difference(poly)
    ref = TextPath((0, 0), "H", size=10, prop=fp).get_extents()
    k = height / ref.height
    minx, miny, maxx, maxy = shape.bounds
    if width and (maxx - minx) * k > width:
        k = width / (maxx - minx)
    shape = affinity.scale(shape, k, k, origin=(0, 0))
    minx, _, maxx, _ = shape.bounds
    dx = {"middle": cx - (minx + maxx) / 2, "start": cx - minx, "end": cx - maxx}[anchor]
    return affinity.translate(shape, dx, cz - ref.height * k / 2)


def fit(g, bounds, keep_aspect=True):
    """Scale and move geometry `g` into bounds (x0, z0, x1, z1), centred."""
    gx0, gz0, gx1, gz1 = g.bounds
    x0, z0, x1, z1 = bounds
    kx, kz = (x1 - x0) / (gx1 - gx0), (z1 - z0) / (gz1 - gz0)
    if keep_aspect:
        kx = kz = min(kx, kz)
    g = affinity.scale(g, kx, kz, origin=(gx0, gz0))
    gx0, gz0, gx1, gz1 = g.bounds
    return affinity.translate(g, (x0 + x1) / 2 - (gx0 + gx1) / 2, (z0 + z1) / 2 - (gz0 + gz1) / 2)


def mirror(g):
    return affinity.scale(g, -1, 1, origin=(0, 0))


# ------------------------------------------------------------------- logos --
def traced_logo(tid):
    """A traced logo: {colour key: geometry} in image pixels (y down). None if there is none."""
    f = TOOLS / "logos" / f"{tid}.geo.json"
    if not f.exists():
        return None
    return {k: shapely.from_geojson(v) for k, v in json.loads(f.read_text()).items()}


def place_logo(layers_px, bounds, order):
    """Turn a traced logo into back-to-front (key, geometry) layers fitted into bounds (mm, z up)."""
    allg = U(*layers_px.values())
    flip = {k: affinity.scale(g, 1, -1, origin=(0, 0)) for k, g in layers_px.items()}
    allg = affinity.scale(allg, 1, -1, origin=(0, 0))
    gx0, gz0, gx1, gz1 = allg.bounds
    x0, z0, x1, z1 = bounds
    k = min((x1 - x0) / (gx1 - gx0), (z1 - z0) / (gz1 - gz0))
    ox = (x0 + x1) / 2 - (gx0 + gx1) / 2 * k
    oz = (z0 + z1) / 2 - (gz0 + gz1) / 2 * k
    out = []
    for src, dst in order:
        g = flip.get(src)
        if g is None or g.is_empty:
            continue
        g = affinity.translate(affinity.scale(g, k, k, origin=(0, 0)), ox, oz)
        out.append((dst, g))
    return out


def legoland_logo(bounds):
    lg = traced_logo("legoland")
    lg["white"] = U(*[p for p in getattr(lg["white"], "geoms", [lg["white"]]) if p.bounds[0] > 255])   # drop the sun
    lg["black"] = U(*[p for p in getattr(lg["black"], "geoms", [lg["black"]]) if p.area > 6])
    return place_logo(lg, bounds, [("black", "black"), ("red", "red"), ("yellow", "base"), ("white", "white")])


def smukfest_tree(cx, z0, h):
    """Beech with a heart-shaped crown: Smukfest's mark, drawn after the description in its design manual."""
    crown = heart(cx, z0 + h * 0.62, h * 0.78)
    trunk = Polygon([(cx - h * 0.045, z0 + h * 0.08), (cx + h * 0.045, z0 + h * 0.08), (cx + h * 0.03, z0 + h * 0.5), (cx - h * 0.03, z0 + h * 0.5)])
    roots = U(line([(cx, z0 + h * 0.12), (cx - h * 0.14, z0)], h * 0.035), line([(cx, z0 + h * 0.12), (cx + h * 0.14, z0)], h * 0.035),
              line([(cx, z0 + h * 0.1), (cx, z0)], h * 0.04))
    branches = U(line([(cx, z0 + h * 0.4), (cx - h * 0.12, z0 + h * 0.55)], h * 0.03), line([(cx, z0 + h * 0.44), (cx + h * 0.13, z0 + h * 0.6)], h * 0.03))
    # branches into the crown, in the background colour
    gaps = U(line([(cx, z0 + h * 0.42), (cx - h * 0.04, z0 + h * 0.56), (cx - h * 0.2, z0 + h * 0.74)], h * 0.022),
             line([(cx - h * 0.06, z0 + h * 0.6), (cx - h * 0.08, z0 + h * 0.78)], h * 0.016),
             line([(cx, z0 + h * 0.42), (cx + h * 0.05, z0 + h * 0.58), (cx + h * 0.22, z0 + h * 0.75)], h * 0.022),
             line([(cx + h * 0.08, z0 + h * 0.63), (cx + h * 0.1, z0 + h * 0.8)], h * 0.016))
    return U(crown.difference(gaps), trunk, roots, branches)


def roskilde_canopy(cx, z0, w, h, seams=True):
    """The Orange Scene canopy: Roskilde's logo has been drawn from it since 1978."""
    arch = ell(cx, z0, w / 2, h).intersection(box(cx - w, z0, cx + w, z0 + h * 2))
    # scalloped front edge between the legs
    n = 5
    bites = U(*[ell(cx - w / 2 + w * (i + 0.5) / n, z0, w / n / 2 * 0.92, h * 0.16) for i in range(n)])
    shape = arch.difference(bites)
    if seams:
        cuts = U(*[line([(cx, z0 - h * 0.3), (cx + math.cos(a) * w, z0 + math.sin(a) * h * 2)], max(1.4, w * 0.012))
                   for a in np.linspace(math.radians(28), math.radians(152), 6)])
        shape = shape.difference(cuts)
    return shape


def giraffe_neck(u0, z0, z1, w, out):
    """A giraffe neck rising from z0 to z1 with the head turned outward (`out` mm past the neck)."""
    neck = Polygon([(u0, z0), (u0 + w, z0), (u0 + w * 0.62, z1 - 22), (u0 + w * 0.12, z1 - 18)])
    head = ell(u0 + w * 0.4 + out * 0.45, z1 - 10, out * 0.55, 9, -12)
    muzzle = ell(u0 + w * 0.4 + out * 0.92, z1 - 14, 7.5, 6.5)
    horns = U(line([(u0 + w * 0.32, z1 - 6), (u0 + w * 0.26, z1 + 6)], 3.2), line([(u0 + w * 0.5, z1 - 6), (u0 + w * 0.52, z1 + 6.5)], 3.2),
              Point(u0 + w * 0.26, z1 + 6).buffer(3, 16), Point(u0 + w * 0.52, z1 + 6.5).buffer(3, 16))
    ear = ell(u0 + w * 0.12, z1 - 4, 8, 3.2, 25)
    mane = U(*[ell(u0 + w * 0.06 + (z - z0) / (z1 - z0) * w * 0.08, z, 2.6, 4) for z in np.arange(z0 + 10, z1 - 24, 9)])
    return U(neck, head, muzzle, horns, ear, mane)


def acacia(cx, z0, w, h):
    """Flat-topped savanna acacia: a wide layered crown on a forked trunk."""
    top = z0 + h
    canopy = U(Polygon([(cx - w / 2, top - h * 0.14), (cx - w * 0.36, top - h * 0.02), (cx + w * 0.38, top), (cx + w / 2, top - h * 0.12), (cx + w * 0.2, top - h * 0.2), (cx - w * 0.3, top - h * 0.2)]).buffer(w * 0.03),
               ell(cx - w * 0.26, top - h * 0.2, w * 0.2, h * 0.07), ell(cx + w * 0.28, top - h * 0.22, w * 0.18, h * 0.06))
    t = max(3.0, w * 0.07)
    trunk = U(line([(cx, z0), (cx + w * 0.02, z0 + h * 0.45)], t),
              line([(cx + w * 0.02, z0 + h * 0.45), (cx - w * 0.22, top - h * 0.2)], t * 0.7),
              line([(cx + w * 0.02, z0 + h * 0.45), (cx + w * 0.24, top - h * 0.22)], t * 0.7),
              line([(cx - w * 0.1, z0 + h * 0.62), (cx - w * 0.02, top - h * 0.15)], t * 0.5))
    return U(canopy, trunk)


def coaster(pts, rail=2.2, ties=True, z_floor=0, support_every=14):
    """A roller-coaster track along `pts` with support legs down to z_floor."""
    path = LineString(pts)
    track = path.buffer(rail / 2, cap_style="round")
    second = path.parallel_offset(3.2, "left", join_style=2) if path.length > 0 else None
    track = U(track, second.buffer(rail / 2 * 0.8) if second is not None and not second.is_empty else None)
    legs = []
    if ties:
        for d in np.arange(support_every / 2, path.length, support_every):
            p = path.interpolate(d)
            if p.y - z_floor > 8:
                legs.append(line([(p.x, p.y - 1), (p.x, z_floor)], 1.6))
    return U(track, *legs)


# --------------------------------------------------------------- the parts --
def cyl_y(d, y0, y1, x, z):
    c = trimesh.creation.cylinder(radius=d / 2, height=y1 - y0, sections=32)
    c.apply_transform(trimesh.transformations.rotation_matrix(math.pi / 2, [1, 0, 0]))
    c.apply_translation([x, (y0 + y1) / 2, z])
    return c


def wing_body(outline):
    """theme_builder's wing, with a free outline. `outline` is the right wing in unit coordinates."""
    outline = outline.intersection(box(X0, -50, X0 + 80, G["H"] + 60)).buffer(-1.5).buffer(1.5)
    strip = outline.intersection(box(X0, -50, X0 + 4, 400))
    z0, z1 = strip.bounds[1], strip.bounds[3]
    face = tb.extrude_xz(outline, 0, tb.FACE_T)
    rib = tb.cube(X0, X0 + 4, 0, 20, z0 + 4, z1 - 4)
    stiff = []
    reach = outline.bounds[2] - X0
    for zr in np.linspace(z0 + 25, z1 - 25, 5):
        if min(abs(zr - G["BZ0"]), abs(zr - G["BZ1"])) > 10:
            s = box(X0, zr - 1, X0 + reach * 0.3, zr + 1).intersection(outline)
            stiff.append(tb.extrude_xz(s, tb.FACE_T - 0.01, tb.FACE_T + 5))
    if "WING_X" in G:
        # Gen 2: the rib runs back along the side and turns in behind the back wall as a tab per insert.
        rib = tb.cube(X0, X0 + 4, 0, G["D"] + 3, z0 + 4, z1 - 4)
        tabs = [tb.cube(G["WING_X"] - 8, X0 + 4, G["D"] + 0.2, G["D"] + 3, z - 9, z + 9) for z in (G["BZ0"], G["BZ1"])]
        body = tb.boolean("union", [face, rib] + tabs + stiff)
        holes = [cyl_y(G["M3_CLR"], G["D"] - 1, G["D"] + 4, G["WING_X"], z) for z in (G["BZ0"], G["BZ1"])]
        return tb.boolean("diff", [body] + holes), outline
    body = tb.boolean("union", [face, rib] + stiff)
    holes = [tb.cyl_x(G["M3_CLR"], X0 - 1, X0 + 5, G["SIDE_Y"], z) for z in (G["BZ0"], G["BZ1"])]
    return tb.boolean("diff", [body] + holes), outline


def topper_outline(outline):
    """The topper's printed outline: the theme's outline on the mounting strip, rounded at the box's top corners."""
    outline = U(outline, box(-HW, 0, HW, 14)).buffer(-2).buffer(2)
    r = G["R"]
    for sx in (-1, 1):   # follow the box's rounded top corners where the outline is as wide as the box
        corner = box(min(sx * HW, sx * (HW - r)), -1, max(sx * HW, sx * (HW - r)), r)
        if outline.bounds[0] > -HW - 1 and outline.bounds[2] < HW + 1:
            outline = outline.difference(corner.difference(Point(sx * (HW - r), r).buffer(r, 48)))
    return outline


def topper_body(outline):
    """theme_builder's topper, with a free outline. z = 0 is the top of the joint spacer (gen 2: of the unit)."""
    r = G["R"]
    outline = topper_outline(outline)
    th = outline.bounds[3]
    face = tb.extrude_xz(outline, 0, tb.FACE_T)
    base = tb.cube(-(HW - r - 2), HW - r - 2, 3, 62, 0, 12)
    ribs = []
    for x in (-60, 0, 60):
        col = outline.intersection(box(x - 1, 0, x + 1, 400))
        top = col.bounds[3] if not col.is_empty else 20
        ribs.append(tb.cube(x - 1, x + 1, tb.FACE_T - 0.01, 10, 12, max(14, min(th * 0.6, top - 8))))
    body = tb.boolean("union", [face, base] + ribs)
    holes = [tb.cyl_z(G["INS_M3_D"], -1, G["INS_M3_L"], x, 44) for x in (-55, 55)]
    holes += [tb.cyl_z(6.2, -1, 8, x, 50) for x in (-30, 30)]
    return tb.boolean("diff", [body] + holes), outline


# ----------------------------------------------------------------- themes --
# Each theme: palette (key -> hex, filament), casing colour, ring light, texts, and three art functions.
# Art functions return back-to-front (colour key, geometry) lists in part coordinates (mm, z up).

def wing_strip(width, z0=26, z1=280):
    return box(X0, z0, X0 + width, z1)


THEMES = {}


def theme(fn):
    THEMES[fn.__name__] = fn()
    return fn


@theme
def smukfest():
    pal = {"base": "#0f3d24", "forest": "#1c5a33", "leaf": "#3f8f3a", "lime": "#9cc94a", "red": "#e2001a", "cream": "#f6eedc", "bark": "#5a3b22"}

    def canopy_edge(u_in, u_out, z0, z1, rng):
        blobs = [box(X0, z0, X0 + u_in, z1)]
        z = z0
        while z < z1:
            r = rng.uniform(11, 17)
            blobs.append(Point(X0 + rng.uniform(u_in - 6, u_out - r), z + r * 0.6).buffer(r, 40))
            z += r * rng.uniform(1.1, 1.5)
        return U(*blobs)

    def wing(side_seed):
        rng = random.Random(side_seed)
        outline = canopy_edge(30, 56, 22, 284, rng)
        ox0, oz0, ox1, oz1 = outline.bounds
        layers = [("base", outline)]
        layers += [("forest", U(*[Point(X0 + rng.uniform(8, 50), rng.uniform(40, 270)).buffer(rng.uniform(8, 14), 32) for _ in range(9)]))]
        trunks = U(line([(X0 + 16, 22), (X0 + 18, 140), (X0 + 30, 200)], 6), line([(X0 + 18, 140), (X0 + 10, 190)], 3.5),
                   line([(X0 + 34, 22), (X0 + 36, 90), (X0 + 46, 130)], 4.5))
        layers += [("bark", trunks)]
        layers += [("leaf", U(*[Point(X0 + rng.uniform(6, 52), rng.uniform(120, 280)).buffer(rng.uniform(6, 10), 32) for _ in range(12)]))]
        layers += [("lime", U(*[ell(X0 + rng.uniform(6, 52), rng.uniform(110, 282), rng.uniform(3, 5), rng.uniform(1.6, 2.4), rng.uniform(0, 180)) for _ in range(26)]))]
        layers += [("red", U(*[heart(X0 + rng.uniform(10, 48), rng.uniform(60, 272), rng.uniform(7, 11), rng.uniform(-25, 25)) for _ in range(7)]))]
        layers += [("leaf", hills_poly(ox0, ox1 + 5, 34, 4, 0.04, rng))]
        layers += [("cream", U(*[star4(X0 + rng.uniform(6, 50), rng.uniform(150, 280), rng.uniform(2.6, 3.6)) for _ in range(4)]))]
        return outline, layers

    def topper():
        rng = random.Random(3)
        crown = U(box(-HW, 0, HW, 62), *[Point(x, 48 + 22 * math.cos(x / HW * 1.4) + rng.uniform(-4, 4)).buffer(rng.uniform(22, 30), 48)
                                          for x in np.linspace(-HW + 16, HW - 16, 9)])
        crown = U(crown, heart(0, 118, 74)).intersection(box(-HW - 14, 0, HW + 14, 152))
        layers = [("base", crown)]
        layers += [("forest", U(*[Point(rng.uniform(-HW, HW), rng.uniform(55, 115)).buffer(rng.uniform(10, 18), 32) for _ in range(12)]))]
        layers += [("leaf", U(*[Point(rng.uniform(-HW, HW), rng.uniform(70, 130)).buffer(rng.uniform(6, 10), 32) for _ in range(14)]))]
        layers += [("lime", U(*[ell(rng.uniform(-HW, HW), rng.uniform(60, 140), rng.uniform(3, 5), 2, rng.uniform(0, 180)) for _ in range(40)]))]
        layers += [("base", heart(0, 116, 66).buffer(2.5))]
        layers += [("red", smukfest_tree(0, 64, 86))]
        layers += [("cream", text("SMUKFEST", "outfit", 0, 36, 24, 196))]
        layers += [("lime", text("DANMARKS SMUKKESTE FESTIVAL", "outfit", 0, 13, 6.2, 170))]
        return crown, layers

    def screen(w, h):
        rng = random.Random(5)
        L = [("base", box(0, 0, w, h))]
        L += [("forest", hills_poly(0, w, 150, 18, 1.2, rng)), ("leaf", hills_poly(0, w, 105, 14, 1.6, rng)), ("lime", hills_poly(0, w, 60, 10, 2.1, rng))]
        top = U(*[Point(x, h + 10 - rng.uniform(0, 40)).buffer(rng.uniform(40, 62), 40) for x in np.linspace(-20, w + 20, 9)])
        L += [("forest", top), ("leaf", U(*[Point(rng.uniform(0, w), h - rng.uniform(10, 70)).buffer(rng.uniform(16, 26), 32) for _ in range(8)]))]
        L += [("red", U(*[heart(rng.uniform(30, w - 30), rng.uniform(260, h - 160), rng.uniform(14, 24), rng.uniform(-25, 25)) for _ in range(9)]))]
        L += [("red", smukfest_tree(w / 2, h * 0.58, 230))]
        L += [("cream", text("SMUKFEST", "outfit", w / 2, h * 0.52, 56, w * 0.8))]
        return L

    return dict(name="Smukfest", place="Skanderborg", font="outfit", pal=pal, filament={"base": "PETG HF dark green", "forest": "PETG HF forest green", "leaf": "PETG HF green", "lime": "PETG HF lime", "red": "PETG HF red", "cream": "PETG HF cream", "bark": "PETG HF brown"},
                casing="#0f3d24", ring={"idle": ["#9cc94a", "#e2001a", "#f6eedc"], "glow": "#9cc94a"},
                screen=dict(bg="base", ink="cream", accent="red", cta="Sig «Smukt!»", ticker="Danmarks smukkeste festival  •  Bøgeskoven  •  Skanderborg  •"),
                frame=dict(bg="cream", ink="red", caption="Smukfest · Bøgeskoven"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: [("red", smukfest_tree(0, 30, 120)), ("red", text("SMUKFEST", "outfit", 0, 12, 18))])


@theme
def roskilde():
    pal = {"base": "#121212", "orange": "#ff8200", "white": "#ffffff", "grey": "#3b3b3b", "ember": "#c85a00"}

    def wing(side_seed):
        rng = random.Random(side_seed)
        pts = [(X0, 22)]
        for i, z in enumerate(np.linspace(22, 284, 9)):
            pts.append((X0 + (54 if i % 2 else 40), z))
        pts.append((X0, 284))
        outline = U(Polygon(pts).buffer(6).buffer(-6), wing_strip(30, 22, 284))
        L = [("base", outline)]
        bands = U(*[Polygon([(X0 - 5, z), (X0 + 70, z + 34), (X0 + 70, z + 52), (X0 - 5, z + 18)]) for z in np.arange(90, 300, 44)])
        L += [("orange", bands), ("ember", U(*[line([(X0, z + 9), (X0 + 70, z + 43)], 1.6) for z in np.arange(90, 300, 44)]))]
        crowd = U(hills_poly(X0 - 5, X0 + 70, 46, 5, 0.12, rng), *[line([(X0 + x, 40), (X0 + x + rng.uniform(-3, 3), 62 + rng.uniform(0, 8))], 2.6) for x in np.arange(4, 60, 7)])
        L += [("grey", crowd)]
        L += [("white", U(*[Point(X0 + rng.uniform(5, 50), rng.uniform(70, 85)).buffer(1.2, 12) for _ in range(10)]))]
        return outline, L

    def topper():
        canopy = roskilde_canopy(0, 34, 268, 112, seams=False)
        outline = U(canopy, box(-HW, 0, HW, 40))
        L = [("base", outline), ("orange", roskilde_canopy(0, 34, 262, 108))]
        L += [("ember", ell(0, 34, 118, 46).intersection(box(-200, 34, 200, 200)).difference(roskilde_canopy(0, 34, 262, 108, seams=False).buffer(-14)))]
        L += [("white", text("ROSKILDE", "archivo-black", 0, 23, 15, 200)), ("orange", text("FESTIVAL", "archivo-black", 0, 7.5, 6.5, 120))]
        return outline, L

    def screen(w, h):
        rng = random.Random(9)
        L = [("base", box(0, 0, w, h)), ("orange", roskilde_canopy(w / 2, h - 300, w * 1.25, 290))]
        L += [("grey", U(hills_poly(0, w, 80, 6, 2.5, rng), *[line([(x, 70), (x + rng.uniform(-8, 8), 120 + rng.uniform(0, 30))], 10) for x in np.arange(20, w, 30)]))]
        L += [("white", text("ROSKILDE", "archivo-black", w / 2, h - 360, 50, w * 0.84)), ("orange", text("FESTIVAL", "archivo-black", w / 2, h - 410, 22, w * 0.5))]
        return L

    return dict(name="Roskilde Festival", place="Roskilde", font="archivo-black", pal=pal, filament={"base": "PETG HF black", "orange": "PETG HF orange (Pantone 151 C)", "white": "PETG HF white", "grey": "PETG HF dark grey", "ember": "PETG HF burnt orange"},
                casing="#ff8200", ring={"idle": ["#ff8200", "#ffffff"], "glow": "#ff8200"},
                screen=dict(bg="base", ink="white", accent="orange", cta="Orange feeling!", ticker="Roskilde Festival  •  Fællesskab og non-profit  •  Orange Scene  •"),
                frame=dict(bg="base", ink="orange", caption="Roskilde Festival · Orange Scene"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen,
                logo=lambda: [("orange", roskilde_canopy(0, 30, 160, 70)), ("white", text("ROSKILDE", "archivo-black", 0, 12, 14, 150))])


@theme
def nibe():
    pal = {"base": "#050505", "neon": "#e5ff50", "purple": "#995dff", "plum": "#3b1f7a", "white": "#ffffff"}

    def wing(side_seed):
        rng = random.Random(side_seed)
        trees = [wing_strip(26, 22, 280)]
        z = 22
        while z < 250:
            hgt = rng.uniform(38, 56)
            trees.append(pine(X0 + rng.uniform(26, 36), z, rng.uniform(40, 50), hgt, 3))
            z += hgt * 0.62
        outline = U(*trees).intersection(box(X0, 22, X0 + 60, 286))
        L = [("base", outline), ("plum", U(*[pine(X0 + rng.uniform(10, 40), rng.uniform(20, 230), rng.uniform(26, 36), rng.uniform(34, 50)) for _ in range(6)]))]
        L += [("purple", U(*[pine(X0 + rng.uniform(14, 44), rng.uniform(20, 230), rng.uniform(20, 28), rng.uniform(26, 38)) for _ in range(5)]))]
        lights = []
        for zc in (70, 150, 230):
            pts = [(X0 + u, zc + 10 * math.sin(u / 9)) for u in np.linspace(0, 56, 30)]
            lights.append(line(pts, 1.4))
            lights += [Point(p).buffer(2.4, 16) for p in pts[::4]]
        L += [("neon", U(*lights)), ("white", U(*[star4(X0 + rng.uniform(6, 48), rng.uniform(40, 276), rng.uniform(2.4, 3.6)) for _ in range(6)]))]
        return outline, L

    def topper():
        rng = random.Random(4)
        skyline = U(box(-HW, 0, HW, 60), *[pine(x, 30, rng.uniform(34, 48), rng.uniform(70, 102), 3) for x in np.linspace(-HW + 10, HW - 10, 10)])
        outline = skyline.intersection(box(-HW - 10, 0, HW + 10, 140))
        L = [("base", outline), ("plum", U(*[pine(x, 26, rng.uniform(30, 40), rng.uniform(60, 90)) for x in np.linspace(-HW + 26, HW - 26, 7)]))]
        L += [("purple", Polygon([(-HW - 5, 6), (HW + 5, 26), (HW + 5, 40), (-HW - 5, 20)]))]
        L += [("base", text("NIBE FESTIVAL", "poppins", 0, 52, 26, 214).buffer(3))]
        L += [("neon", text("NIBE FESTIVAL", "poppins", 0, 52, 26, 214)), ("white", text("SKALSKOVEN", "poppins", 0, 22, 7, 100))]
        return outline, L

    def screen(w, h):
        rng = random.Random(2)
        L = [("base", box(0, 0, w, h)), ("purple", Polygon([(0, h * 0.3), (w, h * 0.22), (w, h * 0.32), (0, h * 0.4)]))]
        L += [("plum", U(*[pine(x, 0, rng.uniform(80, 120), rng.uniform(160, 230)) for x in np.linspace(0, w, 7)]))]
        L += [("neon", text("NIBE", "poppins", w / 2, h * 0.62, 96, w * 0.7)), ("neon", text("FESTIVAL", "poppins", w / 2, h * 0.52, 42, w * 0.7))]
        L += [("white", U(*[star4(rng.uniform(20, w - 20), rng.uniform(h * 0.72, h - 20), rng.uniform(5, 9)) for _ in range(12)]))]
        return L

    return dict(name="Nibe Festival", place="Skalskoven", font="poppins", pal=pal, filament={"base": "PETG HF black", "neon": "PETG fluorescent yellow", "purple": "PETG HF purple", "plum": "PETG HF dark purple", "white": "PETG HF white"},
                casing="#050505", ring={"idle": ["#e5ff50", "#995dff"], "glow": "#e5ff50"},
                screen=dict(bg="base", ink="white", accent="neon", cta="Hænderne op!", ticker="Nibe Festival  •  Skalskoven  •  Hænderne op  •"),
                frame=dict(bg="white", ink="base", caption="Nibe Festival · Skalskoven"), photo="print-bar",
                wing=wing, topper=topper, screen_art=screen,
                logo=lambda: [("neon", text("NIBE", "poppins", 0, 30, 30)), ("neon", text("FESTIVAL", "poppins", 0, 8, 12))])


@theme
def faarup():
    # Fårup's brand greens and pale gold (#007531, #003817, #FFDA81), the dunes and the forest by the North Sea.
    pal = {"base": "#003817", "green": "#007531", "gold": "#ffda81", "white": "#ffffff", "sea": "#3aa6d8", "sand": "#ecdcae", "pine": "#0b5a2c"}

    def wing(side_seed):
        rng = random.Random(side_seed)
        dunes = U(wing_strip(28, 22, 284), hills_poly(X0, X0 + 52, 120, 14, 0.02, rng).intersection(box(X0, 22, X0 + 60, 300)),
                  *[pine(X0 + rng.uniform(30, 42), z, rng.uniform(26, 34), rng.uniform(40, 52)) for z in np.arange(110, 250, 34)])
        outline = dunes.intersection(box(X0, 22, X0 + 58, 286))
        L = [("base", outline), ("sand", hills_poly(X0 - 5, X0 + 70, 70, 8, 0.03, rng)), ("sea", hills_poly(X0 - 5, X0 + 70, 42, 4, 0.12, rng)),
             ("white", U(*[line([(X0 + u, z), (X0 + u + 8, z + 2), (X0 + u + 16, z)], 1.4) for u, z in ((4, 34), (26, 30), (12, 24))]))]
        L += [("pine", U(*[pine(X0 + rng.uniform(10, 44), rng.uniform(80, 230), rng.uniform(22, 30), rng.uniform(36, 48)) for _ in range(6)]))]
        L += [("green", U(*[pine(X0 + rng.uniform(14, 40), rng.uniform(90, 220), rng.uniform(16, 22), rng.uniform(26, 34)) for _ in range(4)]))]
        L += [("white", line([(X0 + 2, 180), (X0 + 18, 236), (X0 + 34, 252), (X0 + 50, 230)], 2.2)),
              ("white", U(*[line([(X0 + u, z - 2), (X0 + u, 120)], 1.4) for u, z in ((12, 218), (26, 247), (42, 244))]))]
        L += [("gold", Point(X0 + 40, 272).buffer(9, 32))]
        return outline, L

    def topper():
        loop_c = (66, 90)
        track_pts = [(10, 30), (30, 40), (52, 58)] + \
                    [(loop_c[0] + 26 * math.sin(a), loop_c[1] - 26 * math.cos(a)) for a in np.linspace(-0.55, 2 * math.pi - 0.2, 44)] + [(96, 70), (HW, 46)]
        sky = U(box(-HW, 0, HW, 54), ell(-46, 62, 72, 64), Point(loop_c).buffer(40, 64), ell(HW - 18, 40, 36, 34))
        outline = sky.intersection(box(-HW - 6, 0, HW + 6, 150))
        L = [("base", outline), ("green", ell(-46, 58, 64, 56)), ("gold", Point(-88, 102).buffer(16, 48))]
        L += [("sand", hills_poly(-HW - 5, HW + 5, 22, 5, 2.2, random.Random(3))), ("sea", hills_poly(-HW - 5, HW + 5, 10, 2.5, 4, random.Random(4)))]
        L += [("white", coaster(track_pts, rail=2.6, z_floor=24, support_every=26))]
        L += [("base", text("Fårup", "fredoka", -46, 64, 32, 124).buffer(2.4)), ("white", text("Fårup", "fredoka", -46, 64, 32, 124))]
        L += [("gold", text("SOMMERLAND", "fredoka", -46, 38, 8.5, 110))]
        return outline, L

    def screen(w, h):
        rng = random.Random(6)
        L = [("base", box(0, 0, w, h)), ("green", ell(w * 0.5, h * 0.62, w * 0.62, h * 0.24)), ("gold", Point(w * 0.78, h * 0.82).buffer(60, 64))]
        L += [("pine", U(*[pine(x, 110, rng.uniform(60, 80), rng.uniform(110, 150)) for x in np.linspace(0, w, 8)]))]
        L += [("sand", hills_poly(0, w, 110, 12, 1.4, rng)), ("sea", hills_poly(0, w, 60, 6, 2.6, rng))]
        L += [("white", coaster([(0, 360), (w * 0.22, 520), (w * 0.4, 420)], rail=6, z_floor=150, support_every=70))]
        L += [("white", text("Fårup", "fredoka", w / 2, h * 0.6, 92, w * 0.8)), ("gold", text("SOMMERLAND", "fredoka", w / 2, h * 0.52, 26, w * 0.6))]
        return L

    return dict(name="Fårup Sommerland", place="Blokhus", font="fredoka", pal=pal, filament={"base": "PETG HF dark green", "green": "PETG HF green", "gold": "PETG HF sand gold", "white": "PETG HF white", "sea": "PETG HF sky blue", "sand": "PETG HF beige", "pine": "PETG HF pine green"},
                casing="#007531", ring={"idle": ["#ffda81", "#3aa6d8", "#ffffff"], "glow": "#ffda81"},
                screen=dict(bg="base", ink="white", accent="gold", cta="Hold fast og smil!", ticker="Fårup Sommerland  •  Blokhus  •  Sommer ved Vesterhavet  •"),
                frame=dict(bg="green", ink="white", caption="Fårup Sommerland · Sommer"), photo="print-birthday",
                wing=wing, topper=topper, screen_art=screen,
                logo=lambda: [("white", text("Fårup", "fredoka", 0, 26, 30)), ("gold", text("SOMMERLAND", "fredoka", 0, 4, 8.5, 110))])


@theme
def legoland():
    # LEGOLAND's logo colours from the park's own brand package: red rgb(227,0,11), yellow rgb(250,205,34).
    pal = {"base": "#facd22", "red": "#e3000b", "black": "#111111", "white": "#ffffff", "blue": "#006db7", "green": "#009d2e"}
    BR = 19.2   # brick row height on the wing, 2 × the 9.6 mm of a real brick, scaled up

    def bricks(rng, u_max):
        rows, studs = [], []
        for i, z in enumerate(np.arange(24, 284, BR)):
            length = rng.choice([32, 40, 48, 56]) if i % 3 else 56
            length = min(length, u_max)
            rows.append(box(X0, z, X0 + length, z + BR - 0.4))
            for s in np.arange(6, length - 4, 8):
                studs.append(box(X0 + s - 2.6, z + BR - 0.4, X0 + s + 2.6, z + BR + 2.2))
        return rows, studs

    def wing(side_seed):
        rng = random.Random(side_seed)
        rows, studs = bricks(rng, 56)
        outline = U(*rows, *studs, wing_strip(30, 24, 282))
        cols = ["red", "blue", "base", "green", "white", "red"]
        L = [("base", outline)]
        for i, r in enumerate(rows):
            L.append((cols[(i + side_seed) % len(cols)], r.buffer(-1.4)))
            L.append(("black", U(*[box(X0 + s - 0.5, r.bounds[1], X0 + s + 0.5, r.bounds[3]) for s in np.arange(16, r.bounds[2] - X0, 16)]).intersection(r)))
        return outline, L

    def topper():
        plate = box(-HW - 8, 0, HW + 8, 118)
        studs = U(*[box(x - 13, 118, x + 13, 130) for x in np.linspace(-HW + 22, HW - 22, 6)])
        outline = U(plate, studs).buffer(1.2).buffer(-1.2)
        L = [("base", outline), ("black", U(*[box(x - 13, 117, x + 13, 118.6) for x in np.linspace(-HW + 22, HW - 22, 6)]))]
        L += legoland_logo((-108, 30, 108, 112))
        L += [("red", text("BILLUND", "archivo-black", 0, 14, 9, 90))]
        return outline, L

    def screen(w, h):
        L = [("red", box(0, 0, w, h))]
        L += [("black", U(*[Point(x, y).buffer(26, 40) for x in np.arange(40, w, 80) for y in np.arange(40, h, 80)]).difference(
            U(*[Point(x - 3, y + 3).buffer(26, 40) for x in np.arange(40, w, 80) for y in np.arange(40, h, 80)])))]
        L += [("base", box(30, h * 0.46, w - 30, h * 0.74).buffer(20).buffer(-20))]
        L += legoland_logo((60, h * 0.5, w - 60, h * 0.7))
        return L

    return dict(name="LEGOLAND", place="Billund", font="archivo-black", pal=pal, filament={"base": "PETG HF yellow", "red": "PETG HF red", "black": "PETG HF black", "white": "PETG HF white", "blue": "PETG HF blue", "green": "PETG HF green"},
                casing="#e3000b", ring={"idle": ["#facd22", "#e3000b", "#006db7", "#009d2e"], "glow": "#facd22"},
                screen=dict(bg="red", ink="white", accent="base", cta="Byg dit bedste smil", ticker="LEGOLAND Billund  •  Byg dit bedste smil  •"),
                frame=dict(bg="base", ink="black", caption="LEGOLAND · Billund"), photo="print-birthday",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: legoland_logo((-100, 0, 100, 80)),
                studs=True)


@theme
def zoo():
    pal = {"base": "#1f4d2b", "sand": "#e8c27a", "grass": "#7aa83a", "giraffe": "#d08a3a", "spot": "#6b3a1a", "cream": "#fff3dc", "night": "#141414"}

    def spots(shape, rng, n=40, size=(4, 7)):
        x0, z0, x1, z1 = shape.bounds
        cells = []
        for _ in range(n):
            cx, cz = rng.uniform(x0, x1), rng.uniform(z0, z1)
            r = rng.uniform(*size)
            pts = [(cx + math.cos(a) * r * rng.uniform(0.7, 1.1), cz + math.sin(a) * r * rng.uniform(0.7, 1.1)) for a in np.linspace(0, 2 * math.pi, 7)[:-1]]
            cells.append(Polygon(pts).buffer(0.8))
        return U(*cells).intersection(shape.buffer(-1.6))

    def wing(side_seed):
        rng = random.Random(side_seed)
        if side_seed % 2 == 0:     # right: a giraffe peeking up beside the box
            g = giraffe_neck(X0 + 6, 22, 262, 26, 46)
            outline = U(wing_strip(24, 22, 284), g, hills_poly(X0, X0 + 50, 46, 4, 0.05, rng).intersection(box(X0, 22, X0 + 60, 90)))
            L = [("base", outline), ("giraffe", g), ("spot", spots(g, rng, 70, (3.5, 6.5)))]
            L += [("night", Point(X0 + 6 + 26 * 0.4 + 46 * 0.4, 262 - 8).buffer(2.4, 16))]
        else:                 # left: an acacia over the grass
            tree = acacia(X0 + 30, 96, 66, 184)
            outline = U(wing_strip(26, 22, 284), tree, hills_poly(X0, X0 + 48, 60, 5, 0.04, rng).intersection(box(X0, 22, X0 + 60, 100)))
            L = [("base", outline), ("night", tree)]
        L += [("grass", U(hills_poly(X0 - 5, X0 + 70, 48, 5, 0.06, rng), *[line([(X0 + u, 40), (X0 + u + rng.uniform(-4, 4), 56 + rng.uniform(0, 12))], 1.8) for u in np.arange(3, 56, 5)]))]
        L += [("sand", U(*[Point(X0 + rng.uniform(8, 44), rng.uniform(110, 270)).buffer(rng.uniform(1, 1.6), 12) for _ in range(6)]))]
        return outline, L

    def topper():
        rng = random.Random(8)
        trees = U(acacia(-74, 10, 96, 120), acacia(84, 10, 70, 96))
        outline = U(box(-HW, 0, HW, 70), ell(0, 70, HW, 26), trees).intersection(box(-HW - 14, 0, HW + 14, 150))
        L = [("base", outline), ("sand", Point(26, 70).buffer(40, 64).intersection(box(-200, 30, 200, 200))), ("night", trees)]
        L += [("grass", hills_poly(-HW - 5, HW + 5, 20, 4, 2.6, rng))]
        L += [("base", text("AALBORG ZOO", "lilita-one", 0, 48, 24, 210).buffer(2.6)), ("cream", text("AALBORG ZOO", "lilita-one", 0, 48, 24, 210))]
        return outline, L

    def screen(w, h):
        rng = random.Random(3)
        L = [("base", box(0, 0, w, h)), ("sand", Point(w * 0.5, h * 0.42).buffer(w * 0.38, 64))]
        L += [("night", U(acacia(w * 0.18, 130, 280, 380), acacia(w * 0.82, 130, 220, 300)))]
        g = giraffe_neck(w - 110, 110, h * 0.9, 60, 90)
        L += [("giraffe", g), ("spot", spots(g, rng, 120, (10, 18)))]
        L += [("grass", hills_poly(0, w, 140, 14, 1.8, rng))]
        L += [("cream", text("AALBORG ZOO", "lilita-one", w / 2, h * 0.6, 58, w * 0.84))]
        return L

    return dict(name="Aalborg Zoo", place="Aalborg", font="lilita-one", pal=pal, filament={"base": "PETG HF dark green", "sand": "PETG HF sand", "grass": "PETG HF light green", "giraffe": "PETG HF ochre", "spot": "PETG HF brown", "cream": "PETG HF cream", "night": "PETG HF black"},
                casing="#e8c27a", ring={"idle": ["#ffcf7a", "#7aa83a"], "glow": "#ffcf7a"},
                screen=dict(bg="base", ink="cream", accent="giraffe", cta="Sig «Zebra!»", ticker="Aalborg Zoo  •  Savannen  •  Sig zebra  •"),
                frame=dict(bg="base", ink="cream", caption="Aalborg Zoo · Savannen"), photo="print-bar",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: [("cream", text("AALBORG ZOO", "lilita-one", 0, 10, 24))])


# ------------------------------------------------------- occasions (private) --
# For people who rent a box for one party. Same mounting parts as the venues, but the design is made for
# the occasion: a wedding, a birthday, a Christmas lunch. Names and dates are placeholders the customer replaces.

def leaf(cx, cz, ln, w, rot=0):
    """Pointed leaf with its base at (cx, cz), pointing up at rot = 0 and turning counter-clockwise."""
    ts = np.linspace(0, 1, 24)
    half = [(w / 2 * math.sin(math.pi * t) ** 0.9, t * ln) for t in ts]
    pts = [(cx + x, cz + z) for x, z in half] + [(cx - x, cz + z) for x, z in reversed(half)]
    return affinity.rotate(Polygon(pts), rot, origin=(cx, cz))


def blossom(cx, cz, r, rot=0):
    """Five round petals. Returns (petals, centre)."""
    petals = U(*[Point(cx + r * 0.56 * math.sin(math.radians(rot + i * 72)), cz + r * 0.56 * math.cos(math.radians(rot + i * 72))).buffer(r * 0.5, 24) for i in range(5)])
    return petals, Point(cx, cz).buffer(r * 0.26, 20)


def sprig(p0, p1, n, ln, w, rng):
    """A branch from p0 to p1 with leaves on both sides. Returns (stem, leaves)."""
    (x0, z0), (x1, z1) = p0, p1
    ang = math.degrees(math.atan2(x1 - x0, z1 - z0))
    leaves = []
    for i in range(n):
        t = (i + 0.5) / n
        cx, cz = x0 + (x1 - x0) * t, z0 + (z1 - z0) * t
        for s in (-1, 1):
            leaves.append(leaf(cx, cz, ln * rng.uniform(0.8, 1.1), w * rng.uniform(0.85, 1.1), -ang + s * rng.uniform(38, 55)))
    return line([p0, p1], max(2.4, w * 0.18)), leaves


def balloon(cx, cz, r, string_to=None):
    """Balloon body, knot and string. The string curls down to `string_to` (x, z) when given."""
    body = ell(cx, cz, r, r * 1.22)
    knot = Polygon([(cx, cz - r * 1.2), (cx - r * 0.2, cz - r * 1.5), (cx + r * 0.2, cz - r * 1.5)])
    shine = ell(cx - r * 0.38, cz + r * 0.42, r * 0.17, r * 0.34, 25)
    string = None
    if string_to:
        sx, sz = string_to
        string = line([(cx, cz - r * 1.5), (cx + (sx - cx) * 0.3 + 5, cz - r * 1.5 + (sz - cz + r * 1.5) * 0.35), (cx + (sx - cx) * 0.8 - 4, cz - r * 1.5 + (sz - cz + r * 1.5) * 0.7), (sx, sz)], 1.6)
    return body, knot, shine, string


def snowflake(cx, cz, r):
    arms = [line([(cx + r * math.sin(a), cz + r * math.cos(a)), (cx - r * math.sin(a), cz - r * math.cos(a))], 1.7) for a in (0, math.pi / 3, 2 * math.pi / 3)]
    return U(*arms, Point(cx, cz).buffer(r * 0.18, 16))


@theme
def bryllup():
    pal = {"base": "#f1e6d6", "sage": "#9db596", "leaf": "#5f8466", "blush": "#e7b4aa", "gold": "#b08a5a", "ink": "#4a3b34", "white": "#fffaf2"}

    def wing(side_seed):
        rng = random.Random(side_seed)
        ph = side_seed * 0.9
        sx = lambda z: X0 + 15 + 9 * math.sin(z / 38.0 + ph)
        stem = line([(sx(z), z) for z in np.arange(24, 287, 6)], 3.2)
        leaves = []
        for i, z in enumerate(np.arange(34, 282, 15)):
            right = i % 2 == 0
            leaves.append(leaf(sx(z), z, rng.uniform(26, 34), rng.uniform(10, 13), -rng.uniform(55, 85) if right else rng.uniform(25, 55)))
        pet, cen = [], []
        for z in (62, 118, 176, 232, 270):
            p, c = blossom(X0 + 28 + rng.uniform(-3, 8), z + rng.uniform(-6, 6), rng.uniform(8.5, 10.5), rng.uniform(0, 72))
            pet.append(p)
            cen.append(c)
        outline = U(wing_strip(24, 22, 284), U(*leaves), stem.buffer(2), U(*pet).buffer(1.5))
        buds = U(*[Point(X0 + rng.uniform(6, 50), rng.uniform(40, 270)).buffer(rng.uniform(2.2, 3.2), 16) for _ in range(12)])
        L = [("base", outline), ("sage", U(*leaves[::2])), ("leaf", U(*leaves[1::2], stem)), ("white", buds),
             ("blush", U(*pet)), ("gold", U(*cen)), ("gold", U(*[star4(X0 + rng.uniform(8, 48), rng.uniform(45, 275), 3.4) for _ in range(5)]))]
        return outline, L

    def topper():
        rng = random.Random(11)
        a, b, cz = HW - 8, 108, 36
        outline = U(box(-HW, 0, HW, cz), ell(0, cz, a, b).intersection(box(-HW, cz, HW, cz + b + 2))).intersection(box(-HW - 6, 0, HW + 6, 150))
        band = ell(0, cz, a - 12, b - 12).difference(ell(0, cz, a - 19, b - 19)).intersection(box(-HW, cz, HW, 200))
        L = [("base", outline), ("gold", band)]
        sage, dark, pet, cen = [], [], [], []
        for k, th in enumerate(np.linspace(8, 172, 19)):
            t = math.radians(th)
            px, pz = (a - 9.5) * math.cos(t), cz + (b - 9.5) * math.sin(t)
            tang = -math.degrees(math.atan2(-a * math.sin(t), b * math.cos(t)))
            for s, col in ((1, sage), (-1, dark)):
                col.append(leaf(px, pz, 23 * rng.uniform(0.85, 1.1), 9.5, tang + s * 42))
        for th in (28, 90, 152):
            t = math.radians(th)
            p, c = blossom((a - 9.5) * math.cos(t), cz + (b - 9.5) * math.sin(t), 10.5, th)
            pet.append(p)
            cen.append(c)
        L += [("sage", U(*sage)), ("leaf", U(*dark)), ("blush", U(*pet)), ("gold", U(*cen))]
        L += [("sage", hills_poly(-HW - 5, HW + 5, 18, 4, 3.2, rng).intersection(box(-HW - 6, 0, HW + 6, cz))), ("leaf", hills_poly(-HW - 5, HW + 5, 8, 3, 4.5, rng).intersection(box(-HW - 6, 0, HW + 6, cz)))]
        L += [("ink", text("BRYLLUP", "outfit", 0, 78, 17, 124)), ("gold", text("TAK FORDI I KOM", "outfit", 0, 56, 8, 108))]
        ring = lambda cx: Point(cx, 104).buffer(12, 48).difference(Point(cx, 104).buffer(8.6, 48))
        L += [("gold", U(ring(-8), ring(8)))]
        return outline, L

    def screen(w, h):
        rng = random.Random(21)
        L = [("base", box(0, 0, w, h))]
        sage, dark, stems, pet, cen = [], [], [], [], []
        for p0, p1 in (((-20, h + 10), (190, h - 250)), ((w + 20, h + 10), (w - 190, h - 250)), ((-20, 70), (120, 250)), ((w + 20, 70), (w - 120, 250))):
            st, lv = sprig(p0, p1, 8, 84, 32, rng)
            stems.append(st)
            sage += lv[::2]
            dark += lv[1::2]
        for x, z, r in ((150, h - 150, 34), (w - 150, h - 150, 34), (60, h - 300, 26), (w - 60, h - 300, 26), (80, 120, 24), (w - 80, 120, 24)):
            p, c = blossom(x, z, r, rng.uniform(0, 72))
            pet.append(p)
            cen.append(c)
        L += [("sage", U(*sage)), ("leaf", U(*dark, *stems)), ("blush", U(*pet)), ("gold", U(*cen))]
        L += [("ink", text("Skål for", "outfit", w / 2, h * 0.6, 56, w * 0.7)), ("ink", text("brudeparret", "outfit", w / 2, h * 0.53, 56, w * 0.8)), ("gold", text("TAK FORDI I KOM", "outfit", w / 2, h * 0.47, 22, w * 0.5))]
        L += [("blush", heart(w / 2, h * 0.405, 40))]
        return L

    return dict(name="Bryllup", place="Blomster og guld", font="outfit", pal=pal,
                filament={"base": "PETG HF ivory", "sage": "PETG HF sage green", "leaf": "PETG HF green", "blush": "PETG HF blush pink", "gold": "PETG HF sand gold", "ink": "PETG HF brown", "white": "PETG HF white"},
                casing="#efe3d0", ring={"idle": ["#fff0d6", "#f0c99a", "#ffffff"], "glow": "#ffd9a8"},
                screen=dict(bg="base", ink="ink", accent="gold", cta="Sig «Skål!»", ticker="Skål for brudeparret  •  Tak fordi I kom  •  Smil til kameraet  •"),
                frame=dict(bg="base", ink="gold", caption="Skål for brudeparret"), photo="print-wedding",
                wing=wing, topper=topper, screen_art=screen,
                logo=lambda: [("gold", U(*[Point(cx, 14).buffer(12, 48).difference(Point(cx, 14).buffer(8.6, 48)) for cx in (-8, 8)])), ("ink", text("BRYLLUP", "outfit", 0, -12, 9))])


@theme
def fodselsdag():
    pal = {"base": "#16244d", "gold": "#f2c14e", "coral": "#ee6b5b", "teal": "#3bb8b0", "pink": "#f49ac1", "cream": "#fff6e0"}
    cols = ["gold", "coral", "teal", "pink"]

    def wing(side_seed):
        rng = random.Random(side_seed)
        balloons = []
        for i, z in enumerate(np.arange(92, 276, 40)):
            balloons.append((X0 + [30, 16, 38, 22, 34][i % 5], z + rng.uniform(-6, 6), rng.uniform(15.5, 19.5), cols[(i + side_seed) % 4]))
        parts = [balloon(x, z, r, (X0 + 14 + 4 * math.sin(z), 34)) for x, z, r, _ in balloons]
        outline = U(wing_strip(24, 22, 284), *[p[0].buffer(1) for p in parts], *[p[1].buffer(1) for p in parts])
        L = [("base", outline)]
        L += [("cream", U(*[p[3] for p in parts if p[3] is not None]))]
        for k in cols:
            L += [(k, U(*[p[0] for p, b in zip(parts, balloons) if b[3] == k], *[p[1] for p, b in zip(parts, balloons) if b[3] == k]))]
        L += [("cream", U(*[p[2] for p in parts]))]
        conf = []
        for _ in range(26):
            x, z = X0 + rng.uniform(4, 56), rng.uniform(30, 280)
            conf.append(Point(x, z).buffer(rng.uniform(2.0, 3.0), 12) if rng.random() < 0.6 else star4(x, z, rng.uniform(3, 4.4)))
        L += [("gold", U(*conf[:9])), ("teal", U(*conf[9:17])), ("pink", U(*conf[17:]))]
        return outline, L

    def topper():
        rng = random.Random(4)
        main = U(box(-HW, 0, HW, 112), *[Point(x, 112).buffer(11, 32) for x in np.linspace(-HW + 11, HW - 11, 11)])
        bal = [(-98, 112, 22, "coral"), (98, 112, 22, "teal"), (-72, 124, 19, "gold"), (72, 124, 19, "pink")]
        parts = [balloon(x, z, r) for x, z, r, _ in bal]
        outline = U(main, *[p[0].buffer(1) for p in parts]).intersection(box(-HW - 14, 0, HW + 14, 150))
        L = [("base", outline)]
        for k in cols:
            L += [(k, U(*[p[0] for p, b in zip(parts, bal) if b[3] == k]))]
        L += [("cream", U(*[p[2] for p in parts]))]
        rope = [(x, 108 - 9 * math.sin(math.pi * (x + 90) / 180)) for x in np.linspace(-90, 90, 40)]
        L += [("cream", line(rope, 1.8))]
        flags = []
        for i, x in enumerate(np.linspace(-84, 84, 11)):
            zt = 108 - 9 * math.sin(math.pi * (x + 90) / 180)
            flags.append((cols[i % 4], Polygon([(x - 8, zt), (x + 8, zt), (x, zt - 16)])))
        for k in cols:
            L += [(k, U(*[g for c, g in flags if c == k]))]
        L += [("gold", text("TILLYKKE", "lilita-one", 0, 68, 28, 200)), ("cream", text("MED FØDSELSDAGEN", "lilita-one", 0, 38, 14, 170))]
        L += [("pink", U(*[star4(x, 38, 6) for x in (-100, 100)])), ("teal", U(*[star4(x, 62, 4.5) for x in (-104, 104)]))]
        L += [("coral", hills_poly(-HW - 5, HW + 5, 12, 3, 5, rng).intersection(box(-HW - 6, 0, HW + 6, 20)))]
        return outline, L

    def screen(w, h):
        rng = random.Random(8)
        L = [("base", box(0, 0, w, h))]
        bal = [(110, h - 190, 62, "coral"), (240, h - 130, 56, "gold"), (360, h - 205, 60, "teal"), (480, h - 135, 56, "pink"), (60, h - 330, 44, "gold"), (545, h - 330, 44, "coral")]
        parts = [balloon(x, z, r, (w / 2 + rng.uniform(-60, 60), h - 330)) for x, z, r, _ in bal]
        L += [("cream", U(*[p[3] for p in parts if p[3] is not None]))]
        for k in cols:
            L += [(k, U(*[p[0] for p, b in zip(parts, bal) if b[3] == k], *[p[1] for p, b in zip(parts, bal) if b[3] == k]))]
        L += [("cream", U(*[p[2] for p in parts]))]
        conf = [Point(rng.uniform(10, w - 10), rng.uniform(330, h - 360)).buffer(rng.uniform(5, 9), 12) if rng.random() < 0.6 else star4(rng.uniform(20, w - 20), rng.uniform(330, h - 360), rng.uniform(9, 14)) for _ in range(40)]
        L += [("gold", U(*conf[:14])), ("teal", U(*conf[14:27])), ("pink", U(*conf[27:]))]
        L += [("gold", text("TILLYKKE", "lilita-one", w / 2, h * 0.6, 50, w * 0.7)), ("cream", text("med", "lilita-one", w / 2, h * 0.52, 50, w * 0.4)), ("coral", text("fødselsdagen", "lilita-one", w / 2, h * 0.44, 66, w * 0.84))]
        return L

    return dict(name="Fødselsdag", place="Balloner og konfetti", font="lilita-one", pal=pal,
                filament={"base": "PETG HF navy", "gold": "PETG HF sand gold", "coral": "PETG HF coral", "teal": "PETG HF teal", "pink": "PETG HF pink", "cream": "PETG HF cream"},
                casing="#16244d", ring={"idle": ["#f2c14e", "#ee6b5b", "#3bb8b0", "#f49ac1"], "glow": "#f2c14e"},
                screen=dict(bg="base", ink="cream", accent="gold", cta="Sig «Hurra!»", ticker="Tillykke med fødselsdagen  •  Hurra  •  Smil til kameraet  •"),
                frame=dict(bg="base", ink="gold", caption="Tillykke med fødselsdagen"), photo="print-birthday",
                wing=wing, topper=topper, screen_art=screen,
                logo=lambda: [("gold", star4(0, 20, 16)), ("coral", text("TILLYKKE", "lilita-one", 0, -8, 9))])


@theme
def julefrokost():
    pal = {"base": "#0f3d2e", "pine": "#1d6a4c", "red": "#c8202f", "gold": "#f2c14e", "snow": "#f7f9fb", "bark": "#6a4a2f"}

    def wing(side_seed):
        rng = random.Random(side_seed)
        trees = [(X0 + rng.uniform(24, 32), z, rng.uniform(44, 54), rng.uniform(60, 74)) for z in (30, 104, 178)]
        outline = U(wing_strip(24, 22, 284), *[pine(x, z, w, h, 3) for x, z, w, h in trees]).intersection(box(X0, 22, X0 + 58, 286))
        L = [("base", outline), ("pine", U(*[pine(x + 3, z + 10, w * 0.7, h * 0.72, 3) for x, z, w, h in trees]))]
        L += [("snow", U(*[snowflake(X0 + rng.uniform(8, 50), rng.uniform(36, 276), rng.uniform(4, 6)) for _ in range(9)]))]
        L += [("red", U(*[Point(x + rng.uniform(-w * 0.25, w * 0.25), z + h * rng.uniform(0.2, 0.55)).buffer(3.6, 20) for x, z, w, h in trees for _ in range(4)])),
              ("gold", U(*[Point(x + rng.uniform(-w * 0.25, w * 0.25), z + h * rng.uniform(0.2, 0.55)).buffer(3.0, 20) for x, z, w, h in trees for _ in range(3)])),
              ("gold", U(*[star4(x, z + h + 1, 8) for x, z, w, h in trees]))]
        return outline, L

    def topper():
        rng = random.Random(6)
        xs = [-92, -46, 0, 46, 92]
        hs = [78, 96, 112, 90, 74]
        trees = [pine(x, 44, 50 + (h - 74) * 0.2, h, 3) for x, h in zip(xs, hs)]
        outline = U(box(-HW, 0, HW, 60), *trees).intersection(box(-HW - 6, 0, HW + 6, 152))
        L = [("base", outline), ("pine", U(*[pine(x + 2, 50, 36, h * 0.7, 3) for x, h in zip(xs, hs)]))]
        L += [("snow", hills_poly(-HW - 5, HW + 5, 54, 3, 4, rng, z_floor=44).buffer(0)), ("snow", U(*[snowflake(rng.uniform(-HW + 10, HW - 10), rng.uniform(78, 130), rng.uniform(4, 5.5)) for _ in range(8)]))]
        L += [("red", U(*[Point(x + rng.uniform(-10, 10), 44 + h * rng.uniform(0.25, 0.5)).buffer(3.6, 20) for x, h in zip(xs, hs) for _ in range(2)])),
              ("gold", U(*[star4(x, 44 + h + 1, 8.5) for x, h in zip(xs, hs)]))]
        L += [("red", box(-HW, 0, HW, 6))]
        L += [("snow", text("JULEFROKOST", "lilita-one", 0, 30, 22, 196)), ("gold", text("GLÆDELIG JUL", "poppins", 0, 14, 7, 150))]
        return outline, L

    def screen(w, h):
        rng = random.Random(12)
        L = [("base", box(0, 0, w, h))]
        L += [("pine", U(*[pine(x, 120, rng.uniform(70, 96), rng.uniform(150, 210)) for x in np.linspace(0, w, 7)]))]
        L += [("snow", hills_poly(0, w, 120, 14, 1.4, rng)), ("snow", U(*[snowflake(rng.uniform(20, w - 20), rng.uniform(330, h - 40), rng.uniform(9, 17)) for _ in range(22)]))]
        L += [("red", U(*[Point(rng.uniform(40, w - 40), rng.uniform(150, 290)).buffer(rng.uniform(8, 12), 20) for _ in range(8)])), ("gold", U(*[Point(rng.uniform(40, w - 40), rng.uniform(150, 290)).buffer(rng.uniform(6, 9), 20) for _ in range(6)]))]
        L += [("gold", star4(w / 2, h - 130, 52))]
        L += [("snow", text("Julefrokost", "lilita-one", w / 2, h * 0.58, 78, w * 0.84)), ("gold", text("Glædelig jul", "lilita-one", w / 2, h * 0.49, 44, w * 0.6))]
        return L

    return dict(name="Julefrokost", place="Grantræer og sne", font="lilita-one", pal=pal,
                filament={"base": "PETG HF dark green", "pine": "PETG HF pine green", "red": "PETG HF red", "gold": "PETG HF sand gold", "snow": "PETG HF white", "bark": "PETG HF brown"},
                casing="#c8202f", ring={"idle": ["#f2c14e", "#ffffff", "#e0443a"], "glow": "#f2c14e"},
                screen=dict(bg="base", ink="snow", accent="gold", cta="Sig «Skål!»", ticker="Glædelig jul  •  Skål  •  Smil til kameraet  •"),
                frame=dict(bg="red", ink="snow", caption="Glædelig jul"), photo="print-office",
                wing=wing, topper=topper, screen_art=screen,
                logo=lambda: [("snow", text("Julefrokost", "lilita-one", 0, 16, 26)), ("gold", star4(0, -8, 9))])


# --------------------------------------------------------- bars (business) --
# Flying Hirsch in Frederikshavn: an afterski hut with raw wood, the DJ in an old gondola lift and the
# staff in lederhosen. "The Craziest Afterskibar". The logo (the stag in ski goggles with its skis in the
# air) is traced from the bar's own artwork in logos/flying_hirsch-source.png.

def flying_hirsch_logo(bounds):
    lg = traced_logo("flying_hirsch")
    placed = place_logo(lg, bounds, [("black", "base")] + [(k, k) for k in ("darkred", "red", "grey", "brown", "fur", "tan", "white")])
    # Snap the traced outlines to a 0.05 mm grid so every colour extrudes to a clean solid.
    return [(k, shapely.set_precision(g.buffer(0), 0.05).buffer(0.2).buffer(-0.2)) for k, g in placed]


def gondola(cx, cz, w):
    """A gondola cabin hanging from its arm, `w` mm wide, the cable passing through (cx, cz)."""
    h = w * 0.82
    cab = box(cx - w / 2, cz - w * 0.32 - h, cx + w / 2, cz - w * 0.32).buffer(w * 0.12).buffer(-w * 0.06)
    window = box(cx - w * 0.36, cz - w * 0.32 - h * 0.55, cx + w * 0.36, cz - w * 0.32 - h * 0.12)
    arm = U(line([(cx, cz), (cx, cz - w * 0.36)], max(1.4, w * 0.08)), Point(cx, cz).buffer(max(1.4, w * 0.1), 16))
    return cab, window, arm


def ski(p0, p1, w):
    """A ski from its tail p0 to its tip p1, `w` mm wide, and a stripe down its middle."""
    body = LineString([p0, p1]).buffer(w / 2, cap_style="flat")
    dx, dz = p1[0] - p0[0], p1[1] - p0[1]
    n = math.hypot(dx, dz)
    ux, uz = dx / n, dz / n
    tip = Point(p1[0] + ux * w * 0.1, p1[1] + uz * w * 0.1).buffer(w / 2, 32)
    tail = Point(p0).buffer(w / 2, 32)
    stripe = LineString([(p0[0] + ux * w, p0[1] + uz * w), (p1[0] - ux * w, p1[1] - uz * w)]).buffer(w * 0.13, cap_style="flat")
    return U(body, tip, tail), stripe


@theme
def flying_hirsch():
    # The logo's own colours: black, three reds, two browns, tan antlers and white type.
    pal = {"base": "#0d0b0a", "grey": "#333333", "white": "#f8f7f4", "red": "#c8181f", "darkred": "#43060a",
           "fur": "#89633d", "brown": "#65421f", "tan": "#c59b6d", "stone": "#6b6f78", "pine": "#1d4a35", "night": "#14213a"}

    def wing(side_seed):
        rng = random.Random(side_seed)
        if side_seed % 2 == 0:
            # Right: the mountain, with the gondola from the DJ booth on its way up.
            peak = Polygon([(X0, 22), (X0 + 58, 22), (X0 + 56, 90), (X0 + 48, 150), (X0 + 52, 176), (X0 + 40, 232), (X0 + 30, 290), (X0 + 18, 262), (X0, 250)])
            outline = U(wing_strip(26, 22, 240), peak.buffer(3).buffer(-3))
            L = [("base", outline), ("stone", peak.buffer(-3))]
            snow = Polygon([(X0 - 2, 214), (X0 + 18, 262), (X0 + 30, 290), (X0 + 40, 232), (X0 + 44, 214), (X0 + 36, 222), (X0 + 30, 206), (X0 + 22, 220), (X0 + 12, 204), (X0 + 4, 216)])
            L += [("white", snow.intersection(peak.buffer(-3)))]
            L += [("pine", U(*[pine(X0 + rng.uniform(8, 50), rng.uniform(22, 70), rng.uniform(16, 22), rng.uniform(30, 40)) for _ in range(7)]))]
            L += [("white", hills_poly(X0 - 5, X0 + 70, 32, 3, 0.08, rng))]
            L += [("base", line([(X0 - 4, 96), (X0 + 70, 176)], 1.4).intersection(peak.buffer(-3)))]
            for u in (12, 36):
                cab, win, arm = gondola(X0 + u, 96 + (u + 4) * 80 / 74, 16)
                L += [("base", arm), ("red", cab), ("white", win)]
        else:
            # Left: crossed skis leaning on the hut's log wall, stuck in the snow.
            sk1, st1 = ski((X0 + 10, 40), (X0 + 44, 274), 14)
            sk2, st2 = ski((X0 + 48, 40), (X0 + 16, 274), 14)
            wall = box(X0, 22, X0 + 30, 268)
            outline = U(wall, sk1, sk2, hills_poly(X0, X0 + 58, 44, 4, 0.06, rng).intersection(box(X0, 22, X0 + 60, 80)))
            outline = outline.intersection(box(X0, 22, X0 + 62, 290))
            L = [("base", outline), ("fur", wall.buffer(-2)), ("brown", U(*[box(X0, z - 0.7, X0 + 30, z + 0.7) for z in np.arange(34, 268, 13)]).intersection(wall.buffer(-2)))]
            L += [("red", sk2), ("white", st2)]
            L += [("base", sk1.buffer(1.4)), ("grey", sk1), ("red", st1)]
            L += [("white", hills_poly(X0 - 5, X0 + 70, 46, 4, 0.06, rng))]
        return outline, L

    def topper():
        # The hut's gable with snow on the roof, and the logo in front of it.
        roof = Polygon([(-HW - 12, 30), (0, 112), (HW + 12, 30)])
        logo = flying_hirsch_logo((-78, 30, 78, 186))
        # Keep the badge in one piece: the ski poles are too thin to print, so they and their baskets go.
        badge = U(*[g for _, g in logo]).buffer(0.6).buffer(-2.1).buffer(1.5)
        badge = max(getattr(badge, "geoms", [badge]), key=lambda g: g.area).buffer(2.4).buffer(-0.8)
        logo = [(k, g.intersection(badge).buffer(0)) for k, g in logo]
        outline = U(box(-HW, 0, HW, 34), roof, badge).intersection(box(-HW - 14, 0, HW + 14, 190))
        L = [("base", outline)]
        gable = Polygon([(-HW + 8, 30), (0, 94), (HW - 8, 30)])
        L += [("fur", gable), ("brown", U(*[box(x - 0.8, 26, x + 0.8, 120) for x in np.arange(-HW + 16, HW, 14)]).intersection(gable))]
        L += [("red", roof.difference(Polygon([(-HW + 6, 26), (0, 96), (HW - 6, 26)])))]
        rng = random.Random(11)
        ridge = LineString([(-HW - 12, 30), (0, 112), (HW + 12, 30)])
        drips = U(*[Point(x, 30 + (HW + 12 - abs(x)) * 82 / (HW + 12) - 6).buffer(rng.uniform(3, 5.5), 24) for x in np.linspace(-HW + 4, HW - 4, 26)])
        L += [("white", U(ridge.buffer(7), drips).intersection(roof))]
        L += [("base", box(-HW + 4, 4, HW - 4, 30)), ("tan", box(-HW + 6, 6, HW - 6, 28))]
        L += [("base", badge)] + logo
        L += [("base", text("THE CRAZIEST AFTERSKIBAR", "alfa-slab-one", 0, 17, 9, 200))]
        return outline, L

    def screen(w, h):
        rng = random.Random(4)
        L = [("night", box(0, 0, w, h))]
        L += [("white", U(*[star4(rng.uniform(10, w - 10), rng.uniform(h * 0.5, h - 10), rng.uniform(2.5, 5)) for _ in range(26)]))]
        far = Polygon([(-10, 300), (90, 420), (160, 380), (260, 490), (330, 420), (420, 460), (520, 390), (610, 430), (610, 300)])
        near = Polygon([(-10, 250), (70, 360), (150, 300), (240, 420), (330, 330), (440, 400), (540, 310), (610, 370), (610, 250)])
        L += [("stone", far), ("white", far.intersection(box(-10, 400, w + 10, h)).buffer(0)), ("pine", near)]
        L += [("pine", U(*[pine(x, 210, rng.uniform(40, 60), rng.uniform(80, 120)) for x in np.linspace(10, w - 10, 11)]))]
        L += [("white", hills_poly(0, w, 240, 10, 1.6, rng))]
        L += [("white", line([(-10, 350), (w + 10, 450)], 3))]
        cab, win, arm = gondola(w * 0.82, 350 + (w * 0.82 + 10) * 100 / (w + 20), 50)
        L += [("base", arm), ("red", cab), ("tan", win)]
        L += [("tan", text("THE CRAZIEST AFTERSKIBAR", "alfa-slab-one", w / 2, 498, 19, w * 0.78))]
        return L

    return dict(name="Flying Hirsch", place="Frederikshavn", font="alfa-slab-one", pal=pal,
                filament={"base": "PETG HF black", "grey": "PETG HF dark grey", "white": "PETG HF white", "red": "PETG HF red",
                          "darkred": "PETG HF burgundy", "fur": "PETG HF light brown", "brown": "PETG HF brown", "tan": "PETG HF tan", "stone": "PETG HF grey",
                          "pine": "PETG HF dark green", "night": "PETG HF navy"},
                casing="#0d0b0a", ring={"idle": ["#fff1de", "#c8181f"], "glow": "#e8333a"},
                screen=dict(bg="night", ink="white", accent="red", cta="Sig «Prost!»", ticker="The Craziest Afterskibar  •  Flying Hirsch  •  Søndergade, Frederikshavn  •  Prost!  •"),
                frame=dict(bg="base", ink="red", caption="Flying Hirsch · Frederikshavn"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: flying_hirsch_logo((-60, 0, 60, 120)),
                # The bar's artwork itself on the screen, the photo frame and the site, sharper than the traced inlay.
                logo_png=dict(file="flying_hirsch-source.png", screen=(300, 930, 400), frame=(40, 182, 172)))


# --------------------------------------------------------- clubs (sport) --
# AaB, Aalborg Boldspilklub af 1885: "De Røde" or "De Bolchestribede". The topper is the top of the 2026/27 home shirt
# (broad red and white stripes, white retro collar) with the crest on the chest, the left wing a fan scarf
# and the right wing a floodlight mast over the pitch. The crest is traced from logos/aab-source.png.

def aab_logo(bounds):
    lg = traced_logo("aab")
    placed = place_logo(lg, bounds, [("red", "base"), ("white", "white"), ("bright", "bright"), ("darkred", "darkred")])
    return [(k, shapely.set_precision(g.buffer(0), 0.05).buffer(0.2).buffer(-0.2)) for k, g in placed]


def flip_text(g):
    """Text that reads right after the left wing is mirrored."""
    c = g.centroid
    return affinity.scale(g, -1, 1, origin=(c.x, c.y))


def football(cx, cz, r):
    """A football: white ball, black centre pentagon and five cut pentagons at the rim."""
    ballg = Point(cx, cz).buffer(r, 64)
    pent = lambda x, z, s, rot: Polygon([(x + s * math.cos(math.radians(90 + rot + 72 * i)), z + s * math.sin(math.radians(90 + rot + 72 * i))) for i in range(5)])
    black = [pent(cx, cz, r * 0.36, 0)]
    for i in range(5):
        a = math.radians(90 + 36 + 72 * i)
        black.append(pent(cx + r * 0.92 * math.cos(a), cz + r * 0.92 * math.sin(a), r * 0.3, 36))
    return ballg, U(*black).intersection(ballg)


@theme
def aab():
    # The crest's own reds and white, the night over the stadium and the pitch.
    pal = {"base": "#c4161d", "bright": "#ed1c24", "darkred": "#870e12", "white": "#f7f7f5", "ink": "#16181b",
           "steel": "#8d939b", "grass": "#2f7d3a", "grass2": "#3b9548", "night": "#0e1730", "sky": "#1d2c52"}

    def wing(side_seed):
        if side_seed % 2 == 0:
            # Right: a floodlight mast standing on the pitch, the light bank leaning in over the box, and a ball.
            bank = affinity.rotate(box(X0 + 4, 236, X0 + 58, 284).buffer(5).buffer(-1), -6, origin=(X0 + 28, 260))
            mast = box(X0 + 20, 40, X0 + 34, 244)
            turf = hills_poly(X0 - 4, X0 + 64, 40, 2, 0.04, random.Random(3), z_floor=22).intersection(box(X0, 22, X0 + 64, 60))
            ballg, patches = football(X0 + 44, 58, 15)
            outline = U(wing_strip(20, 24, 280), bank.buffer(2), mast.buffer(2), turf.buffer(2), ballg.buffer(2))
            outline = outline.intersection(box(X0, 22, X0 + 66, 296))
            L = [("base", outline), ("steel", mast)]
            lattice = U(*[line([(X0 + 21, z), (X0 + 33, z + 12)], 1.6) for z in np.arange(46, 232, 12)],
                        *[line([(X0 + 33, z), (X0 + 21, z + 12)], 1.6) for z in np.arange(46, 232, 12)]).intersection(mast)
            L += [("ink", lattice), ("ink", bank)]
            lamps = []
            for i in range(3):
                for j in range(3):
                    lamps.append(Point(X0 + 14 + i * 14, 248 + j * 13).buffer(5, 32))
            L += [("white", affinity.rotate(U(*lamps), -6, origin=(X0 + 28, 260)))]
            L += [("grass", turf), ("grass2", U(*[box(x, 22, x + 8, 60) for x in np.arange(X0 - 4, X0 + 64, 16)]).intersection(turf))]
            L += [("white", line([(X0 - 2, 34), (X0 + 66, 34)], 1.6).intersection(turf))]
            L += [("base", ballg.buffer(1.2)), ("white", ballg), ("ink", patches)]
        else:
            # Left: the fan scarf, red with AaB down the middle, striped ends and a fringe.
            sx0, sx1 = X0 + 6, X0 + 46
            scarf = box(sx0, 44, sx1, 270)
            fr0 = U(*[box(x - 1.6, 26, x + 1.6, 46) for x in np.linspace(sx0 + 3, sx1 - 3, 7)])
            fr1 = U(*[box(x - 1.6, 268, x + 1.6, 288) for x in np.linspace(sx0 + 3, sx1 - 3, 7)])
            outline = U(wing_strip(10, 24, 286), scarf.buffer(2), fr0.buffer(1.8), fr1.buffer(1.8)).intersection(box(X0, 22, X0 + 52, 292))
            L = [("base", outline), ("white", U(fr0, fr1))]
            L += [("base", scarf)]
            for z0, z1 in ((44, 270),):
                stripes = U(*[box(sx0, z, sx1, z + 7) for z in (52, 66, 236, 250)])
                L += [("white", stripes)]
            word = affinity.rotate(text("AaB", "archivo-black", 0, 0, 24), 90, origin=(0, 0))
            word = flip_text(fit(word, (sx0 + 9, 120, sx1 - 9, 200)))
            year = affinity.rotate(text("1885", "archivo-black", 0, 0, 10), 90, origin=(0, 0))
            year = flip_text(fit(year, (sx0 + 13, 86, sx1 - 13, 112)))
            year2 = affinity.rotate(text("1885", "archivo-black", 0, 0, 10), 90, origin=(0, 0))
            year2 = flip_text(fit(year2, (sx0 + 13, 208, sx1 - 13, 230)))
            L += [("white", U(word, year, year2))]
        return outline, L

    def topper():
        # The top of the home shirt above a white name plate: red sleeves, broad stripes, V collar, crest.
        p = 24   # the shirt starts above the plate
        shirt = Polygon([(-HW + 2, p - 2), (HW - 2, p - 2), (HW, p + 52), (HW + 16, p + 42), (HW + 18, p + 86), (HW - 8, p + 112),
                         (36, p + 128), (0, p + 116), (-36, p + 128), (-HW + 8, p + 112), (-HW - 18, p + 86), (-HW - 16, p + 42), (-HW, p + 52)])
        shirt = shirt.buffer(4, join_style="round").buffer(-4, join_style="round")
        plate = box(-HW, 0, HW, p + 2)
        outline = U(plate, shirt.buffer(2.4)).intersection(box(-HW - 22, 0, HW + 22, 200))
        L = [("base", outline)]
        body = shirt.intersection(box(-HW + 2, -10, HW - 2, 400))
        L += [("white", U(*[box(x, p - 4, x + 26, p + 140) for x in (-91, -39, 13, 65)]).intersection(body))]
        # Seams where the sleeves meet the body.
        L += [("darkred", U(line([(HW - 2, p + 52), (HW - 9, p + 112)], 1.4), line([(-HW + 2, p + 52), (-HW + 9, p + 112)], 1.4)))]
        neck = Polygon([(-36, p + 128), (0, p + 92), (36, p + 128)])
        collar = neck.buffer(0).difference(Polygon([(-24, p + 130), (0, p + 104), (24, p + 130)]))
        L += [("white", collar.intersection(shirt.buffer(0.1))), ("darkred", Polygon([(-24, p + 130), (0, p + 104), (24, p + 130)]).intersection(shirt))]
        L += [("base", line([(-31, p + 126), (0, p + 98), (31, p + 126)], 1.6).intersection(shirt))]
        crest = aab_logo((-36, p + 18, 36, p + 88))
        L += crest
        L += [("white", box(-HW + 5, 4, HW - 5, p - 2)), ("base", text("AALBORG BOLDSPILKLUB", "archivo-black", 0, (p + 2) / 2, 9, 200))]
        return outline, L

    def screen(w, h):
        rng = random.Random(9)
        L = [("night", box(0, 0, w, h))]
        for cx in (70, w - 70):
            beam = Polygon([(cx - 40, 880), (cx + 40, 880), (w / 2 + (cx - w / 2) * 0.2 + 140, 340), (w / 2 + (cx - w / 2) * 0.2 - 140, 340)])
            L += [("sky", beam)]
        stand = Polygon([(-10, 330), (-10, 470), (90, 500), (w / 2, 512), (w - 90, 500), (w + 10, 470), (w + 10, 330)])
        L += [("darkred", stand)]
        dots = []
        for _ in range(260):
            x, z = rng.uniform(0, w), rng.uniform(345, 490)
            if Point(x, z).within(stand.buffer(-6)):
                dots.append((x, z))
        L += [("white", U(*[Point(x, z).buffer(4.2, 12) for x, z in dots[::2]])), ("bright", U(*[Point(x, z).buffer(4.2, 12) for x, z in dots[1::2]]))]
        L += [("ink", line([(-10, 470), (90, 500), (w / 2, 512), (w - 90, 500), (w + 10, 470)], 6))]
        for cx in (70, w - 70):
            L += [("steel", box(cx - 6, 500, cx + 6, 880)), ("ink", box(cx - 40, 870, cx + 40, 930).buffer(6))]
            L += [("white", U(*[Point(cx - 26 + i * 26, 888 + j * 26).buffer(9, 24) for i in range(3) for j in range(2)]))]
        pitch = box(0, 0, w, 340)
        L += [("grass", pitch), ("grass2", U(*[box(0, z, w, z + 34) for z in range(0, 340, 68)]))]
        L += [("white", line([(-10, 334), (w + 10, 334)], 4))]
        L += [("white", text("DE BOLCHESTRIBEDE", "archivo-black", w / 2, 560, 28, w * 0.78))]
        return L

    return dict(name="AaB", place="Aalborg", font="archivo-black", pal=pal,
                filament={"base": "PETG HF red", "bright": "PETG HF bright red", "darkred": "PETG HF burgundy", "white": "PETG HF white",
                          "ink": "PETG HF black", "steel": "PETG HF grey", "grass": "PETG HF green", "grass2": "PETG HF light green",
                          "night": "PETG HF navy", "sky": "PETG HF blue"},
                casing="#c4161d", ring={"idle": ["#ffffff", "#ed1c24"], "glow": "#ed1c24"},
                screen=dict(bg="white", ink="white", accent="base", cta="Råb «Kom så AaB!»", ticker="De Bolchestribede  •  AaB af 1885  •  Aalborg Portland Park  •  Kom så AaB!  •"),
                frame=dict(bg="base", ink="white", caption="Aalborg Portland Park"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: aab_logo((-60, 0, 60, 120)),
                logo_png=dict(file="aab-source.png", screen=(300, 930, 300), frame=(40, 182, 150)))


# ---------------------------------------------------------- cinemas (bio) --
# Palads Teatret, Frederikshavn: a four-screen town cinema with an art deco name sign. The topper is a cinema
# marquee with a ring of bulbs around the name and a stepped deco crown, the right wing a vertical BIO blade sign
# over a striped popcorn box and the left wing a film strip unwinding from its reel. Drawn for the gen 2 unit. The logo is traced from
# logos/palads-source.png (white on the cinema's dark violet).

def palads_logo(bounds):
    lg = traced_logo("palads")
    return [(k, shapely.set_precision(g.buffer(0), 0.05).buffer(0.2).buffer(-0.2)) for k, g in place_logo(lg, bounds, [("white", "white")])]


def bulbs_along(ring, step, r):
    """Marquee bulbs every `step` mm along a closed or open line."""
    n = max(1, int(ring.length // step))
    return U(*[ring.interpolate(i * ring.length / n).buffer(r, 24) for i in range(n)])


def popcorn_box(cx, z0, w0, w1, h):
    """A striped popcorn box, `w0` wide at the bottom and `w1` at the top, and the popcorn heaped on it."""
    body = Polygon([(cx - w0 / 2, z0), (cx + w0 / 2, z0), (cx + w1 / 2, z0 + h), (cx - w1 / 2, z0 + h)])
    stripes = U(*[Polygon([(cx + a * w0 / 2, z0), (cx + b * w0 / 2, z0), (cx + b * w1 / 2, z0 + h), (cx + a * w1 / 2, z0 + h)])
                  for a, b in ((-0.6, -0.2), (0.2, 0.6))])
    rng = random.Random(5)
    corn = U(*[Point(cx + rng.uniform(-w1 * 0.42, w1 * 0.42), z0 + h + rng.uniform(-1, 9)).buffer(rng.uniform(4.2, 6.2), 24) for _ in range(9)],
             Point(cx, z0 + h + 10).buffer(6.5, 24))
    return body, stripes, corn


@theme
def palads():
    # The cinema's own dark violet and white, brass and warm bulbs for the marquee, red velvet for the hall.
    pal = {"base": "#2b2a3d", "night": "#312f43", "deep": "#1b1a28", "white": "#f7f5ee", "gold": "#e0ae45",
           "bulb": "#fff2c2", "velvet": "#9b1c22", "velvetd": "#5e0d14", "corn": "#f3dc9a", "silver": "#a7a9ba", "sky": "#47456a"}

    def wing(side_seed):
        if side_seed % 2 == 0:
            # Right: a vertical BIO blade sign with bulbs down both sides, standing on a popcorn box.
            blade = box(X0 + 8, 104, X0 + 50, 268).buffer(6).buffer(-2)
            cap = Polygon([(X0 + 10, 270), (X0 + 48, 270), (X0 + 40, 284), (X0 + 18, 284)]).buffer(1.5)
            body, stripes, corn = popcorn_box(X0 + 31, 24, 38, 50, 52)
            outline = U(wing_strip(12, 24, 284), blade.buffer(2), cap.buffer(2), body.buffer(2), corn.buffer(2))
            outline = outline.intersection(box(X0, 22, X0 + 64, 294))
            L = [("base", outline), ("gold", U(blade, cap)), ("night", blade.buffer(-4))]
            L += [("bulb", U(bulbs_along(LineString([(X0 + 14, 112), (X0 + 14, 262)]), 12.5, 2.6),
                             bulbs_along(LineString([(X0 + 44, 112), (X0 + 44, 262)]), 12.5, 2.6)))]
            for ch, z in (("B", 236), ("I", 186), ("O", 136)):
                # Limelight's hairlines are thinner than a print can hold: thicken every stroke by 1.8 mm.
                L += [("white", text(ch, "limelight", X0 + 29, z, 28, 18).buffer(0.9))]
            L += [("base", box(X0 + 22, 274, X0 + 36, 279)), ("white", body), ("velvet", stripes), ("corn", corn)]
            L += [("velvet", box(X0 + 6, 24, X0 + 56, 30).intersection(body))]
        else:
            # Left: a film strip unwinding from its reel down to the foot of the box.
            reel_c = (X0 + 32, 258)
            path = LineString([(X0 + 32 + 7 * math.sin(t * 2.2), 238 - t * 196) for t in np.linspace(0, 1, 60)])
            strip = path.buffer(15, cap_style="flat")
            reel = Point(reel_c).buffer(28, 64)
            outline = U(wing_strip(10, 24, 286), strip.buffer(2), reel.buffer(2)).intersection(box(X0, 22, X0 + 64, 292))
            L = [("base", outline), ("deep", strip)]
            perf, frames = [], []
            n = 22
            for i in range(n):
                d = 6 + i * (path.length - 12) / (n - 1)
                p, q = path.interpolate(d), path.interpolate(min(path.length, d + 0.5))
                ang = math.degrees(math.atan2(q.y - p.y, q.x - p.x))
                for off in (-11.2, 11.2):
                    nx, nz = -math.sin(math.radians(ang)) * off, math.cos(math.radians(ang)) * off
                    perf.append(affinity.rotate(box(-2.3, -1.6, 2.3, 1.6), ang, origin=(0, 0)).buffer(0.6))
                    perf[-1] = affinity.translate(perf[-1], p.x + nx, p.y + nz)
                if i % 3 == 1:
                    frames.append(affinity.translate(affinity.rotate(box(-8.5, -6.5, 8.5, 6.5).buffer(1), ang, origin=(0, 0)), p.x, p.y))
            L += [("white", U(*perf)), ("bulb", U(*frames).intersection(strip.buffer(-1)))]
            L += [("base", reel.buffer(1.5)), ("silver", reel), ("deep", Point(reel_c).buffer(23, 64).difference(Point(reel_c).buffer(21, 64)))]
            holes = [Point(reel_c[0] + 13 * math.cos(math.radians(90 + 72 * i)), reel_c[1] + 13 * math.sin(math.radians(90 + 72 * i))).buffer(5.5, 32) for i in range(5)]
            L += [("deep", U(*holes)), ("deep", Point(reel_c).buffer(4, 24)), ("silver", Point(reel_c).buffer(1.8, 16))]
        return outline, L

    def topper():
        # A marquee over the entrance: brass frame with bulbs, the name in the middle, a stepped crown and a letter board.
        sign = box(-HW - 10, 26, HW + 10, 128).buffer(9).buffer(-9)
        crown = U(box(-74, 120, 74, 140).buffer(3).buffer(-3), box(-48, 120, 48, 154).buffer(3).buffer(-3), Point(0, 150).buffer(30, 64).intersection(box(-31, 150, 31, 200)))
        plate = box(-HW, 0, HW, 28)
        outline = U(plate, sign.buffer(2), crown.buffer(2)).intersection(box(-HW - 14, 0, HW + 14, 190))
        L = [("base", outline), ("gold", U(sign, crown))]
        # Sunburst: brass rays on the violet fan.
        fan = Point(0, 150).buffer(25, 64).intersection(box(-26, 150, 26, 190))
        rays = U(*[Polygon([(0, 150), (40 * math.cos(math.radians(a - 5)), 150 + 40 * math.sin(math.radians(a - 5))), (40 * math.cos(math.radians(a + 5)), 150 + 40 * math.sin(math.radians(a + 5)))]) for a in range(15, 180, 30)])
        L += [("night", fan.difference(rays)), ("night", box(-70, 140, 70, 136).buffer(0)), ("base", box(-42, 141, 42, 150)), ("base", box(-70, 126, 70, 136))]
        L += [("velvet", Point(0, 150).buffer(6, 32).intersection(box(-7, 150, 7, 160)))]
        inner = sign.buffer(-10)
        L += [("night", inner)]
        L += [("bulb", bulbs_along(sign.buffer(-5).exterior, 11, 2.7))]
        L += palads_logo((-96, 38, 96, 116))
        L += [("white", box(-HW + 5, 4, HW - 5, 24)), ("deep", text("BIOGRAF  ·  FREDERIKSHAVN", "limelight", 0, 14, 9.5, 196).buffer(0.45))]
        return outline, L

    def screen(w, h):
        L = [("night", box(0, 0, w, h))]
        # Spotlights crossing over the stage, the glowing big screen, and the velvet curtains drawn aside.
        for cx, tx in ((40, w * 0.62), (w - 40, w * 0.38)):
            L += [("sky", Polygon([(cx - 12, 860), (cx + 12, 860), (tx + 90, 380), (tx - 90, 380)]))]
        L += [("deep", U(*[Point(x, 140).buffer(26, 32) for x in np.arange(20, w, 56)], box(0, 0, w, 140)))]
        L += [("deep", U(*[Point(x, 74).buffer(28, 32) for x in np.arange(-8, w + 30, 56)]))]
        for side in (0, 1):
            xs = np.linspace(0, 1, 40)
            edge = [(120 - 30 * (1 - t) ** 2 + 8 * math.sin(t * 14), 960 - t * 960) for t in xs]
            poly = Polygon([(-10, 970)] + edge + [(-10, -10)])
            folds = U(*[line([(x0, 960), (x0 + 6, 0)], 5) for x0 in (24, 56, 88)]).intersection(poly)
            if side:
                poly, folds = affinity.scale(poly, -1, 1, origin=(w / 2, 0)), affinity.scale(folds, -1, 1, origin=(w / 2, 0))
            L += [("velvet", poly), ("velvetd", folds)]
        val = U(box(0, 880, w, 960), *[Point(x, 880).buffer(26, 32) for x in np.arange(26, w, 54)])
        L += [("velvet", val), ("gold", line([(-10, 900), (w + 10, 900)], 4)), ("velvetd", U(*[line([(x, 960), (x, 870)], 4) for x in np.arange(53, w, 54)]).intersection(val))]
        L += [("gold", text("PREMIERE I AFTEN", "limelight", w / 2, 560, 30, w * 0.66))]
        L += [("bulb", U(*[Point(x, 520).buffer(4, 16) for x in np.arange(150, w - 140, 20)]), )]
        return L

    return dict(name="Palads Teatret", place="Frederikshavn", font="limelight", pal=pal, unit="gen2",
                filament={"base": "PETG HF dark blue", "night": "PETG HF navy", "deep": "PETG HF black", "white": "PETG HF white",
                          "gold": "PETG HF gold", "bulb": "PETG HF cream", "velvet": "PETG HF red", "velvetd": "PETG HF burgundy",
                          "corn": "PETG HF yellow", "silver": "PETG HF silver", "sky": "PETG HF lilac"},
                casing="#2b2a3d", ring={"idle": ["#fff2c2", "#e0ae45"], "glow": "#e0ae45"},
                screen=dict(bg="night", ink="white", accent="gold", cta="Sig «Popcorn!»",
                            ticker="Palads Teatret  •  Ørnevej 6A, Frederikshavn  •  4 sale  •  Dolby Atmos  •  Vi ses i biografen  •"),
                frame=dict(bg="base", ink="gold", caption="Frederikshavn"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: palads_logo((-60, 0, 60, 120)),
                logo_png=dict(file="palads-source.png", screen=(300, 800, 420), frame=(40, 160, 112)))


# --------------------------------------------------------- grocers (købmand) --
# MENY Fjerritslev, Søgade 10: the town's food market with a butcher, a wine man and food to take home for
# the party. The topper is a market awning with the MENY arch on it, the left wing a stack of greengrocer's
# crates, the right wing a MENY-red shopping basket with a baguette, a bottle of wine and a leek. Drawn for
# the gen 2 unit. The logo is traced from logos/meny-source.png (meny.dk's own vector logo).

def meny_logo(bounds, outline=True):
    """The MENY arch: red arch with white letters. With `outline`, a white edge 1.6 mm wide around it."""
    lg = traced_logo("meny")
    flip = {k: affinity.scale(g, 1, -1, origin=(0, 0)) for k, g in lg.items()}
    arch = U(*[Polygon(p.exterior) for p in getattr(flip["red"], "geoms", [flip["red"]])])
    letters = flip["white"].intersection(arch.buffer(-1))
    gx0, gz0, gx1, gz1 = arch.bounds
    x0, z0, x1, z1 = bounds
    k = min((x1 - x0) / (gx1 - gx0), (z1 - z0) / (gz1 - gz0))
    place = lambda g: affinity.translate(affinity.scale(g, k, k, origin=(0, 0)), (x0 + x1) / 2 - (gx0 + gx1) / 2 * k, (z0 + z1) / 2 - (gz0 + gz1) / 2 * k)
    arch, letters = place(arch), place(letters)
    # Letters thickened a little so their inner corners print cleanly.
    L = [("white", arch.buffer(1.6))] if outline else []
    return L + [("red", arch), ("white", letters.buffer(0.25).intersection(arch.buffer(-0.8)))]


def scallops(x0, x1, z, r):
    """The scalloped front edge of an awning: half discs hanging down from z."""
    n = max(1, round((x1 - x0) / (2 * r)))
    step = (x1 - x0) / n
    return U(*[Point(x0 + step * (i + 0.5), z).buffer(step / 2, 32).intersection(box(x0 + step * i, z - step, x0 + step * (i + 1), z)) for i in range(n)])


def crate(x0, z0, w, h):
    """A greengrocer's wooden crate seen from the front: frame, two slats and the gaps between them."""
    body = box(x0, z0, x0 + w, z0 + h)
    gaps = U(box(x0 + 4, z0 + h * 0.36 - 1.6, x0 + w - 4, z0 + h * 0.36 + 1.6), box(x0 + 4, z0 + h * 0.68 - 1.6, x0 + w - 4, z0 + h * 0.68 + 1.6))
    posts = U(box(x0, z0, x0 + 5, z0 + h), box(x0 + w - 5, z0, x0 + w, z0 + h))
    return body, gaps, posts


def apple(cx, cz, r, rot=0):
    """An apple with a stalk and one fat leaf. Returns (fruit, leaf, stalk)."""
    fruit = U(Point(cx - r * 0.36, cz).buffer(r * 0.72, 32), Point(cx + r * 0.36, cz).buffer(r * 0.72, 32), Point(cx, cz - r * 0.2).buffer(r * 0.8, 32))
    fruit = affinity.rotate(fruit, rot, origin=(cx, cz))
    return fruit, leaf(cx + 1, cz + r * 0.62, r * 0.75, r * 0.5, -55 + rot), line([(cx, cz + r * 0.5), (cx - 1, cz + r * 1.05)], 2.2)


def carrot(cx, cz, ln, w, rot=0):
    """A carrot pointing down from (cx, cz), with three chunky leaves. Returns (root, tops)."""
    root = Polygon([(cx - w / 2, cz), (cx + w / 2, cz), (cx + 1.2, cz - ln), (cx - 1.2, cz - ln)]).buffer(1.2)
    tops = U(*[leaf(cx, cz - 1, w * 1.35, w * 0.62, a) for a in (-28, 0, 28)])
    return affinity.rotate(root, rot, origin=(cx, cz)), affinity.rotate(tops, rot, origin=(cx, cz))


@theme
def meny():
    # MENY's own red, charcoal and kraft from meny.dk; wood for the crates, greens and orange for the produce.
    pal = {"base": "#3c3c3b", "deep": "#262625", "red": "#cc092f", "darkred": "#8e0620", "white": "#ffffff", "cream": "#f4efe6",
           "kraft": "#c4b9aa", "wood": "#b07a45", "woodd": "#7a4f2a", "green": "#4f8a2b", "lime": "#93c143", "orange": "#ef7d1a",
           "yellow": "#f2c230", "bottle": "#24452f", "bread": "#d9a25b"}

    def wing(side_seed):
        if side_seed % 2 == 0:
            # Right: a MENY-red shopping basket with a baguette, a bottle of red wine and a leek standing in it,
            # and the price tag every customer knows, here for a smile.
            bx0, bx1 = X0 + 4, X0 + 60
            basket = Polygon([(bx0, 96), (bx1, 96), (bx1 - 5, 26), (bx0 + 5, 26)]).buffer(2.5)
            slots = U(*[box(x - 2.2, 40, x + 2.2, 82) for x in np.linspace(bx0 + 13, bx1 - 13, 4)])
            rim = box(bx0 - 3, 90, bx1 + 3, 102).buffer(2)
            handle = U(box(bx0 + 2, 96, bx0 + 9, 124), box(bx1 - 9, 96, bx1 - 2, 124), box(bx0 + 2, 117, bx1 - 2, 124)).buffer(1.5)
            bottle = U(box(X0 + 34, 92, X0 + 54, 214).buffer(5).intersection(box(X0 + 20, 92, X0 + 70, 214)),
                       Polygon([(X0 + 34, 206), (X0 + 54, 206), (X0 + 49, 232), (X0 + 39, 232)]), box(X0 + 38.5, 228, X0 + 49.5, 268).buffer(1))
            label = box(X0 + 36, 136, X0 + 52, 170).buffer(1.5)
            capsule = box(X0 + 37.5, 254, X0 + 50.5, 269).buffer(1)
            bread = line([(X0 + 16, 92), (X0 + 22, 262)], 17)
            cuts = U(*[affinity.rotate(ell(X0 + 16 + 6 * t, 92 + 170 * t, 6.2, 2.2), 28, origin=(X0 + 16 + 6 * t, 92 + 170 * t)) for t in (0.45, 0.6, 0.75, 0.9)])
            tag_c = (X0 + 31, 166)
            tag = affinity.rotate(box(tag_c[0] - 27, tag_c[1] - 19, tag_c[0] + 27, tag_c[1] + 19).buffer(4), -8, origin=tag_c)
            outline = U(wing_strip(12, 24, 276), basket.buffer(2), rim.buffer(2), handle.buffer(2), bottle.buffer(2), bread.buffer(2), tag.buffer(2), capsule.buffer(2))
            outline = outline.intersection(box(X0, 22, X0 + 66, 294))
            L = [("base", outline), ("bread", bread), ("cream", cuts.intersection(bread.buffer(-1.5)))]
            L += [("bottle", bottle), ("cream", label), ("darkred", capsule), ("darkred", box(X0 + 39, 146, X0 + 49, 160).buffer(1))]
            L += [("red", handle.difference(rim)), ("red", basket), ("darkred", slots), ("red", rim)]
            L += [("white", tag), ("red", affinity.rotate(text("SMIL", "lilita-one", tag_c[0], tag_c[1] + 9, 11, 40), -8, origin=tag_c))]
            L += [("deep", affinity.rotate(text("0,-", "lilita-one", tag_c[0], tag_c[1] - 7, 15, 40), -8, origin=tag_c))]
        else:
            # Left: three greengrocer's crates on top of each other, heaped with apples, carrots and greens.
            cw, ch, gap = 58, 44, 24
            cx0 = X0 + 3
            L, shapes = [], []
            for i, z0 in enumerate((24, 24 + ch + gap, 24 + 2 * (ch + gap))):
                body, gaps, posts = crate(cx0, z0, cw, ch)
                shapes.append(body)
                L += [("wood", body), ("woodd", gaps), ("woodd", posts.difference(gaps))]
            rng = random.Random(3)
            # Produce heaped on each crate (drawn behind the crate front above it).
            heaps = []
            z_bot, z_mid, z_top = 24 + ch, 24 + 2 * ch + gap, 24 + 3 * ch + 2 * gap
            apples = [apple(cx0 + 10 + j * 13, z_bot + 7 + (j % 2) * 3, 7.5, rng.uniform(-12, 12)) for j in range(4)]
            heaps += [("red", U(*[a[0] for a in apples])), ("green", U(*[a[1] for a in apples])), ("woodd", U(*[a[2] for a in apples]))]
            oranges = U(*[Point(cx0 + 9 + j * 13.3, z_mid + 7 + (j % 2) * 3).buffer(7.6, 32) for j in range(4)])
            heaps += [("orange", oranges), ("green", U(*[leaf(cx0 + 9 + j * 13.3, z_mid + 12 + (j % 2) * 3, 7, 4.5, -60) for j in (0, 2)]))]
            # Top crate: carrots fanned out and a head of broccoli, the tallest thing on the stand.
            tops, roots = [], []
            for a, dx in ((14, 9), (4, 20), (-8, 31)):
                # Root up, leaves down over the rim of the crate.
                r, t = carrot(cx0 + dx, z_top + 17, 34, 11, 180 + a)
                roots.append(r)
                tops.append(t)
            broc = U(*[Point(cx0 + 44 + x, z_top + 26 + z).buffer(r, 32) for x, z, r in ((-6, 6, 9), (6, 8, 9), (0, 16, 10), (-10, 14, 7), (10, 16, 7))])
            stem = box(cx0 + 41, z_top - 2, cx0 + 47, z_top + 20).buffer(1)
            leaves = U(*tops)
            heaps += [("green", leaves), ("orange", U(*roots)), ("lime", stem), ("green", broc), ("lime", U(*[Point(cx0 + 44 + x, z_top + 26 + z).buffer(2.4, 16) for x, z in ((-6, 8), (5, 11), (0, 19), (-11, 15), (11, 18))]))]
            heap_shape = U(*[g for _, g in heaps])
            outline = U(wing_strip(10, 24, 270), *[s.buffer(2) for s in shapes], heap_shape.buffer(2)).intersection(box(X0, 22, X0 + 66, 294))
            # Round off the notches between the heaps, and fill the pockets that closing them leaves.
            outline = outline.buffer(3).buffer(-3)
            outline = Polygon(max(getattr(outline, "geoms", [outline]), key=lambda q: q.area).exterior)
            # Draw back to front: produce first, then the crate fronts over the bottom of each heap.
            L = [("base", outline)] + heaps + L
        return outline, L

    def topper():
        # A market awning with the MENY arch on top and a name plate below.
        plate = box(-HW, 0, HW, 26)
        aw0, aw1 = 30, 82
        awning = Polygon([(-HW - 8, aw0), (HW + 8, aw0), (HW - 4, aw1), (-HW + 4, aw1)])
        edge = scallops(-HW - 8, HW + 8, aw0, 9)
        n = 10
        stripes = []
        for i in range(0, n, 2):
            t0, t1 = i / n, (i + 1) / n
            xb0, xb1 = -HW - 8 + (2 * HW + 16) * t0, -HW - 8 + (2 * HW + 16) * t1
            xt0, xt1 = -HW + 4 + (2 * HW - 8) * t0, -HW + 4 + (2 * HW - 8) * t1
            stripes.append(Polygon([(xb0, aw0 - 10), (xb1, aw0 - 10), (xt1, aw1), (xt0, aw1)]))
        stripes = U(*stripes)
        canvas = U(awning, edge)
        logo = meny_logo((-108, 78, 108, 176))
        arch = U(*[g for _, g in logo])
        filler = box(-70, aw1 - 2, 70, arch.bounds[1] + 30).intersection(arch.convex_hull)
        outline = U(plate, canvas.buffer(2), arch.buffer(2.5), filler).buffer(2).buffer(-2)
        L = [("base", outline), ("white", canvas), ("red", stripes.intersection(canvas)), ("darkred", box(-HW - 9, aw1 - 4, HW + 9, aw1 + 1).intersection(awning.buffer(1)))]
        L += logo
        L += [("cream", box(-HW + 5, 4, HW - 5, 22).buffer(2).buffer(-2)), ("base", text("FØDEVAREMARKED  ·  FJERRITSLEV", "lilita-one", 0, 13, 9, 200))]
        return outline, L

    def screen(w, h):
        # The shop floor: kraft paper wall, the awning across the top, crates of produce along the bottom.
        L = [("cream", box(0, 0, w, h))]
        L += [("kraft", U(*[box(x, 0, x + 18, h) for x in np.arange(-6, w, 60)]))]
        aw = box(-10, 820, w + 10, 960)
        L += [("white", U(aw, scallops(-10, w + 10, 820, 26)))]
        L += [("red", U(*[box(x, 790, x + 60, 960) for x in np.arange(-10, w + 10, 120)]).intersection(U(aw, scallops(-10, w + 10, 820, 26))))]
        L += [("darkred", box(-10, 952, w + 10, 960))]
        rng = random.Random(9)
        crates = []
        for i, x in enumerate(np.arange(10, w, 148)):
            body, gaps, posts = crate(x, 46, 136, 92)
            fill, extra = (("red", "green") if i % 2 == 0 else ("orange", "yellow"))
            fruit = U(*[Point(x + 16 + j * 21 + rng.uniform(-2, 2), 140 + (j % 2) * 8).buffer(14, 32) for j in range(6)])
            crates += [(fill, fruit), (extra, U(*[Point(x + 12 + j * 21, 148 + (j % 2) * 8).buffer(3.5, 16) for j in range(6)])), ("wood", body), ("woodd", gaps), ("woodd", posts)]
        L += crates
        L += [("base", text("FJERRITSLEV SMILER", "lilita-one", w / 2, 520, 34, w * 0.74))]
        L += [("red", U(*[Point(x, 478).buffer(4, 16) for x in np.arange(150, w - 140, 20)]))]
        return L

    return dict(name="MENY Fjerritslev", place="Fjerritslev", font="lilita-one", pal=pal, unit="gen2",
                filament={"base": "PETG HF dark grey", "deep": "PETG HF black", "red": "PETG HF red", "darkred": "PETG HF burgundy", "white": "PETG HF white",
                          "cream": "PETG HF cream", "kraft": "PETG HF beige", "wood": "PETG HF light brown", "woodd": "PETG HF brown",
                          "green": "PETG HF green", "lime": "PETG HF lime", "orange": "PETG HF orange", "yellow": "PETG HF yellow",
                          "bottle": "PETG HF dark green", "bread": "PETG HF tan"},
                casing="#cc092f", ring={"idle": ["#ffffff", "#cc092f"], "glow": "#ffffff"},
                screen=dict(bg="white", ink="red", accent="red", cta="Sig «Ost!»",
                            ticker="MENY Fjerritslev  •  Søgade 10  •  Slagter, vinmand og mad ud af huset  •  Sig ost!  •"),
                frame=dict(bg="white", ink="base", caption="Fjerritslev"), photo="print-birthday",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: meny_logo((-60, 0, 60, 120), outline=False),
                logo_png=dict(file="meny-source.png", screen=(300, 800, 380), frame=(40, 165, 110)))


# ------------------------------------------------------------ bars (heidis) --
# Heidi's Bier Bar: REKOM's afterski and Oktoberfest bar chain, six bars in Denmark (Aalborg, Aarhus, København,
# Herning, Sønderborg, Thisted) and more in Norway. Staff in lederhosen and dirndl, 4-litre beer towers, bier pong,
# singing on the tables. The topper is a gingerbread heart from the Oktoberfest stalls with the logo in its icing,
# wheat and hops from the logo at its sides, the right wing a beer tower and the left wing a maypole in the bar's
# green and white with a pretzel and a stein. Drawn for the gen 2 unit. The logo is traced from
# logos/heidis-source.png (heidisbierbar.dk's 320 px logo, upscaled 4x): ask the bar for vector artwork before printing.

def heidis_logo(bounds):
    lg = traced_logo("heidis")
    placed = place_logo(lg, bounds, [(k, k) for k in ("white", "yellow", "green", "brown")])
    return [(k, shapely.set_precision(g.buffer(0), 0.05).buffer(0.2).buffer(-0.2)) for k, g in placed]


def heart_shape(cx, cz, w, h):
    """A plump gingerbread heart, `w` wide and `h` tall, its point at (cx, cz)."""
    r = w / 4
    lobes = U(Point(cx - r, cz + h - r).buffer(r, 64), Point(cx + r, cz + h - r).buffer(r, 64))
    v = Polygon([(cx - 2 * r + 0.4, cz + h - r - r * 0.25), (cx, cz), (cx + 2 * r - 0.4, cz + h - r - r * 0.25), (cx, cz + h - r)])
    return U(lobes, v).buffer(r * 0.12).buffer(-r * 0.12)


def wheat(p0, p1, w, n=7):
    """An ear of wheat from its stalk end p0 to its tip p1: grains in pairs along the stalk."""
    dx, dz = p1[0] - p0[0], p1[1] - p0[1]
    ln = math.hypot(dx, dz)
    ang = math.degrees(math.atan2(dz, dx))
    stalk = line([p0, (p0[0] + dx * 0.45, p0[1] + dz * 0.45)], max(1.6, w * 0.16))
    grains = []
    for i in range(n):
        t = 0.42 + i * 0.52 / n
        cx, cz = p0[0] + dx * t, p0[1] + dz * t
        for s in (-1, 1):
            g = affinity.rotate(ell(0, 0, w * 0.32, w * 0.17), s * 35, origin=(0, 0))
            g = affinity.translate(affinity.rotate(affinity.translate(g, w * 0.18, s * w * 0.2), ang, origin=(0, 0)), cx, cz)
            grains.append(g)
    tip = affinity.translate(affinity.rotate(ell(0, 0, w * 0.3, w * 0.15), ang, origin=(0, 0)), p1[0], p1[1])
    return stalk, U(*grains, tip)


def hop(cx, cz, s, rot=0):
    """A hop cone `s` mm tall, hanging from its stem: a pointed egg with rows of scale edges. Returns (cone, scales, stem)."""
    ts = np.linspace(0, 1, 40)
    half = [(s * 0.34 * math.sin(math.pi * t) ** 0.8 * (0.75 + 0.25 * t), -s + t * s) for t in ts]
    cone = Polygon([(x, z) for x, z in half] + [(-x, z) for x, z in reversed(half)]).buffer(0)
    arcs = []
    for i, z in enumerate(np.linspace(-s * 0.8, -s * 0.2, 4)):
        for x in ([-0.12, 0.12] if i % 2 == 0 else [-0.24, 0, 0.24]):
            c = Point(x * s, z + s * 0.12).buffer(s * 0.16, 32).exterior
            arcs.append(c.intersection(box(-s, z - s, s, z + s * 0.12)).buffer(max(0.7, s * 0.028)))
    scales = U(*arcs).intersection(cone.buffer(-0.8))
    stem = line([(0, 0), (s * 0.06, s * 0.18)], max(1.6, s * 0.07))
    return [affinity.translate(affinity.rotate(g, rot, origin=(0, 0)), cx, cz) for g in (cone, scales, stem)]


def catmull(pts, n=12):
    """A smooth curve through `pts` (Catmull-Rom)."""
    out = []
    p = [pts[0]] + list(pts) + [pts[-1]]
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = (np.array(q, float) for q in p[i - 1:i + 3])
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(tuple(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)))
    out.append(pts[-1])
    return out


def pretzel(cx, cz, w):
    """A Bavarian pretzel `w` mm wide: the belly, the arms twisted once at the top and their ends resting on the belly."""
    knots = [(-0.3, -0.16), (-0.13, 0.04), (0.06, 0.2), (0.26, 0.3), (0.46, 0.2), (0.5, -0.02), (0.37, -0.26), (0, -0.36),
             (-0.37, -0.26), (-0.5, -0.02), (-0.46, 0.2), (-0.26, 0.3), (-0.06, 0.2), (0.13, 0.04), (0.3, -0.16)]
    band = LineString([(cx + x * w, cz + z * w) for x, z in catmull(knots)]).buffer(w * 0.075, 16)
    return band


def stein(cx, z0, w, h):
    """A Maß stein: glass body, handle on the right, foam over the rim. Returns (glass, beer, foam, handle, dimples)."""
    body = box(cx - w / 2, z0, cx + w / 2, z0 + h).buffer(w * 0.06).buffer(-w * 0.06)
    beer = box(cx - w / 2 + 3, z0 + 3, cx + w / 2 - 3, z0 + h * 0.82)
    foam = U(box(cx - w / 2 - 1, z0 + h * 0.8, cx + w / 2 + 1, z0 + h * 0.98), *[Point(cx + x, z0 + h * 0.98).buffer(w * 0.13, 24) for x in np.linspace(-w * 0.38, w * 0.38, 4)],
             Point(cx - w * 0.42, z0 + h * 0.78).buffer(w * 0.1, 24))
    handle = Point(cx + w / 2, z0 + h * 0.5).buffer(h * 0.3, 48).difference(Point(cx + w / 2, z0 + h * 0.5).buffer(h * 0.3 - w * 0.13, 48)).difference(box(cx - w, z0, cx + w / 2, z0 + h))
    dimples = U(*[ell(cx + x, z0 + z, w * 0.08, h * 0.08) for x in (-w * 0.25, 0, w * 0.25) for z in (h * 0.25, h * 0.5)])
    return body, beer, foam, handle, dimples


def pennants(x0, x1, z, n, h, sag=8):
    """Bunting: n triangles hanging from a sagging line between x0 and x1 at height z. Returns (line, [flags])."""
    pts = [(x0 + (x1 - x0) * t, z - sag * math.sin(math.pi * t)) for t in np.linspace(0, 1, 40)]
    flags = []
    for i in range(n):
        t0, t1 = (i + 0.1) / n, (i + 0.9) / n
        a = (x0 + (x1 - x0) * t0, z - sag * math.sin(math.pi * t0))
        b = (x0 + (x1 - x0) * t1, z - sag * math.sin(math.pi * t1))
        flags.append(Polygon([a, b, ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - h)]))
    return LineString(pts), flags


@theme
def heidis():
    # The bar's own green and yellow, the logo's white and brown, gingerbread, beer and foam.
    pal = {"base": "#00572a", "green": "#006a31", "deep": "#023d1e", "yellow": "#fccd28", "white": "#fbfaf4", "brown": "#734c1e",
           "ginger": "#a5642b", "beer": "#f0a524", "foam": "#fff6dc", "glass": "#cfe6d8", "steel": "#9aa3a0", "sky": "#0b7a3c", "hop": "#8dbb3c"}

    def wing(side_seed):
        if side_seed % 2 == 0:
            # Right: a 4-litre beer tower, foam at the top, the cooling rod down its middle and the tap at the foot.
            cx = X0 + 30
            tube = box(cx - 17, 52, cx + 17, 262).buffer(4).buffer(-4)
            cap = box(cx - 20, 262, cx + 20, 278).buffer(3).buffer(-1)
            knob = Point(cx, 284).buffer(7, 32)
            foot = box(cx - 27, 24, cx + 27, 40).buffer(3).buffer(-1)
            neck = box(cx - 12, 40, cx + 12, 54)
            tap = U(box(cx + 12, 44, cx + 26, 50), box(cx + 22, 44, cx + 28, 62).buffer(1.5))
            # Solid blocks only: the knob, cap and tap sit inside the hull of their neighbours, so nothing can snap off.
            outline = U(wing_strip(12, 24, 284), tube.buffer(2.5), U(cap, knob).convex_hull.buffer(2.5), U(foot, neck, tap).convex_hull.buffer(2.5)).buffer(4).buffer(-4)
            outline = outline.intersection(box(X0, 22, X0 + 64, 294))
            L = [("base", outline), ("steel", U(cap, knob, foot, neck)), ("glass", tube)]
            L += [("beer", box(cx - 14, 56, cx + 14, 228).buffer(2).buffer(-2))]
            rng = random.Random(9)
            L += [("foam", U(box(cx - 14, 222, cx + 14, 240), *[Point(cx + x, 240).buffer(5.2, 24) for x in np.linspace(-9, 9, 4)]))]
            L += [("yellow", U(*[Point(cx + rng.uniform(-10, 10), rng.uniform(64, 214)).buffer(rng.uniform(0.9, 1.6), 16) for _ in range(22)]))]
            L += [("steel", box(cx - 2.5, 56, cx + 2.5, 262))]
            L += [("white", box(cx - 13, 244, cx - 9, 258).buffer(1))]
            L += [("deep", U(*[box(cx - 24, z - 0.6, cx - 17, z + 0.6) for z in np.arange(70, 230, 40)]).intersection(tube.buffer(3)).difference(tube))]
            L += [("steel", tap), ("base", box(cx + 23, 44, cx + 27, 48))]
            L += [("green", box(cx - 25, 27, cx + 25, 37).buffer(0.5)), ("white", text("4 L", "lilita-one", cx, 32, 7, 30))]
        else:
            # Left: a maypole in green and white with a wreath, ribbons, a pretzel and a stein at its foot.
            cx = X0 + 22
            pole = box(cx - 7, 70, cx + 7, 252)
            wreath = ell(cx, 252, 24, 7)
            crown = U(Point(cx, 268).buffer(11, 48).intersection(box(cx - 12, 256, cx + 12, 290)), box(cx - 11, 256, cx + 11, 268))
            ribbons = U(*[line([(cx + s * x, 248), (cx + s * (x + 2), 232 - x * 0.2)], 3) for s in (-1, 1) for x in (10, 19)])
            prz = pretzel(cx + 14, 196, 38)
            body, beer, foam, handle, dimples = stein(cx + 2, 24, 40, 50)
            # Solid blocks only: crown, wreath and ribbons in one hull, the pretzel on a backing joined to the pole, the stein with its handle.
            outline = U(wing_strip(10, 24, 262), pole.buffer(2), U(wreath, crown, ribbons).convex_hull.buffer(2.5),
                        U(prz, box(cx + 2, 176, cx + 7, 222)).convex_hull.buffer(2.5), U(body, foam, handle).convex_hull.buffer(2.5)).buffer(4).buffer(-4)
            outline = outline.intersection(box(X0, 22, X0 + 64, 294))
            L = [("base", outline), ("white", pole)]
            stripes = U(*[Polygon([(cx - 8, z), (cx - 8, z + 9), (cx + 8, z + 21), (cx + 8, z + 12)]) for z in np.arange(52, 260, 24)])
            L += [("green", stripes.intersection(pole))]
            L += [("deep", wreath), ("green", U(*[ell(cx + x, 252 + (2 if i % 2 else -2), 4.5, 3, 30 * (1 if i % 2 else -1)) for i, x in enumerate(np.linspace(-19, 19, 9))]))]
            L += [("yellow", ribbons), ("yellow", crown), ("white", Point(cx, 272).buffer(3, 24))]
            L += [("steel", line([(cx + 7, 214), (cx + 14, 214), (cx + 14, 207)], 2))]
            L += [("brown", prz), ("white", U(*[Point(cx + 14 + x, 196 + z).buffer(1, 12) for x, z in ((-10, -6), (-4, -12), (6, -10), (11, -3), (-12, 3), (2, 6), (9, 6))]).intersection(prz))]
            L += [("glass", body), ("beer", beer), ("glass", dimples.intersection(beer)), ("foam", foam), ("glass", handle)]
        return outline, L

    def topper():
        # A gingerbread heart with the logo in the icing, on a green board with wheat to the left and hops to the right.
        # Everything sits on one solid piece: the wheat and hops are inlays in the board, not loose shapes, so nothing
        # sticks out thinner than the heart's own lobes.
        heart = heart_shape(0, 22, 186, 152)
        wl = [wheat((-84, 30), (-92, 104), 14, 6), wheat((-90, 30), (-106, 96), 14, 6), wheat((-96, 30), (-114, 78), 13, 6)]
        hops = [hop(98, 98, 28, 8), hop(110, 70, 24, -8), hop(88, 62, 22, 14)]
        leaf_r = U(leaf(100, 102, 20, 16, -28), leaf(92, 98, 18, 14, 42))
        left = U(*[U(a, b) for a, b in wl], box(-HW, 0, -70, 30)).convex_hull.buffer(5)
        right = U(*[h[0] for h in hops], leaf_r, box(70, 0, HW, 30)).convex_hull.buffer(5)
        board = U(left, right, box(-HW, 0, HW, 34)).convex_hull
        outline = U(board, heart.buffer(3)).buffer(6).buffer(-6)
        outline = outline.intersection(box(-HW - 14, 0, HW + 14, 190))
        L = [("base", outline), ("deep", board.buffer(-3).difference(heart.buffer(3))), ("ginger", heart)]
        # Piped icing: a scalloped white border just inside the edge, and dots of sugar inside it.
        edge = heart.buffer(-5).exterior
        L += [("white", U(edge.buffer(1.4), bulbs_along(edge, 8, 2.4)))]
        L += [("yellow", bulbs_along(heart.buffer(-10).exterior, 13, 1.6))]
        L += heidis_logo((-74, 66, 74, 156))
        L += [("green", leaf_r), ("base", line([(98, 98), (108, 74)], 1.6))]
        for a, b in wl:
            L += [("brown", a), ("yellow", b)]
        for cone, edges, stem in hops:
            L += [("hop", cone), ("green", edges), ("base", stem)]
        L += [("green", box(-HW + 4, 4, HW - 4, 26)), ("yellow", text("AFTERSKI  ·  BIER  ·  PROST", "lilita-one", 0, 15, 10, 186))]
        return outline, L

    def screen(w, h):
        L = [("green", box(0, 0, w, h))]
        rng = random.Random(6)
        # Sun rays from behind the mountains, the Alps with snow, a row of chalets and bunting over it all.
        rays = U(*[Polygon([(w / 2, 300), (w / 2 + 900 * math.cos(math.radians(a - 4)), 300 + 900 * math.sin(math.radians(a - 4))),
                            (w / 2 + 900 * math.cos(math.radians(a + 4)), 300 + 900 * math.sin(math.radians(a + 4)))]) for a in range(10, 180, 16)])
        L += [("sky", rays.intersection(box(0, 0, w, h)))]
        far = Polygon([(-10, 220), (60, 380), (130, 330), (230, 470), (320, 360), (420, 430), (520, 340), (610, 400), (610, 220)])
        L += [("deep", far), ("white", far.intersection(U(Polygon([(180, 400), (230, 470), (280, 400), (255, 410), (232, 395), (208, 412)]).buffer(0),
                                                        Polygon([(385, 395), (420, 430), (460, 395), (440, 400), (420, 388), (402, 402)]).buffer(0),
                                                        Polygon([(30, 320), (60, 380), (95, 345), (75, 352), (58, 340), (44, 350)]).buffer(0))))]
        L += [("base", hills_poly(0, w, 250, 14, 1.2, rng))]
        for x in (78, w - 78):
            house = U(box(x - 34, 150, x + 34, 210), Polygon([(x - 44, 206), (x, 240), (x + 44, 206)]))
            L += [("ginger", house), ("brown", Polygon([(x - 46, 204), (x, 242), (x + 46, 204), (x + 46, 212), (x, 250), (x - 46, 212)])),
                  ("yellow", U(box(x - 22, 176, x - 8, 194), box(x + 8, 176, x + 22, 194))), ("white", box(x - 34, 166, x + 34, 170))]
        L += [("white", hills_poly(0, w, 140, 8, 2.0, rng)), ("deep", box(0, 0, w, 60))]
        for z, n in ((900, 7), (840, 6)):
            rope, flags = pennants(-10, w + 10, z, n, 38, 22)
            L += [("white", rope.buffer(1.6))] + [(("yellow", "white")[i % 2], f) for i, f in enumerate(flags)]
        L += [("yellow", text("AFTERSKI HVER WEEKEND", "lilita-one", w / 2, 452, 26, w * 0.7))]
        return L

    return dict(name="Heidi's Bier Bar", place="Aalborg · Aarhus · København · Herning · Sønderborg · Thisted", font="lilita-one", pal=pal, unit="gen2",
                filament={"base": "PETG HF dark green", "green": "PETG HF green", "deep": "PETG HF forest green", "yellow": "PETG HF yellow",
                          "white": "PETG HF white", "brown": "PETG HF brown", "ginger": "PETG HF light brown", "beer": "PETG HF orange",
                          "foam": "PETG HF cream", "glass": "PETG HF mint", "steel": "PETG HF silver", "sky": "PETG HF green", "hop": "PETG HF lime"},
                casing="#00572a", ring={"idle": ["#fccd28", "#fff6dc"], "glow": "#fccd28"},
                screen=dict(bg="green", ink="white", accent="yellow", cta="Sig «Prost!»",
                            ticker="Heidi's Bier Bar  •  Afterski & Oktoberfest  •  Aalborg · Aarhus · København · Herning · Sønderborg · Thisted  •  Prost!  •"),
                frame=dict(bg="green", ink="yellow", caption="Prost!"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: heidis_logo((-60, 0, 60, 120)),
                logo_png=dict(file="heidis-source.png", screen=(300, 772, 370), frame=(40, 170, 150)))


# ------------------------------------------------------------- ice hockey --
# Frederikshavn White Hawks: the Metal League ice hockey club in Frederikshavn (Nordjyske Bank Arena), Danish
# champions in 1989 and 2000. The topper is the club's crest with a pair of white hawk wings spread out behind
# it over a red board with »Sammen er vi White Hawks«, the right wing a taped hockey stick with a puck on the blade and the left wing the red
# goal lamp over a fan banner. Drawn for the gen 2 unit. The logo is traced from logos/white_hawks-source.png
# (the club's 2000 px logo from whitehawks.dk): ask the club for vector artwork and permission before printing.

def white_hawks_logo(bounds):
    lg = traced_logo("white_hawks")
    placed = place_logo(lg, bounds, [(k, k) for k in ("black", "red", "navy", "grey", "white", "gold")])
    placed = [({"black": "ink", "navy": "base"}.get(k, k), g) for k, g in placed]
    return [(k, shapely.set_precision(g.buffer(0), 0.05).buffer(0.2).buffer(-0.2)) for k, g in placed]


def hawk_wing(root_x, rows, sweep=10):
    """A heraldic hawk wing, right side: stacked feathers reaching outward, the top one longest, each a tapered bar
    with a broad round tip, swept up by `sweep` degrees. `rows` is [(z, length, width)] from the top down.
    Returns ([feathers from the bottom up], shoulder)."""
    feathers = []
    for z, ln, w in rows:
        f = U(Point(root_x, z).buffer(w / 2, 48), Point(root_x + ln, z).buffer(w * 0.38, 48)).convex_hull
        feathers.append(affinity.rotate(f, sweep, origin=(root_x, z)))
    z_top, z_bot = rows[0][0], rows[-1][0]
    shoulder = ell(root_x + 14, (z_top + z_bot) / 2 + 8, 30, (z_top - z_bot) / 2 + 16, sweep + 4)
    return feathers[::-1], shoulder


@theme
def white_hawks():
    # The crest's navy, red, white, grey and gold, the black of its outlines, and the ice.
    pal = {"base": "#011a3f", "navy2": "#163463", "red": "#a61d26", "lamp": "#e0262f", "glow": "#f2685f", "white": "#ffffff",
           "grey": "#cdcccc", "ink": "#121417", "gold": "#f7a60b", "ice": "#e6f1f8", "iceline": "#2a5fa8", "steel": "#8d939b", "sky": "#0d2f63"}

    def wing(side_seed):
        if side_seed % 2 == 0:
            # Right: a hockey stick in white tape standing on its blade, with a puck resting on the blade.
            shaft = box(X0 + 18, 58, X0 + 34, 284).buffer(2.5).buffer(-2.5)
            blade = Polygon([(X0 + 18, 30), (X0 + 18, 64), (X0 + 34, 64), (X0 + 36, 52), (X0 + 58, 46), (X0 + 63, 38), (X0 + 60, 30)]).buffer(3).buffer(-3)
            puck = box(X0 + 38, 48.5, X0 + 62, 58.5).buffer(2).buffer(-1)
            # One solid panel: the strip, the stick and the blade with the puck in one hull, nothing loose.
            outline = U(wing_strip(14, 24, 290), box(X0, 26, X0 + 37, 290), U(blade, puck).convex_hull.buffer(2.5)).buffer(4).buffer(-4)
            outline = outline.intersection(box(X0, 22, X0 + 66, 294))
            L = [("base", outline), ("red", box(X0 + 4, 32, X0 + 9, 282))]
            L += [("ink", U(shaft, blade).buffer(1.4)), ("white", shaft), ("white", blade)]
            # Black grip tape at the top, wound in bands, and the end knob.
            L += [("ink", box(X0 + 18, 244, X0 + 34, 284).buffer(2.5).buffer(-2.5))]
            L += [("steel", U(*[Polygon([(X0 + 18, z), (X0 + 34, z + 5), (X0 + 34, z + 6.6), (X0 + 18, z + 1.6)]) for z in np.arange(246, 278, 7)]).intersection(shaft))]
            # Navy tape on the blade and the club name down the shaft.
            L += [("navy2", U(*[Polygon([(x, 30), (x + 4, 30), (x + 7, 50), (x + 3, 50)]) for x in np.arange(X0 + 38, X0 + 60, 7)]).intersection(blade.buffer(-2.5)))]
            word = affinity.rotate(text("WHITE HAWKS", "archivo-black", 0, 0, 9), 90, origin=(0, 0))
            L += [("base", fit(word, (X0 + 21, 82, X0 + 31, 232)))]
            L += [("ink", puck), ("steel", box(X0 + 40, 55.5, X0 + 60, 57).buffer(0.6))]
        else:
            # Left: the red goal lamp in its glow over a fan banner in navy, red and white with a swallowtail.
            cx = X0 + 26
            glow = Point(cx, 262).buffer(27, 64)
            lamp = Point(cx, 256).buffer(15, 64).intersection(box(cx - 16, 256, cx + 16, 280))
            foot = box(cx - 17, 248, cx + 17, 257).buffer(1.5).buffer(-1.5)
            bar = line([(X0 + 3, 242), (X0 + 49, 242)], 6)
            flag = Polygon([(X0 + 7, 238), (X0 + 45, 238), (X0 + 45, 44), (cx, 60), (X0 + 7, 44)])
            outline = U(wing_strip(12, 24, 284), glow.buffer(2), bar.buffer(2), flag.buffer(3), box(X0, 30, X0 + 49, 240)).buffer(4).buffer(-4)
            outline = outline.intersection(box(X0, 22, X0 + 60, 294))
            L = [("base", outline), ("glow", glow)]
            rays = U(*[Polygon([(cx, 256), (cx + 40 * math.cos(math.radians(a - 7)), 256 + 40 * math.sin(math.radians(a - 7))),
                                (cx + 40 * math.cos(math.radians(a + 7)), 256 + 40 * math.sin(math.radians(a + 7)))]) for a in range(10, 180, 34)])
            L += [("gold", rays.intersection(glow.buffer(-3)))]
            L += [("ink", U(lamp, foot).buffer(1.4)), ("lamp", lamp), ("white", ell(cx - 6, 266, 3, 5, -25)), ("steel", foot), ("ink", bar)]
            L += [("ink", flag.buffer(1.4)), ("red", flag), ("white", flag.buffer(-3)), ("base", flag.buffer(-6))]
            L += [("red", U(*[box(X0 + 7, z, X0 + 45, z + 5) for z in (206, 82)]).intersection(flag.buffer(-6)))]
            word = affinity.rotate(text("HAWKS", "archivo-black", 0, 0, 22), 90, origin=(0, 0))
            L += [("white", flip_text(fit(word, (X0 + 13, 96, X0 + 39, 200))))]
            yr = text("1964", "archivo-black", 0, 0, 7)
            L += [("white", flip_text(fit(yr, (X0 + 14, 216, X0 + 38, 226))))]
        return outline, L

    def topper():
        # The crest with a pair of white hawk wings spread out behind it, on a red board with the club's own sign-off.
        p = 30
        feathers, shoulder = hawk_wing(46, [(p + 112, 70, 26), (p + 88, 62, 24), (p + 64, 52, 22), (p + 42, 40, 20)])
        wings_r = U(*feathers, shoulder)
        wings = U(wings_r, mirror(wings_r))
        crest_box = (-70, p - 4, 70, p + 132)
        crest = white_hawks_logo(crest_box)
        crest_all = U(*[g for _, g in crest])
        board = box(-HW, 0, HW, p + 2)
        outline = U(board, wings.buffer(2.4), crest_all.buffer(3)).buffer(6).buffer(-6)
        outline = outline.intersection(box(-HW - 18, 0, HW + 18, 200))
        L = [("base", outline)]
        for fl in (feathers, [mirror(f) for f in feathers]):
            for i, f in enumerate(fl):
                L += [("ink", f.buffer(1.4)), ("white", f.intersection(outline.buffer(-2.4)))]
                L += [("grey", f.difference(affinity.translate(f, 0, 8)).intersection(outline.buffer(-2.4)))]
        L += [("ink", crest_all.buffer(2.4))] + crest
        L += [("red", box(-HW + 4, 4, HW - 4, p - 2)), ("white", text("SAMMEN ER VI WHITE HAWKS", "archivo-black", 0, (p + 2) / 2, 11, 200))]
        return outline, L

    def screen(w, h):
        rng = random.Random(11)
        L = [("base", box(0, 0, w, h))]
        # Spotlights over the stands, the crowd in red and white, the boards and the ice with its lines.
        for cx in (90, w / 2, w - 90):
            L += [("sky", Polygon([(cx - 30, h + 10), (cx + 30, h + 10), (w / 2 + (cx - w / 2) * 0.4 + 120, 430), (w / 2 + (cx - w / 2) * 0.4 - 120, 430)]))]
        stand = box(0, 430, w, 520)
        L += [("navy2", stand)]
        dots = [(rng.uniform(0, w), rng.uniform(438, 514)) for _ in range(300)]
        L += [("white", U(*[Point(x, z).buffer(4.2, 12) for x, z in dots[::2]])), ("red", U(*[Point(x, z).buffer(4.2, 12) for x, z in dots[1::2]]))]
        L += [("white", box(0, 392, w, 430)), ("red", box(0, 386, w, 394)), ("iceline", box(0, 424, w, 430))]
        L += [("ice", box(0, 0, w, 386))]
        L += [("iceline", box(0, 352, w, 364))]
        circle = ell(w / 2, 190, 190, 74)
        L += [("red", circle.difference(ell(w / 2, 190, 184, 69))), ("red", box(0, 186, w / 2 - 190, 194)), ("red", box(w / 2 + 190, 186, w, 194))]
        L += [("white", text("ISHOCKEY I FREDERIKSHAVN SIDEN 1964", "archivo-black", w / 2, 900, 18, w * 0.8))]
        return L

    return dict(name="Frederikshavn White Hawks", place="Nordjyske Bank Arena, Frederikshavn", font="archivo-black", pal=pal, unit="gen2",
                filament={"base": "ASA navy", "navy2": "ASA blue", "red": "ASA red", "lamp": "ASA bright red", "glow": "ASA coral",
                          "white": "ASA white", "grey": "ASA light grey", "ink": "ASA black", "gold": "ASA yellow", "ice": "ASA white",
                          "iceline": "ASA blue", "steel": "ASA silver", "sky": "ASA blue"},
                casing="#011a3f", ring={"idle": ["#ffffff", "#a61d26"], "glow": "#e0262f"},
                screen=dict(bg="white", ink="base", accent="red", cta="Råb «Kom så Hawks!»",
                            ticker="Frederikshavn White Hawks  •  Sammen er vi White Hawks  •  Nordjyske Bank Arena  •  Kom så Hawks!  •"),
                frame=dict(bg="base", ink="white", caption="Kom så Hawks!"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: white_hawks_logo((-60, 0, 60, 120)),
                logo_png=dict(file="white_hawks-source.png", screen=(300, 860, 330), frame=(40, 170, 150)))


# ------------------------------------------------------------------ tuborg --
# Tuborg: the Danish beer brand, today brewed by Carlsberg Danmark. Business case: Tuborg pays for a box at a bar and
# gets its wordmark on every photo. Danish branding only, drawn from the Grøn Tuborg can on tuborg.dk/gron-tuborg
# (Esben, 20 Oct: no invented shapes). The topper is the top of the can's label: the royal crown (traced from the can,
# logos/tuborg_crown-source.png) on the label's round head, TUBORG arched in lime on the green band, »Brygget siden
# 1880« and »GRØN« in its striped band. The wings are a brown Grøn Tuborg bottle leaning on the box and a draught
# glass, each outline hugging its object with no steps. The wordmark is traced from logos/tuborg-source.svg (the
# vector on tuborg.dk). Crown and wordmark belong to Carlsberg: ask before anything is printed.

def tuborg_logo(bounds, key="white"):
    lg = traced_logo("tuborg")
    placed = place_logo(lg, bounds, [("white", key)])
    return [(k, shapely.set_precision(g.buffer(0), 0.05)) for k, g in placed]


def tuborg_crown(bounds):
    """The royal crown from the Grøn Tuborg can: the silver crown with its pearls and stones left white and the
    velvet in lime. The silver grows 0.6 mm outward and the white stones shrink 0.55 mm, so the thin silver rings
    round the pearls stay above theme_builder's MIN_FEATURE and print."""
    lg = traced_logo("tuborg_crown")
    placed = dict(place_logo(lg, bounds, [("silver", "silver"), ("white", "white"), ("velvet", "lime")]))
    crown = U(*placed.values()).buffer(0.6).buffer(-0.6)
    holes = crown.difference(placed["silver"]).difference(placed["lime"])
    holes = U(*[g for g in getattr(holes, "geoms", [holes]) if g.area > 1.0]).buffer(-0.55)
    crown = crown.buffer(0.6)
    return [("silver", crown), ("white", holes), ("lime", placed["lime"].buffer(-0.3).buffer(0.3))]


def tuborg_arched(cx, cz, radius, height, key="ink"):
    """Tuborg's own wordmark bent over an arc like on the Grøn Tuborg label: each letter turned to the arc."""
    lg = traced_logo("tuborg")["white"]
    letters = sorted([affinity.scale(g, 1, -1, origin=(0, 0)) for g in getattr(lg, "geoms", [lg])], key=lambda g: g.bounds[0])
    x0, z0, x1, z1 = U(*letters).bounds
    k = height / (z1 - z0)
    width = (x1 - x0) * k
    out = []
    for g in letters:
        g = affinity.scale(g, k, k, origin=(0, 0))
        gx = (g.bounds[0] + g.bounds[2]) / 2 - (x0 + x1) / 2 * k
        g = affinity.translate(g, -(g.bounds[0] + g.bounds[2]) / 2, -z0 * k)
        ang = gx / radius
        g = affinity.rotate(g, -math.degrees(ang), origin=(0, 0))
        out.append(affinity.translate(g, cx + radius * math.sin(ang), cz - radius + radius * math.cos(ang)))
    return [(key, U(*out))], width


@theme
def tuborg():
    # Colours sampled from the Grøn Tuborg can on tuborg.dk: can green, the label's darker band, lime lettering,
    # the dark green of »GRØN«, the grey crown. The bottle is the brown Grøn Tuborg bottle from tuborg.dk's photos.
    pal = {"base": "#2e9a48", "band": "#1a8a3c", "deep": "#1a3a30", "lime": "#80e040", "white": "#ffffff", "silver": "#8f8f93",
           "cream": "#f4ead2", "beer": "#e7a21f", "sky": "#3aa852", "ink": "#1a3a30", "shine": "#5cbf6a"}

    def wing(side_seed):
        # Each object stands right against the box and the outline only hugs it, so the side is the object itself.
        strip = box(X0, 46, X0 + 4, 252)
        if side_seed % 2 == 0:
            # Right: a 50 cl Grøn Tuborg can as it looks on tuborg.dk: green can, silver top and foot, the white label
            # with TUBORG in lime on its green band and »GRØN« under it.
            cx = X0 + 38
            body = box(cx - 36, 58, cx + 36, 238).buffer(4).buffer(-4)
            top = Polygon([(cx - 36, 236), (cx + 36, 236), (cx + 31, 250), (cx - 31, 250)]).buffer(1.5).buffer(-1.5)
            foot = Polygon([(cx - 33, 50), (cx + 33, 50), (cx + 36, 60), (cx - 36, 60)]).buffer(1.5).buffer(-1.5)
            can = U(body, top, foot)
            label = ell(cx, 150, 33, 46)
            band = label.buffer(-2.5).difference(ell(cx, 150, 23, 29)).intersection(box(cx - 40, 160, cx + 40, 260))
            outline = U(can.buffer(3), strip).buffer(10).buffer(-10).intersection(box(X0, 0, X0 + 80, 300))
            L = [("base", outline), ("base", can), ("silver", top), ("silver", foot), ("white", label), ("band", band)]
            arch, _ = tuborg_arched(cx, 179.8, 26, 8, "lime")
            L += arch
            L += [("deep", box(cx - 33, 158.6, cx + 33, 160.2).intersection(label)), ("deep", box(cx - 33, 139.8, cx + 33, 141.4).intersection(label))]
            L += [("deep", text("GRØN", "poppins", cx, 150, 11, 46))]
            L += [("band", label.buffer(-2.5).difference(ell(cx, 150, 23, 29)).intersection(box(cx - 40, 0, cx + 40, 138)))]
        else:
            # Left: a draught glass, golden beer under a cream head.
            gx = X0 + 30
            glass = Polygon([(gx - 21, 34), (gx + 21, 34), (gx + 27, 232), (gx - 27, 232)]).buffer(3).buffer(-3)
            head = U(box(gx - 28, 226, gx + 28, 244), *[Point(gx + x, 245).buffer(8.5, 32) for x in np.linspace(-20, 20, 4)]).buffer(2).buffer(-2)
            outline = U(U(glass, head).buffer(3), strip).buffer(10).buffer(-10).intersection(box(X0, 0, X0 + 80, 300))
            L = [("base", outline), ("beer", glass), ("cream", head)]
        return outline, L

    def topper():
        # The top half of the Grøn Tuborg label rising from behind the box: white rim, the darker green band with
        # TUBORG arched in lime, the white field with »Brygget siden 1880«, the striped band with »GRØN«, and the
        # label's round head carrying the royal crown.
        cz = -6
        rim = ell(0, cz, 111, 100)
        band_o, band_i = ell(0, cz, 105, 94), ell(0, cz, 86, 68)
        head = Point(0, 108).buffer(41, 96)
        label = U(rim, head).buffer(6).buffer(-6)
        outline = label.intersection(box(-HW, 0, HW, 150))
        stripe = box(-HW, 8, HW, 36)
        L = [("white", outline)]
        L += [("band", band_o.difference(band_i).difference(box(-HW, -50, HW, 36)))]
        arch, _ = tuborg_arched(0, 67, 92, 18.5, "lime")
        L += arch
        L += [("deep", text("BRYGGET SIDEN", "poppins", 0, 50.5, 6.5, 64)), ("deep", text("1880", "poppins", 0, 41.5, 7, 40))]
        for zz in (9.2, 34.8):   # the two rules round the GRØN band, ending in points like on the can
            rule = Polygon([(-100, zz - 1.2), (-90, zz - 1.2), (-86, zz), (86, zz), (90, zz - 1.2), (100, zz - 1.2), (90, zz + 1.2), (-90, zz + 1.2)])
            L += [("deep", U(box(-92, zz - 1.1, 92, zz + 1.1), rule).intersection(rim.buffer(-5)))]
        L += [("deep", text("GRØN", "poppins", 0, 22, 17, 120))]
        L += tuborg_crown((-38, 87, 38, 141))
        return outline, L

    def screen(w, h):
        L = [("band", box(0, 0, w, h))]   # a shade darker than the green casing, so the screen stands out
        # Light from above and a row of Grøn Tuborg cans at the foot, the label colours only.
        rays = U(*[Polygon([(w / 2, h + 40), (w / 2 + 1200 * math.cos(math.radians(a - 3)), h + 40 + 1200 * math.sin(math.radians(a - 3))),
                            (w / 2 + 1200 * math.cos(math.radians(a + 3)), h + 40 + 1200 * math.sin(math.radians(a + 3)))]) for a in range(200, 345, 14)])
        L += [("sky", rays.intersection(box(0, 0, w, h)))]
        for i, x in enumerate(np.linspace(60, w - 60, 7)):
            if i in (2, 3, 4):
                continue
            c = box(x - 24, 66, x + 24, 190).buffer(3).buffer(-3)
            L += [("deep", c.buffer(3)), ("band", c), ("silver", box(x - 22, 182, x + 22, 192)), ("white", ell(x, 126, 17, 32))]
        L += [("deep", box(0, 0, w, 64)), ("lime", box(0, 60, w, 66))]
        L += tuborg_logo((90, 760, w - 90, 860))
        L += [("lime", text("HELE DANMARKS PILSNER", "archivo-black", w / 2, 700, 22, w * 0.7))]
        return L

    return dict(name="Tuborg", place="Danmarks barer", font="archivo-black", pal=pal, unit="gen2",
                filament={"base": "ASA green", "band": "ASA dark green", "deep": "ASA forest green", "lime": "ASA lime green", "white": "ASA white",
                          "silver": "ASA silver", "cream": "ASA cream", "beer": "ASA yellow", "sky": "ASA light green",
                          "ink": "ASA forest green", "shine": "ASA light green"},
                casing="#2e9a48", ring={"idle": ["#ffffff", "#80e040"], "glow": "#5fd36a"},
                screen=dict(bg="base", ink="white", accent="lime", cta="Sig «Skål!»",
                            ticker="Grøn Tuborg  •  Hele Danmarks pilsner  •  Drik med respekt  •  Kun for 18+  •"),
                frame=dict(bg="base", ink="lime", caption="Skål for i aften"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: tuborg_logo((-60, 0, 60, 30)))


# --------------------------------------------------------------- brewery --
# Carlsberg, in the brand's current packaging look (the Taxi Studio identity on today's Danish Pilsner, 0.0 and Nordic):
# the white wordmark on Carlsberg green, the royal warrant crown above it and the hop leaf as the one icon. The brand
# pays for a box in a bar and has its logo on every photo. The topper is a green panel as wide as the box with the
# wordmark and the crown on top, the left wing the green Danish Pilsner bottle, the right wing the hop leaf, large.
# Drawn for the gen 2 unit. The logo is traced from logos/carlsberg-source.png (a vector copy of the wordmark):
# ask Carlsberg for the official artwork and permission before printing.

def carlsberg_logo(bounds, key="white"):
    lg = traced_logo("carlsberg")
    placed = place_logo(lg, bounds, [("green", key)])
    return [(k, shapely.set_precision(g.buffer(0), 0.05).buffer(0.2).buffer(-0.2)) for k, g in placed]


def carlsberg_hop(bounds, key="white"):
    """The hop leaf on its own, as the brand uses it, traced from a large render of the leaf over the g."""
    return place_logo(traced_logo("carlsberg_hop"), bounds, [("green", key)])


def royal_crown(cx, z0, w):
    """The royal warrant crown from the cans, drawn as the brand draws it: a band, arches that bow out and meet under the
    orb, and a cross. Returns (outline, lines): the solid outline to build the part around and the white lines, so the
    open spaces between the arches stay in the panel colour and nothing thin stands free."""
    t = max(3.2, w * 0.06)                                      # line weight, printable
    band = box(cx - w * 0.42, z0, cx + w * 0.42, z0 + w * 0.17).buffer(w * 0.02).buffer(-w * 0.02)
    top = (cx, z0 + w * 0.66)
    arches = []
    for x0, bow in ((-0.4, -0.52), (-0.14, -0.2), (0.14, 0.2), (0.4, 0.52)):
        pts = catmull([(cx + x0 * w, z0 + w * 0.17), (cx + bow * w, z0 + w * 0.42), (cx + bow * w * 0.45, z0 + w * 0.6), top], 10)
        arches.append(LineString(pts).buffer(t / 2, cap_style="round"))
    pearls = U(*[Point(cx + x * w, z0 + w * 0.2).buffer(t * 0.75, 24) for x in (-0.4, -0.14, 0.14, 0.4)])
    orb = Point(cx, z0 + w * 0.72).buffer(w * 0.09, 48)
    cross = U(box(cx - t / 2, z0 + w * 0.76, cx + t / 2, z0 + w * 1.0), box(cx - w * 0.1, z0 + w * 0.86, cx + w * 0.1, z0 + w * 0.86 + t))
    lines = U(band, *arches, pearls, orb, cross)
    outline = U(lines, lines.convex_hull.difference(box(cx - w, z0 + w * 0.74, cx + w, z0 + w * 2))).buffer(1).buffer(-1)
    return outline, lines


def bottle(cx, z0, w, h):
    """A long-neck Carlsberg bottle, `w` wide and `h` tall, standing at z0. Returns (glass, label, cap)."""
    n = w * 0.42
    prof = [(w / 2, 0), (w / 2, h * 0.58), (w * 0.44, h * 0.66), (n / 2 + 1, h * 0.76), (n / 2, h * 0.8), (n / 2, h * 0.94)]
    glass = Polygon([(cx + x, z0 + z) for x, z in prof] + [(cx - x, z0 + z) for x, z in reversed(prof)]).buffer(2).buffer(-2)
    cap = box(cx - n / 2 - 1, z0 + h * 0.93, cx + n / 2 + 1, z0 + h).buffer(1).buffer(-0.5)
    label = box(cx - w / 2, z0 + h * 0.12, cx + w / 2, z0 + h * 0.54)
    return glass, label.intersection(glass), cap


@theme
def carlsberg():
    # Carlsberg green from today's labels, a deeper green, the bottle's glass green and white. Nothing else.
    pal = {"base": "#00703c", "deep": "#004d29", "glass": "#2c9a46", "white": "#ffffff"}

    def wing(side_seed):
        if side_seed % 2 == 0:
            # Right: the hop leaf, large and white, at the top of a plain green panel.
            leaf_box = (X0 + 4, 196, X0 + 60, 262)
            leaf = carlsberg_hop(leaf_box)
            leaf_all = U(*[g for _, g in leaf])
            outline = U(wing_strip(14, 24, 290), box(X0, 26, X0 + 30, 288), leaf_all.buffer(6)).buffer(8).buffer(-8)
            outline = outline.intersection(box(X0, 22, X0 + 66, 294))
            L = [("base", outline)] + leaf
        else:
            # Left: the green Danish Pilsner bottle, its green label with the white wordmark running up it.
            cx = X0 + 29
            glass, label, cap = bottle(cx, 34, 48, 248)
            outline = U(wing_strip(12, 24, 270), box(X0, 26, X0 + 30, 250), glass.buffer(3), cap.buffer(3)).buffer(5).buffer(-5)
            outline = outline.intersection(box(X0, 22, X0 + 64, 294))
            L = [("base", outline), ("glass", glass), ("base", label), ("base", cap)]
            word = affinity.rotate(U(*[g for _, g in carlsberg_logo((0, 0, 100, 40))]), -90, origin=(0, 0))
            L += [("white", flip_text(fit(word, label.buffer(-4).bounds)))]
        return outline, L

    def topper():
        # One green panel as wide as the box with the white wordmark, and the crown standing on it.
        ph = 92
        panel = U(box(-HW, 0, HW, ph - 24), box(-HW + 24, 0, HW - 24, ph), *[Point(sx * (HW - 24), ph - 24).buffer(24, 64) for sx in (-1, 1)])
        cr, lines = royal_crown(0, ph - 2, 56)
        outline = U(panel, cr.buffer(4)).buffer(6).buffer(-6)
        L = [("base", outline)]
        L += carlsberg_logo((-92, 12, 92, ph - 14))
        L += [("white", lines)]
        return outline, L

    def screen(w, h):
        # Flat Carlsberg green with the crown, the wordmark (pasted from the artwork) and the brand line.
        L = [("base", box(0, 0, w, h))]
        _, lines = royal_crown(w / 2, 760, 110)
        L += [("white", lines)]
        L += [("white", text("PROBABLY THE BEST BEER IN THE WORLD", "outfit", w / 2, 420, 15, w * 0.78))]
        return L

    return dict(name="Carlsberg", place="Brand-boks i baren", font="outfit", pal=pal, unit="gen2",
                filament={"base": "ASA green", "deep": "ASA dark green", "glass": "ASA light green", "white": "ASA white"},
                casing="#00703c", ring={"idle": ["#ffffff", "#2c9a46"], "glow": "#ffffff"},
                screen=dict(bg="base", ink="white", accent="white", cta="Sig «Skål!»",
                            ticker="Carlsberg  •  Probably the best beer in the world  •  Skål fra Carlsberg og baren  •"),
                frame=dict(bg="base", ink="white", caption="Probably the best night in town"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: carlsberg_logo((-60, 0, 60, 50)),
                logo_png=dict(file="carlsberg-white.png", screen=(300, 650, 440), frame=(40, 170, 110)))
# --------------------------------------------------------------- red bull --
# Red Bull: the energy drink brand sponsors a box at a venue (a bar, a club, a student bar, a skate hall) and puts
# its logo on every photo. »Red Bull giver viiinger« (the Danish line, spelt as on redbull.com/dk-da) made literal and kept calm: the box gets a pair of plain white
# wings, one folded down each side, and the topper is the sun with the two charging bulls over a silver board with
# the wordmark. Drawn for the gen 2 unit. The logo is traced from logos/red_bull-source.png (the vector logo on
# Wikipedia): Red Bull's permission and artwork are needed before anything is printed.

def red_bull_logo(bounds, parts=("word", "emblem")):
    """The traced logo, split by rows of the lockup: the wordmark, the sun with the bulls, and »Energy drink« (left out
    by default). The ® is dropped."""
    lg = traced_logo("red_bull")
    rows = {"word": (0, 600), "emblem": (600, 1160), "energy": (1160, 1400)}
    keep = U(*[box(0, rows[p][0], 2290, rows[p][1]) for p in parts])
    lg = {k: g.intersection(keep) for k, g in lg.items()}
    return place_logo(lg, bounds, [("yellow", "yellow"), ("red", "red")])


def folded_wing(x0, z_top, tips, w=26):
    """A white wing folded down the side of the box, right side: broad feathers from the shoulder at (x0, z_top) to
    `tips`, overlapping so the outline only gets shallow notches, under a round covert. Returns (wing, grooves)."""
    root = (x0 + 14, z_top - 16)
    feathers = [U(Point(*root).buffer(w * 0.7, 64), Point(*tip).buffer(w / 2, 64)).convex_hull for tip in tips]
    covert = ell(x0 + 30, z_top - 34, 30, 34)
    wing = U(*feathers, covert).buffer(3).buffer(-3)
    grooves = []
    for a, b in zip(tips, tips[1:]):
        m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        grooves.append(LineString([root, m]).interpolate(0.45, normalized=True))
        grooves[-1] = line([grooves[-1].coords[0], (root[0] + (m[0] - root[0]) * 0.9, root[1] + (m[1] - root[1]) * 0.9)], 2.6)
    return wing, grooves


def checks(region, cell, cols=("blue2", "silver")):
    """Red Bull's can pattern: a checkerboard of blue and silver cells, cut to `region`."""
    x0, z0, x1, z1 = region.bounds
    cells = {c: [] for c in cols}
    for i, x in enumerate(np.arange(x0, x1, cell)):
        for j, z in enumerate(np.arange(z0, z1, cell * 0.62)):
            cells[cols[(i + j) % 2]].append(box(x, z, x + cell, z + cell * 0.62))
    return [(c, U(*g).intersection(region)) for c, g in cells.items()]


@theme
def red_bull():
    # Red Bull's blue and silver from the can, and the logo's red and yellow.
    pal = {"base": "#0e1d48", "blue": "#14275e", "blue2": "#22407f", "silver": "#c9ced6", "red": "#d2003c",
           "yellow": "#ffd300", "white": "#ffffff", "grey": "#9ea8b8", "ink": "#070c1f"}

    def wing(side_seed):
        # Both sides: one plain white wing folded down along the box, the same on each side, on a navy strip.
        wg, grooves = folded_wing(X0 + 12, 282, [(X0 + 22, 44), (X0 + 44, 92), (X0 + 62, 150), (X0 + 72, 210)])
        outline = U(wing_strip(14, 24, 288), wg.buffer(3)).buffer(5).buffer(-5).intersection(box(X0, 22, X0 + 88, 294))
        L = [("base", outline), ("red", box(X0 + 4, 32, X0 + 8, 278))]
        L += [("ink", wg.buffer(1.4)), ("white", wg), ("grey", U(*grooves).intersection(wg.buffer(-4)))]
        return outline, L

    def topper():
        # The sun with the charging bulls over a silver board with the wordmark. Nothing else.
        p = 34
        sun = Point(0, p + 60).buffer(54, 128)
        emblem = red_bull_logo((-100, p + 20, 100, p + 106), parts=("emblem",))
        em_all = U(*[g for _, g in emblem])
        board = box(-HW, 0, HW, p + 2)
        outline = U(board, sun.buffer(4), em_all.buffer(4), box(-96, p, 96, p + 30)).buffer(8).buffer(-8)
        outline = outline.intersection(box(-HW - 18, 0, HW + 18, 150))
        L = [("base", outline), ("yellow", sun)] + [(k, g) for k, g in emblem]
        L += [("silver", box(-HW + 4, 4, HW - 4, p - 2))]
        L += red_bull_logo((-60, 8, 60, p - 6), parts=("word",))
        return outline, L

    def screen(w, h):
        L = [("base", box(0, 0, w, h))]
        # The can's checks up top, a big sun with the bulls, the wordmark and the line under it.
        L += checks(box(0, 760, w, h), 50, ("blue", "blue2"))
        L += [("base", box(0, 742, w, 762))]
        L += [("yellow", Point(w / 2, 600).buffer(120, 128))]
        L += red_bull_logo((40, 540, w - 40, 680), parts=("emblem",))
        L += [("silver", box(60, 404, w - 60, 486).buffer(10).buffer(-10))]
        L += red_bull_logo((110, 416, w - 110, 474), parts=("word",))
        L += [("white", text("GIVER VIIINGER", "outfit", w / 2, 372, 22, w * 0.6))]
        return L

    return dict(name="Red Bull", place="Bars, klubber og studenterbarer", font="outfit", pal=pal, unit="gen2",
                filament={"base": "ASA navy", "blue": "ASA dark blue", "blue2": "ASA blue", "silver": "ASA silver",
                          "red": "ASA red", "yellow": "ASA yellow", "white": "ASA white", "grey": "ASA light grey", "ink": "ASA black"},
                casing="#0e1d48", ring={"idle": ["#ffffff", "#ffd300"], "glow": "#d2003c"},
                screen=dict(bg="base", ink="white", accent="red", cta="Hop – og få viiinger!",
                            ticker="Red Bull giver viiinger  •  Hop når lyset blinker, så fanger vi dig i luften  •  Nattens højeste hop vinder  •"),
                frame=dict(bg="silver", ink="base", caption="Red Bull giver viiinger"), photo="print-club",
                wing=wing, topper=topper, screen_art=screen, logo=lambda: red_bull_logo((-60, 0, 60, 120)))


# ------------------------------------------------------------------ build --
TO_VIEW = np.array([[1, 0, 0, 0], [0, 0, 1, 0], [0, -1, 0, 0], [0, 0, 0, 1]], float)   # (x, depth, up) -> three.js (x, up, -depth)


def geom_svg_path(g, height, scale=1.0):
    polys = [g] if g.geom_type == "Polygon" else [p for p in getattr(g, "geoms", []) if p.geom_type == "Polygon"]
    d = ""
    for p in polys:
        for ring in [p.exterior] + list(p.interiors):
            d += "M" + " L".join(f"{x * scale:.2f},{(height - z) * scale:.2f}" for x, z in ring.coords) + " Z "
    return d


def layers_svg(layers, pal, w, h, bg=None, scale=1.0, extra=""):
    body = [f'<rect width="{w * scale}" height="{h * scale}" fill="{pal[bg]}"/>'] if bg else []
    for key, g in layers:
        if g is None or g.is_empty:
            continue
        body.append(f'<path d="{geom_svg_path(g, h, scale)}" fill="{pal[key]}" fill-rule="evenodd"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w * scale:.1f} {h * scale:.1f}" width="{w * scale:.0f}" height="{h * scale:.0f}">{"".join(body)}{extra}</svg>'


def png(svg, out, w=None, h=None):
    import cairosvg
    cairosvg.svg2png(bytestring=svg.encode(), write_to=str(out), output_width=w, output_height=h)


def paste_logo(target, src, x, y, width=None, height=None, anchor="middle"):
    """Paste a venue's own logo artwork onto a rendered PNG: centred on x (or from x when anchor is left), top at y, in pixels."""
    from PIL import Image
    im = Image.open(target).convert("RGBA")
    lg = Image.open(TOOLS / "logos" / src).convert("RGBA")
    lg = lg.crop(lg.getbbox())
    k = width / lg.width if width else height / lg.height
    lg = lg.resize((round(lg.width * k), round(lg.height * k)), Image.LANCZOS)
    im.alpha_composite(lg, (round(x - lg.width / 2) if anchor == "middle" else round(x), round(y)))
    im.save(target)


def logo_png_svg(src, size=480):
    """The venue's logo artwork wrapped in an SVG, so the site can use it like the drawn logos."""
    from PIL import Image
    lg = Image.open(TOOLS / "logos" / src).convert("RGBA")
    lg = lg.crop(lg.getbbox())
    lg.thumbnail((size, size), Image.LANCZOS)
    buf = io.BytesIO()
    lg.save(buf, "PNG", optimize=True)
    data = base64.b64encode(buf.getvalue()).decode()
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {lg.width} {lg.height}" width="{lg.width}" height="{lg.height}"><image href="data:image/png;base64,{data}" width="{lg.width}" height="{lg.height}"/></svg>'


def build(tid):
    t = THEMES[tid]
    use_unit(t.get("unit"))
    out = ROOT / "themes" / tid / "build"
    web = out / "web"
    (out / "preview").mkdir(parents=True, exist_ok=True)
    web.mkdir(parents=True, exist_ok=True)
    pal = {k: {"hex": v, "filament": t["filament"].get(k, "PETG HF")} for k, v in t["pal"].items()}
    tb.ASSEMBLED = trimesh.Scene()
    view = trimesh.Scene()
    report = []

    def make(name, body, outline, layers, place):
        region = outline.buffer(-tb.EDGE_KEEP)
        colours = tb.resolve(layers, region)
        colours.pop("base", None)
        base, inlays = tb.inlay(body, colours)
        lo, hi = base.bounds
        size = sorted([hi[0] - lo[0], hi[2] - lo[2]])
        assert size[0] <= BED[0] + 0.5 and size[1] <= BED[1] + 0.5, f"{name} is {size} mm, larger than the plate"
        tb.export_part(name, base, inlays, pal, out)
        tb.preview_svg(name, region, colours, pal, out / "preview")
        for key, m in {"base": base, **inlays}.items():
            v = m.copy()
            v.apply_transform(place @ TO_VIEW)
            v.visual = trimesh.visual.ColorVisuals(v, face_colors=trimesh.visual.color.hex_to_rgba(pal[key]["hex"]))
            view.add_geometry(v, node_name=f"{name}__{key}", geom_name=f"{name}__{key}")
        report.append((name, sorted(inlays), [round(s) for s in size]))

    for side, nm in ((1, "wing_right"), (-1, "wing_left")):
        outline, layers = t["wing"](7 + (1 if side > 0 else 0))
        body, outline = wing_body(outline)
        flip = np.diag([-1.0, 1, 1, 1]) if side < 0 else np.eye(4)
        if side < 0:
            body.apply_transform(flip)
            if body.volume < 0:
                body.invert()
            outline = mirror(outline)
            layers = [(k, mirror(g)) for k, g in layers]
        # Wings hang beside the unit: unit coordinates, unit bottom at z = 0.
        make(nm, body, outline, layers, np.eye(4))

    outline, layers = t["topper"]()
    body, outline = topper_body(outline)
    if t.get("studs"):
        studs = []
        for x in np.linspace(-HW + 22, HW - 22, 6):
            c = tb.cyl_z(14, 128, 136, x, 14)
            studs.append(c)
        body = tb.boolean("union", [body] + studs)
    make("topper", body, outline, layers, np.eye(4))

    view.export(web / "parts.glb")

    # Screen: 1200 × 1920 px like the app, drawn at 600 × 960 units.
    sw, sh = 600.0, 960.0
    sl = t["screen_art"](sw, sh)
    spal = t["pal"]
    sc = t["screen"]
    cta = text(sc["cta"], t["font"], sw / 2, 300, 38, sw * 0.82)
    btn = U(Point(sw / 2, 190).buffer(46, 64).difference(Point(sw / 2, 190).buffer(39, 64)), Point(sw / 2, 190).buffer(31, 64))
    tick = box(0, 0, sw, 46)
    tick_text = text(sc["ticker"], "poppins", 12, 23, 14, None, anchor="start")
    sl += [("base", box(0, 0, 0, 0)), (sc["accent"], btn), (sc["ink"], cta), (sc["accent"], tick), (sc["bg"] if spal[sc["bg"]] != spal[sc["accent"]] else "base", tick_text.intersection(tick))]
    png(layers_svg(sl, spal, sw, sh), web / "screen.png", 600, 960)
    art = t.get("logo_png")
    if art:
        paste_logo(web / "screen.png", art["file"], art["screen"][0], sh - art["screen"][1], width=art["screen"][2])

    # Photo frame for an Instax Square print (72 × 86 mm), photo window 62 × 62 mm left transparent.
    fr = t["frame"]
    fw, fh = 720.0, 860.0
    frame = box(0, 0, fw, fh).difference(box(50, 190, 670, 810))
    logo = t["logo"]()
    lg = U(*[g for _, g in logo])
    fl = [(fr["bg"], frame)]
    placed = []
    lx0, lz0, lx1, lz1 = lg.bounds
    k = min(150 / (lx1 - lx0), 100 / (lz1 - lz0))
    for key, g in logo:
        g = affinity.scale(g, k, k, origin=(0, 0))
        placed.append((key, g))
    pb = U(*[g for _, g in placed]).bounds
    placed = [(key, affinity.translate(g, 60 - pb[0], 95 - (pb[1] + pb[3]) / 2)) for key, g in placed]
    cap = text(fr["caption"].upper(), "poppins", 685, 95, 18, 440, anchor="end")
    fl += placed + [(fr["ink"], cap)]
    if art:
        fl = [(fr["bg"], frame), (fr["ink"], cap)]
    png(layers_svg(fl, spal, fw, fh), web / "print.png", 720, 860)
    if art:
        paste_logo(web / "print.png", art["file"], art["frame"][0], fh - art["frame"][1], height=art["frame"][2], anchor="left")

    # Logo on its own, for the site
    lb = lg.bounds
    pad = 4
    logo_svg = layers_svg([(key, affinity.translate(g, -lb[0] + pad, -lb[1] + pad)) for key, g in logo], spal, lb[2] - lb[0] + pad * 2, lb[3] - lb[1] + pad * 2, scale=4)
    if art:
        logo_svg = logo_png_svg(art["file"])
    (web / "logo.svg").write_text(logo_svg)

    meta = dict(id=tid, name=t["name"], place=t["place"], palette=t["pal"], casing=t["casing"], ring=t["ring"],
                frame=fr, photo=t["photo"], parts=[r[0] for r in report], **({"unit": t["unit"]} if t.get("unit") else {}))
    (web / "theme.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False))
    theme_json = dict(name=t["name"], event=f"{t['name']} – concept design (venue artwork, internal use)", palette=pal,
                      casing={"style": "venue", "colour": t["casing"], "built_by": "hardware/tools/venue_themes.py"},
                      light={"idle": {"animation": "slow-wave", "colors": t["ring"]["idle"], "period_s": 8}, "countdown": {"color": "#ffffff"},
                             "photo": {"cob": 1.0, "rgbw": "#fff1de"}, "glow": t["ring"]["glow"]},
                      screen={"ticker": sc["ticker"], "cta": sc["cta"], "background": sc["bg"], "accent": sc["accent"]})
    (ROOT / "themes" / tid / "theme.json").write_text(json.dumps(theme_json, indent=2, ensure_ascii=False))
    print(f"{t['name']}:")
    for name, cols, size in report:
        print(f"  {name:11s} {size[1]} × {size[0]} mm   base + {', '.join(cols)}")


if __name__ == "__main__":
    for tid in sys.argv[1:] or list(THEMES):
        build(tid)
