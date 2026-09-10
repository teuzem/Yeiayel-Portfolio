import { defineField, defineType } from "sanity";

export default defineType({
  name: "twinFeedback",
  title: "AI Twin Feedback / Retours sur le jumeau IA",
  type: "document",
  fields: [
    defineField({
      name: "feedbackType",
      title: "Feedback type / Type de retour",
      type: "string",
      initialValue: "message",
      options: {
        list: [
          { title: "Message vote / Vote message", value: "message" },
          { title: "Conversation review / Avis conversation", value: "review" },
        ],
      },
    }),
    defineField({
      name: "messageId",
      title: "Message ID",
      type: "string",
      hidden: ({ document }) => document?.feedbackType === "review",
      validation: (Rule) =>
        Rule.custom((messageId, context) =>
          context.document?.feedbackType === "review" || messageId
            ? true
            : "Message ID is required for message feedback.",
        ),
    }),
    defineField({
      name: "rating",
      title: "Rating / Evaluation",
      type: "string",
      options: {
        list: [
          { title: "Helpful / Utile", value: "helpful" },
          { title: "Not helpful / Pas utile", value: "not-helpful" },
          { title: "Conversation review / Avis conversation", value: "review" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "note",
      title: "Review note / Commentaire",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "questionCount",
      title: "Questions answered / Questions posées",
      type: "number",
    }),
    defineField({
      name: "score",
      title: "Star score / Note sur 5",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "userId",
      title: "Clerk user ID",
      type: "string",
    }),
    defineField({
      name: "userName",
      title: "User name / Nom",
      type: "string",
    }),
    defineField({
      name: "userEmail",
      title: "User email / Email",
      type: "string",
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
      name: "researched",
      title: "Used live research / Recherche web utilisée",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "researchProvider",
      title: "Research provider / Fournisseur de recherche",
      type: "string",
      options: {
        list: [{ title: "Tavily", value: "tavily" }],
      },
    }),
    defineField({
      name: "researchSourceCount",
      title: "Research source count / Nombre de sources",
      type: "number",
      validation: (Rule) => Rule.min(0).max(20),
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
      feedbackType: "feedbackType",
      title: "rating",
      subtitle: "question",
      score: "score",
      note: "note",
    },
    prepare({ feedbackType, title, subtitle, score, note }) {
      if (feedbackType === "review" || title === "review") {
        return {
          title: `Conversation review: ${score || "?"}/5`,
          subtitle: note || "No written note",
        };
      }
      return {
        title:
          title === "helpful"
            ? "Helpful"
            : title === "not-helpful"
              ? "Not helpful"
              : "Conversation review",
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
