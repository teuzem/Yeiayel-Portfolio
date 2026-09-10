import { defineQuery } from "next-sanity";
import TwinChat from "@/components/chat/TwinChat";
import { getSiteSettings } from "@/lib/site-settings";
import { normalizeProfile, type TwinProfile } from "@/lib/twin";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const CHAT_PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
    _id,
    _type,
    firstName,
    lastName,
    headline,
    shortBio,
    email,
    phone,
    location,
    availability,
    yearsOfExperience,
    profileImage
  }`);

// biome-ignore lint/suspicious/noExplicitAny: dynamic Sanity result
function toProfile(data: any): TwinProfile | null {
  const profile = normalizeProfile(data);
  if (profile && data?.profileImage) {
    try {
      profile.profileImageUrl = urlFor(data.profileImage)
        .width(160)
        .height(160)
        .url();
    } catch {
      profile.profileImageUrl = null;
    }
  }
  return profile;
}

async function ChatWrapper() {
  const [{ data: profile }, settings] = await Promise.all([
    sanityFetch({ query: CHAT_PROFILE_QUERY }),
    getSiteSettings(),
  ]);
  const normalized =
    toProfile(profile) ||
    (settings.visitorFallbackAvatarUrl
      ? { visitorFallbackAvatarUrl: settings.visitorFallbackAvatarUrl }
      : null);
  if (normalized) {
    normalized.visitorFallbackAvatarUrl =
      settings.visitorFallbackAvatarUrl ?? null;
  }

  return (
    <div className="h-full min-h-0 w-full overflow-hidden">
      <TwinChat profile={normalized} />
    </div>
  );
}

export default ChatWrapper;
