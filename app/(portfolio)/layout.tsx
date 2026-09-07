import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/DarkModeToggle";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { FloatingDock } from "@/components/FloatingDock";
import { GeoProvider } from "@/components/GeoProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { PwaRegister } from "@/components/PwaRegister";
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
    <ClerkProvider>
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
                <div className="fixed md:bottom-6 md:right-40 top-4 right-16 md:top-auto md:left-auto z-30 w-16">
                  <LocaleSwitcher />
                </div>
                <div className="fixed md:bottom-6 md:right-24 top-4 right-18 md:top-auto md:left-auto z-20">
                  <div className="w-10 h-10 md:w-12 md:h-12">
                    <ModeToggle />
                  </div>
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
        <PwaRegister />
      </div>
    </ClerkProvider>
  );
}
