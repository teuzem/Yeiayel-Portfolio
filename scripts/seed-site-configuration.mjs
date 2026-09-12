import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const token = (
  process.env.SANITY_SERVER_API_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  ""
).trim();

if (!projectId || !dataset || !token) {
  throw new Error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_SERVER_API_TOKEN before seeding.",
  );
}

const client = createClient({
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-15",
  dataset,
  projectId,
  token,
  useCdn: false,
});

const canonicalUrl = (() => {
  const candidate = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!candidate) return undefined;
  try {
    return new URL(candidate).origin;
  } catch {
    return undefined;
  }
})();

const faviconPath = fileURLToPath(
  new URL("../public/data-science-mark.png", import.meta.url),
);
const faviconAsset = await client.assets.upload(
  "image",
  createReadStream(faviconPath),
  {
    filename: "yeiayel-data-science-favicon.png",
    contentType: "image/png",
  },
);
const favicon = {
  _type: "image",
  asset: { _type: "reference", _ref: faviconAsset._id },
  alt: "Yeiayel data science mark",
};

const [currentSiteSettings, currentBlogSettings, currentNavigationIds] =
  await Promise.all([
    client.getDocument("singleton-siteSettings"),
    client.getDocument("singleton-blogSettings"),
    client.fetch(`*[_type == "navigation"]._id`),
  ]);
const {
  _rev: _siteRevision,
  _createdAt: _siteCreatedAt,
  _updatedAt: _siteUpdatedAt,
  ...siteSettingsBase
} = currentSiteSettings || {};
const {
  _rev: _blogRevision,
  _createdAt: _blogCreatedAt,
  _updatedAt: _blogUpdatedAt,
  ...blogSettingsBase
} = currentBlogSettings || {};

const year = new Date().getUTCFullYear();
const siteSettings = {
  ...siteSettingsBase,
  _id: "singleton-siteSettings",
  _type: "siteSettings",
  siteTitle: "NGOUMTSOP TEUZEM Yeiayel | Data Scientist & Software Engineer",
  siteTitleFr: "NGOUMTSOP TEUZEM Yeiayel | Data scientist & ingénieur logiciel",
  siteDescription:
    "Portfolio of NGOUMTSOP TEUZEM Yeiayel: data science, analytics, software engineering, cloud systems, and digital innovation.",
  siteDescriptionFr:
    "Portfolio de NGOUMTSOP TEUZEM Yeiayel : data science, analyse, ingénierie logicielle, cloud et innovation numérique.",
  siteKeywords: [
    "NGOUMTSOP TEUZEM Yeiayel",
    "data scientist Cameroon",
    "data science Africa",
    "data analytics",
    "machine learning",
    "software engineering",
    "full-stack development",
    "cloud architecture",
    "digital innovation",
    "Bâtir le Pays SARL",
  ],
  siteKeywordsFr: [
    "NGOUMTSOP TEUZEM Yeiayel",
    "data scientist Cameroun",
    "science des données Afrique",
    "analyse de données",
    "apprentissage automatique",
    "ingénierie logicielle",
    "développement full-stack",
    "architecture cloud",
    "innovation numérique",
    "Bâtir le Pays SARL",
  ],
  ...(canonicalUrl ? { canonicalUrl } : {}),
  robotsIndex: true,
  favicon,
  primaryColor: "#0B1726",
  secondaryColor: "#35C6A5",
  accentColor: "#F5B942",
  ctaText: "Discuss a project",
  ctaTextFr: "Discuter d'un projet",
  ctaUrl: "/#contact",
  heroHeadline: "Data science and digital products built for real outcomes",
  heroHeadlineFr:
    "Data science et produits numériques conçus pour des résultats concrets",
  heroSubheadline:
    "I connect data, software engineering, and delivery strategy to build dependable solutions for organizations in Africa and worldwide.",
  heroSubheadlineFr:
    "Je relie les données, l'ingénierie logicielle et la stratégie de réalisation pour créer des solutions fiables en Afrique et dans le monde.",
  showBlog: true,
  showServices: true,
  showTestimonials: true,
  footer: {
    ...(currentSiteSettings?.footer || {}),
    text: "Data science, software engineering, and digital innovation grounded in practical delivery.",
    textFr:
      "Data science, ingénierie logicielle et innovation numérique ancrées dans des réalisations concrètes.",
    copyrightText: `© ${year} NGOUMTSOP TEUZEM Yeiayel. All rights reserved.`,
    copyrightTextFr: `© ${year} NGOUMTSOP TEUZEM Yeiayel. Tous droits réservés.`,
    links: [
      {
        _key: "portfolio",
        _type: "object",
        title: "Portfolio",
        titleFr: "Portfolio",
        url: "/",
      },
      {
        _key: "journal",
        _type: "object",
        title: "Journal",
        titleFr: "Journal",
        url: "/blog",
      },
      {
        _key: "services",
        _type: "object",
        title: "Services",
        titleFr: "Services",
        url: "/#services",
      },
      {
        _key: "contact",
        _type: "object",
        title: "Contact",
        titleFr: "Contact",
        url: "/#contact",
      },
    ],
  },
  maintenanceMode: false,
  maintenanceMessage:
    "The portfolio is receiving a scheduled update. Please return shortly.",
  maintenanceMessageFr:
    "Le portfolio bénéficie d'une mise à jour planifiée. Revenez dans quelques instants.",
};

const blogSettings = {
  ...blogSettingsBase,
  _id: "singleton-blogSettings",
  _type: "blogSettings",
  name: "Yeiayel Journal",
  nameFr: "Journal Yeiayel",
  heroTitle: "Field-tested ideas for useful digital progress",
  heroTitleFr: "Des idées éprouvées pour un progrès numérique utile",
  heroDescription:
    "Practical analysis of data science, analytics, software engineering, cloud systems, education, and digital innovation.",
  heroDescriptionFr:
    "Analyses pratiques sur la data science, l'analyse, l'ingénierie logicielle, le cloud, l'éducation et l'innovation numérique.",
  position: "Data science and digital innovation at Bâtir le Pays SARL",
  positionFr: "Data science et innovation numérique chez Bâtir le Pays SARL",
  accentColor: "#35C6A5",
  advertisement: {
    ...(currentBlogSettings?.advertisement || {}),
    enabled: true,
    title: "Build a dependable data or digital product",
    titleFr: "Construisez un produit data ou numérique fiable",
    description:
      "Move from a business need to a maintainable solution with clear delivery, documentation, and measurable outcomes.",
    descriptionFr:
      "Passez d'un besoin métier à une solution maintenable avec une réalisation claire, une documentation complète et des résultats mesurables.",
    link: "/#contact",
    buttonLabel: "Discuss your project",
    buttonLabelFr: "Discuter de votre projet",
  },
};

const navigation = [
  ["home", "Home", "Accueil", "#home", "IconHome", 0],
  ["about", "About", "À propos", "#about", "IconUser", 10],
  [
    "testimonials",
    "Testimonials",
    "Témoignages",
    "#testimonials",
    "IconMessageStar",
    20,
  ],
  ["skills", "Skills", "Compétences", "#skills", "IconChartBar", 30],
  [
    "experience",
    "Experience",
    "Expérience",
    "#experience",
    "IconBriefcase",
    40,
  ],
  ["education", "Education", "Formation", "#education", "IconSchool", 50],
  ["projects", "Projects", "Projets", "#projects", "IconCode", 60],
  [
    "certifications",
    "Certifications",
    "Certifications",
    "#certifications",
    "IconCertificate",
    70,
  ],
  [
    "achievements",
    "Achievements",
    "Distinctions",
    "#achievements",
    "IconAward",
    80,
  ],
  ["blog", "Journal", "Journal", "/blog", "IconNews", 90],
  ["services", "Services", "Services", "#services", "IconRocket", 100],
  ["contact", "Contact", "Contact", "#contact", "IconMail", 110],
].map(([id, title, titleFr, href, icon, order]) => ({
  _id: `navigation-${id}`,
  _type: "navigation",
  title,
  titleFr,
  href,
  icon,
  isExternal: false,
  order,
}));

const transaction = client
  .transaction()
  .createOrReplace(siteSettings)
  .createOrReplace(blogSettings);

const canonicalNavigationIds = new Set(navigation.map((item) => item._id));
for (const id of currentNavigationIds) {
  if (!canonicalNavigationIds.has(id)) transaction.delete(id);
}

for (const item of navigation) {
  transaction.createOrReplace(item);
}

await transaction.commit();

const verification = await client.fetch(`{
  "siteReady": defined(*[_id == "singleton-siteSettings"][0].favicon.asset)
    && defined(*[_id == "singleton-siteSettings"][0].siteTitleFr),
  "blogReady": defined(*[_id == "singleton-blogSettings"][0].heroTitleFr),
  "localizedNavigation": count(*[_type == "navigation" && defined(titleFr)])
}`);

if (
  !verification.siteReady ||
  !verification.blogReady ||
  verification.localizedNavigation !== navigation.length
) {
  throw new Error(
    `Sanity verification failed: ${JSON.stringify(verification)}`,
  );
}

console.log(
  `Seeded and verified bilingual site settings, blog settings, favicon, and ${navigation.length} navigation items in ${projectId}/${dataset}.`,
);
