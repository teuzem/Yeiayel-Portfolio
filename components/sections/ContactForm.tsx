"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "@/app/actions/submit-contact-form";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";

export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const dict = getDictionary(locale);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    startTransition(async () => {
      const result = await submitContactForm(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: dict.contact.success,
        });
        // Reset the form
        (e.target as HTMLFormElement).reset();
        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus({ type: null, message: "" });
        }, 5000);
      } else {
        setStatus({
          type: "error",
          message: dict.contact.error,
        });
      }
    });
  };

  return (
    <div className="@container/form bg-card border rounded-lg p-4 @md/form:p-6">
      <h3 className="text-xl @md/form:text-2xl font-semibold mb-6">
        {dict.contact.sendMessage}
      </h3>

      {status.type && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            status.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {status.message}
        </div>
      )}

      <form className="space-y-3 @md/form:space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-xs @md/form:text-sm font-medium mb-2"
          >
            {dict.contact.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-1.5 @md/form:px-4 @md/form:py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm @md/form:text-base"
            placeholder={dict.contact.namePlaceholder}
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs @md/form:text-sm font-medium mb-2"
          >
            {dict.contact.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-3 py-1.5 @md/form:px-4 @md/form:py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm @md/form:text-base"
            placeholder={dict.contact.emailPlaceholder}
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs @md/form:text-sm font-medium mb-2"
          >
            {dict.contact.subject}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="w-full px-3 py-1.5 @md/form:px-4 @md/form:py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm @md/form:text-base"
            placeholder={dict.contact.subjectPlaceholder}
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs @md/form:text-sm font-medium mb-2"
          >
            {dict.contact.message}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="w-full px-3 py-1.5 @md/form:px-4 @md/form:py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm @md/form:text-base"
            placeholder={dict.contact.messagePlaceholder}
            required
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 @md/form:px-6 @md/form:py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm @md/form:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? dict.contact.sending : dict.contact.send}
        </button>
      </form>
    </div>
  );
}
