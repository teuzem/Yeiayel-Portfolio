import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { socialPlatformOptions } from "../../lib/social";

const socialLinkObject = defineField({
  name: "socialLink",
  title: "Social / Professional Link / Lien social / professionnel",
  type: "object",
  fields: [
    {
      name: "platform",
      title: "Platform / Plateforme",
      type: "string",
      options: { list: socialPlatformOptions() },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "url",
      title: "URL or Handle / URL ou identifiant",
      type: "string",
      description:
        "Full URL (https://…) or a bare handle. Emails, phone and WhatsApp get the proper mailto:/tel:/wa.me/ link automatically. / URL complète (https://…) ou identifiant simple. Les emails, téléphones et WhatsApp reçoivent automatiquement les liens mailto:/tel:/wa.me/ appropriés.",
    },
    {
      name: "label",
      title: "Custom Label (optional) / Libellé personnalisé (optionnel)",
      type: "string",
      description:
        "If empty, the platform name is used as the link label. / Si vide, le nom de la plateforme est utilisé comme libellé du lien.",
    },
    {
      name: "showInContact",
      title: "Show in the Contact section / Afficher dans la section Contact",
      type: "boolean",
      initialValue: true,
      description:
        "When enabled, this profile appears as a selectable brand icon in the Contact section. / Lorsque activé, ce profil apparaît comme icône de marque sélectionnable dans la section Contact.",
    },
    {
      name: "enabled",
      title: "Enabled / Activé",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});

export default defineType({
  name: "profile",
  title: "Profile / Profil",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "firstName",
      title: "First Name / Prénom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastName",
      title: "Last Name / Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Professional Headline (EN) / Accroche professionnelle (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headlineFr",
      title: "Professional Headline (FR) / Accroche professionnelle (FR)",
      type: "string",
    }),
    defineField({
      name: "headlineStaticText",
      title: "Headline Static Text (EN) / Texte statique (EN)",
      type: "string",
      placeholder: "I build / Je crée",
    }),
    defineField({
      name: "headlineStaticTextFr",
      title: "Headline Static Text (FR) / Texte statique (FR)",
      type: "string",
      placeholder: "Je conçois",
    }),
    defineField({
      name: "headlineAnimatedWords",
      title: "Headline Animated Words (EN) / Mots animés (EN)",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(2).max(10),
    }),
    defineField({
      name: "headlineAnimatedWordsFr",
      title: "Headline Animated Words (FR) / Mots animés (FR)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "headlineAnimationDuration",
      title: "Headline Animation Duration (ms) / Durée d'animation (ms)",
      type: "number",
      initialValue: 3000,
      validation: (Rule) => Rule.min(1000).max(10000),
    }),
    defineField({
      name: "shortBio",
      title: "Short Bio (EN) / Bio courte (EN)",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "shortBioFr",
      title: "Short Bio (FR) / Bio courte (FR)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "fullBio",
      title: "Full Bio (EN) / Bio complète (EN)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullBioFr",
      title: "Full Bio (FR) / Bio complète (FR)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image / Photo de profil",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text / Texte alternatif",
        },
      ],
    }),
    defineField({
      name: "profileImages",
      title:
        "Profile Image Gallery (up to 10) / Galerie de profil (jusqu'à 10)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text / Texte alternatif",
              validation: (Rule) => Rule.required().max(160),
            },
          ],
        },
      ],
      description:
        "Images rotate automatically every 10 seconds in the hero. The first image is used as the primary SEO image. / Les images changent automatiquement toutes les 10 secondes dans le hero. La première image est utilisée comme image SEO principale.",
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: "email",
      title: "Email / Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "emailProfessional",
      title: "Professional Email / Email professionnel",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number / Numéro de téléphone",
      type: "string",
    }),
    defineField({
      name: "phoneSecondary",
      title: "Secondary Phone Number / Numéro secondaire",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp Number / Numéro WhatsApp",
      type: "string",
      description:
        "For direct contact (include country code) / Pour un contact direct (inclure l'indicatif pays)",
    }),
    defineField({
      name: "location",
      title: "Location / Localisation",
      type: "string",
    }),
    defineField({
      name: "resumeUrl",
      title: "Resume / CV URL / URL du CV",
      type: "url",
      description:
        "Link to a downloadable CV (Google Drive, etc.) / Lien vers un CV téléchargeable (Google Drive, etc.)",
    }),
    defineField({
      name: "availability",
      title: "Availability Status / Statut de disponibilité",
      type: "string",
      options: {
        list: [
          {
            title: "Available for hire / Disponible pour une mission",
            value: "available",
          },
          {
            title: "Open to opportunities / Ouvert aux opportunités",
            value: "open",
          },
          {
            title: "Not looking / Non disponible",
            value: "unavailable",
          },
        ],
      },
    }),
    defineField({
      name: "profession",
      title: "Primary Profession / Profession principale",
      type: "string",
      description:
        "E.g., 'Data Scientist & AI Engineer' / Ex. 'Scientifique des données & Ingénieur IA'",
    }),
    defineField({
      name: "professionFr",
      title: "Primary Profession (FR) / Profession principale (FR)",
      type: "string",
      description: "E.g., 'Scientifique des données & Ingénieur IA'",
    }),
    defineField({
      name: "expertiseDomains",
      title: "Expertise Domains / Domaines d'expertise",
      type: "array",
      of: [{ type: "string" }],
      description:
        "e.g., Machine Learning, Deep Learning, Big Data, Business Intelligence, Data Viz, Fullstack Python, Fullstack JS, Cloud DevOps",
    }),
    defineField({
      name: "socialLinks",
      title:
        "Social & Professional Links / Réseaux sociaux & liens professionnels",
      type: "array",
      of: [socialLinkObject],
      description:
        "Add any social network, professional platform, or podcast. Each platform is bound to its associated SVG brand icon automatically. / Ajoutez tout réseau social, plateforme professionnelle ou podcast. Chaque plateforme est automatiquement liée à son icône SVG de marque.",
    }),
    defineField({
      name: "yearsOfExperience",
      title: "Years of Experience / Années d'expérience",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "stats",
      title: "Profile Statistics / Statistiques du profil",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label (EN) / Libellé (EN)",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "labelFr",
              title: "Label (FR) / Libellé (FR)",
              type: "string",
            },
            {
              name: "value",
              title: "Value / Valeur",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "firstName",
      subtitle: "headline",
      media: "profileImage",
    },
    prepare(selection) {
      return {
        title: selection.title,
        subtitle: selection.subtitle,
        media: selection.media,
      };
    },
  },
});
