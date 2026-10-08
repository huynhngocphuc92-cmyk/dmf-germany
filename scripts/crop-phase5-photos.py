#!/usr/bin/env python3
"""
Crop and optimize 12 photographic covers for Phase 5 articles (Posts 60 to 71).
Sources from DMF Google Drive 'Đã chỉnh 03.03' folder.
Crops to exact 16:9 ratio (1200x675) with Lanczos resampling.
"""

from pathlib import Path
from PIL import Image

DRIVE_DIR = Path('/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Bộ nhớ dùng chung/MKT/Đã chỉnh 03.03')
PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

PHOTO_PAIRS = [
    ('z5223363577072_3bfffb52652136c6927d5cb965e327b7.jpg', 'dmf-zav-arbeitsagentur-beratung.jpg'),
    ('z5223363595037_102d52fe03ba8edf3bbf8bf9b2246f78.jpg', 'dmf-defizitbescheid-weiterbildung-plan.jpg'),
    ('z5223363632528_f6b14be75cdea71e1ed8f403502a77be.jpg', 'dmf-qualifikationsanalyse-werkstatt-test.jpg'),
    ('z5223363633921_5314991fa4c60da887edf0a26027da50.jpg', 'dmf-minderjaehrige-azubis-betreuung.jpg'),
    ('z5223363647326_761b6fa39dec1a95a6415bad13309df2.jpg', 'dmf-finanzbuchhaltung-steuer-belege.jpg'),
    ('z5223363651715_d29b4e30b27c5249f1ff9204f76be9c8.jpg', 'dmf-zimmerer-holzbau-montage.jpg'),
    ('z5223363775476_a4509097d9f4e03e4d1f1a184317fcf9.jpg', 'dmf-schreiner-tischler-fertigung.jpg'),
    ('z5223363781511_03e2008a1602630f9521ceaf66b880e7.jpg', 'dmf-stapler-lagerlogistik-schulung.jpg'),
    ('z5223363784618_911fd1eb366d78b88d93274a23219f20.jpg', 'dmf-tiefbau-strassenbau-baustelle.jpg'),
    ('z5223363791395_f64448581726b8dcd28b71771bcc3637.jpg', 'dmf-pflege-station-visite-team.jpg'),
    ('z5223363797414_cd17880c04707c729aef2c21a016d744.jpg', 'dmf-familiennachzug-wohnung-beratung.jpg'),
    ('z5223363800440_46d19659557da7be53c8beb6a25c328f.jpg', 'dmf-vorsorge-beratung-arbeitsplatz.jpg')
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
                new_w = int(h * TARGET_RATIO)
                left = (w - new_w) // 2
                crop_box = (left, 0, left + new_w, h)
            else:
                new_h = int(w / TARGET_RATIO)
                top = (h - new_h) // 2
                crop_box = (0, top, w, top + new_h)

            cropped = img.crop(crop_box)
            resized = cropped.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            resized.save(dst_path, format="JPEG", quality=88, optimize=True)
            print(f"Processed: {dst_name} ({TARGET_WIDTH}x{TARGET_HEIGHT}, {dst_path.stat().st_size // 1024} KB)")
            count += 1

    print(f"\nSUCCESS: Successfully processed {count} Phase 5 covers to {PUB_DIR}")

if __name__ == "__main__":
    process_photos()
