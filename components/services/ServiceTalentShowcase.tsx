'use client';

import { ServiceTalentContent } from './types';

interface ServiceTalentShowcaseProps {
  content: ServiceTalentContent;
  theme?: 'blue' | 'emerald' | 'orange';
}

export function ServiceTalentShowcase(props: ServiceTalentShowcaseProps) {
  const { content } = props;

  if (!content) {
    console.error('ServiceTalentShowcase: content is missing');
    return null;
  }

  // This section only contains labels, no array transformation needed
  // The actual candidate data would come from a separate data source
  
  // Theme colors
  const themeColors = {
    blue: {
      badge: 'bg-blue-50 text-blue-700',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700',
    },
    orange: {
      badge: 'bg-orange-50 text-orange-700',
    },
  };

  const colors = themeColors[props.theme || 'blue'];

  return (
    <section className="py-24 md:py-32 bg-white">
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

        {/* Placeholder for candidate cards */}
        <div className="text-center text-slate-500 py-12">
          <p className="text-lg">
            {content.request_more}
          </p>
          {/* Note: Candidate cards would be rendered here from a separate data source */}
        </div>
      </div>
    </section>
  );
}
