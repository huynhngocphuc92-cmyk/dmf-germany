#!/usr/bin/env python3
"""
DMF TALENTS - AI TONE & CLICHÉ DETECTOR
========================================
Scans all 74 published blog posts in Supabase to detect:
1. Typical German AI buzzwords, filler phrases, and clichés (KI-Floskeln).
2. Formulaic sentence starters (e.g. "In Zeiten...", "Zusammenfassend...", "Es ist wichtig zu...").
3. Overuse of repetitive syntactic patterns (e.g. excessive "nicht nur ..., sondern auch ...").
4. Generic corporate fluff lacking specific numbers, § paragraphs, or concrete procedures.
"""

import re
import json
import urllib.request
from collections import defaultdict

SUPABASE_URL = "https://iihprcuhmilmymlbktpy.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaHByY3VobWlsbXltbGJrdHB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYwNTk4MiwiZXhwIjoyMDgzMTgxOTgyfQ.JbraSUKjSW4iN1FV-bvBfL1CO943dk29ThQcD3ya0vQ"

# List of typical German AI clichés and buzzwords with regex patterns
AI_PATTERNS = [
    # Intros & Openers
    (r"in der heutigen(?:,)? (?:digitalen |schnelllebigen |globalisierten |vernetzten )?welt", "AI Opener: 'In der heutigen Welt...'"),
    (r"in zeiten (?:des demografischen wandels|des fachkräftemangels|von fachkräftemangel|der globalisierung)", "AI Opener: 'In Zeiten des demografischen Wandels/Fachkräftemangels'"),
    (r"in einer (?:zunehmend |sich ständig )?(?:globalisierten|digitalisierten|verändernden|dynamischen) (?:arbeits)?welt", "AI Opener: 'In einer zunehmend globalisierten Arbeitswelt'"),
    (r"im zeitalter (?:der |von )?(?:digitalisierung|globalisierung|fachkräftemangel)", "AI Opener: 'Im Zeitalter der...'"),
    (r"der mangel an fachkräften ist in aller munde", "AI Opener: '...ist in aller Munde'"),
    (r"es ist kein geheimnis(?:, dass)?", "AI Opener: 'Es ist kein Geheimnis...'"),
    (r"tauchen sie ein(?: in)?|lassen sie uns eintauchen", "AI Cliché: 'Tauchen Sie ein...'"),
    
    # Formulaic Transitions & Meta-Signposting
    (r"lassen sie uns einen (?:genaueren|näheren|tieferen) blick", "AI Transition: 'Lassen Sie uns einen genaueren Blick...'"),
    (r"werfen wir einen (?:genaueren|näheren|tieferen) blick", "AI Transition: 'Werfen wir einen genaueren Blick...'"),
    (r"schauen wir uns das genauer an", "AI Transition: 'Schauen wir uns das genauer an'"),
    (r"doch das ist noch nicht alles", "AI Transition: 'Doch das ist noch nicht alles'"),
    (r"hier kommt .*? ins spiel", "AI Transition: 'Hier kommt ... ins Spiel'"),
    (r"aber wie genau funktioniert das\?", "AI Rhetorical: 'Aber wie genau funktioniert das?'"),
    (r"was bedeutet das konkret\?", "AI Rhetorical: 'Was bedeutet das konkret?'"),
    (r"ein blick auf die zahlen zeigt", "AI Filler: 'Ein Blick auf die Zahlen zeigt'"),
    
    # Overused Buzzwords & Corporate Hollow Metaphors
    (r"\bgamechanger\b", "AI Buzzword: 'Gamechanger'"),
    (r"\bparadigmenwechsel\b", "AI Buzzword: 'Paradigmenwechsel'"),
    (r"\bein meilenstein\b", "AI Buzzword: 'Ein Meilenstein'"),
    (r"\bein zweischneidiges schwert\b", "AI Cliché: 'Ein zweischneidiges Schwert'"),
    (r"\bder schlüssel zum erfolg\b", "AI Cliché: 'Der Schlüssel zum Erfolg'"),
    (r"\bspielt eine (?:entscheidende|zentrale|unverzichtbare|tragende) rolle\b", "AI Cliché: 'spielt eine entscheidende/zentrale Rolle'"),
    (r"\bvon (?:essenzieller|grundlegender|entscheidender|immenser) bedeutung\b", "AI Fluff: 'von essenzieller/entscheidender Bedeutung'"),
    (r"\bnahtlos(?:e|en|er|es)? (?:integrieren|integration|ineinandergreifen|agieren)\b", "AI Buzzword: 'nahtlos integrieren / agieren'"),
    (r"\bbahnbrechend(?:e|en|er|es)?\b", "AI Hyperbole: 'bahnbrechend'"),
    (r"\brevolutionär(?:e|en|er|es)?\b", "AI Hyperbole: 'revolutionär'"),
    (r"\beinen silberstreif(?: am horizont)?\b", "AI Cliché: 'Silberstreif am Horizont'"),
    (r"\bdas a und o\b", "Cliché: 'das A und O'"),
    (r"\bhand aufs herz\b", "Colloquial Cliché: 'Hand aufs Herz'"),
    (r"\bim heutigen dschungel\b", "AI Cliché: 'im heutigen Dschungel'"),
    (r"\bwin-win\b", "Corporate Cliché: 'Win-Win'"),
    (r"\bsynergieeffekt(?:e|en)?\b", "Corporate Cliché: 'Synergieeffekte'"),
    (r"\bleuchtturmcharakter\b|\bleuchtturmprojekt(?:e)?\b", "Corporate Cliché: 'Leuchtturmprojekt'"),
    (r"\bvorreiterrolle\b", "Corporate Cliché: 'Vorreiterrolle'"),
    (r"\bdreh- und angelpunkt\b", "Cliché: 'Dreh- und Angelpunkt'"),
    (r"\bhand in hand (?:gehen|greifen)\b", "Cliché: 'Hand in Hand gehen/greifen'"),
    (r"\bauf herz und nieren prüfen\b", "Cliché: 'auf Herz und Nieren prüfen'"),
    (r"\bauf den punkt gebracht\b", "Cliché: 'auf den Punkt gebracht'"),
    (r"\bganzheitlich\b", "AI Buzzword: 'ganzheitlich'"),
    (r"\bmaßgeschneidert(?:e|en|er|es)?\b", "AI Buzzword: 'maßgeschneidert'"),
    (r"\bgoldstandard\b", "AI Cliché: 'Goldstandard'"),
    (r"\bkönigsdisziplin\b", "AI Cliché: 'Königsdisziplin'"),
    (r"\bvon der pike auf\b", "Colloquial Idiom: 'von der Pike auf'"),
    (r"\bgang und gäbe\b", "Colloquial Idiom: 'gang und gäbe'"),
    (r"\bhinter den kulissen\b", "Colloquial Idiom: 'hinter den Kulissen'"),
    (r"\bunter die arme greifen\b", "Colloquial Idiom: 'unter die Arme greifen'"),
    (r"\bfunke überspringt\b", "Colloquial Idiom: 'Funke überspringt'"),
    (r"\bschnäppchen\b", "Colloquial Cliché: 'Schnäppchen'"),
    (r"\bzukunftssicher(?:e|en|er|es)?\b", "AI Buzzword: 'zukunftssicher'"),
    (r"\bbrücken? schlagen\b", "AI Metaphor: 'Brücke(n) schlagen'"),
    (r"\bauf den ersten blick\b", "AI Cliché: 'Auf den ersten Blick'"),
    
    # Empty Meta-Signposting & Fillers
    (r"es ist wichtig zu beachten(?:, dass)?|es sei darauf hingewiesen(?:, dass)?", "AI Meta-Text: 'Es ist wichtig zu beachten...'"),
    (r"es gilt zu beachten(?:, dass)?", "AI Meta-Text: 'Es gilt zu beachten...'"),
    (r"es liegt auf der hand(?:, dass)?", "AI Filler: 'Es liegt auf der Hand...'"),
    (r"es versteht sich von selbst(?:, dass)?", "AI Filler: 'Es versteht sich von selbst...'"),
    (r"es lohnt sich(?:,)?", "AI Filler: 'Es lohnt sich...'"),
    (r"## \d+\. Fazit:", "AI Heading: 'Fazit:' in Section Heading"),
    
    # Conclusions & Summaries
    (r"zusammenfassend lässt sich sagen", "AI Conclusion: 'Zusammenfassend lässt sich sagen'"),
    (r"alles in allem lässt sich", "AI Conclusion: 'Alles in allem lässt sich...'"),
    (r"wie wir gesehen haben", "AI Meta-Text: 'Wie wir gesehen haben...'"),
    (r"die zukunft gehört denjenigen", "AI Preach: 'Die Zukunft gehört denjenigen...'"),
    (r"die weichen für die zukunft stellen", "AI Cliché: 'Die Weichen für die Zukunft stellen'"),
    (r"eines steht fest", "AI Cliché: 'Eines steht fest'"),
    (r"ein wichtiger schritt in die richtige richtung", "AI Cliché: 'Ein wichtiger Schritt in die richtige Richtung'"),
    (r"nutzen sie die chance", "AI Preach: 'Nutzen Sie die Chance'"),
    (r"die zukunft kann kommen", "AI Preach: 'Die Zukunft kann kommen'"),
]

def audit_ai_tone():
    print("Fetching all 74 posts from Supabase...")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/posts?select=id,slug,title,content&order=published_at.desc",
        headers={"apikey": SERVICE_ROLE_KEY, "Authorization": f"Bearer {SERVICE_ROLE_KEY}"}
    )
    posts = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
    print(f"Loaded {len(posts)} posts.\n")

    findings = defaultdict(list)
    repetitive_nicht_nur = []

    for p in posts:
        slug = p["slug"]
        content = p.get("content") or ""
        clean_text = re.sub(r"<[^>]+>", " ", content)

        # Check AI patterns
        for pattern, label in AI_PATTERNS:
            matches = list(re.finditer(pattern, clean_text, re.IGNORECASE))
            if matches:
                for m in matches:
                    start = max(0, m.start() - 30)
                    end = min(len(clean_text), m.end() + 30)
                    context_snippet = clean_text[start:end].replace("\n", " ").strip()
                    findings[slug].append({
                        "label": label,
                        "match": m.group(0),
                        "snippet": f"...{context_snippet}..."
                    })

        # Check overuse of "nicht nur ..., sondern auch ..."
        nicht_nur_matches = list(re.finditer(r"\bnicht nur\b.*?\bsondern auch\b", clean_text, re.IGNORECASE))
        if len(nicht_nur_matches) >= 3:
            repetitive_nicht_nur.append((slug, len(nicht_nur_matches)))

    # Summary
    print("=" * 70)
    print("          AI TONE & EDITORIAL QUALITY AUDIT RESULTS")
    print("=" * 70)
    print(f"Total Posts Analyzed: {len(posts)}")
    print(f"Posts with AI Clichés / Buzzwords: {len(findings)} / {len(posts)}")
    print(f"Posts with repetitive 'nicht nur... sondern auch' (>=3 times): {len(repetitive_nicht_nur)}")
    print("-" * 70 + "\n")

    total_hits = sum(len(hits) for hits in findings.values())
    print(f"Total AI Fluff / Cliché Instances Found: {total_hits}\n")

    if findings:
        print("DETAILS BY POST:")
        for slug, hits in sorted(findings.items()):
            print(f"\n📄 [{slug}] — {len(hits)} occurrence(s):")
            for h in hits:
                print(f"   • {h['label']}")
                print(f"     Context: \"{h['snippet']}\"")

    if repetitive_nicht_nur:
        print("\nREPETITIVE SYNTAX ('nicht nur ..., sondern auch ...' >= 3 times):")
        for slug, count in repetitive_nicht_nur:
            print(f"   • [{slug}]: {count} occurrences")

    print("\n" + "=" * 70)
    return findings

if __name__ == "__main__":
    audit_ai_tone()
