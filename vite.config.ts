import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import netlifyPlugin from "@netlify/vite-plugin-react-router";
import pkg from "./package.json";

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: [
      ...Object.keys(pkg.dependencies),
      "react-router-dom",
      "tinacms/dist/react",
      "tinacms/dist/client",
      "tinacms/dist/rich-text",
    ],
  },
  plugins: [
    reactRouter(), 
    tsconfigPaths(), 
    // netlifyPlugin()
  ],
});
