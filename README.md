# DMF Germany - Modern Website Platform

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Framework](https://img.shields.io/badge/Next.js-16-black)
![Language](https://img.shields.io/badge/TypeScript-Strict-blue)

A high-performance B2B platform connecting Vietnamese talent with German enterprises. Refactored and optimized for speed, security, and scalability.

## 🚀 Key Features

- **Performance First:** 
  - 100% Lazy Loading for heavy components.
  - Optimized Images (`next/image`) with Priority LCP.
  - Perfect Lighthouse Scores (>90).
- **Type-Safe Architecture:**
  - **Zod & React Hook Form:** Industrial-grade validation for all forms.
  - **TypeScript:** Strict mode enabled, zero `any` types.
- **Security:**
  - HTTP Security Headers (HSTS, X-Frame-Options).
  - CSRF Protection & Input Sanitization.
- **Component Library:**
  - Modular `components/services` architecture.
  - Reusable UI patterns tailored for German B2B market.

## 🛠️ Tech Stack

| Category | Technology | Usage |
|----------|-----------|-------|
| **Core** | Next.js 16 (App Router) | Server Components & Routing |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **Forms** | React Hook Form + Zod | State management & Validation |
| **Backend** | Supabase + Nodemailer | Data & Email Services |
| **Deploy** | Vercel | Edge Network Hosting |

## 📂 Project Structure

```bash
├── .f5/                  # Project Brain (Management Layers)
│   ├── 00-audit/         # Performance & Code Audits
│   ├── 01-strategy/      # Master Plans & Roadmaps
│   ├── 02-standards/     # Coding Guidelines & Tech Stack
│   └── 03-plan/          # Active Sprint Plans
├── app/                  # Next.js App Router
├── components/
│   ├── services/         # Shared Service Page Components
│   └── sections/         # Landing Page Sections
├── lib/
│   ├── validations/      # Zod Schemas (Single Source of Truth)
│   └── translations.ts   # i18n Content
└── public/               # Static Assets
```
