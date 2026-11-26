"""Churros cup photo sent by KOS on 26 Nov 2026 (small, 157 x 197, light peach backdrop) -> transparent cut-out
for the "Livré chez toi" card (replaces the fries box).

Run from sites/waffle Truck:  py demos/tools/build_churros_cup.py
Source kept in images/2026-11-26-churros/churros-cup.png. Output: demos/public/img/cut/churros-cup.webp
The source is tiny, so it is upscaled x3 (Lanczos + a light sharpen). Ask KOS for a bigger photo if it looks soft.
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

im = Image.open("images/2026-11-26-churros/churros-cup.png").convert("RGB")
a = np.asarray(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mx, mn = a.max(2), a.min(2)

# backdrop = light peach: bright and low saturation compared with the churros, the kraft cup and the sauce
bgish = (mn >= 148) & ((mx - mn) <= 85) & (r >= 225)
# the floor under the cup is a darker, more saturated peach: be stricter-but-wider on the lower part of the photo
low = np.arange(a.shape[0])[:, None] >= 140
bgish |= low & (mn >= 135) & ((mx - mn) <= 100) & (r >= 222)
lab, n = ndi.label(bgish)
border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
bg = np.isin(lab, border[border > 0])
fg = ~bg
fg = ndi.binary_opening(fg, iterations=1)
lab2, n2 = ndi.label(fg)
sizes = ndi.sum(fg, lab2, range(1, n2 + 1))
keep = [i + 1 for i, s in enumerate(sizes) if s >= fg.size * 0.01]   # cup + churros, sauce pot; drop specks
fg = np.isin(lab2, keep)
fg = ndi.binary_fill_holes(fg)
fg = ndi.binary_erosion(fg, iterations=1)

# The floor under the cup has the same colours as the kraft cup, so trim it by shape (source pixels):
# below y=120, keep only what is inside the cup outline (left edge + rounded bottom), left of the sauce pot (x<=108).
yy, xx = np.mgrid[0:fg.shape[0], 0:fg.shape[1]]
left_edge = 40 + (yy - 120) * 0.14
cup_bottom = 174 - ((xx - 76) / 32.0) ** 2 * 10
floor = (yy >= 120) & (xx <= 108) & ((xx < left_edge) | (yy > cup_bottom))
fg &= ~floor

S = 3
big = im.resize((im.width * S, im.height * S), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
mask = Image.fromarray((fg * 255).astype(np.uint8)).resize(big.size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.6))
mask = mask.point(lambda v: 0 if v < 70 else min(255, int((v - 70) * 255 / 120)))   # firm, slightly soft edge
out = big.copy()
out.putalpha(mask)
out = out.crop(out.getbbox())
out.save("demos/public/img/cut/churros-cup.webp", quality=90, method=6)
print("saved", out.size, "foreground px", int(fg.sum()))

# preview on the dark card colour, to check the edges
prev = Image.new("RGB", out.size, (58, 31, 18))
prev.paste(out, (0, 0), out)
prev.save("demos/_qa/churros-cup-preview.png")
