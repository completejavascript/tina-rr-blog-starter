import type { Config } from "@react-router/dev/config";
import { generatePrimaryRoutes } from "./app/utils/routes";

export default {
  ssr: false,

  async prerender() {
    const routes = await generatePrimaryRoutes();
    routes.push("/sitemap.xml");
    return routes;
  },
} satisfies Config;
