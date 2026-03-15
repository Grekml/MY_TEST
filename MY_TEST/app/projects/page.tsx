import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECTS } from "@/lib/project-content";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#0f121a] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
          >
            Назад
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <Card
              key={project.slug}
              className="border border-white/10 bg-white/5 text-white shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-white/80">{project.short}</p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center rounded-full border border-amber-400/70 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20"
                >
                  Открыть проект
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
