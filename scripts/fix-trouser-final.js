const sharp = require('sharp');

const REF = 'public/assets/reference';
const OUT = 'public/assets/processed';
const LUMA = 'public/assets/generated/luma-pack';

async function removeEmbroidery(input, output) {
  const meta = await sharp(input).metadata();
  console.log(input, meta.width + 'x' + meta.height, 'channels:', meta.channels);

  const { data, info } = await sharp(input).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;

  // Sample fabric colour just to the right of the embroidery region
  const sampleX = Math.floor(info.width * 0.28);
  const sampleY = Math.floor(info.height * 0.72);
  const si = (sampleY * info.width + sampleX) * ch;
  const sr = data[si], sg = data[si + 1], sb = data[si + 2];
  console.log('  Sampled fabric:', sr, sg, sb);

  // Region to paint over (lower-left leg area where fake embroidery sits)
  const paintX = Math.floor(info.width * 0.05);
  const paintY = Math.floor(info.height * 0.60);
  const paintW = Math.floor(info.width * 0.35);
  const paintH = Math.floor(info.height * 0.22);
  const fabricBrightness = (sr + sg + sb) / 3;

  for (let py = paintY; py < paintY + paintH; py++) {
    for (let px = paintX; px < paintX + paintW; px++) {
      const i = (py * info.width + px) * ch;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > fabricBrightness + 30) {
        data[i] = sr; data[i + 1] = sg; data[i + 2] = sb;
        if (ch === 4) data[i + 3] = 255;
      }
    }
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } })
    .png()
    .toFile(output);
  console.log('  Written:', output);
}

async function run() {
  // 1. Remove fake embroidery from Luma primaries
  console.log('\n--- Removing embroidery from Luma images ---');
  await removeEmbroidery(`${LUMA}/product-noir-trouser.png`, `${OUT}/product-noir-trouser-clean.png`);
  await removeEmbroidery(`${LUMA}/product-ivory-trouser.png`, `${OUT}/product-ivory-trouser-clean.png`);

  // 2. Rotated back photos (EXIF orient:6 auto + 180° flip)
  console.log('\n--- Rotating back reference photos ---');
  await sharp(`${REF}/black-trouser-back.jpeg`)
    .rotate().rotate(180)
    .resize(1350, 1800, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 88 })
    .toFile(`${OUT}/noir-trouser-back-rotated.jpg`);
  console.log('  noir back rotated');

  await sharp(`${REF}/ivory-trouser-back.jpeg`)
    .rotate().rotate(180)
    .resize(1350, 1800, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 88 })
    .toFile(`${OUT}/ivory-trouser-back-rotated.jpg`);
  console.log('  ivory back rotated');

  // 3. Noir embroidery close-up (signature closeup — EXIF orient:6 + 180°)
  console.log('\n--- Embroidery close-ups ---');
  await sharp(`${REF}/black-signature-closeup.jpeg`)
    .rotate().rotate(180)
    .resize(1200, 1200, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/noir-embroidery-closeup.jpg`);
  console.log('  noir embroidery done');

  // 4. Ivory embroidery: crop pocket area from rotated back photo
  // After orient:6 auto-rotate → 4284×5712 portrait. After 180° → same dims.
  // Pocket is in upper portion of original back shot (lower leg when upside down).
  // After rotation, pocket should be in the lower half. Crop bottom-left quadrant.
  const ivoryRotated = await sharp(`${REF}/ivory-trouser-back.jpeg`)
    .rotate().rotate(180)
    .toBuffer();
  const ivMeta = await sharp(ivoryRotated).metadata();
  console.log('  Ivory back post-rotation:', ivMeta.width + 'x' + ivMeta.height);

  await sharp(ivoryRotated)
    .extract({
      left: Math.floor(ivMeta.width * 0.05),
      top:  Math.floor(ivMeta.height * 0.50),
      width: Math.floor(ivMeta.width * 0.55),
      height: Math.floor(ivMeta.height * 0.45),
    })
    .resize(1200, 1200, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/ivory-embroidery-closeup.jpg`);
  console.log('  ivory embroidery done');

  console.log('\nAll done.');
}

run().catch(console.error);
