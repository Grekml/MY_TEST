import Link from "next/link";
import RealtimeSinceCounter from "@/components/ui/realtime-since-counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <div className="pt-6 text-center">
            <Link
              href="/projects"
              className="inline-flex min-w-[170px] items-center justify-center rounded-full border border-yellow-300/90 bg-white/15 px-8 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-white/25"
            >
              Projects
            </Link>
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
