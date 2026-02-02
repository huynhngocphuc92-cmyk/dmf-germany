"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SliderWithMarkerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  avgPosition: number;
  avgValue: number;
  label: string;
  hint?: string;
  id: string;
  markerType?: "german" | "dmf";
}

export const SliderWithMarker = memo(function SliderWithMarker({
  value,
  onChange,
  min,
  max,
  step,
  avgPosition,
  avgValue,
  label,
  hint,
  markerType = "german",
}: SliderWithMarkerProps) {
  const { t } = useLanguage();

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const sliderFillPercentage = ((value - min) / (max - min)) * 100;
  const clampedAvgPosition = Math.max(0, Math.min(100, avgPosition));

  const isBelowAverage = value < avgValue;
  const isAboveAverage = value > avgValue;

  const markerColors =
    markerType === "german"
      ? {
          line: "bg-orange-400",
        }
      : {
          line: "bg-green-400",
        };

  const getTrackColor = () => {
    if (markerType === "german") {
      if (isAboveAverage) return "rgb(239, 68, 68)";
      return "rgb(59, 130, 246)";
    } else {
      if (isBelowAverage) return "rgb(34, 197, 94)";
      return "rgb(59, 130, 246)";
    }
  };

  const trackColor = getTrackColor();
  const trackFillPercentage = sliderFillPercentage;
  const rightSideOpacity = 0.25;
  const isSliderRightOfMarker = sliderFillPercentage > clampedAvgPosition;

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-4">{label}</label>
      <div className="relative pt-6 pb-2">
        <div className="relative flex items-center gap-4">
          <div className="flex-1 relative h-8 flex items-center">
            {/* Faded overlay for right side of marker */}
            {clampedAvgPosition >= 0 && clampedAvgPosition <= 100 && (
              <div
                className="absolute inset-0 pointer-events-none z-0 rounded-lg overflow-hidden"
                style={{
                  left: `${clampedAvgPosition}%`,
                  right: 0,
                  background: `linear-gradient(to right, transparent 0%, rgba(0, 0, 0, ${rightSideOpacity}) 100%)`,
                }}
              />
            )}

            {/* Average Marker Vertical Line */}
            {clampedAvgPosition >= 0 && clampedAvgPosition <= 100 && (
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-5 w-0.5 z-10 pointer-events-none transition-all duration-300",
                  markerColors.line
                )}
                style={{
                  left: `${clampedAvgPosition}%`,
                  transform: "translateX(-50%) translateY(-50%)",
                }}
              />
            )}

            {/* Arrow Tooltip Marker */}
            {clampedAvgPosition >= 0 && clampedAvgPosition <= 100 && (
              <div
                className="absolute top-0 -translate-x-1/2 -translate-y-[130%] flex flex-col items-center pointer-events-none z-20 transition-all duration-300"
                style={{
                  left: `${clampedAvgPosition}%`,
                }}
              >
                <div
                  className={cn(
                    "px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-white whitespace-nowrap mb-[-1px]",
                    markerType === "german"
                      ? "bg-red-500 shadow-red-200"
                      : "bg-green-600 shadow-green-200"
                  )}
                >
                  {t.roi?.average_marker || "Ø Markt"}: {formatCurrency(avgValue)}
                </div>
                <div
                  className={cn(
                    "w-0 h-0",
                    "border-l-[6px] border-l-transparent",
                    "border-r-[6px] border-r-transparent",
                    "border-t-[8px]",
                    markerType === "german" ? "border-t-red-500" : "border-t-green-600"
                  )}
                ></div>
              </div>
            )}

            {/* Slider */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="roi-slider absolute inset-0 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer z-20 transition-all duration-200 ease-out hover:h-2.5"
              style={
                {
                  background: `linear-gradient(to right,
                  ${trackColor} 0%,
                  ${trackColor} ${trackFillPercentage}%,
                  rgba(229, 231, 235, ${isSliderRightOfMarker ? 0.4 : 1}) ${trackFillPercentage}%,
                  rgba(229, 231, 235, ${rightSideOpacity}) 100%)`,
                  "--thumb-color": trackColor,
                } as React.CSSProperties
              }
              onMouseDown={(e) => {
                e.currentTarget.classList.add("slider-active");
              }}
              onMouseUp={(e) => {
                e.currentTarget.classList.remove("slider-active");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove("slider-active");
              }}
            />
          </div>

          {/* Value Input */}
          <div className="flex items-center gap-1 min-w-[120px] justify-end">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => {
                const newValue = Math.max(min, Math.min(max, Number(e.target.value) || min));
                onChange(newValue);
              }}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-600">€</span>
          </div>
        </div>
      </div>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
});
