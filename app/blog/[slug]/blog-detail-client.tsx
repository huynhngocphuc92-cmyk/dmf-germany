"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { de, vi } from "date-fns/locale";
import parse from "html-react-parser";
import { ArrowLeft, Calendar, Clock, Share2, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { BLUR_LANDSCAPE } from "@/lib/image-placeholder";
import type { Post } from "@/app/admin/posts/types";

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
  },
  en: {
    backToBlog: "Back to Blog",
    readTime: "min read",
    share: "Share",
    relatedPosts: "Related Posts",
    readMore: "Read More",
  },
  vn: {
    backToBlog: "Quay lại Blog",
    readTime: "phút đọc",
    share: "Chia sẻ",
    relatedPosts: "Bài viết liên quan",
    readMore: "Đọc thêm",
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
  const lang = currentLang as "de" | "vn";
  const t = translations[lang];
  const dateLocale = lang === "vn" ? vi : de;

  // Share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "vn" ? "Đã sao chép link!" : "Link kopiert!");
    }
  };

  return (
    <main className="min-h-screen bg-white">
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
      <article className="relative -mt-24 lg:-mt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* Article Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at || post.created_at), "dd MMMM yyyy", {
                    locale: dateLocale,
                  })}
                </span>
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
            <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
              <div className="prose prose-lg prose-slate max-w-none">{parse(post.content)}</div>
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
                    <Link href={`/blog/${relatedPost.slug}`}>
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
