# M2 — Báo cáo phát hành và nghiệm thu

Ngày kiểm tra: 29/09/2026, khoảng 18:49–18:55 (Asia/Ho_Chi_Minh).

**Trạng thái:** phần kỹ thuật M2 đã phát hành lên `https://www.dmf-talents.de` và kiểm chứng. CONTENT-02 chưa hoàn tất: chưa có xác nhận của DMF về hồ sơ, tư liệu, liên hệ và bằng chứng kinh doanh. Chưa xác minh trong Search Console vì chưa có quyền truy cập.

## Bản phát hành

- PR: https://github.com/huynhngocphuc92-cmyk/dmf-germany/pull/5 — đã squash merge.
- Commit nhánh: `b3526672596258e8259f025a284df85781ec0142`.
- Commit production/main: `cf912ecf455550bc9ff49b9b5d08fb2fbe8cf173`.
- CI nhánh: https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36563540597 — success.
- CI main: https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36564005104 — success.
- Vercel production: https://vercel.com/huynhngocphuc92-cmyks-projects/dmf-germany/AUKR7htC1Ce2xNFoibhmMqyKVydp — Ready, Production, đúng commit, gắn domain chính.
- Preview: https://vercel.com/huynhngocphuc92-cmyks-projects/dmf-germany/GjYw6EJ2Nm7QUxkbgmmWFngwjYKj — Ready.

Dự án Vercel trùng `dmf-germany-hb75` vẫn báo build lỗi do thiếu biến môi trường như đã ghi nhận ở M1. Đây không phải dự án phục vụ domain chính; không thay đổi cấu hình dự án trùng trong M2.

## Kiểm thử mã và HTTP

CI trên đúng commit main đạt lint, type-check, **82 tests / 8 files**, production build và smoke test. `npm audit` báo 0 vulnerabilities tại thời điểm chạy.

Smoke dùng backend fixture cục bộ, không dùng khóa production: 16 URL kiểm tra canonical/OG/title; nội dung mẫu; robots/noindex; sitemap; đổi slug trả HTTP 308 thật; bài ẩn và alias trả HTTP 404; quyền API; lưu yêu cầu, retry và lỗi database. Root loading boundary chuyển vào admin để redirect/404 không bị trả thành streaming HTTP 200.

Kiểm tra HTTP trực tiếp production:

- 15 trang tĩnh/public cùng 2 bài blog đang xuất bản: HTTP 200, canonical đúng domain/path, OG URL đúng, title có một thương hiệu, có description.
- Sitemap có đúng 17 URL hiện hành, không có login/admin; robots không chặn `/_next/`.
- `/login` có noindex trong HTML và header; `/admin/candidates` ẩn danh trả 307 về login và noindex.
- `/api/leads` và `/api/chat/history` ẩn danh trả 401, no-store; endpoint Telegram cũ trả 410.
- `https://dmf-talents.de/blog?m2=1` trả 308 tới host www, giữ path/query.
- Bài blog không tồn tại trả HTTP 404.
- Probe yêu cầu hồ sơ với UUID đã xác minh không tồn tại trả 400 và thông báo hồ sơ không còn khả dụng. Luồng server credential/RPC hoạt động; không có yêu cầu được chấp nhận hoặc thông báo được gửi.

Chi tiết script kiểm tra tạm: `/tmp/dmf-m2-production-verify.py`, kết quả `/tmp/dmf-m2-production-verification.json`. Đây là tệp kiểm tra cục bộ, không đưa vào ứng dụng.

## Database thật

Migration `20260929111530_publication_and_blog_urls.sql` đã áp dụng vào Supabase `iihprcuhmilmymlbktpy` bằng SQL Editor. Giao dịch kiểm tra fingerprint toàn bộ dữ liệu cũ, loại trừ 5 cột mới, xác nhận dữ liệu ứng viên được giữ nguyên. Có 4 hồ sơ, tất cả bắt đầu ở draft; 2 bài blog vẫn được giữ.

Bốn hàm SQL trên production khớp nội dung migration cục bộ sau khi loại bỏ comment/khoảng trắng: `dmf_review_candidate`, `dmf_receive_intake`, `dmf_validate_profile_inquiry`, `dmf_preserve_post_slug`.

Kiểm thử giao dịch thật với dữ liệu tổng hợp và ROLLBACK đã đạt: admin hiện có duyệt/audit được; anon không đọc draft hay ghi chú đồng ý; hồ sơ published không featured vẫn dùng được; service intake tạo dữ liệu/outbox trong giao dịch; sửa thông tin công khai tự rút hồ sơ; alias blog chỉ hoạt động khi bài còn published; user không có quyền không đọc được dữ liệu bảo vệ. Không chạy bộ gửi thông báo. Kiểm tra sau rollback: 4 hồ sơ, 0 published, 0 fixture candidate, 2 bài, 0 alias.

Migrations trước đây được áp dụng qua SQL Editor; cần đối chiếu migration history trước khi dùng CLI `db push`.

## Kiểm tra giao diện

- Đăng nhập admin thật còn hoạt động, thấy đủ 4 hồ sơ và liên kết **Vorschau & Freigabe**; tất cả hiện **Nicht öffentlich**.
- Trang preview hiển thị DTO công khai, trường bằng chứng đồng ý, ngày hết hạn, checkbox xác nhận và nút duyệt. Không bấm duyệt hồ sơ thật.
- Có 3 hồ sơ cũ có category thiếu/không thuộc `azubi`, `skilled`, `seasonal`. Preview chặn duyệt và yêu cầu sửa dữ liệu. Không tự đoán và sửa thông tin nghiệp vụ.
- Trang ứng viên công khai hiện thông báo chưa có hồ sơ phù hợp cùng CTA gửi nhu cầu; không lấy hồ sơ mẫu thay thế.
- Trình duyệt fixture cục bộ đã chạy thao tác rút hồ sơ, chặn submit thiếu xác nhận, duyệt lại và đối chiếu HTML public. Hành vi database được kiểm tra riêng bằng PGlite và giao dịch thật kể trên.
- Máy chủ fixture đã dừng và tab localhost đã đóng. Ảnh giao diện đã xem trong công cụ, không lưu thành tệp ảnh bàn giao.

## Việc còn cần đầu vào

1. DMF xác nhận hồ sơ và quyền công khai ảnh/video; bổ sung category và dữ liệu thiếu, rồi admin duyệt từng hồ sơ với bằng chứng và hạn hiệu lực.
2. Xác nhận thông tin liên hệ/pháp nhân, số liệu, chứng nhận và tư liệu đối tác. Không tạo bằng chứng hoặc số liệu thay DMF.
3. Hai bài blog cũ, brochure, ảnh cấu hình và nội dung pháp lý vẫn cần chủ nội dung rà soát; M2 chưa phải kiểm định toàn bộ nội dung/pháp lý. Xem `docs/m2-content-register.md`.
4. Search Console chưa kiểm tra. Email thật và staging tách biệt là việc vận hành còn lại từ M1.
5. Storage ảnh hiện vẫn public như trước; rút hồ sơ khỏi website không thu hồi URL ảnh đã chia sẻ. Chưa chuyển storage sang private trong mốc này.

Hướng dẫn vận hành và rollback: `docs/m2-implementation.md`. Khi rollback giao diện phải giữ ranh giới đọc dữ liệu nghiêm ngặt của database.
