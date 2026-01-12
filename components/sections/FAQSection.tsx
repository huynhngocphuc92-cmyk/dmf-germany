"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  questions: FAQItem[];
  theme?: "emerald" | "blue";
  badge?: string;
  title?: string;
  subtitle?: string;
}

export function FAQSection({
  questions,
  theme = "emerald",
  badge = "FAQ",
  title = "Häufig gestellte Fragen",
  subtitle = "Alles, was Sie wissen müssen",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const isEmerald = theme === "emerald";

  return (
    <section className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold border"
            style={{
              backgroundColor: isEmerald ? "rgba(16, 185, 129, 0.1)" : "rgba(59, 130, 246, 0.1)",
              borderColor: isEmerald ? "rgba(16, 185, 129, 0.2)" : "rgba(59, 130, 246, 0.2)",
              color: isEmerald ? "rgb(16, 185, 129)" : "rgb(59, 130, 246)",
            }}
          >
            <HelpCircle className="w-4 h-4" />
            {badge}
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {title}
          </h2>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            const borderColor = isEmerald ? "border-emerald-200" : "border-blue-200";
            const hoverBorderColor = isEmerald ? "hover:border-emerald-300" : "hover:border-blue-300";
            const textColor = isEmerald ? "text-emerald-600" : "text-blue-600";
            const bgColor = isEmerald ? "bg-emerald-50" : "bg-blue-50";
            const iconBgColor = isEmerald ? "bg-emerald-100" : "bg-blue-100";

            return (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-2xl border-2 transition-all duration-300",
                  borderColor,
                  hoverBorderColor,
                  isOpen && "shadow-lg"
                )}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                      iconBgColor,
                      textColor
                    )}>
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      iconBgColor,
                      textColor
                    )}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* Answer Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className={cn(
                        "px-6 pb-5 pl-20 border-t",
                        bgColor,
                        isEmerald ? "border-emerald-100" : "border-blue-100"
                      )}>
                        <p className="text-slate-600 leading-relaxed pt-4">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
