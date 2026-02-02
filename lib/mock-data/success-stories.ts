/**
 * Success Stories Data Model
 * Mock data for DMF Erfolgslandkarte (Success Map) section
 * Displays successful placements across Germany
 */

export interface SuccessStory {
  id: string;
  candidateName: string; // Abbreviated name, e.g., "Nguyen V. A."
  jobTitle: string; // German job title, e.g., "Pflegefachkraft", "Industriemechaniker"
  city: string; // City in Germany
  coordinates: [number, number]; // [Latitude, Longitude]
  placementDate: string; // Month/Year format, e.g., "10/2024"
}

/**
 * Mock Success Stories Data
 * Real coordinates for major German cities with successful placements
 */
export const successStories: SuccessStory[] = [
  // Berlin - Various sectors
  {
    id: "berlin-1",
    candidateName: "Nguyen V. A.",
    jobTitle: "Pflegefachkraft",
    city: "Berlin",
    coordinates: [52.52, 13.405],
    placementDate: "03/2024",
  },
  {
    id: "berlin-2",
    candidateName: "Tran T. B.",
    jobTitle: "Software Engineer",
    city: "Berlin",
    coordinates: [52.52, 13.405],
    placementDate: "05/2024",
  },
  {
    id: "berlin-3",
    candidateName: "Le V. C.",
    jobTitle: "Elektriker",
    city: "Berlin",
    coordinates: [52.52, 13.405],
    placementDate: "07/2024",
  },

  // Munich - Healthcare & IT
  {
    id: "munich-1",
    candidateName: "Pham V. D.",
    jobTitle: "Krankenschwester",
    city: "München",
    coordinates: [48.1351, 11.582],
    placementDate: "02/2024",
  },
  {
    id: "munich-2",
    candidateName: "Hoang T. E.",
    jobTitle: "Fullstack Developer",
    city: "München",
    coordinates: [48.1351, 11.582],
    placementDate: "04/2024",
  },
  {
    id: "munich-3",
    candidateName: "Vu V. F.",
    jobTitle: "Heizungsbauer",
    city: "München",
    coordinates: [48.1351, 11.582],
    placementDate: "08/2024",
  },

  // Hamburg - Healthcare & Hospitality
  {
    id: "hamburg-1",
    candidateName: "Nguyen T. G.",
    jobTitle: "Altenpflegerin",
    city: "Hamburg",
    coordinates: [53.5511, 9.9937],
    placementDate: "01/2024",
  },
  {
    id: "hamburg-2",
    candidateName: "Tran V. H.",
    jobTitle: "Koch",
    city: "Hamburg",
    coordinates: [53.5511, 9.9937],
    placementDate: "06/2024",
  },
  {
    id: "hamburg-3",
    candidateName: "Le T. I.",
    jobTitle: "Rezeptionistin",
    city: "Hamburg",
    coordinates: [53.5511, 9.9937],
    placementDate: "09/2024",
  },

  // Cologne - Healthcare & Construction
  {
    id: "cologne-1",
    candidateName: "Pham V. J.",
    jobTitle: "Kinderkrankenpflegerin",
    city: "Köln",
    coordinates: [50.9375, 6.9603],
    placementDate: "03/2024",
  },
  {
    id: "cologne-2",
    candidateName: "Nguyen V. K.",
    jobTitle: "Schreiner",
    city: "Köln",
    coordinates: [50.9375, 6.9603],
    placementDate: "05/2024",
  },
  {
    id: "cologne-3",
    candidateName: "Tran V. L.",
    jobTitle: "Industriemechaniker",
    city: "Köln",
    coordinates: [50.9375, 6.9603],
    placementDate: "10/2024",
  },

  // Frankfurt - Finance & Healthcare
  {
    id: "frankfurt-1",
    candidateName: "Hoang T. M.",
    jobTitle: "Intensivpflegekraft",
    city: "Frankfurt",
    coordinates: [50.1109, 8.6821],
    placementDate: "02/2024",
  },
  {
    id: "frankfurt-2",
    candidateName: "Vu V. N.",
    jobTitle: "DevOps Engineer",
    city: "Frankfurt",
    coordinates: [50.1109, 8.6821],
    placementDate: "04/2024",
  },
  {
    id: "frankfurt-3",
    candidateName: "Le T. O.",
    jobTitle: "Servicekraft",
    city: "Frankfurt",
    coordinates: [50.1109, 8.6821],
    placementDate: "07/2024",
  },

  // Stuttgart - Automotive & Healthcare
  {
    id: "stuttgart-1",
    candidateName: "Pham V. P.",
    jobTitle: "Pflegedienstleitung",
    city: "Stuttgart",
    coordinates: [48.7758, 9.1829],
    placementDate: "01/2024",
  },
  {
    id: "stuttgart-2",
    candidateName: "Nguyen T. Q.",
    jobTitle: "Kfz-Mechatroniker",
    city: "Stuttgart",
    coordinates: [48.7758, 9.1829],
    placementDate: "06/2024",
  },
  {
    id: "stuttgart-3",
    candidateName: "Tran V. R.",
    jobTitle: "Software Architect",
    city: "Stuttgart",
    coordinates: [48.7758, 9.1829],
    placementDate: "08/2024",
  },

  // Düsseldorf - Healthcare & IT
  {
    id: "duesseldorf-1",
    candidateName: "Hoang T. S.",
    jobTitle: "Notfallpflegerin",
    city: "Düsseldorf",
    coordinates: [51.2277, 6.7735],
    placementDate: "03/2024",
  },
  {
    id: "duesseldorf-2",
    candidateName: "Vu V. T.",
    jobTitle: "Cloud Engineer",
    city: "Düsseldorf",
    coordinates: [51.2277, 6.7735],
    placementDate: "05/2024",
  },

  // Dresden - Healthcare & Construction
  {
    id: "dresden-1",
    candidateName: "Le T. U.",
    jobTitle: "Altenpfleger",
    city: "Dresden",
    coordinates: [51.0504, 13.7373],
    placementDate: "04/2024",
  },
  {
    id: "dresden-2",
    candidateName: "Pham V. V.",
    jobTitle: "Maler",
    city: "Dresden",
    coordinates: [51.0504, 13.7373],
    placementDate: "09/2024",
  },

  // Leipzig - Healthcare
  {
    id: "leipzig-1",
    candidateName: "Nguyen T. W.",
    jobTitle: "Krankenschwester",
    city: "Leipzig",
    coordinates: [51.3397, 12.3731],
    placementDate: "06/2024",
  },
  {
    id: "leipzig-2",
    candidateName: "Tran V. X.",
    jobTitle: "Fliesenleger",
    city: "Leipzig",
    coordinates: [51.3397, 12.3731],
    placementDate: "10/2024",
  },

  // Nuremberg - Healthcare & IT
  {
    id: "nuremberg-1",
    candidateName: "Hoang T. Y.",
    jobTitle: "Pflegefachkraft",
    city: "Nürnberg",
    coordinates: [49.4521, 11.0767],
    placementDate: "02/2024",
  },
  {
    id: "nuremberg-2",
    candidateName: "Vu V. Z.",
    jobTitle: "Data Analyst",
    city: "Nürnberg",
    coordinates: [49.4521, 11.0767],
    placementDate: "07/2024",
  },

  // Dortmund - Healthcare & Handwerk
  {
    id: "dortmund-1",
    candidateName: "Le T. A1",
    jobTitle: "Erzieherin",
    city: "Dortmund",
    coordinates: [51.5136, 7.4653],
    placementDate: "05/2024",
  },
  {
    id: "dortmund-2",
    candidateName: "Pham V. B1",
    jobTitle: "Zimmermann",
    city: "Dortmund",
    coordinates: [51.5136, 7.4653],
    placementDate: "08/2024",
  },

  // Essen - Healthcare
  {
    id: "essen-1",
    candidateName: "Nguyen T. C1",
    jobTitle: "Krankenpfleger",
    city: "Essen",
    coordinates: [51.4556, 7.0116],
    placementDate: "04/2024",
  },

  // Bremen - Healthcare & IT
  {
    id: "bremen-1",
    candidateName: "Tran V. D1",
    jobTitle: "Altenpflegerin",
    city: "Bremen",
    coordinates: [53.0793, 8.8017],
    placementDate: "06/2024",
  },
  {
    id: "bremen-2",
    candidateName: "Hoang T. E1",
    jobTitle: "Frontend Developer",
    city: "Bremen",
    coordinates: [53.0793, 8.8017],
    placementDate: "09/2024",
  },

  // Hannover - Healthcare
  {
    id: "hannover-1",
    candidateName: "Vu V. F1",
    jobTitle: "Intensivpfleger",
    city: "Hannover",
    coordinates: [52.3759, 9.732],
    placementDate: "03/2024",
  },

  // Duisburg - Healthcare & Handwerk
  {
    id: "duisburg-1",
    candidateName: "Le T. G1",
    jobTitle: "Krankenschwester",
    city: "Duisburg",
    coordinates: [51.4344, 6.7623],
    placementDate: "07/2024",
  },

  // Bochum - Healthcare
  {
    id: "bochum-1",
    candidateName: "Pham V. H1",
    jobTitle: "Pflegefachkraft",
    city: "Bochum",
    coordinates: [51.4818, 7.2162],
    placementDate: "10/2024",
  },

  // Wuppertal - Healthcare
  {
    id: "wuppertal-1",
    candidateName: "Nguyen T. I1",
    jobTitle: "Altenpflegerin",
    city: "Wuppertal",
    coordinates: [51.2562, 7.1508],
    placementDate: "08/2024",
  },
];

/**
 * Get unique cities from success stories
 */
export const getUniqueCities = (): string[] => {
  const cities = successStories.map((story) => story.city);
  return Array.from(new Set(cities)).sort();
};

/**
 * Get stories by city
 */
export const getStoriesByCity = (city: string): SuccessStory[] => {
  return successStories.filter((story) => story.city === city);
};

/**
 * Get total placement count
 */
export const getTotalPlacements = (): number => {
  return successStories.length;
};

/**
 * Get placement count by city
 */
export const getPlacementCountByCity = (city: string): number => {
  return getStoriesByCity(city).length;
};
