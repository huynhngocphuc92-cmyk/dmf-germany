'use client';

import { ServiceProcessContent } from './types';

interface ServiceProcessSectionProps {
  content: ServiceProcessContent;
  theme?: 'blue' | 'emerald' | 'orange';
}

export function ServiceProcessSection(props: ServiceProcessSectionProps) {
  const { content } = props;

  if (!content) {
    console.error('ServiceProcessSection: content is missing');
    return null;
  }

  // Transform flat keys to array
  const steps = [
    {
      title: content.step1_title,
      description: content.step1_desc,
    },
    {
      title: content.step2_title,
      description: content.step2_desc,
    },
    {
      title: content.step3_title,
      description: content.step3_desc,
    },
    {
      title: content.step4_title,
      description: content.step4_desc,
    },
  ].filter(step => step.title && step.description); // Filter out empty items

  // Theme colors
  const themeColors = {
    blue: {
      badge: 'bg-blue-50 text-blue-700',
      step: 'bg-blue-100 text-blue-900 border-blue-300',
    },
    emerald: {
      badge: 'bg-emerald-50 text-emerald-700',
      step: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    orange: {
      badge: 'bg-orange-50 text-orange-700',
      step: 'bg-orange-100 text-orange-900 border-orange-300',
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

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Step Number */}
              <div className={`absolute -top-4 left-4 w-12 h-12 rounded-full ${colors.step} border-2 flex items-center justify-center font-bold text-lg z-10`}>
                {index + 1}
              </div>
              
              {/* Step Card */}
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6 pt-10 hover:shadow-lg transition-shadow h-full">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
