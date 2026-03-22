/**
 * Shared rate limiter for API routes.
 *
 * Behavior:
 * - Uses Upstash Redis REST when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` exist.
 * - Falls back to in-memory limiting for local/dev or when Redis is unavailable.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitEntry>();
let lastCleanupAt = 0;
let hasLoggedRedisFallback = false;

function cleanupExpiredMemoryEntries(now: number) {
  if (now - lastCleanupAt < 60_000) {
    return;
  }

  lastCleanupAt = now;

  for (const [key, entry] of memoryStore.entries()) {
    if (now > entry.resetTime) {
      memoryStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum requests allowed in the time window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

function getUpstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

async function runUpstashPipeline(commands: Array<Array<string | number>>) {
  const config = getUpstashConfig();
  if (!config) {
    throw new Error("Upstash Redis is not configured.");
  }

  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash pipeline request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as Array<{ result?: unknown; error?: string }>;

  for (const item of data) {
    if (item.error) {
      throw new Error(item.error);
    }
  }

  return data;
}

async function checkUpstashRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `rate-limit:${identifier}`;

  const [incrementResult, ttlResult] = await runUpstashPipeline([
    ["INCR", key],
    ["TTL", key],
  ]);

  const count = Number(incrementResult.result ?? 0);
  let ttlSeconds = Number(ttlResult.result ?? -1);

  if (count === 1 || ttlSeconds < 0) {
    await runUpstashPipeline([["EXPIRE", key, config.windowSeconds]]);
    ttlSeconds = config.windowSeconds;
  }

  if (count > config.limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: ttlSeconds > 0 ? ttlSeconds : config.windowSeconds,
    };
  }

  return {
    success: true,
    remaining: Math.max(config.limit - count, 0),
    resetIn: ttlSeconds > 0 ? ttlSeconds : config.windowSeconds,
  };
}

function checkMemoryRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  cleanupExpiredMemoryEntries(now);

  const entry = memoryStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    memoryStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      remaining: config.limit - 1,
      resetIn: config.windowSeconds,
    };
  }

  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count += 1;
  memoryStore.set(identifier, entry);

  return {
    success: true,
    remaining: Math.max(config.limit - entry.count, 0),
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Check rate limit for an identifier (usually IP address or authenticated user id).
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (!getUpstashConfig()) {
    return checkMemoryRateLimit(identifier, config);
  }

  try {
    return await checkUpstashRateLimit(identifier, config);
  } catch (error) {
    if (!hasLoggedRedisFallback) {
      hasLoggedRedisFallback = true;
      console.warn("[RateLimit] Falling back to in-memory store:", error);
    }

    return checkMemoryRateLimit(identifier, config);
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "127.0.0.1";
}

// Preset configurations
export const RATE_LIMITS = {
  /** Contact and profile requests: 5 requests per minute */
  CONTACT: { limit: 5, windowSeconds: 60 },
  /** Telegram notifications: 10 per minute */
  TELEGRAM: { limit: 10, windowSeconds: 60 },
  /** Chat assistant: 20 requests per minute */
  CHAT: { limit: 20, windowSeconds: 60 },
  /** General API: 30 per minute */
  API: { limit: 30, windowSeconds: 60 },
  /** Blog generation: 10 requests per hour per authenticated user */
  BLOG_GENERATION: { limit: 10, windowSeconds: 60 * 60 },
} as const;
