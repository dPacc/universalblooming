import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

/**
 * Per-page Open Graph card (1200×630): title + eyebrow + Bloomi + logo colours.
 * Every page links here through pageMetadata(), so shared links on WhatsApp,
 * Facebook and X always get a branded, readable preview.
 */
const MOOD_BY_EYEBROW: [RegExp, string][] = [
  [/day care · after school/i, "wave"], // site-wide "Preschool · Day Care · After School Activities" cards
  [/guide|development|admissions|choosing|fees/i, "read"],
  [/tool|quiz|calculator/i, "think"],
  [/about|contact/i, "love"],
  [/activit|program/i, "cheer"],
];

let cache: Record<string, string> = {};
async function bloomi(mood: string) {
  if (!cache[mood]) {
    const png = await readFile(path.join(process.cwd(), "public/images/bloomi", `${mood}.png`));
    cache = { ...cache, [mood]: `data:image/png;base64,${png.toString("base64")}` };
  }
  return cache[mood];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Where young minds bloom").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") || "Universal Blooming").slice(0, 60);
  const mood = MOOD_BY_EYEBROW.find(([re]) => re.test(eyebrow))?.[1] ?? "wave";
  const img = await bloomi(mood);
  const colors = ["#e6237a", "#f7931e", "#ffc20e", "#7cb342", "#1fa99a", "#29abe2", "#3f6fc4"];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fff9f0", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 18, display: "flex" }}>
          {colors.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
        </div>
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 999, background: "#fff5cc", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "70px 0 70px 80px", width: 820 }}>
          <div style={{ display: "flex", alignSelf: "flex-start", fontSize: 26, fontWeight: 800, color: "#1fa99a", border: "3px solid #1fa99a", borderRadius: 999, padding: "6px 22px", textTransform: "uppercase", letterSpacing: 1 }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: title.length > 60 ? 58 : 70, fontWeight: 800, color: "#2b2355", lineHeight: 1.08 }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 36, fontSize: 30, fontWeight: 700, color: "#564d7f" }}>
            <span style={{ color: "#e6237a" }}>Universal Blooming</span>
            <span style={{ margin: "0 14px" }}>·</span>
            <span>Where Young Minds Bloom</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} width={330} height={412} alt="" style={{ position: "absolute", right: 50, bottom: 40 }} />
      </div>
    ),
    { width: 1200, height: 630, headers: { "cache-control": "public, max-age=86400, s-maxage=31536000, immutable" } },
  );
}
