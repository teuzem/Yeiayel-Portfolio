import { Suspense } from "react";
import { getServerLocale } from "@/components/server-context";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { getDictionary } from "@/lib/i18n/dictionary";
import ChatWrapper from "./chat/ChatWrapper";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  return (
    <Sidebar {...props}>
      <SidebarContent className="h-full min-h-0 w-full overflow-hidden bg-background">
        <Suspense fallback={<div>{dict.misc.loading}</div>}>
          <ChatWrapper />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  );
}
