# Samler mockups og logosiden til oversigt.jpg: python3 oversigt.py
from PIL import Image
import os
R = os.path.dirname(os.path.abspath(__file__)) + "/.."
files = ["05_mockups/mockup-emballage.jpg", "05_mockups/mockup-visitkort.jpg", "kilde/_tmp/sider/side-04.png",
         "05_mockups/mockup-instagram.jpg", "05_mockups/mockup-facebook-side.jpg", "05_mockups/mockup-merchandise.jpg"]
W, H, G = 1200, 800, 16
sheet = Image.new("RGB", (3 * W + 4 * G, 2 * H + 3 * G), (14, 15, 14))
for i, f in enumerate(files):
    im = Image.open(os.path.join(R, f)).convert("RGB")
    s = (min if f.endswith(".png") else max)(W / im.width, H / im.height); im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    if f.endswith(".png"):
        bg = Image.new("RGB", (W, H), im.getpixel((5, 5))); bg.paste(im, (0, (H - im.height) // 2)); im = bg
    im = im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
    sheet.paste(im, (G + (i % 3) * (W + G), G + (i // 3) * (H + G)))
sheet.save(os.path.join(R, "oversigt.jpg"), quality=88)
