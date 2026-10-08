#!/usr/bin/env python3
"""
Crop and optimize 12 photographic covers for Phase 7 articles (Posts 84 to 95).
Sources from DMF Google Drive 'Đã chỉnh 03.03' folder.
Crops to exact 16:9 ratio (1200x675) with Lanczos resampling.
"""

from pathlib import Path
from PIL import Image

DRIVE_DIR = Path('/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Bộ nhớ dùng chung/MKT/Đã chỉnh 03.03')
PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

PHOTO_PAIRS = [
    ('z5223363573269_1291d7b3a6dc197a9c7ee7ce5d98adf4.jpg', 'dmf-kaeltetechnik-klimaanlage-wartung.jpg'),
    ('z5223363573270_e9b8baa1aef8ee17b547fc610654fc73.jpg', 'dmf-galabau-gartenbau-aussenanlage.jpg'),
    ('z5223363636043_2cf6d075cc9a5b7979c2d1cbfd0372e5.jpg', 'dmf-zahntechnik-dentallabor-fraesen.jpg'),
    ('z5223363654514_e5910a6b539e74740adb5f3a396d9a31.jpg', 'dmf-busfahrer-oepnv-linienbus-depot.jpg'),
    ('z5223363680837_4a459dff43e29da775e6c2fe670baf9c.jpg', 'dmf-systemintegration-rechenzentrum-server.jpg'),
    ('z5223363737726_be239bb72c41ce4821ea1feebdb3402c.jpg', 'dmf-zfa-zahnarztpraxis-behandlung-stuhl.jpg'),
    ('z5223363773752_7fa1bd256b34f0fb4bf7f816e35719f5.jpg', 'dmf-mfa-arztpraxis-blutentnahme-labor.jpg'),
    ('z5223363812252_1aa2d4e1d0fbce7720eac5b86cf81188.jpg', 'dmf-mutterschutz-elternzeit-beratung-personal.jpg'),
    ('z5223363821618_83b512a8affcda68985d88796a657794.jpg', 'dmf-entgeltfortzahlung-attest-krankmeldung.jpg'),
    ('z5223363830224_9d56ff2adb4a12f00545c940e50f882d.jpg', 'dmf-arbeitsunfall-berufsgenossenschaft-schutz.jpg'),
    ('z5223363839900_a41dafc358af332831578d5f8c65ddb7.jpg', 'dmf-arbeitsvertrag-rueckzahlung-klausel-pruefung.jpg'),
    ('z5223363849186_2e4be529a81fc22f5a3dac0b9a431625.jpg', 'dmf-daueraufenthalt-eu-niederlassung-pass.jpg')
]

TARGET_WIDTH = 1200
TARGET_HEIGHT = 675
TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT

def process_photos():
    PUB_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for src_name, dst_name in PHOTO_PAIRS:
        src_path = DRIVE_DIR / src_name
        dst_path = PUB_DIR / dst_name

        if not src_path.exists():
            print(f"Warning: Source not found: {src_path}")
            continue

        with Image.open(src_path) as img:
            img = img.convert("RGB")
            orig_w, orig_h = img.size
            orig_ratio = orig_w / orig_h

            if orig_ratio > TARGET_RATIO:
                # Image is wider than 16:9 -> crop horizontal sides (center crop)
                crop_w = int(orig_h * TARGET_RATIO)
                crop_h = orig_h
                left = (orig_w - crop_w) // 2
                top = 0
                right = left + crop_w
                bottom = crop_h
            else:
                # Image is taller than 16:9 -> crop vertical top/bottom (center crop)
                crop_w = orig_w
                crop_h = int(orig_w / TARGET_RATIO)
                left = 0
                top = (orig_h - crop_h) // 2
                right = crop_w
                bottom = top + crop_h

            cropped = img.crop((left, top, right, bottom))
            resized = cropped.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            resized.save(dst_path, "JPEG", quality=88, optimize=True)
            print(f"Cropped & saved: {dst_name} ({TARGET_WIDTH}x{TARGET_HEIGHT}) from {src_name}")
            count += 1

    print(f"\nSuccessfully processed {count} / {len(PHOTO_PAIRS)} Phase 7 photos into {PUB_DIR}")

if __name__ == "__main__":
    process_photos()
