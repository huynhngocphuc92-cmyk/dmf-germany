export const CONSENT_KEY = "dmf-cookie-consent";
export interface Consent {
  version: 2;
  analytics: boolean;
  externalMedia: boolean;
  decided: boolean;
}
export const EMPTY_CONSENT: Consent = {
  version: 2,
  analytics: false,
  externalMedia: false,
  decided: false,
};
export function decodeConsent(raw: string | null): Consent {
  // Existing analytics permission does not grant permission for additional providers.
  if (raw === "accepted") return { ...EMPTY_CONSENT, analytics: true, decided: true };
  if (raw === "declined") return { ...EMPTY_CONSENT, decided: true };
  try {
    const value = JSON.parse(raw || "null");
    if (
      value?.version === 2 &&
      typeof value.analytics === "boolean" &&
      typeof value.externalMedia === "boolean" &&
      value.decided === true
    )
      return {
        version: 2,
        analytics: value.analytics,
        externalMedia: value.externalMedia,
        decided: true,
      };
  } catch {}
  return EMPTY_CONSENT;
}
