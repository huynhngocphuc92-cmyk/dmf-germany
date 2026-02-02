/**
 * Timeline Configuration for DMF Recruitment Process
 * Defines the steps and duration for the recruitment timeline simulator
 */

export type ProductType = "fachkraefte" | "azubi" | "saisonkraefte";

export interface TimelineStep {
  id: string;
  label: string;
  labelKey: string; // Translation key
  durationWeeks: number; // Duration in weeks for standard process
  durationWeeksAccelerated?: number; // Optional: Duration for accelerated process
  icon?: string; // Icon name (to be used with lucide-react)
  description?: string;
  descriptionKey?: string;
}

export interface TimelineConfig {
  standard: TimelineStep[];
  accelerated: TimelineStep[];
}

export interface IndustryTimelineConfig {
  label: string;
  recognition?: number; // Override recognition/visa duration for this industry (in weeks)
  schoolSearch?: number; // For Azubi: school search duration override
  zav?: number; // For Seasonal: ZAV approval duration override
}

export interface ProductTimelineConfig {
  defaultDuration: Record<string, number>; // Step durations in weeks
  industries?: Record<string, IndustryTimelineConfig>;
}

export interface TimelineDataConfig {
  skilled: ProductTimelineConfig;
  azubi: ProductTimelineConfig;
  seasonal: ProductTimelineConfig;
}

/**
 * Timeline Data Configuration
 * Defines duration for each product type and industry
 */
export const TIMELINE_DATA: TimelineDataConfig = {
  skilled: {
    // Fachkräfte
    defaultDuration: {
      recruit: 3, // Rekrutierung & Kandidatensuche
      docs: 4, // Dokumentenvorbereitung
      recognition: 12, // Anerkennung & Visum (standard)
      visa: 4, // Visa processing
      einreise: 1, // Einreise & Arbeitsbeginn
    },
    industries: {
      pflege: {
        label: "Pflege & Medizin",
        recognition: 16, // Y tế xét duyệt lâu hơn
      },
      handwerk: {
        label: "Handwerk & Bau",
        recognition: 10,
      },
      it: {
        label: "IT & Technik",
        recognition: 4, // IT thường nhanh hơn (Blue Card)
      },
      gastro: {
        label: "Hotel & Gastro",
        recognition: 8,
      },
    },
  },
  azubi: {
    // Ausbildung
    defaultDuration: {
      recruit: 4, // Rekrutierung
      docs: 4, // Dokumentenvorbereitung
      schoolSearch: 8, // Schulplatzsuche (tìm trường)
      visa: 6, // Visa processing
      einreise: 1, // Einreise & Arbeitsbeginn
    },
    industries: {
      pflege: {
        label: "Pflege (Azubi)",
      },
      gastro: {
        label: "Hotel/Küche (Azubi)",
      },
      handwerk: {
        label: "Handwerk (Azubi)",
      },
    },
  },
  seasonal: {
    // Saisonkräfte
    defaultDuration: {
      recruit: 2, // Rekrutierung (nhanh hơn)
      docs: 1, // Dokumentenvorbereitung (tối giản)
      zav: 2, // ZAV-Genehmigung
      visa: 2, // Visa processing (nhanh)
      einreise: 1, // Einreise & Arbeitsbeginn
    },
    industries: {
      agriculture: {
        label: "Landwirtschaft",
      },
      logistics: {
        label: "Lager & Logistik",
      },
      service: {
        label: "Service & Gastro",
      },
    },
  },
} as const;

/**
 * Map productType to TIMELINE_DATA key
 */
const getTimelineDataKey = (productType: ProductType): keyof TimelineDataConfig => {
  switch (productType) {
    case "fachkraefte":
      return "skilled";
    case "azubi":
      return "azubi";
    case "saisonkraefte":
      return "seasonal";
    default:
      return "skilled";
  }
};

/**
 * Get timeline steps configuration for a product type
 */
export const getTimelineSteps = (
  productType: ProductType,
  industryKey?: string,
  isAccelerated: boolean = false
): TimelineStep[] => {
  const dataKey = getTimelineDataKey(productType);
  const productData = TIMELINE_DATA[dataKey];
  const industry = industryKey ? productData.industries?.[industryKey] : undefined;

  switch (productType) {
    case "fachkraefte": {
      const recognitionWeeks = industry?.recognition ?? productData.defaultDuration.recognition;
      const recognitionDuration = isAccelerated
        ? Math.max(6, Math.floor(recognitionWeeks * 0.5))
        : recognitionWeeks;

      return [
        {
          id: "auftrag",
          label: "Auftragserteilung",
          labelKey: "timeline_step_auftrag",
          durationWeeks: productData.defaultDuration.recruit,
          description: "Vertragsunterzeichnung und Kandidatensuche",
          descriptionKey: "timeline_step_auftrag_desc",
          icon: "FileSignature",
        },
        {
          id: "dokumente",
          label: "Dokumentenvorbereitung",
          labelKey: "timeline_step_dokumente",
          durationWeeks: productData.defaultDuration.docs,
          description: "Übersetzung und Beglaubigung",
          descriptionKey: "timeline_step_dokumente_desc",
          icon: "FileText",
        },
        {
          id: "visum",
          label: "Anerkennung & Visum",
          labelKey: "timeline_step_visum",
          durationWeeks: recognitionDuration,
          durationWeeksAccelerated: Math.max(6, Math.floor(recognitionWeeks * 0.5)),
          description: "Visaantrag und Qualifikationsanerkennung",
          descriptionKey: "timeline_step_visum_desc",
          icon: "IdCard",
        },
        {
          id: "einreise",
          label: "Einreise & Arbeitsbeginn",
          labelKey: "timeline_step_einreise",
          durationWeeks: productData.defaultDuration.einreise,
          description: "Einreise nach Deutschland und Arbeitsantritt",
          descriptionKey: "timeline_step_einreise_desc",
          icon: "Plane",
        },
      ];
    }

    case "azubi": {
      return [
        {
          id: "auftrag",
          label: "Auftragserteilung",
          labelKey: "timeline_step_auftrag",
          durationWeeks: productData.defaultDuration.recruit,
          description: "Vertragsunterzeichnung und Kandidatensuche",
          descriptionKey: "timeline_step_auftrag_desc",
          icon: "FileSignature",
        },
        {
          id: "dokumente",
          label: "Dokumentenvorbereitung",
          labelKey: "timeline_step_dokumente",
          durationWeeks: productData.defaultDuration.docs,
          description: "Übersetzung und Beglaubigung",
          descriptionKey: "timeline_step_dokumente_desc",
          icon: "FileText",
        },
        {
          id: "schoolSearch",
          label: "Schulplatzsuche",
          labelKey: "timeline_step_school",
          durationWeeks: productData.defaultDuration.schoolSearch || 8,
          description: "Suche nach Ausbildungsplatz",
          descriptionKey: "timeline_step_school_desc",
          icon: "School",
        },
        {
          id: "visum",
          label: "Visum & Genehmigung",
          labelKey: "timeline_step_visum",
          durationWeeks: productData.defaultDuration.visa,
          description: "Visaantrag für Auszubildende",
          descriptionKey: "timeline_step_visum_desc",
          icon: "IdCard",
        },
        {
          id: "einreise",
          label: "Einreise & Ausbildungsbeginn",
          labelKey: "timeline_step_einreise",
          durationWeeks: productData.defaultDuration.einreise,
          description: "Einreise nach Deutschland und Ausbildungsbeginn",
          descriptionKey: "timeline_step_einreise_desc",
          icon: "Plane",
        },
      ];
    }

    case "saisonkraefte": {
      return [
        {
          id: "auftrag",
          label: "Auftragserteilung",
          labelKey: "timeline_step_auftrag",
          durationWeeks: productData.defaultDuration.recruit,
          description: "Vertragsunterzeichnung und Kandidatensuche",
          descriptionKey: "timeline_step_auftrag_desc",
          icon: "FileSignature",
        },
        {
          id: "dokumente",
          label: "Dokumentenvorbereitung",
          labelKey: "timeline_step_dokumente",
          durationWeeks: productData.defaultDuration.docs,
          description: "Schnelle Dokumentenvorbereitung",
          descriptionKey: "timeline_step_dokumente_desc",
          icon: "FileText",
        },
        {
          id: "zav",
          label: "ZAV-Genehmigung",
          labelKey: "timeline_step_zav",
          durationWeeks: productData.defaultDuration.zav || 2,
          description: "Zentrale Auslands- und Fachvermittlungsstelle",
          descriptionKey: "timeline_step_zav_desc",
          icon: "ShieldCheck",
        },
        {
          id: "visum",
          label: "Visum",
          labelKey: "timeline_step_visum",
          durationWeeks: productData.defaultDuration.visa,
          description: "Saisonarbeitsvisum",
          descriptionKey: "timeline_step_visum_desc",
          icon: "IdCard",
        },
        {
          id: "einreise",
          label: "Einreise & Arbeitsbeginn",
          labelKey: "timeline_step_einreise",
          durationWeeks: productData.defaultDuration.einreise,
          description: "Einreise nach Deutschland und Saisonarbeitsbeginn",
          descriptionKey: "timeline_step_einreise_desc",
          icon: "Plane",
        },
      ];
    }

    default:
      return [];
  }
};

/**
 * Calculate total duration for a timeline configuration
 */
export const calculateTotalDuration = (steps: TimelineStep[]): number => {
  return steps.reduce((total, step) => {
    return total + step.durationWeeks;
  }, 0);
};

/**
 * Get step duration based on process type
 */
export const getStepDuration = (step: TimelineStep, isAccelerated: boolean): number => {
  if (isAccelerated && step.durationWeeksAccelerated !== undefined) {
    return step.durationWeeksAccelerated;
  }
  return step.durationWeeks;
};

/**
 * Calculate date for a specific step
 */
export const calculateStepDate = (
  startDate: Date,
  steps: TimelineStep[],
  targetStepIndex: number,
  isAccelerated: boolean
): Date => {
  let currentDate = new Date(startDate);

  // Add duration for all steps up to and including the target step
  for (let i = 0; i <= targetStepIndex && i < steps.length; i++) {
    const step = steps[i];
    const durationWeeks = getStepDuration(step, isAccelerated);
    // Add weeks to current date
    currentDate.setDate(currentDate.getDate() + durationWeeks * 7);
  }

  return currentDate;
};

/**
 * Get available industries for a product type
 */
export const getAvailableIndustries = (
  productType: ProductType
): Record<string, IndustryTimelineConfig> | undefined => {
  const dataKey = getTimelineDataKey(productType);
  return TIMELINE_DATA[dataKey].industries;
};

/**
 * Legacy TIMELINE_STEPS for backward compatibility
 * Use getTimelineSteps() instead for dynamic timelines
 */
export const TIMELINE_STEPS: TimelineStep[] = getTimelineSteps("fachkraefte");
