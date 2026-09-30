import { beforeEach, expect, it, vi } from "vitest";
import { workflowSchema } from "@/lib/validations/request-workflow";
import { hiringIntakeSchema } from "@/lib/validations/hiring";
import { requestContext, createRequestContextTracker } from "@/lib/intake/context";
import { decodeConsent } from "@/lib/consent";
const mocks = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  from: vi.fn(),
  update: vi.fn(),
  eq: vi.fn(),
  select: vi.fn(),
  maybeSingle: vi.fn(),
}));
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { saveRequestWorkflow } from "@/app/admin/requests/workflow-actions";
const id = "00000000-0000-4000-8000-000000000001";
const input = {
  id,
  source: "inquiry",
  version: 3,
  status: "in_progress",
  assignedTo: id,
  followUpOn: "2026-10-10",
  nextAction: "Call",
  notes: "Internal",
};
beforeEach(() => {
  vi.clearAllMocks();
  const query = { ...mocks };
  mocks.from.mockReturnValue(query);
  mocks.update.mockReturnValue(query);
  mocks.eq.mockReturnValue(query);
  mocks.select.mockReturnValue(query);
  mocks.maybeSingle.mockResolvedValue({ data: { id }, error: null });
  mocks.requireAdmin.mockResolvedValue({ supabase: { from: mocks.from } });
});
it("checks authorization before touching a request", async () => {
  mocks.requireAdmin.mockRejectedValue(new Error("Forbidden"));
  expect((await saveRequestWorkflow(input)).success).toBe(false);
  expect(mocks.from).not.toHaveBeenCalled();
});
it("does not report success when a row was changed concurrently or is absent", async () => {
  mocks.maybeSingle.mockResolvedValue({ data: null, error: null });
  expect(await saveRequestWorkflow(input)).toMatchObject({ success: false });
  expect(mocks.eq).toHaveBeenCalledWith("workflow_version", 3);
});
it("writes only permitted operations fields", async () => {
  expect(
    (
      await saveRequestWorkflow({
        ...input,
        email: "attacker@example.invalid",
        workflow_version: 100,
      })
    ).success
  ).toBe(true);
  expect(mocks.update).toHaveBeenCalledWith({
    status: "in_progress",
    assigned_to: id,
    follow_up_on: "2026-10-10",
    next_action: "Call",
    notes: "Internal",
  });
});
it("validates source-specific statuses and date rather than treating closed inquiries as converted leads", () => {
  expect(workflowSchema.safeParse({ ...input, status: "converted" }).success).toBe(false);
  expect(workflowSchema.safeParse({ ...input, source: "lead", status: "qualified" }).success).toBe(
    true
  );
  expect(workflowSchema.safeParse({ ...input, followUpOn: "2026-02-30" }).success).toBe(false);
});
it("requires hiring details and rejects forged publication, quantity and profile IDs", () => {
  const body = {
    company: "Fixture Works",
    name: "Fixture Contact",
    email: "fixture@example.invalid",
    service: "skilled",
    message: "Need skilled people",
    privacy: true,
  };
  expect(hiringIntakeSchema.safeParse(body).success).toBe(true);
  for (const bad of [
    { ...body, company: "" },
    { ...body, privacy: false },
    { ...body, headcount: -2 },
    { ...body, candidateId: "wrong" },
  ])
    expect(hiringIntakeSchema.safeParse(bad).success).toBe(false);
  expect(
    hiringIntakeSchema.parse({ ...body, assignedTo: id, requestPurpose: "forged" })
  ).not.toHaveProperty("assignedTo");
});
it("keeps an internal pathname and bounded campaign IDs without arbitrary query data", () => {
  expect(
    requestContext(
      "https://www.dmf-talents.de/services/azubi?email=private%40example.com&utm_source=newsletter&utm_campaign=autumn#contact"
    )
  ).toEqual({
    sourcePath: "/services/azubi",
    campaign: { source: "newsletter", campaign: "autumn" },
  });
  expect(
    requestContext("https://www.dmf-talents.de/?utm_source=private%40example.com").campaign
  ).toEqual({});
});
it("does not silently extend legacy analytics permission to external media", () => {
  expect(decodeConsent("accepted")).toMatchObject({ analytics: true, externalMedia: false });
  expect(decodeConsent("declined")).toMatchObject({
    analytics: false,
    externalMedia: false,
    decided: true,
  });
  for (const raw of [null, "bad", '{"version":2,"analytics":"yes"}'])
    expect(decodeConsent(raw)).toMatchObject({
      analytics: false,
      externalMedia: false,
      decided: false,
    });
  expect(
    decodeConsent('{"version":2,"analytics":false,"externalMedia":true,"decided":true}')
  ).toMatchObject({ analytics: false, externalMedia: true });
});
it("retains the latest campaign across internal navigation without retaining raw URLs", () => {
  const capture = createRequestContextTracker();
  capture(
    "https://www.dmf-talents.de/?utm_source=newsletter&utm_campaign=autumn&email=private@example.com"
  );
  expect(capture("https://www.dmf-talents.de/services/azubi")).toEqual({
    sourcePath: "/services/azubi",
    campaign: { source: "newsletter", campaign: "autumn" },
  });
  capture("https://www.dmf-talents.de/?utm_source=partner");
  expect(capture("https://www.dmf-talents.de/fuer-arbeitgeber/personalbedarf").campaign).toEqual({
    source: "partner",
  });
  expect(createRequestContextTracker()("https://www.dmf-talents.de/").campaign).toEqual({});
});
