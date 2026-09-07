import { defineQuery } from "next-sanity";
import type { TwinContext } from "@/lib/twin";
import { sanityFetch } from "@/sanity/lib/live";

const PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName, lastName, headline, shortBio, location, availability,
  yearsOfExperience, email, phone
}`);

const EXPERIENCE_QUERY =
  defineQuery(`*[_type == "experience"] | order(startDate desc){
  company, position, location, startDate, endDate, current,
  description, responsibilities, achievements
}`);

const PROJECTS_QUERY =
  defineQuery(`*[_type == "project"] | order(_createdAt desc){
  title, tagline, technologies[]->{name}, liveUrl, githubUrl, category, featured
}`);

const SKILLS_QUERY =
  defineQuery(`*[_type == "skill"] | order(proficiency desc, category asc){
  name, category, proficiency, yearsOfExperience
}`);

const EDUCATION_QUERY =
  defineQuery(`*[_type == "education"] | order(endDate desc){
  institution, degree, degreeFr, fieldOfStudy, fieldOfStudyFr, startDate, endDate, description, descriptionFr, gpa
}`);

const CERTIFICATIONS_QUERY =
  defineQuery(`*[_type == "certification"] | order(issueDate desc){
  name, issuer, issueDate, expiryDate, description
}`);

const ACHIEVEMENTS_QUERY =
  defineQuery(`*[_type == "achievement"] | order(date desc){
  title, description, date, category
}`);

const BLOG_QUERY = defineQuery(`*[_type == "blog"] | order(publishedAt desc){
  title, excerpt, publishedAt, category, tags
}`);

const SERVICES_QUERY = defineQuery(`*[_type == "service"] | order(order asc){
  title, shortDescription, pricing, internationalPrice, localPrice, timeline
}`);

/** Render a Sanity description (Portable Text or plain text) to readable text. */
// biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
function textOf(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((block) => {
        if (typeof block === "string") return block;
        const children = block?.children;
        if (Array.isArray(children)) {
          return children
            .map((c) => (c && typeof c.text === "string" ? c.text : ""))
            .join("");
        }
        return block?.text ?? "";
      })
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

function lines(heading: string, rows: string[]): string {
  const clean = rows.filter(Boolean);
  return clean.length ? `${heading}:\n${clean.join("\n")}` : "";
}

function listOf(
  items: Array<string | undefined | null> | null | undefined,
): string[] {
  return (items ?? []).filter((s): s is string => Boolean(s));
}

/**
 * Fetch and summarize all portfolio content from Sanity into a context blob
 * the LLM can reference. Server-only.
 */
export async function buildTwinContextFromSanity(): Promise<TwinContext> {
  const empty: TwinContext = {
    experience: "",
    projects: "",
    skills: "",
    education: "",
    certifications: "",
    achievements: "",
    blog: "",
    services: "",
  };

  const run = async <T>(query: string): Promise<T[]> => {
    try {
      const { data } = await sanityFetch({ query });
      // biome-ignore lint/suspicious/noExplicitAny: shape unknown at runtime
      return (data as any) ?? [];
    } catch {
      return [];
    }
  };

  const context: TwinContext = { ...empty };

  context.sources = [
    "LinkedIn: https://www.linkedin.com/in/yeiayelngoumtsop",
    "Saint Jean Ingénieur (école, formation en Data Science): https://saintjeaningenieur.org",
    "Pryemo (startup web & services): https://pryemo.com",
    "Go2skul Study Abroad: https://go2skul.com",
    "Go2skul Education Group: https://go2skuleducation.com",
    "Go2skul Institut (formation): https://institutgo2skul.com",
    "Admission Desk (app de recrutement étudiants): https://admissiondesk.online",
    "Bâtir Le Pays SARL (site officiel): https://batirlepays.com",
    "Bâtir Le Pays — Portfolio BTP & formations: https://portfolio.batirlepays.com",
    "IFP UBS (Institut de Formation Professionnelle): https://ifpubs.com",
    "Lead Higher Institute: https://luciduniversity.org",
    "TEST SARL (Texaco Omnisport, Yaoundé)",
    "IUSTE (Institut Universitaire des Sciences, des Technologies et de l'Ethique): https://univ-stee.com",
  ];

  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const exp: any[] = await run(EXPERIENCE_QUERY);
    context.experience = lines(
      "Work experience",
      exp.map((e) =>
        [
          `${e.position} @ ${e.company} (${e.current ? "present" : (e.endDate ?? "")})`,
          textOf(e.description),
          ...listOf(e.responsibilities)
            .slice(0, 5)
            .map((r) => `- ${r}`),
          ...listOf(e.achievements)
            .slice(0, 5)
            .map((a) => `- ${a}`),
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  } catch {
    /* ignore */
  }
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const proj: any[] = await run(PROJECTS_QUERY);
    context.projects = lines(
      "Projects",
      proj.map((p) =>
        [
          `${p.title}${p.category ? ` (${p.category})` : ""}`,
          p.tagline ?? "",
          p.technologies?.length
            ? `Tech: ${(p.technologies as Array<{ name?: string }>)
                .map((t) => t?.name ?? "")
                .filter(Boolean)
                .join(", ")}`
            : "",
          p.liveUrl ? `Live: ${p.liveUrl}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  } catch {
    /* ignore */
  }
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const skills: any[] = await run(SKILLS_QUERY);
    const grouped = new Map<string, string[]>();
    for (const s of skills) {
      const cat = s.category ?? "other";
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)?.push(s.name);
    }
    context.skills = [...grouped.entries()]
      .map(([cat, names]) => `${cat}: ${names.join(", ")}`)
      .join("\n");
  } catch {
    /* ignore */
  }
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const edu: any[] = await run(EDUCATION_QUERY);
    context.education = lines(
      "Education",
      edu.map((e) =>
        [
          `${e.degree ?? e.degreeFr} in ${e.fieldOfStudy ?? e.fieldOfStudyFr} @ ${e.institution} (${e.startDate ?? ""}-${e.endDate ?? ""})`,
          e.description ?? e.descriptionFr,
          e.gpa ? `GPA: ${e.gpa}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  } catch {
    /* ignore */
  }
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const certs: any[] = await run(CERTIFICATIONS_QUERY);
    context.certifications = lines(
      "Certifications",
      certs.map((c) => `${c.name} — ${c.issuer} (${c.issueDate ?? ""})`.trim()),
    );
  } catch {
    /* ignore */
  }
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const ach: any[] = await run(ACHIEVEMENTS_QUERY);
    context.achievements = lines(
      "Achievements",
      ach.map((a) =>
        [
          `${a.title}${a.category ? ` (${a.category})` : ""}`,
          textOf(a.description),
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  } catch {
    /* ignore */
  }
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const blog: any[] = await run(BLOG_QUERY);
    context.blog = lines(
      "Writing / Blog",
      blog.map((b) =>
        [
          b.title,
          b.excerpt ?? "",
          b.category ? `Topic: ${b.category}` : "",
          b.tags?.length ? `Tags: ${b.tags.join(", ")}` : "",
          b.publishedAt ? `Published: ${b.publishedAt}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    );
  } catch {
    /* ignore */
  }
  try {
    // biome-ignore lint/suspicious/noExplicitAny: Sanity dynamic content
    const services: any[] = await run(SERVICES_QUERY);
    context.services = lines(
      "Services",
      services.map((s) =>
        [
          s.title,
          s.shortDescription ?? "",
          s.internationalPrice ? `from ${s.internationalPrice}` : "",
          s.timeline ? `Timeline: ${s.timeline}` : "",
        ]
          .filter(Boolean)
          .join(" • "),
      ),
    );
  } catch {
    /* ignore */
  }

  return context;
}

export { PROFILE_QUERY };
