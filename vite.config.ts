import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";
  const isDevBranch = env.VITE_APP_BRANCH === "dev";
  return {
    plugins: [
      vue(),
      legacy({
        targets: ["defaults", "not IE 11"],
      }),
    ],
    base: isProd ? (isDevBranch ? "/hofladen/dev/" : "/hofladen/") : "/",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      target: "esnext",
      sourcemap: !isProd,
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
  };
});
