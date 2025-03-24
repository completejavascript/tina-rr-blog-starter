import { Welcome } from "~/components/Welcome";
import { getTranslation } from "~/hooks/useTranslation";
import { extractLanguageFromPath } from "~/utils/url";
import type { Route } from "./+types/home";

export function meta({ location }: Route.MetaArgs) {
  const language = extractLanguageFromPath(location.pathname);

  return [
    { title: getTranslation("home.meta.title", language) },
    {
      name: "description",
      content: getTranslation("home.meta.description", language),
    },
  ];
}

export default function HomeRoute() {
  return <Welcome />;
}
