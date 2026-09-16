// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Drives absolute og:image and canonical URLs.
  site: 'https://rajveer-research.vercel.app',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
  redirects: {
    // The earlier federated-diabetes paper was superseded by the subgroup-fairness study.
    '/research/federated-diabetes': '/research/subgroup-fairness-reversal/',
  },
});
