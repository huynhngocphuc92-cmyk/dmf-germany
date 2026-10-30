"use client";

import { useEffect, useState } from "react";
import type { InquiryModal } from "@/components/candidates/InquiryModal";
import type { PublicCandidate } from "@/lib/candidates/public-profile";
import { withDeadline } from "@/lib/requests/deadline";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Mounted only after explicit profile intent; failures stay inside this dialog. */
export function DeferredInquiryModal({
  candidate,
  onClose,
}: {
  candidate: PublicCandidate;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const [Modal, setModal] = useState<typeof InquiryModal | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void withDeadline(() => import("@/components/candidates/InquiryModal"), 15000, controller)
      .then((module) => {
        if (!controller.signal.aborted) setModal(() => module.InquiryModal);
      })
      .catch(() => {
        if (!controller.signal.aborted || controller.signal.reason?.name === "TimeoutError")
          setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);

  if (Modal) return <Modal candidate={candidate} isOpen onClose={onClose} />;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent onCloseAutoFocus={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {lang === "de" ? "Anfrage senden" : lang === "en" ? "Send Inquiry" : "Gửi yêu cầu"}
          </DialogTitle>
          <DialogDescription role={failed ? "alert" : "status"}>
            {failed
              ? lang === "de"
                ? "Das Formular konnte nicht geladen werden. Bitte erneut versuchen."
                : lang === "en"
                  ? "The form could not load. Please try again."
                  : "Không thể tải biểu mẫu. Vui lòng thử lại."
              : lang === "de"
                ? "Formular wird geladen…"
                : lang === "en"
                  ? "Loading form…"
                  : "Đang tải biểu mẫu…"}
          </DialogDescription>
        </DialogHeader>
        <div>
          {failed && (
            <Button
              onClick={() => {
                setFailed(false);
                setAttempt((value) => value + 1);
              }}
            >
              {lang === "de" ? "Erneut versuchen" : lang === "en" ? "Try again" : "Thử lại"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
