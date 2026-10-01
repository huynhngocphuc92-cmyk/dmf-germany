#!/usr/bin/env python3
"""
Compile markdown drafts in content/drafts/ into clean HTML and JSON metadata.
Outputs to content/compiled/
"""

import os
import re
import json
from pathlib import Path

DRAFTS_DIR = Path(__file__).resolve().parent.parent / "content" / "drafts"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "content" / "compiled"

def parse_frontmatter(text):
    meta = {}
    body = text
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            raw_meta = parts[1].strip()
            body = parts[2].strip()
            for line in raw_meta.splitlines():
                if ":" in line:
                    key, val = line.split(":", 1)
                    meta[key.strip()] = val.strip().strip('"').strip("'")
    return meta, body

def markdown_to_html(md_text):
    lines = md_text.splitlines()
    html_parts = []
    in_ul = False
    in_ol = False
    in_table = False
    table_rows = []
    para_lines = []
    quote_lines = []

    def flush_para():
        nonlocal para_lines
        if para_lines:
            text = " ".join(para_lines).strip()
            if text:
                text = process_inlines(text)
                html_parts.append(f"<p>{text}</p>")
            para_lines = []

    def flush_list():
        nonlocal in_ul, in_ol
        if in_ul:
            html_parts.append("</ul>")
            in_ul = False
        if in_ol:
            html_parts.append("</ol>")
            in_ol = False

    def flush_quote():
        nonlocal quote_lines
        if quote_lines:
            text = "<br />".join([process_inlines(q) for q in quote_lines])
            html_parts.append(f"<blockquote><p>{text}</p></blockquote>")
            quote_lines = []

    def flush_table():
        nonlocal in_table, table_rows
        if in_table and table_rows:
            html_parts.append('<div class="table-responsive"><table>')
            # Header
            header = table_rows[0]
            html_parts.append('<thead><tr>')
            for cell in header:
                html_parts.append(f'<th>{process_inlines(cell)}</th>')
            html_parts.append('</tr></thead>')
            # Rows
            if len(table_rows) > 1:
                html_parts.append('<tbody>')
                for row in table_rows[1:]:
                    html_parts.append('<tr>')
                    for cell in row:
                        html_parts.append(f'<td>{process_inlines(cell)}</td>')
                    html_parts.append('</tr>')
                html_parts.append('</tbody>')
            html_parts.append('</table></div>')
            table_rows = []
            in_table = False

    def process_inlines(text):
        # Images: ![alt](url)
        text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1" />', text)
        # Links: [text](url)
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
        # Bold: **text**
        text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
        # Italic: *text* or _text_
        text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
        text = re.sub(r'_([^_]+)_', r'<em>\1</em>', text)
        # Inline code: `code`
        text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
        return text

    for line in lines:
        stripped = line.strip()

        # Blank line
        if not stripped:
            flush_para()
            flush_list()
            flush_quote()
            flush_table()
            continue

        # Blockquote
        if stripped.startswith("> "):
            flush_para()
            flush_list()
            flush_table()
            quote_lines.append(stripped[2:].strip())
            continue
        elif stripped.startswith(">"):
            flush_para()
            flush_list()
            flush_table()
            quote_lines.append(stripped[1:].strip())
            continue
        else:
            flush_quote()

        # Table row
        if stripped.startswith("|") and stripped.endswith("|"):
            flush_para()
            flush_list()
            # Check if separator row
            if re.match(r'^\|[\s\-:|]+\|$', stripped):
                continue
            cells = [c.strip() for c in stripped.strip('|').split('|')]
            table_rows.append(cells)
            in_table = True
            continue
        else:
            flush_table()

        # Standalone Image
        img_match = re.match(r'^!\[([^\]]*)\]\(([^)]+)\)$', stripped)
        if img_match:
            flush_para()
            flush_list()
            alt, src = img_match.groups()
            html_parts.append(f'<p><img src="{src}" alt="{alt}" /></p>')
            continue

        # Headings
        if stripped.startswith("### "):
            flush_para()
            flush_list()
            html_parts.append(f"<h3>{process_inlines(stripped[4:])}</h3>")
            continue
        elif stripped.startswith("## "):
            flush_para()
            flush_list()
            html_parts.append(f"<h2>{process_inlines(stripped[3:])}</h2>")
            continue
        elif stripped.startswith("# "):
            # Top-level H1 - skip in body as title is separate
            flush_para()
            flush_list()
            continue

        # Bullet list item
        ul_match = re.match(r'^[-*]\s+(.*)', stripped)
        if ul_match:
            flush_para()
            if in_ol:
                html_parts.append("</ol>")
                in_ol = False
            if not in_ul:
                html_parts.append("<ul>")
                in_ul = True
            html_parts.append(f"<li>{process_inlines(ul_match.group(1))}</li>")
            continue

        # Numbered list item
        ol_match = re.match(r'^\d+\.\s+(.*)', stripped)
        if ol_match:
            flush_para()
            if in_ul:
                html_parts.append("</ul>")
                in_ul = False
            if not in_ol:
                html_parts.append("<ol>")
                in_ol = True
            html_parts.append(f"<li>{process_inlines(ol_match.group(1))}</li>")
            continue

        # Regular paragraph line
        flush_list()
        para_lines.append(stripped)

    flush_para()
    flush_list()
    flush_quote()
    flush_table()

    return "\n".join(html_parts)

def compile_all():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    all_posts = []

    files = sorted([f for f in DRAFTS_DIR.glob("*.md") if f.name != "README.md"])

    for file_path in files:
        raw_text = file_path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(raw_text)

        # Extract H1 title
        title_match = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else meta.get("meta_title", file_path.stem)

        # Convert markdown body to HTML
        html_content = markdown_to_html(body)

        # Find cover image (first image in content or default)
        img_match = re.search(r'<img\s+src="([^"]+)"', html_content)
        cover_image = img_match.group(1) if img_match else "/images/blog/dmf-klassenzimmer.jpg"

        slug = meta.get("slug", file_path.stem)
        post_data = {
            "title": title,
            "slug": slug,
            "excerpt": meta.get("excerpt", ""),
            "meta_title": meta.get("meta_title", title),
            "meta_description": meta.get("meta_description", ""),
            "language": meta.get("language", "de"),
            "status": meta.get("status", "draft"),
            "cover_image": cover_image,
            "content": html_content,
        }

        all_posts.append(post_data)

        # Write individual html and json
        (OUTPUT_DIR / f"{slug}.html").write_text(html_content, encoding="utf-8")
        (OUTPUT_DIR / f"{slug}.json").write_text(json.dumps(post_data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Compiled: {slug} ({len(html_content)} chars)")

    # Write combined all-posts.json
    (OUTPUT_DIR / "all-posts.json").write_text(json.dumps(all_posts, ensure_ascii=False, indent=2), encoding="utf-8")

    # Generate SQL seed file for Supabase
    sql_lines = [
        "-- DMF Blog Posts Seed / Import Script",
        "-- Generated automatically from content/drafts/",
        ""
    ]
    for p in all_posts:
        title_esc = p["title"].replace("'", "''")
        slug_esc = p["slug"].replace("'", "''")
        excerpt_esc = p["excerpt"].replace("'", "''")
        content_esc = p["content"].replace("'", "''")
        meta_title_esc = p["meta_title"].replace("'", "''")
        meta_desc_esc = p["meta_description"].replace("'", "''")
        cover_esc = p["cover_image"].replace("'", "''")
        lang = p["language"]

        sql = f"""
INSERT INTO posts (title, slug, excerpt, content, cover_image, status, meta_title, meta_description, language)
VALUES ('{title_esc}', '{slug_esc}', '{excerpt_esc}', '{content_esc}', '{cover_esc}', 'published', '{meta_title_esc}', '{meta_desc_esc}', '{lang}')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();
""".strip()
        sql_lines.append(sql)
        sql_lines.append("")

    (OUTPUT_DIR / "seed-posts.sql").write_text("\n".join(sql_lines), encoding="utf-8")
    print(f"\nSuccessfully compiled all {len(all_posts)} posts to {OUTPUT_DIR}")

if __name__ == "__main__":
    compile_all()
