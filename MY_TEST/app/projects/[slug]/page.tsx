import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBySlug, PROJECTS } from "@/lib/project-content";

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
    <main className="relative min-h-screen bg-[#0f121a] px-6 py-12 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: "radial-gradient(1200px 600px at 80% -10%, rgba(245, 158, 11, 0.09), transparent 55%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{project.title}</h1>
            {project.cardMetrics && project.cardMetrics.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-xs text-white/75">
                {project.cardMetrics.slice(0, 2).map((metric) => (
                  <span key={metric} className="rounded-md border border-white/20 bg-white/5 px-2 py-1">
                    {metric}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <Link
            href="/#projects"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            Назад
          </Link>
        </div>

        {detailsIntro.trim().length > 0 ? (
          <Card className="border border-white/10 bg-white/5 text-white shadow-lg">
            <CardContent className="px-5 py-4 text-white/85 md:text-[15px]">{detailsIntro}</CardContent>
          </Card>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-2">
          <Card className="border border-white/10 bg-white/5 text-white shadow-lg">
            <CardHeader className="px-5 pb-0 pt-4">
              <CardTitle className="text-2xl">Что я тестировал</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-3">
              <ul className="list-disc space-y-3 pl-5 text-white/85 marker:text-white/60">
                {testedItems.map((item) => (
                  <li key={item} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {bugsItems.length > 0 ? (
            <Card className="border border-white/10 bg-white/5 text-white shadow-lg">
              <CardHeader className="px-5 pb-0 pt-4">
                <CardTitle className="text-2xl">Какие значимые проблемы находил</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-3">
                <ul className="list-disc space-y-3 pl-5 text-white/85 marker:text-white/60">
                  {bugsItems.map((item) => (
                    <li key={item} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

          {contributionItems.length > 0 ? (
            <Card className="border border-white/10 bg-white/5 text-white shadow-lg lg:col-span-2">
              <CardHeader className="px-5 pb-0 pt-4">
                <CardTitle className="text-2xl">Мой вклад</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-3">
                <ul className="list-disc space-y-3 pl-5 text-white/85 marker:text-white/60">
                  {contributionItems.map((item) => (
                    <li key={item} className="leading-relaxed">{item}</li>
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
