import appConfig from "config";

const SUFFIX_SEPARATOR = ".";

/**
 * Interface for the result of parsing a filename
 */
export interface ParsedFilename {
  /** Base name of the file without language suffix */
  baseName: string;

  /** Language code extracted from the filename */
  language: string;
}

/**
 * Extracts the base name and language from a filename
 * @param filename - Filename with potential language suffix (e.g., "post-1.en")
 * @returns Object containing baseName and language
 */
export function parseFilename(
  filename: string,
  options: {
    defaultLanguage: string;
    supportedLanguages: string[];
  } = appConfig
): ParsedFilename {
  const { defaultLanguage, supportedLanguages } = options;

  if (!filename) {
    return { baseName: "", language: defaultLanguage };
  }

  // Create a regex pattern based on the suffix separator and supported languages
  // For example, with "." as separator and "vi", "en" as languages: \.(?:vi|en)$
  const langPattern = supportedLanguages.join("|");
  const escSeparator = SUFFIX_SEPARATOR.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
  const suffixPattern = new RegExp(`${escSeparator}(${langPattern})$`);
  const match = filename.match(suffixPattern);

  if (match) {
    const lang = match[1];
    // Calculate base name by removing the suffix (including separator)
    const suffixWithSeparator = SUFFIX_SEPARATOR + lang;
    const baseName = filename.slice(0, -suffixWithSeparator.length);
    return {
      baseName,
      language: lang,
    };
  }

  // Default to default language for files without language suffix
  return {
    baseName: filename,
    language: defaultLanguage,
  };
}
