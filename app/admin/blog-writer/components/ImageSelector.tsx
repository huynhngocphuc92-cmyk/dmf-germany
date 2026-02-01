"use client";

import { useState, useCallback } from "react";
import { Search, Image as ImageIcon, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { ImageSuggestion } from "../types";
import { searchImages } from "../actions";
import { cn } from "@/lib/utils";

interface ImageSelectorProps {
  suggestedQueries: string[];
  selectedImage: ImageSuggestion | null;
  onSelectImage: (image: ImageSuggestion) => void;
}

export function ImageSelector({
  suggestedQueries,
  selectedImage,
  onSelectImage,
}: ImageSelectorProps) {
  const [images, setImages] = useState<ImageSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setActiveQuery(query);
    const result = await searchImages(query);

    if (result.success && result.data) {
      setImages(result.data);
    }
    setLoading(false);
  }, []);

  // Search first query on button click (not auto)
  const handleSearchFirstQuery = () => {
    if (suggestedQueries.length > 0 && images.length === 0) {
      handleSearch(suggestedQueries[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl border p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-5 h-5 text-green-500" />
        <h3 className="font-semibold text-slate-800">Cover Bild</h3>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
          placeholder="Bild suchen..."
          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Suggested Queries */}
      {suggestedQueries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {images.length === 0 && (
            <button
              onClick={handleSearchFirstQuery}
              className="px-2 py-1 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Bilder laden
            </button>
          )}
          {suggestedQueries.map((query, i) => (
            <button
              key={i}
              onClick={() => handleSearch(query)}
              className={cn(
                "px-2 py-1 text-xs rounded-full transition-colors",
                activeQuery === query
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {query}
            </button>
          ))}
        </div>
      )}

      {/* Selected Image */}
      {selectedImage && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 font-medium mb-1">Ausgewählt:</p>
          <Image
            src={selectedImage.urls.small}
            alt={selectedImage.description}
            width={400}
            height={96}
            className="w-full h-24 object-cover rounded"
            unoptimized
          />
        </div>
      )}

      {/* Image Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            <p>Klicken Sie auf &quot;Bilder laden&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => onSelectImage(image)}
                className={cn(
                  "relative rounded-lg overflow-hidden group",
                  selectedImage?.id === image.id && "ring-2 ring-green-500"
                )}
              >
                <Image
                  src={image.urls.small}
                  alt={image.description}
                  width={200}
                  height={80}
                  className="w-full h-20 object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  {selectedImage?.id === image.id ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Auswählen
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Attribution */}
      {images.length > 0 && (
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Bilder von{" "}
          <a href="https://unsplash.com" target="_blank" rel="noopener" className="underline">
            Unsplash
          </a>
        </p>
      )}
    </div>
  );
}
