import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";

/**
 * GITHUB PAGES:
 * Set the `base` to your repo name so asset paths resolve correctly.
 * Example: if your repo is github.com/yourname/student-registry
 *          set base: "/student-registry/"
 *
 * For Vercel / Netlify, keep base: "/"
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? "/student-registry_task/" : "/",
});
