# Khôi phục giao diện DMF Talents — 30/09/2026

Yêu cầu của chủ website: dừng M4 và khôi phục giao diện như trước khi bắt đầu các mốc phát triển. Bản tham chiếu: `4443279`; nền backend hiện tại: `8a57841`.

## Phạm vi đã khôi phục

- Trang chủ: HeroSection → PartnerSection → ServiceGateway → AboutSection → StatsDashboard → ValuesSection → ServicesSection → ProcessRoadmap → SalarySimulator → TalentShowcase → ContactSection.
- Header với Startseite, Lösungen, Für Arbeitgeber, Kooperation & Programme, Über uns; menu mobile và trạng thái thu gọn khi cuộn. Footer trở về nhóm liên kết cũ, giữ nút cài đặt quyền riêng tư.
- Sáu trang dịch vụ/chương trình chi tiết, trang tham chiếu, bố cục trang ứng viên và form yêu cầu hồ sơ gọn cũ.
- Kết nối lại ảnh nền/overlay, đối tác, ba chương trình và giới thiệu trong Theme Manager.
- Giữ DTO công khai và quy trình xuất bản; TalentShowcase nhận hồ sơ đã duyệt, không hiển thị mock/profile nháp. Giữ consent và sửa nhãn lương gross/net.
- Không thay API, auth, Supabase helpers, migration, notification outbox, quyền admin hoặc dữ liệu database.

Nội dung biên tập cũ được phục hồi theo yêu cầu; việc khôi phục không phải là xác minh lại số liệu/chứng nhận/cam kết kinh doanh cũ.

## Bằng chứng kiểm thử

- 95 tests / 9 files: PASS. Lint và type-check: PASS.
- Production build + HTTP smoke fixture: PASS (17 canonical pages, public data allowlist, API 401/no-store, lưu/retry/DB failure, admin inbox, redirects).
- Browser fixture: contact `Restoration contact fixture` và profile `Restoration profile fixture` gửi thành công và xuất hiện trong admin, profile giữ đúng mã 12345678. Chỉ dữ liệu giả trong bộ nhớ, outbound delivery disabled. Không gửi email thật.
- Desktop/mobile: 360,390,768,1280 px; dropdown cũ, chuyển DE/VN, modal cuộn được; sửa che hero, cắt menu tablet, nút outline trắng chữ và tràn thẻ quy trình.
- Preview `D3bJztUp6swCDxKvFagpSUtScVtF`: Ready tại commit `517d2c7f950d2d862f96f56ebb32838cdefebea3`. Cả 7 ảnh homepage từ cấu hình thật tải thành công. Tại viewport 360px, content width 352px.
- GitHub CI `36700274979`: success. Integration Vercel `dmf-germany`: success. Project trùng `dmf-germany-hb75` vẫn lỗi env từ trước, không phục vụ domain này.
- PR #7 đã merge: https://github.com/huynhngocphuc92-cmyk/dmf-germany/pull/7
- Main: `25f88c56e203299cba8702691bc0313ccc510594`.

## Production — PASS

- Vercel `3kjomU2Y8zCFnxgUQkBj7QsEGTxN`: Ready / Production / Current, kết thúc 17:10:34 GMT+7, commit `25f88c56e203299cba8702691bc0313ccc510594`, domain `www.dmf-talents.de`.
- CI main `36700627412`: success.
- 18 trang public HTTP 200, canonical/OG/title đúng; trang chủ có các section gốc và sáu landing page có cấu trúc chi tiết. Sitemap đủ 18 URL; redirect apex 308 giữ query; URL bài viết không tồn tại trả 404.
- API đọc chat/lead vẫn 401 với khách ẩn danh và no-store; admin 307 về login khi chưa đăng nhập. Phiên admin thật của người dùng vẫn vào được `/admin/requests`.
- Browser production hiển thị hero nền cũ, logo và menu gốc; console error scan trả danh sách rỗng. Ảnh được quan sát qua browser tool, không xuất thành file screenshot.
- Báo cáo HTTP máy đọc: `/tmp/dmf-restoration-production-verification.json`.
- Đã dừng backend fixture và đóng các tab kiểm thử. M4 tiếp tục dừng; chưa gửi thư thử thật.
- Không cấu hình thêm drains/error monitoring trong bản phục hồi; đây không phải nghiệm thu M4.
