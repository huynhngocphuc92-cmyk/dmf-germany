#!/usr/bin/env python3
"""
Parallel Orchestrator for Codex GPT Image Blog Cover Rendering
==============================================================
Renders all 128 specialized B2B blog covers (3 already done, 125 remaining)
using `/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex exec`,
crops each 1536x1024 output to 1200x675 (16:9) progressive JPEG in `public/images/blog/`,
and records completion state in `scripts/gpt-image-state.json`.
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
from PIL import Image

ROOT = Path("/Users/chong/dmf-talents.de")
BLOG_DIR = ROOT / "public" / "images" / "blog"
STATE_FILE = ROOT / "scripts" / "gpt-image-state.json"
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


def load_state() -> dict[str, str]:
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            pass
    # Pre-seed the 3 demo covers already rendered & verified
    initial = {
        "dmf-fluggeraetmechaniker-luftfahrt-wartung-hangar.jpg": "/Users/chong/.codex/generated_images/01a1ae87-8248-73c0-8523-630e19adc29f/exec-a8764509-4f1a-43f3-9b52-5c262f72f416.png",
        "dmf-geruestbau-montage-hoehe.jpg": "/Users/chong/.codex/generated_images/01a1ae89-b938-7231-b330-b092f1c6b206/exec-6d3eea97-2ca4-4140-bb80-c99f29737490.png",
        "dmf-augenoptiker-optometrie-brillen-refraktion.jpg": "/Users/chong/.codex/generated_images/01a1ae89-b938-7231-b330-b092f1c6b206/exec-71fb1332-7e21-4a5e-b915-720d096219ff.png",
    }
    STATE_FILE.write_text(json.dumps(initial, indent=2))
    return initial


def save_state(state: dict[str, str]) -> None:
    STATE_FILE.write_text(json.dumps(state, indent=2, sort_keys=True))


def crop_and_save_16_9(src_png: Path, dst_jpg: Path, y_anchor: float = 0.35) -> None:
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


def render_one(filename: str, scene_desc: str, idx: int, total: int) -> tuple[str, str | None]:
    full_prompt = (
        "Do not read SKILL.md or run any shell commands. Directly call the built-in image_gen tool once "
        "to generate a single 1536x1024 photorealistic editorial B2B photograph (Canon EOS R5 35mm lens, "
        "natural lighting, authentic German workplace/environment, strictly NO text overlays, NO logos, NO watermarks): "
        f"{scene_desc}. Reply ONLY with the saved file path."
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

            # 1. Try finding explicit path in output
            matches = re.findall(
                r"(/Users/chong/\.codex/generated_images/[^\s\"'<>]+\.png)", combined
            )
            png_path = None
            for m in reversed(matches):
                p = Path(m)
                if p.exists() and p.stat().st_size > 50_000:
                    png_path = p
                    break

            # 2. Fallback: look up session id directory
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
                crop_and_save_16_9(png_path, dst_jpg, y_anchor=0.35)
                kb = dst_jpg.stat().st_size / 1024
                print(
                    f"[{idx}/{total}] ✓ {filename} ({kb:.0f} KB) <- {png_path.name}",
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

    print(f"[{idx}/{total}] ✗ FAILED after 3 attempts: {filename}", flush=True)
    return filename, None


def main() -> None:
    max_workers = int(sys.argv[1]) if len(sys.argv) > 1 else 8
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
        f"=== Codex GPT Image Pipeline: {done_count}/{total} already done, {len(pending)} pending (workers={max_workers}) ===",
        flush=True,
    )

    if not pending:
        print("All 128 GPT Image covers are already rendered and saved!")
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
    print(f"\n=== Completed {final_done}/{total} GPT Image blog covers ===", flush=True)


if __name__ == "__main__":
    main()
