import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROCESSED = join(ROOT, "public/assets/processed");
const REF = join(ROOT, "public/assets/reference");
const OUT = join(ROOT, "public/assets/generated");

// Load the processed noir jacket (already orientation-corrected, bg removed)
const jacketPath = join(PROCESSED, "black-jacket-front.jpg");

// 1. Desaturate the jacket
// 2. Apply an ivory colour overlay (cream/warm off-white) by blending
// The ivory swatch: approximately hsl(40, 28%, 90%) = rgb(234, 224, 205)

const IVORY = { r: 234, g: 224, b: 205 };
const BG = { r: 245, g: 244, b: 240 }; // the off-white background we painted

console.log("Loading noir jacket...");
const { data, info } = await sharp(jacketPath)
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log(`Dimensions: ${width} x ${height}`);

const out = Buffer.from(data);

for (let i = 0; i < out.length; i += channels) {
  const r = out[i], g = out[i + 1], b = out[i + 2];

  // Detect if this is a background pixel (already off-white)
  const isBg =
    r >= BG.r - 8 && r <= 255 &&
    g >= BG.g - 8 && g <= 255 &&
    b >= BG.b - 8 && b <= 255 &&
    Math.abs(r - BG.r) < 20 && Math.abs(g - BG.g) < 20 && Math.abs(b - BG.b) < 20;

  if (isBg) continue; // leave background as-is

  // Convert to greyscale (luminance)
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const normLum = lum / 255; // 0..1

  // For dark areas (jacket fabric), tint toward ivory
  // For very dark areas (shadows, details), keep darker shade of ivory
  // Hardware (bright silver) stays relatively bright

  const isSilver = r > 120 && g > 120 && b > 120 && Math.abs(r - g) < 30;

  let newR, newG, newB;

  if (isSilver) {
    // Keep silver hardware mostly as-is, just warm it slightly
    newR = Math.min(255, r + 10);
    newG = Math.min(255, g + 5);
    newB = Math.min(255, b);
  } else {
    // Blend greyscale luminance toward ivory palette
    // Remap so that darkest parts become dark ivory, lightest become bright ivory
    const ivoryR = IVORY.r * normLum + 20 * (1 - normLum);
    const ivoryG = IVORY.g * normLum + 15 * (1 - normLum);
    const ivoryB = IVORY.b * normLum + 10 * (1 - normLum);

    // Mix 85% ivory tint + 15% original greyscale for texture preservation
    const grey = normLum * 255;
    newR = Math.round(ivoryR * 0.85 + grey * 0.15);
    newG = Math.round(ivoryG * 0.85 + grey * 0.15);
    newB = Math.round(ivoryB * 0.85 + grey * 0.15);
  }

  out[i] = Math.min(255, Math.max(0, newR));
  out[i + 1] = Math.min(255, Math.max(0, newG));
  out[i + 2] = Math.min(255, Math.max(0, newB));
}

const outputPath = join(OUT, "ivory-jacket-composite.jpg");
await sharp(out, { raw: { width, height, channels } })
  .jpeg({ quality: 92 })
  .toFile(outputPath);

console.log(`Saved: ${outputPath}`);
