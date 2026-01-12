'use client';

import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { ServiceComparisonContent } from './types';

interface ServiceComparisonSectionProps {
  content: ServiceComparisonContent;
  theme?: 'blue' | 'emerald' | 'orange';
}

export function ServiceComparisonSection({ content, theme = 'blue' }: ServiceComparisonSectionProps) {
  if (!content) return null;

  // Manual mapping for the rows (since data structure is flat/complex)
  const comparisonRows = [
    { criteria: "Motivation & Loyalty", vietnam: true, germany: false, note: "High retention rate" },
    { criteria: "Age Structure", vietnam: true, germany: false, note: "Young demographics (18-25)" },
    { criteria: "Technical Foundation", vietnam: true, germany: true, note: "Solid school education" },
    { criteria: "Cultural Adaptation", vietnam: true, germany: false, note: "Willingness to integrate" },
    { criteria: "Availability", vietnam: true, germany: false, note: "Large talent pool available" },
  ];

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {content.badge && (
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-blue-700 text-sm font-bold tracking-wide mb-4 uppercase">
              {content.badge}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title || "Vietnam vs. Domestic Market"}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {content.subtitle || "Why recruiting from Vietnam is the strategic advantage you need right now."}
          </p>
        </div>

        {/* Premium Feature Comparison Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {/* Header Row - Dark Background */}
          <div className="grid grid-cols-12 bg-slate-900 text-white text-sm md:text-base font-bold uppercase tracking-wider">
            <div className="col-span-4 p-5 md:p-6 flex items-center">
              {content.criteria_label || "Criteria"}
            </div>
            <div className="col-span-4 p-5 md:p-6 bg-blue-600 flex items-center justify-center border-l border-blue-500">
              {content.vietnam_label || "Azubis from Vietnam"}
            </div>
            <div className="col-span-4 p-5 md:p-6 flex items-center justify-center text-slate-400 border-l border-slate-700">
              {content.germany_label || "Domestic Market"}
            </div>
          </div>

          {/* Table Body - Zebra Striping */}
          <div className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-12 transition-colors duration-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                } hover:bg-blue-50/30`}
              >
                {/* Criteria Column */}
                <div className="col-span-4 p-5 md:p-6 flex items-center">
                  <span className="text-base font-semibold text-slate-900">{row.criteria}</span>
                </div>

                {/* Vietnam Column (Highlighted) */}
                <div className="col-span-4 p-5 md:p-6 bg-blue-50/30 flex flex-col items-center justify-center border-x border-slate-100">
                  {row.vietnam ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                      </div>
                      {row.note && (
                        <span className="text-xs font-semibold text-green-700 text-center">{row.note}</span>
                      )}
                    </>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Minus className="w-5 h-5 text-slate-400" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Germany Column */}
                <div className="col-span-4 p-5 md:p-6 flex items-center justify-center">
                  {row.germany ? (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-slate-400" strokeWidth={2} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                      <X className="w-5 h-5 text-red-400" strokeWidth={2} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
