# M3 — Báo cáo phát hành và nghiệm thu kỹ thuật

Ngày kiểm tra: 30/09/2026, hoàn tất khoảng 16:32 (Asia/Ho_Chi_Minh).

**Trạng thái: phần kỹ thuật M3 đã phát hành và kiểm chứng trên production.** Duyệt nội dung kinh doanh và các đầu vào được liệt kê cuối báo cáo vẫn đang chờ DMF.

## Phạm vi

Trang chủ và ba dịch vụ tập trung doanh nghiệp Đức; form Personalbedarf dùng chung cho homepage, dịch vụ, trang riêng và hồ sơ; bộ lọc ứng viên; consent có thể mở lại/thu hồi; một inbox admin cho website/chat/profile với người phụ trách, lịch liên hệ lại, bước tiếp theo, ghi chú và kiểm soát sửa đồng thời. Giữ quy trình duyệt hồ sơ M2. Không phát hành hồ sơ thật, không tạo bằng chứng kinh doanh hoặc gửi email thử ra ngoài.

## Bản phát hành

- PR đã merge: https://github.com/huynhngocphuc92-cmyk/dmf-germany/pull/6
- Nhánh cuối: `3ab7bb307ceba5005deb9013c35740954ab0dddc`.
- Main: `8a578411b6681949c76329b88b247913a91a3486`.
- CI nhánh: https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36695969067 — success.
- Preview dự án chính: https://vercel.com/huynhngocphuc92-cmyks-projects/dmf-germany/Fmc2bya6pW2JjBM8kc4Tn9VKfGuJ — Ready theo trạng thái GitHub/Vercel.
- CI main: https://github.com/huynhngocphuc92-cmyk/dmf-germany/actions/runs/36696213259 — success, 95 tests / 9 files; audit 0 vulnerabilities tại thời điểm chạy.
- Production: https://vercel.com/huynhngocphuc92-cmyks-projects/dmf-germany/9G2a4NW6Wbsp2B18koUE8fWKWiou — Ready, Production, đúng commit `8a57841`, gắn domain chính; hoàn tất 16:29:34.

Dự án Vercel trùng `dmf-germany-hb75` vẫn lỗi như M1/M2; không phải dự án phục vụ domain chính. Không thay đổi dự án trùng.

## Kiểm thử code và trình duyệt

- 95 tests / 9 files; lint, TypeScript, production build, npm audit và smoke HTTP đạt trong CI nhánh cuối.
- SQL thật được chạy bằng PGlite, kiểm tra intake/outbox/retry, tham chiếu hồ sơ, quyền RLS, chủ sở hữu hợp lệ, revision, sửa đồng thời và mapping trạng thái. Fixture auth.email dùng varchar(255) như Supabase.
- Smoke HTTP dùng Next production build với backend local cô lập: public DTO, 17 URL canonical/OG/title trong fixture (16 trang tĩnh + 1 bài), noindex/private API, sitemap/308/404; nhận contact/profile/chat/hiring; lỗi DB không báo thành công; retry; admin inbox/detail đăng nhập.
- Trình duyệt đã gửi thành công từ homepage, cả ba trang dịch vụ và modal hồ sơ. Lỗi database giữ nguyên dữ liệu form; form trống báo lỗi và focus vào trường đầu tiên. Mã hồ sơ #12345678 được giữ trong admin; đây chỉ là dữ liệu local.
- UTM source/campaign từ homepage được giữ khi chuyển sang Fachkräfte bằng liên kết nội bộ; admin hiển thị đúng trang gửi và chiến dịch. Chỉ lưu 3 trường cho phép trong bộ nhớ tab; tải lại tài liệu sẽ reset.
- Admin local giao cho tài khoản fixture, chuyển In Bearbeitung, đặt ngày 02/10/2026, bước tiếp theo và ghi chú; thông báo lưu thành công; tải lại vẫn giữ đủ giá trị. Bộ lọc không có kết quả có CTA/reset. Mã khách nhận là mã receipt; admin tra cứu được mã này, không nhầm với record UUID.
- Kiểm tra 360/390/768/1280px; không tràn ngang sau khi responsive layout cập nhật, modal cuộn được; menu mở bằng bàn phím và đóng bằng Escape. Consent accept-all -> mở lại -> reject -> mở lại phản ánh đúng hai checkbox. Gửi form hoạt động khi từ chối cookie tùy chọn. EN được giữ khi reload và html.lang=en; đã chuyển lại DE.
- Ảnh giao diện được quan sát trong công cụ, chưa có tệp ảnh bàn giao. Server fixture đã dừng; tab local đóng ở cuối lượt.

## Database production

Migration `20260929115942_employer_request_workflow.sql` được áp dụng qua SQL Editor vào `iihprcuhmilmymlbktpy`. Trong giao dịch có khóa và đối chiếu fingerprint toàn bộ giá trị cũ: **không đổi dữ liệu lịch sử**, 0 inquiries, 1 lead, 0 receipts, 1 trusted admin.

Lượt kiểm tra đầu phát hiện auth.users.email là varchar trong production; đã sửa cast sang text, cập nhật migration trước merge và fixture kiểm thử, rồi chạy lại thành công. Không có bản ứng dụng M3 nào được đưa lên production trước bản sửa này.

Giao dịch production tổng hợp và ROLLBACK đã đạt: hiring context/reference, retry chỉ một bộ outbox, hồ sơ không khả dụng bị từ chối, danh sách admin hiện có, owner không hợp lệ bị chặn, giao admin hiện có, follow-up/notes/next action, revision tăng, stale edit không ghi đè, completed không coi là hợp đồng, lead qualified/converted giữ ngữ nghĩa; anon bị từ chối, non-admin thấy 0 dòng và không sửa được. Sau rollback: 0 fixture receipts, 0 inquiries, 1 lead, 0 receipts, 0 published profiles. Không chạy gửi thông báo trong giao dịch.

Bốn hàm production có hash nội dung khớp migration sau khi bỏ whitespace:

- dmf_private.request_assignees: dc4c8f77412414d4ca98e5c3314fa5c2
- public.dmf_request_assignees: f8c7852203ba599b74720204d193f68e
- public.dmf_request_workflow_revision: dddbf17f95cb00e21cf63b4bbe17923c
- public.dmf_receive_intake: e614c2f251fab1c574e94ca7134fb840

Inbox có security_invoker=true. Hàm directory đặc quyền ở schema private, kiểm tra admin từ server; các hàm public mới là invoker, search_path rỗng, anon không có EXECUTE. Không cấp người dùng mới hoặc mở quyền ghi public.

Đã xem Advisor Center (gồm 9 mục mở rộng). Còn các cảnh báo cấu hình trước M3: hàm update_modified_column search_path mutable, leaked-password protection chưa bật, storage public/listing, các permissive policy cũ, public dmf_is_admin và tối ưu RLS/index. Không có cảnh báo mới về view invoker/helper M3 trong danh sách hiển thị; index M3 chưa dùng trên dữ liệu nhỏ là bình thường. Đây không phải chứng nhận toàn bộ database không còn cảnh báo; ranh giới quyền thực tế được kiểm chứng bằng SQL ở trên. Không thay đổi tùy tiện policy/storage cũ trong mốc này.

## Nghiệm thu production sau deploy

- 18 URL công khai trả 200, canonical/OG/title/description đúng; sitemap có đủ 18 URL, gồm trang nhu cầu mới và 2 bài cũ. Trang nhu cầu riêng có h1. Trang chủ đúng nội dung employer mới.
- Robots cho phép crawler tải tài nguyên; login/admin noindex; anon vào admin bị chuyển tới login. API đọc leads/chat trả 401/no-store. Apex chuyển 308 tới www và giữ path/query. Blog không tồn tại trả HTTP 404.
- POST `/api/hiring` với mã hồ sơ đã xác minh không khả dụng trả HTTP 400 và “Dieses Kandidatenprofil ist nicht mehr verfügbar.” Không yêu cầu nào được chấp nhận hoặc gửi thông báo. Lượt assertion đầu của script sai chữ hoa/thường; response ứng dụng đúng, đã sửa assertion và chạy lại đạt.
- Admin thật vào inbox mới, thấy đúng 1 lead cũ, trạng thái Neu/chưa giao; mở chi tiết không lỗi, danh sách owner gồm lựa chọn trống và admin hiện có. Không sửa lead thật để kiểm thử.
- Trang chủ được xem trực tiếp trên domain chính; dùng ảnh/logo đã cấu hình trước đây. Tab website và inbox được giữ để bàn giao. Server/tab local đã dừng/đóng.
- Chi tiết HTTP: `/tmp/dmf-m3-production-verification.json`; script `/tmp/dmf-m3-production-verify.py`. Negative intake: `/tmp/dmf-m3-negative-intake.py`.

## Giới hạn còn lại

DMF vẫn cần duyệt nội dung tiếng Đức, cách phản hồi khách, xác nhận dữ kiện liên hệ/pháp nhân, cung cấp hồ sơ và quyền ảnh/video; 4 hồ sơ thật vẫn draft, 3 hồ sơ còn category cần sửa có căn cứ. Video thật chưa có hồ sơ đã duyệt để kiểm tra phát nội dung trên production. M3 kiểm tra consent và điều kiện tải; không khẳng định toàn bộ nội dung/pháp lý đã được kiểm định.

Email/Telegram giao nhận thật, staging tách biệt, Search Console và đối chiếu GA4 thực tế chưa hoàn tất. M4 dành cho đo hiệu năng/conversion và bàn giao vận hành; không tự tuyên bố đạt Core Web Vitals.

Hướng dẫn migration, xử lý inbox và rollback: `docs/m3-implementation.md`. Giữ schema bổ sung và ranh giới quyền nếu rollback ứng dụng; không xóa dữ liệu workflow đã nhận. Migrations chạy qua SQL Editor nên cần đối chiếu history trước khi dùng CLI db push.
