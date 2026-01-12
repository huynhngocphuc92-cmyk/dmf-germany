'use client';

import { Check, Shield, Users, Phone, Heart } from 'lucide-react';
import { ServiceSupportContent } from './types';

interface ServiceSupportSectionProps {
  content: ServiceSupportContent;
  theme?: 'blue' | 'emerald' | 'orange';
}

export function ServiceSupportSection(props: ServiceSupportSectionProps) {
  const { content } = props;

  if (!content) {
    console.error('ServiceSupportSection: content is missing');
    return null;
  }

  // Transform flat keys to arrays for each year
  const years = [
    {
      title: content.year1_title,
      description: content.year1_desc,
      items: [
        content.year1_item1,
        content.year1_item2,
        content.year1_item3,
        content.year1_item4,
      ].filter(item => item),
    },
    {
      title: content.year2_title,
      description: content.year2_desc,
      items: [
        content.year2_item1,
        content.year2_item2,
        content.year2_item3,
        content.year2_item4,
      ].filter(item => item),
    },
    {
      title: content.year3_title,
      description: content.year3_desc,
      items: [
        content.year3_item1,
        content.year3_item2,
        content.year3_item3,
        content.year3_item4,
      ].filter(item => item),
    },
  ].filter(year => year.title); // Filter out empty years

  // Icons for each year
  const yearIcons = [Shield, Users, Heart];

  // Theme colors
  const themeColors = {
    blue: {
      badge: 'bg-blue-50 text-blue-700',
      card: 'border-blue-100',
      iconBg: 'bg-blue-100 text-blue-600',
      yearBadge: 'bg-blue-600 text-white',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700',
      card: 'border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-600',
      yearBadge: 'bg-emerald-600 text-white',
    },
    orange: {
      badge: 'bg-orange-50 text-orange-700',
      card: 'border-orange-100',
      iconBg: 'bg-orange-100 text-orange-600',
      yearBadge: 'bg-orange-600 text-white',
    },
  };

  const colors = themeColors[props.theme || 'blue'];

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Badge & Headings */}
        <div className="text-center mb-16">
          {content.badge && (
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${colors.badge}`}>
                {content.badge}
              </span>
            </div>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Process/Ecosystem Grid - Premium Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {years.map((year, index) => {
            const Icon = yearIcons[index] || Shield;
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-lg border ${colors.card} p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Year Badge */}
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-bold ${colors.yearBadge} uppercase tracking-wide`}>
                    {content.year_label} {index + 1}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  {year.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {year.description}
                </p>
                
                {/* Items List with Checkmarks */}
                <ul className="space-y-3">
                  {year.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className={`w-5 h-5 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5 mr-3`}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
