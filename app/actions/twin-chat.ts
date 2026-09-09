"use server";

import {
  buildLocalKnowledgeResponse,
  buildSystemPrompt,
  type ChatMessage,
  type TwinLocale,
  type TwinProfile,
  toProviderMessages,
} from "@/lib/twin";
import { buildTwinKnowledgeFromSanity } from "@/lib/twin-context";

export interface TwinChatResponse {
  ok: boolean;
  message: string;
  source: "openai" | "openrouter" | "local";
  model?: string;
  usingRealContext: boolean;
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
      return { role, content };
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

function responseLanguageReminder(locale: TwinLocale): string {
  return locale === "fr"
    ? "Rappel final : réponds uniquement en français naturel et ne mélange aucune phrase anglaise."
    : "Final reminder: answer only in natural English and do not mix in French sentences.";
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
        max_output_tokens: 1_400,
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
        max_tokens: 1_400,
      }),
    },
    options.timeoutMs,
  );
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ProviderError(
      `OpenRouter ${options.model} returned ${response.status}`,
      [401, 403].includes(response.status),
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
): Promise<TwinChatResponse> {
  const locale: TwinLocale = requestedLocale === "fr" ? "fr" : "en";
  const messages = normalizeMessages(rawMessages);
  const lastQuestion = messages.at(-1)?.content || "";
  const { context, profile: serverProfile } =
    await buildTwinKnowledgeFromSanity(locale);
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
    };
  }

  const system = buildSystemPrompt(profile, context, locale);
  const configuredBudget = Number(process.env.TWIN_CHAT_TIMEOUT_MS);
  const budgetMs = Number.isFinite(configuredBudget)
    ? Math.max(10_000, Math.min(55_000, configuredBudget))
    : DEFAULT_REQUEST_BUDGET_MS;
  const deadline = Date.now() + budgetMs;
  const failures: string[] = [];
  const remainingTimeout = () =>
    Math.max(1_000, Math.min(PER_ATTEMPT_TIMEOUT_MS, deadline - Date.now()));

  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  if (openAIKey) {
    const models = unique([
      process.env.OPENAI_CHAT_MODEL,
      "gpt-5-mini",
      "gpt-4.1-mini",
    ]);
    for (const model of models) {
      if (Date.now() >= deadline - 1_000) break;
      try {
        const message = await callOpenAI({
          apiKey: openAIKey,
          model,
          system,
          messages,
          timeoutMs: remainingTimeout(),
        });
        return {
          ok: true,
          message,
          source: "openai",
          model,
          usingRealContext,
        };
      } catch (error) {
        failures.push(error instanceof Error ? error.message : "OpenAI failed");
        if (error instanceof ProviderError && error.stopProvider) break;
      }
    }
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
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
        });
        return {
          ok: true,
          message,
          source: "openrouter",
          model,
          usingRealContext,
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

  return {
    ok: true,
    message: buildLocalKnowledgeResponse(
      lastQuestion,
      profile,
      context,
      locale,
    ),
    source: "local",
    usingRealContext,
  };
}
