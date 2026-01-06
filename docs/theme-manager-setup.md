# Dynamic Theme Manager - Setup Guide

## 1. Database Schema

Run this SQL in your Supabase SQL Editor to create the `site_config` table:

```sql
-- ============================================
-- SITE CONFIG TABLE FOR DYNAMIC THEME MANAGER
-- ============================================

CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  asset_type TEXT NOT NULL DEFAULT 'image', -- 'image', 'color', 'text', 'boolean'
  value TEXT, -- Generic value field (replaces image_url for flexibility)
  image_url TEXT, -- Legacy field for backward compatibility
  label TEXT NOT NULL,
  description TEXT,
  section TEXT NOT NULL DEFAULT 'system', -- 'branding', 'home', 'about', 'contact', 'system'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster section queries
CREATE INDEX IF NOT EXISTS idx_site_config_section ON site_config(section);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (for public website)
CREATE POLICY "Public can read site_config"
  ON site_config
  FOR SELECT
  TO public
  USING (true);

-- Policy: Only authenticated users can update (for admin)
CREATE POLICY "Authenticated users can update site_config"
  ON site_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert site_config"
  ON site_config
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- SEED DATA - Initial Config Items
-- ============================================

INSERT INTO site_config (key, asset_type, label, description, section, value, image_url) VALUES
  -- Branding Section
  ('primary_color', 'color', 'Primary Color', 'Màu chủ đạo của website (Hex format: #1e3a5f)', 'branding', '#1e3a5f', NULL),
  ('secondary_color', 'color', 'Secondary Color', 'Màu phụ của website', 'branding', NULL, NULL),
  ('accent_color', 'color', 'Accent Color', 'Màu nhấn cho buttons và links', 'branding', NULL, NULL),
  ('logo_url', 'image', 'Logo', 'Logo chính của công ty', 'branding', NULL, NULL),
  
  -- Home Section
  ('home_hero_banner', 'image', 'Hero Banner', 'Ảnh nền chính trang chủ (1920x1080 recommended)', 'home', NULL, NULL),
  ('home_hero_title', 'text', 'Hero Title', 'Tiêu đề chính Hero section', 'home', NULL, NULL),
  ('home_hero_subtitle', 'text', 'Hero Subtitle', 'Mô tả phụ Hero section', 'home', NULL, NULL),
  ('home_hero_video_url', 'text', 'Hero Video URL', 'URL video YouTube/Vimeo cho Hero', 'home', NULL, NULL),
  ('home_about_image', 'image', 'About Us Image', 'Ảnh phần giới thiệu công ty', 'home', NULL, NULL),
  
  -- About Section
  ('about_team_photo', 'image', 'Team Photo', 'Ảnh đội ngũ công ty', 'about', NULL, NULL),
  ('about_description', 'text', 'About Description', 'Mô tả về công ty', 'about', NULL, NULL),
  
  -- Contact Section
  ('contact_email', 'text', 'Contact Email', 'Email nhận tin nhắn từ form liên hệ', 'contact', NULL, NULL),
  ('contact_phone', 'text', 'Contact Phone', 'Số điện thoại hotline', 'contact', NULL, NULL),
  ('contact_facebook_url', 'text', 'Facebook URL', 'Link Facebook page', 'contact', NULL, NULL),
  ('contact_zalo_url', 'text', 'Zalo URL', 'Link Zalo', 'contact', NULL, NULL),
  ('contact_map_embed', 'text', 'Google Maps Embed', 'Mã embed Google Maps (iframe code)', 'contact', NULL, NULL),
  
  -- System Settings
  ('og_default_image', 'image', 'Default OG Image', 'Ảnh mặc định khi share trên social media', 'system', NULL, NULL),
  ('favicon', 'image', 'Favicon', 'Icon trang web', 'system', NULL, NULL),
  ('enable_analytics', 'boolean', 'Enable Analytics', 'Bật/tắt Google Analytics', 'system', 'true', NULL),
  ('maintenance_mode', 'boolean', 'Maintenance Mode', 'Chế độ bảo trì website', 'system', 'false', NULL)
ON CONFLICT (key) DO NOTHING;
```

## 2. Storage Bucket

Make sure you have the `images` storage bucket set up:

```sql
-- Create images bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can read images
CREATE POLICY "Public can read images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Policy: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
```

## 3. Usage Examples

### Using DynamicImage (Server Component)

```tsx
// In a Server Component
import { DynamicImage } from "@/components/ui/DynamicImage";

export default async function AboutPage() {
  return (
    <div>
      <DynamicImage
        configKey="about_team_photo"
        fallbackSrc="/images/team-placeholder.jpg"
        alt="Our Team"
        width={800}
        height={600}
        className="rounded-xl"
      />
    </div>
  );
}
```

### Using DynamicBackground (Server Component)

```tsx
import { DynamicBackground } from "@/components/ui/DynamicImage";

export default async function HeroSection() {
  return (
    <DynamicBackground
      configKey="home_hero_banner"
      fallbackSrc="/images/hero-default.jpg"
      overlay
      className="min-h-screen flex items-center"
    >
      <h1>Welcome to DMF</h1>
    </DynamicBackground>
  );
}
```

### In Client Components (via Props)

For Client Components, fetch the image URL in a parent Server Component and pass as prop:

```tsx
// page.tsx (Server Component)
import { getSiteConfigByKey } from "@/actions/theme-actions";
import { ClientHero } from "./client-hero";

export default async function Page() {
  const { data } = await getSiteConfigByKey("home_hero_banner");
  const heroImageUrl = data?.image_url || "/images/default-hero.jpg";
  
  return <ClientHero backgroundImage={heroImageUrl} />;
}

// client-hero.tsx (Client Component)
"use client";

export function ClientHero({ backgroundImage }: { backgroundImage: string }) {
  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Animated content with Framer Motion */}
    </div>
  );
}
```

## 4. Seed Data

Chạy file `docs/theme-seed-data.sql` để tạo sẵn các key cấu hình quan trọng:

- **Nhận diện**: Logo, Màu chính, Favicon
- **Trang Chủ**: Hero Banner, Title, Subtitle, Slogan, Video URL
- **Header & Footer**: Header Logo, Footer Logo, Hotline, Copyright
- **Liên Hệ**: Email, Phone, Hotline, Facebook, Zalo, Google Maps
- **Cài Đặt**: OG Image, Analytics toggle, Maintenance mode

```bash
# Chạy SQL trong Supabase SQL Editor
# Hoặc sử dụng psql nếu có CLI access
```

## 5. Admin Access

1. Log in to Admin at `/login`
2. Navigate to **Giao diện** in sidebar
3. Select section tab:
   - **Nhận diện**: Logo, màu sắc chủ đạo, favicon
   - **Trang Chủ**: Hero banner, title, subtitle, slogan, video URL
   - **Header & Footer**: Logo header/footer, hotline, copyright
   - **Liên Hệ**: Email, phone, social links, Google Maps embed
   - **Cài Đặt**: OG image, toggle settings (Analytics, Maintenance mode)
4. Each asset card automatically renders based on type:
   - **Image**: Drag & drop upload với preview và loading skeleton
   - **Color**: Color picker + Hex input với preview
   - **Text**: Input (ngắn) hoặc Textarea (dài) tự động
   - **Boolean**: Switch toggle (Bật/Tắt) với icon
5. Changes are applied immediately after save
6. Primary color changes are automatically injected into CSS variables
7. Website tự động revalidate sau mỗi update (không cần refresh thủ công)

## 5. File Structure

```
├── types/
│   └── theme.ts              # Type definitions
├── actions/
│   └── theme-actions.ts      # Server actions
├── components/
│   └── ui/
│       └── DynamicImage.tsx  # Reusable components
├── app/
│   └── admin/
│       └── theme/
│           ├── page.tsx      # Server component
│           └── theme-client.tsx # Client component
```

