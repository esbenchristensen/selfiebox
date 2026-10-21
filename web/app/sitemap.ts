import type { MetadataRoute } from "next";
import { features } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.selfi.dk/", changeFrequency: "monthly", priority: 1 },
    { url: "https://www.selfi.dk/funktioner", changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.selfi.dk/erhverv", changeFrequency: "monthly", priority: 0.9 },
    ...["/dokumentation", "/dokumentation/overensstemmelseserklaering", "/dokumentation/brugsanvisning", "/gaester", "/brugsvilkaar", "/databehandleraftale", "/vilkaar", "/lejebetingelser", "/privatliv", "/cookies"].map(
      (p) => ({ url: `https://www.selfi.dk${p}`, changeFrequency: "yearly" as const, priority: 0.3 }),
    ),
    ...features.map((f) => ({ url: `https://www.selfi.dk/funktioner/${f.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
