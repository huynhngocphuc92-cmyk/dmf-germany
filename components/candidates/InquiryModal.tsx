"use client";

import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquiryFormSchema, type InquiryFormData } from '@/lib/validations/schemas';
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

/**
 * Generate candidate code from ID
 */
const getCandidateCode = (id: string): string => {
  return id.slice(0, 8).toUpperCase();
};

export const InquiryModal = ({ candidate, isOpen, onClose }: InquiryModalProps) => {
  const { lang } = useLanguage();
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    }
  });

  // Auto-fill message when candidate changes
  useEffect(() => {
    if (candidate && candidate.profession && isOpen) {
      const defaultMessage = lang === "de"
        ? `Ich interessiere mich für das Profil dieses Kandidaten als ${candidate.profession}. Bitte senden Sie mir weitere Details.`
        : `Tôi quan tâm đến hồ sơ của ứng viên ${candidate.profession} này. Vui lòng gửi chi tiết.`;
      setValue('message', defaultMessage);
    }
  }, [candidate, isOpen, lang, setValue]);

  const candidateCode = candidate ? getCandidateCode(candidate.id) : "";

  const onSubmit = async (data: InquiryFormData) => {
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
          reset();
          setStatus(null);
          onClose();
        }, 2000);
      } else {
        setStatus("error");
        setStatusMessage(
          result.error ||
          (lang === "de"
            ? "Fehler beim Senden. Bitte versuchen Sie es später erneut."
            : "Lỗi khi gửi. Vui lòng thử lại sau.")
        );
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setStatus("error");
      setStatusMessage(
        lang === "de"
          ? "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
          : "Đã xảy ra lỗi. Vui lòng thử lại sau."
      );
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
            <DialogTitle className="text-xl font-bold">
              {lang === "de" ? "Anfrage senden" : "Gửi yêu cầu"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-semibold text-slate-900">
                {candidate.full_name}
              </span>
              {candidate.profession && (
                <span className="text-sm text-muted-foreground">
                  {candidate.profession}
                </span>
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
              {lang === "de" ? "Name *" : "Tên *"}
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={lang === "de" ? "Ihr Name" : "Tên của bạn"}
              disabled={isSubmitting}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {lang === "de" ? "E-Mail *" : "Email *"}
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder={lang === "de" ? "ihre@email.de" : "email@example.com"}
              disabled={isSubmitting}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {lang === "de" ? "Telefon" : "Số điện thoại"}
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder={lang === "de" ? "+49 123 456789" : "+84 90 123 4567"}
              disabled={isSubmitting}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {lang === "de" ? "Nachricht *" : "Tin nhắn *"}
            </Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder={
                lang === "de"
                  ? "Ihre Nachricht..."
                  : "Tin nhắn của bạn..."
              }
              rows={5}
              disabled={isSubmitting}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
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
              {lang === "de" ? "Abbrechen" : "Hủy"}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {lang === "de" ? "Senden..." : "Đang gửi..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {lang === "de" ? "Senden" : "Gửi"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
