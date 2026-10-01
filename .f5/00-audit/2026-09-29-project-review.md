**Đánh giá DMF Talents — 29/09/2026**

Phạm vi: mã nguồn tại commit `4443279`, website công khai https://www.dmf-talents.de/, kiểm tra giao diện desktop và menu ở chiều rộng 390px, HTTP/metadata, TypeScript, lint, production build và dependency audit. Chưa xác minh commit đang được triển khai có trùng hoàn toàn với checkout.

**Nhận định:** nền tảng phù hợp để phát triển tiếp và đã có nhiều chức năng phục vụ tuyển dụng B2B. Tuy nhiên, cần xử lý quyền truy cập dữ liệu và cấu hình SEO trước khi mở rộng hoạt động thu hút khách hàng. Nội dung mẫu còn xuất hiện trên production làm giảm độ tin cậy.

**Điểm tốt đang có**

- Next.js App Router, TypeScript, React và Tailwind; các nhóm trang marketing, quản trị, blog, hồ sơ và công cụ đã được tổ chức riêng.
- Ba nhóm dịch vụ có trang riêng: Ausbildung, Fachkräfte và Saisonkräfte. Website có thông tin quy trình, form liên hệ và công cụ hỗ trợ tư vấn.
- Trang chủ và trang ứng viên sử dụng cấu hình revalidate 60 giây; các phản hồi trang marketing được kiểm tra có cache của Vercel.
- Form liên hệ có Zod validation, honeypot, rate limit và escape nội dung HTML gửi email. GA được viết để chỉ tải sau khi chấp nhận cookie.
- Có HTTPS và các security header. Đây là nền tảng bảo vệ hữu ích, nhưng không thay thế việc kiểm tra quyền trong từng API.
- TypeScript và quá trình build đều hoàn tất trên checkout hiện tại.

**Các phát hiện theo thứ tự ưu tiên**

1. **P0 — API lịch sử chat trả dữ liệu khi chưa đăng nhập. Đã xác nhận trên production.**

   Một GET không mang cookie hay Authorization đến `/api/chat/history?limit=1` nhận HTTP 200 và một bản ghi. Bản ghi có các trường `messages`, `lead_email`, `lead_company`, `lead_phone`, `lead_interest` và các trường định danh/thời gian. Chỉ ghi lại trạng thái, số lượng và tên trường; không lưu nội dung chat hoặc giá trị thông tin liên hệ trong báo cáo.

   Handler GET trong [route.ts](/Users/chong/dmf-talents.de/app/api/chat/history/route.ts:96) không kiểm tra người gọi. Client ở dòng 30 ưu tiên service-role key; [middleware](/Users/chong/dmf-talents.de/utils/supabase/middleware.ts:40) chỉ redirect người chưa đăng nhập với đường dẫn bắt đầu bằng `/admin`, không bảo vệ API này.

   Cần yêu cầu quyền quản trị trước truy vấn, trả 401/403 với người không được phép, giới hạn phân trang, tách luồng lưu hội thoại công khai khỏi luồng đọc quản trị và xem lại access log để xác định phạm vi truy cập trước đây. Báo cáo này không xác nhận đã có người ngoài khai thác.

2. **P1 — Quyền quản trị và dữ liệu công khai chưa được giới hạn nhất quán. Xác nhận qua mã nguồn; một phần có dấu hiệu trong HTML production.**

   [Lead actions](/Users/chong/dmf-talents.de/app/admin/leads/actions.ts:39) và [chat actions](/Users/chong/dmf-talents.de/app/admin/chats/actions.ts:42) dùng client ưu tiên service-role nhưng không có kiểm tra user/role trong các hàm đọc, cập nhật, xóa. Chưa gọi các thao tác ghi/xóa để thử trên production. Theo [hướng dẫn Next.js](https://nextjs.org/docs/app/guides/data-security), kiểm tra quyền ở page/layout không thay thế kiểm tra trong Server Action.

   [Truy vấn ứng viên trang chủ](/Users/chong/dmf-talents.de/lib/supabase/candidates.ts:57) dùng `select("*")`, chuyển toàn bộ đối tượng sang Client Component; khi không tìm thấy dữ liệu phù hợp còn fallback sang các hồ sơ mới nhất. HTML production có các key được serialize như `email`, `phone`, `date_of_birth`, `notes`. Chưa kết luận mọi trường đều có giá trị hoặc là hồ sơ người thật. Cần DTO công khai với danh sách trường rõ ràng và điều kiện xuất bản riêng.

   Migration chat/leads trong repository có policy UPDATE của anon với `USING (true)` và `WITH CHECK (true)`, không thể hiện điều kiện sở hữu. Chưa truy cập cấu hình database live để xác nhận migration nào đang áp dụng. Cần rà soát grants/RLS thực tế; [Supabase giải thích service-role có thể bypass RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

3. **P1 — SEO gửi tín hiệu sang nhiều domain khác nhau. Đã xác nhận trên production.**

   | Vị trí                          | Giá trị quan sát                                  |
   | ------------------------------- | ------------------------------------------------- |
   | Redirect domain gốc             | `dmf-talents.de` → `www.dmf-talents.de`, HTTP 307 |
   | robots.txt                      | Sitemap trỏ tới `https://dmf.edu.vn/sitemap.xml`  |
   | sitemap.xml                     | URL dùng `https://dmf-vietnam.de`                 |
   | Canonical trang chủ             | `https://dmf-vietnam.de`                          |
   | Canonical ba trang dịch vụ      | Cùng trỏ về trang chủ `https://dmf-vietnam.de`    |
   | Canonical trang blog            | Cùng trỏ về trang chủ `https://dmf-vietnam.de`    |
   | Canonical Impressum/Datenschutz | Dùng `https://dmf-germany.de/...`                 |

   Nguồn trực tiếp: [robots.txt](https://www.dmf-talents.de/robots.txt), [sitemap.xml](https://www.dmf-talents.de/sitemap.xml), HTML các trang. Nguyên nhân trong [layout.tsx](/Users/chong/dmf-talents.de/app/layout.tsx:14), [robots.ts](/Users/chong/dmf-talents.de/app/robots.ts:4), [sitemap.ts](/Users/chong/dmf-talents.de/app/sitemap.ts:5) và metadata riêng của trang. Title các trang dịch vụ còn lặp `DMF Talents` hai lần.

   Cần chọn một host chuẩn, thống nhất site URL, canonical theo từng đường dẫn, Open Graph, sitemap, robots và structured data; dùng redirect vĩnh viễn khi host chuẩn đã được chốt. Sitemap hiện chưa có trang `/fuer-arbeitgeber/kandidaten`. Việc sửa không bảo đảm tăng thứ hạng ngay; chưa có dữ liệu Search Console để đánh giá tác động thực tế. [Google hướng dẫn canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

4. **P1 — Nội dung mẫu và dữ liệu hiển thị làm giảm niềm tin. Đã xác nhận trên giao diện và trong source.**

   Trang chủ hiển thị hồ sơ “Test”; một số thẻ xoay vòng có tiền tố `null - ...`. Khu Talent Pool hiển thị thời điểm sẵn sàng từ năm 2024. [TalentShowcase.tsx](/Users/chong/dmf-talents.de/components/b2b/TalentShowcase.tsx:112) chứa `mockCandidates` và URL video mẫu.

   Cần chỉ xuất bản hồ sơ đã duyệt, có trạng thái sẵn sàng cập nhật; dùng trạng thái trống có chủ đích nếu chưa có dữ liệu. Các con số thành công/chứng nhận nên có nguồn nội bộ, thời điểm cập nhật và người chịu trách nhiệm phê duyệt; báo cáo này không kết luận các tuyên bố đó sai.

   Về nội dung bán hàng, trang chủ đang phục vụ đồng thời nhà tuyển dụng Đức và người tìm cơ hội học/làm việc. Công cụ tính lương cùng CTA hướng ứng viên xuất hiện trong luồng B2B. Đề xuất lấy nhu cầu doanh nghiệp làm luồng chính: ngành tuyển dụng → điều kiện ứng viên → quy trình/thời gian → bằng chứng thực tế → yêu cầu tư vấn. Nội dung dành cho ứng viên có thể chuyển sang khu riêng.

5. **P1 — Dependency có cảnh báo cần nâng cấp có kiểm soát. Xác nhận bằng npm audit, chưa xác nhận khả năng khai thác từng mục.**

   Lockfile cài Next.js 16.1.6, React 19.2.4, Supabase JS 2.93.3 và Nodemailer 7.0.13. `npm audit --omit=dev` trả 26 mục trong cây dependency: 1 critical, 13 high, 11 moderate, 1 low. Con số này gồm các dependency bắc cầu, không tương đương 26 đường khai thác đã được chứng minh trên website.

   Next.js được xếp critical trong kết quả registry; một advisory liên quan [Image Optimization và AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4). Cần kiểm tra điều kiện ảnh hưởng và bản vá hiện hành, nâng cấp trên nhánh riêng rồi kiểm thử đăng nhập, Server Actions, xử lý ảnh, email và editor. Chưa thay package hoặc chạy audit fix.

6. **P2 — Video và giao diện cookie cần sửa. Đã xác nhận trên website.**

   Khi mở “Video-Vorstellung”, dialog xuất hiện nhưng iframe hiển thị nội dung bị chặn. CSP production có `default-src 'self'` mà không có `frame-src` cho YouTube; [next.config.ts](/Users/chong/dmf-talents.de/next.config.ts:69) phản ánh cấu hình này. Cần xác định host nhúng được phép và áp dụng chính sách chấp thuận phù hợp. Calendly cũng dùng script/style ngoài domain chưa nằm trong CSP; đây là rủi ro từ source, chưa kiểm thử hoàn chỉnh việc đặt lịch.

   Nút “Einstellungen” của cookie banner nhìn như ô trắng trống ở giao diện desktop đã kiểm tra. Trong code, nút outline có `text-white` nhưng nền sáng. Cần sửa độ tương phản, làm lựa chọn từ chối dễ tìm và cung cấp cách mở lại cài đặt. Không đưa ra kết luận pháp lý về tuân thủ GDPR trong lần đánh giá này.

   Label của nhiều input liên hệ chưa nối bằng `htmlFor`/`id`, xem [ContactSection.tsx](/Users/chong/dmf-talents.de/components/sections/ContactSection.tsx:98). Cần kiểm tra thêm bàn phím, tên truy cập của control và lỗi form cho screen reader. Menu mobile ở 390px mở được; chưa đánh giá mọi kích thước màn hình.

7. **P2 — Kết quả công cụ tính lương dễ gây hiểu nhầm. Xác nhận qua công thức và nội dung hiển thị.**

   Trang ghi các mức lương là gross/brutto nhưng [SalarySimulator.tsx](/Users/chong/dmf-talents.de/components/tools/SalarySimulator.tsx:257) tính phần “dư ra” bằng lương trừ chi phí sinh hoạt, chưa trừ thuế/bảo hiểm. Ví dụ giao diện hiển thị 3.200 € − 900 € = 2.300 €. Đây không phải số tiền tiết kiệm thực nhận. Cần đổi nhãn thành chênh lệch trước khấu trừ hoặc xây mô hình netto với giả định và nguồn cập nhật rõ ràng.

8. **P2 — Kiểm soát chất lượng, hiệu năng và tài liệu vận hành cần củng cố.**

   `npm run lint` báo 8 lỗi, 72 cảnh báo. Chưa tìm thấy bộ test hay workflow CI trong checkout. Cần đưa lint/type-check/build vào kiểm tra bắt buộc, bổ sung test có giá trị cho quyền truy cập, dữ liệu công khai, metadata và luồng nhận lead.

   Build thành công nhưng ghi `supabaseUrl is required` khi tạo nội dung vì local chưa có env. Cần validate biến bắt buộc và phân biệt fallback chủ ý với lỗi cấu hình, tránh tạo artifact trông hợp lệ nhưng thiếu dữ liệu. `.env.example` cũng chưa liệt kê đủ các tùy chọn mà code dùng, như Upstash và Calendly.

   Trang chủ trả khoảng 224 KB HTML đã giải nén và tham chiếu 25 script trong lần đo; đây không phải tổng dữ liệu truyền qua mạng. `HomeClient` import trực tiếp nhiều section, trong khi chỉ một số phần tải chậm theo nhu cầu. Có thể giảm JavaScript tương tác và gom các truy vấn asset. PDF công khai trong repository khoảng 17 MB, nên có bản tối ưu dung lượng.

   Chưa có phép đo Lighthouse/Core Web Vitals theo điều kiện chuẩn hoặc dữ liệu người dùng thực. Không dùng tuyên bố “Lighthouse >90” trong README làm bằng chứng hiệu năng. Cần đo mobile trước/sau thay đổi và ưu tiên LCP, INP, CLS cùng dung lượng ảnh/script thực tế.

**Kết quả kiểm tra**

| Kiểm tra                                       | Kết quả                                                      |
| ---------------------------------------------- | ------------------------------------------------------------ |
| Cài đúng lockfile bằng npm ci                  | Hoàn tất                                                     |
| TypeScript                                     | Đạt                                                          |
| Production build                               | Hoàn tất, có lỗi dữ liệu do thiếu cấu hình Supabase local    |
| Lint                                           | Không đạt: 8 lỗi, 72 cảnh báo                                |
| Dependency audit, bỏ dev                       | 26 mục: 1 critical / 13 high / 11 moderate / 1 low           |
| HTTP 10 trang công khai                        | Đều trả 200 trong lần kiểm tra                               |
| Video hồ sơ                                    | Dialog mở; iframe bị chặn                                    |
| GET lịch sử chat không đăng nhập               | Trả 200 và dữ liệu — cần xử lý ngay                          |
| Gửi form, email, Telegram, AI                  | Chưa kiểm thử đầu cuối; không tạo lead hay gửi thông báo thử |
| Database live, quyền admin, Search Console/GA4 | Chưa truy cập dashboard để xác minh                          |

**Thứ tự phát triển đề xuất và điều kiện hoàn thành**

1. Bảo vệ dữ liệu: API quản trị từ chối khách ẩn danh/người không có quyền; mỗi Server Action có kiểm tra quyền; payload công khai chỉ có trường được phép; kiểm tra RLS thực tế.
2. Ổn định production: cập nhật dependency cần thiết, kiểm thử lại; bỏ nội dung mẫu, sửa video và thông báo thành công của các luồng lead. Đặc biệt, inquiry hiện có thể hiểu HTTP 200 từ Telegram là gửi thành công dù endpoint báo chưa được cấu hình.
3. Sửa SEO: thống nhất host, canonical đúng từng trang, title không lặp; kiểm tra sitemap/robots và xác nhận lại bằng Search Console khi có quyền truy cập.
4. Làm rõ luồng B2B: CTA cụ thể, hồ sơ cập nhật, bằng chứng doanh nghiệp, biểu mẫu dễ dùng; sửa công cụ lương và cookie UI.
5. Đo lường và duy trì: kiểm thử lead đầu cuối trong môi trường phù hợp, xác minh GA4 conversion, bổ sung CI và đo hiệu năng mobile.

Lần này chỉ đánh giá, cài dependencies và chạy kiểm tra local. Không sửa mã nguồn ứng dụng, database hoặc cấu hình triển khai; file báo cáo này là nội dung mới được thêm vào repository.
