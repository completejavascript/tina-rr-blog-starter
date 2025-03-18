import { getSmartLanguagePath } from "~/utils/url";
import { useLanguage } from "./useLanguage";

export const usePathWithLanguage = () => {
  const { language } = useLanguage();
  return (path: string) => {
    return getSmartLanguagePath(path, language);
  };
};
