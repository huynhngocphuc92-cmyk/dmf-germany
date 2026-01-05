"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

interface NotFoundContent {
  title: string;
  errorCode: string;
  heading: string;
  description: string;
  suggestion: string;
  backToHome: string;
  goBack: string;
  searchTip: string;
  contact: string;
}

const content: Record<"de" | "vn", NotFoundContent> = {
  de: {
    title: "Seite nicht gefunden",
    errorCode: "404",
    heading: "Seite nicht gefunden",
    description:
      "Es tut uns leid, aber die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.",
    suggestion:
      "Möglicherweise wurde die Seite umbenannt, gelöscht oder war nie vorhanden. Bitte überprüfen Sie die URL oder navigieren Sie zurück zur Startseite.",
    backToHome: "Zurück zur Startseite",
    goBack: "Zurück",
    searchTip: "Tipp: Nutzen Sie die Navigation oben, um die gewünschte Seite zu finden.",
    contact: "Kontakt aufnehmen",
  },
  vn: {
    title: "Không tìm thấy trang",
    errorCode: "404",
    heading: "Không tìm thấy trang",
    description:
      "Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
    suggestion:
      "Có thể trang đã được đổi tên, xóa hoặc chưa từng tồn tại. Vui lòng kiểm tra URL hoặc quay lại trang chủ.",
    backToHome: "Về trang chủ",
    goBack: "Quay lại",
    searchTip: "Mẹo: Sử dụng menu điều hướng ở trên để tìm trang bạn cần.",
    contact: "Liên hệ hỗ trợ",
  },
};

export default function NotFound() {
  const { language, content: siteContent } = useLanguage();
  const t = content[language];

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-primary/5 rounded-full animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center">
            <div className="p-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
              <FileQuestion className="h-24 w-24 text-primary/80" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-mono font-bold text-6xl md:text-8xl rounded-2xl">
            {t.errorCode}
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
          {t.heading}
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground mb-4 max-w-lg mx-auto leading-relaxed">
          {t.description}
        </p>

        {/* Suggestion */}
        <p className="text-sm text-muted-foreground/80 mb-8 max-w-md mx-auto">
          {t.suggestion}
        </p>

        {/* Search Tip */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8 p-3 bg-muted/50 rounded-lg max-w-md mx-auto">
          <Search className="h-4 w-4 text-primary" />
          <span>{t.searchTip}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2 shadow-lg hover:shadow-xl">
            <Link href="/">
              <Home className="h-5 w-5" />
              {t.backToHome}
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              }
            }}
          >
            <ArrowLeft className="h-5 w-5" />
            {t.goBack}
          </Button>

          <Button asChild variant="ghost" size="lg" className="gap-2">
            <Link href="#contact">
              <Mail className="h-5 w-5" />
              {t.contact}
            </Link>
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center items-center gap-4 text-muted-foreground/40">
          <span className="text-4xl">🇻🇳</span>
          <span className="text-2xl">↔</span>
          <span className="text-4xl">🇩🇪</span>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            {language === "de" ? "Schnellzugriff:" : "Liên kết nhanh:"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {siteContent.header.navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

