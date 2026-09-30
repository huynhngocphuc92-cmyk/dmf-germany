"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HiringRequestForm } from "@/components/employers/HiringRequestForm";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { EMPLOYER_COPY } from "@/lib/content/employers";
export function InquiryModal({
  candidate,
  isOpen,
  onClose,
}: {
  candidate: PublicCandidate | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  if (!candidate) return null;
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {EMPLOYER_COPY[lang].form.profile} #{candidate.id.slice(0, 8).toUpperCase()}
          </DialogTitle>
          <DialogDescription>{candidate.profession}</DialogDescription>
        </DialogHeader>
        <HiringRequestForm
          key={candidate.id}
          service={candidate.category}
          candidateId={candidate.id}
          candidateProfession={candidate.profession}
        />
      </DialogContent>
    </Dialog>
  );
}
