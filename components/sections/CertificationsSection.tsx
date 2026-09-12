import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { CertificateViewButton } from "@/components/CertificateViewButton";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ResponsiveDotCarousel } from "./ResponsiveDotCarousel";

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
  // biome-ignore lint/suspicious/noExplicitAny: generated Sanity result varies with the GROQ projection.
  const { data: certifications } = await sanityFetch<any[]>({
    query: CERTIFICATIONS_QUERY,
  });
  const dict = getDictionary(locale);
  const certificateOwner = dict.certifications.ownerName;

  if (!certifications?.length) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const cards = certifications.map((row) => {
    const fileUrl = row.certificateFile?.asset?.url;
    const imageUrl = row.certificateImage
      ? urlFor(row.certificateImage).width(1400).url()
      : null;
    const viewUrl = fileUrl || imageUrl || row.credentialUrl;
    const hasDocument = Boolean(fileUrl) || Boolean(imageUrl);
    const name =
      (locale === "fr" ? row.nameFr || row.name : row.name || row.nameFr) || "";
    const description =
      locale === "fr"
        ? row.descriptionFr || row.description
        : row.description || row.descriptionFr;
    const skillTags = (row.skills ?? [])
      // biome-ignore lint/suspicious/noExplicitAny: Sanity skill projection is dynamic.
      .map((skill: any) =>
        skill && typeof skill === "object" && skill.name
          ? String(skill.name)
          : "",
      )
      .filter(Boolean)
      .slice(0, 3);
    const owner = row.recipientName?.trim() || certificateOwner;
    const expired = row.expiryDate && new Date(row.expiryDate) < new Date();

    return (
      <article
        key={`${row.issuer}-${row.name}-${row.issueDate}`}
        className="relative flex h-full min-h-[520px] min-w-0 flex-col overflow-hidden border border-primary/35 bg-card"
      >
        <div className="h-2 w-full bg-primary/60" />
        <div className="m-4 flex flex-1 flex-col border border-primary/20 p-5 text-center sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {row.issuer}
          </p>

          {row.logo ? (
            <div className="relative mx-auto mt-4 size-16 rounded-full border-2 border-primary/30 bg-muted p-1.5">
              <Image
                src={urlFor(row.logo).width(128).height(128).url()}
                alt={row.issuer || "Certification"}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          ) : null}

          <p className="mt-5 text-sm text-muted-foreground">
            {dict.certifications.awardedTo}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-wide">{owner}</p>
          <h3 className="mt-6 text-2xl font-semibold leading-snug text-primary">
            {name}
          </h3>

          {row.issueDate ? (
            <p className="mt-3 text-sm text-muted-foreground">
              {dict.certifications.issuedOn}{" "}
              <span className="font-medium text-foreground">
                {formatDate(row.issueDate)}
              </span>
            </p>
          ) : null}

          {description ? (
            <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}

          {skillTags.length ? (
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {skillTags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-primary/10 px-2 py-1 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-auto pt-5 text-xs text-muted-foreground">
            {row.credentialId ? (
              <p className="break-all">
                {dict.certifications.credentialId}: {row.credentialId}
              </p>
            ) : null}
            {row.expiryDate ? (
              <p className="mt-1">
                {dict.certifications.validUntil}: {formatDate(row.expiryDate)}
                {expired ? ` (${dict.certifications.expired})` : ""}
              </p>
            ) : null}
          </div>
        </div>

        {viewUrl ? (
          <div className="px-4 pb-4">
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
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {dict.certifications.view}
                <IconExternalLink className="size-4" />
              </Link>
            )}
          </div>
        ) : null}
      </article>
    );
  });

  return (
    <section id="certifications" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            {dict.certifications.title}
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            {dict.certifications.subtitle}
          </p>
        </div>

        <ResponsiveDotCarousel
          ariaLabel={dict.certifications.title}
          items={cards}
          desktopItemsPerSlide={2}
          desktopGridClassName="grid grid-cols-2 gap-10"
          singleItemClassName="mx-auto w-full max-w-xl"
        />
      </div>
    </section>
  );
}
