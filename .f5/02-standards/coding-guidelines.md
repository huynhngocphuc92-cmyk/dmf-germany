# DMF Development Standards

**Version:** 1.0  
**Last Updated:** 2024-12-19  
**Status:** ✅ Active

---

## 1. Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript (Strict mode, no `any`)
- **State Management:** React Hook Form + URL State
- **Validation:** Zod (Server & Client side)

---

## 2. Component Structure

### Service Pages (`app/services/*`)

- MUST use shared components from `@/components/services`.
- DO NOT hardcode content. Use translation keys (`t.service_pages...`).
- Components must be strictly typed (see `@/components/services/types.ts`).

### Admin Forms

- MUST use `react-hook-form` + `zodResolver`.
- Schema definition MUST live in `@/lib/validations/schemas.ts`.
- No manual `useState` for form fields.

---

## 3. Directory Structure Rules

- `app/api/*`: Backend routes (Nodemailer, Database calls).
- `components/shared/*`: Generic UI (Buttons, Modals).
- `components/services/*`: Business logic components for landing pages.
- `lib/validations/*`: Zod schemas only.

---

## 4. Security & Performance

- Always use `next/image` with `width/height`.
- Secrets must go to `.env.local` (never commit).
- API Routes must validate input using Zod before processing.
