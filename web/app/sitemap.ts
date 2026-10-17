import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://selfi.dk/", changeFrequency: "monthly", priority: 1 },
    { url: "https://selfi.dk/erhverv", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://selfi.dk/events", changeFrequency: "monthly", priority: 0.7 },
  ];
}
