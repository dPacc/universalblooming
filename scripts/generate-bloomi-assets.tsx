/**
 * Exports every Bloomi mood as a static SVG + 512px PNG (public/images/bloomi/)
 * for OG images, social posts, print, WhatsApp stickers and the GBP profile.
 * Run: npx tsx --tsconfig tsconfig.json scripts/generate-bloomi-assets.tsx
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { Bloomi } from "../src/components/mascot/Bloomi";

const moods = ["happy", "wave", "cheer", "think", "read", "sleep", "love"] as const;
async function main() {
  mkdirSync("public/images/bloomi", { recursive: true });
  for (const m of moods) {
    const svg = renderToStaticMarkup(<Bloomi mood={m} animated={false} />)
      .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
      .replace(/<style>[\s\S]*?<\/style>/, "");
    writeFileSync(`public/images/bloomi/${m}.svg`, svg);
    await sharp(Buffer.from(svg.replace("<svg", '<svg width="800" height="1000"'))).resize(512).png().toFile(`public/images/bloomi/${m}.png`);
  }
  console.log("Bloomi assets written");
}
main();
