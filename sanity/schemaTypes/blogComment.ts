import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogComment",
  title: "Blog Comment / Commentaire",
  type: "document",
  fields: [
    defineField({
      name: "post",
      title: "Post / Article",
      type: "reference",
      to: [{ type: "blog" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name / Nom",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "message",
      title: "Comment / Commentaire",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required().min(3).max(2_000),
    }),
    defineField({
      name: "locale",
      title: "Language / Langue",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Français", value: "fr" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Moderation status / Statut",
      type: "string",
      options: {
        list: [
          { title: "Pending / En attente", value: "pending" },
          { title: "Approved / Approuvé", value: "approved" },
          { title: "Rejected / Rejeté", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at / Date d'envoi",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "message", status: "status" },
    prepare({ title, subtitle, status }) {
      return {
        title: `${title || "Anonymous"} · ${status || "pending"}`,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
