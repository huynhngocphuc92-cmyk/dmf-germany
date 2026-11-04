#!/usr/bin/env python3
"""
Crop and optimize 12 authentic DMF photos for Phase 11 Blog Covers (Posts 132–143 / 135–146 total).
Outputs 1200x675 (16:9) high-quality JPEGs into public/images/blog/.
"""

import os
import unicodedata
from pathlib import Path
from PIL import Image, ImageOps

DRIVE_BASE = "/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn"
OUT_DIR = Path("/Users/chong/dmf-talents.de/public/images/blog")

TARGET_W = 1200
TARGET_H = 675

# Map normalized relative paths to output filenames and y_anchor
JOBS = [
    # 132: DMF Vietnam & DMF Talents Unternehmensprofil & Akademie-Porträt
    (
        "Drive của tôi/Dữ liệu cũ/Tài nguyên MKT/Cơ sở vật chất/DSCF5593.JPG",
        "dmf-vietnam-unternehmensprofil-ausbildungsakademie-deutschland.jpg",
        0.50,
    ),
    # 133: Deutschunterricht Intensivkurs A1 bis B2 an der DMF Sprachakademie
    (
        "Drive của tôi/4. Phòng Marketing/Hình ảnh MKT/K35/DSCF6925.JPG",
        "dmf-deutschunterricht-intensivkurs-a1-b2-akademie-vietnam.jpg",
        0.48,
    ),
    # 134: Interview-Coaching durch Achim Betticher in Vietnam
    (
        "Drive của tôi/Dữ liệu cũ/Tài nguyên MKT/Achim/DSCF5416.JPG",
        "dmf-interview-coaching-achim-betticher-vorbereitung-vietnam.jpg",
        0.45,
    ),
    # 135: Direkte Vertretung in Deutschland (Umit Elezov) & Arbeitgeberbetreuung
    (
        "Drive của tôi/Dữ liệu cũ/Tài nguyên MKT/Đoàn Đức/15 07.2/2O0A0488.JPG",
        "dmf-direkte-vertretung-deutschland-umit-elezov-arbeitgeberbetreuung.jpg",
        0.48,
    ),
    # 136: Das DMF Quality Gate & Entscheidungsfähige Kandidatenprofile mit 90s-Video
    (
        "Drive của tôi/4. Phòng Marketing/Hình ảnh MKT/DMF Teacher/DSCF6711.JPG",
        "dmf-quality-gate-entscheidungsfaehige-kandidatenprofile-video.jpg",
        0.45,
    ),
    # 137: Berufspraxis vor dem Abflug (Gastronomie, Hotellerie & Bäckerei bei BCIS)
    (
        "Bộ nhớ dùng chung/MKT/Tư liệu/thuc tap sinh BCIS/DSCF7919.JPG",
        "dmf-praxisvorbereitung-gastronomie-hotellerie-bcis-vietnam.jpg",
        0.48,
    ),
    # 138: Pflegeausbildung Vorbereitung bei DMF Vietnam
    (
        "Drive của tôi/4. Phòng Marketing/Hình ảnh MKT/Profile mới/DSCF7850.JPG",
        "dmf-pflegeausbildung-vorbereitung-vietnam-sprachkompetenz-empathie.jpg",
        0.45,
    ),
    # 139: 30-Tage-Onboarding-Protokoll in Deutschland (DMF cùng Thiện Tuấn ở Đức)
    (
        "Drive của tôi/4. Phòng Marketing/DMF cùng Thiện Tuấn ở Đức 🇩🇪/IMG_9118.JPG",
        "dmf-ankunft-onboarding-deutschland-30-tage-begleitung.jpg",
        0.50,
    ),
    # 140: Fallstudie Industrie & Technik – Phạm Ngọc Hoàng Duy (BBS Meppen)
    (
        "Drive của tôi/4. Phòng Marketing/Hình ảnh MKT/Duy/DSCF8725.JPG",
        "dmf-fallstudie-industrie-handwerk-hoang-duy-ausbildung-meppen.jpg",
        0.45,
    ),
    # 141: Erfolgsgeschichten Hotellerie & ZFA – Thiện Tuấn & Hoàng Dung
    (
        "Drive của tôi/Dữ liệu cũ/Tài nguyên MKT/Học viên phỏng vấn/An/Sân bay/DSCF5790.JPG",
        "dmf-fallstudie-hotellerie-zfa-thien-tuan-hoang-dung-erfolgsgeschichten.jpg",
        0.48,
    ),
    # 142: DMF Campus-Leben, Gemeinschaft & Interkulturelle Reife
    (
        "Drive của tôi/Dữ liệu cũ/Tài nguyên MKT/Đoàn Đức/Ảnh/Giao lưu lớp/IMG_5133.JPG",
        "dmf-gemeinschaft-kultur-integration-campus-leben-vietnam.jpg",
        0.50,
    ),
    # 143: Das 5-Schritte-Kooperationsmodell für deutsche Arbeitgeber mit DMF Talents
    (
        "Drive của tôi/Dữ liệu cũ/Tài nguyên MKT/Achim/DSCF5500.JPG",
        "dmf-kooperationsmodell-deutsche-arbeitgeber-schritt-fuer-schritt.jpg",
        0.45,
    ),
]


def build_nfc_lookup(base: str) -> dict[str, Path]:
    lookup: dict[str, Path] = {}
    for root, _, files in os.walk(base):
        for f in files:
            if f.lower().endswith((".jpg", ".jpeg", ".png")):
                full = os.path.join(root, f)
                rel = full.replace(base + "/", "")
                lookup[unicodedata.normalize("NFC", rel)] = Path(full)
    return lookup


def crop_16_9(img: Image.Image, y_anchor: float = 0.5) -> Image.Image:
    img = ImageOps.exif_transpose(img).convert("RGB")
    w, h = img.size
    target_ratio = TARGET_W / TARGET_H
    current_ratio = w / h

    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        max_top = h - new_h
        top = int(max_top * max(0.0, min(1.0, y_anchor)))
        img = img.crop((0, top, w, top + new_h))

    return img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    lookup = build_nfc_lookup(DRIVE_BASE)
    for rel_nfc, out_name, y_anchor in JOBS:
        key = unicodedata.normalize("NFC", rel_nfc)
        if key not in lookup:
            raise FileNotFoundError(f"Could not find NFC path in Drive: {key}")
        src_path = lookup[key]
        out_path = OUT_DIR / out_name
        with Image.open(src_path) as im:
            cropped = crop_16_9(im, y_anchor=y_anchor)
            cropped.save(out_path, "JPEG", quality=88, optimize=True, progressive=True)
        size_kb = out_path.stat().st_size / 1024
        print(f"OK: {out_name} ({TARGET_W}x{TARGET_H}, {size_kb:.1f} KB) <- {src_path.name}")


if __name__ == "__main__":
    main()
