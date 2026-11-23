"""Crousty bowl photo sent by KOS on 23 Nov 2026 (black backdrop) -> transparent cut-out.

Run from sites/waffle Truck:  py demos/tools/build_crousty_bowl.py
Output: demos/public/img/cut/crousty-bowl.webp
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

im = Image.open("images/2026-11-23-crousty/crousty-bowl.jpg").convert("RGB")
a = np.asarray(im).astype(int)
fg = a.max(2) > 28                                   # backdrop is near black
lab, n = ndi.label(fg)
fg = lab == (np.argmax(ndi.sum(fg, lab, range(1, n + 1))) + 1)
fg = ndi.binary_fill_holes(ndi.binary_opening(fg, iterations=2))
fg = ndi.binary_erosion(fg, iterations=2)
alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
out = im.copy(); out.putalpha(alpha)
out = out.crop(out.getbbox())
out.thumbnail((900, 900), Image.LANCZOS)
out.save("demos/public/img/cut/crousty-bowl.webp", quality=88, method=6)
print("saved", out.size)
