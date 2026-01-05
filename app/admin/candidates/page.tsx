import { getCandidates } from "./actions";
import { CandidatesClient } from "./candidates-client";

// ============================================
// CANDIDATES PAGE (Server Component)
// ============================================

export default async function CandidatesPage() {
  const { data: candidates, error } = await getCandidates();

  return <CandidatesClient initialCandidates={candidates} error={error} />;
}

