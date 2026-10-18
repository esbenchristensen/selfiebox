import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Selfi only sells to places now. The old bar and festival pages are folded into the front page;
  // their customer pages (/erhverv/aab, /events/smukfest …) stay where they are.
  async redirects() {
    return [
      { source: "/erhverv", destination: "/", permanent: true },
      { source: "/events", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
