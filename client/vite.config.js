import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: "https://dsa-learning-platform-316y.onrender.com",
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/socket.io": {
        // target: "https://dsa-learning-platform-316y.onrender.com",
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
