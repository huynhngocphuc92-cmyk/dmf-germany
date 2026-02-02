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
