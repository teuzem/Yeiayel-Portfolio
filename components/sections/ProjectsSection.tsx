import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ProjectMedia } from "./ProjectMedia";
import { ResponsiveDotCarousel } from "./ResponsiveDotCarousel";

const PROJECTS_QUERY =
  defineQuery(`*[_type == "project" && featured == true] | order(order asc)[0...6]{
  title,
  titleFr,
  slug,
  tagline,
  taglineFr,
  category,
  liveUrl,
  githubUrl,
  coverImage,
  technologies[]->{name, category, color}
}`);

const CATEGORY_LABELS: Record<string, { en: string; fr: string }> = {
  "web-app": { en: "Web Application", fr: "Application Web" },
  "mobile-app": { en: "Mobile App", fr: "Application Mobile" },
  "ai-ml": { en: "Intelligent Systems", fr: "Systèmes intelligents" },
  "api-backend": { en: "API/Backend", fr: "API/Backend" },
  devops: { en: "DevOps/Infrastructure", fr: "DevOps/Infrastructure" },
  "open-source": { en: "Open Source", fr: "Open Source" },
  "cli-tool": { en: "CLI Tool", fr: "Outil CLI" },
  "desktop-app": { en: "Desktop App", fr: "Application Bureau" },
  "browser-extension": { en: "Browser Extension", fr: "Extension Navigateur" },
  game: { en: "Game", fr: "Jeu" },
  other: { en: "Other", fr: "Autre" },
};

const PROJECT_OUTCOMES: Record<string, { en: string; fr: string }> = {
  "admission-desk": {
    en: "Digitizes international student recruitment and admission operations.",
    fr: "Digitalise le recrutement et l'admission des étudiants internationaux.",
  },
  "batir-le-pays-website": {
    en: "Creates a unified digital presence for a pan-African industrial group.",
    fr: "Crée une présence numérique unifiée pour un groupe industriel panafricain.",
  },
  "batir-le-pays-portfolio": {
    en: "Structures and showcases multidisciplinary construction and training work.",
    fr: "Structure et valorise des réalisations multidisciplinaires en BTP et formation.",
  },
  pryemo: {
    en: "Positions a digital-services startup with a clear, scalable web platform.",
    fr: "Positionne une startup de services numériques avec une plateforme web évolutive.",
  },
  "go2skul-web": {
    en: "Modernizes a multi-entity education ecosystem and local search presence.",
    fr: "Modernise un écosystème éducatif multi-entités et sa visibilité locale.",
  },
  "batir-le-pays-blog": {
    en: "Builds an editorial channel for industry knowledge and company news.",
    fr: "Développe un canal éditorial pour l'expertise métier et l'actualité du groupe.",
  },
};

export async function ProjectsSection({ locale = "en" }: { locale?: Locale }) {
  // biome-ignore lint/suspicious/noExplicitAny: generated Sanity result varies with the GROQ projection.
  const { data: projects } = await sanityFetch<any[]>({
    query: PROJECTS_QUERY,
  });
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!projects?.length) return null;

  const categoryLabel = (category: string | null | undefined) => {
    if (!category) return isFr ? "Produit numérique" : "Digital product";
    const labels = CATEGORY_LABELS[category];
    return labels ? labels[locale] : category;
  };

  const cards = projects.map((project, projectIndex) => {
    const slug = project.slug?.current || "";
    const title = isFr
      ? project.titleFr || project.title
      : project.title || project.titleFr;
    const tagline = isFr
      ? project.taglineFr || project.tagline
      : project.tagline || project.taglineFr;
    const cmsImage = project.coverImage
      ? urlFor(project.coverImage).width(1200).height(720).fit("crop").url()
      : null;
    const githubUrl =
      typeof project.githubUrl === "string" &&
      /^https:\/\/(www\.)?github\.com\//i.test(project.githubUrl)
        ? project.githubUrl
        : null;
    const outcome = PROJECT_OUTCOMES[slug]?.[locale] || tagline || "";

    return (
      <article
        key={slug || `${project.title}-${projectIndex}`}
        className="@container/card group flex min-h-[520px] min-w-0 flex-col overflow-hidden border bg-card transition-colors duration-300 hover:border-primary/50"
      >
        <ProjectMedia
          slug={slug}
          title={title || dict.projects.altImage}
          liveUrl={project.liveUrl}
          cmsImage={cmsImage}
          locale={locale}
        />

        <div className="flex flex-1 flex-col p-5 @md/card:p-6">
          <div className="flex items-center justify-between gap-4">
            <span className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              {categoryLabel(project.category)}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {String(projectIndex + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-tight">
            {title || "Untitled Project / Projet sans titre"}
          </h3>
          {tagline ? (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {tagline}
            </p>
          ) : null}
          {outcome ? (
            <div className="mt-5 border-l-2 border-primary pl-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {isFr ? "Impact" : "Outcome"}
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-medium leading-5">
                {outcome}
              </p>
            </div>
          ) : null}

          {project.technologies?.length ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.technologies
                .slice(0, 4)
                // biome-ignore lint/suspicious/noExplicitAny: Sanity reference projection is dynamic.
                .map((technology: any) => {
                  const name =
                    technology &&
                    typeof technology === "object" &&
                    "name" in technology
                      ? technology.name
                      : null;
                  return name ? (
                    <span
                      key={`${slug}-technology-${name}`}
                      className="inline-flex items-center gap-1 bg-muted px-2 py-1 text-[11px] font-medium"
                    >
                      <Code2 className="size-3" />
                      {name}
                    </span>
                  ) : null;
                })}
            </div>
          ) : null}

          <div className="mt-auto flex items-center gap-2 border-t pt-5">
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {dict.projects.liveDemo}
                <ArrowUpRight className="size-4" />
              </Link>
            ) : null}
            {githubUrl ? (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-10 place-items-center border hover:bg-muted"
                aria-label={dict.projects.github}
              >
                <ExternalLink className="size-4" />
              </Link>
            ) : null}
          </div>
        </div>
      </article>
    );
  });

  return (
    <section
      id="projects"
      className="border-y bg-muted/25 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="mb-10 grid gap-7 border-b pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Layers3 className="size-4" />
              {isFr ? "Produits et plateformes" : "Products and platforms"}
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              {dict.projects.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {dict.projects.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="size-5 text-primary" />
            {projects.length}{" "}
            {isFr ? "réalisations sélectionnées" : "selected projects"}
          </div>
        </div>

        <ResponsiveDotCarousel
          ariaLabel={dict.projects.title}
          items={cards}
          desktopItemsPerSlide={3}
          desktopGridClassName="grid grid-cols-3 gap-6"
          singleItemClassName="mx-auto w-full max-w-xl"
        />
      </div>
    </section>
  );
}
