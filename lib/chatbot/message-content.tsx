import type { ReactNode } from "react";

const linkClass = "underline text-blue-600 hover:text-blue-800 font-medium";
// Match complete constructs before their contents so links are never linkified twice.
const tokens =
  /\[([^\]\n]*)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|https?:\/\/[^\s<>"']+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\n/g;

function safeHref(destination: string): string | null {
  try {
    const url = new URL(destination);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.hostname ? destination : null;
    }
    if (url.protocol === "mailto:" && url.pathname && !/[\r\n]/.test(destination)) {
      return destination;
    }
  } catch {
    // Invalid destinations remain visible as text.
  }
  return null;
}

function trimUrlPunctuation(value: string): [string, string] {
  let end = value.length;
  while (end > 0 && /[.,!?;:]/.test(value[end - 1])) end--;
  // Keep balanced parentheses in URLs, but leave a closing sentence parenthesis outside.
  while (end > 0 && value[end - 1] === ")") {
    const candidate = value.slice(0, end);
    if ((candidate.match(/\(/g) || []).length >= (candidate.match(/\)/g) || []).length) break;
    end--;
  }
  return [value.slice(0, end), value.slice(end)];
}

export function renderMessageContent(content: string): ReactNode[] {
  content = content.replace(/^- /gm, "• ");
  const nodes: ReactNode[] = [];
  const pattern = new RegExp(tokens.source, tokens.flags);
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content))) {
    nodes.push(content.slice(last, match.index));
    const [value, label, destination, bold] = match;
    const key = match.index;
    if (destination !== undefined) {
      const href = safeHref(destination);
      nodes.push(
        href ? (
          <a
            key={key}
            href={href}
            className={`${linkClass}${href.startsWith("mailto:") ? "" : " inline-flex items-center gap-0.5"}`}
            {...(href.startsWith("mailto:")
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
          >
            {label}
          </a>
        ) : (
          value
        )
      );
    } else if (bold !== undefined) {
      nodes.push(<strong key={key}>{renderMessageContent(bold)}</strong>);
    } else if (value === "\n") {
      nodes.push(<br key={key} />);
    } else if (value.startsWith("http")) {
      const [url, punctuation] = trimUrlPunctuation(value);
      const href = safeHref(url);
      nodes.push(
        href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {url}
          </a>
        ) : (
          url
        ),
        punctuation
      );
    } else {
      nodes.push(
        <a key={key} href={`mailto:${value}`} className={linkClass}>
          {value}
        </a>
      );
    }
    last = pattern.lastIndex;
  }
  nodes.push(content.slice(last));
  return nodes;
}
