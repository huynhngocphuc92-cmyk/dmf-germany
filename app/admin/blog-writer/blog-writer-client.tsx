"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { TopicSuggester } from "./components/TopicSuggester";
import { GenerationForm } from "./components/GenerationForm";
import { ContentPreview } from "./components/ContentPreview";
import { ImageSelector } from "./components/ImageSelector";
import {
  BlogGenerationRequest,
  GeneratedBlog,
  TopicSuggestion,
  ImageSuggestion,
  BlogLanguage,
} from "./types";
import { generateBlogPost } from "./actions";

export default function BlogWriterClient() {
  const [language, setLanguage] = useState<BlogLanguage>("de");
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null);
  const [generatedBlog, setGeneratedBlog] = useState<GeneratedBlog | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectTopic = (topic: TopicSuggestion) => {
    setSelectedTopic(topic);
    setGeneratedBlog(null);
    setSelectedImage(null);
  };

  const handleClearTopic = () => {
    setSelectedTopic(null);
  };

  const handleGenerate = async (request: BlogGenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedBlog(null);

    const result = await generateBlogPost(request);

    if (result.success && result.data) {
      setGeneratedBlog(result.data);
      setLanguage(request.language);
    } else {
      setError(result.error || "Generation failed");
    }

    setIsGenerating(false);
  };

  const handleEditBlog = (updatedBlog: GeneratedBlog) => {
    setGeneratedBlog(updatedBlog);
  };

  const handleSelectImage = (image: ImageSuggestion) => {
    setSelectedImage(image);
    if (generatedBlog) {
      setGeneratedBlog({
        ...generatedBlog,
        suggestedImages: [image, ...generatedBlog.suggestedImages.slice(1)],
      });
    }
  };

  // Get suggested image queries from generated blog
  const suggestedImageQueries = generatedBlog?.suggestedImages.map((img) => img.query) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">AI Blog Writer</h1>
            <p className="text-sm text-slate-500">
              Erstellen Sie hochwertige Blog-Artikel mit KI-Unterstützung
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6 max-w-[1800px] mx-auto">
          {/* Left Column: Topic Suggestions */}
          <div className="col-span-12 lg:col-span-3">
            <TopicSuggester language={language} onSelectTopic={handleSelectTopic} />
          </div>

          {/* Center Column: Generation Form */}
          <div className="col-span-12 lg:col-span-4">
            <GenerationForm
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedTopic={selectedTopic}
              onClearTopic={handleClearTopic}
            />
          </div>

          {/* Right Column: Preview & Images */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            {/* Content Preview */}
            <div className="h-[600px]">
              <ContentPreview blog={generatedBlog} onEdit={handleEditBlog} />
            </div>

            {/* Image Selector - only show when blog is generated */}
            {generatedBlog && (
              <ImageSelector
                suggestedQueries={suggestedImageQueries}
                selectedImage={selectedImage}
                onSelectImage={handleSelectImage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
