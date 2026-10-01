#!/usr/bin/env python3
import glob, re, os

drafts = sorted([f for f in glob.glob("content/drafts/*.md") if not f.endswith("README.md")])

banned_cliches = [
    "in der heutigen schnelllebigen welt",
    "dreh- und angelpunkt",
    "win-win",
    "nicht zu unterschätzen",
    "schlüssel zum erfolg",
    "im zeitalter der",
    "ein zweischneidiges schwert",
    "goldene brücke",
    "revolutionieren"
]

results = []

for f in drafts:
    content = open(f, encoding="utf-8").read()
    parts = content.split("---", 2)
    meta = {}
    if content.startswith("---") and len(parts) >= 3:
        for line in parts[1].strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip().strip('"').strip("'")
        body = parts[2].strip()
    else:
        body = content

    title = meta.get("meta_title", "")
    desc = meta.get("meta_description", "")
    
    # Word count
    clean_body = re.sub(r"!\[.*?\]\(.*?\)", "", body)
    clean_body = re.sub(r"\[.*?\]\(.*?\)", "", clean_body)
    clean_body = re.sub(r"[#*|`>-]", " ", clean_body)
    words = len(clean_body.split())
    
    # Titles & desc lengths
    title_len = len(title)
    desc_len = len(desc)
    
    # Images & captions
    imgs = re.findall(r"!\[([^\]]*)\]\(([^)]+)\)", body)
    
    # Tables
    has_table = bool(re.search(r"\|.+\|\n\|[- :|]+\|\n\|.+\|", body))
    
    # Internal links
    internal_links = re.findall(r"\[([^\]]+)\]\((/[^)]+)\)", body)
    
    # Laws / Citations
    has_law = bool(re.search(r"(§\s*\d+|AufenthG|SGB|BeschV|BAMF|BQFG|ATA-OTA-G|DGUV|PflBG|DIN|ISO|GewO|PflAPrV)", body))
    
    # Cliches
    found_cliches = [c for c in banned_cliches if c in body.lower()]
    
    issues = []
    if words < 650:
        issues.append(f"words: {words} < 650")
    elif words > 950:
        issues.append(f"words: {words} > 950")
    if not (48 <= title_len <= 68):
        issues.append(f"title: {title_len} chars")
    if not (138 <= desc_len <= 165):
        issues.append(f"desc: {desc_len} chars")
    if len(imgs) != 2:
        issues.append(f"imgs: {len(imgs)} != 2")
    if not has_table:
        issues.append("missing table")
    if len(internal_links) < 2:
        issues.append(f"links: {len(internal_links)} < 2")
    if not has_law:
        issues.append("missing law citation")
    if found_cliches:
        issues.append(f"cliches: {found_cliches}")
        
    results.append((os.path.basename(f), words, title_len, desc_len, len(imgs), len(internal_links), has_law, has_table, issues))

failed = [r for r in results if r[8]]
print(f"Total checked: {len(results)}. Failed QC: {len(failed)}")
for r in results:
    status = "PASS" if not r[8] else "FAIL: " + ", ".join(r[8])
    print(f"{r[0][:35]:35} | words={r[1]:3} | title={r[2]:2} | desc={r[3]:3} | {status}")
