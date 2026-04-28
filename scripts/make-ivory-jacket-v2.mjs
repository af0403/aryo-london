import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROCESSED = join(ROOT, "public/assets/processed");
const GEN = join(ROOT, "public/assets/generated");

mkdirSync(GEN, { recursive: true });

const BG = { r: 245, g: 244, b: 240 };

function isBgPixel(r, g, b) {
  return (
    Math.abs(r - BG.r) < 18 &&
    Math.abs(g - BG.g) < 18 &&
    Math.abs(b - BG.b) < 18
  );
}

// Sample the dominant ivory fabric color from the trouser (center garment region)
console.log("Sampling ivory colour from trouser...");
const trouserPath = join(PROCESSED, "ivory-trouser-front.jpg");
const { data: td, info: ti } = await sharp(trouserPath)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: tw, height: th, channels: tc } = ti;

// Crop to the garment area: center 50% horizontally, rows 15%–65% vertically
const x0 = Math.floor(tw * 0.25);
const x1 = Math.floor(tw * 0.75);
const y0 = Math.floor(th * 0.15);
const y1 = Math.floor(th * 0.65);

let sumR = 0, sumG = 0, sumB = 0, count = 0;
for (let y = y0; y < y1; y++) {
  for (let x = x0; x < x1; x++) {
    const idx = (y * tw + x) * tc;
    const r = td[idx], g = td[idx + 1], b = td[idx + 2];
    if (!isBgPixel(r, g, b)) {
      sumR += r; sumG += g; sumB += b; count++;
    }
  }
}

if (count === 0) throw new Error("No garment pixels found — check trouser image path");

const IVORY = {
  r: Math.round(sumR / count),
  g: Math.round(sumG / count),
  b: Math.round(sumB / count),
};
console.log(`  Sampled ivory colour: rgb(${IVORY.r}, ${IVORY.g}, ${IVORY.b}) from ${count.toLocaleString()} pixels`);

// Load the processed noir jacket (already orientation-corrected + background removed)
console.log("\nLoading noir jacket...");
const jacketPath = join(PROCESSED, "black-jacket-front.jpg");
const { data, info } = await sharp(jacketPath)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log(`  Jacket dimensions: ${width} x ${height}`);

const out = Buffer.from(data);

for (let pidx = 0; pidx < width * height; pidx++) {
  const i = pidx * channels;
  const r = out[i], g = out[i + 1], b = out[i + 2];

  if (isBgPixel(r, g, b)) continue; // preserve background

  // Compute perceptual luminance (0..1)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Map luminance into the ivory palette:
  // - lum=1 (highlights)  → ivory at full brightness (IVORY * 1.0)
  // - lum=0 (deep shadow) → dark ivory (IVORY * 0.12, not pure black)
  const scale = 0.12 + lum * 0.88;

  out[i]     = Math.min(255, Math.round(IVORY.r * scale));
  out[i + 1] = Math.min(255, Math.round(IVORY.g * scale));
  out[i + 2] = Math.min(255, Math.round(IVORY.b * scale));
}

const outputPath = join(GEN, "ivory-jacket-composite.png");
await sharp(out, { raw: { width, height, channels } })
  .png({ compressionLevel: 8 })
  .toFile(outputPath);

console.log(`\nSaved: ${outputPath}`);
