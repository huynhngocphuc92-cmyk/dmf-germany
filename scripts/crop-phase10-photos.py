#!/usr/bin/env python3
"""
Crop and optimize 12 authentic DMF photos for Phase 10 Blog Covers (Posts 120–131 / 123–134 total).
Outputs 1200x675 (16:9) high-quality JPEGs into public/images/blog/.
"""

from pathlib import Path
from PIL import Image, ImageOps

BCIS_DIR = Path(
    "/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/"
    "Bộ nhớ dùng chung/MKT/Tư liệu/thuc tap sinh BCIS"
)
OUT_DIR = Path("/Users/chong/dmf-talents.de/public/images/blog")

TARGET_W = 1200
TARGET_H = 675

# 12 unique source photos (all verified unused across all previous 122 blog posts)
JOBS = [
    # 120: Mindestausbildungsvergütung 2027 & Sperrkonto-Grenzen
    (
        BCIS_DIR / "DSCF7897.JPG",
        "dmf-mindestausbildungsverguetung-2027-sperrkonto-kalkulation.jpg",
        0.50,
    ),
    # 121: Blaue Karte EU 2027 & Mindestlohn 14,60 Euro
    (
        BCIS_DIR / "DSCF7905.JPG",
        "dmf-blaue-karte-eu-2027-gehaltsgrenzen-akademiker.jpg",
        0.48,
    ),
    # 122: Ausbildungsstart Herbst 2027 Rückwärts-Zeitplan
    (
        BCIS_DIR / "DSCF7906.JPG",
        "dmf-ausbildungsstart-2027-rueckwaerts-zeitplan-planung.jpg",
        0.50,
    ),
    # 123: Auslandsportal (digital.diplo.de) & Work-and-Stay-Agentur
    (
        BCIS_DIR / "DSCF7907.JPG",
        "dmf-auslandsportal-work-and-stay-agentur-digitalisierung.jpg",
        0.45,
    ),
    # 124: Ländervergleich Vietnam vs. Indien, Philippinen & Lateinamerika
    (
        BCIS_DIR / "DSCF7908.JPG",
        "dmf-laendervergleich-vietnam-indien-philippinen-rekrutierung.jpg",
        0.45,
    ),
    # 125: Tandem- & Kohorten-Recruiting (2 bis 5 Talente gleichzeitig)
    (
        BCIS_DIR / "DSCF7909.JPG",
        "dmf-tandem-kohorten-recruiting-team-einstellung.jpg",
        0.45,
    ),
    # 126: Babyboomer-Rentenwelle 2027–2030 & Wissenstransfer
    (
        BCIS_DIR / "DSCF7910.JPG",
        "dmf-babyboomer-rentenwelle-wissenstransfer-handwerk.jpg",
        0.48,
    ),
    # 127: Probezeit-Management 6-Monats-Leitfaden für Ausbilder & Meister
    (
        BCIS_DIR / "DSCF7911.JPG",
        "dmf-probezeit-management-ausbilder-meister-leitfaden.jpg",
        0.48,
    ),
    # 128: Berlin & Brandenburg (Gesundheit, Industrie, Bau & Hauptstadt-Hotellerie)
    (
        BCIS_DIR / "DSCF7912.JPG",
        "dmf-berlin-brandenburg-gesundheit-industrie-fachkraefte.jpg",
        0.45,
    ),
    # 129: Hamburg & Schleswig-Holstein (Hafenlogistik, Windenergie, Pflege & Küste)
    (
        BCIS_DIR / "DSCF7913.JPG",
        "dmf-hamburg-schleswig-holstein-hafen-pflege-gastronomie.jpg",
        0.48,
    ),
    # 130: Rheinland-Pfalz & Saarland (ZFE Kaiserslautern, Chemie, Maschinenbau)
    (
        BCIS_DIR / "DSCF7914.JPG",
        "dmf-rheinland-pfalz-saarland-zfe-kaiserslautern-industrie.jpg",
        0.48,
    ),
    # 131: Mecklenburg-Vorpommern & Sachsen-Anhalt (Ostsee-Tourismus, Industrie)
    (
        BCIS_DIR / "DSCF7918.JPG",
        "dmf-mecklenburg-vorpommern-sachsen-anhalt-ostsee-industrie.jpg",
        0.45,
    ),
]


def resolve_path(src: Path) -> Path:
    if src.exists():
        return src
    alt = src.with_suffix(src.suffix.lower() if src.suffix.isupper() else src.suffix.upper())
    if alt.exists():
        return alt
    raise FileNotFoundError(f"Source image not found: {src}")


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
    for src, out_name, y_anchor in JOBS:
        actual_src = resolve_path(src)
        out_path = OUT_DIR / out_name
        with Image.open(actual_src) as im:
            cropped = crop_16_9(im, y_anchor=y_anchor)
            cropped.save(out_path, "JPEG", quality=88, optimize=True, progressive=True)
        size_kb = out_path.stat().st_size / 1024
        print(f"OK: {out_name} ({TARGET_W}x{TARGET_H}, {size_kb:.1f} KB) <- {actual_src.name}")


if __name__ == "__main__":
    main()
