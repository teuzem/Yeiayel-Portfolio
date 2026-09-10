import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogAuthor",
  title: "Blog Author / Auteur du blog",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name / Nom",
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
    defineField({
      name: "role",
      title: "Role (EN) / Fonction (EN)",
      type: "string",
    }),
    defineField({
      name: "roleFr",
      title: "Role (FR) / Fonction (FR)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Portrait / Portrait",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Biography (EN) / Biographie (EN)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(600),
    }),
    defineField({
      name: "bioFr",
      title: "Biography (FR) / Biographie (FR)",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(600),
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});
