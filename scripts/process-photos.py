"""Нейтральная обработка фото: кроп 4:3 и мягкая цветокоррекция. Без апскейла и дорисовки.
Запуск: python3 scripts/process-photos.py  (нужен Pillow)."""
from pathlib import Path
from PIL import Image, ImageEnhance

SRC = Path('assets-source/photos-original')
DST = Path('src/assets/photos')
SAT = {'hall': 0.78}  # остальные 0.95


def crop_43(im):
    w, h = im.size
    tw = min(w, round(h * 4 / 3))
    th = round(tw * 3 / 4)
    left, top = (w - tw) // 2, (h - th) // 2
    return im.crop((left, top, left + tw, top + th))


def grade(im, sat):
    im = ImageEnhance.Color(im).enhance(sat)
    r, g, b = im.split()
    if sat > 0.9:
        r = r.point(lambda v: min(255, round(v * 1.02)))
        b = b.point(lambda v: round(v * 0.98))
    im = Image.merge('RGB', (r, g, b))
    return ImageEnhance.Contrast(im).enhance(1.03)


for f in sorted(SRC.glob('*.png')):
    im = grade(crop_43(Image.open(f).convert('RGB')), SAT.get(f.stem, 0.95))
    im.save(DST / f.name, optimize=True)
    print(f.name, im.size)
