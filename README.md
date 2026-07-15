# Rajveer Singh Pall — AI Research

Research-identity website: trustworthy machine learning under real-world deployment.
Built as a research lab homepage, not a portfolio.

## Status

In active development. Phase 1 (scaffold + "Laboratory Paper" design tokens) complete;
site sections in progress. Not yet deployed.

## Stack

- [Astro 7](https://astro.build) — static output, content collections
- [GSAP 3.13](https://gsap.com) — ScrollTrigger scroll storytelling
- [Lenis 1.3](https://github.com/darkroomengineering/lenis) — smooth scroll, driven by gsap.ticker
- Self-hosted fonts (Fontsource): Newsreader, Instrument Sans, Fragment Mono

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static build to dist/
```

## Structure

- `src/styles/tokens.css` — design tokens (single source for color/type/spacing/motion)
- `src/styles/base.css` — reset + primitives
- `src/scripts/motion.ts` — Lenis + ScrollTrigger wiring, reduced-motion safe
- `src/layouts/Base.astro` — document shell
- `RESEARCH.md` — design + technology rationale
