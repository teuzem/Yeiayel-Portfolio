import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogProduct",
  title: "Reviewed Product / Produit évalué",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product name / Nom du produit",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug / Identifiant",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "brand", title: "Brand / Marque", type: "string" }),
    defineField({
      name: "description",
      title: "Description (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (FR)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Product image / Image du produit",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "score",
      title: "Editorial score / Note éditoriale",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5).precision(1),
    }),
    defineField({
      name: "url",
      title: "Official product URL / URL officielle",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
  ],
  preview: { select: { title: "name", subtitle: "brand", media: "image" } },
});
