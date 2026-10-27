#!/usr/bin/env python3
"""Multi-colour front for Bambu Studio: <version>_front_flerfarvet.3mf (v26: and the shell with its support
enforcers and blockers, <version>_skal_support.3mf; see skal_3mf below).

The front is printed in one go with the AMS: the black front with the logo inlays (white and green) in its
0.8 mm recess. The release has them as separate STLs that share one origin (`_front`, `_logo-hvid`,
`_logo-groen`); a slicer needs each colour as its own body. This tool puts the three bodies into one
3MF as ONE object with three parts, already in place, each on its own filament slot:

    slot 1 = sort (front), slot 2 = hvid (logo), slot 3 = groen (logo dots)

The file follows Bambu Studio's own 3MF layout (component object + Metadata/model_settings.config), so it
opens as one object with three parts and the slots set. No printer or process settings are in it; those
are chosen in Bambu Studio as usual. It deliberately does not claim to be written by Bambu Studio
(no Application metadata): a Bambu-tagged project without project_settings.config crashes the slicer's
command line loader (checked with OrcaSlicer 2.3.1, which shares the loader), while this one loads with
the three parts, their positions and slots 1/2/3.

Usage:  python3 hardware/tools/make_3mf.py <version folder> [<file prefix>]
        e.g. python3 hardware/tools/make_3mf.py hardware/stl/gen2/halo-gen2-v12
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


def write_bambu_3mf(path, parts, object_name):
    """parts: list of (name, trimesh.Trimesh, filament slot[, subtype]). All meshes in one shared coordinate system;
    the object is moved as a whole so it sits on the plate (z = 0) in the middle of the bed. subtype is Bambu Studio's
    part type: "normal_part" (default), or "support_enforcer" / "support_blocker" for a support modifier volume."""
    parts = [tuple(p) + ("normal_part",) * (4 - len(p)) for p in parts]
    lo = np.min([m.bounds[0] for _, m, _, _ in parts], axis=0)
    hi = np.max([m.bounds[1] for _, m, _, _ in parts], axis=0)
    shift = np.array([-(lo[0] + hi[0]) / 2, -(lo[1] + hi[1]) / 2, -lo[2]])
    ns = ('xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" '
          'xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" '
          'xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p"')
    head = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<model unit="millimeter" xml:lang="en-US" {ns}>\n')
    sub = head + " <resources>\n" + "\n".join(
        _mesh_xml(i + 1, m.copy().apply_translation(shift), n) for i, (n, m, _, _) in enumerate(parts)) + \
        "\n </resources>\n <build/>\n</model>\n"
    obj = len(parts) + 1
    comps = "\n".join(f'    <component p:path="/3D/Objects/object_1.model" objectid="{i + 1}" p:UUID="{_uuid()}" '
                      'transform="1 0 0 0 1 0 0 0 1 0 0 0"/>' for i in range(len(parts)))
    main = head + (f' <resources>\n  <object id="{obj}" p:UUID="{_uuid()}" type="model">\n   <components>\n{comps}\n'
                   f'   </components>\n  </object>\n </resources>\n <build p:UUID="{_uuid()}">\n'
                   f'  <item objectid="{obj}" p:UUID="{_uuid()}" transform="1 0 0 0 1 0 0 0 1 '
                   f'{BED_CENTRE[0]} {BED_CENTRE[1]} 0" printable="1"/>\n </build>\n</model>\n')
    ident = 1000 + obj
    cfg = ['<?xml version="1.0" encoding="UTF-8"?>', "<config>", f'  <object id="{obj}">',
           f'    <metadata key="name" value="{escape(object_name)}"/>', '    <metadata key="extruder" value="1"/>']
    for i, (n, m, slot, kind) in enumerate(parts):
        cfg += [f'    <part id="{i + 1}" subtype="{kind}">', f'      <metadata key="name" value="{escape(n)}"/>',
                '      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>',
                f'      <metadata key="extruder" value="{slot}"/>',
                f'      <mesh_stat face_count="{len(m.faces)}" edges_fixed="0" degenerate_facets="0" '
                'facets_removed="0" facets_reversed="0" backwards_edges="0"/>', "    </part>"]
    cfg += ["  </object>", "  <plate>", '    <metadata key="plater_id" value="1"/>', '    <metadata key="plater_name" value=""/>',
            '    <metadata key="locked" value="false"/>', "    <model_instance>",
            f'      <metadata key="object_id" value="{obj}"/>', '      <metadata key="instance_id" value="0"/>',
            f'      <metadata key="identify_id" value="{ident}"/>', "    </model_instance>", "  </plate>",
            "  <assemble>", f'   <assemble_item object_id="{obj}" instance_id="0" transform="1 0 0 0 1 0 0 0 1 '
            f'{BED_CENTRE[0]} {BED_CENTRE[1]} 0" offset="0 0 0" />', "  </assemble>", "</config>", ""]
    files = {
        "[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n'
        ' <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n'
        ' <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>\n'
        ' <Default Extension="config" ContentType="text/xml"/>\n</Types>\n',
        "_rels/.rels": '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
        ' <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n</Relationships>\n',
        "3D/_rels/3dmodel.model.rels": '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
        ' <Relationship Target="/3D/Objects/object_1.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n</Relationships>\n',
        "3D/3dmodel.model": main,
        "3D/Objects/object_1.model": sub,
        "Metadata/model_settings.config": "\n".join(cfg),
    }
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, text in files.items():
            z.writestr(zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0)), text, zipfile.ZIP_DEFLATED)


def front_3mf(folder, prefix=None):
    folder = Path(folder)
    prefix = prefix or folder.name
    parts = [(name, trimesh.load(folder / f"{prefix}_{suffix}.stl"), slot) for suffix, name, slot, _ in FRONT_PARTS]
    out = folder / f"{prefix}_front_flerfarvet.3mf"
    write_bambu_3mf(out, parts, f"{prefix}_front")
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
    write_bambu_3mf(out, parts, f"{prefix}_skal")
    return out


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    print(front_3mf(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None))
    if Path(sys.argv[1], f"{sys.argv[2] if len(sys.argv) > 2 else Path(sys.argv[1]).name}_skal.stl").exists():
        print(skal_3mf(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None))
