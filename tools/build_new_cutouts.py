"""Cut-outs from the image sheets sent on 23 Nov 2026 (AI-style renders, used small only).

Run from sites/waffle Truck:  py demos/tools/build_new_cutouts.py
Output: demos/public/img/cut/bubble-banane-cup.webp, frites-box.webp, cup-1..6.webp
(Same mask idea as build_assets.py; that script rebuilds everything when imported, so the
two helpers are repeated here.)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

SRC = Path("images/PairDrop_files_20261123_1639")
CUT = Path("demos/public/img/cut")

# grey studio sheet with the kraft "WAFFLE TRUCK" cups: (left, top, right, bottom) in source pixels
SHEET = "8B5220A5-2381-42D7-880E-C8B4B36C0245.jpeg"
CROPS = {
    "bubble-banane-cup": (800, 5, 1040, 336),
    # the 6 bubble waffles in kraft cups, left to right (cup-4 = same image as bubble-banane-cup)
    "cup-1": (38, 4, 287, 348), "cup-2": (293, 4, 542, 348), "cup-3": (546, 4, 788, 348),
    "cup-4": (800, 5, 1040, 336), "cup-5": (1048, 4, 1284, 336), "cup-6": (1290, 4, 1512, 336),
    "frites-box": (925, 755, 1182, 1022),
}
# top-left of the sheet is a pure white band (x < 672, y < 60): pure white there is backdrop too
WHITE_BAND = (0, 0, 672, 60)
# the ketchup pot in front of the fries box is white/grey like the backdrop: its shape is drawn by
# hand (measured on the sheet, source pixels): rim ellipse, body, bottom ellipse
POT = {"frites-box": {"ellipses": [(1093, 920, 1176, 962), (1109, 997, 1168, 1013)],
                      "poly": [(1096, 942), (1175, 942), (1167, 1005), (1110, 1005)]}}


def border_color_mask(a, tol=42):
    """Background = colour close to the crop's own border (the grey backdrop is a soft gradient)."""
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]).astype(float)
    ref = np.median(edge, 0)
    dist = np.sqrt(((a.astype(float) - ref) ** 2).sum(2))
    # also treat neutral grey (low saturation, mid brightness) as background
    mx, mn = a.max(2).astype(int), a.min(2).astype(int)
    grey = ((mx - mn) <= 14) & (mn > 95) & (mx < 215)
    cand = (dist < tol) | grey
    lab, _ = ndi.label(cand)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    fg = ~np.isin(lab, border[border > 0])
    fg = ndi.binary_opening(fg, iterations=2)
    fg = ndi.binary_fill_holes(fg)
    lab, n = ndi.label(fg)  # keep the biggest piece (+ pieces > 4 % of it, e.g. ketchup cup)
    if n > 1:
        sizes = ndi.sum(fg, lab, range(1, n + 1))
        fg = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= sizes.max() * 0.04])
    return fg


def gradient_mask(a, band, tol=40):
    """Backdrop = smooth gradient (dark sides, light middle). Fit it on the crop border with a
    quadratic surface per channel, then call 'backdrop' what is close to it and touches the border.
    `band` = pixels of the white band, always backdrop when bright."""
    h, w = a.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    edge = np.zeros((h, w), bool); edge[:3] = edge[-3:] = True; edge[:, :3] = edge[:, -3:] = True
    edge &= ~band
    X = lambda y, x: np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], -1).astype(float)
    A = X(yy[edge] / h, xx[edge] / w)
    model = np.stack([np.linalg.lstsq(A, a[..., c][edge].astype(float), rcond=None)[0] for c in range(3)], -1)
    bg = X(yy / h, xx / w) @ model
    dist = np.sqrt(((a.astype(float) - bg) ** 2).sum(2))
    cand = (dist < tol) | (band & (a.mean(2) >= 232) & ((a.max(2) - a.min(2)) <= 26))
    lab, _ = ndi.label(cand)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    fg = ~np.isin(lab, border[border > 0])
    fg = ndi.binary_opening(fg, iterations=3)
    fg = ndi.binary_fill_holes(fg)
    # grey shadow patches stuck to the edge: dull, mid-dark pixels near the outline go
    # (food is saturated, cream is bright, Oreo is darker than this)
    m = a.mean(2)
    dull = ((a.max(2) - a.min(2)) < 24) & (m > 70) & (m < 215)
    near_edge = fg & ~ndi.binary_erosion(fg, iterations=22)
    fg &= ~(dull & near_edge)
    fg = ndi.binary_opening(fg, iterations=3)
    lab, n = ndi.label(fg)
    if n > 1:
        sizes = ndi.sum(fg, lab, range(1, n + 1))
        fg = lab == (np.argmax(sizes) + 1)
    return ndi.binary_fill_holes(fg)


def straight_cup(fg, start=0.64):
    """The kraft cup has straight sides: below `start` (share of the object height), replace the
    ragged outline by two fitted lines (outliers dropped), so shadows stuck to the paper go."""
    ys = np.where(fg.any(1))[0]
    top, bot = ys.min(), ys.max()
    rows = np.arange(int(top + (bot - top) * start), bot + 1)
    L = np.array([np.argmax(fg[y]) for y in rows], float)
    R = np.array([fg.shape[1] - 1 - np.argmax(fg[y][::-1]) for y in rows], float)

    def fit(v, side):
        keep = np.ones(len(rows), bool)
        for _ in range(4):
            k, b = np.polyfit(rows[keep], v[keep], 1)
            err = (v - (k * rows + b)) * side      # >0 = sticks out
            keep = err < np.percentile(err, 75) + 2
        return k * rows + b

    xl, xr = fit(L, -1), fit(R, 1)
    out = fg.copy()
    for y, a, b in zip(rows, xl, xr):
        out[y] = False
        out[y, max(int(round(a)), 0):int(round(b)) + 1] = fg[y, max(int(round(a)), 0):int(round(b)) + 1] | True
    # keep the real (curved) bottom: rows below the paper end stay as they were
    return out & ndi.binary_dilation(fg, iterations=1) | (out & ~fg & (np.arange(fg.shape[0])[:, None] < bot - 4))


def save(rgb, fg, name, max_side=700):
    fg = ndi.binary_erosion(fg, iterations=2)
    soft = np.asarray(Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1)))
    ys, xs = np.where(fg)
    y0, y1, x0, x1 = max(ys.min() - 4, 0), ys.max() + 5, max(xs.min() - 4, 0), xs.max() + 5
    img = Image.fromarray(np.dstack([rgb[y0:y1, x0:x1], soft[y0:y1, x0:x1]]), "RGBA")
    img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 45, 2))
    img.thumbnail((max_side, max_side), Image.LANCZOS)
    img.save(CUT / f"{name}.webp", quality=86, method=6)
    print(name, img.size)


sheet = Image.open(SRC / SHEET).convert("RGB")
for name, box in CROPS.items():
    rgb = np.asarray(sheet.crop(box))
    a = rgb.astype(int)
    band = np.zeros(a.shape[:2], bool)
    bx0, by0, bx1, by1 = WHITE_BAND
    band[max(by0 - box[1], 0):max(by1 - box[1], 0), max(bx0 - box[0], 0):max(bx1 - box[0], 0)] = True
    # where the paper starts (share of height): cup-4's waffle balls hang lower
    fg = straight_cup(gradient_mask(a, band), {"cup-4": 0.72}.get(name, 0.64)) if name.startswith("cup-") else border_color_mask(rgb)
    if name in POT:
        sh = Image.new("L", (rgb.shape[1], rgb.shape[0]), 0)
        d = ImageDraw.Draw(sh)
        mv = lambda pts: [(x - box[0], y - box[1]) for x, y in pts]
        for x0, y0, x1, y1 in POT[name]["ellipses"]:
            d.ellipse(mv([(x0, y0), (x1, y1)]), fill=255)
        d.polygon(mv(POT[name]["poly"]), fill=255)
        fg = ndi.binary_fill_holes(fg | (np.asarray(sh) > 0))
    save(rgb, fg, name)
