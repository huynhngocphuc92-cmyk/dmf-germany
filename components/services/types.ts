import { ReactNode } from 'react';

export type ServiceTheme = 'blue' | 'emerald' | 'amber' | 'orange';

export interface BaseServiceSectionProps {
  theme: ServiceTheme;
  className?: string;
}

// Data Models (Mapped from Translations)
export interface HeroContent {
  badge?: string;
  title: string;
  description: string;
  cta?: string;
  cta2?: string;
  image?: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string | ReactNode;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Component Props
export interface ServiceHeroProps extends BaseServiceSectionProps {
  content: HeroContent;
}

export interface ServiceFeaturesProps extends BaseServiceSectionProps {
  content: {
    title?: string;
    description?: string;
    items?: FeatureItem[]; // For arrays of features
    [key: string]: any; // Allow flexible keys from translation
  };
}

export interface ServiceFAQProps extends BaseServiceSectionProps {
  items: FAQItem[];
  title?: string;
}
