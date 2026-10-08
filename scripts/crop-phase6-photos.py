#!/usr/bin/env python3
"""
Crop and optimize 12 photographic covers for Phase 6 articles (Posts 72 to 83).
Sources from DMF Google Drive 'Đã chỉnh 03.03' folder.
Crops to exact 16:9 ratio (1200x675) with Lanczos resampling.
"""

from pathlib import Path
from PIL import Image

DRIVE_DIR = Path('/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Bộ nhớ dùng chung/MKT/Đã chỉnh 03.03')
PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

PHOTO_PAIRS = [
    ('z5223363725751_d914826b16c5f149d52490141286dc37.jpg', 'dmf-geruestbau-montage-hoehe.jpg'),
    ('z5223363665030_d6e90eecb3cbbdfdc0a810b30c6a9964.jpg', 'dmf-gleisbau-schienen-infrastruktur.jpg'),
    ('z5223363879511_6dca0e3436328e5447d513bc64768171.jpg', 'dmf-karosserie-lackier-werkstatt.jpg'),
    ('z5223364554232_43d723c07f7a9317b1f406adf5a923fb.jpg', 'dmf-konstruktionsmechanik-stahlbau-halle.jpg'),
    ('z5223364575406_e9eb580778b34dee673fdcb15d350919.jpg', 'dmf-personalbuero-kuendigung-beratung.jpg'),
    ('z5223363803365_9003eb7e1114c11a65d6a04041650241.jpg', 'dmf-gehaltsabrechnung-lohnpruefung-tabelle.jpg'),
    ('z5223363816813_34b8d43e787d42ceaffa014e1f059259.jpg', 'dmf-arbeitszeiterfassung-stempeluhr-schicht.jpg'),
    ('z5223363883796_f9a1878af2542ca6482d616955f83f28.jpg', 'dmf-azubi-beratung-nebenjob-arbeitsvertrag.jpg'),
    ('z5223363835897_dbf56bddc6504f8832737170111beb0c.jpg', 'dmf-klinik-geburtshilfe-hebammen-team.jpg'),
    ('z5223363890489_8ffbda242cc957ddc3a0c231956f14f1.jpg', 'dmf-physiotherapie-reha-behandlung.jpg'),
    ('z5223363878107_26a0fe817648b6e50f2fba01986f046f.jpg', 'dmf-bankkonto-girokonto-beratung.jpg'),
    ('z5223364576747_6ae583648b490e0e03bf77119a9ed7cb.jpg', 'dmf-einwohnermeldeamt-anmeldung-wohnung.jpg')
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
            resized.save(dst_path, "JPEG", quality=90, optimize=True)
            print(f"Processed: {dst_name} ({TARGET_WIDTH}x{TARGET_HEIGHT}) from {src_name}")
            count += 1

    print(f"\nSUCCESS: Successfully processed {count} / {len(PHOTO_PAIRS)} Phase 6 photos in {PUB_DIR}")

if __name__ == "__main__":
    process_photos()
