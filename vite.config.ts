import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["lucide-react"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "lucide-react": ["lucide-react"],
          recharts: ["recharts"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    sourcemap: true,
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
