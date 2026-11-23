"""Hero photos a bit brighter (KOS, 23 Nov 2026: "the picture is so dark").

Run from sites/waffle Truck:  py demos/tools/brighten_hero.py
Re-makes photo/kiosque-grand-mail.webp (phone hero) and photo/terrasse.webp (desktop hero) from the
originals, same size as build_assets.py, with lifted shadows. Run it AFTER build_assets.py if you re-run that one.
"""
import numpy as np
from PIL import Image, ImageEnhance

R = "real local footage/PairDrop_files_20261115_0455/"
OUT = "demos/public/img/photo/"


def bright(src, name, width):
    im = Image.open(R + src).convert("RGB")
    a = np.asarray(im).astype(float) / 255
    a = a ** 0.78                                  # lift shadows and mid-tones, keep whites
    a = np.clip(a * 1.04, 0, 1)
    im = Image.fromarray((a * 255).astype(np.uint8))
    im = ImageEnhance.Contrast(im).enhance(1.04)
    im = ImageEnhance.Color(im).enhance(1.12)
    im.thumbnail((width, width * 2), Image.LANCZOS)
    im.save(OUT + name + ".webp", quality=84, method=6)
    print(name, im.size)


bright("IMG_1447.jpeg", "terrasse", 1440)
bright("IMG_1448.jpeg", "kiosque-grand-mail", 960)
