# DMF Talents (`www.dmf-talents.de`) — Off-Page SEO, GSC & B2B Google Ads Playbook

Tài liệu triển khai vận hành ngoài code sau khi hoàn tất 3 pha tối ưu kỹ thuật, từ khóa Money Pages và phễu chuyển đổi (CRO) ngay trong bài blog.

---

## Phần 1: Google Search Console (GSC) — Checklist 10 phút sau khi deploy

1. **Xác nhận quyền sở hữu & Sitemap mới:**
   - Mở Google Search Console cho `https://www.dmf-talents.de` (đã có mã xác minh `cxHEbOkQtHVFOddEM2m2Gu6nK__Yb_3fJlxTpHlyqKA` trong `app/layout.tsx`).
   - Vào **Indexing → Sitemaps**, gửi lại `https://www.dmf-talents.de/sitemap.xml` (đã loại bỏ 33 bài ngoài luồng / trùng lặp, chỉ giữ các URL cốt lõi + Money Pages).
2. **Kiểm tra trạng thái lập chỉ mục (Indexing → Pages):**
   - Xem số URL đang ở trạng thái **Indexed** vs **Crawled – currently not indexed** và **Discovered – currently not indexed**.
   - Với các URL Money Pages trọng tâm bên dưới, bấm **URL Inspection → Request Indexing** ngay sau khi deploy:
     - `https://www.dmf-talents.de/`
     - `https://www.dmf-talents.de/services/azubi`
     - `https://www.dmf-talents.de/services/skilled-workers`
     - `https://www.dmf-talents.de/services/seasonal`
     - `https://www.dmf-talents.de/fuer-arbeitgeber/branchen/pflege-gesundheit`
     - `https://www.dmf-talents.de/fuer-arbeitgeber/branchen/handwerk-bau`
     - `https://www.dmf-talents.de/fuer-arbeitgeber/branchen/gastronomie-hotellerie`
     - `https://www.dmf-talents.de/fuer-arbeitgeber/branchen/industrie-metall-technik`
     - `https://www.dmf-talents.de/roi-rechner`
3. **Khai thác Quick-Win Queries (Performance → Search Results, lọc 28 ngày gần nhất):**
   - Lọc các từ khóa có **Impressions > 50** và **Average Position từ 8 đến 25** (trang 2–3 Google Đức).
   - Ưu tiên gắn internal link từ 3–5 bài viết liên quan về đúng trang đang có thứ hạng 8–25, hoặc cập nhật H2/FAQ của bài đó khớp đúng cụm từ người Đức đang gõ.
4. **Kiểm tra Core Web Vitals & Mobile Usability:**
   - Sau 48h deploy, kiểm tra lại LCP/TTFB trên PageSpeed Insights cho `/` và `/blog` để xác nhận mức HTML giảm (không còn `inlineCss` 750 KB và `/blog` không còn 3,91 MB).

---

## Phần 2: Xây dựng Entity & Backlink B2B tại thị trường Đức (Off-Page)

### Thông tin chuẩn (NAP — dùng đồng nhất 100% trên mọi hồ sơ)

- **Thương hiệu:** `DMF Talents` (thuộc `DMF VIETNAM JOINT STOCK COMPANY`, mã số thuế `3603878495`)
- **Website:** `https://www.dmf-talents.de`
- **Email B2B:** `contact@dmf-talents.de`
- **Đại diện trực tiếp tại Đức:** `Herr Umit Elezov` · Tel: `+49 174 9015811`
- **Trụ sở & Học viện đào tạo tại Việt Nam:** `Herr Achim Betticher` · `Dong Nai, Vietnam` · Tel: `+84 855 070773` / `+84 251 6609 500`

### 1. Danh sách kênh bắt buộc tạo/cập nhật trong tuần đầu

| Kênh                                                                      | Loại tín hiệu               | Link trỏ về                                                  | Ghi chú triển khai                                                                                     |
| ------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **LinkedIn Company Page (DE)**                                            | Entity + B2B Social         | `https://www.dmf-talents.de/fuer-arbeitgeber/personalbedarf` | Đặt ngôn ngữ chính là Tiếng Đức (`Personalvermittlung Vietnam – Fachkräfte & Azubis für Deutschland`). |
| **Google Business Profile**                                               | Local Trust DE              | `https://www.dmf-talents.de/`                                | Xác minh địa chỉ đại diện tại Đức (nếu đủ điều kiện văn phòng) hoặc Service Area Business tại Đức.     |
| **XING Unternehmensprofil**                                               | B2B DACH Entity             | `https://www.dmf-talents.de/`                                | Kênh nhân sự/HR truyền thống của doanh nghiệp vừa và nhỏ Đức (Mittelstand).                            |
| **ProvenExpert / Kununu**                                                 | Review & E-E-A-T            | `https://www.dmf-talents.de/referenzen`                      | Xin đánh giá từ các doanh nghiệp đối tác Đức đã tuyển học viên/nhân sự thành công.                     |
| **Wer liefert was (WLW) / Gelbe Seiten / Cylex DE**                       | Business Directory Backlink | `https://www.dmf-talents.de/services/skilled-workers`        | Đăng ký danh mục _Personalvermittlung / Fachkräftevermittlung Ausland_.                                |
| **AHK Vietnam / Hiệp hội ngành (bpa, DEHOGA, HWK/Kreishandwerkerschaft)** | High-Authority Citation     | `https://www.dmf-talents.de/fuer-arbeitgeber/branchen`       | Gửi bài chia sẻ chuyên môn hoặc tham gia danh bạ đối tác.                                              |

### 2. Mẫu mô tả tiếng Đức dùng sẵn cho LinkedIn / XING / Danh bạ Đức

**Phiên bản ngắn (160–220 ký tự):**

> DMF Talents vermittelt qualifizierte Fachkräfte (§ 18a/§ 81a), Azubis (§ 16a) und Saisonkräfte aus Vietnam für deutsche Unternehmen – mit eigener B1/B2-Akademie und direkter Vertretung in Deutschland.

**Phiên bản đầy đủ (Company Overview):**

> **DMF Talents** unterstützt Unternehmen, Kliniken, Pflegeeinrichtungen, Handwerksbetriebe und Hotels in Deutschland bei der langfristigen Gewinnung qualifizierter Fachkräfte und Auszubildender aus Vietnam.
>
> An unserer eigenen Sprach- und Fachakademie in Vietnam (Dong Nai) bereiten wir Kandidaten gezielt bis zum Niveau B1/B2 (Goethe / telc / ÖSD) sowie auf den deutschen Betriebsalltag vor. Unser Team übernimmt das komplette Recruiting, entscheidungsfähige Kandidatendossiers inkl. 90-Sekunden-Video, die Anerkennungs- und § 81a-Prozessbegleitung sowie die persönliche Betreuung durch unseren Repräsentanten in Deutschland (Umit Elezov) und in Vietnam (Achim Betticher).
>
> Alle Vermittlungen erfolgen strikt rechtssicher nach dem Fachkräfteeinwanderungsgesetz (FEG) und dem Employer-Pays-Prinzip (§ 296a SGB III).

### 3. Ba mẫu Email Pitch gửi bài chuyên môn (Guest Post / PR ngành tại Đức)

1. **Ngành Điều dưỡng (tạp chí/cổng Pflege / bpa / Altenheim):**
   - _Tiêu đề:_ `Praxiserfahrung § 16d & 1+2-Modell: Wie Pflegeheime Abbruchquoten bei vietnamesischen Pflegekräften unter 8 % halten`
   - _Link chèn tự nhiên:_ `/fuer-arbeitgeber/branchen/pflege-gesundheit`
2. **Ngành Thủ công (Handwerksblatt / cổng Kreishandwerkerschaft / SHK):**
   - _Tiêu đề:_ `Arbeitsproben statt blindes Lebenslauf-Lesen: Wie SHK- und Elektrobetriebe Azubis & Gesellen (§ 16a/§ 18a) sicher auswählen`
   - _Link chèn tự nhiên:_ `/fuer-arbeitgeber/branchen/handwerk-bau`
3. **Ngành Nhà hàng – Khách sạn (DEHOGA địa phương / AHGZ):**
   - _Tiêu đề:_ `Saisonkräfte (§ 15d BeschV) oder § 16a-Azubis aus Vietnam? Eine 3-Jahres-Kostenrechnung für Hotels & Gastronomie`
   - _Link chèn tự nhiên:_ `/roi-rechner`

---

## Phần 3: Chiến dịch Google Ads Search B2B (kéo Lead ngay trong lúc chờ SEO trưởng thành)

> **Mục tiêu:** Chỉ hiển thị quảng cáo với **chủ doanh nghiệp / phòng nhân sự (HR) tại Đức** đang tìm đơn vị tuyển dụng, chặn triệt để ứng viên Việt Nam tìm việc hoặc người tìm thông tin xin visa tự túc.

### 1. Cài đặt chiến dịch

- **Loại chiến dịch:** Search Only (tắt Display Network & Search Partners trong 30 ngày đầu).
- **Địa lý nhắm mục tiêu:** **Germany (Deutschland)** — chọn _Presence: People in or regularly in your targeted locations_ (KHÔNG chọn _Presence or interest_).
- **Ngôn ngữ:** German (`Deutsch`).
- **Ngân sách đề xuất khởi điểm:** 25–40 EUR/ngày.

### 2. Bộ 10 từ khóa mua hàng trực tiếp (Exact `[...]` & Phrase `"..."`)

| Nhóm quảng cáo           | Từ khóa                                     | Kiểu đối sánh  | Landing Page đích                                   |
| ------------------------ | ------------------------------------------- | -------------- | --------------------------------------------------- |
| **1. Azubis**            | `[azubis aus vietnam einstellen]`           | Exact / Phrase | `/services/azubi`                                   |
| **1. Azubis**            | `"auszubildende aus vietnam vermittlung"`   | Phrase         | `/services/azubi`                                   |
| **1. Azubis**            | `"vietnamesische azubis rekrutieren"`       | Phrase         | `/services/azubi`                                   |
| **2. Fachkräfte**        | `[personalvermittlung vietnam deutschland]` | Exact / Phrase | `/services/skilled-workers`                         |
| **2. Fachkräfte**        | `"fachkräfte aus vietnam einstellen"`       | Phrase         | `/services/skilled-workers`                         |
| **2. Fachkräfte**        | `"fachkräftevermittlung vietnam"`           | Phrase         | `/services/skilled-workers`                         |
| **3. Pflege**            | `"pflegekräfte aus vietnam vermitteln"`     | Phrase         | `/fuer-arbeitgeber/branchen/pflege-gesundheit`      |
| **3. Pflege**            | `"pflege azubis vietnam klinik"`            | Phrase         | `/fuer-arbeitgeber/branchen/pflege-gesundheit`      |
| **4. Handwerk / Gastro** | `"handwerker aus vietnam einstellen"`       | Phrase         | `/fuer-arbeitgeber/branchen/handwerk-bau`           |
| **4. Handwerk / Gastro** | `"köche aus vietnam einstellen"`            | Phrase         | `/fuer-arbeitgeber/branchen/gastronomie-hotellerie` |

### 3. Danh sách Từ khóa Phủ định bắt buộc (Negative Keywords — tránh đốt tiền vào B2C)

Thêm toàn bộ danh sách sau ở cấp độ chiến dịch ngay trước khi bật quảng cáo:

```text
arbeit suchen
jobangebote
stellenangebote
bewerbung
bewerben
lebenslauf
ausbildung suchen
ausbildungsplatz suchen
visum beantragen
botschaft termin
sprachkurs kostenlos
studium
bachelor
master
au pair
minijob
praktikum
gehalt als azubi
```

### 4. Hai mẫu Responsive Search Ad (RSA) tiếng Đức chuẩn B2B

**Mẫu A — Fachkräfte & Personalvermittlung (`/services/skilled-workers`):**

- _Headlines (tối đa 30 ký tự):_
  1. `Fachkräfte aus Vietnam`
  2. `Personalvermittlung für DACH`
  3. `B1/B2-Deutsch & § 81a-Service`
  4. `Direkte Vertretung in DE`
  5. `Erfolgsbasiertes Honorar`
  6. `Ersatzgarantie inklusive`
- _Descriptions (tối đa 90 ký tự):_
  1. `Geprüfte Fachkräfte (§ 18a/b) für Pflege, Handwerk & Industrie. Jetzt Profile anfordern.`
  2. `Inkl. B1/B2-Vorbereitung, Anerkennung & § 81a-Begleitung. Rechtssicher nach § 296a SGB III.`

**Mẫu B — Auszubildende § 16a (`/services/azubi`):**

- _Headlines (tối đa 30 ký tự):_
  1. `Azubis aus Vietnam (§ 16a)`
  2. `Für Pflege, Gastro & Handwerk`
  3. `Zertifiziertes B1-Niveau`
  4. `90-Sek-Video je Kandidat`
  5. `Hohe Bleibequote im Betrieb`
  6. `Ansprechpartner vor Ort`
- _Descriptions (tối đa 90 ký tự):_
  1. `Motivierte Auszubildende aus Vietnam für 2027. Geprüfte Dossiers kostenlos anfordern.`
  2. `Komplette Visum- & Integrationsbegleitung in Deutschland. Direkt unverbindlich anfragen.`

### 5. Theo dõi chuyển đổi (Conversion Tracking)

- Gắn sự kiện chuyển đổi vào các hành động gửi form thành công trên:
  - Form B2B trên `/fuer-arbeitgeber/personalbedarf`
  - Form nhận hồ sơ giữa bài viết (`InlineBlogLeadCard` gửi về `/api/leads` với `source: "blog-inline-cta"`)
  - Form liên hệ trang chủ `/#contact`
