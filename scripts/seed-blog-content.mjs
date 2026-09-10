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

const categoryDescriptions = {
  "data-science": {
    description: "Models, data products, governance, and decision systems.",
    descriptionFr:
      "Modèles, produits data, gouvernance et systèmes de décision.",
  },
  "artificial-intelligence": {
    description:
      "Applied AI, machine learning, agents, and responsible delivery.",
    descriptionFr:
      "IA appliquée, machine learning, agents et livraison responsable.",
  },
  "data-analysis": {
    description:
      "Analytics methods, dashboards, visualization, and business insight.",
    descriptionFr:
      "Méthodes analytiques, tableaux de bord, visualisation et aide à la décision.",
  },
  "software-engineering": {
    description:
      "Full-stack systems, Python, web platforms, and product engineering.",
    descriptionFr:
      "Systèmes full-stack, Python, plateformes web et ingénierie produit.",
  },
  "cloud-security": {
    description:
      "Reliable deployments, infrastructure, networks, security, and operations.",
    descriptionFr:
      "Déploiements fiables, infrastructure, réseaux, sécurité et opérations.",
  },
  "career-education": {
    description:
      "Learning paths, professional development, and digital education.",
    descriptionFr:
      "Parcours d'apprentissage, évolution professionnelle et éducation numérique.",
  },
  "product-reviews": {
    description:
      "Evidence-based reviews of data, AI, cloud, and developer tools.",
    descriptionFr:
      "Évaluations argumentées des outils data, IA, cloud et développement.",
  },
  "batir-le-pays": {
    description:
      "Digital innovation and practical perspectives from Bâtir le Pays SARL.",
    descriptionFr:
      "Innovation numérique et perspectives pratiques de Bâtir le Pays SARL.",
  },
};

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
  ...categoryDescriptions[slug],
  color,
}));

const author = {
  _id: "blog-author-yeiayel",
  _type: "blogAuthor",
  name: "NGOUMTSOP TEUZEM Yeiayel",
  slug: { _type: "slug", current: "ngoumtsop-teuzem-yeiayel" },
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
  slug: { _type: "slug", current: "practical-analytics-stack" },
  brand: "Independent review",
  description:
    "A practical assessment framework for analytics platforms, collaboration, governance, and maintainability.",
  descriptionFr:
    "Un cadre d'évaluation pratique des plateformes analytiques, de la collaboration, de la gouvernance et de la maintenabilité.",
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

const additionalPostBlueprints = [
  [
    "data-science",
    "Designing a measurable data quality contract",
    "Concevoir un contrat de qualité des données mesurable",
    "A field guide to freshness, completeness, validity, and ownership checks that teams can operate every day.",
    "Un guide pratique des contrôles de fraîcheur, complétude, validité et responsabilité que les équipes peuvent opérer chaque jour.",
    ["data-quality", "governance", "operations"],
    "HowTo",
  ],
  [
    "data-science",
    "From notebook to reliable machine learning service",
    "Du notebook au service de machine learning fiable",
    "The engineering decisions that turn an experiment into a monitored, versioned, and maintainable service.",
    "Les décisions d'ingénierie qui transforment une expérimentation en service versionné, surveillé et maintenable.",
    ["mlops", "machine-learning", "deployment"],
    "HowTo",
  ],
  [
    "ai-ml",
    "What an AI Twin needs before it reaches users",
    "Ce qu'un jumeau IA doit avoir avant d'atteindre ses utilisateurs",
    "Memory, feedback, citations, multilingual behavior, and graceful provider failover for dependable AI conversations.",
    "Mémoire, feedback, citations, comportement multilingue et bascule entre fournisseurs pour des conversations IA fiables.",
    ["ai-twin", "agents", "product-design"],
    "Article",
  ],
  [
    "ai-ml",
    "Grounded generation: keeping answers tied to evidence",
    "Génération fondée sur les preuves : garder les réponses ancrées dans les faits",
    "A practical explanation of retrieval, source quality, citation discipline, and refusal behavior for factual assistants.",
    "Une explication pratique de la recherche, de la qualité des sources, des citations et du refus responsable pour les assistants factuels.",
    ["rag", "citations", "responsible-ai"],
    "HowTo",
  ],
  [
    "ai-ml",
    "Multilingual AI is a product requirement, not a translation layer",
    "L'IA multilingue est une exigence produit, pas une simple traduction",
    "How to design prompts, memory, UI copy, and evaluation around the active language from the first interaction.",
    "Comment concevoir les prompts, la mémoire, l'interface et l'évaluation autour de la langue active dès la première interaction.",
    ["multilingual-ai", "localization", "evaluation"],
    "Opinion",
  ],
  [
    "data-analysis",
    "A dashboard is a decision system",
    "Un tableau de bord est un système de décision",
    "Why good analytics starts with decisions, definitions, audience, and action instead of chart volume.",
    "Pourquoi une bonne analyse commence par les décisions, les définitions, l'audience et l'action plutôt que par le nombre de graphiques.",
    ["analytics", "dashboards", "decision-making"],
    "Article",
  ],
  [
    "data-analysis",
    "Choosing the right chart for the question",
    "Choisir le bon graphique pour la bonne question",
    "A practical visual guide to comparisons, trends, distributions, relationships, and uncertainty.",
    "Un guide visuel pratique des comparaisons, tendances, distributions, relations et incertitudes.",
    ["visualization", "storytelling", "analytics"],
    "Guide",
  ],
  [
    "data-analysis",
    "Data storytelling for technical and non-technical teams",
    "Raconter les données aux équipes techniques et métiers",
    "A repeatable structure for moving from evidence to a clear recommendation without overstating certainty.",
    "Une structure reproductible pour passer des faits à une recommandation claire sans exagérer la certitude.",
    ["data-storytelling", "communication", "insight"],
    "HowTo",
  ],
  [
    "software-engineering",
    "Building a production-ready Next.js application",
    "Construire une application Next.js prête pour la production",
    "A deployment-minded checklist covering configuration, runtime errors, caching, metadata, and health checks.",
    "Une checklist orientée déploiement couvrant configuration, erreurs d'exécution, cache, métadonnées et contrôles de santé.",
    ["nextjs", "production", "web-development"],
    "HowTo",
  ],
  [
    "software-engineering",
    "Python project structure that scales with the team",
    "Une structure de projet Python qui accompagne la croissance de l'équipe",
    "Organize modules, tests, configuration, and documentation so the codebase stays understandable as features grow.",
    "Organiser modules, tests, configuration et documentation pour garder une base compréhensible à mesure que les fonctionnalités grandissent.",
    ["python", "architecture", "testing"],
    "Guide",
  ],
  [
    "software-engineering",
    "API design principles for trustworthy services",
    "Principes de conception d'API pour des services fiables",
    "Naming, validation, errors, idempotency, observability, and versioning for APIs that clients can depend on.",
    "Nommage, validation, erreurs, idempotence, observabilité et versionnement pour des API fiables.",
    ["api-design", "backend", "reliability"],
    "Article",
  ],
  [
    "cloud-security",
    "A calm deployment checklist for small teams",
    "Une checklist de déploiement sereine pour les petites équipes",
    "Environment variables, process managers, reverse proxies, logs, backups, and restart procedures in one practical flow.",
    "Variables d'environnement, gestionnaires de processus, reverse proxy, journaux, sauvegardes et redémarrage dans un seul flux pratique.",
    ["devops", "hosting", "deployment"],
    "HowTo",
  ],
  [
    "cloud-security",
    "Security basics every data product should ship with",
    "Les bases de sécurité de tout produit data",
    "Least privilege, secret handling, input validation, audit trails, and incident readiness without unnecessary complexity.",
    "Moindre privilège, gestion des secrets, validation des entrées, traces d'audit et préparation aux incidents sans complexité inutile.",
    ["security", "privacy", "data-products"],
    "Article",
  ],
  [
    "cloud-security",
    "Networks and observability for dependable applications",
    "Réseaux et observabilité pour des applications fiables",
    "Understand the path from browser to server and the signals that reveal latency, failures, and capacity problems.",
    "Comprendre le chemin du navigateur au serveur et les signaux qui révèlent latence, pannes et problèmes de capacité.",
    ["networks", "observability", "infrastructure"],
    "Guide",
  ],
  [
    "career-education",
    "A practical learning path into data science",
    "Un parcours d'apprentissage pratique vers la data science",
    "Build capability through fundamentals, projects, communication, and feedback instead of collecting disconnected tools.",
    "Développer ses compétences avec les fondamentaux, les projets, la communication et le feedback plutôt que d'empiler des outils.",
    ["learning", "career", "data-science"],
    "Guide",
  ],
  [
    "career-education",
    "How to explain technical work in an interview",
    "Comment expliquer son travail technique en entretien",
    "A clear structure for describing context, trade-offs, implementation, evidence, and lessons learned.",
    "Une structure claire pour présenter contexte, compromis, réalisation, preuves et enseignements.",
    ["career", "interviews", "communication"],
    "HowTo",
  ],
  [
    "batir-le-pays",
    "Digital education that respects the local context",
    "Une éducation numérique qui respecte le contexte local",
    "Why adoption, language, access, and maintenance matter as much as the platform itself.",
    "Pourquoi l'adoption, la langue, l'accès et la maintenance comptent autant que la plateforme elle-même.",
    ["digital-education", "local-impact", "innovation"],
    "Opinion",
  ],
  [
    "batir-le-pays",
    "Turning community needs into useful digital services",
    "Transformer les besoins des communautés en services numériques utiles",
    "A service-design perspective grounded in listening, prototyping, measurement, and sustainable ownership.",
    "Une perspective de conception de services fondée sur l'écoute, le prototypage, la mesure et une responsabilité durable.",
    ["service-design", "impact", "implementation"],
    "Article",
  ],
  [
    "review",
    "Product review: a practical developer workflow",
    "Évaluation produit : un workflow développeur pratique",
    "A neutral framework for reviewing tools through setup, daily use, collaboration, reliability, and total cost.",
    "Un cadre neutre pour évaluer les outils selon l'installation, l'usage quotidien, la collaboration, la fiabilité et le coût total.",
    ["product-review", "developer-tools", "workflow"],
    "Review",
  ],
  [
    "review",
    "How to evaluate an AI tool without hype",
    "Comment évaluer un outil IA sans effet de mode",
    "Use cases, failure modes, privacy, evidence, and operating cost form a stronger review than a feature checklist.",
    "Les cas d'usage, limites, confidentialité, preuves et coûts d'exploitation forment une meilleure évaluation qu'une simple liste de fonctionnalités.",
    ["ai-tools", "product-review", "evaluation"],
    "Review",
  ],
];

const additionalPosts = additionalPostBlueprints.map(
  (
    [category, title, titleFr, excerpt, excerptFr, tags, contentType],
    index,
  ) => {
    const slug = String(title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const frBody = `${excerptFr} Cette publication propose une méthode directement applicable, avec des hypothèses claires et des critères de vérification.`;
    const enBody = `${excerpt} This article proposes a directly usable method with clear assumptions and practical verification criteria.`;
    const categoryRef =
      category === "ai-ml"
        ? "blog-category-artificial-intelligence"
        : category === "review"
          ? "blog-category-product-reviews"
          : `blog-category-${category}`;
    return {
      _id: `blog-post-${slug}`,
      _type: "blog",
      title,
      titleFr,
      slug: { _type: "slug", current: slug },
      excerpt,
      excerptFr,
      content: [
        block(enBody),
        block(
          `At Bâtir le Pays SARL, the useful question is always how this practice improves a real decision, service, or learning outcome.`,
        ),
      ],
      contentFr: [
        block(frBody),
        block(
          `Chez Bâtir le Pays SARL, la question utile reste toujours de savoir comment cette pratique améliore une décision, un service ou un résultat d'apprentissage réel.`,
        ),
      ],
      category: category === "review" ? "review" : category,
      categoryRef: { _type: "reference", _ref: categoryRef },
      tags,
      author: { _type: "reference", _ref: author._id },
      publishedAt: now,
      updatedAt: now,
      status: "published",
      featured: false,
      trending: index < 6,
      readTime: 4 + (index % 4),
      contentType,
      seoTitle: title,
      seoTitleFr: titleFr,
      seoDescription: excerpt,
      seoDescriptionFr: excerptFr,
    };
  },
);

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
  ...additionalPosts,
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
