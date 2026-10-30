import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

export const opsHeaders = { "Cache-Control": "no-store" };
export function opsAuthorized(request: Request) {
  const expected = process.env.DMF_OPS_TOKEN;
  const authorization = request.headers.get("authorization");
  if (!expected || !authorization?.startsWith("Bearer ")) return false;
  const supplied = authorization.slice(7);
  if (!supplied) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(supplied), digest(expected));
}
