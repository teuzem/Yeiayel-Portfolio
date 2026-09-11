import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { CareerTimelineCarousel } from "./CareerTimelineCarousel";

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

interface ExperienceRow {
  company?: string | null;
  position?: string | null;
  positionFr?: string | null;
  employmentType?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean | null;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS Portable Text is dynamic.
  description?: any;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS Portable Text is dynamic.
  descriptionFr?: any;
  responsibilities?: string[] | null;
  responsibilitiesFr?: string[] | null;
  achievements?: string[] | null;
  achievementsFr?: string[] | null;
  technologies?: Array<{ name?: string | null }> | null;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity image fields use generated dynamic types.
  companyLogo?: any;
}

export async function ExperienceSection({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const { data: experiences } = await sanityFetch<ExperienceRow[]>({
    query: EXPERIENCE_QUERY,
  });
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!experiences?.length) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
    });

  const timelineItems = experiences.map((exp) => {
    const position = isFr
      ? exp.positionFr || exp.position
      : exp.position || exp.positionFr;
    const description = isFr
      ? exp.descriptionFr || exp.description
      : exp.description || exp.descriptionFr;
    const responsibilities = isFr
      ? exp.responsibilitiesFr || exp.responsibilities || []
      : exp.responsibilities || exp.responsibilitiesFr || [];
    const achievements = isFr
      ? exp.achievementsFr || exp.achievements || []
      : exp.achievements || exp.achievementsFr || [];
    const period = `${exp.startDate ? formatDate(exp.startDate) : ""} - ${
      exp.current
        ? dict.experience.present
        : exp.endDate
          ? formatDate(exp.endDate)
          : "N/A"
    }`;

    return {
      company: exp.company || "",
      period,
      current: Boolean(exp.current),
      content: (
        <article className="@container/card overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="h-1.5 bg-primary" />
          <div className="p-5 @md/card:p-8">
            <div className="mb-5 flex flex-col gap-4 @md/card:flex-row @md/card:items-start">
              {exp.companyLogo ? (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border bg-background @md/card:size-16">
                  <Image
                    src={urlFor(exp.companyLogo).width(128).height(128).url()}
                    alt={`${exp.company || "Company"} logo`}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold leading-tight @md/card:text-2xl">
                  {position}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="font-medium text-primary @md/card:text-lg">
                    {exp.company}
                  </p>
                  {exp.employmentType ? (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {exp.employmentType}
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground @md/card:text-sm">
                  <span>{period}</span>
                  {exp.location ? (
                    <>
                      <span>•</span>
                      <span>{exp.location}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {description ? (
              <div className="mb-6 text-sm leading-7 text-muted-foreground @md/card:text-base">
                <PortableText value={description} />
              </div>
            ) : null}

            <div className="grid gap-6 @2xl/card:grid-cols-2">
              {responsibilities.length > 0 ? (
                <div>
                  <h4 className="mb-3 text-sm font-semibold @md/card:text-base">
                    {dict.experience.responsibilities}
                  </h4>
                  <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                    {responsibilities
                      .slice(0, 4)
                      .map((responsibility, index) => (
                        <li
                          key={`${exp.company}-responsibility-${index}`}
                          className="flex gap-2"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{responsibility}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}

              {achievements.length > 0 ? (
                <div>
                  <h4 className="mb-3 text-sm font-semibold @md/card:text-base">
                    {dict.experience.achievements}
                  </h4>
                  <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                    {achievements.slice(0, 4).map((achievement, index) => (
                      <li
                        key={`${exp.company}-achievement-${index}`}
                        className="flex gap-2"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {exp.technologies?.length ? (
              <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
                {exp.technologies.map((technology, index) =>
                  technology?.name ? (
                    <span
                      key={`${exp.company}-technology-${index}`}
                      className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {technology.name}
                    </span>
                  ) : null,
                )}
              </div>
            ) : null}
          </div>
        </article>
      ),
    };
  });

  return (
    <section id="experience" className="px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            {dict.experience.title}
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            {dict.experience.subtitle}
          </p>
        </div>
        <CareerTimelineCarousel
          ariaLabel={dict.experience.title}
          items={timelineItems}
        />
      </div>
    </section>
  );
}
