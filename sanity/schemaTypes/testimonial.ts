import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials / Témoignages",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client/Person Name / Nom du client/personne",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position/Title / Poste/Fonction",
      type: "string",
      description:
        "E.g., 'CTO', 'Product Manager', 'Founder' / Ex. 'CTO', 'Chef de produit', 'Fondateur'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company/Organization / Entreprise/Organisation",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar/Photo / Avatar/Photo",
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
      name: "testimonial",
      title: "Testimonial (EN) / Témoignage (EN)",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "testimonialFr",
      title: "Testimonial (FR) / Témoignage (FR)",
      type: "text",
      rows: 5,
      description:
        "French translation of the testimonial / Traduction française du témoignage",
    }),
    defineField({
      name: "rating",
      title: "Rating / Note",
      type: "number",
      description: "1-5 stars / 1 à 5 étoiles",
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "date",
      title: "Date Received / Date de réception",
      type: "date",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn Profile / Profil LinkedIn",
      type: "url",
      description:
        "Link to person's LinkedIn for credibility / Lien LinkedIn de la personne pour la crédibilité",
    }),
    defineField({
      name: "companyLogo",
      title: "Company Logo / Logo de l'entreprise",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Testimonial / Témoignage en vedette",
      type: "boolean",
      description: "Show on homepage / Afficher sur la page d'accueil",
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
      title: "name",
      subtitle: "company",
      media: "avatar",
      featured: "featured",
    },
    prepare(selection) {
      const { title, subtitle, media, featured } = selection;
      return {
        title: featured ? `${title} (feat.)` : title,
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
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
