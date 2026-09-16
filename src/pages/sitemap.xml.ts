import type { APIRoute } from "astro";
import { publications } from "../data/research";

// Generated from the same data as the pages, so the sitemap cannot drift from the site.
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://rajveer-research.vercel.app");
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    ...[...publications]
      .sort((a, b) => a.order - b.order)
      .map((p) => ({ path: `/research/${p.slug}/`, priority: "0.8", changefreq: "monthly" })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${new URL(e.path, base).href}</loc><lastmod>${lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
