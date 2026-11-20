#!/usr/bin/env python3
"""
Safe Phase-13-Only Supabase Sync (Posts 159-173 -> 161 to 176 live posts).

Strictly filters content/compiled/all-posts.json to ONLY the 15 Phase 13 slugs
so existing 161 published posts (and their 656 enriched inline <figure> blocks)
are never overwritten.
"""

from __future__ import annotations

import ast
import json
import os
import time
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_LOCAL_FILE = BASE_DIR / ".env.local"
COMPILED_FILE = BASE_DIR / "content" / "compiled" / "all-posts.json"
SYNC_MAPPING_FILE = BASE_DIR / "scripts" / "sync-to-supabase.py"
QC_AUDIT_FILE = BASE_DIR / "scripts" / "ultra-deep-qc-audit.py"
AUTHOR_ID = os.environ.get("SUPABASE_AUTHOR_ID", "f198e552-d96b-48d6-a537-86f8eec86c8a")

PHASE_13_SLUGS = (
    "saisonarbeitskraefte-aus-vietnam-zav-kontingent-gastronomie-landwirtschaft",
    "ferienbeschaeftigung-14-abs-2-beschv-unterkunft-mindestlohn-2027",
    "stammkraefte-wiederkehrer-saisonarbeit-uebergang-16a-18a-aufenthg",
    "tvoed-pflege-tvaoed-avr-eingruppierung-internationale-pflegekraefte",
    "3-jahres-tco-vollkostenrechnung-direktrekrutierung-vs-headhunter",
    "ausbildereignungsverordnung-aevo-ausbildungsbefugnis-28-30-bbig-verkuerzung-8-bbig",
    "chemikanten-pharmakanten-chemieproduktion-vietnam-ihk",
    "hoerakustiker-orthopaedietechnik-gesundheitshandwerk-vietnam-hwk",
    "verfahrensmechaniker-kunststoff-kautschuk-vietnam-ihk",
    "zsef-nuernberg-bayern-81a-lfp-amberg-fast-lane",
    "zfe-nrw-bonn-bezirksregierung-koeln-zag-muenster-81a",
    "ihk-fosa-nuernberg-vs-handwerkskammern-hwk-bqfg-vergleich",
    "gesellenpruefung-teil-1-teil-2-pflegeexamen-internationale-azubis",
    "arbeitgeberwechsel-zweckwechsel-zusatzblatt-eat-aufenthg-arbeitgeber",
    "ergotherapeuten-pta-vietnam-anerkennung-ergthg-ptag-reha-apotheken",
)


def parse_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        if line.startswith("export "):
            line = line[len("export ") :].strip()
        key, val = line.split("=", 1)
        values[key.strip()] = val.strip().strip('"').strip("'")
    return values


def load_ast_constants(path: Path, names: set[str]) -> dict[str, object]:
    found: dict[str, object] = {}
    if not path.exists():
        return found
    tree = ast.parse(path.read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1:
            target_id = getattr(node.targets[0], "id", "")
            if target_id in names:
                found[target_id] = ast.literal_eval(node.value)
    return found


def resolve_supabase_credentials() -> tuple[str, str, str]:
    env_file = parse_env_file(ENV_LOCAL_FILE)

    raw_url = (
        os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        or os.environ.get("SUPABASE_URL")
        or env_file.get("NEXT_PUBLIC_SUPABASE_URL")
        or env_file.get("SUPABASE_URL")
        or ""
    ).strip()
    if "your-test-project" in raw_url:
        raw_url = ""

    raw_key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or env_file.get("SUPABASE_SERVICE_ROLE_KEY")
        or ""
    ).strip()

    source = ".env.local/env"
    if not raw_url or not raw_key:
        fallback = load_ast_constants(QC_AUDIT_FILE, {"SUPABASE_URL", "SERVICE_ROLE_KEY"})
        if not raw_url:
            raw_url = str(fallback.get("SUPABASE_URL") or "").strip()
            source = "scripts/ultra-deep-qc-audit.py (fallback from placeholder .env.local)"
        if not raw_key:
            raw_key = str(fallback.get("SERVICE_ROLE_KEY") or "").strip()
            source = "scripts/ultra-deep-qc-audit.py (fallback from empty .env.local)"

    if not raw_url or not raw_key:
        raise RuntimeError("Missing Supabase URL or service role key (checked .env.local, env, and repo fallback).")

    return raw_url.rstrip("/"), raw_key, source


def fetch_all_posts(supabase_url: str, service_role_key: str) -> list[dict]:
    req = urllib.request.Request(
        f"{supabase_url}/rest/v1/posts?select=slug,status,cover_image,published_at,content&order=published_at.desc",
        headers={
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    if not COMPILED_FILE.exists():
        raise FileNotFoundError(f"Compiled posts file not found: {COMPILED_FILE}")

    supabase_url, service_role_key, cred_source = resolve_supabase_credentials()
    print(f"Loaded Supabase credentials via {cred_source} (secret values redacted).")

    compiled_posts = json.loads(COMPILED_FILE.read_text(encoding="utf-8"))
    by_slug = {str(post["slug"]).strip(): post for post in compiled_posts}

    missing = [slug for slug in PHASE_13_SLUGS if slug not in by_slug]
    if missing:
        raise RuntimeError(f"Missing Phase 13 slugs in all-posts.json: {missing}")

    mapping_data = load_ast_constants(SYNC_MAPPING_FILE, {"POST_COVER_MAPPING"})
    cover_mapping = mapping_data.get("POST_COVER_MAPPING", {})
    if not isinstance(cover_mapping, dict):
        cover_mapping = {}

    phase13_set = set(PHASE_13_SLUGS)
    pre_posts = fetch_all_posts(supabase_url, service_role_key)
    pre_published = [p for p in pre_posts if p.get("status") == "published"]
    pre_existing_non_p13 = [p for p in pre_posts if p.get("slug") not in phase13_set]
    pre_non_p13_fig_count = sum(
        (p.get("content") or "").count('<figure class="dmf-community-figure"')
        for p in pre_existing_non_p13
    )
    pre_non_p13_covers = {
        p.get("cover_image") for p in pre_existing_non_p13 if p.get("cover_image")
    }
    print(
        f"Pre-sync Supabase state: total={len(pre_posts)}, published={len(pre_published)}, "
        f"non-Phase13 <figure> blocks={pre_non_p13_fig_count}"
    )

    # Stagger published_at across 2026-11-05 .. 2026-11-18 (strictly after 2026-11-04 and before 2026-11-18T05:00Z)
    start_time = datetime(2026, 11, 5, 8, 0, 0, tzinfo=timezone.utc)
    now_iso = datetime.now(timezone.utc).isoformat()
    payload = []
    for idx, slug in enumerate(PHASE_13_SLUGS):
        post = by_slug[slug]
        cover = str(cover_mapping.get(slug) or post.get("cover_image") or "").strip()
        if not cover:
            raise RuntimeError(f"Missing cover_image for Phase 13 slug: {slug}")
        if cover in pre_non_p13_covers:
            raise RuntimeError(f"Cover collision with existing Supabase post for {slug}: {cover}")
        pub_iso = (start_time + timedelta(hours=idx * 22)).isoformat()
        payload.append(
            {
                "title": post["title"],
                "slug": slug,
                "excerpt": post.get("excerpt") or "",
                "content": post["content"],
                "cover_image": cover,
                "status": "published",
                "published_at": pub_iso,
                "author_id": AUTHOR_ID,
                "meta_title": post.get("meta_title") or post["title"],
                "meta_description": post.get("meta_description") or "",
                "updated_at": now_iso,
            }
        )

    assert len(payload) == 15, f"Expected strictly 15 Phase 13 records, got {len(payload)}"

    upsert_url = f"{supabase_url}/rest/v1/posts?on_conflict=slug"
    headers = {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }

    batch_size = 5
    total_upserted = 0
    for i in range(0, len(payload), batch_size):
        batch = payload[i : i + batch_size]
        data_bytes = json.dumps(batch, ensure_ascii=False).encode("utf-8")
        for attempt in range(4):
            req = urllib.request.Request(upsert_url, data=data_bytes, method="POST", headers=headers)
            try:
                with urllib.request.urlopen(req, timeout=30) as resp:
                    total_upserted += len(batch)
                    print(
                        f"Batch {i // batch_size + 1}: upserted {len(batch)} Phase 13 posts "
                        f"(HTTP {resp.status})"
                    )
                    break
            except urllib.error.HTTPError as exc:
                err_body = exc.read().decode("utf-8", errors="replace")
                print(f"HTTP Error {exc.code} on batch {i // batch_size + 1}: {err_body}")
                raise
            except Exception as exc:
                if attempt < 3:
                    print(f"Transient error on batch {i // batch_size + 1} ({exc}), retrying...")
                    time.sleep(1.5)
                else:
                    raise

    post_posts = fetch_all_posts(supabase_url, service_role_key)
    post_published = [p for p in post_posts if p.get("status") == "published"]
    post_non_p13 = [p for p in post_posts if p.get("slug") not in phase13_set]
    post_p13 = [p for p in post_posts if p.get("slug") in phase13_set]

    post_non_p13_fig_count = sum(
        (p.get("content") or "").count('<figure class="dmf-community-figure"')
        for p in post_non_p13
    )
    post_p13_fig_count = sum(
        (p.get("content") or "").count('<figure class="dmf-community-figure"')
        for p in post_p13
    )
    total_fig_count = post_non_p13_fig_count + post_p13_fig_count

    print(
        f"\nPost-sync verification: total={len(post_posts)}, published={len(post_published)}, "
        f"Phase 13 present={len(post_p13)}/15"
    )
    print(
        f"Inline <figure class=\"dmf-community-figure\"> count: "
        f"pre-Phase-13={post_non_p13_fig_count} (baseline={pre_non_p13_fig_count}), "
        f"Phase-13={post_p13_fig_count}, total={total_fig_count}"
    )

    if len(post_published) != 176:
        raise RuntimeError(f"Expected 176 published posts in Supabase, got {len(post_published)}")
    if len(post_p13) != 15:
        raise RuntimeError(f"Expected 15 Phase 13 posts in Supabase, got {len(post_p13)}")
    if post_non_p13_fig_count != pre_non_p13_fig_count:
        raise RuntimeError(
            f"Existing post <figure> count changed ({pre_non_p13_fig_count} -> {post_non_p13_fig_count})!"
        )

    print("SUCCESS: 15 Phase 13 posts upserted safely; 176 published posts live with all existing figures intact.")


if __name__ == "__main__":
    main()
