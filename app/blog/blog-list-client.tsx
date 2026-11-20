"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatBlogDate } from "@/lib/blog-date";
import {
  BLOG_CLUSTERS,
  classifyBlogPost,
  isNoindexBlogSlug,
  type BlogClusterId,
} from "@/lib/blog/seo-taxonomy";
import { Calendar, Clock, ArrowRight, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { BLUR_LANDSCAPE } from "@/lib/image-placeholder";
import type { BlogPostSummary } from "@/app/admin/posts/types";

const POSTS_PER_PAGE = 18;

const translations = {
  de: {
    badge: "DMF Talents Arbeitgeber-Wissen",
    title: "Fachkräfte & Azubis aus Vietnam: Arbeitgeber-Ratgeber",
    subtitle:
      "Praxisleitfäden zu § 18a/§ 81a AufenthG, dualer Ausbildung (§ 16a), Anerkennung, Kosten & Integration.",
    readMore: "Weiterlesen",
    readTime: "Min. Lesezeit",
    allTopics: "Alle Themen",
    noPosts: "Noch keine Beiträge vorhanden",
    noPostsDesc: "Schauen Sie bald wieder vorbei für neue Inhalte.",
    prevPage: "Zurück",
    nextPage: "Weiter",
    pageOf: (page: number, total: number) => `Seite ${page} von ${total}`,
    pillarHeading: "Direkt zu unseren Arbeitgeber-Lösungen:",
    pillars: [
      { href: "/services/skilled-workers", label: "Fachkräfte (§ 18a / § 81a)" },
      { href: "/services/azubi", label: "Azubis (§ 16a)" },
      { href: "/services/seasonal", label: "Saisonkräfte (§ 15d)" },
      { href: "/fuer-arbeitgeber/branchen", label: "Branchenlösungen" },
      { href: "/fuer-arbeitgeber/standorte", label: "§ 81a nach Bundesland" },
      { href: "/roi-rechner", label: "ROI-Rechner" },
    ],
  },
  en: {
    badge: "DMF Talents Employer Knowledge",
    title: "Skilled Workers & Trainees from Vietnam: Employer Guide",
    subtitle:
      "Practical guides on § 18a/§ 81a Residence Act, vocational training (§ 16a), recognition, costs & onboarding.",
    readMore: "Read More",
    readTime: "min read",
    allTopics: "All Topics",
    noPosts: "No posts yet",
    noPostsDesc: "Please come back later for new content.",
    prevPage: "Previous",
    nextPage: "Next",
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
    pillarHeading: "Explore our employer solutions:",
    pillars: [
      { href: "/services/skilled-workers", label: "Skilled Workers (§ 18a / § 81a)" },
      { href: "/services/azubi", label: "Trainees (§ 16a)" },
      { href: "/services/seasonal", label: "Seasonal Staff (§ 15d)" },
      { href: "/fuer-arbeitgeber/branchen", label: "Industry Solutions" },
      { href: "/fuer-arbeitgeber/standorte", label: "§ 81a by State" },
      { href: "/roi-rechner", label: "ROI Calculator" },
    ],
  },
  vn: {
    badge: "Cẩm nang Tuyển dụng DMF Talents",
    title: "Nhân sự & Học viên từ Việt Nam: Cẩm nang Doanh nghiệp Đức",
    subtitle:
      "Hướng dẫn thực tiễn về Visa § 18a/§ 81a, đào tạo nghề kép (§ 16a), công nhận bằng cấp, chi phí & hội nhập.",
    readMore: "Đọc thêm",
    readTime: "phút đọc",
    allTopics: "Tất cả chủ đề",
    noPosts: "Chưa có bài viết",
    noPostsDesc: "Vui lòng quay lại sau để xem nội dung mới.",
    prevPage: "Trang trước",
    nextPage: "Trang sau",
    pageOf: (page: number, total: number) => `Trang ${page} / ${total}`,
    pillarHeading: "Truy cập nhanh giải pháp cho Doanh nghiệp:",
    pillars: [
      { href: "/services/skilled-workers", label: "Lao động tay nghề (§ 18a/§ 81a)" },
      { href: "/services/azubi", label: "Học viên nghề (§ 16a)" },
      { href: "/services/seasonal", label: "Nhân sự thời vụ (§ 15d)" },
      { href: "/fuer-arbeitgeber/branchen", label: "Theo Ngành nghề" },
      { href: "/fuer-arbeitgeber/standorte", label: "Thủ tục § 81a theo Bang" },
      { href: "/roi-rechner", label: "Tính ROI" },
    ],
  },
};

interface BlogListClientProps {
  posts: BlogPostSummary[];
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

export function BlogListClient({ posts }: BlogListClientProps) {
  const { lang: currentLang } = useLanguage();
  const lang = (currentLang as "de" | "en" | "vn") || "de";
  const t = translations[lang] || translations.de;

  const [selectedCluster, setSelectedCluster] = useState<"all" | BlogClusterId>("all");
  const [page, setPage] = useState(1);

  const indexablePosts = useMemo(
    () => posts.filter((post) => !isNoindexBlogSlug(post.slug)),
    [posts]
  );

  const clusterAssignments = useMemo(() => {
    const counts = new Map<BlogClusterId, number>();
    const byPostId = new Map<string, BlogClusterId>();
    for (const post of indexablePosts) {
      const clusterId = classifyBlogPost(post.slug, post.title).id;
      byPostId.set(post.id, clusterId);
      counts.set(clusterId, (counts.get(clusterId) ?? 0) + 1);
    }
    return { counts, byPostId };
  }, [indexablePosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCluster === "all") return indexablePosts;
    return indexablePosts.filter(
      (post) => clusterAssignments.byPostId.get(post.id) === selectedCluster
    );
  }, [indexablePosts, selectedCluster, clusterAssignments]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedPosts = useMemo(() => {
    const start = (safePage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, safePage]);

  const handleSelectCluster = (next: "all" | BlogClusterId) => {
    setSelectedCluster(next);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-[120px]">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">{t.badge}</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">{t.subtitle}</p>
          </div>

          {/* Pillar Money-Page Quick Strip */}
          <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-slate-200/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-3">
              {t.pillarHeading}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {t.pillars.map((pillar) => (
                <Link
                  key={pillar.href}
                  href={pillar.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors shadow-xs"
                >
                  <span>{pillar.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Topic Cluster Filter Tabs */}
          {indexablePosts.length > 0 && (
            <div
              className="max-w-5xl mx-auto mt-6 flex flex-wrap justify-center gap-2"
              role="tablist"
              aria-label={t.allTopics}
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCluster === "all"}
                onClick={() => handleSelectCluster("all")}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
                  selectedCluster === "all"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {t.allTopics} ({indexablePosts.length})
              </button>
              {BLOG_CLUSTERS.map((cluster) => {
                const count = clusterAssignments.counts.get(cluster.id) ?? 0;
                if (count === 0) return null;
                const active = selectedCluster === cluster.id;
                return (
                  <button
                    key={cluster.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleSelectCluster(cluster.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cluster.label[lang]} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-10 lg:py-16">
        <div className="container mx-auto px-4">
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post) => {
                  const minutes =
                    post.read_time_minutes ?? (post.content ? calculateReadTime(post.content) : 5);
                  return (
                    <article key={post.id} className="group">
                      <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 h-full flex flex-col">
                          {/* Cover Image */}
                          <div className="relative h-52 overflow-hidden bg-slate-100">
                            {post.cover_image ? (
                              <Image
                                src={post.cover_image}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                placeholder="blur"
                                blurDataURL={BLUR_LANDSCAPE}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                                <FileText className="w-12 h-12 text-slate-300" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Content */}
                          <div className="p-6 flex-1 flex flex-col">
                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                              <time
                                dateTime={post.published_at || post.created_at}
                                className="flex items-center gap-1"
                              >
                                <Calendar className="w-4 h-4" />
                                {formatBlogDate(post.published_at || post.created_at, lang)}
                              </time>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {minutes} {t.readTime}
                              </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            {post.excerpt && (
                              <p className="text-slate-600 mb-4 line-clamp-3 flex-1">
                                {post.excerpt}
                              </p>
                            )}

                            {/* Read More */}
                            <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all mt-auto">
                              <span>{t.readMore}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav
                  aria-label="Blog pagination"
                  className="mt-12 flex flex-wrap items-center justify-center gap-2"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    {t.prevPage}
                  </Button>

                  <span className="px-3 text-sm text-slate-600 font-medium">
                    {t.pageOf(safePage, totalPages)}
                  </span>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    {t.nextPage}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 mx-auto mb-6 text-slate-300" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.noPosts}</h2>
              <p className="text-slate-600 mb-8">{t.noPostsDesc}</p>
              <Button asChild>
                <Link href="/">
                  {lang === "vn"
                    ? "Về trang chủ"
                    : lang === "en"
                      ? "Back to Homepage"
                      : "Zur Startseite"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
