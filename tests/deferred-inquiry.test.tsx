import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PublicCandidate } from "@/lib/candidates/public-profile";

// A small hook runner exercises the loading lifecycle without a browser dependency.
const hooks = vi.hoisted(() => ({
  states: [] as unknown[],
  index: 0,
  effects: [] as Array<() => void | (() => void)>,
  deadline: vi.fn(),
  imported: vi.fn(),
}));
vi.mock("react", async (original) => ({
  ...(await original<typeof import("react")>()),
  useState: (initial: unknown) => {
    const index = hooks.index++;
    if (!(index in hooks.states)) hooks.states[index] = initial;
    return [
      hooks.states[index],
      (next: unknown) => {
        hooks.states[index] = typeof next === "function" ? next(hooks.states[index]) : next;
      },
    ];
  },
  useEffect: (effect: () => void | (() => void)) => {
    hooks.effects.push(effect);
  },
}));
vi.mock("@/components/providers/LanguageProvider", () => ({ useLanguage: () => ({ lang: "de" }) }));
vi.mock("@/lib/requests/deadline", () => ({ withDeadline: hooks.deadline }));
vi.mock("@/components/candidates/InquiryModal", () => {
  hooks.imported();
  return { InquiryModal: () => null };
});
import { DeferredInquiryModal } from "@/components/b2b/DeferredInquiryModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InquiryModal } from "@/components/candidates/InquiryModal";
import type { ReactElement } from "react";

const candidate = { id: "candidate-1", profession: "Pflege" } as PublicCandidate;
const close = vi.fn();
function render() {
  hooks.index = 0;
  hooks.effects = [];
  return DeferredInquiryModal({ candidate, onClose: close });
}
function find(node: unknown, type: unknown): ReactElement<Record<string, unknown>> | undefined {
  if (!node || typeof node !== "object" || !("props" in node)) return;
  const element = node as ReactElement<{ children?: unknown }>;
  if (element.type === type) return element as ReactElement<Record<string, unknown>>;
  const children = Array.isArray(element.props.children)
    ? element.props.children
    : [element.props.children];
  for (const child of children) {
    const found = find(child, type);
    if (found) return found;
  }
}
beforeEach(() => {
  hooks.states = [];
  hooks.deadline.mockReset().mockImplementation((task) => Promise.resolve(task()));
});

describe("intent-loaded inquiry lifecycle", () => {
  it("shows a dialog immediately and opens the loaded form without a second click", async () => {
    const initial = render();
    expect(initial.type).toBe(Dialog);
    expect(initial.props.open).toBe(true);
    expect(hooks.deadline).not.toHaveBeenCalled();
    hooks.effects[0]();
    await vi.waitFor(() => expect(hooks.states[0]).toBe(InquiryModal));
    const loaded = render();
    expect(loaded.type).toBe(InquiryModal);
    expect(loaded.props).toMatchObject({ candidate, isOpen: true, onClose: close });
    const preventDefault = vi.fn();
    const content = find(initial, DialogContent)!;
    (content.props.onCloseAutoFocus as (event: unknown) => void)({ preventDefault });
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it("contains chunk failure and only retries after explicit action", async () => {
    hooks.deadline.mockRejectedValueOnce(new Error("chunk failed"));
    render();
    hooks.effects[0]();
    await vi.waitFor(() => expect(hooks.states[1]).toBe(true));
    const failed = render();
    expect(failed.type).toBe(Dialog);
    expect(hooks.deadline).toHaveBeenCalledTimes(1);
    const retry = find(failed, Button)!;
    (retry.props.onClick as () => void)();
    render();
    hooks.effects[0]();
    await vi.waitFor(() => expect(hooks.states[0]).toBe(InquiryModal));
    expect(render().type).toBe(InquiryModal);
  });

  it("does not open after close while a chunk finishes late", async () => {
    let resolve!: (value: unknown) => void;
    hooks.deadline.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        })
    );
    render();
    const cleanup = hooks.effects[0]() as () => void;
    cleanup();
    resolve({ InquiryModal });
    await Promise.resolve();
    expect(hooks.states[0]).toBeNull();
  });

  it("turns a bounded timeout into a local retry state", async () => {
    hooks.deadline.mockImplementationOnce((_task, milliseconds, controller) => {
      expect(milliseconds).toBe(15000);
      const error = new DOMException("Timed out", "TimeoutError");
      controller.abort(error);
      return Promise.reject(error);
    });
    render();
    hooks.effects[0]();
    await vi.waitFor(() => expect(hooks.states[1]).toBe(true));
    expect(find(render(), Button)).toBeDefined();
  });
});
