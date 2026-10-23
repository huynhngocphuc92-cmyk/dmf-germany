# 🚀 MASTER PLAN: NÂNG CẤP DMF-TALENTS.DE

> Trạng thái: ✅ HOÀN THÀNH
> Leader: Baso
> AI Engine: Claude Opus 4.5

## 🔴 PHASE 1: SECURITY HARDENING (Ưu tiên TỐI THƯỢNG) ✅ HOÀN THÀNH

- [x] **1.1. Audit Git & Env** ✅ HOÀN THÀNH
  - [x] Kiểm tra `git ls-files` với .env.local → Không bị track
  - [x] .gitignore đã đúng (line 34: `.env*`)
  - [x] Git history sạch - không có .env.local
- [ ] **1.2. Credential Rotation** ⏳ CHỜ USER
  - [ ] (Manual) User tự đổi API Key Supabase, Google, Telegram
  - [ ] (Manual) Cập nhật lại vào .env.local mới
- [x] **1.3. API Protection** ✅ HOÀN THÀNH
  - [x] Tạo `lib/rate-limit.ts` - In-memory rate limiter
  - [x] Áp dụng Rate Limit cho `/api/contact` (5 req/min) và `/api/telegram` (10 req/min)
  - [x] Thêm `Content-Security-Policy` header vào `next.config.ts`
- [x] **1.4. Code Sanitization** ✅ HOÀN THÀNH
  - [x] Tạo `lib/sanitize.ts` - HTML escape utility
  - [x] Fix XSS trong Email Templates (`lib/actions.ts`, `api/contact/route.ts`)
  - [x] Thêm Auth Check cho Server Actions:
    - `actions/theme-actions.ts` (4 functions)
    - `app/admin/candidates/actions.ts` (5 functions)
    - `app/admin/requests/actions.ts` (2 functions)

---

## 🟡 PHASE 2: TOOLING & DEPENDENCIES (Nền móng) ✅ HOÀN THÀNH

- [x] **2.1. Update Core** ✅ HOÀN THÀNH
  - [x] Update `npm` packages (23 gói cũ → tất cả đã cập nhật)
  - [x] Fix 1 high severity vulnerability (Next.js 16.1.1 → 16.1.6)
  - [x] React 19.2.3 → 19.2.4
  - [x] 0 vulnerabilities còn lại
- [x] **2.2. Code Quality Setup** ✅ HOÀN THÀNH
  - [x] Cài đặt Prettier & tạo `.prettierrc`, `.prettierignore`
  - [x] Cài đặt Husky & lint-staged (Pre-commit hook)
  - [x] Thêm scripts: `format`, `format:check`, `lint`, `lint:fix`, `type-check`
  - [x] Cập nhật `eslint.config.mjs` với Prettier + custom rules
  - [x] Format 168 files với Prettier
- [x] **2.3. CI/CD Prep** ✅ HOÀN THÀNH
  - [x] `npm run build` thành công
  - [x] `npm run type-check` thành công

### Files đã tạo/sửa trong Phase 2:

```
✅ Created: .prettierrc
✅ Created: .prettierignore
✅ Created: .lintstagedrc
✅ Created: .husky/pre-commit
✅ Modified: package.json (scripts + dependencies)
✅ Modified: eslint.config.mjs (Prettier + custom rules)
✅ Formatted: 168 files
```

### New Scripts Available:

```bash
npm run format        # Format all files with Prettier
npm run format:check  # Check formatting without writing
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run type-check    # Run TypeScript compiler check
```

---

## 🔵 PHASE 3: PERFORMANCE (Tăng tốc) ✅ HOÀN THÀNH

- [x] **3.1. Bundle Optimization** ✅ HOÀN THÀNH
  - [x] Cài `@next/bundle-analyzer` để soi file nặng
  - [x] Lazy load `RoiCalculator` (2 pages) và `TiptapEditor`
  - [x] Thêm script `npm run analyze`
- [x] **3.2. Component Architecture** ✅ HOÀN THÀNH
  - [x] Refactor `Header.tsx`: 547 → 275 lines
    - Tách `LanguageSwitcher`, `NavDropdown`, `MobileMenu`
    - Extract navigation data to `nav-data.ts`
    - Apply `React.memo` to all sub-components
  - [x] Refactor `RoiCalculator`: 884 → 448 lines
    - Tách `SliderWithMarker`, `ProductTypeTabs`, `SavingsCard`, `CostComparisonChart`
    - Apply `React.memo` to all extracted components
- [x] **3.3. Asset Optimization** ✅ HOÀN THÀNH
  - [x] Tạo `lib/image-placeholder.ts` - Blur placeholder utilities
  - [x] Thêm blur placeholder cho blog images
  - [x] Thêm blur placeholder cho candidate avatars

### Files đã tạo/sửa trong Phase 3:

```
✅ Modified: next.config.ts (bundle analyzer)
✅ Modified: package.json (analyze script)
✅ Modified: app/roi-rechner/page.tsx (lazy load)
✅ Modified: app/fuer-arbeitgeber/roi-rechner/page.tsx (lazy load)
✅ Modified: app/admin/posts/post-form-client.tsx (lazy load TiptapEditor)
✅ Refactored: components/Header.tsx (547 → 275 lines)
✅ Created: components/header/nav-data.ts
✅ Created: components/header/LanguageSwitcher.tsx
✅ Created: components/header/NavDropdown.tsx
✅ Created: components/header/MobileMenu.tsx
✅ Created: components/header/index.ts
✅ Refactored: components/tools/RoiCalculator.tsx (884 → 448 lines)
✅ Created: components/tools/roi/SliderWithMarker.tsx
✅ Created: components/tools/roi/ProductTypeTabs.tsx
✅ Created: components/tools/roi/SavingsCard.tsx
✅ Created: components/tools/roi/CostComparisonChart.tsx
✅ Created: components/tools/roi/index.ts
✅ Created: lib/image-placeholder.ts
✅ Modified: app/blog/blog-list-client.tsx (blur placeholder)
✅ Modified: app/blog/[slug]/blog-detail-client.tsx (blur placeholder)
✅ Modified: components/candidates/CandidateCard.tsx (blur placeholder)
```

---

## 🟢 PHASE 4: ARCHITECTURE & CLEAN CODE ✅ HOÀN THÀNH

- [x] **4.1. Refactor** ✅ HOÀN THÀNH
  - [x] Xóa duplicate `FAQSection` (components/sections/FAQSection.tsx - không được sử dụng)
  - [x] Xóa code chết/không dùng tới:
    - `components/admin/ThemeInjector.tsx`
    - `components/header/MegaMenu.tsx`
    - `components/sections/HeroBanner.tsx`
    - `components/sections/ProcessSection.tsx`
    - `components/skilled-workers/SkilledHero.tsx`
    - `components/ui/DynamicAsset.tsx`
    - `components/ui/accordion.tsx`
    - `components/candidates/ApplicationForm.tsx`
    - Toàn bộ thư mục `components/services/` (11 files không được sử dụng)
- [x] **4.2. TypeScript** ✅ HOÀN THÀNH
  - [x] Tạo `lib/database.types.ts` - Centralized type definitions
  - [x] Thêm script `npm run db:types` cho future type generation
  - [x] Thêm rule `@typescript-eslint/no-explicit-any: warn` vào ESLint
  - [x] Fix `any` types trong:
    - `components/sections/ValuesSection.tsx` (Framer Motion Variants)
    - `actions/theme-actions.ts` (Record<string, unknown>)

### Files đã tạo/sửa trong Phase 4:

```
✅ Deleted: components/sections/FAQSection.tsx (duplicate)
✅ Deleted: components/admin/ThemeInjector.tsx
✅ Deleted: components/header/MegaMenu.tsx
✅ Deleted: components/sections/HeroBanner.tsx
✅ Deleted: components/sections/ProcessSection.tsx
✅ Deleted: components/skilled-workers/SkilledHero.tsx
✅ Deleted: components/ui/DynamicAsset.tsx
✅ Deleted: components/ui/accordion.tsx
✅ Deleted: components/candidates/ApplicationForm.tsx
✅ Deleted: components/services/ (entire directory - 11 files)
✅ Created: lib/database.types.ts
✅ Modified: package.json (db:types script)
✅ Modified: eslint.config.mjs (no-explicit-any rule)
✅ Modified: components/sections/ValuesSection.tsx (proper Variants type)
✅ Modified: actions/theme-actions.ts (Record<string, unknown>)
```

---

## 📊 TỔNG KẾT

### Đã hoàn thành:

- ✅ Phase 1: Security Hardening
- ✅ Phase 2: Tooling & Dependencies
- ✅ Phase 3: Performance Optimization
- ✅ Phase 4: Architecture & Clean Code

### Kết quả:

- **Security**: Rate limiting, XSS protection, Auth checks, CSP headers
- **Performance**: Lazy loading, React.memo, blur placeholders
- **Code Quality**: Prettier, Husky, ESLint strict rules
- **Architecture**: Refactored Header (547→275 lines), RoiCalculator (884→448 lines)
- **Dead Code Removed**: ~20 unused files, ~2000 lines of dead code

### Chờ xử lý (Manual):

- [ ] 1.2. Credential Rotation (User tự đổi API keys)
