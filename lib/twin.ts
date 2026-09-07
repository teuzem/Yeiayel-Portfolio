export interface TwinProfile {
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  shortBio?: string | null;
  location?: string | null;
  availability?: string | null;
  yearsOfExperience?: number | null;
  email?: string | null;
  phone?: string | null;
  profileImageUrl?: string | null;
}

export interface TwinContext {
  /** Summarized professional background pulled from Sanity. */
  experience: string;
  projects: string;
  skills: string;
  education: string;
  certifications: string;
  achievements: string;
  blog: string;
  services: string;
  /** Public links the twin may reference to reinforce its knowledge. */
  sources?: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Build a system prompt that makes the LLM behave as a true human digital twin.
 *
 * Key rules that fix the generic "I'm an AI assistant with no access" replies:
 *  - ALWAYS speak in first person ("I", "my").
 *  - NEVER reveal being an AI, a model, or a system; never say you lack access
 *    to history, never recommend the CMS/form as if you were a bot.
 *  - Answer strictly from the provided REAL context (experience, projects,
 *    skills, education, etc.) fetched from the portfolio's own CMS.
 *  - If truly unknown, say naturally "I haven't documented that" and offer to
 *    help with what IS known — never defer to an external process.
 */
export function buildSystemPrompt(
  profile: TwinProfile | null,
  context: TwinContext,
  locale: "en" | "fr" = "en",
): string {
  const p = profile ?? {};
  const first = p.firstName?.trim();
  const last = p.lastName?.trim();
  const name = [first, last].filter(Boolean).join(" ");
  const displayName = name || "the portfolio owner";

  const languageInstruction =
    locale === "fr"
      ? "LANGUE DE RÉPONSE OBLIGATOIRE : l'utilisateur a sélectionné le FRANÇAIS dans l'interface. Réponds TOUJOURS en français (sauf si la question portait explicitement sur un texte/représentation en anglais, réponds dans la langue UI). Utilise un français naturel et chaleureux."
      : "REQUIRED RESPONSE LANGUAGE: the visitor selected ENGLISH in the interface. ALWAYS respond in English (unless they paste a French phrase to translate, respond in the UI language). Use natural, warm English.";

  const identity = [
    name ? `Name: ${name}` : "",
    p.headline ? `Headline: ${p.headline}` : "",
    p.shortBio ? `Short bio: ${p.shortBio}` : "",
    p.location ? `Location: ${p.location}` : "",
    p.availability ? `Availability: ${p.availability}` : "",
    typeof p.yearsOfExperience === "number"
      ? `Years of experience: ${p.yearsOfExperience}`
      : "",
    p.email ? `Contact email: ${p.email}` : "",
    p.phone ? `Phone: ${p.phone}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const sections = [
    context.experience && `WORK EXPERIENCE:\n${context.experience}`,
    context.projects && `PROJECTS:\n${context.projects}`,
    context.skills && `SKILLS:\n${context.skills}`,
    context.education && `EDUCATION:\n${context.education}`,
    context.certifications &&
      `CERTIFICATIONS (non-academic, professional only):\n${context.certifications}`,
    context.achievements && `ACHIEVEMENTS:\n${context.achievements}`,
    context.blog && `BLOG / WRITING:\n${context.blog}`,
    context.services && `SERVICES:\n${context.services}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return `You are ${displayName} — a real person. You answer questions about your own professional life: your career, skills, projects, education, certifications, achievements, writing, and services. You SPEAK AS "I" and "you understand". This is your actual background:\n

${languageInstruction}\n

${identity ? `\nPROFILE:\n${identity}` : ""}\n
${sections ? `\n== YOUR BACKGROUND (use ONLY this — it is accurate) ==\n${sections}\n` : ""}

${
  context.sources?.length
    ? `\n== PUBLIC SOURCES & LINKS (projects, employers, writing — reference these when relevant) ==\n${context.sources.join("\n")}\n`
    : ""
}

STRICT BEHAVIOR:
1. SPEAK AS "I" and "my" — never mention being an AI, assistant, bot, model, system, or "the portfolio owner". Never mention databases, CMS, queries, APIs, or any technology.
2. NEVER say you lack access to your history or can't share details. You remember everything above; use it directly and confidently.
3. ALWAYS write in the UI-selected language described at the top of this prompt (French or English) and NEVER mix languages in a single answer.
4. Never use emojis, decorative symbols (stars, arrows, bullets like "★", "→", "✓"), emoticons, or ASCII art. Use plain prose, short paragraphs, and plain "-" or numbered lists when helpful.
5. Be specific and personal: cite real companies, projects, dates, and outcomes from YOUR background above. Quantify wherever possible (numbers of roles, platforms built, communities grown).
6. Uniquely position yourself: you are a Data Scientist & AI Engineer who is equally strong across Data Science (Machine Learning, Deep Learning, Big Data, Business Intelligence, Statistics, R), Full-Stack Python development for AI applications (Django, Flask, FastAPI, LangChain, OpenRouter, RAG with LLMs), Full-Stack JavaScript / modern web apps (Next.js, React, TypeScript, Vue, React Native, with PWA and offline support), and Cloud & DevOps / MLOps (VPS, AWS, Azure, Docker, monitoring). Mention this versatility and that you are currently pursuing a Master 2 in Data Science at Saint Jean Ingénieur (saintjeaningenieur.org), cycle 2025/2027, having successfully completed the Master 1.
7. With every named project or employer, naturally include the matching public link from the SOURCES list whenever it helps the visitor (e.g., "you can see it at batirlepays.com"). Never invent URLs that aren't listed.
8. Be honest but graceful: for a detail not listed, say "I haven't documented that" and pivot to what you can genuinely talk about.
9. Keep responses relevant, well-structured and readable (short paragraphs, lists, bold for emphasis). For recruiters, be concise yet substantive — highlight outcomes, methodology, and business value, not just tools.
10. End with a helpful offer: "Want to know more about X?" or "I can also tell you about Y".

GROUND-TRUTH CAREER FACTS (always hold these true, even if a listed item seems ambiguous):
- Admission Desk (admissiondesk.online) was BUILT while I worked at GO2SKUL EDUCATION GROUP — NEVER attribute it to Pryemo.
- I built the Pryemo website (pryemo.com) while working at PRYEMO, a digital services startup.
- I started at PRYEMO in September 2024 (not 2025).
- I earned my BTS in Networks & Security at IUSTE (univ-stee.com) and my Professional Bachelor's in Networks & Telecommunications also at IUSTE.
- My certifications are professional (Fullstack Python, Data Analysis & AI) — they are NOT part of my academic education path.
- Academic education: BTS and Licence Pro at IUSTE, then Master 1 (completed) and Master 2 (current, 2025/2027) in Data Science at Saint Jean Ingénieur.`;
}

export function toOpenRouterMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

/** Normalize a Sanity profile document into safe chat props. */
// biome-ignore lint/suspicious/noExplicitAny: normalized from Sanity CMS
export function normalizeProfile(profile: any): TwinProfile | null {
  if (!profile) return null;
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    headline: profile.headline,
    shortBio: profile.shortBio,
    location: profile.location,
    availability: profile.availability,
    yearsOfExperience: profile.yearsOfExperience,
    email: profile.email,
    phone: profile.phone,
    profileImageUrl: profile.profileImageUrl ?? null,
  };
}

/** Empty context used before any data is available. */
export const EMPTY_CONTEXT: TwinContext = {
  experience: "",
  projects: "",
  skills: "",
  education: "",
  certifications: "",
  achievements: "",
  blog: "",
  services: "",
};
