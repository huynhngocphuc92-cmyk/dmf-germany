#!/usr/bin/env python3
"""
DMF Google Drive Visual Catalog & Burst-Cluster Indexer
=======================================================
Scans the entire DMF Google Drive (`12,889+` images across `278` folders) in <0.3s
using macOS APFS Unicode NFC normalization and metadata stat calls (zero network download).
1. Filters out off-brand/personal folders (`BLACKLIST_OFF_BRAND`).
2. Classifies all on-brand folders into the 8 Strategic DMF Visual Pillars.
3. Compresses continuous camera bursts (shots within 20s in the same folder) into
   distinct Scene Clusters (`C0001`..`Cxxxx`) and picks the middle (medoid) frame.
4. Saves `.agents/skills/dmf-drive-visual-curator/resources/dmf-drive-catalog.json`.
"""

from __future__ import annotations

import json
import os
import time
import unicodedata
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/chong/dmf-talents.de")
SKILL_DIR = ROOT / ".agents" / "skills" / "dmf-drive-visual-curator"
RES_DIR = SKILL_DIR / "resources"
CATALOG_FILE = RES_DIR / "dmf-drive-catalog.json"

GDRIVE_ROOT = Path(
    "/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Drive của tôi"
)
IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"}


def classify_folder(rel_path: str) -> tuple[str, str]:
    p = unicodedata.normalize("NFC", rel_path).lower()
    if any(
        k in p
        for k in [
            "bắp-dmf",
            "sinh nhật đại tỷ",
            "tiếp sức mùa thi",
            "uni fair",
            "outsource design",
            "file học makerting",
            "buổi phát brochure",
        ]
    ):
        return (
            "BLACKLIST_OFF_BRAND",
            "Off-brand personal photos or high-school fair leaflet booths",
        )
    if any(
        k in p
        for k in [
            "thiện tuấn",
            "hoàng dung",
            "hoàng duy",
            "nhận visa",
            "sân bay",
            "/duy",
            "phạm anh xuân",
            "nguyễn hoàng phúc",
            "trần hoàng minh",
            "bùi thị lan anh",
            "khánh vy",
            "thành nghĩa",
            "việt vũ",
            "hồ sơ dhn",
        ]
    ):
        return (
            "PILLAR_1_GERMANY_ARRIVAL_VISA_SUCCESS",
            "Visa grant, airport departure & real arrival/settling-in life in Germany",
        )
    if any(k in p for k in ["achim", "ralf", "heiko"]):
        return (
            "PILLAR_2_GERMAN_EXPERTS_INTERVIEW_COACHING",
            "German experts (Herr Achim Betticher, Herr Ralf, Herr Heiko) coaching candidates",
        )
    if any(k in p for k in ["đoàn đức", "tamara", "jasmin", "zehra"]):
        return (
            "PILLAR_3_GERMAN_DELEGATION_CULTURAL_EXCHANGE",
            "German delegation & native teachers (Tilman, Melda, Sevil, Tamara) at DMF",
        )
    if any(k in p for k in ["thầy lộc", "thầy khang", "dmf teacher", "cô hạnh"]):
        return (
            "PILLAR_4_INTENSIVE_GERMAN_FACULTY",
            "DMF intensive A1-B2 German faculty (Thầy Lộc, Thầy Khang, Cô Hạnh, Native Teachers)",
        )
    if any(
        k in p
        for k in [
            "k50",
            "k49",
            "k41",
            "k35",
            "k32",
            "k30",
            "k28",
            "k27",
            "k24",
            "k20",
            "k14",
            "k9,23",
            "k7.23",
            "k12.23",
            "lớp 2023",
            "lop sg",
            "máy ảnh",
            "may anh",
            "học viên phỏng vấn",
            "hiếu",
            "hieu",
            "huy",
            "đạt",
            "khanh",
        ]
    ):
        return (
            "PILLAR_5_CLASSROOM_COHORTS_STUDY_LIFE",
            "Cohorts K14-K50 daily study, exams, tablet practice & mock interviews",
        )
    if any(k in p for k in ["profile"]):
        return (
            "PILLAR_6_CANDIDATE_PORTRAITS_DOSSIERS",
            "Studio candidate portraits and application dossier photos",
        )
    if any(
        k in p
        for k in [
            "cơ sở vật chất",
            "ảnh trung tâm",
            "hình ảnh của trang web",
            "nhận diện dmf",
            "logo",
        ]
    ):
        return (
            "PILLAR_7_CAMPUS_FACILITIES_BRANDING",
            "DMF Academy reception, classrooms, library & institutional branding",
        )
    if any(
        k in p
        for k in [
            "tết",
            "tet",
            "giáng sinh",
            "dã ngoại",
            "open day",
            "vui chơi",
            "100_fuji",
            "khác",
        ]
    ):
        return (
            "PILLAR_8_COMMUNITY_CULTURE_EVENTS",
            "DMF Talents community life, outdoor retreats, German Christmas & cultural events",
        )
    return (
        "PILLAR_5_CLASSROOM_COHORTS_STUDY_LIFE",
        "DMF Academy classroom and student activities",
    )


def main() -> None:
    t0 = time.time()
    RES_DIR.mkdir(parents=True, exist_ok=True)

    raw_records = []
    blacklisted_count = 0
    total_scanned = 0

    for root, _, files in os.walk(GDRIVE_ROOT):
        rel_folder = os.path.relpath(root, GDRIVE_ROOT)
        pillar, pillar_desc = classify_folder(rel_folder)
        img_files = sorted(f for f in files if os.path.splitext(f)[1] in IMG_EXTS)
        if not img_files:
            continue

        total_scanned += len(img_files)
        if pillar == "BLACKLIST_OFF_BRAND":
            blacklisted_count += len(img_files)
            continue

        for fname in img_files:
            full_path = os.path.join(root, fname)
            try:
                st = os.stat(full_path)
                # Skip tiny corrupt files (<15 KB)
                if st.st_size < 15_000:
                    continue
                raw_records.append(
                    {
                        "pillar": pillar,
                        "pillar_desc": pillar_desc,
                        "folder": unicodedata.normalize("NFC", rel_folder),
                        "raw_folder": rel_folder,
                        "filename": fname,
                        "size_bytes": st.st_size,
                        "mtime": st.st_mtime,
                    }
                )
            except Exception:
                pass

    # Group into burst/scene clusters (same folder + mtime within 20s, max 25 frames per burst)
    clusters = []
    for rec in raw_records:
        if not clusters:
            clusters.append([rec])
            continue
        prev_cluster = clusters[-1]
        last_rec = prev_cluster[-1]
        if (
            rec["raw_folder"] == last_rec["raw_folder"]
            and abs(rec["mtime"] - last_rec["mtime"]) <= 20.0
            and len(prev_cluster) < 25
        ):
            prev_cluster.append(rec)
        else:
            clusters.append([rec])

    catalog_clusters = []
    pillar_summary = Counter()

    for idx, cl in enumerate(clusters, start=1):
        cid = f"C{idx:04d}"
        medoid = cl[len(cl) // 2]
        pillar_summary[medoid["pillar"]] += 1
        catalog_clusters.append(
            {
                "cluster_id": cid,
                "pillar": medoid["pillar"],
                "folder": medoid["folder"],
                "raw_rel_path": os.path.join(medoid["raw_folder"], medoid["filename"]),
                "medoid_filename": medoid["filename"],
                "burst_size": len(cl),
                "size_kb": round(medoid["size_bytes"] / 1024, 1),
                "captured_at": datetime.fromtimestamp(
                    medoid["mtime"], tz=timezone.utc
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "all_filenames": [r["filename"] for r in cl],
            }
        )

    payload = {
        "generated_at": datetime.now(tz=timezone.utc).isoformat(),
        "gdrive_root": str(GDRIVE_ROOT),
        "total_images_scanned": total_scanned,
        "blacklisted_off_brand_images": blacklisted_count,
        "total_on_brand_images": len(raw_records),
        "total_scene_clusters": len(catalog_clusters),
        "clusters_by_pillar": dict(sorted(pillar_summary.items())),
        "clusters": catalog_clusters,
    }

    CATALOG_FILE.write_text(json.dumps(payload, indent=2, ensure_ascii=False))
    elapsed = time.time() - t0
    print(f"✓ Indexed {total_scanned} Drive images in {elapsed:.2f}s:")
    print(f"  - On-brand authentic DMF images : {len(raw_records)}")
    print(f"  - Blacklisted off-brand images  : {blacklisted_count}")
    print(f"  - Distinct Scene/Burst Clusters : {len(catalog_clusters)}")
    for p, cnt in sorted(pillar_summary.items()):
        print(f"    • {p}: {cnt} scene clusters")
    print(f"  - Saved catalog to: {CATALOG_FILE}")


if __name__ == "__main__":
    main()
