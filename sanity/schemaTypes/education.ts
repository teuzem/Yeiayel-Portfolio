import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education / Formation",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      title: "Institution Name / Nom de l'institution",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "degree",
      title: "Degree / Diplôme",
      type: "string",
      description:
        "E.g., 'Bachelor of Science', 'Master of Computer Science' / Ex. 'Licence en Sciences', 'Master en Informatique'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "degreeFr",
      title: "Degree (FR) / Diplôme (FR)",
      type: "string",
      description: "E.g., 'Licence professionnelle', 'Master en Informatique'",
    }),
    defineField({
      name: "fieldOfStudy",
      title: "Field of Study / Domaine d'études",
      type: "string",
      description:
        "E.g., 'Computer Science', 'Software Engineering' / Ex. 'Informatique', 'Génie logiciel'",
    }),
    defineField({
      name: "fieldOfStudyFr",
      title: "Field of Study (FR) / Domaine d'études (FR)",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start Date / Date de début",
      type: "date",
    }),
    defineField({
      name: "endDate",
      title: "End Date / Date de fin",
      type: "date",
      description:
        "Leave blank if currently enrolled / Laisser vide si formation en cours",
    }),
    defineField({
      name: "current",
      title: "Currently Enrolled / Formation en cours",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "gpa",
      title: "GPA / Moyenne",
      type: "string",
      description: "E.g., '3.8/4.0' / Ex. '16/20'",
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
      name: "achievements",
      title: "Achievements & Honors (EN) / Réalisations & distinctions (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "achievementsFr",
      title: "Achievements & Honors (FR) / Réalisations & distinctions (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "logo",
      title: "Institution Logo / Logo de l'institution",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "website",
      title: "Institution Website / Site web de l'institution",
      type: "url",
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
      title: "degree",
      subtitle: "institution",
      media: "logo",
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
      by: [{ field: "endDate", direction: "desc" }],
    },
  ],
});
