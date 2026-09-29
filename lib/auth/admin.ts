import "server-only";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "./admin-policy";

export class AdminAuthorizationError extends Error {
  constructor(public readonly status: 401 | 403) {
    super(status === 401 ? "Authentication required" : "Administrator access required");
    this.name = "AdminAuthorizationError";
  }
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new AdminAuthorizationError(401);
  if (!isAdminUser(user)) throw new AdminAuthorizationError(403);
  return { supabase, user };
}

/** Cookie client for operations that continue to enforce database RLS. */
export async function createAdminClient() {
  return (await requireAdmin()).supabase;
}

/** A service key must never be constructed before the caller passes authorization. */
export async function createPrivilegedAdminClient() {
  const { supabase } = await requireAdmin();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return supabase;
  return createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
