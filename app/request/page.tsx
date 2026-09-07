import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";
import { GeoProvider } from "@/components/GeoProvider";
import { RequestPaymentForm } from "@/components/RequestPaymentForm";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { buildPriceBreakdown } from "@/lib/pricing";
import { sanityFetch } from "@/sanity/lib/live";

const SERVICE_QUERY =
  defineQuery(`*[_type == "service" && slug.current == $slug][0]{
  title,
  titleFr,
  shortDescription,
  shortDescriptionFr,
  pricing,
  internationalPrice,
  internationalCurrency,
  localPrice,
  localCurrency,
  localDiscountPercent,
  pricingDescription,
  deliverables,
  deliverablesFr,
  workflow,
  workflowFr,
  timeline
}`);

export default async function RequestServicePage(props: {
  searchParams: Promise<{ service?: string; locale?: string }>;
}) {
  const searchParams = await props.searchParams;
  const slug = searchParams.service;
  const isFr = searchParams.locale === "fr";
  const locale: Locale = isFr ? "fr" : "en";
  const dict = getDictionary(locale);

  if (!slug) {
    notFound();
  }

  const { data: service } = await sanityFetch({
    query: SERVICE_QUERY,
    params: { slug },
  });

  if (!service) {
    notFound();
  }

  const priceType = service.pricing?.priceType ?? "project";
  const breakdown = buildPriceBreakdown({
    internationalPrice: service.internationalPrice ?? undefined,
    localPrice: service.localPrice ?? undefined,
    internationalCurrency: service.internationalCurrency ?? undefined,
    localCurrency: service.localCurrency ?? undefined,
    localDiscountPercent: service.localDiscountPercent ?? undefined,
    priceType,
  });

  const title = isFr ? service.titleFr || service.title : service.title;
  const shortDescription = isFr
    ? service.shortDescriptionFr || service.shortDescription
    : service.shortDescription;
  const deliverables = isFr
    ? service.deliverablesFr || service.deliverables || []
    : service.deliverables || [];
  const workflow = isFr
    ? service.workflowFr || service.workflow || []
    : service.workflow || [];

  const serviceTitle = title ?? "";
  const serviceDescription = shortDescription ?? "";

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-5xl px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.workflow.requestService}
          </h1>
          <p className="text-xl text-muted-foreground">
            {dict.workflow.fillForm}
          </p>
        </div>

        <GeoProvider>
          <RequestPaymentForm
            serviceTitle={serviceTitle}
            serviceSlug={slug}
            serviceDescription={serviceDescription}
            breakdown={breakdown}
            deliverables={deliverables}
            workflow={workflow}
            pricingDescription={service.pricingDescription || ""}
            timeline={service.timeline || ""}
            locale={locale}
          />
        </GeoProvider>
      </div>
    </div>
  );
}
