"use server";

import { revalidatePath } from "next/cache";
import { serverClient } from "@/sanity/lib/serverClient";
import { isSanityWriteConfigured } from "@/sanity/lib/serverEnv";

export interface BlogCommentInput {
  postId: string;
  slug: string;
  name: string;
  email: string;
  message: string;
  locale: "en" | "fr";
  website?: string;
}

export async function submitBlogComment(
  input: BlogCommentInput,
): Promise<{ ok: boolean; persisted: boolean; message: string }> {
  const locale = input.locale === "fr" ? "fr" : "en";
  const postId = input.postId?.trim().slice(0, 160);
  const slug = input.slug
    ?.trim()
    .replace(/[^a-zA-Z0-9-]/g, "")
    .slice(0, 96);
  const name = input.name?.trim().replace(/\s+/g, " ").slice(0, 120);
  const email = input.email?.trim().toLowerCase().slice(0, 320);
  const message = input.message?.trim().replace(/\r\n/g, "\n").slice(0, 2_000);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (input.website) {
    return {
      ok: true,
      persisted: false,
      message: locale === "fr" ? "Merci." : "Thank you.",
    };
  }

  if (
    !postId ||
    !slug ||
    name.length < 2 ||
    !emailValid ||
    message.length < 3
  ) {
    return {
      ok: false,
      persisted: false,
      message:
        locale === "fr"
          ? "Vérifiez votre nom, votre e-mail et votre commentaire."
          : "Check your name, email address, and comment.",
    };
  }

  if (!isSanityWriteConfigured) {
    return {
      ok: false,
      persisted: false,
      message:
        locale === "fr"
          ? "Les commentaires ne sont pas encore configurés sur ce serveur."
          : "Comments are not configured on this server yet.",
    };
  }

  try {
    await serverClient.create({
      _type: "blogComment",
      post: { _type: "reference", _ref: postId },
      name,
      email,
      message,
      locale,
      status: "pending",
      submittedAt: new Date().toISOString(),
    });
    revalidatePath(`/blog/${slug}`);
    return {
      ok: true,
      persisted: true,
      message:
        locale === "fr"
          ? "Commentaire envoyé. Il apparaîtra après modération."
          : "Comment submitted. It will appear after moderation.",
    };
  } catch (error) {
    console.error(
      `Blog comment persistence failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return {
      ok: false,
      persisted: false,
      message:
        locale === "fr"
          ? "Le commentaire n'a pas pu être envoyé. Réessayez dans un instant."
          : "The comment could not be submitted. Please try again shortly.",
    };
  }
}
