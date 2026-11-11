import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The support chat reads its prompt, knowledge base and style guide from support/*.md at runtime.
  outputFileTracingIncludes: { "/api/support/**": ["./support/*.md"] },
  // The front page is the rental for private parties and /erhverv is for places. The old bar, festival and
  // events pages are folded into /erhverv, and every customer page lives under /erhverv/<sted> (Smukfest
  // moved there from /events/smukfest on 21 Oct 2026). /lej was the rental page before it became the front
  // page; the query (a cancelled payment) goes along. A catalogue is its customer page now; the old MongoDB
  // copies on /kataloger/<slug> point there.
  // Sikkerhedsheadere på alle sider. CSP'en er bevidst smal (ingen script-src endnu, fordi Next og 3D bruger
  // inline-scripts og blob-workers): den forhindrer indlejring, plugins og <base>-kapring. admin.selfi.dk må
  // indlejre siderne, fordi admin → Kataloger viser katalogerne i en iframe.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://admin.selfi.dk; object-src 'none'; base-uri 'self'; upgrade-insecure-requests" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }, // ældre browsere; nye bruger frame-ancestors
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/lej", destination: "/", permanent: false },
      { source: "/events", destination: "/erhverv", permanent: true },
      { source: "/events/:slug", destination: "/erhverv/:slug", permanent: true },
      { source: "/kataloger", destination: "/erhverv", permanent: false },
      { source: "/kataloger/:slug", destination: "/erhverv/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
