// Renders the social share images and icons:
//   public/og.png                 site card (1200x630)
//   public/og/<slug>.png          one card per paper (1200x630), from src/data/research.ts
//   public/apple-touch-icon.png   180x180, from public/favicon.svg
//   public/favicon.ico            16/32/48, from public/favicon.svg
// Cards are plain HTML drawn by a headless Chromium browser with the site's own fonts
// and tokens ("Laboratory Paper"). Needs Node 22.18+ to import the TypeScript data file.
//
// Usage: node scripts/build-og.mjs

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import { publications } from "../src/data/research.ts";

// ---- PATHS -------------------------------------------------------------------
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BROWSER =
  process.env.CHROMIUM_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const FONTS = {
  serif: join(ROOT, "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2"),
  serifItalic: join(ROOT, "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2"),
  mono: join(ROOT, "node_modules/@fontsource/fragment-mono/files/fragment-mono-latin-400-normal.woff2"),
};
const OUT_OG = join(ROOT, "public/og.png");
const OUT_PAPERS = join(ROOT, "public/og");
const OUT_TOUCH = join(ROOT, "public/apple-touch-icon.png");
const OUT_ICO = join(ROOT, "public/favicon.ico");
const FAVICON = join(ROOT, "public/favicon.svg");
const HOST = "rajveer-research.vercel.app";
// -----------------------------------------------------------------------------

const font = (path) => pathToFileURL(path).href;
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CSS = `
@font-face { font-family: "Newsreader"; src: url("${font(FONTS.serif)}") format("woff2"); font-weight: 200 800; }
@font-face { font-family: "Newsreader"; src: url("${font(FONTS.serifItalic)}") format("woff2"); font-weight: 200 800; font-style: italic; }
@font-face { font-family: "Fragment Mono"; src: url("${font(FONTS.mono)}") format("woff2"); }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { background: #fbfaf7; color: #17191c; font-family: "Newsreader", Georgia, serif; display: grid; grid-template-rows: 90px 1fr 90px; }
.mono { font-family: "Fragment Mono", monospace; text-transform: uppercase; letter-spacing: 0.16em; }
.top { display: flex; align-items: center; justify-content: space-between; padding: 0 80px; border-bottom: 1px solid #e4e1d8; color: #2742d6; font-size: 20px; }
.dot { width: 18px; height: 18px; border-radius: 50%; background: #2742d6; }
.main { padding: 0 80px; display: grid; align-content: center; gap: 28px; }
h1 { line-height: 1.06; font-weight: 460; letter-spacing: -0.02em; max-width: 1040px; }
h1 em { font-style: italic; color: #2742d6; }
.keys { color: #63666d; font-size: 17px; }
.keys b { color: #2742d6; font-weight: 400; }
.status { justify-self: start; font-size: 17px; padding: 6px 12px; border-radius: 3px; border: 1px solid transparent; }
.status--published { background: #ebf2ee; color: #2f6b4f; }
.status--review { background: #eef0fb; color: #1c2f9e; }
.status--working { background: #f3f1ea; color: #4a4e55; }
.status--manuscript { border-color: #c8c5ba; color: #4a4e55; }
.status--preparation { border-color: #c8c5ba; border-style: dashed; color: #63666d; }
.authors { font-family: "Fragment Mono", monospace; font-size: 16px; color: #63666d; }
.foot { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 0 80px; border-top: 1px solid #e4e1d8; color: #63666d; font-family: "Fragment Mono", monospace; font-size: 19px; }
`;

const TOP = `<div class="top mono"><span>Rajveer Singh Pall · AI Research</span><span class="dot"></span></div>`;

const dir = mkdtempSync(join(tmpdir(), "og-"));
function render(name, body, out) {
  const page = join(dir, `${name}.html`);
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`);
  execFileSync(BROWSER, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=3000",
    `--screenshot=${out}`,
    pathToFileURL(page).href,
  ]);
}

// Site card
render(
  "site",
  `${TOP}
  <div class="main">
    <h1 style="font-size:68px">Testing whether machine learning<br>results <em>mean what they claim</em></h1>
    <div class="keys mono"><b>Benchmark evaluation</b> · Fairness · External validation · Deployment shift</div>
  </div>
  <div class="foot"><span>${HOST}</span><span>Accuracy is not enough. Audit the decision.</span></div>`,
  OUT_OG,
);

// One card per paper; the title size steps down with length so every title fits in three lines.
mkdirSync(OUT_PAPERS, { recursive: true });
const titleSize = (t) => (t.length <= 50 ? 64 : t.length <= 95 ? 54 : t.length <= 135 ? 46 : 40);
for (const p of publications) {
  render(
    p.slug,
    `${TOP}
    <div class="main">
      <div class="status mono status--${p.statusKind}">${escape(p.status)}</div>
      <h1 style="font-size:${titleSize(p.title)}px">${escape(p.title)}</h1>
      <div class="authors">${escape(p.authors)}</div>
    </div>
    <div class="foot"><span>${HOST}/research/${p.slug}/</span><span>${p.year}</span></div>`,
    join(OUT_PAPERS, `${p.slug}.png`),
  );
}

await sharp(readFileSync(FAVICON)).resize(180, 180).flatten({ background: "#fbfaf7" }).png().toFile(OUT_TOUCH);

// favicon.ico: a real ICO container with PNG entries (valid since Windows Vista, read by every browser).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(readFileSync(FAVICON), { density: 384 }).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e); // width
  header.writeUInt8(s, e + 1); // height
  header.writeUInt8(0, e + 2); // palette colours
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync(OUT_ICO, Buffer.concat([header, ...pngs]));

console.log(`og.png + ${publications.length} paper cards in public/og/, apple-touch-icon.png, favicon.ico (${sizes.join("/")})`);
