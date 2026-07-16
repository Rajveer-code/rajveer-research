// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Update this to your final Vercel domain if it differs — it drives
  // absolute og:image and canonical URLs.
  site: 'https://rajveer-research.vercel.app',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
});
