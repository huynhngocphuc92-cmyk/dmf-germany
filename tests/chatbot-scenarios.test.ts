import { describe, expect, it } from "vitest";
import { getGuidedChatResponse } from "@/lib/chatbot/fallback";
import { PRIMARY_CONTACT } from "@/lib/company/contact";

describe("visitor questions during guided-chat phase", () => {
  it.each(["Học phí du học nghề?", "Hoc phi du hoc nghe?"])(
    "answers the fee question before the programme: %s",
    (message) => {
      expect(getGuidedChatResponse("vi", message)).toMatch(/^\*\*Chi phí:/);
    }
  );
  it.each([
    ["en", "How long does hiring a nurse take?", "Process"],
    ["de", "Wie lange dauert die Vermittlung von Pflegekräften?", "Ablauf"],
  ] as const)("does not invent a fixed timeline in %s", (language, message, title) => {
    const answer = getGuidedChatResponse(language, message);
    expect(answer).toContain(`**${title}:**`);
    expect(answer).not.toMatch(/\b\d+\s*(weeks|months|Wochen|Monate)\b/);
  });
  it.each([
    ["en", "Please delete my personal data", "Skilled Workers"],
    ["de", "Ich möchte meine personenbezogenen Daten löschen lassen", "Fachkräfte"],
    ["vi", "Tôi muốn xóa dữ liệu cá nhân", "Lao động chuyên môn"],
  ] as const)(
    "routes privacy requests to contact without treating them as recruiting in %s",
    (language, message, wrongTopic) => {
      const answer = getGuidedChatResponse(language, message);
      expect(answer).not.toContain(`**${wrongTopic}:**`);
      expect(answer).toContain(PRIMARY_CONTACT.email);
      expect(answer).toContain("/#contact");
      expect(answer).not.toMatch(
        /(data (was|has been) deleted|Daten wurden gelöscht|đã xóa dữ liệu)/i
      );
    }
  );
  it("does not confuse Vietnamese education with the word price", () => {
    expect(getGuidedChatResponse("vi", "giáo dục")).not.toMatch(/^\*\*Chi phí:/);
  });
});
