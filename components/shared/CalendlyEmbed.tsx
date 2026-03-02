"use client";

import { useEffect, useCallback } from "react";
import { Calendar } from "lucide-react";

interface CalendlyEmbedProps {
  url?: string;
  text?: string;
  className?: string;
}

// Extend window type for Calendly
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/contact-dmf/30min";

export function CalendlyEmbed({
  url = CALENDLY_URL,
  text = "Beratungsgespräch buchen",
  className = "",
}: CalendlyEmbedProps) {
  // Lazy-load Calendly script only when component mounts
  useEffect(() => {
    if (document.getElementById("calendly-script")) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.id = "calendly-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount (optional)
    };
  }, []);

  const openCalendly = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url });
      } else {
        // Fallback: open in new tab if script not yet loaded
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [url]
  );

  return (
    <button
      onClick={openCalendly}
      className={`inline-flex items-center gap-2 cursor-pointer ${className}`}
      type="button"
      aria-label="Beratungsgespräch bei Calendly buchen"
    >
      <Calendar className="w-4 h-4 shrink-0" />
      <span>{text}</span>
    </button>
  );
}
