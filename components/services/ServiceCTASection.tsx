'use client';

import { ServiceCTAContent } from './types';

interface ServiceCTASectionProps {
  content: ServiceCTAContent;
  theme?: 'blue' | 'emerald' | 'orange';
}

export function ServiceCTASection(props: ServiceCTASectionProps) {
  const { content } = props;

  if (!content) {
    console.error('ServiceCTASection: content is missing');
    return null;
  }

  // Theme colors
  const themeColors = {
    blue: {
      bg: 'bg-blue-600 hover:bg-blue-700',
      highlight: 'bg-blue-100 text-blue-900',
    },
    emerald: {
      bg: 'bg-emerald-600 hover:bg-emerald-700',
      highlight: 'bg-emerald-100 text-emerald-900',
    },
    orange: {
      bg: 'bg-orange-600 hover:bg-orange-700',
      highlight: 'bg-orange-100 text-orange-900',
    },
  };

  const colors = themeColors[props.theme || 'blue'];

  return (
    <section className="py-24 md:py-32 bg-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
          
          {content.highlight && (
            <div className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold mb-8 ${colors.highlight}`}>
              {content.highlight}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className={`inline-block px-8 py-4 rounded-lg text-white font-semibold transition-colors ${colors.bg}`}
            >
              {content.cta1}
            </a>
            <a
              href="#about"
              className="inline-block px-8 py-4 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
            >
              {content.cta2}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
