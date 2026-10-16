"""Photoreal studio renders of the Halo selfiebox with Blender Cycles.

Usage:  blender -b -P hardware/render/render.py -- [shot ...] [--samples N] [--size WxH]
Shots:  hero front side back detail wall exploded inside theme   (default: all)
Input:  hardware/docs/pack/pack.json (python3 hardware/tools/build_pack.py)
Output: hardware/docs/pack/renders/<shot>.jpg
"""
import math
import os
import shutil
import sys
import tempfile

import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.join(HERE, "..", "docs", "pack")
OUT = os.path.join(PACK, "renders")
SCREEN = os.path.join(HERE, "screen_idle.png")

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SAMPLES, SIZE, shots = 128, (1600, 2000), []
i = 0
while i < len(argv):
    if argv[i] == "--samples": SAMPLES = int(argv[i + 1]); i += 2
    elif argv[i] == "--size": SIZE = tuple(int(v) for v in argv[i + 1].split("x")); i += 2
    else: shots.append(argv[i]); i += 1
ALL = ["hero", "front", "side", "back", "detail", "wall", "exploded", "inside", "theme", "room", "room_close"]
shots = shots or ALL

# ------------------------------------------------------------------ geometry facts (mm, = OpenSCAD frame)
W, H, D, H_PRN, SP = 234, 306, 66, 84, 6
GC, LENS_Z, VIEW = 151.85, 289.2, (136.4, 217.6)
GLASS_Y = 3.7
H_INX = 189
Z_UNIT = H_INX + SP           # unit sits on the photo module + joint spacer
GROUP = {"bezel": "unit", "diffuser_ring": "unit", "led_rail": "unit", "wall_cleat": "unit", "v_display": "unit", "v_pi": "unit",
         "v_camera": "unit", "v_leds": "unit", "v_power": "unit", "v_pads": "unit", "shell": "unit", "shell_band": "unit",
         "shell_closed": "unit", "shell_closed_band": "unit",
         "instax_front": "strip", "v_instax": "strip", "instax_shell": "strip", "instax_shell_band": "strip",
         "roof": "roof", "joint_spacer": "spacer"}
# explode offsets along depth (+y = backwards), mm
EXPLODE = {"diffuser_ring": -45, "bezel": 0, "v_camera": 25, "v_display": 40, "v_pads": 70, "led_rail": 95, "v_leds": 95,
           "v_pi": 130, "shell": 205, "shell_band": 205, "shell_closed": 205, "shell_closed_band": 205, "v_power": 205, "wall_cleat": 300}
PAL = {"sommernat": {"base": "#0b0b0d", "forest": "#0f5c3e", "leaf": "#2e8b57", "lilac": "#b48ac9", "coral": "#e8553d", "cream": "#f3e3d3"},
       "neon": {"base": "#0b0b0d", "magenta": "#ff2fb4", "cyan": "#22e6ff", "lime": "#c8ff3a"}}


def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c) + (1.0,)


# ------------------------------------------------------------------ materials
def mat(name, base, rough=0.5, metal=0.0, emit=None, strength=0.0, trans=0.0, coat=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = base
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if trans:
        b.inputs["Transmission Weight"].default_value = trans
        b.inputs["Subsurface Weight"].default_value = 0.3
    if coat:
        b.inputs["Coat Weight"].default_value = coat
    if emit:
        b.inputs["Emission Color"].default_value = emit
        b.inputs["Emission Strength"].default_value = strength
    return m


def textured_black(name):
    """Matte black ASA with the fine grain of a textured PEI plate (front) / layer sheen (sides)."""
    m = mat(name, srgb("#0d0d0f"), rough=0.62)
    nt = m.node_tree
    tex = nt.nodes.new("ShaderNodeTexNoise"); tex.inputs["Scale"].default_value = 900.0; tex.inputs["Detail"].default_value = 6
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.025; bump.inputs["Distance"].default_value = 0.0001
    nt.links.new(tex.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
    return m


def setup_materials(screen=SCREEN, ring="#fff1de", glow="#ffe9d0"):
    M = {
        "body": textured_black("Body ASA"),
        "diff": mat("Diffuser PETG", srgb("#fff6ea"), rough=0.45, trans=0.6, emit=srgb(ring), strength=5.5),
        "band": mat("Glow stripe", srgb("#f4efe8"), rough=0.5, trans=0.5, emit=srgb(glow), strength=2.2),
        "led": mat("LED", srgb("#ffffff"), emit=srgb("#fff1de"), strength=6.0),
        "glass": mat("Display glass", srgb("#050507"), rough=0.04, coat=1.0),
        "pcb": mat("PCB", srgb("#0f5a32"), rough=0.4),
        "lens": mat("Lens holder", srgb("#08080a"), rough=0.15, coat=1.0),
        "dark": mat("Dark", srgb("#1c1c20"), rough=0.5),
        "pad": mat("EVA", srgb("#2e2e33"), rough=0.95),
        "power": mat("Pololu PCB", srgb("#173e74"), rough=0.4),
        "screw": mat("Black oxide steel", srgb("#18181a"), rough=0.32, metal=1.0),
        "insert": mat("Brass", srgb("#c9973f"), rough=0.28, metal=1.0),
        "dowel": mat("Steel", srgb("#a9abb3"), rough=0.22, metal=1.0),
        "zinc": mat("Zinc", srgb("#b7b9bf"), rough=0.3, metal=1.0),
        "paper": mat("Paper", srgb("#f2f0ea"), rough=0.8),
    }
    # screen: the idle UI as an emissive image
    sm = bpy.data.materials.new("Screen"); sm.use_nodes = True; nt = sm.node_tree
    for n in list(nt.nodes): nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial"); em = nt.nodes.new("ShaderNodeEmission"); im = nt.nodes.new("ShaderNodeTexImage")
    im.image = bpy.data.images.load(screen); em.inputs["Strength"].default_value = 1.6
    gl = nt.nodes.new("ShaderNodeBsdfGlossy"); gl.inputs["Roughness"].default_value = 0.03; gl.inputs["Color"].default_value = (0.04, 0.04, 0.04, 1)
    add = nt.nodes.new("ShaderNodeAddShader")
    nt.links.new(im.outputs["Color"], em.inputs["Color"]); nt.links.new(em.outputs[0], add.inputs[0]); nt.links.new(gl.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs["Surface"])
    M["screen"] = sm
    return M


ROLE = {"bezel": "body", "shell": "body", "printer_front": "body", "printer_shell": "body", "roof": "body", "wall_cleat": "body", "instax_front": "body", "instax_shell": "body", "instax_shell_band": "band", "v_instax": "paper",
        "led_rail": "body", "joint_spacer": "body", "shell_closed": "body", "shell_closed_band": "band", "v_pol9": "power", "shell_band": "band", "printer_shell_band": "band", "diffuser_ring": "diff",
        "v_leds": "led", "v_display": "glass", "v_pi": "pcb", "v_camera": "lens", "v_printer": "dark", "v_pads": "pad", "v_power": "power"}
HWMAT = {"ins": "insert", "dowel6x20": "dowel", "wood45x50": "zinc"}


# ------------------------------------------------------------------ scene
def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_pack():
    tmp = tempfile.mkdtemp()
    src = os.path.join(tmp, "pack.gltf"); shutil.copy(os.path.join(PACK, "pack.json"), src)
    bpy.ops.import_scene.gltf(filepath=src)
    objs = {}
    for o in list(bpy.context.scene.objects):
        if o.type != "MESH":
            continue
        o.name = o.name.split(".")[0] if not o.name.startswith("hw--") else o.name
        objs[o.name] = o
    # glTF import gives metres = our millimetres; Blender's frame then equals the OpenSCAD frame.
    return objs


def assign(objs, M, theme=None):
    for name, o in objs.items():
        o.data.materials.clear()
        if name.startswith("hw--"):
            kind = name.split("--")[3]
            o.data.materials.append(M[HWMAT.get(kind, HWMAT.get(kind[:3], "screw"))])
        elif "--" in name:
            th, rest = name.split("--"); part, colour = rest.split("__")
            m = mat(f"{th} {colour}", srgb(PAL[th][colour]), rough=0.62 if colour == "base" else 0.5)
            o.data.materials.append(textured_black("Body ASA") if colour == "base" else m)
        else:
            o.data.materials.append(M[ROLE.get(name, "dark")])
        for p in o.data.polygons:
            p.use_smooth = False


def place(objs, with_printer=True, with_roof=False, theme=None, explode=0.0, on_wall=False):
    """Stack modules (printer below, roof/topper above) and optionally explode the unit along depth."""
    dz_unit = Z_UNIT if with_printer else 0
    for name, o in objs.items():
        vis = True
        if name.startswith("hw--"):
            _, grp, when, kind, part, _n = name.split("--")
            vis = (grp == "unit" and (when == "base" or (when == "top" and (with_roof or theme)) or (when == "wing" and theme))) \
                or (grp == "photo" and with_printer) or (grp == "roof" and with_roof) or (grp == "topper" and theme)
            if kind == "wood45x50" and not on_wall:
                vis = False          # wall screws only when it hangs on a wall
            if theme and when == "base" and kind == "m3x8" and part == "shell":
                vis = False          # wings use longer screws
            z = {"unit": dz_unit, "photo": 0, "roof": dz_unit + H + SP, "topper": dz_unit + H + SP}[grp]
            dy = EXPLODE.get(part, 0) * explode
            if explode and kind.startswith("m") and grp == "unit":
                d = o.matrix_world  # push screws out along their own axis a bit more
            o.location = (0, dy, z)
        elif "--" in name:
            th, rest = name.split("--"); part = rest.split("__")[0]
            vis = th == theme
            o.location = (0, 0, dz_unit if part.startswith("wing") else (dz_unit + H + SP if part == "topper" else 0))
            if part == "printer_front":
                vis = vis and with_printer
        else:
            grp = GROUP.get(name)
            if grp is None:
                vis = False
            elif grp == "unit":
                o.location = (0, EXPLODE.get(name, 0) * explode, dz_unit)
            elif grp == "strip":
                vis = with_printer; o.location = (0, 0, 0)
            elif grp == "roof":
                vis = with_roof; o.location = (0, 0, dz_unit + H + SP)
            elif grp == "spacer":
                vis = with_printer; o.location = (0, 0, H_INX)
            if theme and name == "printer_front":
                vis = False
            top_used = with_roof or bool(theme)
            if name in ("shell", "shell_band"):
                vis = vis and top_used
            if name in ("shell_closed", "shell_closed_band"):
                vis = vis and not top_used
        o.hide_render = not vis
        o.hide_viewport = not vis
    return dz_unit


def screen_plane(M, dz, explode=0.0):  # returns the plane
    bpy.ops.mesh.primitive_plane_add(size=1)
    p = bpy.context.active_object; p.name = "Screen"
    p.scale = (VIEW[0], VIEW[1], 1)
    p.rotation_euler = (math.radians(90), 0, 0)
    p.location = (0, GLASS_Y - 0.05 + EXPLODE["v_display"] * explode, dz + GC)
    p.data.materials.append(M["screen"])
    return p


def studio(floor_color="#161618"):
    w = bpy.context.scene.world or bpy.data.worlds.new("World"); bpy.context.scene.world = w
    w.use_nodes = True; w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.004, 0.004, 0.005, 1)
    w.node_tree.nodes["Background"].inputs["Strength"].default_value = 1.0
    # sweep backdrop
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    bd = bpy.context.active_object; bd.name = "Backdrop"
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.delete(type="VERT"); bpy.ops.object.mode_set(mode="OBJECT")
    me = bd.data; verts = []; R = 600
    for i in range(25):
        a = i / 24 * math.pi / 2
        verts.append((-R * math.cos(a) * 0 + 0, 0, 0))
    import bmesh
    bm = bmesh.new(); prof = []
    for i in range(0, 41):
        t = i / 40
        if t < 0.5:
            y, z = -3000 + t * 2 * 3000, 0           # floor from the front to the bend
        else:
            a = (t - 0.5) * 2 * (math.pi / 2)
            y, z = R * math.sin(a), R - R * math.cos(a)
        prof.append((y, z))
    prof.append((R, 4000))
    rows = []
    for x in (-4000, 4000):
        rows.append([bm.verts.new((x, y + 400, z)) for y, z in prof])
    for j in range(len(prof) - 1):
        bm.faces.new((rows[0][j], rows[1][j], rows[1][j + 1], rows[0][j + 1]))
    bm.to_mesh(me); bm.free()
    for p in me.polygons: p.use_smooth = True
    bd.data.materials.append(mat("Backdrop", srgb(floor_color), rough=0.75))
    return bd


def area(name, loc, target, size, power, color=(1, 1, 1), shape="RECTANGLE", size_y=None):
    l = bpy.data.lights.new(name, "AREA"); l.energy = power; l.color = color; l.shape = shape
    l.size = size; l.size_y = size_y or size
    o = bpy.data.objects.new(name, l); bpy.context.scene.collection.objects.link(o)
    o.location = loc; d = Vector(target) - Vector(loc); o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return o


def lights(cz, warm=True):
    # mm scene: power scaled for a 1:1000 world (watts grow with area^2 -> large numbers)
    area("Key", (-900, -1100, cz + 700), (0, 0, cz), 900, 2.6e7)
    area("Fill", (1200, -900, cz + 200), (0, 0, cz), 1200, 6e6)
    area("Rim L", (-700, 600, cz + 300), (0, 30, cz), 300, 1.2e7, size_y=1400, shape="RECTANGLE")
    area("Rim R", (700, 600, cz + 300), (0, 30, cz), 300, 1.2e7, size_y=1400, shape="RECTANGLE")
    area("Top", (0, -100, cz + 1300), (0, 0, cz), 800, 6e6)


def camera(loc, target, lens=85, shift=(0, 0)):
    c = bpy.data.cameras.new("Cam"); c.lens = lens; c.clip_start = 10; c.clip_end = 20000
    c.shift_x, c.shift_y = shift
    o = bpy.data.objects.new("Cam", c); bpy.context.scene.collection.objects.link(o)
    o.location = loc; d = Vector(target) - Vector(loc); o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = o
    return o


def frame_cam(target, direction, lens, fit_h, aspect):
    """Place a camera looking at target from direction so that a box of height fit_h fits."""
    fov = 2 * math.atan(36 / 2 / lens) if aspect >= 1 else 2 * math.atan(36 / 2 / lens)
    dist = (fit_h / 2) / math.tan(fov / 2) * 1.08
    d = Vector(direction).normalized()
    return camera(tuple(Vector(target) + d * dist), target, lens)


def render_settings(path, size):
    s = bpy.context.scene
    s.render.engine = "CYCLES"; s.cycles.device = "CPU"; s.cycles.samples = SAMPLES
    s.cycles.use_denoising = False        # this Blender build has no OpenImageDenoise: more samples instead
    s.cycles.use_adaptive_sampling = True; s.cycles.adaptive_threshold = 0.01
    s.cycles.sample_clamp_indirect = 4.0; s.cycles.blur_glossy = 1.0
    s.cycles.filter_width = 1.6
    s.cycles.max_bounces = 8; s.cycles.transmission_bounces = 8
    s.render.resolution_x, s.render.resolution_y = size; s.render.resolution_percentage = 100
    s.view_settings.view_transform = "AgX"
    try:
        s.view_settings.look = "AgX - Medium High Contrast"
    except Exception:
        pass
    s.render.image_settings.file_format = "JPEG"; s.render.image_settings.quality = 90
    s.render.filepath = path
    s.render.film_transparent = False


def wall(dz):
    bpy.ops.mesh.primitive_plane_add(size=6000, location=(0, D + 14.01, 1500))
    w = bpy.context.active_object; w.rotation_euler = (math.radians(90), 0, 0)
    m = mat("Wall", srgb("#202024"), rough=0.92)
    nt = m.node_tree; tex = nt.nodes.new("ShaderNodeTexNoise"); tex.inputs["Scale"].default_value = 40
    bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.15
    nt.links.new(tex.outputs["Fac"], bump.inputs["Height"]); nt.links.new(bump.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
    w.data.materials.append(m)
    return w



# ------------------------------------------------------------------ room scene (scale reference)
ROOM_Z0 = 1110          # photo module bottom above the floor -> camera lens at ~160 cm


def box_obj(name, x0, y0, z0, x1, y1, z1, m, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.active_object; o.name = name; o.scale = (x1 - x0, y1 - y0, z1 - z0)
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new("b", "BEVEL"); mod.width = bevel; mod.segments = 3
    o.data.materials.append(m)
    return o


def cyl_obj(name, x, y, z0, z1, r, m, verts=48):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=z1 - z0, vertices=verts, location=(x, y, (z0 + z1) / 2))
    o = bpy.context.active_object; o.name = name; o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return o


def sphere_obj(name, x, y, z, r, m, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(x, y, z), segments=40, ring_count=20)
    o = bpy.context.active_object; o.name = name; o.scale = scale; o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    return o


def capsule(name, a, b, r, m):
    a, b = Vector(a), Vector(b); d = b - a
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, vertices=32, location=(a + b) / 2)
    o = bpy.context.active_object; o.name = name
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler(); o.data.materials.append(m)
    bpy.ops.object.shade_smooth()
    for pnt in (a, b):
        sphere_obj(name + "_end", pnt.x, pnt.y, pnt.z, r, m)
    return o


def build_room():
    wall_y = D + 14
    floor_m = mat("Oak floor", srgb("#6e5038"), rough=0.45)
    nt = floor_m.node_tree; bsdf = nt.nodes["Principled BSDF"]
    brick = nt.nodes.new("ShaderNodeTexBrick"); brick.inputs["Scale"].default_value = 0.0035
    brick.inputs["Color1"].default_value = srgb("#7a5a3e"); brick.inputs["Color2"].default_value = srgb("#5f4430")
    brick.inputs["Mortar"].default_value = srgb("#3a2a1e"); brick.inputs["Mortar Size"].default_value = 0.004
    brick.inputs["Brick Width"].default_value = 6.0; brick.inputs["Row Height"].default_value = 0.9
    nt.links.new(brick.outputs["Color"], bsdf.inputs["Base Color"])
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -2000, 0)); f = bpy.context.active_object; f.scale = (9000, 9000, 1); f.data.materials.append(floor_m)
    wall_m = mat("Wall paint", srgb("#4d5059"), rough=0.9)
    box_obj("Back wall", -4500, wall_y, 0, 4500, wall_y + 100, 3200, wall_m)
    box_obj("Side wall", 2700, -5000, 0, 2800, wall_y + 100, 3200, mat("Side wall", srgb("#3a3d45"), rough=0.9))
    box_obj("Skirting", -4500, wall_y - 14, 0, 2700, wall_y, 90, mat("Skirting", srgb("#1b1c20"), rough=0.6))
    # door with frame and handle
    trim = mat("Door trim", srgb("#b9b5ad"), rough=0.5)
    box_obj("Door frame", -2280, wall_y - 18, 0, -1220, wall_y, 2160, trim)
    box_obj("Door", -2230, wall_y - 24, 0, -1270, wall_y - 18, 2110, mat("Door", srgb("#8f8a82"), rough=0.55), bevel=2)
    cyl_obj("Door handle", -1350, wall_y - 50, 1040, 1060, 9, mat("Brushed steel", srgb("#b8bac0"), rough=0.3, metal=1.0))
    box_obj("Handle bar", -1360, wall_y - 60, 1045, -1240, wall_y - 45, 1057, mat("Brushed steel", srgb("#b8bac0"), rough=0.3, metal=1.0))
    # light switch at 105 cm
    box_obj("Switch", -800, wall_y - 10, 1010, -720, wall_y, 1090, mat("Switch", srgb("#f2f2f0"), rough=0.4), bevel=2)
    # two posters 50 x 70 cm
    frame_m = mat("Frame", srgb("#111113"), rough=0.4)
    for i, (x0, col) in enumerate([(700, "#b48ac9"), (1320, "#e8553d")]):
        box_obj(f"Poster frame {i}", x0, wall_y - 22, 1150, x0 + 500, wall_y, 1850, frame_m)
        pm = mat(f"Poster {i}", srgb(col), rough=0.7)
        box_obj(f"Poster {i}", x0 + 25, wall_y - 23, 1175, x0 + 475, wall_y - 21, 1825, pm)
        box_obj(f"Poster band {i}", x0 + 25, wall_y - 24, 1175, x0 + 475, wall_y - 22, 1400, mat(f"Poster band {i}", srgb("#0f5c3e"), rough=0.7))
    # high table (110 cm) and two bar stools (seat 76 cm)
    black = mat("Black metal", srgb("#18181b"), rough=0.35, metal=0.6)
    wood = mat("Table top", srgb("#8a6a4c"), rough=0.4)
    cyl_obj("Table base", 1150, -1050, 0, 18, 240, black); cyl_obj("Table pole", 1150, -1050, 18, 1080, 32, black)
    cyl_obj("Table top", 1150, -1050, 1080, 1105, 320, wood)
    for j, (sx, sy) in enumerate([(780, -1250), (1520, -1250)]):
        cyl_obj(f"Stool base {j}", sx, sy, 0, 14, 200, black); cyl_obj(f"Stool pole {j}", sx, sy, 14, 740, 26, black)
        cyl_obj(f"Stool seat {j}", sx, sy, 740, 790, 180, mat("Stool seat", srgb("#2b2b30"), rough=0.6))
        bpy.ops.mesh.primitive_torus_add(major_radius=170, minor_radius=9, location=(sx, sy, 320)); t = bpy.context.active_object; t.data.materials.append(black)
    # a glass and a phone on the table for scale
    cyl_obj("Glass", 1060, -1000, 1105, 1250, 38, mat("Glass", srgb("#ffffff"), rough=0.05, trans=1.0))
    box_obj("Phone", 1220, -1120, 1105, 1295, -965, 1113, mat("Phone", srgb("#0b0b0d"), rough=0.2), bevel=3)
    # potted plant
    cyl_obj("Pot", 2250, -500, 0, 480, 190, mat("Pot", srgb("#1f1f22"), rough=0.7))
    leaf = mat("Leaves", srgb("#2f6b3a"), rough=0.6)
    for k, (dx, dy, dz, r) in enumerate([(0, 0, 820, 260), (-120, 60, 1050, 200), (130, -40, 1000, 190), (40, 90, 1250, 150), (-60, -80, 700, 220)]):
        sphere_obj(f"Leaf {k}", 2250 + dx, -500 + dy, dz, r, leaf, scale=(1, 0.8, 1.15))
    # a 175 cm person (stylised mannequin) standing in front of the box
    skin = mat("Mannequin", srgb("#c9c4bc"), rough=0.7)
    px, py = -560, -420
    sphere_obj("Head", px, py, 1650, 100, skin, scale=(0.82, 0.92, 1.0))
    capsule("Neck", (px, py, 1480), (px, py, 1560), 45, skin)
    capsule("Torso", (px, py, 1030), (px, py, 1380), 135, skin)
    for sx in (-1, 1):
        capsule(f"Leg {sx}", (px + sx * 85, py, 90), (px + sx * 85, py, 900), 68, skin)
        capsule(f"Arm {sx}", (px + sx * 200, py, 1400), (px + sx * 235, py + 40, 860), 44, skin)
        box_obj(f"Shoe {sx}", px + sx * 85 - 50, py - 150, 0, px + sx * 85 + 50, py + 60, 70, mat("Shoe", srgb("#2a2a2e"), rough=0.6), bevel=15)
    # lights: warm ceiling downlights + soft fill; the box's ring adds its own glow
    for (lx, ly) in [(-1500, -1200), (0, -1500), (1300, -1200)]:
        l = bpy.data.lights.new("Downlight", "SPOT"); l.energy = 1.4e8; l.spot_size = math.radians(70); l.spot_blend = 0.6
        l.color = (1.0, 0.82, 0.62); l.shadow_soft_size = 120
        o = bpy.data.objects.new("Downlight", l); bpy.context.scene.collection.objects.link(o); o.location = (lx, ly, 3000)
    area("Room fill", (0, -4500, 1800), (0, 0, 1200), 3000, 6e7, color=(0.85, 0.88, 1.0))
    area("Wall wash", (400, -800, 3000), (400, wall_y, 1400), 1200, 4e7, color=(1.0, 0.85, 0.7))
    w = bpy.context.scene.world or bpy.data.worlds.new("World"); bpy.context.scene.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.01, 0.01, 0.012, 1)

# ------------------------------------------------------------------ reference pack (transparent PNGs for AI image tools)
REF_CFG = {   # printer, theme, screen, ring colour, glow-stripe colour
    "std": (True, None, SCREEN, "#fff1de", "#ffe9d0"),
    "unit": (False, None, SCREEN, "#fff1de", "#ffe9d0"),
    "sommernat": (True, "sommernat", os.path.join(HERE, "screen_idle_sommernat.png"), "#e6d2f0", "#b48ac9"),
    "neon": (True, "neon", os.path.join(HERE, "screen_idle_neon.png"), "#ff7ad2", "#ff2fb4"),
}
REF_ANGLE = {"front": ((0, -1, 0.03), 85), "left": ((-0.62, -1, 0.1), 70), "right": ((0.62, -1, 0.1), 70), "side": ((1, -0.06, 0.05), 85)}


def shoot_ref(name):
    _, cfg, angle = name.split("_")
    printer, theme, screen, ring, glow = REF_CFG[cfg]
    clear()
    M = setup_materials(screen, ring, glow)
    objs = import_pack(); assign(objs, M)
    dz = place(objs, with_printer=printer, theme=theme)
    screen_plane(M, dz)
    bottom = 0 if printer else dz
    top = dz + H + (SP + 103 if theme else 0)
    cz = (top + bottom) / 2
    lights(cz)
    w = bpy.data.worlds.new("World"); bpy.context.scene.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.02, 0.02, 0.022, 1)
    d, lens = REF_ANGLE[angle]
    frame_cam((0, 30, cz), d, lens, (top - bottom) * 1.12, SIZE[0] / SIZE[1])
    path = os.path.join(OUT, "..", "reference", name + ".png")
    render_settings(path, SIZE)
    s = bpy.context.scene
    s.render.film_transparent = True
    s.render.image_settings.file_format = "PNG"; s.render.image_settings.color_mode = "RGBA"; s.render.image_settings.compression = 90
    bpy.ops.render.render(write_still=True)
    print("RENDERED", name)


def shoot(name):
    clear()
    M = setup_materials()
    objs = import_pack(); assign(objs, M)
    ex = 0.0; printer = False; roof = False; theme = None
    if name in ("wall",): printer = True
    if name == "exploded": ex = 1.0
    if name == "theme": theme = "sommernat"; printer = True
    if name.startswith("room"): printer = True
    dz = place(objs, with_printer=printer, with_roof=roof, theme=theme, explode=ex, on_wall=name in ("wall", "theme") or name.startswith("room"))
    if name == "inside":
        for n in ("shell", "shell_band", "shell_closed", "shell_closed_band", "wall_cleat"):
            objs[n].hide_render = True
        for n, o in objs.items():
            if n.startswith("hw--") and ("--shell--" in n or "--wall_cleat--" in n):
                o.hide_render = True
    scr = screen_plane(M, dz, ex)
    if name.startswith("room"):
        for o in list(objs.values()) + [scr]:
            o.location.z += ROOM_Z0
        build_room()
        size = (2200, 1375) if SIZE[0] >= 1000 else (440, 275)
        if name == "room":
            camera((350, -4300, 1450), (100, 0, 1200), 30)
        else:
            camera((150, -2900, 1350), (-300, 0, 1000), 35)
        render_settings(os.path.join(OUT, name + ".jpg"), size)
        bpy.ops.render.render(write_still=True)
        # pixel positions for the scale labels (box top/bottom, lens, person head/feet)
        from bpy_extras.object_utils import world_to_camera_view
        sc, cam = bpy.context.scene, bpy.context.scene.camera
        pts = {"box_top": (0, 0, ROOM_Z0 + Z_UNIT + H), "box_bottom": (0, 0, ROOM_Z0), "lens": (0, 0, ROOM_Z0 + Z_UNIT + LENS_Z),
               "box_right": (W / 2, 0, ROOM_Z0 + Z_UNIT + H / 2), "head": (-560, -420, 1750), "feet": (-560, -420, 0), "floor_at_wall": (0, D + 14, 0)}
        px = {k: [world_to_camera_view(sc, cam, Vector(v)).x * size[0], (1 - world_to_camera_view(sc, cam, Vector(v)).y) * size[1]] for k, v in pts.items()}
        import json
        open(os.path.join(OUT, name + ".json"), "w").write(json.dumps({"size": size, "px": px}))
        print("RENDERED", name)
        return
    top = dz + H
    cz = (top + (0 if printer else dz)) / 2
    aspect = SIZE[0] / SIZE[1]
    if name == "wall" or name == "theme":
        wall(dz)
        bpy.data.objects.get("Backdrop") or None
    else:
        studio()
    lights(cz)
    if name == "hero":
        frame_cam((0, 20, cz), (-0.55, -1, 0.18), 70, H * 1.25, aspect)
    elif name == "front":
        frame_cam((0, 0, cz), (0, -1, 0.02), 110, H * 1.18, aspect)
    elif name == "side":
        frame_cam((0, 40, cz), (1, -0.08, 0.05), 100, H * 1.2, aspect)
    elif name == "back":
        frame_cam((0, 40, cz), (0.6, 1, 0.2), 70, H * 1.25, aspect)
    elif name == "detail":
        camera((-210, -380, dz + LENS_Z + 90), (0, 10, dz + LENS_Z - 45), 85)
    elif name == "wall":
        frame_cam((0, 20, (top) / 2), (-0.42, -1, 0.1), 60, top * 1.25, aspect)
    elif name == "theme":
        frame_cam((0, 20, (top + 110) / 2), (-0.35, -1, 0.08), 60, (top + 110) * 1.2, aspect)
    elif name == "exploded":
        frame_cam((0, 120, cz), (-1, -0.55, 0.32), 55, 470, aspect)
    elif name == "inside":
        frame_cam((0, 20, cz), (0.55, 1, 0.25), 65, H * 1.25, aspect)
    os.makedirs(OUT, exist_ok=True)
    render_settings(os.path.join(OUT, name + ".jpg"), SIZE)
    bpy.ops.render.render(write_still=True)
    print("RENDERED", name)


for s in shots:
    shoot_ref(s) if s.startswith("ref_") else shoot(s)
