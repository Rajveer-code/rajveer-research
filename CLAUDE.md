# rajveer-research — project rules

Research homepage for Rajveer Singh Pall. Audience: ML faculty opening the site from
outreach emails for Fall 2027 MS applications. Brand vocabulary: research, publications,
research themes; never "portfolio" or "projects" (the "Engineering portfolio" contact
button was placed by the owner and stays).

## Commands

- `npm run dev` — dev server (http://localhost:4321)
- `npm run build` — static build to `dist/`
- `npm run preview` — serve built output (launch config `research-preview`, port 4322)
- `node scripts/build-leaderboard.mjs` — regenerate `src/data/leaderboard.json` (asserts all 378 public pairs)
- `node scripts/build-og.mjs` — regenerate share images (`public/og.png`, `public/og/<slug>.png`), `apple-touch-icon.png` and `favicon.ico` (needs Node 22.18+ and Edge)

## Stack

Astro 7 (static) · GSAP 3.13 (ScrollTrigger/SplitText) · Lenis 1.3 · self-hosted fonts via
Fontsource (Newsreader Variable, Instrument Sans Variable, Fragment Mono) · sharp.
Design system: "Laboratory Paper" (`src/styles/tokens.css`), light only.

## Rules

1. No AI attribution anywhere (commits, code, content). Author: Rajveer Singh Pall.
2. Every number and status must trace to the paper's own current source file or the dossier
   (PATHS). Each paper in `src/data/research.ts` names its source in a comment. Status
   vocabulary: Published, Under review, Working paper, Manuscript, In preparation. Never upgrade.
3. Do not name the venue of a double-blind submission under review; do not link private or
   anonymised repos (knowledgeshift, ddos_xdomain_paper, mental-health-fairness-nlp are private).
4. Never show the retracted federated-diabetes numbers (0.757 external AUC, "40% narrower gap",
   21.7% fairness gain) or the withdrawn P7/P8 papers. CPFE stays topic-only (no numbers, no links).
5. All colours, type, spacing and motion via `src/styles/tokens.css`. No raw hex in components.
6. Motion: transform/opacity only; `prefers-reduced-motion` must leave the page fully static,
   and scroll-gated tweens use `immediateRender: false`.
7. Zero dead ends and zero em dashes in visible copy; curly apostrophes. Grep `dist/` before
   calling a change done. Watch Astro whitespace: a line break between an element and text
   collapses, so write `{" "}` where a space must survive.
8. Verify UI at desktop and 375 px with a clean console before claiming done.
9. SEO: every page keeps a unique title (<= 60), description (70 to 160), canonical, one h1 and no heading
   skips. A renamed or removed paper URL needs a permanent redirect in `vercel.json`. After adding a
   paper, rerun `node scripts/build-og.mjs` so its share image exists.
10. No LocalBusiness or other schema that does not describe the page: this is a personal research site.

## PATHS

- Content ground truth: `D:\RAJVEER_MASTER_APPLICATION_AI_HANDOFF.md` (the copy under Downloads is stale)
- Manuscripts: `C:\Users\Asus\Downloads\masters\LATEST_MANUSCRIPTS_FINAL\`
- Paper sources: `D:\Projects\knowledgeshift\paper\` (P12, P13), `D:\Projects\flipbudget\manuscript\` (P14),
  `D:\Projects\IndiaFinBench\paper\tmlr\` (P5), `D:\Projects\trustshift\paper\` (P10),
  `D:\Projects\ddos_xdomain_paper\paper\` (P11), `D:\Projects\diabetes_prediction_project\` (P06b code)
- Old portfolio (reference only): `D:\Projects\my_portfolio`

## Identity links (verified)

- GitHub: https://github.com/Rajveer-code
- Hugging Face: https://huggingface.co/Rajveer-code
- ORCID: https://orcid.org/0009-0001-6762-6134
- LinkedIn: https://www.linkedin.com/in/rajveer-singh-pall/
- Scholar: https://scholar.google.com/citations?hl=en&user=47CvVCcAAAAJ
- Email: rajveerpall04@gmail.com

## Plan

Phase plans live in gitignored `PLAN_phase*.md` at repo root. `RESEARCH.md` records the original
design rationale. The abandoned full redesign is kept on branch `backup/leaderboard-redesign-2026-09-16`.
