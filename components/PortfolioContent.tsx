import {
  AboutSection,
  AchievementsSection,
  BlogSection,
  CertificationsSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  HeroSection,
  ProjectsSection,
  ServicesSection,
  SkillsSection,
  TestimonialsSection,
} from "@/components/sections";
import { getServerLocale } from "@/components/server-context";

export default async function PortfolioContent() {
  const locale = await getServerLocale();

  return (
    <>
      <HeroSection locale={locale} />
      <AboutSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <SkillsSection locale={locale} />
      <ExperienceSection locale={locale} />
      <EducationSection locale={locale} />
      <ProjectsSection locale={locale} />
      <CertificationsSection locale={locale} />
      <AchievementsSection locale={locale} />
      <BlogSection locale={locale} />
      <ServicesSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  );
}
