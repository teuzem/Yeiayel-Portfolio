// Central payment configuration. All providers are configured through
// environment variables. Providers without keys fall back to a hosted
// payment-link mode (redirect to the provider's own checkout when available)
// so the workflow always functions.

export const PAYMENT_CONFIG = {
  giselpay: {
    label: "GiselPay",
    enabled: Boolean(process.env.GISELPAY_API_KEY),
    key: process.env.GISELPAY_API_KEY ?? "",
    endpoint:
      process.env.GISELPAY_API_ENDPOINT ??
      "https://api.giselpay.com/api/v1/payments",
    checkoutBase:
      process.env.GISELPAY_CHECKOUT_URL ?? "https://pay.giselpay.com",
  },
  kpay: {
    label: "K-PAY",
    enabled: Boolean(process.env.KPAY_API_KEY),
    key: process.env.KPAY_API_KEY ?? "",
    endpoint:
      process.env.KPAY_API_ENDPOINT ?? "https://api.k-pay.app/v1/payments",
    checkoutBase: "https://pay.k-pay.app",
  },
  cryptomus: {
    label: "CryptoMus",
    enabled: Boolean(process.env.CRYPTOMUS_API_KEY),
    key: process.env.CRYPTOMUS_API_KEY ?? "",
    merchantId: process.env.CRYPTOMUS_MERCHANT_ID ?? "",
    endpoint:
      process.env.CRYPTOMUS_API_ENDPOINT ??
      "https://api.cryptomus.com/v1/payment",
  },
  coinbase: {
    label: "Coinbase Commerce",
    enabled: Boolean(process.env.COINBASE_COMMERCE_API_KEY),
    key: process.env.COINBASE_COMMERCE_API_KEY ?? "",
    endpoint:
      process.env.COINBASE_COMMERCE_API_ENDPOINT ??
      "https://api.commerce.coinbase.com/charges",
  },
} as const;

export function getEnabledProviders(): Array<{
  id: keyof typeof PAYMENT_CONFIG;
  label: string;
  enabled: boolean;
}> {
  return (
    Object.entries(PAYMENT_CONFIG) as Array<
      [
        keyof typeof PAYMENT_CONFIG,
        (typeof PAYMENT_CONFIG)[keyof typeof PAYMENT_CONFIG],
      ]
    >
  ).map(([id, cfg]) => ({ id, label: cfg.label, enabled: cfg.enabled }));
}

export function isProviderEnabled(id: keyof typeof PAYMENT_CONFIG): boolean {
  return Boolean(PAYMENT_CONFIG[id]?.enabled);
}
