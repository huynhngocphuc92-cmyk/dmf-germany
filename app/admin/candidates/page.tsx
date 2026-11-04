import { getCandidates } from "./actions";
import { getAdminPortalOverview } from "./portal-actions";
import { mergeWithDmfAdminCandidates } from "@/lib/candidates/dmf-pool-data";
import { CandidatesClient } from "./candidates-client";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = "force-dynamic";

// ============================================
// CANDIDATES PAGE (Server Component)
// ============================================

export default async function CandidatesPage() {
  const [{ data: dbCandidates, error }, portalData] = await Promise.all([
    getCandidates(),
    getAdminPortalOverview(),
  ]);
  const candidates = mergeWithDmfAdminCandidates(dbCandidates);

  return (
    <CandidatesClient
      initialCandidates={candidates}
      error={candidates.length > 0 ? null : error}
      initialStudentProfiles={portalData.profiles}
      initialStudentDocuments={portalData.documents}
      initialStudentLetters={portalData.letters}
      initialInviteCodes={portalData.inviteCodes}
    />
  );
}
