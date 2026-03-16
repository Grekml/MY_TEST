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

        <Card className="border border-white/10 bg-white/5 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Описание проекта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/85">{project.short}</p>
            <p className="text-white/85">В ходе тестирования находил такие значимые баги, как:</p>
            <ul className="list-disc space-y-2 pl-5 text-white/85">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
