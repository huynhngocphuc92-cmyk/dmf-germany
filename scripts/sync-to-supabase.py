#!/usr/bin/env python3
"""
Sync all 35 compiled blog articles to Supabase 'posts' table.
Sets status to 'published' so they immediately appear on the live website.
"""

import json
import os
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
COMPILED_FILE = BASE_DIR / "content" / "compiled" / "all-posts.json"

SUPABASE_URL = "https://iihprcuhmilmymlbktpy.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHByY3VobWlsbXltbGJrdHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTk4MiwiZXhwIjoyMDgzMTgxOTgyfQ.JbraSUKjSW4iN1FV-bvBfL1CO943dk29ThQcD3ya0vQ"
AUTHOR_ID = "f198e552-d96b-48d6-a537-86f8eec86c8a"

def sync_posts():
    if not COMPILED_FILE.exists():
        print(f"Error: {COMPILED_FILE} not found. Run compile-drafts.py first.")
        return

    posts = json.load(open(COMPILED_FILE, encoding="utf-8"))
    print(f"Loaded {len(posts)} posts from {COMPILED_FILE}")

    # Generate published dates spaced across recent days/weeks
    base_time = datetime(2026, 10, 1, 10, 0, 0, tzinfo=timezone.utc)

    payload = []
    for i, p in enumerate(posts):
        # Stagger publication dates nicely so they look natural
        pub_time = base_time - timedelta(days=(len(posts) - 1 - i) * 2, hours=(i % 5) * 3)
        pub_iso = pub_time.isoformat()

        post_record = {
            "title": p["title"],
            "slug": p["slug"],
            "excerpt": p.get("excerpt") or "",
            "content": p["content"],
            "cover_image": p.get("cover_image") or "/images/blog/dmf-klassenzimmer.jpg",
            "status": "published",
            "published_at": pub_iso,
            "author_id": AUTHOR_ID,
            "meta_title": p.get("meta_title") or p["title"],
            "meta_description": p.get("meta_description") or "",
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        payload.append(post_record)

    url = f"{SUPABASE_URL}/rest/v1/posts?on_conflict=slug"
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    # Upsert in batches of 10 to ensure clean transmission
    batch_size = 10
    total_synced = 0
    for i in range(0, len(payload), batch_size):
        batch = payload[i:i + batch_size]
        data_bytes = json.dumps(batch, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, method="POST", headers=headers)
        try:
            with urllib.request.urlopen(req) as resp:
                total_synced += len(batch)
                print(f"Batch {i//batch_size + 1}: synced {len(batch)} posts (Status {resp.status})")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode()
            print(f"HTTP Error {e.code} on batch {i}: {err_body}")
            raise e

    print(f"\nSUCCESS: Synced all {total_synced} posts to Supabase table 'posts' with status 'published'!")

    # Verify query
    verify_url = f"{SUPABASE_URL}/rest/v1/posts?select=slug,title,status,published_at&order=published_at.desc"
    verify_req = urllib.request.Request(verify_url, headers={
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}"
    })
    with urllib.request.urlopen(verify_req) as resp:
        online_posts = json.loads(resp.read().decode())
        print(f"\nTotal posts currently published in Supabase: {len(online_posts)}")
        for op in online_posts[:5]:
            print(f"  * {op['published_at'][:10]} | [{op['status']}] {op['slug']}")

if __name__ == "__main__":
    sync_posts()
