import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogSettings",
  title: "Blog Settings / Paramètres du blog",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Blog name (EN) / Nom du blog (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Yeiayel Journal",
    }),
    defineField({
      name: "nameFr",
      title: "Blog name (FR) / Nom du blog (FR)",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Blog logo / Logo du blog",
      type: "image",
      options: { hotspot: true },
      description: "Overrides the bundled Bâtir le Pays logo fallback.",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero title (EN) / Titre hero (EN)",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "heroTitleFr",
      title: "Hero title (FR) / Titre hero (FR)",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero description (EN)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(360),
    }),
    defineField({
      name: "heroDescriptionFr",
      title: "Hero description (FR)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(360),
    }),
    defineField({
      name: "position",
      title: "Professional position (EN)",
      type: "string",
      initialValue: "Data Science and Digital Innovation at Bâtir le Pays SARL",
    }),
    defineField({
      name: "positionFr",
      title: "Professional position (FR)",
      type: "string",
      initialValue:
        "Data Science et innovation numérique chez Bâtir le Pays SARL",
    }),
    defineField({
      name: "accentColor",
      title: "Accent color / Couleur d'accent",
      type: "string",
      description: "Hex value, for example #0F766E",
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/),
    }),
    defineField({
      name: "advertisement",
      title: "Article sidebar promotion / Promotion latérale",
      type: "object",
      fields: [
        {
          name: "enabled",
          title: "Display promotion / Afficher la promotion",
          type: "boolean",
          initialValue: true,
        },
        { name: "title", title: "Title (EN)", type: "string" },
        { name: "titleFr", title: "Title (FR)", type: "string" },
        {
          name: "description",
          title: "Description (EN)",
          type: "text",
          rows: 3,
        },
        {
          name: "descriptionFr",
          title: "Description (FR)",
          type: "text",
          rows: 3,
        },
        {
          name: "image",
          title: "Promotion image / Image",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "imageUrl",
          title: "External image URL / URL externe",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["https"] }),
        },
        {
          name: "link",
          title: "Destination URL",
          type: "string",
          description:
            "Accepts an internal path such as /#contact or a complete HTTPS URL.",
        },
        { name: "buttonLabel", title: "Button label (EN)", type: "string" },
        { name: "buttonLabelFr", title: "Button label (FR)", type: "string" },
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "position", media: "logo" } },
});
