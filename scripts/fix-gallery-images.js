const sharp = require('sharp');

const REF = 'public/assets/reference';
const OUT = 'public/assets/processed';
const BG = { r: 245, g: 244, b: 240, alpha: 1 };

async function run() {
  // Back photos — EXIF auto-correct + 180° flip, contain on off-white
  await sharp(`${REF}/black-trouser-back.jpeg`)
    .rotate().rotate(180)
    .resize(1350, 1800, { fit: 'contain', background: BG })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/noir-trouser-back-rotated.jpg`);
  console.log('noir back done');

  await sharp(`${REF}/ivory-trouser-back.jpeg`)
    .rotate().rotate(180)
    .resize(1350, 1800, { fit: 'contain', background: BG })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/ivory-trouser-back-rotated.jpg`);
  console.log('ivory back done');

  // Noir embroidery — EXIF + 180°, square crop
  await sharp(`${REF}/black-signature-closeup.jpeg`)
    .rotate().rotate(180)
    .resize(1200, 1200, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/noir-embroidery-closeup.jpg`);
  console.log('noir embroidery done');

  // Ivory embroidery — rotate, then crop pocket area
  const ivBuf = await sharp(`${REF}/ivory-trouser-back.jpeg`)
    .rotate().rotate(180)
    .toBuffer();
  const m = await sharp(ivBuf).metadata();
  await sharp(ivBuf)
    .extract({
      left:   Math.floor(m.width * 0.35),
      top:    Math.floor(m.height * 0.55),
      width:  Math.floor(m.width * 0.40),
      height: Math.floor(m.width * 0.40),
    })
    .resize(1200, 1200, { fit: 'cover' })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/ivory-embroidery-closeup.jpg`);
  console.log('ivory embroidery done');
}

run().catch(console.error);
