import { BadgeCheck, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { SocialLinks, socialHref } from "@/components/SocialLinks";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n/dictionary";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ProfileImage } from "./ProfileImage";

const HERO_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  firstName,
  lastName,
  headline,
  headlineFr,
  headlineStaticText,
  headlineStaticTextFr,
  headlineAnimatedWords,
  headlineAnimatedWordsFr,
  headlineAnimationDuration,
  shortBio,
  shortBioFr,
  email,
  phone,
  location,
  availability,
  socialLinks,
  yearsOfExperience,
  profileImage
}`);

export async function HeroSection({ locale = "en" }: { locale?: Locale }) {
  const { data: profile } = await sanityFetch({ query: HERO_QUERY });
  const dict = getDictionary(locale);

  if (!profile) {
    return null;
  }

  const isFr = locale === "fr";
  const firstName = profile.firstName;
  const lastName = profile.lastName;
  const headline = isFr
    ? profile.headlineFr || profile.headline
    : profile.headline;
  const staticText = isFr
    ? profile.headlineStaticTextFr || profile.headlineStaticText
    : profile.headlineStaticText;
  const animatedWords = isFr
    ? profile.headlineAnimatedWordsFr || profile.headlineAnimatedWords || []
    : profile.headlineAnimatedWords || [];
  const shortBio = isFr
    ? profile.shortBioFr || profile.shortBio
    : profile.shortBio;
  const availabilityLabel = profile.availability
    ? (dict.hero[
        profile.availability as "available" | "open" | "unavailable"
      ] ?? profile.availability)
    : "";

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden"
    >
      {/* Background Ripple Effect */}
      <BackgroundRippleEffect rows={8} cols={27} cellSize={56} />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8 @lg:gap-12 items-center">
            {/* Text Content */}
            <div className="@container/hero space-y-4 @md/hero:space-y-6">
              <h1 className="text-4xl @md/hero:text-5xl @lg/hero:text-7xl font-bold tracking-tight">
                {firstName} <span className="text-primary">{lastName}</span>
              </h1>
              {staticText && animatedWords.length > 0 ? (
                <LayoutTextFlip
                  text={staticText}
                  words={animatedWords}
                  duration={profile.headlineAnimationDuration || 3000}
                  className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium"
                />
              ) : (
                <p className="text-xl @md/hero:text-2xl @lg/hero:text-3xl text-muted-foreground font-medium">
                  {headline}
                </p>
              )}
              <p className="text-base @md/hero:text-lg text-muted-foreground leading-relaxed">
                {shortBio}
              </p>

              {profile.socialLinks && (
                <div className="flex flex-wrap gap-3 @md/hero:gap-4 pt-4">
                  <SocialLinks
                    links={profile.socialLinks}
                    locale={locale}
                    size="sm"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4 @md/hero:gap-6 pt-4 text-xs @md/hero:text-sm text-muted-foreground">
                {profile.email && (
                  <Link
                    href={socialHref("email", profile.email)}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{profile.email}</span>
                  </Link>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.availability && (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    <span>{availabilityLabel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Image */}
            {profile.profileImage && (
              <ProfileImage
                imageUrl={urlFor(profile.profileImage)
                  .width(600)
                  .height(600)
                  .url()}
                firstName={profile.firstName || ""}
                lastName={profile.lastName || ""}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
