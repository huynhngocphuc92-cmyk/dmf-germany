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

// Service Comparison Content
export interface ServiceComparisonContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  criteria_label?: string;
  vietnam_label?: string;
  germany_label?: string;
  [key: string]: any; // Allow flexible keys from translation
}

// Service CTA Content
export interface ServiceCTAContent {
  title: string;
  subtitle: string;
  highlight?: string;
  cta1: string;
  cta2: string;
  [key: string]: any; // Allow flexible keys from translation
}

// Service Stats Content
export interface ServiceStatsContent {
  stat1_label?: string;
  stat2_label?: string;
  stat3_label?: string;
  stat4_label?: string;
  [key: string]: any; // Allow flexible keys from translation
}

// Service Support Content
export interface ServiceSupportContent {
  badge?: string;
  title: string;
  subtitle: string;
  year_label: string;
  year1_title?: string;
  year1_desc?: string;
  year1_item1?: string;
  year1_item2?: string;
  year1_item3?: string;
  year1_item4?: string;
  year2_title?: string;
  year2_desc?: string;
  year2_item1?: string;
  year2_item2?: string;
  year2_item3?: string;
  year2_item4?: string;
  year3_title?: string;
  year3_desc?: string;
  year3_item1?: string;
  year3_item2?: string;
  year3_item3?: string;
  year3_item4?: string;
  [key: string]: any; // Allow flexible keys from translation
}

// Service Talent Content
export interface ServiceTalentContent {
  badge?: string;
  title: string;
  subtitle: string;
  request_more: string;
  [key: string]: any; // Allow flexible keys from translation
}

// Service Process Content
export interface ServiceProcessContent {
  badge?: string;
  title: string;
  subtitle: string;
  step1_title?: string;
  step1_desc?: string;
  step2_title?: string;
  step2_desc?: string;
  step3_title?: string;
  step3_desc?: string;
  step4_title?: string;
  step4_desc?: string;
  [key: string]: any; // Allow flexible keys from translation
}

// Service Quality Content
export interface ServiceQualityContent {
  badge?: string;
  title: string;
  subtitle: string;
  prep_title: string;
  prep_item1?: string;
  prep_item2?: string;
  prep_item3?: string;
  prep_item4?: string;
  support_title: string;
  support_item1?: string;
  support_item2?: string;
  support_item3?: string;
  support_item4?: string;
  [key: string]: any; // Allow flexible keys from translation
}
