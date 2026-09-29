import { createClient } from "@supabase/supabase-js";
import "server-only";
import { previewBackendAllowed } from "@/lib/env/backend";

export function getIntakeKey() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Intake backend is not configured");
  return key;
}

export function assertIntakeEnvironment() {
  if (!previewBackendAllowed())
    throw new Error(
      "Preview cannot access the production database; configure an isolated test backend"
    );
}

// Use only after route validation/rate limiting, or requireAdmin for delivery retries.
export function createIntakeClient() {
  assertIntakeEnvironment();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Intake backend is not configured");
  return createClient(url, getIntakeKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
