import { beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  rows: [] as unknown[],
  error: null as null | { message: string },
}));
vi.mock("@/utils/supabase/public", () => ({ createPublicClient: () => ({ from: mock.from }) }));
import {
  getFeaturedCandidates,
  getHomepageFeaturedCandidates,
  getPublicCandidates,
} from "@/lib/supabase/candidates";

const privateFields = {
  full_name: "PRIVATE_NAME_SENTINEL",
  email: "PRIVATE_EMAIL_SENTINEL",
  phone: "PRIVATE_PHONE_SENTINEL",
  date_of_birth: "PRIVATE_DOB_SENTINEL",
  notes: "PRIVATE_NOTES_SENTINEL",
  unexpected_secret: "UNEXPECTED_SECRET_SENTINEL",
};
const published = {
  id: "fixture-public-id",
  category: "skilled",
  profession: "Elektriker",
  experience_years: 3,
  german_level: "B1",
  visa_status: true,
  avatar_url: null,
  video_url: null,
  is_featured: true,
  ...privateFields,
};

beforeEach(() => {
  mock.rows = [published, { ...published, id: "unpublished-but-visa-ready", is_featured: false }];
  mock.error = null;
  const filters: Array<[string, unknown]> = [];
  const query = {
    select: mock.select.mockReturnThis(),
    eq: mock.eq.mockImplementation(function (this: unknown, field: string, value: unknown) {
      filters.push([field, value]);
      return this;
    }),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: (resolve: (result: unknown) => unknown) =>
      Promise.resolve({
        // Deliberately return extra columns to exercise the runtime DTO, even if select is safe.
        data: mock.rows.filter((row) =>
          filters.every(([field, value]) => (row as Record<string, unknown>)[field] === value)
        ),
        error: mock.error,
      }).then(resolve),
  };
  mock.from.mockReturnValue(query);
});

describe.each([
  ["homepage", getHomepageFeaturedCandidates],
  ["pool", getFeaturedCandidates],
  ["filtered pool", getPublicCandidates],
] as const)("%s publication boundary", (_name, getProfiles) => {
  it("returns only explicitly featured profiles and strips private fields at runtime", async () => {
    const result = await getProfiles();
    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0].id).toBe(published.id);
    const serialized = JSON.stringify(result);
    for (const sentinel of Object.values(privateFields)) expect(serialized).not.toContain(sentinel);
    expect(mock.select).toHaveBeenCalledWith(expect.not.stringContaining("*"));
    expect(mock.eq).toHaveBeenCalledWith("is_featured", true);
  });

  it.each([false, true])("does not broaden an empty or failed query (error=%s)", async (failed) => {
    mock.rows = [];
    mock.error = failed ? { message: "DB_PRIVATE_ERROR" } : null;
    const result = await getProfiles();
    expect(result.data?.length ?? 0).toBe(0);
    expect(mock.from).toHaveBeenCalledOnce();
    expect(JSON.stringify(result)).not.toContain("DB_PRIVATE_ERROR");
  });
});

it("preserves category and language filters", async () => {
  expect((await getPublicCandidates({ category: "azubi", germanLevel: "B2" })).data).toEqual([]);
  expect(mock.eq).toHaveBeenCalledWith("category", "azubi");
  expect(mock.eq).toHaveBeenCalledWith("german_level", "B2");
});
