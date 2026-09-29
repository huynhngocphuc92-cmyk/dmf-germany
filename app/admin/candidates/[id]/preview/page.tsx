import Link from "next/link";
import { notFound } from "next/navigation";
import { getCandidate } from "../../actions";
import { toPublicCandidates } from "@/lib/candidates/public-profile";
import { PublicationReview } from "./review-client";

export default async function CandidatePreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: candidate, error } = await getCandidate(id);
  if (error) throw new Error("Profil konnte nicht geladen werden.");
  if (!candidate) notFound();
  const [profile] = toPublicCandidates([candidate]);
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <Link href="/admin/candidates" className="text-emerald-700 underline">
        Zurück zu Kandidaten
      </Link>
      <h1 className="text-2xl font-bold">Profil prüfen und freigeben</h1>
      <p className="text-slate-600">
        Die Vorschau zeigt ausschließlich die öffentlichen Profilangaben. Name, E-Mail, Telefon und
        interne Notizen bleiben im Adminbereich. Neue oder geänderte öffentliche Angaben müssen
        geprüft werden.
      </p>
      {profile ? (
        <PublicationReview
          profile={profile}
          status={candidate.publication_status}
          validUntil={candidate.publication_valid_until}
          consentNote={candidate.publication_consent_note}
          reviewedAt={candidate.publication_reviewed_at}
          updatedAt={candidate.updated_at}
        />
      ) : (
        <p role="alert">
          Profilangaben unvollständig. Bitte Kategorie, Erfahrung und Sprachniveau im Profil
          korrigieren.
        </p>
      )}
    </div>
  );
}
