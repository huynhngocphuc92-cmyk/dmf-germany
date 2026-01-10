import { getInquiries } from "./actions";
import { RequestsClient } from "./requests-client";

// Force dynamic rendering (uses cookies for auth)
export const dynamic = 'force-dynamic';

// ============================================
// REQUESTS PAGE (Server Component)
// ============================================

export default async function RequestsPage() {
  try {
    const { data: inquiries, error } = await getInquiries();
    return <RequestsClient initialInquiries={inquiries || []} error={error} />;
  } catch (err) {
    console.error("Error in RequestsPage:", err);
    return (
      <RequestsClient 
        initialInquiries={[]} 
        error={err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten."} 
      />
    );
  }
}
