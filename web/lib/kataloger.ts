import { MongoClient } from "mongodb";

// Catalogues live in MongoDB so a new one goes online without a deploy.
// MONGODB_URI is set in Vercel's environment variables. Without it every catalogue URL shows the 404 page.
// One document per catalogue in the collection `kataloger` (database MONGODB_DB, default "selfi"):
//   { slug, title, description?, html, css?, noindex?, published?, expiresAt?, updatedAt }
// `html` is the catalogue's pages, `css` its own styles on top of components/katalog/katalog.css.

export type Katalog = {
  slug: string;
  title: string;
  description?: string;
  html: string;
  css?: string;
  noindex?: boolean;
  published?: boolean;
  expiresAt?: Date | null;
  updatedAt?: Date;
};

export const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;

// One client per server instance, kept across hot reloads in dev.
const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };

function client(uri: string) {
  g._mongo ??= new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }).connect().catch((e) => {
    g._mongo = undefined;
    throw e;
  });
  return g._mongo;
}

export async function getKatalog(slug: string): Promise<Katalog | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri || !SLUG.test(slug)) return null;
  try {
    const db = (await client(uri)).db(process.env.MONGODB_DB || "selfi");
    const k = await db.collection<Katalog>("kataloger").findOne({ slug }, { projection: { _id: 0 } });
    if (!k || k.published === false) return null;
    if (k.expiresAt && new Date(k.expiresAt) < new Date()) return null;
    return k;
  } catch (e) {
    console.error("Kataloget kunne ikke hentes", slug, e);
    return null;
  }
}
