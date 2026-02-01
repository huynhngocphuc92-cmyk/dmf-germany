// AI Blog Writer Types

export type BlogLanguage = "de" | "en" | "vi";
export type BlogTone = "professional" | "friendly" | "educational";
export type BlogLength = "short" | "medium" | "long";

export interface BlogGenerationRequest {
  topic: string;
  language: BlogLanguage;
  tone: BlogTone;
  length: BlogLength;
  keywords?: string[];
  outline?: string;
  category?: string;
}

export interface GeneratedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  suggestedImages: ImageSuggestion[];
  estimatedReadTime: number;
  language: BlogLanguage;
}

export interface ImageSuggestion {
  id: string;
  query: string;
  description: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  author: string;
  authorUrl: string;
}

export interface TopicSuggestion {
  id: string;
  topic: string;
  description: string;
  category: TopicCategory;
  keywords: string[];
}

export type TopicCategory =
  | "visa-legal"
  | "german-culture"
  | "industry-specific"
  | "language-learning"
  | "success-stories"
  | "company-news";

export const TOPIC_CATEGORIES: Record<
  TopicCategory,
  { label: string; labelDe: string; icon: string }
> = {
  "visa-legal": { label: "Visa & Legal", labelDe: "Visa & Recht", icon: "Scale" },
  "german-culture": { label: "German Culture", labelDe: "Deutsche Kultur", icon: "Globe" },
  "industry-specific": { label: "Industries", labelDe: "Branchen", icon: "Briefcase" },
  "language-learning": { label: "Language Tips", labelDe: "Sprachtipps", icon: "BookOpen" },
  "success-stories": { label: "Success Stories", labelDe: "Erfolgsgeschichten", icon: "Star" },
  "company-news": { label: "Company News", labelDe: "Unternehmensnews", icon: "Newspaper" },
};

export const LENGTH_CONFIG: Record<BlogLength, { words: number; label: string }> = {
  short: { words: 500, label: "~500 Wörter" },
  medium: { words: 1000, label: "~1000 Wörter" },
  long: { words: 1500, label: "~1500 Wörter" },
};

export const TONE_CONFIG: Record<BlogTone, { label: string; description: string }> = {
  professional: { label: "Professionell", description: "Formell und geschäftsmäßig" },
  friendly: { label: "Freundlich", description: "Warm und zugänglich" },
  educational: { label: "Lehrreich", description: "Informativ und erklärend" },
};

export interface GenerationState {
  status: "idle" | "generating" | "success" | "error";
  progress: number;
  message: string;
  result?: GeneratedBlog;
  error?: string;
}
