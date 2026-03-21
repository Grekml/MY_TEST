import Link from "next/link";
import { Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBySlug, PROJECTS } from "@/lib/project-content";
import "../../qa-promo.css";

const bodyFont = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const displayFont = localFont({
  src: "../../../public/fonts/rubik-one-cyrillic.woff2",
  variable: "--font-display",
  display: "swap",
});

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailsPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const detailsIntro = project.detailsShort ?? project.short;
  const testedItems = project.tested && project.tested.length > 0 ? project.tested : project.highlights;
  const bugsItems = project.bugs ?? [];
  const contributionItems = project.contribution ?? [];

  return (
    <main
      className={`${bodyFont.variable} ${displayFont.variable} qa-home relative min-h-screen overflow-hidden overflow-x-hidden px-6 py-12`}
      data-homepage="qa-promo"
    >
      <div className="qa-grid-overlay absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <div className="qa-panel rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="qa-display text-3xl tracking-tight md:text-4xl">{project.title}</h1>
              {project.cardMetrics && project.cardMetrics.length > 0 ? (
                <div className="qa-muted flex flex-wrap gap-2 text-xs">
                  {project.cardMetrics.slice(0, 2).map((metric) => (
                    <span key={metric} className="qa-chip rounded-md px-2 py-1">
                      {metric}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <Link
              href="/#projects"
              className="qa-btn-secondary inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
            >
              Назад
            </Link>
          </div>

          {detailsIntro.trim().length > 0 ? (
            <Card className="qa-panel-soft mt-5 border-none text-inherit shadow-none">
              <CardContent className="qa-muted px-5 py-4 md:text-[15px]">{detailsIntro}</CardContent>
            </Card>
          ) : null}
        </div>

        <section className="grid min-w-0 gap-5 lg:grid-cols-2">
          <Card className="qa-panel-soft min-w-0 border-none text-inherit shadow-none">
            <CardHeader className="px-5 pb-0 pt-4">
              <CardTitle className="qa-display break-words text-2xl">Что я тестировал</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-3">
              <ul className="qa-muted list-disc space-y-3 break-words pl-5 marker:text-[color:var(--qa-ink-muted)] [overflow-wrap:anywhere]">
                {testedItems.map((item) => (
                  <li key={item} className="leading-relaxed break-words [overflow-wrap:anywhere]">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {bugsItems.length > 0 ? (
            <Card className="qa-panel-soft min-w-0 border-none text-inherit shadow-none">
              <CardHeader className="px-5 pb-0 pt-4">
                <CardTitle className="qa-display break-words text-2xl">Какие значимые проблемы находил</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-3">
                <ul className="qa-muted list-disc space-y-3 break-words pl-5 marker:text-[color:var(--qa-ink-muted)] [overflow-wrap:anywhere]">
                  {bugsItems.map((item) => (
                    <li key={item} className="leading-relaxed break-words [overflow-wrap:anywhere]">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {contributionItems.length > 0 ? (
            <Card className="qa-panel min-w-0 border-none text-inherit shadow-none lg:col-span-2">
              <CardHeader className="px-5 pb-0 pt-4">
                <CardTitle className="qa-display break-words text-2xl">Мой вклад</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-3">
                <ul className="qa-muted list-disc space-y-3 break-words pl-5 marker:text-[color:var(--qa-ink-muted)] [overflow-wrap:anywhere]">
                  {contributionItems.map((item) => (
                    <li key={item} className="leading-relaxed break-words [overflow-wrap:anywhere]">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </section>
      </div>
    </main>
  );
}
