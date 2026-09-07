import { RocketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Services / Services",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Service Title / Titre du service",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleFr",
      title: "Titre (Français) / Title (FR)",
      type: "string",
      description:
        "French translation of the service title / Traduction française du titre",
    }),
    defineField({
      name: "slug",
      title: "Slug / Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon/Image / Icône/Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description (EN) / Description courte (FR)",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "shortDescriptionFr",
      title: "Short Description (FR) / Description courte (FR)",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description (EN) / Description complète (FR)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullDescriptionFr",
      title: "Full Description (FR) / Description complète (FR)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "features",
      title: "Key Features (EN) / Fonctionnalités clés (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featuresFr",
      title: "Key Features (FR) / Fonctionnalités clés (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "technologies",
      title: "Technologies / Technologies",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables (EN) / Livrables (FR)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "What clients receive when the service is complete / Ce que les clients reçoivent à la fin du service",
    }),
    defineField({
      name: "deliverablesFr",
      title: "Deliverables (FR) / Livrables (FR)",
      type: "array",
      of: [{ type: "string" }],
      description: "Ce que le client reçoit à la fin du service",
    }),
    defineField({
      name: "pricing",
      title: "Pricing / Tarification",
      type: "object",
      fields: [
        {
          name: "priceType",
          title: "Price Type / Type de tarif",
          type: "string",
          options: {
            list: [
              {
                title: "Per Hour / À l'heure",
                value: "hourly",
              },
              {
                title: "Per Project / Par projet",
                value: "project",
              },
              {
                title: "Monthly Retainer / Forfait mensuel",
                value: "monthly",
              },
              {
                title: "Custom Quote / Devis personnalisé",
                value: "custom",
              },
            ],
          },
          initialValue: "project",
        },
        {
          name: "visible",
          title: "Show Pricing / Afficher les tarifs",
          type: "boolean",
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: "internationalPrice",
      title: "International Price (USD) / Prix international (USD)",
      type: "number",
      description:
        "Price in USD for international clients (non-African). E.g., 1500 / Prix en USD pour la clientèle internationale. Ex. 1500",
    }),
    defineField({
      name: "internationalCurrency",
      title: "International Currency / Devise internationale",
      type: "string",
      description: "ISO code, e.g., USD or EUR / Code ISO, ex. USD ou EUR",
      initialValue: "USD",
    }),
    defineField({
      name: "localPrice",
      title:
        "Local Price (Africa) — FCFA/other / Prix local (Afrique) — FCFA/autre",
      type: "number",
      description:
        "Price for the African market in local currency (e.g., FCFA). Leave blank to auto-compute as ~50% of international. / Prix pour le marché africain en devise locale (ex. FCFA). Laissez vide pour un calcul automatique à ~50 % de l'international.",
    }),
    defineField({
      name: "localCurrency",
      title: "Local Currency / Devise locale",
      type: "string",
      options: {
        list: [
          { title: "FCFA (XAF) / FCFA (XAF)", value: "XAF" },
          { title: "FCFA (XOF) / FCFA (XOF)", value: "XOF" },
          { title: "Naira (NGN) / Naira (NGN)", value: "NGN" },
          { title: "Cedi (GHS) / Cedi (GHS)", value: "GHS" },
          { title: "Shilling (KES) / Shilling (KES)", value: "KES" },
          { title: "Rand (ZAR) / Rand (ZAR)", value: "ZAR" },
          { title: "Franc (RWF) / Franc (RWF)", value: "RWF" },
          { title: "Shilling (UGX) / Shilling (UGX)", value: "UGX" },
        ],
      },
      initialValue: "XAF",
    }),
    defineField({
      name: "localDiscountPercent",
      title: "Local Discount (%) / Remise locale (%)",
      type: "number",
      description:
        "Optional: percentage discount applied to the international price for African clients (default 50). / Optionnel : pourcentage de remise appliqué au prix international pour la clientèle africaine (défaut 50).",
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(90),
    }),
    defineField({
      name: "pricingDescription",
      title: "Pricing Description / Description de la tarification",
      type: "text",
      rows: 2,
      description:
        "Additional notes about pricing / what's included / Notes supplémentaires sur la tarification / ce qui est inclus",
    }),
    defineField({
      name: "timeline",
      title: "Typical Timeline / Délai typique",
      type: "string",
      description:
        "E.g., '2-4 weeks', '1-3 months' / Ex. '2-4 semaines', '1-3 mois'",
    }),
    defineField({
      name: "documentation",
      title: "Documentation Included (EN) / Documentation fournie (FR)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "List of documentation delivered with this service / Liste de la documentation livrée avec ce service",
    }),
    defineField({
      name: "documentationFr",
      title: "Documentation Included (FR) / Documentation fournie (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "workflow",
      title: "Workflow Steps (EN) / Étapes du processus (FR)",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Ordered steps from request to delivery / Étapes ordonnées de la demande à la livraison",
    }),
    defineField({
      name: "workflowFr",
      title: "Workflow Steps (FR) / Étapes du processus (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featured",
      title: "Featured Service / Service en vedette",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order / Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "icon",
      featured: "featured",
      intl: "internationalPrice",
    },
    prepare(selection) {
      const { title, media, featured, intl } = selection;
      return {
        title: featured ? `(feat.) ${title}` : title,
        subtitle: intl ? `Intl: $${intl}` : "No price set / Prix non défini",
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Display Order / Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
