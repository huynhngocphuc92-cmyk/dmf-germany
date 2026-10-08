#!/usr/bin/env python3
"""
Crop and optimize 12 photographic covers for Phase 9 articles (Posts 108 to 119).
Sources from:
- DMF Google Drive 'Đã chỉnh 03.03'
- DMF Google Drive 'Tư liệu/thuc tap sinh BCIS'
Crops to exact 16:9 ratio (1200x675) with Lanczos resampling.
"""

from pathlib import Path
from PIL import Image

DC_DIR = Path('/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Bộ nhớ dùng chung/MKT/Đã chỉnh 03.03')
BCIS_DIR = Path('/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Bộ nhớ dùng chung/MKT/Tư liệu/thuc tap sinh BCIS')
PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

PHOTO_PAIRS = [
    (DC_DIR / 'z5223364571559_5fd52538d4e898ecabace78a0f17e0da.jpg', 'dmf-bayern-mittelstand-industrie-fachkraefte.jpg'),
    (DC_DIR / 'z5223364582558_ec289c5869fed841f0eef0c54ce3fde8.jpg', 'dmf-baden-wuerttemberg-maschinenbau-azubis.jpg'),
    (DC_DIR / 'z5223364586781_5c13c071645eb3d6e62d50ed4961e09f.jpg', 'dmf-nrw-kliniken-pflege-krankenhaus-team.jpg'),
    (DC_DIR / 'z5223364589237_f143ea184a717f980368b76f9180df91.jpg', 'dmf-hessen-rhein-main-it-logistik-frankfurt.jpg'),
    (DC_DIR / 'z5223364599551_c72d33b5be901e2d47f02a940b112e9c.jpg', 'dmf-niedersachsen-bremen-handwerk-industrie.jpg'),
    (BCIS_DIR / 'DSCF8086.jpg', 'dmf-ostdeutschland-sachsen-thueringen-dresden.jpg'),
    (BCIS_DIR / 'DSCF8139.jpg', 'dmf-kosten-preise-honorarmodell-kalkulation.jpg'),
    (BCIS_DIR / 'DSCF8143.jpg', 'dmf-agentur-qualitaetskriterien-pruefung-audit.jpg'),
    (BCIS_DIR / 'DSCF8149.jpg', 'dmf-ausbildungsabbruch-risikoabsicherung-garantie.jpg'),
    (BCIS_DIR / 'DSCF8153.jpg', 'dmf-eigenrekrutierung-vs-agentur-analyse-vergleich.jpg'),
    (BCIS_DIR / 'DSCF8158.jpg', 'dmf-anerkennungspartnerschaft-praxis-erfahrungen.jpg'),
    (BCIS_DIR / 'DSCF8162.jpg', 'dmf-leitfaden-geschaeftsfuehrer-executive-strategie.jpg')
]

TARGET_WIDTH = 1200
TARGET_HEIGHT = 675
TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT

def process_photos():
    PUB_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for src_path, dst_name in PHOTO_PAIRS:
        dst_path = PUB_DIR / dst_name

        if not src_path.exists():
            print(f"Warning: Source not found: {src_path}")
            continue

        with Image.open(src_path) as img:
            img = img.convert("RGB")
            orig_w, orig_h = img.size
            orig_ratio = orig_w / orig_h

            if orig_ratio > TARGET_RATIO:
                new_w = int(orig_h * TARGET_RATIO)
                left = (orig_w - new_w) // 2
                box = (left, 0, left + new_w, orig_h)
            else:
                new_h = int(orig_w / TARGET_RATIO)
                top = (orig_h - new_h) // 2
                box = (0, top, orig_w, top + new_h)

            cropped = img.crop(box)
            resized = cropped.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
            resized.save(dst_path, format="JPEG", quality=88, optimize=True)
            print(f"Created: {dst_name} ({resized.size[0]}x{resized.size[1]}) from {src_path.name}")
            count += 1

    print(f"\nSuccessfully processed {count}/{len(PHOTO_PAIRS)} Phase 9 photographic covers.")

if __name__ == "__main__":
    process_photos()
