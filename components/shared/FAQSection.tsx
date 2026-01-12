'use client';
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  theme: 'blue' | 'emerald' | 'amber'; // Matches our 3 pages
}

export default function FAQSection({ title = "Häufig gestellte Fragen", subtitle, items, theme }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Theme configuration map
  const themeStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: 'bg-blue-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: 'bg-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: 'bg-amber-100' },
  };
  
  const currentTheme = themeStyles[theme];

  return (
    <section className={`py-20 ${currentTheme.bg}`}>
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-sm font-bold mb-4 ${currentTheme.icon} ${currentTheme.text}`}>
            <HelpCircle size={16} className="mr-2" />
            Q&A
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          {subtitle && <p className="text-slate-600">{subtitle}</p>}
        </div>

        {/* Accordion Items */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-xl border ${openIndex === idx ? currentTheme.border + ' shadow-md' : 'border-slate-100'} overflow-hidden transition-all duration-300`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className={`font-bold text-lg ${openIndex === idx ? currentTheme.text : 'text-slate-700'}`}>
                  {item.question}
                </span>
                <ChevronDown 
                  className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180 ' + currentTheme.text : 'text-slate-400'}`} 
                  size={20}
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
