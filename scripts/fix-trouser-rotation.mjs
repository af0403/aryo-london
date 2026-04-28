import sharp from "sharp";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REF = join(ROOT, "public/assets/reference");
const OUT = join(ROOT, "public/assets/processed");

mkdirSync(OUT, { recursive: true });

const TARGET_BG = { r: 245, g: 244, b: 240 };

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

async function processTrouser(filename, threshold = 55) {
  const input = join(REF, filename);
  const output = join(OUT, filename.replace(/\.jpeg$/, ".jpg"));
  console.log(`\nProcessing: ${filename}`);

  const meta = await sharp(input).metadata();
  console.log(`  Raw dimensions: ${meta.width} x ${meta.height}, EXIF orientation: ${meta.orientation}`);

  // Step 1: EXIF auto-rotation to get correct physical orientation (portrait)
  // Step 2: explicit 180° rotation because images are upside down after EXIF correction
  // Step 3: resize, keeping EXIF-stripping implicit (raw buffer reconstruction)
  const { data, info } = await sharp(input)
    .rotate()        // correct EXIF orientation (orientation:8 → 90° CCW)
    .rotate(180)     // explicit 180° flip — images are upside down after EXIF correction
    .resize({ width: 1800, height: 1800, fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`  After rotation + resize: ${width} x ${height}`);

  // Sample border pixels to estimate background color
  const samples = [];
  const border = 8;
  for (let x = 0; x < width; x += 20) {
    for (let b = 0; b < border; b++) {
      const topIdx = (b * width + x) * channels;
      samples.push({ r: data[topIdx], g: data[topIdx + 1], b: data[topIdx + 2] });
      const botIdx = ((height - 1 - b) * width + x) * channels;
      samples.push({ r: data[botIdx], g: data[botIdx + 1], b: data[botIdx + 2] });
    }
  }
  for (let y = 0; y < height; y += 20) {
    for (let b = 0; b < border; b++) {
      const leftIdx = (y * width + b) * channels;
      samples.push({ r: data[leftIdx], g: data[leftIdx + 1], b: data[leftIdx + 2] });
      const rightIdx = (y * width + (width - 1 - b)) * channels;
      samples.push({ r: data[rightIdx], g: data[rightIdx + 1], b: data[rightIdx + 2] });
    }
  }

  samples.sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b));
  const mid = samples.slice(
    Math.floor(samples.length * 0.25),
    Math.floor(samples.length * 0.75)
  );
  const bgR = Math.round(mid.reduce((s, c) => s + c.r, 0) / mid.length);
  const bgG = Math.round(mid.reduce((s, c) => s + c.g, 0) / mid.length);
  const bgB = Math.round(mid.reduce((s, c) => s + c.b, 0) / mid.length);
  console.log(`  Detected background: rgb(${bgR}, ${bgG}, ${bgB})`);

  // BFS flood-fill from all edges
  const visited = new Uint8Array(width * height);
  const queue = [];

  const seed = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pidx = y * width + x;
    if (visited[pidx]) return;
    const idx = pidx * channels;
    if (colorDistance(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB) > threshold) return;
    visited[pidx] = 1;
    queue.push(pidx);
  };

  for (let x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
  for (let y = 0; y < height; y++) { seed(0, y); seed(width - 1, y); }

  let qi = 0;
  while (qi < queue.length) {
    const pidx = queue[qi++];
    const x = pidx % width;
    const y = Math.floor(pidx / width);
    seed(x + 1, y); seed(x - 1, y); seed(x, y + 1); seed(x, y - 1);
  }

  console.log(`  Background pixels: ${queue.length.toLocaleString()} / ${(width * height).toLocaleString()}`);

  const out = Buffer.from(data);
  for (let pidx = 0; pidx < width * height; pidx++) {
    if (visited[pidx]) {
      const idx = pidx * channels;
      out[idx] = TARGET_BG.r;
      out[idx + 1] = TARGET_BG.g;
      out[idx + 2] = TARGET_BG.b;
    }
  }

  // Reconstruct from raw buffer — no EXIF metadata carried over
  await sharp(out, { raw: { width, height, channels } })
    .jpeg({ quality: 92 })
    .toFile(output);

  console.log(`  Saved: ${output}`);
}

const trousers = [
  ["black-trouser-front.jpeg", 55],
  ["black-trouser-back.jpeg",  55],
  ["ivory-trouser-front.jpeg", 45],
  ["ivory-trouser-back.jpeg",  45],
];

for (const [filename, threshold] of trousers) {
  await processTrouser(filename, threshold);
}

console.log("\nAll done.");
