"use client";

import { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Scale,
  Globe,
  Briefcase,
  BookOpen,
  Star,
  Newspaper,
} from "lucide-react";
import { TopicSuggestion, TopicCategory, TOPIC_CATEGORIES, BlogLanguage } from "../types";
import { getTopicSuggestions } from "../actions";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<TopicCategory, React.ElementType> = {
  "visa-legal": Scale,
  "german-culture": Globe,
  "industry-specific": Briefcase,
  "language-learning": BookOpen,
  "success-stories": Star,
  "company-news": Newspaper,
};

interface TopicSuggesterProps {
  language: BlogLanguage;
  onSelectTopic: (topic: TopicSuggestion) => void;
}

export function TopicSuggester({ language, onSelectTopic }: TopicSuggesterProps) {
  const [topics, setTopics] = useState<TopicSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTopics = async () => {
    setLoading(true);
    setError(null);

    const result = await getTopicSuggestions(language, selectedCategory || undefined);

    if (result.success && result.data) {
      setTopics(result.data);
    } else {
      setError(result.error || "Failed to load topics");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-slate-800">Topic Vorschläge</h3>
        </div>
        <button
          onClick={loadTopics}
          disabled={loading}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          title="Neue Vorschläge laden"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-2.5 py-1 text-xs rounded-full transition-colors",
            !selectedCategory
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          Alle
        </button>
        {(Object.keys(TOPIC_CATEGORIES) as TopicCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-full transition-colors",
              selectedCategory === cat
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {TOPIC_CATEGORIES[cat].labelDe}
          </button>
        ))}
      </div>

      {/* Topics List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {topics.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-slate-400">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Klicken Sie auf &quot;Neue Vorschläge laden&quot;</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500 text-sm">
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-100 rounded-lg p-3 h-20" />
            ))}
          </div>
        )}

        {topics.map((topic) => {
          const Icon = CATEGORY_ICONS[topic.category as TopicCategory] || Newspaper;
          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded bg-slate-100 group-hover:bg-blue-100 transition-colors">
                  <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-slate-800 line-clamp-2 group-hover:text-blue-700">
                    {topic.topic}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{topic.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {topic.keywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
