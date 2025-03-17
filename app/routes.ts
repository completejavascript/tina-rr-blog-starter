import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix(":language?", [
    index("routes/home.tsx"),
    ...prefix("posts", [
      index("./routes/posts.tsx"),
      route(":slug", "./routes/postDetail.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
