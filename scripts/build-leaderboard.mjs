// Regenerates src/data/leaderboard.json, the data behind the home-page board.
//
// Published MATH-Hard scores and extractor failure rates come from the
// per-model rescore file of the "Benchmark Accuracy Is Not an Identified
// Quantity" project. Pairwise identification comes from the public Hugging Face
// dataset Rajveer-code/flipbudget-results. The script refuses to write unless
// every one of the 378 public pairs is reproduced exactly from the per-model
// values, so the board can never drift from the published analysis.
//
// Usage: node scripts/build-leaderboard.mjs

import { readFile, writeFile } from "node:fs/promises";

// ---- PATHS -------------------------------------------------------------------
const PUBLIC_PAIRS_URL =
  "https://huggingface.co/datasets/Rajveer-code/flipbudget-results/resolve/main/results/analysis/pair_identification_human.json";
const RESCORE_PATH =
  process.env.L1_RESCORE ??
  "D:/Projects/knowledgeshift/results/analysis/l1_leaderboard_rescore.json";
const OUT_PATH = new URL("../src/data/leaderboard.json", import.meta.url);
// -----------------------------------------------------------------------------

const EPS = 1e-9;

const pairs = await (await fetch(PUBLIC_PAIRS_URL)).json();
const rescore = JSON.parse(await readFile(RESCORE_PATH, "utf8"));
const byModel = new Map(rescore.results.map((r) => [r.model, r]));

const phibar = pairs.phibar_human_upper_95;
const psi = pairs.psi_human_upper_95_as_share_of_n;
const margin = pairs.phibar_used;
if (Math.abs(phibar + psi - margin) > EPS) throw new Error("margin != phibar + psi");

// 1. Every public pair must be reproduced from the per-model values.
for (const p of pairs.pairs) {
  const lo = byModel.get(p.lo);
  const hi = byModel.get(p.hi);
  if (!lo || !hi) throw new Error(`model missing from rescore file: ${p.lo} / ${p.hi}`);
  const gap = hi.published_exact_match - lo.published_exact_match;
  const threshold = lo.v1_invalid_rate + margin;
  if (Math.abs(gap - p.gap) > EPS) throw new Error(`gap mismatch ${p.lo} vs ${p.hi}`);
  if (Math.abs(threshold - p.threshold) > EPS) throw new Error(`threshold mismatch ${p.lo}`);
  if (gap > threshold !== p.identified) throw new Error(`identification mismatch ${p.lo} vs ${p.hi}`);
}

// 2. Interval per model: published score minus the false-credit margin, up to
//    published score plus the unreadable-response rate plus the confidently-wrong
//    margin. Two intervals overlap exactly when the pair is not identified.
const clamp = (x) => Math.min(1, Math.max(0, x));
const rows = [...byModel.values()]
  .map((r) => ({
    model: r.model,
    score: r.published_exact_match,
    parseFailure: r.v1_invalid_rate,
    rawLower: r.published_exact_match - phibar,
    rawUpper: r.published_exact_match + r.v1_invalid_rate + psi,
  }))
  .sort((a, b) => b.score - a.score || a.model.localeCompare(b.model));

const n = rows.length;
let notIdentified = 0;
let notIdentifiedZero = 0;
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    const [hi, lo] = rows[i].score >= rows[j].score ? [rows[i], rows[j]] : [rows[j], rows[i]];
    const gap = hi.score - lo.score;
    if (!(gap > lo.parseFailure + margin)) notIdentified++;
    if (!(gap > lo.parseFailure)) notIdentifiedZero++;
  }
}

if (notIdentified !== pairs.headline.n_not_identified) throw new Error("not-identified count drift");
if (notIdentifiedZero !== pairs.with_phibar_zero.n_not_identified) throw new Error("zero-margin count drift");

const models = rows.map((r, i) => {
  const reportedRank = 1 + rows.filter((o) => o.score > r.score).length;
  const above = rows.filter((o) => o !== r && o.rawLower > r.rawUpper).length;
  const below = rows.filter((o) => o !== r && o.rawUpper < r.rawLower).length;
  const [org, name] = r.model.includes("/") ? r.model.split("/") : ["", r.model];
  // Orders of the models this one cannot be separated from (ranges overlap).
  const inseparable = rows
    .map((o, j) => ({ o, j }))
    .filter(({ o }) => o !== r && !(o.rawLower > r.rawUpper) && !(o.rawUpper < r.rawLower))
    .map(({ j }) => j + 1);
  return {
    order: i + 1,
    org,
    name,
    score: +r.score.toFixed(4),
    parseFailure: +r.parseFailure.toFixed(4),
    lower: +clamp(r.rawLower).toFixed(4),
    upper: +clamp(r.rawUpper).toFixed(4),
    reportedRank,
    rankMin: 1 + above,
    rankMax: n - below,
    inseparableFrom: n - 1 - above - below,
    inseparable,
  };
});

const out = {
  benchmark: "MATH-Hard (Open LLM Leaderboard, 7 subjects)",
  models: models,
  margins: {
    falseCredit: +phibar.toFixed(4),
    confidentlyWrong: +psi.toFixed(4),
    basis: "human audit, 95% upper bounds",
  },
  counts: {
    pairs: pairs.headline.n_pairs,
    notIdentified: notIdentified,
    notIdentifiedAtZeroError: notIdentifiedZero,
  },
  source: {
    dataset: "https://huggingface.co/datasets/Rajveer-code/flipbudget-results",
    file: "results/analysis/pair_identification_human.json",
    verified: `all ${pairs.pairs.length} public pairs reproduced exactly`,
  },
};

await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n");
console.log(
  `leaderboard.json written: ${n} models, ${notIdentified}/${pairs.headline.n_pairs} not identified, ` +
    `${notIdentifiedZero} at zero scorer error; all ${pairs.pairs.length} public pairs reproduced`,
);
