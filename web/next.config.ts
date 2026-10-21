import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The front page is the rental for private parties and /erhverv is for places. The old bar and festival
  // pages are folded into /erhverv; their customer pages (/erhverv/aab, /events/smukfest …) stay where they are.
  // /lej was the rental page before it became the front page; the query (a cancelled payment) goes along.
  // A catalogue is its customer page now; the old MongoDB copies on /kataloger/<slug> point there.
  async redirects() {
    return [
      { source: "/lej", destination: "/", permanent: false },
      { source: "/events", destination: "/erhverv", permanent: false },
      { source: "/kataloger", destination: "/erhverv", permanent: false },
      { source: "/kataloger/smukfest:rest(.*)", destination: "/events/smukfest", permanent: true },
      { source: "/kataloger/:slug", destination: "/erhverv/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
