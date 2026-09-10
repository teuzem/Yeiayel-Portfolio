"use client";

import { ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createServicePayment } from "@/app/actions/create-service-payment";
import { useOptionalAuth } from "@/components/AuthProvider";
import { useGeo } from "@/components/GeoProvider";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { PaymentProvider } from "@/lib/payments/types";
import { type buildPriceBreakdown, formatCurrency } from "@/lib/pricing";

interface RequestPaymentFormProps {
  serviceTitle: string;
  serviceSlug: string;
  serviceDescription: string;
  breakdown: ReturnType<typeof buildPriceBreakdown>;
  deliverables: string[];
  workflow: string[];
  pricingDescription: string;
  timeline: string;
  priceType: "hourly" | "project" | "monthly" | "custom";
  enabledProviders: PaymentProvider[];
  locale: Locale;
}

const PROVIDERS: PaymentProvider[] = [
  "giselpay",
  "kpay",
  "cryptomus",
  "coinbase",
];

export function RequestPaymentForm({
  serviceTitle,
  serviceSlug,
  serviceDescription,
  breakdown,
  deliverables,
  workflow,
  pricingDescription,
  timeline,
  priceType,
  enabledProviders,
  locale,
}: RequestPaymentFormProps) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const { isLocal } = useGeo();
  const { user } = useOptionalAuth();
  const [isPending, startTransition] = useTransition();
  const [provider, setProvider] = useState<PaymentProvider>(
    enabledProviders[0] || "kpay",
  );
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setCustomerName((current) => current || user.fullName || "");
    setCustomerEmail((current) => current || user.primaryEmail || "");
  }, [user]);

  const price = breakdown
    ? isLocal
      ? breakdown.local
      : breakdown.international
    : 0;
  const currency = breakdown
    ? isLocal
      ? breakdown.localCurrency
      : breakdown.internationalCurrency
    : "USD";
  // Must be one of supported payment currencies
  const paymentCurrency =
    currency === "XAF" || currency === "EUR" || currency === "USDT"
      ? currency
      : currency === "USD"
        ? "USD"
        : null;
  const isQuote =
    priceType === "custom" ||
    !breakdown ||
    !paymentCurrency ||
    enabledProviders.length === 0;

  const providerLabel = (p: PaymentProvider) => {
    const base: Record<PaymentProvider, string> = {
      giselpay: dict.payment.giselpay,
      kpay: dict.payment.kpay,
      cryptomus: dict.payment.cryptomus,
      coinbase: dict.payment.coinbase,
    };
    return base[p];
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isQuote && price <= 0) {
      setError(dict.payment.payError);
      return;
    }

    startTransition(async () => {
      const result = await createServicePayment({
        provider,
        amount: price,
        currency: paymentCurrency || "USD",
        serviceTitle,
        serviceSlug,
        customerName: customerName || undefined,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined,
        projectDescription: projectDescription || undefined,
        isLocal,
        priceType,
        locale,
        skipPayment: isQuote && priceType !== "custom",
      });

      if (result.success && result.checkoutUrl) {
        router.push(result.checkoutUrl);
      } else {
        setError(result.error || dict.payment.payError);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Order summary */}
      <div className="bg-card border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">{dict.payment.orderSummary}</h2>

        <div>
          <h3 className="text-lg font-bold">{serviceTitle}</h3>
          {serviceDescription && (
            <p className="text-muted-foreground text-sm mt-1">
              {serviceDescription}
            </p>
          )}
          {timeline && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              {timeline}
            </p>
          )}
        </div>

        {breakdown && pricingDescription && (
          <div className="pt-2 text-sm text-muted-foreground">
            {pricingDescription}
          </div>
        )}

        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-center">
            <span className="text-sm">{dict.payment.total}</span>
            <span className="text-2xl font-bold text-primary">
              {breakdown && price > 0
                ? formatCurrency(price, currency, priceType, locale)
                : dict.services.customQuote}
            </span>
          </div>
          {breakdown && (
            <p className="text-xs text-muted-foreground mt-1">
              {isLocal ? dict.pricing.local : dict.pricing.international}
            </p>
          )}
        </div>

        {deliverables.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{dict.workflow.deliverables}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {deliverables.map((d, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable content list
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {workflow.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">{dict.workflow.steps}</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {workflow.map((s, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered steps
                <li key={i} className="flex items-start gap-2">
                  <span className="font-medium text-primary">{i + 1}.</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Payment form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card border rounded-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {isQuote ? dict.services.customQuote : dict.payment.selectMethod}
        </h2>

        <div>
          <label htmlFor="rf-name" className="block text-sm font-medium mb-2">
            {dict.workflow.yourName}
          </label>
          <input
            id="rf-name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            required
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="rf-email"
              className="block text-sm font-medium mb-2"
            >
              {dict.workflow.yourEmail}
            </label>
            <input
              id="rf-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              required
              disabled={isPending}
            />
          </div>
          <div>
            <label
              htmlFor="rf-phone"
              className="block text-sm font-medium mb-2"
            >
              {dict.contact.phone}
            </label>
            <input
              id="rf-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <label htmlFor="rf-desc" className="block text-sm font-medium mb-2">
            {dict.workflow.projectDescription}
          </label>
          <textarea
            id="rf-desc"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
            disabled={isPending}
          />
        </div>

        <div>
          {!isQuote && (
            <>
              <h2 className="text-lg font-semibold mb-2">
                {dict.payment.selectMethod}
              </h2>
              <div className="space-y-2">
                {PROVIDERS.filter((p) => enabledProviders.includes(p)).map(
                  (p) => (
                    <label
                      key={p}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        provider === p
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name="provider"
                        value={p}
                        checked={provider === p}
                        onChange={() => setProvider(p)}
                        disabled={isPending}
                        className="accent-primary"
                      />
                      <span className="text-sm">{providerLabel(p)}</span>
                    </label>
                  ),
                )}
              </div>
            </>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? dict.payment.processing
            : isQuote
              ? dict.workflow.submitQuote
              : dict.workflow.submitRequest}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          {dict.payment.secure}
        </p>
      </form>
    </div>
  );
}
