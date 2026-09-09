"use server";

import { isProviderEnabled } from "@/lib/payments/config";
import { createPayment } from "@/lib/payments/server";
import type { PaymentRequest, PaymentResult } from "@/lib/payments/types";
import { serverClient } from "@/sanity/lib/serverClient";
import { isSanityWriteConfigured } from "@/sanity/lib/serverEnv";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Create a payment for a service request via the selected provider.
 * Also stores the request in Sanity for follow-up and deliverables tracking.
 */
export async function createServicePayment(input: {
  provider: PaymentRequest["provider"];
  amount: number;
  currency: "XAF" | "USD" | "EUR" | "USDT";
  serviceTitle: string;
  serviceSlug?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  projectDescription?: string;
  isLocal: boolean;
}): Promise<PaymentResult> {
  try {
    if (!input.serviceTitle.trim()) {
      return {
        success: false,
        provider: input.provider,
        error: "A service is required.",
      };
    }
    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      return {
        success: false,
        provider: input.provider,
        error: "The selected service has no payable amount configured.",
      };
    }
    if (!input.customerName?.trim() || !input.customerEmail?.trim()) {
      return {
        success: false,
        provider: input.provider,
        error: "Name and email are required.",
      };
    }
    if (!isProviderEnabled(input.provider)) {
      return {
        success: false,
        provider: input.provider,
        error:
          "This payment method is not configured yet. Add its server-side API credentials and try again.",
      };
    }

    const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const description = `${input.serviceTitle}${input.projectDescription ? ` — ${input.projectDescription.slice(0, 120)}` : ""}`;

    const request: PaymentRequest = {
      provider: input.provider,
      amount: input.amount,
      currency: input.currency,
      orderId,
      description,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      returnUrl: `${APP_URL}/confirmation?order=${orderId}&status=success`,
      callbackUrl: `${APP_URL}/api/payments/webhook`,
    };

    const result = await createPayment(request);

    if (result.success && isSanityWriteConfigured) {
      // Persist the request (as draft or doc) for tracking
      try {
        await serverClient.create({
          _type: "contact",
          name: input.customerName || "Anonymous",
          email: input.customerEmail || "",
          subject: `Service request: ${input.serviceTitle}`,
          message:
            input.projectDescription || `Request for ${input.serviceTitle}`,
          notes: `orderId=${orderId}; provider=${input.provider}; amount=${input.amount} ${input.currency}; isLocal=${input.isLocal}`,
          status: "new",
        });
      } catch (inner) {
        const message =
          inner instanceof Error ? inner.message : "Unknown persistence error";
        console.error(`Failed to store payment request in Sanity: ${message}`);
      }
    }

    return result;
  } catch (e) {
    return {
      success: false,
      provider: input.provider,
      error: (e as Error).message,
    };
  }
}
