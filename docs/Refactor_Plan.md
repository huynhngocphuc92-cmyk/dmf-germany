# ADMIN THEME MANAGER - REFACTOR PLAN

## Tổng quan
Refactor trang "Quản lý Giao diện" (Admin Theme Manager) để cải thiện Logic, UX và UI.

## Files sẽ sửa đổi

### 1. Core Components
- `components/admin/AssetCard.tsx` - Component chính để hiển thị và quản lý assets
- `app/admin/theme/theme-client.tsx` - Client component cho theme manager page

### 2. Actions & Types
- `actions/theme-actions.ts` - Server actions cho upload/update/delete
- `types/theme.ts` - TypeScript types và translations

### 3. Display Components (cần cập nhật để support multi-image)
- `components/sections/PartnerSection.tsx` - Hiển thị partner logos (cần support JSON array)
- `app/home-client.tsx` - Load và pass assets xuống components

### 4. Utility Components (mới/cần tạo)
- Component Slider cho opacity input (có thể dùng Shadcn Slider hoặc native range)
- Component MultiImageUpload (mới)

---

## Chi tiết từng task

### ✅ GROUP 1: CRITICAL LOGIC FIXES

#### Task 1.1: Partner Logos - Multi-Image Upload
**Files:**
- `components/admin/AssetCard.tsx` - Thêm logic detect multi-image mode
- `actions/theme-actions.ts` - Cập nhật upload/update để support JSON array
- `components/sections/PartnerSection.tsx` - Cập nhật để render grid từ JSON array
- `app/home-client.tsx` - Parse JSON array khi load

**Changes:**
- Detect key `home_partner_banner` → enable multi-image mode
- Store value as JSON array: `["url1", "url2", ...]`
- UI: Grid layout với add/remove buttons
- Preview: Responsive grid (2-4 columns)

#### Task 1.2: Opacity Slider
**Files:**
- `components/admin/AssetCard.tsx` - Thêm case "number" hoặc detect key có "opacity"
- `types/theme.ts` - Thêm asset_type "number" nếu cần

**Changes:**
- Detect key `home_hero_overlay_opacity` → render Slider
- Range: 0-1, Step: 0.1
- Display current value next to slider
- Use native `<input type="range">` hoặc Shadcn Slider

#### Task 1.3: File Validation
**Files:**
- `components/admin/AssetCard.tsx` - Update `handleFileSelect` function
- `actions/theme-actions.ts` - Update `uploadThemeImage` validation

**Changes:**
- Check file size based on key:
  - Favicon/Icon keys: < 100KB
  - Banner/Background keys: < 1MB
  - Default: < 5MB (current)
- Show toast error với size limit cụ thể

---

### ✅ GROUP 2: UX IMPROVEMENTS

#### Task 2.1: Hide Technical Slugs
**Files:**
- `components/admin/AssetCard.tsx` - Conditional render Badge với key

**Changes:**
- Hide Badge hiển thị technical key
- Hoặc chỉ show khi có env var `NEXT_PUBLIC_DEBUG_MODE=true`
- Hoặc remove Badge hoàn toàn

#### Task 2.2: Aspect Ratio Previews
**Files:**
- `components/admin/AssetCard.tsx` - Update preview container CSS

**Changes:**
- Detect aspect ratio từ key:
  - Icon/Logo keys (favicon, logo): `aspect-square` (1:1)
  - Banner/Intro keys: `aspect-video` (16:9) hoặc `aspect-[4/3]` (4:3)
- Add hint text dưới label: "Recommended: 1920x1080px" hoặc "50x50px"

#### Task 2.3: Input Masks
**Files:**
- `components/admin/AssetCard.tsx` - Update text input rendering

**Changes:**
- Hotline keys: Input mask chỉ cho phép số, `+`, `(`, `)`, space
- Email keys: Regex validation on blur
- Add helper functions cho masking

---

### ✅ GROUP 3: UI POLISH

#### Task 3.1: Better Empty States
**Files:**
- `components/admin/AssetCard.tsx` - Update empty state trong image preview

**Changes:**
- Replace placeholder với Image icon (opacity thấp)
- Text: "Click để tải ảnh lên" / "Click to upload image"
- Better visual hierarchy

#### Task 3.2: Tab Re-organization
**Files:**
- `app/admin/theme/theme-client.tsx` - Check System tab content

**Changes:**
- Check items trong "system" tab
- Nếu chỉ có maintenance settings → move to Dashboard hoặc Header toggle
- Remove empty "system" tab nếu trống

---

## Implementation Order

1. **Phase 1: Critical Fixes** (Ưu tiên cao nhất)
   - File validation (Task 1.3) - Dễ, tác động ngay
   - Opacity Slider (Task 1.2) - Medium
   - Multi-image Upload (Task 1.1) - Complex

2. **Phase 2: UX Improvements**
   - Hide technical slugs (Task 2.1) - Easy
   - Aspect ratio constraints (Task 2.2) - Medium
   - Input masks (Task 2.3) - Medium

3. **Phase 3: UI Polish**
   - Empty states (Task 3.1) - Easy
   - Tab reorganization (Task 3.2) - Easy

---

## Notes

- Backup database trước khi refactor (đặc biệt cho multi-image)
- Test kỹ backward compatibility (existing single image → multi-image)
- Migration script có thể cần để convert single image → JSON array
- Update documentation sau khi hoàn thành
