/**
 * Search and sharing helpers shared by the layout, pages and generated files
 * (sitemap.xml, llms.txt). URLs derive from `site` in astro.config.mjs.
 */
import { publications, type Publication } from "./research";

export const SITE_NAME = "Rajveer Singh Pall · AI Research";

export const absolute = (path: string): string => new URL(path, import.meta.env.SITE).href;

export const PERSON_ID = absolute("/#person");
export const WEBSITE_ID = absolute("/#website");

export const paperPath = (p: Publication): string => `/research/${p.slug}/`;

export const papersInOrder: Publication[] = [...publications].sort((a, b) => a.order - b.order);

/** "By Rajveer Singh Pall, 2026." with co-authors named up to two, "et al." beyond. */
export const byline = (p: Publication): string => {
  const names = p.authors.split(", ");
  const who =
    names.length === 1 ? names[0] : names.length === 2 ? `${names[0]} and ${names[1]}` : `${names[0]} et al.`;
  return `By ${who}, ${p.year}.`;
};

/** Meta description: the paper's one-line discovery plus byline, kept to 160 characters. */
export const paperDescription = (p: Publication): string => {
  const full = `${p.oneLiner} ${byline(p)}`;
  return full.length <= 160 ? full : p.oneLiner;
};

/** Paper links that are the work itself (not code, data or an earlier version). */
export const workIdentifiers = (p: Publication): string[] =>
  p.links
    .filter((l) => /doi\.org|arxiv\.org|ssrn\.com/.test(l.href) && !/earlier/i.test(l.label))
    .map((l) => l.href);
