**Kế hoạch phát triển DMF Talents — 29/09/2026**

**Cập nhật 30/09/2026 — thay đổi ưu tiên của chủ website:** Dừng M4. Khôi phục giao diện công khai về cấu trúc trước M0 tại `4443279`, giữ backend/phân quyền/tiếp nhận đã hoàn thành. PR #7 (`25f88c5`) phục hồi trang chủ, navigation và các landing page. Các mô tả thiết kế B2B của M3 dưới đây là lịch sử, không phải cấu trúc giao diện được tiếp tục áp dụng. Mọi thiết kế lại sau này phải được xem và thống nhất với chủ website trước khi triển khai.

Trọng tâm đã được anh xác nhận: **doanh nghiệp Đức cần tuyển dụng nhân sự Việt Nam**.

Cơ sở: [báo cáo đánh giá ngày 29/09/2026](/Users/chong/dmf-talents.de/.f5/00-audit/2026-09-29-project-review.md), checkout `4443279`. Đây là kế hoạch đề xuất; các đầu việc bên dưới chưa được triển khai. Các trạng thái “hoàn thành” trong tài liệu cũ cần đối chiếu lại với bằng chứng hiện tại.

**Kết quả cần đạt**

Website giúp doanh nghiệp Đức hiểu đúng dịch vụ, xem các hồ sơ được phép công khai, gửi nhu cầu tuyển dụng và nhận phản hồi từ DMF. Đội vận hành nhìn thấy yêu cầu trong quản trị, biết ai xử lý và trạng thái tiếp theo. Dữ liệu cá nhân được giới hạn đúng quyền; SEO dùng đúng domain; mỗi bản phát hành có kết quả kiểm tra.

Luồng chính: **nhu cầu tuyển dụng → dịch vụ phù hợp → hồ sơ/bằng chứng → yêu cầu tư vấn → DMF xử lý → cơ hội hợp tác**.

Tận dụng Next.js, Supabase và hệ thống quản trị hiện có. Nội dung tiếng Đức là ưu tiên cho các trang B2B. Giữ các URL đang có khi hợp lý; thay URL phải có mapping và redirect. Host chuẩn dự kiến là `https://www.dmf-talents.de`, theo routing production hiện tại; xác minh cấu hình Vercel/Cloudflare trước khi áp dụng.

**Lộ trình và ước lượng**

Ước lượng dưới đây là ngày công cho một người phụ trách kỹ thuật, có công cụ hỗ trợ và đầu mối DMF cung cấp nội dung/phản hồi. Tổng khoảng **14–21 ngày công**, cộng **3–5 ngày dự phòng**, tương đương khoảng **4–6 tuần làm việc**. Thời gian chờ quyền truy cập, dữ liệu và duyệt nội dung có thể kéo dài lịch. Ước lượng được cập nhật sau khi xác minh môi trường và database.

| Mốc                                | Khối lượng dự kiến | Sản phẩm bàn giao                                                                      | Điều kiện chuyển mốc                                                            |
| ---------------------------------- | ------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| M0 — Chặn lộ dữ liệu               | 0,5–1 ngày         | Bản vá nhỏ, kiểm thử quyền, xác minh sau deploy                                        | Khách ẩn danh không đọc được chat; payload công khai không chứa trường riêng tư |
| M1 — Nền tảng và nhận lead         | 4–6 ngày           | Phân quyền nhất quán, môi trường kiểm thử, dependency cập nhật, form lưu bền vững, CI  | Quyền truy cập và luồng lead vượt qua các ca kiểm thử thành công/thất bại       |
| M2 — SEO và độ tin cậy             | 2–3 ngày           | Domain/metadata đúng, nội dung mẫu được gỡ khỏi public, hồ sơ có quy trình xuất bản    | Crawler nhận đúng URL; public chỉ hiển thị nội dung đã duyệt                    |
| M3 — Trải nghiệm tuyển dụng B2B    | 4–6 ngày           | Trang chủ, ba trang dịch vụ, trang ứng viên, form tuyển dụng và luồng quản trị rõ ràng | Doanh nghiệp gửi được nhu cầu; DMF tiếp nhận và theo dõi được                   |
| M4 — Hiệu năng, đo lường, bàn giao | 3–5 ngày           | Báo cáo trước/sau, conversion được kiểm chứng, tài liệu vận hành                       | Các luồng quan trọng đạt nghiệm thu; có baseline và cách xử lý sự cố            |

M0 là bản phát hành riêng ngay khi bản vá đã được kiểm chứng. Các mốc sau bàn giao theo từng phần để có thể xem và thử sớm. Công việc nội dung của DMF có thể tiến hành trong thời gian xử lý kỹ thuật.

**M0 — Chặn lộ dữ liệu ngay khi bắt đầu triển khai**

- [ ] **SEC-01: Bảo vệ API đọc lịch sử chat.** Kiểm tra xác thực và quyền quản trị trước truy vấn; người chưa đăng nhập nhận 401, người không có quyền nhận 403. Xác minh tài khoản quản trị hợp lệ và nguồn cấp quyền trước khi áp dụng. Nếu chưa xác định được quyền hợp lệ, chặn endpoint đọc theo nguyên tắc mặc định từ chối.
- [ ] **SEC-02: Giới hạn dữ liệu ứng viên công khai.** Tạo kiểu dữ liệu công khai với danh sách trường được phép; bỏ `select('*')` và fallback xuất bản hồ sơ chưa được duyệt. Không đưa email, điện thoại, ngày sinh, ghi chú nội bộ vào HTML/RSC/API công khai. Làm mới cache ISR/CDN liên quan sau khi phát hành.
- [ ] **SEC-03: Xác minh bản vá trên đúng deployment.** Kiểm thử khách ẩn danh, user không có quyền và admin hợp lệ. Ghi nhận commit/deployment đã kiểm tra. Xem access log trong phạm vi quyền có sẵn để đánh giá truy cập trước đây; báo cáo phần chưa thể xác minh.

Phạm vi mã chính: `app/api/chat/history/route.ts`, `lib/supabase/candidates.ts`, các nơi truyền candidate sang Client Component, helper kiểm tra quyền dùng chung. Các API công khai còn lại được rà soát ở M1.

**Nghiệm thu M0:** yêu cầu đọc chat không được phép không trả dữ liệu; admin hợp lệ vẫn sử dụng được; kiểm tra payload trang chủ không có trường riêng tư; giao diện công khai vẫn hoạt động. Nếu cần rollback, duy trì chặn endpoint và lọc dữ liệu thay vì khôi phục hành vi gây lộ dữ liệu.

**M1 — Làm chắc nền tảng và việc nhận yêu cầu**

- [ ] **AUTH-01: Thống nhất phân quyền.** Rà API và Server Actions của chat, lead, ứng viên, bài viết, theme, AI. Dùng kiểm tra quyền tại từng điểm truy cập; phân biệt đăng nhập với quyền quản trị. Service-role chỉ dùng trong luồng server có mục đích rõ ràng. Kiểm tra quyền cả khi gọi trực tiếp, không chỉ qua giao diện.
- [ ] **DATA-01: Rà database thật.** Đối chiếu schema/migration với Supabase; kiểm tra RLS, grants và Storage cho public/admin. Luồng lưu chat phải kiểm tra quyền sở hữu phiên hoặc token phiên do server cấp, giới hạn kích thước và tần suất. Lập migration có kiểm chứng, bảo toàn dữ liệu và phương án phục hồi trước thay đổi schema.
- [ ] **ENV-01: Chuẩn hóa môi trường.** Xác minh repo, branch, deployment và domain đang dùng. Hoàn thiện `.env.example`; kiểm tra biến bắt buộc ngay khi khởi động/build. Preview dùng cấu hình và dữ liệu kiểm thử riêng; email/Telegram đi vào kênh kiểm thử được chỉ định. Hoàn thiện tài liệu chạy local.
- [ ] **DEP-01: Cập nhật dependency có chọn lọc.** Xác minh advisory áp dụng, ưu tiên Next.js và các thư viện ảnh/editor/email; cập nhật từng nhóm cùng lockfile và kiểm thử tương thích. Ghi rõ cảnh báo còn lại và lý do đánh giá, không xem số lượng audit là bằng chứng khai thác thực tế.
- [ ] **LEAD-01: Đảm bảo yêu cầu được lưu.** Chuẩn hóa phần xử lý dùng chung cho contact/profile/chat lead. Trả thành công sau khi có bản ghi tiếp nhận bền vững; trạng thái gửi thông báo phải phản ánh đúng kết quả, có khả năng gửi lại. Chặn gửi trùng khi người dùng bấm lại hoặc retry; validate trên server và áp dụng rate limit phù hợp môi trường production. Tách việc gửi Telegram thành hàm server nội bộ hoặc endpoint có xác thực phù hợp.
- [ ] **QA-01: CI và kiểm tra trọng yếu.** Dọn 8 lỗi lint hiện tại, xử lý cảnh báo theo nhóm; thêm CI type-check, lint, build và test quyền/dữ liệu/lead. Đồng bộ với pre-commit hiện có. Trạng thái mục tiêu khi đóng M1 là lint không còn lỗi, cảnh báo đã xử lý hoặc có ngoại lệ cụ thể được ghi nhận.

**Nghiệm thu M1:** thao tác đọc/ghi sai quyền bị từ chối; không có quyền anon rộng ngoài chủ đích; lưu lead thành công khi notification lỗi và có thể gửi lại; khi lưu thất bại không báo đã tiếp nhận; retry không tạo nhiều yêu cầu; CI chạy lại được từ checkout sạch với cấu hình kiểm thử. Việc gửi thử ra hệ thống thật chỉ thực hiện với địa chỉ/kênh test và phạm vi đã được thống nhất khi triển khai.

**M2 — Sửa SEO và dữ liệu tạo niềm tin**

Cập nhật 29/09/2026: phần kỹ thuật đã lên production tại commit `cf912ec`; xem [biên bản nghiệm thu M2](/Users/chong/dmf-talents.de/.f5/00-audit/2026-09-29-m2-release-verification.md). CONTENT-02 còn chờ DMF; Search Console chưa có quyền đối chiếu.

- [x] **SEO-01: Một nguồn cấu hình domain.** Dùng site URL chung cho metadata, canonical theo từng path, Open Graph, JSON-LD, sitemap và robots. Bỏ title lặp thương hiệu, thêm trang ứng viên vào sitemap; loại trang quản trị/đăng nhập khỏi index. Kiểm tra redirect host và tránh chặn tài nguyên crawler cần để render.
- [ ] **SEO-02: Cập nhật nội dung và cache đúng.** Kiểm tra bài viết publish/unpublish, đổi slug, sitemap và revalidation; xử lý URL cũ. Đối chiếu cấu trúc trang bằng Search Console khi có quyền truy cập. Chưa mở rộng cấu trúc URL đa ngôn ngữ trong mốc này.
- [x] **CONTENT-01: Quy trình xuất bản hồ sơ.** Bổ sung trạng thái công khai rõ ràng, tách khỏi “featured” và “visa ready”; admin xem trước và duyệt. Ẩn hồ sơ test/mẫu khỏi website, giữ lịch sử nội bộ cần thiết. Hồ sơ có thông tin sẵn sàng còn hiệu lực; dữ liệu thiếu có trạng thái hiển thị phù hợp.
- [ ] **CONTENT-02: Bộ nội dung được xác minh.** DMF cung cấp hồ sơ được phép giới thiệu, ảnh/video, thông tin liên hệ, số liệu thành công và tư liệu doanh nghiệp đối tác được phép công bố. Gắn nguồn/thời điểm cập nhật cho số liệu; chỉ hiển thị nội dung đủ căn cứ.

**Nghiệm thu M2:** các trang trong danh sách nghiệm thu trả 200 và canonical đúng domain/path; sitemap/robots thống nhất; trang pháp lý và blog không còn domain cũ; public không còn “Test”, `null`, URL video mẫu hoặc hồ sơ mẫu năm 2024; thay đổi trạng thái xuất bản được phản ánh ở website và sitemap.

**M3 — Xây luồng tuyển dụng B2B hoàn chỉnh**

Cập nhật 30/09/2026: phần kỹ thuật M3 đã phát hành tại `8a57841`; xem [biên bản nghiệm thu M3](/Users/chong/dmf-talents.de/.f5/00-audit/2026-09-30-m3-release-verification.md). Các mục dưới đây đánh dấu hoàn tất kỹ thuật; DMF vẫn cần duyệt nội dung/tư liệu và cách phản hồi, kiểm thử email thật chưa hoàn tất.

- [x] **B2B-01: Trang chủ tập trung nhà tuyển dụng.** Hero nói rõ DMF cung cấp nhân lực nào và hỗ trợ đến đâu. CTA chính dự kiến “Personalbedarf melden”, CTA phụ “Kandidaten ansehen”. Thứ tự nội dung: nhóm dịch vụ → bằng chứng/hồ sơ → quy trình và thời gian → hỗ trợ sau tuyển dụng → form nhu cầu.
- [x] **B2B-02: Ba trang dịch vụ có nội dung hỗ trợ quyết định.** Mỗi trang trình bày đối tượng phù hợp, điều kiện ứng viên, phạm vi DMF làm, trách nhiệm doanh nghiệp, các bước và yếu tố ảnh hưởng thời gian, FAQ và CTA liên quan. Mốc thời gian/chi phí/cam kết chỉ đưa vào khi DMF xác minh. Refactor thành phần dùng chung khi có lợi cho bảo trì.
- [x] **B2B-03: Trang ứng viên sử dụng dữ liệu thật.** Bộ lọc theo nhóm dịch vụ và trình độ tiếng Đức, trạng thái sẵn sàng; yêu cầu hồ sơ giữ đúng mã ứng viên. Thông tin công khai được tối thiểu hóa. Video chỉ xuất hiện khi có nguồn hợp lệ và tải được trong điều kiện consent phù hợp. Có trạng thái không có kết quả và lỗi tải dữ liệu.
- [x] **B2B-04: Form nhu cầu tuyển dụng ngắn gọn.** Thu thập công ty, người liên hệ/email và nhu cầu chính; điện thoại và chi tiết bổ sung có thể tùy chọn. Người gửi thấy xác nhận rõ cùng bước tiếp theo. Giữ nguồn trang/chiến dịch và mã hồ sơ khi có; không buộc doanh nghiệp tạo tài khoản ở đợt đầu.
- [x] **OPS-01: Luồng xử lý yêu cầu trong admin.** Tạo một nơi tiếp nhận rõ ràng cho yêu cầu website/chat/profile, chỉ rõ nguồn, trạng thái, người phụ trách, ghi chú và ngày cần liên hệ lại. Định nghĩa mapping trạng thái của `inquiries` và `leads` trước khi thay dữ liệu; không tự coi trạng thái “completed” là hợp đồng thành công. Kiểm tra phương án dùng dữ liệu hiện tại trước khi quyết định hợp nhất bảng.
- [x] **UX-01: Sửa các điểm cản trở thao tác.** Sửa tương phản nút cookie, lựa chọn từ chối và mở lại cài đặt; đồng bộ trạng thái consent. Sửa CSP cho đúng các dịch vụ nhúng được dùng. Nối label/input, hiển thị lỗi và focus bàn phím; kiểm tra menu, modal và form ở 360/390/768/1280px. Công cụ lương được chuyển khỏi luồng B2B chính và sửa nhãn gross/net; mô hình tính netto chi tiết để ở backlog.

**Nghiệm thu M3:** chạy trọn luồng từ trang chủ và từng trang dịch vụ đến yêu cầu đã lưu trong admin bằng dữ liệu kiểm thử. Yêu cầu hồ sơ giữ đúng ứng viên. Có thể giao người xử lý, đổi trạng thái và ghi nhận bước tiếp theo. DMF duyệt nội dung tiếng Đức, tư liệu công khai và cách phản hồi khách. Kiểm tra cả cookie được chấp nhận và bị từ chối.

**M4 — Tối ưu có đo lường và bàn giao vận hành**

- [ ] **PERF-01: Đo trước khi tối ưu.** Lưu baseline trang chủ, dịch vụ, ứng viên, blog bằng cùng thiết bị/mạng mô phỏng; dùng nhiều lần đo và trung vị. Ưu tiên ảnh hero, JavaScript ban đầu, tải chart/map/chatbot khi cần, truy vấn asset, kích thước PDF và cache. Kiểm tra lại sau thay đổi.
- [ ] **MEASURE-01: Xác minh conversion.** Ghi `generate_lead` sau khi tiếp nhận thành công, tránh trùng; phân biệt contact/profile/hiring request. Kiểm tra consent trước gửi analytics. Không đưa email, điện thoại, nội dung chat hoặc thông tin cá nhân vào GA4. Đối chiếu conversion test với bản ghi admin và loại dữ liệu test khỏi báo cáo kinh doanh.
- [ ] **OPS-02: Tài liệu và giám sát.** Hướng dẫn quản lý hồ sơ/bài viết, xử lý yêu cầu, gửi lại thông báo, quản lý env, release và rollback. Thiết lập báo lỗi theo hệ thống đang có; che dữ liệu cá nhân trong log. Xác minh backup và một lần khôi phục trên môi trường kiểm thử nếu có điều kiện truy cập.

Mục tiêu trải nghiệm khi đủ dữ liệu người dùng thực: LCP ≤2,5 giây, INP ≤200 ms, CLS ≤0,1 tại percentile 75, tách mobile/desktop theo [Core Web Vitals](https://web.dev/articles/vitals). Đây là mục tiêu, không phải số đo hiện tại. Trong giai đoạn nghiệm thu dùng báo cáo lab trước/sau; Lighthouse đơn lẻ không chứng minh INP hoặc kết quả người dùng thực.

**Nghiệm thu M4:** có báo cáo trước/sau, các luồng quan trọng không hồi quy, conversion được kiểm chứng, người vận hành thực hiện được việc cập nhật hồ sơ và xử lý yêu cầu theo hướng dẫn. Nếu chưa đủ dữ liệu field, ghi rõ thời điểm đánh giá lại thay vì đánh dấu đạt Core Web Vitals.

**Phân công và đầu vào cần khi triển khai**

| Người phụ trách         | Việc cần đảm nhận                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kỹ thuật                | Bản vá, code, migration, test, preview, tài liệu release và kết quả kiểm chứng                                                                        |
| Anh / đầu mối DMF       | Chọn tài khoản admin, ngành tuyển dụng trọng tâm, duyệt nội dung tiếng Đức, cung cấp hồ sơ/tư liệu được phép công khai, xác nhận quy trình nhận khách |
| Người quản lý hạ tầng   | Cấp quyền phù hợp cho repo/Vercel/Cloudflare/Supabase; cấu hình kênh test, SMTP, môi trường và log; phối hợp xác minh triển khai                      |
| Người quản lý marketing | Quyền Search Console/GA4, baseline nguồn truy cập và định nghĩa lead đủ điều kiện cùng đội tư vấn                                                     |

Lập trình và kiểm thử bằng mock/fixture có thể bắt đầu từ checkout hiện tại. Xác nhận database/production, email thật và dữ liệu analytics phụ thuộc quyền truy cập tương ứng. Chưa ấn định ngày phát hành theo lịch khi các đầu vào đó chưa được kiểm tra.

**Cách phát hành và nghiệm thu chung**

- Mỗi phần thay đổi có phạm vi rõ, liên kết với ticket và kết quả kiểm tra; M0 tách riêng để phát hành sớm.
- Kiểm thử quyền truy cập, trường dữ liệu công khai, validation, retry và notification thất bại là bắt buộc với phần liên quan. Giao diện được kiểm tra trực tiếp; không tạo test chỉ để lặp lại cách viết code.
- Preview dùng dữ liệu kiểm thử; theo dõi rõ commit nào đang ở production. Migration dữ liệu có backup, kiểm thử và kế hoạch rollback; tránh gộp thay schema lớn cùng thay giao diện.
- Sau deploy xác minh HTTP, quyền API, metadata, trang chính và luồng tiếp nhận phù hợp phạm vi đã thống nhất. Release chỉ được đánh dấu hoàn thành khi có bằng chứng kiểm chứng.

**Chỉ số kinh doanh theo dõi sau khi tracking đúng**

| Chỉ số                | Cách hiểu                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Yêu cầu hợp lệ        | Yêu cầu có liên hệ dùng được và nhu cầu tuyển dụng, đã loại spam/test/trùng                                  |
| Tỷ lệ gửi yêu cầu     | Phiên truy cập đủ điều kiện đo lường có gửi thành công / tổng phiên cùng phạm vi; ghi rõ giới hạn do consent |
| Lead đủ điều kiện     | Yêu cầu được đội DMF xác nhận phù hợp dịch vụ và có nhu cầu cụ thể                                           |
| Thời gian phản hồi    | Thời gian từ lúc lưu yêu cầu đến phản hồi đầu tiên của người phụ trách                                       |
| Hiệu quả theo dịch vụ | Số yêu cầu và lead đủ điều kiện theo Ausbildung/Fachkräfte/Saisonkräfte và nguồn truy cập                    |

Đề xuất đội DMF phản hồi trong một ngày làm việc, điều chỉnh theo năng lực vận hành. Thu thập baseline 2–4 tuần sau khi tracking ổn định rồi đặt mục tiêu tăng trưởng; chưa đưa ra cam kết phần trăm conversion hoặc thứ hạng Google khi chưa có dữ liệu.

**Backlog sau đợt đầu**

Portal doanh nghiệp, shortlist nhiều ứng viên, đặt lịch phỏng vấn, tích hợp CRM sâu, URL/SEO đa ngôn ngữ và tính lương netto chi tiết sẽ được ưu tiên dựa trên yêu cầu thực tế. Mở rộng AI blog/chatbot sau khi dữ liệu, phân quyền, giới hạn sử dụng và quy trình duyệt nội dung đã ổn định. Các tính năng này chưa nằm trong ước lượng đợt đầu.

**Ba đầu việc bắt đầu khi chuyển sang thực thi:** SEC-01 bảo vệ chat history; SEC-02 giới hạn dữ liệu hồ sơ công khai; ENV-01 xác minh môi trường để kiểm thử và triển khai đúng dự án.
