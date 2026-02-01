"use client";

import { useState } from "react";
import { Loader2, Wand2, X } from "lucide-react";
import {
  BlogGenerationRequest,
  BlogLanguage,
  BlogTone,
  BlogLength,
  TopicSuggestion,
  TONE_CONFIG,
  LENGTH_CONFIG,
} from "../types";
import { cn } from "@/lib/utils";

interface GenerationFormProps {
  onGenerate: (request: BlogGenerationRequest) => Promise<void>;
  isGenerating: boolean;
  selectedTopic?: TopicSuggestion | null;
  onClearTopic: () => void;
}

export function GenerationForm({
  onGenerate,
  isGenerating,
  selectedTopic,
  onClearTopic,
}: GenerationFormProps) {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<BlogLanguage>("de");
  const [tone, setTone] = useState<BlogTone>("professional");
  const [length, setLength] = useState<BlogLength>("medium");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [outline, setOutline] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync with selected topic
  const displayTopic = selectedTopic?.topic || topic;
  const displayKeywords = selectedTopic?.keywords || keywords;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayTopic.trim()) return;

    await onGenerate({
      topic: displayTopic,
      language,
      tone,
      length,
      keywords: displayKeywords.length > 0 ? displayKeywords : undefined,
      outline: outline.trim() || undefined,
      category: selectedTopic?.category,
    });
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Wand2 className="w-5 h-5 text-purple-500" />
        Blog Generator
      </h3>

      {/* Topic Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Thema / Topic *</label>
        {selectedTopic ? (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-blue-800">{selectedTopic.topic}</p>
              <p className="text-xs text-blue-600 mt-1">{selectedTopic.description}</p>
            </div>
            <button type="button" onClick={onClearTopic} className="p-1 hover:bg-blue-100 rounded">
              <X className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="z.B. Wie deutsche Unternehmen von vietnamesischen Fachkräften profitieren"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        )}
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Sprache</label>
        <div className="flex gap-2">
          {(["de", "en", "vi"] as BlogLanguage[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={cn(
                "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                language === lang
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
              )}
            >
              {lang === "de" ? "🇩🇪 Deutsch" : lang === "en" ? "🇬🇧 English" : "🇻🇳 Tiếng Việt"}
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tonalität</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(TONE_CONFIG) as BlogTone[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              className={cn(
                "py-2 px-3 rounded-lg border text-sm transition-colors",
                tone === t
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
              )}
            >
              <span className="font-medium">{TONE_CONFIG[t].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Length Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Länge</label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(LENGTH_CONFIG) as BlogLength[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLength(l)}
              className={cn(
                "py-2 px-3 rounded-lg border text-sm transition-colors",
                length === l
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-200"
              )}
            >
              {LENGTH_CONFIG[l].label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-blue-600 hover:underline mb-4"
      >
        {showAdvanced ? "− Erweiterte Optionen ausblenden" : "+ Erweiterte Optionen anzeigen"}
      </button>

      {showAdvanced && (
        <>
          {/* Keywords */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Keywords (optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                placeholder="Keyword eingeben..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {displayKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs"
                >
                  {kw}
                  {!selectedTopic && (
                    <button type="button" onClick={() => removeKeyword(kw)}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Outline */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Gliederung (optional)
            </label>
            <textarea
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              placeholder="1. Einleitung&#10;2. Hauptteil&#10;3. Fazit"
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
        </>
      )}

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isGenerating || !displayTopic.trim()}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generiere Blog...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Blog generieren
          </>
        )}
      </button>
    </form>
  );
}
