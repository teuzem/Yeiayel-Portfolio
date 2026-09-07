import { defineField, defineType } from "sanity";

export default defineType({
  name: "certification",
  title: "Certifications / Certifications",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Certification Name / Nom de la certification",
      type: "string",
      description:
        "e.g., 'Certificate of Completion — Fullstack Python Development' / ex. 'Certificat de réussite — Développement Fullstack Python'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nameFr",
      title: "Certification Name (FR) / Nom de la certification (FR)",
      type: "string",
      description:
        "French translation of the certification name / Traduction française du nom",
    }),
    defineField({
      name: "issuer",
      title: "Issuing Organization / Organisme émetteur",
      type: "string",
      description:
        "The organization, training center, or e-learning platform / L'organisation, le centre de formation ou la plateforme e-learning",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recipientName",
      title: "Recipient Name / Nom du bénéficiaire",
      type: "string",
      description:
        "Name printed on the certificate (defaults to your profile full name if left blank). / Nom imprimé sur le certificat (par défaut, nom complet du profil si laissé vide).",
    }),
    defineField({
      name: "issueDate",
      title: "Issue Date / Date d'émission",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "expiryDate",
      title: "Expiry Date / Date d'expiration",
      type: "date",
      description:
        "Leave blank if certification doesn't expire / Laisser vide si la certification n'expire pas",
    }),
    defineField({
      name: "credentialId",
      title: "Credential ID / ID du certificat",
      type: "string",
      description:
        "Certificate ID or badge number / ID du certificat ou numéro de badge",
    }),
    defineField({
      name: "logo",
      title: "Issuer Logo / Seal / Logo de l'émetteur / Sceau",
      type: "image",
      options: { hotspot: true },
      description:
        "Issuer logo or certificate seal / Logo de l'émetteur ou sceau du certificat",
    }),
    defineField({
      name: "certificateFile",
      title:
        "Certificate File (PDF / document) / Fichier du certificat (PDF / document)",
      type: "file",
      description:
        "Upload the real certificate as a PDF or document. The View button will open and auto-download it. / Téléversez le certificat réel en PDF ou document. Le bouton Voir l'ouvrira et le téléchargera automatiquement.",
    }),
    defineField({
      name: "certificateImage",
      title: "Certificate Image / Photo / Image du certificat / Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "A photo or screenshot of the real certificate. The View button will open and auto-download it. / Une photo ou une capture du certificat réel. Le bouton Voir l'ouvrira et le téléchargera automatiquement.",
    }),
    defineField({
      name: "credentialUrl",
      title:
        "External / E-learning Verification URL / URL de vérification externe / e-learning",
      type: "url",
      description:
        "Only needed if no file/image is attached — e.g., the certificate page on an e-learning platform (Udemy, Coursera, etc.). / Uniquement nécessaire si aucun fichier/image n'est joint — ex. page du certificat sur une plateforme e-learning (Udemy, Coursera, etc.).",
    }),
    defineField({
      name: "description",
      title: "Description (EN)",
      type: "text",
      rows: 3,
      description:
        "What skills or knowledge this certification represents / Quelles compétences ou connaissances cette certification représente",
    }),
    defineField({
      name: "descriptionFr",
      title: "Description (FR)",
      type: "text",
      rows: 3,
      description:
        "French translation of the description / Traduction française de la description",
    }),
    defineField({
      name: "skills",
      title: "Related Skills / Compétences associées",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
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
      subtitle: "issuer",
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
      by: [{ field: "issueDate", direction: "desc" }],
    },
  ],
});
