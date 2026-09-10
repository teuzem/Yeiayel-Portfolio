import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isSanityWriteConfigured } from "@/sanity/lib/serverEnv";

export const dynamic = "force-dynamic";

function secureEqual(actual: string, expected: string): boolean {
  const a = Buffer.from(actual.trim().toLowerCase());
  const b = Buffer.from(expected.trim().toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}

function getProvider(headers: Headers): string {
  if (headers.get("x-cc-webhook-signature")) return "coinbase";
  if (headers.get("sign") || headers.get("cryptomus-sign")) return "cryptomus";
  if (headers.get("x-kpay-signature") || headers.get("x-signature"))
    return "kpay";
  if (headers.get("x-giselpay-signature")) return "giselpay";
  return "unknown";
}

function verifySignature(
  provider: string,
  rawBody: string,
  headers: Headers,
): boolean {
  if (provider === "coinbase") {
    const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET?.trim();
    if (!secret) return false;
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    return secureEqual(headers.get("x-cc-webhook-signature") || "", expected);
  }
  if (provider === "cryptomus") {
    const key = process.env.CRYPTOMUS_API_KEY?.trim();
    if (!key) return false;
    const expected = createHash("md5")
      .update(Buffer.from(rawBody).toString("base64") + key)
      .digest("hex");
    return secureEqual(
      headers.get("sign") || headers.get("cryptomus-sign") || "",
      expected,
    );
  }
  if (provider === "kpay") {
    const secret = process.env.KPAY_WEBHOOK_SECRET?.trim();
    if (!secret) return false;
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    return secureEqual(
      headers.get("x-kpay-signature") || headers.get("x-signature") || "",
      expected,
    );
  }
  if (provider === "giselpay") {
    const secret = process.env.GISELPAY_WEBHOOK_SECRET?.trim();
    if (!secret) return false;
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    return secureEqual(headers.get("x-giselpay-signature") || "", expected);
  }
  return false;
}

function readValue(body: unknown, paths: string[][]): string {
  for (const path of paths) {
    let value: unknown = body;
    for (const key of path) {
      value =
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[key]
          : undefined;
    }
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }
  return "";
}

function normalizeStatus(value: string): string {
  const status = value.toLowerCase();
  if (
    ["paid", "completed", "success", "confirmed", "resolved"].some((item) =>
      status.includes(item),
    )
  ) {
    return "paid";
  }
  if (
    ["failed", "cancel", "expired", "unresolved"].some((item) =>
      status.includes(item),
    )
  ) {
    return status.includes("cancel") ? "cancelled" : "payment-failed";
  }
  return "payment-pending";
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body: unknown = rawBody ? JSON.parse(rawBody) : {};
    const provider = getProvider(req.headers);
    const signatureVerified = verifySignature(provider, rawBody, req.headers);
    const orderId = readValue(body, [
      ["order_id"],
      ["orderId"],
      ["metadata", "order_id"],
      ["event", "data", "metadata", "order_id"],
      ["data", "metadata", "order_id"],
    ]);
    const paymentStatus = normalizeStatus(
      readValue(body, [
        ["status"],
        ["payment_status"],
        ["event", "type"],
        ["data", "status"],
      ]),
    );

    if (isSanityWriteConfigured) {
      const { serverClient } = await import("@/sanity/lib/serverClient");
      await serverClient
        .create({
          _type: "paymentWebhook",
          provider,
          orderId,
          paymentStatus,
          signatureVerified,
          payload: rawBody.slice(0, 50_000),
          receivedAt: new Date().toISOString(),
        })
        .catch(() => undefined);

      if (signatureVerified && orderId) {
        const id = `serviceRequest-${orderId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        await serverClient
          .patch(id)
          .set({ status: paymentStatus, updatedAt: new Date().toISOString() })
          .commit()
          .catch(() => undefined);
      }
    }

    return NextResponse.json({
      ok: true,
      verified: signatureVerified,
      applied: Boolean(signatureVerified && orderId),
    });
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json(
      { ok: false, error: "Invalid webhook payload" },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
