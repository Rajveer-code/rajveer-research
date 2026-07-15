/**
 * Single source of truth for all research content.
 * Every number and status traces to the application handoff dossier
 * (see CLAUDE.md → PATHS). Statuses are verified-safe wording — never upgrade.
 */

export type Theme =
  | "trustworthy-ml"
  | "healthcare"
  | "fairness"
  | "nlp-llm"
  | "causal"
  | "deployment"
  | "privacy"
  | "finance";

export type StatusKind = "presented" | "review" | "working";

export interface KeyResult {
  value: string;
  label: string;
}

export interface Publication {
  slug: string;
  order: number;
  flagship?: boolean;
  title: string;
  shortTitle: string;
  authors: string;
  status: string;
  statusKind: StatusKind;
  year: string;
  themes: Theme[];
  oneLiner: string;
  problem: string;
  approach: string;
  findings: string;
  matters: string;
  results: KeyResult[];
  links: { label: string; href: string }[];
  caveat?: string;
}

export const THEME_LABELS: Record<Theme, string> = {
  "trustworthy-ml": "Trustworthy ML",
  healthcare: "Healthcare AI",
  fairness: "Fairness",
  "nlp-llm": "NLP · LLMs",
  causal: "Causal Inference",
  deployment: "Deployment Shift",
  privacy: "Privacy · Federated",
  finance: "Financial ML",
};

export const publications: Publication[] = [
  {
    slug: "trustshift",
    order: 1,
    flagship: true,
    title:
      "TrustShift: Shift Type, Not Shift Magnitude, Determines Machine-Learning Failure Modes",
    shortTitle: "TrustShift",
    authors: "Rajveer Singh Pall",
    status: "Under review — Applied Intelligence",
    statusKind: "review",
    year: "2026",
    themes: ["trustworthy-ml", "deployment", "healthcare", "nlp-llm", "fairness"],
    oneLiner:
      "One pre-registered audit across four dissimilar domains: the type of distribution shift — not its magnitude — determines which axis of trustworthiness fails at deployment.",
    problem:
      "ML systems are audited domain by domain, and deployment failures are usually attributed to how large the distribution shift is. Whether the kind of shift predicts the kind of failure had not been tested across domains under one protocol.",
    approach:
      "A single pre-registered audit protocol applied to four real-world domains — clinical risk (NHANES→BRFSS), mental-health NLP (Kaggle→Reddit/Twitter), mortgage lending (42M HMDA applications), and network security (CIC-DDoS2019→CICIDS2017). Discrimination, calibration, and subgroup reliability are measured with DeLong and bootstrap confidence intervals (N = 2000) and Benjamini–Hochberg FDR control, then explained by three cheap, label-free shift probes: prevalence shift, domain-classifier AUC, and importance-reweighting residual.",
    findings:
      "Shift type, not shift magnitude, predicts which trustworthiness axis degrades — and the responsible shift type is diagnosable in advance from unlabeled data, mapping each diagnosis to the appropriate remediation: recalibration, reweighting, or retraining.",
    matters:
      "It converts post-hoc deployment surprises into a pre-deployment diagnostic: an auditor can anticipate the failure axis before labels arrive, and it binds clinical, NLP, lending, and security evidence into one reproducible benchmark.",
    results: [
      { value: "4", label: "domains, one pre-registered protocol" },
      { value: "3", label: "label-free shift probes" },
      { value: "N=2000", label: "bootstrap CIs, BH-FDR controlled" },
      { value: "exit 0", label: "full pipeline re-run, byte-identical tables" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Rajveer-code/trustshift" },
      {
        label: "Hugging Face dataset",
        href: "https://huggingface.co/datasets/Rajveer-code/trustshift",
      },
    ],
  },
  {
    slug: "diabetes-external-validation",
    order: 2,
    title:
      "Comprehensive Evaluation of Machine Learning for Type 2 Diabetes Risk Prediction: Large-Scale External Validation and Fairness Analysis",
    shortTitle: "Diabetes External Validation",
    authors:
      "Rajveer Singh Pall, Sameer Yadav, Siddharth Bhalerao, Sourabh Sahu, Ritu Ahluwalia, Bhaskar Awadhiya",
    status: "Presented at CIPHER-2026 (IEEE EDS technically sponsored)",
    statusKind: "presented",
    year: "2026",
    themes: ["healthcare", "fairness", "deployment"],
    oneLiner:
      "Internally validated diabetes models lose discrimination and fairness when externally validated on 1.28M records — age subgroups suffer most.",
    problem:
      "Clinical risk models are usually reported with internal validation only. Do the numbers survive a different population, survey instrument, and label definition?",
    approach:
      "XGBoost and baselines developed on NHANES (n = 15,685) under strict nested cross-validation, then externally validated on BRFSS (n = 1,285,783) with DeLong CIs, calibration analysis, SHAP interpretability, and subgroup fairness audit. TRIPOD-AI reporting.",
    findings:
      "External AUC drops from 0.794 to 0.717 (−9.7%). The elderly subgroup degrades far more than the young (AUC 0.607 vs 0.742, gap 0.135) — aggregate accuracy hides an age-fairness failure.",
    matters:
      "The foundation result of the research program: benchmark performance is not deployment performance, and the failure is structured, not random.",
    results: [
      { value: "0.794 → 0.717", label: "internal → external AUC (−9.7%)" },
      { value: "0.135", label: "age-group AUC gap (18–39 vs ≥60)" },
      { value: "1,285,783", label: "external validation records" },
    ],
    links: [
      {
        label: "Code",
        href: "https://github.com/Rajveer-code",
      },
    ],
    caveat:
      "Conference presentation confirmed by certificate; proceedings indexing not claimed.",
  },
  {
    slug: "federated-diabetes",
    order: 3,
    title:
      "Privacy-Preserving Federated Learning for Diabetes Risk Prediction Across Demographically Heterogeneous Hospital Nodes",
    shortTitle: "Federated Diabetes",
    authors: "Rajveer Singh Pall",
    status: "Under journal review",
    statusKind: "review",
    year: "2026",
    themes: ["healthcare", "privacy", "fairness", "deployment"],
    oneLiner:
      "Federated diabetes screening audited on four deployability axes at once — generalisation, fairness, calibration, and privacy — not just accuracy.",
    problem:
      "Federated learning is sold on privacy. But does a federated clinical model also generalise externally, treat age groups fairly, and stay calibrated — simultaneously?",
    approach:
      "Three demographically heterogeneous simulated hospital nodes over NHANES; FedAvg / FedProx / FedNova / SCAFFOLD vs centralized controls; external validation on 1.28M BRFSS records; isotonic/Platt/temperature recalibration; DP-SGD ε-sweep with Opacus. A 4-page distillation is prepared for the ML4H 2026 Findings track.",
    findings:
      "FedAvg reaches external AUC 0.757 [0.756–0.758], beats centralized XGBoost (0.700), shows a 40% smaller internal–external gap than the matched centralized model (0.031 vs 0.052 — partly explained by data composition, stated openly), narrows the elderly–young fairness gap by 21.7%, and recalibrates from ECE 0.276 to 0.001. DP-SGD collapses utility at ε ≤ 5: current per-node sizes give no free privacy guarantee.",
    matters:
      "Moves FL evaluation beyond 'privacy by architecture' toward audit-first deployment evidence — including the honest negative on differential privacy.",
    results: [
      { value: "0.757", label: "FedAvg external AUC [0.756–0.758]" },
      { value: "−21.7%", label: "elderly–young fairness gap reduction" },
      { value: "0.276 → 0.001", label: "ECE after isotonic recalibration" },
      { value: "ε ≤ 5", label: "DP-SGD utility collapse point" },
    ],
    links: [
      {
        label: "Code",
        href: "https://github.com/Rajveer-code",
      },
    ],
  },
  {
    slug: "cpfe",
    order: 4,
    title:
      "Cross-Platform Generalisation Failure in Mental Health NLP: A Five-Axis Fairness Audit of Transformer Models on Social Media",
    shortTitle: "CPFE — Mental-Health NLP",
    authors: "Rajveer Singh Pall, Sameer Yadav",
    status: "Under journal review",
    statusKind: "review",
    year: "2026",
    themes: ["nlp-llm", "fairness", "healthcare", "deployment"],
    oneLiner:
      "Mental-health classifiers that look near-perfect in-platform collapse across platforms — on discrimination, calibration, equity, and even their explanations.",
    problem:
      "Mental-health NLP models report AUCs near 0.99 on one platform. What survives when the same model meets Reddit or Twitter language?",
    approach:
      "CPFE: a five-axis cross-platform audit — discrimination, calibration, statistical significance, prediction equity, attribution stability — across BERT/RoBERTa variants, five seeds, with DeLong CIs, bootstrap ECE, Bonferroni-corrected tests, and gradient-saliency Jaccard analysis.",
    findings:
      "Within-platform AUC of 0.983–0.987 degrades 30–40% cross-platform; ECE inflates up to 0.54; equity metrics fail for clinical proxy classes; attribution overlap falls to Jaccard ≈ 0 in 13 of 16 model–class pairs. Temperature scaling repairs calibration (−88% ECE) but not discrimination; target-domain fine-tuning recovers far more.",
    matters:
      "Fairness itself is shown to be a deployment-shift casualty: every trustworthiness axis can fail while the benchmark number stays excellent.",
    results: [
      { value: "0.983 → ~0.65", label: "AUC under platform shift (−30–40%)" },
      { value: "≈ 0", label: "attribution Jaccard in 13/16 pairs" },
      { value: "−88%", label: "ECE after temperature scaling" },
    ],
    links: [
      {
        label: "Code",
        href: "https://github.com/Rajveer-code",
      },
    ],
    caveat: "Labels are clinical proxies from emotion mappings, not diagnoses.",
  },
  {
    slug: "mortgage-disparities",
    order: 5,
    title:
      "Persistent Racial Disparities in U.S. Mortgage Approval: Evidence from 42 Million Applications, 2020–2024",
    shortTitle: "Mortgage Disparities",
    authors: "Rajveer Singh Pall",
    status: "Submitted to Journal of Housing Economics, March 2026",
    statusKind: "review",
    year: "2026",
    themes: ["fairness", "causal", "deployment"],
    oneLiner:
      "The public-data Black–White mortgage approval gap at national scale: how large, where it lives, and how it responds to institutional boundaries.",
    problem:
      "How large is the observable racial approval gap in U.S. mortgage lending, how much sits within lenders, and what do quasi-experimental boundaries reveal about its structure?",
    approach:
      "42,323,519 HMDA applications, 2020–2024. DFL reweighting, within-lender fixed effects, regression discontinuity at the 80% LTV / PMI boundary, difference-in-differences around the 2022 tightening, HonestDiD sensitivity, Manski partial-identification bounds, permutation tests.",
    findings:
      "Raw gap 14.95 pp; 68% unexplained by public observables; 74.6% of the gap is within-lender; the RDD adds ≈ +2.0 pp above the 80% LTV threshold in purchase loans; scale ≈ 126,000 fewer approvals for Black applicants annually. Bounds keep ≥ 44–55% unexplained under conservative assumptions.",
    matters:
      "Documents scale and institutional structure without overclaiming intent — the paper explicitly positions public-data estimates against confidential-data literature.",
    results: [
      { value: "14.95 pp", label: "raw Black–White approval gap" },
      { value: "74.6%", label: "of gap within-lender" },
      { value: "≈126,000", label: "fewer annual approvals at scale" },
    ],
    links: [],
    caveat:
      "HMDA lacks credit scores/assets; estimates framed as upper bounds on conditional differentials.",
  },
  {
    slug: "cate-hmda",
    order: 6,
    title:
      "Who Bears the Burden? Heterogeneous Racial Approval Differentials in U.S. Mortgage Lending: Causal Forest DML on 42 Million HMDA Applications",
    shortTitle: "CATE — Mortgage Lending",
    authors: "Rajveer Singh Pall",
    status: "Under journal review",
    statusKind: "review",
    year: "2026",
    themes: ["causal", "fairness", "trustworthy-ml"],
    oneLiner:
      "Not whether an average penalty exists, but who bears it — and through which underwriting channel.",
    problem:
      "Average disparity estimates hide distribution: which applicant profiles carry the largest conditional racial approval penalty, and is the mechanism applicant- or lender-controlled?",
    approach:
      "Partially linear Double Machine Learning with LightGBM nuisances and 5-fold cross-fitting; causal-forest CATE estimation with SHAP attribution; placebo, Oster, and Cinelli–Hazlett sensitivity analyses; within lender-year comparisons.",
    findings:
      "Pooled conditional differential −9.39 pp with wide heterogeneity (CATE SD 8.47 pp); 90.7% of Black applicants face a negative estimated effect. The channel is decisive: manual underwriting −14.79 pp vs automated −6.17 pp; −7.13 pp persists within the same lender and year.",
    matters:
      "Points the fairness question at an actionable mechanism — lender-controlled routing and handling — rather than at applicant characteristics.",
    results: [
      { value: "−9.39 pp", label: "conditional differential (pooled DML)" },
      { value: "−14.79 vs −6.17", label: "manual vs automated underwriting (pp)" },
      { value: "90.7%", label: "of Black applicants with negative effect" },
    ],
    links: [
      {
        label: "Code",
        href: "https://github.com/Rajveer-code",
      },
    ],
    caveat:
      "Level treated as an upper bound (no credit scores in HMDA); the channel contrast is the robust object.",
  },
  {
    slug: "indiafinbench",
    order: 7,
    title:
      "IndiaFinBench: An Evaluation Benchmark for Large Language Model Performance on Indian Financial Regulatory Text",
    shortTitle: "IndiaFinBench",
    authors: "Rajveer Singh Pall",
    status: "Under review (anonymous NLP venue)",
    statusKind: "review",
    year: "2026",
    themes: ["nlp-llm", "trustworthy-ml", "finance"],
    oneLiner:
      "The first expert-annotated benchmark for LLM reasoning over Indian financial regulation — where numerical thresholds and amendment chains break strong models.",
    problem:
      "Financial NLP benchmarks are Western-heavy. How do frontier LLMs handle SEBI/RBI regulatory text with dense amendment chains, jurisdiction-specific terminology, and numerical thresholds?",
    approach:
      "406 expert-annotated QA items over 192 SEBI/RBI documents (1992–2026) across regulatory interpretation, numerical reasoning, contradiction detection, and temporal reasoning; 12 contemporary LLMs; model-based and human annotation validation; a deployed hybrid-RAG open-book system with retrieval ablations.",
    findings:
      "Strict accuracy spans 70.4–89.7%. Numerical reasoning is the most discriminative axis (35.9 pp spread). Judge-corrected audits separate format non-compliance from true reasoning failure. Hybrid RRF retrieval lifts Recall@5 to 0.785 (+9.7 pp over dense-only).",
    matters:
      "Extends deployment-aware evaluation to LLMs and an underrepresented jurisdiction, with the dataset, leaderboard, and live demo all public.",
    results: [
      { value: "406", label: "expert QA items · 192 documents" },
      { value: "35.9 pp", label: "numerical-reasoning spread across 12 LLMs" },
      { value: "0.785", label: "Hybrid RRF Recall@5 (+9.7 pp)" },
    ],
    links: [
      { label: "Dataset", href: "https://huggingface.co/datasets/Rajveer-code/IndiaFinBench" },
      { label: "Live demo", href: "https://huggingface.co/spaces/Rajveer-code/IndiaFinBench" },
      { label: "GitHub", href: "https://github.com/Rajveer-code" },
    ],
  },
  {
    slug: "icgdf",
    order: 8,
    title:
      "When the Gate Stays Closed: Empirical Evidence of Near-Zero Cross-Sectional Predictability in Large-Cap NASDAQ Equities Using an IC-Gated Machine Learning Framework",
    shortTitle: "The Gate Stays Closed",
    authors: "Rajveer Singh Pall",
    status: "Under journal review",
    statusKind: "review",
    year: "2026",
    themes: ["finance", "deployment", "trustworthy-ml"],
    oneLiner:
      "A deployment gate for financial ML — and the discipline to report that it stayed closed.",
    problem:
      "Can a financial ML model prove cross-sectional predictive skill before deployment — and what should happen when it cannot?",
    approach:
      "IC-Gated Deployment Framework: a two-stage statistical gate (Newey–West HAC t-test on daily information coefficients plus permutation confirmation) over 12 expanding walk-forward folds, 1,512 out-of-sample days, with isotonic calibration and a momentum positive control.",
    findings:
      "Mean IC −0.0005; the gate opens in 0 of 12 folds. Calibration stays excellent (ECE < 0.025) despite zero discrimination — calibration quality is not deployment readiness. The naive t-test alternative false-positives 11.8% of the time; the full gate, 0.0%.",
    matters:
      "An honest null result engineered as methodology: the same audit-first stance the program applies to healthcare and lending, applied to the temptation-rich domain of trading.",
    results: [
      { value: "0 / 12", label: "folds passing the deployment gate" },
      { value: "< 0.025", label: "ECE while IC ≈ 0 — calibration ≠ readiness" },
      { value: "11.8% → 0%", label: "false-positive rate, naive test → ICGDF" },
    ],
    links: [
      {
        label: "Code",
        href: "https://github.com/Rajveer-code",
      },
    ],
  },
  {
    slug: "conviction-ranking",
    order: 9,
    title:
      "Overcoming the Transaction Cost Trap: Cross-Sectional Conviction Ranking in Machine Learning Equity Prediction",
    shortTitle: "Conviction Ranking",
    authors: "Rajveer Singh Pall",
    status: "Working paper",
    statusKind: "working",
    year: "2026",
    themes: ["finance", "deployment"],
    oneLiner:
      "When a small signal exists, execution design — not the classifier — decides whether it survives transaction costs.",
    problem:
      "Threshold execution of ML signals over-trades small edges to death. Can cross-sectional ranking preserve a statistically real signal at realistic costs?",
    approach:
      "Calibrated probabilities as ordinal conviction over a seven-stock large-cap tech cross-section; Top-K ranking vs threshold baselines; 12 walk-forward folds; Lo HAC Sharpe CIs, permutation tests, Benjamini–Hochberg FDR; explicit regime analysis.",
    findings:
      "Mean daily IC 0.0197 (p = 0.034). Top-1 ranking achieves Sharpe 1.183 with a break-even one-way cost of 24.2 bps — 4.8× the assumed cost — while threshold execution destroys the same signal. Performance is regime-dependent and the universe is survivor-selected; both stated plainly.",
    matters:
      "The constructive companion to the null result: deployment translation, costs, and regime honesty as first-class methodology.",
    results: [
      { value: "1.183", label: "Top-1 Sharpe (Lo HAC CI [0.382, 1.984])" },
      { value: "24.2 bps", label: "break-even cost, 4.8× assumed" },
      { value: "0.0197", label: "mean daily IC (p = 0.034)" },
    ],
    links: [],
    caveat: "Survivor-selected tech universe; regime-dependent. Not investment advice.",
  },
];

export const flagship = publications.find((p) => p.flagship)!;

export const timeline = [
  {
    period: "Early 2025",
    title: "Clinical ML meets external validation",
    theme: "Healthcare AI",
    text: "Diabetes risk models built on NHANES are stress-tested on 1.28M BRFSS records. External AUC falls 9.7% — and the elderly lose the most. First evidence that the benchmark hides the failure.",
    slug: "diabetes-external-validation",
  },
  {
    period: "2025",
    title: "Privacy joins the audit",
    theme: "Federated Learning",
    text: "The same clinical problem, restructured across heterogeneous hospital nodes. Federated training generalises better than centralized — but differential privacy collapses at realistic budgets. Four axes, audited together.",
    slug: "federated-diabetes",
  },
  {
    period: "2025",
    title: "Fairness fails under platform shift",
    theme: "NLP · Fairness",
    text: "Mental-health classifiers at AUC 0.98 collapse on Reddit and Twitter — calibration, equity, and even the models' explanations degrade. The audit grows a fifth axis: attribution stability.",
    slug: "cpfe",
  },
  {
    period: "2025–2026",
    title: "Causal structure of a 42M-application gap",
    theme: "Causal Inference",
    text: "Mortgage lending at national scale: the racial approval gap is quantified, bounded, and traced to a lender-controlled mechanism — manual underwriting more than doubles the penalty of automated systems.",
    slug: "cate-hmda",
  },
  {
    period: "2026",
    title: "LLMs meet an underrepresented jurisdiction",
    theme: "LLM Evaluation",
    text: "IndiaFinBench: 406 expert-annotated questions over SEBI/RBI regulation. Numerical reasoning splits frontier models by 36 points. Evaluation infrastructure becomes a public artifact.",
    slug: "indiafinbench",
  },
  {
    period: "2026",
    title: "The discipline to say no",
    theme: "Deployment Gates",
    text: "A statistical deployment gate for financial ML stays closed across all 12 folds — published as a null result. Its companion shows execution design, not model skill, decides what survives costs.",
    slug: "icgdf",
  },
  {
    period: "Mid 2026",
    title: "TrustShift — the program becomes a theory",
    theme: "Capstone",
    text: "One pre-registered protocol across clinical, NLP, lending, and security domains: shift type, not shift magnitude, determines which trustworthiness axis fails — and cheap label-free probes can diagnose it in advance.",
    slug: "trustshift",
  },
  {
    period: "Next",
    title: "Audit infrastructure as a field",
    theme: "Future",
    text: "Shift-type diagnosis before deployment, runtime audit for generative systems, and evaluation that treats fairness, calibration, and validity as one object — not three papers.",
    slug: null,
  },
];

export const openScience = [
  {
    name: "trustshift",
    kind: "Benchmark · Reproduction",
    text: "Cross-domain deployment-shift audit: full pipeline, prediction parquets, result JSONs. Fresh-clone reproduction verified byte-identical.",
    links: [
      { label: "GitHub", href: "https://github.com/Rajveer-code/trustshift" },
      { label: "Dataset", href: "https://huggingface.co/datasets/Rajveer-code/trustshift" },
    ],
  },
  {
    name: "IndiaFinBench",
    kind: "Dataset · Live demo",
    text: "406 expert-annotated regulatory QA items, leaderboard for 12 LLMs, and a deployed hybrid-RAG open-book system.",
    links: [
      { label: "Dataset", href: "https://huggingface.co/datasets/Rajveer-code/IndiaFinBench" },
      { label: "Demo", href: "https://huggingface.co/spaces/Rajveer-code/IndiaFinBench" },
    ],
  },
  {
    name: "fairscope",
    kind: "Python library",
    text: "Subgroup-stratified, calibration-aware fairness auditing: DeLong CIs per subgroup, subgroup ECE/MCE, gap significance testing, recalibration — with healthcare, NLP, federated, and lending modules.",
    links: [{ label: "GitHub", href: "https://github.com/Rajveer-code" }],
  },
  {
    name: "aria-audit",
    kind: "Runtime audit · Dataset",
    text: "Five-axis runtime fairness audit for locally deployed LLMs — calibration, faithfulness, consistency, equity, attribution — wrapping any model on consumer hardware.",
    links: [
      { label: "GitHub", href: "https://github.com/Rajveer-code" },
      { label: "Benchmark", href: "https://huggingface.co/datasets/rajveerpall/aria-audit-bench" },
    ],
  },
  {
    name: "Reproducibility repos",
    kind: "Research code",
    text: "Every manuscript ships a pipeline that regenerates its numbers from result files — federated diabetes, CATE-HMDA, ICGDF and more.",
    links: [{ label: "All repositories", href: "https://github.com/Rajveer-code" }],
  },
];

export const impact = [
  { value: "9", label: "research manuscripts — 1 presented, 8 under review or working" },
  { value: "4", label: "domains bound by one audit protocol" },
  { value: "42M", label: "mortgage applications analysed" },
  { value: "1.28M", label: "records in external clinical validation" },
  { value: "406", label: "expert-annotated benchmark items" },
  { value: "3", label: "public datasets on Hugging Face" },
];

export const identity = {
  name: "Rajveer Singh Pall",
  role: "AI Researcher — Trustworthy Machine Learning",
  affiliation: "B.Tech Computer Science & Business Systems, GGITS, expected 2027",
  email: "rajveerpall04@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/Rajveer-code" },
    { label: "Hugging Face", href: "https://huggingface.co/Rajveer-code" },
    { label: "Google Scholar", href: "https://scholar.google.com/citations?hl=en&user=47CvVCcAAAAJ" },
    { label: "ORCID", href: "https://orcid.org/0009-0001-6762-6134" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rajveer-singh-pall/" },
  ],
};
