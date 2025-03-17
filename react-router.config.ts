import type { Config } from "@react-router/dev/config";
import { client } from "tina/__generated__/client";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  
  async prerender() {
    // Start with the static routes
    const routes = ["/", "/posts"];

    // Fetch all post slugs from Tina CMS
    try {
      const postsResponse = await client.queries.postConnection();
      const postSlugs =
        postsResponse.data.postConnection.edges
          ?.filter((edge) => edge?.node)
          ?.map((post) => `/posts/${post?.node?._sys.filename}`) ?? [];

      // Add all post routes to the prerender list
      routes.push(...postSlugs);
    } catch (error) {
      console.error("Error fetching posts for prerendering:", error);
    }

    return routes;
  },
} satisfies Config;
