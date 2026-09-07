import { defineField, defineType } from "sanity";

export default defineType({
  name: "contact",
  title: "Contact Form Submissions / Soumissions du formulaire de contact",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name / Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email / Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subject",
      title: "Subject / Objet",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message / Message",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At / Soumis le",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status / Statut",
      type: "string",
      options: {
        list: [
          { title: "New / Nouveau", value: "new" },
          { title: "Archived / Archivé", value: "archived" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "notes",
      title: "Internal Notes / Notes internes",
      type: "text",
      rows: 3,
      description:
        "Private notes about this inquiry / Notes privées sur cette demande",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, status } = selection;
      const statusLabel = {
        new: "[NEW]",
        archived: "[ARCHIVED]",
      };
      return {
        title: `${
          statusLabel[status as keyof typeof statusLabel] || ""
        } ${title}`,
        subtitle: subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Newest First / Plus récents d'abord",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Status / Statut",
      name: "status",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
