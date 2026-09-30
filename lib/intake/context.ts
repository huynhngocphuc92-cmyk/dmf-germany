import { requestContextSchema } from "@/lib/validations/hiring";

// Read only an internal path and three bounded identifiers. Never persist a raw URL/referrer.
export function requestContext(url: string) {
  const parsed = new URL(url);
  const campaign: Record<string, string> = {};
  for (const key of ["source", "medium", "campaign"] as const) {
    const value = parsed.searchParams.get(`utm_${key}`);
    if (value && /^[\w .-]{1,100}$/.test(value)) campaign[key] = value;
  }
  return requestContextSchema.parse({
    sourcePath: /^\/[a-zA-Z0-9/_-]{0,299}$/.test(parsed.pathname) ? parsed.pathname : "/",
    campaign,
  });
}

// Keep only the latest allowlisted campaign in this tab's memory across client navigation.
// Reloading the document resets it; nothing is written to cookies or browser storage.
export function createRequestContextTracker() {
  let campaign: NonNullable<ReturnType<typeof requestContext>["campaign"]> = {};
  return (url: string) => {
    const context = requestContext(url);
    if (context.campaign && Object.keys(context.campaign).length) campaign = context.campaign;
    return { ...context, campaign };
  };
}
export const currentRequestContext = createRequestContextTracker();
