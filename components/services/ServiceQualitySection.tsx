'use client';

import { ServiceQualityContent } from './types';

interface ServiceQualitySectionProps {
  content: ServiceQualityContent;
  theme?: 'blue' | 'emerald' | 'orange';
}

export function ServiceQualitySection(props: ServiceQualitySectionProps) {
  const { content } = props;

  if (!content) {
    console.error('ServiceQualitySection: content is missing');
    return null;
  }

  // Transform flat keys to arrays
  const prepItems = [
    content.prep_item1,
    content.prep_item2,
    content.prep_item3,
    content.prep_item4,
  ].filter(item => item); // Filter out empty items

  const supportItems = [
    content.support_item1,
    content.support_item2,
    content.support_item3,
    content.support_item4,
  ].filter(item => item); // Filter out empty items

  // Theme colors
  const themeColors = {
    blue: {
      badge: 'bg-blue-50 text-blue-700',
      card: 'border-blue-200 bg-blue-50/50',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700',
      card: 'border-emerald-200 bg-emerald-50/50',
    },
    orange: {
      badge: 'bg-orange-50 text-orange-700',
      card: 'border-orange-200 bg-orange-50/50',
    },
  };

  const colors = themeColors[props.theme || 'blue'];

  return (
    <section className="py-24 md:py-32 bg-slate-50">
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
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Preparation Column */}
          <div className={`border-2 rounded-xl p-6 md:p-8 ${colors.card}`}>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {content.prep_title}
            </h3>
            <ul className="space-y-4">
              {prepItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-slate-600 mr-3 mt-1">•</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className={`border-2 rounded-xl p-6 md:p-8 ${colors.card}`}>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
              {content.support_title}
            </h3>
            <ul className="space-y-4">
              {supportItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-slate-600 mr-3 mt-1">•</span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
