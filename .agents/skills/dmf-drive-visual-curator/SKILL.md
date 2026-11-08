---
name: dmf-drive-visual-curator
description: >-
  Strategic Google Drive visual asset curator and SEO/GEO multi-image optimizer for DMF Talents (dmf-talents.de).
  Use this skill whenever selecting images from DMF's Google Drive (12,889+ photos across 278 folders),
  writing or enriching blog articles with multiple inline community photos, updating platform/landing page visuals,
  or optimizing visual E-E-A-T and ImageObject JSON-LD for German B2B SEO and GEO.
---

# DMF Drive Visual Curator & Multi-Image SEO/GEO Skill

This skill unlocks the full **12,889-photo / 1,995-video DMF Google Drive archive** (`contact@dmf.edu.vn`) using a deterministic **8-Pillar Scene-Cluster Architecture** instead of random file picking. It ensures every article and landing page showcases authentic **DMF Talents community proof** alongside specialized B2B visuals.

---

## 1. Why Random Drive Picking Fails (And How This Skill Solves It)

1. **macOS APFS Unicode NFD Trap:** Folder names on `/Users/chong/Library/CloudStorage/GoogleDrive-contact@dmf.edu.vn/Drive của tôi` use decomposed Unicode (`NFD`). Always normalize paths with `unicodedata.normalize("NFC", path)` before matching Vietnamese folder names.
2. **Camera Burst Clones:** Folders like `13 07.1 - Fuji` (`1,447` photos) and `100_FUJI` (`973` photos) contain 15–30 continuous burst shots per scene. Never pick consecutive filenames; always select at the **Scene-Cluster** level (`cluster_id`) where each cluster groups shots taken within a 20-second window.
3. **CloudStorage Streaming Latency:** Raw Fujifilm/Canon files are 15–25 MB (`7728x5152` px) virtual FileProvider stubs (`st_blocks == 0`). Use the pre-built metadata catalog ([`dmf-drive-catalog.json`](./resources/dmf-drive-catalog.json)) to filter in `0.01s`, and only stream the single **medoid frame** of each winning cluster.
4. **B2B Brand Safety Gate:** Automatically exclude the `BLACKLIST_OFF_BRAND` folders (`1,784` personal photos in `Bắp-DMF/Hình hà giang của bắp` and high-school leaflet booths in `Tiếp sức mùa thi` / `Uni Fair`).

---

## 2. The 8 Strategic DMF Visual Pillars (`11,105` On-Brand Photos)

| Pillar ID                                          | Folders |  Photos   | Strategic Role in B2B Platform & SEO/GEO Articles                                                                                             |
| :------------------------------------------------- | :-----: | :-------: | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| **`PILLAR_1_GERMANY_ARRIVAL_VISA_SUCCESS`**        |   16    |  **400**  | Proof of arrival in Germany, visa handover, airport departure & real life in Germany (Thiện Tuấn, Hoàng Duy, Hoàng Dung, An, Xuân Anh...).    |
| **`PILLAR_2_GERMAN_EXPERTS_INTERVIEW_COACHING`**   |    3    |  **182**  | German experts (Herr Achim Betticher, Herr Ralf, Herr Heiko) coaching candidates in interview readiness & German workplace discipline.        |
| **`PILLAR_3_GERMAN_DELEGATION_CULTURAL_EXCHANGE`** |   10    | **5,127** | German delegation & native instructors (Tilman, Melda, Sevil, Tamara, Jasmin) leading intercultural workshops & B1/B2 speaking labs.          |
| **`PILLAR_4_INTENSIVE_GERMAN_FACULTY`**            |    4    |  **561**  | DMF's Vietnamese-German faculty (Thầy Lộc, Thầy Khang, Cô Hạnh, DMF Teachers) teaching intensive A1–B2 courses.                               |
| **`PILLAR_5_CLASSROOM_COHORTS_STUDY_LIFE`**        |   46    | **1,279** | Cohorts `K14`–`K50` in daily study, mock interviews, digital tablet exams, and group teamwork at the academy.                                 |
| **`PILLAR_6_CANDIDATE_PORTRAITS_DOSSIERS`**        |    3    |  **857**  | Studio candidate portraits (`Profile`, `Profile mới`) for candidate cards, anonymized talent dossiers, and trust badges.                      |
| **`PILLAR_7_CAMPUS_FACILITIES_BRANDING`**          |    4    |  **65**   | DMF Academy reception lobby, classrooms, library, German/Vietnamese flag desk setups, and institutional branding.                             |
| **`PILLAR_8_COMMUNITY_CULTURE_EVENTS`**            |   10    | **2,634** | DMF Talents community spirit: outdoor retreats (`Dã ngoại`), German Christmas (`Giáng sinh`), and Lunar New Year at the German Study Village. |

For detailed topic-to-pillar mapping rules and German `<figcaption>` templates, read [pillar-taxonomy-and-geo-rules.md](./references/pillar-taxonomy-and-geo-rules.md).

---

## 3. Step-by-Step Workflow for Selecting & Embedding Drive Images

### Step 1: Refresh or Query the Scene-Cluster Catalog

If the catalog does not exist or new folders were added to Google Drive, run the fast metadata indexer (`< 0.3s` for all 12,889 photos):

```bash
python3 .agents/skills/dmf-drive-visual-curator/scripts/index_drive_catalog.py
```

### Step 2: Select Candidate Scene Clusters & Build a Contact Sheet

Never pick blind filenames. Run [select_drive_images.py](./scripts/select_drive_images.py) with the target pillar(s) or article topic to sample unused Scene Clusters and generate a visual contact sheet (`/tmp/dmf_contact_sheet.jpg`):

```bash
python3 .agents/skills/dmf-drive-visual-curator/scripts/select_drive_images.py \
  --pillars PILLAR_1_GERMANY_ARRIVAL_VISA_SUCCESS,PILLAR_2_GERMAN_EXPERTS_INTERVIEW_COACHING,PILLAR_3_GERMAN_DELEGATION_CULTURAL_EXCHANGE \
  --count 6 \
  --contact-sheet /tmp/dmf_contact_sheet.jpg
```

### Step 3: Visually Inspect the Contact Sheet (`read_file`)

Always call `read_file` on `/tmp/dmf_contact_sheet.jpg` to inspect all candidate frames simultaneously. Verify:

- **Framing & Expression:** Clear subject focus, natural expressions, no motion blur or closed eyes.
- **B2B Cleanliness:** No distracting Vietnamese promotional banners; if a great photo has minor classroom fluorescent cast or a handheld prop sign, pass `--retouch` when exporting or run Codex Image Edit (`identity-preserve`).

### Step 4: Export & Optimize Selected Clusters for Web (`1200x675` Progressive JPEG)

Export the chosen cluster IDs directly to `public/images/blog/` (or `public/images/community/`) and register them in the usage ledger so future articles never reuse the same burst cluster:

```bash
python3 .agents/skills/dmf-drive-visual-curator/scripts/select_drive_images.py \
  --export C0012:dmf-community-visa-handover.jpg,C0485:dmf-community-german-delegation.jpg \
  --out-dir public/images/blog
```

### Step 5: Enrich SEO/GEO Articles with Multi-Image Storytelling (3–4 Images per Post)

Every flagship SEO/GEO article should combine:

1. **1 Hero Cover Image (`post.cover_image`):** High-impact German workplace documentary photo or retouched DMF hero photo.
2. **2–3 Inline Authentic DMF Community Photos inside `post.content`:** Placed after key `<h2>` sections using semantic `<figure>` + `<figcaption>` HTML so German employers see real candidates, real German trainers (Achim Betticher, Tilman, Melda), and real arrival proof in Germany (Ümit Elezov, Thiện Tuấn, Hoàng Duy):

```html
<figure class="dmf-community-figure">
  <img
    src="/images/blog/dmf-community-example.jpg"
    alt="Deutsche Sprach- und Fachvorbereitung in der DMF Talents Akademie mit muttersprachlichen Lehrkräften"
    width="1200"
    height="675"
    loading="lazy"
  />
  <figcaption>
    <strong>Einblick in die DMF Talents Community:</strong> Intensive B1/B2-Kommunikationspraxis und
    interkulturelles Onboarding mit deutschen Dozenten am DMF-Campus vor der Ausreise nach
    Deutschland.
  </figcaption>
</figure>
```

> [!TIP]
> `blogStructuredData(post)` in [`lib/seo/blog.ts`](../../../lib/seo/blog.ts) automatically parses all inline `<figure>` / `<img>` tags from `post.content` and emits them as structured `ImageObject` nodes with `caption` and `url` inside the `BlogPosting` JSON-LD schema for Google Images and AI Overviews (GEO).
