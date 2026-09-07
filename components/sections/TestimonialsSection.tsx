import { defineQuery } from "next-sanity";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const TESTIMONIALS_QUERY =
  defineQuery(`*[_type == "testimonial" && featured == true] | order(order asc){
  name,
  position,
  company,
  testimonial,
  testimonialFr,
  rating,
  date,
  avatar,
  companyLogo,
  linkedinUrl
}`);

export async function TestimonialsSection({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const { data: testimonials } = await sanityFetch<any[]>({
    query: TESTIMONIALS_QUERY,
  });
  const dict = getDictionary(locale);
  const isFr = locale === "fr";

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Map Sanity testimonials to AnimatedTestimonials format
  const formattedTestimonials = testimonials.map((testimonial) => ({
    quote: isFr
      ? testimonial.testimonialFr || testimonial.testimonial || ""
      : testimonial.testimonial || "",
    name: testimonial.name || dict.testimonials.anonymous,
    designation: testimonial.company
      ? `${testimonial.position} ${dict.testimonials.at} ${testimonial.company}`
      : testimonial.position || "",
    // Use avatar for the main image
    src: testimonial.avatar
      ? urlFor(testimonial.avatar).width(500).height(500).url()
      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500&auto=format&fit=crop",
    // Pass company logo separately to show next to name
    companyLogo: testimonial.companyLogo
      ? urlFor(testimonial.companyLogo).width(32).height(32).url()
      : undefined,
  }));

  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.testimonials.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {dict.testimonials.subtitle}
          </p>
        </div>

        <AnimatedTestimonials
          testimonials={formattedTestimonials}
          autoplay={true}
          altLogo={dict.testimonials.altLogo}
          prevLabel={dict.testimonials.prev}
          nextLabel={dict.testimonials.next}
        />
      </div>
    </section>
  );
}
