import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * GET /api/unsubscribe?email=xxx&pid=123
 *
 * Handles email unsubscribe requests from outreach campaigns.
 * - Logs the unsubscribe to a JSON file (persisted on Vercel via /tmp)
 * - Shows a German confirmation page
 * - Also forwards to a webhook (if configured) so the Partner-Suchen
 *   local server can update its database
 */

const UNSUB_LOG = '/tmp/unsubscribes.json';
const WEBHOOK_URL = process.env.UNSUB_WEBHOOK_URL; // Optional: forward to local server

interface UnsubEntry {
  email: string;
  partnerId: string | null;
  timestamp: string;
  ip: string | null;
}

async function logUnsubscribe(entry: UnsubEntry) {
  try {
    let entries: UnsubEntry[] = [];
    try {
      const data = await fs.readFile(UNSUB_LOG, 'utf-8');
      entries = JSON.parse(data);
    } catch {
      // File doesn't exist yet
    }

    // Don't duplicate
    if (entries.some(e => e.email === entry.email)) {
      return;
    }

    entries.push(entry);
    await fs.writeFile(UNSUB_LOG, JSON.stringify(entries, null, 2));
  } catch (err) {
    console.error('Failed to log unsubscribe:', err);
  }
}

async function forwardToWebhook(entry: UnsubEntry) {
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch {
    // Silently fail — local server might be offline
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const partnerId = searchParams.get('pid') || searchParams.get('id');

  if (!email) {
    return new NextResponse(
      generateHTML(
        'Fehler',
        'Keine E-Mail-Adresse angegeben.',
        '#ef4444'
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const entry: UnsubEntry = {
    email: email.toLowerCase(),
    partnerId,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
  };

  // Log and forward in parallel
  await Promise.all([
    logUnsubscribe(entry),
    forwardToWebhook(entry),
  ]);

  return new NextResponse(
    generateHTML(
      '✅ Erfolgreich abgemeldet',
      `Sie erhalten keine weiteren E-Mails von uns an <strong>${email}</strong>.`,
      '#10b981'
    ),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

// Also handle POST (from Mailgun webhook etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry: UnsubEntry = {
      email: (body.email || '').toLowerCase(),
      partnerId: body.partnerId || body.pid || null,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for'),
    };

    if (!entry.email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    await logUnsubscribe(entry);
    return NextResponse.json({ ok: true, email: entry.email });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// List all unsubscribes (for syncing back to local DB)
export async function PUT(request: NextRequest) {
  // Simple auth check
  const auth = request.headers.get('authorization');
  const expectedKey = process.env.UNSUB_API_KEY || 'dmf-unsub-key';
  if (auth !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await fs.readFile(UNSUB_LOG, 'utf-8');
    const entries = JSON.parse(data);
    return NextResponse.json({ data: entries });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

function generateHTML(title: string, message: string, color: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — DMF Talents</title>
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
    h1 { color: ${color}; margin-bottom: 16px; font-size: 24px; }
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
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="footer">
      <p>DMF Talents — <a href="https://dmf-talents.de">dmf-talents.de</a></p>
      <p style="margin-top: 8px;">Falls Sie sich irrtümlich abgemeldet haben,<br>kontaktieren Sie uns bitte direkt.</p>
    </div>
  </div>
</body>
</html>`;
}
