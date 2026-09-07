import { defineQuery } from "next-sanity";
import TwinChat from "@/components/chat/TwinChat";
import { normalizeProfile, type TwinProfile } from "@/lib/twin";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import SidebarToggle from "../SidebarToggle";

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
  const { data: profile } = await sanityFetch({ query: CHAT_PROFILE_QUERY });

  return (
    <div className="h-full w-full">
      <div className="md:hidden p-2 sticky top-0 z-10">
        <SidebarToggle />
      </div>

      <TwinChat profile={toProfile(profile)} />
    </div>
  );
}

export default ChatWrapper;
