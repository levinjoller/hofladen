/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), legacy()],
  base:
    process.env.NODE_ENV === "production"
      ? process.env.VUE_APP_BRANCH === "dev"
        ? "/hofladen/dev/"
        : "/hofladen/"
      : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("html2canvas")) {
            return "html2canvas";
          }
          if (id.includes("@ionic/vue")) {
            return "ionic";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
