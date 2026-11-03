import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicCandidateById } from "@/lib/supabase/candidates";
import { pageMetadata, siteUrl, SITE_NAME } from "@/lib/site";
import { categoryLabels } from "@/app/admin/candidates/types";
import { ProfileDetailClient } from "./profile-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const candidate = await getPublicCandidateById(id);

  if (!candidate) {
    return pageMetadata(
      `/fuer-arbeitgeber/kandidaten/${id}`,
      "Kandidaten-Exposé nicht verfügbar",
      "Dieses Bewerberprofil ist aktuell nicht öffentlich freigegeben."
    );
  }

  const code = candidate.id.slice(0, 8).toUpperCase();
  const role = candidate.profession || categoryLabels[candidate.category] || "Fachkraft";
  const level = candidate.german_level ? ` (Deutsch ${candidate.german_level})` : "";
  const title = `Bewerber-Exposé #${code}: ${role}${level}`;
  const description = `Anonymisiertes Bewerberprofil #${code} (${role}${level}) aus Vietnam für deutsche Arbeitgeber. Geprüfte Unterlagen und § 81a AufenthG Vorbereitung über ${SITE_NAME}.`;

  return pageMetadata(`/fuer-arbeitgeber/kandidaten/${candidate.id}`, title, description);
}

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = await getPublicCandidateById(id);

  if (!candidate) {
    notFound();
  }

  const code = candidate.id.slice(0, 8).toUpperCase();
  const role = candidate.profession || categoryLabels[candidate.category] || "Fachkraft";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `Bewerber-Exposé #${code} – ${role}`,
    url: siteUrl(`/fuer-arbeitgeber/kandidaten/${candidate.id}`),
    inLanguage: "de-DE",
    mainEntity: {
      "@type": "Person",
      identifier: code,
      jobTitle: role,
      knowsLanguage: candidate.german_level
        ? [`de (${candidate.german_level})`, "vi"]
        : ["de", "vi"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProfileDetailClient candidate={candidate} />
    </>
  );
}
