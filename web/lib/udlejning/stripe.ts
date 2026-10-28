import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

// Stripe over plain HTTPS, without the SDK: Checkout Sessions to take the payment and the webhook
// signature check. Keys come from Vercel: STRIPE_SECRET_KEY (sk_test_… in the sandbox, sk_live_… later)
// and STRIPE_WEBHOOK_SECRET (whsec_… from the webhook endpoint in Stripe).

const API = "https://api.stripe.com/v1";

function key(): string {
  const k = process.env.STRIPE_SECRET_KEY;
  if (!k) throw new Error("STRIPE_SECRET_KEY mangler");
  return k;
}

/** Stripe's form encoding: nested objects and arrays become a[b][0][c]=… */
function form(data: Record<string, unknown>, prefix = "", out = new URLSearchParams()): URLSearchParams {
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    const name = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((item, i) => (typeof item === "object" ? form(item as Record<string, unknown>, `${name}[${i}]`, out) : out.append(`${name}[${i}]`, String(item))));
    else if (typeof v === "object") form(v as Record<string, unknown>, name, out);
    else out.append(name, String(v));
  }
  return out;
}

export async function stripe<T>(method: "GET" | "POST", path: string, data?: Record<string, unknown>, idempotencyKey?: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key()}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: data ? form(data).toString() : undefined,
    cache: "no-store",
  });
  const body = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${body.error?.message ?? "ukendt fejl"}`);
  return body;
}

export type CheckoutSession = {
  id: string;
  url: string | null;
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  payment_intent: string | null;
  amount_total: number | null;
  client_reference_id: string | null;
  metadata: Record<string, string>;
};

/**
 * Checks the Stripe-Signature header against the raw body (HMAC-SHA256 of "t.body" with the webhook
 * secret) and returns the event, or null when it is not from Stripe or is older than five minutes.
 */
export function verifyWebhook<T>(raw: string, header: string | null, secret: string, toleranceSec = 300): T | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.split("=") as [string, string]);
  const t = Number(parts.find(([k]) => k === "t")?.[1]);
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || sigs.length === 0) return null;
  if (Math.abs(Date.now() / 1000 - t) > toleranceSec) return null;
  const expected = createHmac("sha256", secret).update(`${t}.${raw}`).digest();
  const ok = sigs.some((s) => {
    const got = Buffer.from(s, "hex");
    return got.length === expected.length && timingSafeEqual(got, expected);
  });
  if (!ok) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
