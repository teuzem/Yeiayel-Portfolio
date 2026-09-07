import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

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
  "ai-ml": { en: "AI/ML Project", fr: "Projet IA/ML" },
  "api-backend": { en: "API/Backend", fr: "API/Backend" },
  devops: { en: "DevOps/Infrastructure", fr: "DevOps/Infrastructure" },
  "open-source": { en: "Open Source", fr: "Open Source" },
  "cli-tool": { en: "CLI Tool", fr: "Outil CLI" },
  "desktop-app": { en: "Desktop App", fr: "Application Bureau" },
  "browser-extension": { en: "Browser Extension", fr: "Extension Navigateur" },
  game: { en: "Game", fr: "Jeu" },
  other: { en: "Other", fr: "Autre" },
};

export async function ProjectsSection({ locale = "en" }: { locale?: Locale }) {
  const { data: projects } = await sanityFetch<any[]>({
    query: PROJECTS_QUERY,
  });
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!projects || projects.length === 0) {
    return null;
  }

  const categoryLabel = (cat: string | null | undefined) => {
    if (!cat) return null;
    const map = CATEGORY_LABELS[cat];
    return map ? (isFr ? map.fr : map.en) : cat;
  };

  return (
    <section id="projects" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.projects.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {dict.projects.subtitle}
          </p>
        </div>

        <div className="@container">
          <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.slug?.current}
                className="@container/card group bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Project Image */}
                {project.coverImage && (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={urlFor(project.coverImage)
                        .width(600)
                        .height(400)
                        .url()}
                      alt={
                        isFr
                          ? project.titleFr ||
                            project.title ||
                            dict.projects.altImage
                          : project.title || dict.projects.altImage
                      }
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Glass overlay that fades on hover */}
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] group-hover:opacity-0 transition-opacity duration-300" />
                  </div>
                )}

                {/* Project Content */}
                <div className="p-4 @md/card:p-6 space-y-3 @md/card:space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {project.category && (
                        <span className="text-xs px-2 py-0.5 @md/card:py-1 rounded-full bg-primary/10 text-primary">
                          {categoryLabel(project.category)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg @md/card:text-xl font-semibold mb-2 line-clamp-2">
                      {isFr
                        ? project.titleFr || project.title
                        : project.title ||
                          "Untitled Project / Projet sans titre"}
                    </h3>
                    <p className="text-muted-foreground text-xs @md/card:text-sm line-clamp-2">
                      {isFr
                        ? project.taglineFr || project.tagline
                        : project.tagline}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 @md/card:gap-2">
                      {project.technologies
                        .slice(0, 4)
                        .map((tech: any, idx: number) => {
                          const techData =
                            tech && typeof tech === "object" && "name" in tech
                              ? tech
                              : null;
                          return techData?.name ? (
                            <span
                              key={`${project.slug?.current}-tech-${idx}`}
                              className="text-xs px-2 py-0.5 @md/card:py-1 rounded-md bg-muted"
                            >
                              {techData.name}
                            </span>
                          ) : null;
                        })}
                      {project.technologies.length > 4 && (
                        <span className="text-xs px-2 py-0.5 @md/card:py-1 rounded-md bg-muted">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col @xs/card:flex-row gap-2 @xs/card:gap-3 pt-2">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-3 py-2 @md/card:px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs @md/card:text-sm"
                      >
                        {dict.projects.liveDemo}
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 @md/card:px-4 rounded-lg border hover:bg-accent transition-colors text-xs @md/card:text-sm text-center"
                      >
                        {dict.projects.github}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
