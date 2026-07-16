# Rajveer Singh Pall — AI Research

The digital research identity of an AI researcher working on **trustworthy machine
learning under real-world deployment**. Built as a research-lab homepage, not a
portfolio: every project is framed as one chapter of a single research program.

## Highlights

- **Discovery-first paper pages** — each of the nine publications has its own detail
  page with a plain-language intro, a method flowchart, a bespoke hero figure that
  states the paper's *discovery* in one image (a different visual grammar per paper),
  the real publication figures from the research repos, a five-minute summary, key
  results, honest caveats, and citation.
- **Flagship — TrustShift** — extended interactive page: per-domain evidence,
  a before/after recalibration toggle, cross-domain meta-analysis, and a
  reproduction block. All numbers read from the paper's own result files.
- **Homepage narrative** — hero → research vision → flagship → research timeline →
  interactive research map → publications → open science → impact → future
  directions → contact.
- **Motion** — GSAP ScrollTrigger with masked kinetic type, an ambient data field,
  view transitions, and an adaptive nav. Fully disabled under
  `prefers-reduced-motion`; no-JS users see all content.

## Stack

- [Astro 7](https://astro.build) — static output, content-driven from `src/data/research.ts`
- [GSAP 3.13](https://gsap.com) — ScrollTrigger, SplitText
- [Lenis 1.3](https://github.com/darkroomengineering/lenis) — smooth scroll via `gsap.ticker`
- Self-hosted fonts (Fontsource): Newsreader, Instrument Sans, Fragment Mono
- `sharp` for the build-time Open Graph image

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static build to dist/
npm run preview  # serve the built output
```

## Deploy (Vercel)

Vercel auto-detects Astro — no config file needed.

1. Import this repo in Vercel. Framework preset: **Astro**. Build: `astro build`,
   output: `dist/`.
2. After the first deploy, set your final domain in
   [`astro.config.mjs`](astro.config.mjs) (`site:`) so `og:image` and canonical
   URLs are absolute, then redeploy.

## Structure

- `src/data/research.ts` — single source of truth (publications, timeline, links). Every number traces to a research result file.
- `src/components/HeroFigure.astro` — the eight discovery figures (one bespoke SVG per paper)
- `src/components/*` — homepage sections
- `src/pages/research/[slug].astro`, `src/pages/research/trustshift.astro` — paper pages
- `src/assets/figures/<slug>/` — real publication figures, optimized at build time
- `src/scripts/motion.ts` — GSAP + Lenis, reduced-motion safe
- `RESEARCH.md` — design and technology rationale

## Content integrity

Statuses are stated exactly (e.g. "under review", "presented at CIPHER-2026") and
never upgraded. No metric appears on any page unless it traces to a committed
result file.

— Sole author: Rajveer Singh Pall.
