#!/usr/bin/env python3
"""
Upgrade all existing blog drafts (01 to 143) in content/drafts/ to 100% GEO-First standards:
1. Prepends a declarative 'Das Wichtigste in Kürze:' (Answer-First TL;DR) summary paragraph at the top of the article body.
2. Appends a structured '## Häufig gestellte Arbeitgeberfragen (B2B-FAQ)' section with 3 topic-specific '### ...?' question subheadings and concise answers extracted from the article's own verified sections so that `extractFaqFromHtml()` generates `FAQPage` JSON-LD for 100% of all 158 compiled blog posts.
"""

import re
from pathlib import Path

DRAFTS_DIR = Path(__file__).resolve().parent.parent / "content" / "drafts"


def parse_frontmatter(raw_text: str):
    if not raw_text.startswith("---"):
        return "", {}, raw_text
    parts = raw_text.split("---", 2)
    if len(parts) < 3:
        return "", {}, raw_text
    raw_fm = parts[1]
    body = parts[2]
    meta = {}
    for line in raw_fm.splitlines():
        if ":" in line and not line.strip().startswith("-"):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"').strip("'")
    return raw_fm, meta, body


def strip_md_formatting(text: str) -> str:
    # Remove markdown links [label](url) -> label
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Remove bold/italic markers
    s = re.sub(r"\*\*([^*]+)\*\*", r"\1", s)
    s = re.sub(r"\*([^*]+)\*", r"\1", s)
    s = re.sub(r"_([^_]+)_", r"\1", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_tldr(meta: dict, body: str) -> str:
    excerpt = strip_md_formatting(meta.get("excerpt", ""))
    meta_desc = strip_md_formatting(meta.get("meta_description", ""))

    # If excerpt starts with a question ("... ? "), keep the answer part or combine with meta_desc
    if "?" in excerpt:
        q_parts = excerpt.split("?", 1)
        after_q = q_parts[1].strip()
        if len(after_q) >= 45:
            excerpt = after_q

    if meta_desc and excerpt and meta_desc[:35].lower() not in excerpt.lower():
        combined = f"{meta_desc.rstrip('.')} – {excerpt}"
    else:
        combined = excerpt or meta_desc

    if not combined.endswith("."):
        combined += "."

    return f"**Das Wichtigste in Kürze:** {combined}"


def extract_section_paragraphs(body: str) -> list[tuple[str, str]]:
    """Returns list of (heading_text, first_prose_paragraph) for ## sections in body."""
    sections = []
    matches = list(re.finditer(r"^##\s+(.+)$", body, re.MULTILINE))
    for i, m in enumerate(matches):
        h_text = m.group(1).strip()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        chunk = body[start:end].strip()

        # Find normal prose paragraphs (not images, tables, lists, blockquotes, headings)
        paras = []
        current = []
        for line in chunk.splitlines():
            s = line.strip()
            if not s:
                if current:
                    para_str = strip_md_formatting(" ".join(current))
                    if len(para_str) >= 60:
                        paras.append(para_str)
                    current = []
                continue
            if (
                s.startswith("!")
                or s.startswith("_")
                or s.startswith("|")
                or s.startswith("-")
                or s.startswith("*")
                or s.startswith(">")
                or s.startswith("#")
                or re.match(r"^\d+\.\s", s)
            ):
                if current:
                    para_str = strip_md_formatting(" ".join(current))
                    if len(para_str) >= 60:
                        paras.append(para_str)
                    current = []
                continue
            current.append(s)
        if current:
            para_str = strip_md_formatting(" ".join(current))
            if len(para_str) >= 60:
                paras.append(para_str)

        if paras:
            sections.append((h_text, paras[0]))
    return sections


def clean_topic_label(meta: dict, stem: str) -> str:
    raw = meta.get("meta_title") or meta.get("title") or stem
    topic = raw.split(":", 1)[0].split("–", 1)[0].split("|", 1)[0].strip()
    topic = re.sub(r"[*_`\"']", "", topic).strip()
    return topic


def build_faq_section(meta: dict, body: str, stem: str) -> str:
    topic = clean_topic_label(meta, stem)
    sec_paras = extract_section_paragraphs(body)

    # Fallback paragraphs from body if fewer than 3 sections have prose
    fallback_p1 = (
        f"Für deutsche Arbeitgeber im Bereich {topic} sind eine frühzeitige Klärung des Anforderungsprofils, "
        f"die Prüfung der gesetzlichen Voraussetzungen nach dem Aufenthaltsgesetz (AufenthG) sowie eine realistische "
        f"Zeitplanung entscheidend. Alle Qualifikations- und Sprachnachweise sollten vorab strukturiert vorliegen."
    )
    fallback_p2 = (
        f"In der betrieblichen Praxis bewährt sich eine enge Abstimmung zwischen Personalabteilung, Fachabteilung "
        f"und den zuständigen Stellen wie IHK, HWK, Bundesagentur für Arbeit (ZAV) und Ausländerbehörde. "
        f"Klare Zuständigkeiten für Einarbeitung und Wohnraum sichern einen reibungslosen Start."
    )
    fallback_p3 = (
        f"DMF Talents unterstützt deutsche Unternehmen durch eine eigene Sprach- und Vorbereitungsakademie in Vietnam, "
        f"vorab geprüfte Kandidatendossiers inklusive Kurzvideo sowie persönliche Begleitung im Behörden- und "
        f"Onboarding-Prozess in Deutschland nach dem Employer-Pays-Prinzip (§ 296a SGB III)."
    )

    a1 = sec_paras[0][1] if len(sec_paras) >= 1 else fallback_p1
    a2 = sec_paras[1][1] if len(sec_paras) >= 2 else fallback_p2
    a3 = sec_paras[2][1] if len(sec_paras) >= 3 else fallback_p3

    q1 = f"Welche Kernvoraussetzungen gelten für Arbeitgeber beim Thema {topic}?"
    q2 = f"Worauf kommt es bei der praktischen Umsetzung im Betrieb besonders an?"
    q3 = f"Wie unterstützt DMF Talents Unternehmen bei {topic}?"

    return "\n\n".join(
        [
            "## Häufig gestellte Arbeitgeberfragen (B2B-FAQ)",
            f"### {q1}\n\n{a1}",
            f"### {q2}\n\n{a2}",
            f"### {q3}\n\n{a3}",
        ]
    )


def upgrade_draft(file_path: Path) -> bool:
    num_prefix = file_path.name.split("-")[0]
    if not num_prefix.isdigit() or int(num_prefix) >= 144:
        return False

    raw_text = file_path.read_text(encoding="utf-8")
    raw_fm, meta, body = parse_frontmatter(raw_text)
    if not raw_fm:
        return False

    body_stripped = body.strip()
    modified = False

    # 1. Insert 'Das Wichtigste in Kürze:' if not already present
    if "Das Wichtigste in Kürze:" not in body_stripped:
        tldr_line = build_tldr(meta, body_stripped)
        lines = body_stripped.splitlines()
        if lines and lines[0].startswith("# "):
            # Insert right after the # H1 line
            h1_line = lines[0]
            rest = "\n".join(lines[1:]).lstrip()
            body_stripped = f"{h1_line}\n\n{tldr_line}\n\n{rest}"
        else:
            body_stripped = f"{tldr_line}\n\n{body_stripped}"
        modified = True

    # 2. Append '## Häufig gestellte Arbeitgeberfragen (B2B-FAQ)' if < 3 question headings exist
    existing_q_headings = re.findall(r"^#{2,3}\s+(.+\?)\s*$", body_stripped, re.MULTILINE)
    if len(existing_q_headings) < 3 and "## Häufig gestellte Arbeitgeberfragen (B2B-FAQ)" not in body_stripped:
        faq_block = build_faq_section(meta, body_stripped, file_path.stem)
        body_stripped = f"{body_stripped}\n\n{faq_block}\n"
        modified = True

    if modified:
        new_full = f"---{raw_fm}---\n\n{body_stripped.strip()}\n"
        file_path.write_text(new_full, encoding="utf-8")
    return modified


def main():
    files = sorted(
        [f for f in DRAFTS_DIR.glob("*.md") if f.name != "README.md"],
        key=lambda p: int(p.name.split("-")[0]) if p.name.split("-")[0].isdigit() else 9999,
    )
    upgraded_count = 0
    for f in files:
        if upgrade_draft(f):
            upgraded_count += 1
    print(f"Upgraded {upgraded_count} drafts in {DRAFTS_DIR} to full GEO-First standards.")


if __name__ == "__main__":
    main()
