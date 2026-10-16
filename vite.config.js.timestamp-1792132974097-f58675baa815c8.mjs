// vite.config.js
import { defineConfig } from "file:///C:/Users/dell/OneDrive/Desktop/SofaHiSofa/sofa-hi-sofa/sofa-hi-sofa/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/dell/OneDrive/Desktop/SofaHiSofa/sofa-hi-sofa/sofa-hi-sofa/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
      "/sitemap.xml": "http://localhost:5000",
      "/robots.txt": "http://localhost:5000"
    }
  },
  build: {
    // SEO & Performance optimizations
    minify: "terser",
    cssMinify: true,
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Optimize chunking for better caching
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: ["react-icons"],
          utils: ["axios", "react-hot-toast", "react-helmet-async"]
        },
        // Better file naming for caching
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
      }
    },
    // Compression and optimization
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Performance optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkZWxsXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcU29mYUhpU29mYVxcXFxzb2ZhLWhpLXNvZmFcXFxcc29mYS1oaS1zb2ZhXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkZWxsXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcU29mYUhpU29mYVxcXFxzb2ZhLWhpLXNvZmFcXFxcc29mYS1oaS1zb2ZhXFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kZWxsL09uZURyaXZlL0Rlc2t0b3AvU29mYUhpU29mYS9zb2ZhLWhpLXNvZmEvc29mYS1oaS1zb2ZhL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IFwiaHR0cDovL2xvY2FsaG9zdDo1MDAwXCIsXG4gICAgICBcIi9zaXRlbWFwLnhtbFwiOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgICAgXCIvcm9ib3RzLnR4dFwiOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gU0VPICYgUGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uc1xuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBPcHRpbWl6ZSBjaHVua2luZyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcbiAgICAgICAgICByb3V0ZXI6IFtcInJlYWN0LXJvdXRlci1kb21cIl0sXG4gICAgICAgICAgaWNvbnM6IFtcInJlYWN0LWljb25zXCJdLFxuICAgICAgICAgIHV0aWxzOiBbXCJheGlvc1wiLCBcInJlYWN0LWhvdC10b2FzdFwiLCBcInJlYWN0LWhlbG1ldC1hc3luY1wiXSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gQmV0dGVyIGZpbGUgbmFtaW5nIGZvciBjYWNoaW5nXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2pzL1tuYW1lXS1baGFzaF0uanMnLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gQ29tcHJlc3Npb24gYW5kIG9wdGltaXphdGlvblxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy8gUGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uc1xuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd2EsU0FBUyxvQkFBb0I7QUFDcmMsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixnQkFBZ0I7QUFBQSxNQUNoQixlQUFlO0FBQUEsSUFDakI7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxVQUMzQixPQUFPLENBQUMsYUFBYTtBQUFBLFVBQ3JCLE9BQU8sQ0FBQyxTQUFTLG1CQUFtQixvQkFBb0I7QUFBQSxRQUMxRDtBQUFBO0FBQUEsUUFFQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxFQUNwRDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
