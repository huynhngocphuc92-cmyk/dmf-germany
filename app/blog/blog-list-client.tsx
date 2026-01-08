"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { de, vi } from "date-fns/locale";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Post } from "@/app/admin/posts/types";

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  de: {
    title: "Blog & Aktuelles",
    subtitle: "Neuigkeiten, Einblicke und Fachwissen rund um Fachkräfte aus Vietnam",
    readMore: "Weiterlesen",
    readTime: "Min. Lesezeit",
    noPosts: "Noch keine Beiträge vorhanden",
    noPostsDesc: "Schauen Sie bald wieder vorbei für neue Inhalte.",
  },
  en: {
    title: "Blog & News",
    subtitle: "News, insights and expertise about skilled workers from Vietnam",
    readMore: "Read More",
    readTime: "min read",
    noPosts: "No posts yet",
    noPostsDesc: "Please come back later for new content.",
  },
  vn: {
    title: "Blog & Tin Tức",
    subtitle: "Tin tức, góc nhìn và kiến thức chuyên môn về nhân sự Việt Nam",
    readMore: "Đọc thêm",
    readTime: "phút đọc",
    noPosts: "Chưa có bài viết",
    noPostsDesc: "Vui lòng quay lại sau để xem nội dung mới.",
  },
};

// ============================================
// TYPES
// ============================================

interface BlogListClientProps {
  posts: Post[];
}

// ============================================
// ANIMATION VARIANTS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// ============================================
// CALCULATE READ TIME
// ============================================

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ============================================
// BLOG LIST CLIENT COMPONENT
// ============================================

export function BlogListClient({ posts }: BlogListClientProps) {
  const { lang: currentLang } = useLanguage();
  const lang = currentLang as "de" | "vn";
  const t = translations[lang];
  const dateLocale = lang === "vn" ? vi : de;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e3a5f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              DMF Vietnam Blog
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              {t.title}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 h-full flex flex-col">
                      {/* Cover Image */}
                      <div className="relative h-52 overflow-hidden bg-slate-100">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                            <FileText className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Meta */}
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.published_at || post.created_at), "dd MMM yyyy", {
                              locale: dateLocale,
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {calculateReadTime(post.content)} {t.readTime}
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
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <FileText className="w-16 h-16 mx-auto mb-6 text-slate-300" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {t.noPosts}
              </h2>
              <p className="text-slate-600 mb-8">
                {t.noPostsDesc}
              </p>
              <Button asChild>
                <Link href="/">
                  {lang === "vn" ? "Về trang chủ" : "Zur Startseite"}
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

