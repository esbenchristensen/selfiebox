#!/usr/bin/env python3
"""Bambu Studio project files for every printed part of a gen 2 release, each with its print settings inside.

v26 print settings (Esben 27 Oct, second round: "the best possible settings for a clean result without faults, that looks moulded but
is durable"): every part now has its own 3MF with the object's settings already set (layer height, walls, infill, the
first-layer pattern of the visible face, seam, support, brim), so a print looks the same from box to box and does
not depend on what was last chosen in Bambu Studio. Only object-level settings are written (Bambu Studio's
PrintObjectConfig / PrintRegionConfig keys, as <metadata> on the object in Metadata/model_settings.config, which the
loader passes to the object's config). Since the third round the files also name the printer, process and filament presets and the
plate (see below); temperatures and the rest stay Bambu's own presets.

  <version>_front_flerfarvet.3mf  the black front with the logo inlays (white and green) in its 0.8 mm recess, as ONE
                                  object with three parts on slots 1 sort / 2 hvid / 3 groen
  <version>_skal_support.3mf      the shell with its support enforcers and blockers (v26, see skal_3mf below)
  <version>_lysring.3mf, _bagramme.3mf, _vaegbeslag.3mf, _blaeserhegn.3mf (v27; v26 had _smaadele.3mf with the camera
  sleeve and the fan guard on one plate), _tema-*.3mf   one object each, settings inside

Seams: v26-v35 used Bambu's "back" seam (+y on the plate) with a scarf seam, and every part was placed so that +y is the
box's underside (the shell and the frame are still turned 180 degrees on the plate). That put every layer's start on one
straight line across the part (v36 shell and front, v42 light ring), so since v42 every part has Bambu's default
"aligned" seam with no scarf (SEAM_ALIGNED), as v18, which was sliced from plain STLs, had.

Bambu projects (27 Oct, third round; Esben: "vi kan ikke loade de configs der er i 3mf filerne"): until then the files had no project
config, so Bambu Studio 2.8.2 said "The 3mf file has invalid config, load geometry data only" and reset every object's
settings (Plater::priv::load_files: a config without a Bambu printer_model or nozzle_diameter is invalid, and with
load_config off the objects' configs are reset, only the extruder is kept). Now every file is a Bambu Studio project:
Application "BambuStudio-<version>" in the model and Metadata/project_settings.config naming Bambu's own system presets
(Bambu Lab H2C 0.4 nozzle, 0.20mm Standard @BBL H2C, and per filament slot the material on the spool: Bambu ASA
since v59 (v34-v58 Bambu PLA Basic; v31-v33 said ASA with PLA on the spools), PETG Translucent for the clear light ring,
MATERIALS) with the bed type. On loading,
PresetCollection::load_external_preset() restores every key not listed in different_settings_to_system from the
installed system preset, so the file only has to carry the names, the structure the loader checks (filament_diameter,
filament_extruder_variant and filament_self_index sized to the filaments, the extruder variants) and the few process
values the box changes for the whole plate (first layer 30 mm/s, avoid crossing walls), listed as different. Checked
against BambuStudio v02.08.02.61's source (Plater.cpp, PresetBundle.cpp, Preset.cpp, bbs_3mf.cpp, PrintConfig.cpp), not
in the slicer itself.

Usage:  python3 hardware/tools/make_3mf.py <version folder> [<file prefix>]
        e.g. python3 hardware/tools/make_3mf.py hardware/stl/gen2/halo-gen2-v26
             python3 hardware/tools/make_3mf.py hardware/stl/gen2-hurtig/halo-gen2-v12-hurtig
Needs:  trimesh, numpy, shapely (the light ring's overhang check)
"""
import json
import sys
import uuid
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

import numpy as np
import trimesh

# file suffix, part name in Bambu Studio, filament slot, colour (only for the 3MF's own colour info)
FRONT_PARTS = [("front", "front (sort)", 1, "#1D1D20"),
               ("logo-hvid", "logo hvid", 2, "#F5F5F4"),
               ("logo-groen", "logo groen", 3, "#22D36B")]
BED_CENTRE = (165.0, 160.0)   # H2C, printable_area 330 x 320 mm
# the left extruder reaches x 0-325 and the right one x 25-330 (extruder_printable_area), so a part with more than one
# filament lies from x = 30, and the prime tower (60 mm, prime_tower_width) stands to its right
BOTH_EXTRUDERS_X = (30.0, 325.0)
PRIME_TOWER = (60.0, 110.0)   # width, y of its front edge

# the filament on each slot of a file: colour (as in the AMS) and Bambu's system preset for it
COLOURS = {"sort": "#1D1D20", "hvid": "#F5F5F4", "groen": "#22D36B", "natur": "#E8E4D8",
           "orange": "#EE3E15"}   # v36: the Airtox Dominance logo's orange-red
BAMBU_VERSION = "02.08.02.61"   # the Bambu Studio whose loader and H2C presets these files are written for
PRINTER = {"printer_settings_id": "Bambu Lab H2C 0.4 nozzle", "printer_model": "Bambu Lab H2C", "printer_variant": "0.4",
           "printer_technology": "FFF", "nozzle_diameter": ["0.4", "0.4"], "extruder_type": ["Direct Drive", "Direct Drive"],
           "nozzle_volume_type": ["Standard", "Standard"],
           "extruder_variant_list": ["Direct Drive Standard,Direct Drive High Flow,Direct Drive E3D High Flow",
                                     "Direct Drive Standard,Direct Drive High Flow"],
           "printer_extruder_variant": ["Direct Drive Standard", "Direct Drive High Flow", "Direct Drive E3D High Flow",
                                        "Direct Drive Standard", "Direct Drive High Flow"],
           "printer_extruder_id": ["1", "1", "1", "2", "2"]}
PROCESS = {"print_settings_id": "0.20mm Standard @BBL H2C",
           "print_extruder_variant": PRINTER["printer_extruder_variant"], "print_extruder_id": PRINTER["printer_extruder_id"]}
# the plate-wide process values the box changes from Bambu's 0.20mm Standard (one value per extruder variant):
# a slow first layer where the first layer is the visible face ("_face_down"), and avoid crossing walls on every part
# (v34: v32/v33 left it off on hidden parts, so the nozzle travelled over the open frame and the ring and left strings)
FACE_DOWN_CHANGES = {"initial_layer_speed": ["30"] * 5, "initial_layer_infill_speed": ["30"] * 5}
ALWAYS_CHANGES = {"reduce_crossing_wall": "1"}
# v34 (28 Oct; Esben: "vi printer alt undtagen diffuseren i PLA"): the filament preset on each slot is the material that is
# really on the spool. v31-v33 named Bambu ASA on every slot while PLA was on the spools: 270 C nozzle, 100 C bed, part fan
# 10-35 % and, on the H2C, chamber_temperatures 65, so the start G-code heats the chamber to 65 C (M141/M191) with the chamber
# fans off. PLA softens at 55-60 C, so as the chamber warmed up the filament swelled in the extruder (heat creep) and the
# prints choked, strung and blobbed late in the print.
# v59 / slim18 (Esben 9 Nov: "vi printer i hvert fald i ASA nu", for acetone smoothing of the outside and more heat; the light
# ring stays in the clear material it has always had): every part is ASA now, so Bambu's own ASA preset is the right one on
# every slot except the ring's. Its 65 C chamber, 270 C, 100 C bed and 10-35 % fan are what ASA wants (Tg ~100 C; the warm
# chamber keeps it from warping and splitting between layers); the heat creep in v31-v33 came from PLA on the spool, not from
# the preset. The ring keeps PETG Translucent (no chamber heat) on its own plate; no file mixes the two (project_settings).
MATERIALS = {
    "PLA": {"filament_settings_id": "Bambu PLA Basic @BBL H2C", "filament_ids": "GFA00", "filament_type": "PLA"},
    "ASA": {"filament_settings_id": "Bambu ASA @BBL H2C", "filament_ids": "GFB01", "filament_type": "ASA"},
    # the clear diffuser (light ring); Bambu's 0.4 mm variant of the preset (the plain one is for the 0.6 nozzle)
    "PETG-T": {"filament_settings_id": "Bambu PETG Translucent @BBL H2C 0.4 nozzle", "filament_ids": "GFG01",
               "filament_type": "PETG"},
}
FILAMENT_COMMON = {"filament_vendor": "Bambu Lab", "filament_diameter": "1.75", "filament_extruder_variant": "Direct Drive Standard"}
COLOUR_MATERIAL = {"sort": "ASA", "hvid": "ASA", "groen": "ASA", "natur": "PETG-T", "orange": "ASA"}
# v59: ASA shrinks more than PLA as it cools (CTE ~90e-6/K from its ~100 C glass point, PLA ~70e-6/K from ~60 C: about
# 0.7 % against 0.3 %). Every fit in the box (the clear PETG ring in the front, the snap, the Wago, PSU, Pi and camera holders,
# the heat-set insert) was tried and tuned on PLA prints, so the ASA parts are scaled up in x and y by Bambu Studio's own
# filament shrinkage compensation (filament_shrink: "94 % if you measure 94 mm instead of 100 mm", the slices are scaled by
# 1/value; PrintObjectSlice.cpp, v02.08.02.61) to come out the size the PLA parts did. The geometry (STL) is not changed.
# Height (z) is not compensated by Bambu; no fit in the box depends on a height within 0.1 mm over its length.
ASA_SHRINK = "99.6%"
FILAMENT_CHANGES = {"ASA": {"filament_shrink": ASA_SHRINK}}
# v59 (Kasper 9 Nov, photos: the fan guard's grille "Asa har det svært med de der små stænger"): the guard prints on its side, so
# its grille is 13 bars of 2.0 x 1.6 mm standing 41 mm up, each layer a row of tiny islands. With Bambu's ASA preset (65 C
# chamber, 270 C, part fan 10-35 %) a bar never cools before the next layer lands on it, so the bars sagged, blobbed and strung
# between each other. For that part only (its own plate): a cooler nozzle, a much stronger part fan and a chamber held at 45 C,
# so each bar sets before the next layer. Geometry and object settings unchanged. Big flat ASA parts keep the preset (65 C
# chamber against warping); the guard is small and has a 3 mm brim.
THIN_BARS_ASA = {"nozzle_temperature": "255", "fan_min_speed": "60", "fan_max_speed": "90", "overhang_fan_speed": "100",
                 "fan_cooling_layer_time": "60", "chamber_temperatures": "45"}
FILAMENT_DEFAULTS = {"filament_shrink": "100%"}   # what a slot without the change gets (the presets' own values below)
# what is actually printed (Esben 9 Nov): ASA, and PETG for the clear diffuser. PLA stays allowed for older releases. A
# PLA/PETG preset must never heat the chamber, and ASA never shares a plate with PLA/PETG (its 65 C chamber, see v34).
PRINTED_TYPES = {"PLA", "PETG", "ASA"}
assert all(m["filament_type"] in PRINTED_TYPES for m in MATERIALS.values()), "only PLA/PETG/ASA presets"
PLATES = {"glat": "High Temp Plate", "tekstureret": "Textured PEI Plate"}   # Bambu's names: smooth PEI, textured PEI


def project_settings(filaments, plate, tower=None, face_down=False, extra=None):
    """Metadata/project_settings.config: the project config Bambu Studio writes (PresetBundle::full_fff_config, keys
    that equal Bambu's own defaults left out; the loader puts them back). filaments: COLOURS keys, slot 1 first."""
    n = len(filaments)
    changes = {**(FACE_DOWN_CHANGES if face_down else {}), **ALWAYS_CHANGES}
    mats = [COLOUR_MATERIAL[f] for f in filaments]
    fil = [{**MATERIALS[m], **FILAMENT_COMMON} for m in mats]
    if any(d["filament_type"] not in PRINTED_TYPES for d in fil):
        raise SystemExit(f"{filaments}: a filament preset that is not PLA/PETG/ASA")
    types = {d["filament_type"] for d in fil}
    if "ASA" in types and types - {"ASA"}:
        raise SystemExit(f"{filaments}: ASA on the same plate as {types - {'ASA'}} (the ASA preset heats the chamber to 65 C)")
    # v59: per filament the keys the box changes from Bambu's preset (filament_shrink for ASA), listed as different so the
    # loader keeps them (PresetBundle::load_config_file_config: different_settings_to_system[1 + slot])
    # extra: per material, filament keys this one file changes on top (THIN_BARS_ASA for the fan guard)
    fch = [{**FILAMENT_CHANGES.get(m, {}), **(extra or {}).get(m, {})} for m in mats]
    fkeys = sorted({k for c in fch for k in c})
    if any(k not in c for c in fch for k in fkeys):
        raise SystemExit(f"{filaments}: the slots change different filament keys ({fkeys}); give every slot the same keys")
    defaults = FILAMENT_DEFAULTS
    cfg = {"version": BAMBU_VERSION, "name": "project_settings", "from": "project", **PRINTER, **PROCESS, **changes,
           **{k: [d[k] for d in fil] for k in fil[0]},
           **{k: [c[k] if k in c else defaults[k] for c in fch] for k in fkeys},
           "filament_colour": [COLOURS[f] for f in filaments], "filament_self_index": [str(i + 1) for i in range(n)],
           "different_settings_to_system": [";".join(sorted(changes))] + [";".join(sorted(c)) for c in fch] + [""],
           "curr_bed_type": PLATES[plate], "flush_multiplier": ["1", "1"],
           "flush_volumes_matrix": [("0" if i == j else "280") for _ in range(2) for i in range(n) for j in range(n)],
           "flush_volumes_vector": ["140"] * (2 * n)}
    if tower:
        cfg["wipe_tower_x"], cfg["wipe_tower_y"] = [f"{tower[0]:g}"], [f"{tower[1]:g}"]
    return json.dumps(cfg, indent=4) + "\n"


def _uuid():
    return str(uuid.uuid4())


def _mesh_xml(oid, mesh, name):
    v = "\n".join(f'     <vertex x="{x:.5f}" y="{y:.5f}" z="{z:.5f}"/>' for x, y, z in mesh.vertices)
    t = "\n".join(f'     <triangle v1="{a}" v2="{b}" v3="{c}"/>' for a, b, c in mesh.faces)
    return (f'  <object id="{oid}" p:UUID="{_uuid()}" type="model" name="{escape(name)}">\n   <mesh>\n    <vertices>\n{v}\n'
            f'    </vertices>\n    <triangles>\n{t}\n    </triangles>\n   </mesh>\n  </object>')


# v26 print settings, per object. Values are Bambu Studio's own option keys and enum values (checked against
# src/libslic3r/PrintConfig.cpp, Oct 2026). Everything else comes from the chosen printer/filament/process profile.
SOLID_FACE = {   # the visible face is the first layer (printed face down): one direction, one outline, no wall rings
    "_face_down": True, "bottom_surface_pattern": "monotonicline", "only_one_wall_first_layer": "1"}
# v36 (Esben 31 Oct, samlenoter 17: an ugly seam line across the underside of the shell and the front, from the power hole to the
# tip; v18, sliced from plain STLs with Bambu's defaults, had none). "back" on the flat underside put every layer's start on one
# straight line across it. The shell and the front now use Bambu's default: "aligned" (the seam goes into a corner or edge of each
# layer), no scarf.
# v42 (Esben 3 Nov: the clear light ring now shows the same line, "den laver samlinger"; it was not there in the early versions):
# the ring, the theme parts and the stand bracket still had "back" + scarf, so they get "aligned" too. No part uses "back" now.
SEAM_ALIGNED = {"seam_position": "aligned", "seam_slope_type": "none"}
NO_SUPPORT = {"enable_support": "0"}
# v33 (Esben 27 Oct: "ikke bruge tid på at få indvendige ting og indersider flotte"): Bambu's own 2 walls and 15 % infill.
# v34 (28 Oct, failed prints): crosshatch instead of grid (grid crosses its own lines in every layer, and the nozzle hits
# the crossings), infill every layer again (infill_combination laid 0.4-0.56 mm thick infill lines that the thin layers
# above drag over), and 4 top layers / at least 0.8 mm: 3 thin layers over 15 % infill sagged between the infill lines and
# curled up, and the nozzle caught them on the last layers of every part
INSIDE = {"wall_loops": "2", "top_shell_layers": "4", "top_shell_thickness": "0.8", "bottom_shell_layers": "3",
          "sparse_infill_density": "15%", "sparse_infill_pattern": "crosshatch", "infill_combination": "0"}
SETTINGS = {
    # v33: only what is seen from outside is printed for looks: 0.2 mm layers on the shell, front and theme parts (they
    # match), the visible face (first layer) slow and in one direction, the aligned seam and avoid crossing walls on the outside.
    # Parts inside the box or behind it ("_visible": False) get 0.28 mm and Bambu's own seam and first layer (v34: and
    # avoid crossing walls like the rest).
    # front: 0.2 so the logo is exactly the first 4 layers; 0.15 elephant foot so the 0.15 shadow gap stays open;
    # 4 bottom layers under the visible face, its back is inside the box
    "front": {"layer_height": "0.2", **INSIDE, "bottom_shell_layers": "4", "elefant_foot_compensation": "0.15",
              "brim_type": "no_brim", **SOLID_FACE, **SEAM_ALIGNED, **NO_SUPPORT},
    # light ring: solid. v26-v41 ran every line round the ring (concentric) for an even light, but each concentric ring
    # starts and stops at the same place as the one beside it, so with the "back" seam the starts lay in one line across the
    # clear ring, through the face and up the edge (Esben 3 Nov, photo). v42: Bambu's own patterns (monotonic face, as v18,
    # which had no such line) and the "aligned" seam.
    # v35 printed the flange on support (a solid PLA interface on slot 2): it came out jagged, ~5 mm wider and with a rough
    # face, and would not go in (Esben 31 Oct). v36 has v18's section again, where nothing is flatter than 45 deg, so it
    # prints with no support at all, like v18; lysring_3mf checks that every layer stands on the one below.
    "lysring": {"_face_down": True, "layer_height": "0.16", "wall_loops": "3", "sparse_infill_density": "100%",
                "elefant_foot_compensation": "0.15", "brim_type": "no_brim", **SEAM_ALIGNED, **NO_SUPPORT},
    # frame: inside the box; the reflector's steps at 0.28 are behind the 1 mm diffuser
    "bagramme": {"_visible": False, "layer_height": "0.28", **INSIDE, **NO_SUPPORT},
    # shell: the sides are seen, so 0.2 like the front; its back lies on the plate (to the wall, not seen), so Bambu's
    # first layer. Support only at its 2 enforcers (tree, manual, also from the model), 3 mm brim against corner lift
    "skal": {"layer_height": "0.2", **INSIDE, "enable_support": "1", "support_type": "tree(manual)",
             "support_on_build_plate_only": "0", "brim_type": "outer_only", "brim_width": "3", **SEAM_ALIGNED},
    # wall cleat: behind the box and carries it: 3 walls and 40 % gyroid round the tongues
    "vaegbeslag": {"_visible": False, "layer_height": "0.28", **INSIDE, "wall_loops": "3",
                   "sparse_infill_density": "40%", "sparse_infill_pattern": "gyroid", "infill_combination": "0",
                   **NO_SUPPORT},
    "kameraroer": {"layer_height": "0.16", "sparse_infill_density": "100%", **NO_SUPPORT},
    # v29: the Wago row on its own, for a v24-v28 shell (its end wall on the plate, every wall straight up)
    "wagoraekke": {"_visible": False, "layer_height": "0.28", **INSIDE, **NO_SUPPORT},
    # slim1: the Pi's carrier, inside the box, its front face on the plate, bosses and ears straight up
    "piholder": {"_visible": False, "layer_height": "0.2", **INSIDE, "wall_loops": "3", **NO_SUPPORT},
    # v53: the Wago holders for the strips' leads, on their side like the fan guard (arms, floor, teeth and lips straight up)
    "wagoholder": {"_visible": False, "layer_height": "0.2", **INSIDE, "wall_loops": "3", "brim_type": "outer_only", "brim_width": "3",
                   **NO_SUPPORT},
    "blaeserhegn": {"_visible": False, "layer_height": "0.2", **INSIDE, "brim_type": "outer_only", "brim_width": "3",
                    **NO_SUPPORT},
    # theme parts: face down too (their back lies against the box); tree support (auto) under the straps
    "tema": {"layer_height": "0.2", **INSIDE, "bottom_shell_layers": "4", "enable_support": "1",
             "support_type": "tree(auto)", **SOLID_FACE, **SEAM_ALIGNED},
    # printer hood and exit module (selfi-printer-v5): stood on an end, logo and text on the vertical front. Its panels
    # are 3.2 mm, so they are solid with 4 walls as with 8 (v32 review: 2 % faster at most, not changed)
    "printerkappe": {"layer_height": "0.2", "wall_loops": "8", "sparse_infill_density": "15%", **NO_SUPPORT},
    # stand bracket: carries the whole box; the logo panel lies on the plate. v6: 3 walls, 30 % gyroid; v7: 4 top layers
    # (3 sagged over the infill, see INSIDE)
    "stativbeslag": {"layer_height": "0.2", "wall_loops": "3", "top_shell_layers": "4", "top_shell_thickness": "0.8",
                     "bottom_shell_layers": "4", "sparse_infill_density": "30%", "sparse_infill_pattern": "gyroid",
                     **SOLID_FACE, **SEAM_ALIGNED, **NO_SUPPORT},
}
TURN = np.diag([-1.0, -1.0, 1.0])   # 180 degrees on the plate: the box's underside to +y (Bambu's "back" seam)


def write_bambu_3mf(path, parts, object_name, settings=None, turn=False, filaments=("sort",), plate="glat", extra=None):
    """parts: list of (name, trimesh.Trimesh, filament slot[, subtype]). All meshes in one shared coordinate system;
    the object is moved as a whole so it sits on the plate (z = 0) in the middle of the bed. subtype is Bambu Studio's
    part type: "normal_part" (default), or "support_enforcer" / "support_blocker" for a support modifier volume.
    settings: the object's own print settings ({Bambu option key: value}); turn: 180 degrees round z on the plate.
    filaments: the colour on each slot (COLOURS keys, slot 1 first); plate: "glat" or "tekstureret" (PLATES).
    With more than one filament the object lies from x = 30 with the prime tower to its right (BOTH_EXTRUDERS_X)."""
    dx, tower = 0.0, None
    if len(filaments) > 1:
        solid = [m for _, m, _, *kind in parts if not kind or kind[0] == "normal_part"]   # v37: not the modifier volumes
        width = max(m.bounds[1][0] for m in solid) - min(m.bounds[0][0] for m in solid)
        x0, x1 = BOTH_EXTRUDERS_X
        if x0 + width + 10 + PRIME_TOWER[0] <= x1:
            dx = x0 + width / 2 - BED_CENTRE[0]
            tower = (x0 + width + 10, PRIME_TOWER[1])
    write_bambu_objects(path, [(object_name, parts, settings or {}, (dx, 0.0), turn)], filaments, plate, tower, extra)


# Esben 5 Nov: nothing may show on the outside, no seams ("samlinger") and no odd settings. Bambu Studio 2.8 splits a layer into
# separate wall regions wherever a modifier volume changes any of these (src/libslic3r/Layer.cpp,
# Layer::has_compatible_layer_regions, v02.08.02.61), and each region gets its own outer wall, which leaves a line on the
# part's outside at the modifier's faces. So a modifier may change infill, never these; check_seams() refuses the file.
WALL_KEYS = {"wall_filament", "wall_loops", "wall_sequence", "inner_wall_speed", "outer_wall_speed", "gap_infill_speed",
             "bridge_speed", "detect_overhang_wall", "filter_out_gap_fill", "inner_wall_line_width",
             "outer_wall_line_width", "detect_thin_wall", "infill_wall_overlap", "override_filament_scarf_seam_setting",
             "seam_slope_type", "seam_slope_start_height", "seam_slope_gap", "seam_slope_min_length",
             "seam_slope_conditional", "seam_slope_entire_loop", "seam_slope_steps", "seam_slope_inner_walls",
             "initial_layer_flow_ratio", "seam_position"}


def check_seams(object_name, settings, parts):
    """Refuse what puts seams or lines on a part's outside: a modifier volume that changes the walls (WALL_KEYS), the
    "back" seam (v36/v42: one straight line of seams across the part) and a scarf seam."""
    bad = [f"{n}: {k}" for n, _, _, kind, own in parts if kind == "modifier_part" for k in own if k in WALL_KEYS]
    if settings.get("seam_position") == "back":
        bad.append("seam_position back")
    if settings.get("seam_slope_type", "none") != "none":
        bad.append(f"seam_slope_type {settings['seam_slope_type']}")
    if bad:
        raise SystemExit(f"{object_name}: would print seams on the outside ({'; '.join(bad)}); see make_3mf.WALL_KEYS")


def write_bambu_objects(path, objects, filaments=("sort",), plate="glat", tower=None, extra=None):
    """objects: list of (name, parts, settings, (dx, dy) from the bed centre, turn). One plate, each object as in
    write_bambu_3mf; tower: (x, y) of the prime tower or None for Bambu's default. The settings key "_face_down"
    (default False) on any object turns on FACE_DOWN_CHANGES for the plate ("_visible" only documents the part)."""
    face_down = any(st.get("_face_down", False) for _, _, st, _, _ in objects)
    ns = ('xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" '
          'xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" '
          'xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p"')
    head = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<model unit="millimeter" xml:lang="en-US" {ns}>\n'
            ' <metadata name="BambuStudio:3mfVersion">1</metadata>\n')
    # what Bambu Studio writes in the main model; "Application" is what makes the loader read the file as its own project
    meta = {"Application": f"BambuStudio-{BAMBU_VERSION}", "Title": Path(path).stem, "Designer": "Selfi",
            "CreationDate": "2026-10-27", "ModificationDate": "2026-10-27"}
    main_head = head + "".join(f' <metadata name="{k}">{escape(v)}</metadata>\n' for k, v in meta.items())
    meshes, items, assemble, instances = [], [], [], []
    cfg = ['<?xml version="1.0" encoding="UTF-8"?>', "<config>"]
    files, main_objs, nid = {}, [], 0
    for k, (object_name, parts, settings, (dx, dy), turn) in enumerate(objects):
        parts = [tuple(q) + (("normal_part", {})[len(q) - 3:]) for q in parts]
        check_seams(object_name, settings, parts)
        solid = [m for _, m, _, kind, _ in parts if kind == "normal_part"]   # modifiers never move the object
        lo = np.min([m.bounds[0] for m in solid], axis=0)
        hi = np.max([m.bounds[1] for m in solid], axis=0)
        shift = np.array([-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]])
        ids = list(range(nid + 1, nid + len(parts) + 1))
        nid += len(parts) + 1
        obj = nid
        sub_path = f"/3D/Objects/object_{k + 1}.model"
        files[sub_path[1:]] = head + " <resources>\n" + "\n".join(
            _mesh_xml(i, m.copy().apply_translation(shift), n) for i, (n, m, *_) in zip(ids, parts)) + \
            "\n </resources>\n <build/>\n</model>\n"
        meshes.append(sub_path)
        comps = "\n".join(f'    <component p:path="{sub_path}" objectid="{i}" p:UUID="{_uuid()}" '
                          'transform="1 0 0 0 1 0 0 0 1 0 0 0"/>' for i in ids)
        main_objs.append(f'  <object id="{obj}" p:UUID="{_uuid()}" type="model">\n   <components>\n{comps}\n'
                         '   </components>\n  </object>')
        r = TURN if turn else np.eye(3)
        tr = " ".join(f"{v:g}" for v in r.T.flatten()) + f" {BED_CENTRE[0] + dx:g} {BED_CENTRE[1] + dy:g} 0"
        items.append(f'  <item objectid="{obj}" p:UUID="{_uuid()}" transform="{tr}" printable="1"/>')
        cfg += [f'  <object id="{obj}">', f'    <metadata key="name" value="{escape(object_name)}"/>',
                '    <metadata key="extruder" value="1"/>']
        cfg += [f'    <metadata key="{key}" value="{escape(v)}"/>' for key, v in settings.items() if not key.startswith("_")]
        for i, (n, m, slot, kind, own) in zip(ids, parts):
            cfg += [f'    <part id="{i}" subtype="{kind}">', f'      <metadata key="name" value="{escape(n)}"/>',
                    '      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>',
                    f'      <metadata key="extruder" value="{slot}"/>'] + \
                   [f'      <metadata key="{key}" value="{escape(v)}"/>' for key, v in own.items()] + [
                    f'      <mesh_stat face_count="{len(m.faces)}" edges_fixed="0" degenerate_facets="0" '
                    'facets_removed="0" facets_reversed="0" backwards_edges="0"/>', "    </part>"]
        cfg.append("  </object>")
        instances += ["    <model_instance>", f'      <metadata key="object_id" value="{obj}"/>',
                  '      <metadata key="instance_id" value="0"/>', f'      <metadata key="identify_id" value="{1000 + obj}"/>',
                  "    </model_instance>"]
        assemble.append(f'   <assemble_item object_id="{obj}" instance_id="0" transform="{tr}" offset="0 0 0" />')
    cfg += ["  <plate>", '    <metadata key="plater_id" value="1"/>', '    <metadata key="plater_name" value=""/>',
            '    <metadata key="locked" value="false"/>', f'    <metadata key="bed_type" value="{PLATES[plate]}"/>'] + \
        instances + ["  </plate>", "  <assemble>"] + assemble + ["  </assemble>", "</config>", ""]
    main = main_head + " <resources>\n" + "\n".join(main_objs) + f'\n </resources>\n <build p:UUID="{_uuid()}">\n' + \
        "\n".join(items) + "\n </build>\n</model>\n"
    rels = "".join(f' <Relationship Target="{s}" Id="rel-{i + 1}" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n'
                   for i, s in enumerate(meshes))
    out = {
        "[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n'
        ' <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n'
        ' <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>\n'
        ' <Default Extension="config" ContentType="text/xml"/>\n</Types>\n',
        "_rels/.rels": '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
        ' <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n</Relationships>\n',
        "3D/_rels/3dmodel.model.rels": '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
        + rels + '</Relationships>\n',
        "3D/3dmodel.model": main,
        **files,
        "Metadata/model_settings.config": "\n".join(cfg),
        "Metadata/project_settings.config": project_settings(filaments, plate, tower, face_down, extra),
    }
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, text in out.items():
            z.writestr(zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0)), text, zipfile.ZIP_DEFLATED)


def front_3mf(folder, prefix=None):
    folder = Path(folder)
    prefix = prefix or folder.name
    parts = [(name, trimesh.load(folder / f"{prefix}_{suffix}.stl"), slot) for suffix, name, slot, _ in FRONT_PARTS]
    out = folder / f"{prefix}_front_flerfarvet.3mf"
    write_bambu_3mf(out, parts, f"{prefix}_front", SETTINGS["front"], filaments=("sort", "hvid", "groen"),
                    plate="tekstureret")
    return out


# v26 (print review 27 Oct): the shell as a 3MF with its support already decided, so the slicer puts support only where the
# shell needs it. Printed back face down, two places have a flat roof that cannot be bridged: the recess for the cleat's bar
# at the top of the back (120 x 33, 9 mm up, from the plate) and the dimmer tray's front wall on the left wall (an 18 mm
# shelf 35 mm up, from the back wall inside, so "on build plate only" must be off). Enforcers cover those two; with
# support type Tree (manual) Bambu Studio puts support there and nowhere else. Blockers keep the places that print without
# support clean even if the type is left on auto: the power column (teardrop bores, v24), the 2 lock pockets (16 and 10 mm
# bridges; support left in a slot with 0.2 mm play stops the tongue) and the 4 wing pockets (7 mm bridges).
# Boxes in the shell's print coordinates (as in <version>_skal.stl): x, y on the bed, z up; [x0, x1, y0, y1, z0, z1].
SKAL_ENFORCE = [("support: skinnens udsparing", [-59.5, 59.5, 97.0, 129.0, 7.5, 9.5]),
                ("support: dæmperbakkens forvæg", [-108.0, -90.0, -89.8, -45.5, 33.0, 36.0])]
# v36: no blocker at the power inlet: its open channel has no roof left (only the 0.8 mm catch lips), and the bore is a teardrop
SKAL_BLOCK = [("ingen support: låselomme venstre", [-91.6, -72.4, -153.5, -116.3, 0.0, 16.6]),
              ("ingen support: låselomme højre", [77.4, 90.6, -153.5, -116.3, 0.0, 16.6])] + \
             [(f"ingen support: vingelomme {i + 1}", [x0, x0 + 10.2, y0, y0 + 19.8, 0.0, 10.1])
              for i, (x0, y0) in enumerate([(-105.35, 13.1), (-105.35, 78.3), (95.15, 13.1), (95.15, 78.3)])]


def _box(b):
    x0, x1, y0, y1, z0, z1 = b
    return trimesh.creation.box(bounds=[[x0, y0, z0], [x1, y1, z1]])


# v37-v56 had a modifier volume with 4 walls and 40 % infill in each of the 4 corners of the shell and the front (drop
# strength). Removed (Esben 5 Nov, photos: "6-8 samlinger i skallen"; v18 had none): a modifier that changes the walls
# makes Bambu Studio slice the part as separate wall regions (Layer::has_compatible_layer_regions, see WALL_KEYS), so
# the outer wall is broken off at each of the box's 2 faces through the wall, layer after layer, and shows as a line
# where the corner's curve starts (35 mm in from each edge, 8 lines on the shell, 8 on the front).


def skal_3mf(folder, prefix=None):
    """<prefix>_skal_support.3mf: the shell with the support enforcers and blockers above, each box checked against the
    shell's own downward faces (an enforcer must hold a flat roof, a blocker the roofs it keeps clean)."""
    folder = Path(folder)
    prefix = prefix or folder.name
    skal = trimesh.load(folder / f"{prefix}_skal.stl")
    down = (skal.face_normals[:, 2] < -0.9) & (skal.triangles_center[:, 2] > 0.5)
    # slim1: the dimmer lies flat on the back wall, so there is no dimmer tray and no front wall to hold up
    enforce = [e for e in SKAL_ENFORCE if not (prefix.startswith("halo-gen2-slim") and e[0] == "support: dæmperbakkens forvæg")]
    for name, b in enforce + SKAL_BLOCK:
        c = skal.triangles_center
        inside = down & np.all((c >= [b[0], b[2], b[4]]) & (c <= [b[1], b[3], b[5]]), axis=1)
        area = skal.area_faces[inside].sum()
        if area < 20:
            raise SystemExit(f"{name}: only {area:.1f} mm2 of roof inside {b}; the shell has moved, fix the box")
    parts = [("skal", skal, 1, "normal_part")]
    parts += [(n, _box(b), 1, "support_enforcer") for n, b in enforce]
    parts += [(n, _box(b), 1, "support_blocker") for n, b in SKAL_BLOCK]
    out = folder / f"{prefix}_skal_support.3mf"
    write_bambu_3mf(out, parts, f"{prefix}_skal", SETTINGS["skal"], turn=True, filaments=("sort",))
    return out


# v36: the light ring prints with no support (see SETTINGS["lysring"]), so no layer may reach past the one below by more
# than a 45 deg step (one 0.16 layer) plus a little: OVERHANG_MAX. v35's flat flange reached 2.25.
OVERHANG_MAX = 0.3


def overhang_check(mesh, name, layer=0.16, reach=OVERHANG_MAX):
    """Slice mesh (in print orientation) every layer and fail if any layer reaches more than reach past the layer below:
    the area of (layer - (layer below grown by reach)) must be ~0."""
    from shapely.geometry import Polygon
    from shapely.ops import unary_union

    def section(z):
        s = mesh.section(plane_origin=[0, 0, z], plane_normal=[0, 0, 1])
        if s is None:
            return Polygon()
        planar, _ = s.to_planar(to_2D=np.eye(4))
        return unary_union(list(planar.polygons_full))

    zs = np.arange(layer / 2, mesh.bounds[1][2], layer)
    below = section(zs[0])
    for z in zs[1:]:
        cur = section(z)
        bad = cur.difference(below.buffer(reach)).area
        if bad > 0.5:
            raise SystemExit(f"{name}: {bad:.1f} mm2 of the layer at z {z:.2f} hangs more than {reach} mm past the one below")
        below = cur


def lysring_3mf(folder, prefix=None):
    """<prefix>_lysring.3mf: the clear ring on its own, no support; checked for overhangs first (overhang_check)."""
    folder = Path(folder)
    prefix = prefix or folder.name
    ring = trimesh.load(folder / f"{prefix}_lysring.stl")
    overhang_check(ring, f"{prefix}_lysring")
    out = folder / f"{prefix}_lysring.3mf"
    write_bambu_3mf(out, [("lysring", ring, 1)], f"{prefix}_lysring", SETTINGS["lysring"], filaments=("natur",),
                    plate="tekstureret")
    return out


# the other parts: (file suffix, settings, turn, filament, plate); the frame lies like the shell (box underside at -y), so
# it is turned too. The light ring (the clear diffuser, PETG Translucent, COLOUR_MATERIAL "natur") has its own lysring_3mf.
SINGLE = [("bagramme", "bagramme", True, "hvid", "glat"),
          ("vaegbeslag", "vaegbeslag", False, "sort", "glat"), ("tema-top-eksempel", "tema", False, "sort", "glat"),
          ("tema-vinge-venstre-eksempel", "tema", False, "sort", "glat"),
          ("tema-vinge-hoejre-eksempel", "tema", False, "sort", "glat"),
          ("wagoraekke-eftermontering", "wagoraekke", False, "sort", "glat"),
          ("pi-holder", "piholder", False, "sort", "glat")]   # slim1 (v53-v54 also the two wagoholder-*; v55: in the frame)


def stand_3mf(folder, prefix=None):
    """v36: <prefix>_stativbeslag_flerfarvet.3mf, the stand bracket with its logo inlays (black, white, green), as in
    make_stativbeslag.py. The stand bracket is part of every gen 2 print package from v36 (Esben 31 Oct)."""
    folder = Path(folder)
    prefix = prefix or folder.name
    parts = [(name, trimesh.load(folder / f"{prefix}_{suffix}.stl"), slot) for suffix, name, slot in
             (("stativbeslag", "stativbeslag (sort)", 1), ("stativbeslag_logo-hvid", "logo hvid", 2),
              ("stativbeslag_logo-groen", "logo groen", 3))]
    # v37 (selfi-stativbeslag-v9): the shelf and the foot of the spine carry the box on the ball head; with the heat-set insert
    # they print solid (100 % infill), so the insert's knurls melt into solid plastic and the shelf cannot flex. v37-v56 also
    # gave it 6 walls, which cut the bracket's outer wall at the box's sides (x = +-25); infill only keeps one wall (WALL_KEYS)
    lo, hi = parts[0][1].bounds   # the modifier stays inside the bracket's own box
    b = np.clip(trimesh.load(folder / f"{prefix}_stativbeslag_forstaerkning.stl").bounds, lo, hi)
    parts.append(("forstærkning: hylde og gevindindsats", _box([b[0][0], b[1][0], b[0][1], b[1][1], b[0][2], b[1][2]]), 1,
                  "modifier_part", {"sparse_infill_density": "100%"}))   # v57: infill only, see WALL_KEYS
    out = folder / f"{prefix}_stativbeslag_flerfarvet.3mf"
    write_bambu_3mf(out, parts, f"{prefix}_stativbeslag", SETTINGS["stativbeslag"], filaments=("sort", "hvid", "groen"),
                    plate="tekstureret")
    return out


def dominance_3mfs(folder, prefix=None):
    """v36: <prefix>_tema-dominance-<part>_flerfarvet.3mf for the Airtox Dominance theme kit (top, left and right post), each
    with its white and orange inlays: AMS 1 sort, 2 hvid, 3 orange; face down like every theme part (SETTINGS["tema"])."""
    folder = Path(folder)
    prefix = prefix or folder.name
    outs = []
    for part in ("top", "stolpe-venstre", "stolpe-hoejre"):
        base = folder / f"{prefix}_tema-dominance-{part}"
        if not base.with_suffix(".stl").exists():
            continue
        parts = [(f"dominance {part} (sort)", trimesh.load(base.with_suffix(".stl")), 1),
                 ("hvid", trimesh.load(f"{base}_hvid.stl"), 2), ("orange", trimesh.load(f"{base}_orange.stl"), 3)]
        outs.append(Path(f"{base}_flerfarvet.3mf"))
        write_bambu_3mf(outs[-1], parts, base.name, SETTINGS["tema"], filaments=("sort", "hvid", "orange"), plate="glat")
    return outs


def part_3mfs(folder, prefix=None):
    """<prefix>_<part>.3mf for each part in SINGLE that the release has, and the fan guard: on its own (v27, which has no
    camera sleeve) or, in a release with the sleeve (v24-v26), <prefix>_smaadele.3mf with both small black parts on one
    plate, 40 mm apart."""
    folder = Path(folder)
    prefix = prefix or folder.name
    outs = []
    if (folder / f"{prefix}_lysring.stl").exists():
        outs.append(lysring_3mf(folder, prefix))
    if (folder / f"{prefix}_stativbeslag.stl").exists():
        outs.append(stand_3mf(folder, prefix))
    outs += dominance_3mfs(folder, prefix)
    for suffix, key, turn, colour, plate in SINGLE:
        stl = folder / f"{prefix}_{suffix}.stl"
        if stl.exists():
            outs.append(folder / f"{prefix}_{suffix}.3mf")
            write_bambu_3mf(outs[-1], [(suffix, trimesh.load(stl), 1)], f"{prefix}_{suffix}", SETTINGS[key], turn,
                            filaments=(colour,), plate=plate)
    small = [(s, folder / f"{prefix}_{s}.stl") for s in ("blaeserhegn", "kameraroer")]
    if small[0][1].exists() and not small[1][1].exists():
        outs.append(folder / f"{prefix}_blaeserhegn.3mf")
        write_bambu_3mf(outs[-1], [("blaeserhegn", trimesh.load(small[0][1]), 1)], f"{prefix}_blaeserhegn", SETTINGS["blaeserhegn"],
                        extra={"ASA": THIN_BARS_ASA})   # v59: the grille's thin bars (THIN_BARS_ASA)
    elif all(p.exists() for _, p in small):
        outs.append(folder / f"{prefix}_smaadele.3mf")
        write_bambu_objects(outs[-1], [(f"{prefix}_{s}", [(s, trimesh.load(p), 1)], SETTINGS[s], (0.0, 20.0 - 40.0*i), False)
                                       for i, (s, p) in enumerate(small)])
    return outs


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    folder, prefix = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None
    print(front_3mf(folder, prefix))
    if Path(folder, f"{prefix or Path(folder).name}_skal.stl").exists():
        print(skal_3mf(folder, prefix))
    for o in part_3mfs(folder, prefix):
        print(o)
