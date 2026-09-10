import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogCategory",
  title: "Blog Category / Catégorie de blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (EN) / Titre (EN)",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "titleFr",
      title: "Title (FR) / Titre (FR)",
      type: "string",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug / Identifiant",
      type: "slug",
      options: { source: "title", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description (EN)",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (FR)",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "color",
      title: "Accent color / Couleur d'accent",
      type: "string",
      description: "Hex value, for example #0F766E",
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/),
    }),
  ],
  preview: { select: { title: "title", subtitle: "titleFr" } },
});
