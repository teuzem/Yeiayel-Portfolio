/**
 * Countries considered "local" (African market) for local pricing.
 */
export const AFRICAN_COUNTRIES = [
  "CM", // Cameroon
  "BJ", // Benin
  "CI", // Côte d'Ivoire
  "CD", // DR Congo
  "CG", // Congo
  "GA", // Gabon
  "KE", // Kenya
  "RW", // Rwanda
  "SN", // Senegal
  "SL", // Sierra Leone
  "UG", // Uganda
  "ZM", // Zambia
  "NG", // Nigeria
  "GH", // Ghana
  "TG", // Togo
  "ML", // Mali
  "TD", // Chad
  "CF", // Central African Republic
  "GQ", // Equatorial Guinea
  "BF", // Burkina Faso
  "NE", // Niger
  "GM", // Gambia
  "LR", // Liberia
  "GW", // Guinea-Bissau
  "GN", // Guinea
  "MR", // Mauritania
  "DJ", // Djibouti
  "SO", // Somalia
  "ET", // Ethiopia
  "MZ", // Mozambique
  "AO", // Angola
  "MG", // Madagascar
  "TZ", // Tanzania
  "ZW", // Zimbabwe
  "MW", // Malawi
  "BW", // Botswana
  "NA", // Namibia
  "ZA", // South Africa
  "MA", // Morocco
  "DZ", // Algeria
  "TN", // Tunisia
  "EG", // Egypt
  "LY", // Libya
  "SD", // Sudan
];

export interface PriceBreakdown {
  local: number;
  localCurrency: string;
  international: number;
  internationalCurrency: string;
  priceType: "hourly" | "project" | "monthly" | "custom";
}

/**
 * Build a price breakdown from Sanity pricing fields.
 * Local (African market) is typically ~30-45% of international.
 */
export function buildPriceBreakdown(input: {
  internationalPrice?: number;
  localPrice?: number;
  internationalCurrency?: string;
  localCurrency?: string;
  localDiscountPercent?: number;
  priceType?: string;
}): PriceBreakdown | null {
  const requestedType = input.priceType ?? "project";
  const priceType: PriceBreakdown["priceType"] = [
    "hourly",
    "project",
    "monthly",
    "custom",
  ].includes(requestedType as PriceBreakdown["priceType"])
    ? (requestedType as PriceBreakdown["priceType"])
    : "project";
  const internationalCurrency = (
    input.internationalCurrency || "USD"
  ).toUpperCase();
  const localCurrency = (input.localCurrency || "XAF").toUpperCase();
  const rawInternational = Number(input.internationalPrice);
  const rawLocal = Number(input.localPrice);
  const discount = Math.min(
    0.95,
    Math.max(0, Number(input.localDiscountPercent ?? 0.5)),
  );
  const international =
    Number.isFinite(rawInternational) && rawInternational > 0
      ? rawInternational
      : 0;
  const explicitLocal =
    Number.isFinite(rawLocal) && rawLocal > 0 ? rawLocal : 0;
  const localPrice =
    explicitLocal > 0
      ? explicitLocal
      : international > 0
        ? Math.round(international * (1 - discount))
        : 0;

  if (international <= 0 && localPrice <= 0) return null;

  const normalizedInternational =
    international > 0
      ? international
      : localCurrency === "XAF" || localCurrency === "XOF"
        ? Math.max(1, Math.round(localPrice / 600))
        : localPrice;

  return {
    local: localPrice,
    localCurrency,
    international: normalizedInternational,
    internationalCurrency,
    priceType,
  };
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  XAF: "FCFA",
  XOF: "FCFA",
  CAD: "C$",
  NGN: "₦",
  GHS: "₵",
  KES: "KSh",
  ZAR: "R",
};

export function formatCurrency(
  amount: number,
  currency: string,
  priceType: "hourly" | "project" | "monthly" | "custom",
  locale = "en",
): string {
  if (priceType === "custom") return "";
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  const num = amount.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", {
    maximumFractionDigits: 0,
  });
  const suffix =
    priceType === "hourly" ? "/h" : priceType === "monthly" ? "/mo" : "";
  return `${symbol}${num}${suffix}`;
}

export function exchangeRateHint(
  international: number,
  internationalCurrency: string,
  local: number,
  localCurrency: string,
): string | null {
  if (!international || !local) return null;
  const rate = international / local;
  if (localCurrency === "XAF" && internationalCurrency === "USD") {
    // ~600 XAF per USD
    return `≈ ${Math.round(rate * 600)} ${localCurrency} ≈ 1 ${internationalCurrency}`;
  }
  return rate > 0
    ? `1 ${internationalCurrency} ≈ ${rate.toFixed(2)} ${localCurrency}`
    : null;
}

export function isAfricanCurrency(currency: string): boolean {
  return ["XAF", "XOF", "NGN", "GHS", "KES", "ZAR", "RWF", "UGX"].includes(
    currency,
  );
}
