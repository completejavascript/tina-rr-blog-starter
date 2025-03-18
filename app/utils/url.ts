import appConfig from "config";

/**
 * Generate URL path for a given language
 * @param path - The base path without language prefix
 * @param language - The language code
 * @returns URL path with appropriate language handling
 */
export function getFullLanguagePath(
  path: string,
  language = appConfig.defaultLanguage
): string {
  return `/${language}${path}`;
}

/**
 * Helper function to extract path parts from a URL
 */
export const getPathParts = (path: string): string[] => {
  return path.split("/").filter(Boolean);
};

/**
 * Helper function to extract language from URL path
 */
export const extractLanguageFromPath = (path: string): string => {
  const pathParts = getPathParts(path);
  const langFromUrl = pathParts[0];

  return appConfig.supportedLanguages.includes(langFromUrl)
    ? langFromUrl
    : appConfig.defaultLanguage;
};

/**
 * Extracts the language code from a full URL
 * @param url The complete URL to extract language from
 * @returns The language code if supported, otherwise the default language
 */
export const extractLanguageFromUrl = (url: string): string => {
  try {
    // Parse the URL to get its components
    const parsedUrl = new URL(url);
    return extractLanguageFromPath(parsedUrl.pathname);
  } catch (error) {
    // If URL parsing fails, return the default language
    console.error("Invalid URL format:", error);
    return appConfig.defaultLanguage;
  }
};

/**
 * Helper function to construct a URL path with the appropriate language prefix
 */
export const constructPathWithLanguage = (
  pathParts: string[],
  lang: string
): string => {
  const firstPart = pathParts[0];
  const newPathParts = [...pathParts];

  // If first part is a language code
  if (appConfig.supportedLanguages.includes(firstPart)) {
    if (lang === appConfig.defaultLanguage) {
      // Remove language prefix for default language
      newPathParts.shift();
    } else {
      // Replace language prefix
      newPathParts[0] = lang;
    }
  } else if (lang !== appConfig.defaultLanguage) {
    // Add language prefix for non-default languages
    newPathParts.unshift(lang);
  }

  return "/" + newPathParts.join("/");
};
