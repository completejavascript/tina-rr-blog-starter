import { generateSitemapString } from "~/utils/sitemap";
import { getDomainUrl } from "~/utils/url";
import { generatePrimaryRoutes } from "~/utils/routes";
import appConfig from "config";
import type { Route } from "./+types/sitemap.xml";

export async function loader({ request }: Route.ActionArgs) {
  const baseUrl = process.env.APP_URL ?? getDomainUrl(request);
  const routes = await generatePrimaryRoutes();

  const sitemapXml = generateSitemapString(routes, baseUrl, {
    languages: appConfig.supportedLanguages,
    defaultLanguage: appConfig.defaultLanguage,
    defaultChangeFreq: "weekly",
    lastModified: new Date(),
  });

  return new Response(sitemapXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
