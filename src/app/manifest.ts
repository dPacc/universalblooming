import type { MetadataRoute } from "next";
import { asset } from "@/config/site";

// Required for the static (GitHub Pages) export; harmless on a server build.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Universal Blooming",
    short_name: "Blooming",
    description: "Preschool, Day Care & After School Activities in the UAE. Where young minds bloom.",
    start_url: asset("/"),
    display: "standalone",
    background_color: "#fff9f0",
    theme_color: "#e6237a",
    icons: [
      { src: asset("/icon.png"), sizes: "512x512", type: "image/png" },
      { src: asset("/apple-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  };
}
