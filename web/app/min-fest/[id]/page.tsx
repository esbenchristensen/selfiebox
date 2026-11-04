import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { formatRange } from "@/lib/dates";
import { returnBy, shipDay, trackingUrl } from "@/lib/mail/templates";
import { DELIVERIES, kr, PHOTO_TYPES } from "@/lib/udlejning/core";
import { db, getSettings, type RentalDoc, type RentalStatus } from "@/lib/udlejning/db";
import "../../lej/lej.css";
import "../min-fest.css";

// Kundens side for én booking: status, sporing, opsætning, fotoportal, retur og kvittering. Linket kommer fra
// mails og fra /min-fest; tokenet (?t=) er det samme som i opsætningslinket.

export const metadata: Metadata = { title: "Min fest | Selfi", robots: { index: false, follow: false } };

type Doc = RentalDoc & { trackingOut?: string; trackingBack?: string; party?: { slug?: string; headline?: string } | null };

const PORTAL = (process.env.SELFI_PORTAL_URL || "https://foto.selfi.dk").replace(/\/$/, "");
const SETUP_URL = process.env.SELFI_SETUP_URL ?? `${PORTAL}/opsaet`;
const ORDER: RentalStatus[] = ["paid", "packed", "shipped", "delivered", "returned", "done"];
const DAYS = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
const MONTHS = ["januar", "februar", "marts", "april", "maj", "juni", "juli", "august", "september", "oktober", "november", "december"];
const day = (k: string) => {
  const t = new Date(`${k}T12:00:00Z`);
  return `${DAYS[t.getUTCDay()]} d. ${t.getUTCDate()}. ${MONTHS[t.getUTCMonth()]}`;
};

export default async function Booking({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ t?: string }> }) {
  await connection();
  const [{ id }, { t }] = await Promise.all([params, searchParams]);
  if (!t || t.length < 16) notFound();
  const d = await db();
  const b = await d.collection<Doc>("rentals").findOne({ _id: decodeURIComponent(id), token: t });
  if (!b) notFound();
  const settings = await getSettings(d);
  const name = b.contact.name.trim().split(/\s+/)[0] ?? "";
  const setup = `${SETUP_URL}/${encodeURIComponent(b._id)}?t=${encodeURIComponent(t)}`;
  const portal = b.party?.slug ? `${PORTAL}/f/${b.party.slug}` : null;
  const back = returnBy(b.to);
  const ship = shipDay(b, settings.rules.shipDaysBefore);
  const at = ORDER.indexOf(b.status);
  const stopped = b.status === "cancelled" || b.status === "refunded" || b.status === "expired";
  const unpaid = b.status === "pending";

  const steps: { s: RentalStatus; title: string; text: string }[] = [
    { s: "paid", title: "Booket og betalt", text: formatRange({ from: b.from, to: b.to }) },
    { s: "packed", title: "Pakket", text: "Vi har tjekket og pakket boksen." },
    { s: "shipped", title: `Sendt ${day(ship)}`, text: b.address ? `Til dao-pakkeshoppen nærmest ${b.address.street}, ${b.address.zip} ${b.address.city}.` : "Til jeres nærmeste dao-pakkeshop." },
    { s: "delivered", title: "Hentet og klar til fest", text: "Sæt strøm til, så snart I har hentet den, og se, at den starter." },
    { s: "returned", title: `Retur senest ${day(back)}`, text: "Pak boksen i kassen, sæt returlabelen på, og aflever den i en dao-pakkeshop." },
    { s: "done", title: "Modtaget og tjekket", text: "Bookingen er afsluttet." },
  ];
  const state = (i: number) => (at < 0 ? "todo" : i < at ? "done" : i === at ? (i === ORDER.length - 1 ? "done" : "now") : "todo");

  return (
    <>
      <Nav links={[]} cta={{ label: "Til forsiden", href: "/" }} mega={false} />
      <main>
        <section className="section">
          <div className="wrap mf">
            <span className="label">Min fest · {b._id}</span>
            <h1 className="h-l">{stopped ? "Bookingen er ikke aktiv." : unpaid ? "Betalingen mangler." : `Hej ${name}. Her er jeres fest.`}</h1>
            {stopped && (
              <p className="lede">
                {b.status === "expired"
                  ? "Betalingen blev ikke gennemført, så datoerne er ikke reserveret."
                  : "Bookingen er annulleret. Er der penge tilbage til jer, kommer de på det kort, I betalte med."}{" "}
                <a href="#chat">Skriv til os</a>, hvis noget ser forkert ud.
              </p>
            )}
            {unpaid && <p className="lede">Bookingen er ikke betalt endnu. Datoerne er kun holdt i kort tid. <a href="/#book">Book igen</a>, hvis betalingssiden er lukket.</p>}
            {b.conflict && (
              <p className="lede">Betalingen kom igennem, efter at datoerne var givet videre. Vi skriver til jer med en anden boks eller dato, eller I får pengene tilbage.</p>
            )}

            {!stopped && !unpaid && (
              <>
                <ol className="mf-steps" aria-label="Status">
                  {steps.map((x, i) => (
                    <li key={x.s} data-s={state(i)} aria-current={state(i) === "now" ? "step" : undefined}>
                      <span>
                        {x.title}
                        <small>{x.text}</small>
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="mf-cards">
                  <div className="mf-card">
                    <b>Opsætning</b>
                    <p>{b.party?.slug ? "Boksen er sat op. I kan rette overskrift, stemning og tekster helt frem til festen." : "Sæt boksen op: overskrift, stemning og tekster til aftenen. Det tager 5 minutter."}</p>
                    <a className="btn btn-primary" href={setup}>{b.party?.slug ? "Ret opsætningen" : "Sæt boksen op"}</a>
                  </div>
                  <div className="mf-card">
                    <b>Fotoportal</b>
                    {portal ? (
                      <>
                        <p>Alle billeder fra boksen samles her. Del linket med gæsterne. Som vært kan I skjule billeder for gæsterne.</p>
                        <a className="btn btn-primary" href={`${portal}?t=${encodeURIComponent(t)}`}>Åbn som vært</a>
                        <p>Link til gæsterne: <a href={portal}>{portal.replace(/^https?:\/\//, "")}</a></p>
                      </>
                    ) : (
                      <p>Portalen bliver lavet, når I sætter boksen op. Så står linket her.</p>
                    )}
                    <p>Billederne gemmes i {b.keep ? "12" : "3"} måneder efter festen.</p>
                  </div>
                  <div className="mf-card">
                    <b>Pakken</b>
                    {b.trackingOut ? (
                      <>
                        <p>Følg boksen hos dao. I får også besked fra dao, når den kan hentes.</p>
                        <a className="btn" href={trackingUrl(b.trackingOut)}>Følg pakken</a>
                      </>
                    ) : (
                      <p>Vi sender boksen {day(ship)}. Så kommer sporingen her og på mail.</p>
                    )}
                    <p>Retur senest {day(back)}. Returlabelen ligger i kassen, og fragten er betalt.</p>
                  </div>
                  <div className="mf-card">
                    <b>Brug for hjælp?</b>
                    <p>Skriv i chatten, så svarer vi med det samme. Skriv bookingnummeret {b._id}, hvis I bliver spurgt.</p>
                    <a className="btn" href="#chat">Åbn chatten</a>
                  </div>
                </div>
              </>
            )}

            {(b.charges ?? []).filter((c) => c.status === "open").map((c) => (
              <div className="mf-card" key={c.id}>
                <b>Betaling: {kr(c.amount)}</b>
                <p>{c.reason}. Er I uenige, så skriv til os, før I betaler.</p>
                <a className="btn btn-primary" href={c.url}>Betal {kr(c.amount)}</a>
              </div>
            ))}

            <div className="bk-sum">
              <span className="label">Kvittering</span>
              <div className="bk-sum-lines">
                {b.lines.map((l) => (
                  <div key={l.id}>
                    <span>{l.label}</span>
                    <span>{kr(l.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="bk-sum-total">
                <span>I alt inkl. moms</span>
                <b>{kr(b.total)}</b>
              </div>
              <p className="fine">
                {DELIVERIES[b.delivery].name} · {PHOTO_TYPES[b.photoType].name}
                {b.stripe.refunded ? ` · Refunderet ${kr(b.stripe.refunded)}` : ""}
                {(b.charges ?? []).filter((c) => c.status === "paid").map((c) => ` · ${c.reason}: ${kr(c.amount)} betalt`).join("")}
              </p>
              <p className="fine">
                Lejebetingelserne står på <a href="/lejebetingelser">selfi.dk/lejebetingelser</a>. Gem denne side: linket virker kun for jer.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
