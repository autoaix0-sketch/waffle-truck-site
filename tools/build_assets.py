"""Build every image the 3 demos use, from the owner's originals (never modified).

Run from sites/waffle Truck:  py demos/tools/build_assets.py
Output: demos/public/img/  (cut/ = transparent products, photo/ = real photos)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from scipy import ndimage as ndi

ROOT = Path(".")
A = ROOT / "assets/PairDrop_files_20261115_0458"
R = ROOT / "real local footage/PairDrop_files_20261115_0455"
OUT = ROOT / "demos/public/img"
CUT, PHOTO = OUT / "cut", OUT / "photo"
for d in (CUT, PHOTO):
    d.mkdir(parents=True, exist_ok=True)


def checker_mask(a):
    mx, mn = a.max(2), a.min(2)
    cand = (mn >= 172) & ((mx - mn) <= 9)
    lab, _ = ndi.label(cand)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    fg = ~np.isin(lab, border[border > 0])
    fg = ndi.binary_opening(fg, iterations=2)
    return ndi.binary_fill_holes(fg)


def border_color_mask(a, tol=38):
    """Background = smooth colour touching the border (plain studio backdrop)."""
    edge = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]).astype(float)
    ref = np.median(edge, 0)
    dist = np.sqrt(((a.astype(float) - ref) ** 2).sum(2))
    cand = dist < tol
    lab, _ = ndi.label(cand)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    fg = ~np.isin(lab, border[border > 0])
    fg = ndi.binary_opening(fg, iterations=3)
    return ndi.binary_fill_holes(fg)


def save_objects(rgb, fg, names, erode=3, max_side=900):
    """Split mask into objects (reading order) and save each with a clean edge."""
    fg = ndi.binary_erosion(fg, iterations=erode)
    lab, n = ndi.label(fg)
    sizes = ndi.sum(fg, lab, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s >= fg.size * 0.003]
    sl = ndi.find_objects(lab)
    objs = sorted(keep, key=lambda i: (sl[i - 1][0].start // 90, sl[i - 1][1].start))
    soft = np.asarray(Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1)))
    done = []
    for i, name in zip(objs, names):
        if not name:
            continue
        sy, sx = sl[i - 1]
        y0, y1 = max(sy.start - 4, 0), min(sy.stop + 4, rgb.shape[0])
        x0, x1 = max(sx.start - 4, 0), min(sx.stop + 4, rgb.shape[1])
        m = ndi.binary_dilation(lab[y0:y1, x0:x1] == i, iterations=2)
        alpha = (soft[y0:y1, x0:x1] * m).astype(np.uint8)
        img = Image.fromarray(np.dstack([rgb[y0:y1, x0:x1], alpha]), "RGBA")
        if max(img.size) < 500:
            img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 45, 2))
        img.thumbnail((max_side, max_side), Image.LANCZOS)
        img.save(CUT / f"{name}.webp", quality=86, method=6)
        done.append(name)
    if len(objs) != len(names):
        print("  ! objects found:", len(objs), "names given:", len(names))
    return done


def cut_checker(file, names):
    rgb = np.asarray(Image.open(A / file).convert("RGB"))
    print(file, save_objects(rgb, checker_mask(rgb.astype(np.int16)), names))


cut_checker("109846301_1794705945725591.jpeg", ["crousty-riz", "crousty-frites", "kebab", "poulet-bbq"])
cut_checker("262029223_1794706135001585.jpeg", ["galaxie-kebab", "area-51", "comete", "raclette", "savoyard"])
cut_checker("774384576_1794708178707111.jpeg",
            ["churros", "crepe-nutella", None, None, None, "beignets", "pause-cafe"])
cut_checker("6010079_1794708407186832.jpeg",
            ["pot-glaces", "boule-vanille", "boule-chocolat", "boule-fraise", "boule-pistache",
             "boule-cafe", "boule-caramel", "boule-coco", None,
             "dame-blanche", "chocolat-liegeois", "cafe-liegeois", "fraise-melba"])
cut_checker("688376158_1794708840429490.jpeg",
            ["frappe-cafe", "frappe-latte", "frappe-chocolat",
             "milkshake-1", "milkshake-2", "milkshake-oreo",
             "citronnade-1", "citronnade-2", "citronnade-3", "citronnade-4", "citronnade-5",
             "the-glace-1", "the-glace-2", "the-glace-3", "the-glace-4"])

# Bubble teas: real alpha already
bt = Image.open(A / "waffle_truck_glasses_cutout.png").convert("RGBA")
arr = np.asarray(bt)
fg = arr[..., 3] > 40
rgb = arr[..., :3].copy()
print("bubble-tea", save_objects(rgb, fg, ["bt-mangue", "bt-lacte", None, None, None, None, None, None, None,
                                           "bt-fruits-rouges", "bt-mangue-logo"], erode=1))

# Bubble waffle hero photo: plain beige backdrop -> cut out, upscale x2 (source is only 316x436)
bw = Image.open(A / "IMG_1439.jpeg").convert("RGB")
bw2 = bw.resize((bw.width * 2, bw.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.6, 60, 2))
rgb = np.asarray(bw2)
print("bubble-waffle", save_objects(rgb, border_color_mask(rgb), ["bubble-waffle"], erode=2, max_side=1000))
bw2.save(PHOTO / "bubble-waffle.webp", quality=86)

# Real photos of the kiosk
def photo(src, name, width, crop=None, enhance=True):
    im = Image.open(src).convert("RGB")
    if crop:
        im = im.crop(crop)
    if enhance:
        im = ImageEnhance.Contrast(im).enhance(1.06)
        im = ImageEnhance.Color(im).enhance(1.08)
    im.thumbnail((width, width * 2), Image.LANCZOS)
    im.save(PHOTO / f"{name}.webp", quality=84, method=6)
    print(name, im.size)


photo(R / "EBA15446-CC48-44E9-A3C7-FF199CAE95EC.png", "kiosque-face", 2000, enhance=False)
photo(R / "IMG_1447.jpeg", "terrasse", 1440)
photo(R / "IMG_1448.jpeg", "kiosque-grand-mail", 960)

# Menu posters (owner's own boards) for a "nos affiches" strip
for f, n in [("8789dbde-6c42-4876-b4a2-824a4033cb9e.jpeg", "affiche-bubble-waffle"),
             ("6d142c7f-f8f9-4dfc-94db-40b7505d4ba2.jpeg", "affiche-ovni"),
             ("aeb5abce-d854-43fc-8372-eadc783d2a42.jpeg", "affiche-bubble-tea"),
             ("eacedf6a-c158-49f8-9520-41402372e4ee.jpeg", "affiche-croustille"),
             ("D1271EB9-CCEE-420D-BD87-442616C06FAA.png", "affiche-10-waffles"),
             ("3de565c5-74c3-4097-9ab7-71eb216f5946.jpeg", "affiche-desserts")]:
    photo(A / f, n, 700, enhance=False)

# 10 bubble waffles from the poster grid (cream backdrop) -> small cards



# Logo
lg = Image.open(ROOT / "waffle_truck_logo_transparent.png").convert("RGBA")
lg.save(OUT / "logo.png", optimize=True)
print("done")
