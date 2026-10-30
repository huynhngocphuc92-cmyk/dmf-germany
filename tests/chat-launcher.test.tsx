import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
const language = vi.hoisted(() => ({ lang: "de" }));
vi.mock("@/components/providers/LanguageProvider", () => ({ useLanguage: () => language }));
import { ChatBotLauncher } from "@/components/bot/ChatBotLauncher";
afterEach(() => vi.unstubAllGlobals());

describe("deferred chat launcher", () => {
  it.each([
    ["de", "Chat öffnen"],
    ["en", "Open chat"],
    ["vn", "Mở chat"],
  ])("renders one accessible idle launcher in %s without widget assets or calls", (lang, label) => {
    language.lang = lang;
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const html = renderToStaticMarkup(<ChatBotLauncher />);
    expect(html).toContain(`aria-label="${label}"`);
    expect(html.match(/<button\b/g)).toHaveLength(1);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<form");
    expect(fetch).not.toHaveBeenCalled();
  });
});
