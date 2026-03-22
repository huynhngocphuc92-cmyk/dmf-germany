// Lightweight guard that fills missing content with the default page payload.
export function checkQuality(rawData: any, defaultContent: any) {
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
