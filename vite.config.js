// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  // Only load client-safe variables that start with VITE_
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return defineConfig({
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV || "prod"),
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
  });
};
