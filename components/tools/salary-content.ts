export interface SimulatorContent {
  title: string;
  subtitle: string;
  badge: string;
  regionLabel: string;
  regions: { west: string; east: string };
  industries: Record<string, string>;
  yearLabels: { year1: string; year2: string; year3: string; afterGrad: string };
  livingCost: string;
  disclaimer: string;
  perMonth: string;
  surplus: string;
  callToAction: string;
  unitEuro: string;
}

export const salarySimulatorContent: Record<"de" | "en" | "vn", Partial<SimulatorContent>> = {
  de: {
    subtitle: "Entdecken Sie Ihr Verdienstpotenzial während der dualen Ausbildung in Deutschland",
    badge: "Interaktives Tool",
    regionLabel: "Region",
    regions: { west: "Westdeutschland", east: "Ostdeutschland" },
    industries: {
      pflege: "Pflege",
      gastronomie: "Gastronomie",
      mechatronik: "Mechatronik",
      bau: "Bau",
    },
    livingCost: "Ø Lebenshaltungskosten",
    disclaimer:
      "Historische Brutto-Beispielwerte (2024/2025), keine aktuelle Vergütungszusage. Steuern und Sozialabgaben werden nicht berechnet; die Differenz zu Lebenshaltungskosten ist kein verfügbares Nettoeinkommen.",
    perMonth: "pro Monat",
    surplus: "Differenz vor Steuern / Abgaben",
    callToAction: "Starten Sie Ihre Karriere in Deutschland",
    unitEuro: "€",
  },
  en: {
    subtitle: "Discover your earning potential during dual training in Germany",
    badge: "Interactive Tool",
    regionLabel: "Region",
    regions: { west: "West Germany", east: "East Germany" },
    industries: {
      pflege: "Nursing",
      gastronomie: "Hospitality",
      mechatronik: "Mechatronics",
      bau: "Construction",
    },
    livingCost: "Avg. Living Costs",
    disclaimer:
      "Historical gross examples (2024/2025), not a current pay offer. Tax and social contributions are not calculated; the difference from living costs is not disposable net income.",
    perMonth: "per month",
    surplus: "Difference before tax / deductions",
    callToAction: "Start your career in Germany",
    unitEuro: "€",
  },
  vn: {
    subtitle: "Khám phá tiềm năng thu nhập trong chương trình đào tạo nghề tại Đức",
    badge: "Công cụ tương tác",
    regionLabel: "Khu vực",
    regions: { west: "Tây Đức", east: "Đông Đức" },
    industries: {
      pflege: "Điều dưỡng",
      gastronomie: "Nhà hàng/KS",
      mechatronik: "Cơ điện tử",
      bau: "Xây dựng",
    },
    livingCost: "Chi phí sinh hoạt TB",
    disclaimer:
      "Số liệu lương gộp minh họa cũ (2024/2025), không phải cam kết lương hiện tại. Chưa trừ thuế và bảo hiểm; chênh lệch với sinh hoạt phí không phải thu nhập ròng khả dụng.",
    perMonth: "mỗi tháng",
    surplus: "Chênh lệch trước thuế / bảo hiểm",
    callToAction: "Bắt đầu sự nghiệp tại Đức",
    unitEuro: "€",
  },
};
