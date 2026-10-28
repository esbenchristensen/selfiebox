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
