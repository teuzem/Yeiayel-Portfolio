"use server";

import { isProviderEnabled } from "@/lib/payments/config";
import { createPayment } from "@/lib/payments/server";
import type { PaymentRequest, PaymentResult } from "@/lib/payments/types";
import { buildPriceBreakdown } from "@/lib/pricing";
import { isSanityConfigured } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { serverClient } from "@/sanity/lib/serverClient";
import { isSanityWriteConfigured } from "@/sanity/lib/serverEnv";

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const SERVICE_PAYMENT_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  title,
  titleFr,
  pricing,
  internationalPrice,
  internationalCurrency,
  localPrice,
  localCurrency,
  localDiscountPercent
}`;

function safeText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function requestDocumentId(orderId: string): string {
  return `serviceRequest-${orderId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

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
  priceType?: "hourly" | "project" | "monthly" | "custom";
  locale?: "en" | "fr";
  skipPayment?: boolean;
}): Promise<PaymentResult> {
  try {
    let serviceTitle = safeText(input.serviceTitle, 180);
    const serviceSlug = safeText(input.serviceSlug, 120);
    const customerName = safeText(input.customerName, 160);
    const customerEmail = safeText(input.customerEmail, 320).toLowerCase();
    const customerPhone = safeText(input.customerPhone, 80);
    const projectDescription = safeText(input.projectDescription, 4_000);
    let priceType = input.priceType ?? "project";
    const orderId = `order-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const locale = input.locale === "fr" ? "fr" : "en";
    let amount = Number(input.amount);
    let currency = input.currency;

    if (isSanityConfigured && serviceSlug) {
      const service = await client.fetch(
        SERVICE_PAYMENT_QUERY,
        { slug: serviceSlug },
        { cache: "no-store" },
      );
      if (!service) {
        return {
          success: false,
          provider: input.provider,
          error: "The selected service is no longer available.",
        };
      }
      serviceTitle =
        locale === "fr" ? service.titleFr || service.title : service.title;
      priceType = service.pricing?.priceType ?? "project";
      const breakdown = buildPriceBreakdown({
        internationalPrice: service.internationalPrice,
        internationalCurrency: service.internationalCurrency,
        localPrice: service.localPrice,
        localCurrency: service.localCurrency,
        localDiscountPercent: service.localDiscountPercent,
        priceType,
      });
      if (breakdown) {
        amount = input.isLocal ? breakdown.local : breakdown.international;
        currency = (
          input.isLocal
            ? breakdown.localCurrency
            : breakdown.internationalCurrency
        ) as typeof currency;
      }
    }

    const isQuote =
      priceType === "custom" ||
      input.skipPayment ||
      !["XAF", "USD", "EUR", "USDT"].includes(currency);
    const now = new Date().toISOString();

    if (!serviceTitle) {
      return {
        success: false,
        provider: input.provider,
        error: "A service is required.",
      };
    }
    if (!customerName || !customerEmail || !customerEmail.includes("@")) {
      return {
        success: false,
        provider: input.provider,
        error: "A valid name and email are required.",
      };
    }
    if (!projectDescription) {
      return {
        success: false,
        provider: input.provider,
        error: "A project description is required.",
      };
    }
    if (!isQuote && (!Number.isFinite(amount) || amount <= 0)) {
      return {
        success: false,
        provider: input.provider,
        error: "The selected service has no payable amount configured.",
      };
    }

    if (isSanityWriteConfigured) {
      await serverClient.createIfNotExists({
        _id: requestDocumentId(orderId),
        _type: "serviceRequest",
        orderId,
        serviceTitle,
        serviceSlug,
        customerName,
        customerEmail,
        customerPhone,
        projectDescription,
        amount: isQuote ? undefined : Number(amount.toFixed(2)),
        currency: isQuote ? undefined : currency,
        provider: isQuote ? undefined : input.provider,
        isLocal: input.isLocal,
        locale,
        status: isQuote ? "quote-requested" : "received",
        createdAt: now,
        updatedAt: now,
      });
    }

    if (isQuote) {
      return {
        success: true,
        provider: input.provider,
        orderId,
        requiresQuote: true,
        checkoutUrl: `${APP_URL}/confirmation?order=${encodeURIComponent(orderId)}&status=pending&quote=1&locale=${locale}`,
      };
    }

    if (!isProviderEnabled(input.provider)) {
      return {
        success: false,
        provider: input.provider,
        orderId,
        error:
          "This payment method is not configured. Your request was saved; choose another method or request a quote.",
      };
    }

    const description = `${serviceTitle} - ${projectDescription.slice(0, 120)}`;
    const request: PaymentRequest = {
      provider: input.provider,
      amount: Number(amount.toFixed(2)),
      currency,
      orderId,
      description,
      customerName,
      customerEmail,
      customerPhone,
      returnUrl: `${APP_URL}/confirmation?order=${encodeURIComponent(orderId)}&status=pending&locale=${locale}`,
      cancelUrl: `${APP_URL}/confirmation?order=${encodeURIComponent(orderId)}&status=failed&locale=${locale}`,
      callbackUrl: `${APP_URL}/api/payments/webhook`,
    };
    const result = await createPayment(request);

    if (isSanityWriteConfigured) {
      await serverClient
        .patch(requestDocumentId(orderId))
        .set({
          status: result.success ? "payment-pending" : "payment-failed",
          paymentId: result.paymentId,
          paymentReference: result.reference,
          checkoutUrl: result.checkoutUrl,
          updatedAt: new Date().toISOString(),
        })
        .commit()
        .catch((error) => {
          console.error(
            `Failed to update service request: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        });
    }

    if (result.success && !result.checkoutUrl) {
      return {
        success: false,
        provider: input.provider,
        orderId,
        error: "The payment provider did not return a checkout URL.",
      };
    }
    return { ...result, orderId };
  } catch (error) {
    return {
      success: false,
      provider: input.provider,
      error: error instanceof Error ? error.message : "Payment request failed.",
    };
  }
}
