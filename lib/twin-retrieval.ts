import type { TwinContext, TwinLocale } from "@/lib/twin";

type ContextSection = Exclude<keyof TwinContext, "sources">;

export interface TwinRetrievalResult {
  context: TwinContext;
  chunkCount: number;
  queryTerms: string[];
}

const MAX_RETRIEVED_CHARS = 10_000;
const MAX_CHUNKS = 12;

const STOP_WORDS = new Set([
  "about",
  "avec",
  "comment",
  "dans",
  "des",
  "does",
  "est",
  "for",
  "from",
  "how",
  "les",
  "pour",
  "quel",
  "quelle",
  "that",
  "the",
  "this",
  "une",
  "what",
  "when",
  "where",
  "which",
  "who",
  "with",
  "your",
  "vous",
  "votre",
]);

const EXPANSIONS = [
  ["career", "experience", "work", "job", "emploi", "parcours", "travail"],
  ["project", "projects", "built", "portfolio", "projet", "realisation"],
  ["skill", "skills", "stack", "technology", "competence", "technologie"],
  ["education", "degree", "school", "formation", "diplome", "ecole"],
  ["certificate", "certification", "credential", "certificat"],
  ["award", "achievement", "recognition", "prix", "distinction"],
  ["article", "blog", "writing", "publication", "ecrit"],
  ["service", "pricing", "price", "hire", "tarif", "recruter"],
  ["data", "analytics", "analyse", "donnees", "science"],
  ["ai", "artificial", "intelligence", "machine", "learning", "ia"],
  ["security", "network", "cloud", "securite", "reseau"],
];

const SECTION_HINTS: Record<ContextSection, string[]> = {
  experience: ["career", "experience", "work", "job", "emploi", "parcours"],
  projects: ["project", "built", "portfolio", "projet", "realisation"],
  skills: ["skill", "stack", "technology", "competence", "technologie"],
  education: ["education", "degree", "school", "formation", "diplome", "ecole"],
  certifications: ["certificate", "certification", "credential", "certificat"],
  achievements: ["award", "achievement", "recognition", "distinction"],
  blog: ["article", "blog", "writing", "publication"],
  services: ["service", "pricing", "price", "hire", "tarif", "recruter"],
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return [
    ...new Set(
      normalize(value)
        .split(/\s+/)
        .filter((term) => term.length > 2 && !STOP_WORDS.has(term)),
    ),
  ];
}

function expandedTerms(query: string): string[] {
  const terms = new Set(tokenize(query));
  for (const group of EXPANSIONS) {
    if (group.some((term) => terms.has(term))) {
      for (const term of group) terms.add(term);
    }
  }
  return [...terms];
}

function splitSection(value: string): string[] {
  return value
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export function retrieveTwinContext(
  source: TwinContext,
  query: string,
  _locale: TwinLocale,
): TwinRetrievalResult {
  const originalTerms = tokenize(query);
  const terms = expandedTerms(query);
  const normalizedQuery = normalize(query);
  const sectionEntries = (
    Object.keys(SECTION_HINTS) as ContextSection[]
  ).flatMap((section) =>
    splitSection(source[section]).map((text, index) => ({
      section,
      text,
      index,
    })),
  );

  const scored = sectionEntries
    .map((chunk) => {
      const normalizedChunk = normalize(chunk.text);
      const directMatches = originalTerms.filter((term) =>
        normalizedChunk.includes(term),
      ).length;
      const expandedMatches = terms.filter((term) =>
        normalizedChunk.includes(term),
      ).length;
      const sectionBoost = SECTION_HINTS[chunk.section].some((term) =>
        terms.includes(term),
      )
        ? 8
        : 0;
      const phraseBoost =
        normalizedQuery.length > 8 && normalizedChunk.includes(normalizedQuery)
          ? 12
          : 0;
      const coverage =
        originalTerms.length > 0
          ? (directMatches / originalTerms.length) * 10
          : 0;
      return {
        ...chunk,
        score:
          directMatches * 4 +
          expandedMatches * 1.5 +
          sectionBoost +
          phraseBoost +
          coverage -
          chunk.index * 0.05,
      };
    })
    .sort((a, b) => b.score - a.score);

  let selected = scored.filter((chunk) => chunk.score > 0).slice(0, MAX_CHUNKS);
  if (!selected.length) {
    selected = scored
      .filter((chunk) =>
        ["skills", "projects", "experience", "services"].includes(
          chunk.section,
        ),
      )
      .slice(0, 6);
  }

  const context: TwinContext = {
    experience: "",
    projects: "",
    skills: "",
    education: "",
    certifications: "",
    achievements: "",
    blog: "",
    services: "",
    sources: source.sources,
  };
  let usedChars = 0;
  let chunkCount = 0;

  for (const section of Object.keys(SECTION_HINTS) as ContextSection[]) {
    const sectionChunks = selected
      .filter((chunk) => chunk.section === section)
      .sort((a, b) => a.index - b.index);
    if (!sectionChunks.length || usedChars >= MAX_RETRIEVED_CHARS) continue;
    const available = MAX_RETRIEVED_CHARS - usedChars;
    const value = sectionChunks
      .map((chunk) => chunk.text)
      .join("\n\n")
      .slice(0, available)
      .trim();
    if (!value) continue;
    context[section] = value;
    usedChars += value.length;
    chunkCount += sectionChunks.length;
  }

  return { context, chunkCount, queryTerms: terms };
}
