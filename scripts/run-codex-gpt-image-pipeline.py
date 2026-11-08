#!/usr/bin/env python3
"""
Step 2: Parallel Orchestrator for De-AI Documentary Reportage Blog Covers + Optical Sensor Emulation
====================================================================================================
Renders all 128 specialized B2B blog covers (2 prototypes pre-seeded, 126 remaining)
across 5 Documentary Camera Archetypes using Codex GPT Image (`photorealistic-natural`),
crops each 1536x1024 output to 1200x675 (16:9), applies `de_ai_sensor_emulation`
(12% primary desaturation + documentary matte curve [6..249] + midtone-weighted ISO 400
monochromatic luminance grain sigma=2.4), and saves to `public/images/blog/`.
"""

from __future__ import annotations

import concurrent.futures
import importlib.util
import json
import re
import subprocess
import sys
import threading
import time
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path("/Users/chong/dmf-talents.de")
BLOG_DIR = ROOT / "public" / "images" / "blog"
STATE_FILE = ROOT / "scripts" / "gpt-image-de-ai-state.json"
CODEX_BIN = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
GEN_ROOT = Path("/Users/chong/.codex/generated_images")

TARGET_W = 1200
TARGET_H = 675

lock = threading.Lock()


def load_prompts() -> dict[str, str]:
    spec = importlib.util.spec_from_file_location(
        "manifest", ROOT / "scripts" / "build-gpt-image-manifest.py"
    )
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.GPT_IMAGE_PROMPTS


def de_ai_sensor_emulation(src_png: Path, dst_jpg: Path, y_anchor: float = 0.35) -> None:
    """
    Crops 1536x1024 -> 1200x675 and applies optical sensor emulation:
    1. Reduces digital primary oversaturation by 12%
    2. Applies a subtle documentary matte tone curve (lifts pure 0 blacks to 6, rolls off 255 whites to 249)
    3. Adds subtle midtone-weighted monochromatic luminance grain (ISO 400 Leica/Canon reportage feel)
    """
    with Image.open(src_png) as im:
        im = im.convert("RGB")
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

        # 1. Tame digital saturation (-12%)
        im = ImageEnhance.Color(im).enhance(0.88)

        # 2. Documentary matte curve + ISO 400 monochromatic luminance grain
        arr = np.asarray(im, dtype=np.float32)
        arr = 6.0 + (arr / 255.0) * 243.0

        # Deterministic seed per filename so builds are reproducible
        seed = abs(hash(dst_jpg.name)) % (2**31)
        rng = np.random.default_rng(seed)
        lum = arr.mean(axis=2, keepdims=True) / 255.0
        midtone_weight = 1.0 - np.abs(lum - 0.5) * 1.4
        grain = rng.normal(0.0, 2.4, size=(TARGET_H, TARGET_W, 1)).astype(np.float32) * midtone_weight
        arr = np.clip(arr + grain, 0, 255).astype(np.uint8)

        out = Image.fromarray(arr, mode="RGB")
        out.save(dst_jpg, "JPEG", quality=88, optimize=True, progressive=True)


def load_state() -> dict[str, str]:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    # Pre-seed the 2 De-AI Documentary prototypes already rendered & verified
    initial: dict[str, str] = {}
    protos = {
        "dmf-hamburg-schleswig-holstein-hafen-pflege-gastronomie.jpg": "/Users/chong/.codex/generated_images/01a1b928-8310-75b1-85e3-4b4b481f0f3a/exec-d63c0054-01ac-486e-8cec-4568fce1cf4c.png",
        "dmf-dachdecker-solar-fassadenbau.jpg": "/Users/chong/.codex/generated_images/01a1b928-8310-75b1-85e3-4b4b481f0f3a/exec-f0bca6bb-9f16-4a36-8718-b33b0b1dbb30.png",
    }
    for fname, ppath in protos.items():
        if Path(ppath).exists():
            initial[fname] = ppath
            de_ai_sensor_emulation(Path(ppath), BLOG_DIR / fname)
    STATE_FILE.write_text(json.dumps(initial, indent=2))
    return initial


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
        "slightly wrinkled or dust/grease-marked workwear, NO golden-hour rim light, NO glossy advertising polish, "
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
                    f"[Step 2: {idx}/{total}] ✓ De-AI {filename} ({kb:.0f} KB) <- {png_path.name}",
                    flush=True,
                )
                return filename, str(png_path)

            print(
                f"[Step 2: {idx}/{total}] ! Attempt {attempt} produced no image for {filename}, retrying...",
                flush=True,
            )
        except subprocess.TimeoutExpired:
            print(f"[Step 2: {idx}/{total}] ! Timeout on attempt {attempt} for {filename}, retrying...", flush=True)
        except Exception as e:
            print(f"[Step 2: {idx}/{total}] ! Error on attempt {attempt} for {filename}: {e}", flush=True)

        time.sleep(3 * attempt)

    print(f"[Step 2: {idx}/{total}] ✗ FAILED after 3 attempts: {filename}", flush=True)
    return filename, None


def main() -> None:
    max_workers = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    prompts = load_prompts()
    state = load_state()

    pending = [
        (fname, desc)
        for fname, desc in prompts.items()
        if fname not in state or not (BLOG_DIR / fname).exists()
    ]
    total = len(prompts)
    done_count = total - len(pending)
    print(
        f"=== Step 2 (De-AI Documentary Reportage): {done_count}/{total} already done, {len(pending)} pending (workers={max_workers}) ===",
        flush=True,
    )

    if not pending:
        print("All 128 De-AI Documentary covers are already rendered and saved!")
        return

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:
        futures = {}
        for offset, (fname, desc) in enumerate(pending, start=done_count + 1):
            fut = pool.submit(render_one, fname, desc, offset, total)
            futures[fut] = fname

        for fut in concurrent.futures.as_completed(futures):
            fname, src_png = fut.result()
            if src_png:
                with lock:
                    state[fname] = src_png
                    save_state(state)

    final_done = len(state)
    print(f"\n=== Completed {final_done}/{total} De-AI Documentary blog covers ===", flush=True)


if __name__ == "__main__":
    main()
