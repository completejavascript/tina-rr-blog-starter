import appConfig from "config";
import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  constructPathWithLanguage,
  extractLanguageFromPath,
  getPathParts,
} from "~/utils/url";

const { defaultLanguage, supportedLanguages } = appConfig;

/**
 * Interface for the Language Context value
 */
interface LanguageContextType {
  /** Current language code */
  language: string;

  /** Function to change the current language */
  setLanguage: (language: string) => void;

  /** Function to translate a path to another language */
  translatePath: (path: string, targetLang?: string) => string;

  /** Whether the current language is the default language */
  isDefaultLanguage: boolean;
}

/**
 * Interface for the Language Provider props
 */
interface LanguageProviderProps {
  children: React.ReactNode;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  translatePath: (path) => path,
  isDefaultLanguage: true,
});

/**
 * Provider component for language context
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguageState] = useState<string>(defaultLanguage);

  // Extract language from URL path when component mounts or URL changes
  useEffect(() => {
    const langFromUrl = extractLanguageFromPath(location.pathname);
    setLanguageState(langFromUrl);
  }, [location.pathname]);

  // Function to translate paths between languages
  const translatePath = (
    path: string,
    targetLang: string = language
  ): string => {
    const pathParts = getPathParts(path);
    return constructPathWithLanguage(pathParts, targetLang);
  };

  // Function to change language
  const setLanguage = (newLanguage: string) => {
    if (!supportedLanguages.includes(newLanguage)) return;

    setLanguageState(newLanguage);

    // Update URL to reflect new language
    const newPath = translatePath(location.pathname, newLanguage);
    navigate(newPath);
  };

  const isDefaultLanguage = language === defaultLanguage;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translatePath,
        isDefaultLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
