"use server";

import { serverClient } from "@/sanity/lib/serverClient";
import { isSanityWriteConfigured } from "@/sanity/lib/serverEnv";

export interface TwinFeedbackInput {
  messageId: string;
  rating: "helpful" | "not-helpful";
  locale: "en" | "fr";
  question: string;
  answer: string;
  source?: "openai" | "openrouter" | "local";
  model?: string;
  researched?: boolean;
  researchProvider?: "tavily";
  researchSourceCount?: number;
}

export async function submitTwinFeedback(
  input: TwinFeedbackInput,
): Promise<{ ok: boolean; persisted: boolean }> {
  const messageId = input.messageId?.trim().slice(0, 96);
  const question = input.question?.trim().slice(0, 4_000);
  const answer = input.answer?.trim().slice(0, 8_000);
  const locale = input.locale === "fr" ? "fr" : "en";
  const rating = input.rating === "not-helpful" ? "not-helpful" : "helpful";

  if (!messageId || !question || !answer) {
    return { ok: false, persisted: false };
  }

  if (!isSanityWriteConfigured) {
    return { ok: true, persisted: false };
  }

  try {
    await serverClient.createIfNotExists({
      _id: `twinFeedback-${messageId.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
      _type: "twinFeedback",
      feedbackType: "message",
      messageId,
      rating,
      locale,
      question,
      answer,
      source: input.source || "local",
      model: input.model?.trim().slice(0, 160),
      researched: Boolean(input.researched),
      researchProvider: input.researchProvider,
      researchSourceCount: Math.max(
        0,
        Math.min(20, Math.round(input.researchSourceCount || 0)),
      ),
      submittedAt: new Date().toISOString(),
      status: "new",
    });
    return { ok: true, persisted: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown feedback error";
    console.error(`AI Twin feedback persistence failed: ${message}`);
    return { ok: true, persisted: false };
  }
}
