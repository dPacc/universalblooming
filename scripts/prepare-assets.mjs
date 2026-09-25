// One-off: turns the vendor's logo + founder photo into web-ready assets.
import sharp from "sharp";
const dir = "public/images";
const logo = sharp(`${dir}/logo-source.png`).trim({ threshold: 10 });
const buf = await logo.toBuffer({ resolveWithObject: true });
console.log("logo trimmed", buf.info.width, buf.info.height);
await sharp(buf.data).resize({ width: 480 }).webp({ quality: 88 }).toFile(`${dir}/logo.webp`);
await sharp(buf.data).resize({ width: 480 }).png({ compressionLevel: 9 }).toFile(`${dir}/logo.png`);
// Square icon, centred on white
const sq = Math.max(buf.info.width, buf.info.height);
const square = await sharp({ create: { width: sq, height: sq, channels: 4, background: "#ffffff" } })
  .composite([{ input: buf.data, gravity: "center" }]).png().toBuffer();
await sharp(square).resize(512).png().toFile("src/app/icon.png");
await sharp(square).resize(180).png().toFile("src/app/apple-icon.png");
await sharp(square).resize(512).png().toFile(`${dir}/logo-square.png`);
await sharp(`${dir}/founder.png`).resize({ width: 520 }).webp({ quality: 85 }).toFile(`${dir}/founder.webp`);
console.log("done");
