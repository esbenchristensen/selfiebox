import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Selfi only sells to places now. The old bar and festival pages are folded into the front page;
  // their customer pages (/erhverv/aab, /events/smukfest …) stay where they are.
  // A catalogue is its customer page now; the old MongoDB copies on /kataloger/<slug> point there.
  async redirects() {
    return [
      { source: "/erhverv", destination: "/", permanent: true },
      { source: "/events", destination: "/", permanent: true },
      { source: "/kataloger", destination: "/", permanent: true },
      { source: "/kataloger/smukfest:rest(.*)", destination: "/events/smukfest", permanent: true },
      { source: "/kataloger/:slug", destination: "/erhverv/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
