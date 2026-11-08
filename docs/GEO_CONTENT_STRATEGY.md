# Chiến lược Nội dung GEO (Generative Engine Optimization) — DMF Talents

Tài liệu này quy định chuẩn biên tập **GEO-First (Generative Engine Optimization)** cho toàn bộ hệ thống bài viết B2B trên `https://www.dmf-talents.de`, giúp nội dung của DMF Talents được **ChatGPT Search, Perplexity, Google AI Overviews, Claude và Microsoft Copilot** ưu tiên trích dẫn (Citation) khi doanh nghiệp Đức tìm kiếm giải pháp tuyển dụng nhân sự & học viên nghề từ Việt Nam.

---

## 1. Sự khác biệt cốt lõi: Bài viết SEO truyền thống vs. Bài viết GEO cho AI

| Tiêu chí                                   | Bài viết SEO truyền thống                              | Bài viết GEO (AI Citation Architecture)                                                                                                                         |
| :----------------------------------------- | :----------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mục tiêu tìm kiếm**                      | Từ khóa ngắn (Keyword: _"Fachkräfte Vietnam"_)         | Câu hỏi hội thoại dài của B2B Buyer (Prompt: _"Was ist für Kliniken schneller: § 16d Anerkennungspartnerschaft oder § 18a AufenthG?"_)                          |
| **Đoạn mở đầu**                            | Dẫn dắt dài dòng về tình trạng thiếu hụt nhân sự chung | **Answer-First (`Das Wichtigste in Kürze`)**: Trả lời trực diện câu hỏi trong 50–80 từ đầu tiên kèm căn cứ pháp lý                                              |
| **Cấu trúc thẻ `<h2>` / `<h3>`**           | Tiêu đề chung chung                                    | **Tiêu đề dạng câu hỏi kết thúc bằng dấu `?`** + câu trả lời 2 câu nằm ngay ở thẻ `<p>` đầu tiên bên dưới (tự động sinh `FAQPage` JSON-LD)                      |
| **Trình bày dữ liệu so sánh**              | Đoạn văn xuôi dài                                      | **Bảng HTML chuẩn (`<table><thead>...<tbody>`)** so sánh rõ tiêu chí, thời gian, cơ quan thẩm định và chi phí                                                   |
| **Độ tin cậy thực thể (Entity & E-E-A-T)** | Nêu chung chung "theo quy định của Đức"                | Neo chính xác điều luật (`§ 18a/b`, `§ 16a`, `§ 16d`, `§ 81a AufenthG`, `§ 296a SGB III`, `BQFG`) và cơ quan (`IHK FOSA`, `HWK`, `ZAV`, `Landesamt für Pflege`) |

---

## 2. Công thức 4 Phần bắt buộc của một bài viết chuẩn GEO tại DMF Talents

Mọi bài viết mới (do biên tập viên viết hoặc tạo qua AI Blog Writer tại `/admin/blog-writer`) đều tuân thủ 4 khối cấu trúc:

1. **Khối 1 — Answer-First / TL;DR (`Das Wichtigste in Kürze`):**
   - Đặt ngay đoạn `<p>` đầu tiên của bài viết (50–80 từ).
   - Tóm tắt câu trả lời cốt lõi, điều luật áp dụng và tiêu chí ra quyết định cho nhà tuyển dụng Đức.
2. **Khối 2 — Subheadings dạng câu hỏi (`<h2>... ?</h2>`) để tự động sinh `FAQPage` JSON-LD:**
   - Tối thiểu **2 đến 3 thẻ `<h2>` hoặc `<h3>`** được viết dưới dạng câu hỏi thực tế của HR Đức (có dấu `?` ở cuối).
   - Ngay dưới mỗi thẻ `<h2>... ?</h2>` là một thẻ `<p>` trả lời trực tiếp, súc tích (tối thiểu 35 ký tự).
   - Hệ thống [`extractFaqFromHtml()`](../lib/seo/blog.ts) sẽ tự động bóc tách các cặp `<h2>?` + `<p>` này thành `FAQPage` Schema trong JSON-LD của trang `/blog/[slug]`.
3. **Khối 3 — Bảng so sánh ngữ nghĩa (`<table>`):**
   - Mỗi bài so sánh lộ trình visa, ngành nghề, chi phí hoặc quy trình đều phải có ít nhất 1 bảng `<table><thead><tr><th>...</th></tr></thead><tbody>...</tbody></table>`.
   - Các mô hình LLM (GPT-4o, Claude, Gemini, Perplexity) ưu tiên trích xuất bảng dữ liệu có cấu trúc cao gấp nhiều lần so với văn bản thuần.
4. **Khối 4 — Neo thực thể pháp lý (Entity Anchoring) & Bước tiếp theo (Verified CTA):**
   - Luôn tuân thủ tuyệt đối `FACTS_GUARDRAIL` (không bịa số liệu, không cam kết đậu visa 100%, tuân thủ `§ 296a SGB III` Employer-Pays).
   - Kết bài bằng 1 liên kết nội bộ xác thực dẫn tới công cụ chuyển đổi:
     - Tuyển nhân sự có tay nghề: `/services/skilled-workers`
     - Tuyển Azubi học nghề kép: `/services/azubi`
     - Công cụ tính ROI & Cost of Vacancy: `/roi-rechner`
     - Công cụ mô phỏng tiến độ `§ 81a AufenthG`: `/fuer-arbeitgeber/zeitplan`
     - Gửi yêu cầu nhân sự B2B: `/fuer-arbeitgeber/personalbedarf`

---

## 3. Ma trận 15 Chủ đề GEO Trọng điểm (Prompt-Targeted Topic Matrix)

Được định nghĩa trong [`lib/geo/topic-matrix.ts`](../lib/geo/topic-matrix.ts) và tích hợp trực tiếp vào AI Blog Writer ([`lib/prompts/blog-writer.ts`](../lib/prompts/blog-writer.ts)):

### Cụm 1: So sánh Pháp lý & Lộ trình FEG (`legal-comparison`)

1. **`geo-01-16d-vs-18a-vergleich`**: _§ 16d Anerkennungspartnerschaft vs. § 18a AufenthG: Entscheidungsmatrix für Arbeitgeber_
2. **`geo-02-81a-bundeslaender-leitfaden`**: _§ 81a AufenthG in der Praxis: Ablauf, Vollmacht und Fristen bei der Ausländerbehörde_
3. **`geo-03-employer-pays-296a-compliance`**: _Compliance-Checkliste § 296a SGB III: Rechtssichere Ausbildungsvermittlung ohne Bewerbergebühren_

### Cụm 2: So sánh Quốc gia & Chiến lược Tuyển dụng (`country-comparison`)

4. **`geo-04-vietnam-vs-drittstaaten-vergleich`**: _Fachkräfte & Azubis international rekrutieren: Vietnam im sachlichen Ländervergleich_
5. **`geo-05-ausbildung-vs-fachkraft-entscheidung`**: _Azubi (§ 16a) oder Fachkraft (§ 18a) aus Vietnam? Entscheidungshilfe nach Betriebsgröße und Bedarf_

### Cụm 3: Chuyên sâu theo Ngành & Kiểm tra Tay nghề (`industry-deep-dive`)

6. **`geo-06-pflege-kennispruefung-anpassungslehrgang`**: _Kenntnisprüfung vs. Anpassungslehrgang in der Pflege: Leitfaden für Pflegedienstleitungen_
7. **`geo-07-handwerk-praxistest-elektroniker-shk`**: _Fachpraxis vorab prüfen: Arbeitsproben für Elektroniker und SHK-Fachkräfte aus Vietnam_
8. **`geo-08-industrie-cnc-schweisser-qualifikation`**: _CNC-Zerspaner & ISO-9606-Schweißer aus Vietnam: Technische Qualifikation für Industriebetriebe_
9. **`geo-09-gastronomie-hotellerie-saison-vs-ausbildung`**: _Personalgewinnung für Hotellerie & Gastronomie: Azubis (§ 16a), Köche (§ 18a) und Saisonkräfte im Vergleich_

### Cụm 4: Bài toán Kinh tế, ROI & Trợ cấp Nhà nước (`roi-finance`)

10. **`geo-10-zeitarbeit-vs-auslandsrekrutierung-roi`**: _Zeitarbeit vs. Direktrekrutierung aus Vietnam: Vollkosten- und Break-Even-Analyse für Arbeitgeber_
11. **`geo-11-foerdermittel-asa-flex-anerkennungszuschuss`**: _Fördermöglichkeiten für Betriebe: AsA flex (§ 75 SGB III), Berufssprachkurse und Anerkennungszuschuss_

### Cụm 5: Ngôn ngữ, Nhà ở, Onboarding 90 Ngày & Giữ chân > 90% (`onboarding-retention`)

12. **`geo-12-b1-vs-b2-sprachzertifikate-praxischeck`**: _Deutsch B1 oder B2 im Betrieb? Sprachanforderungen nach Berufsbild realistisch einschätzen_
13. **`geo-13-wohnraum-organisation-checkliste-arbeitgeber`**: _Wohnraum für internationale Fachkräfte & Azubis: 4 erprobte Modelle für Arbeitgeber_
14. **`geo-14-erste-30-tage-ankunft-behorden-fahrplan`**: _Die ersten 30 Tage nach der Einreise: Behörden-, Bank- und Sozialversicherungs-Checkliste für HR_
15. **`geo-15-patensystem-teamintegration-fluktuation-senken`**: _Probezeit erfolgreich gestalten: Patensystem und interkulturelle Führung für > 90 % Verbleibquote_

---

## 4. Quy trình Đồng bộ & Kiểm thử Tự động (GEO Workflow)

Khi thêm hoặc biên dịch bài viết mới trong `content/drafts/*.md` -> `content/compiled/all-posts.json`:

1. **Đồng bộ toàn bộ bài viết vào hệ sinh thái GEO (`llms.txt`, `llms-full.txt`, `blog-catalog.ts`):**
   ```bash
   npm run geo:sync
   ```
2. **Chạy kiểm toán GEO & Agent-Readiness (16 hạng mục):**
   ```bash
   npm run geo:audit
   ```
3. **Chạy bộ Unit Tests kiểm chứng GEO & Blog Structured Data:**
   ```bash
   npx vitest run tests/geo-optimization.test.tsx tests/blog-seo.test.ts
   ```
