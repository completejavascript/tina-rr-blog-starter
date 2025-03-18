import appConfig from "config";
import { useLanguage } from "~/hooks/useLanguage";
import enTranslations from "~/locales/en";
import viTranslations from "~/locales/vi";

// Type for translation resources
type TranslationDictionary = {
  [key: string]: TranslationDictionary | string;
};

// All translations combined
const translations: Record<string, TranslationDictionary> = {
  vi: viTranslations,
  en: enTranslations,
};

/**
 * Helper function to get the translation dictionary for a specific language
 * Falls back to default language if specified language is not available
 */
const getLanguageDictionary = (language: string): TranslationDictionary => {
  return translations[language] || translations[appConfig.defaultLanguage];
};

/**
 * Helper function to navigate through the translation object using a key path
 * Returns the found translation string or null if not found
 */
const findTranslationValue = (
  dictionary: TranslationDictionary,
  keyParts: string[]
): string | null => {
  let currentObj: any = dictionary;

  for (const part of keyParts) {
    if (currentObj && typeof currentObj === "object" && part in currentObj) {
      currentObj = currentObj[part];
    } else {
      return null;
    }
  }

  return typeof currentObj === "string" ? currentObj : null;
};

/**
 * Helper function to apply replacements to a translation string
 */
const applyReplacements = (
  text: string,
  replacements?: Record<string, string>
): string => {
  if (!replacements) return text;

  let result = text;
  Object.entries(replacements).forEach(([placeholder, value]) => {
    result = result.replace(new RegExp(`{{${placeholder}}}`, "g"), value);
  });

  return result;
};

/**
 * Get a translation by key and language
 *
 * @param key Dot-notation path to the translation (e.g., 'common.submit')
 * @param language Language code
 * @param replacements Object with replacement values
 * @returns Translated string or the key if translation not found
 */
export const getTranslation = (
  key: string,
  language: string = appConfig.defaultLanguage,
  replacements?: Record<string, string>
): string => {
  // Get the translation dictionary for the language
  const languageDictionary = getLanguageDictionary(language);

  // Split the key into parts and find the translation
  const keyParts = key.split(".");
  const translatedText = findTranslationValue(languageDictionary, keyParts);

  // If translation found, apply replacements and return
  if (translatedText) {
    return applyReplacements(translatedText, replacements);
  }

  // If no translation found, return the key itself
  return key;
};

/**
 * Hook to access translations
 * @returns Object with translation functions
 */
export function useTranslation() {
  const { language } = useLanguage();

  /**
   * Translate a key to the current language
   * @param key Translation key (e.g., 'common.submit')
   * @param replacements Object with placeholder replacements
   * @returns Translated text
   */
  const t = (key: string, replacements?: Record<string, string>): string => {
    return getTranslation(key, language, replacements);
  };

  /**
   * Translate a key to a specific language
   * @param key Translation key (e.g., 'common.submit')
   * @param specificLanguage Language to translate to
   * @param replacements Object with placeholder replacements
   * @returns Translated text
   */
  const translateTo = (
    key: string,
    specificLanguage: string,
    replacements?: Record<string, string>
  ): string => {
    return getTranslation(key, specificLanguage, replacements);
  };

  return {
    t,
    translateTo,
    language,
  };
}
