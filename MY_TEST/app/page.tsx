import { LinkPreviewDemoSecond } from "../components/ui/link-preview-demo-second";
import RealtimeSinceCounter from '@/components/ui/realtime-since-counter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SterlingGateKineticNavigationDemo from '../components/ui/sterling-gate-kinetic-navigation-demo';

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 relative" style={{ backgroundColor: '#151922' }}>
      {/* Deep overlay to achieve the darker backdrop (#0f121a) while keeping the base navy visible */}
      <div className="absolute inset-0" style={{ backgroundColor: '#0f121a', opacity: 0.85 }} aria-hidden="true" />
      <div className="mx-auto max-w-5xl space-y-14 relative z-10">
        {/* Hero / Intro with premium typographic hierarchy */}
        <section id="intro" className="space-y-4 text-center">
            <h1
            className="mx-auto text-6xl sm:text-7xl font-extrabold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500"
            aria-label="THE NEXT LEVEL"
          >
            THE NEXT LEVEL
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
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

        {/* Navigation showcase */}
        <div className="-mt-2">
          <SterlingGateKineticNavigationDemo />
        </div>

        {/* Project sections (preserve IDs and names; render as refined glass cards) */}
        <section id="project-files" className="pt-6 pb-8">
          <Card className="mx-auto bg-white/6 border border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="px-4 py-3 border-b border-white/10">
              <CardTitle className="text-2xl text-neutral-100">ScanWow</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 text-neutral-200">
              <p>Gallery, media and assets for the landing project.</p>
            </CardContent>
          </Card>
        </section>
        <section id="project-admin" className="pt-6 pb-8">
          <Card className="mx-auto bg-white/6 border border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="px-4 py-3 border-b border-white/10">
              <CardTitle className="text-2xl text-neutral-100">LinX</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 text-neutral-200">
              <p>Administrative interfaces and workflows described here.</p>
            </CardContent>
          </Card>
        </section>
        <section id="project-docker" className="pt-6 pb-8">
          <Card className="mx-auto bg-white/6 border border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="px-4 py-3 border-b border-white/10">
              <CardTitle className="text-2xl text-neutral-100">Юркас</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 text-neutral-200">
              <ul className="list-disc pl-5">
                <li>Тестировал доработки SSO: проверял эндпоинт (username, e-mail, телефон) и права доступа роли пользователя.</li>
              </ul>
            </CardContent>
          </Card>
        </section>
        <section id="project-team" className="pt-6 pb-8">
          <Card className="mx-auto bg-white/6 border border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="px-4 py-3 border-b border-white/10">
              <CardTitle className="text-2xl text-neutral-100">Binary Options</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 text-neutral-200">
              <p>Collaborative notes and feedback.</p>
            </CardContent>
          </Card>
        </section>
        <section id="project-b2box" className="pt-6 pb-8">
          <Card className="mx-auto bg-white/6 border border-white/10 rounded-2xl shadow-xl">
            <CardHeader className="px-4 py-3 border-b border-white/10">
              <CardTitle className="text-2xl text-neutral-100">B2Box</CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-3 text-neutral-200">
              <ul className="list-disc pl-5">
                <li>Протестировал задачи в сжатые сроки</li>
                <li>Протестировал интеграцию почты: массовые рассылки и механизм приглашений по временным токенам</li>
                <li>После окончания тестирования написал документацию для заказчика</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Secondary demo section preserved */}
        <section className="pt-8">
          <LinkPreviewDemoSecond />
        </section>

        {/* Feature highlights as glass cards (refined visuals) */}
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
