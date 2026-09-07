import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { SocialLinks, socialHref } from "@/components/SocialLinks";
import WorldMapDemo from "@/components/world-map-demo";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { sanityFetch } from "@/sanity/lib/live";
import { ContactForm } from "./ContactForm";

const PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  email,
  emailProfessional,
  phone,
  phoneSecondary,
  whatsapp,
  location,
  socialLinks
}`);

export async function ContactSection({ locale = "en" }: { locale?: Locale }) {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });
  const dict = getDictionary(locale);

  if (!profile) {
    return null;
  }

  const emails = [profile.email, profile.emailProfessional]
    .filter(Boolean)
    .filter((e, i, arr) => arr.indexOf(e) === i);
  const phones = [profile.phone, profile.phoneSecondary]
    .filter(Boolean)
    .filter((e, i, arr) => arr.indexOf(e) === i);

  return (
    <section id="contact" className="py-20 px-6 pb-40 bg-muted/30">
      <WorldMapDemo
        imageAlt={dict.misc.worldMapImageAlt}
        label={dict.misc.worldMapLabel}
        title={dict.misc.worldMapTitle}
      />

      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {dict.contact.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {dict.contact.subtitle}
          </p>
        </div>

        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="@container/info space-y-6">
              <h3 className="text-xl @md/info:text-2xl font-semibold mb-6">
                {dict.contact.contactInfo}
              </h3>

              {emails.length > 0 && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 @md/info:w-6 @md/info:h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">
                      {dict.contact.email}
                    </h4>
                    <div className="space-y-1.5">
                      {emails.map((email) => (
                        <Link
                          key={email}
                          href={socialHref("email", email as string)}
                          className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm truncate block"
                        >
                          {email}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {phones.length > 0 && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 @md/info:w-6 @md/info:h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">
                      {dict.contact.phone}
                    </h4>
                    <div className="space-y-1.5">
                      {phones.map((phone) => (
                        <Link
                          key={phone}
                          href={socialHref("phone", phone as string)}
                          className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm"
                        >
                          {phone}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {profile.location && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 @md/info:w-6 @md/info:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">
                      {dict.contact.location}
                    </h4>
                    <p className="text-muted-foreground text-xs @md/info:text-sm">
                      {profile.location}
                    </p>
                  </div>
                </div>
              )}

              {profile.socialLinks && (
                <div className="pt-6">
                  <h4 className="font-semibold mb-4 text-sm @md/info:text-base">
                    {dict.contact.followMe}
                  </h4>
                  <SocialLinks
                    links={profile.socialLinks}
                    locale={locale}
                    showInContact
                  />
                </div>
              )}
            </div>

            {/* Contact Form */}
            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
