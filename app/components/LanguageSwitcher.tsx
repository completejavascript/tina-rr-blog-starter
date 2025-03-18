import { Button, Menu } from "@mantine/core";
import appConfig from "config";
import React from "react";
import { useLanguage } from "~/hooks/useLanguage";

const { supportedLanguages, languageNames } = appConfig;

/**
 * Get the display name for a language code
 * @param code Language code
 * @returns Display name for the language
 */
export function getLanguageName(code: string): string {
  return (languageNames as any)[code] || code.toUpperCase();
}

/**
 * Language Switcher component that allows switching between available languages
 * and preserves the current path when switching
 */
export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  /**
   * Handle language switching generically for any path
   * @param newLanguage - The new language to switch to
   */
  const handleLanguageChange = (newLanguage: string): void => {
    if (!supportedLanguages.includes(newLanguage) || newLanguage === language) {
      return;
    }

    setLanguage(newLanguage);
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant="subtle">{getLanguageName(language)}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {supportedLanguages.map((lang) => (
          <Menu.Item
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={lang === language}
          >
            {getLanguageName(lang)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
