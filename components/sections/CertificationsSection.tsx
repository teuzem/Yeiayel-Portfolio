import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { CertificateViewButton } from "@/components/CertificateViewButton";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { DotCarousel } from "./DotCarousel";

const CERTIFICATIONS_QUERY =
  defineQuery(`*[_type == "certification"] | order(order asc){
  name,
  nameFr,
  issuer,
  recipientName,
  issueDate,
  expiryDate,
  credentialId,
  credentialUrl,
  logo,
  certificateFile{asset->{url,_id}},
  certificateImage,
  description,
  descriptionFr,
  skills[]->{name, category},
  order
}`);

export async function CertificationsSection({
  locale = "en",
}: {
  locale?: Locale;
}) {
  // biome-ignore lint/suspicious/noExplicitAny: generated Sanity result varies with the GROQ projection
  const { data: certifications } = await sanityFetch<any[]>({
    query: CERTIFICATIONS_QUERY,
  });
  const dict = getDictionary(locale);
  const certificateOwner = dict.certifications.ownerName;

  if (!certifications || certifications.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      locale === "fr" ? "fr-FR" : "en-US",
      { year: "numeric", month: "long", day: "numeric" },
    );
  };

  const isExpired = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const ownerName = (row: { recipientName?: string | null }) =>
    row.recipientName?.trim() || certificateOwner;

  return (
    <section
      id="certifications"
      className="py-20 px-6 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.certifications.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {dict.certifications.subtitle}
          </p>
        </div>

        <DotCarousel
          ariaLabel={dict.certifications.title}
          items={Array.from(
            { length: Math.ceil(certifications.length / 2) },
            (_, slideIndex) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: grouped carousel slides are positional.
                key={`certification-slide-${slideIndex}`}
                className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-10"
              >
                {certifications
                  .slice(slideIndex * 2, slideIndex * 2 + 2)
                  .map((row) => {
                    const fileUrl = row.certificateFile?.asset?.url;
                    const imageUrl = row.certificateImage
                      ? urlFor(row.certificateImage).width(1400).url()
                      : null;
                    const externalUrl = row.credentialUrl;
                    const viewUrl = fileUrl || imageUrl || externalUrl;
                    const hasDocument = Boolean(fileUrl) || Boolean(imageUrl);
                    const name =
                      (locale === "fr" ? row.nameFr || row.name : row.name) ??
                      "";
                    const description =
                      locale === "fr"
                        ? row.descriptionFr || row.description
                        : row.description;

                    const skillTags = (row.skills ?? [])
                      // biome-ignore lint/suspicious/noExplicitAny: Sanity skill
                      .map((s: any) =>
                        s && typeof s === "object" && "name" in s && s.name
                          ? String(s.name)
                          : "",
                      )
                      .filter(Boolean)
                      .slice(0, 3);

                    return (
                      <article
                        key={`${row.issuer}-${row.name}-${row.issueDate}`}
                        className="relative flex w-full min-w-0 flex-col overflow-hidden border border-primary/40 bg-card"
                      >
                        {/* Decorative top band */}
                        <div className="h-2 w-full bg-primary/60" />

                        {/* Inner award panel */}
                        <div className="m-2 flex flex-col border border-primary/25 bg-card/80 p-2 text-center sm:m-4 sm:p-6">
                          <p className="truncate text-[8px] uppercase tracking-[0.1em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
                            {row.issuer}
                          </p>

                          {row.logo && (
                            <div className="relative mx-auto mt-3 size-9 rounded-full border border-primary/40 bg-muted p-1 sm:mt-4 sm:size-16 sm:border-2 sm:p-1.5">
                              <Image
                                src={urlFor(row.logo)
                                  .width(96)
                                  .height(96)
                                  .url()}
                                alt={row.issuer || "certification"}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}

                          <p className="mt-3 text-[9px] leading-4 text-muted-foreground sm:mt-5 sm:text-sm sm:leading-relaxed">
                            {dict.certifications.awardedTo}
                          </p>

                          <p className="mt-1 truncate text-xs font-serif font-bold tracking-wide text-foreground sm:text-2xl">
                            {ownerName(row)}
                          </p>

                          <h3 className="mt-3 line-clamp-2 text-xs font-semibold leading-tight text-primary sm:mt-6 sm:text-2xl sm:leading-snug">
                            {name}
                          </h3>

                          {row.issueDate && (
                            <p className="mt-2 text-[9px] text-muted-foreground sm:mt-3 sm:text-sm">
                              {dict.certifications.issuedOn}{" "}
                              <span className="font-medium text-foreground">
                                {formatDate(row.issueDate)}
                              </span>
                            </p>
                          )}

                          {description && (
                            <p className="mt-2 line-clamp-2 px-1 text-[9px] leading-4 text-muted-foreground sm:mt-4 sm:px-2 sm:text-xs sm:leading-relaxed">
                              {description}
                            </p>
                          )}

                          {skillTags.length > 0 && (
                            <div className="mt-2 flex max-h-8 flex-wrap justify-center gap-1 overflow-hidden sm:mt-3 sm:max-h-none sm:gap-1.5">
                              {skillTags.map((t: string) => (
                                <span
                                  key={t}
                                  className="bg-primary/10 px-1 py-0.5 text-[8px] text-primary sm:px-2 sm:text-[10px]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {row.credentialId && (
                            <p className="mt-2 line-clamp-1 break-all text-[8px] text-muted-foreground sm:text-[10px]">
                              {dict.certifications.credentialId}:{" "}
                              {row.credentialId}
                            </p>
                          )}

                          {row.expiryDate && (
                            <p className="text-[8px] text-muted-foreground sm:text-[10px]">
                              {dict.certifications.validUntil}:{" "}
                              {formatDate(row.expiryDate)}
                              {isExpired(row.expiryDate)
                                ? ` (${dict.certifications.expired})`
                                : ""}
                            </p>
                          )}
                        </div>

                        {/* Signature / footer */}
                        <div className="mx-2 border-t border-border px-1 pb-2 pt-2 text-[8px] text-muted-foreground sm:mx-4 sm:pb-4 sm:pt-3 sm:text-[10px]">
                          {row.issuer}
                        </div>

                        {/* View button */}
                        {viewUrl && (
                          <div className="mt-1 px-2 py-2 sm:px-4 sm:py-3">
                            {hasDocument ? (
                              <CertificateViewButton
                                href={viewUrl}
                                label={dict.certifications.view}
                                autoDownload
                              />
                            ) : (
                              <Link
                                href={viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                              >
                                {dict.certifications.view}
                                <IconExternalLink className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
              </div>
            ),
          )}
        />
      </div>
    </section>
  );
}
