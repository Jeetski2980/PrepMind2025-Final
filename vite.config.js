// vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  // Only load client-safe variables that start with VITE_
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return defineConfig({
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV || "prod"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client"), // lets you use "@/..." imports
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
    server: {
      host: "0.0.0.0",  // so it binds to all interfaces
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 5173,
      strictPort: true,
    },
  });
};
