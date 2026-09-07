import { PortableText } from "@portabletext/react";
import { IconCheck } from "@tabler/icons-react";
import { Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ServicePricing } from "./ServicePricing";

interface ServiceItem {
  title?: string | null;
  titleFr?: string | null;
  slug?: { current?: string } | null;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS dynamic content
  icon?: any;
  shortDescription?: string | null;
  shortDescriptionFr?: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS dynamic content
  fullDescription?: any;
  // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS dynamic content
  fullDescriptionFr?: any;
  features?: string[] | null;
  featuresFr?: string[] | null;
  technologies?: Array<{ name?: string | null }> | null;
  deliverables?: string[] | null;
  deliverablesFr?: string[] | null;
  pricing?: { priceType?: string; visible?: boolean } | null;
  internationalPrice?: number | null;
  internationalCurrency?: string | null;
  localPrice?: number | null;
  localCurrency?: string | null;
  localDiscountPercent?: number | null;
  pricingDescription?: string | null;
  timeline?: string | null;
  featured?: boolean | null;
  order?: number | null;
}

const SERVICES_QUERY =
  defineQuery(`*[_type == "service"] | order(order asc, _createdAt desc){
  title,
  titleFr,
  slug,
  icon,
  shortDescription,
  shortDescriptionFr,
  fullDescription,
  fullDescriptionFr,
  features,
  featuresFr,
  technologies[]->{name, category},
  deliverables,
  deliverablesFr,
  pricing,
  internationalPrice,
  internationalCurrency,
  localPrice,
  localCurrency,
  localDiscountPercent,
  pricingDescription,
  timeline,
  featured,
  order
}`);

export async function ServicesSection({ locale = "en" }: { locale?: Locale }) {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });
  const serviceList = (services ?? []) as ServiceItem[];
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!services || services.length === 0) {
    return null;
  }

  // Separate featured and regular services
  const featured = serviceList.filter((s) => s.featured);
  const regular = serviceList.filter((s) => !s.featured);

  const getServiceSlug = (service: ServiceItem) =>
    service.slug?.current || service.title || "";

  const titleOf = (s: ServiceItem) => (isFr ? s.titleFr || s.title : s.title);
  const shortDescriptionOf = (s: ServiceItem) =>
    isFr ? s.shortDescriptionFr || s.shortDescription : s.shortDescription;
  const fullDescriptionOf = (s: ServiceItem) =>
    isFr ? s.fullDescriptionFr || s.fullDescription : s.fullDescription;
  const featuresOf = (s: ServiceItem) =>
    (isFr ? s.featuresFr || s.features : s.features) || [];

  const requestButton = (service: ServiceItem) => (
    <Link
      href={`/request?service=${encodeURIComponent(getServiceSlug(service))}&locale=${locale}`}
      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
    >
      {dict.services.request}
    </Link>
  );

  return (
    <section id="services" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.services.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {dict.services.subtitle}
          </p>
        </div>

        {/* Featured Services */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              {dict.services.featured}
            </h3>
            <div className="@container">
              <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8">
                {featured.map((service) => (
                  <div
                    key={getServiceSlug(service)}
                    className="@container/card bg-card border-2 border-primary/20 rounded-lg p-6 @lg/card:p-8 hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    {service.icon && (
                      <div className="relative w-12 h-12 @md/card:w-16 @md/card:h-16 mb-4 @md/card:mb-6">
                        <Image
                          src={urlFor(service.icon).width(64).height(64).url()}
                          alt={titleOf(service) || dict.services.altImage}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    <h3 className="text-xl @md/card:text-2xl font-bold mb-3">
                      {titleOf(service)}
                    </h3>

                    {shortDescriptionOf(service) && (
                      <p className="text-muted-foreground mb-4 text-base @md/card:text-lg">
                        {shortDescriptionOf(service)}
                      </p>
                    )}

                    {fullDescriptionOf(service) && (
                      <div className="prose prose-sm dark:prose-invert mb-6">
                        <PortableText
                          // biome-ignore lint/suspicious/noExplicitAny: Sanity CMS dynamic content
                          value={fullDescriptionOf(service) as any}
                        />
                      </div>
                    )}

                    {featuresOf(service).length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-sm @md/card:text-base">
                          {dict.services.keyFeatures}
                        </h4>
                        <ul className="space-y-2">
                          {featuresOf(service).map((feature, idx) => (
                            <li
                              key={`${getServiceSlug(service)}-feature-${idx}`}
                              className="flex items-start gap-2"
                            >
                              <IconCheck className="w-4 h-4 @md/card:w-5 @md/card:h-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground text-sm @md/card:text-base">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 @xs/card:grid-cols-2 gap-4 mb-6 pt-4 border-t">
                      {service.pricing?.visible !== false && (
                        <div>
                          <p className="text-xs @md/card:text-sm text-muted-foreground mb-1">
                            {dict.services.pricing}
                          </p>
                          <ServicePricing service={service} locale={locale} />
                        </div>
                      )}
                      {service.timeline && (
                        <div>
                          <p className="text-xs @md/card:text-sm text-muted-foreground mb-1">
                            {dict.services.timeline}
                          </p>
                          <p className="font-semibold text-sm @md/card:text-base">
                            {service.timeline}
                          </p>
                        </div>
                      )}
                    </div>

                    {requestButton(service)}

                    {service.technologies &&
                      service.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {service.technologies.map((tech, idx) => {
                            const techData =
                              tech && typeof tech === "object" && "name" in tech
                                ? tech
                                : null;
                            return techData?.name ? (
                              <span
                                key={`${getServiceSlug(service)}-tech-${idx}`}
                                className="px-2 py-1 @md/card:px-3 text-xs rounded-full bg-primary/10 text-primary"
                              >
                                {techData.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Regular Services */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <h3 className="text-2xl font-bold mb-6">{dict.services.all}</h3>
            )}
            <div className="@container">
              <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-6">
                {regular.map((service) => (
                  <div
                    key={getServiceSlug(service)}
                    className="@container/card bg-card border rounded-lg p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col"
                  >
                    {service.icon && (
                      <div className="relative w-10 h-10 @md/card:w-12 @md/card:h-12 mb-4">
                        <Image
                          src={urlFor(service.icon).width(48).height(48).url()}
                          alt={titleOf(service) || dict.services.altImage}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    <h3 className="text-lg @md/card:text-xl font-bold mb-2">
                      {titleOf(service)}
                    </h3>

                    {shortDescriptionOf(service) && (
                      <p className="text-muted-foreground mb-4 text-sm @md/card:text-base flex-1 line-clamp-3">
                        {shortDescriptionOf(service)}
                      </p>
                    )}

                    {featuresOf(service).length > 0 && (
                      <ul className="space-y-1 mb-4">
                        {featuresOf(service)
                          .slice(0, 3)
                          .map((feature, idx) => (
                            <li
                              key={`${getServiceSlug(service)}-feature-${idx}`}
                              className="flex items-start gap-2 text-xs @md/card:text-sm"
                            >
                              <IconCheck className="w-3.5 h-3.5 @md/card:w-4 @md/card:h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground line-clamp-2">
                                {feature}
                              </span>
                            </li>
                          ))}
                      </ul>
                    )}

                    <div className="pt-4 border-t space-y-2 flex-1">
                      {service.pricing?.visible !== false && (
                        <div className="text-xs @md/card:text-sm">
                          <ServicePricing service={service} locale={locale} />
                        </div>
                      )}
                      {service.timeline && (
                        <p className="text-xs @md/card:text-sm text-muted-foreground truncate flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 @md/card:w-4 @md/card:h-4 flex-shrink-0" />
                          <span className="truncate">{service.timeline}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-4">{requestButton(service)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
