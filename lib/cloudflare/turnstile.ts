import "server-only";
import { isProductionDeploy } from "@/lib/env/runtime";
import type { TurnstileAction } from "./turnstile-types";

export type { TurnstileAction };

export interface TurnstileVerificationResult {
  ok: boolean;
  reason?: string;
}

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;

function getExpectedHostnames(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isTurnstileEnforced(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET?.trim()) || isProductionDeploy();
}

export function extractTurnstileToken(body: unknown, request: Request): string {
  if (body && typeof body === "object" && "cf-turnstile-response" in body) {
    const raw = (body as Record<string, unknown>)["cf-turnstile-response"];
    if (typeof raw === "string" && raw.trim()) {
      return raw.trim();
    }
  }
  return request.headers.get("x-turnstile-token")?.trim() ?? "";
}

export async function verifyTurnstileToken(params: {
  token: string;
  expectedAction: TurnstileAction;
  remoteIp?: string;
}): Promise<TurnstileVerificationResult> {
  if (!isTurnstileEnforced()) {
    return { ok: true };
  }

  const secret = process.env.TURNSTILE_SECRET?.trim() ?? "";
  const expectedHostnames = getExpectedHostnames();
  if (
    !secret ||
    expectedHostnames.size === 0 ||
    typeof params.token !== "string" ||
    params.token.length === 0 ||
    params.token.length > MAX_TOKEN_LENGTH
  ) {
    return { ok: false, reason: "invalid_input" };
  }

  const form = new URLSearchParams({
    secret,
    response: params.token,
  });
  if (params.remoteIp && params.remoteIp !== "unknown") {
    form.set("remoteip", params.remoteIp);
  }

  let data: {
    success?: unknown;
    action?: unknown;
    hostname?: unknown;
  };
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: form,
    });
    if (!response.ok) {
      return { ok: false, reason: "siteverify_error" };
    }
    data = (await response.json()) as typeof data;
  } catch {
    return { ok: false, reason: "siteverify_error" };
  }

  if (
    data?.success === true &&
    data.action === params.expectedAction &&
    typeof data.hostname === "string" &&
    expectedHostnames.has(data.hostname.toLowerCase())
  ) {
    return { ok: true };
  }

  return { ok: false, reason: "verification_failed" };
}
