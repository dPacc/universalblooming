import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { Bloomi } from "../../src/components/mascot/Bloomi";
async function main(){ const moods = ["happy","wave","cheer","think","read","sleep","love"] as const;
const tiles = await Promise.all(moods.map(async (m) => {
  const svg = renderToStaticMarkup(<Bloomi mood={m} animated={false} />).replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="375"');
  return sharp(Buffer.from(svg)).png().toBuffer();
}));
await sharp({ create: { width: 300*7, height: 375, channels: 4, background: "#fff9f0" } })
  .composite(tiles.map((t,i)=>({ input: t, left: i*300, top: 0 }))).png().toFile(process.argv[2]); } main();
