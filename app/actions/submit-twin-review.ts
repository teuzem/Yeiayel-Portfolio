"use server";

import { serverClient } from "@/sanity/lib/serverClient";
import { isSanityWriteConfigured } from "@/sanity/lib/serverEnv";

export interface TwinReviewInput {
  rating: number;
  note?: string;
  locale: "en" | "fr";
  questionCount: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export async function submitTwinReview(
  input: TwinReviewInput,
): Promise<{ ok: boolean; persisted: boolean }> {
  const rating = Math.max(1, Math.min(5, Math.round(input.rating)));
  const note = input.note?.trim().slice(0, 2_000) || "";
  const locale = input.locale === "fr" ? "fr" : "en";
  const questionCount = Math.max(
    0,
    Math.min(500, Math.round(input.questionCount)),
  );

  if (!rating || !isSanityWriteConfigured) {
    return { ok: Boolean(rating), persisted: false };
  }

  try {
    await serverClient.create({
      _type: "twinFeedback",
      feedbackType: "review",
      rating: "review",
      score: rating,
      note,
      locale,
      questionCount,
      userId: input.userId?.trim().slice(0, 128),
      userName: input.userName?.trim().slice(0, 160),
      userEmail: input.userEmail?.trim().slice(0, 320),
      submittedAt: new Date().toISOString(),
      status: "new",
    });
    return { ok: true, persisted: true };
  } catch (error) {
    console.error(
      `AI Twin review persistence failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return { ok: true, persisted: false };
  }
}
