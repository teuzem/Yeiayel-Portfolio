import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const EXPERIENCE_QUERY =
  defineQuery(`*[_type == "experience"] | order(startDate desc){
  company,
  position,
  positionFr,
  employmentType,
  location,
  startDate,
  endDate,
  current,
  description,
  descriptionFr,
  responsibilities,
  responsibilitiesFr,
  achievements,
  achievementsFr,
  technologies[]->{name, category},
  companyLogo,
  companyWebsite
}`);

export async function ExperienceSection({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const { data: experiences } = await sanityFetch({ query: EXPERIENCE_QUERY });
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!experiences || experiences.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      locale === "fr" ? "fr-FR" : "en-US",
      {
        year: "numeric",
        month: "short",
      },
    );
  };

  return (
    <section id="experience" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.experience.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {dict.experience.subtitle}
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map(
            (exp: {
              company?: string | null;
              position?: string | null;
              positionFr?: string | null;
              employmentType?: string | null;
              location?: string | null;
              startDate?: string | null;
              endDate?: string | null;
              current?: boolean | null;
              // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS dynamic content
              description?: any;
              // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS dynamic content
              descriptionFr?: any;
              responsibilities?: string[] | null;
              responsibilitiesFr?: string[] | null;
              achievements?: string[] | null;
              achievementsFr?: string[] | null;
              technologies?: Array<{ name?: string | null }> | null;
              // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS dynamic content
              companyLogo?: any;
              companyWebsite?: string | null;
            }) => {
              const position = isFr
                ? exp.positionFr || exp.position
                : exp.position;
              const description = isFr
                ? exp.descriptionFr || exp.description
                : exp.description;
              const responsibilities = isFr
                ? exp.responsibilitiesFr || exp.responsibilities || []
                : exp.responsibilities || [];
              const achievements = isFr
                ? exp.achievementsFr || exp.achievements || []
                : exp.achievements || [];

              return (
                <div
                  key={`${exp.company}-${exp.position}-${exp.startDate}`}
                  className="relative pl-8 pb-8 border-l-2 border-muted last:border-l-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                  <div className="@container/card bg-card border rounded-lg p-4 @md/card:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col @md/card:flex-row @md/card:items-start gap-4 mb-4">
                      {exp.companyLogo && (
                        <div className="relative w-12 h-12 @md/card:w-16 @md/card:h-16 rounded-lg overflow-hidden border shrink-0">
                          <Image
                            src={urlFor(exp.companyLogo)
                              .width(64)
                              .height(64)
                              .url()}
                            alt={`${exp.company} company logo`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl @md/card:text-2xl font-semibold line-clamp-2">
                          {position}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-base @md/card:text-lg text-primary font-medium truncate">
                            {exp.company}
                          </p>
                          {exp.employmentType && (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-xs @md/card:text-sm text-muted-foreground">
                                {exp.employmentType}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs @md/card:text-sm text-muted-foreground">
                          <span>
                            {exp.startDate && formatDate(exp.startDate)} -{" "}
                            {exp.current
                              ? dict.experience.present
                              : exp.endDate
                                ? formatDate(exp.endDate)
                                : "N/A"}
                          </span>
                          {exp.location && (
                            <>
                              <span>•</span>
                              <span className="truncate">{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {description && (
                      <div className="text-muted-foreground mb-4 text-sm @md/card:text-base">
                        <PortableText value={description} />
                      </div>
                    )}

                    {responsibilities && responsibilities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm @md/card:text-base">
                          {dict.experience.responsibilities}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs @md/card:text-sm">
                          {responsibilities.map((resp, idx) => (
                            <li key={`${exp.company}-resp-${idx}`}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {achievements && achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm @md/card:text-base">
                          {dict.experience.achievements}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs @md/card:text-sm">
                          {achievements.map((achievement, idx) => (
                            <li key={`${exp.company}-achievement-${idx}`}>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 @md/card:gap-2 mt-4">
                        {exp.technologies.map((tech, techIdx) => {
                          const techData =
                            tech && typeof tech === "object" && "name" in tech
                              ? tech
                              : null;
                          return techData?.name ? (
                            <span
                              key={`${exp.company}-tech-${techIdx}`}
                              className="px-2 py-0.5 @md/card:px-3 @md/card:py-1 text-xs rounded-full bg-primary/10 text-primary"
                            >
                              {techData.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
