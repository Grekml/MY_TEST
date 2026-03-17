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
              className="relative flex h-[236px] flex-col gap-1 border border-white/10 bg-white/5 py-2 text-white shadow-lg"
            >
              <CardHeader className="px-4 py-1.5">
                <CardTitle className="text-xl">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-10 pt-1">
                {project.cardMetrics && project.cardMetrics.length > 0 ? (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {project.cardMetrics.slice(0, 2).map((metric) => (
                      <span
                        key={metric}
                        className="rounded-md border border-white/35 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p
                  className={
                    project.cardMetrics && project.cardMetrics.length > 0
                      ? "text-sm text-white/80 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]"
                      : "text-sm text-white/80 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:5] [-webkit-box-orient:vertical]"
                  }
                >
                  {project.short}
                </p>
              </CardContent>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center rounded-full border border-amber-400/70 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20"
                >
                  Открыть проект
                </Link>
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
