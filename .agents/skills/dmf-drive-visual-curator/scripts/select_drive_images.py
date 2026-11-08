#!/usr/bin/env python3
"""
Strategic DMF Drive Image Selector, Contact-Sheet Builder & Web Exporter
========================================================================
Usage examples:
1. Sample 6 diverse unused Scene Clusters across target pillars & build a contact sheet:
   python3 .agents/skills/dmf-drive-visual-curator/scripts/select_drive_images.py \
     --pillars PILLAR_1_GERMANY_ARRIVAL_VISA_SUCCESS,PILLAR_2_GERMAN_EXPERTS_INTERVIEW_COACHING \
     --count 6 \
     --contact-sheet /tmp/dmf_contact_sheet.jpg

2. Export verified Cluster IDs to `public/images/blog/` (1200x675 JPEG) & record in ledger:
   python3 .agents/skills/dmf-drive-visual-curator/scripts/select_drive_images.py \
     --export C0012:dmf-community-visa.jpg,C0104:dmf-community-achim.jpg \
     --out-dir public/images/blog
"""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import unicodedata
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageOps

ROOT = Path("/Users/chong/dmf-talents.de")
SKILL_DIR = ROOT / ".agents" / "skills" / "dmf-drive-visual-curator"
RES_DIR = SKILL_DIR / "resources"
THUMBS_DIR = RES_DIR / "thumbs"
CATALOG_FILE = RES_DIR / "dmf-drive-catalog.json"
LEDGER_FILE = RES_DIR / "used-clusters-ledger.json"

GDRIVE_ROOT = Path(
    "/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Drive của tôi"
)


def load_catalog() -> dict:
    if not CATALOG_FILE.exists():
        raise FileNotFoundError(
            f"Missing catalog {CATALOG_FILE}. Run index_drive_catalog.py first."
        )
    return json.loads(CATALOG_FILE.read_text())


def load_ledger() -> dict[str, str]:
    if LEDGER_FILE.exists():
        try:
            return json.loads(LEDGER_FILE.read_text())
        except Exception:
            pass
    return {}


def save_ledger(ledger: dict[str, str]) -> None:
    LEDGER_FILE.parent.mkdir(parents=True, exist_ok=True)
    LEDGER_FILE.write_text(json.dumps(ledger, indent=2, sort_keys=True, ensure_ascii=False))


def stride_sample_clusters(
    clusters: list[dict], count: int, used_ids: set[str]
) -> list[dict]:
    available = [c for c in clusters if c["cluster_id"] not in used_ids]
    if not available:
        return []
    if len(available) <= count:
        return available

    # Group by folder first so we maximize folder diversity before taking multiple from same folder
    by_folder: dict[str, list[dict]] = {}
    for c in available:
        by_folder.setdefault(c["folder"], []).append(c)

    folder_lists = list(by_folder.values())
    selected: list[dict] = []
    round_idx = 0
    while len(selected) < count:
        added_in_round = False
        for flist in folder_lists:
            if len(selected) >= count:
                break
            if round_idx < len(flist):
                # Pick evenly spaced items within each folder
                step = max(1, len(flist) // max(1, count))
                pick_idx = min(len(flist) - 1, round_idx * step)
                cand = flist[pick_idx]
                if cand not in selected:
                    selected.append(cand)
                    added_in_round = True
        if not added_in_round:
            # Fallback linear stride across all available
            for c in available:
                if c not in selected:
                    selected.append(c)
                    if len(selected) >= count:
                        break
            break
        round_idx += 1

    return selected[:count]


def ascii_clean(text: str) -> str:
    s = text.replace("đ", "d").replace("Đ", "D")
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")


def load_thumbnail(cluster: dict, thumb_w: int = 480, thumb_h: int = 270) -> tuple[dict, Image.Image | None]:
    THUMBS_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = THUMBS_DIR / f"{cluster['cluster_id']}.jpg"
    src_path = GDRIVE_ROOT / cluster["raw_rel_path"]
    try:
        if cache_path.exists():
            im = Image.open(cache_path).convert("RGB")
        else:
            with Image.open(src_path) as raw_im:
                im = ImageOps.exif_transpose(raw_im).convert("RGB")
                w, h = im.size
                target_ratio = thumb_w / thumb_h
                if (w / h) > target_ratio:
                    new_w = int(h * target_ratio)
                    left = (w - new_w) // 2
                    im = im.crop((left, 0, left + new_w, h))
                else:
                    new_h = int(w / target_ratio)
                    top = int((h - new_h) * 0.38)
                    im = im.crop((0, top, w, top + new_h))
                im = im.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
                im.save(cache_path, "JPEG", quality=82)

        draw = ImageDraw.Draw(im)
        folder_short = ascii_clean(Path(cluster["folder"]).name)[:24]
        pillar_num = cluster["pillar"].split("_")[1]
        label = f"{cluster['cluster_id']} | P{pillar_num} | {folder_short} ({cluster['medoid_filename']})"
        draw.rectangle([(0, 0), (thumb_w, 28)], fill=(15, 23, 42))
        draw.text((8, 7), label, fill=(255, 255, 255))
        return cluster, im
    except Exception as e:
        print(f"  ! Could not read {src_path}: {e}")
        return cluster, None


def build_contact_sheet(candidates: list[dict], out_path: Path) -> None:
    thumb_w, thumb_h = 480, 270
    cols = min(3, max(1, len(candidates)))
    rows = (len(candidates) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb_w, rows * thumb_h), color=(30, 41, 59))

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(lambda c: load_thumbnail(c, thumb_w, thumb_h), candidates))

    for idx, (cl, thumb) in enumerate(results):
        if thumb is None:
            continue
        r = idx // cols
        c = idx % cols
        sheet.paste(thumb, (c * thumb_w, r * thumb_h))
        print(
            f"  [{cl['cluster_id']}] {cl['pillar']} | {cl['folder']}/{cl['medoid_filename']} (burst={cl['burst_size']})"
        )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path, "JPEG", quality=86, optimize=True)
    print(f"✓ Saved contact sheet ({len(candidates)} scenes) -> {out_path}")


def export_web_image(
    cluster: dict, dst_path: Path, target_w: int = 1200, target_h: int = 675, y_anchor: float = 0.38
) -> None:
    src_path = GDRIVE_ROOT / cluster["raw_rel_path"]
    with Image.open(src_path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        w, h = im.size
        target_ratio = target_w / target_h
        if (w / h) > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            im = im.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            top = int((h - new_h) * y_anchor)
            im = im.crop((0, top, w, top + new_h))
        im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # Subtle editorial color & tone balance
        im = ImageEnhance.Color(im).enhance(0.95)
        im = ImageEnhance.Contrast(im).enhance(1.04)
        arr = np.asarray(im, dtype=np.float32)
        arr = 4.0 + (arr / 255.0) * 247.0
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(
            dst_path, "JPEG", quality=88, optimize=True, progressive=True
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="DMF Drive Visual Curator CLI")
    parser.add_argument(
        "--pillars",
        type=str,
        default="",
        help="Comma-separated Pillar IDs (e.g. PILLAR_1_GERMANY_ARRIVAL_VISA_SUCCESS,PILLAR_3_GERMAN_DELEGATION_CULTURAL_EXCHANGE)",
    )
    parser.add_argument(
        "--folder-contains",
        type=str,
        default="",
        help="Substring filter on NFC-normalized folder path",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=6,
        help="Number of candidate clusters to sample",
    )
    parser.add_argument(
        "--contact-sheet",
        type=str,
        default="",
        help="Output path for visual contact sheet JPEG (e.g. /tmp/dmf_contact_sheet.jpg)",
    )
    parser.add_argument(
        "--export",
        type=str,
        default="",
        help="Comma-separated CLUSTER_ID:filename.jpg pairs to export",
    )
    parser.add_argument(
        "--out-dir",
        type=str,
        default=str(ROOT / "public" / "images" / "blog"),
        help="Target directory for exported web images",
    )
    args = parser.parse_args()

    catalog = load_catalog()
    ledger = load_ledger()
    all_clusters: list[dict] = catalog["clusters"]
    by_id = {c["cluster_id"]: c for c in all_clusters}

    if args.export:
        out_dir = Path(args.out_dir)
        pairs = [p.strip() for p in args.export.split(",") if ":" in p]
        for pair in pairs:
            cid, out_name = pair.split(":", 1)
            cid = cid.strip()
            out_name = out_name.strip()
            if cid not in by_id:
                raise KeyError(f"Unknown cluster_id: {cid}")
            cl = by_id[cid]
            dst = out_dir / out_name
            export_web_image(cl, dst)
            ledger[cid] = out_name
            print(
                f"✓ Exported {cid} ({cl['folder']}/{cl['medoid_filename']}) -> {dst} ({dst.stat().st_size // 1024} KB)"
            )
        save_ledger(ledger)
        return

    filtered = all_clusters
    if args.pillars:
        wanted = {p.strip() for p in args.pillars.split(",") if p.strip()}
        filtered = [c for c in filtered if c["pillar"] in wanted]
    if args.folder_contains:
        q = args.folder_contains.lower()
        filtered = [c for c in filtered if q in c["folder"].lower()]

    candidates = stride_sample_clusters(filtered, args.count, set(ledger.keys()))
    print(
        f"Selected {len(candidates)} diverse unused clusters (out of {len(filtered)} matching, {len(ledger)} already in ledger):"
    )
    if args.contact_sheet and candidates:
        build_contact_sheet(candidates, Path(args.contact_sheet))
    else:
        for cl in candidates:
            print(
                f"  [{cl['cluster_id']}] {cl['pillar']} | {cl['folder']}/{cl['medoid_filename']} (burst={cl['burst_size']})"
            )


if __name__ == "__main__":
    main()
