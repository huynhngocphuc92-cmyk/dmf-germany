"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateCard } from "@/components/candidates/CandidateCard";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { publicationReviewSchema, type PublicationReviewData } from "@/lib/validations/schemas";
import { publishCandidate, unpublishCandidate } from "../../actions";

interface Props {
  profile: PublicCandidate;
  status: "draft" | "published";
  validUntil: string | null;
  consentNote: string | null;
  reviewedAt: string | null;
  updatedAt: string;
}
export function PublicationReview({
  profile,
  status,
  validUntil,
  consentNote,
  reviewedAt,
  updatedAt,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PublicationReviewData>({
    resolver: zodResolver(publicationReviewSchema),
    defaultValues: {
      consent: false,
      consent_note: consentNote ?? "",
      valid_until: validUntil ?? "",
      expected_updated_at: updatedAt,
    },
  });
  const expired = !!validUntil && validUntil < new Date().toISOString().slice(0, 10);
  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div>
        <h2 className="font-semibold mb-3">Öffentliche Vorschau</h2>
        <CandidateCard candidate={profile} preview />
      </div>
      <div className="space-y-4">
        <p className="font-medium">
          Status:{" "}
          {status === "published"
            ? expired
              ? "Abgelaufen – nicht öffentlich"
              : "Veröffentlicht"
            : "Entwurf – nicht öffentlich"}
        </p>
        {reviewedAt && (
          <p className="text-sm text-slate-600">
            Letzte Freigabe: {new Date(reviewedAt).toLocaleDateString("de-DE")}
          </p>
        )}
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (data) => {
            const result = await publishCandidate(profile.id, {
              ...data,
              expected_updated_at: updatedAt,
            });
            setMessage(result.error ?? "Profil veröffentlicht.");
            if (!result.error) router.refresh();
          })}
        >
          <label className="block text-sm font-medium" htmlFor="consent_note">
            Nachweis der Einwilligung (intern)
          </label>
          <textarea
            id="consent_note"
            {...register("consent_note")}
            className="w-full rounded border p-3"
            rows={3}
            placeholder="Datum und Ablageort der Einwilligung; geprüfte Angaben und Medien"
          />
          {errors.consent_note && (
            <p role="alert" className="text-red-700 text-sm">
              {errors.consent_note.message}
            </p>
          )}
          <label className="block text-sm font-medium" htmlFor="valid_until">
            Öffentlich bis einschließlich (UTC)
          </label>
          <input
            id="valid_until"
            type="date"
            {...register("valid_until")}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full rounded border p-3"
          />
          {errors.valid_until && (
            <p role="alert" className="text-red-700 text-sm">
              {errors.valid_until.message}
            </p>
          )}
          <label className="flex gap-3 text-sm items-start">
            <input type="checkbox" {...register("consent")} className="mt-1" />
            <span>
              Einwilligung für diese Angaben, Bilder und Videos liegt vor. Profil und Verfügbarkeit
              wurden geprüft; es handelt sich nicht um Musterdaten.
            </span>
          </label>
          {errors.consent && (
            <p role="alert" className="text-red-700 text-sm">
              {errors.consent.message}
            </p>
          )}
          <button
            disabled={isSubmitting || withdrawing}
            className="rounded bg-emerald-700 text-white px-4 py-3 disabled:opacity-50"
          >
            {isSubmitting ? "Wird freigegeben…" : "Geprüftes Profil veröffentlichen"}
          </button>
        </form>
        {status === "published" && (
          <button
            disabled={isSubmitting || withdrawing}
            className="rounded border border-red-300 text-red-700 px-4 py-3"
            onClick={async () => {
              setWithdrawing(true);
              try {
                const result = await unpublishCandidate(profile.id);
                setMessage(result.error ?? "Profil zurückgezogen.");
                if (!result.error) router.refresh();
              } finally {
                setWithdrawing(false);
              }
            }}
          >
            Veröffentlichung zurückziehen
          </button>
        )}
        {message && (
          <p role="status" className="text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
