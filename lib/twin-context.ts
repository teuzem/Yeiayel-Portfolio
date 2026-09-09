import "server-only";

import { defineQuery } from "next-sanity";
import {
  EMPTY_CONTEXT,
  normalizeProfile,
  type TwinContext,
  type TwinLocale,
  type TwinProfile,
} from "@/lib/twin";
import { sanityFetch } from "@/sanity/lib/live";

const PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName, lastName, headline, headlineFr, shortBio, shortBioFr, location,
  availability, yearsOfExperience, email, phone
}`);

const EXPERIENCE_QUERY =
  defineQuery(`*[_type == "experience"] | order(startDate desc)[0...20]{
  company, position, positionFr, location, startDate, endDate, current,
  description, descriptionFr, responsibilities, responsibilitiesFr,
  achievements, achievementsFr
}`);

const PROJECTS_QUERY =
  defineQuery(`*[_type == "project"] | order(featured desc, _createdAt desc)[0...24]{
  title, titleFr, tagline, taglineFr, technologies[]->{name}, liveUrl,
  githubUrl, category, featured
}`);

const SKILLS_QUERY =
  defineQuery(`*[_type == "skill"] | order(proficiency desc, category asc)[0...80]{
  name, category, proficiency, yearsOfExperience
}`);

const EDUCATION_QUERY =
  defineQuery(`*[_type == "education"] | order(endDate desc)[0...12]{
  institution, degree, degreeFr, fieldOfStudy, fieldOfStudyFr, startDate,
  endDate, description, descriptionFr, gpa
}`);

const CERTIFICATIONS_QUERY =
  defineQuery(`*[_type == "certification"] | order(issueDate desc)[0...20]{
  name, nameFr, issuer, issueDate, expiryDate, description, descriptionFr
}`);

const ACHIEVEMENTS_QUERY =
  defineQuery(`*[_type == "achievement"] | order(date desc)[0...20]{
  title, titleFr, description, descriptionFr, date, category
}`);

const BLOG_QUERY =
  defineQuery(`*[_type == "blog"] | order(publishedAt desc)[0...20]{
  title, titleFr, excerpt, excerptFr, publishedAt, category, tags
}`);

const SERVICES_QUERY =
  defineQuery(`*[_type == "service"] | order(order asc)[0...20]{
  title, titleFr, shortDescription, shortDescriptionFr, pricing,
  internationalPrice, internationalCurrency, localPrice, localCurrency,
  timeline
}`);

const SECTION_LIMIT = 4_500;

// biome-ignore lint/suspicious/noExplicitAny: Sanity documents have schema-dependent fields.
type SanityDocument = Record<string, any>;

// biome-ignore lint/suspicious/noExplicitAny: Sanity documents are dynamic at runtime.
function textOf(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (typeof block === "string") return block;
      if (Array.isArray(block?.children)) {
        return block.children
          .map((child: { text?: unknown }) =>
            typeof child?.text === "string" ? child.text : "",
          )
          .join("");
      }
      return typeof block?.text === "string" ? block.text : "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

function localized(
  english: unknown,
  french: unknown,
  locale: TwinLocale,
): string {
  const preferred = locale === "fr" ? french : english;
  const alternate = locale === "fr" ? english : french;
  return textOf(preferred) || textOf(alternate);
}

function clip(value: string): string {
  if (value.length <= SECTION_LIMIT) return value;
  return `${value.slice(0, SECTION_LIMIT).trimEnd()}\n[Additional entries omitted]`;
}

function section(rows: string[]): string {
  return clip(rows.filter(Boolean).join("\n\n"));
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  );
}

async function fetchOne(query: string) {
  const { data } = await sanityFetch<unknown>({ query });
  return data;
}

async function fetchMany(query: string) {
  const data = await fetchOne(query);
  return Array.isArray(data) ? data : [];
}

export interface TwinKnowledge {
  context: TwinContext;
  profile: TwinProfile | null;
}

/**
 * Loads the complete AI Twin knowledge base in parallel. Every localized field
 * prefers the selected UI language and falls back only to the other CMS field.
 */
export async function buildTwinKnowledgeFromSanity(
  locale: TwinLocale,
): Promise<TwinKnowledge> {
  const [
    profileDocument,
    experience,
    projects,
    skills,
    education,
    certifications,
    achievements,
    blog,
    services,
  ] = await Promise.all([
    fetchOne(PROFILE_QUERY),
    fetchMany(EXPERIENCE_QUERY),
    fetchMany(PROJECTS_QUERY),
    fetchMany(SKILLS_QUERY),
    fetchMany(EDUCATION_QUERY),
    fetchMany(CERTIFICATIONS_QUERY),
    fetchMany(ACHIEVEMENTS_QUERY),
    fetchMany(BLOG_QUERY),
    fetchMany(SERVICES_QUERY),
  ]);

  const rawProfile = (profileDocument || {}) as SanityDocument;
  const profile = normalizeProfile({
    ...rawProfile,
    headline: localized(rawProfile.headline, rawProfile.headlineFr, locale),
    shortBio: localized(rawProfile.shortBio, rawProfile.shortBioFr, locale),
  });
  const context: TwinContext = {
    ...EMPTY_CONTEXT,
    sources: [
      "LinkedIn: https://www.linkedin.com/in/yeiayelngoumtsop",
      "Saint Jean Ingenieur: https://saintjeaningenieur.org",
      "Pryemo: https://pryemo.com",
      "Go2skul Study Abroad: https://go2skul.com",
      "Go2skul Education Group: https://go2skuleducation.com",
      "Go2skul Institut: https://institutgo2skul.com",
      "Admission Desk: https://admissiondesk.online",
      "Batir Le Pays SARL: https://batirlepays.com",
      "Batir Le Pays portfolio: https://portfolio.batirlepays.com",
      "IFP UBS: https://ifpubs.com",
      "Lead Higher Institute: https://luciduniversity.org",
      "IUSTE: https://univ-stee.com",
    ],
  };

  context.experience = section(
    (experience as SanityDocument[]).map((item) => {
      const responsibilities = stringList(
        locale === "fr"
          ? item.responsibilitiesFr || item.responsibilities
          : item.responsibilities || item.responsibilitiesFr,
      );
      const achievementsList = stringList(
        locale === "fr"
          ? item.achievementsFr || item.achievements
          : item.achievements || item.achievementsFr,
      );
      const dateRange = `${item.startDate || "?"} - ${
        item.current
          ? locale === "fr"
            ? "aujourd'hui"
            : "present"
          : item.endDate || "?"
      }`;
      const organizationLabel = locale === "fr" ? "chez" : "at";
      return [
        `${localized(item.position, item.positionFr, locale)} ${organizationLabel} ${item.company} (${dateRange})`,
        item.location || "",
        localized(item.description, item.descriptionFr, locale),
        ...responsibilities.slice(0, 6).map((value) => `- ${value}`),
        ...achievementsList.slice(0, 6).map((value) => `- ${value}`),
      ]
        .filter(Boolean)
        .join("\n");
    }),
  );

  context.projects = section(
    (projects as SanityDocument[]).map((item) => {
      const technologies = Array.isArray(item.technologies)
        ? item.technologies
            .map((technology: { name?: unknown }) =>
              typeof technology?.name === "string" ? technology.name : "",
            )
            .filter(Boolean)
            .join(", ")
        : "";
      return [
        localized(item.title, item.titleFr, locale),
        localized(item.tagline, item.taglineFr, locale),
        technologies
          ? `${locale === "fr" ? "Technologies" : "Technologies"}: ${technologies}`
          : "",
        item.liveUrl
          ? `${locale === "fr" ? "Site" : "Live"}: ${item.liveUrl}`
          : "",
        item.githubUrl ? `GitHub: ${item.githubUrl}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }),
  );

  const groupedSkills = new Map<string, string[]>();
  for (const item of skills as SanityDocument[]) {
    const category =
      typeof item.category === "string" ? item.category : "other";
    const name = typeof item.name === "string" ? item.name : "";
    if (!name) continue;
    const details = [
      name,
      typeof item.proficiency === "number" ? `${item.proficiency}%` : "",
      typeof item.yearsOfExperience === "number"
        ? `${item.yearsOfExperience} ${locale === "fr" ? "ans" : "years"}`
        : "",
    ]
      .filter(Boolean)
      .join(" - ");
    groupedSkills.set(category, [
      ...(groupedSkills.get(category) || []),
      details,
    ]);
  }
  context.skills = clip(
    [...groupedSkills.entries()]
      .map(([category, names]) => `${category}: ${names.join(", ")}`)
      .join("\n"),
  );

  context.education = section(
    (education as SanityDocument[]).map((item) =>
      [
        `${localized(item.degree, item.degreeFr, locale)} - ${localized(
          item.fieldOfStudy,
          item.fieldOfStudyFr,
          locale,
        )} ${locale === "fr" ? "à" : "at"} ${item.institution}`,
        `${item.startDate || "?"} - ${item.endDate || "?"}`,
        localized(item.description, item.descriptionFr, locale),
        item.gpa ? `GPA: ${item.gpa}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  );

  context.certifications = section(
    (certifications as SanityDocument[]).map((item) =>
      [
        `${localized(item.name, item.nameFr, locale)} - ${item.issuer || ""}`,
        item.issueDate || "",
        localized(item.description, item.descriptionFr, locale),
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  );

  context.achievements = section(
    (achievements as SanityDocument[]).map((item) =>
      [
        localized(item.title, item.titleFr, locale),
        item.date || "",
        localized(item.description, item.descriptionFr, locale),
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  );

  context.blog = section(
    (blog as SanityDocument[]).map((item) =>
      [
        localized(item.title, item.titleFr, locale),
        localized(item.excerpt, item.excerptFr, locale),
        item.publishedAt
          ? `${locale === "fr" ? "Publié" : "Published"}: ${item.publishedAt}`
          : "",
        Array.isArray(item.tags) ? `Tags: ${item.tags.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  );

  context.services = section(
    (services as SanityDocument[]).map((item) =>
      [
        localized(item.title, item.titleFr, locale),
        localized(item.shortDescription, item.shortDescriptionFr, locale),
        item.internationalPrice
          ? `${locale === "fr" ? "International" : "International"}: ${item.internationalPrice} ${item.internationalCurrency || "USD"}`
          : "",
        item.localPrice
          ? `${locale === "fr" ? "Local" : "Local"}: ${item.localPrice} ${item.localCurrency || "XAF"}`
          : "",
        item.timeline
          ? `${locale === "fr" ? "Délai" : "Timeline"}: ${item.timeline}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  );

  return { context, profile };
}

export async function buildTwinContextFromSanity(
  locale: TwinLocale = "en",
): Promise<TwinContext> {
  return (await buildTwinKnowledgeFromSanity(locale)).context;
}

export { PROFILE_QUERY };
