import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderMessageContent } from "../lib/chatbot/message-content";

const render = (content: string) => renderToStaticMarkup(<p>{renderMessageContent(content)}</p>);

describe("chatbot message rendering", () => {
  it("renders plain and markdown emails once with exact destinations", () => {
    const html = render("contact@dmf.edu.vn, [Email](mailto:contact@dmf.edu.vn)");
    expect(html.match(/href="mailto:contact@dmf\.edu\.vn"/g)).toHaveLength(2);
    expect(html.match(/<a /g)).toHaveLength(2);
    expect(html).toContain("contact@dmf.edu.vn</a>, ");
    expect(html).not.toMatch(/<a\b[^>]*>[^<]*<a\b/);
  });

  it("renders URLs, punctuation, bold, bullets and newlines", () => {
    const html = render(
      "**Visit https://example.com/path**.\n- [Site](https://example.org/a) and https://example.com/test)."
    );
    expect(html).toContain('<strong>Visit <a href="https://example.com/path"');
    expect(html).toContain('</a></strong>.<br/>• <a href="https://example.org/a"');
    expect(html).toContain('href="https://example.com/test"');
    expect(html).toContain("https://example.com/test</a>).");
  });

  it("rejects unsafe markdown protocols and escapes HTML-like input", () => {
    const html = render(
      '[bad](javascript:alert) [bad](data:text/html) <script>alert("x")</script> & [broken](https://)'
    );
    expect(html).not.toContain("<a ");
    expect(html).toContain("[bad](javascript:alert)");
    expect(html).toContain("[bad](data:text/html)");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp;");
    expect(html).toContain("[broken](https://)");
  });
});
