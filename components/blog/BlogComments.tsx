"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { submitBlogComment } from "@/app/actions/submit-blog-comment";
import type { BlogComment } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";

export function BlogComments({
  postId,
  slug,
  locale,
  comments,
}: {
  postId: string;
  slug: string;
  locale: Locale;
  comments: BlogComment[];
}) {
  const isFr = locale === "fr";
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  return (
    <section id="comments" className="mt-16">
      <div className="flex items-center gap-3">
        <MessageCircle className="size-6 text-primary" />
        <h2 className="text-2xl font-bold">
          {isFr ? "Commentaires" : "Comments"} ({comments.length})
        </h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {isFr
          ? "Partagez une remarque utile. Les commentaires sont relus avant publication."
          : "Share a useful perspective. Comments are reviewed before publication."}
      </p>

      <form
        className="mt-7 grid gap-4 rounded-lg bg-muted/35 p-5 ring-1 ring-foreground/5 sm:p-7"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setNotice(null);
          const form = new FormData(event.currentTarget);
          const result = await submitBlogComment({
            postId,
            slug,
            locale,
            name: String(form.get("name") || ""),
            email: String(form.get("email") || ""),
            message: String(form.get("message") || ""),
            website: String(form.get("website") || ""),
          });
          setNotice({ ok: result.ok, text: result.message });
          if (result.ok) event.currentTarget.reset();
          setBusy(false);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            {isFr ? "Nom" : "Name"}
            <input
              name="name"
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              className="h-11 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {isFr ? "E-mail" : "Email"}
            <input
              name="email"
              type="email"
              required
              maxLength={320}
              autoComplete="email"
              className="h-11 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </div>
        <label className="hidden" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {isFr ? "Votre commentaire" : "Your comment"}
          <textarea
            name="message"
            required
            minLength={3}
            maxLength={2_000}
            rows={5}
            className="resize-y rounded-md border bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {isFr
              ? "Votre e-mail ne sera jamais affiché."
              : "Your email address will never be displayed."}
          </p>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Send className="size-4" />
            {busy
              ? isFr
                ? "Envoi…"
                : "Sending…"
              : isFr
                ? "Envoyer"
                : "Submit"}
          </button>
        </div>
        {notice && (
          <output
            className={
              notice.ok ? "text-sm text-primary" : "text-sm text-destructive"
            }
          >
            {notice.text}
          </output>
        )}
      </form>

      {comments.length > 0 && (
        <div className="mt-8 grid gap-4">
          {comments.map((comment) => (
            <article
              key={comment._id}
              className="rounded-lg bg-background p-5 shadow-[0_14px_35px_-30px_rgba(0,0,0,0.7)] ring-1 ring-foreground/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{comment.name}</h3>
                <time
                  dateTime={comment.submittedAt}
                  className="text-xs text-muted-foreground"
                >
                  {new Intl.DateTimeFormat(isFr ? "fr-FR" : "en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(comment.submittedAt))}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {comment.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
