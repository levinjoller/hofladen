import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { templateCompilerOptions } from "@tresjs/core";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";
  const isDevBranch = env.VITE_APP_BRANCH === "dev";
  return {
    plugins: [
      vue({ ...templateCompilerOptions }),
      !isProd &&
        visualizer({
          open: true,
          filename: "stats.html",
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),
    base: isProd ? (isDevBranch ? "/hofladen/dev/" : "/hofladen/") : "/",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      minify: "esbuild",
      sourcemap: !isProd,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-grid": ["ag-grid-community", "ag-grid-vue3"],
            "vendor-pdf": ["pdfmake"],
            "vendor-three": ["three", "@tresjs/core"],
            "vendor-ionic": ["@ionic/vue", "@ionic/core", "ionicons"],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
  };
});
