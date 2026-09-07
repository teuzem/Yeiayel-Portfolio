import { defineField, defineType } from "sanity";

export default defineType({
  name: "navigation",
  title: "Navigation / Navigation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Link Title (EN) / Texte du lien (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleFr",
      title: "Link Title (FR) / Texte du lien (FR)",
      type: "string",
      description:
        "French translation of the link title / Traduction française du texte du lien",
    }),
    defineField({
      name: "href",
      title: "Link URL / URL du lien",
      type: "string",
      description:
        "Page anchor (e.g., '#about') or external URL (e.g., 'https://github.com/username') / Ancre de page (ex. '#about') ou URL externe (ex. 'https://github.com/username')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Name / Nom de l'icône",
      type: "string",
      description:
        "Tabler icon name (e.g., 'IconHome', 'IconBrandGithub') / Nom de l'icône Tabler (ex. 'IconHome', 'IconBrandGithub')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isExternal",
      title: "External Link / Lien externe",
      type: "boolean",
      description:
        "Toggle if this link goes to an external website / Activez si ce lien pointe vers un site externe",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order / Ordre d'affichage",
      type: "number",
      description:
        "Lower numbers appear first / Les nombres les plus bas apparaissent en premier",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "href",
      order: "order",
    },
    prepare(selection) {
      const { title, subtitle, order } = selection;
      return {
        title: `${order}. ${title}`,
        subtitle: subtitle,
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
