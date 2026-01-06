import { getThemeConfig } from "@/actions/theme-actions";

/**
 * Server Component to inject theme config as CSS variables
 * This allows dynamic theme changes from the database
 * 
 * Note: CSS variables are injected into :root, which will override
 * the default values in globals.css
 */
export const ThemeInjector = async () => {
  const { data: themeConfig } = await getThemeConfig();

  if (!themeConfig) {
    return null;
  }

  // Extract colors from theme config
  const primaryColor = themeConfig.primary_color;
  const secondaryColor = themeConfig.secondary_color;
  const accentColor = themeConfig.accent_color;

  // Build CSS variables
  const cssVariables: string[] = [];
  
  if (primaryColor) {
    // Convert hex to oklch format for Tailwind compatibility
    // For now, we'll use the hex directly and let Tailwind handle it
    // If needed, we can convert hex to oklch here
    cssVariables.push(`--primary: ${primaryColor};`);
  }
  
  if (secondaryColor) {
    cssVariables.push(`--secondary: ${secondaryColor};`);
  }
  
  if (accentColor) {
    cssVariables.push(`--accent: ${accentColor};`);
  }

  // If no variables to inject, return null
  if (cssVariables.length === 0) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            ${cssVariables.join("\n            ")}
          }
        `,
      }}
    />
  );
};

