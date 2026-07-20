import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set base to your repo name for GitHub Pages project sites, e.g. "/ppe-app/".
// If deploying to a user/org page (username.github.io), set base to "/".
export default defineConfig({
  plugins: [react()],
  base: "/ppe-app/",
});
