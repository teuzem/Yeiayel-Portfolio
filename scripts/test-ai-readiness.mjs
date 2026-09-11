import assert from "node:assert/strict";
import {
  ensureResearchCitations,
  isResearchFollowUp,
  researchWithTavily,
  shouldResearch,
} from "../lib/twin-research.ts";
import { retrieveTwinContext } from "../lib/twin-retrieval.ts";

const fixture = {
  experience:
    "Data Scientist at PRYEMO (2024 - present)\nBuilt production data and web systems.\n\nSoftware Engineer at GO2SKUL EDUCATION GROUP\nBuilt Admission Desk.",
  projects:
    "Admission Desk\nEducation admissions workflow.\n\nAI Twin\nMultilingual assistant with verified research.",
  skills: "data: Python, SQL, Power BI\nai: RAG, machine learning, agents",
  education:
    "Master 1 - Data Science at Saint Jean Ingenieur\n\nProfessional Bachelor's - Networks and Telecommunications at IUSTE",
  certifications: "Data Analysis and AI - Professional certification",
  achievements: "Digital innovation recognition",
  blog: "Building trustworthy data products\nPublished: 2026-09-11",
  services: "AI and data product delivery\nInternational and local pricing",
  sources: ["https://pryemo.com", "https://admissiondesk.online"],
};

assert.equal(shouldResearch("Who is Prof NGUEFACK TSAGUES Georges?"), true);
assert.equal(
  shouldResearch("Can you look this person up online and cite sources?"),
  true,
);
assert.equal(
  shouldResearch("Please find out on the internet what happened today."),
  true,
);
assert.equal(
  shouldResearch(
    "Peux-tu rechercher cette entreprise en ligne et vérifier les sources ?",
  ),
  true,
);
assert.equal(
  shouldResearch("Consulte le web pour les dernières nouvelles sur l'IA."),
  true,
);
assert.equal(shouldResearch("What happened during 2026?"), true);
assert.equal(shouldResearch("Qu'est-ce qui s'est passé aujourd'hui ?"), true);
assert.equal(
  shouldResearch("Quelles sont les dernières actualités sur l'IA ?"),
  true,
);
assert.equal(
  shouldResearch(
    "Parle moi en profondeur de la biographie du representant de l'OMS au Cameroun decrivant son parcours au sein de cet organe de sante mondiale",
  ),
  true,
);
assert.equal(
  shouldResearch("Qui est l'actuel representant de l'OMS au Cameroun ?"),
  true,
);
assert.equal(
  shouldResearch("Parle moi de l'actuel directeur de l'OMS Cameroun"),
  true,
);
assert.equal(shouldResearch("Quel est ton parcours professionnel ?"), false);
assert.equal(isResearchFollowUp("What about his career?"), true);
assert.equal(isResearchFollowUp("Et son parcours ?"), true);
assert.equal(isResearchFollowUp("Can you search further?"), true);
assert.equal(isResearchFollowUp("Peux-tu verifier encore ?"), true);

const career = retrieveTwinContext(
  fixture,
  "What did you build while working at PRYEMO?",
  "en",
);
assert.ok(career.chunkCount > 0);
assert.match(career.context.experience, /PRYEMO/i);

const education = retrieveTwinContext(
  fixture,
  "Quel diplôme as-tu obtenu à IUSTE ?",
  "fr",
);
assert.ok(education.chunkCount > 0);
assert.match(education.context.education, /IUSTE/i);

const cited = ensureResearchCitations(
  "The answer is supported by the available evidence.",
  2,
  "en",
);
assert.match(cited, /Verified sources: \[1\] \[2\]/);
assert.equal(
  ensureResearchCitations("Verified claim [1]. Invalid [9].", 2, "en"),
  "Verified claim [1]. Invalid .",
);

const configuredProviders = [
  process.env.OPENAI_API_KEY?.trim() ? "OpenAI" : null,
  process.env.OPENROUTER_API_KEY?.trim() ? "OpenRouter" : null,
].filter(Boolean);
assert.ok(
  configuredProviders.length > 0,
  "At least one AI response provider must be configured.",
);

if (process.env.TAVILY_API_KEY?.trim()) {
  const liveCases = [
    ["Who is Prof NGUEFACK TSAGUES Georges?", "en"],
    ["What are the latest AI developments today?", "en"],
    ["Quelles sont les dernières actualités sur l'IA ?", "fr"],
  ];
  let directExtractionUrl = null;
  for (const [query, locale] of liveCases) {
    let lookup = await researchWithTavily(query, locale, 20_000);
    for (
      let attempt = 1;
      lookup.status === "failed" && attempt < 3;
      attempt++
    ) {
      lookup = await researchWithTavily(query, locale, 20_000);
    }
    assert.equal(lookup.status, "success", `Tavily failed for: ${query}`);
    assert.ok(
      (lookup.result?.sources.length || 0) > 0,
      `No sources returned for: ${query}`,
    );
    assert.ok(
      (lookup.result?.sources.reduce(
        (total, source) => total + (source.snippet?.length || 0),
        0,
      ) || 0) >= 500,
      `Insufficient research evidence returned for: ${query}`,
    );
    assert.equal(
      new Set(lookup.result?.sources.map((source) => source.url) || []).size,
      lookup.result?.sources.length,
      `Duplicate research sources returned for: ${query}`,
    );
    directExtractionUrl ||= lookup.result?.sources[0]?.url || null;
  }

  assert.ok(
    directExtractionUrl,
    "A live Tavily source is required for the direct extraction test.",
  );
  const direct = await researchWithTavily(
    `Read this public page and summarize its evidence: ${directExtractionUrl}`,
    "en",
    20_000,
  );
  assert.equal(direct.status, "success", "Direct URL extraction failed.");
  assert.ok(
    (direct.result?.sources[0]?.snippet?.length || 0) >= 500,
    "Direct URL extraction returned insufficient page content.",
  );
}

console.log(
  `AI readiness passed: retrieval, bilingual routing, citation validation, ${configuredProviders.join(" + ")} configuration${
    process.env.TAVILY_API_KEY?.trim()
      ? ", live Tavily research, and direct page extraction"
      : ""
  }.`,
);
