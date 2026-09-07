import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Work Experience / Expérience professionnelle",
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company Name / Nom de l'entreprise",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position/Role / Poste/Rôle",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "positionFr",
      title: "Position/Role (FR) / Poste/Rôle (FR)",
      type: "string",
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type / Type de contrat",
      type: "string",
      options: {
        list: [
          {
            title: "Full-time / Temps plein",
            value: "full-time",
          },
          {
            title: "Part-time / Temps partiel",
            value: "part-time",
          },
          { title: "Contract / Contrat", value: "contract" },
          { title: "Freelance / Freelance", value: "freelance" },
          {
            title: "Internship / Stage",
            value: "internship",
          },
        ],
      },
    }),
    defineField({
      name: "location",
      title: "Location / Lieu",
      type: "string",
      description: "City, State or 'Remote' / Ville, région ou 'À distance'",
    }),
    defineField({
      name: "startDate",
      title: "Start Date / Date de début",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date / Date de fin",
      type: "date",
      description:
        "Leave blank if current position / Laisser vide si poste actuel",
    }),
    defineField({
      name: "current",
      title: "Current Position / Poste actuel",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Description (EN)",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Detailed job responsibilities and achievements / Responsabilités détaillées et réalisations",
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (FR)",
      type: "array",
      of: [{ type: "block" }],
      description:
        "French translation of the description / Traduction française de la description",
    }),
    defineField({
      name: "responsibilities",
      title: "Key Responsibilities (EN) / Responsabilités clés (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "responsibilitiesFr",
      title: "Key Responsibilities (FR) / Responsabilités clés (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "achievements",
      title: "Key Achievements (EN) / Réalisations clés (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "achievementsFr",
      title: "Key Achievements (FR) / Réalisations clés (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "technologies",
      title: "Technologies Used / Technologies utilisées",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
    }),
    defineField({
      name: "companyLogo",
      title: "Company Logo / Logo de l'entreprise",
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
      name: "companyWebsite",
      title: "Company Website / Site web de l'entreprise",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display Order / Ordre d'affichage",
      type: "number",
      description:
        "Lower numbers appear first (typically newest jobs first) / Les nombres les plus bas apparaissent en premier (généralement les emplois les plus récents d'abord)",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "position",
      subtitle: "company",
      media: "companyLogo",
      current: "current",
    },
    prepare(selection) {
      const { title, subtitle, media, current } = selection;
      return {
        title: current ? `${title} (Current)` : title,
        subtitle: subtitle,
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
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
});
