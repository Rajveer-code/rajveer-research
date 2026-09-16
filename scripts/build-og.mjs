// Renders public/og.png (1200x630) and public/apple-touch-icon.png.
// The card is plain HTML drawn by a headless Chromium browser with the site's own
// fonts and tokens ("Laboratory Paper"); the touch icon is the favicon rasterised
// with sharp.
//
// Usage: node scripts/build-og.mjs

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

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
const OUT_TOUCH = join(ROOT, "public/apple-touch-icon.png");
const FAVICON = join(ROOT, "public/favicon.svg");
// -----------------------------------------------------------------------------

const font = (path) => pathToFileURL(path).href;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Newsreader"; src: url("${font(FONTS.serif)}") format("woff2"); font-weight: 200 800; }
@font-face { font-family: "Newsreader"; src: url("${font(FONTS.serifItalic)}") format("woff2"); font-weight: 200 800; font-style: italic; }
@font-face { font-family: "Fragment Mono"; src: url("${font(FONTS.mono)}") format("woff2"); }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { background: #fbfaf7; color: #17191c; font-family: "Newsreader", Georgia, serif; display: grid; grid-template-rows: 90px 1fr 90px; }
.mono { font-family: "Fragment Mono", monospace; text-transform: uppercase; letter-spacing: 0.16em; }
.top { display: flex; align-items: center; justify-content: space-between; padding: 0 80px; border-bottom: 1px solid #e4e1d8; color: #2742d6; font-size: 20px; }
.dot { width: 18px; height: 18px; border-radius: 50%; background: #2742d6; }
.main { padding: 44px 80px 0; display: grid; align-content: center; gap: 30px; }
h1 { font-size: 68px; line-height: 1.02; font-weight: 460; letter-spacing: -0.022em; max-width: 1000px; }
h1 em { font-style: italic; color: #2742d6; }
.keys { color: #63666d; font-size: 17px; }
.keys b { color: #2742d6; font-weight: 400; }
.foot { display: flex; align-items: center; justify-content: space-between; padding: 0 80px; border-top: 1px solid #e4e1d8; color: #63666d; font-family: "Fragment Mono", monospace; font-size: 19px; }
</style></head><body>
<div class="top mono"><span>Rajveer Singh Pall · AI Research</span><span class="dot"></span></div>
<div class="main">
  <h1>Testing whether machine learning<br>results <em>mean what they claim</em></h1>
  <div class="keys mono"><b>Benchmark evaluation</b> · Fairness · External validation · Deployment shift</div>
</div>
<div class="foot"><span>rajveer-research.vercel.app</span><span>Accuracy is not enough. Audit the decision.</span></div>
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), "og-"));
const page = join(dir, "og.html");
writeFileSync(page, html);

execFileSync(BROWSER, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--virtual-time-budget=3000",
  `--screenshot=${OUT_OG}`,
  pathToFileURL(page).href,
]);

await sharp(readFileSync(FAVICON)).resize(180, 180).flatten({ background: "#fbfaf7" }).png().toFile(OUT_TOUCH);

const meta = await sharp(OUT_OG).metadata();
console.log(`og.png ${meta.width}x${meta.height}, apple-touch-icon.png 180x180`);
