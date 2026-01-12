'use client';

import { CheckCircle, Star, Shield } from 'lucide-react';
import { ServiceFeaturesProps, ServiceTheme } from './types';

// Use ServiceFeaturesProps from types.ts (it already includes theme and content with flexible keys)
export function ServiceFeaturesSection(props: ServiceFeaturesProps) {
  const { content, theme = 'blue' } = props;

  if (!content) {
    console.error('ServiceFeaturesSection: content is missing');
    return null;
  }

  // Transform flat keys to array
  const features = [
    {
      title: content.advantage_1_title,
      description: content.advantage_1_desc,
      highlight: content.advantage_1_highlight,
      highlightDesc: content.advantage_1_highlight_desc,
    },
    {
      title: content.advantage_2_title,
      description: content.advantage_2_desc,
      highlight: content.advantage_2_highlight,
      highlightDesc: content.advantage_2_highlight_desc,
    },
    {
      title: content.advantage_3_title,
      description: content.advantage_3_desc,
      highlight: content.advantage_3_highlight,
      highlightDesc: content.advantage_3_highlight_desc,
    },
  ].filter(item => item.title && item.description); // Filter out empty items

  // Icons mapping
  const icons = [CheckCircle, Star, Shield];

  // Theme colors
  const themeColors: Record<ServiceTheme, { badge: string; highlight: string; icon: string }> = {
    blue: {
      badge: 'bg-blue-50 text-blue-700',
      highlight: 'bg-blue-100 text-blue-900',
      icon: 'text-blue-600',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700',
      highlight: 'bg-emerald-100 text-emerald-900',
      icon: 'text-emerald-600',
    },
    amber: {
      badge: 'bg-amber-50 text-amber-700',
      highlight: 'bg-amber-100 text-amber-900',
      icon: 'text-amber-600',
    },
    orange: {
      badge: 'bg-orange-50 text-orange-700',
      highlight: 'bg-orange-100 text-orange-900',
      icon: 'text-orange-600',
    },
  };

  const colors = themeColors[theme];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Badge & Headings */}
        <div className="text-center mb-16">
          {/* Badge */}
          {content.badge && (
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${colors.badge}`}>
                {content.badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Grid of Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = icons[index] || CheckCircle;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`mb-4 ${colors.icon}`}>
                  <Icon className="w-10 h-10" />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlight Badge */}
                {feature.highlight && (
                  <div className={`inline-block px-3 py-1.5 rounded-lg text-sm font-semibold ${colors.highlight} mb-2`}>
                    {feature.highlight}
                  </div>
                )}

                {/* Highlight Description */}
                {feature.highlightDesc && (
                  <p className="text-sm text-slate-500 mt-2">
                    {feature.highlightDesc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
