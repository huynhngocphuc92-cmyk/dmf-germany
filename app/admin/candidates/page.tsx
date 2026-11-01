import { getCandidates } from "./actions";
import { getAdminPortalOverview } from "./portal-actions";
import { CandidatesClient } from "./candidates-client";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = "force-dynamic";

// ============================================
// CANDIDATES PAGE (Server Component)
// ============================================

export default async function CandidatesPage() {
  const [{ data: candidates, error }, portalData] = await Promise.all([
    getCandidates(),
    getAdminPortalOverview(),
  ]);

  return (
    <CandidatesClient
      initialCandidates={candidates}
      error={error}
      initialStudentProfiles={portalData.profiles}
      initialStudentDocuments={portalData.documents}
      initialStudentLetters={portalData.letters}
      initialInviteCodes={portalData.inviteCodes}
    />
  );
}
