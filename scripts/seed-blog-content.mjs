import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const token = (
  process.env.SANITY_SERVER_API_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  ""
).trim();
const overwrite = process.argv.includes("--overwrite");

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

const block = (text) => ({
  _key: `block-${Math.random().toString(36).slice(2, 10)}`,
  _type: "block",
  children: [
    {
      _key: `span-${Math.random().toString(36).slice(2, 10)}`,
      _type: "span",
      marks: [],
      text,
    },
  ],
  markDefs: [],
  style: "normal",
});

const now = new Date().toISOString();

const categories = [
  ["data-science", "Data Science", "Science des données", "#0F766E"],
  [
    "artificial-intelligence",
    "Artificial Intelligence",
    "Intelligence artificielle",
    "#2563EB",
  ],
  ["data-analysis", "Data Analysis", "Analyse de données", "#B45309"],
  [
    "software-engineering",
    "Software Engineering",
    "Ingénierie logicielle",
    "#7C3AED",
  ],
  [
    "cloud-security",
    "Cloud, DevOps & Security",
    "Cloud, DevOps et sécurité",
    "#BE123C",
  ],
  [
    "career-education",
    "Career & Education",
    "Carrière et formation",
    "#0369A1",
  ],
  ["product-reviews", "Product Reviews", "Évaluations de produits", "#A16207"],
  ["batir-le-pays", "Bâtir le Pays SARL", "Bâtir le Pays SARL", "#15803D"],
].map(([slug, title, titleFr, color]) => ({
  _id: `blog-category-${slug}`,
  _type: "blogCategory",
  title,
  titleFr,
  slug: { _type: "slug", current: slug },
  color,
}));

const author = {
  _id: "blog-author-yeiayel",
  _type: "blogAuthor",
  name: "NGOUMTSOP TEUZEM Yeiayel",
  role: "Data Scientist, AI Engineer and Digital Innovation Professional",
  roleFr:
    "Data Scientist, ingénieur IA et professionnel de l'innovation numérique",
  bio: "Writing about applied data science, responsible AI, software delivery, and practical digital innovation.",
  bioFr:
    "Écrit sur la data science appliquée, l'IA responsable, la livraison logicielle et l'innovation numérique concrète.",
};

const product = {
  _id: "blog-product-analytics-stack",
  _type: "blogProduct",
  name: "Practical analytics stack",
  brand: "Independent review",
  score: 4.5,
};

const posts = [
  {
    _id: "blog-post-data-products-2026",
    _type: "blog",
    title: "Building data products people can trust in 2026",
    titleFr:
      "Construire des produits data auxquels on peut faire confiance en 2026",
    slug: { _type: "slug", current: "building-trustworthy-data-products-2026" },
    excerpt:
      "A practical editorial framework for turning data work into products with clear ownership, measurable quality, and useful decisions.",
    excerptFr:
      "Un cadre éditorial pratique pour transformer le travail data en produits avec une responsabilité claire, une qualité mesurable et des décisions utiles.",
    content: [
      block(
        "The value of a data product is not the model alone. It is the repeatable decision it supports, the quality checks around it, and the people who can act on it.",
      ),
      block(
        "Start with one decision, name the accountable owner, document the source data, and make freshness and failure visible. This is the shortest path from experimentation to dependable operations.",
      ),
      block(
        "For teams working across business, public interest, and education contexts, transparent assumptions are a product feature rather than a technical afterthought.",
      ),
    ],
    contentFr: [
      block(
        "La valeur d'un produit data ne réside pas seulement dans le modèle. Elle se trouve dans la décision reproductible qu'il soutient, les contrôles de qualité qui l'entourent et les personnes capables d'agir.",
      ),
      block(
        "Commencez par une décision, nommez le responsable, documentez les données sources et rendez visibles la fraîcheur comme les défaillances. C'est le chemin le plus court entre l'expérimentation et des opérations fiables.",
      ),
      block(
        "Pour les équipes qui travaillent dans les entreprises, l'intérêt public et l'éducation, des hypothèses transparentes sont une fonctionnalité produit, pas une réflexion technique secondaire.",
      ),
    ],
    category: "data-science",
    categoryRef: { _type: "reference", _ref: "blog-category-data-science" },
    tags: ["data-products", "governance", "decision-making"],
    author: { _type: "reference", _ref: author._id },
    publishedAt: now,
    updatedAt: now,
    status: "published",
    featured: true,
    trending: true,
    readTime: 5,
    contentType: "Article",
    seoTitle: "Building trustworthy data products in 2026",
    seoTitleFr: "Construire des produits data fiables en 2026",
    seoDescription:
      "A practical framework for data products with clear ownership, quality checks, and decision value.",
    seoDescriptionFr:
      "Un cadre pratique pour des produits data avec responsabilité claire, contrôles qualité et valeur décisionnelle.",
  },
  {
    _id: "blog-post-responsible-ai-delivery",
    _type: "blog",
    title: "Responsible AI delivery: a practical team checklist",
    titleFr: "Livrer une IA responsable : checklist pratique pour les équipes",
    slug: { _type: "slug", current: "responsible-ai-delivery-checklist" },
    excerpt:
      "A delivery checklist that helps teams test usefulness, risk, human oversight, and communication before an AI feature reaches users.",
    excerptFr:
      "Une checklist de livraison qui aide les équipes à tester l'utilité, le risque, la supervision humaine et la communication avant qu'une fonctionnalité IA n'arrive aux utilisateurs.",
    content: [
      block(
        "Responsible AI delivery should be concrete. Define the intended user benefit, identify unacceptable outcomes, and keep an accountable human in the loop where the impact is significant.",
      ),
      block(
        "Before release, test representative inputs, measure basic quality, explain the feature limits in plain language, and provide a route to correct or escalate bad outcomes.",
      ),
    ],
    contentFr: [
      block(
        "La livraison d'une IA responsable doit rester concrète. Définissez le bénéfice attendu pour l'utilisateur, identifiez les résultats inacceptables et gardez un humain responsable dans la boucle lorsque l'impact est important.",
      ),
      block(
        "Avant la mise en production, testez des entrées représentatives, mesurez la qualité de base, expliquez les limites en langage clair et prévoyez un moyen de corriger ou d'escalader les mauvais résultats.",
      ),
    ],
    category: "ai-ml",
    categoryRef: {
      _type: "reference",
      _ref: "blog-category-artificial-intelligence",
    },
    tags: ["responsible-ai", "machine-learning", "product-delivery"],
    author: { _type: "reference", _ref: author._id },
    publishedAt: now,
    updatedAt: now,
    status: "published",
    trending: true,
    readTime: 4,
    contentType: "HowTo",
  },
  {
    _id: "blog-post-batir-le-pays-digital-innovation",
    _type: "blog",
    title: "Digital innovation that starts with useful local problems",
    titleFr:
      "L'innovation numérique qui commence par des problèmes locaux utiles",
    slug: {
      _type: "slug",
      current: "digital-innovation-useful-local-problems",
    },
    excerpt:
      "A perspective from Bâtir le Pays SARL on connecting data, services, and implementation to real community and business needs.",
    excerptFr:
      "Une perspective de Bâtir le Pays SARL sur la connexion entre données, services et mise en œuvre pour répondre à des besoins réels des communautés et des entreprises.",
    content: [
      block(
        "Digital innovation gains relevance when it begins with a clear local problem, the people affected by it, and the constraints of the environment where the solution must operate.",
      ),
      block(
        "At Bâtir le Pays SARL, the most useful work connects data literacy, dependable delivery, and practical adoption. Technology matters when it improves an existing process and can be maintained by the people who use it.",
      ),
    ],
    contentFr: [
      block(
        "L'innovation numérique gagne en pertinence lorsqu'elle commence par un problème local clair, les personnes concernées et les contraintes de l'environnement où la solution doit fonctionner.",
      ),
      block(
        "Chez Bâtir le Pays SARL, le travail le plus utile relie la culture data, une livraison fiable et une adoption concrète. La technologie compte lorsqu'elle améliore un processus existant et peut être maintenue par les personnes qui l'utilisent.",
      ),
    ],
    category: "batir-le-pays",
    categoryRef: { _type: "reference", _ref: "blog-category-batir-le-pays" },
    tags: ["digital-innovation", "data-literacy", "implementation"],
    author: { _type: "reference", _ref: author._id },
    publishedAt: now,
    updatedAt: now,
    status: "published",
    readTime: 4,
    contentType: "Opinion",
  },
  {
    _id: "blog-post-analytics-stack-review",
    _type: "blog",
    title: "Product review: choosing a practical analytics stack",
    titleFr: "Évaluation produit : choisir une stack analytique pratique",
    slug: { _type: "slug", current: "practical-analytics-stack-review" },
    excerpt:
      "How to assess an analytics stack for data access, collaboration, governance, cost discipline, and long-term maintainability.",
    excerptFr:
      "Comment évaluer une stack analytique selon l'accès aux données, la collaboration, la gouvernance, la maîtrise des coûts et la maintenabilité à long terme.",
    content: [
      block(
        "There is no universally correct analytics stack. A strong choice fits the team’s skill level, data volume, governance needs, and operating budget.",
      ),
      block(
        "Evaluate products using real workflows: getting data in, changing a definition, reviewing an analysis, controlling access, and handing the work to another teammate. These moments reveal more than feature lists.",
      ),
    ],
    contentFr: [
      block(
        "Il n'existe pas de stack analytique universellement correcte. Un bon choix correspond au niveau de l'équipe, au volume de données, aux besoins de gouvernance et au budget d'exploitation.",
      ),
      block(
        "Évaluez les produits à partir de flux de travail réels : importer les données, modifier une définition, relire une analyse, contrôler les accès et transmettre le travail à un autre collègue. Ces moments révèlent davantage que les listes de fonctionnalités.",
      ),
    ],
    category: "review",
    categoryRef: {
      _type: "reference",
      _ref: "blog-category-product-reviews",
    },
    tags: ["product-review", "analytics", "data-platform"],
    author: { _type: "reference", _ref: author._id },
    product: { _type: "reference", _ref: product._id },
    publishedAt: now,
    updatedAt: now,
    status: "published",
    readTime: 4,
    contentType: "Review",
  },
];

const documents = [
  ...categories,
  author,
  product,
  {
    _id: "singleton-blogSettings",
    _type: "blogSettings",
    name: "Yeiayel Journal",
    nameFr: "Journal Yeiayel",
    heroTitle: "Applied ideas for a useful digital future",
    heroTitleFr: "Des idées appliquées pour un avenir numérique utile",
    heroDescription:
      "Data science, AI, software engineering, digital education, and practical innovation from a portfolio grounded in real delivery.",
    heroDescriptionFr:
      "Data science, IA, ingénierie logicielle, éducation numérique et innovation concrète à partir d'un portfolio ancré dans des réalisations réelles.",
    position: "Data Science and digital innovation at Bâtir le Pays SARL",
    positionFr: "Data Science et innovation numérique chez Bâtir le Pays SARL",
    accentColor: "#0F766E",
  },
  ...posts,
];

for (const document of documents) {
  if (overwrite) {
    await client.createOrReplace(document);
  } else {
    await client.createIfNotExists(document);
  }
}

console.log(
  `Seeded ${documents.length} blog documents in ${projectId}/${dataset} (${overwrite ? "overwritten when present" : "existing documents preserved"}).`,
);
