import type { MetadataRoute } from "next";
import { features } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://selfi.dk/", changeFrequency: "monthly", priority: 1 },
    { url: "https://selfi.dk/funktioner", changeFrequency: "monthly", priority: 0.8 },
    ...features.map((f) => ({ url: `https://selfi.dk/funktioner/${f.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
