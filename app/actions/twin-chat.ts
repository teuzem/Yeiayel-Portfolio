"use server";

import {
  buildSystemPrompt,
  type ChatMessage,
  type TwinProfile,
  toOpenRouterMessages,
} from "@/lib/twin";
import { buildTwinContextFromSanity } from "@/lib/twin-context";

export interface TwinChatResponse {
  ok: boolean;
  message?: string;
  error?: string;
  source: "openrouter";
  usingRealContext: boolean;
}

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MAX_TRIES = 3;

// `openrouter/free` auto-routes to an available free model; the rest are
// current, stable free fallback models in case the router is unavailable.
const FREE_MODELS = [
  "openrouter/free",
  "google/gemma-4-26b-a4b-it:free",
  "minimax/minimax-m2.7:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

export async function chatWithTwin(
  messages: ChatMessage[],
  profile?: TwinProfile | null,
  locale: "en" | "fr" = "en",
): Promise<TwinChatResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "OPENROUTER_API_KEY is not configured",
      source: "openrouter",
      usingRealContext: false,
    };
  }

  // Pull the person's real background from Sanity so the twin answers from
  // accurate data instead of generic "I don't have access" responses.
  const context = await buildTwinContextFromSanity();
  const system = buildSystemPrompt(profile ?? null, context, locale);
  const usingRealContext = Boolean(
    context.experience ||
      context.projects ||
      context.skills ||
      context.blog ||
      context.services,
  );

  const body = [
    { role: "system", content: system },
    ...toOpenRouterMessages(messages),
  ];

  const tries = Math.min(messages.length, MAX_TRIES);
  let lastError = "No model responded";

  for (let i = 0; i < tries; i++) {
    const model = FREE_MODELS[i % FREE_MODELS.length];
    try {
      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: body,
          temperature: 0.7,
          max_tokens: 768,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        lastError = `Model ${model} failed (${response.status}): ${text.slice(0, 200)}`;
        continue;
      }

      const data = await response.json();
      const message = data?.choices?.[0]?.message?.content;
      if (typeof message === "string" && message.trim()) {
        return {
          ok: true,
          message: message.trim(),
          source: "openrouter",
          usingRealContext,
        };
      }
      lastError = "Model returned an empty response";
    } catch {
      lastError = `Network error calling ${model}`;
    }
  }

  return {
    ok: false,
    error: lastError,
    source: "openrouter",
    usingRealContext,
  };
}
