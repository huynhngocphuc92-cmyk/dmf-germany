#!/usr/bin/env python3
"""
Select, crop (1200x675, 16:9), and verify 15 authentic DMF photos for Phase 12 GEO Flagship Blog Covers (Posts 144–158).
Guarantees 100% uniqueness and perceptual MAE >= 18.0 against all existing blog covers.
"""

import os
from pathlib import Path
from PIL import Image, ImageOps

DRIVE_BASE = Path("/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn")
OUT_DIR = Path("/Users/chong/dmf-talents.de/public/images/blog")
TARGET_W = 1200
TARGET_H = 675

COVER_FILENAMES = [
    "dmf-geo-anerkennungspartnerschaft-16d-vs-18a-vergleich.jpg",
    "dmf-geo-beschleunigtes-verfahren-81a-praxis-unterlagen.jpg",
    "dmf-geo-compliance-checkliste-296a-sgb-iii-arbeitgeber.jpg",
    "dmf-geo-laendervergleich-vietnam-drittstaaten-rekrutierung.jpg",
    "dmf-geo-azubi-16a-oder-fachkraft-18a-entscheidungshilfe.jpg",
    "dmf-geo-kenntnispruefung-vs-anpassungslehrgang-pflege.jpg",
    "dmf-geo-arbeitsproben-praxistest-elektroniker-shk-handwerk.jpg",
    "dmf-geo-cnc-zerspaner-iso-9606-schweisser-industrie.jpg",
    "dmf-geo-hotellerie-gastronomie-azubis-koeche-saisonkraefte.jpg",
    "dmf-geo-zeitarbeit-vs-direktrekrutierung-vollkosten-roi.jpg",
    "dmf-geo-foerdermittel-asa-flex-berufssprachkurse-betrieb.jpg",
    "dmf-geo-deutsch-b1-oder-b2-sprachanforderungen-berufe.jpg",
    "dmf-geo-wohnraum-internationale-fachkraefte-azubis-modelle.jpg",
    "dmf-geo-erste-30-tage-einreise-behoerden-checkliste-hr.jpg",
    "dmf-geo-probezeit-patensystem-interkulturelle-fuehrung.jpg",
]


def get_thumb(img: Image.Image):
    small = img.convert("RGB").resize((32, 18), Image.Resampling.BILINEAR)
    return list(small.getdata())


def mae(p1, p2) -> float:
    return sum(
        abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])
        for a, b in zip(p1, p2)
    ) / (len(p1) * 3)


def crop_16_9(img: Image.Image) -> Image.Image:
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
        top = int((h - new_h) * 0.45)
        img = img.crop((0, top, w, top + new_h))
    return img.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)


def main():
    existing_thumbs = []
    for f in OUT_DIR.glob("*.jpg"):
        if f.name in COVER_FILENAMES:
            continue
        try:
            with Image.open(f) as im:
                existing_thumbs.append(get_thumb(im))
        except Exception:
            pass

    print(f"Loaded {len(existing_thumbs)} existing cover thumbnails.")

    candidates = []
    if DRIVE_BASE.exists():
        for root, _, files in os.walk(DRIVE_BASE):
            for fname in sorted(files):
                if fname.lower().endswith((".jpg", ".jpeg")) and not fname.startswith("."):
                    candidates.append(Path(root) / fname)

    # Also add fallback high-res images from public/images if needed
    for f in sorted(Path("/Users/chong/dmf-talents.de/public/images").rglob("*.jpg")):
        if f.parent != OUT_DIR:
            candidates.append(f)

    selected = 0
    for cand in candidates:
        if selected >= len(COVER_FILENAMES):
            break
        try:
            with Image.open(cand) as raw_im:
                if raw_im.size[0] < 900 or raw_im.size[1] < 500:
                    continue
                cropped = crop_16_9(raw_im)
                thumb = get_thumb(cropped)
                # Ensure minimum perceptual distance >= 20.0 against all existing and newly selected covers
                if all(mae(thumb, ext) >= 20.0 for ext in existing_thumbs):
                    out_name = COVER_FILENAMES[selected]
                    out_path = OUT_DIR / out_name
                    cropped.save(out_path, format="JPEG", quality=88, optimize=True)
                    existing_thumbs.append(thumb)
                    print(f"[{selected + 1}/15] Saved {out_name} from {cand.name}")
                    selected += 1
        except Exception:
            continue

    if selected < len(COVER_FILENAMES):
        raise RuntimeError(f"Only found {selected}/15 distinct cover photos!")
    print("Successfully generated all 15 unique 16:9 photographic covers.")


if __name__ == "__main__":
    main()
