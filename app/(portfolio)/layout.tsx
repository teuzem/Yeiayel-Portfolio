import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { AuthProvider } from "@/components/AuthProvider";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/DarkModeToggle";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { FloatingDock } from "@/components/FloatingDock";
import { GeoProvider } from "@/components/GeoProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import SidebarToggle from "@/components/SidebarToggle";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SanityLive } from "@/sanity/lib/live";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <GeoProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={false}>
                <SidebarInset>{children}</SidebarInset>
                <AppSidebar side="right" />
                <FloatingDock />
                <SidebarToggle />
                <div className="fixed right-4 top-4 z-40 flex items-center gap-2 md:bottom-6 md:right-24 md:top-auto">
                  <LocaleSwitcher />
                  <ModeToggle />
                </div>
              </SidebarProvider>
              <SanityLive />
              {(await draftMode()).isEnabled && (
                <>
                  <VisualEditing />
                  <DisableDraftMode />
                </>
              )}
            </ThemeProvider>
          </GeoProvider>
        </LocaleProvider>
      </div>
    </AuthProvider>
  );
}
