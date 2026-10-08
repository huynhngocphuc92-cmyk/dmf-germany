#!/usr/bin/env python3
"""
Crop and optimize 12 photographic covers for Phase 8 articles (Posts 96 to 107).
Sources from DMF Google Drive 'Đã chỉnh 03.03' folder.
Crops to exact 16:9 ratio (1200x675) with Lanczos resampling.
"""

from pathlib import Path
from PIL import Image

DRIVE_DIR = Path('/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Bộ nhớ dùng chung/MKT/Đã chỉnh 03.03')
PUB_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "blog"

PHOTO_PAIRS = [
    ('z5223363852007_70e42cb833ad383fbc6b5423d2cf5ee6.jpg', 'dmf-werkzeugmechaniker-feinwerkmechanik-formenbau.jpg'),
    ('z5223363860447_d033ee4c3071816d65e9ede8afa047fe.jpg', 'dmf-brauer-maelzer-getraenketechnik-brauerei.jpg'),
    ('z5223363865512_25a48ce15bc77b18c4ce73f21c099955.jpg', 'dmf-schornsteinfeger-brandschutz-feuerungsanlage.jpg'),
    ('z5223363869632_d207b665b9795381a68a839fe4b90cf8.jpg', 'dmf-fluggeraetmechaniker-luftfahrt-wartung-hangar.jpg'),
    ('z5223363873757_6760a9efad1cc67c2f07cf35452bef91.jpg', 'dmf-mtla-medizinische-technologen-labor-analyse.jpg'),
    ('z5223363896585_e793420e3fcee4c3007ccaa86f2d7711.jpg', 'dmf-mtra-radiologie-computertomographie-klinik.jpg'),
    ('z5223363902213_042ac77c79adee89f448a6f96a07cbee.jpg', 'dmf-augenoptiker-optometrie-brillen-refraktion.jpg'),
    ('z5223364455247_744fc13ef351e5b65b15fad2669f9dfe.jpg', 'dmf-betriebsrat-mitbestimmung-99-betrvg-personal.jpg'),
    ('z5223364498045_0dbd485526734063422cc15562a6e7f3.jpg', 'dmf-rentenbeitraege-drv-erstattung-antrag.jpg'),
    ('z5223364499733_269665306db703a56bc504cbc4757e35.jpg', 'dmf-zab-zeugnisbewertung-statement-comparability.jpg'),
    ('z5223364499820_d6bec019e7ee225c04035df339186404.jpg', 'dmf-sprachfoerderung-qualifizierungschancengesetz-schulung.jpg'),
    ('z5223364563391_ac1d95852d7d236216ca017992cc9ad5.jpg', 'dmf-statusfeststellung-scheinselbststaendigkeit-clearing.jpg')
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
            print(f"Created: {dst_name} ({resized.size[0]}x{resized.size[1]}) from {src_name}")
            count += 1

    print(f"\nSuccessfully processed {count}/{len(PHOTO_PAIRS)} Phase 8 photographic covers.")

if __name__ == "__main__":
    process_photos()
