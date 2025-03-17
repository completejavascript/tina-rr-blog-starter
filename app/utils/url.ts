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
