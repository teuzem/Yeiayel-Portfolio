import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings / Paramètres du site",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title / Titre du site",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description / Description du site",
      type: "text",
      rows: 3,
      description: "Meta description for SEO / Méta-description pour le SEO",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "siteKeywords",
      title: "Site Keywords / Mots-clés du site",
      type: "array",
      of: [{ type: "string" }],
      description: "SEO keywords / Mots-clés SEO",
    }),
    defineField({
      name: "siteLogo",
      title: "Site Logo / Logo du site",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "favicon",
      title: "Favicon / Favicon",
      type: "image",
      description: "32x32 px recommended / 32x32 px recommandé",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image / Image Open Graph",
      type: "image",
      description:
        "Default image for social media sharing (1200x630 recommended) / Image par défaut pour le partage sur les réseaux sociaux (1200x630 recommandé)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "primaryColor",
      title: "Primary Brand Color / Couleur de marque principale",
      type: "string",
      description:
        "Hex color code (e.g., #3B82F6) / Code couleur hexadécimal (ex. #3B82F6)",
    }),
    defineField({
      name: "secondaryColor",
      title: "Secondary Brand Color / Couleur de marque secondaire",
      type: "string",
      description: "Hex color code / Code couleur hexadécimal",
    }),
    defineField({
      name: "accentColor",
      title: "Accent Color / Couleur d'accent",
      type: "string",
      description:
        "Hex color code for CTAs and highlights / Code couleur hexadécimal pour les CTA et les mises en évidence",
    }),
    defineField({
      name: "ctaText",
      title: "Main CTA Text / Texte du CTA principal",
      type: "string",
      description:
        "Primary call-to-action button text (e.g., 'Hire Me', 'Get in Touch') / Texte du bouton d'appel à l'action (ex. 'Engagez-moi', 'Contactez-moi')",
    }),
    defineField({
      name: "ctaUrl",
      title: "Main CTA URL / URL du CTA principal",
      type: "string",
      description:
        "Where the CTA button leads (e.g., #contact, /contact) / Où mène le bouton CTA (ex. #contact, /contact)",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline / Titre principal (Hero)",
      type: "string",
      description:
        "Main headline on homepage / Titre principal de la page d'accueil",
    }),
    defineField({
      name: "heroSubheadline",
      title: "Hero Subheadline / Sous-titre (Hero)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "heroBackground",
      title: "Hero Background Image / Image de fond (Hero)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "showBlog",
      title: "Show Blog Section / Afficher la section Blog",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showServices",
      title: "Show Services Section / Afficher la section Services",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "showTestimonials",
      title: "Show Testimonials Section / Afficher la section Témoignages",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "googleAnalyticsId",
      title: "Google Analytics ID / ID Google Analytics",
      type: "string",
      description:
        "GA tracking ID (e.g., G-XXXXXXXXXX) / ID de suivi GA (ex. G-XXXXXXXXXX)",
    }),
    defineField({
      name: "facebookPixelId",
      title: "Facebook Pixel ID / ID du pixel Facebook",
      type: "string",
    }),
    defineField({
      name: "twitterHandle",
      title: "Twitter Handle / Identifiant Twitter",
      type: "string",
      description:
        "For Twitter card metadata (without @) / Pour les métadonnées de carte Twitter (sans @)",
    }),
    defineField({
      name: "footer",
      title: "Footer Settings / Paramètres du pied de page",
      type: "object",
      fields: [
        {
          name: "text",
          title: "Footer Text / Texte du pied de page",
          type: "text",
          rows: 2,
        },
        {
          name: "copyrightText",
          title: "Copyright Text / Texte de copyright",
          type: "string",
          description:
            "E.g., '© 2025 Your Name. All rights reserved.' / Ex. '© 2025 Votre Nom. Tous droits réservés.'",
        },
        {
          name: "links",
          title: "Footer Links / Liens du pied de page",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "title",
                  type: "string",
                  title: "Title / Titre",
                },
                { name: "url", type: "string", title: "URL / Lien" },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: "maintenanceMode",
      title: "Maintenance Mode / Mode maintenance",
      type: "boolean",
      description:
        "Enable to show maintenance page / Activer pour afficher la page de maintenance",
      initialValue: false,
    }),
    defineField({
      name: "maintenanceMessage",
      title: "Maintenance Message / Message de maintenance",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "siteTitle",
      media: "siteLogo",
    },
  },
});
