import appConfig from "config";
import { getFullLanguagePath } from "./url";
import client from "tina/__generated__/client";
import { parseFilename } from "./file";

export const generatePrimaryRoutes = async () => {
  const { supportedLanguages } = appConfig;

  // Start with the static routes
  const routes = ["/", "/posts"];

  // Add language prefix for statics routes
  if (supportedLanguages.length > 1) {
    routes.forEach((route) => {
      supportedLanguages.forEach((language) => {
        routes.push(getFullLanguagePath(route, language));
      });
    });
  }

  // Fetch all post slugs from Tina CMS
  try {
    const postsResponse = await client.queries.postConnection();

    // Process each post
    postsResponse.data.postConnection.edges?.forEach((edge) => {
      if (!edge?.node) return;

      const filename = edge.node._sys.filename;
      const { baseName, language } = parseFilename(filename);

      const basePostUrl = `/posts/${baseName}`;
      routes.push(getFullLanguagePath(basePostUrl, language));

      if (!routes.includes(basePostUrl)) {
        routes.push(basePostUrl);
      }
    });

    // Fetch all pages from Tina CMS
    const pagesResponse = await client.queries.pageConnection();

    // Process each page
    pagesResponse.data.pageConnection.edges?.forEach((edge) => {
      if (!edge?.node) return;

      const filename = edge.node._sys.filename;
      const { baseName, language } = parseFilename(filename);

      const basePageUrl = `/${baseName}`;
      routes.push(getFullLanguagePath(basePageUrl, language));

      if (!routes.includes(basePageUrl)) {
        routes.push(basePageUrl);
      }
    });
  } catch (error) {
    console.error("Error fetching content for prerendering:", error);
  }

  return routes;
};
