#!/usr/bin/env python3
"""A new release that only changes print settings: copy a version folder to the next version and remake its 3MFs and zip.

v34 / stativbeslag v7 / printer v6 (28 Oct, the PLA prints that failed): the parts are the same, only the settings inside
the 3MFs (make_3mf.py) change. This copies every file of <old> to <new> with the version in the file names (and in the text
files: .md .json .svg) changed, writes the 3MFs again from the copied STLs with the current make_3mf.py, and packs
<new>_printfiler.zip with the same files as the old zip. The PRINTGUIDE is copied as it was: edit it afterwards and run
again with --zip-only to repack it.

Usage:  python3 hardware/tools/copy_release.py <old folder> <new folder> [--zip-only]
        e.g. python3 hardware/tools/copy_release.py hardware/stl/gen2/halo-gen2-v33 hardware/stl/gen2/halo-gen2-v34
Needs:  trimesh, numpy
"""
import shutil
import sys
import zipfile
from pathlib import Path

import trimesh

sys.path.insert(0, str(Path(__file__).resolve().parent))
import make_3mf  # noqa: E402
from make_3mf import SETTINGS, write_bambu_3mf  # noqa: E402

TEXT = (".md", ".json", ".svg")


def remake_3mfs(new, ver):
    """the 3MFs the folder had, made again from its STLs: a gen 2 box (make_3mf.py's own set), the stand bracket or the
    printer (hood and exit module with their inlays, as make_printer.py / make_stativbeslag.py write them)"""
    if (new / f"{ver}_front.stl").exists():
        make_3mf.front_3mf(new, ver)
        if (new / f"{ver}_skal.stl").exists():
            make_3mf.skal_3mf(new, ver)
        make_3mf.part_3mfs(new, ver)
    elif (new / f"{ver}_flerfarvet.3mf").exists():   # stand bracket
        parts = [(name, trimesh.load(new / f"{ver}{suffix}.stl"), slot) for suffix, name, slot in
                 [("", "stativbeslag (sort)", 1), ("_logo-hvid", "logo hvid", 2), ("_logo-groen", "logo groen", 3)]]
        write_bambu_3mf(new / f"{ver}_flerfarvet.3mf", parts, ver, SETTINGS["stativbeslag"],
                        filaments=("sort", "hvid", "groen"), plate="tekstureret")
    else:   # printer: <ver>_<part>_flerfarvet.3mf for the hood and the exit module
        inlays = {"kappe": ["logo-hvid", "logo-groen"], "udgang": ["tekst-hvid", "tekst-groen"]}
        for part, ins in inlays.items():
            if not (new / f"{ver}_{part}_flerfarvet.3mf").exists():
                continue
            parts = [(part, trimesh.load(new / f"{ver}_{part}.stl"), 1)] + \
                [(i, trimesh.load(new / f"{ver}_{i}.stl"), 2 if i.endswith("hvid") else 3) for i in ins]
            name = f"{ver}_{part}"
            write_bambu_3mf(new / f"{name}_flerfarvet.3mf", parts, name, SETTINGS["printerkappe"],
                            filaments=("sort", "hvid", "groen"))


def main(old, new, zip_only=False):
    old, new = Path(old), Path(new)
    a, b = old.name, new.name
    if not zip_only:
        new.mkdir(parents=True, exist_ok=False)
        for f in sorted(old.iterdir()):
            g = new / f.name.replace(a, b)
            if f.suffix in TEXT:
                g.write_text(f.read_text().replace(a, b))
            elif f.suffix != ".zip":
                shutil.copy2(f, g)
        remake_3mfs(new, b)
    names = [n.replace(a, b) for n in zipfile.ZipFile(old / f"{a}_printfiler.zip").namelist()]
    with zipfile.ZipFile(new / f"{b}_printfiler.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for n in names:
            z.write(new / n, n)
    print(new)


if __name__ == "__main__":
    args = [x for x in sys.argv[1:] if not x.startswith("--")]
    if len(args) != 2:
        raise SystemExit(__doc__)
    main(*args, zip_only="--zip-only" in sys.argv)
