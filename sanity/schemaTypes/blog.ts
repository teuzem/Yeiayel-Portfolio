import { defineField, defineType } from "sanity";

export default defineType({
  name: "blog",
  title: "Blog Posts / Articles de blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (EN) / Titre (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleFr",
      title: "Title (FR) / Titre (FR)",
      type: "string",
      description:
        "French translation of the title / Traduction française du titre",
    }),
    defineField({
      name: "slug",
      title: "Slug / Identifiant",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt (EN) / Extrait (EN)",
      type: "text",
      rows: 3,
      description:
        "Brief summary for preview cards (EN) / Résumé pour les cartes d'aperçu (EN)",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "excerptFr",
      title: "Excerpt (FR) / Extrait (FR)",
      type: "text",
      rows: 3,
      description:
        "French summary for preview cards / Résumé en français pour les cartes d'aperçu",
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image / Image à la une",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text / Texte alternatif",
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category / Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Tutorial / Tutoriel", value: "tutorial" },
          { title: "Technical / Technique", value: "technical" },
          { title: "AI/ML / IA-ML", value: "ai-ml" },
          {
            title: "Web Development / Développement Web",
            value: "web-dev",
          },
          { title: "Career / Carrière", value: "career" },
          { title: "Opinion / Opinion", value: "opinion" },
          {
            title: "Project Showcase / Présentation de projet",
            value: "showcase",
          },
          {
            title: "Best Practices / Bonnes pratiques",
            value: "best-practices",
          },
          { title: "News / Actualités", value: "news" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Tags / Étiquettes",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date / Date de publication",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes) / Temps de lecture (minutes)",
      type: "number",
      description: "Estimated reading time / Temps de lecture estimé",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "featuredImage",
      category: "category",
    },
    prepare(selection) {
      const { title, media, category } = selection;
      return {
        title: title,
        subtitle: category || "Uncategorized / Non catégorisé",
        media: media,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, Newest / Plus récents d'abord",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest / Plus anciens d'abord",
      name: "publishedAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
  ],
});
