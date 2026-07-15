# rajveer-research — project rules

Research-identity website for Rajveer Singh Pall (sole author). Brand: research lab,
never "portfolio", never "projects" — use Research / Publications / Research Themes.

## Commands

- `npm run dev` — dev server (http://localhost:4321)
- `npm run build` — static build to `dist/`
- `npm run preview` — serve built output

## Stack

Astro 7 (static) · GSAP 3.13 (ScrollTrigger/SplitText, free license) · Lenis 1.3 ·
self-hosted fonts via Fontsource (Newsreader Variable, Instrument Sans Variable,
Fragment Mono). Three.js not yet installed — add only when a visual teaches.

## Rules

1. No AI attribution anywhere (commits, code, content). Sole author: Rajveer Singh Pall.
2. Every research number/status must trace to the handoff dossier (PATHS below) or a
   result file. Statuses stay honest: "under review", "presented at CIPHER-2026" —
   never upgrade. No invented metrics, citations, or venues.
3. All colors/type/spacing/motion via `src/styles/tokens.css` variables — no raw hex
   in components.
4. Motion: transform/opacity only; `prefers-reduced-motion` must fully disable Lenis
   and reveals (handled in `src/scripts/motion.ts` + `base.css`).
5. Zero dead ends: no `href="#"`, no placeholder text, no empty pages. Grep before
   any phase is called done.
6. Verify UI at desktop and 375 px mobile with clean console before claiming done.

## PATHS

- Content ground truth: `C:\Users\Asus\Downloads\masters\RAJVEER_MASTER_APPLICATION_AI_HANDOFF.md`
- Manuscripts: `C:\Users\Asus\Downloads\masters\LATEST_MANUSCRIPTS\`
- Repos indexed in handoff §5 (`D:\Projects\trustshift`, `D:\Projects\IndiaFinBench`, …)
- Old portfolio (links reference only): `D:\Projects\my_portfolio`
- Excluded as reference by owner request: `D:\Projects\research-lab`

## Identity links (verified)

- GitHub: https://github.com/Rajveer-code
- Hugging Face: https://huggingface.co/Rajveer-code
- ORCID: https://orcid.org/0009-0001-6762-6134
- LinkedIn: https://www.linkedin.com/in/rajveer-singh-pall/
- Scholar: https://scholar.google.com/citations?hl=en&user=47CvVCcAAAAJ
- Email: rajveerpall04@gmail.com

## Plan

Phase plans live in gitignored `PLAN_phase*.md` at repo root. Design rationale in
`RESEARCH.md` (committed).
