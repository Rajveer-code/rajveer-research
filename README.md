# Rajveer Singh Pall — AI Research

The digital research identity of an AI researcher working on **trustworthy machine
learning under real-world deployment**. Built as a research-lab homepage, not a
portfolio: nine publications are framed as one continuous research program, with
TrustShift as the binding thesis.

## Paper pages — one consistent reading order

Every publication page follows the **same information architecture**, so a reader
who has seen one paper instinctively knows where everything is in the next:

1. **Hero** — title, one-line discovery, status/venue, authors, action buttons
2. **The discovery in one figure** — a conceptual figure that states what the paper
   found (a distinct visual grammar per paper; TrustShift leads with its failure-
   taxonomy figure)
3. **The paper in five minutes** — a plain-language read
4. **The research question**
5. **How it works** — methodology prose + a step-by-step flowchart
6. **Experimental results** — data figures, the real publication figures from the
   research repos, and metric cards
7. **What this changes** — the takeaway
8. **Resources & citation**
9. **Related research**

A sticky in-page jump-nav (with active-section tracking) sits on each paper page.
Concept always precedes evidence: the conceptual figure at step 2, the real
matplotlib plots at step 6.

## Homepage

Hero → **research highlights** (three discoveries, stated before any section) →
research vision → flagship (TrustShift) → research timeline (framed as
Question → Discovery) → **interactive research map** → publications → research
infrastructure → impact → future directions → contact.

The research map is the centerpiece: TrustShift sits at the center as the thesis
that binds every theme; hovering or tapping a theme reveals its papers in a panel
below, and the center links to the flagship.

## Motion & accessibility

GSAP ScrollTrigger with masked kinetic type, a site-wide ambient data field,
Astro view transitions, and an adaptive nav. Scroll-gated reveals use
`immediateRender: false` so content is never left hidden. Everything is disabled
under `prefers-reduced-motion`, and no-JS users still see all content. Detail-page
typography is sized for comfortable reading on a 13–15" laptop.

## Stack

- [Astro 7](https://astro.build) — static output, content-driven from `src/data/research.ts`
- [GSAP 3.13](https://gsap.com) — ScrollTrigger, SplitText
- [Lenis 1.3](https://github.com/darkroomengineering/lenis) — smooth scroll via `gsap.ticker`
- Self-hosted fonts (Fontsource): Newsreader, Instrument Sans, Fragment Mono
- `sharp` — build-time Open Graph image

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static build to dist/
npm run preview  # serve the built output
```

## Deploy (Vercel)

Vercel auto-detects Astro — no config file needed.

1. Import this repo in Vercel. Framework preset: **Astro** (build `astro build`,
   output `dist/`).
2. After the first deploy, set your final domain in
   [`astro.config.mjs`](astro.config.mjs) (`site:`) so `og:image` and canonical
   URLs are absolute, then redeploy.

## Structure

- `src/data/research.ts` — single source of truth: publications (with per-paper
  plain summary, method flow, figures, results, status), timeline, open science,
  impact, identity links. Every number traces to a research result file.
- `src/pages/research/[slug].astro` — the shared paper-page template (8 papers)
- `src/pages/research/trustshift.astro` — the extended flagship page (same spine,
  richer evidence: per-domain audit, recalibration toggle, meta-analysis, reproduction)
- `src/components/HeroFigure.astro` — the eight bespoke discovery figures (one SVG per paper)
- `src/components/*` — homepage sections (Hero, Highlights, ResearchMap, Timeline, …)
- `src/assets/figures/<slug>/` — real publication figures, optimized at build time
- `src/styles/tokens.css` — design tokens (colour, type scale, spacing, motion)
- `src/scripts/motion.ts` — GSAP + Lenis wiring, reduced-motion safe
- `RESEARCH.md` — design and technology rationale

## Content integrity

Statuses are stated exactly (e.g. "under review", "presented at CIPHER-2026") and
never upgraded. No metric appears on any page unless it traces to a committed
result file in the corresponding research repository.

— Sole author: Rajveer Singh Pall.
