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
ALL = ["hero", "front", "side", "back", "detail", "wall", "exploded", "inside", "theme"]
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


def setup_materials():
    M = {
        "body": textured_black("Body ASA"),
        "diff": mat("Diffuser PETG", srgb("#fff6ea"), rough=0.45, trans=0.6, emit=srgb("#fff1de"), strength=5.5),
        "band": mat("Glow stripe", srgb("#f4efe8"), rough=0.5, trans=0.5, emit=srgb("#ffe9d0"), strength=2.2),
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
    im.image = bpy.data.images.load(SCREEN); em.inputs["Strength"].default_value = 1.6
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


def screen_plane(M, dz, explode=0.0):
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


def shoot(name):
    clear()
    M = setup_materials()
    objs = import_pack(); assign(objs, M)
    ex = 0.0; printer = False; roof = False; theme = None
    if name in ("wall",): printer = True
    if name == "exploded": ex = 1.0
    if name == "theme": theme = "sommernat"; printer = True
    dz = place(objs, with_printer=printer, with_roof=roof, theme=theme, explode=ex, on_wall=name in ("wall", "theme"))
    if name == "inside":
        for n in ("shell", "shell_band", "shell_closed", "shell_closed_band", "wall_cleat"):
            objs[n].hide_render = True
        for n, o in objs.items():
            if n.startswith("hw--") and ("--shell--" in n or "--wall_cleat--" in n):
                o.hide_render = True
    screen_plane(M, dz, ex)
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
    shoot(s)
