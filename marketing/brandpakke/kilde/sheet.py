# Kontaktark til hurtigt eftersyn: python3 sheet.py out.jpg bredde fil1 fil2 ...
import sys
from PIL import Image
out, W = sys.argv[1], int(sys.argv[2]); files = sys.argv[3:]
ims = [Image.open(f).convert("RGBA") for f in files]
th = 300; row = []; rows = []; x = 0
for im in ims:
    w = int(im.width * th / im.height)
    if x + w > W and row: rows.append(row); row = []; x = 0
    row.append(im.resize((w, th))); x += w + 10
rows.append(row)
sheet = Image.new("RGB", (W, len(rows) * (th + 10)), (128, 128, 128))
for r, row in enumerate(rows):
    x = 0
    for im in row: sheet.paste(im, (x, r * (th + 10)), im); x += im.width + 10
sheet.save(out, quality=85)
