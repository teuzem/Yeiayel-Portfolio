import { defineField, defineType } from "sanity";

export default defineType({
  name: "paymentWebhook",
  title: "Payment Webhook Events / Événements de webhook de paiement",
  type: "document",
  fields: [
    defineField({
      name: "provider",
      title: "Provider / Fournisseur",
      type: "string",
      options: {
        list: [
          { title: "GiselPay / GiselPay", value: "giselpay" },
          { title: "K-PAY / K-PAY", value: "kpay" },
          { title: "CryptoMus / CryptoMus", value: "cryptomus" },
          {
            title: "Coinbase Commerce / Coinbase Commerce",
            value: "coinbase",
          },
          { title: "Unknown / Inconnu", value: "unknown" },
        ],
      },
    }),
    defineField({
      name: "payload",
      title: "Payload / Données brutes",
      type: "text",
      rows: 8,
      description:
        "Raw webhook payload (JSON) / Données brutes du webhook (JSON)",
    }),
    defineField({
      name: "receivedAt",
      title: "Received At / Reçu le",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "provider",
      subtitle: "receivedAt",
    },
    prepare(selection) {
      return {
        title: selection.title || "Unknown / Inconnu",
        subtitle: selection.subtitle || "",
      };
    },
  },
  orderings: [
    {
      title: "Newest First / Plus récents d'abord",
      name: "receivedDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
});
