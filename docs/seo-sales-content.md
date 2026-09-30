# SEO và nội dung hỗ trợ sale — đợt 1

Ngày: 30/09/2026. Nền tảng: giao diện đã phục hồi tại `25f88c5`.

## Phạm vi đã thống nhất

Giữ nguyên bố cục, màu sắc, hình ảnh, điều hướng và các section hiện tại. Phát triển SEO và nội dung phục vụ doanh nghiệp Đức cần tuyển dụng. Bài mới ở dạng nháp, chưa xuất bản lên website.

## Audit → quyết định triển khai

- Canonical dùng domain chính; sitemap chỉ đưa bài đã xuất bản; trang admin/login có giới hạn truy cập hoặc noindex. Giữ nguyên các cơ chế này.
- Trang bài viết thiếu BlogPosting/BreadcrumbList: bổ sung JSON-LD từ dữ liệu bài đã xuất bản, không thêm thành phần hiển thị.
- Ảnh chia sẻ Twitter chưa đồng bộ ảnh bìa: dùng cùng ảnh với Open Graph, có ảnh mặc định khi bài không có bìa.
- Không dùng ngày tạo bản nháp làm ngày xuất bản trong metadata; không suy diễn tác giả từ ID tài khoản.
- Tiêu đề SEO trang blog quá chung: làm rõ chủ đề tuyển dụng từ Việt Nam cho nhà tuyển dụng. H1 và giao diện giữ nguyên.
- Ngày hiển thị được gắn thẻ HTML `time`; đường dẫn bài được encode nhất quán với canonical.
- Prompt viết bài cũ có các cam kết chưa xác minh, gồm thời gian hỗ trợ 3 năm và 12 tháng. Thay bằng bối cảnh đã biết, yêu cầu dẫn chứng và câu hỏi phục vụ quyết định mua; không coi prompt là hệ thống kiểm chứng tự động.

## Nội dung và tiêu chuẩn

Ba bài tiếng Đức trả lời ba nhu cầu: chuẩn bị yêu cầu tuyển dụng, so sánh đề xuất của đơn vị tuyển dụng, chuẩn bị onboarding. Mỗi bài có tiêu đề, slug, mô tả SEO, liên kết đến dịch vụ hoặc form hiện có, CTA cụ thể và ghi chú sử dụng cho sale. Từ khóa là giả thuyết về ý định tìm kiếm, chưa có số liệu lượng tìm kiếm/Search Console.

Không tạo số liệu thành công, giá dịch vụ, lời hứa về visa/thời gian, chứng nhận hoặc case study không có bằng chứng. Không suy diễn đặc điểm người lao động từ quốc tịch. Các checklist và kế hoạch là gợi ý biên tập, không phải cam kết dịch vụ DMF. Bài nháp nằm trong `content/drafts`, không được website import hoặc đưa vào sitemap.

## Trình tự

1. Hoàn thành SEO trong template hiện có và hướng dẫn viết.
2. Soạn ba bài đầy đủ và bảng chủ đề tiếp theo; kiểm tra link, thuật ngữ, thông tin được trích nguồn.
3. Chạy lint, TypeScript, test và production smoke; kiểm tra trang trên trình duyệt cùng giao diện đã phục hồi.
4. Triển khai phần kỹ thuật theo quy trình PR/CI/Vercel hiện có. Bài giữ ở dạng nháp cho chủ website duyệt nội dung.

## Theo dõi sau phát hành

Khi có quyền Search Console, kiểm tra index của các URL, truy vấn theo trang, lượt hiển thị, lượt nhấp và CTR; lưu mốc ban đầu rồi đối chiếu sau 28 ngày. Đối chiếu yêu cầu tuyển dụng thực tế, không dùng lượt xem làm đại diện cho lead đạt yêu cầu. Hiện chưa xác minh quyền Search Console, chưa có số liệu xếp hạng hoặc chuyển đổi để báo cáo.

Không có lịch đăng hay automation được tạo. Không thay đổi dữ liệu Supabase trong đợt này.

## Nguồn kỹ thuật

- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article): dùng thuộc tính có căn cứ từ bài, không gán tác giả/ảnh không liên quan.
- [Google: Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb): phản ánh đường đi từ website đến blog và bài viết.
- [Google: Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): ưu tiên thông tin hữu ích cho người đọc, không tạo hàng loạt bài chỉ để nhồi từ khóa.

Các thay đổi hỗ trợ công cụ tìm kiếm hiểu nội dung; không cam kết thứ hạng hoặc rich results.
