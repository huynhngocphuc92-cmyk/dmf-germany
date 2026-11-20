export type AiGatewayProvider = "openrouter" | "grok";

export interface AiGatewayEndpoint {
  url: string;
  headers: Record<string, string>;
  viaGateway: boolean;
}

export interface ResolveAiGatewayOptions {
  cacheTtlSeconds?: number;
  skipCache?: boolean;
  metadata?: Record<string, string>;
}

const GATEWAY_BASE_URL = "https://gateway.ai.cloudflare.com/v1";

export function resolveAiGatewayEndpoint(
  provider: AiGatewayProvider,
  directUrl: string,
  options: ResolveAiGatewayOptions = {}
): AiGatewayEndpoint {
  const accountId = process.env.CF_AI_GATEWAY_ACCOUNT_ID?.trim();
  const gatewayId = process.env.CF_AI_GATEWAY_ID?.trim();
  const gatewayToken = process.env.CF_AI_GATEWAY_TOKEN?.trim();

  // Require all three credentials because the AI Gateway enforces authenticated access.
  if (!accountId || !gatewayId || !gatewayToken) {
    return { url: directUrl, headers: {}, viaGateway: false };
  }

  const providerPath =
    provider === "openrouter" ? "openrouter/v1/chat/completions" : "grok/v1/chat/completions";
  const url = `${GATEWAY_BASE_URL}/${encodeURIComponent(accountId)}/${encodeURIComponent(gatewayId)}/${providerPath}`;

  const headers: Record<string, string> = {
    "cf-aig-authorization": `Bearer ${gatewayToken}`,
    "cf-aig-metadata": JSON.stringify({
      app: "dmf-talents",
      provider,
      ...options.metadata,
    }),
  };

  if (options.skipCache) {
    headers["cf-aig-skip-cache"] = "true";
  } else {
    headers["cf-aig-cache-ttl"] = String(options.cacheTtlSeconds ?? 3600);
  }

  return { url, headers, viaGateway: true };
}
