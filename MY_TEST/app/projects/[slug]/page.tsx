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

  return (
    <main className="min-h-screen bg-[#0f121a] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <Link
            href="/projects"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            Назад
          </Link>
        </div>

        <Card className="gap-2 border border-white/10 bg-white/5 text-white shadow-lg">
          <CardHeader className="pb-0">
            <CardTitle className="text-2xl">Что я тестировал</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {detailsIntro.trim().length > 0 ? (
              <p className="text-white/85">{detailsIntro}</p>
            ) : null}
            {project.tested && project.tested.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-white/85">
                {project.tested.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-white/85">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {project.bugs && project.bugs.length > 0 ? (
              <>
                <h2 className="pt-2 text-2xl font-semibold text-white">Какие значимые проблемы находил</h2>
                <ul className="list-disc space-y-2 pl-5 text-white/85">
                  {project.bugs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {project.contribution && project.contribution.length > 0 ? (
              <>
                <h2 className="pt-2 text-2xl font-semibold text-white">Мой вклад</h2>
                <ul className="list-disc space-y-2 pl-5 text-white/85">
                  {project.contribution.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
