import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Payment webhooks from GiselPay / K-PAY / CryptoMus / Coinbase Commerce.
 * Acknowledges receipt and appends to a lightweight ledger. In production,
 * verify signatures before trusting payloads (see payment docs).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const headers: Record<string, string> = {};
    for (const [k, v] of req.headers.entries()) {
      headers[k] = v;
    }

    // Detect provider from well-known signature headers
    let provider = "unknown";
    if (headers["x-cc-webhook-signature"]) provider = "coinbase";
    else if (headers["cryptomus-sign"]) provider = "cryptomus";
    else if (headers["x-kpay-signature"] || headers["x-signature"])
      provider = "kpay";
    else if (headers["x-giselpay-signature"]) provider = "giselpay";

    console.log("Payment webhook received", { provider, body });

    const { serverClient } = await import("@/sanity/lib/serverClient");
    try {
      await serverClient.create({
        _type: "paymentWebhook",
        provider,
        payload: body,
        receivedAt: new Date().toISOString(),
      });
    } catch {
      /* webhook ledger is optional — do not fail request */
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook error", e);
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
