import { defineField, defineType } from "sanity";

export default defineType({
  name: "achievement",
  title: "Achievements & Awards / Réalisations & Distinctions",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Achievement Title / Titre de la réalisation",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleFr",
      title: "Achievement Title (FR) / Titre de la réalisation (FR)",
      type: "string",
      description:
        "French translation of the title / Traduction française du titre",
    }),
    defineField({
      name: "type",
      title: "Type / Type",
      type: "string",
      options: {
        list: [
          { title: "Award / Prix", value: "award" },
          {
            title: "Hackathon Win / Victoire en hackathon",
            value: "hackathon",
          },
          { title: "Publication", value: "publication" },
          {
            title: "Speaking Engagement / Intervention orale",
            value: "speaking",
          },
          {
            title: "Open Source Contribution / Contribution open source",
            value: "open-source",
          },
          { title: "Milestone / Étape", value: "milestone" },
          { title: "Recognition / Reconnaissance", value: "recognition" },
          { title: "Other / Autre", value: "other" },
        ],
      },
    }),
    defineField({
      name: "issuer",
      title: "Issuing Organization / Organisme émetteur",
      type: "string",
      description: "Who awarded this? / Qui a décerné ceci ?",
    }),
    defineField({
      name: "date",
      title: "Date Achieved / Date d'obtention",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description (EN)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (FR)",
      type: "text",
      rows: 4,
      description:
        "French translation of the description / Traduction française de la description",
    }),
    defineField({
      name: "image",
      title: "Image/Badge / Image/Badge",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Award photo, badge, or certificate / Photo du prix, badge ou certificat",
    }),
    defineField({
      name: "url",
      title: "URL / Lien",
      type: "url",
      description:
        "Link to announcement, certificate, or relevant page / Lien vers l'annonce, le certificat ou une page pertinente",
    }),
    defineField({
      name: "featured",
      title: "Featured Achievement / Réalisation en vedette",
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
      subtitle: "issuer",
      media: "image",
      type: "type",
    },
    prepare(selection) {
      const { title, subtitle, media, type } = selection;
      return {
        title: title,
        subtitle: `${type} - ${subtitle}`,
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
    {
      title: "Newest First / Plus récents d'abord",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
