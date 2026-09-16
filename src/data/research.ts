/**
 * Single source of truth for all research content.
 * Every number and status traces to the paper’s own current source file or the
 * application dossier (see CLAUDE.md, PATHS); the source is named above each
 * paper. Status words follow a strict vocabulary and are never upgraded. The
 * venue of a double-blind submission under review is not named.
 */

export type Theme =
  | "evaluation"
  | "healthcare"
  | "fairness"
  | "nlp-llm"
  | "causal"
  | "deployment"
  | "privacy"
  | "finance"
  | "security";

export type StatusKind = "published" | "review" | "working" | "manuscript" | "preparation";

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
  display: string; // printed verbatim
  accent?: boolean; // ultramarine emphasis; others render neutral gray
}

export interface Figure {
  title: string;
  max: number; // scale maximum (bars are value/max wide, zero-based)
  note?: string;
  bars: FigureBar[];
}

/** A real figure from the paper’s repo (src/assets/figures/<slug>/<file>). */
export interface PaperFigure {
  file: string;
  caption: string;
}

export interface Publication {
  slug: string;
  order: number;
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
  problem: string;
  approach: string;
  findings: string;
  matters: string;
  results: KeyResult[];
  links: { label: string; href: string }[];
  caveat?: string;
  absent?: string; // what is not public yet, and why
  citation?: string; // formal reference, published work only
}

export const THEME_LABELS: Record<Theme, string> = {
  evaluation: "Benchmark Evaluation",
  healthcare: "Healthcare AI",
  fairness: "Fairness",
  "nlp-llm": "NLP · LLMs",
  causal: "Causal Inference",
  deployment: "Deployment Shift",
  privacy: "Privacy · Federated",
  finance: "Financial ML",
  security: "Network Security",
};

export const STATUS_LABELS: Record<StatusKind, string> = {
  published: "Published",
  review: "Under review",
  working: "Working papers",
  manuscript: "Manuscripts",
  preparation: "In preparation",
};

export const STATUS_CITATION_NOTE: Record<StatusKind, string> = {
  published: "Published work. Use the citation above.",
  review: "Manuscript under review. The citation will be posted on acceptance.",
  working: "Working paper. The public version is linked above.",
  manuscript: "Manuscript. A draft is available on request.",
  preparation: "Manuscript in preparation.",
};

/** The discovery each paper's one-figure summary states (see HeroFigure). No entry, no figure. */
export const DISCOVERY: Partial<Record<string, string>> = {
  "benchmark-accuracy-not-identified":
    "Count the responses the scorer could not read, and 357 of 378 orderings on a published leaderboard can no longer be separated.",
  "subgroup-fairness-reversal":
    "The fairness audit improves while the screening decision it is meant to justify gets worse for Black respondents.",
  "could-it-read-the-answer": "Only the scoring rule changed, and one model’s MMLU score moved from 0.013 to 0.938.",
  indiafinbench: "Change only the scoring rule and the leaderboard reorders: the last-ranked model ties for first.",
  "diabetes-external-validation":
    "Deployment reveals a hidden, age-shaped failure that internal validation cannot see.",
  trustshift:
    "Shift size alone does not say which part of a model breaks, so the audit measures every axis and can answer inconclusive.",
  "confidently-wrong":
    "Many cross-network detectors do not fall to chance. They pass through it and rank attacks below benign traffic.",
  "scorer-partial-identification":
    "What is not known about the scorer, not sampling error, sets the width of a benchmark comparison.",
  "mortgage-disparities": "The disparity is concentrated inside institutions, and widens at their boundaries.",
  "cate-hmda": "The average hides the distribution: the underwriting channel decides who bears the penalty.",
  icgdf: "A well-calibrated model with no measurable skill. The correct decision is not to deploy.",
};

export const publications: Publication[] = [
  // Source: knowledgeshift/paper/tmlr.tex abstract (2026-09-11); board data from the public
  // flipbudget-results dataset (scripts/build-leaderboard.mjs). Under review, double-blind.
  {
    slug: "benchmark-accuracy-not-identified",
    order: 1,
    title: "Benchmark Accuracy Is Not an Identified Quantity",
    shortTitle: "Benchmark Accuracy Is Not Identified",
    authors: "Rajveer Singh Pall",
    status: "Under review",
    statusKind: "review",
    year: "2026",
    themes: ["evaluation", "nlp-llm", "deployment"],
    oneLiner:
      "Most orderings on a published MATH-Hard leaderboard cannot be separated once the responses a scorer could not read are counted.",
    plain:
      "A benchmark score is produced by two things: the model, and a scoring rule that decides what answer the model’s text contains. When the scorer cannot read a response, it quietly marks it wrong and throws the count away. This paper shows that the published accuracy is then consistent with a whole range of true accuracies, and on a real 28-model leaderboard most of the rankings people quote do not survive that range.",
    flow: [
      { label: "Separate the two halves", note: "the model’s answer, and whether the scorer could read it" },
      { label: "Bound the true accuracy", note: "published score, unreadable count, two measured error margins" },
      { label: "Measure the margins", note: "400-item human audit frozen before labelling, plus independent LLM adjudication" },
      { label: "Test every ordering", note: "all 378 pairs on a 28-model MATH-Hard leaderboard" },
      { label: "Check the ecosystem", note: "lm-evaluation-harness and OpenCompass scoring configurations" },
    ],
    figures: [
      {
        title: "Share of MATH-Hard orderings that are not identified",
        max: 100,
        note: "Out of 378 model pairs. Even with the most favourable assumption, most rankings cannot be separated.",
        bars: [
          { label: "Human-audited margins", value: 94.4, display: "94.4%", accent: true },
          { label: "LLM-adjudicated margins", value: 90.2, display: "90.2%" },
          { label: "Zero scorer error assumed", value: 87.8, display: "87.8%" },
          { label: "Learned extractor, zero error", value: 80.2, display: "80.2%" },
        ],
      },
    ],
    problem:
      "If only the model’s half of a benchmark score is reported, is the resulting leaderboard ordering statistically meaningful?",
    approach:
      "Reported accuracy is formalised as a partially identified quantity, bounded by the scorer’s own count of unparseable responses and two error margins. Both margins are measured on the same extractor and benchmark: a 400-item human audit specified and frozen before labelling, and an independent LLM adjudication of the same items cross-checked against two further vendors. The practice is then audited across lm-evaluation-harness and OpenCompass.",
    findings:
      "357 of 378 pairwise orderings (94.4%) are not identified with human-audited margins, and 87.8% are not identified even when the extractor is granted zero error. 64.9% of generative tasks in lm-evaluation-harness and 43.3% of readable OpenCompass scoring configurations coerce an unreadable response into a wrong answer. A purpose-built learned extractor still leaves 80.2% of orderings unidentified.",
    matters:
      "A leaderboard gap is only meaningful if it is larger than what the scorer cannot see. The paper proposes a five-field Scorer Card and a tested upstream patch that reports the one number the scorer already computes and throws away.",
    results: [
      { value: "357 / 378", label: "MATH-Hard orderings not identified (human-audited margins)" },
      { value: "87.8%", label: "not identified even at zero scorer error" },
      { value: "64.9%", label: "of lm-evaluation-harness generative tasks turn unreadable into wrong" },
    ],
    links: [{ label: "Leaderboard data", href: "https://huggingface.co/datasets/Rajveer-code/flipbudget-results" }],
    caveat:
      "Each measured margin is applied as a single bound shared across every model on the board, an assumption the paper states and tests as far as the data allow.",
    absent: "The paper and its code are withheld while the manuscript is under double-blind review.",
  },

  // Source: P06b main.tex abstract (submitted 2026-09-09) + Federated-Diabetes README. Under review, double-blind.
  {
    slug: "subgroup-fairness-reversal",
    order: 2,
    title:
      "Higher AUC, Fewer Cases Flagged: Subgroup Fairness Metrics Can Reverse at the Decision Threshold in Federated Diabetes Screening",
    shortTitle: "Higher AUC, Fewer Cases Flagged",
    authors: "Rajveer Singh Pall",
    status: "Under review",
    statusKind: "review",
    year: "2026",
    themes: ["fairness", "healthcare", "privacy", "deployment"],
    oneLiner:
      "Federated training narrows the White-Black AUC gap while a race-blind screening policy flags fewer Black respondents.",
    plain:
      "Fairness in clinical prediction is usually checked by comparing AUC across groups. A screening programme, though, ranks patients and flags as many as it has capacity for. On more than a million external records, federated training makes the subgroup AUC audit look better while the screening decision it is supposed to justify gets worse for Black respondents. The paper shows exactly why the two readings disagree.",
    flow: [
      { label: "Train five federated strategies", note: "against a composition-matched centralised control, ten seeds" },
      { label: "Validate externally", note: "BRFSS, 1,282,897 respondents, 819,294 with race recorded" },
      { label: "Audit two ways", note: "within-group AUC, and who is flagged at a fixed screening capacity" },
      { label: "Decompose pooled AUC", note: "within-group terms versus the cross-group terms a threshold acts on" },
    ],
    figures: [
      {
        title: "White-Black gap, centralised control to FedAvg",
        max: 0.04,
        note: "The AUC gap shrinks while the sensitivity gap at fixed capacity widens: the same model, judged two ways.",
        bars: [
          { label: "AUC gap, centralised", value: 0.0075, display: "0.0075" },
          { label: "AUC gap, FedAvg", value: 0.0005, display: "0.0005" },
          { label: "Sensitivity gap, centralised", value: 0.009, display: "0.009" },
          { label: "Sensitivity gap, FedAvg", value: 0.034, display: "0.034", accent: true },
        ],
      },
    ],
    paperFigures: [
      {
        file: "fig_auc_vs_tpr.png",
        caption:
          "The same federated model judged two ways against the composition-matched centralised control, over ten seeds: within-group AUC rises for Black, Hispanic and Asian respondents while sensitivity at 20% screening capacity falls.",
      },
    ],
    problem:
      "Does a subgroup AUC audit tell you what happens when a model is used at a fixed screening capacity?",
    approach:
      "Five federated strategies for diabetes risk prediction are compared with a composition-matched centralised control over ten seeds, with external validation on BRFSS (n = 1,282,897; 819,294 with race recorded). An exact decomposition of pooled AUC separates within-group ranking terms from the cross-group terms a shared threshold acts on.",
    findings:
      "FedAvg narrows the White-Black AUC gap from 0.0075 to 0.0005, yet under a race-blind top-q screening policy the White-Black sensitivity gap widens from 0.009 to 0.034, which is 542 fewer reference-positive Black respondents flagged per 100,000. The reversal holds at every capacity from 1% to 50%, for all five strategies.",
    matters:
      "A subgroup audit reads the within-group terms while a shared threshold depends on the cross-group terms, and here the two move in opposite directions. Subgroup AUC alone can report an equity improvement while missing the allocation effect on the group it is meant to protect.",
    results: [
      { value: "0.0075 → 0.0005", label: "White-Black AUC gap narrows" },
      { value: "0.009 → 0.034", label: "White-Black sensitivity gap widens at fixed capacity" },
      { value: "542", label: "fewer Black respondents flagged per 100,000" },
    ],
    links: [{ label: "Code and corrected results", href: "https://github.com/Rajveer-code/Federated-Diabetes" }],
    caveat:
      "The AUC gains are small in magnitude. An earlier version of this pipeline had implementation defects; the repository documents them and the findings they retired.",
  },

  // Source: knowledgeshift/paper/main.tex abstract (2026-09-06). Under review, double-blind workshop.
  {
    slug: "could-it-read-the-answer",
    order: 3,
    title: "Benchmarks Do Not Report Whether They Could Read the Answer",
    shortTitle: "Could It Read the Answer?",
    authors: "Rajveer Singh Pall",
    status: "Under review",
    statusKind: "review",
    year: "2026",
    themes: ["evaluation", "nlp-llm"],
    oneLiner:
      "Two answer extractors shipped in the same evaluation harness disagree by 88.5 points on the same 400 MMLU responses.",
    plain:
      "Whether a model gets credit on a benchmark depends partly on whether the scoring code can find its answer, and that half of the score is normally invisible. Auditing every task in a widely used evaluation harness shows that most generative tasks match an assumed output format, count a mismatch as wrong, and never report how often that happened.",
    flow: [
      { label: "Resolve every task", note: "all 13,668 configurations in lm-evaluation-harness" },
      { label: "Score the same text twice", note: "a task’s strict pipeline versus a robust reading, 400 MMLU responses" },
      { label: "Check the checker", note: "a third-vendor judge blind to the gold answer, three human labellers" },
      { label: "Rescore published results", note: "leaderboard generations for 28 models" },
    ],
    figures: [
      {
        title: "One frontier model on MMLU, same 400 responses",
        max: 1,
        note: "Only the scoring rule changed. The model ordering inverts, significant after Holm-Bonferroni correction.",
        bars: [
          { label: "Task’s strict pipeline", value: 0.013, display: "0.013" },
          { label: "Answer read wherever it appears", value: 0.938, display: "0.938", accent: true },
        ],
      },
    ],
    problem:
      "Does the unreported half of a benchmark score, whether the scorer could read the answer, change what the benchmark says?",
    approach:
      "All 13,668 task configurations in lm-evaluation-harness are resolved with the framework’s own loader. On MMLU, 400 responses are scored under a task’s strict pipeline and under a robust reading, checked by a third-vendor judge blind to the gold answer and by three human labellers. Published leaderboard generations for 28 models are then rescored the same way.",
    findings:
      "2,936 of 4,524 generative tasks (64.9%) record a format mismatch as a wrong answer, 81.0% of them report a single number with no second pipeline, and none report how often the extractor failed. A frontier model scores 0.013 under a task’s strict pipeline and 0.938 when the answer is read wherever it appears. Across 28 models' published generations the hidden parse-failure rate spans 4% to 99.9%, and one published score of 0.000 is entirely an extraction artefact.",
    matters:
      "The fix costs one extra reported number per task, and it is already implemented in the newest evaluation code of one audited repository.",
    results: [
      { value: "88.5 pts", label: "disagreement between two extractors in one harness" },
      { value: "2,936 / 4,524", label: "generative tasks score a format mismatch as wrong" },
      { value: "97 / 99", label: "recovered answers confirmed by a judge blind to the gold answer" },
    ],
    links: [],
    absent: "The paper and its code are withheld while the submission is under double-blind review.",
  },

  // Source: IndiaFinBench/paper/tmlr/draft_01_abstract_only.tex (2026-09-03), built into tmlr_submission/main.pdf (2026-09-04).
  {
    slug: "indiafinbench",
    order: 4,
    title: "Scoring-Rule Sensitivity in LLM Evaluation: Evidence from Indian Financial Regulatory Text",
    shortTitle: "IndiaFinBench",
    authors: "Rajveer Singh Pall",
    status: "Under review",
    statusKind: "review",
    year: "2026",
    themes: ["evaluation", "nlp-llm", "finance"],
    oneLiner:
      "Changing only the scoring rule reorders twelve LLMs on a new Indian financial-regulation benchmark, and no model keeps its rank.",
    plain:
      "IndiaFinBench is a 406-question benchmark written from Indian financial regulation issued by SEBI and RBI, text that Western financial benchmarks rarely cover. Twelve LLMs were scored on the same answers in two ways: strict string matching, and a judge model from an unrelated family. The two leaderboards show no positive rank agreement, so a strict leaderboard says little about which model actually answers regulatory questions best.",
    flow: [
      { label: "Build the benchmark", note: "406 expert-annotated items over SEBI and RBI regulatory text" },
      { label: "Four reasoning types", note: "interpretation · numerical · contradiction · temporal" },
      { label: "Score the same answers twice", note: "strict four-stage matching and a cross-family judge" },
      { label: "Compare the leaderboards", note: "rank correlation, rank moves, item-level discrimination" },
    ],
    figures: [],
    paperFigures: [
      {
        file: "figure_regime_shift.png",
        caption:
          "The same predictions ranked three ways. DeepSeek-R1-Distill-Llama-70B moves from last under strict matching to tied first under the composite regime.",
      },
    ],
    problem: "What changes on an LLM leaderboard when only the scoring rule changes?",
    approach:
      "406 expert-annotated items over SEBI and RBI regulatory text cover regulatory interpretation, numerical reasoning, contradiction detection and temporal reasoning. Twelve contemporary LLMs are evaluated zero-shot and scored by strict four-stage string matching, by a judge that shares no model family with any evaluated system, and by a composite of the two.",
    findings:
      "Strict and judge-only accuracy show no positive rank correspondence (Spearman ρ = −0.273, p = 0.39), and no model holds its rank across all three regimes. Strict accuracy spans 75.12% to 89.66% and judge-only accuracy 87.19% to 94.83%, with a different leader and trailer. DeepSeek-R1-Distill-Llama-70B ranks last under strict scoring and ties for first under the composite, because the judge reclassifies 93.9% of its strict errors as correct. 148 of 406 items are answered identically by all twelve models.",
    matters:
      "The tempting explanation, output verbosity, does not survive adjustment for task and model composition, and the paper reports that negative result as such. Benchmarks should report the scoring rule’s effect, not only the score.",
    results: [
      { value: "ρ = −0.273", label: "strict vs judge-only rank correlation (p = 0.39)" },
      { value: "93.9%", label: "of one model’s strict errors reclassified by the judge" },
      { value: "406", label: "expert-annotated regulatory questions" },
    ],
    links: [
      { label: "Earlier version, arXiv 2604.19298", href: "https://arxiv.org/abs/2604.19298" },
      { label: "Dataset", href: "https://huggingface.co/datasets/Rajveer-code/IndiaFinBench" },
      { label: "Live demo", href: "https://huggingface.co/spaces/Rajveer-code/IndiaFinBench" },
      { label: "Code", href: "https://github.com/Rajveer-code/IndiaFinBench" },
      { label: "Zenodo DOI", href: "https://doi.org/10.5281/zenodo.21739533" },
    ],
    caveat:
      "The human reference is one non-specialist evaluator on 60 medium and hard items (80.0%, 95% Wilson CI 68.2 to 88.2), a reference point rather than a population estimate.",
  },

  // Source: application dossier §3 P9; IEEE Xplore page (date added 21 May 2026). Published.
  {
    slug: "diabetes-external-validation",
    order: 5,
    title:
      "Comprehensive Evaluation of Machine Learning for Type 2 Diabetes Risk Prediction: Large-Scale External Validation and Fairness Analysis",
    shortTitle: "Diabetes External Validation",
    authors: "Rajveer Singh Pall, Sameer Yadav, Siddharth Bhalerao, Sourabh Sahu, Ritu Ahluwalia, Bhaskar Awadhiya",
    status: "Published · IEEE Xplore (CIPHER-2026)",
    statusKind: "published",
    year: "2026",
    themes: ["healthcare", "fairness", "deployment"],
    oneLiner:
      "Internally validated diabetes models lose discrimination on 1.28M external records, and adults over 60 lose the most.",
    plain:
      "A disease-risk model that shines on its home dataset can still mislead in the real world. We trained a standard diabetes risk model the careful way, with strict cross-validation and tuned hyperparameters, and then did what most papers skip: tested it on 1.28 million people from a completely different national survey. Overall accuracy dropped about ten percent, and the drop was not shared equally. For people over 60 the model degrades far more than for the young, a fairness failure that the single headline number hides.",
    flow: [
      { label: "Develop carefully", note: "NHANES cohort (15,685) · nested cross-validation · Bayesian tuning" },
      { label: "Explain", note: "SHAP attribution over eight non-laboratory predictors" },
      { label: "Externally validate", note: "BRFSS, 1,285,783 records: different survey, different population" },
      { label: "Audit subgroups", note: "age, sex, BMI, with DeLong confidence intervals" },
      { label: "Report to standard", note: "TRIPOD-AI checklist" },
    ],
    figures: [
      {
        title: "AUC: where the model quietly fails",
        max: 1,
        note: "External validation costs about 10% overall; adults over 60 lose far more (gap 0.135, p < 0.001).",
        bars: [
          { label: "Internal (NHANES)", value: 0.794, display: "0.794" },
          { label: "External (BRFSS)", value: 0.717, display: "0.717" },
          { label: "External, age 18-39", value: 0.742, display: "0.742" },
          { label: "External, age 60+", value: 0.607, display: "0.607", accent: true },
        ],
      },
    ],
    problem:
      "Clinical risk models are usually reported with internal validation only. Do the numbers survive a different population, survey instrument, and label definition?",
    approach:
      "XGBoost and baselines developed on NHANES (n = 15,685) under strict nested cross-validation, then externally validated on BRFSS (n = 1,285,783) with DeLong CIs, calibration analysis, SHAP interpretability, and a subgroup fairness audit. TRIPOD-AI reporting.",
    findings:
      "External AUC drops from 0.794 (95% CI 0.788 to 0.800) to 0.717, a 9.7% relative decline. The elderly subgroup degrades far more than the young (AUC 0.607 vs 0.742, gap 0.135): aggregate accuracy hides an age-fairness failure. The Brier score is 0.123, with risk overestimated at high thresholds.",
    matters:
      "The foundation result of the research program: benchmark performance is not deployment performance, and the failure is structured, not random.",
    results: [
      { value: "0.794 → 0.717", label: "internal → external AUC (−9.7%)" },
      { value: "0.135", label: "age-group AUC gap (18-39 vs 60+)" },
      { value: "1,285,783", label: "external validation records" },
    ],
    links: [
      { label: "IEEE Xplore", href: "https://doi.org/10.1109/CIPHER70417.2026.11523789" },
      { label: "arXiv 2607.16253", href: "https://arxiv.org/abs/2607.16253" },
    ],
    caveat:
      "The model uses eight non-laboratory predictors. Diabetes is defined from laboratory measures, self-report and medication in NHANES, but from self-reported diagnosis in BRFSS.",
    citation:
      "Pall, R. S., Yadav, S., Bhalerao, S., Sahu, S., Ahluwalia, R., & Awadhiya, B. (2026). Comprehensive evaluation of machine learning for type 2 diabetes risk prediction: Large-scale external validation and fairness analysis. CIPHER-2026. IEEE. https://doi.org/10.1109/CIPHER70417.2026.11523789",
  },

  // Source: trustshift/paper/main.tex abstract + README (frozen Phase-4 evidence, 2026-09-04). Manuscript.
  {
    slug: "trustshift",
    order: 6,
    title: "TrustShift: A Mechanism-Aware Audit of Machine-Learning Deployment Shift",
    shortTitle: "TrustShift",
    authors: "Rajveer Singh Pall",
    status: "Manuscript",
    statusKind: "manuscript",
    year: "2026",
    themes: ["deployment", "healthcare", "nlp-llm", "security", "fairness"],
    oneLiner:
      "Across four real deployment shifts, shift magnitude alone does not consistently explain which trustworthiness axis fails.",
    plain:
      "Deployment evaluation often assumes that a bigger change in the data means more risk. TrustShift applies one identical audit to four very different deployments: medicine, social-media language, mortgage lending, and network attacks. It finds that this assumption does not hold uniformly. A lending model under a large measured shift ranks applicants better, while a mental-health text model at a comparable shift magnitude loses up to 0.39 AUC. Cheap, largely label-free probes diagnose some shifts, and report the rest as inconclusive rather than forcing a label.",
    flow: [
      { label: "Deployment shift", note: "one trained model per domain meets a changed population" },
      { label: "Screen without labels", note: "prevalence change and a domain classifier" },
      { label: "Probe the mechanism", note: "an importance-reweighting check where labels and overlap allow" },
      { label: "Audit four axes jointly", note: "discrimination · operating point · calibration · subgroup reliability" },
      { label: "Remediate or escalate", note: "recalibration where it helps; inconclusive is a first-class outcome" },
    ],
    figures: [],
    paperFigures: [
      {
        file: "fig1_taxonomy.png",
        caption:
          "The TrustShift audit flow. Screening and probes either support a mechanism hypothesis or return inconclusive as a first-class outcome; discrimination, operating point, calibration and subgroup reliability are audited jointly.",
      },
    ],
    problem:
      "Does the magnitude of a distribution shift tell you which axis of trustworthiness will fail at deployment?",
    approach:
      "One protocol measures discrimination, calibration, subgroup reliability and operating-point performance on clinical risk prediction (NHANES to BRFSS), mental-health text classification (Kaggle to Reddit and Twitter), mortgage approval (temporal and cross-state shift over 42 million loan records) and network intrusion detection (CIC-DDoS2019 to CICIDS2017). Prevalence change, a domain classifier and an importance-reweighting check probe the shift mechanism.",
    findings:
      "A lending model under measured covariate shift (domain-classifier AUC up to 0.80) improves in ranking while macro operating-point performance stays within 0.02, even as positive-class F1 falls by up to 0.078. A mental-health model at comparable magnitude loses up to 0.39 AUC. An intrusion detector holds 0.998 AUC in-domain and falls to 0.68 on traffic whose attack mechanisms were absent from training. Post-hoc recalibration cuts calibration error by one to two orders of magnitude in every domain but leaves discrimination and subgroup reliability unrestored.",
    matters:
      "Reporting one metric, or trusting shift size, can hide which part of a model breaks. The contribution is a protocol, a four-domain benchmark, and a release in which every reported number traces to a committed result file.",
    results: [
      { value: "4", label: "real deployment domains, one protocol" },
      { value: "0.39", label: "AUC lost by the text model at comparable shift" },
      { value: "0.998 → 0.68", label: "intrusion-detector AUC on unseen attack mechanisms" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Rajveer-code/trustshift" },
      { label: "Hugging Face dataset", href: "https://huggingface.co/datasets/Rajveer-code/trustshift" },
      { label: "Zenodo DOI", href: "https://doi.org/10.5281/zenodo.21739501" },
    ],
    caveat:
      "Whether the shift mechanism carries more information than its magnitude is tested directly and not established by the current evidence.",
  },

  // Source: ddos_xdomain_paper/paper/manuscript.tex abstract (2026-08-22). Manuscript.
  {
    slug: "confidently-wrong",
    order: 7,
    title: "Confidently Wrong: Ranking Inversion in Cross-Network Denial-of-Service Detection",
    shortTitle: "Confidently Wrong",
    authors: "Rajveer Singh Pall",
    status: "Manuscript",
    statusKind: "manuscript",
    year: "2026",
    themes: ["security", "deployment"],
    oneLiner:
      "On a new network, DoS detectors do not decay toward chance: many pass through it and score attacks below benign traffic.",
    plain:
      "Flow-based denial-of-service detectors report accuracy above 99%, then lose most of that skill on a different network. This paper looks at the character of that loss. Where the ordering of scores survives the move, choosing a new threshold repairs it. Where the ordering has inverted, no threshold can, and the scoring function itself has to change.",
    flow: [
      { label: "Four testbeds", note: "independently captured, one published common feature set" },
      { label: "Four model families", note: "trained on each testbed" },
      { label: "Every ordered pair", note: "12 cross-network transfers, five seeds, 240 evaluations" },
      { label: "Diagnose the failure", note: "ranking loss versus threshold loss, then test remedies" },
    ],
    figures: [],
    paperFigures: [
      {
        file: "fig3_failure_decomposition.png",
        caption:
          "How each testbed pair fails. Only one of twelve pairs sits in the threshold-limited region where recalibration can help; the rest lose their ranking.",
      },
    ],
    problem:
      "When a DoS detector moves to a new network, does it fail at the threshold or at the ranking, and which remedies can work?",
    approach:
      "Four model families are trained on four independently captured testbeds under a published common feature set, and every ordered pair of testbeds is evaluated over five seeds.",
    findings:
      "Transfer does not decay toward chance; it passes through chance. 108 of 240 run-level evaluations score below ROC-AUC 0.5, and the worst reaches 0.0697, where negating the score would give 0.9303. Eleven of twelve testbed pairs fail at the ranking rather than the threshold. Retraining on ten balanced labelled target flows reaches median macro-F1 0.7253, against 0.3919 without adaptation.",
    matters:
      "Cross-network evaluation has to separate ranking failure from threshold failure, because the two admit different fixes.",
    results: [
      { value: "108 / 240", label: "evaluations below ROC-AUC 0.5" },
      { value: "0.0697", label: "worst ROC-AUC (0.9303 if negated)" },
      { value: "11 / 12", label: "testbed pairs fail at the ranking" },
    ],
    links: [],
    absent: "Code is not public yet.",
  },

  // Source: flipbudget/manuscript/MANUSCRIPT_DRAFT.md abstract + FINAL_STATUS.md (2026-09-15). In preparation.
  {
    slug: "scorer-partial-identification",
    order: 8,
    title: "Scorer-Induced Partial Identification of Benchmark Comparisons: An Audit-Design Approach",
    shortTitle: "Auditing the Scorer",
    authors: "Rajveer Singh Pall",
    status: "In preparation",
    statusKind: "preparation",
    year: "2026",
    themes: ["evaluation", "nlp-llm"],
    oneLiner:
      "Once a scorer’s error rate is audited rather than assumed, audit uncertainty outweighs sampling uncertainty in all 120 well-defined comparisons.",
    plain:
      "An automated verifier grades every free-text answer on a math benchmark, and it can disagree with a careful human reader. Using a real human audit of that verifier, this work derives the range of true accuracies consistent with a reported score. It shows that how little we know about the verifier’s own error matters more than the sampling error that leaderboards usually report.",
    flow: [
      { label: "Audit the scorer", note: "400 items submitted, 350 usable across 27 models" },
      { label: "Bound true accuracy", note: "classical misclassification bounds adapted to benchmarks" },
      { label: "Compare widths", note: "identification width against sampling width, pair by pair" },
      { label: "Design the next audit", note: "where extra human labels help most" },
    ],
    figures: [
      {
        title: "Identification width ÷ sampling width",
        max: 7,
        note: "Across 120 well-defined comparisons among 17 qualifying models. Every ratio is above 1.",
        bars: [
          { label: "Median ratio", value: 6.1, display: "6.10×", accent: true },
          { label: "Self-consistency check", value: 5.74, display: "5.74×" },
          { label: "Smallest ratio", value: 2.15, display: "2.15×" },
        ],
      },
    ],
    problem:
      "Given a benchmark’s observed accuracy and an audited estimate of its scorer’s false-credit and false-miss rates, what can still be concluded about a comparison between two models?",
    approach:
      "Classical misclassification bounds are adapted to benchmark comparison and applied to MATH-Hard, using a human audit of the standard boxed-answer comparator (400 items submitted, 350 usable across 27 models). The work then formalises how further audit budget should be allocated and tests the textbook allocation rule on the real, sparse audit data.",
    findings:
      "The median ratio of identification width to sampling width is 6.10×, dominant in all 120 comparable pairs; a self-consistency check gives 5.74×, and the smallest ratio is 2.15×. The harness’s two live scorers disagree on 3.63% of responses (95% CI 3.39% to 3.88%, n = 22,508). The textbook Neyman allocation of audit effort, in its plug-in form, is dominated by uniform allocation on this sparse real data.",
    matters:
      "Before arguing that one model beats another, a benchmark should measure its own scorer. The work documents a failure mode of standard audit design and tests a correction.",
    results: [
      { value: "6.10×", label: "median identification-to-sampling width ratio" },
      { value: "120 / 120", label: "comparable pairs where audit uncertainty dominates" },
      { value: "3.63%", label: "responses where two live scorers disagree" },
    ],
    links: [
      { label: "Code", href: "https://github.com/Rajveer-code/flipbudget" },
      { label: "Results dataset", href: "https://huggingface.co/datasets/Rajveer-code/flipbudget-results" },
      { label: "Leaderboard", href: "https://huggingface.co/spaces/Rajveer-code/flipbudget-leaderboard" },
    ],
    caveat:
      "One analysis waits on a pre-registered 458-row human audit of the harness’s second scorer; the manuscript marks every number that depends on it as pending instead of estimating it.",
  },

  // Source: application dossier §3 P2. Under review (Journal of Housing Economics); public SSRN version.
  {
    slug: "mortgage-disparities",
    order: 9,
    title: "Persistent Racial Disparities in U.S. Mortgage Approval: Evidence from 42 Million Applications, 2020-2024",
    shortTitle: "Mortgage Disparities",
    authors: "Rajveer Singh Pall",
    status: "Under review · Journal of Housing Economics",
    statusKind: "review",
    year: "2026",
    themes: ["fairness", "causal"],
    oneLiner:
      "The public-data Black-White mortgage approval gap at national scale: how large, where it lives, and how it responds to institutional boundaries.",
    plain:
      "Every U.S. mortgage application leaves a public record. Reading all 42 million of them from 2020 to 2024, Black applicants are approved about 15 percentage points less often than White applicants. This paper measures that gap carefully: most of it (68%) cannot be explained by anything visible in the public data, and three quarters of it lives inside individual lenders rather than between them. Two natural experiments, an insurance-driven threshold at 80% loan-to-value and the Federal Reserve’s 2022 tightening, each widen the gap further. The paper never claims to prove intent; it maps the scale and the structure.",
    flow: [
      { label: "Assemble", note: "42,323,519 applications, 2020-2024" },
      { label: "Reweight", note: "DiNardo-Fortin-Lemieux: compare statistically similar applicants" },
      { label: "Look within lenders", note: "fixed effects: between institutions, or inside them?" },
      { label: "Natural experiments", note: "RDD at the 80% LTV boundary · DiD around the 2022 tightening" },
      { label: "Bound the unknown", note: "partial identification calibrated to consumer-finance data" },
    ],
    figures: [
      {
        title: "Black-White approval gap in percentage points",
        max: 17,
        note: "74.6% of the national gap sits within individual lenders; scale is about 126,000 fewer approvals a year.",
        bars: [
          { label: "National raw gap", value: 14.95, display: "14.95 pp", accent: true },
          { label: "Midwest regional mean", value: 16.1, display: "16.1 pp" },
          { label: "West regional mean", value: 9.3, display: "9.3 pp" },
        ],
      },
    ],
    problem:
      "How large is the observable racial approval gap in U.S. mortgage lending, how much sits within lenders, and what do quasi-experimental boundaries reveal about its structure?",
    approach:
      "42,323,519 HMDA applications, 2020-2024. DFL reweighting, within-lender fixed effects, regression discontinuity at the 80% LTV / PMI boundary, difference-in-differences around the 2022 tightening with HonestDiD sensitivity, Manski partial-identification bounds, and permutation tests.",
    findings:
      "Raw gap 14.95 pp; 68% unexplained by public observables; 74.6% of the gap is within-lender, rising from 66.8% in 2020 to 78.3% in 2024. The approval differential rises by about 2.0 pp above the 80% LTV threshold in purchase loans and widens by about 1.5 pp within lenders after the 2022 tightening. Bounds keep at least 44% to 55% unexplained under conservative assumptions; scale is about 126,000 fewer approvals for Black applicants annually.",
    matters:
      "It documents scale and institutional structure without overclaiming intent, and positions public-data estimates explicitly against the confidential-data literature.",
    results: [
      { value: "14.95 pp", label: "raw Black-White approval gap" },
      { value: "74.6%", label: "of the gap within lenders" },
      { value: "≈126,000", label: "fewer annual approvals at scale" },
    ],
    links: [
      { label: "SSRN preprint", href: "https://ssrn.com/abstract=6334459" },
      { label: "Replication code", href: "https://github.com/Rajveer-code/hmda-racial-disparities" },
    ],
    caveat:
      "HMDA lacks credit scores, assets and reserves, so public-data estimates sit above the 1 to 2 point residual gaps found with confidential data (Bhutta, Hizmo and Ringo, 2025).",
  },

  // Source: application dossier §3 P1. Working paper (public SSRN version).
  {
    slug: "cate-hmda",
    order: 10,
    title:
      "Who Bears the Burden? Heterogeneous Racial Approval Differentials in U.S. Mortgage Lending: Causal Forest DML on 42 Million HMDA Applications",
    shortTitle: "Who Bears the Burden?",
    authors: "Rajveer Singh Pall",
    status: "Working paper · SSRN",
    statusKind: "working",
    year: "2026",
    themes: ["causal", "fairness"],
    oneLiner: "Not whether an average penalty exists, but who bears it, and through which underwriting channel.",
    plain:
      "Knowing the average approval gap is not enough, because averages hide who actually pays. Using methods from modern causal inference, the same family behind clinical-trial analysis, this paper estimates the approval penalty for each applicant profile across 42 million mortgage applications. The distribution is wide: nine in ten Black applicants face some estimated penalty, and the decisive factor is not the applicant but the process. Applications handled by human underwriters carry more than double the penalty of those decided by automated systems, which points the fairness question at something a regulator can act on.",
    flow: [
      { label: "Engineer at scale", note: "42M HMDA applications → 2M / 1.5M estimation samples" },
      { label: "Isolate the differential", note: "double machine learning, LightGBM nuisances, 5-fold cross-fitting" },
      { label: "Map who bears it", note: "causal forest estimates the penalty per applicant profile" },
      { label: "Find the mechanism", note: "manual vs automated underwriting · same lender, same year" },
      { label: "Attack the result", note: "placebo shuffles · Oster bounds · Cinelli-Hazlett sensitivity" },
    ],
    figures: [
      {
        title: "Conditional approval penalty by underwriting channel",
        max: 15,
        note: "Bar length = size of the estimated Black-White differential (all negative). The channel, not the applicant, is decisive.",
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
        caption: "Double-machine-learning estimates of the conditional approval differential across specifications.",
      },
      {
        file: "fig3_cate_distribution.png",
        caption: "The distribution of individual-level estimated effects: wide heterogeneity, overwhelmingly negative.",
      },
    ],
    problem:
      "Average disparity estimates hide distribution: which applicant profiles carry the largest conditional racial approval penalty, and is the mechanism applicant- or lender-controlled?",
    approach:
      "Partially linear double machine learning with LightGBM nuisances and 5-fold cross-fitting; causal-forest CATE estimation with SHAP attribution; placebo, Oster, and Cinelli-Hazlett sensitivity analyses; within lender-year comparisons.",
    findings:
      "Pooled conditional differential −9.39 pp with wide heterogeneity (CATE SD 8.47 pp); 90.7% of Black applicants face a negative estimated effect. The channel is decisive: manual underwriting −14.79 pp vs automated −6.17 pp, and 7.13 pp persists within the same lender and year.",
    matters:
      "It points the fairness question at an actionable mechanism, lender-controlled routing and handling, rather than at applicant characteristics.",
    results: [
      { value: "−9.39 pp", label: "conditional differential (pooled DML)" },
      { value: "−14.79 vs −6.17", label: "manual vs automated underwriting (pp)" },
      { value: "90.7%", label: "of Black applicants with a negative effect" },
    ],
    links: [
      { label: "SSRN preprint", href: "https://ssrn.com/abstract=6984959" },
      { label: "Code", href: "https://github.com/Rajveer-code/CATE-HMDA-Heterogeneous-Effects" },
    ],
    caveat:
      "The level is treated as an upper bound (no credit scores in HMDA); the channel contrast is the robust object.",
  },

  // Source: application dossier §3 P3. Working paper (public SSRN version).
  {
    slug: "icgdf",
    order: 11,
    title:
      "When the Gate Stays Closed: Empirical Evidence of Near-Zero Cross-Sectional Predictability in Large-Cap NASDAQ Equities Using an IC-Gated Machine Learning Framework",
    shortTitle: "The Gate Stays Closed",
    authors: "Rajveer Singh Pall",
    status: "Working paper · SSRN",
    statusKind: "working",
    year: "2026",
    themes: ["finance", "deployment"],
    oneLiner: "A deployment gate for financial ML, and the discipline to report that it stayed closed.",
    plain:
      "Most trading-model papers report wins. This one builds the exam a model must pass before it is allowed to trade real money, and then reports that its own model failed that exam twelve times out of twelve. That is the contribution: a statistical gate that separates “looks profitable in a backtest” from “provable skill”. A naive statistical test would have green-lit a skill-less model 11.8% of the time; the full gate never did. And the model’s probability estimates stayed well calibrated even though it had no predictive skill, which is the proof that a well-calibrated model is not the same as a deployable one.",
    flow: [
      { label: "Build honestly", note: "49 strictly causal features, 30 NASDAQ stocks, no lookahead" },
      { label: "Walk forward", note: "12 expanding-window folds, 1,512 out-of-sample days, 2-day embargo" },
      { label: "Measure skill", note: "daily information coefficient → Newey-West HAC t-test" },
      { label: "Confirm by permutation", note: "both stages must pass: if either fails, no deployment" },
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
        caption: "Fold-level information coefficients across all 12 walk-forward folds: the gate never opens.",
      },
      {
        file: "fig06_permutation_ic.png",
        caption: "The permutation test: the observed IC sits squarely inside the no-skill distribution.",
      },
      {
        file: "fig02_power_analysis.png",
        caption:
          "Power analysis over the full 1,512-day window: 80% power needs an information coefficient of 0.0138, and the observed value is 0.0005.",
      },
    ],
    problem:
      "Can a financial ML model prove cross-sectional predictive skill before deployment, and what should happen when it cannot?",
    approach:
      "IC-Gated Deployment Framework: a two-stage statistical gate (Newey-West HAC t-test on daily information coefficients plus permutation confirmation) over 12 expanding walk-forward folds and 1,512 out-of-sample days, with isotonic calibration, a momentum positive control and a Nifty 50 cross-market replication.",
    findings:
      "Mean IC −0.0005 (HAC t = −0.09, p = 0.536); the gate opens in 0 of 12 folds. Calibration stays excellent (ECE < 0.025) despite zero discrimination: calibration quality is not deployment readiness. The naive t-test alternative gives false positives 11.8% of the time, the full gate 0.0%. The Nifty 50 replication is also gate-closed.",
    matters:
      "An honest null result engineered as methodology: the same audit-first stance the program applies to healthcare and lending, applied to the temptation-rich domain of trading.",
    results: [
      { value: "0 / 12", label: "folds passing the deployment gate" },
      { value: "< 0.025", label: "ECE while IC ≈ 0: calibration ≠ readiness" },
      { value: "11.8% → 0%", label: "false-positive rate, naive test → ICGDF" },
    ],
    links: [
      { label: "SSRN preprint", href: "https://ssrn.com/abstract=6742700" },
      { label: "Code", href: "https://github.com/Rajveer-code/when-the-gate-stays-closed" },
    ],
  },

  // Source: mental-health-fairness-nlp/submission/jhir/main.tex title. Topic only, by the author’s decision.
  {
    slug: "cpfe",
    order: 12,
    title:
      "Text Genre, Not Platform Identity, Predicts Transfer Failure in Mental Health Natural Language Processing: A Five-Axis Deployment Audit Across Five Corpora",
    shortTitle: "Text Genre and Transfer Failure",
    authors: "Rajveer Singh Pall, Sameer Yadav",
    status: "Manuscript",
    statusKind: "manuscript",
    year: "2026",
    themes: ["nlp-llm", "fairness", "healthcare", "deployment"],
    oneLiner: "A five-axis pre-deployment audit of mental-health text classifiers moved across platforms and corpora.",
    plain:
      "Mental-health NLP models are almost always validated on the platform they were trained on. This work proposes a pre-deployment audit on five axes, discrimination, statistical significance, prediction equity, calibration and attribution stability, and asks what actually predicts transfer failure when those models meet new platforms and corpora.",
    flow: [],
    figures: [],
    problem: "When a mental-health text classifier moves to new platforms and corpora, what predicts where it fails?",
    approach: "",
    findings: "",
    matters: "",
    results: [],
    links: [],
    absent: "Results and code are withheld while this manuscript is prepared for double-blind review.",
  },
];

export const timeline = [
  {
    period: "2025",
    question: "Does a model that passes internal validation survive a new population?",
    title: "Clinical ML meets external validation",
    theme: "Healthcare AI",
    text: "Diabetes risk models built on NHANES are tested on 1.28M BRFSS records. External AUC falls 9.7%, and adults over 60 lose the most. First evidence that the benchmark hides the failure; published in IEEE Xplore in May 2026.",
    slug: "diabetes-external-validation",
  },
  {
    period: "2025",
    question: "Does fairness survive when the deployment platform changes?",
    title: "Reliability audited on five axes",
    theme: "NLP · Fairness",
    text: "Mental-health text classifiers are followed across platforms and corpora and audited on five axes: discrimination, significance, equity, calibration and attribution.",
    slug: "cpfe",
  },
  {
    period: "2025-2026",
    question: "Who actually bears an average disparity, and through what mechanism?",
    title: "Causal structure of a 42M-application gap",
    theme: "Causal Inference",
    text: "Mortgage lending at national scale: the racial approval gap is quantified, bounded, and traced to a lender-controlled mechanism. Manual underwriting more than doubles the penalty of automated systems.",
    slug: "cate-hmda",
  },
  {
    period: "2026",
    question: "Should a model be deployed when it cannot prove predictive skill?",
    title: "The discipline to say no",
    theme: "Deployment Gates",
    text: "A statistical deployment gate for financial ML stays closed across all 12 folds, reported as a null result. The model stays well calibrated with zero predictive skill: calibration is not deployment readiness.",
    slug: "icgdf",
  },
  {
    period: "Mid 2026",
    question: "Does the size of a distribution shift predict which axis fails?",
    title: "TrustShift: four domains, one audit",
    theme: "Deployment Shift",
    text: "One protocol across clinical, text, lending and network-security deployments. Shift magnitude alone does not consistently explain what breaks, and the audit reports inconclusive when the evidence does not support a firm diagnosis.",
    slug: "trustshift",
  },
  {
    period: "Aug 2026",
    question: "When a detector fails on a new network, is the threshold or the ranking broken?",
    title: "Confidently wrong detectors",
    theme: "Network Security",
    text: "108 of 240 cross-network evaluations score below chance. Eleven of twelve testbed pairs fail at the ranking, where recalibration cannot help.",
    slug: "confidently-wrong",
  },
  {
    period: "Sep 2026",
    question: "Can a fairness metric improve while the decision it justifies gets worse?",
    title: "Higher AUC, fewer cases flagged",
    theme: "Fairness",
    text: "Federated screening narrows the White-Black AUC gap from 0.0075 to 0.0005 while the sensitivity gap at fixed capacity widens from 0.009 to 0.034. An exact decomposition shows why the two readings disagree.",
    slug: "subgroup-fairness-reversal",
  },
  {
    period: "Sep 2026",
    question: "Does a reported benchmark number mean what it claims?",
    title: "Benchmark accuracy is not an identified quantity",
    theme: "Benchmark Evaluation",
    text: "On a 28-model MATH-Hard leaderboard, 357 of 378 orderings cannot be separated once unreadable responses and measured scorer error are counted. The same question runs through IndiaFinBench, where the scoring rule alone reorders twelve LLMs.",
    slug: "benchmark-accuracy-not-identified",
  },
  {
    period: "Next",
    question: "Can evaluation report its own uncertainty by default?",
    title: "Evaluation as infrastructure",
    theme: "Future",
    text: "Scorer Cards, audit budgets and threshold-aware fairness checks that ship with the number, so a reported result carries the range the evidence supports.",
    slug: null,
  },
];

export const openScience: {
  name: string;
  kind: string;
  text: string;
  identifier?: string;
  wide?: boolean; // spans two columns on wide screens so every row stays full
  links: { label: string; href: string }[];
}[] = [
  {
    name: "flipbudget",
    kind: "Library · Results · Leaderboard",
    wide: true,
    text: "Corrected intervals and flip budgets for benchmark comparisons under an audited scorer, with the results behind the leaderboard on this site.",
    links: [
      { label: "GitHub", href: "https://github.com/Rajveer-code/flipbudget" },
      { label: "Results", href: "https://huggingface.co/datasets/Rajveer-code/flipbudget-results" },
      { label: "Leaderboard", href: "https://huggingface.co/spaces/Rajveer-code/flipbudget-leaderboard" },
    ],
  },
  {
    name: "trustshift",
    kind: "Benchmark · Reproduction",
    identifier: "doi:10.5281/zenodo.21739501",
    text: "Four real deployment shifts with committed prediction files, so every reported number regenerates without the raw third-party data.",
    links: [
      { label: "GitHub", href: "https://github.com/Rajveer-code/trustshift" },
      { label: "Dataset", href: "https://huggingface.co/datasets/Rajveer-code/trustshift" },
    ],
  },
  {
    name: "IndiaFinBench",
    kind: "Dataset · Live demo",
    identifier: "doi:10.5281/zenodo.21739533",
    text: "406 expert-annotated regulatory questions, per-item judge verdicts, model predictions, and a deployed retrieval demo.",
    links: [
      { label: "Dataset", href: "https://huggingface.co/datasets/Rajveer-code/IndiaFinBench" },
      { label: "Demo", href: "https://huggingface.co/spaces/Rajveer-code/IndiaFinBench" },
      { label: "GitHub", href: "https://github.com/Rajveer-code/IndiaFinBench" },
    ],
  },
  {
    name: "fairscope",
    kind: "Python library · PyPI",
    identifier: "pip install fairscope",
    text: "Subgroup-stratified, calibration-aware fairness auditing: DeLong CIs per subgroup, subgroup ECE/MCE, gap significance testing, recalibration, with healthcare, NLP, federated and lending modules.",
    links: [
      { label: "PyPI", href: "https://pypi.org/project/fairscope/" },
      { label: "GitHub", href: "https://github.com/Rajveer-code/fairscope" },
    ],
  },
  {
    name: "Federated-Diabetes",
    kind: "Code · Corrected results",
    text: "Ten-seed federated screening pipeline, with the defects found in an earlier version documented alongside the fixes.",
    links: [{ label: "GitHub", href: "https://github.com/Rajveer-code/Federated-Diabetes" }],
  },
  {
    name: "aria-audit",
    kind: "Runtime audit",
    text: "Five-axis runtime audit for locally deployed LLMs: calibration, faithfulness, consistency, equity, attribution, wrapping any model on consumer hardware.",
    links: [{ label: "GitHub", href: "https://github.com/Rajveer-code/aria-audit" }],
  },
  {
    name: "Replication code",
    kind: "Lending · Markets",
    wide: true,
    text: "Pipelines that regenerate the mortgage-disparity, causal-forest and deployment-gate results from their result files.",
    links: [
      { label: "Disparities", href: "https://github.com/Rajveer-code/hmda-racial-disparities" },
      { label: "Causal forest", href: "https://github.com/Rajveer-code/CATE-HMDA-Heterogeneous-Effects" },
      { label: "Deployment gate", href: "https://github.com/Rajveer-code/when-the-gate-stays-closed" },
    ],
  },
];

export const impact = [
  { value: "12", label: "papers and manuscripts: 1 published, 5 under review" },
  { value: "378", label: "leaderboard orderings audited for identification" },
  { value: "42M", label: "mortgage applications analysed" },
  { value: "1.28M", label: "records in external clinical validation" },
  { value: "406", label: "expert-annotated benchmark questions" },
  { value: "3", label: "public datasets on Hugging Face" },
];

export const identity = {
  name: "Rajveer Singh Pall",
  role: "AI Researcher · Trustworthy Machine Learning",
  degree: "B.Tech, Computer Science and Business Systems",
  institution: "Gyan Ganga Institute of Technology and Sciences, Jabalpur, India",
  expected: "Expected 2027",
  goal: "Applying to MS programs in Computer Science and Machine Learning for Fall 2027",
  email: "rajveerpall04@gmail.com",
  links: [
    { label: "Google Scholar", href: "https://scholar.google.com/citations?hl=en&user=47CvVCcAAAAJ" },
    { label: "GitHub", href: "https://github.com/Rajveer-code" },
    { label: "Hugging Face", href: "https://huggingface.co/Rajveer-code" },
    { label: "ORCID", href: "https://orcid.org/0009-0001-6762-6134" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rajveer-singh-pall/" },
  ],
};

export const service = [{ role: "Reviewer", venue: "W-NUT 2026, the EMNLP 2026 workshop on noisy user-generated text" }];

// Dated, verifiable events only. Month precision where the exact day is not on record.
export const news: { date: string; text: string; href?: string }[] = [
  {
    date: "Sep 2026",
    text: "Three papers entered review: benchmark identification, scoring-rule sensitivity on IndiaFinBench, and subgroup fairness reversal in federated screening.",
  },
  {
    date: "Sep 2026",
    text: "Released the flipbudget results dataset and leaderboard on Hugging Face.",
    href: "https://huggingface.co/spaces/Rajveer-code/flipbudget-leaderboard",
  },
  { date: "Aug 2026", text: "Reviewed for W-NUT 2026, the EMNLP 2026 workshop on noisy user-generated text." },
  { date: "Aug 2026", text: "Submitted the extraction-failure audit of evaluation harnesses for peer review." },
  {
    date: "Jul 2026",
    text: "Released the TrustShift benchmark and code on GitHub and Hugging Face.",
    href: "https://github.com/Rajveer-code/trustshift",
  },
  { date: "Jun 2026", text: "Released fairscope 0.3.0 on PyPI.", href: "https://pypi.org/project/fairscope/" },
  {
    date: "May 2026",
    text: "Diabetes external-validation paper published in IEEE Xplore.",
    href: "https://doi.org/10.1109/CIPHER70417.2026.11523789",
  },
  {
    date: "Apr 2026",
    text: "Posted IndiaFinBench on arXiv and released the dataset.",
    href: "https://arxiv.org/abs/2604.19298",
  },
  { date: "Feb 2026", text: "Presented the diabetes external-validation paper at CIPHER-2026, NIT Jalandhar." },
];

export const flagship = publications.find((p) => p.slug === "benchmark-accuracy-not-identified")!;

/** Papers that share the flagship's measurement question, in reading order. */
export const flagshipStrand = [
  "could-it-read-the-answer",
  "scorer-partial-identification",
  "indiafinbench",
].map((slug) => publications.find((p) => p.slug === slug)!);
