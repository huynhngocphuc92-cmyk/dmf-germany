#!/usr/bin/env python3
"""
Crop and optimize 12 photographic covers for Phase 4 articles.
Sources from DMF Google Drive 'Đã chỉnh 03.03' folder.
Crops to 16:9 ratio and resizes to 1200x675.
"""

from pathlib import Path
from PIL import Image

DRIVE_DIR = Path('/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Bộ nhớ dùng chung/MKT/Đã chỉnh 03.03')
PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

PHOTO_PAIRS = [
    ('z5223363660363_ed9ae5eda2d3d3064db90788f986b0d0.jpg', 'dmf-fuehrerschein-verkehr-mobilitaet.jpg'),
    ('z5223363665030_d6e90eecb3cbbdfdc0a810b30c6a9964.jpg', 'dmf-doppelbesteuerung-finanzamt-beratung.jpg'),
    ('z5223363678204_a581b77d4856ec6ae7cce056088ede17.jpg', 'dmf-probezeit-gespraech-auswertung.jpg'),
    ('z5223363683568_67c8f75c3ca2c0b0dc912ee126c79e27.jpg', 'dmf-krankenkasse-sozialversicherung-service.jpg'),
    ('z5223363685691_3f1c19c7f0d014eb73ff18bc14cea2b7.jpg', 'dmf-duales-studium-hochschule-akademie.jpg'),
    ('z5223363694803_55debbcff5c8da3c68ffd535e4180868.jpg', 'dmf-sprachpruefung-goethe-zertifikat.jpg'),
    ('z5223363713155_90681e22cb7d6d5c8ce8a3fcfd20bbc0.jpg', 'dmf-verpflichtungserklaerung-buergschaft-vertrag.jpg'),
    ('z5223363714571_0c84ae842e60967af5d41d943af50b18.jpg', 'dmf-dachdecker-solar-fassadenbau.jpg'),
    ('z5223363722562_4292934e05ed05ff9e60f81517d87b6e.jpg', 'dmf-landmaschinen-baumaschinen-werkstatt.jpg'),
    ('z5223363725751_d914826b16c5f149d52490141286dc37.jpg', 'dmf-fleischer-metzger-lebensmittelhandwerk.jpg'),
    ('z5223363747556_07a439755b324ee79c3d7c0b5ebf2ad6.jpg', 'dmf-hotelfach-restaurant-service-training.jpg'),
    ('z5223363748266_ada258f6c590b5cfb6236243b735520f.jpg', 'dmf-urkundenpruefung-legalisation-botschaft.jpg')
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
            print(f"Error: {src_path} not found!")
            continue

        with Image.open(src_path) as img:
            img = img.convert("RGB")
            w, h = img.size
            current_ratio = w / h

            if current_ratio > TARGET_RATIO:
                # Wider than 16:9, crop left/right
                new_w = int(h * TARGET_RATIO)
                left = (w - new_w) // 2
                crop_box = (left, 0, left + new_w, h)
            else:
                # Taller than 16:9, crop top/bottom
                new_h = int(w / TARGET_RATIO)
                top = (h - new_h) // 2
                crop_box = (0, top, w, top + new_h)

            cropped = img.crop(crop_box)
            resized = cropped.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            resized.save(dst_path, format="JPEG", quality=88, optimize=True)
            print(f"Processed: {dst_name} ({TARGET_WIDTH}x{TARGET_HEIGHT}, {dst_path.stat().st_size // 1024} KB)")
            count += 1

    print(f"\nSUCCESS: Successfully processed {count} covers to {PUB_DIR}")

if __name__ == "__main__":
    process_photos()
