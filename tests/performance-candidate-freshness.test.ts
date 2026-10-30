import { afterEach, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({
  from: vi.fn(),
  gte: vi.fn(),
  rows: [] as Record<string, unknown>[],
}));
vi.mock("@/utils/supabase/public", () => ({ createPublicClient: () => ({ from: mock.from }) }));
import { getHomepageFeaturedCandidates } from "@/lib/supabase/candidates";

afterEach(() => vi.useRealTimers());

it("rechecks withdrawals and the current expiry cutoff on each homepage read", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-30T12:00:00Z"));
  mock.rows = [
    {
      id: "public-fixture",
      publication_status: "published",
      publication_valid_until: "2026-10-30",
      is_featured: true,
      category: "skilled",
      profession: "Elektriker",
      visa_status: true,
      german_level: "B1",
      experience_years: 3,
    },
  ];
  mock.from.mockImplementation(() => {
    const predicates: Array<(row: Record<string, unknown>) => boolean> = [];
    const query = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockImplementation((key: string, value: unknown) => {
        predicates.push((row) => row[key] === value);
        return query;
      }),
      gte: mock.gte.mockImplementation((key: string, value: string) => {
        predicates.push((row) => String(row[key]) >= value);
        return query;
      }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      then: (resolve: (value: unknown) => unknown) =>
        Promise.resolve({
          data: mock.rows.filter((row) => predicates.every((test) => test(row))),
          error: null,
        }).then(resolve),
    };
    return query;
  });
  expect((await getHomepageFeaturedCandidates()).data).toHaveLength(1);
  mock.rows[0].publication_status = "withdrawn";
  expect((await getHomepageFeaturedCandidates()).data).toEqual([]);
  mock.rows[0].publication_status = "published";
  vi.setSystemTime(new Date("2026-10-31T00:01:00Z"));
  expect((await getHomepageFeaturedCandidates()).data).toEqual([]);
  expect(mock.from).toHaveBeenCalledTimes(3);
  expect(mock.gte).toHaveBeenLastCalledWith("publication_valid_until", "2026-10-31");
});
