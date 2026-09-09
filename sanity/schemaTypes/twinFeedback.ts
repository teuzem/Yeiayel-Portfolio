import { defineField, defineType } from "sanity";

export default defineType({
  name: "twinFeedback",
  title: "AI Twin Feedback / Retours sur le jumeau IA",
  type: "document",
  fields: [
    defineField({
      name: "messageId",
      title: "Message ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating / Evaluation",
      type: "string",
      options: {
        list: [
          { title: "Helpful / Utile", value: "helpful" },
          { title: "Not helpful / Pas utile", value: "not-helpful" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locale",
      title: "Language / Langue",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Francais", value: "fr" },
        ],
      },
    }),
    defineField({
      name: "question",
      title: "Question",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "answer",
      title: "Answer / Reponse",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "source",
      title: "Provider / Fournisseur",
      type: "string",
    }),
    defineField({
      name: "model",
      title: "Model / Modele",
      type: "string",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at / Soumis le",
      type: "datetime",
    }),
    defineField({
      name: "status",
      title: "Status / Statut",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "New / Nouveau", value: "new" },
          { title: "Reviewed / Examine", value: "reviewed" },
          { title: "Actioned / Traite", value: "actioned" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "rating",
      subtitle: "question",
    },
    prepare({ title, subtitle }) {
      return {
        title: title === "helpful" ? "Helpful" : "Not helpful",
        subtitle: subtitle || "",
      };
    },
  },
  orderings: [
    {
      title: "Newest first / Plus recents",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
