export type EnvMap = Record<string, string | undefined>;

export function getDeployEnv(env: EnvMap = process.env): string | undefined {
  return env.APP_ENV || env.CLOUDFLARE_ENV || env.VERCEL_ENV || undefined;
}

export function isPreviewDeploy(env: EnvMap = process.env): boolean {
  return getDeployEnv(env) === "preview";
}

export function isProductionDeploy(env: EnvMap = process.env): boolean {
  return getDeployEnv(env) === "production";
}

export function isNotificationDeliveryEnabled(env: EnvMap = process.env): boolean {
  return (
    !isPreviewDeploy(env) && (isProductionDeploy(env) || env.NOTIFICATION_DELIVERY === "enabled")
  );
}
