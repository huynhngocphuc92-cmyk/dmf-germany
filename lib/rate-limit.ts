import { createIntakeClient, getIntakeKey } from "@/lib/supabase/intake";
import { createHmac } from "node:crypto";
import "server-only";
import { z } from "zod";

export interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}
const resultSchema = z.object({
  success: z.boolean(),
  remaining: z.number().int().nonnegative(),
  resetIn: z.number().int().positive(),
});
const memory = new Map<string, { count: number; expires: number }>();

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Production/serverless counters live in PostgreSQL, shared across all function instances.
  if (
    process.env.VERCEL_ENV ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    const db = createIntakeClient();
    const key = createHmac("sha256", getIntakeKey()).update(identifier).digest("hex");
    const { data, error } = await db.rpc("dmf_check_rate_limit", {
      p_key: key,
      p_limit: config.limit,
      p_window_seconds: config.windowSeconds,
    });
    if (error) throw new Error("Rate limit backend unavailable");
    return resultSchema.parse(data);
  }
  // Local development without a backend only. Never a production fail-open fallback.
  const now = Date.now();
  for (const [key, value] of memory) if (value.expires <= now) memory.delete(key);
  if (memory.size > 10000) throw new Error("Local rate limit capacity reached");
  const entry = memory.get(identifier) ?? { count: 0, expires: now + config.windowSeconds * 1000 };
  entry.count = Math.min(entry.count + 1, config.limit + 1);
  memory.set(identifier, entry);
  return {
    success: entry.count <= config.limit,
    remaining: Math.max(0, config.limit - entry.count),
    resetIn: Math.max(1, Math.ceil((entry.expires - now) / 1000)),
  };
}

export function getClientIp(request: Request): string {
  const value = process.env.VERCEL_ENV
    ? request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")
    : request.headers.get("x-forwarded-for");
  return value?.split(",")[0]?.trim() || "unknown";
}
export const RATE_LIMITS = {
  CONTACT: { limit: 5, windowSeconds: 60 },
  CHAT: { limit: 20, windowSeconds: 60 },
  API: { limit: 30, windowSeconds: 60 },
  BLOG_GENERATION: { limit: 10, windowSeconds: 3600 },
} as const;
