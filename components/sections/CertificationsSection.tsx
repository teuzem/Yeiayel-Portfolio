import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { CertificateViewButton } from "@/components/CertificateViewButton";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
          {certifications.map((row) => {
            const fileUrl = row.certificateFile?.asset?.url;
            const imageUrl = row.certificateImage
              ? urlFor(row.certificateImage).width(1400).url()
              : null;
            const externalUrl = row.credentialUrl;
            const viewUrl = fileUrl || imageUrl || externalUrl;
            const hasDocument = Boolean(fileUrl) || Boolean(imageUrl);
            const name =
              (locale === "fr" ? row.nameFr || row.name : row.name) ?? "";
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
                className="w-full max-w-[430px] relative rounded-2xl border-2 border-primary/40 bg-card shadow-xl overflow-hidden flex flex-col"
              >
                {/* Decorative top band */}
                <div className="h-2 w-full bg-primary/60" />

                {/* Inner award panel */}
                <div className="rounded-xl border border-primary/25 bg-card/80 m-4 p-6 text-center flex flex-col">
                  <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">
                    {row.issuer}
                  </p>

                  {row.logo && (
                    <div className="mx-auto mt-4 h-16 w-16 rounded-full border-2 border-primary/40 bg-muted p-1.5 relative">
                      <Image
                        src={urlFor(row.logo).width(96).height(96).url()}
                        alt={row.issuer || "certification"}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                    {dict.certifications.awardedTo}
                  </p>

                  <p className="mt-1 text-2xl font-serif font-bold text-foreground tracking-wide">
                    {ownerName(row)}
                  </p>

                  <h3 className="mt-6 text-2xl font-semibold text-primary leading-snug text-center">
                    {name}
                  </h3>

                  {row.issueDate && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {dict.certifications.issuedOn}{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(row.issueDate)}
                      </span>
                    </p>
                  )}

                  {description && (
                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed px-2">
                      {description}
                    </p>
                  )}

                  {skillTags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                      {skillTags.map((t: string) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {row.credentialId && (
                    <p className="mt-2 text-[10px] text-muted-foreground break-all">
                      {dict.certifications.credentialId}: {row.credentialId}
                    </p>
                  )}

                  {row.expiryDate && (
                    <p className="text-[10px] text-muted-foreground">
                      {dict.certifications.validUntil}:{" "}
                      {formatDate(row.expiryDate)}
                      {isExpired(row.expiryDate)
                        ? ` (${dict.certifications.expired})`
                        : ""}
                    </p>
                  )}
                </div>

                {/* Signature / footer */}
                <div className="border-t border-border mx-4 pt-3 pb-4 text-[10px] text-muted-foreground">
                  {row.issuer}
                </div>

                {/* View button */}
                {viewUrl && (
                  <div className="mt-1 px-4 py-3">
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
      </div>
    </section>
  );
}
