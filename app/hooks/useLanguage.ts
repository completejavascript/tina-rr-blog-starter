import { useContext } from "react";
import { LanguageContext } from "~/context/LanguageContext";

/**
 * Hook to access the language context
 * @throws {Error} If used outside of a LanguageContext provider
 * @returns The language context value
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
