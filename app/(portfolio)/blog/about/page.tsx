import { getServerLocale } from "@/components/server-context";
import { getBlogSettings } from "@/lib/blog";

export default async function AboutBlogPage() {
  const [locale, settings] = await Promise.all([
    getServerLocale(),
    getBlogSettings(),
  ]);
  const isFr = locale === "fr";
  const position =
    (isFr
      ? settings.positionFr || settings.position
      : settings.position || settings.positionFr) || "Bâtir le Pays SARL";
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold text-primary">
        {isFr ? "Notre ligne éditoriale" : "Our editorial approach"}
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {isFr ? "À propos du Journal Yeiayel" : "About Yeiayel Journal"}
      </h1>
      <div className="mt-8 space-y-8 text-lg leading-8 text-muted-foreground">
        <p>
          {isFr
            ? "Ce blog transforme l'expérience du portfolio en analyses pratiques sur la data science, l'intelligence artificielle, le développement logiciel, le cloud, la sécurité et l'innovation numérique."
            : "This publication turns the portfolio’s experience into practical analysis on data science, artificial intelligence, software engineering, cloud, security, and digital innovation."}
        </p>
        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            {isFr ? "Expérience professionnelle" : "Professional perspective"}
          </h2>
          <p className="mt-3">
            {position}.{" "}
            {isFr
              ? "Les contenus privilégient les problèmes réels, les décisions mesurables et les solutions que les équipes peuvent maintenir."
              : "The editorial focus is on real problems, measurable decisions, and solutions teams can sustain."}
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            {isFr ? "Principes éditoriaux" : "Editorial principles"}
          </h2>
          <p className="mt-3">
            {isFr
              ? "Les faits actuels doivent être sourcés. Les opinions sont identifiées. Les évaluations expliquent leurs critères. Les corrections et mises à jour peuvent être ajoutées dans Sanity Studio."
              : "Current claims should be sourced. Opinions are identified. Reviews explain their criteria. Corrections and updates can be managed through Sanity Studio."}
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            {isFr ? "Langues" : "Languages"}
          </h2>
          <p className="mt-3">
            {isFr
              ? "Chaque article peut être publié nativement en français et en anglais, avec un contenu, un résumé et des métadonnées SEO adaptés."
              : "Every article can be published natively in English and French, with localized body content, summaries, and SEO metadata."}
          </p>
        </section>
      </div>
    </main>
  );
}
