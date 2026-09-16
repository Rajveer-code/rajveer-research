// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Drives absolute og:image, canonical and sitemap URLs.
  site: 'https://rajveer-research.vercel.app',
  // Every page URL ends in a slash; vercel.json redirects the slashless form (308).
  trailingSlash: 'always',
  build: {
    // All CSS inline: no render-blocking stylesheet requests before first paint.
    inlineStylesheets: 'always',
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
  // Retired and renamed paper URLs redirect permanently in vercel.json.
});
