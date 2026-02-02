import { Suspense } from "react";
import { getFeaturedCandidates } from "@/lib/supabase/candidates";
import { CandidatesClient } from "./candidates-client";

// Force dynamic rendering - No cache to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function KandidatenPage() {
  // Fetch featured candidates (is_featured = true)
  const { data: initialCandidates, error } = await getFeaturedCandidates();

  return (
    <Suspense fallback={<CandidatesPageSkeleton />}>
      <CandidatesClient initialCandidates={initialCandidates || []} error={error} />
    </Suspense>
  );
}

function CandidatesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
