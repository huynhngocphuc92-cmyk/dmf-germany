import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactSection from "@/components/sections/ContactSection";
import { TalentShowcase } from "@/components/b2b/TalentShowcase";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import {
  readContactForm,
  submitContactForm,
  validateContactPhone,
} from "@/lib/contact/native-form";

const inquiry = vi.hoisted(() => ({ loaded: vi.fn() }));
vi.mock("@/components/candidates/InquiryModal", () => {
  inquiry.loaded();
  return { InquiryModal: () => null };
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function payload() {
  const form = new FormData();
  for (const [name, value] of Object.entries({
    name: "Test User",
    email: "test@example.com",
    phone: "030 1234567",
    company: "Firma",
    message: "Bitte kontaktieren Sie mich.",
    privacy: "on",
  }))
    form.set(name, value);
  return readContactForm(form);
}

describe("homepage forms", () => {
  it("SSR retains the complete contact form, heading, labels, constraints and privacy link", () => {
    const html = renderToStaticMarkup(<ContactSection />);
    expect(html).toContain("Kontaktieren Sie uns</h2>");
    for (const field of ["name", "email", "phone", "company", "message", "privacy", "bot_check"])
      expect(html).toContain(`name="${field}"`);
    expect(html).toContain('minLength="2"');
    expect(html).toContain('minLength="10"');
    expect(html).toContain('maxLength="50"');
    expect(html.match(/<input[^>]*name="privacy"[^>]*>/)?.[0]).toContain('required=""');
    expect(html).toContain('for="contact-phone"');
    expect(html).toContain('for="contact-privacy"');
    expect(html).toContain('id="contact-privacy"');
    expect(html).toContain('href="/datenschutz"');
    expect(html).toContain('type="submit"');
    expect(html).not.toContain("Vielen Dank!");
  });

  it("keeps the empty talent section SSR content without importing the inquiry form", () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <TalentShowcase candidates={[]} />
      </LanguageProvider>
    );
    expect(html).toContain("<h2");
    expect(html).toContain("Aktuell keine öffentlichen Profile.");
    expect(html).toContain('href="#contact"');
    expect(inquiry.loaded).not.toHaveBeenCalled();
  });

  it("SSR retains public candidate content and profile buttons without loading the closed form", () => {
    const html = renderToStaticMarkup(
      <LanguageProvider>
        <TalentShowcase
          candidates={[
            {
              id: "candidate-public",
              category: "azubi",
              profession: "Pflegefachkraft",
              german_level: "B2",
              visa_status: true,
            },
          ]}
        />
      </LanguageProvider>
    );
    expect(html).toContain("Pflegefachkraft");
    expect(html).toContain("B2");
    expect(html).toContain("<button");
    expect(inquiry.loaded).not.toHaveBeenCalled();
  });

  it.each(["+49 30 1234567", "030 1234567", "0049 30 1234567", ""])(
    "preserves existing phone validation for %s",
    async (phone) => {
      await expect(validateContactPhone(phone)).resolves.toBeNull();
    }
  );
  it.each(["1234567", "+49 invalid", "+0123456789", "0".repeat(51)])(
    "rejects invalid phone %s",
    async (phone) => {
      expect(await validateContactPhone(phone)).toContain("gültige Telefonnummer");
    }
  );

  it("preserves optional empty strings and explicit consent in the payload", () => {
    const data = readContactForm(new FormData());
    expect(data).toEqual({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      privacy: false,
      bot_check: "",
    });
    expect(payload().privacy).toBe(true);
  });

  it("retries the same body and supplied idempotency key after an unsaved response", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true, saved: false })))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, saved: true, duplicate: true }))
      );
    vi.stubGlobal("fetch", fetch);
    await expect(submitContactForm(payload(), "stable-key")).rejects.toThrow();
    await expect(submitContactForm(payload(), "stable-key")).resolves.toEqual({ duplicate: true });
    const [firstUrl, { signal: firstSignal, ...firstOptions }] = fetch.mock.calls[0];
    const [secondUrl, { signal: secondSignal, ...secondOptions }] = fetch.mock.calls[1];
    expect(firstUrl).toBe(secondUrl);
    expect(firstOptions).toEqual(secondOptions);
    expect(firstSignal).not.toBe(secondSignal);
    expect(fetch.mock.calls[0][1].headers["Idempotency-Key"]).toBe("stable-key");
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(payload());
  });

  it("surfaces authoritative errors and rejects malformed receipts", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ error: "Zu viele Anfragen." }), { status: 429 })
        )
        .mockResolvedValueOnce(new Response("not json"))
    );
    await expect(submitContactForm(payload(), "key")).rejects.toThrow("Zu viele Anfragen.");
    await expect(submitContactForm(payload(), "key")).rejects.toThrow("Fehler beim Senden");
  });
});

describe("bounded contact delivery", () => {
  it.each(["fetch", "body"])("does not stay submitting forever when %s hangs", async (stage) => {
    vi.useFakeTimers();
    let signal: AbortSignal;
    const fetch = vi.fn((_url, options) => {
      signal = options.signal;
      return stage === "fetch"
        ? new Promise(() => {})
        : Promise.resolve({ json: () => new Promise(() => {}) });
    });
    vi.stubGlobal("fetch", fetch);
    const pending = expect(submitContactForm(payload(), "same-key")).rejects.toThrow(
      "Fehler beim Senden"
    );
    await vi.advanceTimersByTimeAsync(20000);
    await pending;
    expect(signal!.aborted).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].headers["Idempotency-Key"]).toBe("same-key");
  });
  it.each([
    { success: "true", saved: true },
    { success: true, saved: "true" },
    { success: false, saved: true },
  ])("requires boolean saved success", async (receipt) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(receipt))));
    await expect(submitContactForm(payload(), "key")).rejects.toThrow();
  });
});
