import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("pdf-parse")) return "pdf-parse";
          if (id.includes("mammoth")) return "mammoth";
          if (id.includes("docx")) return "docx";
          if (id.includes("recharts")) return "charts";
          if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("vaul")) return "ui-vendor";
          if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) return "react-vendor";
          if (id.includes("@supabase/supabase-js")) return "supabase";
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
