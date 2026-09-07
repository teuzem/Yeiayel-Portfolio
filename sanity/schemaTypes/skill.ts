import { defineField, defineType } from "sanity";

export default defineType({
  name: "skill",
  title: "Skills / Compétences",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Skill Name / Nom du skill",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category / Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Frontend / Front-end", value: "frontend" },
          { title: "Backend / Back-end", value: "backend" },
          { title: "AI/ML / IA-ML", value: "ai-ml" },
          { title: "Data Science / Science des données", value: "data" },
          { title: "DevOps", value: "devops" },
          { title: "Cloud", value: "cloud" },
          { title: "Database / Base de données", value: "database" },
          { title: "Mobile", value: "mobile" },
          { title: "Testing / Tests", value: "testing" },
          { title: "Design", value: "design" },
          { title: "Networking / Réseaux", value: "network" },
          { title: "Security / Sécurité", value: "security" },
          { title: "Marketing", value: "marketing" },
          { title: "Tools / Outils", value: "tools" },
          {
            title: "Soft Skills / Compétences relationnelles",
            value: "soft-skills",
          },
          { title: "Other / Autre", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "proficiency",
      title: "Proficiency Level / Niveau de compétence",
      type: "string",
      options: {
        list: [
          { title: "Beginner / Débutant", value: "beginner" },
          { title: "Intermediate / Intermédiaire", value: "intermediate" },
          { title: "Advanced / Avancé", value: "advanced" },
          { title: "Expert / Expert", value: "expert" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "percentage",
      title: "Proficiency Percentage / Pourcentage de compétence",
      type: "number",
      description:
        "0-100 for visual progress bars / 0-100 pour les barres de progression visuelles",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "yearsOfExperience",
      title: "Years of Experience / Années d'expérience",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "color",
      title: "Brand Color / Couleur de marque",
      type: "string",
      description:
        "Hex color code for the skill badge (e.g., #61DAFB for React) / Code couleur hexadécimal pour le badge (ex. #61DAFB pour React)",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      proficiency: "proficiency",
    },
    prepare(selection) {
      const { title, subtitle, proficiency } = selection;
      return {
        title: title,
        subtitle: `${subtitle} - ${proficiency}`,
      };
    },
  },
  orderings: [
    {
      title: "Category, then Name / Catégorie, puis nom",
      name: "categoryName",
      by: [
        { field: "category", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
});
