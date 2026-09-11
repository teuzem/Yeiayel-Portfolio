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
      name: "icon",
      title: "Lucide icon / Icône Lucide",
      type: "string",
      description: "Select the professional icon used on category cards.",
      options: {
        list: [
          { title: "Data Science - Database", value: "database" },
          {
            title: "Artificial Intelligence - Brain Circuit",
            value: "brain-circuit",
          },
          { title: "Data Analysis - Chart", value: "chart" },
          { title: "Software Engineering - Code XML", value: "code" },
          { title: "Cloud & Security - Cloud Cog", value: "cloud-cog" },
          {
            title: "Career & Education - Graduation Cap",
            value: "graduation-cap",
          },
          { title: "Product Reviews - Badge Check", value: "badge-check" },
          { title: "Bâtir le Pays - Building 2", value: "building-2" },
        ],
      },
      initialValue: "database",
    }),
    defineField({
      name: "color",
      title: "Legacy accent color / Ancienne couleur",
      type: "string",
      hidden: true,
    }),
  ],
  preview: { select: { title: "title", subtitle: "titleFr" } },
});
