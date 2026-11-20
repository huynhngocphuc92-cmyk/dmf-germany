#!/usr/bin/env python3
"""
Generate & Verify 15 Unique 16:9 Documentary Hero Covers (1200x675 Progressive JPEG) for Phase 13 (Posts 159–173).
=================================================================================================================
Renders unposed German B2B documentary workplace scenes via Codex GPT Image (`photorealistic-natural`),
applies `de_ai_sensor_emulation` (12% primary desaturation + documentary matte curve [6..249] +
midtone-weighted ISO 400 monochromatic luminance grain sigma=2.4), falls back ONLY if needed to an unused
high-res Drive cluster NOT in `used-clusters-ledger.json` or the 42 inline clusters, and verifies:
1. All 15 exact cover filenames exist in `public/images/blog/` at 1200x675 JPEG.
2. All MD5 hashes are unique across all blog covers.
3. Perceptual MAE >= 18.0 against EVERY other cover in `public/images/blog/`.
"""

from __future__ import annotations

import concurrent.futures
import hashlib
import json
import re
import subprocess
import sys
import threading
import time
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageOps

ROOT = Path("/Users/chong/dmf-talents.de")
BLOG_DIR = ROOT / "public" / "images" / "blog"
STATE_FILE = ROOT / "scripts" / "phase13-covers-state.json"
CODEX_BIN = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
GEN_ROOT = Path("/Users/chong/.codex/generated_images")
SKILL_DIR = ROOT / ".agents" / "skills" / "dmf-drive-visual-curator"
CATALOG_FILE = SKILL_DIR / "resources" / "dmf-drive-catalog.json"
LEDGER_FILE = SKILL_DIR / "resources" / "used-clusters-ledger.json"
GDRIVE_ROOT = Path("/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Drive của tôi")

TARGET_W = 1200
TARGET_H = 675
MIN_MAE = 18.0

lock = threading.Lock()

PHASE13_COVER_PROMPTS: dict[str, str] = {
    "dmf-p13-saison-zav-kontingent-gastronomie-landwirtschaft.jpg": (
        "Camera archetype: Unposed Observer-View Workplace Moment (35mm f/5.6 shot across a bright German boutique hotel lobby/kitchen pass, neutral workplace lighting). "
        "Scene: Two Vietnamese hospitality seasonal staff wearing crisp kitchen/service uniforms reviewing a shift schedule tablet together with a German hotel operations manager in a bright modern German hotel restaurant."
    ),
    "dmf-p13-ferienbeschaeftigung-unterkunft-compliance-2027.jpg": (
        "Camera archetype: Wide Environmental Reportage (28mm f/8 wide exterior courtyard shot under pale 5500K overcast Northern German sky, cool slate-grey paving stones and brick facade). "
        "Scene: A German seasonal operations manager in a dark windbreaker handing apartment keys and a printed safety house-rules binder to two young Vietnamese seasonal university students holding backpacks outside a tidy red-brick German staff guesthouse."
    ),
    "dmf-p13-stammkraefte-wiederkehrer-uebergang.jpg": (
        "Camera archetype: Unposed Observer-View Workplace Moment (35mm f/5.6 shot from across a dark-wood German hotel reception hall in soft overcast lobby daylight). "
        "Scene: A returning Vietnamese hospitality specialist in tailored dark hotel reception attire speaking with a German hotel director across a solid-oak front desk while reviewing a career qualification folder."
    ),
    "dmf-p13-tvoed-avr-pflege-eingruppierung.jpg": (
        "Camera archetype: Candid Workplace Consultation (35mm f/5.6 inside a bright German hospital ward administration office, neutral 4500K fluorescent and daylight mix). "
        "Scene: A German nursing director (Pflegedienstleitung) in smart-casual clinic attire explaining a printed tariff wage table and ward shift roster to two Vietnamese nurses wearing teal and white hospital scrubs."
    ),
    "dmf-p13-3-jahres-tco-direktrekrutierung-headhunter.jpg": (
        "Camera archetype: Documentary Executive Boardroom Moment (35mm f/5.6 inside a pale-grey glass-walled German Mittelstand conference room under overcast daylight). "
        "Scene: A German CFO in a charcoal suit and an HR Director seated at a matte-ash conference table comparing a 36-month personnel budget spreadsheet on a laptop alongside printed financial tables and porcelain espresso cups."
    ),
    "dmf-p13-aevo-ausbildungsbefugnis-bbig-betrieb.jpg": (
        "Camera archetype: Candid Solo/Duo Workshop Action (35mm f/5.6 in a German industrial training workshop with steel-framed factory windows and matte concrete floor). "
        "Scene: A senior German Handwerksmeister wearing a navy workshop coat and a young Vietnamese industrial apprentice leaning over a sturdy timber workbench to inspect an engineering drawing and an open spiral-bound training logbook."
    ),
    "dmf-chemikant-pharmakant-produktion-labor.jpg": (
        "Camera archetype: Industrial Documentary Reportage (28mm f/5.6 inside a clean stainless-steel German pharmaceutical/chemical production hall under cool white industrial LEDs). "
        "Scene: Two chemical process technicians wearing crisp light-blue protective coats, clear safety goggles, and white helmets inspecting digital process control readouts beside brushed stainless-steel reactor piping and pressure gauges."
    ),
    "dmf-hoerakustik-orthopaedietechnik-werkstatt.jpg": (
        "Camera archetype: Technical Hands & Precision Craft Close-up (50mm f/4 macro-documentary framing under warm-neutral articulated workbench lamp against dark slate workshop tools). "
        "Scene: An orthopedic technician's skilled hands carefully calibrating a carbon-fiber lower-leg orthosis hinge and measuring custom component tolerances with steel digital vernier calipers on a wooden German workshop bench, no faces visible."
    ),
    "dmf-kunststoff-spritzguss-verfahrensmechaniker.jpg": (
        "Camera archetype: Candid Industrial Shopfloor Action (35mm f/5.6 three-quarter side angle inside a German plastics injection-molding manufacturing hall, grey floor markings). "
        "Scene: A Vietnamese plastics process technician in dark-grey work trousers and navy polo checking a freshly molded black precision polymer housing under industrial overhead lighting next to a large green-and-grey injection-molding machine and PLC screen."
    ),
    "dmf-zsef-nuernberg-bayern-behoerden-dossier.jpg": (
        "Camera archetype: Documentary German HR Office Scene (35mm f/5.6, warm-neutral office interior with dual monitors and subtle blue-grey wall tones). "
        "Scene: A Bavarian clinic HR specialist and nursing coordinator at a sit-stand oak desk reviewing an online § 81a digital submission portal on dual widescreen monitors alongside stacked grey Leitz lever-arch binders."
    ),
    "dmf-zfe-nrw-bonn-behoerden-koordination.jpg": (
        "Camera archetype: Unposed Observer-View Office Moment (35mm f/5.6 through a partially open glass office partition in North Rhine-Westphalia, overcast daylight from tall windows). "
        "Scene: Two German hospital HR managers seated across a bright beechwood table sorting stamped recognition dossiers, qualification checklists, and a laptop showing administrative workflow stages."
    ),
    "dmf-ihk-fosa-hwk-anerkennung-dokumente.jpg": (
        "Camera archetype: Documentary German Office Desk & Dossier Close-up (50mm f/5.6 high-angle overhead/three-quarter view, NO faces or people, dark walnut desk surface). "
        "Scene: Notarized German vocational certificate translations in translucent sleeves, an official curriculum binder (Ausbildungsrahmenplan), a wooden date stamp, fountain pen, and open matte-black laptop on a lived-in German desk."
    ),
    "dmf-p13-gesellenpruefung-pflegeexamen-azubis.jpg": (
        "Camera archetype: Candid Vocational Study Session (35mm f/5.6 inside a sunlit German vocational exam prep room with pale green acoustic wall panels). "
        "Scene: A German vocational instructor and a Vietnamese final-year apprentice seated side-by-side at a study table marking technical exam drawings and clinical case study flashcards with highlighters."
    ),
    "dmf-p13-arbeitgeberwechsel-zusatzblatt-eat.jpg": (
        "Camera archetype: Documentary HR Onboarding Desk (35mm f/4 three-quarter view across a minimalist white German HR reception desk with potted green ficus). "
        "Scene: A German HR specialist holding an open employment contract folder while reviewing residence-title paperwork and supplemental compliance sheets with a young Vietnamese skilled professional seated opposite."
    ),
    "dmf-p13-ergotherapeuten-pta-reha-apotheke.jpg": (
        "Camera archetype: Clean German Healthcare & Pharmacy Reportage (35mm f/5.6 inside a bright modern German hospital pharmacy compounding lab, crisp white tiles and glass cabinetry). "
        "Scene: A Vietnamese pharmacy technician (PTA) in a crisp white lab coat and nitrile gloves collaborating with a senior German pharmacist checking glass measuring flasks and formulation records on a stainless-steel bench."
    ),
}


def de_ai_sensor_emulation(src_img_path: Path, dst_jpg: Path, y_anchor: float = 0.35) -> None:
    """
    Crops to 1200x675 (16:9) and applies optical sensor emulation:
    1. Reduces digital primary oversaturation by 12%
    2. Applies a subtle documentary matte tone curve [6..249]
    3. Adds deterministic midtone-weighted ISO 400 monochromatic luminance grain (sigma=2.4)
    """
    with Image.open(src_img_path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        w, h = im.size
        target_ratio = TARGET_W / TARGET_H
        current_ratio = w / h
        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            im = im.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            top = int((h - new_h) * y_anchor)
            im = im.crop((0, top, w, top + new_h))
        im = im.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)

        im = ImageEnhance.Color(im).enhance(0.88)
        arr = np.asarray(im, dtype=np.float32)
        arr = 6.0 + (arr / 255.0) * 243.0

        seed = abs(hash(dst_jpg.name)) % (2**31)
        rng = np.random.default_rng(seed)
        lum = arr.mean(axis=2, keepdims=True) / 255.0
        midtone_weight = 1.0 - np.abs(lum - 0.5) * 1.4
        grain = rng.normal(0.0, 2.4, size=(TARGET_H, TARGET_W, 1)).astype(np.float32) * midtone_weight
        arr = np.clip(arr + grain, 0, 255).astype(np.uint8)

        out = Image.fromarray(arr, mode="RGB")
        out.save(dst_jpg, "JPEG", quality=88, optimize=True, progressive=True)


def get_thumb(img: Image.Image) -> list[tuple[int, int, int]]:
    small = img.convert("RGB").resize((32, 18), Image.Resampling.BILINEAR)
    return list(small.getdata())


def mae(p1: list[tuple[int, int, int]], p2: list[tuple[int, int, int]]) -> float:
    return sum(
        abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])
        for a, b in zip(p1, p2)
    ) / (len(p1) * 3)


def load_state() -> dict[str, str]:
    state: dict[str, str] = {}
    if STATE_FILE.exists():
        try:
            state = json.loads(STATE_FILE.read_text())
        except Exception:
            state = {}
    # Pre-seed the verified prototype for Post 159 if present
    seed_p159 = "/Users/chong/.codex/generated_images/01a1ed0d-a12d-7b42-9ceb-d7e0ad743f7a/exec-a29d3ce0-45bd-4a96-9221-88c42bd1b263.png"
    p159_name = "dmf-p13-saison-zav-kontingent-gastronomie-landwirtschaft.jpg"
    if p159_name not in state and Path(seed_p159).exists():
        state[p159_name] = seed_p159
        de_ai_sensor_emulation(Path(seed_p159), BLOG_DIR / p159_name)
        save_state(state)
    return state


def save_state(state: dict[str, str]) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2, sort_keys=True))


def render_one(filename: str, scene_desc: str, idx: int, total: int) -> tuple[str, str | None]:
    full_prompt = (
        "Do not read SKILL.md or run any shell commands. Directly call the built-in image_gen tool once "
        "to generate a single 1536x1024 unposed German documentary photojournalism photograph. "
        "Use case: photorealistic-natural (Handelsblatt / Der Spiegel reportage style). "
        f"{scene_desc} "
        "Constraints: natural 5500K overcast Northern European daylight or neutral workplace fluorescent lighting, "
        "deep f/5.6 depth of field where background equipment/architecture remains legible, real human skin texture with pores, "
        "slightly wrinkled or lived-in workwear, NO golden-hour rim light, NO glossy advertising polish, "
        "NO text overlays, NO watermarks. Reply ONLY with the saved file path."
    )

    for attempt in range(1, 4):
        try:
            proc = subprocess.run(
                [
                    CODEX_BIN,
                    "exec",
                    "--ephemeral",
                    "-c",
                    'model_reasoning_effort="low"',
                    "-s",
                    "read-only",
                    full_prompt,
                ],
                cwd=str(ROOT),
                capture_output=True,
                text=True,
                timeout=240,
            )
            combined = (proc.stdout or "") + "\n" + (proc.stderr or "")
            matches = re.findall(
                r"(/Users/chong/\.codex/generated_images/[^\s\"'<>]+\.png)", combined
            )
            png_path = None
            for m in reversed(matches):
                p = Path(m)
                if p.exists() and p.stat().st_size > 50_000:
                    png_path = p
                    break

            if png_path is None:
                sid_match = re.search(r"session id:\s*([0-9a-fA-F-]+)", combined)
                if sid_match:
                    sdir = GEN_ROOT / sid_match.group(1)
                    if sdir.exists():
                        pngs = sorted(sdir.glob("*.png"), key=lambda x: x.stat().st_mtime)
                        if pngs:
                            png_path = pngs[-1]

            if png_path and png_path.exists():
                dst_jpg = BLOG_DIR / filename
                de_ai_sensor_emulation(png_path, dst_jpg, y_anchor=0.35)
                kb = dst_jpg.stat().st_size / 1024
                print(
                    f"[{idx}/{total}] ✓ Rendered {filename} ({kb:.0f} KB) <- {png_path.name}",
                    flush=True,
                )
                return filename, str(png_path)

            print(
                f"[{idx}/{total}] ! Attempt {attempt} produced no image for {filename}, retrying...",
                flush=True,
            )
        except subprocess.TimeoutExpired:
            print(f"[{idx}/{total}] ! Timeout on attempt {attempt} for {filename}, retrying...", flush=True)
        except Exception as e:
            print(f"[{idx}/{total}] ! Error on attempt {attempt} for {filename}: {e}", flush=True)

        time.sleep(3 * attempt)

    print(f"[{idx}/{total}] ✗ Codex failed after 3 attempts: {filename}", flush=True)
    return filename, None


def drive_fallback_for_missing(missing_filenames: list[str], existing_thumbs: dict[str, list[tuple[int, int, int]]]) -> None:
    if not missing_filenames:
        return
    catalog = json.loads(CATALOG_FILE.read_text())
    ledger = json.loads(LEDGER_FILE.read_text())
    used_ids = set(ledger.keys())
    unused_clusters = [c for c in catalog["clusters"] if c["cluster_id"] not in used_ids]

    for fname in missing_filenames:
        placed = False
        for cl in unused_clusters:
            src = GDRIVE_ROOT / cl["raw_rel_path"]
            if not src.exists():
                continue
            try:
                dst = BLOG_DIR / fname
                de_ai_sensor_emulation(src, dst, y_anchor=0.38)
                with Image.open(dst) as im:
                    thumb = get_thumb(im)
                if all(mae(thumb, ext) >= MIN_MAE for ext in existing_thumbs.values()):
                    existing_thumbs[fname] = thumb
                    used_ids.add(cl["cluster_id"])
                    print(f"✓ Fallback assigned {fname} <- {cl['cluster_id']}")
                    placed = True
                    break
            except Exception:
                continue
        if not placed:
            raise RuntimeError(f"Could not find unique fallback Drive cluster for {fname}")


def verify_all_covers() -> None:
    print("\n=== Verifying all 15 Phase 13 Covers ===")
    all_blog_jpgs = sorted(BLOG_DIR.glob("*.jpg"))
    thumbs: dict[str, list[tuple[int, int, int]]] = {}
    md5_map: dict[str, str] = {}
    errors: list[str] = []

    for jpg in all_blog_jpgs:
        md5 = hashlib.md5(jpg.read_bytes()).hexdigest()
        if md5 in md5_map:
            errors.append(f"Duplicate MD5: {jpg.name} == {md5_map[md5]}")
        else:
            md5_map[md5] = jpg.name
        with Image.open(jpg) as im:
            thumbs[jpg.name] = get_thumb(im)

    for fname in PHASE13_COVER_PROMPTS:
        p = BLOG_DIR / fname
        if not p.exists():
            errors.append(f"Missing Phase 13 cover: {fname}")
            continue
        with Image.open(p) as im:
            if im.size != (TARGET_W, TARGET_H) or im.format != "JPEG":
                errors.append(f"Invalid size/format for {fname}: {im.size} {im.format}")
        t_cur = thumbs[fname]
        min_mae_val = 999.0
        closest = ""
        for other_name, t_other in thumbs.items():
            if other_name == fname:
                continue
            d = mae(t_cur, t_other)
            if d < min_mae_val:
                min_mae_val = d
                closest = other_name
            if d < MIN_MAE:
                errors.append(f"MAE < {MIN_MAE}: {fname} vs {other_name} (MAE={d:.2f})")
        print(f"  ✓ {fname}: 1200x675 JPEG, min MAE={min_mae_val:.2f} (closest: {closest})")

    if errors:
        print("\n❌ COVER VERIFICATION ERRORS:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)

    print(f"\n🏆 ALL 15 PHASE 13 COVERS VERIFIED (1200x675, unique MD5, all MAE >= {MIN_MAE} across {len(all_blog_jpgs)} blog JPEGs)!")


def main() -> None:
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    verify_only = "--verify-only" in sys.argv
    max_workers = 6

    state = load_state()
    if not verify_only:
        pending = [
            (fname, desc)
            for fname, desc in PHASE13_COVER_PROMPTS.items()
            if fname not in state or not (BLOG_DIR / fname).exists()
        ]
        total = len(PHASE13_COVER_PROMPTS)
        done_count = total - len(pending)
        print(f"=== Phase 13 Documentary Covers: {done_count}/{total} ready, {len(pending)} pending ===", flush=True)

        if pending:
            with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:
                futures = {
                    pool.submit(render_one, fname, desc, idx, total): fname
                    for idx, (fname, desc) in enumerate(pending, start=done_count + 1)
                }
                for fut in concurrent.futures.as_completed(futures):
                    fname, src_png = fut.result()
                    if src_png:
                        with lock:
                            state[fname] = src_png
                            save_state(state)

        still_missing = [fname for fname in PHASE13_COVER_PROMPTS if not (BLOG_DIR / fname).exists()]
        if still_missing:
            print(f"Running Drive fallback for {len(still_missing)} failed slot(s): {still_missing}")
            existing_thumbs = {}
            for jpg in BLOG_DIR.glob("*.jpg"):
                with Image.open(jpg) as im:
                    existing_thumbs[jpg.name] = get_thumb(im)
            drive_fallback_for_missing(still_missing, existing_thumbs)

    verify_all_covers()


if __name__ == "__main__":
    main()
