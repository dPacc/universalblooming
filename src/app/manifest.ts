import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Universal Blooming",
    short_name: "Blooming",
    description: "Preschool, Day Care & After School Activities in the UAE. Where young minds bloom.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9f0",
    theme_color: "#e6237a",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
