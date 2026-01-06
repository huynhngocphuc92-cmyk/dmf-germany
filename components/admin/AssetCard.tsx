"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  Palette,
  Type,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import type { SiteConfigItem, ThemeLanguage } from "@/types/theme";
import { themeTranslations } from "@/types/theme";
import {
  updateSiteConfig,
  uploadThemeImage,
  deleteThemeImage,
} from "@/actions/theme-actions";

// ============================================
// ASSET CARD COMPONENT
// ============================================

interface AssetCardProps {
  item: SiteConfigItem;
  lang: ThemeLanguage;
  onUpdate: (newValue: string | null) => void;
}

export const AssetCard = ({ item, lang, onUpdate }: AssetCardProps) => {
  const t = themeTranslations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  
  // Get current value based on asset type
  // Note: site_assets table uses 'value' column for all asset types
  const getCurrentValue = (): string | null => {
    return item.value ?? null;
  };

  const [currentValue, setCurrentValue] = useState<string | null>(getCurrentValue());
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    item.asset_type === "image" ? getCurrentValue() : null
  );

  // Handle image upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error(lang === "de" ? "Datei zu groß" : "File quá lớn", {
        description: t.maxSize,
      });
      return;
    }

    setIsUploading(true);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Upload to storage
      const formData = new FormData();
      formData.append("file", file);

      const { url, error: uploadError } = await uploadThemeImage(formData);

      if (uploadError || !url) {
        throw new Error(uploadError || "Upload failed");
      }

      // Delete old image if exists
      const oldUrl = getCurrentValue();
      if (oldUrl) {
        await deleteThemeImage(oldUrl);
      }

      // Update database
      startTransition(async () => {
        const { error } = await updateSiteConfig(item.key, url, "image");
        if (error) {
          toast.error(t.uploadError, { description: error });
          setPreviewUrl(oldUrl);
          setCurrentValue(oldUrl);
        } else {
          toast.success(t.uploadSuccess);
          setPreviewUrl(url);
          setCurrentValue(url);
          onUpdate(url);
        }
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(t.uploadError);
      setPreviewUrl(getCurrentValue());
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle remove image
  const handleRemoveImage = async () => {
    const oldUrl = getCurrentValue();
    if (!oldUrl) return;

    startTransition(async () => {
      try {
        // Delete from storage
        await deleteThemeImage(oldUrl);

        // Update database
        const { error } = await updateSiteConfig(item.key, null, "image");
        if (error) {
          toast.error(t.uploadError, { description: error });
        } else {
          toast.success(lang === "de" ? "Bild entfernt" : "Đã xóa ảnh");
          setPreviewUrl(null);
          setCurrentValue(null);
          onUpdate(null);
        }
      } catch (err) {
        console.error("Remove error:", err);
        toast.error(t.uploadError);
      }
    });
  };

  // Handle value update (for color, text, boolean)
  const handleValueUpdate = async (newValue: string | null) => {
    const oldValue = getCurrentValue();
    setCurrentValue(newValue);

    startTransition(async () => {
      const { error } = await updateSiteConfig(item.key, newValue, item.asset_type);
      if (error) {
        toast.error(t.uploadError, { description: error });
        setCurrentValue(oldValue);
      } else {
        toast.success(t.uploadSuccess);
        onUpdate(newValue);
      }
    });
  };

  // Handle boolean toggle
  const handleBooleanToggle = (checked: boolean) => {
    handleValueUpdate(checked ? "true" : "false");
  };

  const isLoading = isPending || isUploading;
  const currentVal = getCurrentValue();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulate initial loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Render based on asset type
  const renderAssetInput = () => {
    switch (item.asset_type) {
      case "image":
        return (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-200">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt={item.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {t.changeImage}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemoveImage}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                  ) : (
                    <>
                      <ImagePlus className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-sm text-slate-400">{t.noImage}</p>
                      <p className="text-xs text-slate-400 mt-1">{t.dragDrop}</p>
                    </>
                  )}
                </div>
              )}

              {/* Loading overlay */}
              {isLoading && previewUrl && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">{t.uploading}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isLoading}
            />

            {/* Upload button (shown when no image) */}
            {!previewUrl && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {t.uploadImage}
              </Button>
            )}

            {/* Meta info */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t.supportedFormats}</span>
              <span>{t.maxSize}</span>
            </div>
          </div>
        );

      case "color":
        return (
          <div className="space-y-3">
            <Label htmlFor={`color-${item.key}`}>{t.selectColor}</Label>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-20 h-10 p-1"
                    disabled={isLoading}
                  >
                    <div
                      className="w-full h-full rounded border-2 border-slate-300"
                      style={{
                        backgroundColor: currentVal || "#000000",
                      }}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-3">
                    <Input
                      type="color"
                      value={currentVal || "#000000"}
                      onChange={(e) => handleValueUpdate(e.target.value)}
                      className="h-12 w-full cursor-pointer"
                      disabled={isLoading}
                    />
                    <Input
                      type="text"
                      value={currentVal || ""}
                      onChange={(e) => handleValueUpdate(e.target.value)}
                      placeholder="#000000"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      className="font-mono"
                      disabled={isLoading}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                id={`color-${item.key}`}
                type="text"
                value={currentVal || ""}
                onChange={(e) => handleValueUpdate(e.target.value)}
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
                className="flex-1 font-mono"
                disabled={isLoading}
              />
            </div>
          </div>
        );

      case "text":
        // Use textarea for longer descriptions, input for short text
        const isLongText = item.key.includes("description") || item.key.includes("subtitle");
        return (
          <div className="space-y-3">
            <Label htmlFor={`text-${item.key}`}>
              {isLongText ? t.enterText : item.key.includes("url") ? t.enterUrl : t.enterText}
            </Label>
            {isLongText ? (
              <Textarea
                id={`text-${item.key}`}
                value={currentVal || ""}
                onChange={(e) => handleValueUpdate(e.target.value)}
                placeholder={item.description || ""}
                rows={4}
                disabled={isLoading}
              />
            ) : (
              <Input
                id={`text-${item.key}`}
                type="text"
                value={currentVal || ""}
                onChange={(e) => handleValueUpdate(e.target.value)}
                placeholder={item.description || ""}
                disabled={isLoading}
              />
            )}
          </div>
        );

      case "boolean":
        const isEnabled = currentVal === "true";
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor={`boolean-${item.key}`} className="cursor-pointer">
                {isEnabled ? t.toggleOn : t.toggleOff}
              </Label>
              <div className="flex items-center gap-2">
                {isEnabled ? (
                  <ToggleRight className="w-6 h-6 text-primary" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                )}
                <Switch
                  id={`boolean-${item.key}`}
                  checked={isEnabled}
                  onCheckedChange={handleBooleanToggle}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show skeleton during initial load
  if (isInitialLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="w-4 h-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            {/* Icon based on asset type */}
            {item.asset_type === "image" && (
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <ImagePlus className="w-4 h-4 text-blue-600" />
              </div>
            )}
            {item.asset_type === "color" && (
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Palette className="w-4 h-4 text-purple-600" />
              </div>
            )}
            {item.asset_type === "text" && (
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Type className="w-4 h-4 text-green-600" />
              </div>
            )}
            {item.asset_type === "boolean" && (
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <ToggleLeft className="w-4 h-4 text-orange-600" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-slate-900">
                {item.label}
              </CardTitle>
              {item.description && (
                <CardDescription className="text-xs mt-1 text-slate-500">
                  {item.description}
                </CardDescription>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-slate-50">
            {item.key}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {renderAssetInput()}
      </CardContent>
    </Card>
  );
};

