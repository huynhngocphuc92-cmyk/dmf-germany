#!/usr/bin/env python3
"""
Render 28 Bespoke German Workplace & Legal Praxis Inline Images (De-AI ISO 400 Documentary)
===========================================================================================
Generates 28 authentic documentary reportage inline images (`public/images/community/de-praxis-*.jpg`)
using Codex GPT Image (`photorealistic-natural`) + `de_ai_sensor_emulation` (12% primary desaturation,
documentary matte tone curve [6..249], and midtone-weighted ISO 400 monochromatic luminance grain).
These 28 images complement the 72 authentic DMF Google Drive photos to form a 100-image library
for section-by-section (`<h2>`) semantic matching across all 161 blog articles (3–6 images per post).
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
import numpy as np
from PIL import Image, ImageEnhance

ROOT = Path("/Users/chong/dmf-talents.de")
OUT_DIR = ROOT / "public" / "images" / "community"
STATE_FILE = ROOT / "scripts" / "de-praxis-28-state.json"
CODEX_BIN = "/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex"
GEN_ROOT = Path("/Users/chong/.codex/generated_images")

TARGET_W = 1200
TARGET_H = 675

lock = threading.Lock()

DE_PRAXIS_PROMPTS: dict[str, str] = {
    # 1. HEALTHCARE & NURSING IN GERMANY (5)
    "de-praxis-pflege-stationsuebergabe.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 800, 4200K hospital corridor fluorescent light): "
        "Candid unposed documentary reportage photo inside a German hospital ward nursing station during shift handover (Stationsübergabe). "
        "A young Vietnamese female nurse in white hospital scrubs with a name badge and a senior German male charge nurse look together at a mobile digital patient chart trolley, "
        "with drug cabinets and a whiteboard schedule visible in the background."
    ),
    "de-praxis-altenpflege-vitalwerte.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 640, natural overcast window daylight): "
        "Unposed German documentary photo inside a bright modern German senior care home room (Pflegeheim). "
        "A young Vietnamese nursing apprentice (Pflege-Azubi) in blue/white tunic gently checks the blood pressure cuff on a smiling elderly German resident seated in an armchair, "
        "while a German Praxisanleiterin observes with a clipboard."
    ),
    "de-praxis-klinik-ota-ata-op.jpg": (
        "Shot on Sony A7 IV (35mm f/5.6, ISO 800, crisp 5000K surgical prep room lighting): "
        "Candid documentary photograph in a German hospital sterile surgical preparation room (Einleitungsraum / OP). "
        "A Vietnamese OTA/ATA surgical technologist in green surgical scrubs, cap, and mask arranges sterile stainless-steel instrument trays alongside a German anesthesia colleague."
    ),
    "de-praxis-labor-mtla-mtra-diagnostik.jpg": (
        "Shot on Canon EOS R5 (50mm f/4, ISO 640, neutral clinical laboratory lighting): "
        "Unposed documentary photograph inside a German clinical diagnostics laboratory. "
        "A Vietnamese MTLA medical laboratory technologist in a white lab coat uses a precision micropipette at a bench analyzer while checking sample barcodes on a monitor."
    ),
    "de-praxis-zfa-zahnarzt-behandlung.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 640, clean daylight-balanced dental clinic lighting): "
        "Unposed documentary photograph inside a modern German dental practice (Zahnarztpraxis). "
        "A Vietnamese ZFA dental assistant apprentice in light-blue clinic scrubs prepares ultrasonic instruments beside the treatment chair while speaking with the German dentist."
    ),
    # 2. INDUSTRY, CNC, SHK, ELEKTRO & CONSTRUCTION IN GERMANY (6)
    "de-praxis-industrie-cnc-werkstatt.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 800, industrial high-bay LED workshop light): "
        "Unposed German industrial reportage photograph inside a Mittelstand CNC machining hall in Baden-Württemberg. "
        "A German Industriemeister in a grey work jacket with oil smudges and a Vietnamese Zerspanungsmechaniker inspect a milled aluminum part with a digital caliper and technical drawing."
    ),
    "de-praxis-handwerk-shk-waermepumpe.jpg": (
        "Shot on Canon EOS R5 (35mm f/5.6, ISO 640, cool overcast German utility room daylight): "
        "Unposed documentary photograph in a German residential basement technical room (Heizungskeller). "
        "A Vietnamese SHK Anlagenmechaniker and a German master plumber in blue work trousers install insulated copper piping and pressure gauges on a modern heat pump unit (Wärmepumpe)."
    ),
    "de-praxis-elektro-schaltschrank-vde.jpg": (
        "Shot on Sony A7 IV (35mm f/5.6, ISO 800, neutral workshop fluorescent lighting): "
        "Unposed documentary photograph inside a German electrical engineering workshop. "
        "A Vietnamese Elektroniker für Betriebstechnik uses a digital VDE multimeter to test DIN-rail contactors and color-coded wiring inside an open industrial control cabinet (Schaltschrank)."
    ),
    "de-praxis-kfz-hochvolt-elektroauto.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 800, German automotive workshop lighting): "
        "Unposed documentary photograph in a modern German car dealership service bay (Kfz-Meisterbetrieb). "
        "A Vietnamese Kfz-Mechatroniker wearing orange HV insulated safety gloves and a German service technician inspect the high-voltage orange cabling of an electric vehicle on a hydraulic lift."
    ),
    "de-praxis-bau-handwerk-baustelle.jpg": (
        "Shot on Canon EOS R5 (24mm f/8, ISO 400, overcast 5500K Northern German daylight): "
        "Unposed architectural documentary photograph on a tidy German commercial construction site. "
        "Two Vietnamese construction craftsmen (Maurer / Betonbauer) and a German Bauleiter wearing yellow DGUV hardhats and scuffed high-visibility jackets check a laser level and reinforcement blueprint."
    ),
    "de-praxis-handwerk-lebensmittel-optik.jpg": (
        "Shot on Canon EOS R5 (50mm f/4, ISO 640, natural workshop window light): "
        "Unposed documentary photograph inside a traditional German craft workshop. "
        "A senior German Handwerksmeister with glasses and a young Vietnamese apprentice carefully inspect precision craft work on a wooden workbench."
    ),
    # 3. GASTRONOMY, HOTELLERIE, LOGISTICS & TRANSPORT IN GERMANY (4)
    "de-praxis-gastro-kueche-haccp.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 800, stainless-steel commercial kitchen lighting): "
        "Unposed documentary reportage photograph inside a busy German hotel restaurant kitchen. "
        "A German Küchenchef and a Vietnamese Koch-Azubi in white chef jackets and aprons plate a warm dish at the stainless-steel pass while checking an HACCP temperature log."
    ),
    "de-praxis-hotellerie-rezeption-checkin.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 640, warm natural lobby window light): "
        "Unposed documentary photograph at the reception desk of a classic 4-star German business hotel. "
        "A young Vietnamese Hotelfachfrau in a neat dark blazer smiles while handing a room keycard and invoice to a German business traveler."
    ),
    "de-praxis-logistik-lager-scanner.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 800, high-bay warehouse lighting): "
        "Unposed documentary photograph inside a modern German logistics fulfillment center (Hochregallager). "
        "A Vietnamese Fachkraft für Lagerlogistik in a high-visibility vest uses a handheld barcode scanner to verify a Euro-pallet shipment beside an electric reach truck."
    ),
    "de-praxis-verkehr-busfahrer-cockpit.jpg": (
        "Shot on Canon EOS R5 (28mm f/5.6, ISO 640, overcast morning daylight at a German bus depot): "
        "Unposed documentary photograph inside the driver cockpit of a modern German municipal transit bus (ÖPNV Linienbus). "
        "A Vietnamese Berufskraftfahrer in a light-blue transit uniform shirt checks the digital route terminal while a German driving instructor stands beside him."
    ),
    # 4. LEGAL, § 81a, ZAB, CONTRACTS, PAYROLL, HOUSING & BERUFSSCHULE (7)
    "de-praxis-recht-81a-vorabzustimmung.jpg": (
        "Shot on Canon EOS R5 (50mm f/5.6, ISO 400, overhead desk angle in natural office window light): "
        "Unposed flat-lay documentary photograph on a German HR manager's oak desk showing official German administrative folders, "
        "a printed checklist titled '§ 81a AufenthG', a signed power of attorney (Vollmacht) with a blue ink pen, and a laptop displaying a timeline chart."
    ),
    "de-praxis-anerkennung-zab-defizitbescheid.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 400, bright German office daylight): "
        "Unposed documentary photograph in a German hospital or company HR office. "
        "A German HR specialist and a Vietnamese skilled worker sit at a meeting table reviewing a stamped qualification recognition folder (Anerkennungsbescheid / ZAB) and a training plan."
    ),
    "de-praxis-vertrag-ihk-ausbildungsvertrag.jpg": (
        "Shot on Canon EOS R5 (50mm f/4, ISO 400, natural conference room window light): "
        "Unposed documentary close-up of a German employer and a young Vietnamese trainee signing an official German vocational training contract (Ausbildungsvertrag) "
        "on a wooden conference table, with a fountain pen and an IHK/HWK folder visible."
    ),
    "de-praxis-payroll-lohnabrechnung-sozialversicherung.jpg": (
        "Shot on Canon EOS R5 (50mm f/5.6, ISO 400, clean office daylight): "
        "Unposed documentary close-up in a German accounting/HR office: an HR payroll specialist reviews a printed German payslip (Entgeltabrechnung), "
        "a German statutory health insurance card (Krankenkassenkarte), and a calculator on a desk next to a computer monitor."
    ),
    "de-praxis-wohnraum-azubi-wg-schluessel.jpg": (
        "Shot on Leica Q2 (28mm f/4, ISO 400, bright morning daylight through apartment windows): "
        "Unposed documentary photograph inside a clean, freshly furnished German apartment (Azubi-WG) with a small kitchen and dining table. "
        "A German company mentor hands a set of apartment keys with a keychain to two smiling newly arrived Vietnamese trainees with their luggage."
    ),
    "de-praxis-behoerde-buergeramt-anmeldung.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 400, neutral German municipal office daylight): "
        "Unposed documentary photograph at a modern German municipal citizen service desk (Bürgeramt). "
        "A DMF onboarding coordinator accompanies a young Vietnamese professional holding a passport and residence registration folder (Anmeldung) across from a friendly clerk."
    ),
    "de-praxis-berufsschule-fachklasse-deutschland.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 640, natural classroom window light): "
        "Unposed documentary photograph inside a German vocational school classroom (Berufsschule). "
        "Two Vietnamese apprentices sit side-by-side with German classmates at lab/technical desks, taking notes in German workbooks while the teacher explains a technical diagram at the front."
    ),
    # 5. HR MANAGEMENT, BETRIEBSRAT, MENTORING, ROI & ARBEITSPROBE (6)
    "de-praxis-hr-video-interview-auswahl.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 400, German glass-walled meeting room daylight): "
        "Unposed over-the-shoulder documentary photograph of two German hiring managers (Personalleiterin and Abteilungsleiter) in a Munich office "
        "conducting a live video interview on a large wall monitor with a smiling Vietnamese candidate in a blue DMF polo shirt, with printed CVs on the table."
    ),
    "de-praxis-betriebsrat-mitbestimmung-meeting.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 400, overcast daylight in a German boardroom): "
        "Unposed documentary photograph of a constructive meeting between a German company managing director (Geschäftsführer), HR manager, and works council representatives (Betriebsrat) "
        "reviewing international recruitment dossiers and onboarding plans around a conference table."
    ),
    "de-praxis-onboarding-patensystem-mentor.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 640, natural workplace daylight): "
        "Unposed documentary photograph in a German company breakroom/workplace: an experienced German colleague (betrieblicher Pate / Mentor) "
        "explains the weekly shift plan and safety checklist over coffee to a newly arrived Vietnamese team member."
    ),
    "de-praxis-roi-kosten-kalkulation-board.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 400, German executive office daylight): "
        "Unposed documentary photograph of a German Mittelstand CFO and HR Director analyzing a printed cost-comparison chart and laptop spreadsheet "
        "comparing long-term direct recruitment ROI versus temporary staffing costs."
    ),
    "de-praxis-arbeitsprobe-fachpraxis-test.jpg": (
        "Shot on Leica Q2 (28mm f/5.6, ISO 640, bright technical training center daylight): "
        "Unposed documentary photograph of a practical skills assessment (Arbeitsprobe): a Vietnamese technician demonstrates precision wiring and assembly on a test rig "
        "while a German technical assessor takes notes on a structured evaluation sheet."
    ),
    "de-praxis-retention-team-integration.jpg": (
        "Shot on Canon EOS R5 (35mm f/4, ISO 400, natural daylight in a German company courtyard): "
        "Unposed documentary photograph of a mixed German and Vietnamese team of colleagues smiling and talking together during a casual lunch break in a German company courtyard, "
        "reflecting authentic workplace integration and long-term retention."
    ),
}


def de_ai_sensor_emulation(src_png: Path, dst_jpg: Path, y_anchor: float = 0.35) -> None:
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
    return {}


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
                dst_jpg = OUT_DIR / filename
                de_ai_sensor_emulation(png_path, dst_jpg, y_anchor=0.35)
                kb = dst_jpg.stat().st_size / 1024
                print(
                    f"[DE-Praxis {idx}/{total}] ✓ Rendered {filename} ({kb:.0f} KB) <- {png_path.name}",
                    flush=True,
                )
                return filename, str(png_path)

            print(
                f"[DE-Praxis {idx}/{total}] ! Attempt {attempt} produced no image for {filename}, retrying...",
                flush=True,
            )
        except Exception as e:
            print(f"[DE-Praxis {idx}/{total}] ! Error on attempt {attempt} for {filename}: {e}", flush=True)

        time.sleep(3 * attempt)

    print(f"[DE-Praxis {idx}/{total}] ✗ FAILED after 3 attempts: {filename}", flush=True)
    return filename, None


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    max_workers = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    state = load_state()

    pending = [
        (fname, desc)
        for fname, desc in DE_PRAXIS_PROMPTS.items()
        if fname not in state or not (OUT_DIR / fname).exists()
    ]
    total = len(DE_PRAXIS_PROMPTS)
    done_count = total - len(pending)
    print(
        f"=== Rendering 28 DE-Praxis Inline Documentary Images: {done_count}/{total} done, {len(pending)} pending (workers={max_workers}) ===",
        flush=True,
    )

    if not pending:
        print("All 28 DE-Praxis inline documentary images are already rendered!")
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

    print(f"\n=== Completed {len(state)}/{total} DE-Praxis inline documentary images ===", flush=True)


if __name__ == "__main__":
    main()
