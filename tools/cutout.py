"""Remove a baked-in checkerboard background and split each image into one
transparent PNG per product.

Usage: py tools/cutout.py <src.jpeg> <out_dir> <prefix>
Prints each output file with its size and bounding box (x, y) in the source.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

src, out_dir, prefix = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
out_dir.mkdir(parents=True, exist_ok=True)

im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.int16)
mx, mn = a.max(2), a.min(2)
sat = mx - mn
# checker squares: neutral grey (~180-196) or neutral white (>=244)
grey = (mx >= 176) & (mx <= 200) & (sat <= 7)
white = (mn >= 242) & (sat <= 6)
cand = (mn >= 172) & (sat <= 9)

lab, n = ndi.label(cand)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, border[border > 0])
fg = ~bg
fg = ndi.binary_opening(fg, iterations=2)
fg = ndi.binary_fill_holes(fg)

lab2, n2 = ndi.label(fg)
sizes = ndi.sum(fg, lab2, range(1, n2 + 1))
min_area = fg.size * 0.004
alpha_full = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
objs = [(i + 1, s) for i, s in enumerate(sizes) if s >= min_area]
slices = ndi.find_objects(lab2)
items = []
for idx, _ in objs:
    sy, sx = slices[idx - 1]
    items.append((sy.start, sx.start, idx, sy, sx))
items.sort(key=lambda t: (round(t[0] / 60), t[1]))  # rows top->bottom, then left->right
for k, (_, _, idx, sy, sx) in enumerate(items, 1):
    pad = 6
    y0, y1 = max(sy.start - pad, 0), min(sy.stop + pad, a.shape[0])
    x0, x1 = max(sx.start - pad, 0), min(sx.stop + pad, a.shape[1])
    mask = (lab2[y0:y1, x0:x1] == idx)
    alpha = np.asarray(alpha_full)[y0:y1, x0:x1] * mask
    rgba = np.dstack([np.asarray(im)[y0:y1, x0:x1], alpha.astype(np.uint8)])
    out = out_dir / f"{prefix}-{k:02d}.png"
    Image.fromarray(rgba, "RGBA").save(out, optimize=True)
    print(out.name, x1 - x0, y1 - y0, (x0, y0))
