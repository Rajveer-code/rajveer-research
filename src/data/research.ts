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

export interface FlowStep {
  label: string;
  note: string;
}

export interface FigureBar {
  label: string;
  value: number; // bar length (abs), zero-based scale
  display: string; // printed verbatim — may be a range
  accent?: boolean; // ultramarine emphasis; others render neutral gray
}

export interface Figure {
  title: string;
  max: number; // scale maximum (bars are value/max wide, zero-based)
  note?: string;
  bars: FigureBar[];
}

/** A real figure from the paper's repo (src/assets/figures/<slug>/<file>). */
export interface PaperFigure {
  file: string;
  caption: string;
}

/** TrustShift-fig1-style verdict diagram, rendered by SummaryDiagram.astro. */
export type Mark = "check" | "x" | "dash";
export type Tone = "bad" | "warn" | "info" | "good";

export interface DiagramBranch {
  title: string;
  sub?: string;
  tone: Tone;
  rows: { label: string; mark: Mark }[];
  action: string;
  tag?: string;
}

export interface SummaryDiagramSpec {
  premise: string;
  probe?: string;
  branches: DiagramBranch[];
  punchline: string;
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
  plain: string; // jargon-free explanation for readers new to the field
  flow: FlowStep[]; // method flowchart steps
  figures: Figure[]; // data figures from verified numbers only
  paperFigures?: PaperFigure[]; // actual publication figures from the repo
  diagram?: SummaryDiagramSpec; // one-figure summary of the paper's argument
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
    plain:
      "A machine-learning model is trained on yesterday's data and then released into a world that keeps changing. Everyone knows performance can drop — but not all drops are alike. Sometimes the model still ranks people correctly but its probability estimates become dishonest; sometimes it fails one demographic group; sometimes it collapses entirely. This paper studies four completely different fields at once — medicine, social-media language, mortgage lending, and network attacks — under one identical audit, and finds that the kind of change in the world, not the amount of change, decides what breaks. Better still, the kind is detectable in advance, from unlabeled data, so the right repair can be chosen before anyone is harmed.",
    flow: [
      { label: "Deployment shift", note: "one trained model per domain meets a changed population" },
      { label: "Three label-free probes", note: "prevalence shift · domain-classifier AUC · reweighting residual" },
      { label: "Shift-type diagnosis", note: "label, covariate, or concept shift — before outcomes arrive" },
      { label: "Failure taxonomy", note: "which axis breaks: discrimination, calibration, or subgroups" },
      { label: "Matched remediation", note: "recalibrate · reweight · retrain — chosen by diagnosis" },
    ],
    figures: [],
    paperFigures: [
      {
        file: "fig1_taxonomy.png",
        caption:
          "The failure taxonomy: each shift type maps to the trustworthiness axis it degrades, across all four domains.",
      },
      {
        file: "fig2_shift_bars.png",
        caption:
          "The audit, domain by domain: discrimination, calibration, and subgroup reliability measured under each deployment shift.",
      },
      {
        file: "fig3_headline_scatter.png",
        caption:
          "The headline result: deployment damage organised by shift type rather than shift magnitude across the shift points.",
      },
      {
        file: "fig5_remediation.png",
        caption:
          "The remediation ladder: label-cheap recalibration repairs calibration everywhere; discrimination requires more.",
      },
    ],
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
    order: 6,
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
    plain:
      "A disease-risk model that shines on its home dataset can still mislead in the real world. We trained a standard diabetes risk model the careful way — strict cross-validation, tuned hyperparameters — and then did what most papers skip: tested it on 1.28 million people from a completely different national survey. Overall accuracy dropped about ten percent. Worse, the drop was not shared equally: for people over 60 the model degrades far more than for the young — a fairness failure that the single headline number completely hides.",
    flow: [
      { label: "Develop carefully", note: "NHANES cohort (15,685) · nested cross-validation · Bayesian tuning" },
      { label: "Explain", note: "SHAP attribution over eight non-laboratory predictors" },
      { label: "Externally validate", note: "BRFSS, 1,285,783 records — different survey, different population" },
      { label: "Audit subgroups", note: "age, sex, BMI — with DeLong confidence intervals" },
      { label: "Report to standard", note: "TRIPOD-AI checklist" },
    ],
    figures: [
      {
        title: "AUC — where the model quietly fails",
        max: 1,
        note: "External validation costs ~10% overall; adults over 60 lose far more (gap 0.135, p < 0.001).",
        bars: [
          { label: "Internal (NHANES)", value: 0.794, display: "0.794" },
          { label: "External (BRFSS)", value: 0.717, display: "0.717" },
          { label: "External, age 18–39", value: 0.742, display: "0.742" },
          { label: "External, age ≥60", value: 0.607, display: "0.607", accent: true },
        ],
      },
    ],
    paperFigures: [
      {
        file: "01_centralised_roc.png",
        caption:
          "ROC curves for the centralized model — the discrimination that external validation then puts to the test.",
      },
      {
        file: "02_centralised_fairness_age.png",
        caption:
          "The age-fairness audit: performance split by age group, where the headline number hides the failure.",
      },
    ],
    diagram: {
      premise: "XGBoost, strict nested CV — internal AUC 0.794. Looks deployable.",
      probe: "External validation — BRFSS, 1,285,783 records, different survey & population",
      branches: [
        {
          title: "Overall",
          sub: "AUC 0.794 → 0.717",
          tone: "warn",
          rows: [
            { label: "Discrimination −9.7%", mark: "x" },
            { label: "PPV 43.8% → 22.3%", mark: "x" },
          ],
          action: "Never report internal numbers alone",
        },
        {
          title: "Age 18–39",
          sub: "external AUC 0.742",
          tone: "good",
          rows: [
            { label: "Discrimination holds", mark: "check" },
            { label: "Usable signal", mark: "check" },
          ],
          action: "Screening viable for the young",
        },
        {
          title: "Age ≥ 60",
          sub: "external AUC 0.607",
          tone: "bad",
          rows: [
            { label: "Gap 0.135, p < 0.001", mark: "x" },
            { label: "Highest-risk group", mark: "x" },
          ],
          action: "Do not deploy for elderly without redress",
        },
        {
          title: "Calibration",
          sub: "Brier 0.123",
          tone: "info",
          rows: [
            { label: "Overestimates high risk", mark: "x" },
            { label: "Sex gap n.s. (p = 0.142)", mark: "dash" },
          ],
          action: "Recalibrate before any clinical use",
        },
      ],
      punchline: "One aggregate number hid a structured, age-shaped failure.",
    },
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
    order: 5,
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
    plain:
      "Hospitals cannot share patient records, so how do they train one model together? Federated learning sends the model to the data instead of the data to a server. This paper checks what federated papers usually don't: whether the jointly trained model still works on a different population of 1.28 million people, whether it treats the elderly fairly, whether its probabilities are honest, and whether formal privacy protection actually holds. Three of the four go surprisingly well — the federated model beats the centralized one externally. The fourth is an honest negative: differential privacy destroys the model at realistic settings, and the paper says so plainly.",
    flow: [
      { label: "Split realistically", note: "three demographically unequal simulated hospital nodes" },
      { label: "Train federated", note: "FedAvg · FedProx · FedNova · SCAFFOLD vs centralized controls" },
      { label: "Validate externally", note: "1.28M BRFSS records — a population no node ever saw" },
      { label: "Audit fairness + calibration", note: "elderly–young gap · ECE with recalibration ladder" },
      { label: "Stress privacy", note: "DP-SGD ε-sweep — where utility survives, and where it collapses" },
    ],
    figures: [
      {
        title: "External AUC on 1.28M unseen records",
        max: 1,
        note: "The federated model generalises better than both centralized controls.",
        bars: [
          { label: "FedAvg (federated)", value: 0.757, display: "0.757", accent: true },
          { label: "Centralized, same architecture", value: 0.749, display: "0.749" },
          { label: "Centralized XGBoost", value: 0.7, display: "0.700" },
        ],
      },
    ],
    paperFigures: [
      {
        file: "10_external_validation_roc.png",
        caption:
          "External validation on 1.28M BRFSS records: federated and centralized models compared where it counts.",
      },
      {
        file: "06_fairness_age_comparison.png",
        caption:
          "Elderly–young fairness across training strategies — the axis most clinical papers never report.",
      },
      {
        file: "05_dp_tradeoff.png",
        caption:
          "The privacy–utility trade-off: DP-SGD across the ε sweep, including the collapse the paper reports plainly.",
      },
    ],
    diagram: {
      premise: "Three unequal hospital nodes, no data ever shared — FedAvg training",
      probe: "Deployability audit — four axes at once, externally on 1.28M records",
      branches: [
        {
          title: "Generalisation",
          sub: "AUC 0.757 vs 0.700",
          tone: "good",
          rows: [
            { label: "Beats centralized XGBoost", mark: "check" },
            { label: "40% smaller external gap", mark: "check" },
          ],
          action: "Federated wins where it counts",
        },
        {
          title: "Fairness",
          sub: "elderly–young gap",
          tone: "good",
          rows: [
            { label: "0.069 → 0.054 (−21.7%)", mark: "check" },
            { label: "BMI gap 0.066 → 0.016", mark: "check" },
          ],
          action: "Heterogeneous nodes help subgroups",
        },
        {
          title: "Calibration",
          sub: "ECE 0.276 raw",
          tone: "info",
          rows: [
            { label: "Raw probabilities dishonest", mark: "x" },
            { label: "Isotonic → 0.001", mark: "check" },
          ],
          action: "Recalibrate — cheap and sufficient",
        },
        {
          title: "Privacy (DP)",
          sub: "DP-SGD ε sweep",
          tone: "bad",
          rows: [
            { label: "AUC ≈ 0.50 at ε ≤ 5", mark: "x" },
            { label: "No formal guarantee at node size", mark: "x" },
          ],
          action: "Report the collapse plainly",
        },
      ],
      punchline: "Three of four deployability axes pass. The fourth is reported, not hidden.",
    },
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
    order: 7,
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
    plain:
      "Software that scans social-media posts for signs of depression or anxiety is usually trained and tested on a single platform, where it looks near-perfect. We took such models — AUC above 0.98 — and simply moved them to Reddit and Twitter. Accuracy collapsed by a third. Their confidence scores became badly dishonest. Fairness metrics failed for exactly the classes that matter clinically. And the words the models relied on changed almost completely from platform to platform — the model was never reading what its developers thought it was reading.",
    flow: [
      { label: "Train in-platform", note: "transformer classifiers, 35,556 posts, five seeds" },
      { label: "Audit on five axes", note: "discrimination · calibration · significance · equity · attribution" },
      { label: "Cross platforms", note: "same models, Reddit and Twitter language" },
      { label: "Attempt repair", note: "temperature scaling fixes calibration only; fine-tuning recovers more" },
    ],
    figures: [
      {
        title: "Calibration error (ECE) as the platform changes",
        max: 0.55,
        note: "Bars drawn at the lower bound of each reported range — the conservative reading.",
        bars: [
          { label: "Home platform", value: 0.056, display: "0.056–0.060" },
          { label: "Reddit", value: 0.196, display: "0.196–0.229" },
          { label: "Twitter", value: 0.499, display: "0.499–0.542", accent: true },
        ],
      },
    ],
    paperFigures: [
      {
        file: "figure1_forest_plot.png",
        caption:
          "Forest plot of cross-platform AUC with DeLong confidence intervals across models and platforms.",
      },
      {
        file: "figure2_platform_degradation.png",
        caption:
          "Degradation by platform: what a near-perfect in-platform model loses on Reddit and Twitter.",
      },
      {
        file: "figure3_calibration_curves.png",
        caption:
          "Calibration curves in-domain versus cross-platform — confidence becomes dishonest under shift.",
      },
    ],
    diagram: {
      premise: "Transformer classifiers in-platform — AUC 0.983–0.987. Near perfect.",
      probe: "CPFE — five-axis audit under platform shift to Reddit & Twitter",
      branches: [
        {
          title: "Discrimination",
          sub: "−30 to −40%",
          tone: "bad",
          rows: [
            { label: "Reddit −30.3–35.4%", mark: "x" },
            { label: "Twitter −37.9–39.5%", mark: "x" },
          ],
          action: "Fine-tune on target (+0.216 AUC)",
        },
        {
          title: "Calibration",
          sub: "ECE up to 0.54",
          tone: "info",
          rows: [
            { label: "Confidence dishonest", mark: "x" },
            { label: "Temp scaling −88% ECE", mark: "check" },
          ],
          action: "Repairable — but fixes nothing else",
        },
        {
          title: "Equity",
          sub: "clinical proxy classes",
          tone: "bad",
          rows: [
            { label: "DI < 0.17 raw", mark: "x" },
            { label: "EOD ≈ 0.75–0.83", mark: "x" },
          ],
          action: "Fails exactly where it matters",
        },
        {
          title: "Attribution",
          sub: "top-K token overlap",
          tone: "warn",
          rows: [
            { label: "Jaccard ≈ 0 in 13/16", mark: "x" },
            { label: "Reads different words", mark: "x" },
          ],
          action: "The model is not reading what you think",
        },
      ],
      punchline: "Every trustworthiness axis can fail while the benchmark stays near-perfect.",
    },
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
    order: 3,
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
    plain:
      "Every U.S. mortgage application leaves a public record. Reading all 42 million of them from 2020–2024, Black applicants are approved about 15 percentage points less often than White applicants. This paper measures that gap carefully: most of it (68%) cannot be explained by anything visible in the public data, and three-quarters of it lives inside individual lenders rather than between them. Two natural experiments — an insurance-driven threshold at 80% loan-to-value, and the Federal Reserve's 2022 tightening — each widen the gap further. The paper never claims to prove intent; it maps the scale and the structure.",
    flow: [
      { label: "Assemble", note: "42,323,519 applications, 5,500+ lenders, 2020–2024" },
      { label: "Reweight", note: "DiNardo–Fortin–Lemieux: compare statistically similar applicants" },
      { label: "Look within lenders", note: "fixed effects — is it between institutions, or inside them?" },
      { label: "Natural experiments", note: "RDD at the 80% LTV insurance boundary · DiD around 2022 tightening" },
      { label: "Bound the unknown", note: "partial identification calibrated to consumer-finance data" },
    ],
    figures: [
      {
        title: "Black–White approval gap in percentage points",
        max: 17,
        note: "74.6% of the national gap sits within individual lenders; scale ≈ 126,000 fewer approvals per year.",
        bars: [
          { label: "National raw gap", value: 14.95, display: "14.95 pp", accent: true },
          { label: "Midwest regional mean", value: 16.1, display: "16.1 pp" },
          { label: "West regional mean", value: 9.3, display: "9.3 pp" },
        ],
      },
    ],
    diagram: {
      premise: "42,323,519 applications, 2020–2024 — raw Black–White gap 14.95 pp",
      probe: "Where does the gap live? Four identification strategies",
      branches: [
        {
          title: "Observables",
          sub: "DFL reweighting",
          tone: "bad",
          rows: [
            { label: "68% not explained", mark: "x" },
            { label: "Bounds: ≥ 44–55% remains", mark: "x" },
          ],
          action: "Public data cannot explain it away",
        },
        {
          title: "Institutions",
          sub: "within-lender FE",
          tone: "warn",
          rows: [
            { label: "74.6% within lenders", mark: "x" },
            { label: "Rising 66.8% → 78.3%", mark: "x" },
          ],
          action: "Inside institutions, not between them",
        },
        {
          title: "Boundaries",
          sub: "RDD · DiD",
          tone: "info",
          rows: [
            { label: "+2.0 pp above 80% LTV", mark: "x" },
            { label: "+1.5 pp after 2022 tightening", mark: "x" },
          ],
          action: "Institutional edges widen it",
        },
        {
          title: "Scale",
          sub: "annual impact",
          tone: "bad",
          rows: [
            { label: "≈ 126,000 fewer approvals", mark: "x" },
            { label: "Regional means 9.3–16.1 pp", mark: "dash" },
          ],
          action: "Structure documented, intent not claimed",
        },
      ],
      punchline: "The gap lives inside institutions — and widens at their boundaries.",
    },
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
    links: [{ label: "SSRN preprint", href: "https://ssrn.com/abstract=6334459" }],
    caveat:
      "HMDA lacks credit scores/assets; estimates framed as upper bounds on conditional differentials.",
  },
  {
    slug: "cate-hmda",
    order: 2,
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
    plain:
      "Knowing the average approval gap is not enough — averages hide who actually pays. Using methods from modern causal inference (the same family behind clinical-trial analysis), this paper estimates the approval penalty for each applicant profile across 42 million mortgage applications. The distribution is wide: nine in ten Black applicants face some estimated penalty, and the decisive factor is not the applicant but the process — applications handled by human underwriters carry more than double the penalty of those decided by automated systems. That points the fairness question at something a regulator can act on: how applications are routed.",
    flow: [
      { label: "Engineer at scale", note: "42M HMDA applications → 2M/1.5M estimation samples" },
      { label: "Isolate the differential", note: "double machine learning, LightGBM nuisances, 5-fold cross-fitting" },
      { label: "Map who bears it", note: "causal forest estimates the penalty per applicant profile" },
      { label: "Find the mechanism", note: "manual vs automated underwriting · same lender, same year" },
      { label: "Attack the result", note: "placebo shuffles · Oster bounds · Cinelli–Hazlett sensitivity" },
    ],
    figures: [
      {
        title: "Conditional approval penalty by underwriting channel",
        max: 15,
        note: "Bar length = size of the estimated Black–White differential (all negative). The channel, not the applicant, is decisive.",
        bars: [
          { label: "Manual underwriting", value: 14.79, display: "−14.79 pp", accent: true },
          { label: "Pooled (all channels)", value: 9.39, display: "−9.39 pp" },
          { label: "Same lender, same year", value: 7.13, display: "−7.13 pp" },
          { label: "Automated systems", value: 6.17, display: "−6.17 pp" },
        ],
      },
    ],
    paperFigures: [
      {
        file: "fig2_dml_results.png",
        caption:
          "Double-machine-learning estimates of the conditional approval differential across specifications.",
      },
      {
        file: "fig3_cate_distribution.png",
        caption:
          "The distribution of individual-level estimated effects: wide heterogeneity, overwhelmingly negative.",
      },
      {
        file: "fig5_shap_attribution.png",
        caption:
          "SHAP attribution over the causal-forest estimates: what drives who bears the penalty.",
      },
    ],
    diagram: {
      premise: "Average conditional penalty −9.39 pp — but averages hide who pays",
      probe: "Causal forest DML — the penalty estimated per applicant profile",
      branches: [
        {
          title: "Manual underwriting",
          sub: "−14.79 pp",
          tone: "bad",
          rows: [
            { label: "More than 2× automated", mark: "x" },
            { label: "Lender-controlled routing", mark: "x" },
          ],
          action: "The channel is the mechanism",
        },
        {
          title: "Automated systems",
          sub: "−6.17 pp",
          tone: "info",
          rows: [
            { label: "Penalty persists", mark: "x" },
            { label: "But far smaller", mark: "check" },
          ],
          action: "Automation narrows the gap",
        },
        {
          title: "Same lender-year",
          sub: "−7.13 pp",
          tone: "warn",
          rows: [
            { label: "Survives within institution", mark: "x" },
            { label: "Not a between-lender artifact", mark: "x" },
          ],
          action: "Not explained by lender mix",
        },
        {
          title: "Distribution",
          sub: "CATE SD 8.47 pp",
          tone: "bad",
          rows: [
            { label: "90.7% face a penalty", mark: "x" },
            { label: "Placebo signal ratio 17.9×", mark: "check" },
          ],
          action: "Wide, real heterogeneity",
        },
      ],
      punchline: "Who bears the burden depends on how the file is processed.",
    },
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
      { label: "SSRN preprint", href: "https://ssrn.com/abstract=6984959" },
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
    order: 4,
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
    plain:
      "Large language models are increasingly asked legal and financial questions, but nearly all of their testing uses American and European text. This benchmark tests twelve leading models on India's actual financial rulebook — SEBI and RBI regulations spanning 1992 to 2026 — with 406 questions written and verified by hand. The questions require exactly what real compliance work requires: interpreting rules, calculating with legal thresholds, spotting contradictions, and tracking rules that changed over time. The clearest finding: numbers are the hardest. On numerical reasoning alone, model scores spread by 36 points.",
    flow: [
      { label: "Curate the corpus", note: "192 SEBI/RBI regulatory documents, 1992–2026" },
      { label: "Write expert QA", note: "406 items: interpretation · numerical · contradiction · temporal" },
      { label: "Validate annotations", note: "model-based and human cross-checks, agreement reported" },
      { label: "Evaluate 12 LLMs", note: "strict scoring plus judge-corrected audit (format vs reasoning)" },
      { label: "Ship it open", note: "public dataset, leaderboard, and live retrieval-augmented demo" },
    ],
    figures: [
      {
        title: "What the benchmark asks (items per task type)",
        max: 174,
        bars: [
          { label: "Regulatory interpretation", value: 174, display: "174" },
          { label: "Numerical reasoning", value: 92, display: "92", accent: true },
          { label: "Temporal reasoning", value: 78, display: "78" },
          { label: "Contradiction detection", value: 62, display: "62" },
        ],
      },
      {
        title: "Strict accuracy, selected models (%)",
        max: 100,
        note: "Numerical reasoning alone spreads models by 35.9 points.",
        bars: [
          { label: "Gemini 2.5 Flash", value: 89.7, display: "89.7", accent: true },
          { label: "Qwen3-32B", value: 85.5, display: "85.5" },
          { label: "LLaMA-3.3-70B", value: 83.7, display: "83.7" },
          { label: "Llama 4 Scout 17B", value: 83.3, display: "83.3" },
          { label: "Gemma 4 E4B", value: 70.4, display: "70.4" },
        ],
      },
    ],
    paperFigures: [
      {
        file: "difficulty_lineplot.png",
        caption:
          "Accuracy by item difficulty: where models separate as questions get harder.",
      },
      {
        file: "heatmap.png",
        caption:
          "The model × task-type error landscape across regulatory interpretation, numerical, contradiction, and temporal reasoning.",
      },
      {
        file: "inter_task_correlation.png",
        caption:
          "Inter-task correlations: strength on one regulatory skill does not guarantee another.",
      },
    ],
    diagram: {
      premise: "12 frontier LLMs — 406 expert questions on SEBI/RBI regulation",
      probe: "Four task types — strict scoring plus judge-corrected audit",
      branches: [
        {
          title: "Interpretation",
          sub: "174 items",
          tone: "good",
          rows: [
            { label: "Strongest task overall", mark: "check" },
            { label: "Top model 89.7% overall", mark: "check" },
          ],
          action: "Vocabulary is not the barrier",
        },
        {
          title: "Numerical",
          sub: "92 items",
          tone: "bad",
          rows: [
            { label: "35.9 pp model spread", mark: "x" },
            { label: "Most discriminative axis", mark: "x" },
          ],
          action: "Thresholds separate frontier models",
        },
        {
          title: "Temporal · Contradiction",
          sub: "78 + 62 items",
          tone: "warn",
          rows: [
            { label: "Amendment chains bite", mark: "x" },
            { label: "Mixed performance", mark: "dash" },
          ],
          action: "Regulatory time is hard",
        },
        {
          title: "Strict vs judge",
          sub: "scoring audit",
          tone: "info",
          rows: [
            { label: "Format ≠ reasoning failure", mark: "check" },
            { label: "DeepSeek R1 re-ranked", mark: "check" },
          ],
          action: "Audit the scorer, not just the model",
        },
      ],
      punchline: "Numerical thresholds — not vocabulary — separate frontier models.",
    },
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
    plain:
      "Most trading-model papers report wins. This one builds the exam a model must pass before it is allowed to trade real money — and then reports that its own model failed that exam twelve times out of twelve. That is the contribution: a statistical gate that separates 'looks profitable in a backtest' from 'provable skill'. A naive statistical test would have green-lit a skill-less model 11.8% of the time; the full gate never did. One more twist: the model's probability estimates were nearly perfect even though it had zero predictive skill — proof that a well-calibrated model is not the same as a deployable one.",
    flow: [
      { label: "Build honestly", note: "49 strictly causal features, 30 NASDAQ stocks, no lookahead" },
      { label: "Walk forward", note: "12 expanding-window folds, 1,512 out-of-sample days, 2-day embargo" },
      { label: "Measure skill", note: "daily information coefficient → Newey–West HAC t-test" },
      { label: "Confirm by permutation", note: "both stages must pass — either fails, no deployment" },
      { label: "Report the null", note: "gate closed 0/12; calibration excellent anyway (ECE < 0.025)" },
    ],
    figures: [
      {
        title: "False-positive rate on skill-less models (%)",
        max: 12,
        note: "Simulated null (no real signal): the naive test deploys anyway; the gate never does.",
        bars: [
          { label: "Naive t-test", value: 11.8, display: "11.8%", accent: true },
          { label: "Full ICGDF gate", value: 0, display: "0.0%" },
        ],
      },
    ],
    paperFigures: [
      {
        file: "fig03_fold_level_ic.png",
        caption:
          "Fold-level information coefficients across all 12 walk-forward folds: the gate never opens.",
      },
      {
        file: "fig06_permutation_ic.png",
        caption:
          "The permutation test: the observed IC sits squarely inside the no-skill distribution.",
      },
      {
        file: "fig02_power_analysis.png",
        caption:
          "Power analysis: the study could have detected a much smaller real signal than practitioners claim.",
      },
    ],
    diagram: {
      premise: "Ensemble backtest, 30 NASDAQ stocks — looks tradable?",
      probe: "ICGDF — two-stage statistical gate before any deployment",
      branches: [
        {
          title: "HAC t-test",
          sub: "daily IC series",
          tone: "bad",
          rows: [
            { label: "Mean IC −0.0005", mark: "x" },
            { label: "t = −0.09", mark: "x" },
          ],
          action: "Stage 1: fail",
        },
        {
          title: "Permutation",
          sub: "confirmation stage",
          tone: "bad",
          rows: [
            { label: "≈ random selection", mark: "x" },
            { label: "Gate open 0/12 folds", mark: "x" },
          ],
          action: "Stage 2: fail",
        },
        {
          title: "Calibration",
          sub: "the trap",
          tone: "info",
          rows: [
            { label: "ECE < 0.025 all folds", mark: "check" },
            { label: "Zero predictive skill", mark: "x" },
          ],
          action: "Honest probabilities ≠ deployable model",
        },
        {
          title: "Verdict",
          sub: "vs naive test",
          tone: "good",
          rows: [
            { label: "Naive FP rate 11.8%", mark: "x" },
            { label: "ICGDF FP rate 0.0%", mark: "check" },
          ],
          action: "Do not deploy — and publish that",
        },
      ],
      punchline: "Calibration quality is not deployment readiness.",
    },
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
      { label: "SSRN preprint", href: "https://ssrn.com/abstract=6742700" },
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
    status: "Working paper — SSRN",
    statusKind: "working",
    year: "2026",
    themes: ["finance", "deployment"],
    oneLiner:
      "When a small signal exists, execution design — not the classifier — decides whether it survives transaction costs.",
    plain:
      "A tiny predictive edge usually dies in fees: if you act on every signal, you trade so often that costs eat everything. This paper keeps the same predictive model but changes how it is used — each day, rank all stocks by the model's calibrated confidence and trade only the single top pick. The edge survives realistic costs with wide margin: fees would have to be 4.8 times larger than assumed before profits vanish. The honesty is in the framing: the stock universe is small and survivor-picked, and most of the performance comes from one market regime — both stated in the paper, not hidden.",
    flow: [
      { label: "Calibrate", note: "ensemble probabilities made honest via isotonic regression, per fold" },
      { label: "Rank daily", note: "calibrated confidence as ordinal conviction across the cross-section" },
      { label: "Trade only the top", note: "Top-K portfolios vs threshold execution of identical signals" },
      { label: "Charge realistic costs", note: "break-even analysis · Lo HAC Sharpe CIs · permutation tests" },
      { label: "Split by regime", note: "where the edge lives — and where it disappears" },
    ],
    figures: [
      {
        title: "Annualized Sharpe ratio, out of sample",
        max: 1.3,
        note: "Same signals, different execution: ranking preserves what thresholds destroy.",
        bars: [
          { label: "Top-1 conviction ranking", value: 1.183, display: "1.183", accent: true },
          { label: "Random top-1 baseline", value: 0.162, display: "0.162" },
          { label: "Threshold execution (P60)", value: 0.071, display: "0.071" },
        ],
      },
    ],
    diagram: {
      premise: "A real but tiny signal — mean daily IC 0.0197 (p = 0.034)",
      probe: "Same signal, three execution designs, realistic costs",
      branches: [
        {
          title: "Threshold P60",
          sub: "act on every signal",
          tone: "bad",
          rows: [
            { label: "Sharpe 0.071", mark: "x" },
            { label: "Costs eat the edge", mark: "x" },
          ],
          action: "Standard execution destroys it",
        },
        {
          title: "Random top-1",
          sub: "baseline",
          tone: "warn",
          rows: [
            { label: "Sharpe 0.162", mark: "dash" },
            { label: "No information used", mark: "dash" },
          ],
          action: "The bar to beat",
        },
        {
          title: "Conviction ranking",
          sub: "trade only top-1",
          tone: "good",
          rows: [
            { label: "Sharpe 1.183", mark: "check" },
            { label: "Break-even 24.2 bps = 4.8×", mark: "check" },
          ],
          action: "Ranking preserves the signal",
        },
        {
          title: "Honesty",
          sub: "stated limits",
          tone: "info",
          rows: [
            { label: "Survivor-selected universe", mark: "dash" },
            { label: "Regime-dependent", mark: "dash" },
          ],
          action: "Caveats in the paper, not hidden",
        },
      ],
      punchline: "Execution design — not the classifier — decides what survives costs.",
    },
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
    links: [{ label: "SSRN preprint", href: "https://ssrn.com/abstract=6985101" }],
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
