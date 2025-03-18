import appConfig from "config";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { extractLanguageFromPath, translatePath } from "~/utils/url";

const { defaultLanguage, supportedLanguages } = appConfig;

/**
 * Interface for the Language Context value
 */
interface LanguageContextType {
  /** Current language code */
  language: string;

  /** Function to change the current language */
  setLanguage: (language: string) => void;

  /** Whether the current language is the default language */
  isDefaultLanguage: boolean;
}

/**
 * Interface for the Language Provider props
 */
interface LanguageProviderProps {
  children: React.ReactNode;
  language: string;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  isDefaultLanguage: true,
});

/**
 * Provider component for language context
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  language: _language,
}) => {
  const location = useLocation();
  const [language, setLanguageState] = useState<string>(_language);

  // Extract language from URL path when component mounts or URL changes
  useEffect(() => {
    const langFromUrl = extractLanguageFromPath(location.pathname);
    setLanguageState(langFromUrl);
  }, [location.pathname]);

  // Function to change language
  const setLanguage = useCallback(
    (newLanguage: string) => {
      if (!supportedLanguages.includes(newLanguage)) return;

      setLanguageState(newLanguage);

      // Update URL to reflect new language
      const newPath = translatePath(location.pathname, newLanguage);
      window.location.href = newPath;
    },
    [location.pathname]
  );

  const isDefaultLanguage = language === defaultLanguage;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isDefaultLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
