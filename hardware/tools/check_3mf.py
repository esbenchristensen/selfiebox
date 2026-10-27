#!/usr/bin/env python3
"""Check the 3MFs from make_3mf.py against Bambu Studio's own loader rules, read from its source and system profiles.

What it checks, and where in BambuStudio v02.08.02.61 the rule comes from:
  - the file is a Bambu project (Application "BambuStudio-..." in 3D/3dmodel.model; bbs_3mf.cpp _handle_end_metadata)
  - project_settings.config passes Plater's "invalid config" check (a Bambu printer_model, or extruder_type sized to
    nozzle_diameter; Plater.cpp is_bbl_vendor_config / check_project_config)
  - every key is a real option with the right kind of value and a valid enum value (PrintConfig.cpp)
  - the filament lists are as long as the filaments, filament_extruder_variant / filament_self_index line up, and
    different_settings_to_system has filaments + 2 entries (Preset::normalize, PresetBundle::load_config_file_config)
  - the printer, process and filament presets exist, fit the H2C 0.4 and have the same extruder variants (profiles/BBL)
  - every object setting is a PrintObjectConfig / PrintRegionConfig option (PrintConfig.hpp), every part's slot exists
  - the parts lie on the bed, a multi-filament part within both extruders' reach, clear of the prime tower

Usage:  python3 hardware/tools/check_3mf.py <BambuStudio source checkout> <file.3mf> ...
        (git clone --depth 1 --branch v02.08.02.61 https://github.com/bambulab/BambuStudio; needs src/libslic3r and
        resources/profiles/BBL)
Needs:  numpy
"""
import json, re, sys, zipfile, xml.etree.ElementTree as ET
BS = sys.argv.pop(1)
src = open(f"{BS}/src/libslic3r/PrintConfig.cpp").read()
defs = {}
for m in re.finditer(r'this->add(?:_nullable)?\("(\w+)",\s*(co\w+)\)', src):
    key, typ = m.group(1), m.group(2)
    body = src[m.end(): src.find("this->add", m.end())]
    ev = re.findall(r'enum_values\.(?:push_back|emplace_back)\("([^"]*)"\)', body)
    if "def_top_fill_pattern->enum_values" in body:
        ev = "TOP"
    defs[key] = (typ, ev)
top = defs["top_surface_pattern"][1]
hdr = open(f"{BS}/src/libslic3r/PrintConfig.hpp").read()
starts = [(m.start(), m.group(1)) for m in re.finditer(r'PRINT_CONFIG_CLASS(?:_DERIVED)?_DEFINE\d?\(\s*\n?\s*(\w+)', hdr)]
def cls(k):
    out = []
    for m in re.finditer(r'\(\(\w+(?:<\w+>)?,\s*' + k + r'\)\)', hdr):
        out.append([n for s, n in starts if s < m.start()][-1])
    return out
pres = open(f"{BS}/src/libslic3r/Preset.cpp").read()
print_opts = set(re.findall(r'"(\w+)"', pres[pres.find("s_Preset_print_options"): pres.find("};", pres.find("s_Preset_print_options"))]))
bbl = json.load(open(f"{BS}/resources/profiles/BBL.json"))
models = {m["name"] for m in bbl["machine_model_list"]}
prof = f"{BS}/resources/profiles/BBL"
def resolved(t, n):
    m = {}
    chain = []
    while n:
        d = json.load(open(f"{prof}/{t}/{n}.json")); chain.append(d); n = d.get("inherits")
    for d in reversed(chain): m.update(d)
    return m

def check(path):
    errs = []
    z = zipfile.ZipFile(path)
    names = z.namelist()
    for need in ["3D/3dmodel.model", "Metadata/model_settings.config", "Metadata/project_settings.config", "[Content_Types].xml", "_rels/.rels"]:
        if need not in names: errs.append(f"missing {need}")
    main = ET.fromstring(z.read("3D/3dmodel.model"))
    ns = {"m": "http://schemas.microsoft.com/3dmanufacturing/core/2015/02"}
    meta = {e.get("name"): e.text for e in main.findall("m:metadata", ns)}
    if not (meta.get("Application") or "").startswith("BambuStudio-"): errs.append("no BambuStudio Application -> not a Bambu project")
    cfg = json.loads(z.read("Metadata/project_settings.config"))
    if cfg.get("name") != "project_settings": errs.append("json name")
    for k, v in cfg.items():
        if k in ("version", "name", "from"): continue
        if k not in defs: errs.append(f"unknown key {k}"); continue
        typ, ev = defs[k]
        vec = typ.endswith("s") and typ not in ("coPercents",) or typ in ("coPercents", "coFloatsOrPercents", "coPoints", "coEnums", "coBools", "coInts", "coFloats", "coStrings")
        vec = typ in ("coPercents", "coFloatsOrPercents", "coPoints", "coEnums", "coBools", "coInts", "coFloats", "coStrings")
        if vec != isinstance(v, list): errs.append(f"{k}: type {typ} but value {v!r}")
        vals = v if isinstance(v, list) else [v]
        if typ in ("coEnum", "coEnums") and ev:
            allowed = top if ev == "TOP" else ev
            for x in vals:
                if x not in allowed: errs.append(f"{k}: {x!r} not in {allowed}")
        if typ in ("coFloats", "coFloat", "coInts", "coInt", "coBool", "coBools"):
            for x in vals: float(x)
    # Plater: is_bbl_vendor_config || check_project_config
    if cfg.get("printer_model") not in models: errs.append("printer_model not a BBL model")
    nd = cfg.get("nozzle_diameter", []); et = cfg.get("extruder_type", [])
    if len(nd) > 1 and len(et) != len(nd): errs.append("extruder_type size != nozzle_diameter size")
    # Preset::normalize + load_config_file_config
    n = len(cfg["filament_colour"])
    for k in ["filament_diameter", "filament_settings_id", "filament_type", "filament_ids", "filament_vendor"]:
        if len(cfg.get(k, [])) != n: errs.append(f"{k} size != {n}")
    fev, fsi = cfg["filament_extruder_variant"], cfg["filament_self_index"]
    if len(fev) != len(fsi) or len(fev) < n: errs.append("filament_extruder_variant / filament_self_index")
    if len(cfg.get("different_settings_to_system", [])) != n + 2: errs.append("different_settings_to_system size")
    for k in cfg["different_settings_to_system"][0].split(";"):
        if k and k not in print_opts: errs.append(f"diff key {k} not a print option")
    pv = cfg["print_extruder_variant"]
    for k in ("initial_layer_speed", "initial_layer_infill_speed"):
        if len(cfg[k]) != len(pv): errs.append(f"{k} size != print variants")
    # the presets: exist, are compatible, and their variants match
    mach = resolved("machine", cfg["printer_settings_id"]); proc = resolved("process", cfg["print_settings_id"])
    if mach["printer_model"] != cfg["printer_model"]: errs.append("printer_model mismatch")
    for k in ("printer_extruder_variant", "printer_extruder_id", "nozzle_diameter", "extruder_variant_list", "printer_variant"):
        if mach.get(k) != cfg.get(k): errs.append(f"{k} differs from system preset: {mach.get(k)} vs {cfg.get(k)}")
    for k in ("print_extruder_variant", "print_extruder_id"):
        if proc.get(k) != cfg.get(k): errs.append(f"{k} differs from system preset")
    if cfg["printer_settings_id"] not in proc["compatible_printers"]: errs.append("process not compatible")
    for fname in set(cfg["filament_settings_id"]):
        fil = resolved("filament", fname)
        if cfg["printer_settings_id"] not in fil["compatible_printers"]: errs.append(f"{fname} not compatible")
        if fil["filament_id"] != cfg["filament_ids"][0] or fil["filament_extruder_variant"] != fev[:1]: errs.append("filament id/variant")
    # model_settings
    ms = ET.fromstring(z.read("Metadata/model_settings.config"))
    for obj in ms.findall("object"):
        for md in obj.findall("metadata"):
            k, v = md.get("key"), md.get("value")
            if k == "name": continue
            if k == "extruder":
                if not 1 <= int(v) <= n: errs.append("object extruder out of range")
                continue
            c = cls(k)
            if not ({"PrintObjectConfig", "PrintRegionConfig"} & set(c)): errs.append(f"object key {k} not object/region config ({c})")
            typ, ev = defs[k]
            if typ == "coEnum":
                allowed = top if ev == "TOP" else ev
                if v not in allowed: errs.append(f"object {k}={v} not in {allowed}")
            elif typ in ("coFloat", "coInt", "coBool"): float(v)
            elif typ == "coPercent":
                if not v.endswith("%"): errs.append(f"{k} percent")
        for part in obj.findall("part"):
            if part.get("subtype") not in ("normal_part", "support_enforcer", "support_blocker", "modifier_part", "negative_part"): errs.append("subtype")
            for md in part.findall("metadata"):
                if md.get("key") == "extruder" and not 1 <= int(md.get("value")) <= n: errs.append("part extruder > filaments")
    pl = {md.get("key"): md.get("value") for md in ms.find("plate").findall("metadata")}
    if pl.get("bed_type") != cfg["curr_bed_type"]: errs.append("bed type plate != project")
    # geometry on the bed: footprint of every item, inside both extruders' reach, and clear of the prime tower
    import numpy as np
    sub = {}
    for name in names:
        if name.startswith("3D/Objects/"):
            r = ET.fromstring(z.read(name))
            for o in r.iter("{%s}object" % ns["m"]):
                vs = np.array([[float(v.get(a)) for a in "xyz"] for v in o.iter("{%s}vertex" % ns["m"])])
                sub[(name, o.get("id"))] = vs
    allv = []
    for it in main.iter("{%s}item" % ns["m"]):
        t = [float(x) for x in it.get("transform").split()]
        R = np.array(t[:9]).reshape(3, 3); T = np.array(t[9:])
        for vs in sub.values(): allv.append(vs @ R + T)
    allv = np.vstack(allv); lo, hi = allv.min(0), allv.max(0)
    if lo[0] < 0 or hi[0] > 330 or lo[1] < 0 or hi[1] > 320 or abs(lo[2]) > 1e-6: errs.append(f"off the bed {lo.round(1)} {hi.round(1)}")
    if n > 1:
        if lo[0] < 25 or hi[0] > 325: errs.append(f"multi-filament part outside x 25-325: {lo[0]:.1f}-{hi[0]:.1f}")
        tx = float(cfg["wipe_tower_x"][0]); ty = float(cfg["wipe_tower_y"][0])
        if tx < hi[0] + 5 or tx + 60 > 325: errs.append(f"prime tower x {tx} vs part to {hi[0]:.1f}")
    return errs, (lo.round(1).tolist(), hi.round(1).tolist()), n, cfg["curr_bed_type"]

bad = 0
for p in sys.argv[1:]:
    e, bb, n, bed = check(p)
    print(("OK  " if not e else "FAIL"), p.split("/")[-1], f"filaments={n}", bed, bb)
    for x in e: print("     ", x); bad += 1
sys.exit(1 if bad else 0)
