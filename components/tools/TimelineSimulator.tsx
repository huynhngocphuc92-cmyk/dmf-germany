"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { 
  FileSignature, 
  FileText, 
  IdCard, 
  Plane, 
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  Calendar as CalendarIcon,
  School,
  ShieldCheck
} from "lucide-react";
import { 
  getTimelineSteps, 
  getStepDuration, 
  calculateTotalDuration,
  getAvailableIndustries,
  type ProductType,
  type TimelineStep
} from "@/lib/config/timeline";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface TimelineNode {
  step: TimelineStep;
  date: Date;
  cumulativeWeeks: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileSignature,
  FileText,
  IdCard,
  Plane,
  School,
  ShieldCheck,
};

export const TimelineSimulator = () => {
  const { t } = useLanguage();
  
  // Default start date: today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [productType, setProductType] = useState<ProductType>("fachkraefte");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [isAccelerated, setIsAccelerated] = useState(false);

  // Get current timeline steps based on product type and industry
  const currentTimelineSteps = useMemo(() => {
    return getTimelineSteps(productType, selectedIndustry || undefined, isAccelerated);
  }, [productType, selectedIndustry, isAccelerated]);

  // Get available industries for current product type
  const availableIndustries = useMemo(() => {
    return getAvailableIndustries(productType);
  }, [productType]);

  // Reset industry when product type changes
  React.useEffect(() => {
    setSelectedIndustry(null);
  }, [productType]);

  // Handle industry selection change
  const handleIndustryChange = (value: string) => {
    if (value === "") {
      setSelectedIndustry(null);
    } else {
      setSelectedIndustry(value);
    }
  };

  // Calculate timeline nodes
  const timelineNodes = useMemo<TimelineNode[]>(() => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const nodes: TimelineNode[] = [];
    let cumulativeWeeks = 0;
    
    currentTimelineSteps.forEach((step, index) => {
      const duration = getStepDuration(step, isAccelerated);
      cumulativeWeeks += duration;
      
      // Calculate end date for this step: start + all previous steps + current step duration
      const stepEndDate = new Date(start);
      for (let i = 0; i <= index; i++) {
        const currentStep = currentTimelineSteps[i];
        const stepDuration = getStepDuration(currentStep, isAccelerated);
        stepEndDate.setDate(stepEndDate.getDate() + stepDuration * 7);
      }
      
      nodes.push({
        step,
        date: stepEndDate,
        cumulativeWeeks,
      });
    });
    
    return nodes;
  }, [startDate, isAccelerated, currentTimelineSteps]);

  // Calculate total duration
  const totalWeeks = useMemo(() => {
    return currentTimelineSteps.reduce((total, step) => {
      return total + getStepDuration(step, isAccelerated);
    }, 0);
  }, [isAccelerated, currentTimelineSteps]);

  // Format date for display (DD.MM.YYYY)
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Format weeks text
  const formatWeeks = (weeks: number): string => {
    if (weeks === 1) {
      return t.timeline?.week_singular || "1 Woche";
    }
    return `${weeks} ${t.timeline?.week_plural || "Wochen"}`;
  };

  const IconComponent = (iconName: string) => {
    const Icon = iconMap[iconName] || Clock;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="w-full space-y-8">
      {/* Product Type Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
          <button
            onClick={() => setProductType("fachkraefte")}
            className={cn(
              "flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
              productType === "fachkraefte"
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            )}
          >
            <Briefcase className="w-4 h-4" />
            {t.roi?.tab_fachkraefte || "Fachkräfte"}
          </button>
          <button
            onClick={() => setProductType("azubi")}
            className={cn(
              "flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
              productType === "azubi"
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            )}
          >
            <GraduationCap className="w-4 h-4" />
            {t.roi?.tab_azubi || "Auszubildende"}
          </button>
          <button
            onClick={() => setProductType("saisonkraefte")}
            className={cn(
              "flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
              productType === "saisonkraefte"
                ? "bg-primary text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            )}
          >
            <CalendarIcon className="w-4 h-4" />
            {t.roi?.tab_saisonkraefte || "Saisonkräfte"}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="space-y-6">
          {/* Industry Selection Dropdown */}
          {availableIndustries && Object.keys(availableIndustries).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.roi?.industry_label || "Wählen Sie Ihre Branche"}
              </label>
              <select
                value={selectedIndustry || ""}
                onChange={(e) => handleIndustryChange(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary focus:ring-2 sm:text-sm py-2.5 px-3 border bg-white transition-colors hover:border-gray-400 cursor-pointer"
              >
                <option value="">
                  {t.roi?.industry_default || "Allgemein (Keine spezifische Branche)"}
                </option>
                {Object.entries(availableIndustries).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.label}
                  </option>
                ))}
              </select>
              {selectedIndustry && (
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t.roi?.industry_hint || "Timeline basiert auf Marktdurchschnitt für diese Branche"}
                </p>
              )}
            </div>
          )}

          {/* Start Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t.timeline?.start_date_label || "Gewünschtes Startdatum"}
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full max-w-xs"
              min={today.toISOString().split("T")[0]}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              {t.timeline?.start_date_hint || "Wählen Sie das gewünschte Startdatum für den Prozess"}
            </p>
          </div>

          {/* Accelerated Process Toggle - Only for Fachkräfte */}
          {productType === "fachkraefte" && (
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50 transition-all duration-300">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    isAccelerated ? "text-orange-500" : "text-gray-400"
                  )} />
                  <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                    {t.timeline?.accelerated_label || "Beschleunigtes Fachkräfteverfahren"}
                  </label>
                </div>
                <p className="text-xs text-gray-600">
                  {isAccelerated 
                    ? (t.timeline?.accelerated_active || "Anerkennungs-Prozess verkürzt sich um 50%")
                    : (t.timeline?.accelerated_inactive || "Standard-Prozess für Anerkennung & Visum")
                  }
                </p>
              </div>
              <Switch
                checked={isAccelerated}
                onCheckedChange={setIsAccelerated}
                className="ml-4"
              />
            </div>
          )}

          {/* Total Duration Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {t.timeline?.total_duration || "Gesamtdauer:"}
              </span>
              <span className="text-lg font-bold text-primary">
                {formatWeeks(totalWeeks)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Visualizer */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {t.timeline?.timeline_title || "Zeitplan im Detail"}
        </h3>
        
        {/* Desktop Vertical Timeline */}
        <div className="hidden md:block">
          <div className="relative pl-8">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-primary" />
            
            {timelineNodes.map((node, index) => {
              const Icon = iconMap[node.step.icon || "Clock"] || Clock;
              const isLast = index === timelineNodes.length - 1;
              
              return (
                <div
                  key={node.step.id}
                  className={cn(
                    "relative mb-8 last:mb-0 transition-all duration-500",
                    isLast && "mb-0"
                  )}
                >
                  {/* Timeline Node */}
                  <div className="flex items-start gap-4">
                    {/* Icon Circle */}
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-lg transition-all duration-300",
                        isLast
                          ? "bg-primary text-white scale-110"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content Card */}
                    <div
                      className={cn(
                        "flex-1 bg-gray-50 rounded-lg p-4 border transition-all duration-300",
                        isLast
                          ? "border-primary/30 bg-primary/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h4 className={cn(
                            "text-base font-bold mb-1",
                            isLast ? "text-primary" : "text-gray-900"
                          )}>
                            {t.timeline?.[node.step.labelKey as keyof typeof t.timeline] || node.step.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {t.timeline?.[(node.step.descriptionKey || node.step.id) as keyof typeof t.timeline] || node.step.description || ""}
                          </p>
                        </div>
                        {isLast && (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">
                            {t.timeline?.date_completed || "Abgeschlossen:"} {formatDate(node.date)}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          {formatWeeks(getStepDuration(node.step, isAccelerated))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Horizontal Timeline */}
        <div className="md:hidden space-y-4">
          {timelineNodes.map((node, index) => {
            const Icon = iconMap[node.step.icon || "Clock"] || Clock;
            const isLast = index === timelineNodes.length - 1;
            
            return (
              <div
                key={node.step.id}
                className={cn(
                  "relative pl-12 transition-all duration-500",
                  isLast && "pb-0"
                )}
              >
                {/* Vertical Line (Mobile) */}
                {index < timelineNodes.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-300" />
                )}
                
                {/* Icon Circle */}
                <div
                  className={cn(
                    "absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-lg transition-all duration-300 z-10",
                    isLast
                      ? "bg-primary text-white scale-110"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content Card */}
                <div
                  className={cn(
                    "bg-gray-50 rounded-lg p-4 border transition-all duration-300",
                    isLast
                      ? "border-primary/30 bg-primary/5 shadow-md"
                      : "border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className={cn(
                        "text-sm font-bold mb-1",
                        isLast ? "text-primary" : "text-gray-900"
                      )}>
                        {t.timeline?.[node.step.labelKey as keyof typeof t.timeline] || node.step.label}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {t.timeline?.[(node.step.descriptionKey || node.step.id) as keyof typeof t.timeline] || node.step.description || ""}
                      </p>
                    </div>
                    {isLast && (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        {t.timeline?.date_completed || "Abgeschlossen:"} {formatDate(node.date)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-700">
                      {formatWeeks(getStepDuration(node.step, isAccelerated))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
