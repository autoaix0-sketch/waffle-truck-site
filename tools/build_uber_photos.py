"""Owner's Uber Eats photos (23 Nov 2026, warm studio backdrop) -> web photos.

Run from sites/waffle Truck:  py demos/tools/build_uber_photos.py
Source: images/2026-11-23-uber-eats/*.jpg (1536x1024). Output: demos/public/img/photo/ue-<name>.webp (960x640).
Drinks are skipped (not used on the site).
"""
from pathlib import Path
from PIL import Image

SRC = Path("images/2026-11-23-uber-eats")
OUT = Path("demos/public/img/photo")
SKIP = {"Coca-Cola", "Coca-Cola-Cherry", "Coca-Cola-Zero", "Eau-Cristaline", "Fuze-Tea"}
for f in sorted(SRC.glob("*.jpg")):
    if f.stem in SKIP:
        continue
    im = Image.open(f).convert("RGB")
    im.thumbnail((960, 960), Image.LANCZOS)
    name = "ue-" + f.stem.lower()
    im.save(OUT / f"{name}.webp", quality=82, method=6)
    print(name, im.size)
