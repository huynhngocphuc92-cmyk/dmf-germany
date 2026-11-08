#!/usr/bin/env python3
"""
Step 1: Curate & Professionally Retouch the 18 Authentic DMF Covers
===================================================================
1. Extracts 18 distinct, clean real DMF photos from git commit 5d9f1b1
   (replacing the 5 covers that had Vietnamese banners or duplicate bursts).
2. Runs Codex GPT Image in Image Edit mode (`-i <file> -- "<prompt>"`) with
   `identity-preserve` and `lighting-weather` rules to preserve 100% of the
   real DMF staff/student faces while upgrading fluorescent classroom lighting,
   neutralizing cyan wall casts, cleaning clutter/placards, and adding subtle
   optical depth of field.
3. Saves 1200x675 progressive JPEGs to `public/images/blog/`.
"""

from __future__ import annotations

import concurrent.futures
import json
import re
import subprocess
import sys
import threading
import time
from pathlib import Path
from PIL import Image

ROOT = Path("/Users/chong/dmf-talents.de")
BLOG_DIR = ROOT / "public" / "images" / "blog"
RAW_DIR = Path("/tmp/dmf_authentic_raw_18")
STATE_FILE = ROOT / "scripts" / "dmf-retouch-state.json"
CODEX_BIN = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
GEN_ROOT = Path("/Users/chong/.codex/generated_images")

TARGET_W = 1200
TARGET_H = 675

lock = threading.Lock()

# Maps target blog cover filename -> (source filename in git commit 5d9f1b1, custom retouch instruction)
AUTHENTIC_RETOUCH_SPEC: dict[str, tuple[str, str]] = {
    "dmf-kooperationsmodell-deutsche-arbeitgeber-schritt-fuer-schritt.jpg": (
        "dmf-kooperationsmodell-deutsche-arbeitgeber-schritt-fuer-schritt.jpg",
        "Keep both men's exact facial features, glasses, hair, expressions, clothing, and handshake identical. "
        "Transform the harsh fluorescent classroom lighting into warm, natural German corporate documentary daylight (5200K), "
        "replace the cyan lower wall and wall stains with a clean warm architectural office wall, and add subtle f/2.8 depth of field.",
    ),
    "dmf-vietnam-unternehmensprofil-ausbildungsakademie-deutschland.jpg": (
        "dmf-wohnraum-azubi-unterkunft.jpg",
        "Keep the exact DMF Education reception lobby, the 3D 'DMF Education' wall logo, the German and Vietnamese desk flags, "
        "and the reception staff's exact faces and blue uniforms identical. Replace the cyan paint strip on the right wall with warm neutral architectural paneling, "
        "hide the black power cable on the left wall, and upgrade the lighting to bright, balanced 5200K architectural editorial daylight.",
    ),
    "dmf-gemeinschaft-kultur-integration-campus-leben-vietnam.jpg": (
        "dmf-gemeinschaft-kultur-integration-campus-leben-vietnam.jpg",
        "Keep the female German instructor holding the iPad, the German handwriting on the whiteboard ('Was möchtest du über Deutschland wissen?'), "
        "and the students' exact appearances identical. Remove the plastic iced-coffee cup and clutter on the wooden shelf, "
        "warm up the flat fluorescent lighting into soft directional window daylight (5200K), and add natural f/2.8 optical depth of field.",
    ),
    "dmf-sprachkurs-praxis-unterricht.jpg": (
        "dmf-lehrkraft-tafel.jpg",
        "Keep the senior German male teacher's exact face, glasses, patterned shirt, hand gesture, and the students in the foreground identical. "
        "Add subtle, realistic German B1/B2 grammar notes on the blank whiteboard behind him, remove the plastic water bottle on the right edge, "
        "and upgrade the flat fluorescent lighting to warm, natural classroom window daylight with gentle depth of field.",
    ),
    "dmf-fallstudie-hotellerie-zfa-thien-tuan-hoang-dung-erfolgsgeschichten.jpg": (
        "dmf-azubi-leben-in-deutschland.jpg",
        "Keep all three people's exact faces, glasses, hairstyles, clothing, and the modern German hotel lobby background 100% identical. "
        "Remove the two handheld cutout signs ('DMF' and '#Du học nghề Đức') so their hands rest naturally, "
        "and refine the interior hotel lighting with balanced natural dynamic range and subtle f/2.8 background separation.",
    ),
    "dmf-ankunft-onboarding-deutschland-30-tage-begleitung.jpg": (
        "dmf-azubi-ankunft-deutschland.jpg",
        "Keep both men's exact faces, glasses, beard, clothing, and the historic German sandstone cathedral behind them 100% identical. "
        "Upgrade the smartphone night-mode lighting into a clean, natural twilight documentary portrait with warm architectural illumination on the cathedral facade, "
        "natural skin tones, and subtle f/2.8 optical depth of field softening the scaffolding in the far right background.",
    ),
    "dmf-direkte-vertretung-deutschland-umit-elezov-arbeitgeberbetreuung.jpg": (
        "dmf-einwohnermeldeamt-anmeldung-wohnung.jpg",
        "Keep all three people's exact faces, glasses, smiles, clothing, and the young man holding the apartment keys in the center 100% identical. "
        "Remove the two handheld cutout signs ('#Du học nghề Đức' and 'DMF') so the woman on the left and the bearded man on the right have natural relaxed hands, "
        "and enhance the German apartment window daylight for a warm, authentic documentary look.",
    ),
    "dmf-fallstudie-industrie-handwerk-hoang-duy-ausbildung-meppen.jpg": (
        "dmf-fallstudie-industrie-handwerk-hoang-duy-ausbildung-meppen.jpg",
        "Keep the young Vietnamese trainee in glasses and the DMF coordinator in the dark polo shirt with the 'DMF' chest logo at the airport 100% identical. "
        "Clean up the distracting bright orange Vietnamese 'MEDIA BOOKING' ad screen in the upper background into a neutral modern international airport departure board, "
        "and balance the lighting to warm, natural documentary reportage quality.",
    ),
    "dmf-pflegeausbildung-vorbereitung-vietnam-sprachkompetenz-empathie.jpg": (
        "dmf-pflegeausbildung-vorbereitung-vietnam-sprachkompetenz-empathie.jpg",
        "Keep the young woman in the light-blue 'DMF Education' polo shirt, her exact face, warm smile, and the blue DMF folders in front of her 100% identical. "
        "Remove the metal cup with plastic lid on the glass table, replace the cyan wall paint behind the sofa with a warm neutral architectural wall tone, "
        "and upgrade the lighting to soft, flattering natural window light.",
    ),
    "dmf-praxisvorbereitung-gastronomie-hotellerie-bcis-vietnam.jpg": (
        "dmf-angebote-pruefung.jpg",
        "Keep the female German trainer on the left and the DMF students in blue 'DMF Education' polo shirts with laptops 100% identical. "
        "Remove the colorful toy mascots on the white shelf in the background, replace them with neat German textbooks, "
        "and upgrade the classroom lighting to warm, natural editorial daylight with gentle depth of field.",
    ),
    "dmf-quality-gate-entscheidungsfaehige-kandidatenprofile-video.jpg": (
        "dmf-direkte-vertretung-deutschland-umit-elezov-arbeitgeberbetreuung.jpg",
        "Keep the young Vietnamese candidate in the blue polo shirt and glasses conducting a video interview on his laptop and the foreground classmate 100% identical. "
        "Upgrade the lighting to warm, natural directional key light on the candidate's face and laptop workstation, "
        "with natural documentary color grading and refined optical depth of field.",
    ),
    "dmf-interview-coaching-achim-betticher-vorbereitung-vietnam.jpg": (
        "dmf-achim-fuehrung-seminar.jpg",
        "Keep the German coach in the center (white shirt, glasses) and the two instructors beside him, plus the attentive Vietnamese students in the classroom 100% identical. "
        "Remove the plastic iced-coffee cup on the front desk, replace the cyan wall stripe with a warm neutral corporate seminar room wall, "
        "ensure the seated German coach wears clean dark leather shoes at the bottom edge, and apply warm, balanced seminar lighting.",
    ),
    "dmf-deutschunterricht-intensivkurs-a1-b2-akademie-vietnam.jpg": (
        "dmf-deutschunterricht-intensivkurs-a1-b2-akademie-vietnam.jpg",
        "Keep the three Vietnamese students writing their German exam at the dark desks 100% identical. "
        "Replace the blown-out white wall and cyan lower wall strip on the right with a warm, softly lit architectural classroom wall, "
        "ensure the student in the back row wears clean sneakers, and apply natural 5200K window daylight.",
    ),
    "dmf-achim-interview-coaching.jpg": (
        "dmf-achim-interview-coaching.jpg",
        "Keep every person in the group (including the two German coaches and the Vietnamese DMF team and students) and the white villa building with the DMF logo 100% identical. "
        "Remove the handheld cutout signs ('DU HỌC THÔI!!') so the student in the center holds her hands naturally, "
        "soften the harsh midday shadows on their faces into balanced natural daylight, and give the sky a soft, natural European-style overcast blue tone.",
    ),
    "dmf-unterricht-materialien.jpg": (
        "dmf-unterricht-materialien.jpg",
        "Keep both female students studying their German textbook on the sofa 100% identical. "
        "Replace the bright cyan wall paint behind them with a warm neutral architectural study-lounge wall, remove the plastic cup in the top-left corner, "
        "and upgrade the lighting to soft, warm natural window daylight with natural skin tones.",
    ),
    "dmf-sprachuebung-tablet.jpg": (
        "dmf-sprachuebung-tablet.jpg",
        "Keep the tablet computer with German reading exercises, the keyboard with German umlaut keys (Ö, Ä, Ü), the printed German workbook, and the student's hand 100% identical. "
        "Refine the lighting to eliminate harsh glare on the black desk, warm up the tones into a crisp, high-end documentary close-up, and add subtle shallow depth of field.",
    ),
    "dmf-klassenzimmer.jpg": (
        "dmf-vietnam-unternehmensprofil-ausbildungsakademie-deutschland.jpg",
        "Keep the DMF classroom layout, wooden-back chairs, white desks, TV screen, whiteboard, and the 'GEWOHNHEITEN UND ROUTINEN' German poster 100% identical. "
        "Remove the small Vietnamese paper notice taped to the glass door on the left, replace the cyan lower wall paint with a warm architectural taupe/sand tone, "
        "and upgrade the lighting to warm, inviting natural daylight streaming through the classroom.",
    ),
    "dmf-ausreise-flughafen.jpg": (
        "dmf-ausreise-flughafen.jpg",
        "Keep the Vietnamese trainee in glasses with his luggage cart, his parents, and the DMF coordinator in the navy polo shirt at the airport 100% identical. "
        "Clean up the blue Vietnamese sign in the top-left corner into a neutral modern airport architecture panel, "
        "and upgrade the lighting to warm, balanced documentary reportage daylight with subtle background separation.",
    ),
}


def extract_raw_sources() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    for target_name, (git_src, _) in AUTHENTIC_RETOUCH_SPEC.items():
        data = subprocess.check_output(["git", "show", f"5d9f1b1:public/images/blog/{git_src}"])
        (RAW_DIR / target_name).write_bytes(data)


def load_state() -> dict[str, str]:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    # Pre-seed the already-verified prototype for #1
    proto_png = "/Users/chong/.codex/generated_images/01a1b92b-85ed-7791-9a33-3879c6457b7c/exec-56c493f2-79e7-4da5-acc9-fff8568c3204.png"
    initial: dict[str, str] = {}
    if Path(proto_png).exists():
        initial["dmf-kooperationsmodell-deutsche-arbeitgeber-schritt-fuer-schritt.jpg"] = proto_png
        crop_and_save_16_9(
            Path(proto_png),
            BLOG_DIR / "dmf-kooperationsmodell-deutsche-arbeitgeber-schritt-fuer-schritt.jpg",
        )
    STATE_FILE.write_text(json.dumps(initial, indent=2))
    return initial


def save_state(state: dict[str, str]) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2, sort_keys=True))


def crop_and_save_16_9(src_png: Path, dst_jpg: Path, y_anchor: float = 0.40) -> None:
    with Image.open(src_png) as im:
        im = im.convert("RGB")
        w, h = im.size
        target_ratio = TARGET_W / TARGET_H
        current_ratio = w / h
        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            cropped = im.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            max_top = h - new_h
            top = int(max_top * y_anchor)
            cropped = im.crop((0, top, w, top + new_h))
        resized = cropped.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
        resized.save(dst_jpg, "JPEG", quality=88, optimize=True, progressive=True)


def retouch_one(filename: str, instruction: str, idx: int, total: int) -> tuple[str, str | None]:
    raw_input = RAW_DIR / filename
    full_prompt = (
        "Do not read SKILL.md or run any shell commands. Directly call the built-in image_gen tool once "
        "in edit mode on the attached input photograph (size 1536x1024, high quality). "
        "Use case: identity-preserve and lighting-weather professional post-production retouch. "
        f"{instruction} "
        "Ensure the result looks like an authentic, unposed documentary photograph taken with a full-frame camera, "
        "with natural skin texture and zero AI plastic sheen. Reply ONLY with the saved file path."
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
                    "-i",
                    str(raw_input),
                    "--",
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
                crop_and_save_16_9(png_path, dst_jpg, y_anchor=0.40)
                kb = dst_jpg.stat().st_size / 1024
                print(
                    f"[Step 1: {idx}/{total}] ✓ Retouched {filename} ({kb:.0f} KB) <- {png_path.name}",
                    flush=True,
                )
                return filename, str(png_path)

            print(
                f"[Step 1: {idx}/{total}] ! Attempt {attempt} produced no image for {filename}, retrying...",
                flush=True,
            )
        except subprocess.TimeoutExpired:
            print(f"[Step 1: {idx}/{total}] ! Timeout on attempt {attempt} for {filename}", flush=True)
        except Exception as e:
            print(f"[Step 1: {idx}/{total}] ! Error on attempt {attempt} for {filename}: {e}", flush=True)

        time.sleep(3 * attempt)

    print(f"[Step 1: {idx}/{total}] ✗ FAILED after 3 attempts: {filename}", flush=True)
    return filename, None


def main() -> None:
    max_workers = int(sys.argv[1]) if len(sys.argv) > 1 else 6
    extract_raw_sources()
    state = load_state()

    pending = [
        (fname, instr)
        for fname, (_, instr) in AUTHENTIC_RETOUCH_SPEC.items()
        if fname not in state or not (BLOG_DIR / fname).exists()
    ]
    total = len(AUTHENTIC_RETOUCH_SPEC)
    done_count = total - len(pending)
    print(
        f"=== Step 1 (DMF Authentic Retouch): {done_count}/{total} done, {len(pending)} pending (workers={max_workers}) ===",
        flush=True,
    )

    if not pending:
        print("All 18 authentic DMF covers are already retouched and saved!")
        return

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {}
        for offset, (fname, instr) in enumerate(pending, start=done_count + 1):
            fut = pool.submit(retouch_one, fname, instr, offset, total)
            futures[fut] = fname

        for fut in concurrent.futures.as_completed(futures):
            fname, src_png = fut.result()
            if src_png:
                with lock:
                    state[fname] = src_png
                    save_state(state)

    print(f"\n=== Completed {len(state)}/{total} retouched DMF covers ===", flush=True)


if __name__ == "__main__":
    main()
