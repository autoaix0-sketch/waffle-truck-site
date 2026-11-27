"""Churros bucket photo sent by KOS on 27 Nov 2026 (1024 x 1024, light checkerboard baked into the JPG)
-> transparent cut-out for the "Livré chez toi" card. Replaces the small, soft churros cup of 26 Nov.

Run from sites/waffle Truck:  py demos/tools/build_churros_bucket.py
Source kept in images/2026-11-27-churros/churros-bucket.jpg. Output: demos/public/img/cut/churros-cup.webp
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

im = Image.open("images/2026-11-27-churros/churros-bucket.jpg").convert("RGB")
a = np.asarray(im).astype(int)
mx, mn = a.max(2), a.min(2)
# checker squares: neutral ~226 and ~253 at the top, ~196 and ~254 lower down (plus the JPEG blur between them)
checker = ((mx - mn) <= 5) & (mx >= 186)
lab, _ = ndi.label(checker)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
fg = ~np.isin(lab, border[border > 0])
fg = ndi.binary_opening(fg, iterations=3)          # thin checker seams
lab2, n2 = ndi.label(fg)
sizes = ndi.sum(fg, lab2, range(1, n2 + 1))
fg = np.isin(lab2, [i + 1 for i, s in enumerate(sizes) if s >= fg.size * 0.005])   # bucket, sauce pot, chocolate
fg = ndi.binary_fill_holes(fg)
fg = ndi.binary_erosion(fg, iterations=2)          # light fringe

mask = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
out = im.copy()
out.putalpha(mask)
out = out.crop(out.getbbox())
out.thumbnail((720, 720), Image.LANCZOS)
out.save("demos/public/img/cut/churros-cup.webp", quality=90, method=6)
print("saved", out.size)

prev = Image.new("RGB", out.size, (58, 31, 18))
prev.paste(out, (0, 0), out)
prev.save("demos/_qa/churros-bucket-preview.png")
