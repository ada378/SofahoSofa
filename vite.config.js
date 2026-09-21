import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Custom plugin: ensure .htaccess is always copied to dist/ after every build
// This guarantees Hostinger Apache server can handle SPA client-side routing.
function copyHtaccessPlugin() {
  return {
    name: "copy-htaccess",
    closeBundle() {
      const src = path.resolve(__dirname, "public/.htaccess");
      const dest = path.resolve(__dirname, "dist/.htaccess");
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log("✅ .htaccess copied to dist/");
      } else {
        console.warn("⚠️  public/.htaccess not found — skipping copy.");
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyHtaccessPlugin()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  build: {
    // Splitting vendor chunk helps first-load performance (Core Web Vitals / SEO)
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
