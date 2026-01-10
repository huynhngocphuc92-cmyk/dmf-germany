"use client";

import { X, MessageCircle, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/app/admin/candidates/types";
import Link from "next/link";

interface InquiryModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Generate candidate code from ID
 */
const getCandidateCode = (id: string): string => {
  return id.slice(0, 8).toUpperCase();
};

export const InquiryModal = ({ candidate, isOpen, onClose }: InquiryModalProps) => {
  if (!candidate) return null;

  const candidateCode = getCandidateCode(candidate.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Profil anfragen
          </DialogTitle>
          <DialogDescription>
            Kandidat #{candidateCode}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Vui lòng liên hệ qua Zalo/Email để nhận hồ sơ chi tiết của Ứng viên <strong>#{candidateCode}</strong>.
          </p>

          <div className="space-y-2">
            <Link href="/#contact" onClick={onClose}>
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4" />
                Kontaktformular öffnen
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                // Scroll to chat bot if available
                const chatBot = document.querySelector('[data-chatbot]');
                if (chatBot) {
                  (chatBot as HTMLElement).click();
                }
                onClose();
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Chat Bot öffnen
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
