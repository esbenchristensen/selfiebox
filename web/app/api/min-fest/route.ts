import { NextResponse } from "next/server";
import { composeMail, sendMail } from "@/lib/mail/send";
import { db, type RentalDoc } from "@/lib/udlejning/db";
import { mailCompany, mailContext } from "@/lib/udlejning/mails";

// "Min fest": kunden skriver bookingnummer og e-mail, og vi sender linket til bookingens side på mail.
// Svaret er altid det samme, så siden ikke afslører, om et bookingnummer findes. Højst 3 mails pr. booking i timen.

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const OK = { ok: true, message: "Hvis bookingnummeret og e-mailen passer sammen, får I et link på mail om et øjeblik. Tjek også spam." };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = str(body.booking, 40).toUpperCase().replace(/\s+/g, "");
  const email = str(body.email, 200).toLowerCase();
  if (!id || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Skriv bookingnummeret (fx SB-271021-K4QX) og den e-mail, I bookede med." }, { status: 400 });
  }
  try {
    const d = await db();
    const b = await d.collection<RentalDoc>("rentals").findOne({
      _id: id,
      "contact.email": { $regex: `^${esc(email)}$`, $options: "i" },
      status: { $nin: ["expired"] },
    });
    if (!b) return NextResponse.json(OK);
    const recent = await d.collection("rental_mails").countDocuments({ rental: b._id, kind: "min_fest", at: { $gte: new Date(Date.now() - 3600e3) } });
    if (recent >= 3) return NextResponse.json(OK);
    const m = await composeMail(d, "min_fest", await mailContext(d, b), mailCompany);
    await sendMail(d, { rental: b._id, kind: "min_fest", to: b.contact.email, ...m, by: "min-fest" });
    return NextResponse.json(OK);
  } catch (e) {
    console.error("min-fest", e);
    return NextResponse.json({ error: "Vi kunne ikke slå bookingen op lige nu. Prøv igen om lidt, eller skriv til os i chatten." }, { status: 503 });
  }
}
