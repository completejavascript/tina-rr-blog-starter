import { Welcome } from "~/components/Welcome";
import type { Route } from "./+types/home";
import { extractLanguageFromPath } from "~/utils/url";
import { getTranslation } from "~/hooks/useTranslation";

export function meta({ location }: Route.MetaArgs) {
  const { pathname } = location;
  const language = extractLanguageFromPath(pathname);

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
