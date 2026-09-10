import { NextResponse } from "next/server";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";

const ORDER_QUERY = `*[_type == "serviceRequest" && orderId == $order][0]{
  orderId,
  status,
  serviceTitle,
  amount,
  currency,
  provider,
  updatedAt
}`;

export async function GET(
  _request: Request,
  context: { params: Promise<{ order: string }> },
) {
  const { order } = await context.params;
  if (!/^order-[a-zA-Z0-9-]{8,80}$/.test(order)) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  if (!isSanityConfigured) {
    return NextResponse.json({ orderId: order, status: "payment-pending" });
  }

  const data = await client
    .fetch(ORDER_QUERY, { order }, { cache: "no-store" })
    .catch(() => null);
  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
