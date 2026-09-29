import type { User } from "@supabase/supabase-js";

/** Accept only server-controlled membership from a verified Supabase user. */
export function isAdminUser(user: User | null): user is User {
  if (!user || user.is_anonymous) return false;
  return user.app_metadata?.role === "admin";
}
