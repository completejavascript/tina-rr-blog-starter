import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";
import appConfig from "config";

const generateLocalizedRoutes = () => {
  return ["", ...appConfig.supportedLanguages]
    .map((lang) =>
      prefix(lang, [
        layout("./layouts/MainLayout.tsx", { id: `main-layout-${lang}` }, [
          index("routes/home.tsx", { id: `home-${lang}` }),
          ...prefix("posts", [
            index("./routes/posts.tsx", { id: `post-${lang}` }),
            route(":slug", "./routes/postDetail.tsx", {
              id: `post-detail-${lang}`,
            }),
          ]),
          route(":pageSlug", "./routes/pageDetail.tsx", {
            id: `page-detail-${lang}`,
          }),
        ]),
      ])
    )
    .flat();
};

export default [
  ...generateLocalizedRoutes(),
  route("/sitemap.xml", "./routes/sitemap.xml.tsx"),
  route("/robots.txt", "./routes/robots.txt.tsx"),
] satisfies RouteConfig;
