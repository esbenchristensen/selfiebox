import type { MetadataRoute } from "next";
import { features } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://selfi.dk/", changeFrequency: "monthly", priority: 1 },
    { url: "https://selfi.dk/funktioner", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://selfi.dk/lej", changeFrequency: "monthly", priority: 0.9 },
    ...["/dokumentation", "/dokumentation/overensstemmelseserklaering", "/dokumentation/brugsanvisning", "/gaester", "/brugsvilkaar", "/databehandleraftale", "/vilkaar", "/privatliv", "/cookies"].map(
      (p) => ({ url: `https://selfi.dk${p}`, changeFrequency: "yearly" as const, priority: 0.3 }),
    ),
    ...features.map((f) => ({ url: `https://selfi.dk/funktioner/${f.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
