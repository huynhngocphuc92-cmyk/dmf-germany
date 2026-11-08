import { NextResponse } from "next/server";
import { opsAuthorized, opsHeaders } from "@/lib/ops/auth";
import {
  buildIndexNowUrlList,
  INDEXNOW_HOST,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  submitIndexNowBatch,
} from "@/lib/seo/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!opsAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: opsHeaders });
  }

  const urls = buildIndexNowUrlList();
  return NextResponse.json(
    {
      status: "ready",
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlCount: urls.length,
      sampleUrls: urls.slice(0, 15),
    },
    { status: 200, headers: opsHeaders }
  );
}

export async function POST(request: Request) {
  if (!opsAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: opsHeaders });
  }

  let customUrls: string[] | undefined;
  try {
    const raw = await request.text();
    if (raw.trim().length > 0) {
      const parsed = JSON.parse(raw) as { urls?: unknown };
      if (Array.isArray(parsed.urls)) {
        customUrls = parsed.urls.filter((u): u is string => typeof u === "string");
      }
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: opsHeaders });
  }

  const summary = await submitIndexNowBatch(customUrls);
  return NextResponse.json(summary, {
    status: summary.ok ? 200 : 502,
    headers: opsHeaders,
  });
}
