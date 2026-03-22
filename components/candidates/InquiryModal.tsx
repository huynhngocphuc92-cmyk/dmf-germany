"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquiryFormSchema, type InquiryFormData } from "@/lib/validations/schemas";
import {
  X,
  MessageSquare,
  User,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
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

const INQUIRY_MODAL_COPY = {
  de: {
    title: "Anfrage senden",
    nameLabel: "Name *",
    namePlaceholder: "Ihr Name",
    emailLabel: "E-Mail *",
    emailPlaceholder: "ihre@email.de",
    phoneLabel: "Telefon",
    phonePlaceholder: "+49 30 1234567",
    messageLabel: "Nachricht *",
    messagePlaceholder: "Ihre Nachricht...",
    cancel: "Abbrechen",
    submit: "Senden",
    submitting: "Senden...",
    candidateMissing: "Kandidat-Informationen fehlen. Bitte versuchen Sie es erneut.",
    success: "Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.",
    submitError: "Fehler beim Senden. Bitte versuchen Sie es später erneut.",
    genericError: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
    defaultMessage: (profession: string) =>
      `Ich interessiere mich für das Profil dieses Kandidaten als ${profession}. Bitte senden Sie mir weitere Details.`,
  },
  en: {
    title: "Send Inquiry",
    nameLabel: "Name *",
    namePlaceholder: "Your name",
    emailLabel: "Email *",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+49 30 1234567",
    messageLabel: "Message *",
    messagePlaceholder: "Your message...",
    cancel: "Cancel",
    submit: "Send",
    submitting: "Sending...",
    candidateMissing: "Candidate information is missing. Please try again.",
    success: "Your inquiry was sent successfully. We will get back to you shortly.",
    submitError: "Unable to send your inquiry. Please try again later.",
    genericError: "An error occurred. Please try again later.",
    defaultMessage: (profession: string) =>
      `I am interested in this candidate profile for the ${profession} role. Please send me more details.`,
  },
  vn: {
    title: "Gửi yêu cầu",
    nameLabel: "Tên *",
    namePlaceholder: "Tên của bạn",
    emailLabel: "Email *",
    emailPlaceholder: "email@example.com",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "+49 30 1234567",
    messageLabel: "Tin nhắn *",
    messagePlaceholder: "Tin nhắn của bạn...",
    cancel: "Hủy",
    submit: "Gửi",
    submitting: "Đang gửi...",
    candidateMissing: "Thiếu thông tin ứng viên. Vui lòng thử lại.",
    success: "Yêu cầu đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm.",
    submitError: "Lỗi khi gửi. Vui lòng thử lại sau.",
    genericError: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    defaultMessage: (profession: string) =>
      `Tôi quan tâm đến hồ sơ của ứng viên ${profession} này. Vui lòng gửi chi tiết.`,
  },
} as const;

/**
 * Generate candidate code from ID
 */
const getCandidateCode = (id: string): string => {
  return id.slice(0, 8).toUpperCase();
};

export const InquiryModal = ({ candidate, isOpen, onClose }: InquiryModalProps) => {
  const { lang } = useLanguage();
  const locale = lang === "en" ? "en" : lang === "vn" ? "vn" : "de";
  const copy = INQUIRY_MODAL_COPY[locale];
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      privacy: false,
    },
  });

  // Auto-fill message when candidate changes
  useEffect(() => {
    if (candidate && candidate.profession && isOpen) {
      setValue("message", copy.defaultMessage(candidate.profession));
    }
  }, [candidate, copy, isOpen, setValue]);

  const candidateCode = candidate ? getCandidateCode(candidate.id) : "";

  const onSubmit = async (data: InquiryFormData) => {
    // Early validation - if no candidate, don't submit
    if (!candidate) {
      setStatus("error");
      setStatusMessage(copy.candidateMissing);
      return;
    }

    setStatus(null);
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          message: data.message,
          privacy: data.privacy,
          type: "profile",
          candidateId: candidate.id,
          candidateCode: candidateCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setStatusMessage(copy.success);
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          reset();
          setStatus(null);
          onClose();
        }, 2000);
      } else {
        setStatus("error");
        setStatusMessage(result.error || copy.submitError);
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus("error");
      setStatusMessage(copy.genericError);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setStatus(null);
      setStatusMessage("");
    }
  }, [isOpen, reset]);

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">{copy.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-semibold text-slate-900">{candidate.full_name}</span>
              {candidate.profession && (
                <span className="text-sm text-muted-foreground">{candidate.profession}</span>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Status Messages */}
          {status === "success" && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{statusMessage}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{statusMessage}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {copy.nameLabel}
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={copy.namePlaceholder}
              disabled={isSubmitting}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {copy.emailLabel}
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder={copy.emailPlaceholder}
              disabled={isSubmitting}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {copy.phoneLabel}
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder={copy.phonePlaceholder}
              disabled={isSubmitting}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {copy.messageLabel}
            </Label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder={copy.messagePlaceholder}
              rows={5}
              disabled={isSubmitting}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
          </div>

          <div className="space-y-2">
            <div
              className={`rounded-xl border p-4 ${
                errors.privacy ? "border-red-500 bg-red-50/40" : "border-slate-200 bg-slate-50"
              }`}
            >
              <label htmlFor="privacy" className="flex items-start gap-3 text-sm leading-6">
                <input
                  id="privacy"
                  type="checkbox"
                  {...register("privacy")}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <span className="text-slate-700">
                  {lang === "de" ? (
                    <>
                      Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                      <Link
                        href="/datenschutz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700"
                      >
                        Datenschutzerklärung
                      </Link>{" "}
                      zu. *
                    </>
                  ) : lang === "en" ? (
                    <>
                      I agree to the processing of my data in accordance with the{" "}
                      <Link
                        href="/datenschutz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700"
                      >
                        privacy policy
                      </Link>
                      . *
                    </>
                  ) : (
                    <>
                      Tôi đồng ý với việc xử lý dữ liệu của mình theo{" "}
                      <Link
                        href="/datenschutz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-700"
                      >
                        chính sách bảo mật
                      </Link>
                      . *
                    </>
                  )}
                </span>
              </label>
            </div>
            {errors.privacy && <p className="text-sm text-red-500">{errors.privacy.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {copy.cancel}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {copy.submitting}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {copy.submit}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
