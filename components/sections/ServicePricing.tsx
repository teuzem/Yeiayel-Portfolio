"use client";

import { useGeo } from "@/components/GeoProvider";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { buildPriceBreakdown, formatCurrency } from "@/lib/pricing";

export interface ServicePricingData {
  pricing?: { priceType?: string; visible?: boolean } | null;
  internationalPrice?: number | null;
  internationalCurrency?: string | null;
  localPrice?: number | null;
  localCurrency?: string | null;
  localDiscountPercent?: number | null;
  pricingDescription?: string | null;
}

/**
 * Client component that resolves the geolocation-based price for a service,
 * so the server never performs a blocking remote geolocation during SSR.
 */
export function ServicePricing({
  service,
  locale = "en",
}: {
  service: ServicePricingData;
  locale?: Locale;
}) {
  const { isLocal } = useGeo();
  if (!service) return null;

  const dict = getDictionary(locale);
  const priceType = service.pricing?.priceType ?? "project";
  const breakdown = buildPriceBreakdown({
    internationalPrice: service.internationalPrice ?? undefined,
    localPrice: service.localPrice ?? undefined,
    internationalCurrency: service.internationalCurrency ?? undefined,
    localCurrency: service.localCurrency ?? undefined,
    localDiscountPercent: service.localDiscountPercent ?? undefined,
    priceType,
  });

  if (priceType === "custom" || !breakdown) {
    return (
      <span className="text-primary font-semibold">
        {dict.services.customQuote}
      </span>
    );
  }

  const price = isLocal ? breakdown.local : breakdown.international;
  const currency = isLocal
    ? breakdown.localCurrency
    : breakdown.internationalCurrency;

  return (
    <div>
      <span className="text-2xl font-bold text-primary">
        {formatCurrency(price, currency, breakdown.priceType, locale)}
      </span>
      {!isLocal && (
        <p className="text-xs text-muted-foreground mt-1">
          {dict.services.localLabel.replace(
            "{price}",
            formatCurrency(
              breakdown.local,
              breakdown.localCurrency,
              breakdown.priceType,
              locale,
            ),
          )}
        </p>
      )}
      {isLocal && (
        <p className="text-xs text-muted-foreground mt-1">
          {dict.services.intlLabel.replace(
            "{price}",
            formatCurrency(
              breakdown.international,
              breakdown.internationalCurrency,
              breakdown.priceType,
              locale,
            ),
          )}
        </p>
      )}
      {service.pricingDescription && (
        <p className="text-sm text-muted-foreground mt-1">
          {service.pricingDescription}
        </p>
      )}
    </div>
  );
}
