-- ============================================
-- SEED DATA FOR THEME MANAGER
-- Các key cấu hình quan trọng: Logo, Màu chính, Hotline, Slogan, Facebook, Bản đồ
-- ============================================

-- IMPORTANT: Bảng phải là `site_assets` (không phải `site_config`)
-- Section names có thể dùng tiếng Việt: "Nhận diện", "Trang Chủ", "Header & Footer", "Liên Hệ", "Cài Đặt"
-- Code sẽ tự động map sang: "identity", "home", "header_footer", "contact", "system"

-- ============================================
-- NHẬN DIỆN (Identity)
-- ============================================
INSERT INTO site_assets (key, asset_type, label, description, section, value, image_url) VALUES
  ('logo_url', 'image', 'Logo Chính', 'Logo công ty hiển thị ở Header (khuyến nghị: PNG với nền trong suốt, 200x60px)', 'identity', NULL, NULL),
  ('primary_color', 'color', 'Màu Chính', 'Màu chủ đạo của thương hiệu (Hex format: #1e3a5f)', 'identity', '#1e3a5f', NULL),
  ('secondary_color', 'color', 'Màu Phụ', 'Màu phụ của thương hiệu', 'identity', NULL, NULL),
  ('accent_color', 'color', 'Màu Nhấn', 'Màu nhấn cho buttons và links', 'identity', NULL, NULL),
  ('favicon', 'image', 'Favicon', 'Icon hiển thị trên tab trình duyệt (32x32px hoặc 16x16px)', 'identity', NULL, NULL)
ON CONFLICT (key) DO UPDATE SET
  asset_type = EXCLUDED.asset_type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  section = EXCLUDED.section;

-- ============================================
-- TRANG CHỦ (Home)
-- ============================================
INSERT INTO site_assets (key, asset_type, label, description, section, value, image_url) VALUES
  ('home_hero_banner', 'image', 'Hero Banner', 'Ảnh nền chính trang chủ (khuyến nghị: 1920x1080px)', 'home', NULL, NULL),
  ('home_hero_title', 'text', 'Hero Title', 'Tiêu đề chính Hero section', 'home', NULL, NULL),
  ('home_hero_subtitle', 'text', 'Hero Subtitle', 'Mô tả phụ Hero section', 'home', NULL, NULL),
  ('home_hero_video_url', 'text', 'Hero Video URL', 'URL video YouTube/Vimeo cho Hero (optional)', 'home', NULL, NULL),
  ('home_slogan', 'text', 'Slogan', 'Slogan công ty hiển thị trên trang chủ', 'home', NULL, NULL)
ON CONFLICT (key) DO UPDATE SET
  asset_type = EXCLUDED.asset_type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  section = EXCLUDED.section;

-- ============================================
-- HEADER & FOOTER
-- ============================================
INSERT INTO site_assets (key, asset_type, label, description, section, value, image_url) VALUES
  ('header_logo', 'image', 'Header Logo', 'Logo hiển thị ở Header (có thể khác với logo chính)', 'header_footer', NULL, NULL),
  ('footer_logo', 'image', 'Footer Logo', 'Logo hiển thị ở Footer', 'header_footer', NULL, NULL),
  ('header_hotline', 'text', 'Hotline', 'Số điện thoại hotline hiển thị ở Header', 'header_footer', NULL, NULL),
  ('footer_copyright', 'text', 'Copyright Text', 'Text bản quyền hiển thị ở Footer', 'header_footer', NULL, NULL),
  ('footer_tagline', 'text', 'Footer Tagline', 'Tagline hiển thị ở Footer', 'header_footer', NULL, NULL)
ON CONFLICT (key) DO UPDATE SET
  asset_type = EXCLUDED.asset_type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  section = EXCLUDED.section;

-- ============================================
-- LIÊN HỆ (Contact)
-- ============================================
INSERT INTO site_assets (key, asset_type, label, description, section, value, image_url) VALUES
  ('contact_email', 'text', 'Email Liên Hệ', 'Email nhận tin nhắn từ form liên hệ', 'contact', NULL, NULL),
  ('contact_phone', 'text', 'Số Điện Thoại', 'Số điện thoại liên hệ chính', 'contact', NULL, NULL),
  ('contact_hotline', 'text', 'Hotline', 'Số hotline (có thể khác với số điện thoại chính)', 'contact', NULL, NULL),
  ('contact_facebook_url', 'text', 'Link Facebook', 'URL Facebook page của công ty', 'contact', NULL, NULL),
  ('contact_zalo_url', 'text', 'Link Zalo', 'URL Zalo của công ty', 'contact', NULL, NULL),
  ('contact_map_embed', 'text', 'Google Maps Embed', 'Mã embed Google Maps (iframe code hoặc embed URL)', 'contact', NULL, NULL),
  ('contact_address', 'text', 'Địa Chỉ', 'Địa chỉ văn phòng công ty', 'contact', NULL, NULL)
ON CONFLICT (key) DO UPDATE SET
  asset_type = EXCLUDED.asset_type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  section = EXCLUDED.section;

-- ============================================
-- CÀI ĐẶT HỆ THỐNG (System)
-- ============================================
INSERT INTO site_assets (key, asset_type, label, description, section, value, image_url) VALUES
  ('og_default_image', 'image', 'OG Image Mặc Định', 'Ảnh mặc định khi share trên social media (1200x630px)', 'system', NULL, NULL),
  ('enable_analytics', 'boolean', 'Bật Google Analytics', 'Bật/tắt Google Analytics tracking', 'system', 'true', NULL),
  ('maintenance_mode', 'boolean', 'Chế Độ Bảo Trì', 'Bật chế độ bảo trì website', 'system', 'false', NULL),
  ('enable_contact_form', 'boolean', 'Bật Form Liên Hệ', 'Bật/tắt form liên hệ trên website', 'system', 'true', NULL)
ON CONFLICT (key) DO UPDATE SET
  asset_type = EXCLUDED.asset_type,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  section = EXCLUDED.section;

-- ============================================
-- VERIFY DATA
-- ============================================
-- Kiểm tra dữ liệu đã được insert
SELECT section, COUNT(*) as count, 
       STRING_AGG(key, ', ' ORDER BY key) as keys
FROM site_config
GROUP BY section
ORDER BY section;

