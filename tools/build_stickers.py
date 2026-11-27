"""Sticker sheet sent by KOS on 27 Nov 2026 (1024 x 1024 JPG, black/grey checkerboard baked in, every item has a
white sticker border). KOS: keep the white border. One transparent WebP per item, in demos/public/img/cut/sticker/.

Run from sites/waffle Truck:  py demos/tools/build_stickers.py
Source kept in images/2026-11-27-stickers/sheet.jpg. Previews in demos/_qa/stickers-*.png.
The old cut-outs (img/cut/*.webp) are not touched: Demos 01/03 and the menu TVs still use them.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

OUT = Path("demos/public/img/cut/sticker")
OUT.mkdir(parents=True, exist_ok=True)
# one point inside each sticker (sheet pixels, x, y)
SEEDS = {
    "cup-1": (100, 160), "cup-2": (270, 160), "cup-3": (440, 160),          # Oreo, Fraise chantilly, Choco noisette
    "cup-4": (612, 160), "cup-5": (780, 160), "cup-6": (940, 160),          # Banane caramel, Fruits rouges, M&M's
    "burger-1": (555, 445), "burger-2": (760, 445), "burger-3": (940, 445),  # not used (OVNI photos kept)
    "crepe-nutella": (110, 670), "churros": (550, 670), "milkshake-oreo": (940, 760),
    "gaufre-fraise": (125, 870), "bt-lacte": (295, 890), "bt-fruits-rouges": (385, 890),
    "bt-mangue": (478, 890), "bt-violet": (572, 890), "frites-box": (700, 850), "frappe-cup": (850, 900),
}
SCALE = 2
TEAS = ["bt-lacte", "bt-fruits-rouges", "bt-mangue", "bt-violet"]

im = Image.open("images/2026-11-27-stickers/sheet.jpg").convert("RGB")
a = np.asarray(im).astype(int)
mx, mn = a.max(2), a.min(2)
# checker = black (~0) and dark grey (~83) squares, neutral. The white border closes every sticker.
cand = (mx <= 110) & ((mx - mn) <= 12)
lab, _ = ndi.label(cand)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
fg = ~np.isin(lab, border[border > 0])
fg = ndi.binary_opening(fg, iterations=2)          # checker seams
fg = ndi.binary_fill_holes(fg)

# stickers that touch: split them by eroding, take the part under the seed, grow it back inside fg
core = ndi.binary_erosion(fg, iterations=4)
clab, _ = ndi.label(core)
big = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
for name, (x, y) in SEEDS.items():
    k = clab[y, x]
    if not k:
        raise SystemExit(f"{name}: seed is not inside a sticker")
    part = ndi.binary_dilation(clab == k, iterations=5) & fg
    if name in TEAS:
        # the 4 teas touch: cut the joined block at the narrowest column between this tea and its neighbours
        cols = part.sum(0)
        i = TEAS.index(name)
        xs = [SEEDS[t][0] for t in TEAS]
        def neck(x0, x1):
            lo, hi = (x0 + x1) // 2 - 25, (x0 + x1) // 2 + 25
            return lo + int(np.argmin(cols[lo:hi]))
        left = neck(xs[i - 1], xs[i]) if i else 0
        right = neck(xs[i], xs[i + 1]) if i < len(TEAS) - 1 else part.shape[1]
        part[:, :left] = False
        part[:, right:] = False
    part = ndi.binary_fill_holes(part)
    part = ndi.binary_erosion(part, iterations=1)  # drop the dark fringe just outside the white border
    mask = Image.fromarray((part * 255).astype(np.uint8)).resize(big.size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.2))
    out = big.copy()
    out.putalpha(mask)
    out = out.crop(mask.getbbox())
    out.save(OUT / f"{name}.webp", quality=90, method=6)
    print(f"{name:18s} {out.size}")

# contact sheet on the cream page colour and on dark, to check the edges
names = list(SEEDS)
for bgname, col in (("cream", (251, 241, 226)), ("dark", (58, 31, 18))):
    sheet = Image.new("RGB", (1800, 1400), col)
    x = y = 10
    row_h = 0
    for n in names:
        t = Image.open(OUT / f"{n}.webp")
        t.thumbnail((280, 330))
        if x + t.width > 1790:
            x, y, row_h = 10, y + row_h + 10, 0
        sheet.paste(t, (x, y), t)
        x += t.width + 10
        row_h = max(row_h, t.height)
    sheet.save(f"demos/_qa/stickers-{bgname}.png")
