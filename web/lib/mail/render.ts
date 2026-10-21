// Selfi's e-mail design: one layout for every mail to customers, built from tables and inline styles so it
// looks the same in Gmail, Outlook, Apple Mail and on phones. Each mail is a list of blocks; the same blocks
// also give the plain-text version that goes with every mail.
//
// Samme fil i selfiebox (web/lib/mail/) og selfiebox-platform (web/src/lib/mail/), så selfi.dk og admin sender
// præcis de samme mails. Hold de to kopier ens.
//
// Brand (Selfi_brandguide.pdf): Nat #0E0F0E, Halo #FFF3E3, Selfi-grøn #22D36B as accent only, Papir #F3F4F1,
// Skov #0B1A10 on green, Blæk #121412 for text on light, Grå mørk #5C615B. Instrument Sans for headings,
// Geist for text and Geist Mono for labels; clients without web fonts fall back to Helvetica/Arial.

export type Company = {
  name: string;
  legalName?: string;
  cvr?: string;
  street?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
  web: string;
};

export type Block =
  | { type: "text"; text: string } // light markup, see markup() below
  | { type: "button"; label: string; href: string; secondary?: boolean }
  | { type: "summary"; label: string; rows: [string, string][]; total?: [string, string] }
  | { type: "steps"; label: string; items: { title: string; text: string }[] }
  | { type: "note"; label?: string; text: string; tone?: "info" | "warn" }
  | { type: "code"; label: string; value: string; href?: string } // a booking or tracking number
  | { type: "divider" };

export type Email = {
  subject: string;
  preheader: string; // the grey line after the subject in the inbox
  label: string; // small mono label above the heading, e.g. "BOOKING SB-271021-K4QX"
  heading: string;
  blocks: Block[];
  reason: string; // why the customer gets this mail, shown in the footer
};

const C = {
  night: "#0E0F0E",
  halo: "#FFF3E3",
  green: "#22D36B",
  forest: "#0B1A10",
  greenText: "#0F7A3B",
  paper: "#F3F4F1",
  card: "#FFFFFF",
  ink: "#121412",
  muted: "#5C615B",
  line: "#E3E5DF",
  warn: "#FFF1E8",
};
const HEAD = "'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif";
const BODY = "Geist,'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'Geist Mono',ui-monospace,Menlo,Consolas,monospace";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const safeHref = (u: string) => (/^(https?:|mailto:|tel:)/i.test(u.trim()) ? u.trim() : "#");

/**
 * The markup admins can use in editable texts: blank line = new paragraph, "- " = bullet, **bold**,
 * [text](https://…) = link. Everything else is escaped, so a template can never inject HTML.
 */
function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600;color:' + C.ink + '">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t: string, u: string) => `<a href="${esc(safeHref(u.replace(/&amp;/g, "&")))}" style="color:${C.greenText};font-weight:600;text-decoration:underline">${t}</a>`)
    .replace(/\n/g, "<br>");
}

function markup(text: string): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((para) => {
      const lines = para.split("\n");
      if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
        const items = lines.map((l) => `<li style="margin:0 0 6px">${inline(l.replace(/^\s*[-•]\s+/, ""))}</li>`).join("");
        return `<ul style="margin:0 0 16px;padding:0 0 0 20px;font:400 16px/1.55 ${BODY};color:${C.ink}">${items}</ul>`;
      }
      return `<p style="margin:0 0 16px;font:400 16px/1.55 ${BODY};color:${C.ink}">${inline(para)}</p>`;
    })
    .join("");
}

function plain(text: string): string {
  return text.trim().replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1 ($2)");
}

const label = (t: string) =>
  `<div style="margin:0 0 10px;font:500 11px/1.4 ${MONO};letter-spacing:.14em;text-transform:uppercase;color:${C.muted}">${esc(t)}</div>`;

function blockHtml(b: Block): string {
  switch (b.type) {
    case "text":
      return markup(b.text);
    case "button": {
      const bg = b.secondary ? C.card : C.green;
      const fg = b.secondary ? C.ink : C.forest;
      const border = b.secondary ? C.ink : C.green;
      const href = esc(safeHref(b.href));
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px"><tr><td align="center" bgcolor="${bg}" style="border-radius:999px;background:${bg}">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="50%" strokecolor="${border}" fillcolor="${bg}"><w:anchorlock/><center style="color:${fg};font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${esc(b.label)}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="${href}" style="display:inline-block;padding:13px 28px;border:2px solid ${border};font:600 16px/1.2 ${HEAD};color:${fg};text-decoration:none;border-radius:999px">${esc(b.label)}</a><!--<![endif]-->
</td></tr></table>`;
    }
    case "summary": {
      const rows = b.rows
        .map(([k, v]) => `<tr><td style="padding:9px 0;border-bottom:1px solid ${C.line};font:400 15px/1.45 ${BODY};color:${C.ink}">${esc(k)}</td><td align="right" style="padding:9px 0 9px 16px;border-bottom:1px solid ${C.line};font:400 15px/1.45 ${BODY};color:${C.ink};white-space:${v.length > 16 ? "normal" : "nowrap"}">${esc(v)}</td></tr>`)
        .join("");
      const total = b.total
        ? `<tr><td style="padding:12px 0 0;font:600 16px/1.4 ${HEAD};color:${C.ink}">${esc(b.total[0])}</td><td align="right" style="padding:12px 0 0 16px;font:600 16px/1.4 ${HEAD};color:${C.ink};white-space:nowrap">${esc(b.total[1])}</td></tr>`
        : "";
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background:${C.paper};border-radius:16px"><tr><td style="padding:20px 22px">${label(b.label)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}${total}</table></td></tr></table>`;
    }
    case "steps": {
      const items = b.items
        .map(
          (s, i) => `<tr><td valign="top" width="40" style="padding:0 0 16px"><div style="width:28px;height:28px;border-radius:14px;background:${C.night};color:${C.halo};font:600 13px/28px ${MONO};text-align:center">${i + 1}</div></td>
<td valign="top" style="padding:3px 0 16px"><div style="font:600 16px/1.35 ${HEAD};color:${C.ink};margin:0 0 3px">${esc(s.title)}</div><div style="font:400 15px/1.5 ${BODY};color:${C.muted}">${inline(s.text)}</div></td></tr>`,
        )
        .join("");
      return `<div style="margin:8px 0 8px">${label(b.label)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px">${items}</table>`;
    }
    case "note": {
      const bg = b.tone === "warn" ? C.warn : C.paper;
      const bar = b.tone === "warn" ? "#E8743B" : C.green;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px"><tr><td width="4" style="background:${bar};border-radius:4px 0 0 4px"></td><td style="background:${bg};padding:16px 20px;border-radius:0 12px 12px 0">${b.label ? label(b.label) : ""}<div style="font:400 15px/1.55 ${BODY};color:${C.ink}">${inline(b.text)}</div></td></tr></table>`;
    }
    case "code": {
      const v = b.href
        ? `<a href="${esc(safeHref(b.href))}" style="color:${C.ink};text-decoration:none">${esc(b.value)}</a>`
        : esc(b.value);
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;border-collapse:separate;border:1px solid ${C.line};border-radius:12px"><tr><td style="padding:14px 18px">${label(b.label)}<div style="font:500 18px/1.3 ${MONO};letter-spacing:.04em;color:${C.ink}">${v}</div></td></tr></table>`;
    }
    case "divider":
      return `<div style="height:1px;background:${C.line};margin:8px 0 24px;line-height:1px;font-size:1px">&nbsp;</div>`;
  }
}

function blockText(b: Block): string {
  switch (b.type) {
    case "text":
      return plain(b.text);
    case "button":
      return `${b.label}: ${b.href}`;
    case "summary":
      return [b.label.toUpperCase(), ...b.rows.map(([k, v]) => `${k}: ${v}`), ...(b.total ? [`${b.total[0]}: ${b.total[1]}`] : [])].join("\n");
    case "steps":
      return [b.label.toUpperCase(), ...b.items.map((s, i) => `${i + 1}. ${s.title}\n   ${plain(s.text)}`)].join("\n");
    case "note":
      return `${b.label ? `${b.label.toUpperCase()}\n` : ""}${plain(b.text)}`;
    case "code":
      return `${b.label}: ${b.value}${b.href ? ` (${b.href})` : ""}`;
    case "divider":
      return "----";
  }
}

function footer(co: Company, reason: string, site: string): { html: string; text: string } {
  const lines = [
    [co.legalName || co.name, co.cvr ? `CVR ${co.cvr}` : ""].filter(Boolean).join(" · "),
    [co.street, co.postcode, co.street || co.postcode ? co.country : ""].filter(Boolean).join(", "),
    [co.phone, co.email].filter(Boolean).join(" · "),
  ].filter(Boolean);
  const link = (path: string, t: string) => `<a href="${site}${path}" style="color:${C.muted};text-decoration:underline">${t}</a>`;
  const html = `<tr><td style="padding:28px 32px 8px;font:400 13px/1.6 ${BODY};color:${C.muted}" class="px">
${lines.map((l) => `<div>${esc(l)}</div>`).join("")}
<div style="margin-top:10px">${link("/lejebetingelser", "Lejebetingelser")} &nbsp;·&nbsp; ${link("/privatliv", "Privatliv")} &nbsp;·&nbsp; <a href="${site}" style="color:${C.muted};text-decoration:underline">${esc(co.web)}</a></div>
<div style="margin-top:12px;font-size:12px;line-height:1.5">${esc(reason)} Vi sender kun mails om jeres booking, aldrig reklame.</div>
</td></tr>`;
  const text = [...lines, `Lejebetingelser: ${site}/lejebetingelser`, `Privatliv: ${site}/privatliv`, "", `${reason} Vi sender kun mails om jeres booking, aldrig reklame.`].join("\n");
  return { html, text };
}

/** The full mail: HTML for the clients that show it and plain text for the rest (and for spam filters). */
export function renderEmail(e: Email, opts: { company: Company; site: string }): { subject: string; html: string; text: string } {
  const site = opts.site.replace(/\/$/, "");
  const f = footer(opts.company, e.reason, site);
  const body = e.blocks.map(blockHtml).join("\n");
  // Invisible padding after the preheader keeps the inbox preview from pulling in the body text.
  const pad = "&#847;&zwnj;&nbsp;".repeat(60);
  const html = `<!doctype html>
<html lang="da" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(e.subject)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600&family=Geist+Mono:wght@500&family=Instrument+Sans:wght@600&display=swap" rel="stylesheet">
<style>
body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table{border-collapse:collapse}img{border:0;outline:none;text-decoration:none}
a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
@media (max-width:620px){.px{padding-left:22px!important;padding-right:22px!important}.h1{font-size:28px!important}.wrap{border-radius:0!important}}
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${esc(e.preheader)}${pad}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}" style="background:${C.paper}">
<tr><td align="center" style="padding:24px 0 32px">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
<tr><td class="wrap" bgcolor="${C.night}" style="background:${C.night};border-radius:24px 24px 0 0;padding:28px 32px 26px" align="left">
<a href="${site}" style="text-decoration:none"><img src="${site}/brand/selfi-logo-email-mork.png" width="110" height="40" alt="Selfi" style="display:block;width:110px;height:40px;color:${C.halo};font:600 26px ${HEAD}"></a>
</td></tr>
<tr><td bgcolor="${C.night}" style="background:${C.night};padding:0 32px 36px" class="px">
<div style="font:500 11px/1.4 ${MONO};letter-spacing:.14em;text-transform:uppercase;color:${C.green};margin:0 0 12px">${esc(e.label)}</div>
<h1 class="h1" style="margin:0;font:600 32px/1.12 ${HEAD};letter-spacing:-0.045em;color:${C.halo}">${esc(e.heading)}</h1>
</td></tr>
<tr><td bgcolor="${C.card}" style="background:${C.card};padding:32px 32px 12px;border-radius:0 0 24px 24px" class="px wrap">
${body}
</td></tr>
${f.html}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
  const text = [e.heading, "", ...e.blocks.map(blockText).flatMap((t) => [t, ""]), "--", f.text].join("\n");
  return { subject: e.subject, html, text };
}
