import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173, // Change this if using a different port
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
    cors: true,
    allowedHosts: [".ngrok-free.app"], // Allow all ngrok subdomains
    mimeTypes: {
      "application/wasm": ["wasm"],
    },
  },
});
