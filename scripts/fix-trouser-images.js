const sharp = require('sharp');

const REF = 'public/assets/reference';
const OUT = 'public/assets/processed';

async function process(input, output, extraRotate, size) {
  let pipe = sharp(input).rotate();
  if (extraRotate) pipe = pipe.rotate(extraRotate);
  const [w, h] = size || [1350, 1800];
  await pipe
    .resize(w, h, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 92 })
    .toFile(output);
  console.log('done:', output);
}

async function run() {
  // Fronts — orient:8, EXIF auto gives correct upright portrait
  await process(`${REF}/black-trouser-front.jpeg`, `${OUT}/noir-trouser-front-clean.jpg`, null);
  await process(`${REF}/ivory-trouser-front.jpeg`, `${OUT}/ivory-trouser-front-clean.jpg`, null);

  // Backs — orient:6, EXIF auto gives portrait but upside down → +180°
  await process(`${REF}/black-trouser-back.jpeg`, `${OUT}/noir-trouser-back-clean.jpg`, 180);
  await process(`${REF}/ivory-trouser-back.jpeg`, `${OUT}/ivory-trouser-back-clean.jpg`, 180);

  // Embroidery close-ups — square crop at 1200x1200
  // Noir close-up: orient:6, upside down → EXIF + 180°
  await process(`${REF}/black-signature-closeup.jpeg`, `${OUT}/noir-embroidery-closeup-clean.jpg`, 180, [1200, 1200]);

  // Ivory: use the ivory back photo, crop centre tight for pocket detail
  await process(`${REF}/ivory-trouser-back.jpeg`, `${OUT}/ivory-embroidery-closeup-clean.jpg`, 180, [1200, 1200]);

  console.log('\nAll done.');
}

run().catch(console.error);
