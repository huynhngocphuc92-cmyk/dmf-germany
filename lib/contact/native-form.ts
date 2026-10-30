import { withDeadline } from "@/lib/requests/deadline";
import { isValidBusinessPhone, BUSINESS_PHONE_ERROR_MESSAGE } from "@/lib/validations/phone-rules";

const SEND_ERROR = "Fehler beim Senden. Bitte versuchen Sie es später noch einmal.";

// Keep the previous payload shape and order for stable retry keys.
export function readContactForm(form: FormData) {
  const value = (name: string) => String(form.get(name) ?? "");
  return {
    name: value("name"),
    email: value("email"),
    phone: value("phone"),
    company: value("company"),
    message: value("message"),
    privacy: form.get("privacy") === "on",
    bot_check: value("bot_check"),
  };
}

export async function validateContactPhone(phone: string) {
  if (!phone) return null;
  return phone.length <= 50 && isValidBusinessPhone(phone) ? null : BUSINESS_PHONE_ERROR_MESSAGE;
}

export async function submitContactForm(data: ReturnType<typeof readContactForm>, key: string) {
  let response: Response;
  let result;
  try {
    ({ response, result } = await withDeadline(async (signal) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        signal,
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return { response, result };
    }, 20000));
  } catch {
    throw new Error(SEND_ERROR);
  }
  if (!response.ok || result?.success !== true || result?.saved !== true) {
    throw new Error(typeof result?.error === "string" ? result.error : SEND_ERROR);
  }
  return { duplicate: Boolean(result.duplicate) };
}
