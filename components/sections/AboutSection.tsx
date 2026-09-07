import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { sanityFetch } from "@/sanity/lib/live";

const ABOUT_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  fullBio,
  fullBioFr,
  yearsOfExperience,
  stats,
  email,
  phone,
  location
}`);

export async function AboutSection({ locale = "en" }: { locale?: Locale }) {
  const { data: profile } = await sanityFetch({ query: ABOUT_QUERY });
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!profile) {
    return null;
  }

  const fullBio = isFr ? profile.fullBioFr || profile.fullBio : profile.fullBio;

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.about.title}
          </h2>
          <p className="text-xl text-muted-foreground">{dict.about.subtitle}</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {fullBio && (
            <PortableText
              value={fullBio}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-semibold mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                      {children}
                    </blockquote>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  link: ({ children, value }) => {
                    const href = value?.href || "";
                    const isExternal = href.startsWith("http");
                    return (
                      <Link
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-primary hover:underline"
                      >
                        {children}
                      </Link>
                    );
                  },
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                      {children}
                    </ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
                      {children}
                    </ol>
                  ),
                },
              }}
            />
          )}
        </div>

        {/* Stats from CMS */}
        {profile.stats && profile.stats.length > 0 && (
          <div className="@container mt-12 pt-12 border-t">
            <div className="grid grid-cols-2 @lg:grid-cols-4 gap-6">
              {profile.stats.map(
                (
                  stat: { label?: string; labelFr?: string; value?: string },
                  idx: number,
                ) => (
                  <div
                    key={`${stat.label}-${idx}`}
                    className="@container/stat text-center"
                  >
                    <div className="text-3xl @md/stat:text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs @md/stat:text-sm text-muted-foreground">
                      {isFr
                        ? (stat as unknown as { labelFr?: string }).labelFr ||
                          stat.label
                        : stat.label}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
