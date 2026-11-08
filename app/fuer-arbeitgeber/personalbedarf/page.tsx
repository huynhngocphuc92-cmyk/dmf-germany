import { HiringRequestForm } from "@/components/employers/HiringRequestForm";
import { pageMetadata } from "@/lib/site";
import { serviceSchema } from "@/lib/validations/hiring";
export const metadata = pageMetadata(
  "/fuer-arbeitgeber/personalbedarf",
  "Personalbedarf melden",
  "Beschreiben Sie Ihren Personalbedarf. DMF Talents klärt passende Profile, Anforderungen und nächste Schritte mit Ihrem Unternehmen."
);
export default async function HiringPage({
  searchParams,
}: {
  searchParams: Promise<{
    service?: string;
    candidates?: string;
    branche?: string;
    location?: string;
    headcount?: string;
    timing?: string;
    company?: string;
    message?: string;
  }>;
}) {
  const sp = await searchParams;
  const service = serviceSchema.catch("unsure").parse(sp.service);
  const shortlistedCandidates =
    typeof sp.candidates === "string" && sp.candidates.trim()
      ? sp.candidates.trim().slice(0, 600)
      : undefined;
  const initialBrancheLabel =
    typeof sp.branche === "string" && sp.branche.trim()
      ? sp.branche.trim().slice(0, 120)
      : undefined;
  const initialLocation =
    typeof sp.location === "string" && sp.location.trim()
      ? sp.location.trim().slice(0, 180)
      : undefined;
  const initialHeadcount =
    typeof sp.headcount === "string" && /^\d{1,4}$/.test(sp.headcount.trim())
      ? sp.headcount.trim()
      : undefined;
  const initialTiming =
    typeof sp.timing === "string" && sp.timing.trim() ? sp.timing.trim().slice(0, 180) : undefined;
  const initialCompany =
    typeof sp.company === "string" && sp.company.trim()
      ? sp.company.trim().slice(0, 300)
      : undefined;
  const initialMessage =
    typeof sp.message === "string" && sp.message.trim()
      ? sp.message.trim().slice(0, 1200)
      : undefined;
  return (
    <div className="bg-secondary pt-40 md:pt-48 pb-16 px-5">
      <div className="max-w-4xl mx-auto rounded-2xl border bg-card p-6 md:p-10">
        <HiringRequestForm
          service={service}
          shortlistedCandidates={shortlistedCandidates}
          initialBrancheLabel={initialBrancheLabel}
          initialLocation={initialLocation}
          initialHeadcount={initialHeadcount}
          initialTiming={initialTiming}
          initialCompany={initialCompany}
          initialMessage={initialMessage}
          headingLevel={1}
        />
      </div>
    </div>
  );
}
