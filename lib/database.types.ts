/**
 * Supabase Database Types
 *
 * This file centralizes all database-related types.
 * Types are manually maintained since Supabase CLI requires project authentication.
 *
 * To generate types automatically:
 * 1. Install Supabase CLI: npm install supabase --save-dev
 * 2. Login: npx supabase login
 * 3. Generate: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
 *
 * Or add to package.json scripts:
 * "db:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts"
 */

// Re-export types from module files for centralized access
export type {
  Candidate,
  CandidateFormData,
  CandidateCategory,
  CandidateStatus,
  GermanLevel,
} from "@/app/admin/candidates/types";

export type { Post, PostFormData, PostStatus } from "@/app/admin/posts/types";

export type { Inquiry, InquiryStatus, InquiryType } from "@/app/admin/requests/types";

// ============================================
// DATABASE TABLE TYPES (Manual definitions)
// ============================================

/**
 * Site Configuration Table
 * Stores key-value pairs for site settings
 */
export interface SiteConfig {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Site Assets Table
 * Stores uploaded assets (images, files)
 */
export interface SiteAsset {
  id: string;
  key: string;
  value: string; // URL to the asset
  type: "image" | "file";
  created_at: string;
  updated_at: string;
}

// ============================================
// DATABASE SCHEMA (for reference)
// ============================================

/**
 * Database Tables:
 * - candidates: Candidate profiles
 * - posts: Blog posts
 * - inquiries: Contact form submissions
 * - site_config: Site configuration
 * - site_assets: Uploaded assets
 */
export type DatabaseTables =
  | "candidates"
  | "posts"
  | "inquiries"
  | "site_config"
  | "site_assets";

// ============================================
// SUPABASE CLIENT TYPES
// ============================================

/**
 * Generic database response type
 */
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Pagination response
 */
export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
