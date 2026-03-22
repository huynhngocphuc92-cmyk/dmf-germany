import { z } from "zod";

export const BUSINESS_PHONE_ERROR_MESSAGE =
  "Bitte geben Sie eine gültige Telefonnummer im Format +49 30 1234567 oder 030 1234567 ein.";

const allowedPhoneCharacters = /^[+\d\s\-./()]+$/;

export function normalizePhoneNumber(value?: string | null) {
  return value?.trim() ?? "";
}

export function isValidBusinessPhone(value?: string | null) {
  const normalized = normalizePhoneNumber(value);

  if (!normalized) {
    return true;
  }

  if (!allowedPhoneCharacters.test(normalized)) {
    return false;
  }

  const compact = normalized.replace(/[\s\-./()]/g, "");

  if (compact.startsWith("+")) {
    return /^\+[1-9]\d{7,14}$/.test(compact);
  }

  if (compact.startsWith("00")) {
    return /^00[1-9]\d{8,15}$/.test(compact);
  }

  if (compact.startsWith("0")) {
    return /^0\d{6,14}$/.test(compact);
  }

  return false;
}

export const optionalBusinessPhoneSchema = z.string().optional().refine(isValidBusinessPhone, {
  message: BUSINESS_PHONE_ERROR_MESSAGE,
});
