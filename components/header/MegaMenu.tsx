"use client";

import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  Heart,
  UtensilsCrossed,
  Wrench,
  Truck,
  GraduationCap,
  Briefcase,
  Sun,
  type LucideIcon,
} from "lucide-react";

// ============================================
// MEGA MENU COMPONENT
// ============================================

interface IndustryItem {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bgColor: string;
}

interface MegaMenuProps {
  language: "de" | "vn";
  industries: Array<{ name: string; description: string }>;
  serviceSolutions: Array<{
    titleDe: string;
    titleVn: string;
    descDe: string;
    descVn: string;
    href: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
  }>;
}

// Icon mapping for industries
const industryIconMap: Record<string, LucideIcon> = {
  "Gesundheit & Pflege": Heart,
  "Hotellerie & Gastronomie": UtensilsCrossed,
  "Technik & IT": Wrench,
  "Handwerk & Produktion": Wrench,
  "Logistik & Handel": Truck,
  // Vietnamese
  "Y tế & Điều dưỡng": Heart,
  "Khách sạn & Nhà hàng": UtensilsCrossed,
  "Kỹ thuật & CNTT": Wrench,
  "Thủ công & Sản xuất": Wrench,
  "Logistics & Thương mại": Truck,
};

// Color schemes for industries
const industryColors: Record<string, { color: string; bgColor: string }> = {
  "Gesundheit & Pflege": { color: "text-rose-600", bgColor: "bg-rose-50" },
  "Hotellerie & Gastronomie": { color: "text-amber-600", bgColor: "bg-amber-50" },
  "Technik & IT": { color: "text-blue-600", bgColor: "bg-blue-50" },
  "Handwerk & Produktion": { color: "text-slate-600", bgColor: "bg-slate-50" },
  "Logistik & Handel": { color: "text-emerald-600", bgColor: "bg-emerald-50" },
  // Vietnamese
  "Y tế & Điều dưỡng": { color: "text-rose-600", bgColor: "bg-rose-50" },
  "Khách sạn & Nhà hàng": { color: "text-amber-600", bgColor: "bg-amber-50" },
  "Kỹ thuật & CNTT": { color: "text-blue-600", bgColor: "bg-blue-50" },
  "Thủ công & Sản xuất": { color: "text-slate-600", bgColor: "bg-slate-50" },
  "Logistics & Thương mại": { color: "text-emerald-600", bgColor: "bg-emerald-50" },
};

export const MegaMenu = ({ language, industries, serviceSolutions }: MegaMenuProps) => {
  // Map industries with icons and colors
  const industriesWithData: IndustryItem[] = industries.map((industry) => {
    const Icon = industryIconMap[industry.name] || Wrench;
    const colors = industryColors[industry.name] || { color: "text-gray-600", bgColor: "bg-gray-50" };
    
    return {
      ...industry,
      icon: Icon,
      href: "/#services", // Default href, can be customized per industry
      ...colors,
    };
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Service Solutions */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            {language === "de" ? "Unsere Lösungen" : "Giải pháp của chúng tôi"}
          </h3>
          <div className="space-y-3">
            {serviceSolutions.map((service) => {
              const Icon = service.icon;
              return (
                <NavigationMenuLink asChild key={service.href}>
                  <Link
                    href={service.href}
                    className={cn(
                      "group flex items-start gap-4 p-4 rounded-xl border transition-all",
                      "hover:shadow-md hover:scale-[1.02]",
                      service.bgColor,
                      service.borderColor
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                        service.bgColor,
                        "border",
                        service.borderColor
                      )}
                    >
                      <Icon className={cn("w-6 h-6", service.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-base font-semibold mb-1", service.color)}>
                        {language === "de" ? service.titleDe : service.titleVn}
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">
                        {language === "de" ? service.descDe : service.descVn}
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              );
            })}
          </div>
        </div>

        {/* Right Column: Industries */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            {language === "de" ? "Branchen & Berufsfelder" : "Ngành nghề & Lĩnh vực"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {industriesWithData.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <NavigationMenuLink asChild key={index}>
                  <Link
                    href={industry.href}
                    className={cn(
                      "group flex items-start gap-3 p-4 rounded-xl border transition-all",
                      "hover:shadow-md hover:scale-[1.02]",
                      industry.bgColor,
                      "border-border/50 hover:border-primary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        industry.bgColor,
                        "border border-border/50"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", industry.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-sm font-semibold mb-1", industry.color)}>
                        {industry.name}
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                        {industry.description}
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

