import appConfig from "config";
import { Welcome } from "~/components/Welcome";
import { getTranslation } from "~/hooks/useTranslation";
import type { Route } from "./+types/home";

export function meta({ params }: Route.MetaArgs) {
  const { language = appConfig.defaultLanguage } = params;

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
