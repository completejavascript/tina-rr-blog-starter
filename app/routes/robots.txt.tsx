import { getDomainUrl } from "~/utils/url";
import type { Route } from "./+types/sitemap.xml";

export async function loader({ request }: Route.ActionArgs) {
  const baseUrl = process.env.APP_URL ?? getDomainUrl(request);
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const robotsTxt = `User-agent: *\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(robotsTxt, {
    headers: { "Content-Type": "text/plain" },
  });
}
