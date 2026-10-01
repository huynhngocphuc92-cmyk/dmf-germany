# SEO và bài viết hỗ trợ sale — xác minh phát hành

## Yêu cầu và giới hạn

Phát triển từ giao diện đã phục hồi, tuyệt đối không redesign. Đối tượng: doanh nghiệp Đức cần tuyển dụng. Chọn nhóm câu hỏi chung trước tuyển dụng khi chưa có lựa chọn khác từ chủ website. Ba bài mới là bản nháp để đọc/duyệt, không đăng CMS hay website.

## Phiên bản

- Baseline giao diện: `25f88c56e203299cba8702691bc0313ccc510594`.
- PR: https://github.com/huynhngocphuc92-cmyk/dmf-germany/pull/8 — merged, đã gắn vào chat.
- Feature: `00d27ea5a040a02fbfe3adce4d0057d6de0a5120`.
- Main/production: `ef946e8f16d6b309aeb2fecc064b261948e16a84`.
- CI PR `36704062467`: success. CI main `36704314681`: success.
- Preview đúng project: `HFevsd1o5mE2h62Vr8ASZAfpZaMj`, Ready.
- Production đúng project: `4GraYoxzQEhdGeSNTFriVtngL2Ya`, Ready, domain `www.dmf-talents.de`, hoàn tất 17:45:52 GMT+7 ngày 30/09/2026.
- Check của project phụ `dmf-germany-hb75` vẫn failure như các đợt trước. Không phải project phục vụ domain; không sửa cấu hình project đó hoặc bypass bằng admin merge.

## Kết quả

- Lint, TypeScript, Prettier: pass. 99 tests/10 files: pass.
- Production build smoke: pass; schema HTML phía server, canonical/OG/Twitter, ngày, alias, bài chưa xuất bản 404, sitemap, auth và intake với fixture cục bộ.
- Bốn test mới kiểm tra schema/metadata nhất quán, không suy diễn ngày/ảnh/tác giả, không đưa trường riêng vào JSON-LD và escape chuỗi đóng script.
- So sánh mã CSS classes của hai client blog với baseline: giống hệt. Không sửa homepage, header, footer, service pages hoặc CSS.
- CUA kiểm tra cùng bài “Qualitätssicherung durch Sprache…” trên baseline, preview và production: nội dung article và toàn bộ class trong main giống hệt. Quan sát ảnh chụp desktop cho thấy bố cục giữ nguyên. Preview 390px: không tràn ngang. Không có browser errors. Đã reset viewport.
- HTTP production: hai bài hiện có trả 200, mỗi bài có đúng một BlogPosting và BreadcrumbList; canonical khớp, ảnh OG/Twitter/schema đồng nhất và có thẻ time.
- Blog dùng tiêu đề SEO mới, H1 cũ; sitemap vẫn 18 URL. Các section homepage cũ còn đủ. Ba slug bài nháp trả 404 và không xuất hiện trong sitemap/blog.
- Script kiểm chứng: `/tmp/dmf-seo-production-verify.py`; kết quả `/tmp/dmf-seo-production-verification.json` — PASS.

## Bàn giao

- `content/drafts/README.md`: hướng dẫn sale, mapping từ khóa, cách đưa bài vào CMS và ba chủ đề tiếp theo.
- Ba bài tiếng Đức dài khoảng 700–740 từ, đầy đủ metadata/slug/nguồn/link/CTA. Chưa có tác giả hoặc ảnh bìa được gán, chưa có lịch đăng tự động.
- `docs/seo-sales-content.md`: audit, phạm vi, trình tự và cách đo.
- Prompt admin đã bỏ các cam kết dịch vụ thiếu căn cứ/mâu thuẫn; có yêu cầu nguồn và phân biệt gợi ý với cam kết. Đây là hướng dẫn sinh nội dung, không phải hệ thống xác minh độc lập.
- Không gửi email thử, không gọi AI trả phí để sinh bài thử, không sửa DB/env. Fixture đã dừng; tab preview đã đóng; giữ tab production, admin và Vercel cho công việc tiếp theo.
- Chưa kết nối/kiểm tra Search Console, chưa chạy Google Rich Results Test, chưa có dữ liệu volume/thứ hạng/CTR để báo cáo mức tăng trưởng. Các kiểm tra schema hiện là kiểm tra mã/HTTP/browser, không phải xác nhận index của Google.
- Ảnh chụp được quan sát trực tiếp qua CUA; không có file screenshot lưu trên đĩa để đính kèm.
