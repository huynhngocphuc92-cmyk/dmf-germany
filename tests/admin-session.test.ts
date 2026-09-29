import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mock = vi.hoisted(() => ({
  getUser: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  redirect: vi.fn(),
}));
vi.mock("@/utils/supabase/server", () => ({
  createClient: async () => ({
    auth: { getUser: mock.getUser, signInWithPassword: mock.signIn, signOut: mock.signOut },
  }),
}));
vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({ auth: { getUser: mock.getUser } }),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mock.redirect }));

import { login } from "@/app/login/actions";
import { updateSession } from "@/utils/supabase/middleware";

beforeEach(() => {
  mock.signIn.mockResolvedValue({ error: null });
  mock.signOut.mockResolvedValue({ error: null });
  mock.getUser.mockResolvedValue({
    data: { user: { id: "ordinary", app_metadata: {} } },
    error: null,
  });
});

it("signs a non-admin out after password login instead of entering admin", async () => {
  const form = new FormData();
  form.set("email", "fixture@example.invalid");
  form.set("password", "fixture-password");
  expect(await login(form)).toHaveProperty("error");
  expect(mock.signOut).toHaveBeenCalledOnce();
  expect(mock.redirect).not.toHaveBeenCalled();
});

it("does not bounce a non-admin from login back to admin", async () => {
  const denied = await updateSession(new NextRequest("http://localhost/admin"));
  expect(denied.headers.get("location")).toBe("http://localhost/login");
  const loginPage = await updateSession(new NextRequest("http://localhost/login"));
  expect(loginPage.headers.get("location")).toBeNull();
});

it("preserves admin login navigation", async () => {
  mock.getUser.mockResolvedValue({
    data: { user: { id: "admin", app_metadata: { role: "admin" } } },
    error: null,
  });
  const result = await updateSession(new NextRequest("http://localhost/login"));
  expect(result.headers.get("location")).toBe("http://localhost/admin");
});
