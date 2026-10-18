import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { Outfit } from "next/font/google";
import { Viewer } from "@/components/katalog/Viewer";
import { getKatalog } from "@/lib/kataloger";
import "@/components/katalog/katalog.css";

// selfi.dk/kataloger/<slug>: a sales catalogue read from MongoDB on every visit, so a new or changed
// catalogue is live as soon as it is saved with scripts/katalog.mjs. Unknown, hidden or expired ones are a 404.
// Like /events/smukfest, catalogues stay out of search, the sitemap and the menu unless noindex is false.

export const dynamic = "force-dynamic";

const partner = Outfit({ subsets: ["latin", "latin-ext"], weight: ["700", "800"], variable: "--font-partner" });

const load = cache(getKatalog);

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const k = await load(slug);
  if (!k) return { title: "Kataloget findes ikke", robots: { index: false, follow: false } };
  return {
    title: k.title,
    description: k.description,
    alternates: { canonical: `/kataloger/${k.slug}` },
    robots: k.noindex === false ? undefined : { index: false, follow: false },
  };
}

export default async function Katalog({ params }: Props) {
  const { slug } = await params;
  const k = await load(slug);
  if (!k) notFound();
  return (
    <div className={`kat ${partner.variable}`}>
      {k.css ? <style dangerouslySetInnerHTML={{ __html: k.css }} /> : null}
      <Viewer>
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: k.html }} />
      </Viewer>
    </div>
  );
}
