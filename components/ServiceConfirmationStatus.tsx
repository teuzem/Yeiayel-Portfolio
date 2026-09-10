"use client";

import { AlertTriangle, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type Status =
  | "received"
  | "quote-requested"
  | "payment-pending"
  | "paid"
  | "payment-failed"
  | "cancelled";

export function ServiceConfirmationStatus({
  orderId,
  initialStatus,
  quote,
  messages,
}: {
  orderId: string;
  initialStatus: Status;
  quote: boolean;
  messages: {
    success: string;
    failed: string;
    pending: string;
    quote: string;
  };
}) {
  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    if (
      !orderId ||
      quote ||
      ["paid", "payment-failed", "cancelled"].includes(status)
    ) {
      return;
    }
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      const response = await fetch(
        `/api/service-requests/${encodeURIComponent(orderId)}`,
        { cache: "no-store" },
      ).catch(() => null);
      if (response?.ok) {
        const result = (await response.json()) as { status?: Status };
        if (result.status) setStatus(result.status);
      }
      if (attempts >= 24) clearInterval(timer);
    };
    const timer = window.setInterval(poll, 5_000);
    void poll();
    return () => clearInterval(timer);
  }, [orderId, quote, status]);

  const failed = status === "payment-failed" || status === "cancelled";
  const success = status === "paid";
  const Icon = success ? Check : failed ? AlertTriangle : Clock;
  const message = quote
    ? messages.quote
    : success
      ? messages.success
      : failed
        ? messages.failed
        : messages.pending;

  return (
    <>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Icon
          className={`h-10 w-10 ${
            success
              ? "text-emerald-500"
              : failed
                ? "text-red-500"
                : "text-muted-foreground"
          }`}
        />
      </div>
      <p className="mb-4 text-base text-muted-foreground" aria-live="polite">
        {message}
      </p>
    </>
  );
}
