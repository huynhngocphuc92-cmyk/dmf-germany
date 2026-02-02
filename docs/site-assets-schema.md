# Site Assets Table Schema

## Bảng `site_assets` trong Supabase

Bảng này lưu trữ tất cả các assets và cấu hình cho Theme Manager.

### Schema

```sql
CREATE TABLE IF NOT EXISTS site_assets (
  key TEXT PRIMARY KEY,
  asset_type TEXT NOT NULL DEFAULT 'image', -- 'image', 'color', 'text', 'boolean'
  value TEXT, -- Generic value field
  image_url TEXT, -- Legacy field for backward compatibility
  label TEXT NOT NULL,
  description TEXT,
  section TEXT NOT NULL DEFAULT 'system', -- 'Nhận diện', 'Trang Chủ', 'Header & Footer', 'Liên Hệ', 'Cài Đặt'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_site_assets_section ON site_assets(section);
CREATE INDEX IF NOT EXISTS idx_site_assets_asset_type ON site_assets(asset_type);

-- Enable RLS
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (for public website)
CREATE POLICY "Public can read site_assets"
  ON site_assets
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only authenticated users can update (for admin)
CREATE POLICY "Authenticated users can update site_assets"
  ON site_assets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert site_assets"
  ON site_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### Section Names

Code sẽ tự động map các section names sau:

- `"Nhận diện"` → `"identity"`
- `"Trang Chủ"` → `"home"`
- `"Header & Footer"` → `"header_footer"`
- `"Liên Hệ"` → `"contact"`
- `"Cài Đặt"` → `"system"`

Bạn có thể sử dụng cả tên tiếng Việt hoặc tiếng Anh trong database, code sẽ tự động convert.

### Asset Types

- `image`: Upload ảnh (lưu URL vào `image_url` và `value`)
- `color`: Màu sắc (lưu hex code vào `value`)
- `text`: Văn bản (lưu vào `value`)
- `boolean`: Bật/Tắt (lưu "true" hoặc "false" vào `value`)

### Seed Data

Xem file `docs/theme-seed-data.sql` để có seed data mẫu.
