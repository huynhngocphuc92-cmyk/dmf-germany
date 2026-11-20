"use client";

import type { BlogPostSummary, Post } from "@/app/admin/posts/types";
import { InlineBlogLeadCard } from "@/components/blog/InlineBlogLeadCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { formatBlogDate } from "@/lib/blog-date";
import {
  classifyBlogPost,
  getBlogConsolidationTarget,
  matchRegionalStandort,
} from "@/lib/blog/seo-taxonomy";
import { BLUR_LANDSCAPE } from "@/lib/image-placeholder";
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
  Compass,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./article.module.css";

const translations = {
  de: {
    backToBlog: "Zurück zum Blog",
    readTime: "Min. Lesezeit",
    share: "Teilen",
    relatedPosts: "Verwandte Beiträge",
    readMore: "Weiterlesen",
    pillarSectionTitle: "Passende Arbeitgeber-Lösungen von DMF Talents",
    pillarSectionSubtitle:
      "Direkt zu den detaillierten Leistungsseiten, Behörden-Leitfäden und Kostenrechnern für Ihren Betrieb:",
    consolidationBadge: "Aktualisierter Hauptleitfaden verfügbar",
    consolidationAction: "Zum vollständigen Arbeitgeber-Leitfaden",
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
    pillarSectionTitle: "Matching Employer Solutions by DMF Talents",
    pillarSectionSubtitle:
      "Explore our dedicated service pages, regional § 81a authority guides, and ROI tools:",
    consolidationBadge: "Updated primary guide available",
    consolidationAction: "Read the primary employer guide",
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
    pillarSectionTitle: "Giải pháp tuyển dụng phù hợp từ DMF Talents",
    pillarSectionSubtitle:
      "Truy cập trực tiếp các trang dịch vụ, hướng dẫn thủ tục theo Bang và công cụ tính chi phí:",
    consolidationBadge: "Đã có bài hướng dẫn chính thức cập nhật hơn",
    consolidationAction: "Xem bài hướng dẫn chính",
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

interface BlogDetailClientProps {
  post: Post;
  relatedPosts: BlogPostSummary[];
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function hasBalancedContainerTags(prefix: string): boolean {
  for (const tag of ["div", "section", "table", "ul", "ol", "blockquote", "figure"]) {
    const opens = (prefix.match(new RegExp(`<${tag}\\b`, "gi")) ?? []).length;
    const closes = (prefix.match(new RegExp(`</${tag}>`, "gi")) ?? []).length;
    if (opens > closes) return false;
  }
  return true;
}

export function splitArticleHtmlForInlineCta(html: string): [string, string | null] {
  if (!html || html.length < 900) {
    return [html, null];
  }
  const h2Matches = Array.from(html.matchAll(/<h2\b/gi));
  if (h2Matches.length < 2) {
    return [html, null];
  }

  let splitIdx: number | null = null;
  if (typeof h2Matches[1]?.index === "number" && h2Matches[1].index >= 600) {
    splitIdx = h2Matches[1].index;
  } else if (h2Matches.length >= 3 && typeof h2Matches[2]?.index === "number") {
    splitIdx = h2Matches[2].index;
  }

  if (splitIdx === null) {
    return [html, null];
  }

  const prefix = html.slice(0, splitIdx);
  if (!hasBalancedContainerTags(prefix)) {
    return [html, null];
  }

  return [prefix, html.slice(splitIdx)];
}

export function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const { lang: currentLang } = useLanguage();
  const lang = (currentLang as "de" | "en" | "vn") || "de";
  const t = translations[lang] || translations.de;

  const cluster = classifyBlogPost(post.slug, post.title);
  const regionalLink = matchRegionalStandort(post.slug, post.title);
  const consolidationTarget = getBlogConsolidationTarget(post.slug);
  const [firstHtmlPart, secondHtmlPart] = splitArticleHtmlForInlineCta(post.content);

  const pillarCards = [
    ...cluster.pillarLinks.map((item) => ({
      href: item.href,
      label: item.label[lang],
      description: item.description[lang],
      isRegional: false,
    })),
    ...(regionalLink && !cluster.pillarLinks.some((item) => item.href === regionalLink.href)
      ? [
          {
            href: regionalLink.href,
            label: regionalLink.label,
            description:
              lang === "vn"
                ? "Xem cơ quan tiếp nhận § 81a và thẩm định bằng cấp tại Bang."
                : lang === "en"
                  ? "View the responsible § 81a fast-track authority and board in this state."
                  : "Zuständige § 81a-Zentralstelle, Pflege-Anerkennung & Ablauf im Bundesland.",
            isRegional: true,
          },
        ]
      : []),
  ];

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
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "vn" ? "Đã sao chép link!" : lang === "en" ? "Link copied!" : "Link kopiert!");
    }
  };

  return (
    <main className="min-h-screen bg-white pt-[120px]">
      {/* Hero Section with Cover Image */}
      <section className="relative">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        ) : (
          <div className="h-[30vh] bg-gradient-to-br from-blue-900 to-slate-900" />
        )}

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
          <div className="max-w-3xl mx-auto">
            {/* Article Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                <time
                  dateTime={post.published_at || post.created_at}
                  className="flex items-center gap-1"
                >
                  <Calendar className="w-4 h-4" />
                  {formatBlogDate(post.published_at || post.created_at, lang, "long")}
                </time>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {calculateReadTime(post.content)} {t.readTime}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                  {cluster.label[lang]}
                </span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {t.share}
                </Button>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-4">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Optional Primary-Guide Consolidation Banner */}
            {consolidationTarget && (
              <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
                    {t.consolidationBadge}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {consolidationTarget.targetLabel}
                  </p>
                </div>
                <Link
                  href={consolidationTarget.targetUrl}
                  className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors"
                >
                  <span>{t.consolidationAction}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Article Body with Mid-Article Contextual Lead Magnet */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 lg:p-12">
              {secondHtmlPart !== null ? (
                <>
                  <div className={styles.content}>{parse(firstHtmlPart)}</div>
                  <div className="my-8">
                    <InlineBlogLeadCard
                      postSlug={post.slug}
                      postTitle={post.title}
                      cluster={cluster}
                      regionalLink={regionalLink}
                    />
                  </div>
                  <div className={styles.content}>{parse(secondHtmlPart)}</div>
                </>
              ) : (
                <div className={styles.content}>{parse(firstHtmlPart)}</div>
              )}
            </div>

            {secondHtmlPart === null && (
              <div className="mt-8">
                <InlineBlogLeadCard
                  postSlug={post.slug}
                  postTitle={post.title}
                  cluster={cluster}
                  regionalLink={regionalLink}
                />
              </div>
            )}

            {/* Pillar Hub Cross-Link Strip */}
            <section
              aria-label={t.pillarSectionTitle}
              className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" />
                <span>{t.pillarSectionTitle}</span>
              </div>
              <p className="text-sm text-slate-600 mb-5">{t.pillarSectionSubtitle}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pillarCards.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 font-semibold text-slate-900 group-hover:text-blue-700 text-sm mb-1">
                        <span className="inline-flex items-center gap-1.5">
                          {card.isRegional && <MapPin className="w-3.5 h-3.5 text-blue-600" />}
                          {card.label}
                        </span>
                        <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{card.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* B2B Conversion CTA Card */}
            <div className="mt-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl shadow-xl p-6 sm:p-10 text-white border border-blue-800/40 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t.cta.badge}
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                    {t.cta.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    {t.cta.desc}
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 pb-2 border-y border-white/10 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{t.cta.trust_feg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{t.cta.trust_success}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{t.cta.trust_guarantee}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/fuer-arbeitgeber/personalbedarf"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-lg hover:shadow-blue-500/25 group"
                  >
                    <span>{t.cta.btn_primary}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/roi-rechner"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm sm:text-base transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>{t.cta.btn_secondary}</span>
                  </Link>

                  <Link
                    href="/fuer-arbeitgeber/kandidaten"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium rounded-xl text-sm sm:text-base transition-all border border-white/10"
                  >
                    <Users className="w-4 h-4" />
                    <span>{t.cta.btn_profiles}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
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
                  <article key={relatedPost.id} className="group">
                    <Link href={`/blog/${encodeURIComponent(relatedPost.slug)}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 h-full">
                        <div className="relative h-40 overflow-hidden bg-slate-100">
                          {relatedPost.cover_image ? (
                            <Image
                              src={relatedPost.cover_image}
                              alt={relatedPost.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
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

                        <div className="p-5">
                          <time
                            dateTime={relatedPost.published_at || relatedPost.created_at}
                            className="block text-xs text-slate-500 mb-2"
                          >
                            {formatBlogDate(
                              relatedPost.published_at || relatedPost.created_at,
                              lang
                            )}
                          </time>
                          <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {relatedPost.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

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
