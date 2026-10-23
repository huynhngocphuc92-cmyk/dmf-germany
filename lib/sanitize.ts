/**
 * HTML escaping utility to prevent XSS attacks in email templates
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Escape HTML special characters to prevent XSS
 * @param str - String to escape
 * @returns Escaped string safe for HTML insertion
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }
  return str.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Escape HTML and convert newlines to <br> tags
 * Useful for message content in emails
 */
export function escapeHtmlWithBreaks(str: string): string {
  return escapeHtml(str).replace(/\n/g, "<br>");
}

/**
 * Sanitize rich-text HTML content (e.g., blog posts) before storing or rendering.
 * Strips dangerous elements, inline event handlers, and executable URI schemes
 * while preserving safe semantic markup (headings, paragraphs, lists, tables, links, images).
 */
export function sanitizeRichHtml(html: string): string {
  if (!html || typeof html !== "string") {
    return "";
  }

  return (
    html
      // 1. Remove paired dangerous tags and their inner content
      .replace(
        /<\s*(script|iframe|object|embed|form|style|applet)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
        ""
      )
      // 2. Remove any remaining standalone/unclosed dangerous tags
      .replace(
        /<\s*\/?\s*(script|iframe|object|embed|form|style|link|meta|base|applet)\b[^>]*>/gi,
        ""
      )
      // 3. Remove inline event handler attributes (onclick, onerror, onload, etc.)
      .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      // 4. Neutralize javascript:, vbscript:, and data:text/html in URI attributes
      .replace(
        /\b(href|src|xlink:href|action|formaction)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi,
        (match, attr: string, dq?: string, sq?: string, uq?: string) => {
          const rawVal = dq ?? sq ?? uq ?? "";
          const normalized = rawVal.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
          if (
            normalized.startsWith("javascript:") ||
            normalized.startsWith("vbscript:") ||
            normalized.startsWith("data:text/html")
          ) {
            return `${attr}="#"`;
          }
          return match;
        }
      )
  );
}
