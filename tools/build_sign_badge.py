"""Round "Waffle Truck est. 2019" badge = the real sign, cut from the kiosk front image.

Run from sites/waffle Truck:  py demos/tools/build_sign_badge.py
Output: demos/public/img/badge-sign.webp (transparent outside the white disc)
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

SRC = "real local footage/PairDrop_files_20261115_0455/EBA15446-CC48-44E9-A3C7-FF199CAE95EC.png"
BOX = (1500, 100, 1980, 580)  # area around the sign, source pixels

crop = Image.open(SRC).convert("RGB").crop(BOX)
a = np.asarray(crop).astype(int)
white = a.min(2) > 185                       # the white disc (wood around it is dark)
white = ndi.binary_fill_holes(white)          # fill the black lettering
lab, n = ndi.label(white)
disc = lab == (np.argmax(ndi.sum(white, lab, range(1, n + 1))) + 1)
ys, xs = np.where(disc)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
r = min(xs.max() - xs.min(), ys.max() - ys.min()) / 2 - 1.5   # stay just inside the edge
print("centre", round(cx, 1), round(cy, 1), "radius", round(r, 1))

S = 4  # draw the circle mask big, then shrink = smooth edge
m = Image.new("L", (crop.width * S, crop.height * S), 0)
ImageDraw.Draw(m).ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=255)
m = m.resize(crop.size, Image.LANCZOS)
# the render is lit a bit grey: stretch levels so the disc is clean white, the lettering stays black
rgb = np.asarray(crop).astype(float)
ref = np.percentile(rgb[disc].min(1), 70)          # typical disc white
rgb = np.clip((rgb - 20) * 255 / (ref - 20), 0, 255).astype(np.uint8)
out = Image.fromarray(rgb); out.putalpha(m)
out = out.crop((int(cx - r - 2), int(cy - r - 2), int(cx + r + 3), int(cy + r + 3)))
out = out.filter(ImageFilter.UnsharpMask(1.0, 40, 2))
out.save("demos/public/img/badge-sign.webp", quality=92, method=6)
print("saved", out.size)
