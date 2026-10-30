"use client";
import { withDeadline } from "@/lib/requests/deadline";
import {
  boundMessages,
  RequestLane,
  HistoryWriter,
  postJson,
  isSavedLead,
  CHAT_DEADLINE_MS,
  LEAD_DEADLINE_MS,
} from "@/lib/chatbot/client-state";
import { currentRequestContext } from "@/lib/intake/context";
import { renderMessageContent } from "@/lib/chatbot/message-content";
import { useSubmissionKey } from "@/lib/intake/client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { BUSINESS_PHONE_ERROR_MESSAGE, isValidBusinessPhone } from "@/lib/validations/phone";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  GraduationCap,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// ============================================
// TYPES & INTERFACES
// ============================================

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  mode?: "guided";
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  error?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  message: string;
}

interface LeadData {
  company?: string;
  email?: string;
  phone?: string;
  interest?: string;
}

// ============================================
// TRANSLATIONS
// ============================================

const chatTranslations = {
  de: {
    title: "Automatischer Chatbot",
    guided: "Vorbereitete FAQ-Antworten",
    unavailable: "Antwort derzeit nicht verfügbar · bitte erneut versuchen",
    placeholder: "Stellen Sie Ihre Frage...",
    send: "Senden",
    close: "Schließen",
    welcome:
      "Guten Tag! Dies ist der automatische FAQ-Chatbot von DMF Talents mit vorbereiteten Antworten zu unseren Programmen, Kosten, Ablauf und Unterlagen. Eine Nachricht hier ist noch keine Kontaktanfrage. Nutzen Sie dafür das Anfrageformular.",
    error: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    rateLimit: "Zu viele Anfragen. Bitte warten Sie einen Moment.",
    quickActions: {
      booking: "Beratung buchen",
      ausbildung: "Ausbildung",
      studium: "Studium",
      fachkraefte: "Fachkräfte",
    },
    leadForm: {
      title: "Kontakt hinterlassen",
      subtitle: "Anfrage über das Formular senden",
      company: "Unternehmen",
      email: "E-Mail",
      phone: "Telefon (optional)",
      submit: "Absenden",
      success: "Vielen Dank! Ihre Anfrage wurde gespeichert.",
      interest: "Interesse an",
    },
  },
  en: {
    title: "Automated chatbot",
    guided: "Prepared FAQ answers",
    unavailable: "Response unavailable · please retry",
    placeholder: "Ask your question...",
    send: "Send",
    close: "Close",
    welcome:
      "Hello! This is the automated DMF Talents FAQ chatbot with prepared answers about our programmes, pricing, process and documents. A chat message is not a contact inquiry. Please use the inquiry form to submit one.",
    error: "An error occurred. Please try again.",
    rateLimit: "Too many requests. Please wait a moment.",
    quickActions: {
      booking: "Book Consultation",
      ausbildung: "Vocational Training",
      studium: "University",
      fachkraefte: "Skilled Workers",
    },
    leadForm: {
      title: "Leave your contact",
      subtitle: "Submit your inquiry using this form",
      company: "Company",
      email: "Email",
      phone: "Phone (optional)",
      submit: "Submit",
      success: "Thank you! Your inquiry has been saved.",
      interest: "Interested in",
    },
  },
  vn: {
    title: "Chatbot tự động",
    guided: "Trả lời theo chủ đề",
    unavailable: "Chưa thể trả lời · vui lòng thử lại",
    placeholder: "Đặt câu hỏi của bạn...",
    send: "Gửi",
    close: "Đóng",
    welcome:
      "Xin chào! Đây là chatbot tự động của DMF Talents với câu trả lời soạn sẵn về chương trình, chi phí, quy trình và hồ sơ. Tin nhắn chat chưa phải yêu cầu liên hệ. Hãy dùng biểu mẫu để gửi yêu cầu.",
    error: "Đã xảy ra lỗi. Vui lòng thử lại.",
    rateLimit: "Quá nhiều yêu cầu. Vui lòng đợi một chút.",
    quickActions: {
      booking: "Đặt lịch tư vấn",
      ausbildung: "Du học nghề",
      studium: "Đại học",
      fachkraefte: "Lao động",
    },
    leadForm: {
      title: "Để lại thông tin",
      subtitle: "Gửi yêu cầu qua biểu mẫu này",
      company: "Công ty",
      email: "Email",
      phone: "Điện thoại (tùy chọn)",
      submit: "Gửi",
      success: "Cảm ơn! Yêu cầu của bạn đã được lưu.",
      interest: "Quan tâm đến",
    },
  },
};

// Calendly URL
const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/contact-dmf/30min";

// ============================================
// COMPONENT
// ============================================

export interface SmartChatBotProps {
  open?: boolean;
  onClose?: () => void;
}

export const SmartChatBot = ({ open, onClose }: SmartChatBotProps = {}) => {
  const { lang } = useLanguage();
  const t = chatTranslations[lang] || chatTranslations.de;

  const [internalOpen, setIsOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMode, setResponseMode] = useState<"guided" | "unavailable">("guided");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const { forPayload: submissionKey, reset: resetSubmissionKey } = useSubmissionKey();
  const leadAttemptRef = useRef<{ signature: string; payload: Record<string, unknown> } | null>(
    null
  );
  const [isLeadSaving, setIsLeadSaving] = useState(false);
  const [leadFormError, setLeadFormError] = useState<string | null>(null);
  const [sessionId] = useState(() => `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const [chatError, setChatError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [leadCooldownUntil, setLeadCooldownUntil] = useState(0);
  const chatLane = useRef(new RequestLane());
  const leadLane = useRef(new RequestLane());
  const historyRef = useRef<HistoryWriter<Message[]> | null>(null);
  const languageRef = useRef(lang);
  const openRef = useRef(isOpen);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Quick action buttons
  const quickActions: QuickAction[] = [
    {
      id: "booking",
      label: t.quickActions.booking,
      icon: <Calendar className="w-3.5 h-3.5" />,
      message:
        lang === "de"
          ? "Ich möchte einen Beratungstermin vereinbaren."
          : lang === "vn"
            ? "Tôi muốn đặt lịch tư vấn."
            : "I would like to book a consultation.",
    },
    {
      id: "ausbildung",
      label: t.quickActions.ausbildung,
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      message:
        lang === "de"
          ? "Erzählen Sie mir mehr über das Ausbildungsprogramm."
          : lang === "vn"
            ? "Hãy cho tôi biết thêm về chương trình Du học nghề."
            : "Tell me more about the Vocational Training program.",
    },
    {
      id: "studium",
      label: t.quickActions.studium,
      icon: <Users className="w-3.5 h-3.5" />,
      message:
        lang === "de"
          ? "Wie funktioniert das Studienprogramm?"
          : lang === "vn"
            ? "Chương trình Đại học hoạt động như thế nào?"
            : "How does the University program work?",
    },
    {
      id: "fachkraefte",
      label: t.quickActions.fachkraefte,
      icon: <Briefcase className="w-3.5 h-3.5" />,
      message:
        lang === "de"
          ? "Ich suche Fachkräfte für mein Unternehmen."
          : lang === "vn"
            ? "Tôi đang tìm kiếm lao động có tay nghề cho công ty."
            : "I'm looking for skilled workers for my company.",
    },
    ...[
      {
        id: "pricing",
        labels: ["Kosten", "Pricing", "Chi phí"],
        messages: ["Welche Kosten entstehen?", "What are the costs?", "Chi phí bao nhiêu?"],
      },
      {
        id: "process",
        labels: ["Ablauf", "Process", "Quy trình"],
        messages: ["Wie ist der Ablauf?", "What is the process?", "Quy trình thế nào?"],
      },
      {
        id: "documents",
        labels: ["Unterlagen", "Documents", "Hồ sơ"],
        messages: [
          "Welche Unterlagen brauche ich?",
          "Which documents do I need?",
          "Cần giấy tờ gì?",
        ],
      },
    ].map((action) => ({
      id: action.id,
      label: action.labels[lang === "de" ? 0 : lang === "vn" ? 2 : 1],
      message: action.messages[lang === "de" ? 0 : lang === "vn" ? 2 : 1],
      icon: <MessageCircle className="w-3.5 h-3.5" />,
    })),
    {
      id: "contact",
      label: lang === "de" ? "Kontakt aufnehmen" : lang === "vn" ? "Để lại liên hệ" : "Contact us",
      icon: <Mail className="w-3.5 h-3.5" />,
      message:
        lang === "de"
          ? "Ich möchte eine Kontaktanfrage stellen."
          : lang === "vn"
            ? "Tôi muốn để lại thông tin liên hệ."
            : "I would like to submit a contact request.",
    },
  ];

  // Auxiliary data is requested only after the user opens the widget.
  useEffect(() => {
    if (!isOpen || logoUrl) return;
    const controller = new AbortController();
    void withDeadline(
      async (signal) => {
        const response = await fetch("/api/logo", { signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!signal.aborted && typeof data.logoUrl === "string") setLogoUrl(data.logoUrl);
      },
      8000,
      controller
    ).catch(() => {});
    return () => controller.abort();
  }, [isOpen, logoUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    if (!messagesRef.current.length) {
      messagesRef.current = [
        { id: "welcome", role: "assistant", content: t.welcome, timestamp: new Date() },
      ];
      setMessages(messagesRef.current);
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [isOpen, t.welcome]);

  // Host visibility/language changes invalidate in-flight work before paint.
  // Resetting the corresponding UI here reflects that external lifecycle boundary.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    languageRef.current = lang;
    openRef.current = isOpen;
    const chatRequests = chatLane.current;
    const leadRequests = leadLane.current;
    chatRequests.cancel();
    leadRequests.cancel();
    setIsLoading(false);
    setIsLeadSaving(false);
    setChatError(null);
    setLeadFormError(null);
    if (!isOpen) setShowLeadForm(false);
    return () => {
      chatRequests.cancel();
      leadRequests.cancel();
    };
  }, [isOpen, lang, chatLane, leadLane]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const writer = new HistoryWriter<Message[]>(async (snapshot, signal) => {
      const { response } = await postJson(
        "/api/chat/history",
        {
          sessionId,
          messages: boundMessages(snapshot),
        },
        signal
      );
      if (!response.ok) throw new Error("History unavailable");
    });
    historyRef.current = writer;
    return () => writer.stop();
  }, [sessionId]);

  useEffect(() => {
    const deadlines = [cooldownUntil, leadCooldownUntil].filter((until) => until > Date.now());
    const until = deadlines.length ? Math.min(...deadlines) : 0;
    if (!until) return;
    const timer = setTimeout(
      () => {
        if (Date.now() >= cooldownUntil) setCooldownUntil(0);
        if (Date.now() >= leadCooldownUntil) setLeadCooldownUntil(0);
      },
      Math.min(Math.max(0, until - Date.now()), 2147483647)
    );
    return () => clearTimeout(timer);
  }, [cooldownUntil, leadCooldownUntil]);

  const sendMessage = useCallback(
    async (messageText?: string) => {
      const message = (messageText || inputValue).trim().slice(0, 2000);
      if (!message || !openRef.current) return;
      const controller = chatLane.current.begin();
      if (!controller) return;
      const language = lang;
      const current = () =>
        chatLane.current.isCurrent(controller) &&
        openRef.current &&
        languageRef.current === language;
      // Keep both typed and quick-action questions available for a manual retry.
      setInputValue(message);
      setChatError(null);
      setIsLoading(true);
      try {
        const { response, data } = await withDeadline(
          (signal) => postJson<ChatResponse>("/api/chat", { message, language }, signal),
          CHAT_DEADLINE_MS,
          controller
        );
        if (!current()) return;
        if (response.status === 429) {
          setCooldownUntil(chatLane.current.coolDown(response.headers.get("Retry-After")));
          setChatError(t.rateLimit);
          setResponseMode("unavailable");
          return;
        }
        if (
          !response.ok ||
          data?.mode !== "guided" ||
          typeof data.message !== "string" ||
          !data.message.trim()
        )
          throw new Error("Invalid FAQ response");
        const finalMessages = boundMessages([
          ...messagesRef.current,
          {
            id: `user-${crypto.randomUUID()}`,
            role: "user" as const,
            content: message,
            timestamp: new Date(),
          },
          {
            id: `assistant-${crypto.randomUUID()}`,
            role: "assistant" as const,
            content: data.message,
            timestamp: new Date(),
          },
        ]);
        messagesRef.current = finalMessages;
        setMessages(finalMessages);
        setInputValue("");
        setResponseMode("guided");
        historyRef.current?.enqueue(finalMessages);
      } catch {
        if (
          chatLane.current.owns(controller) &&
          openRef.current &&
          languageRef.current === language
        ) {
          setResponseMode("unavailable");
          setChatError(t.error);
        }
      } finally {
        if (chatLane.current.owns(controller)) {
          chatLane.current.finish(controller);
          setIsLoading(false);
        }
      }
    },
    [inputValue, lang, t.error, t.rateLimit, chatLane]
  );

  const openLeadForm = () => {
    if (!openRef.current) return;
    const latestQuestion = messages.filter((item) => item.role === "user").slice(-1)[0]?.content;
    setLeadData((previous) => ({ ...previous, interest: latestQuestion || previous.interest }));
    setShowLeadForm(true);
  };

  // Handle quick action click
  const handleQuickAction = (action: QuickAction) => {
    if (action.id === "booking") {
      // Open Calendly directly
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
    } else if (action.id === "contact") {
      openLeadForm();
    } else {
      sendMessage(action.message);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // Handle keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle lead form submit
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadData.email || !openRef.current) return;

    if (leadData.phone && !isValidBusinessPhone(leadData.phone)) {
      setLeadFormError(
        lang === "de"
          ? BUSINESS_PHONE_ERROR_MESSAGE
          : lang === "en"
            ? "Please enter a valid phone number in the format +49 30 1234567 or 030 1234567."
            : "Vui lòng nhập số điện thoại hợp lệ theo định dạng +49 30 1234567 hoặc 030 1234567."
      );
      return;
    }

    const controller = leadLane.current.begin();
    if (!controller) return;
    const language = lang;
    const current = () =>
      leadLane.current.isCurrent(controller) && openRef.current && languageRef.current === language;
    setLeadFormError(null);
    setIsLeadSaving(true);

    try {
      const signature = JSON.stringify(leadData);
      if (leadAttemptRef.current?.signature !== signature) {
        leadAttemptRef.current = {
          signature,
          payload: {
            ...leadData,
            sessionId,
            source: "chatbot",
            ...currentRequestContext(window.location.href),
          },
        };
      }
      const intakePayload = leadAttemptRef.current.payload;
      const { response: leadsResponse, data: result } = await withDeadline(
        (signal) =>
          postJson<{
            success?: boolean;
            saved?: boolean;
          }>("/api/leads", intakePayload, signal, {
            "Idempotency-Key": submissionKey(intakePayload),
          }),
        LEAD_DEADLINE_MS,
        controller
      );
      if (!current()) return;
      if (leadsResponse.status === 429) {
        setLeadCooldownUntil(leadLane.current.coolDown(leadsResponse.headers.get("Retry-After")));
        setLeadFormError(t.rateLimit);
        return;
      }
      if (!isSavedLead(leadsResponse, result)) throw new Error("Lead not saved");

      resetSubmissionKey();
      leadAttemptRef.current = null;
      setShowLeadForm(false);

      // Add success message
      const successMessage: Message = {
        id: `lead-success-${Date.now()}`,
        role: "assistant",
        content: t.leadForm.success,
        timestamp: new Date(),
      };
      messagesRef.current = boundMessages([...messagesRef.current, successMessage]);
      setMessages(messagesRef.current);
    } catch {
      if (leadLane.current.owns(controller) && openRef.current && languageRef.current === language)
        setLeadFormError(t.error);
    } finally {
      if (leadLane.current.owns(controller)) {
        leadLane.current.finish(controller);
        setIsLeadSaving(false);
      }
    }
  };

  const closeLeadForm = () => {
    leadLane.current.cancel();
    setIsLeadSaving(false);
    setLeadFormError(null);
    setShowLeadForm(false);
  };

  const handleClose = () => {
    openRef.current = false;
    chatLane.current.cancel();
    leadLane.current.cancel();
    // Let the serialized history write settle on close; unmount still cancels it.
    setIsLoading(false);
    setIsLeadSaving(false);
    setShowLeadForm(false);
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {open === undefined && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
            }}
            className={cn(
              "fixed z-[100] group",
              "bottom-18 right-4 md:bottom-8 md:right-8",
              "w-14 h-14 md:w-16 md:h-16 rounded-full",
              "bg-gradient-to-br from-primary via-blue-500 to-indigo-500",
              "text-white shadow-[0_8px_30px_rgba(59,130,246,0.4)]",
              "hover:shadow-[0_8px_40px_rgba(59,130,246,0.7)]",
              "active:scale-95",
              "transition-all duration-300 ease-out border border-white/20",
              "flex items-center justify-center"
            )}
            aria-label={lang === "de" ? "Chat öffnen" : lang === "vn" ? "Mở chat" : "Open chat"}
          >
            {/* Glowing inner rings */}
            <div
              className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100"
              style={{ animationDuration: "2s" }}
            />
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50",
              "bg-white shadow-2xl",
              "flex flex-col",
              "overflow-hidden",
              "border border-gray-200",
              "bottom-0 left-0 right-0 top-0 rounded-none",
              "w-full h-full",
              "md:bottom-6 md:right-6 md:left-auto md:top-auto",
              "md:w-[420px] md:h-[600px]",
              "md:rounded-xl"
            )}
            ref={chatContainerRef}
            role="dialog"
            aria-label={t.title}
            onKeyDown={(event) => {
              if (event.key === "Escape") handleClose();
            }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center flex-shrink-0 h-10 w-10">
                  <Image
                    src={logoUrl || "/logo.png"}
                    alt="DMF Logo"
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full shadow-sm object-contain"
                    style={{
                      maxWidth: "40px",
                      maxHeight: "40px",
                      objectFit: "contain",
                    }}
                    quality={90}
                    unoptimized={logoUrl?.startsWith("http") || false}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".logo-fallback")) {
                        const fallback = document.createElement("span");
                        fallback.className =
                          "logo-fallback text-white font-bold text-sm absolute inset-0 flex items-center justify-center";
                        fallback.textContent = "DMF";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">{t.title}</h3>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "w-2 h-2 shrink-0 rounded-full",
                        responseMode === "unavailable" ? "bg-amber-300" : "bg-green-400"
                      )}
                    />
                    <span role="status" className="text-xs opacity-90 text-white">
                      {t[responseMode]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={openLeadForm}
                  title={t.leadForm.title}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {lang === "de" ? "Kontakt" : lang === "vn" ? "Liên hệ" : "Contact"}
                  </span>
                </button>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={t.close}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50"
              style={{ maxHeight: "calc(100% - 180px)" }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mr-2 shadow-sm border border-gray-200 overflow-hidden">
                      {logoError ? (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      ) : (
                        <Image
                          src={logoUrl || "/logo.png"}
                          alt="Bot"
                          width={24}
                          height={24}
                          className="rounded-full object-contain"
                          unoptimized={logoUrl?.startsWith("http") || false}
                          onError={() => setLogoError(true)}
                        />
                      )}
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {renderMessageContent(message.content)}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 mr-2 shadow-sm border border-gray-200 overflow-hidden">
                    {logoError ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    ) : (
                      <Image
                        src={logoUrl || "/logo.png"}
                        alt="Bot"
                        width={24}
                        height={24}
                        className="rounded-full object-contain"
                        unoptimized={logoUrl?.startsWith("http") || false}
                        onError={() => setLogoError(true)}
                      />
                    )}
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {!isLoading && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5",
                        "bg-white border border-gray-200 rounded-full",
                        "text-xs font-medium text-gray-700",
                        "hover:bg-primary/5 hover:border-primary/30 hover:text-primary",
                        "transition-colors"
                      )}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-200 px-4 py-3 bg-white flex-shrink-0"
            >
              {chatError && (
                <div role="alert" className="mb-2 text-sm text-amber-800">
                  {chatError}{" "}
                  <button
                    type="button"
                    className="underline"
                    disabled={isLoading || cooldownUntil !== 0}
                    onClick={() => void sendMessage()}
                  >
                    {lang === "de" ? "Erneut versuchen" : lang === "vn" ? "Thử lại" : "Retry"}
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={2000}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label={t.placeholder}
                />
                <button
                  type="submit"
                  disabled={isLoading || cooldownUntil !== 0 || !inputValue.trim()}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isLoading || !inputValue.trim()
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  aria-label={t.send}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Capture Modal */}
      <AnimatePresence>
        {showLeadForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={closeLeadForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t.leadForm.title}</h3>
                <p className="text-sm text-gray-600">{t.leadForm.subtitle}</p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    {t.leadForm.company}
                  </label>
                  <input
                    type="text"
                    maxLength={500}
                    value={leadData.company || ""}
                    onChange={(e) => {
                      setLeadFormError(null);
                      setLeadData({ ...leadData, company: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    {t.leadForm.email} *
                  </label>
                  <input
                    type="email"
                    maxLength={320}
                    required
                    value={leadData.email || ""}
                    onChange={(e) => {
                      setLeadFormError(null);
                      setLeadData({ ...leadData, email: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {t.leadForm.phone}
                  </label>
                  <input
                    type="tel"
                    maxLength={50}
                    value={leadData.phone || ""}
                    placeholder="+49 30 1234567"
                    onChange={(e) => {
                      setLeadFormError(null);
                      setLeadData({ ...leadData, phone: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {leadFormError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {leadFormError}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeLeadForm}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t.close}
                  </button>
                  <button
                    type="submit"
                    disabled={isLeadSaving || leadCooldownUntil !== 0}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t.leadForm.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop (on mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};
