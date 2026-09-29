import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AdminAuthorizationError } from "./admin";

export const adminResponseHeaders = { "Cache-Control": "private, no-store" };

export function adminAuthorizationResponse(error: unknown) {
  if (!(error instanceof AdminAuthorizationError)) return null;
  return NextResponse.json(
    { error: error.message },
    {
      status: error.status,
      headers: adminResponseHeaders,
    }
  );
}

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(1_000_000).default(0),
});

export function parseAdminPagination(params: URLSearchParams) {
  return paginationSchema.safeParse({
    limit: params.get("limit") ?? undefined,
    offset: params.get("offset") ?? undefined,
  });
}
