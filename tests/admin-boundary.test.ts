import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  createServiceClient: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
  intakeClient: vi.fn(),
  dispatch: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: mocks.getUser }, from: mocks.from }),
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createServiceClient }));
vi.mock("@/utils/supabase/public", () => ({ createPublicClient: () => ({ rpc: mocks.rpc }) }));
vi.mock("@/lib/supabase/intake", () => ({ createIntakeClient: mocks.intakeClient }));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: async () => ({ success: true }),
  getClientIp: () => "fixture",
  RATE_LIMITS: { API: {}, CONTACT: {} },
}));
vi.mock("@/lib/intake/notifications", () => ({
  dispatchSubmission: mocks.dispatch,
  dispatchNotification: mocks.dispatch,
}));
vi.mock("next/server", async (original) => ({
  ...(await original<typeof import("next/server")>()),
  after: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { GET as getChats, POST as saveChat } from "@/app/api/chat/history/route";
import { GET as getLeads, POST as submitLead } from "@/app/api/leads/route";
import * as chats from "@/app/admin/chats/actions";
import * as leads from "@/app/admin/leads/actions";
import { getCandidates, getCandidate } from "@/app/admin/candidates/actions";
import { retryNotification } from "@/app/admin/notifications/actions";
import { getDashboardStats } from "@/app/admin/dashboard-actions";

import { getPosts, createPost, deletePost } from "@/app/admin/posts/actions";
import { getInquiries, updateInquiryStatus } from "@/app/admin/requests/actions";
import { getSiteConfigs, updateSiteConfig } from "@/actions/theme-actions";
import { GET as getBlogTopics } from "@/app/api/admin/blog-writer/topics/route";
import { GET as getBlogImages } from "@/app/api/admin/blog-writer/images/route";
import { POST as generateBlog } from "@/app/api/admin/blog-writer/generate/route";

const admin = { id: "00000000-0000-4000-8000-000000000001", app_metadata: { role: "admin" } };
const rows = [
  { id: "fixture", email: "fixture@example.invalid", status: "new", created_at: "2026-09-01" },
];

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fixture-anon-key");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "fixture-service-key");
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
  const result = { data: rows, error: null, count: 1 };
  const query = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue(result),
    single: vi.fn().mockResolvedValue({ ...result, data: rows[0] }),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({ error: null }),
    then: (resolve: (value: typeof result) => unknown) => Promise.resolve(result).then(resolve),
  };
  mocks.from.mockReturnValue(query);
  mocks.intakeClient.mockReturnValue({ rpc: mocks.rpc });
  mocks.rpc.mockResolvedValue({ data: true, error: null });
  mocks.createServiceClient.mockReturnValue({ from: mocks.from });
});

describe.each([
  ["chats", getChats],
  ["leads", getLeads],
] as const)("%s GET", (_name, handler) => {
  it.each([
    ["anonymous", null, null, 401],
    ["invalid session", admin, new Error("expired"), 401],
    ["non-admin", { id: "ordinary", app_metadata: {} }, null, 403],
    [
      "spoofed metadata",
      { id: "ordinary", app_metadata: {}, user_metadata: { role: "admin" } },
      null,
      403,
    ],
    ["anonymous auth user", { ...admin, is_anonymous: true }, null, 403],
  ])("denies %s before creating a privileged client", async (_label, user, error, status) => {
    mocks.getUser.mockResolvedValue({ data: { user }, error });
    const response = await handler(new NextRequest("http://localhost/api?limit=1"));
    expect(response.status).toBe(status);
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("allows a verified administrator and prevents shared caching", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: admin }, error: null });
    const response = await handler(new NextRequest("http://localhost/api?limit=1"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ total: 1, limit: 1, offset: 0 });
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(mocks.from).toHaveBeenCalledOnce();
  });

  it.each(["limit=-1", "limit=101", "limit=1oops", "offset=-1"])(
    "rejects invalid pagination: %s",
    async (query) => {
      mocks.getUser.mockResolvedValue({ data: { user: admin }, error: null });
      expect((await handler(new NextRequest(`http://localhost/api?${query}`))).status).toBe(400);
      expect(mocks.from).not.toHaveBeenCalled();
    }
  );
});

describe("direct Server Action authorization", () => {
  const actions = [
    () => chats.getChatSessions(),
    () => chats.getChatSession("fixture"),
    () => chats.getChatStats(),
    () => chats.deleteChatSession("fixture"),
    () => leads.getLeads(),
    () => leads.getLeadStats(),
    () => leads.updateLeadStatus("fixture", "contacted"),
    () => leads.updateLeadNotes("fixture", "note"),
    () => leads.deleteLead("fixture"),
    () => leads.exportLeadsCSV(),
    () => getCandidates(),
    () => getCandidate("fixture"),
    () => getDashboardStats(),
    () => retryNotification({}, new FormData()),
    () => getPosts(),
    () =>
      createPost({
        title: "Fixture title",
        slug: "fixture",
        content: "Fixture body",
        status: "draft",
      }),
    () => deletePost("00000000-0000-4000-8000-000000000003"),
    () => getInquiries(),
    () => updateInquiryStatus("00000000-0000-4000-8000-000000000003", "in_progress"),
    () => getSiteConfigs(),
    () => updateSiteConfig("fixture", "value"),
  ];
  it.each([null, { id: "ordinary", app_metadata: {} }])(
    "denies direct private reads/writes for %j",
    async (user) => {
      mocks.getUser.mockResolvedValue({ data: { user }, error: null });
      vi.spyOn(console, "error").mockImplementation(() => {});
      for (const action of actions) {
        // Some legacy actions return an error result; others reject. Neither may access the DB.
        await action().catch(() => undefined);
      }
      expect(mocks.createServiceClient).not.toHaveBeenCalled();
      expect(mocks.from).not.toHaveBeenCalled();
      expect(mocks.intakeClient).not.toHaveBeenCalled();
      expect(mocks.dispatch).not.toHaveBeenCalled();
      vi.restoreAllMocks();
    }
  );

  it("preserves administrator list and CSV workflows", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: admin }, error: null });
    expect(await leads.getLeads()).toEqual(rows);
    expect(await leads.exportLeadsCSV()).toContain("fixture@example.invalid");
    expect(await chats.getChatSession("fixture")).toEqual(rows[0]);
    expect(await leads.updateLeadStatus("fixture", "contacted")).toBe(true);
  });
});

it("preserves anonymous chatbot saves", async () => {
  const response = await saveChat(
    new NextRequest("http://localhost/api/chat/history", {
      method: "POST",
      body: JSON.stringify({ sessionId: "fixture-session", messages: [] }),
    })
  );
  expect(await response.json()).toEqual({ success: true, saved: true });
  expect(response.cookies.get("dmf_chat_owner")?.value).toMatch(/^[a-f0-9]{64}$/);
  expect(response.headers.get("set-cookie")).toContain("HttpOnly");
  expect(mocks.createServiceClient).not.toHaveBeenCalled();
});

it("uses the HttpOnly owner cookie, ignoring a forged owner in the payload", async () => {
  const cookieToken = "a".repeat(64);
  const response = await saveChat(
    new NextRequest("http://localhost/api/chat/history", {
      method: "POST",
      headers: { cookie: `dmf_chat_owner=${cookieToken}` },
      body: JSON.stringify({
        sessionId: "fixture-session",
        messages: [],
        ownerToken: "b".repeat(64),
      }),
    })
  );
  expect(response.status).toBe(200);
  expect(mocks.rpc).toHaveBeenCalledWith(
    "dmf_save_chat",
    expect.objectContaining({ p_owner_token: cookieToken })
  );
});

it("denies an unowned chat update without issuing an ownership cookie", async () => {
  mocks.rpc.mockResolvedValue({ data: false, error: null });
  const response = await saveChat(
    new NextRequest("http://localhost/api/chat/history", {
      method: "POST",
      body: JSON.stringify({ sessionId: "known-victim", messages: [] }),
    })
  );
  expect(response.status).toBe(403);
  expect(response.cookies.get("dmf_chat_owner")).toBeUndefined();
});

it("accepts anonymous lead intake through the durable server RPC", async () => {
  mocks.rpc.mockResolvedValue({ data: { duplicate: false }, error: null });
  const response = await submitLead(
    new NextRequest("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify({ email: "fixture@example.invalid" }),
    })
  );
  expect(await response.json()).toMatchObject({
    success: true,
    accepted: true,
    saved: true,
    duplicate: false,
  });
  expect(mocks.rpc).toHaveBeenCalledWith(
    "dmf_receive_intake",
    expect.objectContaining({
      p_id: expect.any(String),
      p_kind: "lead",
      p_payload: { email: "fixture@example.invalid" },
    })
  );
  expect(mocks.from).not.toHaveBeenCalled();
});

it("reports intake persistence failures instead of a false success", async () => {
  mocks.rpc.mockResolvedValue({ data: null, error: { message: "PRIVATE_DB_ERROR" } });
  const response = await submitLead(
    new NextRequest("http://localhost/api/leads", {
      method: "POST",
      body: JSON.stringify({ email: "fixture@example.invalid" }),
    })
  );
  expect(response.status).toBe(503);
  expect(JSON.stringify(await response.json())).not.toContain("PRIVATE_DB_ERROR");
});

it("rejects malformed public input before persistence", async () => {
  const response = await saveChat(
    new NextRequest("http://localhost/api/chat/history", {
      method: "POST",
      body: JSON.stringify({ sessionId: "fixture", messages: "invalid" }),
    })
  );
  expect(response.status).toBe(400);
  expect(mocks.rpc).not.toHaveBeenCalled();
});

it.each([getBlogTopics, getBlogImages, generateBlog])(
  "blocks direct AI API calls before privileged access",
  async (handler) => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "ordinary", app_metadata: {} } },
      error: null,
    });
    const response = await handler(
      new NextRequest("http://localhost/api/admin/test", { method: "POST", body: "{}" })
    );
    expect(response.status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.intakeClient).not.toHaveBeenCalled();
  }
);

it("blocks preview admin mutations against the production backend even for a real admin", async () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("INTAKE_TEST_BACKEND", "true");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://iihprcuhmilmymlbktpy.supabase.co");
  mocks.getUser.mockResolvedValue({ data: { user: admin }, error: null });
  try {
    expect((await updateSiteConfig("fixture", "value")).error).toBeTruthy();
    expect((await getLeads(new NextRequest("http://localhost/api/leads"))).status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.createServiceClient).not.toHaveBeenCalled();
  } finally {
    vi.unstubAllEnvs();
  }
});
