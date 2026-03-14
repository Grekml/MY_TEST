import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(240,240,240,1),_rgba(255,255,255,0))] px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Галерея файлов
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Удобный дом для ваших загрузок
          </h1>
          <p className="max-w-2xl text-base text-neutral-600">
            Просматривайте галерею файлов и управляйте загрузками в защищенной
            админке. Проект построен на Next.js, shadcn/ui и SQLite.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/gallery">Открыть галерею</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/login">Вход в админку</Link>
            </Button>
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
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
