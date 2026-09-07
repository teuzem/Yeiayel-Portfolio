import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Projects / Projets",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title (EN) / Titre du projet (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleFr",
      title: "Project Title (FR) / Titre du projet (FR)",
      type: "string",
      description:
        "French translation of the project title / Traduction française du titre du projet",
    }),
    defineField({
      name: "slug",
      title: "Slug / Identifiant",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline (EN) / Slogan (EN)",
      type: "string",
      description:
        "Short one-liner about the project (EN) / Courte description du projet (EN)",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "taglineFr",
      title: "Tagline (FR) / Slogan (FR)",
      type: "string",
      description:
        "French one-liner about the project / Courte description du projet en français",
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image / Image de couverture",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text / Texte alternatif",
          description:
            "Describe the image for accessibility / Décrivez l'image pour l'accessibilité",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "technologies",
      title: "Technologies Used / Technologies utilisées",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      description:
        "Select from your skills list (max 6 recommended) / Sélectionnez depuis vos compétences (6 max recommandé)",
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "category",
      title: "Project Category / Catégorie du projet",
      type: "string",
      options: {
        list: [
          { title: "Web Application / Application Web", value: "web-app" },
          { title: "Mobile App / Application Mobile", value: "mobile-app" },
          { title: "AI/ML Project / Projet IA/ML", value: "ai-ml" },
          { title: "API/Backend", value: "api-backend" },
          {
            title: "DevOps/Infrastructure",
            value: "devops",
          },
          { title: "Open Source", value: "open-source" },
          { title: "CLI Tool / Outil CLI", value: "cli-tool" },
          { title: "Desktop App / Application Bureau", value: "desktop-app" },
          {
            title: "Browser Extension / Extension Navigateur",
            value: "browser-extension",
          },
          { title: "Game / Jeu", value: "game" },
          { title: "Other / Autre", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL / URL du site",
      type: "url",
      description: "Link to the live project / Lien vers le projet en ligne",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL / URL GitHub",
      type: "url",
      description: "Link to the GitHub repository / Lien vers le dépôt GitHub",
    }),
    defineField({
      name: "featured",
      title: "Featured Project / Projet en vedette",
      type: "boolean",
      description:
        "Show this project prominently on the homepage / Afficher ce projet en évidence sur la page d'accueil",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order / Ordre d'affichage",
      type: "number",
      description:
        "Lower numbers appear first (0-99) / Les nombres les plus petits apparaissent en premier (0-99)",
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(99),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      category: "category",
      featured: "featured",
    },
    prepare(selection) {
      const { title, media, category, featured } = selection;
      return {
        title: featured ? `${title} (feat.)` : title,
        subtitle: category || "Uncategorized / Non catégorisé",
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
      title: "Featured First / Vedettes d'abord",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
