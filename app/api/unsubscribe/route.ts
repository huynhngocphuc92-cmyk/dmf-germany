import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/sanitize";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * GET /api/unsubscribe?email=xxx&pid=123
 *
 * Handles email unsubscribe requests from outreach campaigns.
 * - Persists the unsubscribe in Cloudflare KV (UNSUBSCRIBES_KV), with an in-memory fallback in local dev/tests
 * - Shows a German confirmation page
 * - Also forwards to a webhook (if configured) so the Partner-Suchen
 *   local server can update its database
 */

const UNSUB_PREFIX = "unsub:";
const WEBHOOK_URL = process.env.UNSUB_WEBHOOK_URL; // Optional: forward to local server
const memoryUnsubscribes = new Map<string, UnsubEntry>();

interface UnsubEntry {
  email: string;
  partnerId: string | null;
  timestamp: string;
  ip: string | null;
}

interface KvNamespaceBinding {
  get(key: string): Promise<string | null>;
  get<T>(key: string, type: "json"): Promise<T | null>;
  put(key: string, value: string): Promise<void>;
  list(options?: { prefix?: string; cursor?: string }): Promise<{
    keys: Array<{ name: string }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

function getUnsubscribesKv(): KvNamespaceBinding | null {
  try {
    const context = getCloudflareContext();
    const env = context?.env as { UNSUBSCRIBES_KV?: KvNamespaceBinding } | undefined;
    return env?.UNSUBSCRIBES_KV ?? null;
  } catch {
    return null;
  }
}

async function logUnsubscribe(entry: UnsubEntry) {
  try {
    const kv = getUnsubscribesKv();
    if (kv) {
      const key = `${UNSUB_PREFIX}${entry.email}`;
      const existing = await kv.get(key);
      if (!existing) {
        await kv.put(key, JSON.stringify(entry));
      }
      return;
    }

    if (!memoryUnsubscribes.has(entry.email)) {
      memoryUnsubscribes.set(entry.email, entry);
    }
  } catch (err) {
    console.error("Failed to log unsubscribe:", err);
  }
}

async function listUnsubscribes(): Promise<UnsubEntry[]> {
  const kv = getUnsubscribesKv();
  if (!kv) {
    return [...memoryUnsubscribes.values()];
  }

  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix: UNSUB_PREFIX, cursor });
    for (const key of page.keys) {
      keys.push(key.name);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  const values = await Promise.all(keys.map((key) => kv.get<UnsubEntry>(key, "json")));
  return values.filter((item): item is UnsubEntry => item !== null);
}

async function forwardToWebhook(entry: UnsubEntry) {
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // Silently fail — local server might be offline
  }
}

const EMAIL_REGEX = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export async function GET(request: NextRequest) {
  const rate = await checkRateLimit(`unsub:${getClientIp(request)}`, RATE_LIMITS.CONTACT);
  if (!rate.success) {
    return new NextResponse(
      generateHTML("Zu viele Anfragen", "Bitte versuchen Sie es später erneut.", "#ef4444"),
      { status: 429, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawEmail = searchParams.get("email")?.trim() || "";
  const partnerId = (searchParams.get("pid") || searchParams.get("id") || "").slice(0, 100) || null;

  if (!rawEmail || rawEmail.length > 320 || !EMAIL_REGEX.test(rawEmail)) {
    return new NextResponse(
      generateHTML("Fehler", "Keine gültige E-Mail-Adresse angegeben.", "#ef4444"),
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  const email = rawEmail.toLowerCase();
  const safeEmail = escapeHtml(email);

  const entry: UnsubEntry = {
    email,
    partnerId,
    timestamp: new Date().toISOString(),
    ip:
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip"),
  };

  // Log and forward in parallel
  await Promise.all([logUnsubscribe(entry), forwardToWebhook(entry)]);

  return new NextResponse(
    generateHTML(
      "✅ Erfolgreich abgemeldet",
      `Sie erhalten keine weiteren E-Mails von uns an <strong>${safeEmail}</strong>.`,
      "#10b981"
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// Also handle POST (from Mailgun webhook etc.)
export async function POST(request: NextRequest) {
  try {
    const rate = await checkRateLimit(`unsub:${getClientIp(request)}`, RATE_LIMITS.CONTACT);
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = await request.json();
    const rawEmail = String(body.email || "")
      .trim()
      .toLowerCase();
    if (!rawEmail || rawEmail.length > 320 || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
    }
    const entry: UnsubEntry = {
      email: rawEmail,
      partnerId:
        body.partnerId || body.pid ? String(body.partnerId || body.pid).slice(0, 100) : null,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for"),
    };

    await logUnsubscribe(entry);
    return NextResponse.json({ ok: true, email: entry.email });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// List all unsubscribes (for syncing back to local DB)
export async function PUT(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const expectedKey = process.env.UNSUB_API_KEY?.trim();
  if (!expectedKey || auth !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await listUnsubscribes();
    return NextResponse.json({ data: entries });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

function generateHTML(title: string, message: string, color: string): string {
  const safeTitle = escapeHtml(title);
  const safeColor = /^#[0-9a-fA-F]{3,6}$/.test(color) ? color : "#10b981";
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} — DMF Talents</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .card {
      background: white;
      padding: 48px 40px;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      text-align: center;
      max-width: 500px;
      margin: 20px;
    }
    h1 { color: ${safeColor}; margin-bottom: 16px; font-size: 24px; }
    p { color: #4b5563; line-height: 1.7; font-size: 16px; }
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #9ca3af;
      font-size: 13px;
    }
    a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${safeTitle}</h1>
    <p>${message}</p>
    <div class="footer">
      <p>DMF Talents — <a href="https://dmf-talents.de">dmf-talents.de</a></p>
      <p style="margin-top: 8px;">Falls Sie sich irrtümlich abgemeldet haben,<br>kontaktieren Sie uns bitte direkt.</p>
    </div>
  </div>
</body>
</html>`;
}
