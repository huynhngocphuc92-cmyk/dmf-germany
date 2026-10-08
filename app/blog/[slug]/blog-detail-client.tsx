"use client";

import type { Post } from "@/app/admin/posts/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { BLUR_LANDSCAPE } from "@/lib/image-placeholder";
import { format } from "date-fns";
import { de, vi, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Share2,
  Calculator,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./article.module.css";

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  de: {
    backToBlog: "Zurück zum Blog",
    readTime: "Min. Lesezeit",
    share: "Teilen",
    relatedPosts: "Verwandte Beiträge",
    readMore: "Weiterlesen",
    cta: {
      badge: "B2B-Fachkräfte-Service für Arbeitgeber",
      title: "Suchen Sie qualifizierte Fachkräfte oder Auszubildende?",
      desc: "DMF Talents begleitet deutsche Unternehmen bei der passgenauen Auswahl, rechtssicheren FEG-Visabeschleunigung und nachhaltigen betrieblichen Integration von Talenten aus Vietnam.",
      trust_feg: "Rechtssicher nach FEG & § 296a SGB III",
      trust_success: "Erfolgsbasiertes Honorarmodell",
      trust_guarantee: "Kostenlose Ersatzgarantie bei Abbruch",
      btn_primary: "Personalbedarf unverbindlich melden",
      btn_secondary: "Einsparpotenzial kalkulieren",
      btn_profiles: "Kandidaten-Pool einsehen",
    },
  },
  en: {
    backToBlog: "Back to Blog",
    readTime: "min read",
    share: "Share",
    relatedPosts: "Related Posts",
    readMore: "Read More",
    cta: {
      badge: "B2B Talent Service for Employers",
      title: "Looking for qualified professionals or apprentices?",
      desc: "DMF Talents supports German enterprises with tailored candidate selection, accelerated FEG visa procedures, and sustainable integration of talents from Vietnam.",
      trust_feg: "Fully compliant with FEG & § 296a SGB III",
      trust_success: "Success-based recruitment fee",
      trust_guarantee: "Free replacement guarantee upon dropout",
      btn_primary: "Submit hiring inquiry without obligation",
      btn_secondary: "Calculate ROI savings",
      btn_profiles: "Browse candidate pool",
    },
  },
  vn: {
    backToBlog: "Quay lại Blog",
    readTime: "phút đọc",
    share: "Chia sẻ",
    relatedPosts: "Bài viết liên quan",
    readMore: "Đọc thêm",
    cta: {
      badge: "Dịch vụ Nhân sự B2B cho Doanh nghiệp",
      title: "Doanh nghiệp bạn đang tìm kiếm nhân sự hoặc học nghề?",
      desc: "DMF Talents đồng hành cùng các doanh nghiệp tại Đức từ khâu tuyển chọn, thủ tục visa FEG nhanh chóng đến việc hội nhập bền vững cho nhân tài từ Việt Nam.",
      trust_feg: "Tuân thủ pháp luật FEG & § 296a SGB III",
      trust_success: "Phí môi giới theo kết quả",
      trust_guarantee: "Bảo hành đổi ứng viên miễn phí",
      btn_primary: "Gửi nhu cầu nhân sự ngay",
      btn_secondary: "Tính toán chi phí ROI",
      btn_profiles: "Xem danh sách ứng viên",
    },
  },
};

// ============================================
// TYPES
// ============================================

interface BlogDetailClientProps {
  post: Post;
  relatedPosts: Post[];
}

// ============================================
// CALCULATE READ TIME
// ============================================

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ============================================
// BLOG DETAIL CLIENT COMPONENT
// ============================================

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const { lang: currentLang } = useLanguage();
  const lang = (currentLang as "de" | "en" | "vn") || "de";
  const t = translations[lang] || translations.de;
  const dateLocale = lang === "vn" ? vi : lang === "en" ? enUS : de;

  // Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "vn" ? "Đã sao chép link!" : lang === "en" ? "Link copied!" : "Link kopiert!");
    }
  };

  return (
    <main className="min-h-screen bg-white pt-[120px]">
      {/* Hero Section with Cover Image */}
      <section className="relative">
        {/* Cover Image */}
        {post.cover_image ? (
          <div className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_LANDSCAPE}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="h-[30vh] bg-gradient-to-br from-blue-900 to-slate-900" />
        )}

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm hover:bg-white"
            asChild
          >
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToBlog}
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Content */}
      <article className="relative -mt-12 lg:-mt-16 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Article Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 mb-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                <time
                  dateTime={post.published_at || post.created_at}
                  className="flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at || post.created_at), "dd MMMM yyyy", {
                    locale: dateLocale,
                  })}
                </time>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {calculateReadTime(post.content)} {t.readTime}
                </span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {t.share}
                </Button>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-4">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Article Body */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12">
              <div className={styles.content}>{parse(post.content)}</div>
            </div>

            {/* B2B Conversion CTA Card */}
            <div className="mt-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl shadow-xl p-6 sm:p-10 text-white border border-blue-800/40 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t.cta?.badge || "B2B-Fachkräfte-Service für Arbeitgeber"}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                    {t.cta?.title || "Suchen Sie qualifizierte Fachkräfte oder Auszubildende?"}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    {t.cta?.desc ||
                      "DMF Talents begleitet deutsche Unternehmen bei der passgenauen Auswahl, rechtssicheren FEG-Visabeschleunigung und nachhaltigen betrieblichen Integration von Talenten aus Vietnam."}
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-2 border-y border-white/10 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{t.cta?.trust_feg || "Rechtssicher nach FEG & § 296a SGB III"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{t.cta?.trust_success || "Erfolgsbasiertes Honorarmodell"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{t.cta?.trust_guarantee || "Kostenlose Ersatzgarantie bei Abbruch"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/fuer-arbeitgeber/personalbedarf"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-lg hover:shadow-blue-500/25 group"
                  >
                    <span>{t.cta?.btn_primary || "Personalbedarf unverbindlich melden"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/roi-rechner"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm sm:text-base transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{t.cta?.btn_secondary || "ROI kalkulieren"}</span>
                  </Link>

                  <Link
                    href="/fuer-arbeitgeber/kandidaten"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium rounded-xl text-sm sm:text-base transition-all border border-white/10"
                  >
                    <Users className="w-4 h-4" />
                    <span>{t.cta?.btn_profiles || "Kandidaten-Pool"}</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.relatedPosts}</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <motion.article
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link href={`/blog/${encodeURIComponent(relatedPost.slug)}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden bg-slate-100">
                          {relatedPost.cover_image ? (
                            <Image
                              src={relatedPost.cover_image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              placeholder="blur"
                              blurDataURL={BLUR_LANDSCAPE}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                              <FileText className="w-8 h-8 text-slate-300" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <p className="text-xs text-slate-500 mb-2">
                            {format(
                              new Date(relatedPost.published_at || relatedPost.created_at),
                              "dd MMM yyyy",
                              { locale: dateLocale }
                            )}
                          </p>
                          <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {relatedPost.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Back to Blog Button */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/blog">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.backToBlog}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
