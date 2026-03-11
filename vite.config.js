import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";


 // * For Vercel / Netlify, keep base: "/"
 // */
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? "/student-registry_task/" : "/",
});
