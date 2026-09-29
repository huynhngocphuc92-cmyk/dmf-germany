import { expect, it, vi, afterEach } from "vitest";
vi.mock("server-only", () => ({}));
import { validateBuildEnvironment } from "@/lib/env/build";
import { assertIntakeEnvironment } from "@/lib/supabase/intake";
afterEach(() => vi.unstubAllEnvs());
it("names missing configuration without printing values", () => {
  expect(() => validateBuildEnvironment({ NODE_ENV: "production" })).toThrow(
    "NEXT_PUBLIC_SUPABASE_URL"
  );
  expect(() =>
    validateBuildEnvironment({
      NODE_ENV: "production",
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "fixture",
    })
  ).toThrow("SUPABASE_SECRET_KEY");
});
it("rejects a backend key in a browser-exposed variable", () => {
  expect(() =>
    validateBuildEnvironment({
      NODE_ENV: "test",
      NEXT_PUBLIC_SUPABASE_URL: "https://fixture.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_secret_private",
    })
  ).toThrow("server secret");
});
it("prevents preview writes to the production backend", () => {
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("INTAKE_TEST_BACKEND", "true");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://iihprcuhmilmymlbktpy.supabase.co");
  expect(assertIntakeEnvironment).toThrow("production database");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  expect(assertIntakeEnvironment).not.toThrow();
});
