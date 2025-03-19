import appConfig from "config";
import { normalizeUrl } from "./url";

/**
 * Configuration options for sitemap generation
 */
interface SitemapOptions {
  languages?: string[];
  defaultLanguage?: string;
  defaultChangeFreq?: string;
  lastModified?: Date;
}

/**
 * Route information with language variants
 */
interface RouteGroup {
  [language: string]: string; // Maps language code to route with that language
}

/**
 * Generate a sitemap.xml content string from a list of routes
 * with exact ordering: deepest paths first
 */
export function generateSitemapString(
  routes: string[],
  baseUrl: string,
  options: SitemapOptions = {}
): string {
  const {
    languages = appConfig.supportedLanguages,
    defaultLanguage = appConfig.defaultLanguage,
    defaultChangeFreq = "weekly",
    lastModified = new Date(),
  } = options;

  const normalizedBaseUrl = normalizeUrl(baseUrl);

  // Group routes by their canonical paths
  const routeGroups = groupRoutesByCanonicalPath(
    routes,
    languages,
    defaultLanguage
  );

  // Get sorted paths (deepest first)
  const sortedPaths = getSortedPaths(routeGroups);

  // Generate XML content
  return generateXmlContent(sortedPaths, routeGroups, {
    baseUrl: normalizedBaseUrl,
    languages,
    defaultLanguage,
    defaultChangeFreq,
    lastModified,
  });
}

/**
 * Group routes by their canonical path, considering language variants
 */
function groupRoutesByCanonicalPath(
  routes: string[],
  languages: string[],
  defaultLanguage: string
): Record<string, RouteGroup> {
  const groups: Record<string, RouteGroup> = {};

  for (const route of routes) {
    // Get language and canonical path
    const { language, canonicalPath } = extractLanguageAndPath(
      route,
      languages,
      defaultLanguage
    );

    // Initialize group if not exists
    if (!groups[canonicalPath]) {
      groups[canonicalPath] = {};
    }

    // Add route to the appropriate language group
    groups[canonicalPath][language] = route;
  }

  return groups;
}

/**
 * Extract language and canonical path from a route
 */
function extractLanguageAndPath(
  route: string,
  languages: string[],
  defaultLanguage: string
): { language: string; canonicalPath: string } {
  let language = defaultLanguage;
  let pathWithoutLanguage = route;

  for (const lang of languages) {
    const langPrefix = `/${lang}/`;
    if (route.startsWith(langPrefix)) {
      language = lang;
      pathWithoutLanguage = "/" + route.slice(langPrefix.length);
      break;
    }
  }

  return {
    language,
    canonicalPath: pathWithoutLanguage,
  };
}

/**
 * Sort paths by depth (deepest first)
 */
function getSortedPaths(routeGroups: Record<string, RouteGroup>): string[] {
  return Object.keys(routeGroups).sort((a, b) => {
    const depthA = a.split("/").filter(Boolean).length;
    const depthB = b.split("/").filter(Boolean).length;

    // Sort by depth (descending)
    return depthB - depthA;
  });
}

/**
 * Calculate priority based on path depth
 */
function calculatePriority(path: string): string {
  const depth = path.split("/").filter(Boolean).length;

  if (depth >= 2) {
    return "0.6"; // Deeper pages
  } else {
    return "0.8"; // Homepage and first-level pages
  }
}

/**
 * Format date to YYYY-MM-DD format
 */
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Generate XML content from sorted paths and route groups
 */
function generateXmlContent(
  sortedPaths: string[],
  routeGroups: Record<string, RouteGroup>,
  options: {
    baseUrl: string;
    languages: string[];
    defaultLanguage: string;
    defaultChangeFreq: string;
    lastModified: Date;
  }
): string {
  const {
    baseUrl,
    languages,
    defaultLanguage,
    defaultChangeFreq,
    lastModified,
  } = options;

  // Start XML
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

  // Add each route group to the sitemap
  for (const canonicalPath of sortedPaths) {
    const languageVariants = routeGroups[canonicalPath];
    const priority = calculatePriority(canonicalPath);
    const mainRoute = languageVariants[defaultLanguage] || canonicalPath;

    xmlContent += generateUrlEntry(
      baseUrl,
      mainRoute,
      languageVariants,
      languages,
      {
        lastModified,
        changeFreq: defaultChangeFreq,
        priority,
      }
    );
  }

  xmlContent += "</urlset>";
  return xmlContent;
}

/**
 * Generate a single URL entry for the sitemap
 */
function generateUrlEntry(
  baseUrl: string,
  mainRoute: string,
  languageVariants: RouteGroup,
  languages: string[],
  options: {
    lastModified: Date;
    changeFreq: string;
    priority: string;
  }
): string {
  const { lastModified, changeFreq, priority } = options;
  let entry = "  <url>\n";

  // Add location
  entry += `    <loc>${baseUrl}${mainRoute}</loc>\n`;

  // Add alternate language versions
  for (const lang of languages) {
    const langPath = languageVariants[lang] || "";
    if (langPath) {
      entry += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}${langPath}" />\n`;
    }
  }

  // Add metadata
  entry += `    <lastmod>${formatDate(lastModified)}</lastmod>\n`;
  entry += `    <changefreq>${changeFreq}</changefreq>\n`;
  entry += `    <priority>${priority}</priority>\n`;
  entry += "  </url>\n";

  return entry;
}
