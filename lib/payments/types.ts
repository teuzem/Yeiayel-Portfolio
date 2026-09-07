export type PaymentProvider = "giselpay" | "kpay" | "cryptomus" | "coinbase";

export type PaymentCurrency = "XAF" | "USD" | "EUR" | "USDT";

export interface PaymentRequest {
  provider: PaymentProvider;
  amount: number;
  currency: PaymentCurrency;
  orderId: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  returnUrl?: string;
  callbackUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  provider: PaymentProvider;
  checkoutUrl?: string;
  paymentId?: string;
  reference?: string;
  error?: string;
}

export interface ProviderConfig {
  enabled: boolean;
  label: string;
  key: string;
  endpoint: string;
}
