import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In Docker, backend is reachable at http://backend:8000; locally localhost:8000.
// Allow override via env: VITE_API_PROXY_TARGET
const proxyTarget = process.env.VITE_API_PROXY_TARGET || "http://localhost:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: proxyTarget,
        changeOrigin: true,
      },
    },
  },
});
