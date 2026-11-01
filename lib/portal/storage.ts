import { createClient as createServiceClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StudentDocument, StudentProfile } from "./types";

export const STUDENT_DOCS_BUCKET = "student-documents";
export const STORAGE_URI_PREFIX = `storage://${STUDENT_DOCS_BUCKET}/`;
export const SIGNED_READ_TTL_SECONDS = 60 * 60; // 1 hour

let bucketChecked = false;

/**
 * Construct a service-role Storage client ONLY AFTER the caller has verified
 * an authenticated, non-anonymous user or administrator.
 */
export function getOptionalServiceStorageClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createServiceClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function ensurePrivateStudentBucket(serviceClient: SupabaseClient | null) {
  if (!serviceClient?.storage || bucketChecked) return;
  try {
    const { data: existing } = await serviceClient.storage.getBucket(STUDENT_DOCS_BUCKET);
    if (!existing) {
      await serviceClient.storage.createBucket(STUDENT_DOCS_BUCKET, {
        public: false,
        fileSizeLimit: 50 * 1024 * 1024,
        allowedMimeTypes: [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/webp",
          "video/webm",
          "video/mp4",
        ],
      });
    } else if (existing.public) {
      await serviceClient.storage.updateBucket(STUDENT_DOCS_BUCKET, {
        public: false,
        fileSizeLimit: 50 * 1024 * 1024,
      });
    }
    bucketChecked = true;
  } catch {
    // Non-fatal: bucket may already be managed by SQL migration
  }
}

export function sanitizeStorageFileName(fileName: string, fallbackExt: string): string {
  const base = fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  if (!base) return `file.${fallbackExt}`;
  return base.includes(".") ? base : `${base}.${fallbackExt}`;
}

/**
 * Convert an expiring Supabase signed URL for `student-documents/portal/<uid>/...`
 * back into a canonical `storage://student-documents/portal/<uid>/...` reference
 * before persisting to Postgres, while keeping external links (e.g. YouTube) intact.
 */
export function normalizeStoredVideoReference(
  rawUrl: string | null | undefined,
  allowedUserId?: string
): string | null {
  const trimmed = (rawUrl || "").trim();
  if (!trimmed) return null;

  if (trimmed.startsWith(STORAGE_URI_PREFIX)) {
    const storagePath = trimmed.slice(STORAGE_URI_PREFIX.length);
    if (allowedUserId && !storagePath.startsWith(`portal/${allowedUserId}/`)) {
      return null;
    }
    return trimmed;
  }

  const marker = `/storage/v1/object/sign/${STUDENT_DOCS_BUCKET}/`;
  const idx = trimmed.indexOf(marker);
  if (idx !== -1) {
    const after = trimmed.slice(idx + marker.length);
    const cleanPath = decodeURIComponent(after.split("?")[0] || "");
    if (!cleanPath) return null;
    if (allowedUserId && !cleanPath.startsWith(`portal/${allowedUserId}/`)) {
      return null;
    }
    return `${STORAGE_URI_PREFIX}${cleanPath}`;
  }

  return trimmed;
}

export async function createSignedReadUrl(
  storageClient: SupabaseClient,
  storagePath: string
): Promise<string | null> {
  if (!storagePath || !storageClient?.storage) return null;
  try {
    const { data, error } = await storageClient.storage
      .from(STUDENT_DOCS_BUCKET)
      .createSignedUrl(storagePath, SIGNED_READ_TTL_SECONDS);
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}

export async function hydrateDocumentsWithSignedUrls(
  storageClient: SupabaseClient,
  docs: StudentDocument[]
): Promise<StudentDocument[]> {
  if (!docs.length || !storageClient?.storage) return docs;
  return Promise.all(
    docs.map(async (doc) => {
      if (!doc.file_path) return doc;
      const signedUrl = await createSignedReadUrl(storageClient, doc.file_path);
      return {
        ...doc,
        file_url: signedUrl,
      };
    })
  );
}

export async function hydrateProfileVideoSignedUrl(
  storageClient: SupabaseClient,
  profile: StudentProfile
): Promise<StudentProfile> {
  if (!profile.video_url || !profile.video_url.startsWith(STORAGE_URI_PREFIX)) {
    return profile;
  }
  const storagePath = profile.video_url.slice(STORAGE_URI_PREFIX.length);
  const signedUrl = await createSignedReadUrl(storageClient, storagePath);
  return {
    ...profile,
    video_url: signedUrl || profile.video_url,
  };
}
