import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // your Express server
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:5000",
        ws: true,
        changeOrigin: true,
      },
    },
  },

  plugins: [react()],
});
