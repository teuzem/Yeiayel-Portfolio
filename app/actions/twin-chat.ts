"use server";

import {
  buildLocalKnowledgeResponse,
  buildSystemPrompt,
  type ChatMessage,
  type TwinFeedbackProfile,
  type TwinLocale,
  type TwinProfile,
  toProviderMessages,
} from "@/lib/twin";
import { buildTwinKnowledgeFromSanity } from "@/lib/twin-context";
import {
  ensureResearchCitations,
  isResearchFollowUp,
  type ResearchSource,
  type ResearchStatus,
  researchFailureMessage,
  researchPrompt,
  researchWithTavily,
  shouldResearch,
  unavailableResearchPrompt,
} from "@/lib/twin-research";
import { retrieveTwinContext } from "@/lib/twin-retrieval";

export interface TwinChatResponse {
  ok: boolean;
  message: string;
  source: "openai" | "openrouter" | "local";
  model?: string;
  usingRealContext: boolean;
  researched?: boolean;
  researchAttempted?: boolean;
  researchProvider?: "tavily";
  researchStatus?: ResearchStatus;
  sources?: ResearchSource[];
  retrievalChunkCount?: number;
}

const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MAX_MESSAGES = 18;
const MAX_MESSAGE_LENGTH = 4_000;
const MAX_TOTAL_LENGTH = 24_000;
const DEFAULT_REQUEST_BUDGET_MS = 28_000;
const PER_ATTEMPT_TIMEOUT_MS = 16_000;

class ProviderError extends Error {
  constructor(
    message: string,
    readonly stopProvider = false,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

function unique(values: Array<string | undefined>): string[] {
  return [
    ...new Set(values.map((value) => value?.trim()).filter(Boolean)),
  ] as string[];
}

function normalizeMessages(messages: ChatMessage[]): ChatMessage[] {
  if (!Array.isArray(messages)) return [];

  let totalLength = 0;
  return messages
    .slice(-MAX_MESSAGES)
    .map((message) => {
      const role: ChatMessage["role"] =
        message?.role === "assistant" ? "assistant" : "user";
      const content =
        typeof message?.content === "string"
          ? message.content.trim().slice(0, MAX_MESSAGE_LENGTH)
          : "";
      return {
        role,
        content,
        webResearch: message?.webResearch === true,
      };
    })
    .filter((message) => {
      if (!message.content || totalLength >= MAX_TOTAL_LENGTH) return false;
      const remaining = MAX_TOTAL_LENGTH - totalLength;
      message.content = message.content.slice(0, remaining);
      totalLength += message.content.length;
      return Boolean(message.content);
    });
}

function normalizeProfile(profile?: TwinProfile | null): TwinProfile | null {
  if (!profile) return null;
  const text = (value: string | null | undefined, limit = 500) =>
    typeof value === "string" ? value.trim().slice(0, limit) : null;
  return {
    firstName: text(profile.firstName, 80),
    lastName: text(profile.lastName, 80),
    headline: text(profile.headline),
    shortBio: text(profile.shortBio, 1_500),
    location: text(profile.location, 160),
    availability: text(profile.availability, 200),
    yearsOfExperience:
      typeof profile.yearsOfExperience === "number" &&
      Number.isFinite(profile.yearsOfExperience)
        ? Math.max(0, Math.min(80, profile.yearsOfExperience))
        : null,
    email: text(profile.email, 320),
    phone: text(profile.phone, 80),
    profileImageUrl: null,
  };
}

function normalizeFeedback(
  feedback?: TwinFeedbackProfile | null,
): TwinFeedbackProfile | undefined {
  if (!feedback) return undefined;
  const count = (value: number | undefined) =>
    typeof value === "number" && Number.isFinite(value)
      ? Math.max(0, Math.min(10_000, Math.round(value)))
      : 0;
  const averageRating =
    typeof feedback.averageRating === "number" &&
    Number.isFinite(feedback.averageRating)
      ? Math.max(1, Math.min(5, feedback.averageRating))
      : undefined;
  const latestNote =
    typeof feedback.latestNote === "string"
      ? feedback.latestNote.trim().slice(0, 600)
      : undefined;

  return {
    averageRating,
    latestNote,
    helpfulCount: count(feedback.helpfulCount),
    notHelpfulCount: count(feedback.notHelpfulCount),
  };
}

function responseLanguageReminder(locale: TwinLocale): string {
  return locale === "fr"
    ? "Rappel final : réponds uniquement en français naturel et ne mélange aucune phrase anglaise."
    : "Final reminder: answer only in natural English and do not mix in French sentences.";
}

function buildResearchFallback(
  locale: TwinLocale,
  research?: {
    summary: string;
    sources: ResearchSource[];
  } | null,
): string {
  if (research?.sources.length) {
    return ensureResearchCitations(
      locale === "fr"
        ? `Voici la synthèse vérifiable retournée par la recherche en direct :\n\n${research.summary}\n\nLe fournisseur de réponse principal n'a pas terminé sa reformulation. Cette synthèse est donc conservatrice et doit être lue avec les sources affichées.`
        : `Here is the verifiable synthesis returned by live research:\n\n${research.summary}\n\nThe primary answer provider did not finish its reformulation, so this is a conservative synthesis that should be read with the displayed sources.`,
      research.sources.length,
      locale,
    );
  }
  if (locale === "fr") {
    return "Je n'ai pas pu obtenir de source web vérifiable pour cette question en temps réel. Je préfère ne pas inventer de faits. Précisez l'identité, l'organisation, le lieu ou la période recherchée, puis relancez la question.";
  }
  return "I could not obtain a verifiable live web source for this question. I will not invent facts. Confirm the exact identity, organization, location, or time period, then retry with those details.";
}

function researchQueryForConversation(
  messages: ChatMessage[],
  question: string,
  isFollowUp: boolean,
): string {
  if (!isFollowUp) return question;
  const previousQuestion = [...messages.slice(0, -1)]
    .reverse()
    .find((message) => message.role === "user")?.content;

  if (!previousQuestion) return question;
  return `Previous researched topic: ${previousQuestion}\nFollow-up question: ${question}`;
}

function retrievalQueryForConversation(messages: ChatMessage[]): string {
  return messages
    .filter((message) => message.role === "user")
    .slice(-3)
    .map((message) => message.content)
    .join("\n");
}

function parseOpenAIText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const record = data as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ type?: string; text?: unknown }> }>;
  };
  if (typeof record.output_text === "string") return record.output_text.trim();
  return (record.output || [])
    .flatMap((item) => item.content || [])
    .filter(
      (part) => part.type === "output_text" && typeof part.text === "string",
    )
    .map((part) => String(part.text))
    .join("")
    .trim();
}

function parseOpenRouterText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const content = (
    data as {
      choices?: Array<{
        message?: {
          content?: string | Array<{ type?: string; text?: string }>;
        };
      }>;
    }
  ).choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenAI(options: {
  apiKey: string;
  model: string;
  system: string;
  messages: ChatMessage[];
  timeoutMs: number;
  maxOutputTokens: number;
}): Promise<string> {
  const response = await fetchWithTimeout(
    OPENAI_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model,
        instructions: options.system,
        input: toProviderMessages(options.messages),
        max_output_tokens: options.maxOutputTokens,
        store: false,
      }),
    },
    options.timeoutMs,
  );
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ProviderError(
      `OpenAI ${options.model} returned ${response.status}`,
      [401, 403, 429].includes(response.status),
    );
  }
  const message = parseOpenAIText(data);
  if (!message) throw new Error(`OpenAI ${options.model} returned no text`);
  return message;
}

async function callOpenRouter(options: {
  apiKey: string;
  model: string;
  system: string;
  messages: ChatMessage[];
  locale: TwinLocale;
  timeoutMs: number;
  maxOutputTokens: number;
}): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const response = await fetchWithTimeout(
    OPENROUTER_ENDPOINT,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`,
        ...(appUrl ? { "HTTP-Referer": appUrl } : {}),
        "X-Title": "Yeiayel AI Twin",
      },
      body: JSON.stringify({
        model: options.model,
        messages: [
          { role: "system", content: options.system },
          ...toProviderMessages(options.messages),
          {
            role: "system",
            content: responseLanguageReminder(options.locale),
          },
        ],
        temperature: 0.45,
        max_tokens: options.maxOutputTokens,
      }),
    },
    options.timeoutMs,
  );
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ProviderError(
      `OpenRouter ${options.model} returned ${response.status}`,
      [401, 403, 429].includes(response.status),
    );
  }
  const message = parseOpenRouterText(data);
  if (!message) throw new Error(`OpenRouter ${options.model} returned no text`);
  return message;
}

export async function chatWithTwin(
  rawMessages: ChatMessage[],
  clientProfile?: TwinProfile | null,
  requestedLocale: TwinLocale = "en",
  clientFeedback?: TwinFeedbackProfile | null,
): Promise<TwinChatResponse> {
  const locale: TwinLocale = requestedLocale === "fr" ? "fr" : "en";
  const messages = normalizeMessages(rawMessages);
  const lastQuestion = messages.at(-1)?.content || "";
  const { context, profile: serverProfile } =
    await buildTwinKnowledgeFromSanity(locale);
  const retrieval = retrieveTwinContext(
    context,
    retrievalQueryForConversation(messages),
    locale,
  );
  const profile = serverProfile || normalizeProfile(clientProfile);
  const usingRealContext = Boolean(
    serverProfile ||
      context.experience ||
      context.projects ||
      context.skills ||
      context.education ||
      context.services,
  );

  if (!lastQuestion) {
    return {
      ok: false,
      message:
        locale === "fr"
          ? "Veuillez saisir une question."
          : "Please enter a question.",
      source: "local",
      usingRealContext,
      retrievalChunkCount: retrieval.chunkCount,
    };
  }

  const configuredBudget = Number(process.env.TWIN_CHAT_TIMEOUT_MS);
  const budgetMs = Number.isFinite(configuredBudget)
    ? Math.max(10_000, Math.min(55_000, configuredBudget))
    : DEFAULT_REQUEST_BUDGET_MS;
  const deadline = Date.now() + budgetMs;
  const configuredMaxOutputTokens = Number(process.env.TWIN_MAX_OUTPUT_TOKENS);
  const maxOutputTokens = Number.isFinite(configuredMaxOutputTokens)
    ? Math.max(800, Math.min(4_000, configuredMaxOutputTokens))
    : 2_200;
  const hasRecentWebResearch = messages
    .slice(-6, -1)
    .some((message) => message.webResearch);
  const followUpResearch =
    hasRecentWebResearch && isResearchFollowUp(lastQuestion);
  const researchAttempted = shouldResearch(lastQuestion) || followUpResearch;
  const configuredResearchTimeout = Number(
    process.env.TWIN_RESEARCH_TIMEOUT_MS,
  );
  const researchTimeoutMs = Number.isFinite(configuredResearchTimeout)
    ? Math.max(4_000, Math.min(20_000, configuredResearchTimeout))
    : 15_000;
  const researchLookup = researchAttempted
    ? await researchWithTavily(
        researchQueryForConversation(messages, lastQuestion, followUpResearch),
        locale,
        Math.min(
          researchTimeoutMs,
          Math.max(2_000, deadline - Date.now() - 8_000),
        ),
      )
    : { result: null, status: "not-requested" as const };
  const research = researchLookup.result;
  const researchContext = research
    ? researchPrompt(research)
    : researchAttempted
      ? unavailableResearchPrompt(locale)
      : undefined;

  if (researchAttempted && !research) {
    const failureStatus =
      researchLookup.status === "success" ||
      researchLookup.status === "not-requested"
        ? "failed"
        : researchLookup.status;
    return {
      ok: true,
      message: researchFailureMessage(locale, failureStatus),
      source: "local",
      usingRealContext,
      researched: false,
      researchAttempted: true,
      researchStatus: researchLookup.status,
      retrievalChunkCount: retrieval.chunkCount,
    };
  }

  const system = buildSystemPrompt(
    profile,
    retrieval.context,
    locale,
    normalizeFeedback(clientFeedback),
    researchContext,
  );
  const failures: string[] = [];
  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const remainingTimeout = (reserveMs = 0) =>
    Math.max(
      1_000,
      Math.min(PER_ATTEMPT_TIMEOUT_MS, deadline - Date.now() - reserveMs),
    );

  if (openAIKey) {
    const fallbackReserveMs = openRouterKey ? 9_000 : 1_000;
    const models = unique([
      process.env.OPENAI_CHAT_MODEL,
      "gpt-5-mini",
      "gpt-4.1-mini",
    ]);
    for (const model of models) {
      if (Date.now() >= deadline - fallbackReserveMs - 1_000) break;
      try {
        const message = await callOpenAI({
          apiKey: openAIKey,
          model,
          system,
          messages,
          timeoutMs: remainingTimeout(fallbackReserveMs),
          maxOutputTokens,
        });
        return {
          ok: true,
          message: research
            ? ensureResearchCitations(message, research.sources.length, locale)
            : message,
          source: "openai",
          model,
          usingRealContext,
          researched: Boolean(research),
          researchAttempted,
          researchProvider: research?.provider,
          researchStatus: researchLookup.status,
          sources: research?.sources,
          retrievalChunkCount: retrieval.chunkCount,
        };
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "OpenAI failed");
        if (error instanceof ProviderError && error.stopProvider) break;
      }
    }
  }

  if (openRouterKey) {
    const models = unique([
      process.env.OPENROUTER_CHAT_MODEL,
      "openrouter/auto",
      "openrouter/free",
    ]);
    for (const model of models) {
      if (Date.now() >= deadline - 1_000) break;
      try {
        const message = await callOpenRouter({
          apiKey: openRouterKey,
          model,
          system,
          messages,
          locale,
          timeoutMs: remainingTimeout(),
          maxOutputTokens,
        });
        return {
          ok: true,
          message: research
            ? ensureResearchCitations(message, research.sources.length, locale)
            : message,
          source: "openrouter",
          model,
          usingRealContext,
          researched: Boolean(research),
          researchAttempted,
          researchProvider: research?.provider,
          researchStatus: researchLookup.status,
          sources: research?.sources,
          retrievalChunkCount: retrieval.chunkCount,
        };
      } catch (error) {
        failures.push(
          error instanceof Error ? error.message : "OpenRouter failed",
        );
        if (error instanceof ProviderError && error.stopProvider) break;
      }
    }
  }

  if (failures.length) {
    console.warn(`AI Twin provider failover exhausted: ${failures.join("; ")}`);
  }

  const fallbackMessage = researchAttempted
    ? buildResearchFallback(locale, research)
    : buildLocalKnowledgeResponse(
        lastQuestion,
        profile,
        retrieval.context,
        locale,
      );

  return {
    ok: true,
    message: fallbackMessage,
    source: "local",
    usingRealContext,
    researched: Boolean(research),
    researchAttempted,
    researchProvider: research?.provider,
    researchStatus: researchLookup.status,
    sources: research?.sources,
    retrievalChunkCount: retrieval.chunkCount,
  };
}
