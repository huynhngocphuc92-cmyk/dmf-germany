const locales = { de: "de-DE", en: "en-US", vn: "vi-VN" } as const;
type BlogLanguage = keyof typeof locales;
type MonthStyle = "short" | "long";

const formatters = new Map<string, Intl.DateTimeFormat>();

/** Public editorial dates follow German business time, independent of the host timezone. */
export function formatBlogDate(
  timestamp: string | null | undefined,
  language: BlogLanguage,
  month: MonthStyle = "short"
): string {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";

  const key = `${language}-${month}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locales[language], {
      timeZone: "Europe/Berlin",
      day: "2-digit",
      month,
      year: "numeric",
    });
    formatters.set(key, formatter);
  }

  const parts = formatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value;
  // Keep the existing day / localized month / year shape in every language.
  return `${part("day")} ${part("month")} ${part("year")}`;
}
