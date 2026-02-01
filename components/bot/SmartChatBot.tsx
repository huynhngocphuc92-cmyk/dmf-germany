"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  Loader2,
  Calendar,
  GraduationCap,
  Briefcase,
  Users,
  Mail,
  Phone,
  Building2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

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
    title: "DMF Assistent",
    online: "Online",
    placeholder: "Stellen Sie Ihre Frage...",
    send: "Senden",
    close: "Schließen",
    welcome:
      "Guten Tag! Ich bin der virtuelle Assistent von DMF Germany. Wie kann ich Ihnen helfen?",
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
      subtitle: "Wir melden uns bei Ihnen!",
      company: "Unternehmen",
      email: "E-Mail",
      phone: "Telefon (optional)",
      submit: "Absenden",
      success: "Vielen Dank! Wir melden uns in Kürze bei Ihnen.",
      interest: "Interesse an",
    },
  },
  en: {
    title: "DMF Assistant",
    online: "Online",
    placeholder: "Ask your question...",
    send: "Send",
    close: "Close",
    welcome: "Hello! I'm the virtual assistant of DMF Germany. How can I help you?",
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
      subtitle: "We'll get back to you!",
      company: "Company",
      email: "Email",
      phone: "Phone (optional)",
      submit: "Submit",
      success: "Thank you! We'll contact you soon.",
      interest: "Interested in",
    },
  },
  vn: {
    title: "Trợ lý DMF",
    online: "Trực tuyến",
    placeholder: "Đặt câu hỏi của bạn...",
    send: "Gửi",
    close: "Đóng",
    welcome: "Xin chào! Tôi là trợ lý ảo của DMF Germany. Tôi có thể giúp gì cho bạn?",
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
      subtitle: "Chúng tôi sẽ liên hệ bạn!",
      company: "Công ty",
      email: "Email",
      phone: "Điện thoại (tùy chọn)",
      submit: "Gửi",
      success: "Cảm ơn! Chúng tôi sẽ liên hệ bạn sớm.",
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

export const SmartChatBot = () => {
  const { lang } = useLanguage();
  const t = chatTranslations[lang] || chatTranslations.de;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [sessionId] = useState(() => `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`);

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
  ];

  // Fetch logo URL from database
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/logo");
        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logoUrl);
          setLogoError(false);
        }
      } catch (error) {
        console.error("[SmartChatBot] Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  // Reset logo error when logoUrl changes
  useEffect(() => {
    setLogoError(false);
  }, [logoUrl]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: t.welcome,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

      // Send notification that chat opened
      sendTelegramNotification(`🔔 **Neuer Chat gestartet**\nSession: ${sessionId}`);
    }
  }, [isOpen, messages.length, t.welcome, sessionId]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Detect lead capture intent
  const detectLeadIntent = useCallback((content: string): boolean => {
    const leadKeywords = [
      // German
      "termin",
      "beratung",
      "kontakt",
      "angebot",
      "preis",
      "kosten",
      "interessiert",
      "unternehmen",
      "firma",
      "mitarbeiter",
      // English
      "appointment",
      "consultation",
      "contact",
      "quote",
      "price",
      "cost",
      "interested",
      "company",
      "employee",
      "hire",
      // Vietnamese
      "tư vấn",
      "liên hệ",
      "báo giá",
      "chi phí",
      "quan tâm",
      "công ty",
    ];
    const lowerContent = content.toLowerCase();
    return leadKeywords.some((keyword) => lowerContent.includes(keyword));
  }, []);

  // Send Telegram notification
  const sendTelegramNotification = async (message: string) => {
    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      console.error("[SmartChatBot] Telegram notification error:", error);
    }
  };

  // Save chat to database
  const saveChatHistory = useCallback(
    async (newMessages: Message[]) => {
      try {
        await fetch("/api/chat/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: newMessages,
            leadData,
          }),
        });
      } catch (error) {
        console.error("[SmartChatBot] Save history error:", error);
      }
    },
    [sessionId, leadData]
  );

  // Send message to API
  const sendMessage = useCallback(
    async (messageText?: string) => {
      const message = (messageText || inputValue).trim();
      if (!message || isLoading) return;

      // Add user message
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputValue("");
      setIsLoading(true);

      try {
        // Prepare history (exclude welcome message)
        const history = messages
          .filter((m) => m.id !== "welcome")
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history,
            language: lang,
          }),
        });

        const data: ChatResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t.error);
        }

        // Add assistant message
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);

        // Save chat history
        saveChatHistory(finalMessages);

        // Check for lead intent and show form after a few messages
        if (messages.length >= 3 && !leadSubmitted && detectLeadIntent(message)) {
          setTimeout(() => {
            setLeadData({ interest: message });
            setShowLeadForm(true);
          }, 1500);
        }
      } catch (error) {
        console.error("[SmartChatBot] Error:", error);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: error instanceof Error ? error.message : t.error,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      inputValue,
      isLoading,
      messages,
      lang,
      t.error,
      leadSubmitted,
      detectLeadIntent,
      saveChatHistory,
    ]
  );

  // Handle quick action click
  const handleQuickAction = (action: QuickAction) => {
    if (action.id === "booking") {
      // Open Calendly directly
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      sendTelegramNotification(`📅 **Termin-Link geklickt**\nSession: ${sessionId}`);
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

    if (!leadData.email) return;

    try {
      // Send to Telegram
      await sendTelegramNotification(
        `🎯 **NEUER LEAD**\n\n` +
          `🏢 Unternehmen: ${leadData.company || "Nicht angegeben"}\n` +
          `📧 E-Mail: ${leadData.email}\n` +
          `📞 Telefon: ${leadData.phone || "Nicht angegeben"}\n` +
          `💡 Interesse: ${leadData.interest || "Allgemein"}\n` +
          `🆔 Session: ${sessionId}`
      );

      // Save lead to database
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadData,
          sessionId,
          source: "chatbot",
        }),
      });

      setLeadSubmitted(true);
      setShowLeadForm(false);

      // Add success message
      const successMessage: Message = {
        id: `lead-success-${Date.now()}`,
        role: "assistant",
        content: t.leadForm.success,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("[SmartChatBot] Lead submit error:", error);
    }
  };

  // Close chat
  const handleClose = () => {
    setIsOpen(false);
  };

  // Format message content with markdown-like styling
  const formatContent = (content: string) => {
    // Convert **bold** to <strong>
    let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Convert bullet points
    formatted = formatted.replace(/^- /gm, "• ");
    // Convert line breaks
    formatted = formatted.replace(/\n/g, "<br />");
    return formatted;
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-50",
              "w-12 h-12 md:w-14 md:h-14 rounded-full",
              "bg-primary text-primary-foreground",
              "shadow-lg shadow-primary/30",
              "flex items-center justify-center",
              "hover:shadow-xl hover:shadow-primary/40",
              "transition-all duration-300",
              "animate-pulse hover:animate-none",
              "bottom-4 right-4 md:bottom-6 md:right-6"
            )}
            aria-label="Chat öffnen"
          >
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
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
                    priority={true}
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
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs opacity-90 text-white">{t.online}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
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
                    <p
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
                    />
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
            {messages.length <= 2 && !isLoading && (
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
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
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
                  disabled={isLoading || !inputValue.trim()}
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
            onClick={() => setShowLeadForm(false)}
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
                    value={leadData.company || ""}
                    onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
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
                    required
                    value={leadData.email || ""}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
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
                    value={leadData.phone || ""}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLeadForm(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t.close}
                  </button>
                  <button
                    type="submit"
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
