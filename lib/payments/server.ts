import { createHash } from "node:crypto";
import { PAYMENT_CONFIG } from "./config";
import type { PaymentRequest, PaymentResult, ProviderConfig } from "./types";

async function paymentFetch(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = 15_000,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function providerCfg(id: keyof typeof PAYMENT_CONFIG): ProviderConfig {
  const c = PAYMENT_CONFIG[id];
  return {
    enabled: Boolean(c.enabled),
    label: c.label,
    key: c.key,
    endpoint: c.endpoint,
  };
}

async function kpayPay(req: PaymentRequest): Promise<PaymentResult> {
  const cfg = providerCfg("kpay");
  try {
    const body: Record<string, unknown> = {
      amount: req.amount,
      currency: req.currency,
      description: req.description,
      customer: req.customerPhone ?? req.customerEmail ?? "",
      order_id: req.orderId,
    };
    if (req.customerName) body.customer_name = req.customerName;
    if (req.returnUrl) body.return_url = req.returnUrl;
    if (req.callbackUrl) body.callback_url = req.callbackUrl;

    const res = await paymentFetch(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.key}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        provider: "kpay",
        error: data?.message || data?.error || `K-PAY error ${res.status}`,
      };
    }
    return {
      success: true,
      provider: "kpay",
      checkoutUrl: data?.payment_url || data?.checkout_url || data?.url,
      paymentId: data?.id || data?.payment_id,
      reference: data?.reference || data?.order_id,
    };
  } catch (e) {
    return { success: false, provider: "kpay", error: (e as Error).message };
  }
}

async function giselpayPay(req: PaymentRequest): Promise<PaymentResult> {
  const cfg = providerCfg("giselpay");
  try {
    const body = {
      amount: req.amount,
      currency: req.currency,
      description: req.description,
      order_id: req.orderId,
      customer: {
        name: req.customerName,
        email: req.customerEmail,
        phone: req.customerPhone,
      },
      callback_url: req.callbackUrl,
      return_url: req.returnUrl,
    };
    const res = await paymentFetch(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.key}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        provider: "giselpay",
        error: data?.message || data?.error || `GiselPay error ${res.status}`,
      };
    }
    return {
      success: true,
      provider: "giselpay",
      checkoutUrl:
        data?.payment_url ||
        data?.checkout_url ||
        data?.redirect_url ||
        data?.url,
      paymentId: data?.id || data?.transaction_id,
      reference: data?.reference,
    };
  } catch (e) {
    return {
      success: false,
      provider: "giselpay",
      error: (e as Error).message,
    };
  }
}

async function cryptomusPay(req: PaymentRequest): Promise<PaymentResult> {
  const cfg = providerCfg("cryptomus");
  const merchant = process.env.CRYPTOMUS_MERCHANT_ID ?? "";
  try {
    const payload = {
      amount: req.amount.toFixed(2),
      currency: req.currency,
      order_id: req.orderId,
      url_callback: req.callbackUrl,
      url_success: req.returnUrl,
      description: req.description,
    };
    const json = JSON.stringify(payload);
    const sign = cryptomusSign(json, cfg.key);
    const res = await paymentFetch(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: merchant,
        sign: sign,
      },
      body: json,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.state !== "created") {
      return {
        success: false,
        provider: "cryptomus",
        error: data?.message || `CryptoMus error ${res.status}`,
      };
    }
    return {
      success: true,
      provider: "cryptomus",
      checkoutUrl: data?.result?.url,
      paymentId: data?.result?.uuid,
      reference: data?.result?.order_id,
    };
  } catch (e) {
    return {
      success: false,
      provider: "cryptomus",
      error: (e as Error).message,
    };
  }
}

async function coinbasePay(req: PaymentRequest): Promise<PaymentResult> {
  const cfg = providerCfg("coinbase");
  try {
    const body = {
      name: req.description,
      description: req.description,
      pricing_type: "fixed_price",
      local_price: {
        amount: req.amount.toFixed(2),
        currency: req.currency,
      },
      metadata: {
        order_id: req.orderId,
        customer_name: req.customerName,
        customer_email: req.customerEmail,
      },
      redirect_url: req.returnUrl,
      cancel_url: req.cancelUrl || req.returnUrl,
    };
    const res = await paymentFetch(cfg.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": cfg.key,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    const resource = data?.data;
    if (!res.ok || !resource?.hosted_url) {
      return {
        success: false,
        provider: "coinbase",
        error: data?.error?.message || `Coinbase error ${res.status}`,
      };
    }
    return {
      success: true,
      provider: "coinbase",
      checkoutUrl: resource.hosted_url,
      paymentId: resource.id,
      reference: resource.code,
    };
  } catch (e) {
    return {
      success: false,
      provider: "coinbase",
      error: (e as Error).message,
    };
  }
}

function cryptomusSign(json: string, key: string): string {
  return createHash("md5")
    .update(Buffer.from(json).toString("base64") + key)
    .digest("hex");
}

export async function createPayment(
  req: PaymentRequest,
): Promise<PaymentResult> {
  let result: PaymentResult;
  switch (req.provider) {
    case "kpay":
      result = await kpayPay(req);
      break;
    case "giselpay":
      result = await giselpayPay(req);
      break;
    case "cryptomus":
      result = await cryptomusPay(req);
      break;
    case "coinbase":
      result = await coinbasePay(req);
      break;
    default:
      result = {
        success: false,
        provider: req.provider,
        error: "Unknown provider",
      };
  }
  return result;
}
