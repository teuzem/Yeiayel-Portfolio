import { defineField, defineType } from "sanity";

export default defineType({
  name: "serviceRequest",
  title: "Service Requests / Demandes de service",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID / Référence",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "serviceTitle", title: "Service", type: "string" }),
    defineField({ name: "serviceSlug", title: "Service slug", type: "string" }),
    defineField({
      name: "customerName",
      title: "Customer / Client",
      type: "string",
    }),
    defineField({ name: "customerEmail", title: "Email", type: "string" }),
    defineField({
      name: "customerPhone",
      title: "Phone / Téléphone",
      type: "string",
    }),
    defineField({
      name: "projectDescription",
      title: "Project brief / Description du projet",
      type: "text",
      rows: 6,
    }),
    defineField({ name: "amount", title: "Amount / Montant", type: "number" }),
    defineField({
      name: "currency",
      title: "Currency / Devise",
      type: "string",
    }),
    defineField({
      name: "provider",
      title: "Payment provider",
      type: "string",
    }),
    defineField({ name: "paymentId", title: "Payment ID", type: "string" }),
    defineField({
      name: "paymentReference",
      title: "Payment reference",
      type: "string",
    }),
    defineField({ name: "checkoutUrl", title: "Checkout URL", type: "url" }),
    defineField({ name: "isLocal", title: "Local pricing", type: "boolean" }),
    defineField({ name: "locale", title: "Language / Langue", type: "string" }),
    defineField({
      name: "status",
      title: "Status / Statut",
      type: "string",
      options: {
        list: [
          { title: "Request received / Demande reçue", value: "received" },
          {
            title: "Quote requested / Devis demandé",
            value: "quote-requested",
          },
          {
            title: "Payment pending / Paiement en attente",
            value: "payment-pending",
          },
          { title: "Paid / Payé", value: "paid" },
          {
            title: "Payment failed / Paiement échoué",
            value: "payment-failed",
          },
          { title: "Cancelled / Annulé", value: "cancelled" },
        ],
      },
      initialValue: "received",
    }),
    defineField({ name: "createdAt", title: "Created at", type: "datetime" }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
  ],
  preview: {
    select: { title: "serviceTitle", subtitle: "orderId", status: "status" },
    prepare({ title, subtitle, status }) {
      return {
        title: `${title || "Service request"} · ${status || "received"}`,
        subtitle: subtitle || "",
      };
    },
  },
  orderings: [
    {
      title: "Newest first / Plus récentes",
      name: "createdDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
