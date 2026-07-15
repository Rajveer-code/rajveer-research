# RESEARCH.md — Research-Identity Website

Phase 0 findings for the digital research identity of Rajveer Singh Pall.
Date: 2026-07-15. Fresh build; `D:\Projects\research-lab` explicitly excluded as reference.

## 1. Goal

A research-lab-grade website (not a portfolio) whose single message is:
**"This researcher studies trustworthy machine learning under real-world deployment,
and every project contributes toward that mission."**
Audience: professors, admissions committees, research scientists. First-minute clarity,
award-level craft, scientific honesty.

## 2. Prior art studied

- Research lab references (target register): OpenAI Research, Anthropic, DeepMind,
  Stanford HAI, Berkeley AI — light, typographic, whitespace-heavy, diagrams over decoration.
- Award-tier scroll craft: Awwwards portfolio winners emphasize kinetic typography,
  scroll-driven storytelling, restrained palettes
  ([Awwwards portfolio category](https://www.awwwards.com/websites/winner_category_portfolio/),
  [Muzli 2026 portfolio roundup](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)).
- Codrops case study directly on-pattern: minimalist **Astro + GSAP** portfolio with reveals,
  Flip transitions, subtle motion; scores well on PageSpeed even with Three.js on top
  ([Codrops, Feb 2026](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)).
- Interactive-paper register (per-publication pages): distill.pub-style explanations —
  figures first, five-minute comprehension.

## 3. Technology decisions

| Choice | Decision | Why |
|---|---|---|
| Framework | **Astro 7** (static output) | Content-heavy site with per-paper pages → content collections + MDX; ~0 KB JS baseline; islands only where interaction teaches. Next.js rejected: app-shell overhead buys nothing here ([Vercel comparison](https://vercel.com/i/astro-vs-next-js), [Astro vs Next 2026](https://www.kunalganglani.com/blog/astro-vs-nextjs-2026)). |
| Animation | **GSAP 3.13** — ScrollTrigger, SplitText | 100% free incl. all former Club plugins since Apr 2025 (Webflow acquisition) ([gsap.com/pricing](https://gsap.com/pricing/), [CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/)). |
| Smooth scroll | **Lenis 1.3** | Industry standard; drive via `gsap.ticker` with `autoRaf:false` + `lagSmoothing(0)` to avoid 1–2 frame lag ([Lenis repo](https://github.com/darkroomengineering/lenis), [2026 guide](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)). |
| 3D | **Three.js, deferred** | Only for Research Map / hero if it *teaches*; vanilla island, lazy-loaded, WebGL fallback required. Not installed in Phase 1. |
| Fonts | Self-hosted via Fontsource | No CDN requests; per user rule. |
| Deploy | Vercel free tier | Existing account/workflow. |

## 4. Design direction — "Laboratory Paper"

Light, archival-scientific. Rejected: dark cyberpunk, glassmorphism, neumorphism
(ui-ux-pro-max suggested neumorphism — rejected: low-contrast, wellness-app register),
purple gradients, Inter/Roboto/Space Grotesk defaults.

- **Field**: warm paper white; near-black ink; hairline rules like a lab notebook grid.
- **One accent**: ultramarine ("signal") for links, active states, data emphasis.
  Restrained deep green ("verified") reserved for accepted/presented status only.
- **Type**: Newsreader (variable serif — editorial-scientific voice, long-form screen reading;
  distinct from finsight-web's Fraunces) + Instrument Sans (UI labels) +
  Fragment Mono (numbers, datasets, citations — tabular by nature).
- **Motion**: calm, instrument-like. Scroll reveals ideas; nothing purely decorative.
  `prefers-reduced-motion` disables Lenis + nontrivial animation entirely.
- Light-only v1 (`color-scheme: light`) — matches lab register; dark variant is future work.

## 5. Site architecture (agreed narrative)

Hero (thesis headline) → Research Vision → Flagship: TrustShift → Research Timeline →
Research Map → Publications (cards) → Open Science → Research Impact → Vision (5-year) →
About (tiny) → Contact. Every paper gets its own interactive page under `/research/<slug>/`.
Never the word "Projects".

## 6. Content ground truth

All claims/numbers trace to
`C:\Users\Asus\Downloads\masters\RAJVEER_MASTER_APPLICATION_AI_HANDOFF.md` and the repos it
indexes. Statuses stay honest: TrustShift = under review (Applied Intelligence);
P9 = presented at CIPHER-2026 (not "IEEE Xplore published" unless verified);
ARIA = package + planned paper. Links verified from `D:\Projects\my_portfolio`:
LinkedIn `linkedin.com/in/rajveer-singh-pall/`,
Scholar `scholar.google.com/citations?hl=en&user=47CvVCcAAAAJ`,
ORCID `0009-0001-6762-6134`.

## 7. Three biggest risks

1. **Status drift** — venue/status conflicts across manuscripts; site must use hedged,
   verified wording (mitigation: single `src/content/` source of truth, statuses quoted
   from handoff only).
2. **Motion vs. performance/accessibility** — award-level animation can wreck LCP/CLS and
   reduced-motion users (mitigation: static-first Astro, transform/opacity only,
   reduced-motion kill switch, Lighthouse gate per phase).
3. **Scope** — 10+ papers × interactive pages is huge (mitigation: flagship-first;
   TrustShift page deep, others templated).
