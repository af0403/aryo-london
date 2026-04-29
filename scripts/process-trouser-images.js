const sharp = require('sharp');
const fs = require('fs');

const REF = 'public/assets/reference';
const OUT = 'public/assets/processed';
const LUMA = 'public/assets/generated/luma-pack';

async function sampleColor(imagePath, x, y, size = 40) {
  const { data, info } = await sharp(imagePath)
    .extract({ left: x - size / 2, top: y - size / 2, width: size, height: size })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0;
  const px = size * size;
  for (let i = 0; i < data.length; i += info.channels) {
    r += data[i]; g += data[i + 1]; b += data[i + 2];
  }
  return { r: Math.round(r / px), g: Math.round(g / px), b: Math.round(b / px) };
}

async function paintRect(src, dest, rects) {
  const composites = rects.map(({ left, top, width, height, color }) => ({
    input: Buffer.from(
      `<svg width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="rgb(${color.r},${color.g},${color.b})"/></svg>`
    ),
    left,
    top,
  }));
  await sharp(src).composite(composites).png().toFile(dest);
}

async function run() {
  // 1. Noir trouser front — EXIF orient:8 auto-rotates to portrait, no flip needed
  await sharp(`${REF}/black-trouser-front.jpeg`)
    .rotate()
    .resize(2048, 2730, { fit: 'cover', position: 'top' })
    .png()
    .toFile(`${OUT}/noir-trouser-front-clean.png`);
  console.log('1. Noir trouser front done');

  // 2. Ivory trouser front — same EXIF orient:8
  await sharp(`${REF}/ivory-trouser-front.jpeg`)
    .rotate()
    .resize(2048, 2730, { fit: 'cover', position: 'top' })
    .png()
    .toFile(`${OUT}/ivory-trouser-front-clean.png`);
  console.log('2. Ivory trouser front done');

  // 3. Noir trouser back legs — EXIF orient:6, then 180° flip (upside down)
  await sharp(`${REF}/black-trouser-back.jpeg`)
    .rotate()
    .rotate(180)
    .resize(2048, 2730, { fit: 'cover', position: 'top' })
    .png()
    .toFile(`${OUT}/noir-trouser-back-legs-clean.png`);
  console.log('3. Noir back legs done');

  // 4. Ivory trouser back legs — EXIF orient:6, then 180° flip
  await sharp(`${REF}/ivory-trouser-back.jpeg`)
    .rotate()
    .rotate(180)
    .resize(2048, 2730, { fit: 'cover', position: 'top' })
    .png()
    .toFile(`${OUT}/ivory-trouser-back-legs-clean.png`);
  console.log('4. Ivory back legs done');

  // 5. Signature embroidery close-up — EXIF orient:6, then 180° flip
  await sharp(`${REF}/black-signature-closeup.jpeg`)
    .rotate()
    .rotate(180)
    .png()
    .toFile(`${OUT}/noir-embroidery-detail-correct.png`);
  console.log('5. Embroidery close-up done');

  // 6. Ivory embroidery — check reference dir
  const refFiles = fs.readdirSync(REF);
  const ivoryEmb = refFiles.find(f => f.includes('ivory') && (f.includes('signature') || f.includes('embroidery')));
  if (ivoryEmb) {
    const m = await sharp(`${REF}/${ivoryEmb}`).metadata();
    let pipeline = sharp(`${REF}/${ivoryEmb}`).rotate();
    if (m.orientation === 6 || m.orientation === 8) pipeline = pipeline.rotate(180);
    await pipeline.png().toFile(`${OUT}/ivory-embroidery-detail-correct.png`);
    console.log('6. Ivory embroidery done:', ivoryEmb);
  } else {
    console.log('6. No ivory embroidery in reference/, skipping');
  }

  // 7. Clean Luma noir trouser — paint sampled fabric over fake embroidery (bottom-left region)
  // Luma images are 1792x2400; embroidery approx x:50-600, y:1750-2200
  const noirColor = await sampleColor(`${LUMA}/product-noir-trouser.png`, 300, 1600, 40);
  console.log('   Noir fabric sample:', noirColor);
  await paintRect(
    `${LUMA}/product-noir-trouser.png`,
    `${OUT}/product-noir-trouser-clean.png`,
    [{ left: 50, top: 1750, width: 560, height: 450, color: noirColor }]
  );
  console.log('7. Luma noir trouser cleaned');

  // 8. Clean Luma ivory trouser
  const ivoryColor = await sampleColor(`${LUMA}/product-ivory-trouser.png`, 300, 1600, 40);
  console.log('   Ivory fabric sample:', ivoryColor);
  await paintRect(
    `${LUMA}/product-ivory-trouser.png`,
    `${OUT}/product-ivory-trouser-clean.png`,
    [{ left: 50, top: 1750, width: 560, height: 450, color: ivoryColor }]
  );
  console.log('8. Luma ivory trouser cleaned');

  console.log('\nAll done.');
}

run().catch(console.error);
