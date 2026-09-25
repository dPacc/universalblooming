import type { NextConfig } from "next";

const host = "www.universalblooming.com";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // One canonical host. Old vendor site was apex + index.html anchors.
      { source: "/:path*", has: [{ type: "host", value: "universalblooming.com" }], destination: `https://${host}/:path*`, permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/program.html", destination: "/programs", permanent: true },
      { source: "/programs.html", destination: "/programs", permanent: true },
      { source: "/activities.html", destination: "/activities", permanent: true },
      { source: "/gallery.html", destination: "/about", permanent: true },
      { source: "/day-care", destination: "/programs/day-care", permanent: true },
      { source: "/daycare", destination: "/programs/day-care", permanent: true },
      { source: "/preschool", destination: "/programs/preschool", permanent: true },
      { source: "/after-school", destination: "/programs/after-school", permanent: true },
      { source: "/blog/:slug", destination: "/parents-guide/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
