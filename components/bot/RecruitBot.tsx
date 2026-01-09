"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Bookmark, BookmarkCheck, Calendar, Mail, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ============================================
// TYPES & INTERFACES
// ============================================

interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  options?: Option[];
  candidate?: Candidate;
}

interface Option {
  id: string;
  label: string;
  emoji: string;
  category: Category;
}

interface Candidate {
  id: string;
  name: string;
  category: Category;
  jobTitle: string;
  experienceYears: number;
  germanLevel: "A2" | "B1" | "B2" | "C1";
  skills: string[];
  avatar?: string;
}

type Category = "pflege" | "it" | "hotel" | "handwerk";
type TabType = "chat" | "merkliste";

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatExperience = (candidate: Candidate): string => {
  return `${candidate.jobTitle} • ${candidate.experienceYears} Jahre`;
};

const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[parts.length - 2][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "C1":
      return "bg-green-100 text-green-700 border-green-300";
    case "B2":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "B1":
      return "bg-amber-100 text-amber-700 border-amber-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// ============================================
// MOCK DATA (Temporary - Will be replaced by real API)
// ============================================

const mockCandidates: Record<Category, Candidate[]> = {
  pflege: [
    {
      id: "p1",
      name: "Nguyen Van A",
      category: "pflege",
      jobTitle: "Krankenschwester",
      experienceYears: 5,
      germanLevel: "B2",
      skills: ["Intensivpflege", "Altenpflege", "Krankenhaus"],
    },
    {
      id: "p2",
      name: "Tran Thi B",
      category: "pflege",
      jobTitle: "Kinderkrankenpflegerin",
      experienceYears: 3,
      germanLevel: "B1",
      skills: ["Pädiatrie", "Notfallpflege"],
    },
    {
      id: "p3",
      name: "Le Van C",
      category: "pflege",
      jobTitle: "Pflegedienstleitung",
      experienceYears: 7,
      germanLevel: "C1",
      skills: ["Pflegemanagement", "Schulung"],
    },
  ],
  it: [
    {
      id: "i1",
      name: "Pham Van D",
      category: "it",
      jobTitle: "Software Engineer",
      experienceYears: 4,
      germanLevel: "B2",
      skills: ["Java", "React", "Node.js"],
    },
    {
      id: "i2",
      name: "Hoang Thi E",
      category: "it",
      jobTitle: "Fullstack Developer",
      experienceYears: 6,
      germanLevel: "B2",
      skills: ["TypeScript", "Python", "AWS"],
    },
    {
      id: "i3",
      name: "Vu Van F",
      category: "it",
      jobTitle: "DevOps Engineer",
      experienceYears: 5,
      germanLevel: "B1",
      skills: ["Docker", "Kubernetes", "CI/CD"],
    },
  ],
  hotel: [
    {
      id: "h1",
      name: "Nguyen Thi G",
      category: "hotel",
      jobTitle: "Rezeptionistin",
      experienceYears: 3,
      germanLevel: "B2",
      skills: ["Gästebetreuung", "Reservierung", "Rezeption"],
    },
    {
      id: "h2",
      name: "Tran Van H",
      category: "hotel",
      jobTitle: "Koch",
      experienceYears: 4,
      germanLevel: "B1",
      skills: ["Deutsche Küche", "Asiatische Küche"],
    },
    {
      id: "h3",
      name: "Le Thi I",
      category: "hotel",
      jobTitle: "Servicekraft",
      experienceYears: 5,
      germanLevel: "B2",
      skills: ["Fine Dining", "Event-Service"],
    },
  ],
  handwerk: [
    {
      id: "w1",
      name: "Pham Van J",
      category: "handwerk",
      jobTitle: "Elektriker",
      experienceYears: 6,
      germanLevel: "B1",
      skills: ["Installation", "Wartung", "Reparatur"],
    },
    {
      id: "w2",
      name: "Nguyen Van K",
      category: "handwerk",
      jobTitle: "Schreiner",
      experienceYears: 8,
      germanLevel: "B2",
      skills: ["Möbelbau", "Innenausbau"],
    },
    {
      id: "w3",
      name: "Tran Van L",
      category: "handwerk",
      jobTitle: "Heizungsbauer",
      experienceYears: 5,
      germanLevel: "B1",
      skills: ["Heizung", "Sanitär", "Installation"],
    },
  ],
};

const categoryOptions: Option[] = [
  { id: "pflege", label: "Pflege & Medizin", emoji: "🏥", category: "pflege" },
  { id: "it", label: "IT & Software", emoji: "💻", category: "it" },
  { id: "hotel", label: "Hotel & Gastro", emoji: "🏨", category: "hotel" },
  { id: "handwerk", label: "Handwerk & Bau", emoji: "🏗️", category: "handwerk" },
];

// Calendly URL
// TODO: Set NEXT_PUBLIC_CALENDLY_URL in .env.local to override this default
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/contact-dmf/30min";

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Send Telegram notification
 */
async function sendTelegramNotification(message: string): Promise<void> {
  try {
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.error("[Telegram] Error sending notification:", error);
    // Silent fail - don't break the flow if Telegram is not configured
  }
}

/**
 * Fetch candidates from API (TODO: Connect to Real Database)
 */
async function fetchCandidates(sector: Category): Promise<Candidate[]> {
  // TODO: Replace with real API call
  // const response = await fetch(`/api/candidates?sector=${sector}`);
  // return response.json();
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCandidates[sector] || [];
}

// ============================================
// COMPONENT
// ============================================

export const RecruitBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [cart, setCart] = useState<Candidate[]>([]);
  const [email, setEmail] = useState<string>("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailFormCandidate, setEmailFormCandidate] = useState<Candidate | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch logo URL from database (same as Header)
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/logo");
        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logoUrl);
        }
      } catch (error) {
        console.error("[RecruitBot] Error fetching logo:", error);
        // Silent fail - Logo component will use /logo.png fallback
      }
    };
    fetchLogo();
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send Telegram notification when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      sendTelegramNotification(
        `🔔 <b>Neuer Besucher im RecruitBot</b>\n\nEin Nutzer hat den Chat-Assistenten geöffnet.`
      );
    }
  }, [isOpen]);

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && activeTab === "chat") {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "bot",
        content: "Guten Tag! Suchen Sie qualifizierte Fachkräfte aus Vietnam? Für welchen Bereich?",
        timestamp: new Date(),
        options: categoryOptions,
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, activeTab]);

  // Handle option selection
  const handleOptionClick = async (option: Option) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: `${option.emoji} ${option.label}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send Telegram notification
    sendTelegramNotification(
      `💼 <b>Neue Anfrage</b>\n\nBereich: ${option.emoji} ${option.label}`
    );

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsTyping(false);

    const candidates = mockCandidates[option.category];
    const count = candidates.length;

    const botResponse: Message = {
      id: `bot-${Date.now()}`,
      type: "bot",
      content: `Ich habe ${count} passende Kandidaten gefunden. Hier sind die Top-Profile:`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botResponse]);

    const topCandidates = candidates.slice(0, 3);
    setTimeout(() => {
      topCandidates.forEach((candidate, index) => {
        setTimeout(() => {
          const candidateMessage: Message = {
            id: `candidate-${candidate.id}-${Date.now()}-${index}`,
            type: "bot",
            content: "candidate",
            timestamp: new Date(),
            candidate: candidate,
          };
          setMessages((prev) => [...prev, candidateMessage]);
        }, index * 300);
      });

      // Add booking option after candidates
      setTimeout(() => {
        const bookingMessage: Message = {
          id: `booking-${Date.now()}`,
          type: "bot",
          content: "Möchten Sie einen persönlichen Beratungstermin vereinbaren?",
          timestamp: new Date(),
          options: [
            { id: "book", label: "Termin buchen", emoji: "📅", category: option.category },
          ],
        };
        setMessages((prev) => [...prev, bookingMessage]);
      }, topCandidates.length * 300 + 500);
    }, 500);
  };

  // Handle booking option
  const handleBookingClick = async () => {
    // Add user message
    const userBookingMessage: Message = {
      id: `user-booking-${Date.now()}`,
      type: "user",
      content: "📅 Termin buchen",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userBookingMessage]);

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Add bot response with Calendly button
    const bookingOptionMessage: Message = {
      id: `booking-option-${Date.now()}`,
      type: "bot",
      content: "Sehr gerne! Bitte wählen Sie hier einen passenden Termin aus:",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, bookingOptionMessage]);

    // Add Calendly button message (will open when user clicks)
    setTimeout(() => {
      const calendlyMessage: Message = {
        id: `calendly-${Date.now()}`,
        type: "bot",
        content: `calendly:${CALENDLY_URL}`, // Special marker for Calendly button
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, calendlyMessage]);
      // Auto scroll to button
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 300);

    await sendTelegramNotification(
      `📅 <b>Termin-Anfrage</b>\n\nEin Nutzer möchte einen Beratungstermin vereinbaren.\n📧 E-Mail: ${email || "Nicht angegeben"}`
    );
  };

  // Handle "Merken" (Save to cart)
  const handleMerken = (candidate: Candidate) => {
    if (cart.some((c) => c.id === candidate.id)) {
      // Remove from cart
      setCart((prev) => prev.filter((c) => c.id !== candidate.id));
    } else {
      // Add to cart
      setCart((prev) => [...prev, candidate]);
      sendTelegramNotification(
        `⭐ <b>Kandidat gemerkt</b>\n\n${candidate.name} (${candidate.jobTitle}) wurde zur Merkliste hinzugefügt.`
      );
    }
  };

  // Handle "Profil ansehen" (Lead Gen)
  const handleViewProfile = (candidate: Candidate) => {
    if (!email) {
      // Show email form
      setShowEmailForm(true);
      setEmailFormCandidate(candidate);
    } else {
      // Already has email - open profile (TODO: Implement profile link)
      window.open(`/candidates/${candidate.id}`, "_blank");
    }
  };

  // Handle email form submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setIsSubmittingEmail(true);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      setIsSubmittingEmail(false);
      return;
    }

    // Save email
    setEmail(emailInput);

    if (emailFormCandidate) {
      // Lead Gen - Profile unlock
      await sendTelegramNotification(
        `🎯 <b>NEUER LEAD - Profil angefordert</b>\n\n` +
        `📧 E-Mail: ${emailInput}\n` +
        `👤 Kandidat: ${emailFormCandidate.name}\n` +
        `💼 Position: ${emailFormCandidate.jobTitle}\n` +
        `🏢 Bereich: ${emailFormCandidate.category}\n` +
        `📅 Zeitpunkt: ${new Date().toLocaleString("de-DE")}`
      );

      const successMessage: Message = {
        id: `email-success-${Date.now()}`,
        type: "bot",
        content: `Vielen Dank! Das Profil wurde freigeschaltet. Wir senden Ihnen die Details per E-Mail zu.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);

      // TODO: Open profile link
      // window.open(`/candidates/${emailFormCandidate.id}`, "_blank");
    } else {
      // Inquiry - Email collected, now send inquiry
      const successMessage: Message = {
        id: `email-collected-${Date.now()}`,
        type: "bot",
        content: `Vielen Dank! Ihre E-Mail-Adresse wurde gespeichert. Sie können nun Ihre Anfrage senden.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
      setActiveTab("merkliste");
    }

    // Close email form
    setShowEmailForm(false);
    setEmailInput("");
    setIsSubmittingEmail(false);
  };

  // Handle "Anfrage senden" (Send inquiry)
  const handleSendInquiry = async () => {
    if (cart.length === 0) {
      // Show message in chat instead of alert
      const alertMessage: Message = {
        id: `alert-${Date.now()}`,
        type: "bot",
        content: "Bitte fügen Sie mindestens einen Kandidaten zur Merkliste hinzu.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, alertMessage]);
      setActiveTab("chat");
      return;
    }

    if (!email) {
      // Request email
      setShowEmailForm(true);
      setEmailFormCandidate(null);
      // Show message explaining why email is needed
      const emailRequestMessage: Message = {
        id: `email-request-${Date.now()}`,
        type: "bot",
        content: "Für die Anfrage benötigen wir Ihre E-Mail-Adresse. Bitte geben Sie diese ein.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, emailRequestMessage]);
      setActiveTab("chat");
      return;
    }

    // Send inquiry
    setIsTyping(true);
    await sendTelegramNotification(
      `📨 <b>ANFRAGE GESENDET</b>\n\n` +
      `📧 E-Mail: ${email}\n` +
      `📋 Anzahl Kandidaten: ${cart.length}\n` +
      `👥 Kandidaten:\n${cart.map((c, idx) => `${idx + 1}. ${c.name} - ${c.jobTitle}`).join("\n")}\n` +
      `📅 Zeitpunkt: ${new Date().toLocaleString("de-DE")}`
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Show success message
    const successMessage: Message = {
      id: `inquiry-success-${Date.now()}`,
      type: "bot",
      content: `Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
    setActiveTab("chat");

    // Clear cart
    setCart([]);
  };

  // Close chat
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMessages([]);
      setShowEmailForm(false);
      setEmailFormCandidate(null);
    }, 300);
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
                {/* Logo - Direct on dark blue background (no white wrapper) */}
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
                      objectFit: "contain"
                    }}
                    priority={true}
                    quality={90}
                    unoptimized={logoUrl?.startsWith("http") || false}
                    onError={(e) => {
                      // Hide image and show fallback text
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".logo-fallback")) {
                        const fallback = document.createElement("span");
                        fallback.className = "logo-fallback text-white font-bold text-sm absolute inset-0 flex items-center justify-center";
                        fallback.textContent = "DMF";
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">DMF Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs opacity-90 text-white">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Cart Badge */}
                {cart.length > 0 && (
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5 text-primary-foreground/80" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                      {cart.length}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
                  activeTab === "chat"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <MessageCircle className="w-4 h-4 inline-block mr-2" />
                Chat
              </button>
              <button
                onClick={() => setActiveTab("merkliste")}
                className={cn(
                  "flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative",
                  activeTab === "merkliste"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Bookmark className="w-4 h-4 inline-block mr-2" />
                Merkliste
                {cart.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content Area */}
            {activeTab === "chat" ? (
              <>
                {/* Messages Area */}
                <div
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50"
                  style={{ maxHeight: "calc(600px - 200px)" }}
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex",
                        message.type === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.type === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-2">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5",
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : message.content === "candidate"
                            ? "bg-white p-0 border-0 shadow-none"
                            : "bg-white text-gray-800 shadow-sm border border-gray-200"
                        )}
                      >
                        {message.content === "candidate" && message.candidate ? (
                          <CandidateCard
                            candidate={message.candidate}
                            isSaved={cart.some((c) => c.id === message.candidate!.id)}
                            onMerken={() => handleMerken(message.candidate!)}
                            onViewProfile={() => handleViewProfile(message.candidate!)}
                          />
                        ) : message.content.startsWith("calendly:") ? (
                          // Calendly Button
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                const calendlyUrl = message.content.replace("calendly:", "");
                                window.open(calendlyUrl, "_blank", "noopener,noreferrer");
                              }}
                              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Calendar className="w-5 h-5" />
                              Termin jetzt buchen
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}

                        {message.options && (
                          <div className="mt-3 space-y-2">
                            {message.options.map((option) => (
                              <button
                                key={option.id}
                                onClick={async () => {
                                  if (option.id === "book") {
                                    await handleBookingClick();
                                  } else {
                                    await handleOptionClick(option);
                                  }
                                }}
                                className="w-full text-left px-3 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg text-sm transition-colors flex items-center gap-2"
                              >
                                <span className="text-lg">{option.emoji}</span>
                                <span className="font-medium">{option.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {message.type === "user" && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-2">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Footer - Input Area (Disabled for now) */}
                <div className="border-t border-gray-200 px-4 py-3 bg-white flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Bitte wählen Sie eine Option aus..."
                      disabled
                      className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                      aria-label="Eingabefeld (derzeit deaktiviert)"
                    />
                    <button
                      disabled
                      className="w-10 h-10 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center cursor-not-allowed"
                      aria-label="Senden (derzeit deaktiviert)"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Merkliste Tab */
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Bookmark className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm mb-2">Ihre Merkliste ist leer</p>
                    <p className="text-gray-400 text-xs">Klicken Sie auf "Merken" bei einem Kandidaten, um ihn zu speichern.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-primary font-semibold text-xs">
                                {getInitials(candidate.name)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {candidate.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {formatExperience(candidate)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleMerken(candidate)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              aria-label="Aus Merkliste entfernen"
                            >
                              <BookmarkCheck className="w-4 h-4 text-primary" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium border",
                                getLevelColor(candidate.germanLevel)
                              )}
                            >
                              Deutsch {candidate.germanLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={handleSendInquiry}
                        className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                      >
                        <Mail className="w-4 h-4" />
                        Anfrage senden ({cart.length} {cart.length === 1 ? "Kandidat" : "Kandidaten"})
                      </button>
                      <button
                        onClick={async () => {
                          setActiveTab("chat");
                          await new Promise((resolve) => setTimeout(resolve, 300)); // Wait for tab switch
                          const bookingMessage: Message = {
                            id: `booking-from-cart-${Date.now()}`,
                            type: "bot",
                            content: `Sie haben ${cart.length} ${cart.length === 1 ? "Kandidat" : "Kandidaten"} in Ihrer Merkliste.\n\nMöchten Sie einen Beratungstermin vereinbaren?`,
                            timestamp: new Date(),
                            options: [
                              { id: "book", label: "Termin buchen", emoji: "📅", category: "pflege" },
                            ],
                          };
                          setMessages((prev) => [...prev, bookingMessage]);
                          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full px-4 py-2.5 border border-primary text-primary hover:bg-primary/5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Termin buchen
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Form Modal */}
      <AnimatePresence>
        {showEmailForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowEmailForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {emailFormCandidate ? "Profil freischalten" : "E-Mail-Adresse erforderlich"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {emailFormCandidate
                  ? "Bitte geben Sie Ihre E-Mail-Adresse ein, um das Profil zu sehen."
                  : "Bitte geben Sie Ihre E-Mail-Adresse ein, um Ihre Anfrage zu senden."}
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ihre.email@example.com"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false);
                      setEmailInput("");
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEmail || !emailInput}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingEmail ? "Wird gesendet..." : "Freischalten"}
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

// ============================================
// CANDIDATE CARD COMPONENT
// ============================================

interface CandidateCardProps {
  candidate: Candidate;
  isSaved: boolean;
  onMerken: () => void;
  onViewProfile: () => void;
}

const CandidateCard = ({ candidate, isSaved, onMerken, onViewProfile }: CandidateCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm w-[300px]">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-semibold text-sm">
            {getInitials(candidate.name)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {candidate.name}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {formatExperience(candidate)}
          </p>
        </div>
        <button
          onClick={onMerken}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label={isSaved ? "Aus Merkliste entfernen" : "Zur Merkliste hinzufügen"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "px-2 py-1 rounded text-xs font-medium border",
            getLevelColor(candidate.germanLevel)
          )}
        >
          Deutsch {candidate.germanLevel}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {candidate.skills.slice(0, 3).map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
          >
            {skill}
          </span>
        ))}
      </div>

      <button
        onClick={onViewProfile}
        className="w-full px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors"
      >
        Profil ansehen
      </button>
    </div>
  );
};
