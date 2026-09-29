import { getInquiries } from "./actions";
import { RequestsClient } from "./requests-client";
export const dynamic = "force-dynamic";
export default async function RequestsPage() {
  const { data, error } = await getInquiries();
  return <RequestsClient initialInquiries={data || []} error={error} />;
}
