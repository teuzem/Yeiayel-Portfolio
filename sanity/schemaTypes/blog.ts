import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "blog",
  title: "Blog Post / Article de blog",
  type: "document",
  groups: [
    { name: "content", title: "Content / Contenu", default: true },
    { name: "fr", title: "French / Français" },
    { name: "editorial", title: "Editorial & SEO / Éditorial & SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title (EN) / Titre (EN)",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
      group: "content",
    }),
    defineField({
      name: "titleFr",
      title: "Title (FR) / Titre (FR)",
      type: "string",
      validation: (Rule) => Rule.max(120),
      group: "fr",
    }),
    defineField({
      name: "slug",
      title: "Slug / Identifiant",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt (EN) / Extrait (EN)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(320),
      group: "content",
    }),
    defineField({
      name: "excerptFr",
      title: "Excerpt (FR) / Extrait (FR)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(320),
      group: "fr",
    }),
    defineField({
      name: "content",
      title: "Article body (EN) / Corps de l'article (EN)",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link / Lien",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({ scheme: ["https", "http", "mailto"] }),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        }),
      ],
      group: "content",
    }),
    defineField({
      name: "contentFr",
      title: "Article body (FR) / Corps de l'article (FR)",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }],
        }),
      ],
      group: "fr",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured image / Image à la une",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text / Texte alternatif",
        },
        { name: "caption", type: "string", title: "Caption / Légende" },
      ],
      group: "content",
    }),
    defineField({
      name: "featuredImageUrl",
      title: "External featured image URL / URL externe de l'image",
      type: "url",
      description:
        "Optional HTTPS fallback when no Sanity image asset is uploaded.",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
      group: "content",
    }),
    defineField({
      name: "category",
      title: "Legacy category / Catégorie existante",
      type: "string",
      options: {
        list: [
          { title: "Data Science", value: "data-science" },
          { title: "Artificial Intelligence", value: "ai-ml" },
          { title: "Data Analysis", value: "data-analysis" },
          { title: "Software Engineering", value: "web-dev" },
          { title: "Cloud, DevOps & Security", value: "cloud-security" },
          { title: "Career & Education", value: "career" },
          { title: "Product Review", value: "review" },
          { title: "Bâtir le Pays SARL", value: "batir-le-pays" },
        ],
      },
      group: "content",
    }),
    defineField({
      name: "categoryRef",
      title: "Editorial category / Catégorie éditoriale",
      type: "reference",
      to: [{ type: "blogCategory" }],
      group: "content",
    }),
    defineField({
      name: "tags",
      title: "Tags / Étiquettes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "content",
    }),
    defineField({
      name: "author",
      title: "Author / Auteur",
      type: "reference",
      to: [{ type: "blogAuthor" }],
      group: "content",
    }),
    defineField({
      name: "product",
      title: "Reviewed product / Produit évalué",
      type: "reference",
      to: [{ type: "blogProduct" }],
      hidden: ({ document }) => document?.contentType !== "Review",
      group: "content",
    }),
    defineField({
      name: "publishedAt",
      title: "Published date / Date de publication",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated / Dernière mise à jour",
      type: "datetime",
      group: "editorial",
    }),
    defineField({
      name: "status",
      title: "Publishing status / Statut de publication",
      type: "string",
      options: {
        list: [
          { title: "Draft / Brouillon", value: "draft" },
          { title: "In review / En révision", value: "review" },
          { title: "Scheduled / Planifié", value: "scheduled" },
          { title: "Published / Publié", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "featured",
      title: "Featured / À la une",
      type: "boolean",
      initialValue: false,
      group: "editorial",
    }),
    defineField({
      name: "trending",
      title: "Trending / Tendance",
      type: "boolean",
      initialValue: false,
      group: "editorial",
    }),
    defineField({
      name: "readTime",
      title: "Read time (minutes) / Temps de lecture (minutes)",
      type: "number",
      validation: (Rule) => Rule.integer().positive().max(120),
      group: "editorial",
    }),
    defineField({
      name: "contentType",
      title: "Content type / Type de contenu",
      type: "string",
      options: {
        list: [
          { title: "Article", value: "Article" },
          { title: "Tutorial / Tutoriel", value: "HowTo" },
          { title: "Guide", value: "Guide" },
          { title: "Review / Évaluation", value: "Review" },
          { title: "News / Actualité", value: "NewsArticle" },
          { title: "Opinion", value: "Opinion" },
        ],
      },
      initialValue: "Article",
      group: "editorial",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title (EN)",
      type: "string",
      validation: (Rule) => Rule.max(70),
      group: "editorial",
    }),
    defineField({
      name: "seoTitleFr",
      title: "SEO title (FR)",
      type: "string",
      validation: (Rule) => Rule.max(70),
      group: "editorial",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description (EN)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(170),
      group: "editorial",
    }),
    defineField({
      name: "seoDescriptionFr",
      title: "SEO description (FR)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(170),
      group: "editorial",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image / Image Open Graph",
      type: "image",
      options: { hotspot: true },
      group: "editorial",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines / Masquer des moteurs",
      type: "boolean",
      initialValue: false,
      group: "editorial",
    }),
    defineField({
      name: "sources",
      title: "Editorial sources / Sources éditoriales",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", title: "Title / Titre", type: "string" },
            { name: "publisher", title: "Publisher / Éditeur", type: "string" },
            {
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.uri({ scheme: ["https"] }),
            },
            {
              name: "accessedAt",
              title: "Accessed on / Consultée le",
              type: "date",
            },
          ],
        }),
      ],
      group: "editorial",
    }),
  ],
  preview: {
    select: {
      title: "title",
      titleFr: "titleFr",
      media: "featuredImage",
      status: "status",
    },
    prepare({ title, titleFr, media, status }) {
      return {
        title: title || titleFr || "Untitled post",
        subtitle: status || "draft",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
