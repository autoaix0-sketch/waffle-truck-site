"""New owner photos (images/, 19 Nov 2026) -> web images in public/img/photo/.
Originals are never changed. Run from sites/waffle Truck:  py demos/tools/build_new_photos.py"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SRC, OUT = ROOT / 'images', ROOT / 'demos' / 'public' / 'img' / 'photo'
PHOTOS = {
    # trompe-l'oeil pastries
    'IMG_1496.jpeg': 'trompe-framboise',
    'IMG_1500.jpeg': 'trompe-cacahuete',
    'IMG_1499.jpeg': 'trompe-citron',
    'IMG_1504.jpeg': 'trompe-collection',
    # real photos gallery
    '4296bf34-ec7e-46a0-b7a7-658e788fcd00.jpeg': 'vrai-crousty',
    'IMG_1497.jpeg': 'vrai-ovni',
    'd5694fcd-323a-4e4b-992d-7d5bfa75a748.jpeg': 'vrai-milkshakes',
    '8a7b4af5-0cf8-4531-8abc-a0c272e96069.jpeg': 'vrai-coupes-fruits',
    'IMG_1502.jpeg': 'vrai-churros',
    'ecd8c4af-64e3-47e5-b07c-e4d7a4287afe.jpeg': 'vrai-bubble-tea',
    'IMG_1501.jpeg': 'vrai-milkshake-bueno',
    'f3a7e26d-a925-4fe6-a146-5be08cd76b2e.jpeg': 'vrai-crousty-citron',
}
OUT.mkdir(parents=True, exist_ok=True)
for src, name in PHOTOS.items():
    im = ImageOps.exif_transpose(Image.open(SRC / src)).convert('RGB')
    im.thumbnail((1200, 1200), Image.LANCZOS)
    im.save(OUT / f'{name}.webp', 'WEBP', quality=80, method=6)
    print(name, im.size, (OUT / f'{name}.webp').stat().st_size // 1024, 'KB')
