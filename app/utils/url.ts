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
