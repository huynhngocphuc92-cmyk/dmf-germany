"use client";

import { useState, useEffect } from "react";
import { X, MessageSquare, User, Mail, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Candidate } from "@/app/admin/candidates/types";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface InquiryModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/**
 * Generate candidate code from ID
 */
const getCandidateCode = (id: string): string => {
  return id.slice(0, 8).toUpperCase();
};

export const InquiryModal = ({ candidate, isOpen, onClose }: InquiryModalProps) => {
  // ============================================
  // HOOKS - MUST BE CALLED AT TOP LEVEL
  // ============================================
  const { lang } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Auto-fill message when candidate changes
  useEffect(() => {
    if (candidate && candidate.profession && isOpen) {
      const defaultMessage = lang === "de"
        ? `Ich interessiere mich für das Profil dieses Kandidaten als ${candidate.profession}. Bitte senden Sie mir weitere Details.`
        : `Tôi quan tâm đến hồ sơ của ứng viên ${candidate.profession} này. Vui lòng gửi chi tiết.`;
      setFormData(prev => ({ ...prev, message: defaultMessage }));
    }
  }, [candidate, isOpen, lang]);

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const candidateCode = candidate ? getCandidateCode(candidate.id) : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear status when user starts typing
    if (status) {
      setStatus(null);
      setStatusMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Early validation - if no candidate, don't submit
    if (!candidate) {
      setStatus("error");
      setStatusMessage(
        lang === "de"
          ? "Kandidat-Informationen fehlen. Bitte versuchen Sie es erneut."
          : "Thiếu thông tin ứng viên. Vui lòng thử lại."
      );
      return;
    }

    // Reset status
    setStatus(null);
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          message: formData.message,
          type: "profile",
          candidateId: candidate.id,
          candidateCode: candidateCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setStatusMessage(
          lang === "de"
            ? "Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen."
            : "Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm."
        );
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
          });
          setStatus(null);
          onClose();
        }, 2000);
      } else {
        setStatus("error");
        setStatusMessage(
          result.error ||
            (lang === "de"
              ? "Fehler beim Senden der Anfrage. Bitte versuchen Sie es später erneut."
              : "Lỗi khi gửi yêu cầu. Vui lòng thử lại sau.")
        );
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus("error");
      setStatusMessage(
        lang === "de"
          ? "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut."
          : "Lỗi mạng. Vui lòng kiểm tra kết nối và thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setStatus(null);
      setStatusMessage("");
      onClose();
    }
  };

  // ============================================
  // RENDER - No early returns, Dialog always renders
  // ============================================
  // Dialog component handles visibility via 'open' prop
  // We only render content if candidate exists
  return (
    <Dialog open={isOpen && !!candidate} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {candidate ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                {lang === "de"
                  ? `Anfrage für Kandidat #${candidateCode}`
                  : `Yêu cầu cho ứng viên #${candidateCode}`}
              </DialogTitle>
              <DialogDescription>
                {candidate.profession && (
                  <span className="text-sm text-muted-foreground">
                    {candidate.profession}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {lang === "de" ? "Name *" : "Tên *"}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={lang === "de" ? "Ihr Name" : "Tên của bạn"}
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {lang === "de" ? "E-Mail *" : "Email *"}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={lang === "de" ? "ihre@email.de" : "email@example.com"}
                  required
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {lang === "de" ? "Telefon" : "Số điện thoại"}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={lang === "de" ? "+49 123 456789" : "+84 90 123 4567"}
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {lang === "de" ? "Nachricht *" : "Tin nhắn *"}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    lang === "de"
                      ? "Ihre Nachricht..."
                      : "Tin nhắn của bạn..."
                  }
                  rows={4}
                  required
                  disabled={isSubmitting}
                  className="w-full resize-none"
                />
              </div>

              {/* Status Message */}
              {status && (
                <div
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    status === "success"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  {status === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p
                    className={`text-sm ${
                      status === "success" ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {statusMessage}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {lang === "de" ? "Abbrechen" : "Hủy"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {lang === "de" ? "Wird gesendet..." : "Đang gửi..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {lang === "de" ? "Anfrage senden" : "Gửi yêu cầu"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            {lang === "de" ? "Kandidat nicht gefunden" : "Không tìm thấy ứng viên"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
