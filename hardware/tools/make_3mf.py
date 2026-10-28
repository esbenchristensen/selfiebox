#!/usr/bin/env python3
"""Bambu Studio project files for every printed part of a gen 2 release, each with its print settings inside.

v26 print settings (Esben 27 Oct, second round: "the best possible settings for a clean result without faults, that looks moulded but
is durable"): every part now has its own 3MF with the object's settings already set (layer height, walls, infill, the
first-layer pattern of the visible face, scarf seam, support, brim), so a print looks the same from box to box and does
not depend on what was last chosen in Bambu Studio. Only object-level settings are written (Bambu Studio's
PrintObjectConfig / PrintRegionConfig keys, as <metadata> on the object in Metadata/model_settings.config, which the
loader passes to the object's config). Since the third round the files also name the printer, process and filament presets and the
plate (see below); temperatures and the rest stay Bambu's own presets.

  <version>_front_flerfarvet.3mf  the black front with the logo inlays (white and green) in its 0.8 mm recess, as ONE
                                  object with three parts on slots 1 sort / 2 hvid / 3 groen
  <version>_skal_support.3mf      the shell with its support enforcers and blockers (v26, see skal_3mf below)
  <version>_lysring.3mf, _bagramme.3mf, _vaegbeslag.3mf, _blaeserhegn.3mf (v27; v26 had _smaadele.3mf with the camera
  sleeve and the fan guard on one plate), _tema-*.3mf   one object each, settings inside

Seams: Bambu's "back" seam goes to the part's rear (+y on the plate). Every part is placed so that +y is the box's
underside (the front and the ring already lie that way; the shell and the frame are turned 180 degrees on the plate),
so what is left of a seam ends up under the box, and it is a scarf seam on the outer contour.

Bambu projects (27 Oct, third round; Esben: "vi kan ikke loade de configs der er i 3mf filerne"): until then the files had no project
config, so Bambu Studio 2.8.2 said "The 3mf file has invalid config, load geometry data only" and reset every object's
settings (Plater::priv::load_files: a config without a Bambu printer_model or nozzle_diameter is invalid, and with
load_config off the objects' configs are reset, only the extruder is kept). Now every file is a Bambu Studio project:
Application "BambuStudio-<version>" in the model and Metadata/project_settings.config naming Bambu's own system presets
(Bambu Lab H2C 0.4 nozzle, 0.20mm Standard @BBL H2C, and per filament slot the material on the spool: Bambu PLA Basic,
PETG Translucent for the clear light ring, MATERIALS; v31-v33 said Bambu ASA) with the bed type. On loading,
PresetCollection::load_external_preset() restores every key not listed in different_settings_to_system from the
installed system preset, so the file only has to carry the names, the structure the loader checks (filament_diameter,
filament_extruder_variant and filament_self_index sized to the filaments, the extruder variants) and the few process
values the box changes for the whole plate (first layer 30 mm/s, avoid crossing walls), listed as different. Checked
against BambuStudio v02.08.02.61's source (Plater.cpp, PresetBundle.cpp, Preset.cpp, bbs_3mf.cpp, PrintConfig.cpp), not
in the slicer itself.

Usage:  python3 hardware/tools/make_3mf.py <version folder> [<file prefix>]
        e.g. python3 hardware/tools/make_3mf.py hardware/stl/gen2/halo-gen2-v26
             python3 hardware/tools/make_3mf.py hardware/stl/gen2-hurtig/halo-gen2-v12-hurtig
Needs:  trimesh, numpy
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
COLOURS = {"sort": "#1D1D20", "hvid": "#F5F5F4", "groen": "#22D36B", "natur": "#E8E4D8"}
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
# really on the spool. v31-v33 named Bambu ASA on every slot: 270 C nozzle, 100 C bed, part fan 10-35 % and, on the H2C,
# chamber_temperatures 65, so the start G-code heats the chamber to 65 C (M141/M191) with the chamber fans off. PLA softens
# at 55-60 C, so as the chamber warmed up the filament swelled in the extruder (heat creep) and the prints choked, strung
# and blobbed late in the print. PLA Basic and PETG Translucent keep the chamber unheated (H2C chamber auto-cooling).
MATERIALS = {
    "PLA": {"filament_settings_id": "Bambu PLA Basic @BBL H2C", "filament_ids": "GFA00", "filament_type": "PLA"},
    # the clear diffuser (light ring); Bambu's 0.4 mm variant of the preset (the plain one is for the 0.6 nozzle)
    "PETG-T": {"filament_settings_id": "Bambu PETG Translucent @BBL H2C 0.4 nozzle", "filament_ids": "GFG01",
               "filament_type": "PETG"},
}
FILAMENT_COMMON = {"filament_vendor": "Bambu Lab", "filament_diameter": "1.75", "filament_extruder_variant": "Direct Drive Standard"}
COLOUR_MATERIAL = {"sort": "PLA", "hvid": "PLA", "groen": "PLA", "natur": "PETG-T"}
PLATES = {"glat": "High Temp Plate", "tekstureret": "Textured PEI Plate"}   # Bambu's names: smooth PEI, textured PEI


def project_settings(filaments, plate, tower=None, face_down=False):
    """Metadata/project_settings.config: the project config Bambu Studio writes (PresetBundle::full_fff_config, keys
    that equal Bambu's own defaults left out; the loader puts them back). filaments: COLOURS keys, slot 1 first."""
    n = len(filaments)
    changes = {**(FACE_DOWN_CHANGES if face_down else {}), **ALWAYS_CHANGES}
    fil = [{**MATERIALS[COLOUR_MATERIAL[f]], **FILAMENT_COMMON} for f in filaments]
    cfg = {"version": BAMBU_VERSION, "name": "project_settings", "from": "project", **PRINTER, **PROCESS, **changes,
           **{k: [d[k] for d in fil] for k in fil[0]},
           "filament_colour": [COLOURS[f] for f in filaments], "filament_self_index": [str(i + 1) for i in range(n)],
           "different_settings_to_system": [";".join(sorted(changes))] + [""] * (n + 1),
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
SEAM = {"seam_position": "back", "seam_slope_type": "external"}   # scarf seam on the outer contour, at the box's underside
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
    # match), the visible face (first layer) slow and in one direction, scarf seam and avoid crossing walls on the outside.
    # Parts inside the box or behind it ("_visible": False) get 0.28 mm and Bambu's own seam and first layer (v34: and
    # avoid crossing walls like the rest).
    # front: 0.2 so the logo is exactly the first 4 layers; 0.15 elephant foot so the 0.15 shadow gap stays open;
    # 4 bottom layers under the visible face, its back is inside the box
    "front": {"layer_height": "0.2", **INSIDE, "bottom_shell_layers": "4", "elefant_foot_compensation": "0.15",
              "brim_type": "no_brim", **SOLID_FACE, **SEAM, **NO_SUPPORT},
    # light ring: solid, and every line runs round the ring (concentric), so the light through it is even, without stripes
    "lysring": {"_face_down": True, "layer_height": "0.16", "wall_loops": "3", "sparse_infill_density": "100%",
                "bottom_surface_pattern": "concentric", "top_surface_pattern": "concentric",
                "internal_solid_infill_pattern": "concentric", "elefant_foot_compensation": "0.15", "brim_type": "no_brim",
                **SEAM, **NO_SUPPORT},
    # frame: inside the box; the reflector's steps at 0.28 are behind the 1 mm diffuser
    "bagramme": {"_visible": False, "layer_height": "0.28", **INSIDE, **NO_SUPPORT},
    # shell: the sides are seen, so 0.2 like the front; its back lies on the plate (to the wall, not seen), so Bambu's
    # first layer. Support only at its 2 enforcers (tree, manual, also from the model), 3 mm brim against corner lift
    "skal": {"layer_height": "0.2", **INSIDE, "enable_support": "1", "support_type": "tree(manual)",
             "support_on_build_plate_only": "0", "brim_type": "outer_only", "brim_width": "3", **SEAM},
    # wall cleat: behind the box and carries it: 3 walls and 40 % gyroid round the tongues
    "vaegbeslag": {"_visible": False, "layer_height": "0.28", **INSIDE, "wall_loops": "3",
                   "sparse_infill_density": "40%", "sparse_infill_pattern": "gyroid", "infill_combination": "0",
                   **NO_SUPPORT},
    "kameraroer": {"layer_height": "0.16", "sparse_infill_density": "100%", **NO_SUPPORT},
    # v29: the Wago row on its own, for a v24-v28 shell (its end wall on the plate, every wall straight up)
    "wagoraekke": {"_visible": False, "layer_height": "0.28", **INSIDE, **NO_SUPPORT},
    "blaeserhegn": {"_visible": False, "layer_height": "0.2", **INSIDE, "brim_type": "outer_only", "brim_width": "3",
                    **NO_SUPPORT},
    # theme parts: face down too (their back lies against the box); tree support (auto) under the straps
    "tema": {"layer_height": "0.2", **INSIDE, "bottom_shell_layers": "4", "enable_support": "1",
             "support_type": "tree(auto)", **SOLID_FACE, **SEAM},
    # printer hood and exit module (selfi-printer-v5): stood on an end, logo and text on the vertical front. Its panels
    # are 3.2 mm, so they are solid with 4 walls as with 8 (v32 review: 2 % faster at most, not changed)
    "printerkappe": {"layer_height": "0.2", "wall_loops": "8", "sparse_infill_density": "15%", **NO_SUPPORT},
    # stand bracket: carries the whole box; the logo panel lies on the plate. v6: 3 walls, 30 % gyroid; v7: 4 top layers
    # (3 sagged over the infill, see INSIDE)
    "stativbeslag": {"layer_height": "0.2", "wall_loops": "3", "top_shell_layers": "4", "top_shell_thickness": "0.8",
                     "bottom_shell_layers": "4", "sparse_infill_density": "30%", "sparse_infill_pattern": "gyroid",
                     **SOLID_FACE, **SEAM, **NO_SUPPORT},
}
TURN = np.diag([-1.0, -1.0, 1.0])   # 180 degrees on the plate: the box's underside to +y (Bambu's "back" seam)


def write_bambu_3mf(path, parts, object_name, settings=None, turn=False, filaments=("sort",), plate="glat"):
    """parts: list of (name, trimesh.Trimesh, filament slot[, subtype]). All meshes in one shared coordinate system;
    the object is moved as a whole so it sits on the plate (z = 0) in the middle of the bed. subtype is Bambu Studio's
    part type: "normal_part" (default), or "support_enforcer" / "support_blocker" for a support modifier volume.
    settings: the object's own print settings ({Bambu option key: value}); turn: 180 degrees round z on the plate.
    filaments: the colour on each slot (COLOURS keys, slot 1 first); plate: "glat" or "tekstureret" (PLATES).
    With more than one filament the object lies from x = 30 with the prime tower to its right (BOTH_EXTRUDERS_X)."""
    dx, tower = 0.0, None
    if len(filaments) > 1:
        width = max(m.bounds[1][0] for _, m, *_ in parts) - min(m.bounds[0][0] for _, m, *_ in parts)
        x0, x1 = BOTH_EXTRUDERS_X
        if x0 + width + 10 + PRIME_TOWER[0] <= x1:
            dx = x0 + width / 2 - BED_CENTRE[0]
            tower = (x0 + width + 10, PRIME_TOWER[1])
    write_bambu_objects(path, [(object_name, parts, settings or {}, (dx, 0.0), turn)], filaments, plate, tower)


def write_bambu_objects(path, objects, filaments=("sort",), plate="glat", tower=None):
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
        parts = [tuple(q) + ("normal_part",) * (4 - len(q)) for q in parts]
        lo = np.min([m.bounds[0] for _, m, _, _ in parts], axis=0)
        hi = np.max([m.bounds[1] for _, m, _, _ in parts], axis=0)
        shift = np.array([-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]])
        ids = list(range(nid + 1, nid + len(parts) + 1))
        nid += len(parts) + 1
        obj = nid
        sub_path = f"/3D/Objects/object_{k + 1}.model"
        files[sub_path[1:]] = head + " <resources>\n" + "\n".join(
            _mesh_xml(i, m.copy().apply_translation(shift), n) for i, (n, m, _, _) in zip(ids, parts)) + \
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
        for i, (n, m, slot, kind) in zip(ids, parts):
            cfg += [f'    <part id="{i}" subtype="{kind}">', f'      <metadata key="name" value="{escape(n)}"/>',
                    '      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>',
                    f'      <metadata key="extruder" value="{slot}"/>',
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
        "Metadata/project_settings.config": project_settings(filaments, plate, tower, face_down),
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
SKAL_BLOCK = [("ingen support: strømrør", [-10.0, 10.0, -153.5, -78.0, 0.0, 26.0]),
              ("ingen support: låselomme venstre", [-91.6, -72.4, -153.5, -116.3, 0.0, 16.6]),
              ("ingen support: låselomme højre", [77.4, 90.6, -153.5, -116.3, 0.0, 16.6])] + \
             [(f"ingen support: vingelomme {i + 1}", [x0, x0 + 10.2, y0, y0 + 19.8, 0.0, 10.1])
              for i, (x0, y0) in enumerate([(-105.35, 13.1), (-105.35, 78.3), (95.15, 13.1), (95.15, 78.3)])]


def _box(b):
    x0, x1, y0, y1, z0, z1 = b
    return trimesh.creation.box(bounds=[[x0, y0, z0], [x1, y1, z1]])


def skal_3mf(folder, prefix=None):
    """<prefix>_skal_support.3mf: the shell with the support enforcers and blockers above, each box checked against the
    shell's own downward faces (an enforcer must hold a flat roof, a blocker the roofs it keeps clean)."""
    folder = Path(folder)
    prefix = prefix or folder.name
    skal = trimesh.load(folder / f"{prefix}_skal.stl")
    down = (skal.face_normals[:, 2] < -0.9) & (skal.triangles_center[:, 2] > 0.5)
    for name, b in SKAL_ENFORCE + SKAL_BLOCK:
        c = skal.triangles_center
        inside = down & np.all((c >= [b[0], b[2], b[4]]) & (c <= [b[1], b[3], b[5]]), axis=1)
        area = skal.area_faces[inside].sum()
        if area < 20:
            raise SystemExit(f"{name}: only {area:.1f} mm2 of roof inside {b}; the shell has moved, fix the box")
    parts = [("skal", skal, 1, "normal_part")]
    parts += [(n, _box(b), 1, "support_enforcer") for n, b in SKAL_ENFORCE]
    parts += [(n, _box(b), 1, "support_blocker") for n, b in SKAL_BLOCK]
    out = folder / f"{prefix}_skal_support.3mf"
    write_bambu_3mf(out, parts, f"{prefix}_skal", SETTINGS["skal"], turn=True, filaments=("sort",))
    return out


# the other parts: (file suffix, settings, turn, filament, plate); the frame lies like the shell (box underside at -y), so
# it is turned too. The light ring is the clear diffuser: PETG Translucent on its slot (COLOUR_MATERIAL "natur").
SINGLE = [("lysring", "lysring", False, "natur", "tekstureret"), ("bagramme", "bagramme", True, "hvid", "glat"),
          ("vaegbeslag", "vaegbeslag", False, "sort", "glat"), ("tema-top-eksempel", "tema", False, "sort", "glat"),
          ("tema-vinge-venstre-eksempel", "tema", False, "sort", "glat"),
          ("tema-vinge-hoejre-eksempel", "tema", False, "sort", "glat"),
          ("wagoraekke-eftermontering", "wagoraekke", False, "sort", "glat")]


def part_3mfs(folder, prefix=None):
    """<prefix>_<part>.3mf for each part in SINGLE that the release has, and the fan guard: on its own (v27, which has no
    camera sleeve) or, in a release with the sleeve (v24-v26), <prefix>_smaadele.3mf with both small black parts on one
    plate, 40 mm apart."""
    folder = Path(folder)
    prefix = prefix or folder.name
    outs = []
    for suffix, key, turn, colour, plate in SINGLE:
        stl = folder / f"{prefix}_{suffix}.stl"
        if stl.exists():
            outs.append(folder / f"{prefix}_{suffix}.3mf")
            write_bambu_3mf(outs[-1], [(suffix, trimesh.load(stl), 1)], f"{prefix}_{suffix}", SETTINGS[key], turn,
                            filaments=(colour,), plate=plate)
    small = [(s, folder / f"{prefix}_{s}.stl") for s in ("blaeserhegn", "kameraroer")]
    if small[0][1].exists() and not small[1][1].exists():
        outs.append(folder / f"{prefix}_blaeserhegn.3mf")
        write_bambu_3mf(outs[-1], [("blaeserhegn", trimesh.load(small[0][1]), 1)], f"{prefix}_blaeserhegn", SETTINGS["blaeserhegn"])
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
