import type { APIRoute } from "astro";
import { identity, openScience } from "../data/research";
import { absolute, paperPath, papersInOrder } from "../data/seo";

// llms.txt (https://llmstxt.org): a plain-markdown map of the site for language models,
// generated from the same data as the pages.
export const GET: APIRoute = () => {
  const lines = [
    `# ${identity.name}`,
    "",
    `> AI researcher studying whether machine learning results mean what they claim: benchmark identification and scoring rules in LLM evaluation, fairness at the decision threshold, clinical external validation, deployment shift, lending and markets. ${identity.goal}.`,
    "",
    `${identity.degree}, ${identity.institution} (${identity.expected.toLowerCase()}). Every status on this site is stated exactly and never upgraded; the venue of a double-blind submission under review is not named.`,
    "",
    "## Papers and manuscripts",
    "",
    ...papersInOrder.map((p) => `- [${p.title}](${absolute(paperPath(p))}): ${p.status}. ${p.oneLiner}`),
    "",
    "## Code, data and tools",
    "",
    ...openScience.map((o) => `- [${o.name}](${o.links[0].href}): ${o.text}`),
    "",
    "## Contact and profiles",
    "",
    `- [Email](mailto:${identity.email}): ${identity.email}`,
    ...identity.links.map((l) => `- [${l.label}](${l.href})`),
    "",
    "## Optional",
    "",
    `- [All publications](${absolute("/research/")}): the full list with status filters`,
    `- [Sitemap](${absolute("/sitemap.xml")})`,
    "",
  ];

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
