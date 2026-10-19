// Prints the declaration and the instructions from the website (so the PDFs always match selfi.dk),
// and the label SVGs at their exact size. Run with the site on http://localhost:3123:
//   node print_pdfs.cjs <dokumentation-dir> [<web/public/dokumentation-dir>]
const { chromium } = require("playwright");
const fs = require("fs");
const [dir, pub] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.emulateMedia({ colorScheme: "light" });
  const pages = [
    ["dokumentation/overensstemmelseserklaering", "halo-gen2-v8_eu-overensstemmelseserklaering.pdf", "A4"],
    ["dokumentation/brugsanvisning", "halo-gen2-v8_brugsanvisning-og-sikkerhed.pdf", "A5"],
  ];
  for (const [path, file, format] of pages) {
    await p.goto("http://localhost:3123/" + path, { waitUntil: "networkidle" });
    await p.evaluate(() => { document.documentElement.dataset.theme = "light"; });
    await p.pdf({ path: `${dir}/${file}`, format, margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" } });
    if (pub) fs.copyFileSync(`${dir}/${file}`, `${pub}/${file}`);
  }
  for (const [svg, w, h] of [["halo-gen2-v8_typeskilt", "40mm", "70mm"], ["selfi-gdpr-v1_skilt-ved-boksen", "105mm", "148mm"]]) {
    const data = fs.readFileSync(`${dir}/${svg}.svg`, "utf8");
    await p.setContent(`<style>@page{size:${w} ${h};margin:0}body{margin:0}svg{display:block}</style>${data}`);
    await p.pdf({ path: `${dir}/${svg}.pdf`, width: w, height: h, printBackground: true, pageRanges: "1" });
  }
  await b.close();
})();
