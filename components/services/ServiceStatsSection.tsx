'use client';

import { ServiceStatsContent } from './types';

interface ServiceStatsSectionProps {
  content: ServiceStatsContent;
  theme?: 'blue' | 'emerald' | 'orange';
}

export function ServiceStatsSection(props: ServiceStatsSectionProps) {
  const { content } = props;

  if (!content) {
    console.error('ServiceStatsSection: content is missing');
    return null;
  }

  // Transform labels to stats array
  const stats = [
    {
      value: '500+',
      label: content.stat1_label,
    },
    {
      value: '98%',
      label: content.stat2_label,
    },
    {
      value: '90%',
      label: content.stat3_label,
    },
    {
      value: '3',
      label: content.stat4_label,
    },
  ];

  // Theme colors for gradients
  const themeColors = {
    blue: {
      gradient: 'bg-gradient-to-r from-blue-600 to-blue-400',
      cardBorder: 'border-blue-100',
    },
    emerald: {
      gradient: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
      cardBorder: 'border-emerald-100',
    },
    orange: {
      gradient: 'bg-gradient-to-r from-orange-600 to-orange-400',
      cardBorder: 'border-orange-100',
    },
  };

  const colors = themeColors[props.theme || 'blue'];

  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Impact Grid - Premium Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              {/* Big Number - Gradient */}
              <div className="mb-4">
                <div
                  className={`text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent ${colors.gradient}`}
                >
                  {stat.value}
                </div>
              </div>
              {/* Label - Uppercase with Tracking */}
              <div className="text-xs md:text-sm uppercase tracking-wider text-slate-500 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
