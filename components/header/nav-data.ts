import type { LucideIcon } from "lucide-react";
import {
  // Users, // TODO: Uncomment when candidates pool is enabled
  MapPin,
  Calculator,
  Calendar,
  GraduationCap,
  School,
  Briefcase,
} from "lucide-react";

// Navigation item types
export interface NavItem {
  href: string;
  labelKey: string;
  icon?: LucideIcon;
}

export interface DropdownItem extends NavItem {
  descKey?: string;
}

export interface NavDropdownConfig {
  labelKey: string;
  icon?: LucideIcon;
  items: DropdownItem[];
  activeRoutes?: string[];
}

// Language options
export const LANGUAGE_OPTIONS = [
  { code: "de" as const, label: "DE" },
  { code: "en" as const, label: "EN" },
  { code: "vn" as const, label: "VN" },
] as const;

// Solutions dropdown items
export const SOLUTIONS_ITEMS: DropdownItem[] = [
  { href: "/services/azubi", labelKey: "azubi" },
  { href: "/services/skilled-workers", labelKey: "skilled_workers" },
  { href: "/services/seasonal", labelKey: "seasonal" },
];

// Für Arbeitgeber dropdown items
export const EMPLOYER_ITEMS: DropdownItem[] = [
  {
    href: "/referenzen",
    labelKey: "references",
    descKey: "references_desc",
    icon: MapPin,
  },
  {
    href: "/roi-rechner",
    labelKey: "roi_calculator",
    descKey: "roi_calculator_desc",
    icon: Calculator,
  },
  {
    href: "/fuer-arbeitgeber/zeitplan",
    labelKey: "timeline",
    descKey: "timeline_desc",
    icon: Calendar,
  },
  // TODO: Uncomment when candidates pool has profiles
  // {
  //   href: "/fuer-arbeitgeber/kandidaten",
  //   labelKey: "candidates",
  //   descKey: "candidates_desc",
  //   icon: Users,
  // },
];

// Employer active routes for highlighting
export const EMPLOYER_ACTIVE_ROUTES = [
  "/referenzen",
  "/roi-rechner",
  "/fuer-arbeitgeber/zeitplan",
  // "/fuer-arbeitgeber/kandidaten", // TODO: Uncomment when candidates pool has profiles
];

// Kooperation & Programme dropdown items
export const COOPERATION_ITEMS: DropdownItem[] = [
  {
    href: "/ueber-uns/ausbildung",
    labelKey: "dual_training",
    descKey: "dual_training_desc",
    icon: GraduationCap,
  },
  {
    href: "/ueber-uns/studium",
    labelKey: "study_germany",
    descKey: "study_germany_desc",
    icon: School,
  },
  {
    href: "/ueber-uns/skilled-workers",
    labelKey: "skilled_program",
    descKey: "skilled_program_desc",
    icon: Briefcase,
  },
];

// Cooperation active routes for highlighting
export const COOPERATION_ACTIVE_ROUTES = [
  "/ueber-uns/ausbildung",
  "/ueber-uns/studium",
  "/ueber-uns/skilled-workers",
];

// Translation helpers for cooperation dropdown
export function getCooperationLabel(labelKey: string, lang: string): string {
  const labels: Record<string, Record<string, string>> = {
    cooperation: {
      de: "Kooperation & Programme",
      en: "Cooperation & Programs",
      vn: "Hợp tác & Chương trình",
    },
    dual_training: {
      de: "Duale Ausbildung",
      en: "Vocational Training",
      vn: "Du học Nghề",
    },
    dual_training_desc: {
      de: "Vocational program für Azubis",
      en: "Dual training for apprentices",
      vn: "Chương trình đào tạo nghề kép",
    },
    study_germany: {
      de: "Studium in Deutschland",
      en: "University Studies",
      vn: "Du học Đại học",
    },
    study_germany_desc: {
      de: "Universitätsprogramm mit TestAS Coaching",
      en: "University program with TestAS coaching",
      vn: "Chương trình đại học với TestAS",
    },
    skilled_program: {
      de: "Fachkräfte-Programm",
      en: "Skilled Workers Program",
      vn: "Lao động Chuyên môn",
    },
    skilled_program_desc: {
      de: "§18a/b mit Anerkennung & Placement",
      en: "§18a/b with recognition & placement",
      vn: "§18a/b với công nhận & tuyển dụng",
    },
  };
  return labels[labelKey]?.[lang] || labels[labelKey]?.de || labelKey;
}

// Translation helpers for solutions dropdown
export function getSolutionLabel(labelKey: string, lang: string): string {
  const labels: Record<string, Record<string, string>> = {
    azubi: {
      de: "Auszubildende",
      en: "Apprentices",
      vn: "Du học nghề",
    },
    skilled_workers: {
      de: "Fachkräfte",
      en: "Skilled Workers",
      vn: "Nhân sự chuyên môn",
    },
    seasonal: {
      de: "Saisonkräfte",
      en: "Seasonal Workers",
      vn: "Lao động thời vụ",
    },
  };
  return labels[labelKey]?.[lang] || labels[labelKey]?.de || labelKey;
}
