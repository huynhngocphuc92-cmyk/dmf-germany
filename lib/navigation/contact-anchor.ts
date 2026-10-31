"use client";

import type { MouseEvent } from "react";

export function handleContactAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (event.currentTarget.target && event.currentTarget.target !== "_self") ||
    event.currentTarget.hasAttribute("download")
  ) {
    return;
  }

  const contact = document.getElementById("contact");
  if (!contact) return;

  event.preventDefault();
  if (window.location.hash !== "#contact") {
    window.history.pushState(window.history.state, "", "#contact");
  }

  // Smooth scrolling activates the lazy calculator en route and shifts the target.
  contact.scrollIntoView({ behavior: "instant", block: "start" });
  contact.focus({ preventScroll: true });
}
