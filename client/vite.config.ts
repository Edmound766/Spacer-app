import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@features": path.resolve(__dirname, "./src/features"),
      "@app":path.resolve(__dirname,"./src/app"),
      "@": path.resolve(__dirname, "./src")
    },
  },
});
