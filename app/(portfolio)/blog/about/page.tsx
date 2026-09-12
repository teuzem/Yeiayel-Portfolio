import {
  BadgeCheck,
  BookOpenCheck,
  Languages,
  Scale,
  Target,
} from "lucide-react";
import { BlogPageHero } from "@/components/blog/BlogPageHero";
import { getServerLocale } from "@/components/server-context";
import { getBlogCategories, getBlogPosts, getBlogSettings } from "@/lib/blog";

export default async function AboutBlogPage() {
  const [locale, settings, posts, categories] = await Promise.all([
    getServerLocale(),
    getBlogSettings(),
    getBlogPosts(),
    getBlogCategories(),
  ]);
  const isFr = locale === "fr";
  const position =
    (isFr
      ? settings.positionFr || settings.position
      : settings.position || settings.positionFr) || "Bâtir le Pays SARL";

  const principles = [
    {
      icon: Target,
      title: isFr ? "Utilité concrète" : "Practical usefulness",
      text: isFr
        ? "Chaque publication part d'un problème réel et mène vers des décisions ou des méthodes applicables."
        : "Every publication starts with a real problem and leads to decisions or methods readers can apply.",
    },
    {
      icon: Scale,
      title: isFr ? "Rigueur éditoriale" : "Editorial rigor",
      text: isFr
        ? "Les faits actuels sont sourcés, les opinions sont identifiées et les évaluations exposent leurs critères."
        : "Current claims are sourced, opinions are identified, and reviews disclose their evaluation criteria.",
    },
    {
      icon: Languages,
      title: isFr ? "Bilingue par conception" : "Bilingual by design",
      text: isFr
        ? "Les articles, résumés et métadonnées SEO peuvent être publiés nativement en français et en anglais."
        : "Articles, summaries, and SEO metadata can be published natively in English and French.",
    },
    {
      icon: BadgeCheck,
      title: isFr ? "Expérience de terrain" : "Practice-led perspective",
      text: isFr
        ? `La ligne éditoriale s'appuie sur une expérience professionnelle active, notamment ${position}.`
        : `The editorial point of view is grounded in active professional experience, including ${position}.`,
    },
  ];

  return (
    <main>
      <BlogPageHero
        eyebrow={isFr ? "Notre ligne éditoriale" : "Our editorial approach"}
        title={isFr ? "À propos du Journal Yeiayel" : "About Yeiayel Journal"}
        description={
          isFr
            ? "Un média professionnel consacré à la data science, aux systèmes numériques, à l'ingénierie logicielle, au cloud, à la sécurité et à l'innovation."
            : "A professional publication focused on data science, digital systems, software engineering, cloud, security, and innovation."
        }
        icon={BookOpenCheck}
        metrics={[
          {
            value: posts.length,
            label: isFr ? "publications" : "publications",
          },
          { value: categories.length, label: isFr ? "domaines" : "domains" },
          { value: 2, label: isFr ? "langues" : "languages" },
        ]}
        dark
      />

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm font-semibold text-primary">
              {isFr ? "Pourquoi ce journal" : "Why this journal"}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              {isFr
                ? "Transformer l'expérience en connaissance utile"
                : "Turning experience into useful knowledge"}
            </h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              {isFr
                ? "Yeiayel Journal prolonge le portfolio avec des analyses détaillées, des retours d'expérience, des guides et des évaluations conçus pour les professionnels, les étudiants et les décideurs."
                : "Yeiayel Journal extends the portfolio through detailed analysis, field notes, guides, and reviews designed for professionals, students, and decision-makers."}
            </p>
          </div>
          <div className="grid border-y sm:grid-cols-2">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="border-b p-6 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0"
              >
                <principle.icon className="size-6 text-primary" />
                <h3 className="mt-6 text-lg font-semibold">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
