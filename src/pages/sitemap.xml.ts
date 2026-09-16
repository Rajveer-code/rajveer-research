import type { APIRoute } from "astro";
import { absolute, paperPath, papersInOrder } from "../data/seo";

// Generated from the same data as the pages, so the sitemap cannot drift from the site.
// Lists canonical URLs only: no redirects, no 404.
export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = [
    { path: "/", priority: "1.0", changefreq: "weekly" },
    { path: "/research/", priority: "0.9", changefreq: "weekly" },
    ...papersInOrder.map((p) => ({ path: paperPath(p), priority: "0.8", changefreq: "monthly" })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${absolute(e.path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
