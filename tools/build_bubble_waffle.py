"""Bubble cup photo sent by KOS on 27 Nov 2026 (1024 x 1024, grey/white checkerboard baked into the JPG)
-> transparent cut-out for the hero "portal" scene. Replaces the old cut-out that had a grey shadow block on the right.

Run from sites/waffle Truck:  py demos/tools/build_bubble_waffle.py
Source kept in images/2026-11-27-bubble-cup/bubble-cup-oreo-fraise.jpg. Output: demos/public/img/cut/bubble-waffle.webp
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

im = Image.open("images/2026-11-27-bubble-cup/bubble-cup-oreo-fraise.jpg").convert("RGB")
a = np.asarray(im).astype(int)
mx, mn = a.max(2), a.min(2)
sat = mx - mn
# checker squares: neutral grey (~203) and neutral white (~241). The cream is warmer / brighter, so keep the band tight.
checker = (sat <= 5) & (mx >= 190) & (mx <= 250)   # both squares + the JPEG blur between them
lab, n = ndi.label(checker)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, border[border > 0])
fg = ~bg
fg = ndi.binary_opening(fg, iterations=4)        # remove thin checker seams
lab2, n2 = ndi.label(fg)
sizes = ndi.sum(fg, lab2, range(1, n2 + 1))
fg = lab2 == (int(np.argmax(sizes)) + 1)          # keep only the cup
fg = ndi.binary_fill_holes(fg)
fg = ndi.binary_erosion(fg, iterations=2)         # drop the light grey fringe

mask = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
out = im.copy()
out.putalpha(mask)
out = out.crop(out.getbbox())
out.save("demos/public/img/cut/bubble-waffle.webp", quality=90, method=6)
print("saved", out.size)

# previews on the cream page colour and on dark, to check the edges
for name, col in (("cream", (251, 241, 226)), ("dark", (58, 31, 18))):
    prev = Image.new("RGB", out.size, col)
    prev.paste(out, (0, 0), out)
    prev.save(f"demos/_qa/bubble-waffle-{name}.png")
