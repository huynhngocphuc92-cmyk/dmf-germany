import React from 'react';
import { ServiceHeroProps } from './types';
import { cn } from '@/lib/utils';

const themeStyles = {
  blue: { badge: 'bg-blue-100 text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700' },
  emerald: { badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  amber: { badge: 'bg-amber-100 text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
  orange: { badge: 'bg-orange-100 text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700' },
};

export default function ServiceHeroSection({ content, theme, className }: ServiceHeroProps) {
  const styles = themeStyles[theme] || themeStyles.blue;

  return (
    <section className={cn("relative pt-32 pb-20 overflow-hidden", className)}>
      <div className="container relative z-10">
        <div className="max-w-3xl">
          {content.badge && (
            <span className={cn("inline-block px-3 py-1 rounded-full text-sm font-bold mb-6", styles.badge)}>
              {content.badge}
            </span>
          )}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            {content.title}
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl">
            {content.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className={cn("px-8 py-4 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl", styles.btn)}>
              {content.cta || "Jetzt starten"}
            </button>
            {content.cta2 && (
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                {content.cta2}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
