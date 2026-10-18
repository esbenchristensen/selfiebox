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
    body = tb.boolean("union", [face, rib] + stiff)
    holes = [tb.cyl_x(G["M3_CLR"], X0 - 1, X0 + 5, G["SIDE_Y"], z) for z in (G["BZ0"], G["BZ1"])]
    return tb.boolean("diff", [body] + holes), outline


def topper_body(outline):
    """theme_builder's topper, with a free outline. z = 0 is the top of the joint spacer."""
    outline = U(outline, box(-HW, 0, HW, 14)).buffer(-2).buffer(2)
    r = G["R"]
    for sx in (-1, 1):   # follow the box's rounded top corners where the outline is as wide as the box
        corner = box(min(sx * HW, sx * (HW - r)), -1, max(sx * HW, sx * (HW - r)), r)
        if outline.bounds[0] > -HW - 1 and outline.bounds[2] < HW + 1:
            outline = outline.difference(corner.difference(Point(sx * (HW - r), r).buffer(r, 48)))
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
                frame=fr, photo=t["photo"], parts=[r[0] for r in report])
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
