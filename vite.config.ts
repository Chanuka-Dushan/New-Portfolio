import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import fs from "fs"; // add this
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
        ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
          ),
        ]
        : []),
  ],
  base: "/New-Portfolio/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  // ✅ ADD THIS
  buildEnd() {
    const distDir = path.resolve(__dirname, "dist");
    const indexHtml = path.join(distDir, "index.html");
    const fallbackHtml = path.join(distDir, "404.html");

    if (fs.existsSync(indexHtml)) {
      fs.copyFileSync(indexHtml, fallbackHtml);
      console.log("✅ 404.html fallback copied");
    }
  },
});
