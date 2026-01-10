/**
 * Success Stories Data for Referenzen Page
 * Aggregated data by city for map display
 */

export interface CityPlacement {
  id: string;
  city: string;
  position: [number, number]; // [latitude, longitude]
  candidateCount: number;
  jobTypes: string[]; // German job titles
}

/**
 * Mock Success Stories Data - Aggregated by City
 * 10 major German cities with placement statistics
 */
export const successStories: CityPlacement[] = [
  {
    id: "berlin",
    city: "Berlin",
    position: [52.52, 13.405],
    candidateCount: 12,
    jobTypes: ["Pflegefachkraft", "Software Engineer", "Elektriker"],
  },
  {
    id: "munich",
    city: "München",
    position: [48.1351, 11.582],
    candidateCount: 8,
    jobTypes: ["Krankenschwester", "Fullstack Developer", "Industriemechaniker"],
  },
  {
    id: "hamburg",
    city: "Hamburg",
    position: [53.5511, 9.9937],
    candidateCount: 9,
    jobTypes: ["Altenpflegerin", "Koch", "Rezeptionistin"],
  },
  {
    id: "stuttgart",
    city: "Stuttgart",
    position: [48.7758, 9.1829],
    candidateCount: 7,
    jobTypes: ["Pflegedienstleitung", "Kfz-Mechatroniker", "Software Architect"],
  },
  {
    id: "frankfurt",
    city: "Frankfurt",
    position: [50.1109, 8.6821],
    candidateCount: 6,
    jobTypes: ["Intensivpflegekraft", "DevOps Engineer", "Servicekraft"],
  },
  {
    id: "dortmund",
    city: "Dortmund",
    position: [51.5136, 7.4653],
    candidateCount: 5,
    jobTypes: ["Erzieherin", "Zimmermann"],
  },
  {
    id: "essen",
    city: "Essen",
    position: [51.4556, 7.0116],
    candidateCount: 4,
    jobTypes: ["Krankenpfleger", "Elektriker"],
  },
  {
    id: "leipzig",
    city: "Leipzig",
    position: [51.3397, 12.3731],
    candidateCount: 5,
    jobTypes: ["Krankenschwester", "Fliesenleger"],
  },
  {
    id: "cologne",
    city: "Köln",
    position: [50.9375, 6.9603],
    candidateCount: 6,
    jobTypes: ["Kinderkrankenpflegerin", "Schreiner", "Industriemechaniker"],
  },
  {
    id: "dresden",
    city: "Dresden",
    position: [51.0504, 13.7373],
    candidateCount: 4,
    jobTypes: ["Altenpfleger", "Maler"],
  },
];

/**
 * Get total placement count across all cities
 */
export const getTotalPlacements = (): number => {
  return successStories.reduce((sum, city) => sum + city.candidateCount, 0);
};

/**
 * Get placement by city ID
 */
export const getPlacementByCity = (cityId: string): CityPlacement | undefined => {
  return successStories.find((city) => city.id === cityId);
};
