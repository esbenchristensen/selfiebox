// Puts catalogues in MongoDB, where /kataloger/<slug> reads them. No deploy needed.
//
//   node scripts/katalog.mjs gem <slug> <sider.html> --titel "Selfi × Smukfest" [--css ekstra.css]
//        [--beskrivelse "..."] [--udloeber 2027-09-01] [--skjul] [--index]
//   node scripts/katalog.mjs liste
//   node scripts/katalog.mjs skjul <slug>     (404 indtil det gemmes igen)
//   node scripts/katalog.mjs slet <slug>
//
// Reads MONGODB_URI (and optionally MONGODB_DB) from the environment or from web/.env.local.
// The HTML is the catalogue's pages: <div class="kat-slot"><section class="kat-pg">…</section></div> per page,
// styled by components/katalog/katalog.css plus the file given with --css.

import { readFileSync, existsSync } from "node:fs";
import { MongoClient } from "mongodb";

const envFile = new URL("../.env.local", import.meta.url);
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const [cmd, slug, file, ...rest] = process.argv.slice(2);
const flag = (name) => {
  const all = [file, ...rest];
  const i = all.indexOf(`--${name}`);
  return i === -1 ? undefined : all[i + 1] ?? true;
};
const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;
if (!["gem", "liste", "skjul", "slet"].includes(cmd)) die("Brug: gem | liste | skjul | slet (se toppen af scripts/katalog.mjs)");
if (cmd !== "liste" && !SLUG.test(slug ?? "")) die("Slug skal være små bogstaver, tal og bindestreg, fx smukfest-2027");
if (!process.env.MONGODB_URI) die("MONGODB_URI mangler. Sæt den i miljøet eller i web/.env.local");

const client = await new MongoClient(process.env.MONGODB_URI).connect();
const col = client.db(process.env.MONGODB_DB || "selfi").collection("kataloger");
// A plain slug_1 index (e.g. made by hand in Atlas) blocks the unique one, so it is swapped out.
await col.createIndex({ slug: 1 }, { unique: true }).catch(async (e) => {
  if (e.code !== 85 && e.code !== 86) throw e;
  await col.dropIndex("slug_1");
  await col.createIndex({ slug: 1 }, { unique: true });
});
const site = process.env.SITE_URL || "https://selfi.dk";

try {
  if (cmd === "gem") {
    if (!file || file.startsWith("--") || !existsSync(file)) die("Angiv HTML-filen med siderne");
    const title = flag("titel");
    if (typeof title !== "string") die("Angiv --titel");
    const css = flag("css");
    const expires = flag("udloeber");
    const doc = {
      slug,
      title,
      description: typeof flag("beskrivelse") === "string" ? flag("beskrivelse") : undefined,
      html: readFileSync(file, "utf8"),
      css: typeof css === "string" ? readFileSync(css, "utf8") : undefined,
      noindex: !flag("index"),
      published: !flag("skjul"),
      expiresAt: typeof expires === "string" ? new Date(expires) : null,
      updatedAt: new Date(),
    };
    if (doc.expiresAt && isNaN(doc.expiresAt)) die("--udloeber skal være en dato, fx 2027-09-01");
    for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k];
    await col.updateOne({ slug }, { $set: doc, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
    console.log(`Gemt. ${doc.published ? "Online" : "Skjult"} på ${site}/kataloger/${slug}`);
  } else if (cmd === "liste") {
    const all = await col.find({}, { projection: { _id: 0, slug: 1, title: 1, published: 1, expiresAt: 1, updatedAt: 1 } }).sort({ updatedAt: -1 }).toArray();
    if (!all.length) console.log("Ingen kataloger endnu");
    for (const k of all) {
      const state = k.published === false ? "skjult" : k.expiresAt && k.expiresAt < new Date() ? "udløbet" : "online";
      console.log(`${k.slug.padEnd(28)} ${state.padEnd(8)} ${k.title}  (${site}/kataloger/${k.slug})`);
    }
  } else if (cmd === "skjul") {
    const r = await col.updateOne({ slug }, { $set: { published: false, updatedAt: new Date() } });
    console.log(r.matchedCount ? `Skjult: ${slug}` : `Fandt ikke ${slug}`);
  } else if (cmd === "slet") {
    const r = await col.deleteOne({ slug });
    console.log(r.deletedCount ? `Slettet: ${slug}` : `Fandt ikke ${slug}`);
  }
} finally {
  await client.close();
}
