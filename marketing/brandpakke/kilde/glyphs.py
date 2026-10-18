# Udtrækker omrids af "selfı" fra Instrument Sans (wght 500), så logoet kan leveres som rene SVG-stier uden font.
import json, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
f = TTFont(sys.argv[1])
f = instantiateVariableFont(f, {"wght": 500})
gs = f.getGlyphSet(); cmap = f.getBestCmap()
out = {"upm": f["head"].unitsPerEm, "glyphs": {}}
for ch in "selfı":
    name = cmap[ord(ch)]
    pen = SVGPathPen(gs); gs[name].draw(pen)
    bp = BoundsPen(gs); gs[name].draw(bp)
    out["glyphs"][ch] = {"d": pen.getCommands(), "adv": gs[name].width, "bounds": bp.bounds}
json.dump(out, open(sys.argv[2], "w"))
print(out["upm"], {k: v["adv"] for k, v in out["glyphs"].items()})
