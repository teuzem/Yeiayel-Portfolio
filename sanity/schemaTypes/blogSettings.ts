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
  ],
  preview: { select: { title: "name", subtitle: "position", media: "logo" } },
});
