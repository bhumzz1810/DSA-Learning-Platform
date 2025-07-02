import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true
      }
    }
  },
  
  plugins: [react()]
});

