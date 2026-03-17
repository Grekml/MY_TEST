import Link from "next/link";
import RealtimeSinceCounter from "@/components/ui/realtime-since-counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECTS } from "@/lib/project-content";

export default function Home() {
  return (
    <main
      className="relative min-h-screen px-6 py-16"
      style={{ backgroundColor: "#151922" }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#0f121a", opacity: 0.85 }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-5xl space-y-14 relative z-10">
        <section id="intro" className="space-y-4 text-center">
          <h1
            className="mx-auto text-6xl sm:text-7xl font-extrabold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500"
            aria-label="THE NEXT LEVEL"
          >
            THE NEXT LEVEL
          </h1>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <RealtimeSinceCounter />
          </div>
        </section>

        <section id="tools-process" className="pt-6 pb-8">
          <Card className="mx-auto bg-white/6 border border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="px-4 py-3 border-b border-white/10">
              <CardTitle className="text-2xl text-neutral-100">Инструменты и процесс</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 text-neutral-200">
              <ul className="list-disc pl-5 space-y-2">
                <li>В <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Postman</strong> проверяю API-эндпоинты, валидирую ответы и фиксирую отклонения для доработки; использую переменные, формирую коллекции, запускаю <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Collection Runner</strong> и пишу скрипты.</li>
                <li>Использую <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Swagger</strong> для валидации API: сверяю эндпоинты, обязательные поля, схемы и форматы ответов.</li>
                <li>В <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">DevTools</strong> использую <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Elements</strong>, <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Console</strong>, <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Network</strong>, <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Application</strong> и <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Sources</strong>; дополнительно применяю <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Device Toolbar</strong> (<em>адаптив</em>), <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Throttling</strong>, <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Override</strong> и <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Copy as cURL</strong> для проверки сценариев и воспроизводимости.</li>
                <li>Контролирую точность верстки: сравниваю UI с макетами в <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Figma</strong> с помощью <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">PerfectPixel</strong>.</li>
                <li>По мобильным задачам использую <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Console</strong> и логи устройства: анализирую ошибки, воспроизводимость и причины нестабильного поведения.</li>
                <li>В <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Android Studio</strong> использую эмуляторы для проверки мобильных сценариев, логов приложения и поведения интерфейса на разных устройствах.</li>
                <li>В <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">RabbitMQ</strong> отслеживаю прохождение сообщений по очередям для ключевых бизнес‑событий (создание/обновление, пересчеты), при необходимости вручную публикую сообщение.</li>
                <li>В <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">GitLab</strong> проверяю, что задача влита, просматриваю изменения в коде, сверяю с требованиями и при необходимости анализирую <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">CI/CD</strong>.</li>
                <li>В <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Portainer</strong> смотрю контейнер нужного сервиса и анализирую логи. Знаю, как выполнить stop/start/restart.</li>
                <li>При необходимости в <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Charles</strong> могу проанализировать HTTP-трафик, проверить запросы/ответы и воспроизводимость сетевых проблем.</li>
                <li>Сокращаю рутинные операции с помощью AI-агентов: использую локальные автотесты и <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Cursor</strong>.</li>
                <li>Использую <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Perplexity</strong> на ПК и телефоне в едином пространстве для проработки идей тестирования и уточнения тестовых сценариев в любое время.</li>
                <li>В <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Photoshop</strong> подготавливаю изображения для тестирования: меняю формат, разрешение и размер файла, выполняю crop под целевые сценарии отображения.</li>
                <li>В свободное время практикую <strong className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">vibe coding</strong>.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section
          id="projects"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 space-y-4"
        >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-100">Мои проекты</h2>
              <p className="text-sm text-white/70">Ключевые проекты и мой QA-вклад</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
            {PROJECTS.map((project) => (
              <Card
                key={project.slug}
                className="relative flex h-[236px] flex-col gap-1 border border-white/10 bg-white/5 py-2 text-white shadow-lg transition hover:border-amber-400/60"
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
                        ? "text-sm leading-relaxed text-white/80 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]"
                        : "text-sm leading-relaxed text-white/80 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:5] [-webkit-box-orient:vertical]"
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
            </div>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Разные типы файлов",
              text: "Изображения, PDF и архивы в одной галерее с метаданными.",
            },
            {
              title: "Быстрая админка",
              text: "Мультизагрузка и скрытие/восстановление в один клик.",
            },
            {
              title: "Docker-first",
              text: "Локальный запуск с надежным хранением в volume.",
            },
          ].map((item) => (
            <Card key={item.title} className="bg-white/6 border border-white/10 rounded-xl shadow-xl">
              <CardHeader className="px-4 py-3 border-b border-white/10">
                <CardTitle className="text-lg text-neutral-100">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-3 text-neutral-200">
                <p className="text-sm">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
