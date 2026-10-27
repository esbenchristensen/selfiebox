#!/usr/bin/env python3
"""Bambu Studio project files for every printed part of a gen 2 release, each with its print settings inside.

v26 print settings (Esben 27 Oct, second round: "the best possible settings for a clean result without faults, that looks moulded but
is durable"): every part now has its own 3MF with the object's settings already set (layer height, walls, infill, the
first-layer pattern of the visible face, scarf seam, support, brim), so a print looks the same from box to box and does
not depend on what was last chosen in Bambu Studio. Only object-level settings are written (Bambu Studio's
PrintObjectConfig / PrintRegionConfig keys, as <metadata> on the object in Metadata/model_settings.config, which the
loader passes to the object's config). Printer, filament and the plate-wide process values (first layer height, speeds,
which are per-extruder lists on the H2C) are not in the files; the print guide lists them.

  <version>_front_flerfarvet.3mf  the black front with the logo inlays (white and green) in its 0.8 mm recess, as ONE
                                  object with three parts on slots 1 sort / 2 hvid / 3 groen
  <version>_skal_support.3mf      the shell with its support enforcers and blockers (v26, see skal_3mf below)
  <version>_lysring.3mf, _bagramme.3mf, _vaegbeslag.3mf, _blaeserhegn.3mf (v27; v26 had _smaadele.3mf with the camera
  sleeve and the fan guard on one plate), _tema-*.3mf   one object each, settings inside

Seams: Bambu's "back" seam goes to the part's rear (+y on the plate). Every part is placed so that +y is the box's
underside (the front and the ring already lie that way; the shell and the frame are turned 180 degrees on the plate),
so what is left of a seam ends up under the box, and it is a scarf seam on the outer contour.

The files follow Bambu Studio's own 3MF layout (component object + Metadata/model_settings.config). They deliberately do
not claim to be written by Bambu Studio (no Application metadata): a Bambu-tagged project without project_settings.config
crashes the slicer's command line loader (checked with OrcaSlicer 2.3.1, which shares the loader), while these load with
their parts, positions and slots.

Usage:  python3 hardware/tools/make_3mf.py <version folder> [<file prefix>]
        e.g. python3 hardware/tools/make_3mf.py hardware/stl/gen2/halo-gen2-v26
             python3 hardware/tools/make_3mf.py hardware/stl/gen2-hurtig/halo-gen2-v12-hurtig
Needs:  trimesh, numpy
"""
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
BED_CENTRE = (162.5, 160.0)   # H2C, 325 x 320 mm


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
    "bottom_surface_pattern": "monotonicline", "only_one_wall_first_layer": "1"}
SEAM = {"seam_position": "back", "seam_slope_type": "external"}   # scarf seam on the outer contour, at the box's underside
NO_SUPPORT = {"enable_support": "0"}
SETTINGS = {
    # front: 0.2 so the logo is exactly the first 4 layers; 0.15 elephant foot so the 0.15 shadow gap stays open
    "front": {"layer_height": "0.2", "wall_loops": "4", "top_shell_layers": "5", "bottom_shell_layers": "5",
              "sparse_infill_density": "20%", "sparse_infill_pattern": "gyroid", "elefant_foot_compensation": "0.15",
              "brim_type": "no_brim", **SOLID_FACE, **SEAM, **NO_SUPPORT},
    # light ring: solid, and every line runs round the ring (concentric), so the light through it is even, without stripes
    "lysring": {"layer_height": "0.16", "wall_loops": "3", "sparse_infill_density": "100%",
                "bottom_surface_pattern": "concentric", "top_surface_pattern": "concentric",
                "internal_solid_infill_pattern": "concentric", "elefant_foot_compensation": "0.15", "brim_type": "no_brim",
                **SEAM, **NO_SUPPORT},
    "bagramme": {"layer_height": "0.2", "wall_loops": "4", "sparse_infill_density": "20%", "sparse_infill_pattern": "gyroid",
                 **SEAM, **NO_SUPPORT},
    # shell: support only at its 2 enforcers (tree, manual, also from the model), 3 mm brim against corner lift
    "skal": {"layer_height": "0.16", "wall_loops": "5", "top_shell_layers": "6", "bottom_shell_layers": "6",
             "sparse_infill_density": "20%", "sparse_infill_pattern": "gyroid", "enable_support": "1",
             "support_type": "tree(manual)", "support_on_build_plate_only": "0", "brim_type": "outer_only",
             "brim_width": "3", **SEAM},
    "vaegbeslag": {"layer_height": "0.2", "wall_loops": "6", "sparse_infill_density": "100%", **SEAM, **NO_SUPPORT},
    "kameraroer": {"layer_height": "0.16", "sparse_infill_density": "100%", **NO_SUPPORT},
    # v29: the Wago row on its own, for a v24-v28 shell (its end wall on the plate, every wall straight up)
    "wagoraekke": {"layer_height": "0.16", "wall_loops": "3", "sparse_infill_density": "100%", **NO_SUPPORT},
    "blaeserhegn": {"layer_height": "0.16", "wall_loops": "4", "sparse_infill_density": "100%", "brim_type": "outer_only",
                    "brim_width": "3", **NO_SUPPORT},
    # theme parts: face down too; tree support (auto) under the straps
    "tema": {"layer_height": "0.2", "wall_loops": "4", "top_shell_layers": "5", "bottom_shell_layers": "5",
             "sparse_infill_density": "15%", "sparse_infill_pattern": "gyroid", "enable_support": "1",
             "support_type": "tree(auto)", **SOLID_FACE, **SEAM},
    # stand bracket: carries the whole box; the logo panel lies on the plate
    "stativbeslag": {"layer_height": "0.2", "wall_loops": "5", "top_shell_layers": "5", "bottom_shell_layers": "5",
                     "sparse_infill_density": "40%", "sparse_infill_pattern": "gyroid", **SOLID_FACE, **SEAM, **NO_SUPPORT},
}
TURN = np.diag([-1.0, -1.0, 1.0])   # 180 degrees on the plate: the box's underside to +y (Bambu's "back" seam)


def write_bambu_3mf(path, parts, object_name, settings=None, turn=False):
    """parts: list of (name, trimesh.Trimesh, filament slot[, subtype]). All meshes in one shared coordinate system;
    the object is moved as a whole so it sits on the plate (z = 0) in the middle of the bed. subtype is Bambu Studio's
    part type: "normal_part" (default), or "support_enforcer" / "support_blocker" for a support modifier volume.
    settings: the object's own print settings ({Bambu option key: value}); turn: 180 degrees round z on the plate."""
    write_bambu_objects(path, [(object_name, parts, settings or {}, (0.0, 0.0), turn)])


def write_bambu_objects(path, objects):
    """objects: list of (name, parts, settings, (dx, dy) from the bed centre, turn). One plate, each object as in
    write_bambu_3mf."""
    ns = ('xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" '
          'xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" '
          'xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p"')
    head = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<model unit="millimeter" xml:lang="en-US" {ns}>\n')
    meshes, items, assemble, plate = [], [], [], []
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
        cfg += [f'    <metadata key="{key}" value="{escape(v)}"/>' for key, v in settings.items()]
        for i, (n, m, slot, kind) in zip(ids, parts):
            cfg += [f'    <part id="{i}" subtype="{kind}">', f'      <metadata key="name" value="{escape(n)}"/>',
                    '      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>',
                    f'      <metadata key="extruder" value="{slot}"/>',
                    f'      <mesh_stat face_count="{len(m.faces)}" edges_fixed="0" degenerate_facets="0" '
                    'facets_removed="0" facets_reversed="0" backwards_edges="0"/>', "    </part>"]
        cfg.append("  </object>")
        plate += ["    <model_instance>", f'      <metadata key="object_id" value="{obj}"/>',
                  '      <metadata key="instance_id" value="0"/>', f'      <metadata key="identify_id" value="{1000 + obj}"/>',
                  "    </model_instance>"]
        assemble.append(f'   <assemble_item object_id="{obj}" instance_id="0" transform="{tr}" offset="0 0 0" />')
    cfg += ["  <plate>", '    <metadata key="plater_id" value="1"/>', '    <metadata key="plater_name" value=""/>',
            '    <metadata key="locked" value="false"/>'] + plate + ["  </plate>", "  <assemble>"] + assemble + \
           ["  </assemble>", "</config>", ""]
    main = head + " <resources>\n" + "\n".join(main_objs) + f'\n </resources>\n <build p:UUID="{_uuid()}">\n' + \
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
    }
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, text in out.items():
            z.writestr(zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0)), text, zipfile.ZIP_DEFLATED)


def front_3mf(folder, prefix=None):
    folder = Path(folder)
    prefix = prefix or folder.name
    parts = [(name, trimesh.load(folder / f"{prefix}_{suffix}.stl"), slot) for suffix, name, slot, _ in FRONT_PARTS]
    out = folder / f"{prefix}_front_flerfarvet.3mf"
    write_bambu_3mf(out, parts, f"{prefix}_front", SETTINGS["front"])
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
    write_bambu_3mf(out, parts, f"{prefix}_skal", SETTINGS["skal"], turn=True)
    return out


# the other parts: (file suffix, settings, turn); the frame lies like the shell (box underside at -y), so it is turned too
SINGLE = [("lysring", "lysring", False), ("bagramme", "bagramme", True), ("vaegbeslag", "vaegbeslag", False),
          ("tema-top-eksempel", "tema", False), ("tema-vinge-venstre-eksempel", "tema", False),
          ("tema-vinge-hoejre-eksempel", "tema", False), ("wagoraekke-eftermontering", "wagoraekke", False)]


def part_3mfs(folder, prefix=None):
    """<prefix>_<part>.3mf for each part in SINGLE that the release has, and the fan guard: on its own (v27, which has no
    camera sleeve) or, in a release with the sleeve (v24-v26), <prefix>_smaadele.3mf with both small black parts on one
    plate, 40 mm apart."""
    folder = Path(folder)
    prefix = prefix or folder.name
    outs = []
    for suffix, key, turn in SINGLE:
        stl = folder / f"{prefix}_{suffix}.stl"
        if stl.exists():
            outs.append(folder / f"{prefix}_{suffix}.3mf")
            write_bambu_3mf(outs[-1], [(suffix, trimesh.load(stl), 1)], f"{prefix}_{suffix}", SETTINGS[key], turn)
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
