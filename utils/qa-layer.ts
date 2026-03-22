type QualityContent = Record<string, unknown> & {
  hero?: Record<string, unknown>;
  intro?: Record<string, unknown>;
};

// Lightweight guard that fills missing content with the default page payload.
export function checkQuality<T extends QualityContent>(
  rawData: Partial<T> | null | undefined,
  defaultContent: T
): T {
  // Return the default content when the upstream payload is completely missing.
  if (!rawData) {
    console.warn("[QA] Content payload missing entirely. Falling back to defaults.");
    return defaultContent;
  }

  // Merge partial payloads into the stable default shape.
  return {
    ...defaultContent,
    ...rawData,

    // Normalize hero data so downstream components always receive a populated object.
    hero: {
      ...defaultContent.hero,
      ...(rawData.hero || rawData.intro || {}),
    },
  };
}
