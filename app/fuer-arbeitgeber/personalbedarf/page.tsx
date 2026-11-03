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
  searchParams: Promise<{ service?: string; candidates?: string; branche?: string }>;
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
  return (
    <div className="bg-secondary pt-40 md:pt-48 pb-16 px-5">
      <div className="max-w-4xl mx-auto rounded-2xl border bg-card p-6 md:p-10">
        <HiringRequestForm
          service={service}
          shortlistedCandidates={shortlistedCandidates}
          initialBrancheLabel={initialBrancheLabel}
          headingLevel={1}
        />
      </div>
    </div>
  );
}
