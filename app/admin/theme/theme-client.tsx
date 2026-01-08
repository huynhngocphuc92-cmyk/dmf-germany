"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Info,
  RefreshCw,
  Home,
  Layout,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useLanguage } from "@/components/providers/LanguageProvider";
import type { SiteConfigItem, SiteConfigGrouped, ThemeSection } from "@/types/theme";
import { sectionLabelsI18n, themeTranslations, ThemeLanguage } from "@/types/theme";
import { AssetCard } from "@/components/admin/AssetCard";

// ============================================
// THEME MANAGER CLIENT COMPONENT
// ============================================

interface ThemeManagerClientProps {
  initialConfigs: SiteConfigGrouped;
}

export function ThemeManagerClient({ initialConfigs }: ThemeManagerClientProps) {
  const router = useRouter();
  const { lang: currentLang } = useLanguage();
  const lang = (currentLang === "de" ? "de" : "vn") as ThemeLanguage;
  const t = themeTranslations[lang];

  const [configs, setConfigs] = useState<SiteConfigGrouped>(initialConfigs);
  const sections: ThemeSection[] = ["identity", "home", "header_footer", "contact", "system"];
  
  // Default to identity tab
  const [activeTab, setActiveTab] = useState<string>("identity");

  // Mapping: UI Tab -> Database Section
  const sectionMap: Record<ThemeSection, string> = {
    "identity": "branding",        // Tab "Nhận diện" -> DB section "branding"
    "home": "home",                // Tab "Trang Chủ" -> DB section "home"
    "header_footer": "branding",   // Tab "Header & Footer" -> DB section "branding"
    "contact": "contact",          // Tab "Liên Hệ" -> DB section "contact"
    "system": "settings",          // Tab "Cài Đặt" -> DB section "settings"
  };

  // Icon mapping for tabs
  const tabIcons: Record<ThemeSection, React.ReactNode> = {
    identity: <Sparkles className="w-4 h-4" />,
    home: <Home className="w-4 h-4" />,
    header_footer: <Layout className="w-4 h-4" />,
    contact: <Mail className="w-4 h-4" />,
    system: <Settings className="w-4 h-4" />,
  };

  // Get filtered configs for current tab
  const getFilteredConfigs = (tab: ThemeSection): SiteConfigItem[] => {
    const dbSection = sectionMap[tab];
    // Get all items from all sections that match the DB section
    const allItems: SiteConfigItem[] = [];
    Object.values(configs).forEach((items) => {
      items.forEach((item) => {
        // Match by DB section name (branding, home, contact, settings)
        if (item.section === dbSection) {
          allItems.push(item);
        }
      });
    });
    
    // Debug logging
    if (allItems.length > 0) {
      console.log(`Tab "${tab}" (DB: "${dbSection}"): Found ${allItems.length} items`);
    }
    
    return allItems;
  };

  // Debug: Log configs structure on mount and when configs change
  useEffect(() => {
    console.log("Theme Manager - Configs structure:", {
      sections: Object.keys(configs),
      totalItems: Object.values(configs).reduce((sum, items) => sum + items.length, 0),
      sectionBreakdown: Object.entries(configs).map(([section, items]) => ({
        section,
        count: items.length,
        sampleKeys: items.slice(0, 3).map((i) => i.key),
        assetTypes: items.map((i) => i.asset_type),
      })),
    });
  }, [configs]);

  const handleUpdate = (dbSection: string, key: string, newValue: string | null) => {
    setConfigs((prev) => {
      const updated = { ...prev };
      // Update in all sections that might contain this item
      // Note: site_assets uses 'value' column for all asset types
      Object.keys(updated).forEach((section) => {
        updated[section] = updated[section].map((item) =>
          item.key === key
            ? {
                ...item,
                value: newValue,
                // image_url is deprecated, keep for backward compatibility in UI only
                image_url: newValue,
              }
            : item
        );
      });
      return updated;
    });
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t.pageTitle}</h1>
            <p className="text-sm text-slate-500 mt-1">{t.pageDesc}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // Refresh data from server - this will trigger a re-fetch
            router.refresh();
            toast.success(lang === "de" ? "Aktualisiert" : "Đã làm mới");
          }}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {lang === "de" ? "Aktualisieren" : "Làm mới"}
        </Button>
      </div>

      {/* No configs warning */}
      {Object.keys(configs).length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Info className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {lang === "de" ? "Keine Konfigurationen gefunden" : "Chưa có cấu hình nào"}
            </h3>
            <p className="text-slate-500 text-center mb-6 max-w-md">
              {lang === "de"
                ? "Bitte erstellen Sie Einträge in der site_config Tabelle. Siehe Dokumentation für Seed-Daten."
                : "Vui lòng tạo dữ liệu trong bảng site_config. Xem tài liệu để biết seed data."}
            </p>
            <Button variant="outline" onClick={() => router.refresh()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {lang === "de" ? "Aktualisieren" : "Làm mới"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Tabs by Section */
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-100 p-1.5 h-auto flex-wrap gap-1.5 w-full justify-start">
            {sections.map((section) => {
              const filteredConfigs = getFilteredConfigs(section);
              return (
                <TabsTrigger
                  key={section}
                  value={section}
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary px-4 py-2.5 flex items-center gap-2 font-medium transition-all"
                >
                  {tabIcons[section]}
                  <span>{sectionLabelsI18n[section]?.[lang] || section}</span>
                  {filteredConfigs.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 text-xs font-semibold">
                      {filteredConfigs.length}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {sections.map((section) => {
            const filteredConfigs = getFilteredConfigs(section);
            const dbSection = sectionMap[section];
            
            return (
              <TabsContent key={section} value={section} className="space-y-6 mt-6">
                {filteredConfigs.length === 0 ? (
                  <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Info className="w-10 h-10 text-slate-300 mb-3" />
                      <p className="text-slate-500 text-center text-sm">
                        {lang === "de"
                          ? `Keine Konfigurationen für "${sectionLabelsI18n[section]?.[lang]}" gefunden.`
                          : `Chưa có cấu hình cho "${sectionLabelsI18n[section]?.[lang]}".`}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        (DB Section: {dbSection})
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredConfigs.map((item) => (
                      <AssetCard
                        key={item.key}
                        item={item}
                        lang={lang}
                        onUpdate={(newValue) => handleUpdate(dbSection, item.key, newValue)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

// ============================================
// SKELETON LOADER
// ============================================

export function ThemeManagerSkeleton() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
