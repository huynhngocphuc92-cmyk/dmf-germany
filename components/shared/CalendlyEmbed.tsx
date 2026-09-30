"use client";
import { Calendar } from "lucide-react";
// Navigation happens only on an explicit click; no third-party widget script is loaded.
export function CalendlyEmbed({
  url = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/contact-dmf/30min",
  text = "Beratungsgespräch buchen",
  className = "",
}: {
  url?: string;
  text?: string;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <Calendar className="w-4 h-4 shrink-0" />
      {text}
      <span className="sr-only"> (Calendly, neuer Tab)</span>
    </a>
  );
}
