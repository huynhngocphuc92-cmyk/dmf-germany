import { createClient } from "@supabase/supabase-js";
import "server-only";

export function getIntakeKey() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Intake backend is not configured");
  return key;
}

export function assertIntakeEnvironment() {
  if (process.env.VERCEL_ENV === "preview" && process.env.INTAKE_TEST_BACKEND !== "true") {
    throw new Error("Preview intake is disabled");
  }
  if (
    process.env.VERCEL_ENV === "preview" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("iihprcuhmilmymlbktpy")
  ) {
    throw new Error("Preview cannot write to the production database");
  }
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
