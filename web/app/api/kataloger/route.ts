import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// selfi.dk/api/kataloger: every sales catalogue on the site, for the list on admin.selfi.dk/admin/kataloger.
// A catalogue is a customer page built on components/katalog/Viewer (/erhverv/<slug>, /events/smukfest),
// so a new page shows up in admin with the next deploy, with no list to keep up to date.
// Built once per deploy from the source files; title and description come from the page's metadata.

export const dynamic = "force-static";

const SECTIONS = ["erhverv", "events"];

type Entry = { slug: string; path: string; title: string; description: string | null; updated: string | null };

const field = (src: string, name: string) => src.match(new RegExp(`\\b${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1].replace(/\\(.)/g, "$1") ?? null;

// Last commit that touched the folder. Null where the build has no git history.
function updated(dir: string): string | null {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cI", "--", dir], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || null;
  } catch {
    return null;
  }
}

export function GET() {
  const app = path.join(process.cwd(), "app");
  const list: Entry[] = [];
  for (const section of SECTIONS) {
    for (const slug of readdirSync(path.join(app, section)).sort()) {
      const dir = path.join(app, section, slug);
      const page = path.join(dir, "page.tsx");
      if (!existsSync(page)) continue;
      const src = readFileSync(page, "utf8");
      if (!src.includes("@/components/katalog/Viewer")) continue;
      list.push({ slug, path: `/${section}/${slug}`, title: field(src, "title") ?? slug, description: field(src, "description"), updated: updated(dir) });
    }
  }
  return Response.json(list);
}
