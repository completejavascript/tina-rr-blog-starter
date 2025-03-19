import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix(":language?", [
    layout("./layouts/MainLayout.tsx", [
      index("routes/home.tsx"),
      ...prefix("posts", [
        index("./routes/posts.tsx"),
        route(":slug", "./routes/postDetail.tsx"),
      ]),
    ]),
  ]),
  route("/sitemap.xml", "./routes/sitemap.xml.tsx"),
  route("/robots.txt", "./routes/robots.txt.tsx"),
] satisfies RouteConfig;
